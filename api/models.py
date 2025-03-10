from django.db import models
from django.contrib.auth.models import AbstractUser
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType
from django.utils.timezone import now

# Create your models here.
class Item(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField()

    def __str__(self):
        return self.name


class Warehouse(models.Model):
    name = models.CharField(max_length=255, unique=True)  # Nazwa magazynu
    location = models.CharField(max_length=255)  # Lokalizacja magazynu
    note = models.TextField(blank=True, null=True)  # Notatki (opcjonalnie)

    def __str__(self):
        return f"{self.name} - {self.location}"


class Product(models.Model):
    name = models.CharField(max_length=255)  # Nazwa produktu
    quantity = models.CharField(max_length=50)  # Ilość (np. "10kg", "12 litrów")
    type = models.CharField(max_length=100, blank=True, null=True)  # Typ produktu (opcjonalnie)
    warehouse = models.ForeignKey(
        Warehouse, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True, 
        related_name="products"
    )  # Magazyn (może być NULL)
    note = models.TextField(blank=True, null=True)  # Opcjonalne notatki dotyczące produktu

    def __str__(self):
        return f"{self.name} ({self.quantity})"


class Order(models.Model):
    STATUS_CHOICES = [
        ('to_produce', 'Do produkcji'),
        ('ready', 'Gotowy do wysyłki'),
        ('shipped', 'Wysłany'),
    ]

    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name="orders")  # Powiązanie z produktem
    quantity = models.CharField(max_length=50)  # Ilość (np. "10kg", "20 litrów")
    order_date = models.DateTimeField(auto_now_add=True)  # Data utworzenia zamówienia
    order_deadline = models.DateField()  # Termin wysyłki
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='to_produce')  # ✅ Przeniesione z `Product`
    note = models.TextField(blank=True, null=True)  # ✅ Nowe pole na notatki o zamówieniu

    def is_overdue(self):
        """Sprawdza, czy zamówienie jest przeterminowane."""
        return self.order_deadline < now().date()

    def __str__(self):
        status_label = dict(self.STATUS_CHOICES).get(self.status, "Nieznany status")
        overdue_status = "✅ W terminie" if not self.is_overdue() else "❌ Przeterminowane"
        return f"Zamówienie na {self.product.name} ({self.quantity}) - {status_label} - Termin: {self.order_deadline} - {overdue_status}"


class UserAddress(models.Model):
    phone = models.CharField(max_length=20, blank=True, null=True)
    email = models.EmailField(blank=True, null=True)

    def __str__(self):
        return f"{self.email} - {self.phone}"


class CustomUser(AbstractUser):
    
    ROLE_CHOICES = [
        ('admin', 'Admin'),
        ('office', 'Office'),
        ('production', 'Production'),
        ('transport', 'Transport')
    ]
    role = models.CharField(max_length=50, default='user', choices=ROLE_CHOICES)
    
    address = models.OneToOneField(
        UserAddress,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='user'
    )

    def __str__(self):
        return f"{self.first_name} {self.last_name} ({self.username})"
    
class Delivery(models.Model):
    DELIVERY_TYPE_CHOICES = [
        ('order', 'Dostawa zamówienia'),
        ('demand', 'Dostawa zapotrzebowania'),
    ]
    # Określa typ dostawy
    delivery_type = models.CharField(max_length=20, choices=DELIVERY_TYPE_CHOICES)
    
    # Pola wspólne dla obu typów dostaw
    delivery_date = models.DateField(auto_now_add=True)  # Data dostawy
    delivered_quantity = models.CharField(max_length=50)  # Ilość dostarczona (np. "10kg", "20 litrów")
    note = models.TextField(blank=True, null=True)        # Opcjonalne notatki
    
    # GenericForeignKey do powiązania z obiektem, którego dotyczy dostawa (np. Order lub Demand)
    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    object_id = models.PositiveIntegerField()
    target_object = GenericForeignKey('content_type', 'object_id')
    
    def __str__(self):
        return f"{self.get_delivery_type_display()} - {self.delivered_quantity} - {self.delivery_date}"   
    


class Demand(models.Model):
    product = models.ForeignKey(
        'Product',  # zakładając, że masz model Product w tym samym pliku lub zaimportowany
        on_delete=models.CASCADE,
        related_name="demands"
    )
    quantity = models.CharField(max_length=50)  # np. "10kg", "20 litrów"
    demand_date = models.DateTimeField(auto_now_add=True)  # Data zgłoszenia zapotrzebowania
    due_date = models.DateField()  # Termin, na kiedy zapotrzebowanie ma być spełnione    
    note = models.TextField(blank=True, null=True)  # Opcjonalne notatki dotyczące zapotrzebowania    
    def __str__(self):        
        return f"Demand for {self.product.name} ({self.quantity}) - Due: {self.due_date}"
