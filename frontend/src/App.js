import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import About from './pages/Test1';
import ProductModal from './modals/ProductModal';
import WarehouseModal from './modals/WarehauseModal';
import OrderModal from './modals/OrderModal';
import './App.css';

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

    useEffect(() => {
        axios.get('http://127.0.0.1:8000/api/orders/')
            .then(response => setOrders(response.data))
            .catch(error => console.error("Błąd podczas pobierania zamówień!", error));

        axios.get('http://127.0.0.1:8000/api/warehouses/')
            .then(response => setWarehouses(response.data))
            .catch(error => console.error("Błąd podczas pobierania magazynów!", error));

        axios.get('http://127.0.0.1:8000/api/products/')
            .then(response => setProducts(response.data))
            .catch(error => console.error("Błąd podczas pobierania produktów!", error));
    }, []);

    const openProductModal = (product = null) => {
        setEditingProduct(product);
        setIsProductModalOpen(true);
    };

    const closeProductModal = () => {
        setIsProductModalOpen(false);
        setEditingProduct(null);
    };

    const openWarehouseModal = (warehouse = null) => {
        setEditingWarehouse(warehouse);
        setIsWarehouseModalOpen(true);
    };

    const closeWarehouseModal = () => {
        setIsWarehouseModalOpen(false);
        setEditingWarehouse(null);
    };

    const openOrderModal = (order = null) => {
        setEditingOrder(order);
        setIsOrderModalOpen(true);
    };

    const closeOrderModal = () => {
        setIsOrderModalOpen(false);
        setEditingOrder(null);
    };

    const handleSaveProduct = async (productData) => {
        try {
            if (editingProduct) {
                await axios.put(`http://127.0.0.1:8000/api/products/${editingProduct.id}/`, productData);
            } else {
                await axios.post('http://127.0.0.1:8000/api/products/', productData);
            }
            alert("Produkt zapisany!");
            closeProductModal();
            window.location.reload();
        } catch (error) {
            console.error("Błąd podczas zapisywania produktu!", error.response?.data || error);
        }
    };

    return (
        <div className="container">
            <h1>Panel Logistyczny</h1>
            
            <div className="section-header">
                <h2>Lista Zamówień</h2>
                <button className="btn" onClick={() => openOrderModal()}>Dodaj zamówienie</button>
            </div>
            {orders.map(order => (
                <div key={order.id} className="order-card">
                    <h3>Zamówienie #{order.id}</h3>
                    <p>Produkt: {order.product.name}</p>
                    <p>Ilość: {order.quantity}</p>
                    <p>Status: {order.status}</p>
                    <p>Termin realizacji: {order.order_deadline}</p>
                </div>
            ))}

            <div className="section-header">
                <h2>Magazyny</h2>
                <button className="btn" onClick={() => openWarehouseModal()}>Dodaj magazyn</button>
            </div>
            {warehouses.map(warehouse => (
                <div key={warehouse.id} className="warehouse-item">
                    <h3>{warehouse.name}</h3>
                    <p>Lokalizacja: {warehouse.location}</p>
                    <p>Notatka: {warehouse.note}</p>
                </div>
            ))}

            <div className="section-header">
                <h2>Produkty</h2>
                <button className="btn" onClick={() => openProductModal()}>Dodaj produkt</button>
            </div>
            {products.map(product => (
                <div key={product.id} className="product-card">
                    <h3>{product.name}</h3>
                    <p>Ilość: {product.quantity}</p>
                    <p>Typ: {product.type || 'Brak'}</p>
                    <p>Magazyn: {product.warehouse ? product.warehouse.name : 'Brak'}</p>
                    <p>Notatki: {product.note || 'Brak'}</p>
                    <button className="btn-edit" onClick={() => openProductModal(product)}>Edytuj</button>
                </div>
            ))}

            <ProductModal isOpen={isProductModalOpen} onClose={closeProductModal} onSave={handleSaveProduct} initialData={editingProduct} warehouses={warehouses} />
            <WarehouseModal isOpen={isWarehouseModalOpen} onClose={closeWarehouseModal} onSave={() => {}} initialData={editingWarehouse} />
            <OrderModal isOpen={isOrderModalOpen} onClose={closeOrderModal} onSave={() => {}} initialData={editingOrder} products={products} />
        </div>
    );
}

function App() {
    return (
        <Router>
            <header className="navbar">
                <span className="user-name">Włodzimierz Szaranowicz</span>
                <nav className="nav-links">
                    <Link to="/">Strona główna</Link>
                    <Link to="/about">O nas</Link>
                </nav>
                <button className="logout-btn">Wyloguj</button>
            </header>

            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
            </Routes>
        </Router>
    );
}

export default App;