import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCreditCard, faMoneyBillWave, faWifi } from '@fortawesome/free-solid-svg-icons';
import { useToast } from '../Toasts/ToastContext'
import { formatToBRL } from '~/utils/util'

interface RequestCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (cardType: string, limit: number) => void;
}

export const RequestCardModal = ({ isOpen, onClose, onConfirm }: RequestCardModalProps) => {
  const [cardType, setCardType] = useState<'credit' | 'debit' | 'virtual' | null>(null);
  const [limit, setLimit] = useState<number>(2000);
  const { openToast } = useToast()

  const handleConfirm = () => {
    if(!cardType) {
      openToast({
        message: 'Selecione uma opçao antes de continuar',
        type: 'error',
        position: 'top-right',
        duration: 3000
      })

      return;
    }

    onConfirm(cardType, limit)
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-all duration-300">
      <div className="relative bg-white dark:bg-dark-700 rounded-2xl shadow-2xl overflow-hidden max-w-md mx-4 w-full">
        {/* Inner Glow Border */}
        <div className="absolute inset-0 m-1 rounded-2xl bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none" />

        {/* Modal Content with Glassmorphic Effect */}
        <div className="relative p-6 border-b border-gray-200 dark:border-dark-600 backdrop-blur-sm bg-white/5">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.2),transparent_50%)] opacity-70" />
          <h3 className="text-xl font-semibold text-white drop-shadow-md z-10 relative">Solicitar novo cartão</h3>
        </div>
        <div className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2 text-white/90 dark:text-gray-300 uppercase tracking-wide drop-shadow-sm">
              Tipo de cartão
            </label>
            <div className="grid grid-cols-3 gap-4">
              {[
                { type: 'credit', icon: faCreditCard, label: 'Crédito' },
                { type: 'debit', icon: faMoneyBillWave, label: 'Débito' },
                { type: 'virtual', icon: faWifi, label: 'Virtual' },
              ].map((option) => (
                <button
                  key={option.type}
                  onClick={() => setCardType(option.type as typeof cardType)}
                  className={`py-4 px-6 border rounded-lg text-base font-medium hover:border-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900 transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-indigo-500/50 ${
                    cardType === option.type
                      ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900'
                      : 'border-gray-300 dark:border-dark-600'
                  }`}
                  aria-label={`Selecionar ${option.label}`}
                >
                  <FontAwesomeIcon
                    icon={option.icon}
                    className="block text-3xl mb-3 text-white/95"
                  />
                  {option.label}
                </button>
              ))}
            </div>
          </div>
          {cardType === 'credit' && (
            <div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2 text-white/90 dark:text-gray-300 uppercase tracking-wide drop-shadow-sm">
                  Limite solicitado
                </label>
                <input
                  type="range"
                  min="500"
                  max="100000"
                  step="100"
                  value={limit}
                  onChange={(e) => setLimit(parseInt(e.target.value))}
                  className="w-full h-3 bg-gradient-to-r from-gray-300 to-gray-500 rounded-lg appearance-none cursor-pointer dark:from-gray-600 dark:to-gray-800 accent-indigo-500"
                  style={{
                    background: `linear-gradient(to right, #4B5EFC ${((limit - 500) / 95000) * 100}%, #D1D5DB ${((limit - 500) / 95000) * 100}%)`,
                  }}
                  aria-valuenow={limit}
                  aria-label="Ajustar limite solicitado"
                />
                <div className="flex justify-between items-center mt-2">
                  <span className="text-xs text-white/80 dark:text-gray-300">R$ 500</span>
                  <div className="px-3 py-1 backdrop-blur-sm bg-white/10 rounded-lg shadow-md text-lg font-bold text-white drop-shadow-lg transition-all duration-300">
                    {formatToBRL(limit)}
                  </div>
                  <span className="text-xs text-white/80 dark:text-gray-300">R$ 100.000,00</span>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="p-4 border-t border-gray-200 dark:border-dark-600 flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-6 py-3 border border-gray-300 dark:border-dark-600 rounded-lg text-base font-medium text-white dark:text-gray-300 transition-all duration-300 hover:bg-gray-100 dark:hover:bg-dark-600 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-gray-500/50"
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirm}
            className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg text-base font-medium transition-all duration-300 hover:from-indigo-600 hover:to-purple-700 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-indigo-500/50"
          >
            Solicitar cartão
          </button>
        </div>
      </div>
    </div>
  );
};
