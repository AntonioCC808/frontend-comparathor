import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL + "/comparisons";

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem("access_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Fetch all comparisons (Public)
export const fetchComparisons = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}`, { headers: getAuthHeaders() });
    console.log("Fetch Comparisons:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching comparisons:", error.response?.data || error.message);
    throw error;
  }
};

// Fetch a specific comparison and its products (Public)
export const fetchComparisonDetails = async (comparisonId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/${comparisonId}`, { headers: getAuthHeaders() });
    console.log(`Fetch Comparison ${comparisonId}:`, response.data);
    return response.data;
  } catch (error) {
    console.error(`Error fetching comparison ${comparisonId}:`, error.response?.data || error.message);
    throw error;
  }
};

// Create a new comparison (Requires Authentication)
export const addComparison = async (comparisonData) => {
  const token = localStorage.getItem("access_token");

  try {
    const payload = {
      title: comparisonData.title,
      description: comparisonData.description,
      product_type_id: comparisonData.product_type, // Rename this to match the backend
      date_created: new Date().toISOString(),
      products: comparisonData.products, // Ensure this is a list of raw integers
    };

    console.log("Sending comparison data:", payload);

    const response = await axios.post(`${API_BASE_URL}/`, payload, {
      headers: { Authorization: `Bearer ${token}` },
    });

    console.log("Comparison Created:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error creating comparison:", error.response?.data || error.message);
    throw error;
  }
};

// Delete a comparison (Requires Authentication)
export const deleteComparison = async (comparisonId) => {
  const token = localStorage.getItem("access_token");

  if (!token) {
    console.error("No authentication token found!");
    throw new Error("Unauthorized: No token available");
  }

  try {
    await axios.delete(`${API_BASE_URL}/${comparisonId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    console.log(`Comparison ${comparisonId} deleted successfully`);
    return { success: true };
  } catch (error) {
    console.error(`Error deleting comparison ${comparisonId}:`, error.response?.data || error.message);
    throw error;
  }
};

// Update a comparison (Requires Authentication)
export const updateComparison = async (comparisonId, updatedData) => {
  const token = localStorage.getItem("access_token");
  console.log("Updating comparison ID:", comparisonId);

  if (!token) {
    console.error("No authentication token found!");
    throw new Error("Unauthorized: No token available");
  }

  // Remove the id parameter from updatedData
  const { id, ...dataWithoutId } = updatedData;
  console.log("Updated Data without ID:", dataWithoutId);

  try {
    const response = await axios.put(`${API_BASE_URL}/${comparisonId}`, dataWithoutId, {
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    });

    console.log(`Comparison ${comparisonId} updated successfully`, response.data);
    return response.data;
  } catch (error) {
    console.error(`Error updating comparison ${comparisonId}:`, error.response?.data || error.message);
    throw error;
  }
};