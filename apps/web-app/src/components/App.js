import React, { useEffect, useState } from "react";
import { Api } from "./services/api";
import "./App.css";

// ===== AFFIRMATIONS UTILITIES =====
async function loadAffirmations() {
  try {
    const response = await fetch("/data/affirmations_dataset_full.jsonl");
    const text = await response.text();
    const lines = text.split("\n").filter(Boolean);
    return lines.map((line) => JSON.parse(line));
  } catch (error) {
    console.error("Error loading affirmations:", error);
    return [];
  }
}

function getDailyAffirmation(affirmations, date = new Date(), category) {
  const filtered = category
    ? affirmations.filter((a) => a.category === category)
    : affirmations;

  if (filtered.length === 0) return null;

  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date - start;
  const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));

  const index = dayOfYear % filtered.length;
  return filtered[index];
}

// ===== DAILY AFFIRMATION COMPONENT =====
function DailyAffirmationWidget({ affirmations }) {
  const [category, setCategory] = useState("All");
  const [dailyAffirmation, setDailyAffirmation] = useState(null);

  const categories = [
    "All",
    "Career & Business",
    "Wealth & Finance",
    "Health & Wellness",
    "Relationships & Love",
    "Personal Growth",
    "Lifestyle & Social",
    "Family & Home",
    "Spiritual & Purpose",
    "Creativity",
    "Adventure",
    "Contribution",
    "Resilience",
  ];

  useEffect(() => {
    const selected = getDailyAffirmation(
      affirmations,
      new Date(),
      category === "All" ? null : category
    );
    setDailyAffirmation(selected);
  }, [affirmations, category]);

  if (!dailyAffirmation) return <div>Loading daily affirmation...</div>;

  return (
    <div className="affirmation-widget" style={{ marginBottom: "2rem" }}>
      <h2>Daily Affirmation</h2>
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        style={{ marginBottom: "1rem", padding: "0.5rem", fontSize: "1rem" }}
      >
        {categories.map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>
      <div
        className="affirmation-card"
        style={{
          backgroundColor: "#fff",
          padding: "1rem 1.5rem",
          borderRadius: "10px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
          animation: "fadeIn 1s ease-in-out",
        }}
      >
        <h3>{dailyAffirmation.category}</h3>
        <p>{dailyAffirmation.affirmation}</p>
        <small>{dailyAffirmation.micro_prompt}</small>
      </div>
    </div>
  );
}

// ===== MAIN APP =====
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
  const [affirmations, setAffirmations] = useState([]);

  // ===== EFFECTS =====
  useEffect(() => {
    checkBackendHealth();
    if (authToken) {
      fetchUsers();
      fetchTasks();
    }
    loadAffirmations().then(setAffirmations);
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
      const data = await Api.login(loginCredentials);
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
          onChange={(e) =>
            setLoginCredentials({ ...loginCredentials, username: e.target.value })
          }
        />
        <input
          type="password"
          placeholder="Password"
          value={loginCredentials.password}
          onChange={(e) =>
            setLoginCredentials({ ...loginCredentials, password: e.target.value })
          }
        />
        <button onClick={handleLogin} style={{ marginLeft: "0.5rem" }}>
          Login
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: "2rem" }}>
      <h1>ManifestMe Dashboard</h1>
      <button onClick={handleLogout} style={{ marginBottom: "1rem" }}>
        Logout
      </button>

      {/* Daily Affirmation Widget */}
      {affirmations.length > 0 && <DailyAffirmationWidget affirmations={affirmations} />}

      {/* Backend Health */}
      <div
        style={{
          marginBottom: "1rem",
          padding: "1rem",
          border: "1px solid #ccc",
          borderRadius: 8,
        }}
      >
        <h3>Backend Health</h3>
        <p>{healthStatus}</p>
      </div>

      {/* Users Section */}
      <div
        style={{
          marginBottom: "1rem",
          padding: "1rem",
          border: "1px solid #ccc",
          borderRadius: 8,
        }}
      >
        <h3>Users</h3>
        <button onClick={fetchUsers} disabled={loading}>
          {loading ? "Loading..." : "Fetch Users"}
        </button>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <ul>{users.length ? users.map((u) => <li key={u.id}>{u.name}</li>) : <li>No users loaded</li>}</ul>
        <input
          type="text"
          placeholder="New user name"
          value={newUserName}
          onChange={(e) => setNewUserName(e.target.value)}
        />
        <button onClick={handleAddUser}>Add User</button>
      </div>

      {/* Tasks Section */}
      <div
        style={{
          marginBottom: "1rem",
          padding: "1rem",
          border: "1px solid #ccc",
          borderRadius: 8,
        }}
      >
        <h3>Tasks</h3>
        <button onClick={fetchTasks} disabled={loading}>
          {loading ? "Loading..." : "Fetch Tasks"}
        </button>
        <ul>{tasks.length ? tasks.map((t) => <li key={t.id}>{t.title}</li>) : <li>No tasks loaded</li>}</ul>
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
