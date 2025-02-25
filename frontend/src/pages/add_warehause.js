import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function AddWarehouse() {
    const [name, setName] = useState('');
    const [location, setLocation] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const newWarehouse = { name, location };

        try {
            await axios.post('http://127.0.0.1:8000/api/warehouses/', newWarehouse, {
                headers: { 'Content-Type': 'application/json' }
            });
            alert('Magazyn został dodany!');
            navigate('/');
        } catch (error) {
            console.error('Błąd podczas dodawania magazynu!', error.response?.data || error);
            alert('Nie udało się dodać magazynu.');
        }
    };

    return (
        <div className="form-container">
            <h2>Dodaj nowy magazyn</h2>
            <form onSubmit={handleSubmit}>
                <label>Nazwa magazynu:</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />

                <label>Lokalizacja:</label>
                <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} required />

                <button type="submit">Dodaj magazyn</button>
            </form>
            <button onClick={() => navigate('/')}>Anuluj</button>
        </div>
    );
}

export default AddWarehouse;
