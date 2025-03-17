import React, { useState, useEffect } from 'react';

/**
 * @param {Array} addresses – lista adresów (zawierają id, street, city, etc.)
 * @param {Function} onSave – wywoływane przy zapisie, np. (orderData) => { ... }
 * @param {Function} onClose – zamyka modal
 * @param {Object} initialData – wczytanie do edycji, np. { id, product, quantity, client_address: { id, ... } }
 * @param {Array} products – lista produktów do wyboru
 * @param {Array} warehouses – lista magazynów do wyboru (opcjonalnie)
 */
function OrderModalWithAddressChoice({
    isOpen,
    onClose,
    onSave,
    initialData,
    addresses,
    products,
    warehouses
}) {
    // Pola zamówienia
    const [orderId, setOrderId] = useState(null);
    const [selectedProduct, setSelectedProduct] = useState('');
    const [quantity, setQuantity] = useState('');
    const [orderDeadline, setOrderDeadline] = useState('');
    const [status, setStatus] = useState('to_produce');
    const [note, setNote] = useState('');

    // Pola magazynu (opcjonalne)
    const [selectedWarehouse, setSelectedWarehouse] = useState('');

    // Mechanika adresu
    const [useExistingAddress, setUseExistingAddress] = useState(true); // domyślnie wybieramy z listy
    const [selectedAddressId, setSelectedAddressId] = useState('');
    
    // Pola nowego adresu (jeśli chcemy dodać in-line)
    const [newAddressId, setNewAddressId] = useState(null);  // przy edycji
    const [street, setStreet] = useState('');
    const [city, setCity] = useState('');
    const [country, setCountry] = useState('');
    const [postalCode, setPostalCode] = useState('');
    const [addressNote, setAddressNote] = useState('');

    useEffect(() => {
        if (initialData) {
            setOrderId(initialData.id || null);
            setSelectedProduct(initialData.product?.id || '');
            setQuantity(initialData.quantity || '');
            setOrderDeadline(initialData.order_deadline || '');
            setStatus(initialData.status || 'to_produce');
            setNote(initialData.note || '');
            setSelectedWarehouse(initialData.warehouse?.id || '');

            // Adres klienta
            const addr = initialData.client_address;
            if (addr && addr.id) {
                // Istniejący adres
                setUseExistingAddress(true);
                setSelectedAddressId(addr.id);
                // Ale gdyby user chciał edytować in-line:
                setNewAddressId(addr.id); 
                setStreet(addr.street || '');
                setCity(addr.city || '');
                setCountry(addr.country || '');
                setPostalCode(addr.postal_code || '');
                setAddressNote(addr.note || '');
            } else {
                // Brak adresu
                setUseExistingAddress(true);
                setSelectedAddressId('');
                setNewAddressId(null);
                setStreet('');
                setCity('');
                setCountry('');
                setPostalCode('');
                setAddressNote('');
            }
        } else {
            // Reset
            setOrderId(null);
            setSelectedProduct('');
            setQuantity('');
            setOrderDeadline('');
            setStatus('to_produce');
            setNote('');
            setSelectedWarehouse('');

            setUseExistingAddress(true);
            setSelectedAddressId('');
            setNewAddressId(null);
            setStreet('');
            setCity('');
            setCountry('');
            setPostalCode('');
            setAddressNote('');
        }
    }, [initialData]);

    const handleSubmit = (e) => {
        e.preventDefault();
        
        const orderData = {
            id: orderId,
            product_id: selectedProduct,
            quantity,
            order_deadline: orderDeadline,
            status,
            note,
            warehouse_id: selectedWarehouse || null
        };

        if (useExistingAddress && selectedAddressId) {
            // Używamy istniejącego adresu
            orderData.client_address_id = selectedAddressId;
        } else {
            // Tworzymy / edytujemy adres w tym samym request
            orderData.client_address = {
                id: newAddressId, // w razie edycji
                street,
                city,
                country,
                postal_code: postalCode,
                note: addressNote
            };
        }
        
        onSave(orderData);
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>
                    {orderId ? "Edytuj zamówienie" : "Dodaj nowe zamówienie"}
                </h2>
                <form onSubmit={handleSubmit}>

                    {/* PODSTAWOWE DANE ZAMÓWIENIA */}
                    <label>Produkt:</label>
                    <select
                        value={selectedProduct}
                        onChange={(e) => setSelectedProduct(e.target.value)}
                        required
                    >
                        <option value="">Wybierz produkt</option>
                        {products.map(prod => (
                            <option key={prod.id} value={prod.id}>{prod.name}</option>
                        ))}
                    </select>

                    <label>Ilość (np. "10kg"):</label>
                    <input
                        type="text"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        required
                    />

                    <label>Magazyn (opcjonalnie):</label>
                    <select
                        value={selectedWarehouse}
                        onChange={(e) => setSelectedWarehouse(e.target.value)}
                    >
                        <option value="">Brak</option>
                        {warehouses.map(wh => (
                            <option key={wh.id} value={wh.id}>{wh.name}</option>
                        ))}
                    </select>

                    <label>Termin realizacji:</label>
                    <input
                        type="date"
                        value={orderDeadline}
                        onChange={(e) => setOrderDeadline(e.target.value)}
                        required
                    />

                    <label>Status:</label>
                    <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                    >
                        <option value="to_produce">Do produkcji</option>
                        <option value="ready">Gotowy do wysyłki</option>
                        <option value="shipped">Wysłany</option>
                    </select>

                    <label>Notatki (zamówienie):</label>
                    <textarea
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                    />

                    <hr/>
                    <h4>Adres klienta</h4>

                    {/* PRZEŁĄCZNIK: istniejący czy nowy adres */}
                    <div>
                        <label>
                            <input
                                type="radio"
                                checked={useExistingAddress}
                                onChange={() => setUseExistingAddress(true)}
                            />
                            Użyj istniejącego adresu
                        </label>
                        <label style={{ marginLeft: "1rem" }}>
                            <input
                                type="radio"
                                checked={!useExistingAddress}
                                onChange={() => setUseExistingAddress(false)}
                            />
                            Dodaj nowy adres
                        </label>
                    </div>

                    {useExistingAddress ? (
                        <>
                            <label>Wybierz adres klienta:</label>
                            <select
                                value={selectedAddressId}
                                onChange={(e) => setSelectedAddressId(e.target.value)}
                            >
                                <option value="">Brak</option>
                                {addresses.map(addr => (
                                    <option key={addr.id} value={addr.id}>
                                        {`${addr.street}, ${addr.city}, ${addr.country}`}
                                    </option>
                                ))}
                            </select>
                        </>
                    ) : (
                        <>
                            {/* Pola nowego adresu */}
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
                        </>
                    )}

                    <button type="submit" style={{ marginTop: "1rem" }}>
                        Zapisz
                    </button>
                    <button type="button" onClick={onClose}>Anuluj</button>
                </form>
            </div>
        </div>
    );
}

export default OrderModalWithAddressChoice;
