import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { type IconProp } from '@fortawesome/fontawesome-svg-core';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';

interface TransferCardProps {
  type: 'pix' | 'ted' | 'doc';
  icon: IconProp;
  color: string;
  bg: string;
  title: string;
  description: string;
  features: string[];
  isActive: boolean;
  onSelect: () => void;
}

const TransferCard: React.FC<TransferCardProps> = ({
  type,
  icon,
  color,
  bg,
  title,
  description,
  features,
  isActive,
  onSelect,
}) => {
  return (
    <div
      onClick={onSelect}
      className={`transfer-card bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-lg p-4 cursor-pointer shadow-sm hover:border-${
        type === 'pix' ? 'primary' : type === 'ted' ? 'blue' : 'purple'
      }-300 dark:hover:border-${
        type === 'pix' ? 'primary' : type === 'ted' ? 'blue' : 'purple'
      }-500 ${
        isActive
          ? `border-${
              type === 'pix' ? 'primary' : type === 'ted' ? 'blue' : 'purple'
            }-300 dark:border-${
              type === 'pix' ? 'primary' : type === 'ted' ? 'blue' : 'purple'
            }-500`
          : ''
      }`}
    >
      <div className="flex items-center mb-3">
        <div className={`h-10 w-10 rounded-full ${bg} flex items-center justify-center mr-3`}>
          <FontAwesomeIcon icon={icon} className={color} />
        </div>
        <h3 className="font-medium text-gray-800 dark:text-white">{title}</h3>
      </div>
      <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">{description}</p>
      <ul className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center">
            <FontAwesomeIcon icon={faCheckCircle} className="text-green-500 mr-2" />
            {feature}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TransferCard;