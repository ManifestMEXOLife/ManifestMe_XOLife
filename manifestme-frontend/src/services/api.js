// src/api.js
const BASE_URL =
  process.env.NODE_ENV === "development"
    ? process.env.REACT_APP_API_URL_LOCAL
    : process.env.REACT_APP_API_URL;

const headers = {
  "Content-Type": "application/json",
};

// ---------------- Users ----------------
export const getUsers = async () => {
  try {
    const res = await fetch(`${BASE_URL}/users`);
    if (!res.ok) throw new Error("Failed to fetch users");
    return await res.json();
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const createUser = async (user: { name: string; email: string }) => {
  try {
    const res = await fetch(`${BASE_URL}/users`, {
      method: "POST",
      headers,
      body: JSON.stringify(user),
    });
    if (!res.ok) throw new Error("Failed to create user");
    return await res.json();
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const deleteUser = async (id: string) => {
  try {
    const res = await fetch(`${BASE_URL}/users/${id}`, {
      method: "DELETE",
      headers,
    });
    if (!res.ok) throw new Error("Failed to delete user");
    return await res.json();
  } catch (err) {
    console.error(err);
    throw err;
  }
};

// ---------------- Tasks ----------------
export const getTasks = async () => {
  try {
    const res = await fetch(`${BASE_URL}/tasks`);
    if (!res.ok) throw new Error("Failed to fetch tasks");
    return await res.json();
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const createTask = async (task: { title: string }) => {
  try {
    const res = await fetch(`${BASE_URL}/tasks`, {
      method: "POST",
      headers,
      body: JSON.stringify(task),
    });
    if (!res.ok) throw new Error("Failed to create task");
    return await res.json();
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const updateTask = async (
  id: string,
  updates: { completed: boolean }
) => {
  try {
    const res = await fetch(`${BASE_URL}/tasks/${id}`, {
      method: "PUT",
      headers,
      body: JSON.stringify(updates),
    });
    if (!res.ok) throw new Error("Failed to update task");
    return await res.json();
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const deleteTask = async (id: string) => {
  try {
    const res = await fetch(`${BASE_URL}/tasks/${id}`, {
      method: "DELETE",
      headers,
    });
    if (!res.ok) throw new Error("Failed to delete task");
    return await res.json();
  } catch (err) {
    console.error(err);
    throw err;
  }
};

// ---------------- Export default ----------------
export default {
  getUsers,
  createUser,
  deleteUser,
  getTasks,
  createTask,
  updateTask,
  deleteTask,
};
