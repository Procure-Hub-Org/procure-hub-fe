import { createContext, useContext, useState } from "react";
const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState({ show: false, message: "", type: "" });

  const showToast = (message, type) => {
    setToast({ show: false, message: "", type: "" }); // Reset first
    setTimeout(() => {
      setToast({ show: true, message, type });
    }, 0);
  };

  const hideToast = () => setToast({ ...toast, show: false });
  return (
    <ToastContext.Provider value={{ toast, showToast, hideToast }}>
      {children}
    </ToastContext.Provider>
  );
};

export function useToast() {
  return useContext(ToastContext);
}