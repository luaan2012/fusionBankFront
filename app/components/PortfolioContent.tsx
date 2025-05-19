import React, { useMemo } from 'react';
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
import { useInvestmentStore } from '~/context/investmentStore';
import { formatPercent, formatToBRL, normalizeInvestmentType } from '~/utils/utils';

ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const iconMap: Record<string, any> = {
  CDB: faChartBar,
  FII: faBuilding,
  STOCK: faChartLine,
  LCI: faChartBar,
  LCA: faChartBar,
};

const colorMap = {
  CDB: 'blue',
  LCI: 'green',
  LCA: 'lime',
  FII: 'purple',
  STOCK: 'sky',
};

const PortfolioContent: React.FC = () => {
  const { investment } = useInvestmentStore();

  const total = useMemo(() => investment.reduce((acc, inv) => acc + inv.balance, 0), [investment]);

  const assets = useMemo(() => {
    if (total === 0) return [];

    return investment.map((inv) => {
      return {
        name: inv.symbol,
        details: normalizeInvestmentType(inv.investmentType),
        value: formatToBRL(inv.balance),
        share: formatPercent(inv.balance / total),
        performance: formatPercent(inv.percentageChange / 100),
        color: 'gray',
        logourl: inv.logourl,
        type: inv.investmentType
      };
    });
  }, [investment, total]);

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
                {['Ativo', 'Valor Investido', '% Carteira', 'Rentabilidade', 'Ações'].map((header) => (
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
                        {asset.type === "STOCK" ? (
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
                          icon={iconMap[asset.type] || 'faCircle'} // Fallback para ícone
                          className={`bg-${colorMap[asset.type]}-100 dark:bg-${colorMap[asset.type]}-900 text-${colorMap[asset.type]}-600 dark:text-${colorMap[asset.type]}-400`}
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
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold">
                    <button className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 mr-3 transition-all duration-200">
                      Resgatar
                    </button>
                    <button className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-all duration-200">
                      Detalhes
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PortfolioContent;