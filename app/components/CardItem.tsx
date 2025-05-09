import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisV, faLock, faUnlock, faQrcode, faEye, faEyeSlash, faSyncAlt } from '@fortawesome/free-solid-svg-icons';
import type { Card } from '../../types';

interface CardItemProps {
  card: Card;
  onBlockCard: () => void;
  onShowCvv: () => void;
  onGenerateNewCard: () => void;
}

const CardItem: React.FC<CardItemProps> = ({ card, onBlockCard, onShowCvv, onGenerateNewCard }) => {
  const isVirtual = card.type === 'virtual';
  const bgClass = isVirtual ? 'bg-purple-600 dark:bg-purple-500' : 'bg-blue-600 dark:bg-blue-500';

  return (
    <div className="bg-white dark:bg-slate-950 rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">
      <div className={`${bgClass} p-6 text-white`}>
        <div className="flex justify-between items-start mb-4">
          <div>
            <p className="text-sm font-medium opacity-90">
              {isVirtual ? 'Cartão Virtual' : 'Cartão Principal'}
            </p>
            <h3 className="text-base font-semibold">{card.brand}</h3>
          </div>
          <button
            className="p-2 bg-white bg-opacity-20 rounded-full hover:bg-opacity-30 transition-all duration-200"
            aria-label="Mais opções"
          >
            <FontAwesomeIcon icon={faEllipsisV} className="text-white" />
          </button>
        </div>
        <div className="mt-4 flex items-center">
          <div
            className={`w-12 h-8 rounded-md mr-4 flex items-center justify-center ${
              isVirtual ? 'bg-purple-400 dark:bg-purple-300' : 'bg-gradient-to-r from-yellow-400 to-yellow-600'
            }`}
          >
            {isVirtual && <FontAwesomeIcon icon={faSyncAlt} className="text-white text-sm" />}
          </div>
          <div className="text-sm font-mono">
            <p>{card.number}</p>
          </div>
        </div>
        <div className="mt-6 flex justify-between items-center text-sm">
          <div>
            <p className="text-xs opacity-80">Titular</p>
            <p className="font-medium">{card.holder}</p>
          </div>
          <div>
            <p className="text-xs opacity-80">Expira em</p>
            <p className="font-medium">{card.expiry}</p>
          </div>
          <div>
            <p className="text-xs opacity-80">CVV</p>
            <p className="font-medium">{card.cvv}</p>
          </div>
        </div>
      </div>
      <div className="p-5 border-t border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Limite disponível</p>
            <p className="text-base font-semibold text-gray-900 dark:text-gray-100">
              {card.availableLimit}
            </p>
          </div>
          <div className="flex space-x-3">
            {isVirtual ? (
              <>
                <button
                  onClick={onShowCvv}
                  className="px-4 py-2 bg-purple-600 dark:bg-purple-500 hover:bg-purple-700 dark:hover:bg-purple-600 text-white rounded-lg text-sm font-medium flex items-center transition-all duration-200 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
                  aria-label={card.cvv === '•••' ? 'Mostrar CVV' : 'Ocultar CVV'}
                >
                  <FontAwesomeIcon
                    icon={card.cvv === '•••' ? faEye : faEyeSlash}
                    className="mr-2"
                  />
                  {card.cvv === '•••' ? 'Ver CVV' : 'Ocultar CVV'}
                </button>
                <button
                  onClick={onGenerateNewCard}
                  className="p-2.5 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
                  aria-label="Gerar novo cartão virtual"
                >
                  <FontAwesomeIcon icon={faSyncAlt} className="text-gray-600 dark:text-gray-300" />
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={onBlockCard}
                  className="px-4 py-2 bg-red-600 dark:bg-red-500 hover:bg-red-700 dark:hover:bg-red-600 text-white rounded-lg text-sm font-medium flex items-center transition-all duration-200 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                  aria-label={card.isBlocked ? 'Desbloquear cartão' : 'Bloquear cartão'}
                >
                  <FontAwesomeIcon
                    icon={card.isBlocked ? faUnlock : faLock}
                    className="mr-2"
                  />
                  {card.isBlocked ? 'Desbloquear' : 'Bloquear'}
                </button>
                <button
                  className="p-2.5 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
                  aria-label="Ver QR Code"
                >
                  <FontAwesomeIcon icon={faQrcode} className="text-gray-600 dark:text-gray-300" />
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardItem;