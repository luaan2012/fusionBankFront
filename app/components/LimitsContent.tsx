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
      iconColor: 'text-red-600 dark:text-red-400',
      bgColor: 'bg-red-100 dark:bg-red-900',
    },
    {
      icon: faShoppingCart,
      name: 'Compras online',
      limit: 'R$ 800,00',
      iconColor: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-100 dark:bg-green-900',
    },
    {
      icon: faGamepad,
      name: 'Entretenimento',
      limit: 'R$ 500,00',
      iconColor: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-100 dark:bg-purple-900',
    },
  ];

  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6">
        Gerenciamento de Limites
      </h3>
      <div className="bg-white dark:bg-slate-950 rounded-xl shadow-md p-6 mb-6 transition-all duration-200">
        <div className="flex justify-between items-center mb-4">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Limite total</p>
            <p className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              R$ 5.000,00
            </p>
          </div>
          <button
            onClick={onAdjustLimit}
            className="px-4 py-2 bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 text-white rounded-lg text-sm font-semibold transition-all duration-200 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            aria-label="Ajustar limite total"
          >
            Ajustar limite
          </button>
        </div>
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mb-1">
            <span>Utilizado</span>
            <span>25%</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
            <div
              className="bg-blue-600 dark:bg-blue-500 h-2.5 rounded-full"
              style={{ width: '25%' }}
            ></div>
          </div>
        </div>
        <div className="space-y-4">
          {categories.map((cat, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full ${cat.bgColor} flex items-center justify-center ${cat.iconColor} mr-3`}
                >
                  <FontAwesomeIcon icon={cat.icon} className="text-xl" />
                </div>
                <div>
                  <p className="text-base font-semibold text-gray-900 dark:text-gray-100">
                    {cat.name}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Limite: {cat.limit}</p>
                </div>
              </div>
              <button
                className="text-blue-600 dark:text-blue-400 text-sm font-semibold hover:text-blue-700 dark:hover:text-blue-300 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                aria-label={`Editar limite de ${cat.name}`}
              >
                Editar
              </button>
            </div>
          ))}
        </div>
      </div>
      <div className="bg-white dark:bg-slate-950 rounded-xl shadow-md p-6 transition-all duration-200">
        <h4 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Alertas de gastos
        </h4>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Configure alertas para monitorar seus gastos (em desenvolvimento).
        </p>
      </div>
    </div>
  );
};

export default LimitsContent;