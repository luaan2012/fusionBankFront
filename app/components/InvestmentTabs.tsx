import React from 'react';
import PortfolioContent from './PortfolioContent';
import ExploreContent from './ExploreContent';
import ReportsContent from './ReportsContent';
import ProfileContent from './ProfileContent';

interface InvestmentTabsProps {
    activeTab: 'portfolio' | 'explore' | 'reports' | 'profile';
    setActiveTab: React.Dispatch<React.SetStateAction<'portfolio' | 'explore' | 'reports' | 'profile'>>;
}

const tabs = [
    { id: 'portfolio', label: 'Carteira', icon: 'fa-chart-pie' },
    { id: 'explore', label: 'Explorar', icon: 'fa-compass' },
    { id: 'reports', label: 'Relatórios', icon: 'fa-file-alt' },
    { id: 'profile', label: 'Perfil', icon: 'fa-user' },
] as const;

const InvestmentTabs: React.FC<InvestmentTabsProps> = ({ activeTab, setActiveTab }) => (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg mb-8">
        <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="flex -mb-px">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                            activeTab === tab.id
                                ? 'border-blue-500 text-blue-600 dark:text-blue-300 dark:border-blue-300'
                                : 'border-transparent text-gray-500 dark:text-gray-300 hover:text-gray-700 hover:border-gray-300'
                        }`}
                    >
                        <i className={`fas ${tab.icon} mr-2`}></i> {tab.label}
                    </button>
                ))}
            </nav>
        </div>
        <div className="p-6">
            {activeTab === 'portfolio' && <PortfolioContent />}
            {activeTab === 'explore' && <ExploreContent />}
            {activeTab === 'reports' && <ReportsContent />}
            {activeTab === 'profile' && <ProfileContent />}
        </div>
    </div>
);

export default InvestmentTabs;