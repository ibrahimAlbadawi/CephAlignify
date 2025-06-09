import { useContext } from "react";
import { NotificationContext } from '../context/NotificationProvider'; // Adjust path if needed

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotification must be used within a NotificationProvider");
  }
  return context.showNotification;
};
