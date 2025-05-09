import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';

const InvoicesContent: React.FC = () => {
  const categories = [
    { name: 'Alimentação', amount: 'R$ 560,30', percentage: 45, color: 'bg-red-600 dark:bg-red-500' },
    { name: 'Transporte', amount: 'R$ 310,00', percentage: 25, color: 'bg-blue-600 dark:bg-blue-500' },
    { name: 'Lazer', amount: 'R$ 375,60', percentage: 30, color: 'bg-purple-600 dark:bg-purple-500' },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Faturas</h3>
        <div className="relative">
          <select
            className="appearance-none bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-100 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-40 py-2 pl-4 pr-8 transition-all duration-200"
            aria-label="Selecionar período da fatura"
          >
            <option>Junho 2023</option>
            <option>Maio 2023</option>
            <option>Abril 2023</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500 dark:text-gray-400">
            <FontAwesomeIcon icon={faChevronDown} />
          </div>
        </div>
      </div>
      <div className="bg-blue-100 dark:bg-blue-900 rounded-xl p-5 mb-6 shadow-md transition-all duration-200">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-blue-600 dark:text-blue-400">Fatura atual</p>
            <p className="text-base font-semibold text-blue-800 dark:text-blue-200">
              R$ 1.245,90
            </p>
          </div>
          <div>
            <p className="text-sm text-blue-600 dark:text-blue-400">Vencimento</p>
            <p className="text-base font-semibold text-blue-800 dark:text-blue-200">
              15/07/2023
            </p>
          </div>
          <button
            className="px-4 py-2 bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 text-white rounded-lg text-sm font-semibold transition-all duration-200 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            aria-label="Pagar fatura atual"
          >
            Pagar fatura
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {categories.map((cat, index) => (
          <div
            key={index}
            className="bg-white dark:bg-slate-950 p-4 rounded-xl shadow-md hover:shadow-lg transition-all duration-200"
          >
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2 font-medium">
              {cat.name}
            </p>
            <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full mb-2">
              <div
                className={`h-2 ${cat.color} rounded-full`}
                style={{ width: `${cat.percentage}%` }}
              ></div>
            </div>
            <p className="text-base font-semibold text-gray-900 dark:text-gray-100">
              {cat.amount}
            </p>
          </div>
        ))}
      </div>
      <button
        className="w-full py-3 bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 text-white rounded-lg text-sm font-semibold transition-all duration-200 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        aria-label="Ver histórico de faturas"
      >
        Histórico de faturas
      </button>
    </div>
  );
};

export default InvoicesContent;