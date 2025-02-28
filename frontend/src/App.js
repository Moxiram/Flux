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

    useEffect(() => {
        fetchOrders();
        fetchWarehouses();
        fetchProducts();
    }, []);

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
        }
    };

    return (
        <div className="container">
            <h1>Panel Logistyczny</h1>
            
            <div className="section-header">
                <h2>Lista Zamówień</h2>
                <button className="btn" onClick={() => openModal(setIsOrderModalOpen, setEditingOrder)}>Dodaj zamówienie</button>
            </div>
            {orders.map(order => (
                <div key={order.id} className="order-card">
                    <h3>Zamówienie #{order.id}</h3>
                    <p>Produkt: {order.product.name}</p>
                    <p>Ilość: {order.quantity}</p>
                    <p>Status: {order.status}</p>
                    <p>Termin realizacji: {order.order_deadline}</p>
                    <button className="btn-edit" onClick={() => openModal(setIsOrderModalOpen, setEditingOrder, order)}>Edytuj</button>
                </div>
            ))}

            <div className="section-header">
                <h2>Magazyny</h2>
                <button className="btn" onClick={() => openModal(setIsWarehouseModalOpen, setEditingWarehouse)}>Dodaj magazyn</button>
            </div>
            {warehouses.map(warehouse => (
                <div key={warehouse.id} className="warehouse-item">
                    <h3>{warehouse.name}</h3>
                    <p>Lokalizacja: {warehouse.location}</p>
                    <p>Notatka: {warehouse.note}</p>
                    <button className="btn-edit" onClick={() => openModal(setIsWarehouseModalOpen, setEditingWarehouse, warehouse)}>Edytuj</button>
                </div>
            ))}

            <div className="section-header">
                <h2>Produkty</h2>
                <button className="btn" onClick={() => openModal(setIsProductModalOpen, setEditingProduct)}>Dodaj produkt</button>
            </div>
            {products.map(product => (
                <div key={product.id} className="product-card">
                    <h3>{product.name}</h3>
                    <p>Ilość: {product.quantity}</p>
                    <p>Typ: {product.type || 'Brak'}</p>
                    <p>Magazyn: {product.warehouse ? product.warehouse.name : 'Brak'}</p>
                    <p>Notatki: {product.note || 'Brak'}</p>
                    <button className="btn-edit" onClick={() => openModal(setIsProductModalOpen, setEditingProduct, product)}>Edytuj</button>
                </div>
            ))}

            <ProductModal isOpen={isProductModalOpen} onClose={() => closeModal(setIsProductModalOpen, setEditingProduct)} onSave={(data) => handleSave('http://127.0.0.1:8000/api/products/', data, fetchProducts, () => closeModal(setIsProductModalOpen, setEditingProduct))} initialData={editingProduct} warehouses={warehouses} />
            <WarehouseModal isOpen={isWarehouseModalOpen} onClose={() => closeModal(setIsWarehouseModalOpen, setEditingWarehouse)} onSave={(data) => handleSave('http://127.0.0.1:8000/api/warehouses/', data, fetchWarehouses, () => closeModal(setIsWarehouseModalOpen, setEditingWarehouse))} initialData={editingWarehouse} />
            <OrderModal isOpen={isOrderModalOpen} onClose={() => closeModal(setIsOrderModalOpen, setEditingOrder)} onSave={(data) => handleSave('http://127.0.0.1:8000/api/orders/', data, fetchOrders, () => closeModal(setIsOrderModalOpen, setEditingOrder))} initialData={editingOrder} products={products} />
        </div>
    );
}

export default Home;