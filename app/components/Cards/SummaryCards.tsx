import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWallet, faChartLine, faTrophy } from '@fortawesome/free-solid-svg-icons';

export const SummaryCards = () => {
  const cards = [
    {
      title: 'Total Investido',
      icon: faWallet,
      value: 'R$ 42.567,89',
      performance: '+5.2%',
      period: 'últimos 12 meses',
    },
    {
      title: 'Hoje',
      icon: faChartLine,
      value: '+ R$ 342,15',
      performance: '+0.8%',
      period: 'vs. ontem',
    },
    {
      title: 'Melhor Ativo',
      icon: faTrophy,
      value: 'PETR4',
      performance: '+12.7%',
      period: 'este mês',
      iconColor: 'text-yellow-400',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {cards.map((card, index) => (
        <div key={index} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-500 dark:text-gray-300 text-sm font-medium">{card.title}</h3>
            <FontAwesomeIcon icon={card.icon} className={`text-gray-400 ${card.iconColor || ''}`} />
          </div>
          <p className="text-2xl font-bold dark:text-white">{card.value}</p>
          <div className="mt-2 flex items-center">
            <span className="text-green-500 dark:dark-profit text-sm font-medium">
              <FontAwesomeIcon icon="arrow-up" className="mr-1" /> {card.performance}
            </span>
            <span className="text-gray-500 dark:text-gray-400 text-sm ml-2">{card.period}</span>
          </div>
        </div>
      ))}
    </div>
  );
};