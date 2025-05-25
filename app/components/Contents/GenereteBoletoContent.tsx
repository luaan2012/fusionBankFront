import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUniversity } from '@fortawesome/free-solid-svg-icons';

interface GenerateBoletoContentProps {
  setShowBoletoModal: (show: boolean) => void;
  setShowErrorToast: (message: string) => void;
}

export const GenerateBoletoContent = ({
  setShowBoletoModal,
  setShowErrorToast,
}: GenerateBoletoContentProps) => {
  const [amount, setAmount] = useState<string>('');
  const [description, setDescription] = useState<string>('');

  const handleGenerateBoleto = () => {
    if (!amount || parseFloat(amount) < 10) {
      setShowErrorToast('O valor mínimo para depósito é R$ 10,00.');
      return;
    }
    // Simula geração de boleto para depósito sem débito
    setShowBoletoModal(true);
  };

  return (
    <div id="generate-boleto-content">
      <div className="bg-white dark:bg-slate-950 rounded-xl shadow-md p-6 transition-all duration-300 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6">Gerar Boleto</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-3">Conta de destino</h3>
            <div className="flex items-center">
              <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mr-3">
                <FontAwesomeIcon icon={faUniversity} className="text-blue-600 dark:text-blue-400 text-lg" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">Conta Corrente</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Ag. 1234 • C/C 56789-0</p>
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm text-gray-600 dark:text-gray-300">Titular</p>
              <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">João da Silva</p>
            </div>
          </div>
          <div>
            <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-3">Detalhes do boleto</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="boleto-amount">
                Valor
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 dark:text-gray-400">R$</span>
                </div>
                <input
                  id="boleto-amount"
                  type="text"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-100 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 py-3 transition-all duration-200"
                  placeholder="0,00"
                  aria-label="Valor do boleto"
                />
              </div>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Valor mínimo: R$ 10,00</p>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="boleto-description">
                Descrição (opcional)
              </label>
              <input
                id="boleto-description"
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-100 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full py-3 transition-all duration-200"
                placeholder="Ex: Depósito para investimentos"
                aria-label="Descrição do boleto"
              />
            </div>
          </div>
        </div>
        <div className="mt-8 flex justify-end">
          <button
            className="px-6 py-2.5 bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 text-white rounded-lg text-sm font-semibold transition-all duration-200 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            onClick={handleGenerateBoleto}
            aria-label="Gerar boleto"
          >
            Gerar Boleto
          </button>
        </div>
      </div>
    </div>
  );
};
