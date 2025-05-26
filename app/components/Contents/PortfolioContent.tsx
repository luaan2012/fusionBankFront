import { useMemo, useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowUp,
  faBuilding,
  faChartBar,
  faChartLine,
  faChevronDown,
} from '@fortawesome/free-solid-svg-icons';
import { Doughnut, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from 'chart.js';
import { useAccountStore } from '~/context/accountStore'
import { useInvestmentStore } from '~/context/investmentStore'
import type { InvestmentRequest, ConfirmationDetails, Asset } from '~/types/investment'
import { formatToBRL, formatDateShort, normalizeInvestmentType, formatPercent } from '~/utils/util'
import { useToast } from '../Toasts/ToastContext'
import { LoadingOverlay } from '../Loadings/LoadingOverlay'
import { ConfirmationModalTransaction } from '../Modals/ConfirmationModalTransaction'
import { RedeemInvestmentModal } from '../Modals/RescueInvestmentModal'

ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const iconMap: Record<string, any> = {
  CDB: faChartBar,
  FII: faBuilding,
  STOCK: faChartLine,
  LCI: faChartBar,
  LCA: faChartBar,
};

const colorMap: Record<string, string> = {
  CDB: 'blue',
  LCI: 'green',
  LCA: 'red',
  FII: 'purple',
  STOCK: 'sky',
};

export const PortfolioContent = () => {
  const { user, updateLocalUser } = useAccountStore();
  const { investment, loadingBuying, listInvestmentsUser, rescueInvestment } = useInvestmentStore();
  const [investmentRequest, setInvestmentRequest] = useState<InvestmentRequest | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isModalTransactionOpen, setIsModalTransactionOpen] = useState<boolean>(false);
  const [details, setDetails] = useState<ConfirmationDetails | null>(null);
  const [selectedInvestment, setSelectedInvestment] = useState<Asset | null>(null);
  const { openToast } = useToast();

  useEffect(() => {
    if (user?.accountId && investment.length === 0) {
      listInvestmentsUser(user.accountId, 0);
    }
  }, [user?.accountId]);

  const handleInvest = (amount: number) => {
    if (!selectedInvestment) return;

    const investmentRequest: InvestmentRequest = {
      accountId: user.accountId,
      investmentId: selectedInvestment.investmentId,
      amount,
      investmentType: selectedInvestment.type,
      symbol: selectedInvestment.symbol,
    };

    const detailsModal: ConfirmationDetails = {
      transactionType: 'investment',
      amount: formatToBRL(amount),
      tax: 'R$ 0,00',
      total: formatToBRL(amount),
      details: {
        fundName: selectedInvestment.shortName,
        applicationDate: formatDateShort(new Date(Date.now())),
      },
    };

    setDetails(detailsModal);
    setInvestmentRequest(investmentRequest);
    setIsModalTransactionOpen(true);
    setIsModalOpen(false);
  };

  const handleModalConfirm = async (passwordTransaction: string) => {
    if (passwordTransaction !== user.passwordTransaction) {
      openToast({
        message: 'Senha de transação inválida',
        type: 'error',
        duration: 4000,
        position: 'top-right',
      });
      return;
    }

    const success = await rescueInvestment(investmentRequest.accountId, investmentRequest.investmentId, investmentRequest.amount)
    
    if (success) {
      updateLocalUser('balance', user.balance + investmentRequest.amount);
    }

    setIsModalOpen(false);
    setSelectedInvestment(null);
    setIsModalTransactionOpen(false);
  };

  const handleReset = () => {
    setInvestmentRequest(null);
    setDetails(null);
    setIsModalTransactionOpen(false);
    setSelectedInvestment(null);
  };

  const total = useMemo(() => investment.reduce((acc, inv) => acc + inv.balance, 0), [investment]);

  const assets: Asset[] = useMemo(() => {
    if (total === 0) return [];

    return investment.map((inv) => {

      return {
        investmentId: inv.id,
        name: inv.symbol,
        shortName: inv?.shortName || inv.symbol, // Usa shortName de availableInvestment ou fallback para symbol
        symbol: inv.symbol,
        details: normalizeInvestmentType(inv.investmentType),
        value: formatToBRL(inv.balance),
        valueNumber: inv.balance,
        quantity: inv.quantity,
        ownedShares: inv.quantity, // Sinônimo de quantity para STOCK/FII
        balance: inv.balance, // Saldo total do investimento
        share: formatPercent(inv.balance / total),
        performance: formatPercent(inv.percentageChange / 100),
        regularMarketChangePercent: inv.percentageChange / 100,
        yield: formatToBRL((inv.balance * inv.percentageChange) / 100),
        color: colorMap[inv.investmentType] || 'gray',
        logourl: inv.logourl,
        type: inv.investmentType,
        regularMarketPrice: inv.regularMarketPrice,
        totalBalance: inv.totalBalance
      };
    });
  }, [investment, total, investment]);

  const portfolioDistribution = useMemo(() => {
    if (total === 0 || !investment.length) {
      return {
        labels: [],
        datasets: [{ data: [], backgroundColor: [], borderWidth: 0 }],
      };
    }

    const group: Record<string, number> = {};
    investment.forEach((inv) => {
      const type = normalizeInvestmentType(inv.investmentType);
      group[type] = (group[type] || 0) + inv.balance;
    });

    const labels = Object.keys(group);
    const data = labels.map((label) => (group[label] / total) * 100);
    const backgroundColor = labels.map((label) => {
      const key = label.toUpperCase();
      switch (key) {
        case 'CDB':
          return '#836FFF';
        case 'STOCK':
        case 'AÇÃO':
          return '#0000FF';
        case 'FII':
          return '#3CB371';
        case 'TESOURO':
          return '#7B68EE';
        case 'LCI':
        case 'LCA':
          return '#B0E0E6';
        default:
          console.warn(`Unknown investment type: ${key}`);
          return '#F5FFFA';
      }
    });

    return {
      labels,
      datasets: [
        {
          data,
          backgroundColor,
          borderWidth: 0,
        },
      ],
    };
  }, [investment, total]);

  const investmentTypeBalanceData = useMemo(() => {
    if (total === 0 || !investment.length) {
      return {
        labels: [],
        datasets: [{ data: [], backgroundColor: [] }],
      };
    }

    const group: Record<string, number> = {};
    investment.forEach((inv) => {
      const type = normalizeInvestmentType(inv.investmentType);
      group[type] = (group[type] || 0) + inv.balance;
    });

    const labels = Object.keys(group);
    const data = labels.map((label) => group[label]);
    const backgroundColor = labels.map((label) => {
      const key = label.toUpperCase();
      switch (key) {
        case 'CDB':
          return '#836FFF';
        case 'STOCK':
        case 'AÇÃO':
          return '#0000FF';
        case 'FII':
          return '#3CB371';
        case 'TESOURO':
          return '#7B68EE';
        case 'LCI':
        case 'LCA':
          return '#B0E0E6';
        default:
          console.warn(`Unknown investment type: ${key}`);
          return '#F5FFFA';
      }
    });

    return {
      labels,
      datasets: [
        {
          label: 'Saldo por Tipo (BRL)',
          data,
          backgroundColor,
          borderRadius: 4,
        },
      ],
    };
  }, [investment, total]);

  const onAssetClick = (asset: Asset) => {
    setSelectedInvestment(asset);
    setIsModalOpen(true);
  };

  return (
    <div>
      {/* DISTRIBUIÇÃO E SALDO POR TIPO */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Distribuição da Carteira</h3>
          </div>
          <div className="bg-white dark:bg-slate-950 rounded-xl shadow-md p-4 h-64 transition-all duration-200">
            <Doughnut
              data={portfolioDistribution}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'right',
                    labels: { boxWidth: 12, padding: 20, color: '#6b7280' },
                  },
                },
                cutout: '70%',
              }}
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Saldo por Tipo de Investimento</h3>
          </div>
          <div className="bg-white dark:bg-slate-950 rounded-xl shadow-md p-4 h-64 transition-all duration-200">
            <Bar
              data={investmentTypeBalanceData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  x: {
                    grid: { display: false },
                    title: {
                      display: true,
                      text: 'Tipo de Investimento',
                      color: '#6b7280',
                    },
                  },
                  y: {
                    grid: { color: '#e5e7eb' },
                    ticks: {
                      callback: function (tickValue: string | number): string {
                        return typeof tickValue === 'number' ? formatToBRL(tickValue) : tickValue;
                      },
                      color: '#6b7280',
                    },
                    title: {
                      display: true,
                      text: 'Saldo (BRL)',
                      color: '#6b7280',
                    },
                  },
                },
                plugins: {
                  legend: { display: false },
                  tooltip: {
                    callbacks: {
                      label: function (context) {
                        return `${context.dataset.label}: ${formatToBRL(context.parsed.y)}`;
                      },
                    },
                  },
                },
              }}
            />
          </div>
        </div>
      </div>

      {/* LISTA DE ATIVOS */}
      <div className="mt-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Meus Ativos</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                {['Ativo', 'Valor Investido', '% Carteira', 'Rentabilidade', 'Rendimentos', 'Ações'].map((header) => (
                  <th
                    key={header}
                    className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-slate-950 divide-y divide-gray-200 dark:divide-gray-700">
              {assets.map((asset) => (
                <tr key={asset.name}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div
                        className={`flex-shrink-0 h-10 w-10 rounded-full bg-${asset.color}-100 dark:bg-${asset.color}-900 flex items-center justify-center text-${asset.color}-600 dark:text-${asset.color}-400`}
                      >
                        {asset.type === 'STOCK' ? (
                          <img
                            src={asset.logourl || 'https://icons.brapi.dev/icons/BRAPI.svg'}
                            alt={`${asset.name} Logo`}
                            className="h-6 w-6"
                            onError={(e) => {
                              e.currentTarget.src = 'https://icons.brapi.dev/icons/BRAPI.svg';
                            }}
                          />
                        ) : (
                          <FontAwesomeIcon
                            icon={iconMap[asset.type] || faChartBar}
                            className={`text-${colorMap[asset.type]}-600 dark:text-${colorMap[asset.type]}-400`}
                          />
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">{asset.name}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">{asset.details}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{asset.value}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{asset.share}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`text-sm font-medium ${
                        Number(asset.performance.replace('%', '')) >= 0
                          ? 'text-green-500 dark:text-green-400'
                          : 'text-red-500 dark:text-red-400'
                      }`}
                    >
                      <FontAwesomeIcon
                        icon={Number(asset.performance.replace('%', '')) >= 0 ? faArrowUp : faChevronDown}
                        className="mr-1"
                      />
                      {asset.performance}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`text-sm font-medium ${
                        Number(asset.performance.replace('%', '')) >= 0
                          ? 'text-green-500 dark:text-green-400'
                          : 'text-red-500 dark:text-red-400'
                      }`}
                    >
                      {asset.yield}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold">
                    <button
                      className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-all duration-200"
                      onClick={() => onAssetClick(asset)}
                    >
                      Resgatar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <ConfirmationModalTransaction
        show={isModalTransactionOpen}
        onClose={() => setIsModalTransactionOpen(false)}
        detailsModal={details}
        onConfirm={handleModalConfirm}
        reset={handleReset}
      />
      <LoadingOverlay isVisible={loadingBuying} />
      <RedeemInvestmentModal
        isModalOpen={isModalOpen}
        selectedInvestment={selectedInvestment}
        setIsModalOpen={setIsModalOpen}
        handleInvest={handleInvest}
      />
    </div>
  );
};
