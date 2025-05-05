import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import MobileMenu from '../components/MobileMenu';
import NotificationCenter from '../components/NotificationCenter';
import LoadingOverlay from '../components/LoadingOverlay';
import QuickActions from '../components/QuickActions';
import AccountSummary from '../components/AccountSummary';
import RecentTransactions from '../components/RecentTransactions';
import Investments from '../components/Investments';
import Footer from '../components/Footer';
import Toast from '../components/Toast';
import ConfirmationModal from '../components/ConfirmationModel';
import SuccessToast from '../components/SuccessToast';
import ErrorToast from '../components/ErrorToast';
import { type Notification, type Toast as ToastType } from '../../types';
import { getInitials } from '../../utils';
import {
  faMoneyBillTransfer,
  faChartLine,
  faCreditCard,
} from '@fortawesome/free-solid-svg-icons';
import TransferContent from './transfer/Transfer'
import CardsContent from './cards/CardsContent'
import InvestmentsContent from './investments/InvestmentsContent'
import AccountEditPage from './config/AccountEdit'
import { BilletsContent } from './billets/BilletsContent'
import type { Account } from '~/models/account'
import { useHomeStore } from '~/context/homeStore'
import { useAccountStore } from '~/context/accountStore'

export function Index() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [isNotificationCenterOpen, setIsNotificationCenterOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [notificationCount, setNotificationCount] = useState<number>(3);
  const [toasts, setToasts] = useState<ToastType[]>([]);
  const [view, setView] = useState<'dashboard' | 'transfer' | 'cards' | 'investments' | 'billets' | 'accountEdit'>('dashboard');
  const [transferData, setTransferData] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [successToast, setSuccessToast] = useState({ isOpen: false, message: '' });
  const [errorToast, setErrorToast] = useState({ isOpen: false, message: '' });
  const { updateUser } = useHomeStore();
  const { setDarkMode, user } = useAccountStore();
  
  useEffect(() => {
    if (user?.darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [user?.darkMode]);

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     if (Math.random() > 0.1) {
  //       setNotificationCount((prev) => prev + 1);
  //       const newToast: ToastType = {
  //         id: Date.now(),
  //         message: 'Nova notificação recebida',
  //       };
  //       setToasts((prev) => [...prev, newToast]);
  //       setTimeout(() => {
  //         setToasts((prev) => prev.filter((toast) => toast.id !== newToast.id));
  //       }, 3300);
  //     }
  //   }, 3000);
  //   return () => clearInterval(interval);
  // }, []);

  const toggleDarkMode = () => {
   setDarkMode(!user?.darkMode)
   updateUser();
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  const toggleNotificationCenter = () => {
    setIsNotificationCenterOpen((prev) => !prev);
    if (!notifications.length) {
      setNotifications([
        {
          id: 1,
          icon: faMoneyBillTransfer,
          iconColor: 'text-blue-500',
          title: 'PIX recebido',
          description: 'Você recebeu R$ 250,00 de Carlos Silva',
          time: '2 minutos atrás',
          unread: true,
        },
        {
          id: 2,
          icon: faCreditCard,
          iconColor: 'text-purple-500',
          title: 'Cartão virtual gerado',
          description: 'Seu cartão virtual terminado em 1234 foi criado',
          time: '1 hora atrás',
          unread: true,
        },
        {
          id: 3,
          icon: faChartLine,
          iconColor: 'text-green-500',
          title: 'Rendimento disponível',
          description: 'Seu CDB rendeu R$ 45,32 este mês',
          time: 'Ontem',
          unread: false,
        },
      ]);
    }
  };

  const showLoading = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1500);
  };

  const logout = () => {
    showLoading();
    setTimeout(() => {
      console.log('Redirect to login');
    }, 1500);
  };

  const handleTransferClick = () => {
    setView('transfer');
  };

  const handleDashboardClick = () => {
    setView('dashboard');
  };

  const handleInvestmentsClick = () => {
    setView('investments');
  };

  const handleBilletsClick = () => {
    setView('billets');
  };

  const handleAccountClick = () => {
    setView('accountEdit');
  };

  const handleCardsClick = () => {
    console.log('Navigating to cards view');
    setView('cards');
  };

  const handleTransferConfirm = (data: any) => {
    if (data.error) {
      setErrorToast({ isOpen: true, message: data.error });
    } else {
      setTransferData(data);
      setIsModalOpen(true);
    }
  };

  const handleModalConfirm = () => {
    setIsModalOpen(false);
    setSuccessToast({
      isOpen: true,
      message: `Seu ${transferData.type.toUpperCase()} foi enviado com sucesso.`,
    });
    setTimeout(() => {
      setView('dashboard');
    }, 3000);
  };

  return (
    <div className="bg-gray-50 dark:bg-dark-primary smooth-transition">
      <LoadingOverlay isVisible={isLoading} />
      <NotificationCenter
        isOpen={isNotificationCenterOpen}
        notifications={notifications}
        toggleNotificationCenter={toggleNotificationCenter}
      />
      <Header
        user={user}
        toggleMobileMenu={toggleMobileMenu}
        toggleDarkMode={toggleDarkMode}
        toggleNotificationCenter={toggleNotificationCenter}
        notificationCount={notificationCount}
        isDarkMode={user?.darkMode || false}
      />
      <main className="flex-grow container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row gap-6">
          <Sidebar
            user={user}
            notificationCount={notificationCount}
            onTransferClick={handleTransferClick}
            onDashboardClick={handleDashboardClick}
            onCardsClick={handleCardsClick}
            investmentClick={handleInvestmentsClick}
            billetsClick={handleBilletsClick}
            accountEditClick={handleAccountClick}
            view={view} // Pass the current view to Sidebar
          />
          <div className="flex-grow">
            {view === 'dashboard' ? (
              <>
                <QuickActions />
                <AccountSummary user={user}/>
                <RecentTransactions />
                <Investments />
              </>
            ) : view === 'transfer' ? (
              <TransferContent onConfirm={handleTransferConfirm} />
            ) : view === 'cards' ? (
              <CardsContent />
            ) : view === 'investments' ? (
              <InvestmentsContent />
            ) : view === 'billets' ? (
              <BilletsContent />
            ): (
              <AccountEditPage />
            )}
          </div>
        </div>
      </main>
      <Footer />
      {toasts.map((toast) => (
        <Toast key={toast.id} message={toast.message} />
      ))}
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        transferData={transferData || {}}
        onConfirm={handleModalConfirm}
      />
      <SuccessToast
        isOpen={successToast.isOpen}
        message={successToast.message}
        onClose={() => setSuccessToast({ isOpen: false, message: '' })}
      />
      {/* <ErrorToast
        isOpen={errorToast.isOpen}
        message={errorToast.message}
        onClose={() => setErrorToast({ isOpen: false, message: '' })}
      /> */}
    </div>
  );
}