import React, { useState, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faClock, faLock } from '@fortawesome/free-solid-svg-icons';
import type { ConfirmationDetails } from 'types';
import type { TransactionType, TransferType } from '~/models/enum/transferType'

interface ConfirmationModalProps {
  show: boolean;
  onClose: () => void;
  onConfirm: (passwordTransaction: string) => void;
  reset?: () => void; // Optional, for resetting form state
  details: ConfirmationDetails | null;
  title?: string; // Optional custom title
  confirmButtonText?: string; // Optional custom confirm button text
}

export function ConfirmationModalTransaction({
  show,
  onClose,
  onConfirm,
  reset,
  details,
  title = 'Confirme sua transação',
  confirmButtonText = 'Confirmar',
}: ConfirmationModalProps) {
  const [code, setCode] = useState(['', '', '', '']);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleCodeChange = (index: number, value: string) => {
    if (/^[0-9]?$/.test(value)) {
      const newCode = [...code];
      newCode[index] = value;
      setCode(newCode);

      if (value && index < 3) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      const newCode = [...code];
      newCode[index - 1] = '';
      setCode(newCode);
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleClose = () => {
    setCode(['', '', '', '']);
    if (reset) reset();
    onClose();
  };

  const handleConfirm = () => {
    onConfirm(code.join(''));
    setCode(['', '', '', '']);
  };

  const isCodeComplete = code.every((digit) => digit !== '');

  if (!show || !details) return null;

  // Map transaction types to human-readable labels
  const transactionTypeLabels: Record<TransactionType, string> = {
    transfer: 'Transferência',
    investment: 'Investimento',
    billPayment: 'Pagamento de Boleto',
    deposit: 'Depósito',
  };

  // Define field labels for details (customize as needed)
  const detailFieldLabels: Record<string, string> = {
    source: 'Origem',
    destination: 'Destino',
    fundName: 'Fundo',
    applicationDate: 'Data de Aplicação',
    payee: 'Beneficiário',
    dueDate: 'Data de Vencimento',
    barcode: 'Código de Barras',
    account: 'Conta',
    method: 'Método',
  };

  return (
    <div
      id="confirmation-modal"
      className="fixed inset-0 bg-gray-950 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center"
      role="dialog"
      aria-labelledby="confirmation-modal-title"
    >
      <div
        className="relative mx-auto p-6 border w-11/12 md:w-2/3 lg:w-1/2 rounded-xl shadow-md bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 transition-all duration-300 animate-slide-in"
        aria-modal="true"
      >
        <div className="flex justify-between items-center mb-6">
          <h3
            id="confirmation-modal-title"
            className="text-xl font-semibold text-gray-900 dark:text-gray-100"
          >
            {title}
          </h3>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 transition-colors duration-200"
            aria-label="Fechar modal"
          >
            <FontAwesomeIcon icon={faTimes} className="text-xl" />
          </button>
        </div>

        <div className="mb-6">
          {/* Transaction Summary */}
          <div
            className="rounded-xl p-5 bg-gradient-to-br from-blue-50 to-white dark:from-blue-900 dark:to-gray-800 border border-gray-200 dark:border-gray-700 shadow-md hover:shadow-lg transition-all duration-300 mb-6"
            role="region"
            aria-labelledby="transaction-summary-title"
          >
            <h4
              id="transaction-summary-title"
              className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center"
            >
              <FontAwesomeIcon icon={faLock} className="text-blue-600 dark:text-blue-400 mr-2" />
              Resumo da {transactionTypeLabels[details.transactionType]}
            </h4>
            <div className="grid grid-cols-1 gap-4">
              <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Valor</span>
                <span className="text-base font-bold text-gray-900 dark:text-gray-100">{details.amount}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Taxa</span>
                <span className="text-base font-bold text-gray-900 dark:text-gray-100">{details.tax}</span>
              </div>
              <div className="flex justify-between items-center pt-3">
                <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">Total</span>
                <span className="text-xl font-bold text-blue-600 dark:text-blue-400">{details.total}</span>
              </div>
            </div>
          </div>

          {/* Transaction Details */}
          {Object.keys(details.details).length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {Object.entries(details.details).map(([key, value]) => (
                <div
                  key={key}
                  className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-300"
                >
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                    {detailFieldLabels[key] || key.charAt(0).toUpperCase() + key.slice(1)}
                  </p>
                  <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{value}</p>
                </div>
              ))}
            </div>
          )}

          {details.description && (
            <div className="mb-6">
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Descrição</p>
              <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{details.description}</p>
            </div>
          )}

          {details.scheduleDate && (
            <div className="mb-6 flex items-center">
              <FontAwesomeIcon icon={faClock} className="text-blue-600 dark:text-blue-400 mr-2" />
              <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
                Agendado para {details.scheduleDate}
              </p>
            </div>
          )}
        </div>

        {/* PIN Verification */}
        <div id="pin-verification">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
            Verificação de Senha
          </h4>
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
            Insira o PIN de 4 dígitos do aplicativo para confirmar a {transactionTypeLabels[details.transactionType].toLowerCase()}:
          </p>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
              PIN de 4 dígitos
            </label>
            <div className="flex space-x-2 justify-center">
              {code.map((digit, index) => (
                <input
                  key={index}
                  type="password"
                  maxLength={1}
                  value={digit}
                  ref={(el) => (inputRefs.current[index] = el) as any}
                  className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-12 h-12 text-center p-0 transition-all duration-200 hover:shadow-md"
                  onChange={(e) => handleCodeChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  aria-label={`Dígito ${index + 1} do PIN`}
                />
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              className="px-4 py-2 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 font-medium rounded-lg text-sm hover:shadow-md hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-300 transition-all duration-200"
              onClick={handleClose}
              aria-label="Cancelar transação"
            >
              Cancelar
            </button>
            <button
              className="px-6 py-2 bg-blue-600 dark:bg-blue-500 text-white font-medium rounded-lg text-sm hover:bg-blue-700 dark:hover:bg-blue-600 hover:shadow-md hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleConfirm}
              aria-label={`Confirmar ${transactionTypeLabels[details.transactionType].toLowerCase()}`}
              disabled={!isCodeComplete}
            >
              {confirmButtonText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}