import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, PointElement, LinearScale, CategoryScale, Tooltip } from 'chart.js';
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core'
import { faCalculator, faCar, faHome, faShareAlt, faUmbrellaBeach, faUserTie } from '@fortawesome/free-solid-svg-icons'

ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Tooltip);

interface Goal {
  title: string;
  goal: string;
  accumulated: string;
  progress: number;
  icon: IconDefinition;
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
  { title: 'Entrada para apartamento', goal: 'R$ 50.000 em 3 anos', accumulated: 'R$ 22.500', progress: 45, icon: faHome, color: 'green' },
  { title: 'Troca de carro', goal: 'R$ 30.000 em 2 anos', accumulated: 'R$ 6.000', progress: 20, icon: faCar, color: 'blue' },
  { title: 'Viagem internacional', goal: 'R$ 15.000 em 1 ano', accumulated: 'R$ 9.750', progress: 65, icon: faUmbrellaBeach, color: 'purple' },
];

const ProfileContent: React.FC = () => {
  const [showSimulationResult, setShowSimulationResult] = useState<boolean>(false);

  return (
    <div>
      <div className="flex flex-col md:flex-row gap-6 mb-8">
        <div className="bg-white dark:bg-slate-950 rounded-xl shadow-md p-6 md:w-1/2 transition-all duration-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Perfil do Investidor</h3>
            <button
              className="text-blue-600 dark:text-blue-400 text-sm font-semibold hover:text-blue-700 dark:hover:text-blue-300 transition-all duration-200"
              aria-label="Atualizar perfil do investidor"
            >
              Atualizar
            </button>
          </div>
          <div className="flex items-center mb-6">
            <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-400 mr-4">
              <FontAwesomeIcon icon={faUserTie} className="text-2xl" />
            </div>
            <div>
              <h4 className="text-base font-semibold text-gray-900 dark:text-gray-100">Moderado</h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">Última atualização: 15/03/2023</p>
            </div>
          </div>
          <div className="mb-6">
            <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">Sugestão de alocação</h4>
            {[
              { name: 'Renda Fixa', value: 60, color: 'blue' },
              { name: 'Renda Variável', value: 30, color: 'green' },
              { name: 'Fundos', value: 10, color: 'purple' },
            ].map((item) => (
              <div key={item.name} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mt-2">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-900 dark:text-gray-100">{item.name}</span>
                  <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">{item.value}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div className={`bg-${item.color}-600 dark:bg-${item.color}-500 h-2 rounded-full`} style={{ width: `${item.value}%` }}></div>
                </div>
              </div>
            ))}
          </div>
          <button
            className="w-full py-2 bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 text-white rounded-lg text-sm font-semibold transition-all duration-200 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            aria-label="Refazer questionário de perfil"
          >
            Refazer questionário
          </button>
        </div>
        <div className="bg-white dark:bg-slate-950 rounded-xl shadow-md p-6 md:w-1/2 transition-all duration-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Metas Financeiras</h3>
            <button
              className="text-blue-600 dark:text-blue-400 text-sm font-semibold hover:text-blue-700 dark:hover:text-blue-300 transition-all duration-200"
              aria-label="Adicionar nova meta financeira"
            >
              Adicionar
            </button>
          </div>
          <div className="space-y-4">
            {goals.map((goal) => (
              <div
                key={goal.title}
                className="flex items-start p-4 bg-gray-50 dark:bg-gray-800 rounded-lg transition-all duration-200"
              >
                <div
                  className={`w-10 h-10 rounded-full bg-${goal.color}-100 dark:bg-${goal.color}-900 flex items-center justify-center text-${goal.color}-600 dark:text-${goal.color}-400 mr-4 mt-1`}
                >
                  <FontAwesomeIcon icon={goal.icon} className="text-xl" />
                </div>
                <div className="flex-1">
                  <h4 className="text-base font-semibold text-gray-900 dark:text-gray-100">{goal.title}</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">{goal.goal}</p>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div className={`bg-${goal.color}-600 dark:bg-${goal.color}-500 h-2 rounded-full`} style={{ width: `${goal.progress}%` }}></div>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{goal.accumulated} acumulados</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="bg-white dark:bg-slate-950 rounded-xl shadow-md p-6 mb-8 transition-all duration-200">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Simulador de Investimentos</h3>
          <FontAwesomeIcon icon={faCalculator} className="text-gray-400 dark:text-gray-500 text-xl" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Valor inicial</label>
              <input
                type="text"
                className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 py-2 pl-4 pr-4 rounded-lg text-sm text-gray-700 dark:text-gray-100 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                placeholder="R$ 0,00"
                aria-label="Valor inicial"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Aporte mensal</label>
              <input
                type="text"
                className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 py-2 pl-4 pr-4 rounded-lg text-sm text-gray-700 dark:text-gray-100 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                placeholder="R$ 0,00"
                aria-label="Aporte mensal"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Período (anos)</label>
              <input
                type="number"
                className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 py-2 pl-4 pr-4 rounded-lg text-sm text-gray-700 dark:text-gray-100 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                placeholder="5"
                aria-label="Período em anos"
              />
            </div>
          </div>
          <div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Tipo de investimento</label>
              <select
                className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 py-2 pl-4 pr-8 rounded-lg text-sm text-gray-700 dark:text-gray-100 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                aria-label="Selecionar tipo de investimento"
              >
                <option>CDB 100% CDI</option>
                <option>Tesouro IPCA+ 2026</option>
                <option>Fundo Multimercado</option>
                <option>Carteira de Ações</option>
                <option>Personalizado...</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Rentabilidade anual estimada</label>
              <input
                type="text"
                className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 py-2 pl-4 pr-4 rounded-lg text-sm text-gray-700 dark:text-gray-100 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                placeholder="8%"
                aria-label="Rentabilidade anual estimada"
              />
            </div>
          </div>
        </div>
        <button
          onClick={() => setShowSimulationResult(true)}
          className="mt-4 px-4 py-2 bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 text-white rounded-lg text-sm font-semibold transition-all duration-200 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          aria-label="Simular investimento"
        >
          Simular
        </button>
        {showSimulationResult && (
          <div className="mt-6 bg-gray-50 dark:bg-gray-800 rounded-lg shadow-md p-6 animate-fade-in">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-base font-semibold text-gray-900 dark:text-gray-100">Resultado da Simulação</h4>
              <button
                className="text-blue-600 dark:text-blue-400 text-sm font-semibold hover:text-blue-700 dark:hover:text-blue-300 transition-all duration-200"
                aria-label="Compartilhar resultado da simulação"
              >
                <FontAwesomeIcon icon={faShareAlt} className="mr-1" />
                Compartilhar
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-white dark:bg-slate-950 p-4 rounded-lg shadow-md">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Total investido</p>
                <p className="text-xl font-bold text-gray-900 dark:text-gray-100">R$ 60.000</p>
              </div>
              <div className="bg-white dark:bg-slate-950 p-4 rounded-lg shadow-md">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Juros acumulados</p>
                <p className="text-xl font-bold text-green-600 dark:text-green-400">R$ 28.745</p>
              </div>
              <div className="bg-white dark:bg-slate-950 p-4 rounded-lg shadow-md">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Saldo final</p>
                <p className="text-xl font-bold text-gray-900 dark:text-gray-100">R$ 88.745</p>
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