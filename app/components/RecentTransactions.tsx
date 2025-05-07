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
    <div className="bg-white dark:bg-dark-secondary rounded-lg shadow mb-6 p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-light">Últimas Transações</h2>
        <a href="#" className="text-primary-light hover:text-primary-dark text-sm">
          Ver extrato completo
        </a>
      </div>
      <div className="space-y-4">
      {transactions.length > 0 ? (
        transactions.map((transaction, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-3 border-b dark:border-dark hover:bg-gray-50 dark:hover:bg-gray-800 smooth-transition"
          >
            <div className="flex items-center space-x-3">
              <div
                className={`w-10 h-10 rounded-full ${transaction.bg} dark:bg-opacity-20 flex items-center justify-center ${transaction.iconColor} dark:${transaction.iconColor.replace('500', '300')}`}
              >
                <FontAwesomeIcon icon={transaction.icon} />
              </div>
              <div>
                <p className="text-gray-800 dark:text-light font-medium">{transaction.title}</p>
                <p className="text-xs text-gray-500">{transaction.description}</p>
              </div>
            </div>
            <div className="text-right">
              <p
                className={`font-medium ${
                  transaction.amount.startsWith('+') ? 'text-green-500' : 'text-red-500'
                }`}
              >
                {transaction.amount}
              </p>
              <p className="text-xs text-gray-500">Saldo: {transaction.balance}</p>
            </div>
          </div>
        ))
      ) : (
        <div className="flex items-center justify-center flex-1 text-gray-500 dark:text-gray-400">
          <FontAwesomeIcon icon={faInbox} className="text-2xl mr-2" />
          <p>Nada encontrado ainda</p>
        </div>
      )}
      </div>
    </div>
  );
};
