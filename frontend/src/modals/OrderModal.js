import React, { useState, useEffect } from 'react';

function OrderModal({
    isOpen,
    onClose,
    onSave,
    initialData,
    products,
    warehouses
}) {
    const [orderId, setOrderId] = useState(null);
    const [selectedProduct, setSelectedProduct] = useState('');
    const [quantity, setQuantity] = useState('');
    const [orderDeadline, setOrderDeadline] = useState('');
    const [note, setNote] = useState('');
    const [status, setStatus] = useState('to_produce');
    const [selectedWarehouse, setSelectedWarehouse] = useState('');

    // Adres klienta
    const [clientAddressId, setClientAddressId] = useState(null);
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
            setNote(initialData.note || '');
            setStatus(initialData.status || 'to_produce');
            setSelectedWarehouse(initialData.warehouse?.id || '');

            // Adres klienta
            const addr = initialData.client_address || {};
            setClientAddressId(addr.id || null);
            setStreet(addr.street || '');
            setCity(addr.city || '');
            setCountry(addr.country || '');
            setPostalCode(addr.postal_code || '');
            setAddressNote(addr.note || '');
        } else {
            setOrderId(null);
            setSelectedProduct('');
            setQuantity('');
            setOrderDeadline('');
            setNote('');
            setStatus('to_produce');
            setSelectedWarehouse('');

            setClientAddressId(null);
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
            note,
            status,
            warehouse_id: selectedWarehouse,
            client_address: {
                id: clientAddressId,
                street,
                city,
                country,
                postal_code: postalCode,
                note: addressNote
            }
        };
        onSave(orderData);
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>{orderId ? 'Edytuj zamówienie' : 'Dodaj nowe zamówienie'}</h2>
                <form onSubmit={handleSubmit}>
                    <label>Produkt:</label>
                    <select
                        value={selectedProduct}
                        onChange={(e) => setSelectedProduct(e.target.value)}
                        required
                    >
                        <option value="">Wybierz produkt</option>
                        {products.map(product => (
                            <option key={product.id} value={product.id}>
                                {product.name}
                            </option>
                        ))}
                    </select>

                    <label>Magazyn (opcjonalny):</label>
                    <select
                        value={selectedWarehouse}
                        onChange={(e) => setSelectedWarehouse(e.target.value)}
                    >
                        <option value="">Brak</option>
                        {warehouses.map(wh => (
                            <option key={wh.id} value={wh.id}>
                                {wh.name}
                            </option>
                        ))}
                    </select>

                    <label>Ilość (np. "10kg"):</label>
                    <input
                        type="text"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        required
                    />

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
                        required
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

                    <hr />
                    <h4>Adres klienta</h4>
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
                    <label>Notatki (adres klienta):</label>
                    <textarea
                        value={addressNote}
                        onChange={(e) => setAddressNote(e.target.value)}
                    />

                    <button type="submit">Zapisz</button>
                    <button type="button" onClick={onClose}>Anuluj</button>
                </form>
            </div>
        </div>
    );
}

export default OrderModal;
