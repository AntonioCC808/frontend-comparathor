import axios from "axios";

// Read API Base URL from environment variables
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL + "/comparisons";

// Fetch all comparisons
export const fetchComparisons = async () => {
  const response = await axios.get(`${API_BASE_URL}/`);
  return response.data;
};

// Fetch a single comparison
export const fetchComparison = async (comparisonId) => {
  const response = await axios.get(`${API_BASE_URL}/${comparisonId}`);
  return response.data;
};

// Create a new comparison
export const createComparison = async (comparison) => {
  const response = await axios.post(`${API_BASE_URL}/`, comparison);
  return response.data;
};

// Delete a comparison
export const deleteComparison = async (comparisonId) => {
  await axios.delete(`${API_BASE_URL}/${comparisonId}`);
};
