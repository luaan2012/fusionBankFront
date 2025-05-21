import { useState, useEffect, useRef } from 'react';
import Header from '../components/Header';
import NotificationCenter from '../components/NotificationCenter';
import QuickActions from '../components/QuickActions';
import Footer from '../components/Footer';
import CardsContent from './cards/CardsContent';
import InvestmentsContent from './investments/InvestmentsContent';
import { useAccountStore } from '~/context/accountStore';
import { useEventStore } from '~/context/eventStore';
import { RecentTransactions } from '~/components/RecentTransactions';
import { InvestmentsDisplay } from '~/components/InvestmentsDisplay';
import { TransferContent } from './transfer/Transfer';
import { useAppStore } from '~/context/appStore';
import { Sidebar } from '~/components/Sidebar';
import type { EventMessage } from '~/models/eventMessage';
import Notification from '~/components/Notification';
import { useCreditCardStore } from '~/context/creditCardStore';
import { DepositBillets } from './depositBillets/DepositBillets';
import { AccountEditPage } from './config/AccountEdit';
import { PinRegistrationModal } from '~/components/PinRegistrationModal';
import { AccountSummary } from '~/components/AccountSummary';
import { useToast } from '~/components/ToastContext';
import { useNavigate } from 'react-router';
import { Connector } from '~/services/signalR';
import { useInvestmentStore } from '~/context/investmentStore';
import { faBars } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export function Index() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [isOpenModalPasswordTransaction, setIsOpenModalPasswordTransaction] = useState<boolean>(false);
  const [isNotificationCenterOpen, setIsNotificationCenterOpen] = useState<boolean>(false);
  const { view } = useAppStore();
  const { getEventTransactions, listEvents, updateEvents, lastTransactions, events, loading: eventLoading, isAlready: isAlreadyEvent, markAsRead, markAllAsRead, deleteAllById } = useEventStore();
  const { investment, loadingInvestment, listInvestmentsUser, isAlreadyInvestments } = useInvestmentStore();
  const { setDarkMode, user, loading: accountLoading, updateUser, registerPasswordTransaction, tokenExpiry, checkToken } = useAccountStore();
  const { getCreditCardsById, creditCard } = useCreditCardStore();
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const { openToast } = useToast();
  const navigate = useNavigate();

  const connectorRef = useRef<Connector | null>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [view])

  useEffect(() => {
    if (!user?.accountId) {
      connectorRef.current?.stopConnection();
      connectorRef.current = null;
      return;
    }

    if (!connectorRef.current) {
      connectorRef.current = new Connector();
    }

    const startConnection = async () => {
      try {
        await connectorRef.current?.startConnection();
        await connectorRef.current?.joinGroup(user.accountId);

        connectorRef.current?.onReceiveNotification((message) => {
          console.log('Notificação recebida:', message);
          updateEvents(message as any);
          if (message.title) {
            setToastMessage(message.title);
          }

          if (message.action === 'CREDITCARD_RESPONDED') {
            getCreditCardsById(user.accountId);
          }

          if (message.action === 'DEPOSIT_DIRECT_MADE') {
            updateUser();
          }
        });

        connectorRef.current?.onReconnected((userId) => {
          console.log(`Usuário ${userId} reingressou no grupo após reconexão.`);
        });

        connectorRef.current?.onReconnectionFailed(() => {
          console.error('Falha na reconexão. Tente fazer login novamente.');
        });
      } catch (err) {
        console.error('Erro ao configurar SignalR:', err);
      }
    };

    startConnection();

    return () => {
      connectorRef.current?.stopConnection();
      connectorRef.current = null;
    };
  }, [user?.accountId]);

  useEffect(() => {
    const validateToken = async () => {
      const isValid = await checkToken();
      if (!isValid && !useAccountStore.getState().clickedLogout) {
        openToast({
          message: 'Sessão expirada, entre novamente.',
          type: 'error',
          position: 'top-right',
          duration: 5000,
        });
        navigate('/');
      }
    };

    validateToken();
  }, [tokenExpiry]);

  useEffect(() => {
    if (toastMessage) {
      const timeout = setTimeout(() => {
        setToastMessage(null);
      }, 5000);
      return () => clearTimeout(timeout);
    }
  }, [toastMessage]);

  useEffect(() => {
    if (user?.darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [user?.darkMode]);

  useEffect(() => {
    if (events.length === 0 && user) {
      listEvents(user.accountId, 20);
    }

    if (user === null) return;
    if (!user.passwordTransaction || user.passwordTransaction.length !== 4) {
      setIsOpenModalPasswordTransaction(true);
    }
  }, [user]);

  useEffect(() => {
    if (lastTransactions.length === 0 && user?.accountId && !isAlreadyEvent) {
      getEventTransactions(user.accountId, 3);
    }

    if (investment.length === 0 && user?.accountId && !isAlreadyInvestments) {
      listInvestmentsUser(user.accountId, 0);
    }

    if (!creditCard && user?.accountId) {
      getCreditCardsById(user.accountId);
    }
  }, [user?.accountId]);

  const toggleDarkMode = () => {
    setDarkMode(!user?.darkMode);
  };

  const handleRegisterModalPasswordTransaction = (passwordTransaction: string) => {
    const response = registerPasswordTransaction(passwordTransaction);
    if (response) setIsOpenModalPasswordTransaction(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  const toggleNotificationCenter = () => {
    setIsNotificationCenterOpen((prev) => !prev);
  };

  const handleDeleteAllById = () => {
    deleteAllById(user?.accountId);
  };

  return (
    <div className="bg-gray-50 dark:bg-dark-primary smooth-transition">
      <NotificationCenter
        isOpen={isNotificationCenterOpen}
        notifications={events}
        toggleNotificationCenter={toggleNotificationCenter}
        markAsRead={markAsRead}
        deleteAllById={handleDeleteAllById}
        markAllAsRead={markAllAsRead}
      />
      <Header
        user={user}
        toggleMobileMenu={toggleMobileMenu}
        toggleDarkMode={toggleDarkMode}
        toggleNotificationCenter={toggleNotificationCenter}
        notificationCount={events?.filter((event) => !event.read)?.length}
        isDarkMode={user?.darkMode || false}
        isNotificationCenterOpen={isNotificationCenterOpen}
      />
      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 bg-white dark:bg-slate-950 z-30 flex flex-col">
          <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
            <span className="text-xl font-semibold text-gray-900 dark:text-gray-100">DeepBank</span>
            <button
              onClick={toggleMobileMenu}
              className="text-gray-600 dark:text-gray-300 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
              aria-label="Fechar menu móvel"
            >
              <FontAwesomeIcon icon={faBars} className="text-xl" />
            </button>
          </div>
          <Sidebar
            user={user}
            view={view}
            onNavigate={() => setIsMobileMenuOpen(false)} // Close menu after navigation
          />
        </div>
      )}
      <main className="flex-grow container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar for desktop */}
          <div className="hidden md:block w-64 flex-shrink-0">
            <Sidebar user={user} view={view} />
          </div>
          <div className="flex-grow">
            {view === 'dashboard' ? (
              <>
                <QuickActions />
                <AccountSummary
                  user={user}
                  loadingUser={accountLoading}
                  investment={investment}
                  loadingCard={false}
                  loadingInvestment={loadingInvestment}
                  card={creditCard}
                />
                <RecentTransactions lastTransactions={lastTransactions} loading={eventLoading} />
                <InvestmentsDisplay investments={investment} loading={loadingInvestment} />
              </>
            ) : view === 'transfer' ? (
              <TransferContent />
            ) : view === 'cards' ? (
              <CardsContent />
            ) : view === 'investments' ? (
              <InvestmentsContent />
            ) : view === 'deposit' ? (
              <DepositBillets />
            ) : (
              <AccountEditPage />
            )}
          </div>
        </div>
      </main>
      <Footer />
      <Notification key={toastMessage} message={toastMessage} />
      <PinRegistrationModal show={isOpenModalPasswordTransaction} onConfirm={handleRegisterModalPasswordTransaction} />
    </div>
  );
}