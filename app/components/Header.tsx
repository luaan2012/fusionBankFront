import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faUniversity, faSun, faMoon, faBell } from '@fortawesome/free-solid-svg-icons';
import { defaultMessage, getInitials } from '../../utils';
import type { Account } from '~/models/account'

interface HeaderProps {
  user: Account | null;
  toggleMobileMenu: () => void;
  toggleDarkMode: () => void;
  toggleNotificationCenter: () => void;
  notificationCount: number;
  isDarkMode: boolean;
}

const Header: React.FC<HeaderProps> = ({
  user,
  toggleMobileMenu,
  toggleDarkMode,
  toggleNotificationCenter,
  notificationCount,
  isDarkMode,
}) => {
  return (
    <header className="bg-white dark:bg-dark-secondary shadow-sm sticky top-0 z-20">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            className="md:hidden text-gray-600 dark:text-gray-300"
            onClick={toggleMobileMenu}
          >
            <FontAwesomeIcon icon={faBars} className="text-xl" />
          </button>
          <a href="#" className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-primary-light flex items-center justify-center text-white mr-2">
              <FontAwesomeIcon icon={faUniversity} />
            </div>
            <span className="text-xl font-bold text-gray-800 dark:text-light">DeepBank</span>
          </a>
        </div>
        <div className="hidden md:flex items-center space-x-6">
          <button
            className="text-gray-600 dark:text-gray-300 hover:text-primary-light smooth-transition"
            onClick={toggleDarkMode}
          >
            <FontAwesomeIcon icon={isDarkMode ? faSun : faMoon} />
          </button>
          <div className="relative">
            <button
              className="text-gray-600 dark:text-gray-300 hover:text-primary-light smooth-transition relative"
              onClick={toggleNotificationCenter}
            >
              <FontAwesomeIcon icon={faBell} className="text-xl" />
              <span className="notification-badge bg-red-500 text-white">{notificationCount}</span>
            </button>
          </div>
          <div className="flex items-center space-x-3">
            {/* <div className="w-8 h-8 rounded-full bg-primary-light flex items-center justify-center font-medium text-gray-700 dark:text-white">
              <span>{getInitials(user.name)}</span>
            </div> */}
            <span className="hidden lg:inline text-gray-700 dark:text-gray-300 font-medium">
              {user?.fullName || defaultMessage.loading}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;