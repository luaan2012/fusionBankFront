import React, { useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell } from '@fortawesome/free-solid-svg-icons';

interface ToastProps {
  message: string;
}

const Notification: React.FC<ToastProps> = ({ message }) => {
  if(!message) return null;

  useEffect(() => {
    // Tocar som de notificação
    const audio = new Audio('/sounds/notificationtransfer.wav');
    audio.play().catch((error) => {
      console.warn('Falha ao reproduzir som de notificação:', error);
    });

    return () => {
      audio.pause();
      audio.currentTime = 0;
    };
  }, [message]);
  
  return (
    <div className="fixed bottom-4 right-4 bg-gray-800 text-white px-4 py-2 rounded-lg shadow-lg flex items-center smooth-transition animate-fade-in">
      <FontAwesomeIcon icon={faBell} className="text-yellow-400 mr-2 animate-shake" />
      <span>{message}</span>
    </div>
  );
};

export default Notification;