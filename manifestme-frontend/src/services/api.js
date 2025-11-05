// src/services/api.ts
/**
 * API Service for ManifestMe Frontend (TypeScript)
 * Handles calls to backend with optional JWT authentication.
 */

const LOCAL_URL = "http://localhost:8080";
const PROD_URL = "http://manifestme-env.eba-62aeuny5.us-east-1.elasticbeanstalk.com";

const API_BASE_URL = process.env.NODE_ENV === "development" ? LOCAL_URL : PROD_URL;

interface ApiResponse<T> {
  data: T;
}

interface LoginCredentials {
  username: string;
  password: string;
}

interface User {
  id?: number;
  name: string;
  email: string;
  role?: string;
}

interface Task {
  id?: number;
  title: string;
  description?: string;
  completed?: boolean;
}

/**
 * Generic API request helper
 */
async function apiRequest<T>(
  endpoint: string,
  method: "GET" | "POST" | "PUT" | "DELETE" = "GET",
  body?: any,
  token?: string
): Promise<T> {
  const url = endpoint.startsWith("/") ? `${API_BASE_URL}${endpoint}` : `${API_BASE_URL}/${endpoint}`;
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const options: RequestInit = { method, headers };
  if (body) options.body = JSON.stringify(body);

  const response = await fetch(url, options);

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`API error: ${response.status} - ${text}`);
  }

  return response.status === 204 ? (null as any) : response.json();
}

/**
 * API endpoint wrappers
 */
export const Api = {
  // Health check
  getHealth: () => apiRequest<{ message: string }>("/health"),

  // Auth
  login: (credentials: LoginCredentials) => apiRequest<{ token: string }>("/auth/login", "POST", credentials),

  // Users
  getUsers: (token?: string) => apiRequest<User[]>("/users", "GET", undefined, token),
  getUserById: (id: number, token?: string) => apiRequest<User>(`/users/${id}`, "GET", undefined, token),
  createUser: (userData: User, token?: string) => apiRequest<User>("/users", "POST", userData, token),
  updateUser: (id: number, userData: User, token?: string) => apiRequest<User>(`/users/${id}`, "PUT", userData, token),
  deleteUser: (id: number, token?: string) => apiRequest<void>(`/users/${id}`, "DELETE", undefined, token),

  // Tasks
  getTasks: (token?: string) => apiRequest<Task[]>("/tasks", "GET", undefined, token),
  getTaskById: (id: number, token?: string) => apiRequest<Task>(`/tasks/${id}`, "GET", undefined, token),
  createTask: (taskData: Task, token?: string) => apiRequest<Task>("/tasks", "POST", taskData, token),
  updateTask: (id: number, taskData: Task, token?: string) => apiRequest<Task>(`/tasks/${id}`, "PUT", taskData, token),
  deleteTask: (id: number, token?: string) => apiRequest<void>(`/tasks/${id}`, "DELETE", undefined, token),
};

export default Api;
