import Notification from "./components/Notification";

// Inside your App component
const [notifications, setNotifications] = useState<
  { id: number; message: string; type?: "success" | "error" | "info" }[]
>([]);

const addNotification = (message: string, type?: "success" | "error" | "info") => {
  const id = Date.now();
  setNotifications((prev) => [...prev, { id, message, type }]);
};

// When an action succeeds or fails, call addNotification:
// Example: after adding a user
const handleAddUser = async () => {
  if (!token) return;
  try {
    await Api.createUser(newUser, token);
    setNewUser({ name: "", email: "" });
    fetchUsers();
    addNotification("User added successfully!", "success");
  } catch (err: any) {
    console.error(err);
    addNotification("Failed to add user.", "error");
  }
};

// Render notifications
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
