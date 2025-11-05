import React, { useEffect, useState } from "react";
import { Api } from "./services/api";
import "./App.css";

function App() {
  // ===== STATE =====
  const [healthStatus, setHealthStatus] = useState("Checking backend...");
  const [users, setUsers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [newUserName, setNewUserName] = useState("");
  const [newTaskName, setNewTaskName] = useState("");
  const [authToken, setAuthToken] = useState(localStorage.getItem("token") || "");
  const [loginCredentials, setLoginCredentials] = useState({ username: "", password: "" });

  // ===== EFFECTS =====
  useEffect(() => {
    checkBackendHealth();
    if (authToken) {
      fetchUsers();
      fetchTasks();
    }
  }, [authToken]);

  // ===== BACKEND HEALTH =====
  const checkBackendHealth = async () => {
    try {
      const data = await Api.getHealth();
      setHealthStatus(data.message || "Backend is healthy ✅");
    } catch (err) {
      setHealthStatus("Error: " + err.message);
    }
  };

  // ===== AUTHENTICATION =====
  const handleLogin = async () => {
    try {
      setError(null);
      const data = await Api.login(loginCredentials); // expects { username, password }
      localStorage.setItem("token", data.token);
      setAuthToken(data.token);
      setLoginCredentials({ username: "", password: "" });
    } catch (err) {
      setError(err.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setAuthToken("");
    setUsers([]);
    setTasks([]);
  };

  // ===== USERS =====
  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await Api.getUsers(authToken);
      setUsers(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = async () => {
    if (!newUserName.trim()) return;
    try {
      await Api.createUser({ name: newUserName }, authToken);
      setNewUserName("");
      fetchUsers();
    } catch (err) {
      setError(err.message);
    }
  };

  // ===== TASKS =====
  const fetchTasks = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await Api.getTasks(authToken);
      setTasks(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTask = async () => {
    if (!newTaskName.trim()) return;
    try {
      await Api.createTask({ title: newTaskName }, authToken);
      setNewTaskName("");
      fetchTasks();
    } catch (err) {
      setError(err.message);
    }
  };

  // ===== RENDER =====
  if (!authToken) {
    return (
      <div style={{ padding: "2rem" }}>
        <h1>ManifestMe Login</h1>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <input
          type="text"
          placeholder="Username"
          value={loginCredentials.username}
          onChange={(e) => setLoginCredentials({ ...loginCredentials, username: e.target.value })}
        />
        <input
          type="password"
          placeholder="Password"
          value={loginCredentials.password}
          onChange={(e) => setLoginCredentials({ ...loginCredentials, password: e.target.value })}
        />
        <button onClick={handleLogin} style={{ marginLeft: "0.5rem" }}>Login</button>
      </div>
    );
  }

  return (
    <div style={{ padding: "2rem" }}>
      <h1>ManifestMe Dashboard</h1>
      <button onClick={handleLogout} style={{ marginBottom: "1rem" }}>Logout</button>

      {/* Backend Health */}
      <div style={{ marginBottom: "1rem", padding: "1rem", border: "1px solid #ccc", borderRadius: 8 }}>
        <h3>Backend Health</h3>
        <p>{healthStatus}</p>
      </div>

      {/* Users Section */}
      <div style={{ marginBottom: "1rem", padding: "1rem", border: "1px solid #ccc", borderRadius: 8 }}>
        <h3>Users</h3>
        <button onClick={fetchUsers} disabled={loading}>{loading ? "Loading..." : "Fetch Users"}</button>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <ul>{users.length ? users.map(u => <li key={u.id}>{u.name}</li>) : <li>No users loaded</li>}</ul>
        <input
          type="text"
          placeholder="New user name"
          value={newUserName}
          onChange={(e) => setNewUserName(e.target.value)}
        />
        <button onClick={handleAddUser}>Add User</button>
      </div>

      {/* Tasks Section */}
      <div style={{ marginBottom: "1rem", padding: "1rem", border: "1px solid #ccc", borderRadius: 8 }}>
        <h3>Tasks</h3>
        <button onClick={fetchTasks} disabled={loading}>{loading ? "Loading..." : "Fetch Tasks"}</button>
        <ul>{tasks.length ? tasks.map(t => <li key={t.id}>{t.title}</li>) : <li>No tasks loaded</li>}</ul>
        <input
          type="text"
          placeholder="New task title"
          value={newTaskName}
          onChange={(e) => setNewTaskName(e.target.value)}
        />
        <button onClick={handleAddTask}>Add Task</button>
      </div>
    </div>
  );
}

export default App;
