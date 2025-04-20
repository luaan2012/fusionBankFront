import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHome,
  faExchangeAlt,
  faCreditCard,
  faChartLine,
  faBell,
  faCog,
  faMoon,
  faSignOutAlt,
} from '@fortawesome/free-solid-svg-icons';
import { getInitials } from '../../utils';

interface MenuItem {
  icon: any; // Use specific icon type if needed
  color: string;
  label: string;
  active?: boolean;
  badge?: number;
}

interface MobileMenuProps {
  isOpen: boolean;
  user: { name: string; account: string };
  notificationCount: number;
  toggleDarkMode: () => void;
  isDarkMode: boolean;
  logout: () => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({
  isOpen,
  user,
  notificationCount,
  toggleDarkMode,
  isDarkMode,
  logout,
}) => {
  const menuItems: MenuItem[] = [
    { icon: faHome, color: 'text-primary-light', label: 'Início', active: true },
    { icon: faExchangeAlt, color: 'text-blue-500', label: 'Transferências' },
    { icon: faCreditCard, color: 'text-purple-500', label: 'Cartões' },
    { icon: faChartLine, color: 'text-green-500', label: 'Investimentos' },
    { icon: faBell, color: 'text-yellow-500', label: 'Notificações', badge: notificationCount },
    { icon: faCog, color: 'text-gray-500', label: 'Configurações' },
  ];

  return (
    <div
      className={`mobile-menu fixed inset-y-0 left-0 w-64 bg-white dark:bg-dark-secondary shadow-lg z-30 smooth-transition ${
        isOpen ? 'active' : ''
      }`}
    >
      <div className="p-4 border-b dark:border-dark flex items-center space-x-3">
        <div className="w-10 h-10 rounded-full bg-primary-light flex items-center justify-center text-white">
          <span>{getInitials(user.name)}</span>
        </div>
        <div>
          <p className="font-medium text-gray-800 dark:text-light">{user.name}</p>
          <p className="text-xs text-gray-500">Conta: {user.account}</p>
        </div>
      </div>
      <nav className="p-2">
        <ul>
          {menuItems.map((item, index) => (
            <li key={index}>
              <a
                href="#"
                className={`menu-item flex items-center p-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 smooth-transition ${
                  item.active ? 'active' : ''
                }`}
              >
                <FontAwesomeIcon
                  icon={item.icon}
                  className={`w-6 text-center mr-3 ${item.color}`}
                />
                <span>{item.label}</span>
                {item.badge && (
                  <span className="notification-badge bg-red-500 text-white ml-auto">
                    {item.badge}
                  </span>
                )}
              </a>
            </li>
          ))}
        </ul>
      </nav>
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t dark:border-dark">
        <button
          onClick={toggleDarkMode}
          className="w-full flex items-center justify-center p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 smooth-transition"
        >
          <FontAwesomeIcon icon={faMoon} className="mr-2" />
          <span>{isDarkMode ? 'Modo Claro' : 'Modo Escuro'}</span>
        </button>
        <button
          onClick={logout}
          className="w-full mt-2 flex items-center justify-center p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 smooth-transition"
        >
          <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" />
          <span>Sair</span>
        </button>
      </div>
    </div>
  );
};

export default MobileMenu;