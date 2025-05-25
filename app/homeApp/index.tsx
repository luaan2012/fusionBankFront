import { faBars } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router'
import { AccountSummary } from '~/components/Contents/AccountSummary'
import { InvestmentsDisplay } from '~/components/Contents/InvestmentsDisplay'
import { Sidebar } from '~/components/Sidebars/Sidebar'
import { useToast } from '~/components/Toasts/ToastContext'
import { useAccountStore } from '~/context/accountStore'
import { useAppStore } from '~/context/appStore'
import { useCreditCardStore } from '~/context/creditCardStore'
import { useEventStore } from '~/context/eventStore'
import { useInvestmentStore } from '~/context/investmentStore'
import { Connector } from '~/services/signalRService'
import { NotificationType, type EventMessage } from '~/types/notification'
import { RecentTransactionsFull } from './fullExtract'
import { Transference } from './transference/Transference'
import { CreditCard } from './creditCard/CreditCard'
import { Transaction } from './transaction/Transaction'
import { Configuration } from './configuration/Configuration'
import './css/app.css'
import { NotificationCenter } from '~/components/Contents/NotificationCenter'
import { QuickActions } from '~/components/Contents/QuickActions'
import { RecentTransactions } from '~/components/Contents/RecentTransactions'
import Footer from '~/components/Footers/Footer'
import { Header } from '~/components/Headers/Header'
import { PinRegistrationModal } from '~/components/Modals/PinRegistrationModal'
import { SessionTimer } from '~/components/Session/SessionTimer'
import { Notification } from '~/components/Toasts/Notification'
import { InvestmentContent } from './investments/InvestmentsContent'

export function Index() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [isOpenModalPasswordTransaction, setIsOpenModalPasswordTransaction] = useState<boolean>(false);
  const [isNotificationCenterOpen, setIsNotificationCenterOpen] = useState<boolean>(false);
  const { view } = useAppStore();
  const { getEventTransactions, listEvents, updateEvents, lastTransactions, events, loadingTransactions, isAlready: isAlreadyEvent, markAsRead, markAllAsRead, deleteAllById } = useEventStore();
  const { investment, loadingInvestment, listInvestmentsUser, isAlreadyInvestments } = useInvestmentStore();
  const { setDarkMode, user, loading: accountLoading, updateUser, registerPasswordTransaction, checkToken, clickedLogout} = useAccountStore();
  const { getCreditCardsById, creditCard } = useCreditCardStore();
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const { openToast } = useToast();
  const navigate = useNavigate()

  const connectorRef = useRef<Connector | null>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [view])


  useEffect(() => {
  if (!user?.accountId) return;

  const fetchData = async () => {
    try {
      const promises = [];

      if (lastTransactions.length === 0 && !isAlreadyEvent) {
        promises.push(getEventTransactions(user.accountId, 0));
      }

      if (investment.length === 0 && !isAlreadyInvestments) {
        promises.push(listInvestmentsUser(user.accountId, 0));
      }

      if (!creditCard) {
        promises.push(getCreditCardsById(user.accountId));
      }

      if (events.length === 0) {
        promises.push(listEvents(user.accountId, 20));
      }

      await Promise.all(promises);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    }
  };

  fetchData();
}, [user?.accountId]);

  useEffect(() => {
  let isMounted = true;

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

      if (!isMounted) return;

      connectorRef.current?.onReceiveNotification((message: EventMessage) => {
        updateEvents(message as any);
        if (message.title) {
          setToastMessage(message.title);
        }

        if (message.action === NotificationType.CREDITCARD_RESPONSED) {
          getCreditCardsById(user.accountId).catch();
        }

        if ([NotificationType.TRANSFER_RECEIVE, NotificationType.DEPOSIT_DIRECT_MADE].includes(message.action)) {
          updateUser().catch();
        }
      });

      connectorRef.current?.onReconnected((userId) => {
        console.log(`Usuário ${userId} reingressou no grupo após reconexão.`);
      });

      connectorRef.current?.onReconnectionFailed(() => {
        console.error('Falha na reconexão. Tente fazer login novamente.');
      });
    } catch (err) {
      if (isMounted) {
        console.error('Erro ao configurar SignalR:', err);
      }
    }
  };

  startConnection();

  return () => {
    isMounted = false;
    connectorRef.current?.stopConnection();
    connectorRef.current = null;
  };
}, [user?.accountId]);

  useEffect(() => {
    if (toastMessage) {
      const timeout = setTimeout(() => {
        setToastMessage(null);
      }, 5000);
      return () => clearTimeout(timeout);
    }
  }, [toastMessage]);

  useEffect(() => {
    const checkTokenAsync = async () => {
      const isValid = await checkToken();

      if (!isValid && !clickedLogout) {
        openToast({
          message: 'Sessão expirada, entre novamente.',
          type: 'error',
          position: 'top-right',
          duration: 5000,
        });
        navigate('/');
        return;
      }
    }

    if (user?.darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }

    if (user && (!user?.passwordTransaction || user?.passwordTransaction.length !== 4)) {
      setIsOpenModalPasswordTransaction(true);
    }

    checkTokenAsync()
  }, [user]);

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
                <RecentTransactions lastTransactions={lastTransactions.slice(3)} loading={loadingTransactions} />
                <InvestmentsDisplay investments={investment} loading={loadingInvestment} />
              </>
            ) : view === 'transfer' ? (
              <Transference />
            ) : view === 'cards' ? (
              <CreditCard />
            ) : view === 'investments' ? (
              <InvestmentContent />
            ) : view === 'deposit' ? (
              <Transaction />
            ) : view === 'accountEdit' ? (
              <Configuration />
            ) : (
              <RecentTransactionsFull transactions={lastTransactions} loading={loadingTransactions} />
            )}
          </div>
        </div>
      </main>
      <Footer />
      <Notification key={toastMessage} message={toastMessage} />
      <PinRegistrationModal show={isOpenModalPasswordTransaction} onConfirm={handleRegisterModalPasswordTransaction} />
      <SessionTimer />
    </div>
  );
}