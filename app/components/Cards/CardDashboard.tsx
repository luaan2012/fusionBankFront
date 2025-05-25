import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { CardItem } from './CardItem'
import type { CreditCard } from '~/types/creditCard'
import { CardCreditCard } from './CardCreditCard'

interface CardDashboardProps {
  card: CreditCard | null; 
  loading: boolean;
  onBlockCard: (accountId: string, isBlocked: boolean) => void;
  onDelete: (id: string) => void;
  onRequestNewCard: () => void;
}

export const CardDashboard = ({
  card,
  onBlockCard,
  onRequestNewCard,
  onDelete,
  loading,
}: CardDashboardProps) => {
  return (
    <div className="bg-white dark:bg-slate-950 rounded-xl shadow-lg p-6 mb-8 transition-all duration-300 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Meus Cartões</h2>
      {loading ? (
        <div className="flex justify-center items-center h-32">
          <FontAwesomeIcon
            icon={faSpinner}
            className="text-2xl text-gray-500 animate-spin"
            aria-label="Carregando conta"
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {card ? (
            <>
              <CardItem
                key={card.id}
                card={card}
                onBlockCard={onBlockCard}
                onDeleteCard={onDelete}
              />
              {card.virtualCreditCards?.length > 0 && (
                card.virtualCreditCards?.map((virtualCard) => (
                  <CardItem
                    key={virtualCard.id}
                    card={{
                      ...card,
                      creditCardCode: virtualCard.creditCardCode,
                      creditCardNumber: virtualCard.creditCardNumber,
                      creditCardVirtual: true
                    }}
                    onBlockCard={onBlockCard}
                    onDeleteCard={onDelete}
                  />
                ))
              )} 
            </>
          ) : (
            <p className="text-gray-500 dark:text-gray-400 col-span-full">
              Nenhum cartão disponível.
            </p>
          )}
          <CardCreditCard onRequestNewCard={onRequestNewCard} />
        </div>
      )}
    </div>
  );
}