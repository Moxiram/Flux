import React, { useState } from "react";
import axios from "axios";

// Przykładowe słowniki do generowania (adresy, produkty itp.)
const STREETS = ["Kwiatowa", "Leśna", "Słoneczna", "Lipowa", "Kolejowa", "Polna"];
const CITIES = ["Warszawa", "Kraków", "Gdańsk", "Wrocław", "Poznań", "Łódź"];
const COUNTRIES = ["Polska", "Niemcy", "Czechy", "Norwegia", "Hiszpania"];
const PRODUCT_NAMES = ["Śrubki", "Nakładki", "Panele", "Farba", "Zawiasy", "Materiały"];
const PRODUCT_TYPES = ["surowiec", "półprodukt", "wyrób gotowy"];
const STATUS_CHOICES = ["to_produce", "ready", "shipped"];
const DELIVERY_TYPES = ["order", "demand"];

// magazyny testowe - magazynów nie generujemy
const TEST_WAREHOUSE_NAMES = ["Magazyn1", "Magazyn2", "Magazyn3"];

function GenerateDataPage() {
  const [count, setCount] = useState(10); // domyślna liczba wierszy
  const [isGenerating, setIsGenerating] = useState(false);
  const [log, setLog] = useState(""); // Podgląd postępów

  // Losowania
  const randomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];
  const randomInt = (min, max) => min + Math.floor(Math.random() * (max - min + 1));
  // generator dat (dziś+kilka dni)
  const randomDateString = () => {
    let now = new Date();
    now.setDate(now.getDate() + randomInt(0, 30));
    return now.toISOString().split("T")[0]; // YYYY-MM-DD
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    setLog("Rozpoczęto generowanie danych...\n");

    try {
      // 1) POBIERAMY te 3 testowe magazyny 
      setLog(prev => prev + "Pobieramy trzy testowe magazyny...\n");
      const whRes = await axios.get("http://127.0.0.1:8000/api/warehouses/");
      // Filtrowanie jeśli istnieją jakies inne - mioże kiedyś wszystkie tu będe ładował ale były z tym błędy
      let warehouses = whRes.data.filter(w => TEST_WAREHOUSE_NAMES.includes(w.name));
      if (warehouses.length < 1) {
        setLog(prev => prev + "Nie znaleziono żadnego magazynu z listy [Magazyn1, Magazyn2, Magazyn3]!\n");
        setIsGenerating(false);
        return;
      }
      setLog(prev => prev + `Znaleziono ${warehouses.length} magazyn(y) testowe.\n`);

      // 2) generator adresów
      let addresses = [];
      setLog(prev => prev + "Generowanie adresów...\n");
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

      // 3) generator produktów
      let products = [];
      setLog(prev => prev + "Generowanie produktów...\n");
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

      // 4) generator zamóień
      // Wymaga product_id, client_address_id (opcjonalnie warehouse_id)
      let orders = [];
      setLog(prev => prev + "Generowanie zamówień...\n");
      for (let i = 0; i < count; i++) {
        // Losowy produkt
        let p = products[randomInt(0, products.length-1)];
        // Losowy adres
        let addr = addresses[randomInt(0, addresses.length-1)];
        // Losowy magazyn (z 3 testowych) z 60% prawdopodobieństwem
        let w = Math.random() < 0.6 
          ? warehouses[randomInt(0, warehouses.length-1)] 
          : null;

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

      // 5) TWORZYMY DOSTAWY (Deliveries)
      // Wymaga: delivery_type = 'order' / 'demand'
      //   - jeśli 'order' => order_id
      //   - jeśli 'demand' => demand_id
      // Ale zakładamy, że generujemy TYLKO 'order' w tym wypadku 
      // bo mam nadzieje że to wystarczy i nie będe musiał jeszcze losować zapotrzebowanie/zamówienie
      
      let deliveries = [];
      setLog(prev => prev + "Generowanie dostaw (tylko type='order')...\n");
      // Stwórzmy np. count/2
      let delCount = Math.max(1, Math.floor(count / 2));
      for (let i = 0; i < delCount; i++) {
        let order = orders[randomInt(0, orders.length-1)];
        let sw = Math.random() < 0.5 ? warehouses[randomInt(0, warehouses.length-1)] : null;
        let dw = Math.random() < 0.5 ? warehouses[randomInt(0, warehouses.length-1)] : null;

        let payload = {
          delivery_type: "order",
          delivered_quantity: randomInt(1,100) + " szt",
          note: "Auto-gen delivery",
          order_id: order.id,
        };
        if (sw && dw && sw.id !== dw.id) {
          payload.source_warehouse_id = sw.id;
          payload.destination_warehouse_id = dw.id;
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
      // kolejność odwrotna
      // 1) deliveries -> 2) orders -> 3) products -> 4) addresses
      // Pomijamy magazyny dla ułatwienia testów
       
      // jak trzeba będzie je usunąć to cza dodać je do listy endpointów
      let endpoints = ["deliveries", "orders", "products", "addresses"];

      for (let ep of endpoints) {
        let getRes = await axios.get(`http://127.0.0.1:8000/api/${ep}/`);
        let items = getRes.data;
        for (let item of items) {
          await axios.delete(`http://127.0.0.1:8000/api/${ep}/${item.id}/`);
          setLog(prev => prev + `Usunięto ${ep.slice(0,-1)} #${item.id}\n`);
        }
      }

      setLog(prev => prev + "Wszystkie dane testowe usunięte!\n");
    } catch (error) {
      console.error("Błąd usuwania danych:", error);
      setLog(prev => prev + "Błąd usuwania danych\n");
      alert("Błąd usuwania! Szczegóły w konsoli.");
    }
  };

  return (
    <div style={{ padding: "1rem" }}>
      <h2>Generator danych testowych</h2>
      <p>
        Ten generator <strong>nie tworzy nowych magazynów</strong> – korzysta ze
        wstępnie dodanych <em>Magazyn1, Magazyn2, Magazyn3</em>.
      </p>

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
          Usuń dane testowe
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
