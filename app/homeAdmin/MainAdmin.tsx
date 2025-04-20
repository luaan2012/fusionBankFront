import DashboardContent from './DashboardContent';
import BanksContent from './BankContexts';
import AccountsContent from './AccountsContext';
import TransationMain from './transaction'

interface MainContentProps {
  activeTab: string;
  openModal: (type: 'bank' | 'transfer' | 'twofa' | 'confirm', data?: any) => void;
}

export default function MainAdmin ({ activeTab, openModal } : MainContentProps) {
  return (
    <main className="flex-1 overflow-y-auto p-6 bg-gray-50 dark:bg-gray-900">
      {activeTab === 'dashboard' && <DashboardContent />}
      {activeTab === 'banks' && <BanksContent />}
      {activeTab === 'accounts' && <AccountsContent />}
      {activeTab === 'transactions' && <TransationMain />}
      {activeTab === 'invoices' && <div>Boletos Content (To be implemented)</div>}
      {activeTab === 'users' && <div>Usuários Content (To be implemented)</div>}
      {activeTab === 'audit' && <div>Auditoria Content (To be implemented)</div>}
      {activeTab === 'settings' && <div>Configurações Content (To be implemented)</div>}
    </main>
  );
};
