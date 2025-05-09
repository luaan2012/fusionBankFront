import React from 'react';
import CardItem from './CardItem';
import NewCardOption from './NewCardOption';
import type { Card } from '../../types';

interface CardDashboardProps {
  cards: Card[];
  onBlockCard: () => void;
  onShowCvv: () => void;
  onGenerateNewCard: () => void;
  onRequestNewCard: () => void;
}

const CardDashboard: React.FC<CardDashboardProps> = ({
  cards,
  onBlockCard,
  onShowCvv,
  onGenerateNewCard,
  onRequestNewCard,
}) => {
  return (
    <div className="bg-white dark:bg-slate-950 rounded-xl shadow-lg p-6 mb-8 transition-all duration-300 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Meus Cartões</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card) => (
          <CardItem
            key={card.id}
            card={card}
            onBlockCard={onBlockCard}
            onShowCvv={onShowCvv}
            onGenerateNewCard={onGenerateNewCard}
          />
        ))}
        <NewCardOption onRequestNewCard={onRequestNewCard} />
      </div>
    </div>
  );
};

export default CardDashboard;