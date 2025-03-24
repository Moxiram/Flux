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



class WarehouseSerializer(serializers.ModelSerializer):
    address = AddressSerializer(required=False)
    address_id = serializers.PrimaryKeyRelatedField(
        queryset=Address.objects.all(), source='address',
        write_only=True, required=False, allow_null=True
    )

    class Meta:
        model = Warehouse
        fields = ['id', 'name', 'note', 'address', 'address_id']

    def create(self, validated_data):
        """
        Tworzenie magazynu + ewentualne tworzenie/aktualizacja adresu
        """
        address_data = validated_data.pop('address', None)  # dane zagnieżdżonego address
        warehouse = Warehouse.objects.create(**validated_data)

        if address_data:
            # Użytkownik wysłał: address: {street, city, ...}
            # Tworzymy nowy address
            addr = Address.objects.create(**address_data)
            warehouse.address = addr
            warehouse.save()

        return warehouse

    def update(self, instance, validated_data):
        address_data = validated_data.pop('address', None)

        instance.name = validated_data.get('name', instance.name)
        instance.note = validated_data.get('note', instance.note)
        instance.save()

        if address_data:
            # Edytujemy (lub tworzymy) address
            if instance.address:
                # Modyfikujemy istniejący address
                for key, value in address_data.items():
                    setattr(instance.address, key, value)
                instance.address.save()
            else:
                # Nie było address, tworzymy nowy
                addr = Address.objects.create(**address_data)
                instance.address = addr
                instance.save()
        return instance


class StockSerializer(serializers.ModelSerializer):
    warehouse_id = serializers.PrimaryKeyRelatedField(
        queryset=Warehouse.objects.all(),
        source='warehouse',
        write_only=True
    )
    warehouse = WarehouseSerializer(read_only=True)

    class Meta:
        model = Stock
        fields = ['id', 'warehouse', 'warehouse_id', 'quantity']

class ProductSerializer(serializers.ModelSerializer):
    stock = StockSerializer(required=False)

    class Meta:
        model = Product
        fields = ['id', 'name', 'type', 'note', 'stock']

    def create(self, validated_data):
        stock_data = validated_data.pop('stock', None)
        product = Product.objects.create(**validated_data)
        if stock_data:
            # Tworzymy stock (z linkiem do product)
            stock_data['product'] = product
            Stock.objects.create(**stock_data)
        return product

    def update(self, instance, validated_data):
        stock_data = validated_data.pop('stock', None)
        instance.name = validated_data.get('name', instance.name)
        instance.type = validated_data.get('type', instance.type)
        instance.note = validated_data.get('note', instance.note)
        instance.save()

        if stock_data:
            # Edytujemy lub tworzymy Stock
            
            if hasattr(instance, 'stock_set') and instance.stock_set.exists():
                # Zakładamy, że jest tylko jeden stock
                st = instance.stock_set.first()
                st.warehouse = stock_data.get('warehouse', st.warehouse)
                st.quantity = stock_data.get('quantity', st.quantity)
                st.save()
            else:
                # Nie było stanu, tworzymy
                stock_data['product'] = instance
                Stock.objects.create(**stock_data)
        return instance

class OrderSerializer(serializers.ModelSerializer):
    product = ProductSerializer(required=False)
    product_id = serializers.PrimaryKeyRelatedField(
        queryset=Product.objects.all(),
        source='product',
        write_only=True,
        required=False,
        allow_null=True
    )

    client_address = AddressSerializer(required=False)
    client_address_id = serializers.PrimaryKeyRelatedField(
        queryset=Address.objects.all(),
        source='client_address',
        write_only=True,
        required=False,
        allow_null=True
    )

    warehouse_id = serializers.PrimaryKeyRelatedField(
        queryset=Warehouse.objects.all(),
        source='warehouse',
        write_only=True,
        required=False,
        allow_null=True
    )
    warehouse = WarehouseSerializer(read_only=True)

    class Meta:
        model = Order
        fields = [
            'id',
            'product', 'product_id',
            'quantity',
            'warehouse', 'warehouse_id',
            'client_address', 'client_address_id',
            'order_date', 'order_deadline',
            'status', 'note'
        ]

    def create(self, validated_data):
        """Tworzenie nowego zamówienia z obsługą inline i/lub id."""
        product_data = validated_data.pop('product', None)
        address_data = validated_data.pop('client_address', None)

        # 1. Sprawdzamy, czy DRF przekazał nam instancję Product
        #    (user podał product_id) czy słownik (inline).
        from .models import Product, Address
        if isinstance(product_data, Product):
            # Ustawiamy instancję w validated_data, żeby Order.objects.create mogło z niej skorzystać.
            validated_data['product'] = product_data
            product_data = None  # To nie jest słownik do tworzenia
        if isinstance(address_data, Address):
            validated_data['client_address'] = address_data
            address_data = None

        # 2. Tworzymy obiekt Order
        order = Order.objects.create(**validated_data)

        # 3. Jeśli user chciał inline product (słownik)
        if product_data and isinstance(product_data, dict):
            new_prod = Product.objects.create(**product_data)
            order.product = new_prod
            order.save()

        # 4. Jeśli user chciał inline address (słownik)
        if address_data and isinstance(address_data, dict):
            new_addr = Address.objects.create(**address_data)
            order.client_address = new_addr
            order.save()

        return order

    def update(self, instance, validated_data):
        """Edycja zamówienia: obsługa inline / id dla product i address."""
        product_data = validated_data.pop('product', None)
        address_data = validated_data.pop('client_address', None)

        from .models import Product, Address

        # Rozróżniamy instancję od słownika
        if isinstance(product_data, Product):
            validated_data['product'] = product_data
            product_data = None
        if isinstance(address_data, Address):
            validated_data['client_address'] = address_data
            address_data = None

        # Aktualizujemy podstawowe pola
        instance.quantity = validated_data.get('quantity', instance.quantity)
        instance.order_deadline = validated_data.get('order_deadline', instance.order_deadline)
        instance.status = validated_data.get('status', instance.status)
        instance.note = validated_data.get('note', instance.note)

        if 'warehouse' in validated_data:
            instance.warehouse = validated_data['warehouse']

        instance.save()

        # Obsługa inline product
        if product_data and isinstance(product_data, dict):
            if instance.product:
                for key, value in product_data.items():
                    setattr(instance.product, key, value)
                instance.product.save()
            else:
                new_p = Product.objects.create(**product_data)
                instance.product = new_p
                instance.save()

        # Obsługa inline address
        if address_data and isinstance(address_data, dict):
            if instance.client_address:
                for key, value in address_data.items():
                    setattr(instance.client_address, key, value)
                instance.client_address.save()
            else:
                new_addr = Address.objects.create(**address_data)
                instance.client_address = new_addr
                instance.save()

        return instance



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
    delivery_type = serializers.CharField()
    order_id = serializers.PrimaryKeyRelatedField(
        queryset=Order.objects.all(),
        source='order',
        write_only=True,
        required=False,  # user poda, jeśli delivery_type=order
        allow_null=True
    )
    demand_id = serializers.PrimaryKeyRelatedField(
        queryset=Demand.objects.all(),
        source='demand',
        write_only=True,
        required=False,  # user poda, jeśli delivery_type=demand
        allow_null=True
    )

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

    def validate(self, data):
        dtype = data.get('delivery_type')
        order = data.get('order')
        demand = data.get('demand')

        if dtype == 'order' and not order:
            raise serializers.ValidationError("delivery_type='order' wymaga podania order_id.")
        if dtype == 'demand' and not demand:
            raise serializers.ValidationError("delivery_type='demand' wymaga podania demand_id.")
        return data
