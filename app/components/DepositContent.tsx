import React, { useState } from 'react';
import { type FileInfo } from '../../types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBarcode,
  faFileUpload,
  faCheckCircle,
  faUniversity,
  faCloudUploadAlt,
  faFilePdf,
  faTimes,
} from '@fortawesome/free-solid-svg-icons';

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
    setShowSuccessModal(true);
  };

  return (
    <div id="deposit-content">
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-6">Realizar Depósito</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
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
              className={`deposit-card bg-white dark:bg-slate-700 border ${
                depositType === card.type
                  ? 'border-primary-300 dark:border-primary-500'
                  : 'border-gray-200 dark:border-slate-600'
              } rounded-lg p-4 cursor-pointer shadow-sm hover:border-primary-300 dark:hover:border-primary-500`}
              onClick={() => setDepositType(card.type as 'boleto' | 'comprovante')}
            >
              <div className="flex items-center mb-3">
                <div className="h-10 w-10 rounded-full bg-primary-100 dark:bg-slate-600 flex items-center justify-center mr-3">
                  <FontAwesomeIcon icon={card.icon} className="text-primary-600 dark:text-primary-400" />
                </div>
                <h3 className="font-medium text-gray-800 dark:text-white">{card.title}</h3>
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
            <div className="bg-gray-50 dark:bg-slate-700 rounded-lg p-4">
              <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-3">Conta de destino</h3>
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-primary-100 dark:bg-slate-600 flex items-center justify-center mr-3">
                  <FontAwesomeIcon icon={faUniversity} className="text-primary-600 dark:text-primary-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800 dark:text-white">Conta Corrente</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Ag. 1234 • C/C 56789-0</p>
                </div>
              </div>
              <div className="mt-4">
                <p className="text-sm text-gray-600 dark:text-gray-300">Titular</p>
                <p className="text-sm font-medium text-gray-800 dark:text-white">João da Silva</p>
              </div>
            </div>
            <div>
              <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-3">Detalhes do depósito</h3>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Valor</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 dark:text-gray-400">R$</span>
                  </div>
                  <input
                    type="text"
                    className="bg-gray-50 dark:bg-slate-700 border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-white text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 p-2.5"
                    placeholder="0,00"
                  />
                </div>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Valor mínimo: R$ 10,00</p>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Descrição (opcional)
                </label>
                <input
                  type="text"
                  className="bg-gray-50 dark:bg-slate-700 border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-white text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5"
                  placeholder="Ex: Depósito para investimentos"
                />
              </div>
            </div>
          </div>
          <div className="mt-8 flex justify-end">
            <button
              className="px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 transition-colors"
              onClick={handleGenerateBoleto}
            >
              Gerar Boleto
            </button>
          </div>
        </div>
        <div id="comprovante-deposit-form" className={depositType === 'comprovante' ? '' : 'hidden'}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 dark:bg-slate-700 rounded-lg p-4">
              <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-3">Conta de destino</h3>
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-primary-100 dark:bg-slate-600 flex items-center justify-center mr-3">
                  <FontAwesomeIcon icon={faUniversity} className="text-primary-600 dark:text-primary-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800 dark:text-white">Conta Corrente</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Ag. 1234 • C/C 56789-0</p>
                </div>
              </div>
              <div className="mt-4">
                <p className="text-sm text-gray-600 dark:text-gray-300">Titular</p>
                <p className="text-sm font-medium text-gray-800 dark:text-white">João da Silva</p>
              </div>
            </div>
            <div>
              <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-3">Enviar comprovante</h3>
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
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">Arraste e solte o arquivo aqui</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">ou</p>
                  <label
                    htmlFor="file-input"
                    className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium rounded-lg cursor-pointer transition-colors"
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
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Formatos aceitos: JPG, PNG ou PDF (máx. 5MB)</p>
              {fileInfo && (
                <div className="mt-4 p-3 bg-gray-50 dark:bg-slate-700 rounded-lg border border-gray-200 dark:border-slate-600">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <FontAwesomeIcon icon={faFilePdf} className="text-red-500 mr-2" />
                      <div>
                        <p className="text-sm font-medium text-gray-800 dark:text-white">{fileInfo.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {(fileInfo.size / 1024 / 1024).toFixed(1)} MB
                        </p>
                      </div>
                    </div>
                    <button
                      className="text-red-500 hover:text-red-700"
                      onClick={() => setFileInfo(null)}
                    >
                      <FontAwesomeIcon icon={faTimes} />
                    </button>
                  </div>
                </div>
              )}
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Valor do depósito
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 dark:text-gray-400">R$</span>
                  </div>
                  <input
                    type="text"
                    className="bg-gray-50 dark:bg-slate-700 border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-white text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 p-2.5"
                    placeholder="0,00"
                  />
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Data do depósito
                </label>
                <input
                  type="date"
                  className="bg-gray-50 dark:bg-slate-700 border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-white text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5"
                />
              </div>
            </div>
          </div>
          <div className="mt-8 flex justify-end">
            <button
              className="px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 transition-colors"
              onClick={handleSubmitComprovante}
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