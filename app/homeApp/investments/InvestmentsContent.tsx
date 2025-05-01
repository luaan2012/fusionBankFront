import React, { useState } from 'react';
import InvestmentTabs from '~/components/InvestmentTabs'
import InvestModal from '~/components/InvestModal'
import SummaryCard from '~/components/SummaryCard'
import VerificationModal from '~/components/VerificationModal'


interface Notification {
    show: boolean;
    message: string;
}

const App: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'portfolio' | 'explore' | 'reports' | 'profile'>('portfolio');
    const [isInvestModalOpen, setInvestModalOpen] = useState<boolean>(false);
    const [isVerificationModalOpen, setVerificationModalOpen] = useState<boolean>(false);
    const [notification, setNotification] = useState<Notification>({ show: false, message: '' });

    const showSuccess = (message: string): void => {
        setNotification({ show: true, message });
        setTimeout(() => setNotification({ show: false, message: '' }), 5000);
    };

    return (
        <div className={`bg-gray-50 dark:bg-gray-900 transition-colors duration-300`}>
            <div className="container mx-auto px-4 py-6">
                {/* <Header toggleTheme={toggleTheme} theme={theme} /> */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <SummaryCard
                        title="Total Investido"
                        icon="fas fa-wallet"
                        value="R$ 42.567,89"
                        performance={{ value: "5.2%", trend: "up", period: "últimos 12 meses" }}
                    />
                    <SummaryCard
                        title="Hoje"
                        icon="fas fa-chart-line"
                        value="+ R$ 342,15"
                        performance={{ value: "0.8%", trend: "up", period: "vs. ontem" }}
                    />
                    <SummaryCard
                        title="Melhor Ativo"
                        icon="fas fa-trophy text-yellow-400"
                        value="PETR4"
                        performance={{ value: "12.7%", trend: "up", period: "este mês" }}
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
                {/* <SuccessNotification
                    sh={notification.show}
                    message={notification.message}
                    onClose={() => setNotification({ show: false, message: '' })}
                /> */}
            </div>
        </div>
    );
};

export default App;