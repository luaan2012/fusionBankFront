import React, { useEffect, useState } from 'react';
import { Chart, type ChartTypeRegistry } from 'chart.js/auto';

// Type definitions
type MetricCardProps = {
  title: string;
  value: string;
  description?: string;
  icon: string;
  iconBgColor: string;
  iconTextColor: string;
};

type ChartData = {
  labels: string[];
  datasets: {
    label?: string;
    data: number[];
    backgroundColor?: string | string[];
    borderColor?: string;
    tension?: number;
    fill?: boolean;
    borderRadius?: number;
  }[];
};

type ChartProps = {
  type: keyof ChartTypeRegistry;
  data: ChartData;
  title: string;
  filterOptions?: { label: string; active: boolean }[];
  darkMode: boolean;
};

// Components
const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  description,
  icon,
  iconBgColor,
  iconTextColor,
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 dark:border-gray-700">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-gray-500 dark:text-gray-300 text-sm font-medium">{title}</h3>
          <p className="text-2xl font-bold mt-1 text-gray-800 dark:text-white">{value}</p>
          {description && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{description}</p>
          )}
        </div>
        <div className={`p-3 rounded-full ${iconBgColor} ${iconTextColor} transition-colors duration-300`}>
          <i className={`fas ${icon} text-xl`}></i>
        </div>
      </div>
    </div>
  );
};

const CustomChart: React.FC<ChartProps> = ({ type, data, title, filterOptions, darkMode }) => {
  const chartRef = React.useRef<HTMLCanvasElement>(null);
  const chartInstance = React.useRef<Chart>(null);

  useEffect(() => {
    if (chartRef.current) {
      const ctx = chartRef.current.getContext('2d');
      if (ctx) {
        // Destroy previous chart instance if exists
        if (chartInstance.current) {
          chartInstance.current.destroy();
        }

        chartInstance.current = new Chart(ctx, {
          type,
          data,
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: 'top',
                labels: {
                  color: darkMode ? '#e2e8f0' : '#64748b',
                  font: {
                    size: 14
                  }
                },
              },
              tooltip: {
                bodyFont: {
                  size: 14
                },
                titleFont: {
                  size: 16
                }
              }
            },
            scales: type !== 'pie' ? {
              x: {
                grid: {
                  color: darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
                  tickColor: darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'
                },
                ticks: {
                  color: darkMode ? '#e2e8f0' : '#64748b',
                  font: {
                    size: 12
                  }
                },
              },
              y: {
                grid: {
                  color: darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
                  tickColor: darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'
                },
                ticks: {
                  color: darkMode ? '#e2e8f0' : '#64748b',
                  font: {
                    size: 12
                  }
                },
              },
            } : undefined,
          },
        });
      }
    }

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [type, data, darkMode]);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-100 dark:border-gray-700 transition-colors duration-300">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white">{title}</h2>
        {filterOptions && (
          <div className="flex gap-2">
            {filterOptions.map((option, index) => (
              <button
                key={index}
                className={`px-3 py-1 text-xs rounded-md transition-colors duration-300 ${
                  option.active
                    ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        )}
      </div>
      <div className="chart-container" style={{ height: '350px' }}>
        <canvas ref={chartRef}></canvas>
      </div>
    </div>
  );
};

const ActivityLog: React.FC<{ darkMode: boolean }> = ({ darkMode }) => {
  const activities = [
    {
      time: '10/05 14:30',
      action: 'Transferência PIX',
      user: 'João Silva',
      amount: 'R$ 1.200,00',
    },
    {
      time: '10/05 13:45',
      action: 'Cadastro Aprovado',
      user: 'Empresa XYZ LTDA',
      amount: '-',
    },
    {
      time: '10/05 12:10',
      action: 'Boleto Pago',
      user: 'Maria Oliveira',
      amount: 'R$ 890,00',
    },
    {
      time: '10/05 11:25',
      action: 'Depósito',
      user: 'Carlos Souza',
      amount: 'R$ 2.500,00',
    },
    {
      time: '10/05 10:15',
      action: 'Transferência TED',
      user: 'Ana Costa',
      amount: 'R$ 3.750,00',
    },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-100 dark:border-gray-700 transition-colors duration-300">
      <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Registro de Eventos (Últimas 24h)</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead>
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Data/Hora
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Ação
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Usuário
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Valor
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {activities.map((activity, index) => (
              <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">{activity.time}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">{activity.action}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">{activity.user}</td>
                <td
                  className={`px-4 py-3 whitespace-nowrap text-sm font-medium ${
                    activity.amount !== '-'
                      ? 'text-green-600 dark:text-green-400'
                      : 'text-gray-700 dark:text-gray-300'
                  }`}
                >
                  {activity.amount}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const Dashboard: React.FC = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [currentDateTime, setCurrentDateTime] = useState('');

  // Update date time
  const updateDateTime = () => {
    const now = new Date();
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    };
    setCurrentDateTime(now.toLocaleDateString('pt-BR', options));
  };

  // Initialize and update date time
  useEffect(() => {
    updateDateTime();
    const interval = setInterval(updateDateTime, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  // Check for saved user preference
  useEffect(() => {
    if (localStorage.getItem('darkMode') === 'true') {
      setDarkMode(true);
    }
  }, []);

  // Toggle dark mode
  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem('darkMode', String(newMode));
  };

  // Chart data
  const transfersData: ChartData = {
    labels: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'],
    datasets: [
      {
        label: 'PIX',
        data: [120, 150, 200, 180, 240, 300, 350],
        backgroundColor: '#3b82f6',
        borderRadius: 4,
      },
      {
        label: 'TED',
        data: [50, 70, 60, 80, 90, 100, 120],
        backgroundColor: '#10b981',
        borderRadius: 4,
      },
      {
        label: 'DOC',
        data: [10, 15, 20, 18, 25, 30, 40],
        backgroundColor: '#8b5cf6',
        borderRadius: 4,
      },
    ],
  };

  const registrationsData: ChartData = {
    labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul'],
    datasets: [
      {
        label: 'Cadastros',
        data: [1200, 1500, 1800, 2100, 2400, 2900, 3200],
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.3,
        fill: true,
      },
    ],
  };

  const invoicesData: ChartData = {
    labels: ['Pagos', 'A Vencer', 'Vencidos'],
    datasets: [
      {
        data: [65, 25, 10],
        backgroundColor: ['#10b981', '#3b82f6', '#ef4444'],
      },
    ],
  };

  return (
    <div className={`min-h-screen font-sans antialiased transition-colors duration-300 ${darkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      <div className="container mx-auto px-4 py-6">
    
        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <MetricCard
            title="Transferências (Hoje)"
            value="1.245"
            description="PIX: 890 | TED: 300"
            icon="fa-exchange-alt"
            iconBgColor="bg-blue-100 dark:bg-blue-900"
            iconTextColor="text-blue-600 dark:text-blue-300"
          />
          <MetricCard
            title="Novos Cadastros"
            value="328"
            description="Últimas 24h"
            icon="fa-users"
            iconBgColor="bg-green-100 dark:bg-green-900"
            iconTextColor="text-green-600 dark:text-green-300"
          />
          <MetricCard
            title="Boletos Gerados"
            value="512"
            description="Valor total: R$ 1.245.000"
            icon="fa-barcode"
            iconBgColor="bg-purple-100 dark:bg-purple-900"
            iconTextColor="text-purple-600 dark:text-purple-300"
          />
          <MetricCard
            title="Boletos Pagos"
            value="287"
            description="87% do total"
            icon="fa-check-circle"
            iconBgColor="bg-orange-100 dark:bg-orange-900"
            iconTextColor="text-orange-600 dark:text-orange-300"
          />
          <MetricCard
            title="Depósitos"
            value="R$ 890.450"
            description="42 operações"
            icon="fa-money-bill-wave"
            iconBgColor="bg-teal-100 dark:bg-teal-900"
            iconTextColor="text-teal-600 dark:text-teal-300"
          />
          <MetricCard
            title="Saldo Total do Sistema"
            value="R$ 98.754.321"
            icon="fa-university"
            iconBgColor="bg-yellow-100 dark:bg-yellow-900"
            iconTextColor="text-yellow-600 dark:text-yellow-300"
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <CustomChart
            type="bar"
            data={transfersData}
            title="Transferências por Tipo (Últimos 7 Dias)"
            filterOptions={[
              { label: 'Dia', active: false },
              { label: 'Semana', active: true },
              { label: 'Mês', active: false },
            ]}
            darkMode={darkMode}
          />
          <CustomChart
            type="line"
            data={registrationsData}
            title="Crescimento de Cadastros (Mensal)"
            filterOptions={[
              { label: '2023', active: false },
              { label: '2024', active: true },
            ]}
            darkMode={darkMode}
          />
        </div>

        {/* Boletos Status Pie Chart and Activity Log */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <CustomChart
            type="pie"
            data={invoicesData}
            title="Status dos Boletos"
            darkMode={darkMode}
          />
          <ActivityLog darkMode={darkMode} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;