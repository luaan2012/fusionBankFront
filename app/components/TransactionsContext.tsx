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
      iconColor: 'text-green-500 dark:text-green-300',
      bgColor: 'bg-green-100 dark:bg-green-900',
    },
    {
      icon: faGasPump,
      title: 'Posto Shell',
      category: 'Combustível',
      amount: '- R$ 150,00',
      time: '12/06, 09:15',
      iconColor: 'text-blue-500 dark:text-blue-300',
      bgColor: 'bg-blue-100 dark:bg-blue-900',
    },
    {
      icon: faUtensils,
      title: 'Restaurante Sabor',
      category: 'Alimentação',
      amount: '- R$ 75,50',
      time: '10/06, 20:45',
      iconColor: 'text-purple-500 dark:text-purple-300',
      bgColor: 'bg-purple-100 dark:bg-purple-900',
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold dark:text-white">Últimas transações</h3>
        <div className="relative">
          <select className="appearance-none bg-gray-100 dark:bg-dark-600 border-0 py-2 pl-4 pr-8 rounded-lg text-sm focus:outline-none">
            <option>Filtrar por</option>
            <option>Últimos 7 dias</option>
            <option>Últimos 30 dias</option>
            <option>Por categoria</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 dark:text-gray-300">
            <FontAwesomeIcon icon={faChevronDown} />
          </div>
        </div>
      </div>
      <div className="space-y-4">
        {transactions.map((tx, index) => (
          <div
            key={index}
            className="flex items-center p-4 bg-gray-50 dark:bg-dark-600 rounded-lg"
          >
            <div className={`w-10 h-10 rounded-full ${tx.bgColor} flex items-center justify-center ${tx.iconColor} mr-4`}>
              <FontAwesomeIcon icon={tx.icon} />
            </div>
            <div className="flex-1">
              <h4 className="font-medium dark:text-white">{tx.title}</h4>
              <p className="text-sm text-gray-500 dark:text-gray-300">{tx.category}</p>
            </div>
            <div className="text-right">
              <p className="font-medium text-red-500">{tx.amount}</p>
              <p className="text-xs text-gray-500 dark:text-gray-300">{tx.time}</p>
            </div>
          </div>
        ))}
      </div>
      <button className="w-full mt-6 py-3 bg-gray-100 dark:bg-dark-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-dark-500">
        Ver todas as transações
      </button>
    </div>
  );
};

export default TransactionsContent;