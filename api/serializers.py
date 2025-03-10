from rest_framework import serializers
from django.contrib.contenttypes.models import ContentType
from .models import Product, Warehouse, Order, UserAddress, Delivery, Demand
from django.contrib.auth import get_user_model

CustomUser = get_user_model()

class UserAddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserAddress
        fields = ['id', 'phone', 'email']

class CustomUserSerializer(serializers.ModelSerializer):
    # Wyświetlanie pełnych danych adresowych
    address = UserAddressSerializer(read_only=True)
    
    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'first_name', 'last_name', 'role', 'address']

# Serializer do rejestracji
class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})
    

    class Meta:
        model = CustomUser
        fields = ['username', 'first_name', 'last_name', 'password', 'role']

    def create(self, validated_data):
        user = CustomUser(**validated_data)
        user.set_password(validated_data['password'])
        user.save()
        return user


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
    product = ProductSerializer(read_only=True)  # Pobiera pełne dane produktu
    product_id = serializers.PrimaryKeyRelatedField(
        queryset=Product.objects.all(), source='product', write_only=True
    )  # Pozwala na zapis ID produktu
    order_deadline = serializers.DateField()  # To jest wymagane!

    class Meta:
        model = Order
        fields = ['id', 'product', 'product_id', 'quantity', 'order_date', 'order_deadline', 'status', 'note']

class DeliverySerializer(serializers.ModelSerializer):
    class Meta:
        model = Delivery
        fields = '__all__'

class DemandSerializer(serializers.ModelSerializer):
    class Meta:
        model = Demand
        fields = '__all__'     

