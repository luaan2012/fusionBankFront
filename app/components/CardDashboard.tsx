import React from 'react';
import CardItem from './CardItem';
import NewCardOption from './NewCardOption';
import type { Card } from '../../types'

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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
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
  );
};

export default CardDashboard;