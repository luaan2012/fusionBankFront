import React, { useState } from 'react';
import { type FileInfo, type BoletoDetails } from '../../types';
// Importações do Font Awesome
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
    setShowConfirmationModal(true);
  };

  return (
    <div id="boleto-content" className={method === 'digitar' ? '' : 'hidden'}>
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-6">Pagamento de Boleto</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {[
            {
              method: 'digitar',
              icon: faKeyboard,
              title: 'Digitar Código',
              description: 'Insira o código de barras ou linha digitável',
            },
            {
              method: 'qrcode',
              icon: faQrcode,
              title: 'Ler QR Code',
              description: 'Escaneie o QR Code do boleto',
            },
            {
              method: 'upload',
              icon: faFileUpload,
              title: 'Upload de Imagem',
              description: 'Envie uma imagem do boleto',
            },
          ].map((item) => (
            <div
              key={item.method}
              className={`boleto-method bg-white dark:bg-slate-700 border ${
                method === item.method
                  ? item.method === 'digitar'
                    ? 'border-primary-300 dark:border-primary-500'
                    : item.method === 'qrcode'
                    ? 'border-blue-300 dark:border-blue-500'
                    : 'border-purple-300 dark:border-purple-500'
                  : 'border-gray-200 dark:border-slate-600'
              } rounded-lg p-4 cursor-pointer shadow-sm hover:border-${
                item.method === 'digitar'
                  ? 'primary-300 dark:hover:border-primary-500'
                  : item.method === 'qrcode'
                  ? 'blue-300 dark:hover:border-blue-500'
                  : 'purple-300 dark:hover:border-purple-500'
              }`}
              onClick={() => setMethod(item.method as 'digitar' | 'qrcode' | 'upload')}
            >
              <div className="flex items-center mb-3">
                <div
                  className={`h-10 w-10 rounded-full ${
                    item.method === 'digitar'
                      ? 'bg-primary-100 dark:bg-slate-600'
                      : item.method === 'qrcode'
                      ? 'bg-blue-100 dark:bg-slate-600'
                      : 'bg-purple-100 dark:bg-slate-600'
                  } flex items-center justify-center mr-3`}
                >
                  <FontAwesomeIcon
                    icon={item.icon}
                    className={`${
                      item.method === 'digitar'
                        ? 'text-primary-600 dark:text-primary-400'
                        : item.method === 'qrcode'
                        ? 'text-blue-600 dark:text-blue-400'
                        : 'text-purple-600 dark:text-purple-400'
                    }`}
                  />
                </div>
                <h3 className="font-medium text-gray-800 dark:text-white">{item.title}</h3>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300">{item.description}</p>
            </div>
          ))}
        </div>
        <div id="digitar-form" className={method === 'digitar' ? '' : 'hidden'}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Código de barras ou linha digitável
            </label>
            <input
              type="text"
              className="bg-gray-50 dark:bg-slate-700 border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-white text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5"
              placeholder="Digite os 44 números do código de barras"
              onChange={(e) => validateBoleto(e.target.value)}
            />
          </div>
          <div className="flex justify-end">
            <button
              className="px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 transition-colors"
              disabled={isValidating}
              onClick={() =>
                validateBoleto(
                  (document.querySelector('#digitar-form input') as HTMLInputElement)?.value || ''
                )
              }
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
            <div className="qr-scanner mb-4">
              <FontAwesomeIcon icon={faCamera} className="text-gray-400 text-4xl" />
            </div>
            <button className="text-sm text-primary-600 dark:text-primary-400 hover:underline">
              Não consegue escanear? Digite o código
            </button>
          </div>
        </div>
        <div id="upload-form" className={method === 'upload' ? '' : 'hidden'}>
          <div
            className="file-upload rounded-lg p-8 text-center mb-4"
            onDragOver={(e) => {
              e.preventDefault();
              e.currentTarget.classList.add('dragover');
            }}
            onDragLeave={(e) => e.currentTarget.classList.remove('dragover')}
            onDrop={(e) => {
              e.preventDefault();
              e.currentTarget.classList.remove('dragover');
              if (e.dataTransfer.files.length) handleFileUpload(e.dataTransfer.files[0]);
            }}
          >
            <div className="flex flex-col items-center justify-center">
              <FontAwesomeIcon icon={faCloudUploadAlt} className="text-3xl text-gray-400 mb-2" />
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">
                Arraste e solte a imagem do boleto aqui
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">ou</p>
              <label
                htmlFor="boleto-input"
                className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium rounded-lg cursor-pointer transition-colors"
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
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">Formatos aceitos: JPG, PNG (máx. 5MB)</p>
          {fileInfo && (
            <div className="mt-4 p-3 bg-gray-50 dark:bg-slate-700 rounded-lg border border-gray-200 dark:border-slate-600">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <FontAwesomeIcon icon={faFileImage} className="text-blue-500 mr-2" />
                  <div>
                    <p className="text-sm font-medium text-gray-800 dark:text-white">{fileInfo.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {(fileInfo.size / 1024 / 1024).toFixed(1)} MB
                    </p>
                  </div>
                </div>
                <button className="text-red-500 hover:text-red-700" onClick={() => setFileInfo(null)}>
                  <FontAwesomeIcon icon={faTimes} />
                </button>
              </div>
            </div>
          )}
          <div className="flex justify-end mt-4">
            <button
              className="px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 transition-colors"
              onClick={() => validateBoleto('sample-code')}
            >
              Validar Boleto
            </button>
          </div>
        </div>
        {boletoInfo && (
          <div id="boleto-info" className="mt-8">
            <div className="bg-gray-50 dark:bg-slate-700 rounded-lg p-4 mb-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-800 dark:text-white">Conta de Energia Elétrica</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{boletoInfo.beneficiary}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500 dark:text-gray-400">Vencimento</p>
                  <p className="text-sm font-medium text-gray-800 dark:text-white">{boletoInfo.dueDate}</p>
                </div>
              </div>
              <div className="barcode mb-4"></div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Código</p>
                  <p className="text-sm font-medium text-gray-800 dark:text-white">{boletoInfo.code}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Nosso Número</p>
                  <p className="text-sm font-medium text-gray-800 dark:text-white">{boletoInfo.nossoNumero}</p>
                </div>
              </div>
              <div className="border-t border-gray-200 dark:border-slate-600 pt-4">
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-600 dark:text-gray-300">Valor</span>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-200">{boletoInfo.amount}</span>
                </div>
                {boletoInfo.fees && (
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-gray-600 dark:text-gray-300">Juros/Multa</span>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-200">{boletoInfo.fees}</span>
                  </div>
                )}
                <div className="flex justify-between border-t border-gray-200 dark:border-slate-600 pt-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Total</span>
                  <span className="text-sm font-bold text-gray-800 dark:text-white">{boletoInfo.total}</span>
                </div>
              </div>
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Conta para débito
              </label>
              <select
                className="bg-gray-50 dark:bg-slate-700 border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-white text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5"
              >
                <option>Conta Corrente • Saldo: R$ 8.742,36</option>
                <option>Cartão de Crédito • Vence em 10/08</option>
              </select>
            </div>
            <div className="mb-6">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500 dark:border-slate-600 dark:bg-slate-700"
                />
                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Agendar pagamento</span>
              </label>
              <div id="schedule-payment" className="hidden mt-3">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Data para pagamento
                </label>
                <input
                  type="date"
                  className="bg-gray-50 dark:bg-slate-700 border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-white text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5"
                />
              </div>
            </div>
            <div className="flex justify-end">
              <button
                className="px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 transition-colors"
                onClick={handlePayBoleto}
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