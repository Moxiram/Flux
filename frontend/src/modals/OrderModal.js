import React, { useState, useEffect } from 'react';

function OrderModal({ isOpen, onClose, onSave, initialData, products }) {
    const [selectedProduct, setSelectedProduct] = useState('');
    const [quantity, setQuantity] = useState('');
    const [orderDeadline, setOrderDeadline] = useState('');
    const [note, setNote] = useState(''); // Dodano obsługę notatek

    useEffect(() => {
        if (initialData) {
            setSelectedProduct(initialData.product?.id || '');
            setQuantity(initialData.quantity || '');
            setOrderDeadline(initialData.order_deadline || '');  // Upewnij się, że wartość jest w formacie YYYY-MM-DD
            setNote(initialData.note || ''); // Wczytanie notatek jeśli istnieją
        }
    }, [initialData]);


    const handleSubmit = (e) => {
        e.preventDefault();

        const formattedOrderDeadline = orderDeadline ? new Date(orderDeadline).toISOString().split("T")[0] : "";

        const orderData = {
            product_id: selectedProduct,
            quantity,
            order_deadline: formattedOrderDeadline  // Poprawna nazwa pola!
        };

        console.log("Dane do wysłania:", orderData);  // Sprawdzenie poprawności danych przed wysłaniem

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
