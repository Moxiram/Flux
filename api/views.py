from rest_framework import viewsets
from .models import (
    Address, 
    Warehouse, 
    Product, 
    Stock, 
    Order, 
    Demand, 
    Delivery
)
from .serializers import (
    AddressSerializer,
    WarehouseSerializer,
    ProductSerializer,
    StockSerializer,
    OrderSerializer,
    DemandSerializer,
    DeliverySerializer
)

from django.contrib.auth import get_user_model

from io import StringIO
from django.core.management import call_command
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.core.files.storage import default_storage

CustomUser = get_user_model()


"""ViewSety zapewniają CRUDA dla danej tabeli"""
class AddressViewSet(viewsets.ModelViewSet):
    
    queryset = Address.objects.all()
    serializer_class = AddressSerializer


class WarehouseViewSet(viewsets.ModelViewSet):
    
    queryset = Warehouse.objects.all()
    serializer_class = WarehouseSerializer


class ProductViewSet(viewsets.ModelViewSet):
    
    queryset = Product.objects.all()
    serializer_class = ProductSerializer


class StockViewSet(viewsets.ModelViewSet):
    
    queryset = Stock.objects.all()
    serializer_class = StockSerializer


class OrderViewSet(viewsets.ModelViewSet):
    
    queryset = Order.objects.all()
    serializer_class = OrderSerializer


class DemandViewSet(viewsets.ModelViewSet):
    
    queryset = Demand.objects.all()
    serializer_class = DemandSerializer


class DeliveryViewSet(viewsets.ModelViewSet):
    
    queryset = Delivery.objects.all()
    serializer_class = DeliverySerializer


@csrf_exempt
def export_json(request):
    if request.method == 'GET':
        # fajnie że django ma pakiet do wywoływania komend z kodu
        buffer = StringIO()
        call_command('dumpdata', stdout=buffer)  
        
        data = buffer.getvalue()  # String z JSON

        
        response = HttpResponse(data, content_type='application/json')
        response['Content-Disposition'] = 'attachment; filename="backup.json"'
        return response
    return HttpResponse(status=405)




@csrf_exempt
def import_json(request):
    """
    Odbiera plik .json przez POST i wczytuje go do bazy przy pomocy loaddata
    """
    if request.method == 'POST':
        uploaded_file = request.FILES.get('file')
        if not uploaded_file:
            return HttpResponse("Brak pliku 'file' w request.FILES", status=400)

        # Zapisujemy plik tymczasowo
        tmp_path = default_storage.save("temp_import.json", uploaded_file)

        # Faktyczna ścieżka w systemie plików (np. MEDIA_ROOT + "temp_import.json")
        full_path = default_storage.path(tmp_path)

        try:
            # Wywołujemy "loaddata" w tym samym interpreterze
            call_command("loaddata", full_path)
        except Exception as e:
            # Przy błędzie możesz zwrócić np. treść wyjątku
            return HttpResponse(f"Błąd loaddata:\n{str(e)}", status=500)
        finally:
            # Na końcu usuwamy plik tymczasowy
            if default_storage.exists(tmp_path):
                default_storage.delete(tmp_path)

        return HttpResponse("Import zakończony sukcesem!")
    return HttpResponse(status=405)  # Metoda nieobsługiwana