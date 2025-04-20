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
  const bgClass = isVirtual ? 'bg-purple-600' : 'gradient-bg';
  const chipClass = isVirtual ? 'bg-purple-400' : 'card-chip';

  return (
    <div className="bg-white dark:bg-dark-700 rounded-xl shadow-lg overflow-hidden transition-transform duration-300 hover:shadow-xl">
      <div className={`${bgClass} p-6 text-white`}>
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm opacity-80">{isVirtual ? 'Cartão Virtual' : 'Cartão Principal'}</p>
            <h3 className="text-xl font-semibold">{card.brand}</h3>
          </div>
          <div className="flex space-x-2">
            <button className="p-2 bg-purple-400 bg-opacity-20 rounded-full">
              <FontAwesomeIcon icon={faEllipsisV} />
            </button>
          </div>
        </div>
        <div className="mt-6 flex items-center">
          <div className={`${chipClass} w-12 h-8 rounded-md mr-4 flex items-center justify-center`}>
            {isVirtual && <FontAwesomeIcon icon={faSyncAlt} />}
          </div>
          <div className="text-sm">
            <p>{card.number}</p>
          </div>
        </div>
        <div className="mt-6 flex justify-between items-center">
          <div>
            <p className="text-xs opacity-80">Titular</p>
            <p className="text-sm">{card.holder}</p>
          </div>
          <div>
            <p className="text-xs opacity-80">Expira em</p>
            <p className="text-sm">{card.expiry}</p>
          </div>
          <div>
            <p className="text-xs opacity-80">CVV</p>
            <p className="text-sm">{card.cvv}</p>
          </div>
        </div>
      </div>
      <div className="p-4 border-t border-gray-100 dark:border-dark-600">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-300">Limite disponível</p>
            <p className="font-semibold dark:text-white">{card.availableLimit}</p>
          </div>
          <div className="flex space-x-2">
            {isVirtual ? (
              <>
                <button
                  onClick={onShowCvv}
                  className="px-4 py-2 bg-purple-500 text-white rounded-lg text-sm flex items-center"
                >
                  <FontAwesomeIcon icon={card.cvv === '•••' ? faEye : faEyeSlash} className="mr-2" />
                  {card.cvv === '•••' ? 'Ver CVV' : 'Ocultar CVV'}
                </button>
                <button
                  onClick={onGenerateNewCard}
                  className="p-2 bg-gray-100 dark:bg-dark-600 rounded-lg"
                >
                  <FontAwesomeIcon icon={faSyncAlt} />
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={onBlockCard}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm flex items-center"
                >
                  <FontAwesomeIcon icon={card.isBlocked ? faUnlock : faLock} className="mr-2" />
                  {card.isBlocked ? 'Desbloquear' : 'Bloquear'}
                </button>
                <button className="p-2 bg-gray-100 dark:bg-dark-600 rounded-lg">
                  <FontAwesomeIcon icon={faQrcode} />
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