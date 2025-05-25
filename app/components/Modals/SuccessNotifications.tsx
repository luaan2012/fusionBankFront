import { useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faTimes } from '@fortawesome/free-solid-svg-icons';

interface SuccessNotificationProps {
  message: string;
  isOpen: boolean;
  onClose: () => void;
}

export const SuccessNotification = ({ message, isOpen, onClose }: SuccessNotificationProps) => {
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        onClose();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center transform transition-transform duration-300 z-50 translate-x-0">
      <FontAwesomeIcon icon={faCheckCircle} className="mr-3 text-xl" />
      <div>
        <p className="font-medium">Operação realizada com sucesso!</p>
        <p className="text-sm opacity-90">{message}</p>
      </div>
      <button onClick={onClose} className="ml-6 opacity-70 hover:opacity-100">
        <FontAwesomeIcon icon={faTimes} />
      </button>
    </div>
  );
};