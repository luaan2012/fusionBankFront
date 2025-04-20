import React from 'react';
import { Doughnut, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend, Scale, type CoreScaleOptions, type Tick } from 'chart.js';

ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

interface Asset {
    name: string;
    details: string;
    value: string;
    share: string;
    performance: string;
    icon: string;
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
    { name: 'CDB 110% CDI', details: 'Banco XYZ - 1 ano', value: 'R$ 15.000,00', share: '35.2%', performance: '12.5%', icon: 'fa-chart-bar', color: 'blue' },
    { name: 'Fundo Imobiliário', details: 'HGLG11', value: 'R$ 8.750,50', share: '20.6%', performance: '8.3%', icon: 'fa-building', color: 'green' },
    { name: 'Ações', details: 'PETR4', value: 'R$ 12.345,67', share: '29.0%', performance: '22.1%', icon: 'fa-chart-line', color: 'red' },
    { name: 'Tesouro IPCA+', details: '2026', value: 'R$ 6.471,72', share: '15.2%', performance: '6.8%', icon: 'fa-landmark', color: 'purple' },
];

const PortfolioContent: React.FC = () => (
    <div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold dark:text-white">Distribuição da Carteira</h3>
                    <div className="relative">
                        <select className="appearance-none bg-gray-100 dark:bg-gray-700 border-0 py-2 pl-4 pr-8 rounded-lg text-sm focus:outline-none dark:text-gray-300">
                            <option>Últimos 12 meses</option>
                            <option>Últimos 6 meses</option>
                            <option>Este ano</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 dark:text-gray-300">
                            <i className="fas fa-chevron-down"></i>
                        </div>
                    </div>
                </div>
                <div className="bg-white dark:bg-gray-700 rounded-lg shadow p-4 h-64">
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
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold dark:text-white">Rentabilidade vs CDI</h3>
                    <div className="flex space-x-2">
                        <button className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-500 dark:text-blue-300 rounded-lg text-xs">12M</button>
                        <button className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-300 rounded-lg text-xs">6M</button>
                        <button className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-300 rounded-lg text-xs">3M</button>
                    </div>
                </div>
                <div className="bg-white dark:bg-gray-700 rounded-lg shadow p-4 h-64">
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
                <h3 className="text-lg font-semibold dark:text-white">Meus Ativos</h3>
                <div className="relative">
                    <select className="appearance-none bg-gray-100 dark:bg-gray-700 border-0 py-2 pl-4 pr-8 rounded-lg text-sm focus:outline-none dark:text-gray-300">
                        <option>Ordenar por</option>
                        <option>Maior valor</option>
                        <option>Melhor desempenho</option>
                        <option>Maior risco</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 dark:text-gray-300">
                        <i className="fas fa-chevron-down"></i>
                    </div>
                </div>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                            {['Ativo', 'Valor Investido', '% Carteira', 'Rentabilidade', 'Ações'].map(header => (
                                <th key={header} className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    {header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {assets.map(asset => (
                            <tr key={asset.name}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div className={`flex-shrink-0 h-10 w-10 rounded-full bg-${asset.color}-100 dark:bg-${asset.color}-900 flex items-center justify-center text-${asset.color}-500 dark:text-${asset.color}-300`}>
                                            <i className={`fas ${asset.icon}`}></i>
                                        </div>
                                        <div className="ml-4">
                                            <div className="text-sm font-medium dark:text-white">{asset.name}</div>
                                            <div className="text-sm text-gray-500 dark:text-gray-400">{asset.details}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm dark:text-white">{asset.value}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm dark:text-white">{asset.share}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="text-green-500 dark:dark-profit text-sm font-medium">
                                        <i className="fas fa-arrow-up mr-1"></i> {asset.performance}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <button className="text-blue-500 hover:text-blue-700 mr-3">Resgatar</button>
                                    <button className="text-gray-500 hover:text-gray-700">Detalhes</button>
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