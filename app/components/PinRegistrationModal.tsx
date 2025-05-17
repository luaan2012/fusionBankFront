import React, { useState, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faLock } from '@fortawesome/free-solid-svg-icons';

interface PinRegistrationModalProps {
  show: boolean;
  onConfirm: (pin: string) => void;
}

export function PinRegistrationModal({ show, onConfirm }: PinRegistrationModalProps) {
  const [pin, setPin] = useState(['', '', '', '']);
  const [confirmPin, setConfirmPin] = useState(['', '', '', '']);
  const pinRefs = useRef<(HTMLInputElement | null)[]>([]);
  const confirmPinRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handlePinChange = (index: number, value: string, isConfirm: boolean) => {
    if (/^[0-9]?$/.test(value)) {
      const newCode = isConfirm ? [...confirmPin] : [...pin];
      newCode[index] = value;
      isConfirm ? setConfirmPin(newCode) : setPin(newCode);

      // Move to next input if value is entered
      if (value && index < 3) {
        (isConfirm ? confirmPinRefs : pinRefs).current[index + 1]?.focus();
      }

      // Clear error on input change
      setError(null);
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>, isConfirm: boolean) => {
    // Handle backspace
    if (e.key === 'Backspace' && !isConfirm && !pin[index] && index > 0) {
      const newPin = [...pin];
      newPin[index - 1] = '';
      setPin(newPin);
      pinRefs.current[index - 1]?.focus();
    } else if (e.key === 'Backspace' && isConfirm && !confirmPin[index] && index > 0) {
      const newConfirmPin = [...confirmPin];
      newConfirmPin[index - 1] = '';
      setConfirmPin(newConfirmPin);
      confirmPinRefs.current[index - 1]?.focus();
    }
  };

  const isPinComplete = pin.every(digit => digit !== '') && confirmPin.every(digit => digit !== '');
  const pinsMatch = pin.join('') === confirmPin.join('');

  const handleConfirm = () => {
    if (!isPinComplete) {
      setError('Por favor, preencha todos os dígitos.');
      return;
    }
    if (!pinsMatch) {
      setError('As senhas não coincidem. Tente novamente.');
      return;
    }
    onConfirm(pin.join(''));
    setPin(['', '', '', '']);
    setConfirmPin(['', '', '', '']);
    setError(null);
  };

  if (!show) return null;

  return (
    <div
      id="pin-registration-modal"
      className="fixed inset-0 bg-gray-950 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center"
      role="dialog"
      aria-labelledby="pin-registration-modal-title"
    >
      <div
        className="relative mx-auto p-6 border w-11/12 md:w-2/3 lg:w-1/2 rounded-xl shadow-md bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 transition-all duration-300 animate-slide-in"
        aria-modal="true"
      >
        <div className="flex justify-between items-center mb-6">
          <h3
            id="pin-registration-modal-title"
            className="text-xl font-semibold text-gray-900 dark:text-gray-100"
          >
            Cadastrar Senha
          </h3>
        </div>

        <div className="mb-6">
          <div className="rounded-xl p-5 bg-gradient-to-br from-blue-50 to-white dark:from-blue-900 dark:to-gray-800 border border-gray-200 dark:border-gray-700 shadow-md hover:shadow-lg transition-all duration-300 mb-6">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
              <FontAwesomeIcon icon={faLock} className="text-blue-600 dark:text-blue-400 mr-2" />
              Cadastro de Senha
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Você ainda não possui uma senha cadastrada para transaçoes. Cadastre uma senha de 4 dígitos agora.
            </p>
          </div>

          {/* PIN Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
              Digite a Senha de 4 Dígitos
            </label>
            <div className="flex space-x-2 justify-center">
              {pin.map((digit, index) => (
                <input
                  key={`pin-${index}`}
                  type="password"
                  maxLength={1}
                  value={digit}
                  data-index={index}
                  ref={(el) => (pinRefs.current[index] = el) as any}
                  className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-12 h-12 text-center p-0 transition-all duration-200 hover:shadow-md"
                  onChange={(e) => handlePinChange(index, e.target.value, false)}
                  onKeyDown={(e) => handleKeyDown(index, e, false)}
                  aria-label={`Dígito ${index + 1} da senha`}
                />
              ))}
            </div>
          </div>

          {/* Confirm PIN Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
              Confirme a Senha de 4 Dígitos
            </label>
            <div className="flex space-x-2 justify-center">
              {confirmPin.map((digit, index) => (
                <input
                  key={`confirm-pin-${index}`}
                  type="password"
                  maxLength={1}
                  value={digit}
                  data-index={index}
                  ref={(el) => (confirmPinRefs.current[index] = el) as any}
                  className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-12 h-12 text-center p-0 transition-all duration-200 hover:shadow-md"
                  onChange={(e) => handlePinChange(index, e.target.value, true)}
                  onKeyDown={(e) => handleKeyDown(index, e, true)}
                  aria-label={`Dígito ${index + 1} da confirmação da senha`}
                />
              ))}
            </div>
          </div>

          {error && (
            <p className="text-sm text-red-500 dark:text-red-400 mb-4 text-center">{error}</p>
          )}
        </div>

        <div className="flex justify-end space-x-3">
          <button
            className="px-6 py-2 bg-blue-600 dark:bg-blue-500 text-white font-medium rounded-lg text-sm hover:bg-blue-700 dark:hover:bg-blue-600 hover:shadow-md hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
            onClick={handleConfirm}
            aria-label="Confirmar cadastro"
            disabled={!isPinComplete || !pinsMatch}
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
}