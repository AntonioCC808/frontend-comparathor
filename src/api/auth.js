import axios from "axios";

const API_BASE_URL = "http://127.0.0.1:8000/auth";

// Login API call
export const login = async (email, password) => {
  const response = await axios.post(`${API_BASE_URL}/login`, { email, password });
  return response.data; // Response includes access_token and token_type
};

// Register API call
export const register = async (email, password, role = "user") => {
  await axios.post(`${API_BASE_URL}/register`, { email, password, role });
};

// Set Auth Token in Axios Headers
export const setAuthToken = (token) => {
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
};
