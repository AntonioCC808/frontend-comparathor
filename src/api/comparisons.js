import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL + "/comparisons";

// ✅ Fetch all comparisons
export const fetchComparisons = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}`);
    console.log("✅ Fetch Comparisons:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Error fetching comparisons:", error.response?.data || error.message);
    throw error;
  }
};

// ✅ Fetch a specific comparison and its products
export const fetchComparisonDetails = async (comparisonId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/${comparisonId}`);
    console.log(`✅ Fetch Comparison ${comparisonId}:`, response.data);
    return response.data;
  } catch (error) {
    console.error(`❌ Error fetching comparison ${comparisonId}:`, error.response?.data || error.message);
    throw error;
  }
};

// ✅ Create a new comparison
export const addComparison = async (comparisonData) => {
  try {
    const payload = {
      title: comparisonData.title,
      description: comparisonData.description,
      id_user: comparisonData.id_user,
      product_type_id: comparisonData.product_type, // Rename this to match the backend
      date_created: new Date().toISOString(),
      products: comparisonData.products, // Ensure this is a list of raw integers
    };

    console.log("📤 Sending comparison data:", payload); // Debugging

    const response = await axios.post(`${API_BASE_URL}/`, payload);
    console.log("✅ Comparison Created:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Error creating comparison:", error.response?.data || error.message);
    throw error;
  }
};


// ✅ Delete a comparison
export const deleteComparison = async (comparisonId) => {
  try {
    await axios.delete(`${API_BASE_URL}/${comparisonId}`);
    console.log(`🗑️ Comparison ${comparisonId} deleted successfully`);
    return { success: true };
  } catch (error) {
    console.error(`❌ Error deleting comparison ${comparisonId}:`, error.response?.data || error.message);
    throw error;
  }
};
