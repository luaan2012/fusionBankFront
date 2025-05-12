import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faTimes } from '@fortawesome/free-solid-svg-icons';

interface ToastProps {
  message: string;
  duration?: number; // Duração em milissegundos (opcional, padrão 5000ms)
}

const Notification: React.FC<ToastProps> = ({ message, duration = 5000 }) => {
  const [isVisible, setIsVisible] = useState(!!message);

  useEffect(() => {
    if (!message) {
      setIsVisible(false);
      return;
    }

    setIsVisible(true);

    // Tocar som de notificação
    const audio = new Audio('/sounds/notificationtransfer.wav');
    audio.play().catch((error) => {
      console.warn('Falha ao reproduzir som de notificação:', error);
    });

    // Configurar temporizador para fechar a notificação
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, duration);

    return () => {
      audio.pause();
      audio.currentTime = 0;
      clearTimeout(timer);
    };
  }, [message, duration]);

  const handleClose = () => {
    setIsVisible(false);
  };

  if (!isVisible || !message) return null;

  return (
    <div
      className="fixed bottom-6 right-6 bg-gradient-to-r from-gray-900 to-gray-700 dark:from-gray-800 dark:to-gray-600 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 max-w-sm w-full animate-slide-in transition-all duration-300"
      role="alert"
      aria-live="assertive"
    >
      <FontAwesomeIcon
        icon={faBell}
        className="text-yellow-400 text-lg animate-pulse"
      />
      <span className="text-sm font-medium">{message}</span>
      <button
        onClick={handleClose}
        className="ml-auto text-gray-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 rounded-full p-1"
        aria-label="Fechar notificação"
      >
        <FontAwesomeIcon icon={faTimes} className="text-sm" />
      </button>
    </div>
  );
};

export default Notification;