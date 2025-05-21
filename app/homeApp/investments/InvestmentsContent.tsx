import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartLine, faCheckCircle, faTimes, faTrophy, faWallet } from '@fortawesome/free-solid-svg-icons';
import InvestmentTabs from '~/components/InvestmentTabs';
import InvestModal from '~/components/InvestModal';
import SummaryCard from '~/components/SummaryCard';
import VerificationModal from '~/components/VerificationModal';
import { useInvestmentStore } from '~/context/investmentStore';
import { useAccountStore } from '~/context/accountStore';
import { formatToBRL, getYesterdayDateString } from '~/utils/utils';
import type { Investment } from '~/models/investment'

interface Notification {
  show: boolean;
  message: string;
}

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'portfolio' | 'explore' | 'reports' | 'profile'>('portfolio');
  const [isInvestModalOpen, setInvestModalOpen] = useState(false);
  const [isVerificationModalOpen, setVerificationModalOpen] = useState(false);
  const [notification, setNotification] = useState<Notification>({ show: false, message: '' });

  const { investment, listInvestmentsUser, isAlreadyInvestments } = useInvestmentStore();
  const { user } = useAccountStore();

  const showSuccess = (message: string): void => {
    setNotification({ show: true, message });
    setTimeout(() => setNotification({ show: false, message: '' }), 5000);
  };

  // Calculate total invested amount
  const getTotalInvested = (): number => {
    if (!investment || investment.length === 0) return 0;
    return investment.reduce((acc, inv) => acc + (inv.balance || 0), 0);
  };

  // Calculate portfolio performance over 12 months
  const getPortfolioPerformance = (): number => {
    if (!investment || investment.length === 0) return 0;
    const invested = investment.reduce((acc, inv) => acc + (inv.balance || 0), 0);
    const current = investment.reduce((acc, inv) => acc + (inv.totalBalance || 0), 0);
    if (invested === 0) return 0;
    return ((current - invested) / invested) * 100;
  };

  // Calculate today's performance (value change)
  const getTodayPerformance = (): number => {
    if (!investment || investment.length === 0) return 0;
    let totalYesterdayValue = 0;
    let totalTodayValue = 0;

    const yesterdayDate = getYesterdayDateString()

    investment.forEach((inv) => {
      const quantity = inv.entries.find(entry => {
        const entryDate = new Date(entry.date);
        const entryDateString = entryDate.toISOString().split('T')[0];
        return entryDateString === yesterdayDate;
      })?.quantity || 0;
      const unitPrice = inv.entries.find(entry => {
        const entryDate = new Date(entry.date);
        const entryDateString = entryDate.toISOString().split('T')[0];
        return entryDateString === yesterdayDate;
      })?.unitPrice || 0;
      const todayPrice = inv.regularMarketPrice || 0;
      
      totalYesterdayValue += quantity * unitPrice;
      totalTodayValue += quantity * todayPrice;
    });
    return totalTodayValue - totalYesterdayValue;
  };

  // Calculate today's performance percentage
  const getTodayPerformancePercentage = (): number => {
    if (!investment || investment.length === 0) return 0;
    let totalYesterdayValue = 0;
    let totalTodayValue = 0;
    const yesterdayDate = getYesterdayDateString();

    investment.forEach((inv) => {
      const quantity = inv.entries.find(entry => {
        const entryDate = new Date(entry.date);
        const entryDateString = entryDate.toISOString().split('T')[0];
        return entryDateString === yesterdayDate;
      })?.quantity || 0;
      const unitPrice = inv.entries.find(entry => {
        const entryDate = new Date(entry.date);
        const entryDateString = entryDate.toISOString().split('T')[0];
        return entryDateString === yesterdayDate;
      })?.unitPrice || 0;
      const todayPrice = inv.regularMarketPrice || 0;
      totalYesterdayValue += quantity * unitPrice;
      totalTodayValue += quantity * todayPrice;
    });

    if (totalYesterdayValue === 0) return 0;
    return ((totalTodayValue - totalYesterdayValue) / totalYesterdayValue) * 100;
  };

  // Get the top-performing asset
  const getTopAsset = (): Investment | null => {
    if (!investment || investment.length === 0) return null;
    return investment.reduce((prev, current) =>
      (current.totalBalance || 0) > (prev.totalBalance || 0) ? current : prev
    );
  };

  useEffect(() => {
    if (user?.accountId && !isAlreadyInvestments) {
      listInvestmentsUser(user.accountId, Number.MAX_VALUE);
    }
  }, [user?.accountId]);

  return (
    <div className="bg-transparent min-h-screen transition-colors duration-300">
      <main role="main" className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <SummaryCard
            title="Total Investido"
            icon={faWallet}
            value={formatToBRL(getTotalInvested())}
            performance={{
              value: `${getPortfolioPerformance().toFixed(2)}%`,
              trend: getPortfolioPerformance() >= 0 ? 'up' : 'down',
              period: 'últimos 12 meses',
            }}
          />

          <SummaryCard
            title="Hoje"
            icon={faChartLine}
            value={formatToBRL(getTodayPerformance())}
            performance={{
              value: `${getTodayPerformancePercentage().toFixed(2)}%`,
              trend: getTodayPerformance() >= 0 ? 'up' : 'down',
              period: 'vs. ontem',
            }}
          />

          <SummaryCard
            title="Melhor Ativo"
            icon={faTrophy}
            value={getTopAsset()?.symbol ?? 'N/A'}
            performance={{
              value: `${getTopAsset()?.percentageChange?.toFixed(2) ?? '0'}%`,
              trend: getTopAsset()?.percentageChange >= 0 ? 'up' : 'down',
              period: 'este mês',
            }}
          />
        </div>

        <InvestmentTabs activeTab={activeTab} setActiveTab={setActiveTab} />

        <InvestModal
          isOpen={isInvestModalOpen}
          onClose={() => setInvestModalOpen(false)}
          onConfirm={() => {
            setInvestModalOpen(false);
            setVerificationModalOpen(true);
          }}
        />

        <VerificationModal
          isOpen={isVerificationModalOpen}
          onClose={() => setVerificationModalOpen(false)}
          onConfirm={() => {
            setVerificationModalOpen(false);
            showSuccess('Aplicação realizada com sucesso! Os recursos serão debitados em até 1 dia útil.');
          }}
        />

        {notification.show && (
          <div
            className="fixed top-4 right-4 bg-green-600 dark:bg-green-500 text-white rounded-xl shadow-lg p-4 flex items-center animate-slide-in"
            role="alert"
            aria-live="assertive"
          >
            <FontAwesomeIcon icon={faCheckCircle} className="mr-2" />
            <span className="text-sm font-medium">{notification.message}</span>
            <button
              onClick={() => setNotification({ show: false, message: '' })}
              className="ml-4 text-white hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
              aria-label="Fechar notificação"
            >
              <FontAwesomeIcon icon={faTimes} />
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;