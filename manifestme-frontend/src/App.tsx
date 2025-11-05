import React, { useEffect, useState } from "react";
import api from "./api";
import { io } from "socket.io-client";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface User {
  id: string;
  name: string;
  email: string;
}

interface Task {
  id: string;
  title: string;
  completed: boolean;
}

const App: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState("");

  // ---------------- Load initial data ----------------
  const loadUsers = async () => {
    try {
      const data = await api.getUsers();
      setUsers(data);
    } catch (err) {
      toast.error("Failed to load users");
    }
  };

  const loadTasks = async () => {
    try {
      const data = await api.getTasks();
      setTasks(data);
    } catch (err) {
      toast.error("Failed to load tasks");
    }
  };

  // ---------------- Socket.IO ----------------
  useEffect(() => {
    const socket = io(process.env.REACT_APP_API_URL);

    socket.on("notification", (data: { message: string; type?: string }) => {
      const type = data.type || "info";
      switch (type) {
        case "success":
          toast.success(data.message);
          break;
        case "error":
          toast.error(data.message);
          break;
        default:
          toast.info(data.message);
      }
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    loadUsers();
    loadTasks();
  }, []);

  // ---------------- Task actions ----------------
  const handleAddTask = async () => {
    if (!newTaskTitle) return;
    try {
      const newTask = await api.createTask({ title: newTaskTitle });
      setTasks((prev) => [...prev, newTask]);
      setNewTaskTitle("");
    } catch (err) {
      toast.error("Failed to create task");
    }
  };

  const handleToggleTask = async (task: Task) => {
    try {
      const updated = await api.updateTask(task.id, { completed: !task.completed });
      setTasks((prev) => prev.map((t) => (t.id === task.id ? updated : t)));
    } catch (err) {
      toast.error("Failed to update task");
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      await api.deleteTask(taskId);
      setTasks((prev) => prev.filter((t) => t.id !== taskId));
    } catch (err) {
      toast.error("Failed to delete task");
    }
  };

  // ---------------- Render ----------------
  return (
    <div style={{ padding: "2rem", fontFamily: "Arial, sans-serif" }}>
      <h1>ManifestMe Tasks</h1>

      <div style={{ marginBottom: "1rem" }}>
        <input
          type="text"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          placeholder="New task title"
        />
        <button onClick={handleAddTask} style={{ marginLeft: "0.5rem" }}>
          Add Task
        </button>
      </div>

      <ul>
        {tasks.map((task) => (
          <li key={task.id} style={{ marginBottom: "0.5rem" }}>
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => handleToggleTask(task)}
            />
            <span style={{ marginLeft: "0.5rem" }}>{task.title}</span>
            <button
              onClick={() => handleDeleteTask(task.id)}
              style={{ marginLeft: "1rem", color: "red" }}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default App;
