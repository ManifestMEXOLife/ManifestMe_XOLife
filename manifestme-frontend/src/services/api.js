// src/services/api.js

/**
 * API Service for ManifestMe Frontend
 * Handles all calls to the backend.
 * Automatically switches between local and production backend.
 */

const LOCAL_URL = "http://localhost:8080"; // local backend
const PROD_URL = "https://manifestme-env.eba-xyz123.us-east-1.elasticbeanstalk.com"; // deployed backend

// Use .env variable if set; otherwise, auto-switch based on NODE_ENV
const API_BASE_URL =
  process.env.REACT_APP_API_URL ||
  (process.env.NODE_ENV === "development" ? LOCAL_URL : PROD_URL);

/**
 * Generic API request helper
 * @param {string} endpoint - API endpoint (e.g., "/users")
 * @param {string} method - HTTP method ("GET", "POST", etc.)
 * @param {object|null} body - JSON body for POST/PUT requests
 */
async function apiRequest(endpoint, method = "GET", body = null) {
  const url = endpoint.startsWith("/") ? `${API_BASE_URL}${endpoint}` : `${API_BASE_URL}/${endpoint}`;

  const headers = {
    "Content-Type": "application/json",
  };

  const options = { method, headers };
  if (body) options.body = JSON.stringify(body);

  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`API error: ${response.status} - ${text}`);
    }

    return await response.json();
  } catch (error) {
    console.error("API Request failed:", error);
    throw error;
  }
}

/**
 * API Endpoint Wrappers
 * Add more endpoints as your app grows
 */
export const Api = {
  // Health check endpoint
  getHealth: () => apiRequest("/health"),

  // Users endpoints
  getUsers: () => apiRequest("/users"),
  getUserById: (id) => apiRequest(`/users/${id}`),
  createUser: (userData) => apiRequest("/users", "POST", userData),
  updateUser: (id, userData) => apiRequest(`/users/${id}`, "PUT", userData),
  deleteUser: (id) => apiRequest(`/users/${id}`, "DELETE"),

  // Example for other endpoints
  getTasks: () => apiRequest("/tasks"),
  createTask: (taskData) => apiRequest("/tasks", "POST", taskData),
};

export default Api;
