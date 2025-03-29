import React, { useEffect, useState } from 'react';
import axios from 'axios';
import OrderModalWithAddressChoice from '../modals/OrderModalWithAddressChoice';
// Zakładam, że plik jest w folderze "pages" i modale są w "../modals/..."  
// Zmodyfikuj ścieżkę importu, jeśli masz inną strukturę.

function OrdersPage() {
  // ================== STANY ==================
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [addresses, setAddresses] = useState([]);

  // Filtry
  const [selectedDateFilter, setSelectedDateFilter] = useState("all");
  const [selectedProduct, setSelectedProduct] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");

  // Modal do tworzenia/edycji zamówienia
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);

  // ================== POBIERANIE DANYCH ==================
  useEffect(() => {
    fetchOrders();
    fetchProducts();
    fetchAddresses();
  }, []);

  const fetchOrders = () => {
    axios.get('http://127.0.0.1:8000/api/orders/')
      .then(response => {
        setOrders(response.data);
      })
      .catch(error => console.error("Błąd podczas pobierania zamówień!", error));
  };

  const fetchProducts = () => {
    axios.get('http://127.0.0.1:8000/api/products/')
      .then(response => {
        setProducts(response.data);
      })
      .catch(error => console.error("Błąd podczas pobierania produktów!", error));
  };

  const fetchAddresses = () => {
    axios.get('http://127.0.0.1:8000/api/addresses/')
      .then(response => setAddresses(response.data))
      .catch(error => console.error("Błąd pobierania addresses", error));
  };

  // ================== FILTRACJA ==================
  const filteredOrders = orders.filter(order => {
    const today = new Date().toISOString().split("T")[0];

    // Dopasowanie terminu (deadline) do filtra
    const isMatchingDate =
      selectedDateFilter === "all" ||
      (selectedDateFilter === "upcoming" && order.order_deadline > today) ||
      (selectedDateFilter === "today" && order.order_deadline === today) ||
      (selectedDateFilter === "past" && order.order_deadline < today);

    // Dopasowanie nazwy produktu
    const isMatchingProduct =
      selectedProduct === "" || (order.product?.name === selectedProduct);

    // Dopasowanie statusu
    const isMatchingStatus =
      selectedStatus === "" || order.status === selectedStatus;

    return isMatchingDate && isMatchingProduct && isMatchingStatus;
  });

  // ================== MODAL: otwieranie/zamykanie ==================
  const openOrderModal = (order = null) => {
    setEditingOrder(order);
    setIsOrderModalOpen(true);
  };

  const closeOrderModal = () => {
    setIsOrderModalOpen(false);
    setEditingOrder(null);
  };

  // ================== ZAPIS (CRUD) ==================
  // Możemy wykorzystać uniwersalną funkcję z Twojego `App.js`.
  // Tutaj – dla prostoty – wklejamy ją skróconą, skupioną na zamówieniach:
  const handleSaveOrder = async (itemData) => {
    try {
      // Walidacja prostych pól
      if (!itemData.product_id) {
        alert("Musisz wybrać produkt dla zamówienia!");
        return;
      }
      if (!itemData.client_address_id && !itemData.client_address) {
        alert("Musisz wybrać adres (istniejący) lub wpisać nowy!");
        return;
      }

      if (itemData.id) {
        // Aktualizacja istniejącego zamówienia
        await axios.put(`http://127.0.0.1:8000/api/orders/${itemData.id}/`, itemData);
      } else {
        // Tworzenie nowego zamówienia
        await axios.post('http://127.0.0.1:8000/api/orders/', itemData);
      }

      alert("Zamówienie zapisane!");
      fetchOrders();       // odśwież listę
      closeOrderModal();   // zamknij modal
    } catch (error) {
      console.error("Błąd podczas zapisywania zamówienia!", error.response?.data || error);
      let errorMessage = "Wystąpił błąd!";
      if (error.response) {
        errorMessage = error.response.data?.detail || JSON.stringify(error.response.data);
      } else if (error.message) {
        errorMessage = error.message;
      }
      alert(errorMessage);
    }
  };

  // ================== RENDER ==================
  return (
    <div className="orders-page-container">
      <h1>Lista Zamówień</h1>

      {/* Sekcja przycisków: Dodaj zamówienie */}
      <div style={{ marginBottom: '20px' }}>
        <button className="btn" onClick={() => openOrderModal()}>
          Dodaj zamówienie
        </button>
      </div>

      {/* Filtry Zamówień */}
      <div className="filters" style={{ marginBottom: '20px' }}>
        <label>
          Filtruj po terminie:
          <select
            value={selectedDateFilter}
            onChange={(e) => setSelectedDateFilter(e.target.value)}
          >
            <option value="all">Wszystkie</option>
            <option value="upcoming">Nadchodzące</option>
            <option value="today">Dzisiejsze</option>
            <option value="past">Minione</option>
          </select>
        </label>

        <label>
          Filtruj po produkcie:
          <select
            value={selectedProduct}
            onChange={(e) => setSelectedProduct(e.target.value)}
          >
            <option value="">Wszystkie</option>
            {/* Wyciągamy unikalne nazwy produktów z zamówień */}
            {Array.from(new Set(orders.map(o => o.product?.name)))
              .filter(name => !!name)
              .map(prodName => (
                <option key={prodName} value={prodName}>
                  {prodName}
                </option>
            ))}
          </select>
        </label>

        <label>
          Filtruj po statusie:
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="">Wszystkie</option>
            <option value="to_produce">Do produkcji</option>
            <option value="ready">Gotowe do wysyłki</option>
            <option value="shipped">Wysłane</option>
          </select>
        </label>
      </div>

      {/* Lista zamówień */}
      <div className="orders-list grid">
        {filteredOrders.map(order => (
          <div key={order.id} className="order-card">
            <h3>Zamówienie #{order.id}</h3>
            <p>Produkt: {order.product?.name}</p>
            <p>Ilość: {order.quantity}</p>
            <p>Status: {order.status}</p>
            <p>Termin realizacji: {order.order_deadline || '---'}</p>
            <p>Data zamówienia: {order.order_date?.slice(0, 10) || '---'}</p>
            {/* Możesz pokazać też adres klienta, magazyn itp. */}
            {order.client_address && (
              <p>Adres klienta: {order.client_address.street}, {order.client_address.city}</p>
            )}
            {order.warehouse && (
              <p>Magazyn: {order.warehouse.name}</p>
            )}
            <button
              className="btn-edit"
              onClick={() => openOrderModal(order)}
            >
              Edytuj
            </button>
          </div>
        ))}
      </div>

      {/* Modal do dodania/edycji zamówienia */}
      <OrderModalWithAddressChoice
        isOpen={isOrderModalOpen}
        onClose={closeOrderModal}
        onSave={handleSaveOrder}
        initialData={editingOrder}
        products={products}
        warehouses={[]}       
        addresses={addresses}
      />
    </div>
  );
}

export default OrdersPage;
