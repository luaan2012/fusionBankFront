import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faMobileAlt, faInfoCircle, faCircleNotch } from '@fortawesome/free-solid-svg-icons';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  transferData: {
    type: string;
    amount: number;
    destination: string;
    description: string;
    tax: number;
  };
  onConfirm: () => void;
}

export const ConfirmationModal = ({ isOpen, onClose, transferData, onConfirm } : ConfirmationModalProps) => {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleCodeChange = (index: number, value: string) => {
    if (/^[0-9]?$/.test(value)) {
      const newCode = [...code];
      newCode[index] = value;
      setCode(newCode);
      if (value && index < 5) {
        document.getElementById(`code-input-${index + 1}`)?.focus();
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      document.getElementById(`code-input-${index - 1}`)?.focus();
    }
  };

  const handleSubmit = () => {
    if (code.join('').length !== 6) {
      alert('Por favor, insira o código de 6 dígitos');
      return;
    }
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      onConfirm();
      setCode(['', '', '', '', '', '']);
    }, 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-2/3 lg:w-1/2 shadow-lg rounded-md bg-white dark:bg-slate-800 slide-in">
        <div className="flex justify-between items-center border-b border-gray-200 dark:border-slate-700 pb-3 mb-4">
          <h3 className="text-lg font-bold text-gray-800 dark:text-white">Confirme sua transferência</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>
        <div className="mb-6">
          <div className="bg-gray-50 dark:bg-slate-700 rounded-lg p-4 mb-4">
            <div className="flex justify-between mb-3">
              <span className="text-sm text-gray-600 dark:text-gray-300">Valor</span>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                R$ {transferData.amount.toFixed(2).replace('.', ',')}
              </span>
            </div>
            {transferData.tax > 0 && (
              <div className="flex justify-between mb-3">
                <span className="text-sm text-gray-600 dark:text-gray-300">Taxa</span>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                  R$ {transferData.tax.toFixed(2).replace('.', ',')}
                </span>
              </div>
            )}
            <div className="flex justify-between border-t border-gray-200 dark:border-slate-600 pt-3">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Total</span>
              <span className="text-sm font-bold text-gray-800 dark:text-white">
                R$ {(transferData.amount + transferData.tax).toFixed(2).replace('.', ',')}
              </span>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Origem</p>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                Conta Corrente • Ag. 1234 • C/C 56789-0
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Destino</p>
              <p className="text-sm text-gray-700 dark:text-gray-300">{transferData.destination}</p>
            </div>
          </div>
          <div className="mb-4">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Tipo</p>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Transferência via {transferData.type.toUpperCase()}
            </p>
            {transferData.type !== 'pix' && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                <FontAwesomeIcon icon={faInfoCircle} className="mr-1" />
                Processamento em {transferData.type === 'ted' ? 'até 2 horas (dias úteis)' : '1 dia útil'}
              </p>
            )}
          </div>
          <div className="mb-4">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Descrição</p>
            <p className="text-sm text-gray-700 dark:text-gray-300">{transferData.description}</p>
          </div>
        </div>
        <div id="2fa-verification">
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
            Para confirmar, insira o código de verificação enviado para:
          </p>
          <div className="flex items-center mb-4">
            <div className="flex-1 bg-gray-50 dark:bg-slate-700 rounded-lg p-3">
              <div className="flex items-center">
                <div className="h-8 w-8 rounded-full bg-primary-100 dark:bg-slate-600 flex items-center justify-center mr-3">
                  <FontAwesomeIcon icon={faMobileAlt} className="text-primary-600 dark:text-primary-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Celular</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">(**) *****-5678</p>
                </div>
              </div>
            </div>
            <button className="ml-2 text-sm text-primary-600 dark:text-primary-400 hover:underline">
              Alterar
            </button>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Código de 6 dígitos
            </label>
            <div className="flex space-x-2">
              {code.map((digit, index) => (
                <input
                  key={index}
                  id={`code-input-${index}`}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleCodeChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="bg-gray-50 dark:bg-slate-700 border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-white text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-12 h-12 text-center p-0"
                  pattern="[0-9]"
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
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-white font-medium rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-300 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleSubmit}
              disabled={isProcessing}
              className="px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 transition-colors flex items-center"
            >
              {isProcessing ? (
                <>
                  <FontAwesomeIcon icon={faCircleNotch} className="mr-2 animate-spin" />
                  Processando...
                </>
              ) : (
                'Confirmar transferência'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};