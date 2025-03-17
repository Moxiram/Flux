import React, { useState, useEffect } from "react";

function DeliveryModal({ 
    isOpen, 
    onClose, 
    onSave, 
    initialData, 
    orders, 
    demands, 
    warehouses 
}) {
    const [deliveryType, setDeliveryType] = useState("order");
    const [deliveredQuantity, setDeliveredQuantity] = useState("");
    const [note, setNote] = useState("");
    const [orderId, setOrderId] = useState("");
    const [demandId, setDemandId] = useState("");
    const [sourceWarehouseId, setSourceWarehouseId] = useState("");
    const [destWarehouseId, setDestWarehouseId] = useState("");

    useEffect(() => {
        if (initialData) {
            setDeliveryType(initialData.delivery_type || "order");
            setDeliveredQuantity(initialData.delivered_quantity || "");
            setNote(initialData.note || "");

            // order i demand mogą być null
            setOrderId(initialData.order?.id || "");
            setDemandId(initialData.demand?.id || "");

            setSourceWarehouseId(initialData.source_warehouse?.id || "");
            setDestWarehouseId(initialData.destination_warehouse?.id || "");
        } else {
            setDeliveryType("order");
            setDeliveredQuantity("");
            setNote("");
            setOrderId("");
            setDemandId("");
            setSourceWarehouseId("");
            setDestWarehouseId("");
        }
    }, [initialData]);

    const handleSubmit = (e) => {
        e.preventDefault();

        const deliveryData = {
            id: initialData?.id || null,
            delivery_type: deliveryType,
            delivered_quantity: deliveredQuantity,
            note
        };

        // w zależności od delivery_type przypisujemy order_id lub demand_id
        if (deliveryType === "order") {
            deliveryData.order_id = orderId || null;
            deliveryData.demand_id = null;
        } else if (deliveryType === "demand") {
            deliveryData.demand_id = demandId || null;
            deliveryData.order_id = null;
        }

        deliveryData.source_warehouse_id = sourceWarehouseId || null;
        deliveryData.destination_warehouse_id = destWarehouseId || null;

        onSave(deliveryData);
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>{initialData ? "Edytuj dostawę" : "Dodaj nową dostawę"}</h2>
                <form onSubmit={handleSubmit}>
                    <label>Typ dostawy:</label>
                    <select 
                        value={deliveryType} 
                        onChange={(e) => setDeliveryType(e.target.value)} 
                        required
                    >
                        <option value="order">Dostawa zamówienia</option>
                        <option value="demand">Dostawa zapotrzebowania</option>
                    </select>

                    {deliveryType === "order" && (
                        <>
                            <label>Powiązane zamówienie:</label>
                            <select 
                                value={orderId} 
                                onChange={(e) => setOrderId(e.target.value)}
                            >
                                <option value="">Wybierz zamówienie</option>
                                {orders.map(order => (
                                    <option key={order.id} value={order.id}>
                                        {`Zamówienie #${order.id} - ${order.product.name}`}
                                    </option>
                                ))}
                            </select>
                        </>
                    )}

                    {deliveryType === "demand" && (
                        <>
                            <label>Powiązane zapotrzebowanie:</label>
                            <select 
                                value={demandId} 
                                onChange={(e) => setDemandId(e.target.value)}
                            >
                                <option value="">Wybierz zapotrzebowanie</option>
                                {demands.map(demand => (
                                    <option key={demand.id} value={demand.id}>
                                        {`Zapotrzebowanie #${demand.id} - ${demand.product.name}`}
                                    </option>
                                ))}
                            </select>
                        </>
                    )}

                    <label>Magazyn źródłowy (opcjonalny):</label>
                    <select 
                        value={sourceWarehouseId} 
                        onChange={(e) => setSourceWarehouseId(e.target.value)}
                    >
                        <option value="">Brak</option>
                        {warehouses.map(wh => (
                            <option key={wh.id} value={wh.id}>{wh.name}</option>
                        ))}
                    </select>

                    <label>Magazyn docelowy (opcjonalny):</label>
                    <select 
                        value={destWarehouseId} 
                        onChange={(e) => setDestWarehouseId(e.target.value)}
                    >
                        <option value="">Brak</option>
                        {warehouses.map(wh => (
                            <option key={wh.id} value={wh.id}>{wh.name}</option>
                        ))}
                    </select>

                    <label>Ilość dostarczona:</label>
                    <input 
                        type="text" 
                        value={deliveredQuantity} 
                        onChange={(e) => setDeliveredQuantity(e.target.value)} 
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

export default DeliveryModal;
