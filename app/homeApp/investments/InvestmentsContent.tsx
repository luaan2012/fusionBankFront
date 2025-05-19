import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartLine, faCheckCircle, faTimes, faTrophy, faWallet } from '@fortawesome/free-solid-svg-icons';
import InvestmentTabs from '~/components/InvestmentTabs';
import InvestModal from '~/components/InvestModal';
import SummaryCard from '~/components/SummaryCard';
import VerificationModal from '~/components/VerificationModal';
import { useInvestmentStore } from '~/context/investmentStore'
import { formatToBRL } from '~/utils/utils'
import { useAccountStore } from '~/context/accountStore'
import { number } from 'zod'

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
  const { user } = useAccountStore()

  const showSuccess = (message: string): void => {
    setNotification({ show: true, message });
    setTimeout(() => setNotification({ show: false, message: '' }), 5000);
  };

  const getTotalInvested = () => {
    return investment.reduce((acc, inv) => acc + inv.balance, 0);
  };

  const getTodayPerformance = () => {
    // Isso é um mock. Substitua pela lógica real se tiver.
    return 342.15;
  };

  const getTopAsset = () => {
    return investment.length > 0
      ? investment.reduce((prev, current) =>
          current.totalBalance > prev.totalBalance ? current : prev
        ).symbol
      : 'N/A';
  };

  useEffect(() => {
    if(user && !isAlreadyInvestments) {
      listInvestmentsUser(user.accountId, Number.MAX_VALUE);
    }
  }, [listInvestmentsUser, user.accountId]);

  return (
    <div className="bg-transparent min-h-screen transition-colors duration-300">
      <main role="main" className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <SummaryCard
            title="Total Investido"
            icon={faWallet}
            value={formatToBRL(getTotalInvested())}
            performance={{ value: '—', trend: 'up', period: 'últimos 12 meses' }}
          />
          <SummaryCard
            title="Hoje"
            icon={faChartLine}
            value={formatToBRL(getTodayPerformance())}
            performance={{ value: '0.8%', trend: 'up', period: 'vs. ontem' }}
          />
          <SummaryCard
            title="Melhor Ativo"
            icon={faTrophy}
            value={getTopAsset()}
            performance={{ value: '12.7%', trend: 'up', period: 'este mês' }}
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
