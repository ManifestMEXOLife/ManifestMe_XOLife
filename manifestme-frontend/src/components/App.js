import React, { useEffect, useState } from "react";
import { Api } from "./services/api";
import "./App.css";

function App() {
  const [healthStatus, setHealthStatus] = useState("Checking backend...");
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [error, setError] = useState(null);
  const [newUserName, setNewUserName] = useState("");

  // Check backend health on mount
  useEffect(() => {
    Api.getHealth()
      .then((data) => setHealthStatus(data.message || "Backend is healthy ✅"))
      .catch((err) => setHealthStatus("Error: " + err.message));
  }, []);

  // Fetch users from backend
  const fetchUsers = async () => {
    setLoadingUsers(true);
    setError(null);
    try {
      const data = await Api.getUsers();
      setUsers(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingUsers(false);
    }
  };

  // Handle adding a new user
  const handleAddUser = async () => {
    if (!newUserName.trim()) return;
    try {
      await Api.createUser({ name: newUserName });
      setNewUserName("");
      fetchUsers(); // refresh users
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="App" style={{ padding: "2rem", fontFamily: "Arial, sans-serif" }}>
      <h1>ManifestMe Frontend</h1>

      {/* Backend health status */}
      <div style={{ marginBottom: "1rem", padding: "1rem", border: "1px solid #ccc", borderRadius: 8 }}>
        <h3>Backend Health Check</h3>
        <p>{healthStatus}</p>
      </div>

      {/* Users section */}
      <div style={{ marginBottom: "1rem", padding: "1rem", border: "1px solid #ccc", borderRadius: 8 }}>
        <h3>Users</h3>
        <button onClick={fetchUsers} disabled={loadingUsers} style={{ marginBottom: "1rem" }}>
          {loadingUsers ? "Loading..." : "Fetch Users"}
        </button>

        {error && <p style={{ color: "red" }}>Error: {error}</p>}

        <ul>
          {users.length > 0 ? (
            users.map((user) => <li key={user.id}>{user.name}</li>)
          ) : (
            <li>No users loaded</li>
          )}
        </ul>

        {/* Add a new user */}
        <div style={{ marginTop: "1rem" }}>
          <input
            type="text"
            placeholder="New user name"
            value={newUserName}
            onChange={(e) => setNewUserName(e.target.value)}
            style={{ marginRight: "0.5rem", padding: "0.25rem 0.5rem" }}
          />
          <button onClick={handleAddUser}>Add User</button>
        </div>
      </div>
    </div>
  );
}

export default App;
