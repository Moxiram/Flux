from rest_framework import viewsets
from .models import (
    Address, 
    Warehouse, 
    Product, 
    Stock, 
    Order, 
    Demand, 
    Delivery
)
from .serializers import (
    AddressSerializer,
    WarehouseSerializer,
    ProductSerializer,
    StockSerializer,
    OrderSerializer,
    DemandSerializer,
    DeliverySerializer
)

from django.contrib.auth import get_user_model

CustomUser = get_user_model()


"""ViewSety zapewniają CRUDA dla danej tabeli"""
class AddressViewSet(viewsets.ModelViewSet):
    
    queryset = Address.objects.all()
    serializer_class = AddressSerializer


class WarehouseViewSet(viewsets.ModelViewSet):
    
    queryset = Warehouse.objects.all()
    serializer_class = WarehouseSerializer


class ProductViewSet(viewsets.ModelViewSet):
    
    queryset = Product.objects.all()
    serializer_class = ProductSerializer


class StockViewSet(viewsets.ModelViewSet):
    
    queryset = Stock.objects.all()
    serializer_class = StockSerializer


class OrderViewSet(viewsets.ModelViewSet):
    
    queryset = Order.objects.all()
    serializer_class = OrderSerializer


class DemandViewSet(viewsets.ModelViewSet):
    
    queryset = Demand.objects.all()
    serializer_class = DemandSerializer


class DeliveryViewSet(viewsets.ModelViewSet):
    
    queryset = Delivery.objects.all()
    serializer_class = DeliverySerializer