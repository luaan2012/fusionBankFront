import { useState } from 'react';
import { createPortal } from 'react-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUp, faArrowDown, faInfoCircle, faTimes } from '@fortawesome/free-solid-svg-icons';
import type { EventMessage } from '~/models/eventMessage';
import { TransferType } from '~/models/enum/transferType';
import { formatDateBR, getTransactionTypeLabel } from '~/utils/utils';
import { NotificationType } from '~/models/enum/notificationType';

interface RecentTransactionsFullProps {
  transactions: EventMessage[];
  loading: boolean;
}

export function RecentTransactionsFull({ transactions, loading }: RecentTransactionsFullProps) {
  const [selectedTransaction, setSelectedTransaction] = useState<EventMessage | null>(null);

  const getTransactionIcon = (type: NotificationType) => {
    return type === NotificationType.TRANSFER_RECEIVE ? (
      <FontAwesomeIcon icon={faArrowUp} className="text-green-500 transition-colors duration-300" />
    ) : (
      <FontAwesomeIcon icon={faArrowDown} className="text-red-500 transition-colors duration-300" />
    );
  };

  const handleDetailsClick = (transaction: EventMessage) => {
    setSelectedTransaction(transaction);
  };

  const modalRoot = document.getElementById('modal-root') || document.body;

  const Modal = ({ transaction, onClose }: { transaction: EventMessage; onClose: () => void }) => {
    return createPortal(
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
      </div>,
      modalRoot
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-primary transition-colors duration-300">
      <main role="main" className="container mx-auto px-4 py-8">
        <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-lg rounded-2xl shadow-2xl p-8 transition-colors duration-300 animate-fade-in">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-8 tracking-tight transition-colors duration-300">
            Extrato Completo
          </h2>
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-10 w-10 border-t-3 border-b-3 border-blue-600 dark:border-blue-500 transition-colors duration-300"></div>
            </div>
          ) : transactions.length === 0 ? (
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 text-center py-12 transition-colors duration-300">
              Nenhuma transação encontrada.
            </p>
          ) : (
            <div className="overflow-x-auto animate-fade-in">
              <table className="w-full text-left rounded-lg">
                <thead>
                  <tr className="border-b border-gray-200/50 dark:border-gray-700/50 transition-colors duration-300">
                    <th className="py-4 px-6 text-gray-700 dark:text-gray-300 text-sm font-semibold tracking-wide transition-colors duration-300">
                      Data
                    </th>
                    <th className="py-4 px-6 text-gray-700 dark:text-gray-300 text-sm font-semibold tracking-wide transition-colors duration-300">
                      Tipo
                    </th>
                    <th className="py-4 px-6 text-gray-700 dark:text-gray-300 text-sm font-semibold tracking-wide transition-colors duration-300">
                      Valor
                    </th>
                    <th className="py-4 px-6 text-gray-700 dark:text-gray-300 text-sm font-semibold tracking-wide transition-colors duration-300">
                      Detalhes
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((transaction, index) => (
                    <tr
                      key={transaction.eventId}
                      className={`border-b border-gray-200/50 dark:border-gray-700/50 transition-all duration-200 ${
                        index % 2 === 0
                          ? 'bg-gray-50/30 dark:bg-gray-900/20'
                          : 'bg-white/30 dark:bg-slate-950/20'
                      } hover:bg-gray-100/50 dark:hover:bg-gray-700/50 rounded-lg`}
                    >
                      <td className="py-4 px-6 text-gray-900 dark:text-gray-100 text-sm font-medium transition-colors duration-300">
                        {formatDateBR(transaction.date)}
                      </td>
                      <td className="py-4 px-6 text-gray-900 dark:text-gray-100 text-sm font-medium transition-colors duration-300">
                        <div className="flex items-center gap-3">
                          {getTransactionIcon(transaction.action)}
                          <span className="font-semibold">{getTransactionTypeLabel(transaction.transferType)}</span>
                        </div>
                      </td>
                      <td
                        className={`py-4 px-6 text-sm font-semibold ${
                          transaction.action === NotificationType.TRANSFER_RECEIVE
                            ? 'text-green-500'
                            : 'text-red-500'
                        } transition-colors duration-300`}
                      >
                        {transaction.amount}
                      </td>
                      <td className="py-4 px-6">
                        <button
                          onClick={() => handleDetailsClick(transaction)}
                          className="text-blue-600 dark:text-blue-500 hover:text-blue-700 dark:hover:text-blue-600 p-2 rounded-full hover:bg-gray-200/50 dark:hover:bg-gray-600/50 transition-all duration-200 shadow-sm hover:shadow-md"
                          aria-label="Ver detalhes da transação"
                        >
                          <FontAwesomeIcon icon={faInfoCircle} className="text-lg" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {selectedTransaction && (
            <Modal transaction={selectedTransaction} onClose={() => setSelectedTransaction(null)} />
          )}
        </div>
      </main>
      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes scale-in {
          from {
            transform: scale(0.95);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
        .animate-fade-in {
          animation: fade-in 0.4s ease-out;
        }
        .animate-scale-in {
          animation: scale-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}