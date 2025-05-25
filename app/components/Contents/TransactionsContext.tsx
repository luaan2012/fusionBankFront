import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingBag, faGasPump, faUtensils, faChevronDown } from '@fortawesome/free-solid-svg-icons';
import type { CreditCard, Expense } from '~/types/creditCard'
import { BilletType } from '~/types/transaction'
import { formatToBRL } from '~/utils/util'

interface TransactionContentProps {
  card: CreditCard;
}

interface Transaction {
  icon: any;
  title: string;
  category: string;
  amount: string;
  time: string;
  iconColor: string;
  bgColor: string;
}

export const TransactionsContent = ({ card } : TransactionContentProps) => {
  const [showAll, setShowAll] = useState(false);

  // Helper function to map expenses to transactions
  const mapExpensesToTransactions = (expenses: Expense[]): Transaction[] => {
    return expenses.map((expense) => {
      // Determine icon, category, and colors based on description or other logic
      let icon = faShoppingBag;
      let category = 'Outros';
      let iconColor = 'text-gray-600 dark:text-gray-400';
      let bgColor = 'bg-gray-100 dark:bg-gray-900';

      // Example logic to categorize based on description
      if (expense.category === BilletType.SHOPPING) {
        icon = faShoppingBag;
        category = 'Compras online';
        iconColor = 'text-green-600 dark:text-green-400';
        bgColor = 'bg-green-100 dark:bg-green-900';
      } else if (expense.category === BilletType.ENTERTEIMANT) {
        icon = faGasPump;
        category = 'Combustível';
        iconColor = 'text-blue-600 dark:text-blue-400';
        bgColor = 'bg-blue-100 dark:bg-blue-900';
      } else if (expense.category === BilletType.FOOD) {
        icon = faUtensils;
        category = 'Alimentação';
        iconColor = 'text-purple-600 dark:text-purple-400';
        bgColor = 'bg-purple-100 dark:bg-purple-900';
      }else if (expense.category === BilletType.HEALTH) {
        icon = faUtensils;
        category = 'Alimentação';
        iconColor = 'text-purple-600 dark:text-purple-400';
        bgColor = 'bg-purple-100 dark:bg-purple-900';
      }else if (expense.category === BilletType.LEISURE) {
        icon = faUtensils;
        category = 'Alimentação';
        iconColor = 'text-purple-600 dark:text-purple-400';
        bgColor = 'bg-purple-100 dark:bg-purple-900';
      }else if (expense.category === BilletType.TRAVEL) {
        icon = faUtensils;
        category = 'Alimentação';
        iconColor = 'text-purple-600 dark:text-purple-400';
        bgColor = 'bg-purple-100 dark:bg-purple-900';
      }else if (expense.category === BilletType.DEPOSIT) {
        icon = faUtensils;
        category = 'Alimentação';
        iconColor = 'text-purple-600 dark:text-purple-400';
        bgColor = 'bg-purple-100 dark:bg-purple-900';
      }

      // Format date to "Ontem, HH:mm" or "DD/MM, HH:mm"
      const expenseDate = new Date(expense.date);
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(today.getDate() - 1);

      let time = '';
      if (expenseDate.toDateString() === yesterday.toDateString()) {
        time = `Ontem, ${expenseDate.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;
      } else {
        time = `${expenseDate.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}, ${expenseDate.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;
      }

      return {
        icon,
        title: expense.description,
        category,
        amount: formatToBRL(expense.amount),
        time,
        iconColor,
        bgColor,
      };
    });
  };

  // Flatten and sort expenses from invoices
  const allExpenses = card?.invoices || []
    .flatMap((invoice) => invoice.expenses)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()); // Sort by date descending

  // Map expenses to transactions
  const transactions = mapExpensesToTransactions(allExpenses);

  // Limit to 3 transactions unless showAll is true
  const displayedTransactions = showAll ? transactions : transactions.slice(0, 3);

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
        {displayedTransactions.map((tx, index) => (
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
              <p className="text-sm text-gray-500 dark:text-gray-50">{tx.category}</p>
            </div>
            <div className="text-right">
              <p className="text-base font-semibold text-red-600 dark:text-red-500">
                {tx.amount}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-50">{tx.time}</p>
            </div>
          </div>
        ))}
      </div>
      <button
        className="w-full mt-6 py-3 bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 text-white rounded-lg text-sm font-semibold transition-all duration-200 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        aria-label="Ver todas as transações"
        onClick={() => setShowAll(true)}
      >
        Ver todas as transações
      </button>
    </div>
  );
};