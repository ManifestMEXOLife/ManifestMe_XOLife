import React, { useState, useEffect } from "react";
import Api from "./api"; // Your API service layer
import Notification from "./components/Notification";
import "./App.css";

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

function App() {
  const [users, setUsers] = useState<User[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newUser, setNewUser] = useState({ name: "", email: "" });
  const [newTask, setNewTask] = useState({ title: "" });

  // Notifications
  const [notifications, setNotifications] = useState<
    { id: number; message: string; type?: "success" | "error" | "info" }[]
  >([]);

  const addNotification = (message: string, type?: "success" | "error" | "info") => {
    const id = Date.now();
    setNotifications((prev) => [...prev, { id, message, type }]);
  };

  // Fetch users and tasks
  const fetchUsers = async () => {
    try {
      const data = await Api.getUsers();
      setUsers(data);
    } catch (err) {
      addNotification("Failed to fetch users.", "error");
      console.error(err);
    }
  };

  const fetchTasks = async () => {
    try {
      const data = await Api.getTasks();
      setTasks(data);
    } catch (err) {
      addNotification("Failed to fetch tasks.", "error");
      console.error(err);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchTasks();
  }, []);

  // User CRUD
  const handleAddUser = async () => {
    try {
      await Api.createUser(newUser);
      setNewUser({ name: "", email: "" });
      fetchUsers();
      addNotification("User added successfully!", "success");
    } catch (err) {
      addNotification("Failed to add user.", "error");
      console.error(err);
    }
  };

  const handleDeleteUser = async (id: string) => {
    try {
      await Api.deleteUser(id);
      fetchUsers();
      addNotification("User deleted successfully.", "info");
    } catch (err) {
      addNotification("Failed to delete user.", "error");
      console.error(err);
    }
  };

  // Task CRUD
  const handleAddTask = async () => {
    try {
      await Api.createTask(newTask);
      setNewTask({ title: "" });
      fetchTasks();
      addNotification("Task added successfully!", "success");
    } catch (err) {
      addNotification("Failed to add task.", "error");
      console.error(err);
    }
  };

  const handleToggleTask = async (task: Task) => {
    try {
      await Api.updateTask(task.id, { completed: !task.completed });
      fetchTasks();
      addNotification(
        `Task "${task.title}" marked ${task.completed ? "incomplete" : "complete"}!`,
        "info"
      );
    } catch (err) {
      addNotification("Failed to update task.", "error");
      console.error(err);
    }
  };

  const handleDeleteTask = async (id: string) => {
    try {
      await Api.deleteTask(id);
      fetchTasks();
      addNotification("Task deleted successfully.", "info");
    } catch (err) {
      addNotification("Failed to delete task.", "error");
      console.error(err);
    }
  };

  return (
    <div>
      <h1>ManifestMe Dashboard</h1>

      {/* Users Section */}
      <div className="card">
        <h3>Users</h3>
        <input
          type="text"
          placeholder="Name"
          value={newUser.name}
          onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
        />
        <input
          type="email"
          placeholder="Email"
          value={newUser.email}
          onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
        />
        <button onClick={handleAddUser}>Add User</button>
        <ul>
          {users.map((user) => (
            <li key={user.id}>
              {user.name} ({user.email})
              <button onClick={() => handleDeleteUser(user.id)}>Delete</button>
            </li>
          ))}
        </ul>
      </div>

      {/* Tasks Section */}
      <div className="card">
        <h3>Tasks</h3>
        <input
          type="text"
          placeholder="New Task"
          value={newTask.title}
          onChange={(e) => setNewTask({ title: e.target.value })}
        />
        <button onClick={handleAddTask}>Add Task</button>
        <ul>
          {tasks.map((task) => (
            <li key={task.id}>
              <span
                style={{ textDecoration: task.completed ? "line-through" : "none", cursor: "pointer" }}
                onClick={() => handleToggleTask(task)}
              >
                {task.title}
              </span>
              <button onClick={() => handleDeleteTask(task.id)}>Delete</button>
            </li>
          ))}
        </ul>
      </div>

      {/* Notifications */}
      {notifications.map((notif) => (
        <Notification
          key={notif.id}
          message={notif.message}
          type={notif.type}
          onClose={() =>
            setNotifications((prev) => prev.filter((n) => n.id !== notif.id))
          }
        />
      ))}
    </div>
  );
}

export default App;
