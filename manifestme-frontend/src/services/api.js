// src/services/api.js
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export async function apiRequest(endpoint, method = "GET", body = null) {
  const headers = {
    "Content-Type": "application/json",
  };

  const options = {
    method,
    headers,
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, options);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API error: ${response.status} ${errorText}`);
    }

    return await response.json();
  } catch (err) {
    console.error("API Request failed:", err);
    throw err;
  }
}

// Example wrapper functions for clarity
export const Api = {
  getHealth: () => apiRequest("/health"),
  getUsers: () => apiRequest("/users"),
  createUser: (userData) => apiRequest("/users", "POST", userData),
};
