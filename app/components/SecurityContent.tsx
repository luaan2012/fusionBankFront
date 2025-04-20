import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock, faCheckCircle, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';

interface SecurityContentProps {
  onTempBlock: () => void;
}

const SecurityContent: React.FC<SecurityContentProps> = ({ onTempBlock }) => {
  const history = [
    {
      icon: faLock,
      title: 'Cartão bloqueado temporariamente',
      time: '12/06/2023 - 10:32',
      iconColor: 'text-blue-500 dark:text-blue-300',
      bgColor: 'bg-blue-100 dark:bg-blue-900',
    },
    {
      icon: faCheckCircle,
      title: 'Transação confirmada via Face ID',
      time: '05/06/2023 - 15:47',
      iconColor: 'text-green-500 dark:text-green-300',
      bgColor: 'bg-green-100 dark:bg-green-900',
    },
    {
      icon: faExclamationTriangle,
      title: 'Tentativa de compra internacional bloqueada',
      time: '28/05/2023 - 03:15',
      iconColor: 'text-red-500 dark:text-red-300',
      bgColor: 'bg-red-100 dark:bg-red-900',
    },
  ];

  return (
    <div>
      <h3 className="text-lg font-semibold mb-6 dark:text-white">Configurações de Segurança</h3>
      <div className="bg-white dark:bg-dark-600 rounded-lg shadow p-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="font-medium dark:text-white">Bloqueio temporário</p>
            <p className="text-sm text-gray-500 dark:text-gray-300">
              Bloqueie seu cartão se suspeitar de uso indevido
            </p>
          </div>
          <button
            onClick={onTempBlock}
            className="px-4 py-2 bg-yellow-500 text-white rounded-lg text-sm"
          >
            Ativar bloqueio
          </button>
        </div>
        {/* Add other security settings here */}
      </div>
      <div className="bg-white dark:bg-dark-600 rounded-lg shadow p-6">
        <h4 className="font-medium mb-4 dark:text-white">Histórico de segurança</h4>
        <div className="space-y-4">
          {history.map((item, index) => (
            <div key={index} className="flex items-start">
              <div className={`w-8 h-8 rounded-full ${item.bgColor} flex items-center justify-center ${item.iconColor} mr-3 mt-1`}>
                <FontAwesomeIcon icon={item.icon} />
              </div>
              <div>
                <p className="text-sm font-medium dark:text-white">{item.title}</p>
                <p className="text-xs text-gray-500 dark:text-gray-300">{item.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SecurityContent;