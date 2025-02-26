import React, { useState, useEffect } from 'react';

function OrderModal({ isOpen, onClose, onSave, initialData, products }) {
    const [selectedProduct, setSelectedProduct] = useState('');
    const [quantity, setQuantity] = useState('');
    const [orderDeadline, setOrderDeadline] = useState('');

    useEffect(() => {
        if (initialData) {
            setSelectedProduct(initialData.product?.id || '');
            setQuantity(initialData.quantity || '');
            setOrderDeadline(initialData.order_deadline || '');
        }
    }, [initialData]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const orderData = {
            product_id: selectedProduct,
            quantity,
            orderDeadline
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

                    <button type="submit">Zapisz</button>
                    <button type="button" onClick={onClose}>Anuluj</button>
                </form>
            </div>
        </div>
    );
}

export default OrderModal;