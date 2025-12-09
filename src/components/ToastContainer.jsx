import React, { useEffect } from 'react';
import { useSmartSpace } from '../context/SmartSpaceContext';
import { X } from 'lucide-react';

const Toast = ({ toast, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(toast.id);
    }, 3000);
    return () => clearTimeout(timer);
  }, [toast.id, onClose]);

  return (
    <div className={`toast toast-${toast.type}`}>
      <span>{toast.message}</span>
      <button onClick={() => onClose(toast.id)} className="toast-close">
        <X size={14} />
      </button>
    </div>
  );
};

const ToastContainer = () => {
  const { toasts, removeToast } = useSmartSpace();

  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} onClose={removeToast} />
      ))}
    </div>
  );
};

export default ToastContainer;
