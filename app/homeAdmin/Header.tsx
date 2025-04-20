import React, { useState } from 'react';

interface HeaderProps {
  openModal: (type: 'bank' | 'transfer' | 'twofa' | 'confirm', data?: any) => void;
}

const Header: React.FC<HeaderProps> = ({ openModal }) => {
  const [isQuickActionsOpen, setIsQuickActionsOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm z-10">
      <div className="flex items-center justify-between px-6 py-3">
        <div className="flex items-center">
          <h1 id="pageTitle" className="text-xl font-bold text-gray-800 dark:text-white">
            Dashboard
          </h1>
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <input
              type="text"
              id="globalSearch"
              className="w-64 px-4 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-light dark:focus:ring-primary-dark focus:border-transparent"
              placeholder="Buscar..."
            />
            <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400">
              <i className="fas fa-search"></i>
            </button>
          </div>
          <div className="relative">
            <button
              onClick={() => setIsQuickActionsOpen(!isQuickActionsOpen)}
              className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
            >
              <i className="fas fa-bolt"></i>
            </button>
            {isQuickActionsOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-md shadow-lg z-20">
                <div className="p-2 border-b border-gray-200 dark:border-gray-700">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Ações Rápidas</p>
                </div>
                <div className="p-1">
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      openModal('transfer');
                      setIsQuickActionsOpen(false);
                    }}
                    className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                  >
                    <i className="fas fa-exchange-alt mr-2"></i> Transferência
                  </a>
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                  >
                    <i className="fas fa-user-lock mr-2"></i> Bloquear Usuário
                  </a>
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                  >
                    <i className="fas fa-ban mr-2"></i> Cancelar Transação
                  </a>
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                  >
                    <i className="fas fa-file-export mr-2"></i> Exportar Relatório
                  </a>
                </div>
              </div>
            )}
          </div>
          <div className="relative">
            <button
              onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
              className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 relative"
            >
              <i className="fas fa-bell"></i>
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            {isNotificationsOpen && (
              <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-gray-800 rounded-md shadow-lg z-20">
                <div className="p-2 border-b border-gray-200 dark:border-gray-700">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray300">Notificações</p>
                </div>
                <div className="p-1 max-h-64 overflow-y-auto">
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                  >
                    <div className="flex items-start">
                      <div className="flex-shrink-0 pt-0.5">
                        <i className="fas fa-exclamation-triangle text-yellow-500"></i>
                      </div>
                      <div className="ml-3">
                        <p className="font-medium">Transação Suspeita</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">PIX de R$ 120.000,00</p>
                      </div>
                    </div>
                  </a>
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                  >
                    <div className="flex items-start">
                      <div className="flex-shrink-0 pt-0.5">
                        <i className="fas fa-user-clock text-blue-500"></i>
                      </div>
                      <div className="ml-3">
                        <p className="font-medium">Novo usuário cadastrado</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">João Silva</p>
                      </div>
                    </div>
                  </a>
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                  >
                    <div className="flex items-start">
                      <div className="flex-shrink-0 pt-0.5">
                        <i className="fas fa-credit-card text-green-500"></i>
                      </div>
                      <div className="ml-3">
                        <p className="font-medium">Cartão aprovado</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Final 4567</p>
                      </div>
                    </div>
                  </a>
                </div>
                <div className="p-2 border-t border-gray-200 dark:border-gray-700">
                  <a
                    href="#"
                    className="block text-center text-xs font-medium text-primary-light dark:text-primary-dark hover:underline"
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

export default Header;