import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHome,
  faExchangeAlt,
  faCreditCard,
  faChartLine,
  faBell,
  faBarcode,
  faCog,
} from '@fortawesome/free-solid-svg-icons';
import { defaultMessage, formatNumberAccount, formatToBRL, getInitials } from '../../utils';
import type { Account } from '~/models/account'

interface SidebarProps {
  user: Account | null;
  notificationCount: number;
  onTransferClick: () => void;
  onDashboardClick: () => void;
  onCardsClick: () => void;
  investmentClick: () => void;
  billetsClick: () => void;
  accountEditClick: () => void;
  view: 'dashboard' | 'transfer' | 'cards' | 'investments' | 'billets' | 'accountEdit'; // Add view prop to track current view
}

export function Sidebar ({
  user,
  notificationCount,
  onTransferClick,
  onDashboardClick,
  onCardsClick,
  investmentClick,
  billetsClick,
  accountEditClick,
  view,
} : SidebarProps) {
  const menuItems = [
    { icon: faHome, color: 'text-primary-light', label: 'Início', onClick: onDashboardClick, view: 'dashboard' },
    { icon: faExchangeAlt, color: 'text-blue-500', label: 'Transferências', onClick: onTransferClick, view: 'transfer' },
    { icon: faCreditCard, color: 'text-purple-500', label: 'Cartões', onClick: onCardsClick, view: 'cards' }, // Fixed typo: onclick -> onClick
    { icon: faChartLine, color: 'text-green-500', label: 'Investimentos', onClick: investmentClick, view: 'investments' },
    { icon: faBarcode, color: 'text-green-500', label: 'billets', onClick: billetsClick, view: 'billets' },
    { icon: faCog, color: 'text-gray-500', label: 'Configurações', onClick: accountEditClick, view: 'accountEdit' },
  ];

  return (
    <aside className="hidden md:block w-64 flex-shrink-0">
      <div className="bg-white dark:bg-dark-secondary rounded-lg shadow p-4 mb-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-12 h-12 rounded-full bg-primary-light flex items-center justify-center text-white">
            <span>{getInitials(user?.fullName || defaultMessage.loading)}</span>
          </div>
          <div>
            <p className="font-medium text-gray-800 dark:text-light">{user?.fullName || defaultMessage.loading}</p>
            <p className="text-xs text-gray-500">Conta: {formatNumberAccount(user?.accountNumber || defaultMessage.loading)}</p>
          </div>
        </div>
        <div className="mb-4">
          <p className="text-sm text-gray-500">Saldo disponível</p>
          <p className="text-2xl font-bold text-gray-800 dark:text-light">{formatToBRL(user?.balance || defaultMessage.balance)}</p>
        </div>
        <button className="w-full bg-primary-light hover:bg-primary-dark text-white py-2 px-4 rounded-lg smooth-transition">
          Ver extrato completo
        </button>
      </div>
      <nav className="bg-white dark:bg-dark-secondary rounded-lg shadow p-2">
        <ul>
          {menuItems.map((item, index) => (
            <li key={index}>
              <button
                onClick={item.onClick}
                className={`flex items-center space-x-3 p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 w-full text-left ${
                  item.view === view
                    ? 'bg-primary-50 dark:bg-slate-700 text-primary-600 dark:text-primary-400 font-medium'
                    : ''
                }`}
              >
                <FontAwesomeIcon icon={item.icon} className="w-5" />
                <span>{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;