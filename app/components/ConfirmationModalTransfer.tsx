import React, { useState } from 'react';
import type { ConfirmationDetails } from 'types'

interface ConfirmationModalProps {
  show: boolean;
  onClose: () => void;
  onConfirm: () => void;
  reset: () => void
  details: ConfirmationDetails | null;
}

export function ConfirmationModalTransfer ({ show, onClose, onConfirm, details }: ConfirmationModalProps) {
  const [code, setCode] = useState(['', '', '', '', '', '']);

  const handleCodeChange = (index: number, value: string) => {
    if (/^[0-9]?$/.test(value)) {
      const newCode = [...code];
      newCode[index] = value;
      setCode(newCode);
      if (value && index < 5) {
        const nextInput = document.querySelector(`input[data-index="${index + 1}"]`) as HTMLInputElement;
        nextInput?.focus();
      }
    }
  };

  if (!show) return null;

  return (
    <div id="confirmation-modal" className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-2/3 lg:w-1/2 shadow-lg rounded-md bg-white dark:bg-slate-800 slide-in">
        <div className="flex justify-between items-center border-b border-gray-200 dark:border-slate-700 pb-3 mb-4">
          <h3 className="text-lg font-bold text-gray-800 dark:text-white">Confirme sua transação</h3>
          <button className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>
        <div className="mb-6">
          <div className="bg-gray-50 dark:bg-slate-700 rounded-lg p-4 mb-4">
            <div className="flex justify-between mb-3">
              <span className="text-sm text-gray-600 dark:text-gray-300">Valor</span>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-200">{details.amount}</span>
            </div>
            <div className="flex justify-between mb-3">
              <span className="text-sm text-gray-600 dark:text-gray-300">Taxa</span>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-200">{details.tax}</span>
            </div>
            <div className="flex justify-between border-t border-gray-200 dark:border-slate-600 pt-3">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Total</span>
              <span className="text-sm font-bold text-gray-800 dark:text-white">{details.total}</span>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Origem</p>
              <p className="text-sm text-gray-700 dark:text-gray-300">Conta Corrente • Ag. 1234 • C/C 56789-0</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Destino</p>
              <p className="text-sm text-gray-700 dark:text-gray-300">{details.destination}</p>
            </div>
          </div>
          <div className="mb-4">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Descrição</p>
            <p className="text-sm text-gray-700 dark:text-gray-300">{details.description}</p>
          </div>
          {details.scheduleDate && (
            <div className="mb-4">
              <p className="text-xs text-primary-600 dark:text-primary-400">
                <i className="fas fa-clock mr-1"></i> Agendado para {details.scheduleDate}
              </p>
            </div>
          )}
        </div>
        <div id="2fa-verification">
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
            Para confirmar, insira o código de verificação enviado para:
          </p>
          <div className="flex items-center mb-4">
            <div className="flex-1 bg-gray-50 dark:bg-slate-700 rounded-lg p-3">
              <div className="flex items-center">
                <div className="h-8 w-8 rounded-full bg-primary-100 dark:bg-slate-600 flex items-center justify-center mr-3">
                  <i className="fas fa-mobile-alt text-primary-600 dark:text-primary-400"></i>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Celular</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">(**) *****-5678</p>
                </div>
              </div>
            </div>
            <button className="ml-2 text-sm text-primary-600 dark:text-primary-400 hover:underline">Alterar</button>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Código de 6 dígitos
            </label>
            <div className="flex space-x-2">
              {code.map((digit, index) => (
                <input
                  key={index}
                  type="text"
                  maxLength={1}
                  value={digit}
                  data-index={index}
                  className="bg-gray-50 dark:bg-slate-700 border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-white text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-12 h-12 text-center p-0"
                  onChange={(e) => handleCodeChange(index, e.target.value)}
                />
              ))}
            </div>
          </div>
          <div className="flex justify-between items-center">
            <button className="text-sm text-primary-600 dark:text-primary-400 hover:underline">
              Reenviar código
            </button>
            <span className="text-xs text-gray-500 dark:text-gray-400">Válido por 5 minutos</span>
          </div>
          <div className="mt-6 flex justify-end space-x-3">
            <button
              className="px-4 py-2 border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-white font-medium rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-300 transition-colors"
              onClick={onClose}
            >
              Cancelar
            </button>
            <button
              className="px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 transition-colors"
              onClick={onConfirm}
            >
              Confirmar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};