import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faExchangeAlt,
  faFileInvoiceDollar,
  faSlidersH,
  faShieldAlt,
} from '@fortawesome/free-solid-svg-icons';
import InvoicesContent from './InvoicesContent';
import LimitsContent from './LimitsContent';
import SecurityContent from './SecurityContent';
import TransactionsContent from './TransactionsContext'

interface CardManagementTabsProps {
  onAdjustLimit: () => void;
  onTempBlock: () => void;
}

const CardManagementTabs: React.FC<CardManagementTabsProps> = ({ onAdjustLimit, onTempBlock }) => {
  const [activeTab, setActiveTab] = useState<'transactions' | 'invoices' | 'limits' | 'security'>(
    'transactions'
  );

  const tabs = [
    { id: 'transactions', label: 'Transações', icon: faExchangeAlt },
    { id: 'invoices', label: 'Faturas', icon: faFileInvoiceDollar },
    { id: 'limits', label: 'Limites', icon: faSlidersH },
    { id: 'security', label: 'Segurança', icon: faShieldAlt },
  ];

  return (
    <div className="bg-white dark:bg-slate-950 rounded-xl shadow-lg mb-8 transition-all duration-300 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="flex -mb-px" role="tablist">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`py-4 px-6 text-center border-b-2 font-semibold text-base transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 ${
                activeTab === tab.id
                  ? 'border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-500'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
              role="tab"
              aria-selected={activeTab === tab.id}
              aria-controls={`tabpanel-${tab.id}`}
            >
              <FontAwesomeIcon icon={tab.icon} className="mr-2" />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>
      <div className="p-6" role="tabpanel" id={`tabpanel-${activeTab}`}>
        {activeTab === 'transactions' && <TransactionsContent />}
        {activeTab === 'invoices' && <InvoicesContent />}
        {activeTab === 'limits' && <LimitsContent onAdjustLimit={onAdjustLimit} />}
        {activeTab === 'security' && <SecurityContent onTempBlock={onTempBlock} />}
      </div>
    </div>
  );
};

export default CardManagementTabs;