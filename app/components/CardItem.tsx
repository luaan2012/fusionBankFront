import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faLock,
  faUnlock,
  faEye,
  faEyeSlash,
  faTrash,
  faCreditCard,
} from '@fortawesome/free-solid-svg-icons';
import {
  faCcVisa,
  faCcMastercard,
  faCcAmex,
} from '@fortawesome/free-brands-svg-icons';
import type { CreditCard } from '~/models/creditCard';
import { formatCardNumber, formatDateBR, formatToBRL } from '~/utils/utils';

interface CardItemProps {
  card: CreditCard;
  onBlockCard: (id: string, isBlocked: boolean) => void;
  onDeleteCard: (id: string) => void // Ajustado para refletir que pode ser null
}

// Map card brands to FontAwesome icons
const brandIcons: { [key: string]: any } = {
  VISA: faCcVisa,
  MASTERCARD: faCcMastercard,
  AMERICANEXPRESS: faCcAmex,
  DISCOVER: faCreditCard,
};

export function CardItem({ card, onBlockCard, onDeleteCard }: CardItemProps) {
  const [viewCvv, setViewCvv] = useState<boolean>(false); // Inicializado como false para ocultar CVV por padrão

  const bgClass = card.creditCardVirtual
    ? 'bg-gradient-to-br from-purple-800 via-indigo-700 to-purple-600 dark:from-purple-700 dark:via-indigo-600 dark:to-purple-500'
    : 'bg-gradient-to-br from-blue-800 via-cyan-700 to-blue-600 dark:from-blue-700 dark:via-cyan-600 dark:to-blue-500';

  // Brand-specific background gradient
  const logoBgGradient = (() => {
    switch (card.creditCardType.toString()) {
      case 'INFINITE':
        return 'bg-gradient-to-br from-[#2D2D2D] to-[#D4AF37]'; // Preto metálico para dourado
      case 'BLACK':
        return 'bg-gradient-to-br from-[#0A0A0A] to-[#1F2526]'; // Preto profundo para grafite escuro
      case 'PLATINUM':
        return 'bg-gradient-to-br from-[#B0BEC5] to-[#4682B4]'; // Cinza claro para azul metálico
      case 'GOLD':
        return 'bg-gradient-to-br from-[#B8860B] to-[#FFD700]'; // Dourado escuro para amarelo ouro
      case 'STANDARD':
        return 'bg-gradient-to-br from-[#4B5EAA] to-[#8792A2]'; // Cinza azulado neutro
      default:
        return 'bg-gradient-to-br from-gray-500 to-gray-600'// Padrão genérico
    }
  })();

  // Add overlay for fallback icons
  const isFallback = ['Discover', 'Hipercard'].includes(card.creditCardFlag);
  const overlayClass = isFallback ? 'bg-gradient-to-br from-white/10 to-transparent' : '';

  // Card brand logo
  const brandLogo = (
    <div
      className="w-16 h-9 rounded-md flex items-center justify-center bg-transparent border border-white/30 shadow-brand-logo transition-all duration-300 hover:scale-105"
      aria-label={`Logotipo da bandeira ${card.creditCardType}`}
    >
      <FontAwesomeIcon
        icon={brandIcons[card.creditCardFlag?.toUpperCase()] || faCreditCard}
        className="text-white/95 text-2xl scale-110"
      />
    </div>
  );

  return (
    <div className="relative bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden transition-all duration-500 hover:shadow-card-hover hover:scale-[1.02] focus-within:ring-4 focus-within:ring-blue-500/50 max-w-sm w-full">
      {/* Inner Glow Border */}
      <div className="absolute inset-0 m-0.5 rounded-3xl bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none" />

      {/* Card Header */}
      <div className={`${logoBgGradient} p-5 text-white relative overflow-hidden shimmer`}>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.2),transparent_50%)] opacity-70" />
        <div className="absolute inset-0 backdrop-blur-sm bg-white/5" />
        <div className="relative z-10">
          <div className="flex justify-between items-start mb-3">
            <div>
              <p className="text-xs font-semibold text-white/90 tracking-wider uppercase drop-shadow-sm">
                {card.creditCardVirtual ? 'Cartão Virtual' : 'Cartão Físico'}
              </p>
              <h3 className="text-xl font-extrabold tracking-tight text-white drop-shadow-md">{card.creditCardType}</h3>
            </div>
          </div>

          {/* Card Number with Brand Logo on Left */}
          <div className="mt-3 flex items-center">
            <div className="mr-3">{brandLogo}</div>
            <div className="text-base font-mono tracking-[0.1em] text-white/95 drop-shadow-sm">
              <p>{formatCardNumber(card.creditCardNumber)}</p>
            </div>
          </div>

          {/* Card Details */}
          <div className="mt-5 grid grid-cols-3 gap-4 text-xs">
            <div>
              <p className="text-[10px] font-medium text-white/80 uppercase tracking-wide">Titular</p>
              <p className="font-semibold text-white/95">{card.creditCardName}</p>
            </div>
            <div>
              <p className="text-[10px] font-medium text-white/80 uppercase tracking-wide">Expira em</p>
              <p className="font-semibold text-white/95">{formatDateBR(card.creditCardValidity)}</p>
            </div>
            <div>
              <p className="text-[10px] font-medium text-white/80 uppercase tracking-wide">CVV</p>
              <p className="font-semibold text-white/95 min-w-[2rem] text-center">
                {viewCvv ? card.creditCardCode : '***'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Card Footer */}
      <div className="p-4 bg-gradient-to-t from-gray-100 to-gray-50 dark:from-slate-800 dark:to-slate-700 border-t border-white/10 dark:border-gray-700/50">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          {/* Available Limit */}
          <div>
            <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wide">Limite disponível</p>
            <p className="text-lg sm:text-xl font-extrabold text-gray-900 dark:text-white drop-shadow-sm">
              {formatToBRL(card.creditCardLimit)}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 w-full sm:w-auto">
            <button
              onClick={() => setViewCvv(!viewCvv)}
              className="w-full sm:w-24 px-3 py-1.5 bg-gradient-to-r from-purple-600 to-indigo-500 dark:from-purple-500 dark:to-indigo-400 text-white rounded-md text-xs font-medium flex items-center justify-center space-x-2 hover:from-purple-700 hover:to-indigo-600 transition-all duration-300 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-purple-500/50 cursor-pointer"
              aria-label={viewCvv ? 'Mostrar CVV' : 'Ocultar CVV'}
            >
              <FontAwesomeIcon icon={viewCvv ? faEye : faEyeSlash} className="w-4 h-4" />
              <span className="sm:inline">{viewCvv ? 'Ver CVV' : 'Ocultar'}</span>
            </button>

            {/* Delete or Block */}
            {card.creditCardVirtual ? (
                <button
                  onClick={() => onDeleteCard(card.id)}
                  className="w-full sm:w-24 px-3 py-1.5 bg-gradient-to-r from-red-600 to-pink-500 dark:from-red-500 dark:to-pink-400 text-white rounded-md text-xs font-medium flex items-center justify-center space-x-2 hover:from-red-700 hover:to-pink-600 transition-all duration-300 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-red-500/50"
                  aria-label="Excluir cartão virtual"
                >
                  <FontAwesomeIcon icon={faTrash} className="w-4 h-4" />
                  <span className="sm:inline">Excluir</span>
                </button>
              )
            : (
              <button
                onClick={() => onBlockCard(card.id, !card.creditCardBlocked)}
                className="w-full sm:w-24 px-3 py-1.5 bg-gradient-to-r from-red-600 to-pink-500 dark:from-red-500 dark:to-pink-400 text-white rounded-md text-xs font-medium flex items-center justify-center space-x-2 hover:from-red-700 hover:to-pink-600 transition-all duration-300 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-red-500/50"
                aria-label={card.creditCardBlocked ? 'Desbloquear cartão' : 'Bloquear cartão'}
              >
                <FontAwesomeIcon icon={card.creditCardBlocked ? faUnlock : faLock} className="w-4 h-4" />
                <span className="sm:inline">{card.creditCardBlocked ? 'Desbloquear' : 'Bloquear'}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}