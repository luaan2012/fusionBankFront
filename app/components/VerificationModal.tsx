import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface VerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const VerificationModal: React.FC<VerificationModalProps> = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div
        className="bg-white dark:bg-slate-950 rounded-xl shadow-xl w-full max-w-lg mx-4 transition-all duration-300"
        role="dialog"
        aria-labelledby="verification-modal-title"
      >
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 id="verification-modal-title" className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            Verificação de segurança
          </h3>
        </div>
        <div className="p-6">
          <div className="flex items-start mb-6">
            <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-400 mr-4 mt-1">
              <FontAwesomeIcon icon={['fas', 'shield-alt']} className="text-xl" />
            </div>
            <div>
              <p className="text-base font-semibold text-gray-900 dark:text-gray-100">
                Enviamos um código de 6 dígitos para seu celular
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Terminado em •••• 1234</p>
            </div>
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              Código de verificação
            </label>
            <div className="flex space-x-3 sm:space-x-2">
              {[...Array(6)].map((_, i) => (
                <input
                  key={i}
                  type="text"
                  maxLength={1}
                  className="w-14 h-14 sm:w-12 sm:h-12 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-center text-xl font-semibold text-gray-700 dark:text-gray-100 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  aria-label={`Dígito ${i + 1} do código de verificação`}
                />
              ))}
            </div>
          </div>
          <div className="text-center">
            <button
              className="text-blue-600 dark:text-blue-400 text-sm font-semibold hover:text-blue-700 dark:hover:text-blue-300 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              aria-label="Reenviar código de verificação"
            >
              Reenviar código
            </button>
          </div>
        </div>
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-100 rounded-lg text-sm font-semibold hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
            aria-label="Cancelar verificação"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 text-white rounded-lg text-sm font-semibold transition-all duration-200 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            aria-label="Verificar código"
          >
            Verificar
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerificationModal;