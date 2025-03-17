import React, { useState, useEffect } from 'react';

function DemandModal({ 
    isOpen, 
    onClose, 
    onSave, 
    initialData, 
    products, 
    warehouses 
}) {
    const [selectedProduct, setSelectedProduct] = useState('');
    const [quantity, setQuantity] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [note, setNote] = useState('');
    const [selectedWarehouse, setSelectedWarehouse] = useState('');

    useEffect(() => {
        if (initialData) {
            setSelectedProduct(initialData.product?.id || '');
            setQuantity(initialData.quantity || '');
            setDueDate(initialData.due_date || '');
            setNote(initialData.note || '');
            setSelectedWarehouse(initialData.warehouse?.id || '');
        } else {
            setSelectedProduct('');
            setQuantity('');
            setDueDate('');
            setNote('');
            setSelectedWarehouse('');
        }
    }, [initialData]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const demandData = {
            id: initialData?.id || null,
            product_id: selectedProduct,
            quantity,
            due_date: dueDate,
            note,
            warehouse_id: selectedWarehouse
        };
        onSave(demandData);
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>
                    {initialData ? 'Edytuj zapotrzebowanie' : 'Zgłoś zapotrzebowanie'}
                </h2>
                <form onSubmit={handleSubmit}>
                    <label>Produkt:</label>
                    <select 
                        value={selectedProduct} 
                        onChange={(e) => setSelectedProduct(e.target.value)} 
                        required
                    >
                        <option value="">Wybierz produkt</option>
                        {products.map(product => (
                            <option key={product.id} value={product.id}>{product.name}</option>
                        ))}
                    </select>

                    <label>Magazyn docelowy:</label>
                    <select 
                        value={selectedWarehouse} 
                        onChange={(e) => setSelectedWarehouse(e.target.value)} 
                        required
                    >
                        <option value="">Wybierz magazyn</option>
                        {warehouses.map(wh => (
                            <option key={wh.id} value={wh.id}>{wh.name}</option>
                        ))}
                    </select>

                    <label>Ilość:</label>
                    <input 
                        type="text" 
                        value={quantity} 
                        onChange={(e) => setQuantity(e.target.value)} 
                        required 
                    />

                    <label>Termin realizacji:</label>
                    <input 
                        type="date" 
                        value={dueDate} 
                        onChange={(e) => setDueDate(e.target.value)} 
                        required 
                    />

                    <label>Notatki:</label>
                    <textarea 
                        value={note} 
                        onChange={(e) => setNote(e.target.value)} 
                    />

                    <button type="submit">Zapisz</button>
                    <button type="button" onClick={onClose}>Anuluj</button>
                </form>
            </div>
        </div>
    );
}

export default DemandModal;
