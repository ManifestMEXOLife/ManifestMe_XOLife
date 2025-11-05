import React, { useEffect, useState } from "react";
import { Api } from "./services/api";
import "./App.css";

function App() {
  const [healthStatus, setHealthStatus] = useState("Checking backend...");

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

  return (
    <div style={{ padding: "2rem" }}>
      <h1>ManifestMe Dashboard</h1>
      <div style={{ padding: "1rem", border: "1px solid #ccc", borderRadius: 8 }}>
        <h3>Backend Health</h3>
        <p>{healthStatus}</p>
      </div>
    </div>
  );
}

export default App;
