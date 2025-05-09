import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingBag, faGasPump, faUtensils, faChevronDown } from '@fortawesome/free-solid-svg-icons';

const TransactionsContent: React.FC = () => {
  const transactions = [
    {
      icon: faShoppingBag,
      title: 'Amazon.com',
      category: 'Compras online',
      amount: '- R$ 89,90',
      time: 'Ontem, 14:32',
      iconColor: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-100 dark:bg-green-900',
    },
    {
      icon: faGasPump,
      title: 'Posto Shell',
      category: 'Combustível',
      amount: '- R$ 150,00',
      time: '12/06, 09:15',
      iconColor: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-100 dark:bg-blue-900',
    },
    {
      icon: faUtensils,
      title: 'Restaurante Sabor',
      category: 'Alimentação',
      amount: '- R$ 75,50',
      time: '10/06, 20:45',
      iconColor: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-100 dark:bg-purple-900',
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Últimas transações
        </h3>
        <div className="relative">
          <select
            className="appearance-none bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-100 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-40 py-2 pl-4 pr-8 transition-all duration-200"
            aria-label="Filtrar transações"
          >
            <option>Filtrar por</option>
            <option>Últimos 7 dias</option>
            <option>Últimos 30 dias</option>
            <option>Por categoria</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500 dark:text-gray-400">
            <FontAwesomeIcon icon={faChevronDown} />
          </div>
        </div>
      </div>
      <div className="space-y-4">
        {transactions.map((tx, index) => (
          <div
            key={index}
            className="flex items-center p-4 bg-white dark:bg-slate-950 rounded-xl shadow-md hover:shadow-lg transition-all duration-200"
          >
            <div
              className={`w-10 h-10 rounded-full ${tx.bgColor} flex items-center justify-center ${tx.iconColor} mr-4`}
            >
              <FontAwesomeIcon icon={tx.icon} className="text-xl" />
            </div>
            <div className="flex-1">
              <h4 className="text-base font-semibold text-gray-900 dark:text-gray-100">
                {tx.title}
              </h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">{tx.category}</p>
            </div>
            <div className="text-right">
              <p className="text-base font-semibold text-red-600 dark:text-red-500">
                {tx.amount}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{tx.time}</p>
            </div>
          </div>
        ))}
      </div>
      <button
        className="w-full mt-6 py-3 bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 text-white rounded-lg text-sm font-semibold transition-all duration-200 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        aria-label="Ver todas as transações"
      >
        Ver todas as transações
      </button>
    </div>
  );
};

export default TransactionsContent;