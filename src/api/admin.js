import axios from "axios";

// Read API Base URL from environment variables
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL + "/admin";

// Helper function to get authentication headers
const getAuthHeaders = () => {
  const token = localStorage.getItem("access_token");
  if (!token) {
    console.error("No authentication token found!");
    throw new Error("Unauthorized: No token available");
  }
  return { Authorization: `Bearer ${token}` };
};

// Fetch all users (Admin only)
export const fetchUsers = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/users`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error.response?.data || error.message);
    throw error;
  }
};

// Update user role (Admin only)
export const updateUsersRoles = async (usersRoles) => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/roles`, 
      usersRoles, 
      { headers: getAuthHeaders() }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating user roles:", error.response?.data || error.message);
    throw error;
  }
};

// Create a new product type (Admin only)
export const addProductType = async (productType) => {
  try {
    const payload = {
      name: productType.name,
      description: productType.description,
      metadata_schema: productType.metadata_schema || {},
    };

    const response = await axios.post(`${API_BASE_URL}/product-types`, payload, {
      headers: getAuthHeaders(),
    });

    return response.data; // Returns newly created product type
  } catch (error) {
    console.error("Error adding product type:", error.response?.data || error.message);
    throw error;
  }
};

// Delete a product type by ID (Admin only)
export const deleteProductType = async (productTypeId) => {
  try {
    await axios.delete(`${API_BASE_URL}/product-types/${productTypeId}`, {
      headers: getAuthHeaders(),
    });
  } catch (error) {
    console.error("Error deleting product type:", error.response?.data || error.message);
    throw error;
  }
};
