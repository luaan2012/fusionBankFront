import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRightToBracket, faBarcode, faFileInvoice } from '@fortawesome/free-solid-svg-icons';

interface TabNavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const tabs = [
  { id: 'deposit', label: 'Depósito', icon: 'arrow-right-to-bracket' },
  { id: 'boleto', label: 'Pagamento de Boleto', icon: 'barcode' },
  { id: 'generate', label: 'Gerar Boleto', icon: 'file-invoice' },
] as const;

const TabNavigation: React.FC<TabNavigationProps> = ({ activeTab, setActiveTab }) => {
  return (
    <div className="bg-white dark:bg-slate-950 rounded-xl shadow-md mb-6 transition-all duration-300 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <nav className="flex border-b border-gray-200 dark:border-gray-700" role="tablist">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 py-4 px-6 text-center border-b-2 font-semibold text-base transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 ${
              activeTab === tab.id
                ? 'border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-500'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
            }`}
            role="tab"
            aria-selected={activeTab === tab.id}
            aria-controls={`tabpanel-${tab.id}`}
          >
            <FontAwesomeIcon icon={['fas', tab.icon]} className="mr-2" />
            {tab.label}
          </button>
        ))}
      </nav>
    </div>
  );
};

export default TabNavigation;