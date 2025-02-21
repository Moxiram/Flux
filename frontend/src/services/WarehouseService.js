import axios from 'axios';

const API_URL = 'http://localhost:8000/api/warehouses/'; // Adjust the URL to match your Django backend

const getAllWarehouses = async () => {
    const response = await axios.get(API_URL);
    return response.data;
};

export default {
    getAllWarehouses,
};