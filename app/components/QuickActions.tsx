import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBarcode, faCreditCard, faChartLine, faQrcode } from '@fortawesome/free-solid-svg-icons';
import { useAppStore } from '~/context/appStore'

interface Action {
  icon: any; // Use specific icon type if needed
  color: string;
  bg: string;
  label: string;
  route: string
}

const QuickActions: React.FC = () => {
  const { setView } = useAppStore()

  const actions: Action[] = [
    { icon: faQrcode, color: 'text-blue-800', bg: 'bg-blue-100', label: 'PIX', route: 'transfer' }, // Using faQrcode as a placeholder for fa-pix
    { icon: faBarcode, color: 'text-green-800', bg: 'bg-green-100', label: 'Depositos & Boletos', route: 'deposit' },
    { icon: faCreditCard, color: 'text-purple-800', bg: 'bg-purple-100', label: 'Cartões', route: 'cards' },
    { icon: faChartLine, color: 'text-yellow-800', bg: 'bg-yellow-100', label: 'Investir', route: 'investments' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      {actions.map((action, index) => (
        <button
          key={index}
          onClick={() => setView(action.route)}
          className="bg-white dark:bg-slate-950 rounded-xl shadow-md p-5 text-center transition-all duration-300 hover:shadow-xl hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800"
          aria-label={`Executar ${action.label}`}
        >
          <div
            className={`w-14 h-14 ${action.bg} dark:bg-opacity-30 rounded-full flex items-center justify-center mx-auto mb-3 transition-transform duration-200 hover:scale-110`}
          >
            <FontAwesomeIcon
              icon={action.icon}
              className={`${action.color} dark:${action.color.replace('500', '300')} text-2xl`}
            />
          </div>
          <span className="text-sm font-semibold text-gray-900 dark:text-gray-100 tracking-tight">
            {action.label}
          </span>
        </button>
      ))}
    </div>
  );
};

export default QuickActions;