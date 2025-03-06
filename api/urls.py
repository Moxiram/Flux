from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProductViewSet, WarehouseViewSet, OrderViewSet, RegisterViewSet, UserViewSet
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView


#router dla API
router = DefaultRouter()
router.register(r'products', ProductViewSet)  # Obsługa endpointu /api/products/
router.register(r'warehouses', WarehouseViewSet)  # Obsługa /api/warehouses/
router.register(r'orders', OrderViewSet)  # Obsługa /api/orders/
router.register(r'register', RegisterViewSet)
router.register(r'users', UserViewSet)

urlpatterns = [
    path('', include(router.urls)),  # Mapowanie adresu /api/ 
    # Endpointy tokenów (Simple JWT)
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]
