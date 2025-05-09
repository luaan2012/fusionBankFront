import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUp, faArrowDown, faBarcode, faInbox } from '@fortawesome/free-solid-svg-icons';
import { useEventStore } from '~/context/eventStore'
import type { EventMessage } from '~/models/eventMessage'
import { mapEventMessagesToTransactions } from '~/utils/map'

interface Transaction {
  icon: any; // Use specific icon type if needed
  iconColor: string;
  bg: string;
  title: string;
  description: string;
  amount: string;
  balance: string;
}

interface RecentTransactionProps{
  lastTransactions: EventMessage[]
}

export function RecentTransactions ({lastTransactions}: RecentTransactionProps) {
  const transactions = mapEventMessagesToTransactions(lastTransactions);

  return (
    <div className="bg-white dark:bg-slate-950 rounded-xl shadow-lg mb-6 p-6 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Últimas Transações</h2>
        <a
          href="#"
          className="text-blue-600 dark:text-blue-400 text-sm font-medium hover:underline transition-colors duration-200"
        >
          Ver extrato completo
        </a>
      </div>
      <div className="space-y-4">
        {transactions.length > 0 ? (
          transactions.map((transaction, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-900 rounded-lg transition-all duration-200"
            >
              <div className="flex items-center space-x-4">
                <div
                  className={`w-12 h-12 rounded-full ${transaction.bg} dark:bg-opacity-30 flex items-center justify-center ${transaction.iconColor} dark:${transaction.iconColor.replace('500', '300')} transition-transform duration-200 hover:scale-110`}
                >
                  <FontAwesomeIcon icon={transaction.icon} className="text-xl" />
                </div>
                <div>
                  <p className="text-base font-semibold text-gray-900 dark:text-gray-100">
                    {transaction.title}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {transaction.description}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p
                  className={`text-base font-semibold ${
                    transaction.amount.startsWith('+')
                      ? 'text-green-600 dark:text-green-400'
                      : 'text-red-600 dark:text-red-400'
                  }`}
                >
                  {transaction.amount}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Saldo: {transaction.balance}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="flex items-center justify-center py-8 text-gray-500 dark:text-gray-400">
            <FontAwesomeIcon icon={faInbox} className="text-3xl mr-3" />
            <p className="text-base font-medium">Nada encontrado ainda</p>
          </div>
        )}
      </div>
    </div>
  );
};
