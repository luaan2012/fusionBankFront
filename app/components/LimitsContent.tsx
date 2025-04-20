import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlane, faShoppingCart, faGamepad } from '@fortawesome/free-solid-svg-icons';

interface LimitsContentProps {
  onAdjustLimit: () => void;
}

const LimitsContent: React.FC<LimitsContentProps> = ({ onAdjustLimit }) => {
  const categories = [
    {
      icon: faPlane,
      name: 'Viagens',
      limit: 'R$ 1.000,00',
      iconColor: 'text-red-500 dark:text-red-300',
      bgColor: 'bg-red-100 dark:bg-red-900',
    },
    {
      icon: faShoppingCart,
      name: 'Compras online',
      limit: 'R$ 800,00',
      iconColor: 'text-green-500 dark:text-green-300',
      bgColor: 'bg-green-100 dark:bg-green-900',
    },
    {
      icon: faGamepad,
      name: 'Entretenimento',
      limit: 'R$ 500,00',
      iconColor: 'text-purple-500 dark:text-purple-300',
      bgColor: 'bg-purple-100 dark:bg-purple-900',
    },
  ];

  return (
    <div>
      <h3 className="text-lg font-semibold mb-6 dark:text-white">Gerenciamento de Limites</h3>
      <div className="bg-white dark:bg-dark-600 rounded-lg shadow p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-300">Limite total</p>
            <p className="font-semibold text-xl dark:text-white">R$ 5.000,00</p>
          </div>
          <button
            onClick={onAdjustLimit}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm"
          >
            Ajustar limite
          </button>
        </div>
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-500 dark:text-gray-300 mb-1">
            <span>Utilizado</span>
            <span>25%</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-dark-500 rounded-full h-2.5">
            <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: '25%' }}></div>
          </div>
        </div>
        <div className="space-y-4">
          {categories.map((cat, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center">
                <div className={`w-8 h-8 rounded-full ${cat.bgColor} flex items-center justify-center ${cat.iconColor} mr-3`}>
                  <FontAwesomeIcon icon={cat.icon} />
                </div>
                <div>
                  <p className="text-sm font-medium dark:text-white">{cat.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-300">Limite: {cat.limit}</p>
                </div>
              </div>
              <button className="text-blue-500 text-sm font-medium">Editar</button>
            </div>
          ))}
        </div>
      </div>
      <div className="bg-white dark:bg-dark-600 rounded-lg shadow p-6">
        <h4 className="font-medium mb-4 dark:text-white">Alertas de gastos</h4>
        <div className="space-y-4">
          {/* Add toggle switches here as per the HTML */}
        </div>
      </div>
    </div>
  );
};

export default LimitsContent;