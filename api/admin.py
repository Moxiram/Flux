from django.contrib import admin
from .models import Item, Product, Warehouse, Order, Delivery, Demand

# Register your models here.

admin.site.register(Item)
admin.site.register(Product)
admin.site.register(Warehouse)
admin.site.register(Order)
admin.site.register(Delivery)
admin.site.register(Demand)

