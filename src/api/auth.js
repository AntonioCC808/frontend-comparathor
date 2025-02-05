import axios from "axios";

// Read API Base URL from environment variables
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL + "/auth";

// Login API call
export const login = async (email, password) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/login`, { email, password });
    return response.data; // ✅ Successful login returns token
  } catch (error) {
    console.error("❌ API Login Error:", error.response?.data || error.message);

    // Throw error details so `handleLogin` can catch them
    throw error;
  }
};

// Register API call
export const register = async (user_id, email, password, role = "user") => {
  try {
    const response = await axios.post(`${API_BASE_URL}/register`, {
      user_id,
      email,
      password,
      role,
    });
    return response.data; // Return API response data
  } catch (error) {
    console.error("❌ API Register Error:", error.response?.data || error.message);
    throw error; // Throw error so `handleSignUp` catches it
  }
};

// Set Auth Token in Axios Headers
export const setAuthToken = (token) => {
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
};
