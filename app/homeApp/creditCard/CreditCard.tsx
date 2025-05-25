import { useEffect, useState } from 'react';
import { CardDashboard } from '~/components/Cards/CardDashboard'
import { RequestCardModal } from '~/components/Modals/RequestCardModal'
import { CardManagementTabs } from '~/components/Tabs/CardManagementTabs'
import { useToast } from '~/components/Toasts/ToastContext'
import { useAccountStore } from '~/context/accountStore'
import { useCreditCardStore } from '~/context/creditCardStore'

export const CreditCard = () => {
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const { requestCreditCard, creditCard, loading, getCreditCardsById, 
    requestVirtualCreditCard, creditCardToggleBlocked, virtualCreditCardDelete } = useCreditCardStore()
  const { user } = useAccountStore()
  const { openToast } = useToast()
  const showToast = (
    type: 'success' | 'error',
    message: string,
    position: 'top-right' = 'top-right',
    duration: number = 3000
  ) => {
    openToast({ type, message, position, duration });
  };

const handleConfirm = async (cardType: 'virtual' | 'credit' | 'debit', limit: number) => {
  setIsRequestModalOpen(false);

  if (cardType === 'virtual' && !creditCard) {
    showToast('error', 'Para solicitar um cartão virtual, você precisa de um cartão de crédito físico');
    return;
  }

  if (cardType === 'virtual') {
    const success = await requestVirtualCreditCard(creditCard.id);
    const errorMessage = useCreditCardStore.getState()?.error?.message;

    showToast(
      success ? 'success' : 'error',
      success ? 'Solicitação de cartão virtual concluída.' : errorMessage
    );
    return;
  }

  if (cardType === 'debit') {
    showToast('success', 'Solicitação de cartão de débito realizada com sucesso');
    return;
  }

  const success = await requestCreditCard(user?.accountId, limit);
  const errorMessage = useCreditCardStore.getState()?.error?.message;

  showToast(
    success ? 'success' : 'error',
    success ? 'Solicitação de cartão enviada.' : errorMessage
  );
};

  useEffect(() => {
    if(!creditCard && user?.accountId) {
      getCreditCardsById(user?.accountId)
    }
  }, [creditCard])

  const handleGenerateNewCard = () => {
  };

  const handleRequestNewCard = () => {
    setIsRequestModalOpen(true);
  };

  const handleAdjustLimit = () => {

  };

  const handleBlockCard = async (accountId: string, isBlocked: boolean) => {
    const success = await creditCardToggleBlocked(accountId, isBlocked)
    if(!success) {
      openToast({
        type: 'error',
        message: 'Erro ao bloquear cartao',
        position: 'top-right',
        duration: 3000
        })
        return;
    }

    openToast({
      type: 'success',
      message: 'Cartao bloqueado.',
      position: 'top-right',
      duration: 3000
      })
  };

  const handleOnDelete = async (id: string) => {
    const success = await virtualCreditCardDelete(id)
    if(!success) {
      openToast({
        type: 'error',
        message: 'Erro ao excluir cartao',
        position: 'top-right',
        duration: 3000
        })
        return;
    }

    openToast({
      type: 'success',
      message: 'Cartao excluido.',
      position: 'top-right',
      duration: 3000
      })
  };

  const handleTempBlock = () => {
  };

  return (
    <div>
      <CardDashboard
        card={creditCard}
        loading={loading}
        onBlockCard={handleBlockCard}
        onDelete={handleOnDelete}
        onRequestNewCard={handleRequestNewCard}
      />
      <CardManagementTabs
        card={creditCard}
        onAdjustLimit={handleAdjustLimit}
        onTempBlock={handleTempBlock}
      />
      <RequestCardModal
        isOpen={isRequestModalOpen}
        onClose={() => setIsRequestModalOpen(false)}
        onConfirm={handleConfirm}
      />
    </div>
  );
};
