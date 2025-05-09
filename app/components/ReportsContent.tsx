import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalculator, faDownload, faFileInvoiceDollar, faInfoCircle, faReceipt } from '@fortawesome/free-solid-svg-icons'

const ReportsContent: React.FC = () => {
  const [showTaxResult, setShowTaxResult] = useState<boolean>(false);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Relatórios e Impostos</h3>
        <button
          className="px-4 py-2 bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 text-white rounded-lg text-sm font-semibold transition-all duration-200 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          aria-label="Exportar todos os relatórios"
        >
          <FontAwesomeIcon icon={faDownload} className="mr-2" />
          Exportar tudo
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white dark:bg-slate-950 rounded-xl shadow-md p-6 transition-all duration-200">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-base font-semibold text-gray-900 dark:text-gray-100">Extrato Mensal</h4>
            <FontAwesomeIcon icon={faFileInvoiceDollar} className="text-gray-400 dark:text-gray-500 text-xl" />
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Detalhamento de todas as movimentações do mês.</p>
          {['Junho 2023', 'Maio 2023', 'Abril 2023'].map((month) => (
            <div key={month} className="flex justify-between items-center py-2">
              <span className="text-sm text-gray-900 dark:text-gray-100">{month}</span>
              <button
                className="text-blue-600 dark:text-blue-400 text-sm font-semibold hover:text-blue-700 dark:hover:text-blue-300 transition-all duration-200"
                aria-label={`Baixar extrato de ${month}`}
              >
                Download
              </button>
            </div>
          ))}
        </div>
        <div className="bg-white dark:bg-slate-950 rounded-xl shadow-md p-6 transition-all duration-200">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-base font-semibold text-gray-900 dark:text-gray-100">Informe de Rendimentos</h4>
            <FontAwesomeIcon icon={faReceipt} className="text-gray-400 dark:text-gray-500 text-xl" />
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Rendimentos para Imposto de Renda.</p>
          {['2023 (Atual)', '2022', '2021'].map((year) => (
            <div key={year} className="flex justify-between items-center py-2">
              <span className="text-sm text-gray-900 dark:text-gray-100">{year}</span>
              <button
                className="text-blue-600 dark:text-blue-400 text-sm font-semibold hover:text-blue-700 dark:hover:text-blue-300 transition-all duration-200"
                aria-label={`Baixar informe de ${year}`}
              >
                Download
              </button>
            </div>
          ))}
        </div>
        <div className="bg-white dark:bg-slate-950 rounded-xl shadow-md p-6 md:col-span-2 transition-all duration-200">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-base font-semibold text-gray-900 dark:text-gray-100">Calculadora de Impostos</h4>
            <FontAwesomeIcon icon={faCalculator} className="text-gray-400 dark:text-gray-500 text-xl" />
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Simule o imposto devido.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Tipo de investimento</label>
              <select
                className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 py-2 pl-4 pr-8 rounded-lg text-sm text-gray-700 dark:text-gray-100 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                aria-label="Selecionar tipo de investimento"
              >
                <option>Renda Fixa (CDB, LCI, LCA)</option>
                <option>Tesouro Direto</option>
                <option>Fundos de Investimento</option>
                <option>Ações</option>
                <option>FIIs</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Valor investido</label>
              <input
                type="text"
                className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 py-2 pl-4 pr-4 rounded-lg text-sm text-gray-700 dark:text-gray-100 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                placeholder="R$ 0,00"
                aria-label="Valor investido"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Data de aplicação</label>
              <input
                type="date"
                className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 py-2 pl-4 pr-4 rounded-lg text-sm text-gray-700 dark:text-gray-100 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                aria-label="Data de aplicação"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Data de resgate</label>
              <input
                type="date"
                className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 py-2 pl-4 pr-4 rounded-lg text-sm text-gray-700 dark:text-gray-100 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                aria-label="Data de resgate"
              />
            </div>
          </div>
          <button
            onClick={() => setShowTaxResult(true)}
            className="mt-4 px-4 py-2 bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 text-white rounded-lg text-sm font-semibold transition-all duration-200 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            aria-label="Calcular imposto"
          >
            Calcular Imposto
          </button>
          {showTaxResult && (
            <div className="mt-6 bg-blue-100 dark:bg-blue-900 rounded-lg p-4 animate-fade-in">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-blue-200 dark:bg-blue-800 flex items-center justify-center text-blue-600 dark:text-blue-400 mr-3">
                  <FontAwesomeIcon icon={faInfoCircle} className="text-sm" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                    Imposto devido: <span className="text-blue-600 dark:text-blue-400">R$ 245,67</span>
                  </p>
                  <p className="text-xs text-blue-700 dark:text-blue-300">Alíquota de 15% (período entre 1 e 2 anos)</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportsContent;