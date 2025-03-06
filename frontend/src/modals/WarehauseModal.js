import React, { useState, useEffect } from 'react';

function WarehouseModal({ isOpen, onClose, onSave, initialData }) {
    const [name, setName] = useState('');
    const [location, setLocation] = useState('');
    const [note, setNote] = useState('');

    useEffect(() => {
        if (initialData) {
            setName(initialData.name || '');
            setLocation(initialData.location || '');
            setNote(initialData.note || '');
        }
    }, [initialData]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const warehouseData = {
            id: initialData?.id || null,  // Kluczowe dla edycji
            name,
            location,
            note
        };

        console.log("Wysyłane dane magazynu:", warehouseData); // Sprawdzenie danych w konsoli
        onSave(warehouseData);
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>{initialData ? 'Edytuj magazyn' : 'Dodaj nowy magazyn'}</h2>
                <form onSubmit={handleSubmit}>
                    <label>Nazwa:</label>
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />

                    <label>Lokalizacja:</label>
                    <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} required />

                    <label>Notatki:</label>
                    <textarea value={note} onChange={(e) => setNote(e.target.value)} />

                    <button type="submit">Zapisz</button>
                    <button type="button" onClick={onClose}>Anuluj</button>
                </form>
            </div>
        </div>
    );
}

export default WarehouseModal;
