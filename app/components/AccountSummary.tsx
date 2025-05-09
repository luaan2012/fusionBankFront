import React from 'react';
import { ActionMapper, defaultMessage, formatNumberAccount, formatToBRL, translateAccountType } from 'utils'
import { useAppStore } from '~/context/appStore'
import type { Account } from '~/models/account'
import { AccountType } from '~/models/enum/accountType'

interface AccountSummaryProps {
  user: Account | null
}

export function AccountSummary({user} : AccountSummaryProps) {
  const accounts = [user];
  const { setView } = useAppStore()

  return (
    // <div className="bg-white dark:bg-slate-900 rounded-xl shadow-lg mb-6 p-6 transition-all duration-300">
    <div className="bg-white dark:bg-slate-950 rounded-xl shadow-lg mb-6 p-6 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Minhas Contas</h2>
        <a
          href="#"
          className="text-blue-600 dark:text-blue-400 text-sm font-medium hover:underline transition-colors duration-200"
        >
          Ver todas
        </a>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {accounts?.map((account, index) => (
          <div
            key={index}
            className="border border-gray-200 dark:border-gray-700 rounded-xl p-5 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 hover:shadow-md transition-all duration-300"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-300 font-medium">
                  {translateAccountType(account?.accountType || AccountType.BusinessAccount)}
                </p>
                <p className="text-base font-semibold text-gray-800 dark:text-gray-100 mt-1">
                  {formatNumberAccount(account?.accountNumber || defaultMessage.loading)}
                </p>
              </div>
              <span className="bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 text-xs font-medium px-3 py-1 rounded-full">
                Ativa
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              {formatToBRL(account?.balance || defaultMessage.balance)}
            </p>
            <div className="flex flex-wrap gap-2">
              {ActionMapper(account?.accountType)?.map((actionItem, actionIdx) => (
                <button
                  key={`${index}-${actionIdx}`}
                  className="text-xs font-medium px-3 py-1.5 rounded-lg transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-opacity-50 cursor-pointer"
                  style={{
                    backgroundColor: actionItem?.buttonColor,
                    color: '#FFFFFF',
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                  }}
                  onClick={() => setView(actionItem?.route)}
                  aria-label={`Executar ${actionItem?.action} para conta ${account?.accountNumber}`}
                >
                  {actionItem?.action}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};