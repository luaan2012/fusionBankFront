import React, { useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Scale, type CoreScaleOptions, type Tick } from 'chart.js';

ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Tooltip);

interface Goal {
    title: string;
    goal: string;
    accumulated: string;
    progress: number;
    icon: string;
    color: string;
}

const simulationData = {
    labels: ['Ano 1', 'Ano 2', 'Ano 3', 'Ano 4', 'Ano 5'],
    datasets: [{
        label: 'Saldo Acumulado',
        data: [12000, 26000, 42000, 60000, 80000],
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.05)',
        fill: true,
        tension: 0.4,
    }],
};

const goals: Goal[] = [
    { title: 'Entrada para apartamento', goal: 'R$ 50.000 em 3 anos', accumulated: 'R$ 22.500', progress: 45, icon: 'fa-home', color: 'green' },
    { title: 'Troca de carro', goal: 'R$ 30.000 em 2 anos', accumulated: 'R$ 6.000', progress: 20, icon: 'fa-car', color: 'blue' },
    { title: 'Viagem internacional', goal: 'R$ 15.000 em 1 ano', accumulated: 'R$ 9.750', progress: 65, icon: 'fa-umbrella-beach', color: 'purple' },
];

const ProfileContent: React.FC = () => {
    const [showSimulationResult, setShowSimulationResult] = useState<boolean>(false);

    return (
        <div>
            <div className="flex flex-col md:flex-row gap-6 mb-8">
                <div className="bg-white dark:bg-gray-700 rounded-xl shadow-lg p-6 md:w-1/2">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-semibold dark:text-white">Perfil do Investidor</h3>
                        <button className="text-blue-500 text-sm font-medium">Atualizar</button>
                    </div>
                    <div className="flex items-center mb-6">
                        <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-500 dark:text-blue-300 mr-4">
                            <i className="fas fa-user-tie text-2xl"></i>
                        </div>
                        <div>
                            <h4 className="font-medium dark:text-white">Moderado</h4>
                            <p className="text-sm text-gray-500 dark:text-gray-300">Última atualização: 15/03/2023</p>
                        </div>
                    </div>
                    <div className="mb-6">
                        <h4 className="text-sm font-medium mb-3 dark:text-white">Sugestão de alocação</h4>
                        {[
                            { name: 'Renda Fixa', value: 60, color: 'blue' },
                            { name: 'Renda Variável', value: 30, color: 'green' },
                            { name: 'Fundos', value: 10, color: 'purple' },
                        ].map(item => (
                            <div key={item.name} className="bg-gray-100 dark:bg-gray-600 rounded-lg p-4 mt-2">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-sm dark:text-white">{item.name}</span>
                                    <span className="text-sm font-medium dark:text-white">{item.value}%</span>
                                </div>
                                <div className="w-full bg-gray-200 dark:bg-gray-500 rounded-full h-2">
                                    <div className={`bg-${item.color}-500 h-2 rounded-full`} style={{ width: `${item.value}%` }}></div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button className="w-full py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600">
                        Refazer questionário
                    </button>
                </div>
                <div className="bg-white dark:bg-gray-700 rounded-xl shadow-lg p-6 md:w-1/2">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-semibold dark:text-white">Metas Financeiras</h3>
                        <button className="text-blue-500 text-sm font-medium">Adicionar</button>
                    </div>
                    <div className="space-y-4">
                        {goals.map(goal => (
                            <div key={goal.title} className="flex items-start p-4 bg-gray-50 dark:bg-gray-600 rounded-lg">
                                <div className={`w-10 h-10 rounded-full bg-${goal.color}-100 dark:bg-${goal.color}-900 flex items-center justify-center text-${goal.color}-500 dark:text-${goal.color}-300 mr-4 mt-1`}>
                                    <i className={`fas ${goal.icon}`}></i>
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-medium dark:text-white">{goal.title}</h4>
                                    <p className="text-sm text-gray-500 dark:text-gray-300 mb-2">{goal.goal}</p>
                                    <div className="w-full bg-gray-200 dark:bg-gray-500 rounded-full h-2">
                                        <div className={`bg-${goal.color}-500 h-2 rounded-full`} style={{ width: `${goal.progress}%` }}></div>
                                    </div>
                                    <p className="text-xs text-gray-500 dark:text-gray-300 mt-1">{goal.accumulated} acumulados</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <div className="bg-white dark:bg-gray-700 rounded-xl shadow-lg p-6 mb-8">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold dark:text-white">Simulador de Investimentos</h3>
                    <i className="fas fa-calculator text-gray-400"></i>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-2 dark:text-gray-300">Valor inicial</label>
                            <input
                                type="text"
                                className="w-full bg-gray-100 dark:bg-gray-600 border-0 py-2 pl-4 pr-8 rounded-lg text-sm focus:outline-none dark:text-gray-300"
                                placeholder="R$ 0,00"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-2 dark:text-gray-300">Aporte mensal</label>
                            <input
                                type="text"
                                className="w-full bg-gray-100 dark:bg-gray-600 border-0 py-2 pl-4 pr-8 rounded-lg text-sm focus:outline-none dark:text-gray-300"
                                placeholder="R$ 0,00"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-2 dark:text-gray-300">Período (anos)</label>
                            <input
                                type="number"
                                className="w-full bg-gray-100 dark:bg-gray-600 border-0 py-2 pl-4 pr-8 rounded-lg text-sm focus:outline-none dark:text-gray-300"
                                placeholder="5"
                            />
                        </div>
                    </div>
                    <div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-2 dark:text-gray-300">Tipo de investimento</label>
                            <select className="w-full bg-gray-100 dark:bg-gray-600 border-0 py-2 pl-4 pr-8 rounded-lg text-sm focus:outline-none dark:text-gray-300">
                                <option>CDB 100% CDI</option>
                                <option>Tesouro IPCA+ 2026</option>
                                <option>Fundo Multimercado</option>
                                <option>Carteira de Ações</option>
                                <option>Personalizado...</option>
                            </select>
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-2 dark:text-gray-300">Rentabilidade anual estimada</label>
                            <input
                                type="text"
                                className="w-full bg-gray-100 dark:bg-gray-600 border-0 py-2 pl-4 pr-8 rounded-lg text-sm focus:outline-none dark:text-gray-300"
                                placeholder="8%"
                            />
                        </div>
                    </div>
                </div>
                <button
                    onClick={() => setShowSimulationResult(true)}
                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium"
                >
                    Simular
                </button>
                {showSimulationResult && (
                    <div className="mt-6 bg-gray-50 dark:bg-gray-600 rounded-lg shadow p-6 animate-fade-in">
                        <div className="flex justify-between items-center mb-4">
                            <h4 className="font-medium dark:text-white">Resultado da Simulação</h4>
                            <button className="text-blue-500 text-sm font-medium">
                                <i className="fas fa-share-alt mr-1"></i> Compartilhar
                            </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                            <div className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow">
                                <p className="text-sm text-gray-500 dark:text-gray-300 mb-1">Total investido</p>
                                <p className="text-xl font-bold dark:text-white">R$ 60.000</p>
                            </div>
                            <div className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow">
                                <p className="text-sm text-gray-500 dark:text-gray-300 mb-1">Juros acumulados</p>
                                <p className="text-xl font-bold text-green-500 dark:dark-profit">R$ 28.745</p>
                            </div>
                            <div className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow">
                                <p className="text-sm text-gray-500 dark:text-gray-300 mb-1">Saldo final</p>
                                <p className="text-xl font-bold dark:text-white">R$ 88.745</p>
                            </div>
                        </div>
                        <div className="h-64">
                            <Line
                                data={simulationData}
                                options={{
                                    responsive: true,
                                    maintainAspectRatio: false,
                                    plugins: { legend: { display: false } },
                                    scales: {
                                        y: {
                                            beginAtZero: true,
                                            ticks: {
                                                callback: function (tickValue: string | number): string {
                                                    return typeof tickValue === 'number' ? `R$ ${tickValue.toLocaleString()}` : tickValue;
                                                },
                                            },
                                        },
                                    },
                                }}
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProfileContent;