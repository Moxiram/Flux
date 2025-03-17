import React, { useState, useEffect } from "react";

function ProductModal({ 
    isOpen, 
    onClose, 
    onSave, 
    initialData 
}) {
    const [id, setId] = useState(null);
    const [name, setName] = useState("");
    const [type, setType] = useState("");
    const [note, setNote] = useState("");

    useEffect(() => {
        if (initialData) {
            setId(initialData.id || null);
            setName(initialData.name || "");
            setType(initialData.type || "");
            setNote(initialData.note || "");
        } else {
            setId(null);
            setName("");
            setType("");
            setNote("");
        }
    }, [initialData]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const productData = {
            id,
            name,
            type,
            note,
        };
        onSave(productData);
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>{id ? "Edytuj produkt" : "Dodaj nowy produkt"}</h2>
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

                    <label>Notatki:</label>
                    <textarea 
                        value={note} 
                        onChange={(e) => setNote(e.target.value)} 
                    />

                    <button type="submit">{id ? "Zapisz zmiany" : "Dodaj produkt"}</button>
                    <button type="button" onClick={onClose}>Anuluj</button>
                </form>
            </div>
        </div>
    );
}

export default ProductModal;
