import DashboardContent from './DashboardContent';
import BanksContent from './BankContexts';
import AccountsContent from './AccountsContext';
import TransationMain from './Transaction'

interface MainContentProps {
  activeTab: string;
  openModal: (type: 'bank' | 'transfer' | 'twofa' | 'confirm', data?: any) => void;
}

export default function MainAdmin ({ activeTab, openModal } : MainContentProps) {
  return (
    <main className="flex-1 overflow-y-auto p-6 bg-gray-50 dark:bg-gray-900">
      {activeTab === 'dashboard' && <DashboardContent />}
      {activeTab === 'accounts' && <BanksContent />}
      {activeTab === 'transactions' && <TransationMain />}
    </main>
  );
};
