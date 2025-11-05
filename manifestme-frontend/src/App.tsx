import React, { useEffect, useState } from "react";
import { Api } from "./services/api";
import "./App.css";

interface User {
  id: number;
  name: string;
  email: string;
  role?: string;
}

interface Task {
  id: number;
  title: string;
  description?: string;
  completed?: boolean;
}

function App() {
  const [healthStatus, setHealthStatus] = useState("Checking backend...");
  const [token, setToken] = useState<string | null>(localStorage.getItem("jwtToken"));
  const [users, setUsers] = useState<User[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loginForm, setLoginForm] = useState({ username: "", password: "" });
  const [loginError, setLoginError] = useState<string | null>(null);

  // Health check
  useEffect(() => {
    checkBackendHealth();
  }, []);

  const checkBackendHealth = async () => {
    try {
      const data = await Api.getHealth();
      setHealthStatus(data.message || "Backend is healthy ✅");
    } catch (err: any) {
      setHealthStatus("Error: " + err.message);
    }
  };

  // Login handler
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await Api.login(loginForm);
      setToken(response.token);
      localStorage.setItem("jwtToken", response.token);
      setLoginError(null);
      fetchUsers(response.token);
      fetchTasks(response.token);
    } catch (err: any) {
      setLoginError(err.message);
    }
  };

  // Fetch users
  const fetchUsers = async (authToken?: string) => {
    if (!authToken && !token) return;
    try {
      const data = await Api.getUsers(authToken || token!);
      setUsers(data);
    } catch (err) {
      console.error(err);
    }
  };

  // Fetch tasks
  const fetchTasks = async (authToken?: string) => {
    if (!authToken && !token) return;
    try {
      const data = await Api.getTasks(authToken || token!);
      setTasks(data);
    } catch (err) {
      console.error(err);
    }
  };

  // Logout
  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem("jwtToken");
    setUsers([]);
    setTasks([]);
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>ManifestMe Dashboard</h1>
      <div style={{ padding: "1rem", border: "1px solid #ccc", borderRadius: 8 }}>
        <h3>Backend Health</h3>
        <p>{healthStatus}</p>
      </div>

      {!token ? (
        <div style={{ marginTop: "2rem" }}>
          <h3>Login</h3>
          <form onSubmit={handleLogin}>
            <input
              type="text"
              placeholder="Username"
              value={loginForm.username}
              onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
              required
              style={{ marginRight: 8 }}
            />
            <input
              type="password"
              placeholder="Password"
              value={loginForm.password}
              onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
              required
              style={{ marginRight: 8 }}
            />
            <button type="submit">Login</button>
          </form>
          {loginError && <p style={{ color: "red" }}>{loginError}</p>}
        </div>
      ) : (
        <div style={{ marginTop: "2rem" }}>
          <button onClick={handleLogout}>Logout</button>

          <div style={{ marginTop: "1rem" }}>
            <h3>Users</h3>
            <ul>
              {users.map((user) => (
                <li key={user.id}>
                  {user.name} ({user.email})
                </li>
              ))}
            </ul>
          </div>

          <div style={{ marginTop: "1rem" }}>
            <h3>Tasks</h3>
            <ul>
              {tasks.map((task) => (
                <li key={task.id}>
                  {task.title} - {task.completed ? "✅" : "❌"}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
