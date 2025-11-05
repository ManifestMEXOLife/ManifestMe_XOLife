const [newTaskTitle, setNewTaskTitle] = useState("");
const [newTaskDescription, setNewTaskDescription] = useState("");

const handleAddTask = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!newTaskTitle) return;

  try {
    const res = await fetch(`${apiBaseUrl}/api/tasks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: newTaskTitle,
        description: newTaskDescription,
      }),
    });

    const createdTask = await res.json();
    setTasks((prev) => [...prev, createdTask]);
    toast.success("Task created!");
    setNewTaskTitle("");
    setNewTaskDescription("");
  } catch (err) {
    console.error(err);
    toast.error("Failed to create task");
  }
};
