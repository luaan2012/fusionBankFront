import { useState, useEffect } from 'react';
import Header from '../components/Header';
import NotificationCenter from '../components/NotificationCenter';
import QuickActions from '../components/QuickActions';
import Footer from '../components/Footer';
import CardsContent from './cards/CardsContent'
import InvestmentsContent from './investments/InvestmentsContent'
import { useAccountStore } from '~/context/accountStore'
import { useEventStore } from '~/context/eventStore'
import { RecentTransactions } from '~/components/RecentTransactions'
import { useInvestmentStore } from '~/context/investmentStore'
import { InvestmentsDisplay } from '~/components/InvestmentsDisplay'
import { TransferContent } from './transfer/Transfer'
import { useAppStore } from '~/context/appStore'
import { Sidebar } from '~/components/Sidebar'
import { AccountSummary } from '~/components/AccountSummary'
import type { EventMessage } from '~/models/eventMessage'
import { useSignalR } from '~/services/useSignalR'
import Notification from '~/components/Notification'
import { NotificationType } from '~/models/enum/notificationType'
import { useCreditCardStore } from '~/context/creditCardStore'
import { DepositBillets } from './depositBillets/DepositBillets'
import { AccountEditPage } from './config/AccountEdit'

export function Index() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [isNotificationCenterOpen, setIsNotificationCenterOpen] = useState<boolean>(false);
  const {view} = useAppStore();
  const { getEventTransactions, listEvents, updateEvents, lastTransactions, events, loading: eventLoading, isAlready: isAlreadyEvent } = useEventStore();
  const { getInvestmentsHome, investment, loading: investmentLoading, isAlready: isAlreadyInvestment} = useInvestmentStore();
  const { setDarkMode, user, loading: accountLoading, updateUser} = useAccountStore();
  const { getCreditCardsById, creditCard } = useCreditCardStore();
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const eventUrl = import.meta.env.VITE_API_URL_EVENT

  useSignalR(eventUrl + 'notification', user?.accountId, (notification: EventMessage) => {
    updateEvents(notification);
    setToastMessage(notification.title);

    if (notification?.action === NotificationType.CREDITCARD_RESPONSED) {
      getCreditCardsById(user?.accountId);
    }

    if(notification?.action === NotificationType.DEPOSIT) {
      updateUser();
    }
  });

  useEffect(() => {
  if (toastMessage) {
    const timeout = setTimeout(() => {
      setToastMessage(null);
    }, 5000); // 5 segundos

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
    if(events.length === 0 && user) {
      listEvents(user.accountId, 20)
    }
  }, [user])

  useEffect(() => {
    if(lastTransactions.length === 0 && user && !isAlreadyEvent) {
      getEventTransactions(user.accountId, 3)
    }

    if(investment.length === 0 && user && !isAlreadyInvestment) {
      getInvestmentsHome(user.accountId, 3)
    }

    if(!creditCard && user){
      getCreditCardsById(user.accountId)
    }

  }, [lastTransactions, investment, user, creditCard]);

  const toggleDarkMode = () => {
    setDarkMode(!user?.darkMode)
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  const toggleNotificationCenter = () => {
    setIsNotificationCenterOpen((prev) => !prev);
  };

  return (
    <div className="bg-gray-50 dark:bg-dark-primary smooth-transition">
      {/* <LoadingOverlay isVisible={eventLoading} /> */}
      <NotificationCenter
        isOpen={isNotificationCenterOpen}
        notifications={events}
        toggleNotificationCenter={toggleNotificationCenter}
        markAsRead={null}
        clearNotifications={null}
      />
      <Header
        user={user}
        toggleMobileMenu={toggleMobileMenu}
        toggleDarkMode={toggleDarkMode}
        toggleNotificationCenter={toggleNotificationCenter}
        notificationCount={events.length}
        isDarkMode={user?.darkMode || false}
        isNotificationCenterOpen={isNotificationCenterOpen}
      />
      <main className="flex-grow container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row gap-6">
          <Sidebar
            user={user}
            view={view} // Pass the current view to Sidebar
          />
          <div className="flex-grow">
            {view === 'dashboard' ? (
              <>
                <QuickActions />
                <AccountSummary user={user} loadingUser={accountLoading} investment={investment} loadingCard={false} loadingInvestment={investmentLoading} card={creditCard} />
                <RecentTransactions lastTransactions={lastTransactions} loading={eventLoading}/>
                <InvestmentsDisplay investments={investment} loading={investmentLoading}/>
              </>
            ) : view === 'transfer' ? (
              <TransferContent />
            ) : view === 'cards' ? (
              <CardsContent />
            ) : view === 'investments' ? (
              <InvestmentsContent />
            ) : view === 'deposit' ? (
              <DepositBillets />
            ): (
              <AccountEditPage />
            )}
          </div>
        </div>
      </main>
      <Footer />
      
      <Notification key={toastMessage} message={toastMessage}/>
    </div>
  );
}