import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';

const InvoicesContent: React.FC = () => {
  const categories = [
    { name: 'Alimentação', amount: 'R$ 560,30', percentage: 45, color: 'bg-red-500' },
    { name: 'Transporte', amount: 'R$ 310,00', percentage: 25, color: 'bg-blue-500' },
    { name: 'Lazer', amount: 'R$ 375,60', percentage: 30, color: 'bg-purple-500' },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold dark:text-white">Faturas</h3>
        <div className="relative">
          <select className="appearance-none bg-gray-100 dark:bg-dark-600 border-0 py-2 pl-4 pr-8 rounded-lg text-sm focus:outline-none">
            <option>Junho 2023</option>
            <option>Maio 2023</option>
            <option>Abril 2023</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 dark:text-gray-300">
            <FontAwesomeIcon icon={faChevronDown} />
          </div>
        </div>
      </div>
      <div className="bg-blue-50 dark:bg-blue-900 rounded-lg p-4 mb-6">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-blue-700 dark:text-blue-200">Fatura atual</p>
            <p className="font-semibold text-blue-800 dark:text-blue-100">R$ 1.245,90</p>
          </div>
          <div>
            <p className="text-sm text-blue-700 dark:text-blue-200">Vencimento</p>
            <p className="font-semibold text-blue-800 dark:text-blue-100">15/07/2023</p>
          </div>
          <button className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm">
            Pagar fatura
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {categories.map((cat, index) => (
          <div key={index} className="bg-white dark:bg-dark-600 p-4 rounded-lg shadow">
            <p className="text-sm text-gray-500 dark:text-gray-300 mb-2">{cat.name}</p>
            <div className="h-2 bg-gray-200 dark:bg-dark-500 rounded-full mb-2">
              <div
                className={`h-2 ${cat.color} rounded-full`}
                style={{ width: `${cat.percentage}%` }}
              ></div>
            </div>
            <p className="font-semibold dark:text-white">{cat.amount}</p>
          </div>
        ))}
      </div>
      <button className="w-full py-3 bg-gray-100 dark:bg-dark-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-dark-500">
        Histórico de faturas
      </button>
    </div>
  );
};

export default InvoicesContent;