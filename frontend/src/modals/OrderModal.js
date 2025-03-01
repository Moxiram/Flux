import React, { useState, useEffect } from 'react';

function OrderModal({ isOpen, onClose, onSave, initialData, products }) {
    const [selectedProduct, setSelectedProduct] = useState('');
    const [quantity, setQuantity] = useState('');
    const [orderDeadline, setOrderDeadline] = useState('');
    const [note, setNote] = useState('');
    const [status, setStatus] = useState('to_produce');

    useEffect(() => {
        if (initialData) {
            setSelectedProduct(initialData.product?.id || '');
            setQuantity(initialData.quantity || '');
            setOrderDeadline(initialData.order_deadline || '');
            setNote(initialData.note || '');
            setStatus(initialData.status || 'to_produce');
        }
    }, [initialData]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const orderData = {
            id: initialData?.id || null, // Kluczowe dla edycji zamówienia
            product_id: selectedProduct,
            quantity,
            order_deadline: orderDeadline,
            note,
            status
        };

        onSave(orderData);
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>{initialData ? 'Edytuj zamówienie' : 'Dodaj nowe zamówienie'}</h2>
                <form onSubmit={handleSubmit}>
                    <label>Produkt:</label>
                    <select value={selectedProduct} onChange={(e) => setSelectedProduct(e.target.value)} required>
                        <option value="">Wybierz produkt</option>
                        {products.map(product => (
                            <option key={product.id} value={product.id}>{product.name}</option>
                        ))}
                    </select>

                    <label>Ilość:</label>
                    <input type="text" value={quantity} onChange={(e) => setQuantity(e.target.value)} required />

                    <label>Termin realizacji:</label>
                    <input type="date" value={orderDeadline} onChange={(e) => setOrderDeadline(e.target.value)} required />

                    <label>Status:</label>
                    <select value={status} onChange={(e) => setStatus(e.target.value)} required>
                        <option value="to_produce">Do produkcji</option>
                        <option value="ready">Gotowy do wysyłki</option>
                        <option value="shipped">Wysłany</option>
                    </select>

                    <label>Notatki:</label>
                    <textarea value={note} onChange={(e) => setNote(e.target.value)} />

                    <button type="submit">Zapisz</button>
                    <button type="button" onClick={onClose}>Anuluj</button>
                </form>
            </div>
        </div>
    );
}

export default OrderModal;
