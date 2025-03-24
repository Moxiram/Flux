import React, { useState, useEffect } from 'react';
import axios from 'axios';

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
    const [selectedWarehouse, setSelectedWarehouse] = useState('');

    // Mechanika adresu
    const [useExistingAddress, setUseExistingAddress] = useState(true);
    const [selectedAddressId, setSelectedAddressId] = useState('');
    
    // Pola nowego adresu
    const [street, setStreet] = useState('');
    const [city, setCity] = useState('');
    const [country, setCountry] = useState('');
    const [postalCode, setPostalCode] = useState('');
    const [addressNote, setAddressNote] = useState('');

    useEffect(() => {


        if (!initialData) {

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
            setStreet('');
            setCity('');
            setCountry('');
            setPostalCode('');
            setAddressNote('');

            
        } else {
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
                setUseExistingAddress(true);
                setSelectedAddressId(addr.id);
                setStreet(addr.street || '');
                setCity(addr.city || '');
                setCountry(addr.country || '');
                setPostalCode(addr.postal_code || '');
                setAddressNote(addr.note || '');
            } else {
                setUseExistingAddress(true);
                setSelectedAddressId('');
                setStreet('');
                setCity('');
                setCountry('');
                setPostalCode('');
                setAddressNote('');
            }
        }
    }, [initialData]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        

        // Walidacje frontowe
        if (!selectedProduct) {
            alert("Musisz wybrać produkt!");
            return;
        }
        if (useExistingAddress && !selectedAddressId) {
            alert("Musisz wybrać istniejący adres!");
            return;
        }
        if (!useExistingAddress) {
            // Dodajemy nowy adres – sprawdź, czy user wypełnił pola
            if (!street || !city || !country) {
                alert("Wypełnij przynajmniej (ulicę, miasto, kraj) nowego adresu!");
                return;
            }
        }

       

        // Budujemy obiekt zamówienia (bez adresu, bo musimy go stworzyć lub użyć ID)
        let orderData = {
            id: orderId,
            product_id: selectedProduct,
            quantity,
            order_deadline: orderDeadline,
            status,
            note,
            warehouse_id: selectedWarehouse || null
        };

        

        try {
            if (useExistingAddress) {
                // Używamy istniejącego adresu
                orderData.client_address_id = selectedAddressId;
            } else {
                // 1) Tworzymy nowy adres osobnym requestem
                const addressPayload = {
                    street,
                    city,
                    country,
                    postal_code: postalCode,
                    note: addressNote
                };
                const addrRes = await axios.post("http://127.0.0.1:8000/api/addresses/", addressPayload);
                
                // Otrzymaliśmy nowy adres, przypinamy do zamówienia
                const newAddrId = addrRes.data.id;
                orderData.client_address_id = newAddrId;
            }

            // 2) Tworzymy / edytujemy zamówienie
            // Sprawdzamy, czy edycja czy nowy
            if (orderData.id) {
                console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>> final orderData:", orderData)
                await axios.put(`http://127.0.0.1:8000/api/orders/${orderData.id}/`, orderData);
                alert("Zamówienie zaktualizowane!");
            } else {
                console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>> final orderData:", orderData)
                await axios.post("http://127.0.0.1:8000/api/orders/", orderData);
                alert("Zamówienie utworzone!");
            }

            onClose();
        } catch (error) {
            console.error("Błąd podczas tworzenia zamówienia / adresu:", error.response?.data || error);
            let errMsg = "Wystąpił błąd!";
            if (error.response) {
                errMsg = JSON.stringify(error.response.data);
            } else if (error.message) {
                errMsg = error.message;
            }
            alert(errMsg);
        }
        
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>{orderId ? "Edytuj zamówienie" : "Dodaj nowe zamówienie"}</h2>
                <form onSubmit={handleSubmit}>
                    {/* Produkt */}
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
                        {orderId ? "Zapisz zmiany" : "Dodaj zamówienie"}
                    </button>
                    <button type="button" onClick={onClose}>Anuluj</button>
                </form>
            </div>
        </div>
    );
}

export default OrderModalWithAddressChoice;
