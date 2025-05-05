import React from 'react';
import { defaultMessage, formatNumberAccount, formatToBRL, translateAccountType } from 'utils'
import type { Account } from '~/models/account'
import { AccountType } from '~/models/enum/accountType'

interface AccountSummaryProps {
  user: Account | null
}

export function AccountSummary({user} : AccountSummaryProps) {
  const accounts = [user];
  const actions = ['Depositar', 'Resgatar']

  return (
    <div className="bg-white dark:bg-dark-secondary rounded-lg shadow mb-6 p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-light">Minhas Contas</h2>
        <a href="#" className="text-primary-light hover:text-primary-dark text-sm">
          Ver todas
        </a>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {accounts?.map((account, index) => (
          <div
            key={index}
            className="border dark:border-dark rounded-lg p-4 smooth-transition hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            <div className="flex justify-between items-start mb-2">
              <div>
                <p className="text-gray-500 text-sm">{translateAccountType(account?.accountType || AccountType.BusinessAccount)}</p>
                <p className="font-medium text-gray-800 dark:text-light">{formatNumberAccount(account?.accountNumber || defaultMessage.loading)}</p>
              </div>
              <span className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs px-2 py-1 rounded">
                Ativa
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-800 dark:text-light mb-2">
              {formatToBRL(account?.balance || defaultMessage.balance)}
            </p>
            <div className="flex space-x-2">
              {actions.map((action, idx) => (
                <button
                  key={idx}
                  className={`text-xs ${
                    action === 'Depositar'
                      ? 'bg-blue-50 dark:bg-blue-900 text-blue-600 dark:text-blue-300'
                      : 'bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                  } px-2 py-1 rounded`}
                >
                  {action}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
 
export default AccountSummary;