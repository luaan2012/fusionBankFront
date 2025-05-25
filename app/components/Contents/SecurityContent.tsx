import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock, faCheckCircle, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';

interface SecurityContentProps {
  onTempBlock: () => void;
}

export const SecurityContent = ({ onTempBlock } : SecurityContentProps) => {
  const history = [
    {
      icon: faLock,
      title: 'Cartão bloqueado temporariamente',
      time: '12/06/2023 - 10:32',
      iconColor: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-100 dark:bg-blue-900',
    },
    {
      icon: faCheckCircle,
      title: 'Transação confirmada via Face ID',
      time: '05/06/2023 - 15:47',
      iconColor: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-100 dark:bg-green-900',
    },
    {
      icon: faExclamationTriangle,
      title: 'Tentativa de compra internacional bloqueada',
      time: '28/05/2023 - 03:15',
      iconColor: 'text-red-600 dark:text-red-400',
      bgColor: 'bg-red-100 dark:bg-red-900',
    },
  ];

  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6">
        Configurações de Segurança
      </h3>
      <div className="bg-white dark:bg-slate-950 rounded-xl shadow-md p-6 mb-6 transition-all duration-200">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-base font-semibold text-gray-900 dark:text-gray-100">
              Bloqueio temporário
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Bloqueie seu cartão se suspeitar de uso indevido
            </p>
          </div>
          <button
            onClick={onTempBlock}
            className="px-4 py-2 bg-yellow-600 dark:bg-yellow-500 hover:bg-yellow-700 dark:hover:bg-yellow-600 text-white rounded-lg text-sm font-semibold transition-all duration-200 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-50"
            aria-label="Ativar bloqueio temporário"
          >
            Ativar bloqueio
          </button>
        </div>
      </div>
      <div className="bg-white dark:bg-slate-950 rounded-xl shadow-md p-6 transition-all duration-200">
        <h4 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Histórico de segurança
        </h4>
        <div className="space-y-4">
          {history.map((item, index) => (
            <div
              key={index}
              className="flex items-start p-4 bg-gray-50 dark:bg-gray-800 rounded-xl"
            >
              <div
                className={`w-10 h-10 rounded-full ${item.bgColor} flex items-center justify-center ${item.iconColor} mr-3 mt-1`}
              >
                <FontAwesomeIcon icon={item.icon} className="text-xl" />
              </div>
              <div>
                <p className="text-base font-semibold text-gray-900 dark:text-gray-100">
                  {item.title}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{item.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
