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

  const [newUser, setNewUser] = useState({ name: "", email: "" });
  const [editingUserId, setEditingUserId] = useState<number | null>(null);

  const [newTask, setNewTask] = useState({ title: "", description: "" });
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null);

  // Initial backend health check
  useEffect(() => {
    checkBackendHealth();
    if (token) {
      fetchUsers();
      fetchTasks();
    }
  }, [token]);

  const checkBackendHealth = async () => {
    try {
      const data = await Api.getHealth();
      setHealthStatus(data.message || "Backend is healthy ✅");
    } catch (err: any) {
      setHealthStatus("Error: " + err.message);
    }
  };

  // --- Auth ---
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

  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem("jwtToken");
    setUsers([]);
    setTasks([]);
  };

  // --- Users ---
  const fetchUsers = async () => {
    if (!token) return;
    try {
      const data = await Api.getUsers(token);
      setUsers(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddUser = async () => {
    if (!token) return;
    try {
      await Api.createUser(newUser, token);
      setNewUser({ name: "", email: "" });
      fetchUsers();
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateUser = async () => {
    if (!token || editingUserId === null) return;
    try {
      await Api.updateUser(editingUserId, newUser, token);
      setEditingUserId(null);
      setNewUser({ name: "", email: "" });
      fetchUsers();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteUser = async (id: number) => {
    if (!token) return;
    try {
      await Api.deleteUser(id, token);
      fetchUsers();
    } catch (err) {
      console.error(err);
    }
  };

  const startEditUser = (user: User) => {
    setEditingUserId(user.id);
    setNewUser({ name: user.name, email: user.email });
  };

  // --- Tasks ---
  const fetchTasks = async () => {
    if (!token) return;
    try {
      const data = await Api.getTasks(token);
      setTasks(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddTask = async () => {
    if (!token) return;
    try {
      await Api.createTask(newTask, token);
      setNewTask({ title: "", description: "" });
      fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateTask = async () => {
    if (!token || editingTaskId === null) return;
    try {
      await Api.updateTask(editingTaskId, newTask, token);
      setEditingTaskId(null);
      setNewTask({ title: "", description: "" });
      fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteTask = async (id: number) => {
    if (!token) return;
    try {
      await Api.deleteTask(id, token);
      fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  const toggleTaskComplete = async (task: Task) => {
    if (!token) return;
    try {
      await Api.updateTask(task.id, { ...task, completed: !task.completed }, token);
      fetchTasks();
    } catch (err) {
      console.error(err);
    }
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

          {/* --- Users Section --- */}
          <div style={{ marginTop: "1rem" }}>
            <h3>Users</h3>
            <input
              type="text"
              placeholder="Name"
              value={newUser.name}
              onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
              style={{ marginRight: 8 }}
            />
            <input
              type="email"
              placeholder="Email"
              value={newUser.email}
              onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
              style={{ marginRight: 8 }}
            />
            {editingUserId ? (
              <button onClick={handleUpdateUser}>Update User</button>
            ) : (
              <button onClick={handleAddUser}>Add User</button>
            )}
            <ul>
              {users.map((user) => (
                <li key={user.id}>
                  {user.name} ({user.email}){" "}
                  <button onClick={() => startEditUser(user)}>Edit</button>{" "}
                  <button onClick={() => handleDeleteUser(user.id)}>Delete</button>
                </li>
              ))}
            </ul>
          </div>

          {/* --- Tasks Section --- */}
          <div style={{ marginTop: "1rem" }}>
            <h3>Tasks</h3>
            <input
              type="text"
              placeholder="Title"
              value={newTask.title}
              onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
              style={{ marginRight: 8 }}
            />
            <input
              type="text"
              placeholder="Description"
              value={newTask.description}
              onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
              style={{ marginRight: 8 }}
            />
            {editingTaskId ? (
              <button onClick={handleUpdateTask}>Update Task</button>
            ) : (
              <button onClick={handleAddTask}>Add Task</button>
            )}
            <ul>
              {tasks.map((task) => (
                <li key={task.id}>
                  <span
                    style={{
                      textDecoration: task.completed ? "line-through" : "none",
                      cursor: "pointer",
                    }}
                    onClick={() => toggleTaskComplete(task)}
                  >
                    {task.title} - {task.completed ? "✅" : "❌"}
                  </span>{" "}
                  <button onClick={() => {
                    setEditingTaskId(task.id);
                    setNewTask({ title: task.title, description: task.description || "" });
                  }}>Edit</button>{" "}
                  <button onClick={() => handleDeleteTask(task.id)}>Delete</button>
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
