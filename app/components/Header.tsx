import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faUniversity, faSun, faMoon, faBell, faUser, faCog, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { defaultMessage, getInitials } from '../utils/utils';
import type { Account } from '~/models/account';
import { useAccountStore } from '~/context/accountStore'
import { useNavigate } from 'react-router'
import { useAppStore } from '~/context/appStore'

interface HeaderProps {
  user: Account | null;
  toggleMobileMenu: () => void;
  toggleDarkMode: () => void;
  toggleNotificationCenter: () => void;
  notificationCount: number;
  isDarkMode: boolean;
  isNotificationCenterOpen: boolean;
}

const Header: React.FC<HeaderProps> = ({
  user,
  toggleMobileMenu,
  toggleDarkMode,
  toggleNotificationCenter,
  notificationCount,
  isDarkMode,
  isNotificationCenterOpen,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { logout } = useAccountStore()
  const { setView } = useAppStore()
  const navigate = useNavigate()

  const handleDropdownToggle = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const handleConfig = () => {
    setView('config')
    setIsDropdownOpen((prev) => !prev);
  };

  const handleLogout = () => {
    logout()
    navigate('/')
    setIsDropdownOpen(false);
  };

  return (
    <header
      className="bg-white dark:bg-slate-950 shadow-md sticky top-0 z-20 transition-all duration-200 bg-gradient-to-r from-gray-50 to-white dark:from-gray-900 dark:to-slate-950"
      role="banner"
    >
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            className="md:hidden text-gray-600 dark:text-gray-300 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
            onClick={toggleMobileMenu}
            aria-label="Alternar menu móvel"
          >
            <FontAwesomeIcon icon={faBars} className="text-xl" />
          </button>
          <button
            onClick={() => setView('dashboard')}
            className="flex items-center hover:scale-105 transition-all duration-200"
            aria-label="Página inicial do DeepBank"
          >
            <div className="w-10 h-10 rounded-full bg-blue-600 dark:bg-blue-500 flex items-center justify-center text-white mr-2">
              <FontAwesomeIcon icon={faUniversity} className="text-xl" />
            </div>
            <span className="hidden sm:inline text-2xl font-semibold text-gray-900 dark:text-gray-100">
              DeepBank
            </span>
          </button>
        </div>
        <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6">
          <button
            className="text-gray-600 dark:text-gray-300 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
            onClick={toggleDarkMode}
            aria-label={isDarkMode ? 'Ativar modo claro' : 'Ativar modo escuro'}
            title={isDarkMode ? 'Ativar modo claro' : 'Ativar modo escuro'}
          >
            <FontAwesomeIcon icon={isDarkMode ? faSun : faMoon} className="text-xl" />
          </button>
          <div className="relative">
            <button
              className={`text-gray-600 dark:text-gray-300 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ${
                isNotificationCenterOpen ? 'ring-2 ring-blue-500' : ''
              }`}
              onClick={toggleNotificationCenter}
              aria-label={`Abrir centro de notificações (${notificationCount} novas)`}
              title="Notificações"
            >
              <FontAwesomeIcon icon={faBell} className="text-xl" />
              {notificationCount > 0 && (
                <>
                  <span
                    className="absolute top-0 right-0 bg-red-600 text-white text-xs font-medium rounded-full w-5 h-5 flex items-center justify-center animate-pulse"
                    aria-hidden="true"
                  >
                    {notificationCount > 9 ? '9+' : notificationCount}
                  </span>
                  <span className="sr-only">{notificationCount} novas notificações</span>
                </>
              )}
            </button>
          </div>
          <div className="relative">
            <button
              className="flex items-center space-x-3 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full p-1 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200"
              onClick={handleDropdownToggle}
              aria-expanded={isDropdownOpen}
              aria-controls="user-dropdown"
              aria-label="Menu do usuário"
            >
              <div className="w-8 h-8 rounded-full bg-blue-600 dark:bg-blue-500 flex items-center justify-center text-white font-medium">
                {user ? (
                  <span>{getInitials(user.fullName)}</span>
                ) : (
                  <FontAwesomeIcon icon={faUser} className="text-sm animate-spin" />
                )}
              </div>
              <span className="hidden lg:inline text-sm font-medium text-gray-700 dark:text-gray-300">
                {user?.fullName || defaultMessage.loading}
              </span>
            </button>
            {isDropdownOpen && (
              <div
                id="user-dropdown"
                className="absolute right-0 mt-2 w-full md:w-48 bg-white dark:bg-slate-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 z-30"
              >
                <ul className="py-2 text-sm text-gray-700 dark:text-gray-200">
                  <li>
                    <button
                      onClick={handleConfig}
                      className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200"
                    >
                      <FontAwesomeIcon icon={faCog} className="mr-2" />
                      Configurações
                    </button>
                  </li>
                  <li>
                    <button
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200"
                      onClick={handleLogout}
                    >
                      <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" />
                      Sair
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;