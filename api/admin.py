from django.contrib import admin
from .models import (
    Address,
    Warehouse,
    Product,
    Stock,
    Order,
    Demand,
    Delivery
)

"""
Inlines ułatwiają edycję powiązanych obiektów w jednym widoku.
Np. 'StockInline' pozwala edytować stany magazynowe bezpośrednio w
Widoku Product lub Warehouse (zależnie od kontekstu).
"""

class StockInline(admin.TabularInline):
    model = Stock
    extra = 1  # Domyślnie pokazuj jedno puste pole do wypełnienia
    # fields = ["quantity"]  # Możesz ograniczyć pola, jeśli chcesz


"""
Możesz wybrać, czy inlina ma być w WarehouseAdmin,
czy w ProductAdmin, w zależności od tego, który kontekst jest ważniejszy.
Możesz użyć inlinów w obu miejscach, ale musisz zdefiniować je dwa razy 
(z innym model=).
"""


@admin.register(Address)
class AddressAdmin(admin.ModelAdmin):
    list_display = ["street", "city", "country", "postal_code"]
    search_fields = ["street", "city", "postal_code"]


@admin.register(Warehouse)
class WarehouseAdmin(admin.ModelAdmin):
    list_display = ["name", "note"]
    search_fields = ["name"]
    inlines = [StockInline]  # Edycja stanów magazynowych w widoku magazynu


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ["name", "type", "note"]
    search_fields = ["name", "type"]


@admin.register(Stock)
class StockAdmin(admin.ModelAdmin):
    list_display = ["product", "warehouse", "quantity"]
    search_fields = ["product__name", "warehouse__name"]


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ["product", "quantity", "order_deadline", "status"]
    list_filter = ["status", "order_deadline"]
    search_fields = ["product__name"]
    date_hierarchy = "order_date"


@admin.register(Demand)
class DemandAdmin(admin.ModelAdmin):
    list_display = ["product", "warehouse", "quantity", "due_date"]
    search_fields = ["product__name", "warehouse__name"]
    date_hierarchy = "demand_date"


@admin.register(Delivery)
class DeliveryAdmin(admin.ModelAdmin):
    list_display = [
        "delivery_type",
        "delivery_date",
        "delivered_quantity",
        "source_warehouse",
        "destination_warehouse",
        "order",
        "demand",
    ]
    list_filter = ["delivery_type", "delivery_date"]
    search_fields = ["delivered_quantity", "order__product__name", "demand__product__name"]
