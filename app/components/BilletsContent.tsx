import { useState } from 'react';
import TabNavigation from './TabBilletNavigation';
import DepositContent from './DepositContent';
import BoletoPaymentContent from './BoletoPaymentContent';
import GenerateBoletoContent from './GenereteBoletoContent';
import ErrorToast from './ErrorToast';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('deposit');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showBoletoModal, setShowBoletoModal] = useState<boolean>(false);
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState<boolean>(false);

  const showErrorToast = (message: string) => {
    setErrorMessage(message);
    setTimeout(() => setErrorMessage(null), 3000);
  };

  return (
    <div className="bg-gray-50 dark:bg-slate-900 transition-colors duration-200">
      <main className="container mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1">
            <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
            {activeTab === 'deposit' && (
              <DepositContent
                setShowBoletoModal={setShowBoletoModal}
                setShowSuccessModal={setShowSuccessModal}
                setShowErrorToast={showErrorToast}
              />
            )}
            {activeTab === 'boleto' && (
              <BoletoPaymentContent
                setShowConfirmationModal={setShowConfirmationModal}
                setShowErrorToast={showErrorToast}
              />
            )}
            {activeTab === 'generate' && <GenerateBoletoContent />}
          </div>
        </div>
      </main>
      {errorMessage && <ErrorToast message={errorMessage} onClose={() => setErrorMessage(null)} />}
    </div>
  );
};

export default App;