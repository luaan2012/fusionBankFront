interface TabNavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const TabNavigation: React.FC<TabNavigationProps> = ({ activeTab, setActiveTab }) => {
  return (
    <div className="flex border-b border-gray-200 dark:border-slate-700 mb-6">
      <button
        onClick={() => setActiveTab('deposit')}
        className={`py-2 px-4 font-medium ${
          activeTab === 'deposit'
            ? 'text-primary-600 dark:text-primary-400 border-b-2 border-primary-600 dark:border-primary-400'
            : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
        }`}
      >
        Depósito
      </button>
      <button
        onClick={() => setActiveTab('boleto')}
        className={`py-2 px-4 font-medium ${
          activeTab === 'boleto'
            ? 'text-primary-600 dark:text-primary-400 border-b-2 border-primary-600 dark:border-primary-400'
            : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
        }`}
      >
        Pagamento de Boleto
      </button>
      <button
        onClick={() => setActiveTab('generate')}
        className={`py-2 px-4 font-medium ${
          activeTab === 'generate'
            ? 'text-primary-600 dark:text-primary-400 border-b-2 border-primary-600 dark:border-primary-400'
            : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
        }`}
      >
        Gerar Boleto
      </button>
    </div>
  );
};

export default TabNavigation;