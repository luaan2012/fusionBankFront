import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { faArrowDown, faArrowUp } from '@fortawesome/free-solid-svg-icons';

interface Performance {
  value: string;
  trend: 'up' | 'down';
  period: string;
}

interface SummaryCardProps {
  title: string;
  icon: IconDefinition;
  value: string;
  performance: Performance;
}

const SummaryCard: React.FC<SummaryCardProps> = ({ title, icon, value, performance }) => (
  <div
    className="bg-white dark:bg-slate-950 rounded-xl shadow-md p-6 transition-all duration-300 hover:shadow-lg bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800"
    aria-label={`${title} summary`}
  >
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-base font-semibold text-gray-500 dark:text-gray-400">{title}</h3>
      <FontAwesomeIcon
        icon={icon}
        className={`text-2xl ${title === 'Melhor Ativo' ? 'text-yellow-600 dark:text-yellow-400' : 'text-gray-400 dark:text-gray-500'}`}
      />
    </div>
    <p
      className={`text-${title === 'Melhor Ativo' ? 'xl' : '2xl'} font-bold ${
        performance.trend === 'up' ? 'text-gray-900 dark:text-gray-100' : 'text-red-500 dark:text-red-400'
      }`}
    >
      {value}
    </p>
    <div className="mt-2 flex items-center">
      <span
        className={`text-sm font-medium ${
          performance.trend === 'up' ? 'text-green-500 dark:text-green-400' : 'text-red-500 dark:text-red-400'
        }`}
      >
        <FontAwesomeIcon
          icon={performance.trend === 'up' ? faArrowUp : faArrowDown}
          className="mr-1"
        />
        {performance.value}
      </span>
      <span className="text-gray-500 dark:text-gray-400 text-sm ml-2">{performance.period}</span>
    </div>
  </div>
);

export default SummaryCard;