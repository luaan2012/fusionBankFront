import React from 'react';

const Investments: React.FC = () => {
  const investments = [
    {
      type: 'CDB',
      name: 'CDB Prefixado 2025',
      rate: '12,5% a.a.',
      value: '3.250,00',
      progress: 65,
      applied: '2.000,00',
      yield: '1.250,00',
      progressColor: 'bg-green-500',
    },
    {
      type: 'Tesouro Direto',
      name: 'Tesouro IPCA+ 2026',
      rate: 'IPCA + 5,3%',
      value: '1.750,50',
      progress: 42,
      applied: '1.500,00',
      yield: '250,50',
      progressColor: 'bg-blue-500',
    },
    {
      type: 'Fundos',
      name: 'Fundo Multimercado',
      rate: '15,2% a.a.',
      value: '2.150,75',
      progress: 78,
      applied: '1.200,00',
      yield: '950,75',
      progressColor: 'bg-purple-500',
    },
  ];

  return (
    <div className="bg-white dark:bg-dark-secondary rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-light">Meus Investimentos</h2>
        <a href="#" className="text-primary-light hover:text-primary-dark text-sm">
          Ver todos
        </a>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {investments.map((investment, index) => (
          <div
            key={index}
            className="border dark:border-dark rounded-lg p-4 smooth-transition hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            <div className="flex justify-between items-start mb-2">
              <div>
                <p className="text-gray-500 text-sm">{investment.type}</p>
                <p className="font-medium text-gray-800 dark:text-light">{investment.name}</p>
              </div>
              <span className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs px-2 py-1 rounded">
                {investment.rate}
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-800 dark:text-light mb-2">
              R$ {investment.value}
            </p>
            <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full mb-2">
              <div
                className={`h-2 ${investment.progressColor} rounded-full`}
                style={{ width: `${investment.progress}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-xs text-gray-500">
              <span>Aplicado: R$ {investment.applied}</span>
              <span>Rendimento: R$ {investment.yield}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Investments;