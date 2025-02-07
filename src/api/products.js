import axios from "axios";

// Read API Base URL from environment variables
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL + "/products";

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

// Create a new product (Handle Image as Base64)
export const addProduct = async (product) => {
  try {
    const payload = {
      name: product.name,
      brand: product.brand,
      score: product.score,
      image_base64: product.image_base64, // Now sending the image as Base64
      product_type: product.product_type,
      product_metadata: product.product_metadata.map((meta) => ({
        attribute: meta.attribute,
        value: meta.value,
        score: meta.score,
      })),
    };

    const response = await axios.post(`${API_BASE_URL}/`, payload);
    return response.data; // Return newly created product data
  } catch (error) {
    console.error("API Add Product Error:", error.response?.data || error.message);
    throw error;
  }
};

// Update a product by ID (Handle Image as Base64)
export const updateProduct = async (productId, product) => {
  try {
    const payload = {
      name: product.name,
      brand: product.brand,
      score: product.score,
      image_base64: product.image_base64, // Now sending updated image as Base64
      product_metadata: product.product_metadata.map((meta) => ({
        id: meta.id || null,
        attribute: meta.attribute,
        value: meta.value,
        score: meta.score,
      })),
    };

    const response = await axios.put(`${API_BASE_URL}/${productId}`, payload);
    return response.data;
  } catch (error) {
    console.error("API Update Error:", error.response?.data || error.message);
    throw error;
  }
};

// Delete a product by ID
export const deleteProduct = async (productId) => {
  await axios.delete(`${API_BASE_URL}/${productId}`);
};

// Fetch all product types
export const fetchProductTypes = async () => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/product-types`);
    return response.data; // Returns [{ id, name, metadata_schema }]
  } catch (error) {
    console.error("Error fetching product types:", error);
    return [];
  }
};
