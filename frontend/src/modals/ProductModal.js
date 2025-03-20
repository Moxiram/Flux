import React, { useState, useEffect } from "react";

function ProductModal({ 
    isOpen, 
    onClose, 
    onSave, 
    initialData,
    warehouses = [] // <-- domyślnie pusta tablica
}) {
    // Pola produktu
    const [productId, setProductId] = useState(null);
    const [name, setName] = useState("");
    const [type, setType] = useState("");
    const [note, setNote] = useState("");

    // Pola stock
    const [stockId, setStockId] = useState(null);
    const [selectedWarehouse, setSelectedWarehouse] = useState("");
    const [quantity, setQuantity] = useState("");

    useEffect(() => {
        if (initialData) {
            setProductId(initialData.id || null);
            setName(initialData.name || "");
            setType(initialData.type || "");
            setNote(initialData.note || "");

            const st = initialData.stock || {};
            setStockId(st.id || null);
            setSelectedWarehouse(st.warehouse?.id || "");
            setQuantity(st.quantity || "");
        } else {
            setProductId(null);
            setName("");
            setType("");
            setNote("");

            setStockId(null);
            setSelectedWarehouse("");
            setQuantity("");
        }
    }, [initialData]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const productData = {
            id: productId,
            name,
            type,
            note,
            stock: {
                id: stockId,
                warehouse_id: selectedWarehouse || null,
                quantity
            }
        };
        onSave(productData);
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>{productId ? "Edytuj produkt" : "Dodaj nowy produkt"}</h2>
                <form onSubmit={handleSubmit}>
                    <label>Nazwa produktu:</label>
                    <input 
                        type="text" 
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />

                    <label>Typ produktu (np. surowiec, wyrób gotowy):</label>
                    <input
                        type="text"
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                    />

                    <label>Notatki (produkt):</label>
                    <textarea
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                    />

                    <hr />
                    <h4>Stan magazynowy (Stock)</h4>
                    <label>Magazyn:</label>
                    <select
                        value={selectedWarehouse}
                        onChange={(e) => setSelectedWarehouse(e.target.value)}
                    >
                        <option value="">Brak</option>
                        {warehouses.map((wh) => (
                            <option key={wh.id} value={wh.id}>
                                {wh.name}
                            </option>
                        ))}
                    </select>

                    <label>Ilość (np. "100kg"):</label>
                    <input
                        type="text"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                    />

                    <button type="submit" style={{ marginTop: "1rem" }}>
                        {productId ? "Zapisz zmiany" : "Dodaj produkt"}
                    </button>
                    <button type="button" onClick={onClose}>Anuluj</button>
                </form>
            </div>
        </div>
    );
}

export default ProductModal;
