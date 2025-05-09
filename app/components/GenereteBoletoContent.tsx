import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';

const GenerateBoletoContent: React.FC = () => {
  const [saveAsModel, setSaveAsModel] = useState(false);

  return (
    <div id="generate-content">
      <div className="bg-white dark:bg-slate-950 rounded-xl shadow-md p-6 transition-all duration-300 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6">Gerar Boleto</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="beneficiary">
                Beneficiário
              </label>
              <input
                id="beneficiary"
                type="text"
                className="bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-100 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full py-3 transition-all duration-200"
                placeholder="Nome ou empresa"
                aria-label="Nome do beneficiário"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="cpf-cnpj">
                CPF/CNPJ
              </label>
              <input
                id="cpf-cnpj"
                type="text"
                className="bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-100 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full py-3 transition-all duration-200"
                placeholder="000.000.000-00"
                aria-label="CPF ou CNPJ do beneficiário"
              />
            </div>
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
                  className="bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-100 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 py-3 transition-all duration-200"
                  placeholder="0,00"
                  aria-label="Valor do boleto"
                />
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="due-date">
                Data de vencimento
              </label>
              <input
                id="due-date"
                type="date"
                className="bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-100 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full py-3 transition-all duration-200"
                aria-label="Data de vencimento do boleto"
              />
            </div>
          </div>
          <div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="description">
                Descrição
              </label>
              <textarea
                id="description"
                className="bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-100 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full py-3 transition-all duration-200"
                rows={3}
                placeholder="Ex: Pagamento de serviços prestados"
                aria-label="Descrição do boleto"
              ></textarea>
            </div>
            <div className="mb-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800"
                  checked={saveAsModel}
                  onChange={(e) => setSaveAsModel(e.target.checked)}
                  aria-label="Salvar como modelo para reutilização"
                />
                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Salvar como modelo para reutilização</span>
              </label>
            </div>
            {saveAsModel && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="model-name">
                  Nome do modelo (opcional)
                </label>
                <input
                  id="model-name"
                  type="text"
                  className="bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-100 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full py-3 transition-all duration-200"
                  placeholder="Ex: Mensalidade Academia"
                  aria-label="Nome do modelo"
                />
              </div>
            )}
          </div>
        </div>
        <div className="flex justify-end mt-6">
          <button
            className="px-6 py-2.5 bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 text-white rounded-lg text-sm font-semibold transition-all duration-200 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            aria-label="Gerar boleto"
          >
            Gerar Boleto
          </button>
        </div>
      </div>
    </div>
  );
};

export default GenerateBoletoContent;