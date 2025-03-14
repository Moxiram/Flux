import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import About from './pages/Test1';
import ProductModal from './modals/ProductModal';
import WarehouseModal from './modals/WarehauseModal';
import OrderModal from './modals/OrderModal';
import DeliveryModal from './modals/DeliveryModal';
import DemandModal from './modals/DemandModal'; 
import './App.css';

function Navbar() {
    const navigate = useNavigate(); // działa, bo jest wewnątrz <Router>

    const handleLogout = () => {
        alert("Wylogowano!");
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <div className="nav-left">
                <span className="logo">📦 LogisticApp</span>
            </div>
            <div className="nav-center">
                <Link to="/">Strona główna</Link>
                <Link to="/orders">Zamówienia</Link>
                <Link to="/products">Produkty</Link>
                <Link to="/warehouses">Magazyny</Link>
                <Link to="/users">Użytkownicy</Link>
                <Link to="/about">O nas</Link>
            </div>
            <div className="nav-right">
                <button className="logout-btn" onClick={handleLogout}>Wyloguj</button>
            </div>
        </nav>
    );
}

//obsługi stanów
function Home() {
    const [orders, setOrders] = useState([]);
    const [warehouses, setWarehouses] = useState([]);
    const [products, setProducts] = useState([]);
    const [isProductModalOpen, setIsProductModalOpen] = useState(false);
    const [isWarehouseModalOpen, setIsWarehouseModalOpen] = useState(false);
    const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [editingWarehouse, setEditingWarehouse] = useState(null);
    const [editingOrder, setEditingOrder] = useState(null);
    const [selectedWarehouse, setSelectedWarehouse] = useState('');
    const [selectedType, setSelectedType] = useState('');
    const [selectedDateFilter, setSelectedDateFilter] = useState("all");
    const [selectedProduct, setSelectedProduct] = useState("");
    const [selectedStatus, setSelectedStatus] = useState("");
    const [isDeliveryModalOpen, setIsDeliveryModalOpen] = useState(false);
    const [isDemandModalOpen, setIsDemandModalOpen] = useState(false);
    const [editingDelivery, setEditingDelivery] = useState(null);
    const [editingDemand, setEditingDemand] = useState(null);
    const [deliveries, setDeliveries] = useState([]);
    const [selectedDeliveryType, setSelectedDeliveryType] = useState("");
    const [selectedTarget, setSelectedTarget] = useState("");
    const [demands, setDemands] = useState([]);

    useEffect(() => {
        fetchOrders();
        fetchWarehouses();
        fetchProducts();
    }, []);

    //Filtry wyszukiwania

    const filteredOrders = orders.filter(order => {
        const today = new Date().toISOString().split("T")[0];
    
        const isMatchingDate = (
            selectedDateFilter === "all" ||
            (selectedDateFilter === "upcoming" && order.order_deadline > today) ||
            (selectedDateFilter === "today" && order.order_deadline === today) ||
            (selectedDateFilter === "past" && order.order_deadline < today)
        );
    
        return (
            isMatchingDate &&
            (selectedProduct === "" || order.product.name === selectedProduct) &&
            (selectedStatus === "" || order.status === selectedStatus)
        );
    });

    const filteredProducts = products.filter(product => {
        return (
            (selectedWarehouse === '' || product.warehouse?.id === parseInt(selectedWarehouse)) &&
            (selectedType === '' || product.type === selectedType)
        );
    });

    const filteredDeliveries = deliveries.filter(delivery => {
        return (
            (selectedDeliveryType === "" || delivery.delivery_type === selectedDeliveryType) &&
            (selectedTarget === "" || delivery.target_id === selectedTarget)
        );
    });

    const fetchOrders = () => {
        axios.get('http://127.0.0.1:8000/api/orders/')
            .then(response => setOrders(response.data))
            .catch(error => console.error("Błąd podczas pobierania zamówień!", error));
    };

    const fetchWarehouses = () => {
        axios.get('http://127.0.0.1:8000/api/warehouses/')
            .then(response => setWarehouses(response.data))
            .catch(error => console.error("Błąd podczas pobierania magazynów!", error));
    };

    const fetchProducts = () => {
        axios.get('http://127.0.0.1:8000/api/products/')
            .then(response => setProducts(response.data))
            .catch(error => console.error("Błąd podczas pobierania produktów!", error));
    };

    const fetchDemands = () => {
        axios.get('http://127.0.0.1:8000/api/demands/')
            .then(response => console.log("Pobrane zapotrzebowania:", response.data))
            .catch(error => console.error("Błąd podczas pobierania zapotrzebowań!", error));
    };

    const fetchDeliveries = () => {
        axios.get('http://127.0.0.1:8000/api/deliveries/')
            .then(response => setDeliveries(response.data))
            .catch(error => console.error("Błąd podczas pobierania dostaw!", error));
    };

    const openModal = (setModalOpen, setEditingItem, item = null) => {
        setEditingItem(item);
        setModalOpen(true);
    };

    const closeModal = (setModalOpen, setEditingItem) => {
        setModalOpen(false);
        setEditingItem(null);
    };

    const handleSave = async (apiUrl, itemData, fetchFunction, closeModalFunction) => {
        try {
            if (itemData.id) { // Jeśli element ma ID, aktualizujemy go
                await axios.put(`${apiUrl}${itemData.id}/`, itemData);
            } else { // Jeśli nie ma ID, tworzymy nowy
                await axios.post(apiUrl, itemData);
            }
            alert("Dane zapisane!");
            fetchFunction(); // Pobranie zaktualizowanych danych
            closeModalFunction(); // Zamknięcie modala
        } catch (error) {
            console.error("Błąd podczas zapisywania!", error.response?.data || error);
            
            // Pobieramy komunikat błędu z backendu
            let errorMessage = "Wystąpił błąd podczas zapisu!";
            
            if (error.response) {
                // Jeśli API zwróciło odpowiedź, pobieramy szczegóły błędu
                errorMessage = error.response.data?.detail || JSON.stringify(error.response.data);
            } else if (error.message) {
                // Jeśli błąd pochodzi z sieci (np. brak połączenia z serwerem)
                errorMessage = error.message;
            }
            
            alert(errorMessage);
        }
    };
    
    

    return (
        <div className="container">
            <h1>Panel Logistyczny</h1>

            {/* Sekcja Zamówień */}
            <div className="section-header">
                <h2>Lista Zamówień</h2>
                <button className="btn" onClick={() => openModal(setIsOrderModalOpen, setEditingOrder)}>Dodaj zamówienie</button>
                <button className="btn" onClick={() => openModal(setIsDeliveryModalOpen, setEditingDelivery)}>Dodaj dostawę</button>
            </div>

            {/* Filtry */}
            <div className="filters">
                <label>
                    Filtruj po terminie:
                    <select value={selectedDateFilter} onChange={(e) => setSelectedDateFilter(e.target.value)}>
                        <option value="all">Wszystkie</option>
                        <option value="upcoming">Nadchodzące</option>
                        <option value="today">Dzisiejsze</option>
                        <option value="past">Minione</option>
                    </select>
                </label>

                <label>
                    Filtruj po produkcie:
                    <select value={selectedProduct} onChange={(e) => setSelectedProduct(e.target.value)}>
                        <option value="">Wszystkie</option>
                        {Array.from(new Set(orders.map(o => o.product.name))).map(product => (
                            <option key={product} value={product}>{product}</option>
                        ))}
                    </select>
                </label>

                <label>
                    Filtruj po statusie:
                    <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)}>
                        <option value="">Wszystkie</option>
                        <option value="to_produce">Do produkcji</option>
                        <option value="ready">Gotowe do wysyłki</option>
                        <option value="shipped">Wysłane</option>
                    </select>
                </label>
            </div>

            {/* Lista zamówień */}
            <div className="grid">
            
                {filteredOrders.map(order => (
                    <div key={order.id} className="order-card">
                        <h3>Zamówienie #{order.id}</h3>
                        <p>Produkt: {order.product.name}</p>
                        <p>Ilość: {order.quantity}</p>
                        <p>Status: {order.status}</p>
                        <p>Termin realizacji: {order.order_deadline}</p>
                        <button className="btn-edit" onClick={() => openModal(setIsOrderModalOpen, setEditingOrder, order)}>Edytuj</button>
                    </div>
                ))}
            </div>


            {/* Sekcja Magazynów */}
            <div className="section-header">
                <h2>Magazyny</h2>
                <button className="btn" onClick={() => openModal(setIsWarehouseModalOpen, setEditingWarehouse)}>Dodaj magazyn</button>
                <button className="btn" onClick={() => openModal(setIsDemandModalOpen, setEditingDemand)}>Zgłoś zapotrzebowanie</button>
            </div>
            {warehouses.map(warehouse => (
                <div key={warehouse.id} className="warehouse-item">
                    <h3>{warehouse.name}</h3>
                    <p>Lokalizacja: {warehouse.location}</p>
                    <p>Notatka: {warehouse.note}</p>
                    <button className="btn-edit" onClick={() => openModal(setIsWarehouseModalOpen, setEditingWarehouse, warehouse)}>Edytuj</button>
                </div>
            ))}

            
            {/* Sekcja Produktów */}
            <div className="section-header">
                <h2>Produkty</h2>
                <button className="btn" onClick={() => openModal(setIsProductModalOpen, setEditingProduct)}>Dodaj produkt</button>
            </div>

            {/* Filtry */}
            <div className="filters">
                <label>
                    Filtruj po magazynie:
                    <select value={selectedWarehouse} onChange={(e) => setSelectedWarehouse(e.target.value)}>
                        <option value="">Wszystkie</option>
                        {warehouses.map(wh => (
                            <option key={wh.id} value={wh.id}>{wh.name}</option>
                        ))}
                    </select>
                </label>

                <label>
                    Filtruj po typie produktu:
                    <select value={selectedType} onChange={(e) => setSelectedType(e.target.value)}>
                        <option value="">Wszystkie</option>
                        {Array.from(new Set(products.map(p => p.type).filter(Boolean))).map(type => (
                            <option key={type} value={type}>{type}</option>
                        ))}
                    </select>
                </label>
            </div>

            {/* Lista produktów */}
            <div className="grid">
                {filteredProducts.map(product => (
                    <div key={product.id} className="product-card">
                        <h3>{product.name}</h3>
                        <p>Ilość: {product.quantity}</p>
                        <p>Typ: {product.type || 'Brak'}</p>
                        <p>Magazyn: {product.warehouse ? product.warehouse.name : 'Brak'}</p>
                        <p>Notatki: {product.note || 'Brak'}</p>
                        <button className="btn-edit" onClick={() => openModal(setIsProductModalOpen, setEditingProduct, product)}>Edytuj</button>
                    </div>
                ))}
            </div>


            {/* Sekcja Dostaw */}
            <div className="section-header">
                <h2>Dostawy</h2>
                <button className="btn" onClick={() => openModal(setIsDeliveryModalOpen, setEditingDelivery)}>Dodaj dostawę</button>
            </div>

            {/* Filtry dostaw */}
            <div className="filters">
                <label>
                    Filtruj po typie dostawy:
                    <select value={selectedDeliveryType} onChange={(e) => setSelectedDeliveryType(e.target.value)}>
                        <option value="">Wszystkie</option>
                        <option value="order">Dostawa zamówienia</option>
                        <option value="demand">Dostawa zapotrzebowania</option>
                    </select>
                </label>

                <label>
                    Filtruj po zamówieniu/zapotrzebowaniu:
                    <select value={selectedTarget} onChange={(e) => setSelectedTarget(e.target.value)}>
                        <option value="">Wszystkie</option>
                        {deliveries.map(delivery => (
                            <option key={delivery.id} value={delivery.target_id}>
                                {delivery.delivery_type === "order" ? `Zamówienie #${delivery.target_id}` : `Zapotrzebowanie #${delivery.target_id}`}
                            </option>
                        ))}
                    </select>
                </label>
            </div>

            {/* Lista dostaw */}
            <div className="grid">
                {filteredDeliveries.map(delivery => (
                    <div key={delivery.id} className="delivery-card">
                        <h3>Dostawa #{delivery.id}</h3>
                        <p>Typ: {delivery.delivery_type === "order" ? "Zamówienie klienta" : "Zapotrzebowanie do produkcji"}</p>
                        <p>Obiekt: {delivery.delivery_type === "order" ? `Zamówienie #${delivery.target_id}` : `Zapotrzebowanie #${delivery.target_id}`}</p>
                        <p>Ilość dostarczona: {delivery.delivered_quantity}</p>
                        <p>Notatki: {delivery.note || "Brak"}</p>
                        <button className="btn-edit" onClick={() => openModal(setIsDeliveryModalOpen, setEditingDelivery, delivery)}>Edytuj</button>
                    </div>
                ))}
            </div>


            {/* Modale */}
            <ProductModal isOpen={isProductModalOpen} onClose={() => closeModal(setIsProductModalOpen, setEditingProduct)} onSave={(data) => handleSave('http://127.0.0.1:8000/api/products/', data, fetchProducts, () => closeModal(setIsProductModalOpen, setEditingProduct))} initialData={editingProduct} warehouses={warehouses} />
            <WarehouseModal isOpen={isWarehouseModalOpen} onClose={() => closeModal(setIsWarehouseModalOpen, setEditingWarehouse)} onSave={(data) => handleSave('http://127.0.0.1:8000/api/warehouses/', data, fetchWarehouses, () => closeModal(setIsWarehouseModalOpen, setEditingWarehouse))} initialData={editingWarehouse} />
            <OrderModal isOpen={isOrderModalOpen} onClose={() => closeModal(setIsOrderModalOpen, setEditingOrder)} onSave={(data) => handleSave('http://127.0.0.1:8000/api/orders/', data, fetchOrders, () => closeModal(setIsOrderModalOpen, setEditingOrder))} initialData={editingOrder} products={products} />
            <DemandModal isOpen={isDemandModalOpen} onClose={() => closeModal(setIsDemandModalOpen, setEditingDemand)}  onSave={(data) => handleSave('http://127.0.0.1:8000/api/demands/', data, fetchDemands, () => closeModal(setIsDemandModalOpen, setEditingDemand))} initialData={editingDemand} products={products} /> 
            <DeliveryModal
                isOpen={isDeliveryModalOpen}
                onClose={() => closeModal(setIsDeliveryModalOpen, setEditingDelivery)}
                onSave={(data) => handleSave('http://127.0.0.1:8000/api/deliveries/', data, fetchDeliveries, () => closeModal(setIsDeliveryModalOpen, setEditingDelivery))}
                initialData={editingDelivery}
                orders={orders}
                demands={demands}   
            />
        </div>
    );
}

function App() {
    return (
        <Router>
            <Navbar />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/login" element={<div>Zaloguj się</div>} />
            </Routes>
        </Router>
    );
}

export default App;
