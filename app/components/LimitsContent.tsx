import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingBag, faFilm, faUtensils, faHeartbeat, faUmbrellaBeach, faPlane, faMoneyCheckAlt } from '@fortawesome/free-solid-svg-icons';
import type { CreditCard } from '~/models/creditCard';
import { formatToBRL } from '~/utils/utils';
import { BilletType } from '~/models/response/billetResponse';

interface LimitsContentProps {
  onAdjustLimit: () => void;
  card: CreditCard;
}

interface Category {
  icon: any;
  name: string;
  limit: string;
  iconColor: string;
  bgColor: string;
}

const LimitsContent: React.FC<LimitsContentProps> = ({ onAdjustLimit, card }) => {
  // Find the open invoice
  const openInvoice = card.invoices.find((invoice) => invoice.isOpen);

  // Compute categories from open invoice expenses
  const computeCategories = (): Category[] => {
    if (!openInvoice) return [];

    // Sum expenses by category
    const categoryTotals: { [key in BilletType]?: number } = {};
    openInvoice.expenses.forEach((expense) => {
      categoryTotals[expense.category] = (categoryTotals[expense.category] || 0) + expense.amount;
    });

    // Map BilletType to category details
    const categoryMap: { [key in BilletType]?: { icon: any; name: string; iconColor: string; bgColor: string } } = {
      [BilletType.SHOPPING]: {
        icon: faShoppingBag,
        name: 'Compras Online',
        iconColor: 'text-green-600 dark:text-green-400',
        bgColor: 'bg-green-100 dark:bg-green-900',
      },
      [BilletType.ENTERTEIMANT]: {
        icon: faFilm,
        name: 'Entretenimento',
        iconColor: 'text-blue-600 dark:text-blue-400',
        bgColor: 'bg-blue-100 dark:bg-blue-900',
      },
      [BilletType.FOOD]: {
        icon: faUtensils,
        name: 'Alimentação',
        iconColor: 'text-purple-600 dark:text-purple-400',
        bgColor: 'bg-purple-100 dark:bg-purple-900',
      },
      [BilletType.HEALTH]: {
        icon: faHeartbeat,
        name: 'Saúde',
        iconColor: 'text-red-600 dark:text-red-400',
        bgColor: 'bg-red-100 dark:bg-red-900',
      },
      [BilletType.LEISURE]: {
        icon: faUmbrellaBeach,
        name: 'Lazer',
        iconColor: 'text-teal-600 dark:text-teal-400',
        bgColor: 'bg-teal-100 dark:bg-teal-900',
      },
      [BilletType.TRAVEL]: {
        icon: faPlane,
        name: 'Viagem',
        iconColor: 'text-indigo-600 dark:text-indigo-400',
        bgColor: 'bg-indigo-100 dark:bg-indigo-900',
      },
      [BilletType.DEPOSIT]: {
        icon: faMoneyCheckAlt,
        name: 'Depósito',
        iconColor: 'text-yellow-600 dark:text-yellow-400',
        bgColor: 'bg-yellow-100 dark:bg-yellow-900',
      },
    };

    // Convert totals to categories
    return Object.entries(categoryTotals)
      .map(([category, total]) => {
        const config = categoryMap[category as BilletType] || {
          icon: faShoppingBag,
          name: 'Outros',
          iconColor: 'text-gray-600 dark:text-gray-400',
          bgColor: 'bg-gray-100 dark:bg-gray-900',
        };
        // Set limit as 2x the spent amount, with a minimum of 1000
        const limit = Math.max(total! * 2, 1000);
        return {
          icon: config.icon,
          name: config.name,
          limit: formatToBRL(limit),
          iconColor: config.iconColor,
          bgColor: config.bgColor,
        };
      })
      .sort((a, b) => a.name.localeCompare(b.name)); // Sort alphabetically for consistency
  };

  const categories = computeCategories();

  // Calculate usage percentage
  const usedPercentage = card.creditCardLimit > 0
    ? Math.round((card.currentInvoiceAmount / card.creditCardLimit) * 100)
    : 0;

  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6">
        Gerenciamento de Limites
      </h3>
      <div className="bg-white dark:bg-slate-950 rounded-xl shadow-md p-6 mb-6 transition-all duration-200">
        <div className="flex justify-between items-center mb-4">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Limite total</p>
            <p className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              {formatToBRL(card.creditCardLimit)}
            </p>
          </div>
          <button
            onClick={onAdjustLimit}
            className="px-4 py-2 bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 text-white rounded-lg text-sm font-semibold transition-all duration-200 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            aria-label="Ajustar limite total"
          >
            Ajustar limite
          </button>
        </div>
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mb-1">
            <span>Utilizado</span>
            <span>{usedPercentage}%</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
            <div
              className="bg-blue-600 dark:bg-blue-500 h-2.5 rounded-full"
              style={{ width: `${usedPercentage}%` }}
            ></div>
          </div>
        </div>
        <div className="space-y-4">
          {categories.map((cat) => (
            <div key={cat.name} className="flex items-center justify-between">
              <div className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full ${cat.bgColor} flex items-center justify-center ${cat.iconColor} mr-3`}
                >
                  <FontAwesomeIcon icon={cat.icon} className="text-xl" />
                </div>
                <div>
                  <p className="text-base font-semibold text-gray-900 dark:text-gray-100">
                    {cat.name}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{cat.limit}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="bg-white dark:bg-slate-950 rounded-xl shadow-md p-6 transition-all duration-200">
        <h4 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Alertas de gastos
        </h4>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Configure alertas para monitorar seus gastos (em desenvolvimento).
        </p>
      </div>
    </div>
  );
};

export default LimitsContent;