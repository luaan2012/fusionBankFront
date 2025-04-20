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
import { getInitials } from '../../utils';

interface SidebarProps {
  user: { name: string; account: string };
  notificationCount: number;
  onTransferClick: () => void;
  onDashboardClick: () => void;
  onCardsClick: () => void;
  investmentClick: () => void;
  billetsClick: () => void;
  view: 'dashboard' | 'transfer' | 'cards' | 'investments' | 'billets'; // Add view prop to track current view
}

const Sidebar: React.FC<SidebarProps> = ({
  user,
  notificationCount,
  onTransferClick,
  onDashboardClick,
  onCardsClick,
  investmentClick,
  billetsClick,
  view,
}) => {
  const menuItems = [
    { icon: faHome, color: 'text-primary-light', label: 'Início', onClick: onDashboardClick, view: 'dashboard' },
    { icon: faExchangeAlt, color: 'text-blue-500', label: 'Transferências', onClick: onTransferClick, view: 'transfer' },
    { icon: faCreditCard, color: 'text-purple-500', label: 'Cartões', onClick: onCardsClick, view: 'cards' }, // Fixed typo: onclick -> onClick
    { icon: faChartLine, color: 'text-green-500', label: 'Investimentos', onClick: investmentClick, view: 'investments' },
    { icon: faBarcode, color: 'text-green-500', label: 'billets', onClick: billetsClick, view: 'billets' },
    { icon: faBell, color: 'text-yellow-500', label: 'Notificações', badge: notificationCount, onClick: () => {}, view: '' },
    { icon: faCog, color: 'text-gray-500', label: 'Configurações', onClick: () => {}, view: '' },
  ];

  return (
    <aside className="hidden md:block w-64 flex-shrink-0">
      <div className="bg-white dark:bg-dark-secondary rounded-lg shadow p-4 mb-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-12 h-12 rounded-full bg-primary-light flex items-center justify-center text-white">
            <span>{getInitials(user.name)}</span>
          </div>
          <div>
            <p className="font-medium text-gray-800 dark:text-light">{user.name}</p>
            <p className="text-xs text-gray-500">Conta: {user.account}</p>
          </div>
        </div>
        <div className="mb-4">
          <p className="text-sm text-gray-500">Saldo disponível</p>
          <p className="text-2xl font-bold text-gray-800 dark:text-light">R$ 12.345,67</p>
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
                {item.badge && (
                  <span className="ml-auto bg-red-500 text-white text-xs rounded-full px-2 py-1">
                    {item.badge}
                  </span>
                )}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;