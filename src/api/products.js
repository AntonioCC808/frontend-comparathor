import axios from "axios";

const API_BASE_URL = "http://127.0.0.1:8000/products"; // Adjust as needed

// Fetch all products
export const fetchProducts = async () => {
  const response = await axios.get(`${API_BASE_URL}/`);
  return response.data; // Array of products
};

// Fetch a single product by ID
export const fetchProduct = async (productId) => {
  const response = await axios.get(`${API_BASE_URL}/${productId}`);
  return response.data; // Single product object
};

// Create a new product
export const createProduct = async (product) => {
  const response = await axios.post(`${API_BASE_URL}/`, product);
  return response.data; // Newly created product object
};

// Update a product by ID
export const updateProduct = async (productId, product) => {
  const response = await axios.put(`${API_BASE_URL}/${productId}`, product);
  return response.data; // Updated product object
};

// Delete a product by ID
export const deleteProduct = async (productId) => {
  await axios.delete(`${API_BASE_URL}/${productId}`);
};

// Fetch all product types
export const fetchProductTypes = async () => {
  const response = await axios.get(`${API_BASE_URL}/product-types`);
  return response.data;
};