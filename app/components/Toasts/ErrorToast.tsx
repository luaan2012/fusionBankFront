import React, { useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationCircle, faTimes } from '@fortawesome/free-solid-svg-icons';

interface ErrorToastProps {
  message: string;
  onClose: () => void;
}

export const ErrorToast = ({ message, onClose }: ErrorToastProps) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed bottom-4 right-4 w-full max-w-xs bg-red-100 dark:bg-red-800 border border-red-200 dark:border-red-700 rounded-lg shadow-lg toast">
      <div className="flex items-center p-4">
        <div className="flex-shrink-0">
          <FontAwesomeIcon icon={faExclamationCircle} className="text-red-600 dark:text-red-300 text-xl" />
        </div>
        <div className="ml-3">
          <p className="text-sm font-medium text-red-800 dark:text-red-200">{message}</p>
        </div>
        <button
          onClick={onClose}
          className="ml-auto -mx-1.5 -my-1.5 bg-red-100 dark:bg-red-800 text-red-500 dark:text-red-300 rounded-lg p-1.5 hover:bg-red-200 dark:hover:bg-red-700"
        >
          <FontAwesomeIcon icon={faTimes} />
        </button>
      </div>
    </div>
  );
};