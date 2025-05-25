import { faTimes } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { NotificationType, type EventMessage } from "~/types/notification"
import { formatDateBR, getTransactionTypeLabel } from "~/utils/util"

interface ModalProps {
  transaction: EventMessage
  onClose: () => void
}

export const Modal = ({ transaction, onClose }: ModalProps) => {
    return (
      <div className="fixed top-0 left-0 w-screen h-screen bg-black bg-opacity-70 flex items-center justify-center min-h-screen z-[1000] overflow-auto">
        <div
          className="bg-white/95 dark:bg-slate-950/95 backdrop-blur-lg rounded-2xl shadow-2xl w-full max-w-md mx-4 p-10 border-2 border-gray-200/50 dark:border-gray-700/50 transition-colors duration-300 transform scale-95 animate-scale-in"
          role="dialog"
          aria-labelledby="transaction-details-title"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 p-3 rounded-full hover:bg-gray-200/50 dark:hover:bg-gray-600/50 transition-all duration-200 shadow-md hover:shadow-lg"
            aria-label="Fechar modal"
          >
            <FontAwesomeIcon icon={faTimes} className="text-2xl" />
          </button>
          <h3
            id="transaction-details-title"
            className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-8 tracking-tight transition-colors duration-300"
          >
            Detalhes da Transação
          </h3>
          <div className="space-y-6 text-sm text-gray-600 dark:text-gray-300 transition-colors duration-300">
            <p>
              <strong className="font-semibold text-gray-900 dark:text-gray-100">ID:</strong>{' '}
              <span className="font-medium">{transaction.eventId}</span>
            </p>
            <p>
              <strong className="font-semibold text-gray-900 dark:text-gray-100">Data:</strong>{' '}
              <span className="font-medium">{formatDateBR(transaction.date)}</span>
            </p>
            <p>
              <strong className="font-semibold text-gray-900 dark:text-gray-100">Tipo:</strong>{' '}
              <span className="font-medium">{getTransactionTypeLabel(transaction.transferType)}</span>
            </p>
            <p>
              <strong className="font-semibold text-gray-900 dark:text-gray-100">Valor:</strong>{' '}
              <span
                className={`font-medium ${
                  transaction.action === NotificationType.TRANSFER_RECEIVE ? 'text-green-500' : 'text-red-500'
                }`}
              >
                {transaction.amount}
              </span>
            </p>
            {transaction.fullName && (
              <p>
                <strong className="font-semibold text-gray-900 dark:text-gray-100">Nome:</strong>{' '}
                <span className="font-medium">{transaction.fullName}</span>
              </p>
            )}
            {transaction.userReceive && (
              <p>
                <strong className="font-semibold text-gray-900 dark:text-gray-100">Destinatário:</strong>{' '}
                <span className="font-medium">{transaction.userReceive}</span>
              </p>
            )}
            {transaction.details && (
              <p>
                <strong className="font-semibold text-gray-900 dark:text-gray-100">Detalhes:</strong>{' '}
                <span className="font-medium">{transaction.details}</span>
              </p>
            )}
          </div>
          <div className="flex justify-end space-x-4 mt-10">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 text-white rounded-lg text-sm font-semibold transition-all duration-200 shadow-md hover:shadow-lg"
              aria-label="Fechar modal"
            >
              Fechar
            </button>
          </div>
        </div>
      </div>
    );
  };