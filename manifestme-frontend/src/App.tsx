import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface Notification {
  message: string;
  type: "success" | "info" | "warning" | "error";
}

interface Task {
  id: number;
  title: string;
  description: string;
}

const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const apiBaseUrl = process.env.REACT_APP_API_URL || "http://localhost:8080";

  useEffect(() => {
    const socket = io(apiBaseUrl, { transports: ["websocket"] });

    socket.on("connect", () => {
      console.log("✅ Connected to backend via Socket.IO");
      toast.info("Connected to backend!");
    });

    socket.on("notification", (data: Notification) => {
      console.log("📩 Notification received:", data);
      toast[data.type || "info"](data.message);
    });

    socket.on("disconnect", () => {
      console.warn("⚠️ Disconnected from backend");
      toast.warn("Disconnected from backend");
    });

    fetch(`${apiBaseUrl}/api/tasks`)
      .then((res) => res.json())
      .then((data) => {
        setTasks(data);
        console.log("📋 Loaded tasks:", data);
      })
      .catch((err) => {
        console.error("Error loading tasks:", err);
        toast.error("Failed to load tasks");
      });

    return () => {
      socket.disconnect();
    };
  }, [apiBaseUrl]);

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>📋 ManifestMe Dashboard</h1>
      <p>
        Connected to: <b>{apiBaseUrl}</b>
      </p>

      <h2>Tasks</h2>
      {tasks.length === 0 ? (
        <p>No tasks found.</p>
      ) : (
        <ul>
          {tasks.map((task) => (
            <li key={task.id}>
              <strong>{task.title}</strong> — {task.description}
            </li>
          ))}
        </ul>
      )}

      <ToastContainer position="bottom-right" />
    </div>
  );
};

export default App;
