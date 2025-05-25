import React, { useState, useEffect, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUp, faArrowDown, faChartBar, faBuilding, faChartLine } from '@fortawesome/free-solid-svg-icons';
import type { Asset } from '~/types/investment'
import { formatPercent, formatToBRL, formatToBRLInput } from '~/utils/util'

interface RedeemInvestmentModalProps {
  isModalOpen: boolean;
  selectedInvestment: Asset | null;
  setIsModalOpen: (open: boolean) => void;
  handleInvest: (amount: number) => void;
}

export const RedeemInvestmentModal = ({
  isModalOpen,
  selectedInvestment,
  setIsModalOpen,
  handleInvest,
}: RedeemInvestmentModalProps) => {
  const [amountError, setAmountError] = useState<string>('');
  const [amountWarning, setAmountWarning] = useState<string>('');
  const [investmentAmount, setInvestmentAmount] = useState<string>('');
  const [shares, setShares] = useState<string>('');
  const [inputMode, setInputMode] = useState<'shares' | 'amount'>('shares');
  const [redeemAll, setRedeemAll] = useState<boolean>(false);

  // Função para preencher os campos automaticamente quando "Resgatar Tudo" é selecionado
  const fillRedeemAll = useCallback(() => {
    if (!redeemAll) {
      setShares('');
      setInvestmentAmount('');
      return;
    }

    if (!selectedInvestment) return;

    const isStockOrFII = selectedInvestment.type === 'STOCK' || selectedInvestment.type === 'FII';
    
    // Sempre usar totalBalance como base para o resgate total
    if (selectedInvestment.totalBalance) {
      setInvestmentAmount(selectedInvestment.totalBalance.toFixed(2));
      if (isStockOrFII && selectedInvestment.ownedShares) {
        setShares(selectedInvestment.ownedShares.toString());
      }
    }
  }, [selectedInvestment, redeemAll]);

  // Redefine os estados quando o investimento selecionado muda
  useEffect(() => {
    setShares('');
    setInvestmentAmount('');
    setAmountError('');
    setAmountWarning('');
    setInputMode('shares');
    setRedeemAll(false);
  }, [selectedInvestment]);

  // Preenche automaticamente quando redeemAll muda
  useEffect(() => {
    fillRedeemAll();
  }, [fillRedeemAll]);

  const correctAmount = (inputAmount: number) => {
    const isStockOrFII = selectedInvestment?.type === 'STOCK' || selectedInvestment?.type === 'FII';
    
    if (!isStockOrFII || !selectedInvestment?.regularMarketPrice) {
      setInvestmentAmount(inputAmount.toFixed(2));
      return;
    }

    const pricePerShare = selectedInvestment.regularMarketPrice;
    const maxBalance = selectedInvestment.totalBalance || 0;
    
    // Ajustar o valor para não exceder o totalBalance
    if (inputAmount > maxBalance) {
      setInvestmentAmount(maxBalance.toFixed(2));
      setAmountWarning(`O valor máximo disponível é ${formatToBRL(maxBalance)}.`);
      if (selectedInvestment.ownedShares) {
        setShares(selectedInvestment.ownedShares.toString());
      }
      return;
    }

    // Calcular cotas apenas para exibição, mas permitir resgate até totalBalance
    const calculatedShares = Math.floor(inputAmount / pricePerShare);
    const adjustedAmount = calculatedShares * pricePerShare;

    if (calculatedShares > 0 && inputAmount > 0) {
      setAmountWarning(
        `Valor ajustado para ${formatToBRL(adjustedAmount)}, equivalente a ${calculatedShares} cotas. O valor total disponível é ${formatToBRL(maxBalance)}.`
      );
    }

    setShares(calculatedShares > 0 ? calculatedShares.toString() : '');
    setInvestmentAmount(inputAmount.toFixed(2));
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (redeemAll) return;
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
    if (redeemAll) return;
    const amount = parseFloat(investmentAmount.replace(',', '.'));
    if (isNaN(amount) || amount <= 0) return;
    correctAmount(amount);
  };

  const handleAmountKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (redeemAll) return;
    if (e.key === 'Enter') {
      const amount = parseFloat(investmentAmount.replace(',', '.'));
      if (isNaN(amount) || amount <= 0) return;
      correctAmount(amount);
    }
  };

  const handleSharesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (redeemAll) return;
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
    if (redeemAll) return;
    setInputMode(mode);
    setShares('');
    setInvestmentAmount('');
    setAmountError('');
    setAmountWarning('');
  };

  const handleRedeemAllChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setRedeemAll(checked);
  };

  const validateInput = () => {
    if (!investmentAmount || parseFloat(investmentAmount.replace(',', '.')) <= 0) {
      setAmountError('Por favor, insira um valor válido maior que zero.');
      return false;
    }

    const amount = parseFloat(investmentAmount.replace(',', '.'));
    const isStockOrFII = selectedInvestment?.type === 'STOCK' || selectedInvestment?.type === 'FII';

    // Validar com base no totalBalance, mesmo para STOCK ou FII
    if (!selectedInvestment?.totalBalance || amount > selectedInvestment.totalBalance) {
      setAmountError('Você não possui saldo suficiente deste investimento para resgatar.');
      return false;
    }

    if (isStockOrFII && inputMode === 'shares') {
      if (!shares || parseInt(shares) <= 0) {
        setAmountError('Por favor, insira uma quantidade válida de cotas.');
        return false;
      }
      const sharesToSell = parseInt(shares);
      if (!selectedInvestment?.ownedShares || sharesToSell > selectedInvestment.ownedShares) {
        setAmountError('Você não possui cotas suficientes para vender.');
        return false;
      }
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
            Resgatar {selectedInvestment.shortName}
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
          {isStockOrFII && (
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-2 flex justify-between">
              <span>Cotas Disponíveis:</span>
              <span className="font-semibold">{selectedInvestment.ownedShares || 0}</span>
            </p>
          )}
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-2 flex justify-between">
            <span>Saldo Disponível:</span>
            <span className="font-semibold">{formatToBRL(selectedInvestment.totalBalance || 0)}</span>
          </p>
        </div>
        <div className="mb-4">
          <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
            <input
              type="checkbox"
              checked={redeemAll}
              onChange={handleRedeemAllChange}
              className="form-checkbox h-4 w-4 text-blue-600"
            />
            Resgatar Tudo
          </label>
        </div>
        <div className="mb-6">
          {isStockOrFII ? (
            <>
              <div className="flex gap-4 mb-4">
                <button
                  onClick={() => handleInputModeChange('shares')}
                  disabled={redeemAll}
                  className={`flex-1 py-2 px-4 rounded-lg text-sm font-semibold transition-all duration-300 ${
                    inputMode === 'shares' && !redeemAll
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-gray-200/80 dark:bg-gray-600/80 text-gray-900 dark:text-white hover:bg-gray-300/80 dark:hover:bg-gray-500/80'
                  } ${redeemAll ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  Quantidade de Cotas
                </button>
                <button
                  onClick={() => handleInputModeChange('amount')}
                  disabled={redeemAll}
                  className={`flex-1 py-2 px-4 rounded-lg text-sm font-semibold transition-all duration-300 ${
                    inputMode === 'amount' && !redeemAll
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-gray-200/80 dark:bg-gray-600/80 text-gray-900 dark:text-white hover:bg-gray-300/80 dark:hover:bg-gray-500/80'
                  } ${redeemAll ? 'opacity-50 cursor-not-allowed' : ''}`}
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
                    disabled={redeemAll}
                    placeholder="Digite a quantidade de cotas"
                    className={`w-full bg-gray-50/60 dark:bg-gray-800/60 backdrop-blur-sm border border-gray-200/50 dark:border-gray-600/50 rounded-lg py-3 px-4 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 transition-all duration-300 text-sm shadow-inner ${
                      redeemAll ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
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
                    Valor do Resgate (R$)
                  </label>
                  <input
                    type="text"
                    id="investmentAmount"
                    name="investmentAmount"
                    value={formatToBRLInput(investmentAmount)}
                    onChange={handleAmountChange}
                    onBlur={handleAmountBlur}
                    onKeyDown={handleAmountKeyDown}
                    disabled={redeemAll}
                    placeholder="Digite o valor para resgatar"
                    className={`w-full bg-gray-50/60 dark:bg-gray-800/60 backdrop-blur-sm border border-gray-200/50 dark:border-gray-600/50 rounded-lg py-3 px-4 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 transition-all duration-300 text-sm shadow-inner ${
                      redeemAll ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  />
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 flex justify-between">
                    <span>Cotas Estimadas:</span>
                    <span className="font-semibold">{shares || '0'}</span>
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 flex justify-between">
                    <span>Saldo Total Disponível:</span>
                    <span className="font-semibold">{formatToBRL(selectedInvestment.totalBalance || 0)}</span>
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
                Valor do Resgate (R$)
              </label>
              <input
                type="text"
                id="investmentAmount"
                name="investmentAmount"
                value={formatToBRLInput(investmentAmount)}
                onChange={handleAmountChange}
                disabled={redeemAll}
                placeholder="Digite o valor para resgatar"
                className={`w-full bg-gray-50/60 dark:bg-gray-800/60 backdrop-blur-sm border border-gray-200/50 dark:border-gray-600/50 rounded-lg py-3 px-4 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 transition-all duration-300 text-sm shadow-inner ${
                  redeemAll ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              />
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 flex justify-between">
                <span>Saldo Total Disponível:</span>
                <span className="font-semibold">{formatToBRL(selectedInvestment.totalBalance || 0)}</span>
              </p>
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
              setRedeemAll(false);
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
              (isStockOrFII && inputMode === 'shares' && (!shares || parseInt(shares) <= 0))
            }
            className="relative py-2 px-6 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-full hover:from-blue-700 hover:to-cyan-600 transition-all duration-300 disabled:bg-gray-400/80 disabled:cursor-not-allowed text-sm font-semibold shadow-md hover:shadow-xl animate-pulse-button overflow-hidden"
          >
            <span className="relative z-10">Confirmar Resgate</span>
            <span className="absolute inset-0 bg-white/20 opacity-0 hover:opacity-100 transition-opacity duration-300 animate-ripple"></span>
          </button>
        </div>
      </div>
    </div>
  );
};