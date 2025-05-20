import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSearch,
  faInfoCircle,
  faChartLine,
  faBuilding,
  faUniversity,
  faHome,
  faBalanceScale,
  faArrowDown,
  faArrowUp,
} from '@fortawesome/free-solid-svg-icons';
import { useInvestmentStore } from '~/context/investmentStore';
import { useAccountStore } from '~/context/accountStore';
import type { InvestmentRequest } from '~/models/request/investmentRequest';
import { formatDateShort, formatPercent, formatToBRLInput } from '~/utils/utils'
import type { InvestmentType } from '~/models/enum/investmentType'
import LoadingOverlay from './LoadingOverlay'
import type { AvailableInvestment, ConfirmationDetails } from 'types'
import { ConfirmationModalTransaction } from './ConfirmationModalTransaction'
import { useToast } from './ToastContext'

const InvestmentDashboard: React.FC = () => {
  const {
    availableInvestment,
    loadingBuying,
    loadingInvestment,
    error,
    availableInvestments,
    handleInvestment,
    createInvest,
  } = useInvestmentStore();
  const { user, updateLocalUser } = useAccountStore();
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedInvestment, setSelectedInvestment] = useState<AvailableInvestment>(null);
  const [investmentAmount, setInvestmentAmount] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [amountError, setAmountError] = useState<string>('');
  const [displayCount, setDisplayCount] = useState<number>(6);
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
  const [isModalTransactionOpen, setIsModalTransactionOpen] = useState(false);
  const [details, setDetails] = useState<ConfirmationDetails | null>();
  const [investmentRequest, setInvestmentRequest] = useState<InvestmentRequest | null>();
  const { openToast } = useToast()

  useEffect(() => {
    if(user) {
      availableInvestments(user?.accountId);
    }
  }, [availableInvestments, user]);

  const categories = ['Todos', 'Stock', 'FII', 'CDB', 'LCI', 'LCA', 'Fundo'];

  const suggestedInvestments = availableInvestment
    .filter((inv: AvailableInvestment) => inv.regularMarketPrice > 0)
    .sort((a: AvailableInvestment, b: AvailableInvestment) => b.regularMarketPrice - a.regularMarketPrice)
    .slice(0, 3);

  const filteredInvestments = availableInvestment
    .filter(
      (inv: AvailableInvestment) =>
        (selectedCategory === 'Todos' || inv.type === selectedCategory) &&
        (inv.shortName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          inv.symbol.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .slice(0, displayCount);

  const totalFilteredCount = availableInvestment.filter(
    (inv: AvailableInvestment) => selectedCategory === 'Todos' || inv.type === selectedCategory
  ).length;

  const handleInvest = async () => {
    if (!selectedInvestment || !investmentAmount) return;
    const amount = parseFloat(investmentAmount);
    if (amount <= 0) {
      setAmountError('O valor deve ser maior que 0');
      return;
    }
    const investmentRequest: InvestmentRequest = {
      accountId: user.accountId,
      amount,
      symbol: selectedInvestment.symbol,
      investmentType: selectedInvestment.type as InvestmentType,
    };

    const detailsModal: ConfirmationDetails = { 
      transactionType: 'investment',
        amount: formatToBRLInput(investmentAmount),
        tax: 'R$ 0,00',
        total: formatToBRLInput(investmentAmount),
        details: {
          fundName: selectedInvestment.shortName,
          applicationDate: formatDateShort(Date.now().toString()),
        },
    }
      setDetails(detailsModal)
      setIsModalTransactionOpen(true);
      setInvestmentRequest(investmentRequest);
  }

  const handleModalConfirm = async (passwordTransaction: string) => {

    if(passwordTransaction != user.passwordTransaction){
      openToast({
        message: 'Senha de transação inválida',
        type: 'error',
        duration: 4000,
        position: 'top-right'
      });
      return;
    }

    if(selectedInvestment.onMyPocket) {
      const handleSuccess = await handleInvestment(user.accountId, selectedInvestment.id, investmentRequest.amount)

          setIsModalOpen(false);
          setInvestmentAmount('');
          setSelectedInvestment(null);
          setIsModalTransactionOpen(false)
          setAmountError('');
      return
    }
    
    const success = await createInvest(investmentRequest);

    if (success) {
      setIsModalOpen(false);
      setInvestmentAmount('');
      setSelectedInvestment(null);
      setIsModalTransactionOpen(false)
      setAmountError('');
      updateLocalUser('balance', user.balance - investmentRequest.amount)
    }

    setIsModalOpen(false);
    setInvestmentAmount('');
    setSelectedInvestment(null);
    setIsModalTransactionOpen(false)
    setAmountError('');
  }

  const handleReset = () => {
    setIsModalTransactionOpen(false)
    setSelectedInvestment(null)
    setInvestmentAmount(null)
  }

  const getCategoryColor = (type: string): string => {
    switch (type) {
      case 'Stock':
        return 'green'; // Renda Variável
      case 'FII':
        return 'purple'; // Fundos Imobiliários
      case 'CDB':
      case 'LCI':
      case 'LCA':
        return 'blue'; // Renda Fixa
      default:
        return 'indigo'; // Fundos
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Stock':
        return faChartLine;
      case 'FII':
        return faBuilding;
      case 'CDB':
        return faUniversity;
      case 'LCI':
      case 'LCA':
        return faHome;
      default:
        return faBalanceScale;
    }
  };

  const getTypeDescription = (type: string): string => {
    switch (type) {
      case 'Stock':
        return 'Ações com potencial de altos retornos e maior risco.';
      case 'FII':
        return 'Fundos imobiliários com renda de aluguéis.';
      case 'CDB':
        return 'Renda fixa com liquidez diária ou a prazo.';
      case 'LCI':
        return 'Investimento isento de IR para crédito imobiliário.';
      case 'LCA':
        return 'Investimento isento de IR para crédito do agronegócio.';
      default:
        return 'Fundo diversificado gerido por profissionais.';
    }
  };

  return (
    <div className="relative bg-gradient-to-br from-gray-50 via-white to-cyan-200/60 dark:from-gray-900 dark:via-gray-800 dark:to-cyan-900/60 min-h-screen p-6 md:p-8 overflow-hidden">
      {/* Particle Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute w-72 h-72 bg-cyan-300/20 dark:bg-cyan-800/30 rounded-full blur-3xl top-0 left-0 animate-float"></div>
        <div className="absolute w-96 h-96 bg-indigo-300/20 dark:bg-indigo-800/30 rounded-full blur-3xl bottom-10 right-10 animate-float-slow"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header Section: Title and Sidebar */}
        <div className="flex flex-col md:flex-row md:items-start gap-6 mb-10">
          {/* Title */}
          <div className="flex-1">
            <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500 dark:from-blue-400 dark:to-cyan-300 leading-tight">
              Descubra Oportunidades Únicas
            </h1>
          </div>

          {/* Right Sidebar */}
          <div className="w-full md:w-56 bg-white/80 dark:bg-gray-800/80 backdrop-blur-2xl rounded-2xl p-4 shadow-xl order-first md:order-last">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Filtrar Investimentos
            </h2>
            <div className="space-y-3">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Busque por nome ou símbolo..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-transparent border border-gray-200/50 dark:border-gray-700/50 rounded-full py-2 pl-10 pr-4 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 transition-all duration-300 text-sm shadow-inner"
                />
                <FontAwesomeIcon
                  icon={faSearch}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm"
                />
              </div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full bg-transparent border border-gray-200/50 dark:border-gray-700/50 rounded-full py-2 px-4 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 transition-all duration-300 text-sm shadow-inner appearance-none"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat === 'Todos' ? 'Todas Categorias' : cat}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Main Content: Listings */}
        <div>
          {loadingInvestment && (
            <div className="flex justify-center py-16">
              <div className="w-full">
                <div className="animate-pulse space-y-6">
                  <div className="h-6 bg-gray-200/50 dark:bg-gray-700/50 rounded-xl"></div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="h-56 bg-gray-200/50 dark:bg-gray-700/50 rounded-3xl"
                      ></div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
          {error && (
            <div className="bg-red-100/80 backdrop-blur-md text-red-700 p-4 rounded-2xl mb-8 text-sm shadow-lg">
              {error.toString()}
            </div>
          )}

          {/* Available Investments */}
          <div className="mb-16">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
              Todos os Investimentos
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {filteredInvestments.map((inv: AvailableInvestment, index: number) => (
                <div
                  key={inv.symbol}
                  className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl shadow-xl p-6 hover:shadow-2xl transition-all duration-500 transform hover:scale-105 border border-gray-100/50 dark:border-gray-700/20"
                  style={{ animation: `fadeInUp 0.4s ease-out ${index * 0.05}s both` }}
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div
                      className={`p-3 bg-${getCategoryColor(
                        inv.type
                      )}-100/80 dark:bg-${getCategoryColor(
                        inv.type
                      )}-900/80 rounded-full shadow-lg hover:shadow-xl transition-shadow duration-300 animate-glow`}
                    >
                      <img
                        src={inv.logourl || 'https://icons.brapi.dev/icons/BRAPI.svg'}
                        alt={`${inv.shortName} Logo`}
                        className="investment-icon"
                      />
                      {/* <FontAwesomeIcon
                        icon={getTypeIcon(inv.type)}
                        className={`text-${getCategoryColor(inv.type)}-600 dark:text-${getCategoryColor(
                          inv.type
                        )}-400 text-xl animate-pulse-slow`}
                      /> */}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                        {inv.shortName}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{inv.symbol}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Preço</p>
                      <p className="text-blue-600 dark:text-blue-400 font-semibold text-sm">
                        R$ {inv.regularMarketPrice.toFixed(2)}
                      </p>
                    </div>
                    {inv.regularMarketChangePercent !== undefined && (
                      <div className="mb-2">
                        <p className="text-sm text-gray-600 dark:text-gray-300">Rentabilidade:</p>
                        <p
                          className={`text-sm font-semibold flex items-center gap-1 ${
                            inv.regularMarketChangePercent > 0
                              ? 'text-green-500'
                              : inv.regularMarketChangePercent < 0
                              ? 'text-red-500'
                              : 'text-gray-500'
                          }`}
                        >
                          {inv.regularMarketChangePercent > 0 ? (
                            <FontAwesomeIcon icon={faArrowUp} className="w-3 h-3" />
                          ) : inv.regularMarketChangePercent < 0 ? (
                            <FontAwesomeIcon icon={faArrowDown} className="w-3 h-3" />
                          ) : (
                            <span className="w-3 h-3" />
                          )}
                          {formatPercent(inv.regularMarketChangePercent)}
                        </p>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <FontAwesomeIcon
                      icon={faInfoCircle}
                      className="text-gray-400 cursor-help text-sm hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
                      title={getTypeDescription(inv.type)}
                    />
                    <button
                      onClick={() => {
                        console.log(inv)
                        setSelectedInvestment(inv);
                        setIsModalOpen(true);
                      }}
                      className={`relative py-2 px-5 bg-gradient-to-r from-${getCategoryColor(
                        inv.type
                      )}-600 to-${getCategoryColor(
                        inv.type
                      )}-500 dark:from-${getCategoryColor(
                        inv.type
                      )}-500 dark:to-${getCategoryColor(
                        inv.type
                      )}-400 text-white rounded-full hover:from-${getCategoryColor(
                        inv.type
                      )}-700 hover:to-${getCategoryColor(
                        inv.type
                      )}-600 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-${getCategoryColor(
                        inv.type
                      )}-400 text-sm font-semibold shadow-md hover:shadow-xl animate-pulse-button overflow-hidden`}
                    >
                      <span className="relative z-10">Investir Agora</span>
                      <span className="absolute inset-0 bg-white/20 opacity-0 hover:opacity-100 transition-opacity duration-300 animate-ripple"></span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
            {filteredInvestments.length < totalFilteredCount && (
              <div className="flex justify-center mt-12">
                <button
                  onClick={() => setDisplayCount(displayCount + 6)}
                  className="relative py-3 px-8 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-full hover:from-blue-700 hover:to-cyan-600 transition-all duration-300 text-sm font-semibold shadow-lg hover:shadow-2xl animate-glow overflow-hidden"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    Mostrar Mais
                    <FontAwesomeIcon icon={faArrowDown} className="text-xs animate-bounce" />
                  </span>
                  <span className="absolute inset-0 bg-white/20 opacity-0 hover:opacity-100 transition-opacity duration-300 animate-ripple"></span>
                  <svg
                    className="absolute inset-0 -z-10"
                    width="100%"
                    height="100%"
                    viewBox="0 0 100 100"
                    preserveAspectRatio="none"
                  >
                    <circle
                      cx="50"
                      cy="50"
                      r="48"
                      fill="none"
                      stroke="rgba(255,255,255,0.4)"
                      strokeWidth="4"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="48"
                      fill="none"
                      stroke="rgba(6,182,212,0.9)"
                      strokeWidth="4"
                      strokeDasharray="301.59"
                      strokeDashoffset={301.59 * (1 - filteredInvestments.length / totalFilteredCount)}
                      transform="rotate(-90 50 50)"
                    />
                  </svg>
                </button>
              </div>
            )}
          </div>

          {/* Suggested Investments */}
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
              Seleção Premium para Você
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {suggestedInvestments.map((inv: AvailableInvestment, index: number) => (
                <div
                  key={inv.symbol}
                  className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl shadow-xl p-6 hover:shadow-2xl transition-all duration-500 transform hover:scale-105 border border-gray-100/50 dark:border-gray-700/20"
                  style={{ animation: `fadeInUp 0.4s ease-out ${index * 0.1}s both` }}
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div
                      className={`p-3 bg-${getCategoryColor(
                        inv.type
                      )}-100/80 dark:bg-${getCategoryColor(
                        inv.type
                      )}-900/80 rounded-full shadow-lg hover:shadow-xl transition-shadow duration-300 animate-glow`}
                    >
                      <img
                        src={inv.logourl || 'https://icons.brapi.dev/icons/BRAPI.svg'}
                        alt={`${inv.shortName} Logo`}
                        className="investment-icon"
                      />
                      {/* <FontAwesomeIcon
                        icon={getTypeIcon(inv.type)}
                        className={`text-${getCategoryColor(inv.type)}-600 dark:text-${getCategoryColor(
                          inv.type
                        )}-400 text-xl animate-pulse-slow`}
                      /> */}

                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                        {inv.shortName}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{inv.symbol}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Preço</p>
                      <p className="text-blue-600 dark:text-blue-400 font-semibold text-sm">
                        R$ {inv.regularMarketPrice.toFixed(2)}
                      </p>
                    </div>
                    {inv.regularMarketChangePercent !== undefined && (
                      <div className="mb-2">
                        <p className="text-sm text-gray-600 dark:text-gray-300">Rentabilidade:</p>
                        <p
                          className={`text-sm font-semibold flex items-center gap-1 ${
                            inv.regularMarketChangePercent > 0
                              ? 'text-green-500'
                              : inv.regularMarketChangePercent < 0
                              ? 'text-red-500'
                              : 'text-gray-500'
                          }`}
                        >
                          {inv.regularMarketChangePercent > 0 ? (
                            <FontAwesomeIcon icon={faArrowUp} className="w-3 h-3" />
                          ) : inv.regularMarketChangePercent < 0 ? (
                            <FontAwesomeIcon icon={faArrowDown} className="w-3 h-3" />
                          ) : (
                            <span className="w-3 h-3" />
                          )}
                          {formatPercent(inv.regularMarketChangePercent)}
                        </p>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <FontAwesomeIcon
                      icon={faInfoCircle}
                      className="text-gray-400 cursor-help text-sm hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
                      title={getTypeDescription(inv.type)}
                    />
                    <button
                      onClick={() => {
                        setSelectedInvestment(inv);
                        setIsModalOpen(true);
                      }}
                      className={`relative py-2 px-5 bg-gradient-to-r from-${getCategoryColor(
                        inv.type
                      )}-600 to-${getCategoryColor(
                        inv.type
                      )}-500 dark:from-${getCategoryColor(
                        inv.type
                      )}-500 dark:to-${getCategoryColor(
                        inv.type
                      )}-400 text-white rounded-full hover:from-${getCategoryColor(
                        inv.type
                      )}-700 hover:to-${getCategoryColor(
                        inv.type
                      )}-600 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-${getCategoryColor(
                        inv.type
                      )}-400 text-sm font-semibold shadow-md hover:shadow-xl animate-pulse-button overflow-hidden`}
                    >
                      <span className="relative z-10">Investir Agora</span>
                      <span className="absolute inset-0 bg-white/20 opacity-0 hover:opacity-100 transition-opacity duration-300 animate-ripple"></span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Investment Modal */}
        {isModalOpen && selectedInvestment && (
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
                  Investir em {selectedInvestment.shortName}
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
                        <span className="w-3 h-3" /> // Espaço reservado para alinhamento
                      )}
                      {formatPercent(selectedInvestment.regularMarketChangePercent)}
                    </span>
                  </p>
                )}
              </div>
              <div className="mb-6">
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
                  onChange={(e) => {
                    let cleanedValue = e.target.value.replace(/[^\d]/g, '');
                    let formatted = cleanedValue.length > 0 ? (parseInt(cleanedValue) / 100).toFixed(2) : '';
                    setInvestmentAmount((formatted));
                    setAmountError('');
                  }}
                  step="0.01"
                  min="0"
                  className="w-full bg-gray-50/60 dark:bg-gray-800/60 backdrop-blur-sm border border-gray-200/50 dark:border-gray-600/50 rounded-lg py-3 px-4 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 transition-all duration-300 text-sm shadow-inner"
                />
                {amountError && (
                  <p className="text-red-500 text-xs mt-2 animate-shake">{amountError}</p>
                )}
              </div>
              {selectedInvestment.type === 'STOCK' || selectedInvestment.type === 'FII' ? (
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-6 flex justify-between">
                  <span>Cotas Aproximadas:</span>
                  <span className="font-semibold">
                    {investmentAmount && selectedInvestment.regularMarketPrice
                      ? (parseFloat(investmentAmount.replace(',', '.')) / selectedInvestment.regularMarketPrice).toFixed(2)
                      : '0'}
                  </span>
                </p>
              ) : (
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-6 flex justify-between">
                  <span>Valor do Investimento:</span>
                  <span className="font-semibold">
                    {formatToBRLInput(investmentAmount)}
                  </span>
                </p>
              )}
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => {
                    setIsModalOpen(false);
                    setInvestmentAmount('');
                    setAmountError('');
                  }}
                  className="relative py-2 px-6 bg-gray-200/80 dark:bg-gray-600/80 backdrop-blur-sm text-gray-900 dark:text-white rounded-full hover:bg-gray-300/80 dark:hover:bg-gray-500/80 transition-all duration-300 text-sm font-semibold shadow-md animate-pulse-button overflow-hidden"
                >
                  <span className="relative z-10">Cancelar</span>
                  <span className="absolute inset-0 bg-white/20 opacity-0 hover:opacity-100 transition-opacity duration-300 animate-ripple"></span>
                </button>
                <button
                  onClick={handleInvest}
                  disabled={!investmentAmount || parseFloat(investmentAmount.replace('.', '').replace(',', '.')) <= 0}
                  className="relative py-2 px-6 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-full hover:from-blue-700 hover:to-cyan-600 transition-all duration-300 disabled:bg-gray-400/80 disabled:cursor-not-allowed text-sm font-semibold shadow-md hover:shadow-xl animate-pulse-button overflow-hidden"
                >
                  <span className="relative z-10">Confirmar Investimento</span>
                  <span className="absolute inset-0 bg-white/20 opacity-0 hover:opacity-100 transition-opacity duration-300 animate-ripple"></span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes pulseSlow {
          0%, 100% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.08);
            opacity: 0.9;
          }
        }
        @keyframes pulseButton {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.04);
          }
        }
        @keyframes shake {
          0%, 100% {
            transform: translateX(0);
          }
          10%, 30%, 50%, 70%, 90% {
            transform: translateX(-3px);
          }
          20%, 40%, 60%, 80% {
            transform: translateX(3px);
          }
        }
        @keyframes float {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-20px);
          }
        }
        @keyframes floatSlow {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-30px);
          }
        }
        @keyframes glow {
          0%, 100% {
            box-shadow: 0 0 8px rgba(255, 255, 255, 0.3);
          }
          50% {
            box-shadow: 0 0 16px rgba(255, 255, 255, 0.5);
          }
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        @keyframes ripple {
          0% {
            transform: scale(0);
            opacity: 1;
          }
          100% {
            transform: scale(4);
            opacity: 0;
          }
        }
        .animate-pulse-slow {
          animation: pulseSlow 2.5s infinite ease-in-out;
        }
        .animate-pulse-button {
          animation: pulseButton 1.8s infinite ease-in-out;
        }
        .animate-shake {
          animation: shake 0.4s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
        }
        .animate-float {
          animation: float 6s infinite ease-in-out;
        }
        .animate-float-slow {
          animation: floatSlow 8s infinite ease-in-out;
        }
        .animate-glow {
          animation: glow 2s infinite ease-in-out;
        }
        .animate-fade-in {
          animation: fadeIn 0.3s ease-out;
        }
        .animate-ripple {
          animation: ripple 0.6s linear;
        }
      `}</style> */}

      <ConfirmationModalTransaction
        show={isModalTransactionOpen}
        onClose={() => setIsModalTransactionOpen(false)}
        details={details}
        onConfirm={handleModalConfirm}
        reset={handleReset}
      />
      <LoadingOverlay isVisible={loadingBuying} />
    </div>
  );
};

export default InvestmentDashboard;