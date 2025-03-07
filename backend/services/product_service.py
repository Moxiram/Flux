from django.shortcuts import get_object_or_404
from api.models import Product, Warehouse

class ProductService:
    @staticmethod
    def create_product(name, quantity, warehouse_id=None):
        """ Tworzy nowy produkt (bez statusu) """
        warehouse = Warehouse.objects.get(id=warehouse_id) if warehouse_id else None
        return Product.objects.create(name=name, quantity=quantity, warehouse=warehouse)

    @staticmethod
    def get_product(product_id):
        return get_object_or_404(Product, id=product_id)

    @staticmethod
    def update_product(product_id, name=None, quantity=None, warehouse_id=None):
        """ Aktualizuje produkt (nazwa, ilość, magazyn) """
        product = get_object_or_404(Product, id=product_id)
        if name:
            product.name = name
        if quantity:
            product.quantity = quantity
        if warehouse_id is not None:
            product.warehouse = Warehouse.objects.get(id=warehouse_id) if warehouse_id else None
        product.save()
        return product

    @staticmethod
    def delete_product(product_id):
        product = get_object_or_404(Product, id=product_id)
        product.delete()
        return True
