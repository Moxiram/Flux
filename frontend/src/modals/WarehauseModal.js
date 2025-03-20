import React, { useState, useEffect } from 'react';

function WarehouseModal({ isOpen, onClose, onSave, initialData }) {
    // Pola dotyczące Warehouse
    const [warehouseId, setWarehouseId] = useState(null);
    const [name, setName] = useState('');
    const [note, setNote] = useState('');

    // Pola dotyczące Address
    const [addressId, setAddressId] = useState(null);
    const [street, setStreet] = useState('');
    const [city, setCity] = useState('');
    const [country, setCountry] = useState('');
    const [postalCode, setPostalCode] = useState('');
    const [addressNote, setAddressNote] = useState('');

    useEffect(() => {
        if (initialData) {
            // Ustawiamy wartości Warehouse
            setWarehouseId(initialData.id || null);
            setName(initialData.name || '');
            setNote(initialData.note || '');

            // Ustawiamy wartości Address (może być pusty, jeśli warehouse.address == null)
            const addr = initialData.address || {};
            setAddressId(addr.id || null);
            setStreet(addr.street || '');
            setCity(addr.city || '');
            setCountry(addr.country || '');
            setPostalCode(addr.postal_code || '');
            setAddressNote(addr.note || '');
        } else {
            // Reset – nowy magazyn
            setWarehouseId(null);
            setName('');
            setNote('');

            // Reset – nowy adres
            setAddressId(null);
            setStreet('');
            setCity('');
            setCountry('');
            setPostalCode('');
            setAddressNote('');
        }
    }, [initialData]);

    const handleSubmit = (e) => {
        e.preventDefault();

        // Obiekt, który wyślemy do API
        // Zgodnie z WarehouseSerializer (adres zagnieżdżony)
        const warehouseData = {
            id: warehouseId,
            name,
            note,
            address: {
                id: addressId,
                street,
                city,
                country,
                postal_code: postalCode,
                note: addressNote
            }
        };

        // Wywołanie onSave – np. handleSave w App.js
        onSave(warehouseData);
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>{warehouseId ? 'Edytuj magazyn' : 'Dodaj nowy magazyn'}</h2>
                <form onSubmit={handleSubmit}>
                    {/* Sekcja Warehouse */}
                    <label>Nazwa magazynu:</label>
                    <input 
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />

                    <label>Notatki (magazyn):</label>
                    <textarea
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                    />

                    <hr />
                    <h4>Adres magazynu</h4>

                    <label>Ulica:</label>
                    <input
                        type="text"
                        value={street}
                        onChange={(e) => setStreet(e.target.value)}
                    />

                    <label>Miasto:</label>
                    <input
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                    />

                    <label>Kraj:</label>
                    <input
                        type="text"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                    />

                    <label>Kod pocztowy:</label>
                    <input
                        type="text"
                        value={postalCode}
                        onChange={(e) => setPostalCode(e.target.value)}
                    />

                    <label>Notatki (adres):</label>
                    <textarea
                        value={addressNote}
                        onChange={(e) => setAddressNote(e.target.value)}
                    />

                    <button type="submit" style={{ marginTop: "1rem" }}>
                        Zapisz
                    </button>
                    <button type="button" onClick={onClose}>
                        Anuluj
                    </button>
                </form>
            </div>
        </div>
    );
}

export default WarehouseModal;
