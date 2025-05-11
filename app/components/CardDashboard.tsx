import React from 'react';
import CardItem from './CardItem';
import NewCardOption from './NewCardOption';
import type { CreditCard } from '~/models/creditCard'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'

interface CardDashboardProps {
  cards: CreditCard[];
  loading: boolean;
  onBlockCard: () => void;
  onShowCvv: () => void;
  onGenerateNewCard: () => void;
  onRequestNewCard: () => void;
}

export function CardDashboard ({cards, onBlockCard, onShowCvv, onGenerateNewCard, onRequestNewCard, loading
}: CardDashboardProps) {
  return (
    <div className="bg-white dark:bg-slate-950 rounded-xl shadow-lg p-6 mb-8 transition-all duration-300 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Meus Cartões</h2>
      {loading ? 
      <div className="flex justify-center items-center h-32">
        <FontAwesomeIcon icon={faSpinner} className="text-2xl text-gray-500 animate-spin" aria-label="Carregando conta" />
      </div>
      :
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.isArray(cards) && cards?.length > 0 ? (
            cards.map((card) => (
              <CardItem
                key={card.id}
                card={card}
                onBlockCard={onBlockCard}
                onShowCvv={onShowCvv}
                // onGenerateNewCard={onGenerateNewCard}
                onDeleteCard={null}
              />
            ))
          ) : (
            <p className="text-gray-500 dark:text-gray-400 col-span-full">Nenhum cartão disponível.</p>
          )}
          <NewCardOption onRequestNewCard={onRequestNewCard} />
        </div>
      }
    </div>
  );
};