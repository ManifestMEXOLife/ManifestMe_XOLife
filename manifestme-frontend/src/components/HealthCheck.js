// src/components/HealthCheck.js
import React, { useEffect, useState } from "react";
import { Api } from "../services/api";

export default function HealthCheck() {
  const [status, setStatus] = useState("Checking...");
  const [error, setError] = useState(null);

  useEffect(() => {
    Api.getHealth()
      .then((data) => setStatus(data.message || "Healthy ✅"))
      .catch((err) => setError(err.message));
  }, []);

  return (
    <div style={{ padding: "1rem", border: "1px solid #ccc", borderRadius: 8 }}>
      <h3>Backend Health Check</h3>
      {error ? (
        <p style={{ color: "red" }}>❌ Error: {error}</p>
      ) : (
        <p>✅ Status: {status}</p>
      )}
    </div>
  );
}
