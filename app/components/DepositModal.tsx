import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { formatToBRL } from '~/utils/utils';

interface ConfirmationDetails {
  amount: string;
  description?: string;
  destination?: string; // For boleto deposit
  expenseCategory?: string; // For boleto expense
}

interface ConfirmationModalDepositProps {
  show: boolean;
  onClose: () => void;
  details: ConfirmationDetails | null;
  onConfirm: () => Promise<void>;
  reset: () => void;
}

export const ConfirmationModalDeposit: React.FC<ConfirmationModalDepositProps> = ({
  show,
  onClose,
  details,
  onConfirm,
  reset,
}) => {
  if (!show || !details) return null;

  const handleConfirm = async () => {
    await onConfirm();
    reset();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Confirmar {details.destination ? 'Boleto de Depósito' : details.expenseCategory ? 'Boleto de Gasto' : 'Depósito Direto'}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-100"
            aria-label="Fechar modal"
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>
        <div className="space-y-4">
          <div className="flex justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-300">Valor</span>
            <span className="text-sm font-semibold text-gray-900 dark:text-white">{formatToBRL(details.amount)}</span>
          </div>
          {details.description && (
            <div className="flex justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-300">Descrição</span>
              <span className="text-sm font-semibold text-gray-900 dark:text-white">{details.description}</span>
            </div>
          )}
          {details.destination && (
            <div className="flex justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-300">Destinatário</span>
              <span className="text-sm font-semibold text-gray-900 dark:text-white">{details.destination}</span>
            </div>
          )}
          {details.expenseCategory && (
            <div className="flex justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-300">Categoria</span>
              <span className="text-sm font-semibold text-gray-900 dark:text-white">
                {details.expenseCategory.charAt(0).toUpperCase() + details.expenseCategory.slice(1)}
              </span>
            </div>
          )}
        </div>
        <div className="mt-6 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-200"
            aria-label="Cancelar"
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirm}
            className="px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-all duration-200"
            aria-label="Confirmar"
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
};