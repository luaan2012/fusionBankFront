import React, { createContext, useContext, useState, useCallback } from 'react';
import { Toast } from './NewToast'

type ToastType = 'success' | 'error' | 'warning';
type ToastPosition = 'top-left' | 'top-mid' | 'top-right' | 'bottom-left' | 'bottom-right';

interface ToastConfig {
  message: string;
  type?: ToastType;
  position?: ToastPosition;
  duration?: number;
}

interface ToastContextType {
  openToast: (config: ToastConfig) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState<ToastConfig & { isOpen: boolean }>({ isOpen: false, message: '' });

  const openToast = useCallback((config: ToastConfig) => {
    setToast({ ...config, isOpen: true });
  }, []);

  const closeToast = useCallback(() => {
    setToast((prev) => ({ ...prev, isOpen: false }));
  }, []);

  return (
    <ToastContext.Provider value={{ openToast }}>
      {children}
      <Toast
        isOpen={toast.isOpen}
        message={toast.message}
        type={toast.type}
        position={toast.position}
        duration={toast.duration}
        onClose={closeToast}
      />
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};