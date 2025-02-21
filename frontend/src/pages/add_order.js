import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function AddOrder() {
    const [products, setProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState('');
    const [quantity, setQuantity] = useState('');
    const [orderDate, setOrderDate] = useState('');
    const [orderDeadline, setOrderDeadline] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        axios.get('http://127.0.0.1:8000/api/products/')
            .then(response => setProducts(response.data))
            .catch(error => console.error("Błąd podczas pobierania produktów!", error));
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const newOrder = {
                product: selectedProduct,
                quantity,
                order_date: orderDate,
                order_deadline: orderDeadline
            };
            
            await axios.post('http://127.0.0.1:8000/api/orders/', newOrder);
            alert("Zamówienie zostało dodane!");
            navigate('/');
        } catch (error) {
            console.error("Błąd podczas dodawania zamówienia!", error);
        }
    };

    return (
        <div className="form-container">
            <h2>Dodaj nowe zamówienie</h2>
            <form onSubmit={handleSubmit}>
                <label>Produkt:</label>
                <select value={selectedProduct} onChange={e => setSelectedProduct(e.target.value)} required>
                    <option value="">Wybierz produkt</option>
                    {products.map(product => (
                        <option key={product.id} value={product.id}>{product.name}</option>
                    ))}
                </select>

                <label>Ilość:</label>
                <input type="text" value={quantity} onChange={e => setQuantity(e.target.value)} required />

                <label>Data zamówienia:</label>
                <input type="date" value={orderDate} onChange={e => setOrderDate(e.target.value)} required />

                <label>Termin realizacji:</label>
                <input type="date" value={orderDeadline} onChange={e => setOrderDeadline(e.target.value)} required />

                <button type="submit">Dodaj zamówienie</button>
            </form>
            <button onClick={() => navigate('/')}>Anuluj</button>
        </div>
    );
}

export default AddOrder;