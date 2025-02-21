from django.shortcuts import get_object_or_404
from api.models import Warehouse

class WarehouseService:
    @staticmethod
    def create_warehouse(name, location, note=""):
        return Warehouse.objects.create(name=name, location=location, note=note)

    @staticmethod
    def get_warehouse(warehouse_id):
        return get_object_or_404(Warehouse, id=warehouse_id)

    @staticmethod
    def update_warehouse(warehouse_id, name=None, location=None, note=None):
        warehouse = get_object_or_404(Warehouse, id=warehouse_id)
        if name:
            warehouse.name = name
        if location:
            warehouse.location = location
        if note is not None:
            warehouse.note = note
        warehouse.save()
        return warehouse

    @staticmethod
    def delete_warehouse(warehouse_id):
        warehouse = get_object_or_404(Warehouse, id=warehouse_id)
        warehouse.delete()
        return True
