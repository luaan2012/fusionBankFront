import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faTimes } from '@fortawesome/free-solid-svg-icons';

interface SuccessToastProps {
  isOpen: boolean;
  message: string;
  onClose: () => void;
}

export const SuccessToast = ({ isOpen, message, onClose }: SuccessToastProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed bottom-4 right-4 w-full max-w-xs bg-green-100 dark:bg-green-800 border border-green-200 dark:border-green-700 rounded-lg shadow-lg toast">
      <div className="flex items-center p-4">
        <div className="flex-shrink-0">
          <FontAwesomeIcon icon={faCheckCircle} className="text-green-600 dark:text-green-300 text-xl" />
        </div>
        <div className="ml-3">
          <p className="text-sm font-medium text-green-800 dark:text-green-200">Transferência realizada!</p>
          <p className="text-xs text-green-600 dark:text-green-300 mt-1">{message}</p>
        </div>
        <button
          onClick={onClose}
          className="ml-auto -mx-1.5 -my-1.5 bg-green-100 dark:bg-green-800 text-green-500 dark:text-green-300 rounded-lg p-1.5 hover:bg-green-200 dark:hover:bg-green-700"
        >
          <FontAwesomeIcon icon={faTimes} />
        </button>
      </div>
    </div>
  );
};
