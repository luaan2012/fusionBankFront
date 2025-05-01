import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUniversity,
  faBars,
  faTachometerAlt,
  faUsers,
  faExchangeAlt,
  faSignOutAlt,
  faMoon,
  faSun,
} from '@fortawesome/free-solid-svg-icons';

interface SidebarProps {
  isCollapsed: boolean;
  toggleSidebar: () => void;
  toggleDarkMode: () => void;
  setActiveTab: (tab: string) => void;
  activeTab: string;
  isDarkMode: boolean;
}

export function SidebarAdmin({
  isCollapsed,
  toggleSidebar,
  toggleDarkMode,
  setActiveTab,
  activeTab,
  isDarkMode,
} : SidebarProps) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: faTachometerAlt },
    { id: 'accounts', label: 'Contas', icon: faUsers, group: 'Gerenciamento' },
    { id: 'transactions', label: 'Transações', icon: faExchangeAlt, group: 'Gerenciamento' },
  ];

  return (
    <div
      className={`sidebar bg-gray-800 dark:bg-gray-900 text-white w-64 h-full fixed flex flex-col transition-all duration-300 ${
        isCollapsed ? 'w-16' : ''
      }`}
    >
      <div className="sidebar-header flex items-center justify-between p-4 border-b border-gray-700 dark:border-gray-800">
        <div className={`flex items-center ${isCollapsed ? 'hidden' : ''}`}>
          <FontAwesomeIcon icon={faUniversity} className="text-xl mr-2 text-blue-400" />
          <span className="text-xl font-bold">Admin Banking</span>
        </div>
        <button
          onClick={toggleSidebar}
          className="text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors"
          aria-label="Alternar sidebar"
        >
          <FontAwesomeIcon icon={faBars} className="text-lg" />
        </button>
      </div>

      <div
        className={`p-4 border-b border-gray-700 dark:border-gray-800 flex items-center ${
          isCollapsed ? 'justify-center' : ''
        }`}
      >
        <div className="relative">
          <img
            src="https://randomuser.me/api/portraits/men/75.jpg"
            alt="Admin"
            className="w-10 h-10 rounded-full"
          />
          <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-800 dark:border-gray-900"></span>
        </div>
        {!isCollapsed && (
          <div className="ml-3">
            <p className="text-sm font-medium text-white">Admin Master</p>
            <p className="text-xs text-gray-400">superadmin@banco.com</p>
          </div>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto">
        <div className="p-2">
          {['Principal', 'Gerenciamento', 'Sistema'].map((group) => (
            <div key={group} className="mb-2">
              {navItems.some((item) => item.group === group || (group === 'Principal' && !item.group)) && (
                <p
                  className={`text-xs uppercase text-gray-500 dark:text-gray-400 px-4 py-2 ${
                    isCollapsed ? 'hidden' : ''
                  }`}
                >
                  {group}
                </p>
              )}
              <ul>
                {navItems
                  .filter((item) => item.group === group || (group === 'Principal' && !item.group))
                  .map((item) => (
                    <li key={item.id}>
                      <a
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          setActiveTab(item.id);
                        }}
                        className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                          item.id === activeTab
                            ? 'bg-gray-700 dark:bg-gray-800 text-white'
                            : 'text-gray-300 hover:bg-gray-700 dark:hover:bg-gray-800 hover:text-white'
                        } ${isCollapsed ? 'justify-center' : ''}`}
                        aria-label={item.label}
                      >
                        <FontAwesomeIcon
                          icon={item.icon}
                          className={`text-lg ${isCollapsed ? '' : 'mr-3'}`}
                        />
                        {!isCollapsed && <span>{item.label}</span>}
                      </a>
                    </li>
                  ))}
              </ul>
            </div>
          ))}
        </div>
      </nav>

      <div className="p-4 border-t border-gray-700 dark:border-gray-800 flex items-center justify-between">
        <button
          className={`flex items-center text-sm font-medium text-gray-300 hover:text-white transition-colors ${
            isCollapsed ? 'justify-center' : ''
          }`}
          aria-label="Sair"
        >
          <FontAwesomeIcon
            icon={faSignOutAlt}
            className={`text-lg ${isCollapsed ? '' : 'mr-3'}`}
          />
          {!isCollapsed && <span>Sair</span>}
        </button>
        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-full text-gray-300 hover:text-white hover:bg-gray-700 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors"
          aria-label={isDarkMode ? 'Ativar modo claro' : 'Ativar modo escuro'}
        >
          <FontAwesomeIcon icon={isDarkMode ? faSun : faMoon} className="text-lg" />
        </button>
      </div>
    </div>
  );
};
