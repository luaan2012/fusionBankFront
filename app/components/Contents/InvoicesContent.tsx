import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import type { CreditCard, Invoice } from '~/types/creditCard'
import { BilletType } from '~/types/transaction'
import { formatDateBR, formatToBRL } from '~/utils/util'

interface InvoicesContentProps {
  card: CreditCard;
}

interface Category {
  name: string;
  amount: string;
  percentage: number;
  color: string;
}

export const InvoicesContent = ({ card } : InvoicesContentProps) => {
  const [selectedPeriod, setSelectedPeriod] = React.useState<string>('');

  // Get invoices and sort by periodStart descending
  const sortedInvoices = [...card.invoices].sort(
    (a, b) => new Date(b.periodStart).getTime() - new Date(a.periodStart).getTime()
  );

  // Set default selected period to the most recent invoice
  React.useEffect(() => {
    if (sortedInvoices.length > 0 && !selectedPeriod) {
      setSelectedPeriod(formatDateBR(sortedInvoices[0].periodStart));
    }
  }, [sortedInvoices, selectedPeriod]);

  // Find the selected invoice (or the open one by default)
  const selectedInvoice = sortedInvoices.find(
    (invoice) => formatDateBR(invoice.periodStart) === selectedPeriod
  ) || sortedInvoices.find((invoice) => invoice.isOpen) || sortedInvoices[0];

  // Compute categories from expenses
  const computeCategories = (invoice: Invoice): Category[] => {
    const categoryTotals: { [key in BilletType]?: number } = {};

    // Sum expenses by category
    invoice.expenses.forEach((expense) => {
      categoryTotals[expense.category] = (categoryTotals[expense.category] || 0) + expense.amount;
    });

    // Map BilletType to category details
    const categoryMap: { [key in BilletType]?: { name: string; color: string } } = {
      [BilletType.SHOPPING]: { name: 'Compras Online', color: 'bg-green-600 dark:bg-green-500' },
      [BilletType.ENTERTEIMANT]: { name: 'Entretenimento', color: 'bg-blue-600 dark:bg-blue-500' },
      [BilletType.FOOD]: { name: 'Alimentação', color: 'bg-red-600 dark:bg-red-500' },
      [BilletType.HEALTH]: { name: 'Saúde', color: 'bg-pink-600 dark:bg-pink-500' },
      [BilletType.LEISURE]: { name: 'Lazer', color: 'bg-purple-600 dark:bg-purple-500' },
      [BilletType.TRAVEL]: { name: 'Viagem', color: 'bg-indigo-600 dark:bg-indigo-500' },
      [BilletType.DEPOSIT]: { name: 'Depósito', color: 'bg-yellow-600 dark:bg-yellow-500' },
    };

    // Convert totals to categories
    const categories: Category[] = Object.entries(categoryTotals)
      .map(([category, total]) => {
        const config = categoryMap[category as BilletType] || {
          name: 'Outros',
          color: 'bg-gray-600 dark:bg-gray-500',
        };
        const percentage = invoice.totalAmount > 0 ? (total! / invoice.totalAmount) * 100 : 0;
        return {
          name: config.name,
          amount: formatToBRL(total!),
          percentage: Math.round(percentage),
          color: config.color,
        };
      })
      .sort((a, b) => b.percentage - a.percentage); // Sort by percentage descending

    return categories;
  };

  const categories = selectedInvoice ? computeCategories(selectedInvoice) : [];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Faturas</h3>
        <div className="relative">
          <select
            className="appearance-none bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-100 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-40 py-2 pl-4 pr-8 transition-all duration-200"
            aria-label="Selecionar período da fatura"
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
          >
            {sortedInvoices.map((invoice) => (
              <option key={invoice.periodStart.toString()} value={formatDateBR(invoice?.periodStart)}>
                {formatDateBR(invoice.periodStart)}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500 dark:text-gray-400">
            <FontAwesomeIcon icon={faChevronDown} />
          </div>
        </div>
      </div>
      {selectedInvoice && (
        <div className="bg-blue-100 dark:bg-blue-900 rounded-xl p-5 mb-6 shadow-md transition-all duration-200">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-blue-600 dark:text-blue-400">Fatura atual</p>
              <p className="text-base font-semibold text-blue-800 dark:text-blue-200">
                {formatToBRL(selectedInvoice.totalAmount)}
              </p>
            </div>
            <div>
              <p className="text-sm text-blue-600 dark:text-blue-400">Vencimento</p>
              <p className="text-base font-semibold text-blue-800 dark:text-blue-200">
                {new Date(selectedInvoice.dueDate).toLocaleDateString('pt-BR', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                })}
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
      )}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {categories.map((cat, index) => (
          <div
            key={cat.name}
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
