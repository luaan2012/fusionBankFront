import { useState } from 'react';
import BoletoPaymentContent from '~/components/Contents/BoletoPaymentContent'
import DepositContent from '~/components/Contents/DepositContent'
import { TabNavigation } from '~/components/Tabs/TabNavigation'
import { useToast } from '~/components/Toasts/ToastContext'
import type { ResponseStore } from '~/types/api'
import { formatarBoleto } from '~/utils/util'

export const Transaction = () =>{
  const [activeTab, setActiveTab] = useState<string>('deposit');
  const [showBoletoModal, setShowBoletoModal] = useState<ResponseStore>({message: '', success: false});
  const [showSuccessModal, setShowSuccessModal] = useState<ResponseStore>({message: '', success: false});
  const { openToast } = useToast()

  const showErrorToast = (message: ResponseStore) => {
    openToast({
      message: message.message,
      type: 'error',
      duration: 4000,
      position: 'top-right'
    })
  };

  const handleCodeCopy = () => {
    navigator.clipboard.writeText(showBoletoModal.message)

    openToast({
      message: 'Código copiado para a área de transferência',
      type: 'success',
      position: 'top-right',
      duration: 5000
    })
  }

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
                setShowSuccessModal={setShowSuccessModal}
                setShowErrorToast={showErrorToast}
              />
            )}
          </div>
        </div>
        {showBoletoModal.success && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div
              className="bg-white dark:bg-slate-950 rounded-xl shadow-xl w-full max-w-lg mx-4 p-6"
              role="dialog"
              aria-labelledby="boleto-modal-title"
            >
              <h3
                id="boleto-modal-title"
                className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4"
              >
                Boleto gerado com sucesso!
              </h3>

              <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                Copie o código abaixo:
              </p>

              <div className="flex items-center bg-gray-100 dark:bg-gray-800 p-3 rounded-lg mb-4">
                <span className="text-sm text-gray-900 dark:text-gray-100 break-all">
                  {formatarBoleto(showBoletoModal.message)}
                </span>
                <button
                  onClick={handleCodeCopy}
                  className="ml-3 px-3 py-1 bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 text-white rounded-md text-sm transition-all"
                  aria-label="Copiar código do boleto"
                >
                  Copiar
                </button>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowBoletoModal({ message: '', success: false })}
                  className="px-4 py-2 bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100 rounded-lg text-sm font-semibold transition-all duration-200"
                  aria-label="Fechar modal"
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>
        )}
        {showSuccessModal.success && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div
              className="bg-white dark:bg-slate-950 rounded-xl shadow-xl w-full max-w-lg mx-4 p-6"
              role="dialog"
              aria-labelledby="success-modal-title"
            >
              <h3 id="success-modal-title" className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Operação Concluída
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                {showSuccessModal.message}
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowSuccessModal({message: '', success: false})}
                  className="px-4 py-2 bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 text-white rounded-lg text-sm font-semibold transition-all duration-200"
                  aria-label="Fechar modal"
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}