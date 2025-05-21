import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUp, faArrowDown, faChartBar, faBuilding, faChartLine } from '@fortawesome/free-solid-svg-icons';
import { formatPercent, formatToBRL, formatToBRLInput } from '~/utils/utils';
import { useAccountStore } from '~/context/accountStore';
import type { AvailableInvestment } from 'types'

interface BuyInvestmentModalProps {
  isModalOpen: boolean;
  selectedInvestment: AvailableInvestment;
  setIsModalOpen: (open: boolean) => void;
  handleInvest: (amount: number) => void;
}

const BuyInvestmentModal: React.FC<BuyInvestmentModalProps> = ({
  isModalOpen,
  selectedInvestment,
  setIsModalOpen,
  handleInvest,
}) => {
  const { user } = useAccountStore();
  const [amountError, setAmountError] = useState<string>('');
  const [amountWarning, setAmountWarning] = useState<string>('');
  const [investmentAmount, setInvestmentAmount] = useState<string>('');
  const [shares, setShares] = useState<string>('');
  const [inputMode, setInputMode] = useState<'shares' | 'amount'>('shares');

  useEffect(() => {
    setShares('');
    setInvestmentAmount('');
    setAmountError('');
    setAmountWarning('');
    setInputMode('shares');
  }, [selectedInvestment]);

  const correctAmount = (inputAmount: number) => {
    const isStockOrFII = selectedInvestment?.type === 'STOCK' || selectedInvestment?.type === 'FII';
    if (!isStockOrFII || !selectedInvestment?.regularMarketPrice) {
      setInvestmentAmount(inputAmount.toFixed(2));
      return;
    }

    const pricePerShare = selectedInvestment.regularMarketPrice;
    let calculatedShares = Math.floor(inputAmount / pricePerShare);
    let adjustedAmount = calculatedShares * pricePerShare;

    if (inputAmount > 0 && inputAmount < pricePerShare) {
      calculatedShares = 1;
      adjustedAmount = pricePerShare;
      setAmountWarning(
        `O valor mínimo para compra é ${formatToBRL(pricePerShare)}, equivalente a 1 cota.`,
      );
    } else if (calculatedShares > 0 && inputAmount > 0) {
      setAmountWarning(
        `Valor ajustado para ${formatToBRL(adjustedAmount)}, equivalente a ${calculatedShares} cotas.`,
      );
    }

    setShares(calculatedShares > 0 ? calculatedShares.toString() : '');
    setInvestmentAmount(adjustedAmount > 0 ? adjustedAmount.toFixed(2) : '');
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const cleanedValue = e.target.value.replace(/[^\d]/g, '');
    const formatted = cleanedValue.length > 0 ? (parseInt(cleanedValue) / 100).toFixed(2) : '';
    setInvestmentAmount(formatted);
    setAmountError('');
    setAmountWarning('');

    const isStockOrFII = selectedInvestment?.type === 'STOCK' || selectedInvestment?.type === 'FII';
    if (isStockOrFII && formatted && selectedInvestment?.regularMarketPrice) {
      const calculatedShares = Math.floor(parseFloat(formatted) / selectedInvestment.regularMarketPrice).toString();
      setShares(calculatedShares);
    } else {
      setShares('');
    }
  };

  const handleAmountBlur = () => {
    const amount = parseFloat(investmentAmount.replace(',', '.'));
    if (isNaN(amount) || amount <= 0) return;
    correctAmount(amount);
  };

  const handleAmountKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const amount = parseFloat(investmentAmount.replace(',', '.'));
      if (isNaN(amount) || amount <= 0) return;
      correctAmount(amount);
    }
  };

  const handleSharesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^\d]/g, '');
    setShares(value);
    setAmountError('');
    setAmountWarning('');
    if (selectedInvestment?.regularMarketPrice && value) {
      const calculatedAmount = (parseInt(value) * selectedInvestment.regularMarketPrice).toFixed(2);
      setInvestmentAmount(calculatedAmount);
    } else {
      setInvestmentAmount('');
    }
  };

  const handleInputModeChange = (mode: 'shares' | 'amount') => {
    setInputMode(mode);
    setShares('');
    setInvestmentAmount('');
    setAmountError('');
    setAmountWarning('');
  };

  const validateInput = () => {
    if (!investmentAmount || parseFloat(investmentAmount.replace(',', '.')) <= 0) {
      setAmountError('Por favor, insira um valor válido maior que zero.');
      return false;
    }

    const amount = parseFloat(investmentAmount.replace(',', '.'));
    const isStockOrFII = selectedInvestment?.type === 'STOCK' || selectedInvestment?.type === 'FII';

    if (isStockOrFII) {
      if (!shares || parseInt(shares) <= 0) {
        setAmountError('Por favor, insira uma quantidade válida de cotas.');
        return false;
      }
      if (amount < selectedInvestment?.regularMarketPrice) {
        setAmountError(
          `O valor mínimo para compra é ${formatToBRL(selectedInvestment.regularMarketPrice)}, equivalente a 1 cota.`,
        );
        return false;
      }
      const expectedAmount = parseInt(shares) * selectedInvestment.regularMarketPrice;
      if (Math.abs(amount - expectedAmount) > 0.01) {
        setAmountError('O valor deve corresponder a um número inteiro de cotas.');
        return false;
      }
    }

    if (!user?.balance || amount > user.balance) {
      setAmountError('Saldo insuficiente para realizar a compra.');
      return false;
    }

    return true;
  };

  const handleConfirm = () => {
    if (!validateInput()) return;
    const amount = parseFloat(investmentAmount.replace(',', '.'));
    handleInvest(amount);
  };

  const getCategoryColor = (type: string) => {
    switch (type.toUpperCase()) {
      case 'CDB':
        return 'blue';
      case 'STOCK':
      case 'AÇÃO':
        return 'sky';
      case 'FII':
        return 'purple';
      case 'LCI':
        return 'green';
      case 'LCA':
        return 'lime';
      default:
        return 'gray';
    }
  };

  const getTypeIcon = (type: string) => {
    const iconMap: Record<string, any> = {
      CDB: faChartBar,
      FII: faBuilding,
      STOCK: faChartLine,
      LCI: faChartBar,
      LCA: faChartBar,
    };
    return iconMap[type.toUpperCase()] || faChartBar;
  };

  if (!isModalOpen || !selectedInvestment) return null;

  const isStockOrFII = selectedInvestment.type === 'STOCK' || selectedInvestment.type === 'FII';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
      <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-2xl rounded-3xl p-8 w-full max-w-md shadow-2xl transform transition-all duration-500 scale-100 animate-fade-in">
        <div className="flex items-center gap-4 mb-6">
          <div
            className={`p-4 bg-${getCategoryColor(
              selectedInvestment.type
            )}-100/80 dark:bg-${getCategoryColor(
              selectedInvestment.type
            )}-900/80 rounded-full shadow-xl animate-glow`}
          >
            <FontAwesomeIcon
              icon={getTypeIcon(selectedInvestment.type)}
              className={`text-${getCategoryColor(selectedInvestment.type)}-600 dark:text-${getCategoryColor(
                selectedInvestment.type
              )}-400 text-2xl animate-pulse-slow`}
            />
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            Comprar {selectedInvestment.shortName}
          </h3>
        </div>
        <div className="bg-gray-100/60 dark:bg-gray-700/60 p-5 rounded-2xl mb-6 shadow-inner">
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-2 flex justify-between">
            <span>Símbolo:</span>
            <span className="font-semibold">{selectedInvestment.symbol}</span>
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-2 flex justify-between">
            <span>Tipo:</span>
            <span className="font-semibold">{selectedInvestment.type}</span>
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-2 flex justify-between">
            <span>Preço Atual:</span>
            <span className="font-semibold">
              R$ {selectedInvestment.regularMarketPrice.toFixed(2)}
            </span>
          </p>
          {selectedInvestment.regularMarketChangePercent !== undefined && (
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-2 flex justify-between">
              <span>Rentabilidade:</span>
              <span
                className={`font-semibold flex items-center gap-1 ${
                  selectedInvestment.regularMarketChangePercent > 0
                    ? 'text-green-500'
                    : selectedInvestment.regularMarketChangePercent < 0
                    ? 'text-red-500'
                    : 'text-gray-500'
                }`}
              >
                {selectedInvestment.regularMarketChangePercent > 0 ? (
                  <FontAwesomeIcon icon={faArrowUp} className="w-3 h-3" />
                ) : selectedInvestment.regularMarketChangePercent < 0 ? (
                  <FontAwesomeIcon icon={faArrowDown} className="w-3 h-3" />
                ) : (
                  <span className="w-3 h-3" />
                )}
                {formatPercent(selectedInvestment.regularMarketChangePercent)}
              </span>
            </p>
          )}
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-2 flex justify-between">
            <span>Saldo Disponível:</span>
            <span className="font-semibold">{formatToBRL(user?.balance || 0)}</span>
          </p>
        </div>
        <div className="mb-6">
          {isStockOrFII ? (
            <>
              <div className="flex gap-4 mb-4">
                <button
                  onClick={() => handleInputModeChange('shares')}
                  className={`flex-1 py-2 px-4 rounded-lg text-sm font-semibold transition-all duration-300 ${
                    inputMode === 'shares'
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-gray-200/80 dark:bg-gray-600/80 text-gray-900 dark:text-white hover:bg-gray-300/80 dark:hover:bg-gray-500/80'
                  }`}
                >
                  Quantidade de Cotas
                </button>
                <button
                  onClick={() => handleInputModeChange('amount')}
                  className={`flex-1 py-2 px-4 rounded-lg text-sm font-semibold transition-all duration-300 ${
                    inputMode === 'amount'
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-gray-200/80 dark:bg-gray-600/80 text-gray-900 dark:text-white hover:bg-gray-300/80 dark:hover:bg-gray-500/80'
                  }`}
                >
                  Valor Total
                </button>
              </div>
              {inputMode === 'shares' ? (
                <>
                  <label
                    htmlFor="shares"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Quantidade de Cotas
                  </label>
                  <input
                    type="text"
                    id="shares"
                    name="shares"
                    value={shares}
                    onChange={handleSharesChange}
                    placeholder="Digite a quantidade de cotas"
                    className="w-full bg-gray-50/60 dark:bg-gray-800/60 backdrop-blur-sm border border-gray-200/50 dark:border-gray-600/50 rounded-lg py-3 px-4 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 transition-all duration-300 text-sm shadow-inner"
                  />
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 flex justify-between">
                    <span>Valor Total Estimado:</span>
                    <span className="font-semibold">{formatToBRLInput(investmentAmount)}</span>
                  </p>
                </>
              ) : (
                <>
                  <label
                    htmlFor="investmentAmount"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Valor do Investimento (R$)
                  </label>
                  <input
                    type="text"
                    id="investmentAmount"
                    name="investmentAmount"
                    value={formatToBRLInput(investmentAmount)}
                    onChange={handleAmountChange}
                    onBlur={handleAmountBlur}
                    onKeyDown={handleAmountKeyDown}
                    placeholder="Digite o valor para investir"
                    className="w-full bg-gray-50/60 dark:bg-gray-800/60 backdrop-blur-sm border border-gray-200/50 dark:border-gray-600/50 rounded-lg py-3 px-4 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 transition-all duration-300 text-sm shadow-inner"
                  />
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 flex justify-between">
                    <span>Cotas Estimadas:</span>
                    <span className="font-semibold">{shares || '0'}</span>
                  </p>
                </>
              )}
            </>
          ) : (
            <>
              <label
                htmlFor="investmentAmount"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Valor do Investimento (R$)
              </label>
              <input
                type="text"
                id="investmentAmount"
                name="investmentAmount"
                value={formatToBRLInput(investmentAmount)}
                onChange={handleAmountChange}
                placeholder="Digite o valor para investir"
                className="w-full bg-gray-50/60 dark:bg-gray-800/60 backdrop-blur-sm border border-gray-200/50 dark:border-gray-600/50 rounded-lg py-3 px-4 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 transition-all duration-300 text-sm shadow-inner"
              />
            </>
          )}
          {amountError && (
            <p className="text-red-500 text-xs mt-2 animate-shake">{amountError}</p>
          )}
          {amountWarning && (
            <p className="text-yellow-500 text-xs mt-2 animate-pulse">{amountWarning}</p>
          )}
        </div>
        <div className="flex justify-end gap-4">
          <button
            onClick={() => {
              setIsModalOpen(false);
              setShares('');
              setInvestmentAmount('');
              setAmountError('');
              setAmountWarning('');
              setInputMode('shares');
            }}
            className="relative py-2 px-6 bg-gray-200/80 dark:bg-gray-600/80 backdrop-blur-sm text-gray-900 dark:text-white rounded-full hover:bg-gray-300/80 dark:hover:bg-gray-500/80 transition-all duration-300 text-sm font-semibold shadow-md animate-pulse-button overflow-hidden"
          >
            <span className="relative z-10">Cancelar</span>
            <span className="absolute inset-0 bg-white/20 opacity-0 hover:opacity-100 transition-opacity duration-300 animate-ripple"></span>
          </button>
          <button
            onClick={handleConfirm}
            disabled={
              !investmentAmount ||
              parseFloat(investmentAmount.replace(',', '.')) <= 0 ||
              (isStockOrFII && (!shares || parseInt(shares) <= 0))
            }
            className="relative py-2 px-6 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-full hover:from-blue-700 hover:to-cyan-600 transition-all duration-300 disabled:bg-gray-400/80 disabled:cursor-not-allowed text-sm font-semibold shadow-md hover:shadow-xl animate-pulse-button overflow-hidden"
          >
            <span className="relative z-10">Confirmar Compra</span>
            <span className="absolute inset-0 bg-white/20 opacity-0 hover:opacity-100 transition-opacity duration-300 animate-ripple"></span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default BuyInvestmentModal;