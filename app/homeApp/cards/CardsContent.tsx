import React, { useState } from 'react';
import type { Card } from 'types'
import CardDashboard from '~/components/CardDashboard'
import CardManagementTabs from '~/components/CardManagementTabs'
import RequestCardModal from '~/components/RequestCardModal'
import SuccessNotification from '~/components/SuccessNotifications'

const CardsContent: React.FC = () => {
  const [cards, setCards] = useState<Card[]>([
    {
      id: 1,
      type: 'physical',
      brand: 'VISA Platinum',
      number: '•••• •••• •••• 4242',
      holder: 'João Silva',
      expiry: '09/25',
      cvv: '•••',
      availableLimit: 'R$ 4.250,00',
      isBlocked: false,
    },
    {
      id: 2,
      type: 'virtual',
      brand: 'MASTERCARD',
      number: '•••• •••• •••• 5678',
      holder: 'João Silva',
      expiry: '12/23',
      cvv: '•••',
      availableLimit: 'R$ 1.500,00',
    },
  ]);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [successNotification, setSuccessNotification] = useState({
    isOpen: false,
    message: '',
  });

  const handleBlockCard = (cardId: number) => {
    setCards((prev) =>
      prev.map((card) =>
        card.id === cardId ? { ...card, isBlocked: !card.isBlocked } : card
      )
    );
    setSuccessNotification({
      isOpen: true,
      message: `Seu cartão foi ${
        cards.find((c) => c.id === cardId)?.isBlocked ? 'desbloqueado' : 'bloqueado'
      } com sucesso.`,
    });
  };

  const handleShowCvv = (cardId: number) => {
    setCards((prev) =>
      prev.map((card) =>
        card.id === cardId
          ? { ...card, cvv: card.cvv === '•••' ? '123' : '•••' }
          : card
      )
    );
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

  const handleTempBlock = () => {
    setSuccessNotification({
      isOpen: true,
      message: 'Bloqueio temporário ativado. Seu cartão ficará bloqueado por 24 horas.',
    });
  };

  return (
    <div>
      <CardDashboard
        cards={cards}
        onBlockCard={() => handleBlockCard(cards[0].id)}
        onShowCvv={() => handleShowCvv(cards[1].id)}
        onGenerateNewCard={handleGenerateNewCard}
        onRequestNewCard={handleRequestNewCard}
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