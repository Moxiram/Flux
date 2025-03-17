from rest_framework import serializers
from .models import (
    Address, 
    Warehouse, 
    Product, 
    Stock, 
    Order, 
    Demand, 
    Delivery
)

"""
Podstawowe serializery. 
'__all__' oznacza, że zawrzemy wszystkie pola danego modelu.
Możesz ograniczyć pola do listy, np. fields = ['id', 'name', ...], 
aby dopasować do potrzeb frontendu.
"""

class AddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = Address
        fields = '__all__'

class OrderSerializer(serializers.ModelSerializer):
    client_address = AddressSerializer(required=False)
    client_address_id = serializers.PrimaryKeyRelatedField(
        queryset=Address.objects.all(), source='client_address',
        write_only=True, allow_null=True
    )

    class Meta:
        model = Order
        fields = [
            'id', 'product', 'product_id', 'quantity', 'order_deadline',
            'status', 'note', 'warehouse', 'warehouse_id',
            'client_address', 'client_address_id'
        ]

    def create(self, validated_data):
        address_data = validated_data.pop('client_address', None)
        # If there's client_address_id, it's already set in validated_data['client_address']
        order = super().create(validated_data)
        if address_data:
            # Tworzymy / edytujemy adres
            addr = Address.objects.create(**address_data)
            order.client_address = addr
            order.save()
        return order

    def update(self, instance, validated_data):
        address_data = validated_data.pop('client_address', None)
        order = super().update(instance, validated_data)
        if address_data:
            # Edytujemy istniejący lub tworzymy nowy
            if order.client_address:
                for key, value in address_data.items():
                    setattr(order.client_address, key, value)
                order.client_address.save()
            else:
                new_addr = Address.objects.create(**address_data)
                order.client_address = new_addr
                order.save()
        return order

class WarehouseSerializer(serializers.ModelSerializer):
    # Wyświetlanie pełnych danych Address (zagnieżdżone)
    address = AddressSerializer(read_only=True)
    address_id = serializers.PrimaryKeyRelatedField(
        queryset=Address.objects.all(), 
        source='address', 
        write_only=True, 
        allow_null=True
    )

    class Meta:
        model = Warehouse
        fields = ['id', 'name', 'address', 'address_id', 'note']

    """
    Adres możesz tworzyć osobnym endpointem. 
    Jeśli chcesz tworzyć address inline, potrzebujesz custom create/update metod.
    """


class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = '__all__'


class StockSerializer(serializers.ModelSerializer):
    # Wyświetlanie nazwy produktu i magazynu w wersji odczytowej
    product = ProductSerializer(read_only=True)
    product_id = serializers.PrimaryKeyRelatedField(
        queryset=Product.objects.all(), 
        source='product',
        write_only=True
    )
    warehouse = WarehouseSerializer(read_only=True)
    warehouse_id = serializers.PrimaryKeyRelatedField(
        queryset=Warehouse.objects.all(), 
        source='warehouse', 
        write_only=True
    )

    class Meta:
        model = Stock
        fields = ['id', 'product', 'product_id', 'warehouse', 'warehouse_id', 'quantity']




class DemandSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)
    product_id = serializers.PrimaryKeyRelatedField(
        queryset=Product.objects.all(), 
        source='product', 
        write_only=True
    )
    warehouse = WarehouseSerializer(read_only=True)
    warehouse_id = serializers.PrimaryKeyRelatedField(
        queryset=Warehouse.objects.all(), 
        source='warehouse', 
        write_only=True
    )

    class Meta:
        model = Demand
        fields = [
            'id', 'product', 'product_id',
            'warehouse', 'warehouse_id',
            'quantity', 'demand_date', 'due_date', 'note'
        ]


class DeliverySerializer(serializers.ModelSerializer):
    # Dostawa – mamy typ (order/demand), 
    # plus powiązanie z order i demand lub None
    source_warehouse = WarehouseSerializer(read_only=True)
    source_warehouse_id = serializers.PrimaryKeyRelatedField(
        queryset=Warehouse.objects.all(), 
        source='source_warehouse', 
        write_only=True, 
        allow_null=True
    )
    destination_warehouse = WarehouseSerializer(read_only=True)
    destination_warehouse_id = serializers.PrimaryKeyRelatedField(
        queryset=Warehouse.objects.all(), 
        source='destination_warehouse', 
        write_only=True, 
        allow_null=True
    )

    order_id = serializers.PrimaryKeyRelatedField(
        queryset=Order.objects.all(), 
        source='order', 
        write_only=True, 
        allow_null=True
    )
    demand_id = serializers.PrimaryKeyRelatedField(
        queryset=Demand.objects.all(), 
        source='demand', 
        write_only=True, 
        allow_null=True
    )
    # Odczyt (tylko do podglądu):
    order = OrderSerializer(read_only=True)
    demand = DemandSerializer(read_only=True)

    class Meta:
        model = Delivery
        fields = [
            'id',
            'delivery_type', 
            'delivery_date', 
            'delivered_quantity', 
            'note',

            'source_warehouse', 'source_warehouse_id',
            'destination_warehouse', 'destination_warehouse_id',

            'order', 'order_id',
            'demand', 'demand_id'
        ]

    """
    W create/update w widoku możesz sprawdzać, czy 
    delivery_type == 'order' -> używamy order_id 
    delivery_type == 'demand' -> używamy demand_id 
    by uniknąć konfliktów (order & demand = null).
    """
