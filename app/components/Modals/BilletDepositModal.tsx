import { useEffect } from 'react';
import {
  faTimes,
  faDownload,
  faShare,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

interface BoletoDepositModalProps {
  show: boolean;
  onClose: () => void;
}

export const BoletoDepositModal = ({ show, onClose }: BoletoDepositModalProps) => {
  useEffect(() => {
    if (show) {
      const qrCodeContainer = document.getElementById('boleto-qrcode');
      if (qrCodeContainer) {
        qrCodeContainer.innerHTML = '';
        (window as any).QRCode.toCanvas(
          qrCodeContainer,
          '84670000001712340000000000000000000000000000',
          { width: 200 },
          (error: any) => {
            if (error) console.error(error);
          }
        );
      }
    }
  }, [show]);

  if (!show) return null;

  return (
    <div id="boleto-modal" className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-2/3 lg:w-1/2 shadow-lg rounded-md bg-white dark:bg-slate-800 slide-in">
        <div className="flex justify-between items-center border-b border-gray-200 dark:border-slate-700 pb-3 mb-4">
          <h3 className="text-lg font-bold text-gray-800 dark:text-white">Boleto de Depósito</h3>
          <button className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300" onClick={onClose}>
            <FontAwesomeIcon icon={faTimes} className="mr-1" /> 
          </button>
        </div>
        <div className="mb-6">
          <div className="bg-gray-50 dark:bg-slate-700 rounded-lg p-4 mb-4">
            <div className="flex justify-between mb-3">
              <span className="text-sm text-gray-600 dark:text-gray-300">Valor</span>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-200">R$ 0,00</span>
            </div>
            <div className="flex justify-between mb-3">
              <span className="text-sm text-gray-600 dark:text-gray-300">Vencimento</span>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-200">20/08/2023</span>
            </div>
            <div className="flex justify-between border-t border-gray-200 dark:border-slate-600 pt-3">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Código</span>
              <span className="text-sm font-bold text-gray-800 dark:text-white">
                84670000001712340000000000000000000000000000
              </span>
            </div>
          </div>
          <div className="barcode mb-4"></div>
          <div id="boleto-qrcode" className="flex justify-center mb-4"></div>
          <div className="text-center mb-4">
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Este boleto pode ser pago em qualquer banco ou lotérica até a data de vencimento
            </p>
          </div>
          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <button className="px-4 py-2 border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-white font-medium rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-300 transition-colors flex items-center justify-center">
              <FontAwesomeIcon icon={faDownload} className="mr-1" /> Download PDF
            </button>
            <button className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 transition-colors flex items-center justify-center">
              <FontAwesomeIcon icon={faShare} className="mr-1" /> Compartilhar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
