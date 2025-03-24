from django.db import models
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType
from django.utils.timezone import now
from django.utils import timezone


class Address(models.Model):
    street = models.CharField(max_length=255)
    city = models.CharField(max_length=100)
    country = models.CharField(max_length=100)
    postal_code = models.CharField(max_length=20)
    note = models.TextField(blank=True, null=True)  # Opcjonalne notatki, np. kod do bramy

    def __str__(self):
        return f"{self.street}, {self.city}, {self.country}"
    
class Warehouse(models.Model):
    name = models.CharField(max_length=255, unique=True)
    address = models.OneToOneField(Address, on_delete=models.CASCADE, null=True, blank=True)
    note = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"{self.name} - {self.address}"
    
class Product(models.Model):
    name = models.CharField(max_length=255)
    type = models.CharField(max_length=100, blank=True, null=True)  # np. surowiec, wyrób gotowy
    note = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"{self.name}"
    
class Stock(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name="stocks")
    warehouse = models.ForeignKey(Warehouse, on_delete=models.CASCADE, related_name="stocks")
    quantity = models.CharField(max_length=50, default="0")  # np. "100kg", "50 szt"

    class Meta:
        unique_together = ('product', 'warehouse')  # Jednoznaczny rekord na (produkt, magazyn)

    def __str__(self):
        return f"{self.product.name} w {self.warehouse.name} - {self.quantity}"
    
class Order(models.Model):
    STATUS_CHOICES = [
        ('to_produce', 'Do produkcji'),
        ('ready', 'Gotowy do wysyłki'),
        ('shipped', 'Wysłany'),
    ]
    product = models.ForeignKey(
        Product, 
        on_delete=models.CASCADE, 
        related_name="orders"
        # null=False i blank=False domyślnie, wymaga product
    )
    quantity = models.CharField(max_length=50)  
    warehouse = models.ForeignKey(
        Warehouse, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True, 
        related_name="orders"
    )
    client_address = models.ForeignKey(
        Address, 
        on_delete=models.CASCADE,
        related_name="orders"
        # null=False i blank=False domyślnie, wymaga address
    )
    order_date = models.DateTimeField(auto_now_add=True)
    order_deadline = models.DateField(blank=True, null=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='to_produce')
    note = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"Zamówienie {self.id} → {self.product.name} ({self.quantity})"
    
class Demand(models.Model):
    product = models.ForeignKey(
        Product, 
        on_delete=models.CASCADE,
        related_name="demands"
    )
    warehouse = models.ForeignKey(
        Warehouse,
        on_delete=models.CASCADE,
        related_name="demands",
        default=1
    )
    quantity = models.CharField(max_length=50)
    demand_date = models.DateTimeField(auto_now_add=True)
    due_date = models.DateField(blank=True, null=True)
    note = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"Zapotrzebowanie: {self.product.name} -> {self.warehouse.name}"
    
class Delivery(models.Model):
    DELIVERY_TYPE_CHOICES = [
        ('order', 'Dostawa zamówienia'),
        ('demand', 'Dostawa zapotrzebowania'),
    ]
    delivery_type = models.CharField(max_length=20, choices=DELIVERY_TYPE_CHOICES)
    delivery_date = models.DateField(auto_now_add=True)
    delivered_quantity = models.CharField(max_length=50)
    note = models.TextField(blank=True, null=True)

    source_warehouse = models.ForeignKey(
        Warehouse, 
        on_delete=models.SET_NULL, 
        related_name="outgoing_deliveries", 
        null=True, 
        blank=True
    )
    destination_warehouse = models.ForeignKey(
        Warehouse, 
        on_delete=models.SET_NULL, 
        related_name="incoming_deliveries", 
        null=True, 
        blank=True
    )
    order = models.ForeignKey(
        'Order', 
        on_delete=models.CASCADE,  # np. usuwając zamówienie, usuwamy też dostawy
        null=True, blank=True
    )
    demand = models.ForeignKey(
        'Demand', 
        on_delete=models.CASCADE,
        null=True, blank=True
    )

    def __str__(self):
        return f"Dostawa {self.id} ({self.delivery_type})"