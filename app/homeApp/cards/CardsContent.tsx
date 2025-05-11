import React, { useEffect, useState } from 'react';
import { CardDashboard } from '~/components/CardDashboard'
import CardManagementTabs from '~/components/CardManagementTabs'
import RequestCardModal from '~/components/RequestCardModal'
import SuccessNotification from '~/components/SuccessNotifications'
import { useAccountStore } from '~/context/accountStore'
import { useCreditCardStore } from '~/context/creditCardStore'

const CardsContent: React.FC = () => {
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [successNotification, setSuccessNotification] = useState({isOpen: false,message: ''});
  const { requestCreditCard, creditCards, loading, getCreditCardsById } = useCreditCardStore()
  const requestNewCard = () => requestCreditCard(user?.accountId)
  const { user } = useAccountStore()

  useEffect(() => {
    if(creditCards.length === 0 && user?.accountId) {
      getCreditCardsById(user?.accountId)
    }
  }, [creditCards.length])

  const handleShowCvv = (cardId: string) => {
    // setCards((prev) =>
    //   prev.map((card) =>
    //     card.id === cardId
    //       ? { ...card, cvv: card.cvv === '•••' ? '123' : '•••' }
    //       : card
    //   )
    // );
  };

  const handleGenerateNewCard = () => {
    setSuccessNotification({
      isOpen: true,
      message: 'Um novo cartão virtual foi gerado com sucesso!',
    });
  };

  const handleRequestNewCard = () => {
    setIsRequestModalOpen(true);
  };

  const handleAdjustLimit = () => {
    // Implement adjust limit modal logic here
    setSuccessNotification({
      isOpen: true,
      message: 'Seu pedido de ajuste de limite foi enviado para análise.',
    });
  };

  const handleBlockCard = (accountId: string) => {
    // Implement adjust limit modal logic here
    setSuccessNotification({
      isOpen: true,
      message: 'Seu pedido de ajuste de limite foi enviado para análise.',
    });
  };

  const handleTempBlock = () => {
    setSuccessNotification({
      isOpen: true,
      message: 'Bloqueio temporário ativado. Seu cartão ficará bloqueado por 24 horas.',
    });
  };

  return (
    <div>
      <CardDashboard
        cards={creditCards}
        loading={loading}
        onBlockCard={() => handleBlockCard(creditCards[0].id)}
        onShowCvv={() => handleShowCvv(creditCards[1].id)}
        onGenerateNewCard={handleGenerateNewCard}
        onRequestNewCard={requestNewCard}
      />
      <CardManagementTabs
        onAdjustLimit={handleAdjustLimit}
        onTempBlock={handleTempBlock}
      />
      <RequestCardModal
        isOpen={isRequestModalOpen}
        onClose={() => setIsRequestModalOpen(false)}
        onConfirm={() => {
          setIsRequestModalOpen(false);
          setSuccessNotification({
            isOpen: true,
            message: 'Seu cartão foi solicitado com sucesso!',
          });
        }}
      />
      <SuccessNotification
        isOpen={successNotification.isOpen}
        message={successNotification.message}
        onClose={() =>
          setSuccessNotification({ isOpen: false, message: '' })
        }
      />
    </div>
  );
};

export default CardsContent;