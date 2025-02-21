from django.db import models

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
    STATUS_CHOICES = [
        ('to_produce', 'Do produkcji'),
        ('ready', 'Gotowy do wysyłki'),
        ('shipped', 'Wysłany'),
    ]

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
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='to_produce')
    note = models.TextField(blank=True, null=True)  # Opcjonalne notatki dotyczące produktu

    def __str__(self):
        return f"{self.name} ({self.quantity}) - {self.get_status_display()}"


class Order(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name="orders")  # Powiązanie z produktem
    quantity = models.CharField(max_length=50)  # Ilość (np. "10kg", "20 litrów")
    order_date = models.DateTimeField(auto_now_add=True)  # Data utworzenia zamówienia
    order_deadline = models.DateField()  # Termin wysyłki

    def is_overdue(self):
        """Sprawdza, czy zamówienie jest przeterminowane."""
        from django.utils.timezone import now
        return self.order_deadline < now().date()

    def __str__(self):
        status = "✅ W terminie" if not self.is_overdue() else "❌ Przeterminowane"
        return f"Zamówienie na {self.product.name} ({self.quantity}) - Termin: {self.order_deadline} - {status}"