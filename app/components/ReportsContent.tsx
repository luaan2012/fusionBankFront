import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalculator, faDownload, faInfoCircle } from '@fortawesome/free-solid-svg-icons';

const ReportsContent: React.FC = () => {
  const [investmentType, setInvestmentType] = useState<string>('Renda Fixa (CDB, LCI, LCA)');
  const [investedAmount, setInvestedAmount] = useState<string>(''); // Stores formatted BRL string
  const [applicationDate, setApplicationDate] = useState<string>('');
  const [redemptionDate, setRedemptionDate] = useState<string>('');
  const [showTaxResult, setShowTaxResult] = useState<boolean>(false);
  const [taxResult, setTaxResult] = useState<{
    finalValue: number;
    gain: number;
    taxAmount: number;
    taxRate: number;
    durationDays: number;
    error?: string;
  } | null>(null);

  // Format number to BRL (e.g., "R$ 1.234,56")
  const formatBRL = (value: number | string): string => {
    const num = typeof value === 'string' ? parseFloat(value) : value;
    if (isNaN(num)) return 'R$ 0,00';
    return num.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  // Parse BRL string to raw number (e.g., "R$ 1.234,56" -> 1234.56)
  const parseBRL = (value: string): number => {
    const cleaned = value.replace(/[^\d,]/g, '').replace(',', '.');
    return parseFloat(cleaned) || 0;
  };

  // Handle input change for BRL formatting
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    const rawValue = parseBRL(input);
    if (isNaN(rawValue)) {
      setInvestedAmount('');
    } else {
      setInvestedAmount(formatBRL(rawValue));
    }
  };

  const calculateTax = () => {
    // Reset previous results
    setShowTaxResult(false);
    setTaxResult(null);

    // Parse the formatted invested amount
    const amount = parseBRL(investedAmount);
    if (amount <= 0) {
      setTaxResult({ finalValue: 0, gain: 0, taxAmount: 0, taxRate: 0, durationDays: 0, error: 'Por favor, insira um valor investido válido.' });
      setShowTaxResult(true);
      return;
    }

    if (!applicationDate || !redemptionDate) {
      setTaxResult({ finalValue: 0, gain: 0, taxAmount: 0, taxRate: 0, durationDays: 0, error: 'Por favor, preencha as datas de aplicação e resgate.' });
      setShowTaxResult(true);
      return;
    }

    const appDate = new Date(applicationDate);
    const redDate = new Date(redemptionDate);
    const durationDays = Math.round((redDate.getTime() - appDate.getTime()) / (1000 * 60 * 60 * 24));

    if (durationDays < 0) {
      setTaxResult({ finalValue: 0, gain: 0, taxAmount: 0, taxRate: 0, durationDays: 0, error: 'A data de resgate não pode ser anterior à data de aplicação.' });
      setShowTaxResult(true);
      return;
    }

    // Assume a 10% annual return rate for simulation
    const annualRate = 0.10;
    const years = durationDays / 365;
    const finalValue = amount * Math.pow(1 + annualRate, years);
    const gain = finalValue - amount;

    // Calculate tax based on investment type and duration
    let taxRate = 0;
    let taxAmount = 0;

    if (investmentType === 'Renda Fixa (CDB, LCI, LCA)') {
      if (investmentType.includes('LCI') || investmentType.includes('LCA')) {
        taxRate = 0; // Tax-exempt
      } else {
        // Regressive IR rates for CDB
        if (durationDays <= 180) taxRate = 0.225;
        else if (durationDays <= 360) taxRate = 0.20;
        else if (durationDays <= 720) taxRate = 0.175;
        else taxRate = 0.15;
        taxAmount = gain * taxRate;
      }
    } else if (investmentType === 'Tesouro Direto') {
      if (durationDays <= 180) taxRate = 0.225;
      else if (durationDays <= 360) taxRate = 0.20;
      else if (durationDays <= 720) taxRate = 0.175;
      else taxRate = 0.15;
      taxAmount = gain * taxRate;
    } else if (investmentType === 'Fundos de Investimento') {
      // Assume long-term fund for simplicity
      taxRate = 0.15;
      taxAmount = gain * taxRate;
    } else if (investmentType === 'Ações') {
      // 15% on gains if sale > R$20,000; assuming this sale qualifies
      taxRate = 0.15;
      taxAmount = gain * taxRate;
    } else if (investmentType === 'FIIs') {
      // 20% on gains from share sales; dividends are tax-exempt
      taxRate = 0.20;
      taxAmount = gain * taxRate;
    }

    setTaxResult({
      finalValue: finalValue,
      gain: gain,
      taxAmount: taxAmount,
      taxRate: taxRate * 100, // Convert to percentage
      durationDays: durationDays,
    });
    setShowTaxResult(true);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Calculadora de Impostos</h3>
        <button
          className="px-4 py-2 bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 text-white rounded-lg text-sm font-semibold transition-all duration-200 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          aria-label="Exportar simulação de impostos"
        >
          <FontAwesomeIcon icon={faDownload} className="mr-2" />
          Exportar Simulação
        </button>
      </div>
      <div className="bg-white dark:bg-slate-950 rounded-xl shadow-md p-6 transition-all duration-200">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-base font-semibold text-gray-900 dark:text-gray-100">Simulação de Impostos</h4>
          <FontAwesomeIcon icon={faCalculator} className="text-gray-400 dark:text-gray-500 text-xl" />
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Simule o imposto devido com base no seu investimento.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Tipo de investimento</label>
            <select
              value={investmentType}
              onChange={(e) => setInvestmentType(e.target.value)}
              className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 py-2 pl-4 pr-8 rounded-lg text-sm text-gray-700 dark:text-gray-100 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 appearance-none"
              aria-label="Selecionar tipo de investimento"
            >
              <option>Renda Fixa (CDB, LCI, LCA)</option>
              <option>Tesouro Direto</option>
              <option>Fundos de Investimento</option>
              <option>Ações</option>
              <option>FIIs</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Valor investido</label>
            <input
              type="text"
              value={investedAmount}
              onChange={handleAmountChange}
              className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 py-2 pl-4 pr-4 rounded-lg text-sm text-gray-700 dark:text-gray-100 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              placeholder="R$ 0,00"
              aria-label="Valor investido"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Data de aplicação</label>
            <input
              type="date"
              value={applicationDate}
              onChange={(e) => setApplicationDate(e.target.value)}
              className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 py-2 pl-4 pr-4 rounded-lg text-sm text-gray-700 dark:text-gray-100 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              aria-label="Data de aplicação"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Data de resgate</label>
            <input
              type="date"
              value={redemptionDate}
              onChange={(e) => setRedemptionDate(e.target.value)}
              className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 py-2 pl-4 pr-4 rounded-lg text-sm text-gray-700 dark:text-gray-100 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              aria-label="Data de resgate"
            />
          </div>
        </div>
        <button
          onClick={calculateTax}
          className="mt-4 px-4 py-2 bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 text-white rounded-lg text-sm font-semibold transition-all duration-200 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          aria-label="Calcular imposto"
        >
          Calcular Imposto
        </button>
        {showTaxResult && taxResult && (
          <div className="mt-6 bg-blue-100 dark:bg-blue-900 rounded-lg p-4 animate-fade-in">
            {taxResult.error ? (
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-red-200 dark:bg-red-800 flex items-center justify-center text-red-600 dark:text-red-400 mr-3">
                  <FontAwesomeIcon icon={faInfoCircle} className="text-sm" />
                </div>
                <p className="text-sm font-semibold text-red-700 dark:text-red-300">{taxResult.error}</p>
              </div>
            ) : (
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-blue-200 dark:bg-blue-800 flex items-center justify-center text-blue-600 dark:text-blue-400 mr-3">
                  <FontAwesomeIcon icon={faInfoCircle} className="text-sm" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                    Valor Final: <span className="text-blue-600 dark:text-blue-400">{formatBRL(taxResult.finalValue)}</span>
                  </p>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Rendimento: <span className="text-blue-600 dark:text-blue-400">{formatBRL(taxResult.gain)}</span>
                  </p>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Imposto Devido: <span className="text-blue-600 dark:text-blue-400">{formatBRL(taxResult.taxAmount)}</span>
                  </p>
                  <p className="text-xs text-blue-700 dark:text-blue-300">
                    Alíquota Aplicada: {taxResult.taxRate}% (período de {taxResult.durationDays} dias)
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default ReportsContent;