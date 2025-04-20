import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCreditCard, faMoneyBillWave, faWifi } from '@fortawesome/free-solid-svg-icons';

interface RequestCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const RequestCardModal: React.FC<RequestCardModalProps> = ({ isOpen, onClose, onConfirm }) => {
  const [cardType, setCardType] = useState<'credit' | 'debit' | 'virtual' | null>(null);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-dark-700 rounded-xl shadow-xl w-full max-w-md mx-4">
        <div className="p-6 border-b border-gray-200 dark:border-dark-600">
          <h3 className="text-xl font-semibold dark:text-white">Solicitar novo cartão</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2 dark:text-gray-300">
                Tipo de cartão
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { type: 'credit', icon: faCreditCard, label: 'Crédito' },
                  { type: 'debit', icon: faMoneyBillWave, label: 'Débito' },
                  { type: 'virtual', icon: faWifi, label: 'Virtual' },
                ].map((option) => (
                  <button
                    key={option.type}
                    onClick={() => setCardType(option.type as typeof cardType)}
                    className={`py-3 px-4 border rounded-lg text-sm font-medium dark:text-white hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900 ${
                      cardType === option.type
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900'
                        : 'border-gray-300 dark:border-dark-600'
                    }`}
                  >
                    <FontAwesomeIcon icon={option.icon} className="block text-2xl mb-2" />
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
            {cardType === 'credit' && (
              <div>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2 dark:text-gray-300">
                    Limite solicitado
                  </label>
                  <input
                    type="range"
                    min="500"
                    max="10000"
                    step="100"
                    defaultValue="2000"
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                  />
                  <div className="flex justify-between text-xs text-gray-500 dark:text-gray-300 mt-1">
                    <span>R$ 500</span>
                    <span>R$ 10.000</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="p-4 border-t border-gray-200 dark:border-dark-600 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg text-sm font-medium dark:text-white"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium"
          >
            Solicitar cartão
          </button>
        </div>
      </div>
    </div>
  );
};

export default RequestCardModal;