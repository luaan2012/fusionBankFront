import { useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTimes,
  faDollarSign,
  faShieldAlt,
  faUser,
  faBell,
  faCheck,
} from '@fortawesome/free-solid-svg-icons';
import type { EventMessage } from '~/types/notification'

interface NotificationCenterProps {
  isOpen: boolean;
  notifications: EventMessage[];
  toggleNotificationCenter: () => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  deleteAllById: () => void;
}

export const NotificationCenter = ({
  isOpen,
  notifications,
  toggleNotificationCenter,
  markAsRead,
  markAllAsRead,
  deleteAllById,
} : NotificationCenterProps) => {
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
        return { icon: faDollarSign, color: 'bg-emerald-500 text-white' };
      case 'security':
        return { icon: faShieldAlt, color: 'bg-rose-500 text-white' };
      case 'account':
        return { icon: faUser, color: 'bg-indigo-500 text-white' };
      default:
        return { icon: faBell, color: 'bg-gray-500 text-white' };
    }
  };

  const handleNotificationClick = (eventId: string) => {
    markAsRead(eventId);
  };

  return (
    <div
      ref={panelRef}
      className={`fixed top-16 right-4 w-full sm:w-96 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl z-[150] transform transition-all duration-500 ease-in-out ${
        isOpen ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full pointer-events-none'
      } bg-gradient-to-br from-gray-100 to-white dark:from-gray-800 dark:to-gray-900 ring-1 ring-gray-200 dark:ring-gray-700`}
      role="dialog"
      aria-labelledby="notification-center-title"
      aria-hidden={!isOpen}
    >
      {/* Header */}
      <div className="flex justify-between items-center p-5 border-b border-gray-200 dark:border-gray-700">
        <h3
          id="notification-center-title"
          className="text-xl font-bold text-gray-900 dark:text-gray-100 tracking-tight"
        >
          Notificações
        </h3>
        <button
          onClick={toggleNotificationCenter}
          className="text-gray-500 dark:text-gray-300 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200"
          aria-label="Fechar centro de notificações"
        >
          <FontAwesomeIcon icon={faTimes} className="text-lg" />
        </button>
      </div>

      {/* Notification List */}
      <div
        className="max-h-96 overflow-y-auto"
        style={{
          scrollbarWidth: 'thin',
          scrollbarColor: 'rgba(99, 102, 241, 0.5) rgba(229, 231, 235, 0.2)', // indigo-500 and gray-200 for light mode
        }}
      >
        <style>
          {`
            .max-h-96::-webkit-scrollbar {
              width: 8px;
            }
            .max-h-96::-webkit-scrollbar-track {
              background: rgba(229, 231, 235, 0.2); /* gray-200 with opacity */
              border-radius: 8px;
              margin: 4px 0;
            }
            .max-h-96::-webkit-scrollbar-thumb {
              background: rgba(99, 102, 241, 0.5); /* indigo-500 with opacity */
              border-radius: 8px;
              transition: background 0.2s ease-in-out;
            }
            .max-h-96::-webkit-scrollbar-thumb:hover {
              background: rgba(99, 102, 241, 0.8); /* indigo-500 darker on hover */
            }
            .dark .max-h-96::-webkit-scrollbar-track {
              background: rgba(55, 65, 81, 0.2); /* gray-700 with opacity */
            }
            .dark .max-h-96::-webkit-scrollbar-thumb {
              background: rgba(129, 140, 248, 0.5); /* indigo-400 with opacity */
            }
            .dark .max-h-96::-webkit-scrollbar-thumb:hover {
              background: rgba(129, 140, 248, 0.8); /* indigo-400 darker on hover */
            }
          `}
        </style>
        {notifications.length === 0 ? (
          <div className="p-6 text-center text-gray-500 dark:text-gray-400 text-sm font-medium">
            Nenhuma notificação
          </div>
        ) : (
          <div className="space-y-3 p-4">
            {notifications.map((notification) => {
              const { icon, color } = getNotificationIcon(notification.action);
              return (
                <div
                  key={notification.eventId}
                  className={`p-4 mx-2 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-300 transform hover:scale-[1.01] ${
                    !notification.read ? 'bg-indigo-50 dark:bg-indigo-900/30' : 'opacity-90'
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
                  <div className="flex items-start space-x-4">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${color} shadow-sm`}
                    >
                      <FontAwesomeIcon icon={icon} className="text-base" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                        {notification.title}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 leading-relaxed">
                        {notification.details}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
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
                          className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-full p-1.5 transition-all duration-200"
                          aria-label={`Marcar notificação "${notification.title}" como lida`}
                        >
                          <FontAwesomeIcon icon={faCheck} className="text-sm" />
                        </button>
                        <div
                          className="w-2.5 h-2.5 rounded-full bg-indigo-600 animate-pulse"
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
      <div className="p-5 border-t border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row justify-between items-center space-y-3 sm:space-y-0">
        <button
          onClick={markAllAsRead}
          disabled={!markAllAsRead || notifications.length === 0 || notifications.every((d) => d.read)}
          className="w-full sm:w-auto px-5 py-2.5 bg-indigo-600 dark:bg-indigo-700 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 dark:hover:bg-indigo-600 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Ler todas as notificações"
        >
          Marcar todas como lidas
        </button>
        {/* <button
          onClick={deleteAllById}
          className="w-full sm:w-auto px-5 py-2.5 bg-rose-600 dark:bg-rose-700 text-white rounded-lg text-sm font-medium hover:bg-rose-700 dark:hover:bg-rose-600 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-rose-500 transition-all duration-200"
          aria-label="Excluir todas as notificações"
        >
          Excluir todas
        </button> */}
      </div>
    </div>
  );
};
