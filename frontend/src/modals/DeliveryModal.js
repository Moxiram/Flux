import React, { useState, useEffect } from "react";

function DeliveryModal({ isOpen, onClose, onSave, initialData, orders, demands }) {
    const [deliveryType, setDeliveryType] = useState("order");
    const [targetId, setTargetId] = useState("");
    const [deliveredQuantity, setDeliveredQuantity] = useState("");
    const [note, setNote] = useState("");

    useEffect(() => {
        if (initialData) {
            setDeliveryType(initialData.delivery_type || "order");
            setTargetId(initialData.target_id || "");
            setDeliveredQuantity(initialData.delivered_quantity || "");
            setNote(initialData.note || "");
        } else {
            setDeliveryType("order");
            setTargetId("");
            setDeliveredQuantity("");
            setNote("");
        }
    }, [initialData]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const deliveryData = {
            id: initialData?.id || null,
            delivery_type: deliveryType,
            target_id: targetId,
            delivered_quantity: deliveredQuantity,
            note
        };
        onSave(deliveryData);
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>{initialData ? "Edytuj dostawę" : "Dodaj nową dostawę"}</h2>
                <form onSubmit={handleSubmit}>
                    <label>Typ dostawy:</label>
                    <select value={deliveryType} onChange={(e) => setDeliveryType(e.target.value)} required>
                        <option value="order">Dostawa zamówienia</option>
                        <option value="demand">Dostawa zapotrzebowania</option>
                    </select>

                    <label>Wybierz docelowy obiekt:</label>
                    <select value={targetId} onChange={(e) => setTargetId(e.target.value)} required>
                        <option value="">Wybierz...</option>
                        {deliveryType === "order"
                            ? orders.map(order => (
                                <option key={order.id} value={order.id}>
                                    {`Zamówienie #${order.id} - ${order.product.name}`}
                                </option>
                            ))
                            : demands.map(demand => (
                                <option key={demand.id} value={demand.id}>
                                    {`Zapotrzebowanie #${demand.id} - ${demand.product.name}`}
                                </option>
                            ))
                        }
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

export default DeliveryModal;
