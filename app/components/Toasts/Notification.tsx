import { useEffect, useState, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faTimes } from '@fortawesome/free-solid-svg-icons';

interface ToastProps {
  message: string;
  duration?: number; // Duração em milissegundos (opcional, padrão 5000ms)
}

export const Notification = ({ message, duration = 5000 }: ToastProps) => {
  const [isVisible, setIsVisible] = useState(!!message);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!message) {
      setIsVisible(false);
      return;
    }

    setIsVisible(true);

    // Preload and play audio
    if (!audioRef.current) {
      audioRef.current = new Audio('/sounds/notificationtransfer.wav');
      audioRef.current.preload = 'auto';
    }

    // Attempt to play audio
    const playAudio = async () => {
      try {
        await audioRef.current?.play();
      } catch (error) {
        console.warn('Falha ao reproduzir som de notificação:', error);
      }
    };

    playAudio();

    // Set timeout to close notification
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, duration);

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      clearTimeout(timer);
    };
  }, [message, duration]);

  const handleClose = () => {
    setIsVisible(false);
  };

  if (!isVisible || !message) return null;

  return (
    <div
      className="fixed bottom-6 right-6 bg-gradient-to-r from-blue-600 to-cyan-500 dark:from-blue-700 dark:to-cyan-600 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 max-w-sm w-full ring-1 ring-blue-500/20 backdrop-blur-sm animate-slide-in transition-all duration-300 z-50"
      role="alert"
      aria-live="assertive"
    >
      <FontAwesomeIcon
        icon={faBell}
        className="text-yellow-300 text-lg animate-pulse-slow"
      />
      <span className="text-base font-medium flex-1 drop-shadow-sm">
        {message}
      </span>
      <button
        onClick={handleClose}
        className="ml-auto text-white hover:text-cyan-300 focus:outline-none focus:ring-2 focus:ring-cyan-400 rounded-full p-1 transition-all duration-200"
        aria-label="Fechar notificação"
      >
        <FontAwesomeIcon icon={faTimes} className="text-sm" />
      </button>
    </div>
  );
};