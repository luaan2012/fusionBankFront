import React from 'react';
import { type Notification } from '../../types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons';
interface NotificationCenterProps {
  isOpen: boolean;
  notifications: Notification[];
  toggleNotificationCenter: () => void;
}

const NotificationCenter: React.FC<NotificationCenterProps> = ({
  isOpen,
  notifications,
  toggleNotificationCenter,
}) => {
  return (
    <div
      className={`fixed top-4 right-4 w-80 bg-white dark:bg-dark-secondary rounded-lg shadow-lg z-40 ${
        isOpen ? '' : 'hidden'
      }`}
    >
      <div className="flex justify-between items-center p-3 border-b dark:border-dark">
        <h3 className="font-semibold text-gray-800 dark:text-light">Notificações</h3>
        <button
          onClick={toggleNotificationCenter}
          className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
        >
          <i className="fas fa-times"></i>
          <FontAwesomeIcon icon={faTimes} />
        </button>
      </div>
      <div className="max-h-96 overflow-y-auto">
        <div className="notification-list">
          {notifications.map(notification => (
            <div
              key={notification.id}
              className={`p-3 border-b dark:border-dark hover:bg-gray-50 dark:hover:bg-gray-800 smooth-transition ${
                notification.unread ? 'bg-blue-50 dark:bg-blue-900' : ''
              }`}
            >
              <div className="flex items-start space-x-3">
                <div
                  className={`w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center ${notification.iconColor}`}
                >
                  <i className={`fas ${notification.icon}`}></i>
                  <FontAwesomeIcon icon={notification.icon} className={notification.iconColor} />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-800 dark:text-light">{notification.title}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {notification.description}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                </div>
                {notification.unread && (
                  <div className="w-2 h-2 rounded-full bg-blue-500 mt-2"></div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="p-3 border-t dark:border-dark text-center">
        <a href="#" className="text-primary-light hover:text-primary-dark text-sm">
          Ver todas
        </a>
      </div>
    </div>
  );
};

export default NotificationCenter;