import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
<<<<<<< HEAD
import { fetchTasks, createTask, Task } from "./api";
=======
>>>>>>> main

interface Notification {
  message: string;
  type: "success" | "info" | "warning" | "error";
}

<<<<<<< HEAD
const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDescription, setNewTaskDescription] = useState("");

=======
interface Task {
  id: number;
  title: string;
  description: string;
}

const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
>>>>>>> main
  const apiBaseUrl =
    process.env.REACT_APP_API_URL || "http://localhost:8080";

  useEffect(() => {
    const socket = io(apiBaseUrl, { transports: ["websocket"] });

    socket.on("connect", () => {
<<<<<<< HEAD
      console.log("Connected to backend ✅");
=======
      console.log("Connected to backend via Socket.IO ✅");
>>>>>>> main
      toast.info("Connected to backend!");
    });

    socket.on("notification", (data: Notification) => {
      console.log("Notification received:", data);
      toast[data.type || "info"](data.message);
    });

<<<<<<< HEAD
    socket.on("tasks:update", (updatedTasks: Task[]) => {
      setTasks(updatedTasks);
      toast.info("Tasks updated!");
    });

=======
>>>>>>> main
    socket.on("disconnect", () => {
      console.warn("Disconnected from backend ❌");
      toast.warn("Disconnected from backend");
    });

<<<<<<< HEAD
    // Initial fetch
    fetchTasks()
      .then(setTasks)
      .catch((err) => {
        console.error(err);
        toast.error("Failed to load tasks");
      });

    return () => socket.disconnect();
  }, [apiBaseUrl]);

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle) return;

    try {
      const createdTask = await createTask(newTaskTitle, newTaskDescription);
      setTasks((prev) => [...prev, createdTask]);
      toast.success("Task created!");
      setNewTaskTitle("");
      setNewTaskDescription("");
    } catch (err) {
      console.error(err);
      toast.error("Failed to create task");
    }
  };

=======
    fetch(`${apiBaseUrl}/api/tasks`)
      .then((res) => res.json())
      .then((data) => {
        setTasks(data);
        console.log("Loaded tasks:", data);
      })
      .catch((err) => {
        console.error("Error loading tasks:", err);
        toast.error("Failed to load tasks");
      });

    return () => {
      socket.disconnect();
    };
  }, [apiBaseUrl]);

>>>>>>> main
  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>📋 ManifestMe Dashboard</h1>
      <p>Connected to: <b>{apiBaseUrl}</b></p>

<<<<<<< HEAD
      <h2>Add New Task</h2>
      <form onSubmit={handleAddTask} style={{ marginBottom: "2rem" }}>
        <input
          type="text"
          placeholder="Title"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          required
          style={{ marginRight: "0.5rem" }}
        />
        <input
          type="text"
          placeholder="Description"
          value={newTaskDescription}
          onChange={(e) => setNewTaskDescription(e.target.value)}
          style={{ marginRight: "0.5rem" }}
        />
        <button type="submit">Add Task</button>
      </form>

=======
>>>>>>> main
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

