// src/components/Notification.tsx
import React, { useEffect } from "react";

interface NotificationProps {
  message: string;
  type?: "success" | "error" | "info";
  duration?: number; // milliseconds
  onClose: () => void;
}

const Notification: React.FC<NotificationProps> = ({
  message,
  type = "info",
  duration = 4000,
  onClose,
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const getBackground = () => {
    switch (type) {
      case "success":
        return "#4caf50";
      case "error":
        return "#f44336";
      case "info":
      default:
        return "#2196f3";
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        top: "20px",
        right: "20px",
        padding: "1rem 1.5rem",
        borderRadius: "8px",
        backgroundColor: getBackground(),
        color: "white",
        boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
        zIndex: 9999,
        minWidth: "200px",
      }}
    >
      {message}
    </div>
  );
};

export default Notification;
