from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

# Import ViewSetów
from .views import (
    AddressViewSet,
    WarehouseViewSet,
    ProductViewSet,
    StockViewSet,
    OrderViewSet,
    DemandViewSet,
    DeliveryViewSet
)

# Tworzymy router
router = DefaultRouter()
router.register(r'addresses', AddressViewSet, basename='address')
router.register(r'warehouses', WarehouseViewSet, basename='warehouse')
router.register(r'products', ProductViewSet, basename='product')
router.register(r'stocks', StockViewSet, basename='stock')
router.register(r'orders', OrderViewSet, basename='order')
router.register(r'demands', DemandViewSet, basename='demand')
router.register(r'deliveries', DeliveryViewSet, basename='delivery')

urlpatterns = [
    # Ścieżki zdefiniowane przez router
    path('', include(router.urls)),
    
    # Endpointy tokenów (Simple JWT)
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]