import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Doughnut, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';
import { faArrowUp, faBuilding, faChartBar, faChartLine, faChevronDown, faLandmark, type IconDefinition } from '@fortawesome/free-solid-svg-icons'

ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

interface Asset {
  name: string;
  details: string;
  value: string;
  share: string;
  performance: string;
  icon: IconDefinition;
  color: string;
}

const portfolioData = {
  labels: ['Renda Fixa', 'Ações', 'Fundos Imobiliários', 'Tesouro Direto'],
  datasets: [{
    data: [35, 29, 21, 15],
    backgroundColor: ['#3b82f6', '#ef4444', '#10b981', '#8b5cf6'],
    borderWidth: 0,
  }],
};

const performanceData = {
  labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
  datasets: [
    {
      label: 'Minha Carteira',
      data: [1.2, 1.8, 2.3, 2.8, 3.2, 3.9, 4.5, 5.1, 5.8, 6.4, 7.0, 7.5],
      backgroundColor: '#3b82f6',
    },
    {
      label: 'CDI',
      data: [0.9, 1.7, 2.1, 2.5, 2.9, 3.3, 3.7, 4.1, 4.5, 4.9, 5.3, 5.7],
      backgroundColor: '#9ca3af',
    },
  ],
};

const assets: Asset[] = [
  { name: 'CDB 110% CDI', details: 'Banco XYZ - 1 ano', value: 'R$ 15.000,00', share: '35.2%', performance: '12.5%', icon: faChartBar, color: 'blue' },
  { name: 'Fundo Imobiliário', details: 'HGLG11', value: 'R$ 8.750,50', share: '20.6%', performance: '8.3%', icon: faBuilding, color: 'green' },
  { name: 'Ações', details: 'PETR4', value: 'R$ 12.345,67', share: '29.0%', performance: '22.1%', icon: faChartLine, color: 'red' },
  { name: 'Tesouro IPCA+', details: '2026', value: 'R$ 6.471,72', share: '15.2%', performance: '6.8%', icon: faLandmark, color: 'purple' },
];

const PortfolioContent: React.FC = () => (
  <div>
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Distribuição da Carteira</h3>
          <div className="relative">
            <select
              className="appearance-none bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-100 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-40 py-2 pl-4 pr-8 transition-all duration-200"
              aria-label="Selecionar período da carteira"
            >
              <option>Últimos 12 meses</option>
              <option>Últimos 6 meses</option>
              <option>Este ano</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500 dark:text-gray-400">
              <FontAwesomeIcon icon={faChevronDown} />
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-950 rounded-xl shadow-md p-4 h-64 transition-all duration-200">
          <Doughnut
            data={portfolioData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: { position: 'right', labels: { boxWidth: 12, padding: 20, color: '#6b7280' } },
              },
              cutout: '70%',
            }}
          />
        </div>
      </div>
      <div>
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Rentabilidade vs CDI</h3>
          <div className="flex space-x-2">
            <button className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-lg text-xs font-semibold hover:bg-blue-200 dark:hover:bg-blue-800">12M</button>
            <button className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 rounded-lg text-xs font-semibold hover:bg-gray-200 dark:hover:bg-gray-700">6M</button>
            <button className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 rounded-lg text-xs font-semibold hover:bg-gray-200 dark:hover:bg-gray-700">3M</button>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-950 rounded-xl shadow-md p-4 h-64 transition-all duration-200">
          <Bar
            data={performanceData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                x: { grid: { display: false } },
                y: {
                  ticks: {
                    callback: function (tickValue: string | number): string {
                      return typeof tickValue === 'number' ? `${tickValue}%` : tickValue;
                    },
                  },
                },
              },
              plugins: {
                legend: { position: 'top', labels: { boxWidth: 12, color: '#6b7280' } },
              },
            }}
          />
        </div>
      </div>
    </div>
    <div className="mt-8">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Meus Ativos</h3>
        <div className="relative">
          <select
            className="appearance-none bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-100 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-40 py-2 pl-4 pr-8 transition-all duration-200"
            aria-label="Ordenar ativos"
          >
            <option>Ordenar por</option>
            <option>Maior valor</option>
            <option>Melhor desempenho</option>
            <option>Maior risco</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500 dark:text-gray-400">
            <FontAwesomeIcon icon={faChevronDown} />
          </div>
        </div>
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
                      <FontAwesomeIcon icon={asset.icon} />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                        {asset.name}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{asset.details}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                  {asset.value}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                  {asset.share}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-green-500 dark:text-green-400 text-sm font-medium">
                    <FontAwesomeIcon icon={faArrowUp} className="mr-1" />
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

export default PortfolioContent;