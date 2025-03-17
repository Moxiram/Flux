import React, { useState, useEffect } from 'react';

function OrderDeliveryModal({ isOpen, onClose, onSave, initialData, warehouses, orders }) {
    const [selectedOrder, setSelectedOrder] = useState('');
    const [deliveredQuantity, setDeliveredQuantity] = useState('');
    const [note, setNote] = useState('');
    const [sourceWarehouse, setSourceWarehouse] = useState('');

    useEffect(() => {
        if (initialData) {
            setSelectedOrder(initialData.target_object?.id || '');
            setDeliveredQuantity(initialData.delivered_quantity || '');
            setNote(initialData.note || '');
            setSourceWarehouse(initialData.source_warehouse?.id || '');
        }
    }, [initialData]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const deliveryData = {
            delivery_type: 'order',
            object_id: selectedOrder,
            delivered_quantity: deliveredQuantity,
            note,
            source_warehouse: sourceWarehouse
        };
        onSave(deliveryData);
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Dodaj dostawę zamówienia</h2>
                <form onSubmit={handleSubmit}>
                    <label>Zamówienie:</label>
                    <select value={selectedOrder} onChange={(e) => setSelectedOrder(e.target.value)} required>
                        <option value="">Wybierz zamówienie</option>
                        {orders.map(order => (
                            <option key={order.id} value={order.id}>{order.product.name} ({order.quantity})</option>
                        ))}
                    </select>

                    <label>Magazyn:</label>
                    <select value={sourceWarehouse} onChange={(e) => setSourceWarehouse(e.target.value)} required>
                        <option value="">Wybierz magazyn</option>
                        {warehouses.map(warehouse => (
                            <option key={warehouse.id} value={warehouse.id}>{warehouse.name}</option>
                        ))}
                    </select>

                    <label>Ilość dostarczona:</label>
                    <input type="text" value={deliveredQuantity} onChange={(e) => setDeliveredQuantity(e.target.value)} required />

                    <label>Notatki:</label>
                    <textarea value={note} onChange={(e) => setNote(e.target.value)} />

                    <button type="submit">Zapisz</button>
                    <button type="button" onClick={onClose}>Anuluj</button>
                </form>
            </div>
        </div>
    );
}

export default OrderDeliveryModal;
