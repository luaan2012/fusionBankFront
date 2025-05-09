import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faKeyboard,
  faQrcode,
  faFileUpload,
  faCamera,
  faCircleNotch,
  faCloudUploadAlt,
  faFileImage,
  faTimes,
} from '@fortawesome/free-solid-svg-icons';
import { type FileInfo, type BoletoDetails } from '../../types';

interface BoletoPaymentContentProps {
  setShowConfirmationModal: (show: boolean) => void;
  setShowErrorToast: (message: string) => void;
}

const BoletoPaymentContent: React.FC<BoletoPaymentContentProps> = ({
  setShowConfirmationModal,
  setShowErrorToast,
}) => {
  const [method, setMethod] = useState<'digitar' | 'qrcode' | 'upload'>('digitar');
  const [fileInfo, setFileInfo] = useState<FileInfo | null>(null);
  const [boletoInfo, setBoletoInfo] = useState<BoletoDetails | null>(null);
  const [isValidating, setIsValidating] = useState(false);

  const handleFileUpload = (file: File) => {
    const validTypes = ['image/jpeg', 'image/png'];
    if (!validTypes.includes(file.type)) {
      setShowErrorToast('Tipo de arquivo inválido. Use JPG ou PNG.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setShowErrorToast('Arquivo muito grande. Tamanho máximo: 5MB.');
      return;
    }
    setFileInfo({ name: file.name, size: file.size, type: file.type });
  };

  const validateBoleto = (code: string) => {
    if (!code || code.length < 44) {
      setShowErrorToast('Código de boleto inválido. Digite os 44 números.');
      return;
    }
    setIsValidating(true);
    setTimeout(() => {
      setBoletoInfo({
        code: '84670000001-7 12340000000-0 00000000000-0 00000000000-0',
        amount: 'R$ 187,23',
        dueDate: '15/08/2023',
        beneficiary: 'Companhia Energética de Minas Gerais',
        nossoNumero: '123456789012',
        total: new Date() > new Date('2023-08-15') ? 'R$ 192,85' : 'R$ 187,23',
        fees: new Date() > new Date('2023-08-15') ? 'R$ 5,62' : undefined,
      });
      setIsValidating(false);
    }, 1000);
  };

  const handlePayBoleto = () => {
    if (!boletoInfo) {
      setShowErrorToast('Por favor, valide o boleto antes de confirmar.');
      return;
    }
    setShowConfirmationModal(true);
  };

  return (
    <div id="boleto-content">
      <div className="bg-white dark:bg-slate-950 rounded-xl shadow-md p-6 transition-all duration-300 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6">Pagamento de Boleto</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8" role="radiogroup" aria-label="Selecionar método de pagamento">
          {[
            {
              method: 'digitar',
              icon: faKeyboard,
              title: 'Digitar Código',
              description: 'Insira o código de barras ou linha digitável',
              color: 'blue',
            },
            {
              method: 'qrcode',
              icon: faQrcode,
              title: 'Ler QR Code',
              description: 'Escaneie o QR Code do boleto',
              color: 'green',
            },
            {
              method: 'upload',
              icon: faFileUpload,
              title: 'Upload de Imagem',
              description: 'Envie uma imagem do boleto',
              color: 'purple',
            },
          ].map((item) => (
            <div
              key={item.method}
              className={`boleto-method bg-white dark:bg-slate-800 border rounded-xl p-4 cursor-pointer shadow-sm hover:shadow-md transition-all duration-200 ${
                method === item.method
                  ? `border-${item.color}-300 dark:border-${item.color}-500`
                  : 'border-gray-200 dark:border-gray-700'
              }`}
              onClick={() => setMethod(item.method as 'digitar' | 'qrcode' | 'upload')}
              role="radio"
              aria-checked={method === item.method}
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && setMethod(item.method as 'digitar' | 'qrcode' | 'upload')}
            >
              <div className="flex items-center mb-3">
                <div className={`h-10 w-10 rounded-full bg-${item.color}-100 dark:bg-${item.color}-900 flex items-center justify-center mr-3`}>
                  <FontAwesomeIcon icon={item.icon} className={`text-${item.color}-600 dark:text-${item.color}-400 text-lg`} />
                </div>
                <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">{item.title}</h3>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300">{item.description}</p>
            </div>
          ))}
        </div>
        <div id="digitar-form" className={method === 'digitar' ? '' : 'hidden'}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="boleto-code">
              Código de barras ou linha digitável
            </label>
            <input
              id="boleto-code"
              type="text"
              className="bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-100 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full py-3 transition-all duration-200"
              placeholder="Digite os 44 números do código de barras"
              onChange={(e) => validateBoleto(e.target.value)}
              aria-label="Código de barras ou linha digitável"
            />
          </div>
          <div className="flex justify-end">
            <button
              className="px-6 py-2.5 bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 text-white rounded-lg text-sm font-semibold transition-all duration-200 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              disabled={isValidating}
              onClick={() => validateBoleto((document.querySelector('#digitar-form input') as HTMLInputElement)?.value || '')}
              aria-label="Validar boleto"
            >
              {isValidating ? (
                <>
                  <FontAwesomeIcon icon={faCircleNotch} className="fa-spin mr-2" />
                  Validando...
                </>
              ) : (
                'Validar Boleto'
              )}
            </button>
          </div>
        </div>
        <div id="qrcode-form" className={method === 'qrcode' ? '' : 'hidden'}>
          <div className="flex flex-col items-center">
            <div className="qr-scanner mb-4 bg-gray-50 dark:bg-gray-800 rounded-xl p-6">
              <FontAwesomeIcon icon={faCamera} className="text-gray-400 text-4xl" />
            </div>
            <button
              className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-all duration-200"
              onClick={() => setMethod('digitar')}
              aria-label="Digitar código manualmente"
            >
              Não consegue escanear? Digite o código
            </button>
          </div>
        </div>
        <div id="upload-form" className={method === 'upload' ? '' : 'hidden'}>
          <div
            className="file-upload rounded-xl p-8 text-center mb-4 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 transition-all duration-200"
            onDragOver={(e) => {
              e.preventDefault();
              e.currentTarget.classList.add('bg-purple-50', 'dark:bg-purple-900', 'border-purple-500');
            }}
            onDragLeave={(e) => {
              e.currentTarget.classList.remove('bg-purple-50', 'dark:bg-purple-900', 'border-purple-500');
            }}
            onDrop={(e) => {
              e.preventDefault();
              e.currentTarget.classList.remove('bg-purple-50', 'dark:bg-purple-900', 'border-purple-500');
              if (e.dataTransfer.files.length) handleFileUpload(e.dataTransfer.files[0]);
            }}
            aria-describedby="boleto-upload-description"
          >
            <div className="flex flex-col items-center justify-center">
              <FontAwesomeIcon icon={faCloudUploadAlt} className="text-3xl text-gray-400 mb-2" />
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">Arraste e solte a imagem do boleto aqui</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">ou</p>
              <label
                htmlFor="boleto-input"
                className="px-4 py-2 bg-purple-600 dark:bg-purple-500 hover:bg-purple-700 dark:hover:bg-purple-600 text-white rounded-lg text-sm font-semibold cursor-pointer transition-all duration-200"
                aria-label="Selecionar imagem"
              >
                Selecione a imagem
              </label>
              <input
                id="boleto-input"
                type="file"
                className="hidden"
                accept="image/*"
                onChange={(e) => e.target.files && handleFileUpload(e.target.files[0])}
              />
            </div>
            <p id="boleto-upload-description" className="sr-only">
              Arraste e solte ou selecione uma imagem JPG ou PNG com tamanho máximo de 5MB.
            </p>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">Formatos aceitos: JPG, PNG (máx. 5MB)</p>
          {fileInfo && (
            <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <FontAwesomeIcon icon={faFileImage} className="text-blue-500 mr-2" />
                  <div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{fileInfo.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {(fileInfo.size / 1024 / 1024).toFixed(1)} MB
                    </p>
                  </div>
                </div>
                <button
                  className="text-red-500 hover:text-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                  onClick={() => setFileInfo(null)}
                  aria-label="Remover imagem"
                >
                  <FontAwesomeIcon icon={faTimes} />
                </button>
              </div>
            </div>
          )}
          <div className="flex justify-end mt-4">
            <button
              className="px-6 py-2.5 bg-purple-600 dark:bg-purple-500 hover:bg-purple-700 dark:hover:bg-purple-600 text-white rounded-lg text-sm font-semibold transition-all duration-200 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
              onClick={() => validateBoleto('sample-code')}
              aria-label="Validar boleto"
            >
              Validar Boleto
            </button>
          </div>
        </div>
        {boletoInfo && (
          <div id="boleto-info" className="mt-8">
            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Conta de Energia Elétrica</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{boletoInfo.beneficiary}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500 dark:text-gray-400">Vencimento</p>
                  <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{boletoInfo.dueDate}</p>
                </div>
              </div>
              <div className="barcode mb-4 h-12 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Código</p>
                  <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{boletoInfo.code}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Nosso Número</p>
                  <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{boletoInfo.nossoNumero}</p>
                </div>
              </div>
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-600 dark:text-gray-300">Valor</span>
                  <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">{boletoInfo.amount}</span>
                </div>
                {boletoInfo.fees && (
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-gray-600 dark:text-gray-300">Juros/Multa</span>
                    <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">{boletoInfo.fees}</span>
                  </div>
                )}
                <div className="flex justify-between border-t border-gray-200 dark:border-gray-700 pt-2">
                  <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">Total</span>
                  <span className="text-sm font-bold text-gray-900 dark:text-gray-100">{boletoInfo.total}</span>
                </div>
              </div>
            </div>
            <div className="mb-6 mt-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="account-select">
                Conta para débito
              </label>
              <select
                id="account-select"
                className="bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-100 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full py-3 transition-all duration-200"
                aria-label="Selecionar conta para débito"
              >
                <option>Conta Corrente • Saldo: R$ 8.742,36</option>
                <option>Cartão de Crédito • Vence em 10/08</option>
              </select>
            </div>
            <div className="mb-6">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800"
                  onChange={(e) => {
                    const scheduleDiv = document.getElementById('schedule-payment');
                    if (scheduleDiv) scheduleDiv.classList.toggle('hidden', !e.target.checked);
                  }}
                  aria-label="Agendar pagamento"
                />
                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Agendar pagamento</span>
              </label>
              <div id="schedule-payment" className="hidden mt-3">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="payment-date">
                  Data para pagamento
                </label>
                <input
                  id="payment-date"
                  type="date"
                  className="bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-100 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full py-3 transition-all duration-200"
                  aria-label="Data para pagamento"
                />
              </div>
            </div>
            <div className="flex justify-end">
              <button
                className="px-6 py-2.5 bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 text-white rounded-lg text-sm font-semibold transition-all duration-200 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                onClick={handlePayBoleto}
                aria-label="Confirmar pagamento"
              >
                Confirmar Pagamento
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BoletoPaymentContent;