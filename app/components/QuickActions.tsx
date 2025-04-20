import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBarcode, faCreditCard, faChartLine, faQrcode } from '@fortawesome/free-solid-svg-icons';

interface Action {
  icon: any; // Use specific icon type if needed
  color: string;
  bg: string;
  label: string;
}

const QuickActions: React.FC = () => {
  const actions: Action[] = [
    { icon: faQrcode, color: 'text-blue-500', bg: 'bg-blue-100', label: 'PIX' }, // Using faQrcode as a placeholder for fa-pix
    { icon: faBarcode, color: 'text-green-500', bg: 'bg-green-100', label: 'Boletos' },
    { icon: faCreditCard, color: 'text-purple-500', bg: 'bg-purple-100', label: 'Cartões' },
    { icon: faChartLine, color: 'text-yellow-500', bg: 'bg-yellow-100', label: 'Investir' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      {actions.map((action, index) => (
        <a
          key={index}
          href="#"
          className="bg-white dark:bg-dark-secondary rounded-lg shadow p-4 text-center hover:shadow-md smooth-transition card-hover"
        >
          <div
            className={`w-12 h-12 ${action.bg} dark:bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-2`}
          >
            <FontAwesomeIcon
              icon={action.icon}
              className={`${action.color} dark:${action.color.replace('500', '300')} text-xl`}
            />
          </div>
          <span className="text-gray-700 dark:text-gray-300 font-medium">{action.label}</span>
        </a>
      ))}
    </div>
  );
};

export default QuickActions;