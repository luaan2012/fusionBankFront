import React, { useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faExclamationCircle, faExclamationTriangle, faTimes } from '@fortawesome/free-solid-svg-icons';

type ToastType = 'success' | 'error' | 'warning';
type ToastPosition = 'top-left' | 'top-mid' | 'top-right' | 'bottom-left' | 'bottom-right';

interface ToastProps {
  isOpen: boolean;
  message: string;
  type?: ToastType;
  position?: ToastPosition;
  duration?: number;
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({
  isOpen,
  message,
  type = 'success',
  position = 'bottom-right',
  duration = 3000,
  onClose,
}) => {
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [isOpen, duration, onClose]);

  if (!isOpen) return null;

  const config = {
    success: {
      bg: 'bg-green-200 dark:bg-green-800',
      border: 'border-green-300 dark:border-green-700',
      icon: faCheckCircle,
      iconColor: 'text-green-50 dark:text-green-200',
      textColor: 'text-white dark:text-white',
      secondaryTextColor: 'text-green-100 dark:text-green-200',
      buttonBg: 'bg-green-200 dark:bg-green-800',
      buttonText: 'text-green-50 dark:text-green-200',
      buttonHover: 'hover:bg-green-300 dark:hover:bg-green-700',
    },
    error: {
      bg: 'bg-red-200 dark:bg-red-800',
      border: 'border-red-300 dark:border-red-700',
      icon: faExclamationCircle,
      iconColor: 'text-red-50 dark:text-red-200',
      textColor: 'text-white dark:text-white',
      secondaryTextColor: 'text-red-100 dark:text-red-200',
      buttonBg: 'bg-red-200 dark:bg-red-800',
      buttonText: 'text-red-50 dark:text-red-200',
      buttonHover: 'hover:bg-red-300 dark:hover:bg-red-700',
    },
    warning: {
      bg: 'bg-yellow-200 dark:bg-yellow-800',
      border: 'border-yellow-300 dark:border-yellow-700',
      icon: faExclamationTriangle,
      iconColor: 'text-yellow-50 dark:text-yellow-200',
      textColor: 'text-white dark:text-white',
      secondaryTextColor: 'text-yellow-100 dark:text-yellow-200',
      buttonBg: 'bg-yellow-200 dark:bg-yellow-800',
      buttonText: 'text-yellow-50 dark:text-yellow-200',
      buttonHover: 'hover:bg-yellow-300 dark:hover:bg-yellow-700',
    },
  };

  const positionStyles = {
    'top-left': 'top-4 left-4',
    'top-mid': 'top-4 left-1/2 -translate-x-1/2',
    'top-right': 'top-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'bottom-right': 'bottom-4 right-4',
  };

  const { bg, border, icon, iconColor, textColor, secondaryTextColor, buttonBg, buttonText, buttonHover } = config[type];

  return (
    <div
      className={`fixed w-full max-w-xs ${bg} ${border} rounded-lg shadow-lg toast animate-slide-in ${positionStyles[position]} z-[100]`}
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
    >
      <div className="flex items-center p-4">
        <div className="flex-shrink-0">
          <FontAwesomeIcon icon={icon} className={`${iconColor} text-xl`} />
        </div>
        <div className="ml-3">
          <p className={`text-sm font-medium ${textColor}`}>
            {type === 'success' ? 'Sucesso!' : type === 'error' ? 'Erro!' : 'Aviso!'}
          </p>
          <p className={`text-xs ${secondaryTextColor} mt-1`}>{message}</p>
        </div>
        <button
          onClick={onClose}
          className={`ml-auto -mx-1.5 -my-1.5 ${buttonBg} ${buttonText} rounded-lg p-1.5 ${buttonHover} transition-colors duration-200`}
          aria-label="Fechar notificação"
        >
          <FontAwesomeIcon icon={faTimes} />
        </button>
      </div>
    </div>
  );
};

export default Toast;