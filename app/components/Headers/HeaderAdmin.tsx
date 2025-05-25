import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSearch,
  faBolt,
  faBell,
  faExchangeAlt,
  faUserLock,
  faBan,
  faFileExport,
  faExclamationTriangle,
  faUserClock,
  faCreditCard,
} from '@fortawesome/free-solid-svg-icons';

interface HeaderProps {
  openModal: (type: 'bank' | 'transfer' | 'twofa' | 'confirm', data?: any) => void;
}

export const HeaderAdmin = ({ openModal } : HeaderProps) => {
  const [isQuickActionsOpen, setIsQuickActionsOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  return (
    <header className="bg-white dark:bg-gray-900 shadow-lg z-10">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center">
          <h1
            id="pageTitle"
            className="text-2xl font-semibold text-gray-900 dark:text-white"
          >
            Dashboard
          </h1>
        </div>
        <div className="flex items-center space-x-6">
          <div className="relative">
            <input
              type="text"
              id="globalSearch"
              className="w-80 px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-colors text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
              placeholder="Buscar..."
            />
            <button
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-300 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors"
              aria-label="Buscar"
            >
              <FontAwesomeIcon icon={faSearch} className="text-lg" />
            </button>
          </div>
          <div className="relative">
            <button
              onClick={() => setIsQuickActionsOpen(!isQuickActionsOpen)}
              className="p-3 rounded-full bg-indigo-500 dark:bg-indigo-600 text-white hover:bg-indigo-600 dark:hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 transition-all shadow-md"
              aria-label="Ações rápidas"
              aria-expanded={isQuickActionsOpen}
            >
              <FontAwesomeIcon icon={faBolt} className="text-lg" />
            </button>
            {isQuickActionsOpen && (
              <div className="absolute right-0 mt-3 w-72 bg-white dark:bg-gray-800 rounded-xl shadow-2xl z-20 transform transition-all duration-200 ease-in-out">
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                  <p className="text-sm font-semibold text-gray-800 dark:text-white">
                    Ações Rápidas
                  </p>
                </div>
                <div className="p-2">
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      openModal('transfer');
                      setIsQuickActionsOpen(false);
                    }}
                    className="flex items-center px-4 py-2.5 text-sm text-gray-700 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
                  >
                    <FontAwesomeIcon
                      icon={faExchangeAlt}
                      className="mr-3 text-indigo-500"
                    />
                    Transferência
                  </a>
                  <a
                    href="#"
                    className="flex items-center px-4 py-2.5 text-sm text-gray-700 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
                  >
                    <FontAwesomeIcon
                      icon={faUserLock}
                      className="mr-3 text-red-500"
                    />
                    Bloquear Usuário
                  </a>
                  <a
                    href="#"
                    className="flex items-center px-4 py-2.5 text-sm text-gray-700 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
                  >
                    <FontAwesomeIcon
                      icon={faBan}
                      className="mr-3 text-orange-500"
                    />
                    Cancelar Transação
                  </a>
                  <a
                    href="#"
                    className="flex items-center px-4 py-2.5 text-sm text-gray-700 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
                  >
                    <FontAwesomeIcon
                      icon={faFileExport}
                      className="mr-3 text-green-500"
                    />
                    Exportar Relatório
                  </a>
                </div>
              </div>
            )}
          </div>
          <div className="relative">
            <button
              onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
              className="p-3 rounded-full bg-indigo-500 dark:bg-indigo-600 text-white hover:bg-indigo-600 dark:hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 relative transition-all shadow-md"
              aria-label="Notificações"
              aria-expanded={isNotificationsOpen}
            >
              <FontAwesomeIcon icon={faBell} className="text-lg" />
              <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border-2 border-white dark:border-gray-900"></span>
            </button>
            {isNotificationsOpen && (
              <div className="absolute right-0 mt-3 w-96 bg-white dark:bg-gray-800 rounded-xl shadow-2xl z-20 transform transition-all duration-200 ease-in-out">
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                  <p className="text-sm font-semibold text-gray-800 dark:text-white">
                    Notificações
                  </p>
                </div>
                <div className="p-2 max-h-80 overflow-y-auto">
                  <a
                    href="#"
                    className="flex items-start px-4 py-3 text-sm text-gray-700 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
                  >
                    <div className="flex-shrink-0 pt-0.5">
                      <FontAwesomeIcon
                        icon={faExclamationTriangle}
                        className="text-yellow-500"
                      />
                    </div>
                    <div className="ml-3 flex-1">
                      <p className="font-medium text-gray-800 dark:text-white">
                        Transação Suspeita
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        PIX de R$ 120.000,00
                      </p>
                    </div>
                  </a>
                  <a
                    href="#"
                    className="flex items-start px-4 py-3 text-sm text-gray-700 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
                  >
                    <div className="flex-shrink-0 pt-0.5">
                      <FontAwesomeIcon
                        icon={faUserClock}
                        className="text-blue-500"
                      />
                    </div>
                    <div className="ml-3 flex-1">
                      <p className="font-medium text-gray-800 dark:text-white">
                        Novo usuário cadastrado
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        João Silva
                      </p>
                    </div>
                  </a>
                  <a
                    href="#"
                    className="flex items-start px-4 py-3 text-sm text-gray-700 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
                  >
                    <div className="flex-shrink-0 pt-0.5">
                      <FontAwesomeIcon
                        icon={faCreditCard}
                        className="text-green-500"
                      />
                    </div>
                    <div className="ml-3 flex-1">
                      <p className="font-medium text-gray-800 dark:text-white">
                        Cartão aprovado
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Final 4567
                      </p>
                    </div>
                  </a>
                </div>
                <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                  <a
                    href="#"
                    className="block text-center text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:underline"
                  >
                    Ver todas
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
