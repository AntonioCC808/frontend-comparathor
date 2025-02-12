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
  if (token) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common["Authorization"];
  }
};

// Get Current User API
export const getCurrentUser = async () => {
  try {
    const token = localStorage.getItem("access_token");
    
    if (!token) {
      throw new Error("No access token found");
    }

    const response = await axios.get(`${API_BASE_URL}/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return response.data;
  } catch (error) {
    console.error("❌ API Get Current User Error:", error.response?.data || error.message);

    if (error.response?.status === 401) {
      logout(); // ✅ Automatically log out if token is invalid
    }

    throw error;
  }
};


// Logout Function (Clears LocalStorage & Auth Headers)
export const logout = () => {
  console.log("🔴 Logging out auth...");
  
  localStorage.removeItem("access_token");
  localStorage.removeItem("user");

  // ✅ Remove Authorization header from future requests
  delete axios.defaults.headers.common["Authorization"];
};