import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import About from './pages/Test1';
import AddOrder from './pages/add_order';
import AddProduct from './pages/add_product';
import './App.css';

function Home() {
    const [orders, setOrders] = useState([]);
    const [warehouses, setWarehouses] = useState([]);
    const [products, setProducts] = useState([]);

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

    return (
        <div className="container">
            <h1>Panel Logistyczny</h1>
            
            {/* Sekcja Zamówień */}
            <div className="section-header">
                <h2>Lista Zamówień</h2>
                <Link to="/add-order">
                    <button className="btn">Dodaj zamówienie</button>
                </Link>
            </div>
            {orders.length === 0 ? <p>Brak zamówień.</p> : null}
            <div className="grid">
                {orders.map(order => (
                    <div key={order.id} className="order-card">
                        <h3>Zamówienie #{order.id}</h3>
                        <p>Produkt: {order.product.name}</p>
                        <p>Ilość: {order.quantity}</p>
                       
                        <p>Termin realizacji: {order.order_deadline}</p>
                        <button className="btn">Szczegóły</button>
                    </div>
                ))}
            </div>

            {/* Sekcja Magazynów */}
            <div className="section-header">
                <h2>Magazyny</h2>
                <Link to="/add-warehouse">
                    <button className="btn">Dodaj magazyn</button>
                </Link>
            </div>
            {warehouses.length === 0 ? <p>Brak dostępnych magazynów.</p> : null}
            {warehouses.map(warehouse => (
                <details key={warehouse.id} className="warehouse-item">
                    <summary>{warehouse.name}</summary>
                    <p>Lokalizacja: {warehouse.location}</p>
                    <p>Notatka: {warehouse.note}</p>
                </details>
            ))}

            {/* Sekcja Produktów */}
            <div className="section-header">
                <h2>Produkty</h2>
                <Link to="/add-product">
                    <button className="btn">Dodaj produkt</button>
                </Link>
            </div>
            {products.length === 0 ? <p>Brak dostępnych produktów.</p> : null}
            <div className="grid">
                {products.map(product => (
                    <div key={product.id} className="product-card">
                        <h3>{product.name}</h3>
                        <p>Ilość: {product.quantity}</p>
                        <p>Status: {product.status}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

function App() {
    return (
        <Router>
            <header className="navbar">
                <span className="user-name">Użytkownik: Jan Kowalski</span>
                <nav className="nav-links">
                    <Link to="/">Strona główna</Link>
                    <Link to="/about">O nas</Link>
                </nav>
                <button className="logout-btn">Wyloguj</button>
            </header>

            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/add-order" element={<AddOrder/>} />
                <Route path="/add-warehouse" element={<div>Formularz dodawania magazynu</div>} />
                <Route path="/add-product" element={<AddProduct/>} />
            </Routes>
        </Router>
    );
}

export default App;
