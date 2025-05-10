import React, { useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTimes,
  faDollarSign,
  faShieldAlt,
  faUser,
  faBell,
  faCheck,
} from '@fortawesome/free-solid-svg-icons';
import type { EventMessage } from '~/models/eventMessage'

interface NotificationCenterProps {
  isOpen: boolean;
  notifications: EventMessage[];
  toggleNotificationCenter: () => void;
  markAsRead: (id: string) => void;
  clearNotifications: () => void;
}

const NotificationCenter: React.FC<NotificationCenterProps> = ({
  isOpen,
  notifications,
  toggleNotificationCenter,
  markAsRead,
  clearNotifications,
}) => {
  const panelRef = useRef<HTMLDivElement>(null);

  // Close panel on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        toggleNotificationCenter();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, toggleNotificationCenter]);

  // Map notification types to icons and colors
  const getNotificationIcon = (type?: string) => {
    switch (type) {
      case 'transaction':
        return { icon: faDollarSign, color: 'text-green-500' };
      case 'security':
        return { icon: faShieldAlt, color: 'text-red-500' };
      case 'account':
        return { icon: faUser, color: 'text-blue-500' };
      default:
        return { icon: faBell, color: 'text-gray-500' };
    }
  };

  return (
    <div
      ref={panelRef}
      className={`fixed top-16 right-2 w-full sm:w-96 bg-white dark:bg-slate-950 rounded-xl shadow-lg z-[150] transition-all duration-200 ${
        isOpen ? 'animate-slide-in' : 'hidden'
      } bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-slate-950`}
      role="dialog"
      aria-labelledby="notification-center-title"
      aria-hidden={!isOpen}
    >
      <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
        <h3
          id="notification-center-title"
          className="text-xl font-semibold text-gray-900 dark:text-gray-100"
        >
          Notificações
        </h3>
        <button
          onClick={toggleNotificationCenter}
          className="text-gray-500 dark:text-gray-300 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
          aria-label="Fechar centro de notificações"
        >
          <FontAwesomeIcon icon={faTimes} className="text-xl" />
        </button>
      </div>
      <div className="max-h-96 overflow-y-auto" aria-live="polite">
        {notifications.length === 0 ? (
          <div className="p-4 text-center text-gray-500 dark:text-gray-400">
            Nenhuma notificação
          </div>
        ) : (
          <div className="notification-list">
            {notifications.map((notification) => {
              const { icon, color } = getNotificationIcon(notification.action);
              return (
                <div
                  key={notification.eventId}
                  className={`p-4 border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200 ${
                    !notification.read ? 'bg-blue-100 dark:bg-blue-900' : ''
                  } rounded-lg mx-2 my-1`}
                >
                  <div className="flex items-start space-x-3">
                    <div
                      className={`w-8 h-8 rounded-full bg-blue-600 dark:bg-blue-500 flex items-center justify-center ${color}`}
                    >
                      <FontAwesomeIcon icon={icon} className="text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 dark:text-gray-100">
                        {notification.title}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {notification.details}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {new Date(notification.date).toLocaleString()}
                      </p>
                    </div>
                    {!notification.read && (
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => markAsRead(notification.eventId)}
                          className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                          aria-label={`Marcar notificação "${notification.title}" como lida`}
                        >
                          <FontAwesomeIcon icon={faCheck} className="text-sm" />
                        </button>
                        <div
                          className="w-3 h-3 rounded-full bg-blue-600 animate-pulse"
                          aria-hidden="true"
                        ></div>
                        <span className="sr-only">Não lida</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0">
        <button
          onClick={clearNotifications}
          className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-100 rounded-lg text-sm font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all duration-200"
          aria-label="Limpar todas as notificações"
        >
          Limpar todas
        </button>
        <a
          href="#"
          className="px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 dark:hover:bg-blue-600 hover:shadow-md hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
          aria-label="Ver todas as notificações"
        >
          Ver todas
        </a>
      </div>
    </div>
  );
};

export default NotificationCenter;