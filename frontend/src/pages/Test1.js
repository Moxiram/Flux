import React, { useState } from "react";
import axios from "axios";

// Przykładowe słowniki do generowania
const STREETS = ["Kwiatowa", "Leśna", "Słoneczna", "Lipowa", "Kolejowa", "Polna"];
const CITIES = ["Warszawa", "Kraków", "Gdańsk", "Wrocław", "Poznań", "Łódź"];
const COUNTRIES = ["Polska", "Niemcy", "Czechy", "Słowacja", "Ukraina"];
const PRODUCT_NAMES = ["Śrubki", "Nakładki", "Panele", "Farba", "Zawiasy", "Materiały"];
const PRODUCT_TYPES = ["surowiec", "półprodukt", "wyrób gotowy"];
const STATUS_CHOICES = ["to_produce", "ready", "shipped"];
const DELIVERY_TYPES = ["order", "demand"];

function GenerateDataPage() {
  const [count, setCount] = useState(10); // domyślna liczba wierszy
  const [isGenerating, setIsGenerating] = useState(false);
  const [log, setLog] = useState(""); // Podgląd postępów

  // Losowanie elementu z tablicy
  const randomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];
  // Losowanie np. int z zakresu
  const randomInt = (min, max) => min + Math.floor(Math.random() * (max - min + 1));
  // Prosty generator dat
  const randomDateString = () => {
    let now = new Date();
    now.setDate(now.getDate() + randomInt(0, 30));
    return now.toISOString().split("T")[0]; // YYYY-MM-DD
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    setLog("Rozpoczęto generowanie danych...\n");

    try {
      // 1) TWORZYMY ADDRESSES
      let addresses = [];
      for (let i = 0; i < count; i++) {
        let payload = {
          street: randomItem(STREETS) + " " + randomInt(1, 99),
          city: randomItem(CITIES),
          country: randomItem(COUNTRIES),
          postal_code: String(randomInt(10000, 99999)),
          note: "Auto-generated"
        };
        let res = await axios.post("http://127.0.0.1:8000/api/addresses/", payload);
        addresses.push(res.data);
        setLog(prev => prev + `[#${i+1}] Dodano Address id=${res.data.id}\n`);
      }

      // 2) TWORZYMY WAREHOUSES
      // Zrobimy ok. count/2 magazynów
      let warehouses = [];
      let whCount = Math.max(1, Math.floor(count / 2));
      for (let i = 0; i < whCount; i++) {
        let addr = addresses[randomInt(0, addresses.length-1)];
        let payload = {
          name: "Warehouse_" + randomInt(100,999),
          note: "Auto-gen warehouse",
          address_id: addr.id // przypiszemy 1 do 1?
        };
        let res = await axios.post("http://127.0.0.1:8000/api/warehouses/", payload);
        warehouses.push(res.data);
        setLog(prev => prev + `[#${i+1}] Dodano Warehouse id=${res.data.id}\n`);
      }

      // 3) TWORZYMY PRODUCTS
      let products = [];
      for (let i = 0; i < count; i++) {
        let payload = {
          name: randomItem(PRODUCT_NAMES) + "_" + randomInt(100,999),
          type: Math.random() > 0.5 ? randomItem(PRODUCT_TYPES) : null,
          note: "Auto-generated product"
        };
        let res = await axios.post("http://127.0.0.1:8000/api/products/", payload);
        products.push(res.data);
        setLog(prev => prev + `[#${i+1}] Dodano Product id=${res.data.id}\n`);
      }

      // 4) TWORZYMY DEMANDS (Zapotrzebowania)
      // Wymaga product_id i warehouse_id
      let demands = [];
      let demCount = Math.max(1, Math.floor(count / 3)); // np. 1/3 z count
      for (let i = 0; i < demCount; i++) {
        let p = products[randomInt(0, products.length-1)];
        let wh = warehouses[randomInt(0, warehouses.length-1)];
        let payload = {
          product_id: p.id,
          warehouse_id: wh.id,
          quantity: randomInt(1, 100) + " szt",
          due_date: randomDateString(),
          note: "Auto-gen demand"
        };
        let res = await axios.post("http://127.0.0.1:8000/api/demands/", payload);
        demands.push(res.data);
        setLog(prev => prev + `[#${i+1}] Dodano Demand id=${res.data.id}\n`);
      }

      // 5) TWORZYMY ORDERS
      // Wymaga product_id i client_address_id (oraz ewentualnie warehouse_id)
      let orders = [];
      for (let i = 0; i < count; i++) {
        let p = products[randomInt(0, products.length-1)];
        let addr = addresses[randomInt(0, addresses.length-1)];
        let w = Math.random() < 0.6 ? warehouses[randomInt(0, warehouses.length-1)] : null;
        let payload = {
          product_id: p.id,
          client_address_id: addr.id,
          quantity: randomInt(1,50) + "kg",
          order_deadline: randomDateString(),
          status: randomItem(STATUS_CHOICES),
          note: "Auto-gen order"
        };
        if (w) {
          payload.warehouse_id = w.id;
        }
        let res = await axios.post("http://127.0.0.1:8000/api/orders/", payload);
        orders.push(res.data);
        setLog(prev => prev + `[#${i+1}] Dodano Order id=${res.data.id}\n`);
      }

      // 6) TWORZYMY DELIVERIES
      // Wymaga: delivery_type = 'order' lub 'demand'
      // jeśli 'order' => order_id,
      // jeśli 'demand' => demand_id
      // plus delivered_quantity, optional source/dest warehouse
      // Zrobimy np. count/2
      let deliveries = [];
      let delCount = Math.max(1, Math.floor(count / 2));
      for (let i = 0; i < delCount; i++) {
        let dtype = randomItem(DELIVERY_TYPES);
        let payload = {
          delivery_type: dtype,
          delivered_quantity: randomInt(1,100) + " szt",
          note: "Auto-gen delivery"
        };
        // przypiszemy source_warehouse i destination_warehouse (losowo)
        let sw = Math.random() < 0.5 ? warehouses[randomInt(0, warehouses.length-1)] : null;
        let dw = Math.random() < 0.5 ? warehouses[randomInt(0, warehouses.length-1)] : null;
        if (sw && dw && sw.id !== dw.id) {
          payload.source_warehouse_id = sw.id;
          payload.destination_warehouse_id = dw.id;
        }

        if (dtype === "order") {
          // potrafi  być np. random order
          let ord = orders[randomInt(0, orders.length-1)];
          payload.order_id = ord.id;
        } else {
          if (demands.length > 0) {
            let dmd = demands[randomInt(0, demands.length-1)];
            payload.demand_id = dmd.id;
          } else {
            // jeśli nie mamy demands, wrzucamy cokolwiek
            payload.delivery_type = "order";
            let ord = orders[randomInt(0, orders.length-1)];
            payload.order_id = ord.id;
          }
        }
        let res = await axios.post("http://127.0.0.1:8000/api/deliveries/", payload);
        deliveries.push(res.data);
        setLog(prev => prev + `[#${i+1}] Dodano Delivery id=${res.data.id}, type=${res.data.delivery_type}\n`);
      }

      setLog(prev => prev + "Generowanie zakończone!\n");
    } catch (error) {
      console.error("Błąd generowania danych:", error);
      setLog(prev => prev + "Błąd generowania danych\n");
      alert("Błąd generowania! Szczegóły w konsoli.");
    }

    setIsGenerating(false);
  };

  const handleDeleteAll = async () => {
    if (!window.confirm("Na pewno chcesz usunąć wszystkie dane z bazy?")) {
      return;
    }
    setLog("Usuwanie wszystkich danych...\n");
    try {
      // Lepiej mieć dedykowany endpoint, ale w ramach przykładu
      // usuwamy w kolejności odwrotnej do kluczy obcych:
      // deliveries -> orders -> demands -> stocks -> warehouses -> products -> addresses
      let endpoints = ["deliveries", "orders", "demands", "stocks", "warehouses", "products", "addresses"];

      for (let ep of endpoints) {
        let getRes = await axios.get(`http://127.0.0.1:8000/api/${ep}/`);
        let items = getRes.data;
        for (let item of items) {
          await axios.delete(`http://127.0.0.1:8000/api/${ep}/${item.id}/`);
          setLog(prev => prev + `Usunięto ${ep.slice(0,-1)} #${item.id}\n`);
        }
      }

      setLog(prev => prev + "Wszystkie dane usunięte!\n");
    } catch (error) {
      console.error("Błąd usuwania danych:", error);
      setLog(prev => prev + "Błąd usuwania danych\n");
      alert("Błąd usuwania! Szczegóły w konsoli.");
    }
  };

  return (
    <div style={{ padding: "1rem" }}>
      <h2>Generator danych testowych</h2>

      <div style={{ marginBottom: "1rem" }}>
        <label>Liczba rekordów (addresses, products, orders...): </label>
        <input 
          type="number" 
          value={count} 
          onChange={(e) => setCount(parseInt(e.target.value) || 10)} 
          min={1}
          style={{ width: "80px", marginLeft: "0.5rem" }}
        />
        <button 
          onClick={handleGenerate} 
          disabled={isGenerating} 
          style={{ marginLeft: "1rem" }}
        >
          Generuj dane
        </button>
        <button 
          onClick={handleDeleteAll} 
          style={{ marginLeft: "1rem", background: "red", color: "#fff" }}
        >
          Usuń wszystkie dane
        </button>
      </div>

      <pre 
        style={{
          background: "#eee",
          padding: "1rem",
          maxHeight: "300px",
          overflow: "auto"
        }}
      >
        {log}
      </pre>
    </div>
  );
}

export default GenerateDataPage;