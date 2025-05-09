import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faTimes } from '@fortawesome/free-solid-svg-icons';
import BoletoPaymentContent from '~/components/BoletoPaymentContent';
import DepositContent from '~/components/DepositContent';
import TabNavigation from '~/components/TabNavigation';
import GenerateBoletoContent from '~/components/GenereteBoletoContent'

export function BilletsContent() {
  const [activeTab, setActiveTab] = useState<string>('deposit');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showBoletoModal, setShowBoletoModal] = useState<boolean>(false);
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState<boolean>(false);

  const showErrorToast = (message: string) => {
    setErrorMessage(message);
    setTimeout(() => setErrorMessage(null), 5000);
  };

  return (
    <div className="bg-transparent min-h-screen transition-colors duration-300">
      <main role="main" className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-3">
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
        {errorMessage && (
          <div
            className="fixed top-4 right-4 bg-red-600 dark:bg-red-500 text-white rounded-xl shadow-lg p-4 flex items-center animate-slide-in"
            role="alert"
            aria-live="assertive"
          >
            <FontAwesomeIcon icon={faTimes} className="mr-2" />
            <span className="text-sm font-medium">{errorMessage}</span>
            <button
              onClick={() => setErrorMessage(null)}
              className="ml-4 text-white hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
              aria-label="Fechar erro"
            >
              <FontAwesomeIcon icon={faTimes} />
            </button>
          </div>
        )}
        {showBoletoModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div
              className="bg-white dark:bg-slate-950 rounded-xl shadow-xl w-full max-w-lg mx-4 p-6"
              role="dialog"
              aria-labelledby="boleto-modal-title"
            >
              <h3 id="boleto-modal-title" className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Boleto Gerado
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">Seu boleto foi gerado com sucesso!</p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowBoletoModal(false)}
                  className="px-4 py-2 bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 text-white rounded-lg text-sm font-semibold transition-all duration-200"
                  aria-label="Fechar modal"
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>
        )}
        {showSuccessModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div
              className="bg-white dark:bg-slate-950 rounded-xl shadow-xl w-full max-w-lg mx-4 p-6"
              role="dialog"
              aria-labelledby="success-modal-title"
            >
              <h3 id="success-modal-title" className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Comprovante Enviado
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                Seu comprovante foi enviado e será analisado em até 2 dias úteis.
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowSuccessModal(false)}
                  className="px-4 py-2 bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 text-white rounded-lg text-sm font-semibold transition-all duration-200"
                  aria-label="Fechar modal"
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>
        )}
        {showConfirmationModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div
              className="bg-white dark:bg-slate-950 rounded-xl shadow-xl w-full max-w-lg mx-4 p-6"
              role="dialog"
              aria-labelledby="confirmation-modal-title"
            >
              <h3 id="confirmation-modal-title" className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Confirmação de Pagamento
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                Confirme o pagamento do boleto no valor de R$ 187,23.
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowConfirmationModal(false)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-100 rounded-lg text-sm font-semibold hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200"
                  aria-label="Cancelar pagamento"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => {
                    setShowConfirmationModal(false);
                    setShowSuccessModal(true);
                  }}
                  className="px-4 py-2 bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 text-white rounded-lg text-sm font-semibold transition-all duration-200"
                  aria-label="Confirmar pagamento"
                >
                  Confirmar
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}