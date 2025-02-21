import axios from 'axios';

const API_URL = 'http://localhost:8000/api/products/'; 

const createProduct = async (productData) => {
    const response = await axios.post(API_URL, productData);
    return response.data;
};

export default {
    createProduct,
};