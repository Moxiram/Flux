import React, { useState, useEffect } from 'react';

function ProductModal({ isOpen, onClose, onSave, initialData, warehouses }) {
    const [name, setName] = useState('');
    const [quantity, setQuantity] = useState('');
    const [type, setType] = useState('');
    const [warehouse, setWarehouse] = useState('');
    const [note, setNote] = useState('');

    useEffect(() => {
        if (initialData) {
            setName(initialData.name || '');
            setQuantity(initialData.quantity || '');
            setType(initialData.type || '');
            setWarehouse(initialData.warehouse?.id || '');
            setNote(initialData.note || '');
        }
    }, [initialData]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const productData = {
            name,
            quantity,
            type,
            warehouse_id: warehouse || null,
            note
        };
        onSave(productData);
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>{initialData ? 'Edytuj produkt' : 'Dodaj nowy produkt'}</h2>
                <form onSubmit={handleSubmit}>
                    <label>Nazwa:</label>
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />

                    <label>Ilość:</label>
                    <input type="text" value={quantity} onChange={(e) => setQuantity(e.target.value)} required />

                    <label>Typ produktu:</label>
                    <input type="text" value={type} onChange={(e) => setType(e.target.value)} />

                    <label>Magazyn:</label>
                    <select value={warehouse} onChange={(e) => setWarehouse(e.target.value)}>
                        <option value="">Brak</option>
                        {warehouses.map(wh => (
                            <option key={wh.id} value={wh.id}>{wh.name}</option>
                        ))}
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

export default ProductModal;
