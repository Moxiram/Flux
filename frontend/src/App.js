import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import About from './pages/Test1';

import ProductModal from './modals/ProductModal';
import WarehouseModal from './modals/WarehauseModal';
import OrderModalWithAddressChoice from './modals/OrderModalWithAddressChoice';
import DeliveryModal from './modals/DeliveryModal';
import DemandModal from './modals/DemandModal'; 
import OrderDeliveryModal from './modals/OrderDeliveryModal';
import './App.css';

function Navbar() {
    const navigate = useNavigate();

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
                <Link to="/about">Generator Danych</Link>
            </div>
            <div className="nav-right">
                <button className="logout-btn" onClick={handleLogout}>Wyloguj</button>
            </div>
        </nav>
    );
}

function Home() {
    // ================== STANY ==================
    const [addresses, setAddresses] = useState([]);
    const [orders, setOrders] = useState([]);
    const [warehouses, setWarehouses] = useState([]);
    const [products, setProducts] = useState([]);
    const [demands, setDemands] = useState([]);
    const [deliveries, setDeliveries] = useState([]);

    // Modale
    const [isProductModalOpen, setIsProductModalOpen] = useState(false);
    const [isWarehouseModalOpen, setIsWarehouseModalOpen] = useState(false);
    const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
    const [isDeliveryModalOpen, setIsDeliveryModalOpen] = useState(false);
    const [isDemandModalOpen, setIsDemandModalOpen] = useState(false);
    const [isOrderDeliveryModalOpen, setIsOrderDeliveryModalOpen] = useState(false);

    // Edycja (obiekty)
    const [editingProduct, setEditingProduct] = useState(null);
    const [editingWarehouse, setEditingWarehouse] = useState(null);
    const [editingOrder, setEditingOrder] = useState(null);
    const [editingDelivery, setEditingDelivery] = useState(null);
    const [editingDemand, setEditingDemand] = useState(null);
    const [editingOrderDelivery, setEditingOrderDelivery] = useState(null);

    // Filtry
    const [selectedWarehouse, setSelectedWarehouse] = useState('');
    const [selectedType, setSelectedType] = useState('');
    const [selectedDateFilter, setSelectedDateFilter] = useState("all");
    const [selectedProduct, setSelectedProduct] = useState("");
    const [selectedStatus, setSelectedStatus] = useState("");
    const [selectedDeliveryType, setSelectedDeliveryType] = useState("");
    const [selectedTarget, setSelectedTarget] = useState("");

    // ================== POBIERANIE DANYCH ==================
    useEffect(() => {
        fetchAddresses();
        fetchOrders();
        fetchWarehouses();
        fetchProducts();
        fetchDemands();    // Upewnijmy się, że pobieramy demands
        fetchDeliveries(); // ...i deliveries
    }, []);

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
            .then(response => {
                setDemands(response.data);
            })
            .catch(error => console.error("Błąd podczas pobierania zapotrzebowań!", error));
    };

    const fetchDeliveries = () => {
        axios.get('http://127.0.0.1:8000/api/deliveries/')
            .then(response => setDeliveries(response.data))
            .catch(error => console.error("Błąd podczas pobierania dostaw!", error));
    };

    const fetchAddresses = () => {
        axios.get('http://127.0.0.1:8000/api/addresses/')
          .then(res => setAddresses(res.data))
          .catch(err => console.error("Błąd pobierania addresses", err));
      };



    // ================== FILTRY ==================
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

    // W nowej strukturze `Product` nie ma `quantity` i `warehouse`.
    // Dlatego usuwamy logikę filtracji po product.warehouse. 
    // Zostawiamy jedynie filtr typu, bo jest w 'product.type'.
    const filteredProducts = products.filter(product => {
        return (
            (selectedType === '' || product.type === selectedType)
        );
    });

    const filteredDeliveries = deliveries.filter(delivery => {
        return (
            (selectedDeliveryType === "" || delivery.delivery_type === selectedDeliveryType) &&
            (selectedTarget === "" || delivery.target_id === selectedTarget)
        );
    });

    // ================== OBSŁUGA MODALI ==================
    const openModal = (setModalOpen, setEditingItem, item = null) => {
        setEditingItem(item);
        setModalOpen(true);
    };

    const closeModal = (setModalOpen, setEditingItem) => {
        setModalOpen(false);
        setEditingItem(null);
    };

    // Dla OrderDeliveryModal (opcjonalny):
    const openOrderDeliveryModal = (delivery = null) => {
        setEditingOrderDelivery(delivery);
        setIsOrderDeliveryModalOpen(true);
    };
    const closeOrderDeliveryModal = () => {
        setIsOrderDeliveryModalOpen(false);
        setEditingOrderDelivery(null);
    };

    // ================== ZAPIS (CRUD) ==================
    // 'handleSave' (uniwersalny), 'handleSaveDelivery' (specjalny)...

    // Uniwersalny, np. do Product, Warehouse, Order, Demand:
    const handleSave = async (apiUrl, itemData, fetchFunction, closeModalFunction) => {
        try {
            // A. Walidacja w zależności od endpointu
            if (apiUrl.includes('orders')) {
                // Wymagamy product_id
                if (!itemData.product_id) {
                    alert("Musisz wybrać produkt dla zamówienia!");
                    return;
                }
                
            
                if (!itemData.client_address_id && !itemData.client_address) {
                    alert("Musisz wybrać adres istniejący ALBO wpisać nowy adres!");
                    return;
                }
            }
            if (apiUrl.includes('warehouses')) {
                // Ewentualna walidacja magazynów...
            }
    
            // B. Po przejściu walidacji frontowej – wysyłamy do backendu
            if (itemData.id) {
                await axios.put(`${apiUrl}${itemData.id}/`, itemData);
            } else {
                await axios.post(apiUrl, itemData);
            }
    
            alert("Dane zapisane!");
            fetchFunction();
            closeModalFunction();
        } catch (error) {
            console.error("Błąd podczas zapisywania!", error.response?.data || error);
            
            let errorMessage = "Wystąpił błąd podczas zapisu!";
            if (error.response) {
                errorMessage = error.response.data?.detail || JSON.stringify(error.response.data);
            } else if (error.message) {
                errorMessage = error.message;
            }
            alert(errorMessage);
        }
    };

    // Specjalny do Delivery (jeśli potrzebujesz):
    const handleSaveDelivery = async (itemData) => {
        try {
            if (itemData.id) {
                await axios.put(`http://127.0.0.1:8000/api/deliveries/${itemData.id}/`, itemData);
            } else {
                // Ustaw dzisiejszą datę, jeśli brak
                if (!itemData.delivery_date) {
                    itemData.delivery_date = new Date().toISOString().split("T")[0];
                }
                await axios.post("http://127.0.0.1:8000/api/deliveries/", itemData);
            }
            alert("Dostawa zapisana!");
            fetchDeliveries();
            closeModal(setIsDeliveryModalOpen, setEditingDelivery);
        } catch (error) {
            console.error("Błąd podczas zapisywania dostawy!", error.response?.data || error);
            let errorMessage = "Wystąpił błąd podczas zapisu dostawy!";
            if (error.response) {
                errorMessage = error.response.data?.detail || JSON.stringify(error.response.data);
            } else if (error.message) {
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
                <button 
                    className="btn" 
                    onClick={() => openModal(setIsOrderModalOpen, setEditingOrder)}
                >
                    Dodaj zamówienie
                </button>
                {/* Przycisk do modułu 'wysyłka zamówienia' */}
                <button 
                    className="btn" 
                    onClick={() => openOrderDeliveryModal()}
                >
                    Wyślij zamówienie
                </button>
            </div>

            {/* Filtry Zamówień */}
            <div className="filters">
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
                        {Array.from(new Set(orders.map(o => o.product.name))).map(prod => (
                            <option key={prod} value={prod}>{prod}</option>
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
            <div className="grid">
                {filteredOrders.map(order => (
                    <div key={order.id} className="order-card">
                        <h3>Zamówienie #{order.id}</h3>
                        <p>Produkt: {order.product.name}</p>
                        <p>Ilość: {order.quantity}</p>
                        <p>Status: {order.status}</p>
                        <p>Termin realizacji: {order.order_deadline}</p>
                        <button 
                            className="btn-edit" 
                            onClick={() => openModal(setIsOrderModalOpen, setEditingOrder, order)}
                        >
                            Edytuj
                        </button>
                    </div>
                ))}
            </div>

            {/* Sekcja Magazynów */}
            <div className="section-header">
                <h2>Magazyny</h2>
                <button 
                    className="btn" 
                    onClick={() => openModal(setIsWarehouseModalOpen, setEditingWarehouse)}
                >
                    Dodaj magazyn
                </button>
                <button 
                    className="btn" 
                    onClick={() => openModal(setIsDemandModalOpen, setEditingDemand)}
                >
                    Zgłoś zapotrzebowanie
                </button>
            </div>
            {warehouses.map(warehouse => (
                <div key={warehouse.id} className="warehouse-item">
                    <h3>{warehouse.name}</h3>
                    {/* location usunięte lub placeholder – bo w nowej strukturze jest Address */}
                    {/* <p>Lokalizacja: ??? </p> */}
                    <p>Notatka: {warehouse.note}</p>
                    <button 
                        className="btn-edit" 
                        onClick={() => openModal(setIsWarehouseModalOpen, setEditingWarehouse, warehouse)}
                    >
                        Edytuj
                    </button>
                </div>
            ))}

            {/* Sekcja Produktów */}
            <div className="section-header">
                <h2>Produkty</h2>
                <button 
                    className="btn" 
                    onClick={() => openModal(setIsProductModalOpen, setEditingProduct)}
                >
                    Dodaj produkt
                </button>
            </div>

            {/* Filtry Produktów */}
            <div className="filters">
                <label>
                    Filtruj po typie produktu:
                    <select 
                        value={selectedType} 
                        onChange={(e) => setSelectedType(e.target.value)}
                    >
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
                        <p>Typ: {product.type || 'Brak'}</p>
                        <p>Notatki: {product.note || 'Brak'}</p>
                        <button 
                            className="btn-edit" 
                            onClick={() => openModal(setIsProductModalOpen, setEditingProduct, product)}
                        >
                            Edytuj
                        </button>
                    </div>
                ))}
            </div>

            {/* Sekcja Dostaw */}
            <div className="section-header">
                <h2>Dostawy</h2>
                <button 
                    className="btn" 
                    onClick={() => openModal(setIsDeliveryModalOpen, setEditingDelivery)}
                >
                    Dodaj dostawę
                </button>
            </div>

            {/* Filtry dostaw */}
            <div className="filters">
                <label>
                    Filtruj po typie dostawy:
                    <select 
                        value={selectedDeliveryType} 
                        onChange={(e) => setSelectedDeliveryType(e.target.value)}
                    >
                        <option value="">Wszystkie</option>
                        <option value="order">Dostawa zamówienia</option>
                        <option value="demand">Dostawa zapotrzebowania</option>
                    </select>
                </label>

                <label>
                    Filtruj po zamówieniu/zapotrzebowaniu:
                    <select 
                        value={selectedTarget} 
                        onChange={(e) => setSelectedTarget(e.target.value)}
                    >
                        <option value="">Wszystkie</option>
                        {filteredDeliveries.map(delivery => (
                            <option key={delivery.id} value={delivery.target_id}>
                                {delivery.delivery_type === "order" 
                                    ? `Zamówienie #${delivery.target_id}`
                                    : `Zapotrzebowanie #${delivery.target_id}`
                                }
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
                        <p>Typ: {delivery.delivery_type === "order" 
                                ? "Zamówienie klienta" 
                                : "Zapotrzebowanie do produkcji"}
                        </p>
                        <p>Obiekt: {delivery.delivery_type === "order" 
                                ? `Zamówienie #${delivery.target_id}` 
                                : `Zapotrzebowanie #${delivery.target_id}`
                        }</p>
                        <p>Ilość dostarczona: {delivery.delivered_quantity}</p>
                        <p>Notatki: {delivery.note || "Brak"}</p>
                        <button 
                            className="btn-edit" 
                            onClick={() => openModal(setIsDeliveryModalOpen, setEditingDelivery, delivery)}
                        >
                            Edytuj
                        </button>
                    </div>
                ))}
            </div>

            {/* =========== MODALE =========== */}
            <ProductModal 
                isOpen={isProductModalOpen} 
                onClose={() => closeModal(setIsProductModalOpen, setEditingProduct)} 
                onSave={(data) => handleSave(
                    'http://127.0.0.1:8000/api/products/', 
                    data, 
                    fetchProducts, 
                    () => closeModal(setIsProductModalOpen, setEditingProduct)
                )} 
                initialData={editingProduct} 
                warehouses={warehouses}
            />

            <WarehouseModal 
                isOpen={isWarehouseModalOpen} 
                onClose={() => closeModal(setIsWarehouseModalOpen, setEditingWarehouse)} 
                onSave={(data) => handleSave(
                    'http://127.0.0.1:8000/api/warehouses/', 
                    data, 
                    fetchWarehouses, 
                    () => closeModal(setIsWarehouseModalOpen, setEditingWarehouse)
                )} 
                initialData={editingWarehouse} 
            />

            <OrderModalWithAddressChoice
                isOpen={isOrderModalOpen}
                onClose={() => closeModal(setIsOrderModalOpen, setEditingOrder)}
                onSave={(data) => handleSave('http://127.0.0.1:8000/api/orders/', data, fetchOrders, () => closeModal(setIsOrderModalOpen, setEditingOrder))}
                initialData={editingOrder}
                products={products}
                warehouses={warehouses}
                addresses={addresses}
                />

            <DemandModal 
                isOpen={isDemandModalOpen} 
                onClose={() => closeModal(setIsDemandModalOpen, setEditingDemand)}  
                onSave={(data) => handleSave(
                    'http://127.0.0.1:8000/api/demands/', 
                    data, 
                    fetchDemands, 
                    () => closeModal(setIsDemandModalOpen, setEditingDemand)
                )} 
                initialData={editingDemand} 
                products={products}
                warehouses={warehouses}
            /> 

            <DeliveryModal
                isOpen={isDeliveryModalOpen}
                onClose={() => closeModal(setIsDeliveryModalOpen, setEditingDelivery)}
                onSave={(data) => handleSave(
                    'http://127.0.0.1:8000/api/deliveries/', 
                    data, 
                    fetchDeliveries, 
                    () => closeModal(setIsDeliveryModalOpen, setEditingDelivery)
                )}
                initialData={editingDelivery}
                orders={orders}
                demands={demands}
                warehouses={warehouses}
            />

            <OrderDeliveryModal
                isOpen={isOrderDeliveryModalOpen}
                onClose={closeOrderDeliveryModal}
                onSave={handleSaveDelivery}
                initialData={editingOrderDelivery}
                orders={orders}
                warehouses={warehouses}
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
