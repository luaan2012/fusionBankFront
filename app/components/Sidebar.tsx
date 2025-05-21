import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHome,
  faExchangeAlt,
  faCreditCard,
  faChartLine,
  faBarcode,
  faCog,
  faUser,
} from '@fortawesome/free-solid-svg-icons';
import type { Account } from '~/models/account';
import { useAppStore } from '~/context/appStore';
import { defaultMessage, formatNumberAccount, formatToBRL, getInitials } from '~/utils/utils';

interface SidebarProps {
  user: Account | null;
  view: string;
  onNavigate?: () => void; // Added prop to close mobile menu
}

export function Sidebar({ user, view, onNavigate }: SidebarProps) {
  const { setView } = useAppStore();

  const menuItems = [
    { icon: faHome, color: 'text-primary-light', label: 'Início', view: 'dashboard' },
    { icon: faExchangeAlt, color: 'text-blue-500', label: 'Transferências', view: 'transfer' },
    { icon: faCreditCard, color: 'text-purple-500', label: 'Cartões', view: 'cards' },
    { icon: faChartLine, color: 'text-green-500', label: 'Investimentos', view: 'investments' },
    { icon: faBarcode, color: 'text-green-500', label: 'Depósitos & Boletos', view: 'deposit' },
    { icon: faCog, color: 'text-gray-500', label: 'Configurações', view: 'accountEdit' },
  ];

  const handleNavigation = (newView: string) => {
    setView(newView);
    if (onNavigate) onNavigate(); // Close mobile menu after navigation
  };

  return (
    <aside className="w-full md:w-64 flex-shrink-0">
      <div className="bg-white dark:bg-slate-950 rounded-xl shadow-lg p-5 mb-6 transition-all duration-300 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-14 h-14 rounded-full bg-blue-600 dark:bg-blue-500 flex items-center justify-center text-white text-lg font-semibold">
            <span>
              {user ? (
                getInitials(user?.fullName || defaultMessage.loading)
              ) : (
                <FontAwesomeIcon icon={faUser} className="text-sm animate-spin" />
              )}
            </span>
          </div>
          <div>
            <p className="text-base font-semibold text-gray-900 dark:text-gray-100">
              {user?.fullName || defaultMessage.loading}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Conta: {formatNumberAccount(user?.accountNumber || defaultMessage.loading)}
            </p>
          </div>
        </div>
        <div className="mb-6">
          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Saldo disponível</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {formatToBRL(user?.balance || defaultMessage.balance)}
          </p>
        </div>
        <button
          className="w-full bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 text-white py-2.5 px-4 rounded-lg transition-all duration-200 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          aria-label="Ver extrato completo"
          onClick={() => handleNavigation('dashboard')} // Optional: Navigate to dashboard or specific statement view
        >
          Ver extrato completo
        </button>
      </div>
      <nav className="bg-white dark:bg-slate-950 rounded-xl shadow-lg p-3 transition-all duration-300 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
        <ul className="space-y-1">
          {menuItems.map((item, index) => (
            <li key={index}>
              <button
                onClick={() => handleNavigation(item.view)}
                className={`flex items-center space-x-3 p-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-900 w-full text-left transition-all duration-200 hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 ${
                  item.view === view
                    ? 'bg-blue-50 dark:bg-gray-900 text-blue-600 dark:text-blue-400 font-semibold'
                    : ''
                }`}
                aria-label={`Navegar para ${item.label}`}
              >
                <FontAwesomeIcon icon={item.icon} className="w-5 text-gray-500 dark:text-gray-400" />
                <span className="text-sm font-medium">{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}