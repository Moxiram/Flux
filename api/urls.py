from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProductViewSet, WarehouseViewSet, OrderViewSet

#router dla API
router = DefaultRouter()
router.register(r'products', ProductViewSet)  # Obsługa endpointu /api/products/
router.register(r'warehouses', WarehouseViewSet)  # Obsługa /api/warehouses/
router.register(r'orders', OrderViewSet)  # Obsługa /api/orders/

urlpatterns = [
    path('', include(router.urls)),  # Mapowanie adresu /api/
]
