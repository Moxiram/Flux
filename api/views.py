from rest_framework import viewsets
from .models import Product, Warehouse, Order
from .serializers import ProductSerializer, WarehouseSerializer, OrderSerializer, RegisterSerializer, CustomUserSerializer
from rest_framework import generics
from django.contrib.auth import get_user_model

CustomUser = get_user_model()

# Widok rejestracji użytkownika
class RegisterViewSet(generics.CreateAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = RegisterSerializer

# Widok listowania użytkowników 
class UserViewSet(generics.ListAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = CustomUserSerializer


class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer

class WarehouseViewSet(viewsets.ModelViewSet):
    queryset = Warehouse.objects.all()
    serializer_class = WarehouseSerializer

class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer