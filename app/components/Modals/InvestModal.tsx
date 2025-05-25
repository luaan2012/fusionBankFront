import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface InvestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const InvestModal = ({ isOpen, onClose, onConfirm }: InvestModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div
        className="bg-white dark:bg-slate-950 rounded-xl shadow-xl w-full max-w-lg mx-4 transition-all duration-300"
        role="dialog"
        aria-labelledby="invest-modal-title"
      >
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 id="invest-modal-title" className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            Aplicar em CDB 110% CDI
          </h3>
        </div>
        <div className="p-6">
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              Valor da aplicação
            </label>
            <input
              type="text"
              className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 py-3 px-4 rounded-lg text-lg text-gray-700 dark:text-gray-100 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              placeholder="R$ 0,00"
              aria-label="Valor da aplicação"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Valor mínimo: R$ 100,00</p>
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              Origem dos recursos
            </label>
            <select
              className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 py-2 pl-4 pr-8 rounded-lg text-sm text-gray-700 dark:text-gray-100 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              aria-label="Selecionar origem dos recursos"
            >
              <option>Conta corrente •••• 1234</option>
              <option>Conta poupança •••• 5678</option>
            </select>
          </div>
          <div className="bg-blue-100 dark:bg-blue-900 rounded-lg p-4 mb-6">
            <div className="flex items-start">
              <div className="w-6 h-6 rounded-full bg-blue-200 dark:bg-blue-800 flex items-center justify-center text-blue-600 dark:text-blue-400 mr-3 mt-1">
                <FontAwesomeIcon icon="info-circle" className="text-sm" />
              </div>
              <div>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  Este investimento tem liquidez D+1 e rentabilidade de 110% do CDI.
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-100 rounded-lg text-sm font-semibold hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
            aria-label="Cancelar aplicação"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 text-white rounded-lg text-sm font-semibold transition-all duration-200 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            aria-label="Confirmar aplicação"
          >
            Confirmar aplicação
          </button>
        </div>
      </div>
    </div>
  );
};