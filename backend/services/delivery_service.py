from django.shortcuts import get_object_or_404
from django.contrib.contenttypes.models import ContentType
from api.models import Delivery, Demand, Product  # Upewnij się, że modele są poprawnie importowane

class DeliveryService:
    @staticmethod
    def create_delivery(delivery_type, delivered_quantity, note, target_object):
        """
        Tworzy nową dostawę.
        
        :param delivery_type: Typ dostawy ('order' lub 'demand')
        :param delivered_quantity: Ilość dostarczona (np. "10kg", "20 litrów")
        :param note: Opcjonalne notatki dotyczące dostawy
        :param target_object: Obiekt, do którego dotyczy dostawa (np. instancja Order lub Demand)
        :return: Utworzona instancja Delivery
        """
        content_type = ContentType.objects.get_for_model(target_object)
        return Delivery.objects.create(
            delivery_type=delivery_type,
            delivered_quantity=delivered_quantity,
            note=note,
            content_type=content_type,
            object_id=target_object.id
        )

    @staticmethod
    def get_delivery(delivery_id):
        return get_object_or_404(Delivery, id=delivery_id)

    @staticmethod
    def update_delivery(delivery_id, delivered_quantity=None, note=None, delivery_type=None, target_object=None):
        delivery = get_object_or_404(Delivery, id=delivery_id)
        if delivered_quantity is not None:
            delivery.delivered_quantity = delivered_quantity
        if note is not None:
            delivery.note = note
        if delivery_type is not None:
            delivery.delivery_type = delivery_type
        if target_object is not None:
            content_type = ContentType.objects.get_for_model(target_object)
            delivery.content_type = content_type
            delivery.object_id = target_object.id
        delivery.save()
        return delivery

    @staticmethod
    def delete_delivery(delivery_id):
        delivery = get_object_or_404(Delivery, id=delivery_id)
        delivery.delete()
        return True

class DemandService:
    @staticmethod
    def create_demand(product_id, quantity, due_date, note=None):
        """
        Tworzy nowe zapotrzebowanie.
        
        :param product_id: ID produktu, którego dotyczy zapotrzebowanie
        :param quantity: Ilość (np. "10kg", "20 litrów")
        :param due_date: Termin, na kiedy zapotrzebowanie ma być spełnione (format YYYY-MM-DD)\n        :param note: Opcjonalne notatki\n        :return: Utworzona instancja Demand\n        """
        product = get_object_or_404(Product, id=product_id)
        return Demand.objects.create(
            product=product,
            quantity=quantity,
            due_date=due_date,
            note=note
        )

    @staticmethod
    def get_demand(demand_id):
        return get_object_or_404(Demand, id=demand_id)

    @staticmethod
    def update_demand(demand_id, product_id=None, quantity=None, due_date=None, note=None):
        demand = get_object_or_404(Demand, id=demand_id)
        if product_id is not None:
            product = get_object_or_404(Product, id=product_id)
            demand.product = product
        if quantity is not None:
            demand.quantity = quantity
        if due_date is not None:
            demand.due_date = due_date
        if note is not None:
            demand.note = note
        demand.save()
        return demand

    @staticmethod
    def delete_demand(demand_id):
        demand = get_object_or_404(Demand, id=demand_id)
        demand.delete()
        return True
