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
import type { EventMessage } from '~/models/eventMessage';

interface NotificationCenterProps {
  isOpen: boolean;
  notifications: EventMessage[];
  toggleNotificationCenter: () => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void
  deleteAllById: () => void
}

const NotificationCenter: React.FC<NotificationCenterProps> = ({
  isOpen,
  notifications,
  toggleNotificationCenter,
  markAsRead,
  deleteAllById,
  markAllAsRead
}) => {
  const panelRef = useRef<HTMLDivElement>(null);

  // Close panel on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        panelRef.current &&
        !panelRef.current.contains(event.target as Node) &&
        !(event.target as HTMLElement).closest('[data-notification-button]')
      ) {
        toggleNotificationCenter();
      }
    };

    if (isOpen) {
      document.addEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isOpen, toggleNotificationCenter]);

  // Map notification types to icons and colors
  const getNotificationIcon = (type?: string) => {
    switch (type) {
      case 'transaction':
        return { icon: faDollarSign, color: 'bg-green-500 text-white' };
      case 'security':
        return { icon: faShieldAlt, color: 'bg-red-500 text-white' };
      case 'account':
        return { icon: faUser, color: 'bg-blue-500 text-white' };
      default:
        return { icon: faBell, color: 'bg-gray-500 text-white' };
    }
  };

  const handleNotificationClick = (eventId: string) => {
    markAsRead(eventId)
  };

  return (
    <div
      ref={panelRef}
      className={`fixed top-16 right-4 w-full sm:w-80 md:w-96 bg-white dark:bg-slate-950 rounded-xl shadow-xl z-[150] transition-all duration-300 ease-in-out ${
        isOpen
          ? 'opacity-100 translate-x-0'
          : 'opacity-0 translate-x-full pointer-events-none'
      } bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-slate-950`}
      role="dialog"
      aria-labelledby="notification-center-title"
      aria-hidden={!isOpen}
    >
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
        <h3
          id="notification-center-title"
          className="text-lg font-semibold text-gray-900 dark:text-gray-100"
        >
          Notificações
        </h3>
        <button
          onClick={toggleNotificationCenter}
          className="text-gray-500 dark:text-gray-300 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
          aria-label="Fechar centro de notificações"
        >
          <FontAwesomeIcon icon={faTimes} className="text-lg" />
        </button>
      </div>

      {/* Notification List */}
      <div className="max-h-80 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-gray-100 dark:scrollbar-track-gray-800">
        {notifications.length === 0 ? (
          <div className="p-4 text-center text-gray-500 dark:text-gray-400 text-sm">
            Nenhuma notificação
          </div>
        ) : (
          <div className="space-y-2 p-2">
            {notifications.map((notification) => {
              const { icon, color } = getNotificationIcon(notification.action);
              return (
                <div
                  key={notification.eventId}
                  className={`p-3 mx-2 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-300 ${
                    !notification.read ? 'bg-blue-50 dark:bg-blue-900/50' : 'opacity-80'
                  } ${!notification.read ? 'cursor-pointer' : ''}`}
                  onClick={() => handleNotificationClick(notification.eventId)}
                  role={notification.read ? undefined : 'button'}
                  tabIndex={notification.read ? undefined : 0}
                  aria-label={
                    notification.read
                      ? notification.title
                      : `Marcar notificação "${notification.title}" como lida`
                  }
                  onKeyDown={(e) => {
                    if (!notification.read && (e.key === 'Enter' || e.key === ' ')) {
                      handleNotificationClick(notification.eventId);
                    }
                  }}
                >
                  <div className="flex items-start space-x-3">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${color}`}
                    >
                      <FontAwesomeIcon icon={icon} className="text-sm" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {notification.title}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                        {notification.details}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                        {new Date(notification.date).toLocaleString('pt-BR', {
                          dateStyle: 'short',
                          timeStyle: 'short',
                        })}
                      </p>
                    </div>
                    {!notification.read && markAsRead && (
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            markAsRead(notification.eventId);
                          }}
                          className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full p-1 transition-all duration-200"
                          aria-label={`Marcar notificação "${notification.title}" como lida`}
                        >
                          <FontAwesomeIcon icon={faCheck} className="text-sm" />
                        </button>
                        <div
                          className="w-2 h-2 rounded-full bg-blue-600 animate-pulse transition-opacity duration-300"
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

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0">
        <button
          onClick={markAllAsRead}
          disabled={!markAllAsRead || notifications.length === 0 || notifications.every(d => d.read)}
          className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-100 rounded-lg text-sm font-medium hover:bg-gray-300 dark:hover:bg-gray-600 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Ler todas as notificações"
        >
          Marcar todas como lidas
        </button>
        <button
          onClick={deleteAllById}
          className="px-4 py-2 bg-red-500 dark:bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-700 dark:hover:bg-red-600 hover:shadow-md hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-200"
          aria-label="Excluir todas as notificações"
        >
          Excluir todas
        </button>
      </div>
    </div>
  );
};

export default NotificationCenter;