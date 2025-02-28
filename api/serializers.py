from rest_framework import serializers
from .models import Product, Warehouse, Order

class WarehouseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Warehouse
        fields = '__all__'

class ProductSerializer(serializers.ModelSerializer):
    warehouse = WarehouseSerializer(read_only=True)  # Pobiera pełne dane magazynu
    warehouse_id = serializers.PrimaryKeyRelatedField(
        queryset=Warehouse.objects.all(), source='warehouse', write_only=True, allow_null=True
    )  # Pozwala na zapis tylko ID magazynu

    class Meta:
        model = Product
        fields = ['id', 'name', 'quantity', 'type', 'warehouse', 'warehouse_id', 'note']

class OrderSerializer(serializers.ModelSerializer):
    product_id = serializers.PrimaryKeyRelatedField(
        queryset=Product.objects.all(), source='product', write_only=True
    )

    class Meta:
        model = Order
        fields = ['id', 'product', 'product_id', 'quantity', 'order_date', 'order_deadline', 'status', 'note']
