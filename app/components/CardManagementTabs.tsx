import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faExchangeAlt,
  faFileInvoiceDollar,
  faSlidersH,
  faShieldAlt,
} from '@fortawesome/free-solid-svg-icons';
import TransactionsContent from './TransactionsContext';
import InvoicesContent from './InvoicesContent';
import LimitsContent from './LimitsContent';
import SecurityContent from './SecurityContent';

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
    <div className="bg-white dark:bg-dark-700 rounded-xl shadow-lg mb-8">
      <div className="border-b border-gray-200 dark:border-dark-600">
        <nav className="flex -mb-px">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600 dark:text-blue-300 dark:border-blue-300'
                  : 'border-transparent text-gray-500 dark:text-gray-300 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <FontAwesomeIcon icon={tab.icon} className="mr-2" />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>
      <div className="p-6">
        {activeTab === 'transactions' && <TransactionsContent />}
        {activeTab === 'invoices' && <InvoicesContent />}
        {activeTab === 'limits' && <LimitsContent onAdjustLimit={onAdjustLimit} />}
        {activeTab === 'security' && <SecurityContent onTempBlock={onTempBlock} />}
      </div>
    </div>
  );
};

export default CardManagementTabs;