import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL + "/comparisons";

// ✅ Fetch all comparisons
export const fetchComparisons = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}`);
    return response.data;
  } catch (error) {
    console.error("❌ API Fetch Comparisons Error:", error.response?.data || error.message);
    throw error;
  }
};

// ✅ Fetch a specific comparison and its products
export const fetchComparisonDetails = async (comparisonId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/${comparisonId}`);
    return response.data;
  } catch (error) {
    console.error("❌ API Fetch Comparison Details Error:", error.response?.data || error.message);
    throw error;
  }
};

// ✅ Delete a comparison
export const deleteComparison = async (comparisonId) => {
  try {
    await axios.delete(`${API_BASE_URL}/${comparisonId}`);
    return { success: true };
  } catch (error) {
    console.error("❌ API Delete Comparison Error:", error.response?.data || error.message);
    throw error;
  }
};
