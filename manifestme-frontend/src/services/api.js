// src/services/api.js

/**
 * API Service for ManifestMe Frontend
 * Handles calls to backend with optional JWT authentication.
 * Automatically switches between local and production backend.
 */

const LOCAL_URL = "http://localhost:8080"; // local backend
const PROD_URL = "https://manifestme-env.eba-xyz123.us-east-1.elasticbeanstalk.com"; // production backend

// Use .env variable if set; otherwise auto-switch based on NODE_ENV
const API_BASE_URL =
  process.env.REACT_APP_API_URL ||
  (process.env.NODE_ENV === "development" ? LOCAL_URL : PROD_URL);

/**
 * Generic API request helper
 * @param {string} endpoint - API endpoint (e.g., "/users")
 * @param {string} method - HTTP method ("GET", "POST", etc.)
 * @param {object|null} body - JSON body for POST/PUT requests
 * @param {string|null} token - Optional JWT token
 */
async function apiRequest(endpoint, method = "GET", body = null, token = null) {
  const url = endpoint.startsWith("/") ? `${API_BASE_URL}${endpoint}` : `${API_BASE_URL}/${endpoint}`;

  const headers = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const options = { method, headers };
  if (body) options.body = JSON.stringify(body);

  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`API error: ${response.status} - ${text}`);
    }

    // Try to parse JSON, if any
    return response.status === 204 ? null : await response.json();
  } catch (error) {
    console.error("API Request failed:", error);
    throw error;
  }
}

/**
 * API Endpoint Wrappers
 */
export const Api = {
  // Health check
  getHealth: () => apiRequest("/health"),

  // Authentication
  login: (credentials) => apiRequest("/auth/login", "POST", credentials), // expects { username, password }

  // Users
  getUsers: (token) => apiRequest("/users", "GET", null, token),
  getUserById: (id, token) => apiRequest(`/users/${id}`, "GET", null, token),
  createUser: (userData, token) => apiRequest("/users", "POST", userData, token),
  updateUser: (id, userData, token) => apiRequest(`/users/${id}`, "PUT", userData, token),
  deleteUser: (id, token) => apiRequest(`/users/${id}`, "DELETE", null, token),

  // Tasks
  getTasks: (token) => apiRequest("/tasks", "GET", null, token),
  createTask: (taskData, token) => apiRequest("/tasks", "POST", taskData, token),
  updateTask: (id, taskData, token) => apiRequest(`/tasks/${id}`, "PUT", taskData, token),
  deleteTask: (id, token) => apiRequest(`/tasks/${id}`, "DELETE", null, token),
};

export default Api;
