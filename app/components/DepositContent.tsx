import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBarcode, faFileUpload, faCheckCircle, faUniversity, faCloudUploadAlt, faFilePdf, faTimes } from '@fortawesome/free-solid-svg-icons';
import { type FileInfo } from '../../types';

interface DepositContentProps {
  setShowBoletoModal: (show: boolean) => void;
  setShowSuccessModal: (show: boolean) => void;
  setShowErrorToast: (message: string) => void;
}

const DepositContent: React.FC<DepositContentProps> = ({
  setShowBoletoModal,
  setShowSuccessModal,
  setShowErrorToast,
}) => {
  const [depositType, setDepositType] = useState<'boleto' | 'comprovante'>('boleto');
  const [fileInfo, setFileInfo] = useState<FileInfo | null>(null);

  const handleFileUpload = (file: File) => {
    const validTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    if (!validTypes.includes(file.type)) {
      setShowErrorToast('Tipo de arquivo inválido. Use JPG, PNG ou PDF.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setShowErrorToast('Arquivo muito grande. Tamanho máximo: 5MB.');
      return;
    }
    setFileInfo({ name: file.name, size: file.size, type: file.type });
  };

  const handleGenerateBoleto = () => {
    setShowBoletoModal(true);
  };

  const handleSubmitComprovante = () => {
    if (!fileInfo) {
      setShowErrorToast('Por favor, envie um comprovante.');
      return;
    }
    setShowSuccessModal(true);
  };

  return (
    <div id="deposit-content">
      <div className="bg-white dark:bg-slate-950 rounded-xl shadow-md p-6 transition-all duration-300 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6">Realizar Depósito</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8" role="radiogroup" aria-label="Selecionar tipo de depósito">
          {[
            {
              type: 'boleto',
              icon: faBarcode,
              title: 'Boleto de Depósito',
              description: 'Gere um boleto para depósito em qualquer banco',
              details: ['Validade: 3 dias úteis', 'Sem custo', 'Crédito em até 1 dia útil após pagamento'],
            },
            {
              type: 'comprovante',
              icon: faFileUpload,
              title: 'Comprovante',
              description: 'Envie o comprovante de depósito realizado em outro banco',
              details: ['Formatos: JPG, PNG ou PDF', 'Tamanho máximo: 5MB', 'Crédito em até 2 dias úteis após análise'],
            },
          ].map((card) => (
            <div
              key={card.type}
              className={`deposit-card bg-white dark:bg-slate-800 border rounded-xl p-4 cursor-pointer shadow-sm hover:shadow-md transition-all duration-200 ${
                depositType === card.type
                  ? 'border-blue-300 dark:border-blue-500'
                  : 'border-gray-200 dark:border-gray-700'
              }`}
              onClick={() => setDepositType(card.type as 'boleto' | 'comprovante')}
              role="radio"
              aria-checked={depositType === card.type}
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && setDepositType(card.type as 'boleto' | 'comprovante')}
            >
              <div className="flex items-center mb-3">
                <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mr-3">
                  <FontAwesomeIcon icon={card.icon} className="text-blue-600 dark:text-blue-400 text-lg" />
                </div>
                <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">{card.title}</h3>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">{card.description}</p>
              <ul className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
                {card.details.map((detail, index) => (
                  <li key={index} className="flex items-center">
                    <FontAwesomeIcon icon={faCheckCircle} className="text-green-500 mr-2" />
                    {detail}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div id="boleto-deposit-form" className={depositType === 'boleto' ? '' : 'hidden'}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
              <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-3">Conta de destino</h3>
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mr-3">
                  <FontAwesomeIcon icon={faUniversity} className="text-blue-600 dark:text-blue-400 text-lg" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">Conta Corrente</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Ag. 1234 • C/C 56789-0</p>
                </div>
              </div>
              <div className="mt-4">
                <p className="text-sm text-gray-600 dark:text-gray-300">Titular</p>
                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">João da Silva</p>
              </div>
            </div>
            <div>
              <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-3">Detalhes do depósito</h3>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="boleto-amount">
                  Valor
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 dark:text-gray-400">R$</span>
                  </div>
                  <input
                    id="boleto-amount"
                    type="text"
                    className="bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-100 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 py-3 transition-all duration-200"
                    placeholder="0,00"
                    aria-label="Valor do depósito"
                  />
                </div>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Valor mínimo: R$ 10,00</p>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="boleto-description">
                  Descrição (opcional)
                </label>
                <input
                  id="boleto-description"
                  type="text"
                  className="bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-100 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full py-3 transition-all duration-200"
                  placeholder="Ex: Depósito para investimentos"
                  aria-label="Descrição do depósito"
                />
              </div>
            </div>
          </div>
          <div className="mt-8 flex justify-end">
            <button
              className="px-6 py-2.5 bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 text-white rounded-lg text-sm font-semibold transition-all duration-200 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              onClick={handleGenerateBoleto}
              aria-label="Gerar boleto de depósito"
            >
              Gerar Boleto
            </button>
          </div>
        </div>
        <div id="comprovante-deposit-form" className={depositType === 'comprovante' ? '' : 'hidden'}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
              <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-3">Conta de destino</h3>
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mr-3">
                  <FontAwesomeIcon icon={faUniversity} className="text-blue-600 dark:text-blue-400 text-lg" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">Conta Corrente</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Ag. 1234 • C/C 56789-0</p>
                </div>
              </div>
              <div className="mt-4">
                <p className="text-sm text-gray-600 dark:text-gray-300">Titular</p>
                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">João da Silva</p>
              </div>
            </div>
            <div>
              <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-3">Enviar comprovante</h3>
              <div
                className="file-upload rounded-xl p-8 text-center mb-4 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 transition-all duration-200"
                onDragOver={(e) => {
                  e.preventDefault();
                  e.currentTarget.classList.add('bg-blue-50', 'dark:bg-blue-900', 'border-blue-500');
                }}
                onDragLeave={(e) => {
                  e.currentTarget.classList.remove('bg-blue-50', 'dark:bg-blue-900', 'border-blue-500');
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  e.currentTarget.classList.remove('bg-blue-50', 'dark:bg-blue-900', 'border-blue-500');
                  if (e.dataTransfer.files.length) handleFileUpload(e.dataTransfer.files[0]);
                }}
                aria-describedby="file-upload-description"
              >
                <div className="flex flex-col items-center justify-center">
                  <FontAwesomeIcon icon={faCloudUploadAlt} className="text-3xl text-gray-400 mb-2" />
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">Arraste e solte o arquivo aqui</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">ou</p>
                  <label
                    htmlFor="file-input"
                    className="px-4 py-2 bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 text-white rounded-lg text-sm font-semibold cursor-pointer transition-all duration-200"
                    aria-label="Selecionar arquivo"
                  >
                    Selecione o arquivo
                  </label>
                  <input
                    id="file-input"
                    type="file"
                    className="hidden"
                    accept="image/*,.pdf"
                    onChange={(e) => e.target.files && handleFileUpload(e.target.files[0])}
                  />
                </div>
                <p id="file-upload-description" className="sr-only">
                  Arraste e solte ou selecione um arquivo JPG, PNG ou PDF com tamanho máximo de 5MB.
                </p>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Formatos aceitos: JPG, PNG ou PDF (máx. 5MB)</p>
              {fileInfo && (
                <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <FontAwesomeIcon icon={faFilePdf} className="text-red-500 mr-2" />
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
                      aria-label="Remover arquivo"
                    >
                      <FontAwesomeIcon icon={faTimes} />
                    </button>
                  </div>
                </div>
              )}
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="comprovante-amount">
                  Valor do depósito
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 dark:text-gray-400">R$</span>
                  </div>
                  <input
                    id="comprovante-amount"
                    type="text"
                    className="bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-100 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 py-3 transition-all duration-200"
                    placeholder="0,00"
                    aria-label="Valor do depósito"
                  />
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="deposit-date">
                  Data do depósito
                </label>
                <input
                  id="deposit-date"
                  type="date"
                  className="bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-100 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full py-3 transition-all duration-200"
                  aria-label="Data do depósito"
                />
              </div>
            </div>
          </div>
          <div className="mt-8 flex justify-end">
            <button
              className="px-6 py-2.5 bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 text-white rounded-lg text-sm font-semibold transition-all duration-200 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              onClick={handleSubmitComprovante}
              aria-label="Enviar comprovante"
            >
              Enviar Comprovante
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DepositContent;