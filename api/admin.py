from django.contrib import admin
from .models import Item, Product, Warehouse, Order

# Register your models here.

admin.site.register(Item)
admin.site.register(Product)
admin.site.register(Warehouse)
admin.site.register(Order)

