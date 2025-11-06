const apiBaseUrl = process.env.REACT_APP_API_URL || "http://localhost:8080";

export interface Task {
  id: number;
  title: string;
  description: string;
}

export const fetchTasks = async (): Promise<Task[]> => {
  const res = await fetch(`${apiBaseUrl}/api/tasks`);
  if (!res.ok) throw new Error("Failed to fetch tasks");
  return res.json();
};

export const createTask = async (title: string, description: string): Promise<Task> => {
  const res = await fetch(`${apiBaseUrl}/api/tasks`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, description }),
  });
  if (!res.ok) throw new Error("Failed to create task");
  return res.json();
};
