import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ProductService from '../services/ProductService';
import WarehouseService from '../services/WarehouseService';

function AddProduct() {
    const [name, setName] = useState('');
    const [quantity, setQuantity] = useState('');
    const [type, setType] = useState('');
    const [warehouse, setWarehouse] = useState('');
    const [status, setStatus] = useState('to_produce');
    const [note, setNote] = useState('');
    const [warehouses, setWarehouses] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        WarehouseService.getAllWarehouses()
            .then(data => setWarehouses(data))
            .catch(error => console.error('Błąd pobierania magazynów:', error));
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const productData = {
            name,
            quantity,
            type,
            warehouse_id: warehouse || null,
            status,
            note
        };

        try {
            await ProductService.createProduct(productData);
            alert('Produkt został dodany!');
            navigate('/');
        } catch (error) {
            console.error('Błąd podczas dodawania produktu:', error);
            alert('Wystąpił błąd podczas dodawania produktu.');
        }
    };

    return (
        <div>
            <h2>Dodaj nowy produkt</h2>
            <form onSubmit={handleSubmit}>
                <label>
                    Nazwa:
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
                </label>
                <label>
                    Ilość:
                    <input type="text" value={quantity} onChange={(e) => setQuantity(e.target.value)} required />
                </label>
                <label>
                    Typ produktu:
                    <input type="text" value={type} onChange={(e) => setType(e.target.value)} />
                </label>
                <label>
                    Magazyn:
                    <select value={warehouse} onChange={(e) => setWarehouse(e.target.value)}>
                        <option value="">Brak</option>
                        {warehouses.map(wh => (
                            <option key={wh.id} value={wh.id}>{wh.name}</option>
                        ))}
                    </select>
                </label>
                <label>
                    Status:
                    <select value={status} onChange={(e) => setStatus(e.target.value)}>
                        <option value="to_produce">Do produkcji</option>
                        <option value="ready">Gotowy do wysyłki</option>
                        <option value="shipped">Wysłany</option>
                    </select>
                </label>
                <label>
                    Notatki:
                    <textarea value={note} onChange={(e) => setNote(e.target.value)} />
                </label>
                <button type="submit">Dodaj produkt</button>
            </form>
        </div>
    );
}

export default AddProduct;
