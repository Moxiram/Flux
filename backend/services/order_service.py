from django.shortcuts import get_object_or_404
from django.utils.timezone import now
from api.models import Order, Product

class OrderService:
    @staticmethod
    def create_order(product_id, quantity, order_deadline, status="to_produce"):
        """ Tworzy nowe zamówienie ze statusem """
        product = get_object_or_404(Product, id=product_id)
        return Order.objects.create(product=product, quantity=quantity, order_deadline=order_deadline, status=status)

    @staticmethod
    def get_order(order_id):
        return get_object_or_404(Order, id=order_id)

    @staticmethod
    def update_order(order_id, product_id=None, quantity=None, order_deadline=None, status=None):
        """ Aktualizuje zamówienie (opcjonalnie zmienia produkt, ilość, termin i status) """
        order = get_object_or_404(Order, id=order_id)
        if product_id:
            order.product = get_object_or_404(Product, id=product_id)
        if quantity:
            order.quantity = quantity
        if order_deadline:
            order.order_deadline = order_deadline
        if status:
            order.status = status  # ✅ Zmieniono, aby obsługiwało status zamówienia
        order.save()
        return order

    @staticmethod
    def delete_order(order_id):
        order = get_object_or_404(Order, id=order_id)
        order.delete()
        return True

    @staticmethod
    def get_overdue_orders():
        """ Pobiera wszystkie przeterminowane zamówienia """
        return Order.objects.filter(order_deadline__lt=now().date())
