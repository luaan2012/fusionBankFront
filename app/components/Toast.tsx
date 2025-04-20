import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell } from '@fortawesome/free-solid-svg-icons';

interface ToastProps {
  message: string;
}

const Toast: React.FC<ToastProps> = ({ message }) => {
  return (
    <div className="fixed bottom-4 right-4 bg-gray-800 text-white px-4 py-2 rounded-lg shadow-lg flex items-center smooth-transition animate-fade-in">
      <FontAwesomeIcon icon={faBell} className="text-yellow-400 mr-2" />
      <span>{message}</span>
    </div>
  );
};

export default Toast;