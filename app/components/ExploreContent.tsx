import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core'
import { faBalanceScale, faBuilding, faChartBar, faChartLine, faDollarSign, faGlobe, faHome, faLandmark, faSearch, faUniversity } from '@fortawesome/free-solid-svg-icons'

interface CategoryItem {
  name: string;
  performance: string;
  icon: IconDefinition;
  isLoss?: boolean;
}

interface Category {
  title: string;
  description: string;
  color: string;
  items: CategoryItem[];
}

interface Recommendation {
  title: string;
  details: string;
  type: string;
  color: string;
  metrics: {
    rentability?: string;
    dividend?: string;
    liquidity?: string;
    quote?: string;
    fee?: string;
    risk: string;
  };
}

const categories: Category[] = [
  {
    title: 'Renda Fixa',
    description: 'Previsibilidade e segurança',
    color: 'blue',
    items: [
      { name: 'Tesouro Direto', performance: '+5.3%', icon: faLandmark },
      { name: 'CDB', performance: '+6.1%', icon: faUniversity },
      { name: 'LCI/LCA', performance: '+5.8%', icon: faHome },
    ],
  },
  {
    title: 'Renda Variável',
    description: 'Maior potencial de retorno',
    color: 'green',
    items: [
      { name: 'Ações', performance: '+12.7%', icon: faChartLine },
      { name: 'FIIs', performance: '+8.3%', icon: faBuilding },
      { name: 'ETFs', performance: '+9.5%', icon: faGlobe },
    ],
  },
  {
    title: 'Fundos',
    description: 'Diversificação profissional',
    color: 'purple',
    items: [
      { name: 'Multimercado', performance: '+7.2%', icon: faBalanceScale },
      { name: 'Imobiliário', performance: '+6.8%', icon: faHome},
      { name: 'Cambial', performance: '-1.2%', icon: faDollarSign, isLoss: true },
    ],
  },
];

const recommendations: Recommendation[] = [
  {
    title: 'CDB Banco ABC',
    details: '120% CDI - 1 ano',
    type: 'RF',
    color: 'blue',
    metrics: { rentability: '13,65% a.a.', liquidity: 'D+30', risk: 'Baixo risco' },
  },
  {
    title: 'FII Shopping',
    details: 'HGLG11',
    type: 'RV',
    color: 'green',
    metrics: { dividend: '8,2% a.a.', quote: 'R$ 124,50', risk: 'Médio risco' },
  },
  {
    title: 'Fundo Multimercado',
    details: 'XPTO 20 FIC FIM',
    type: 'Fundo',
    color: 'purple',
    metrics: { rentability: '14,8% a.a.', fee: '1,2% a.a.', risk: 'Alto risco' },
  },
];

const ExploreContent: React.FC = () => (
  <div>
    <div className="flex justify-between items-center mb-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Explorar Investimentos</h3>
      <div className="relative w-64">
        <input
          type="text"
          placeholder="Buscar ativos..."
          className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 py-2.5 pl-10 pr-4 rounded-lg text-sm text-gray-700 dark:text-gray-100 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
          aria-label="Buscar ativos"
        />
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <FontAwesomeIcon icon={faSearch} className="text-gray-400 dark:text-gray-500" />
        </div>
      </div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {categories.map((category) => (
        <div
          key={category.title}
          className="bg-white dark:bg-slate-950 rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg"
        >
          <div className={`bg-${category.color}-600 dark:bg-${category.color}-500 p-4 text-white`}>
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">{category.title}</h3>
              <FontAwesomeIcon icon={faChartBar} className="text-xl" />
            </div>
            <p className="text-sm opacity-90 mt-1">{category.description}</p>
          </div>
          <div className="p-4">
            {category.items.map((item) => (
              <div
                key={item.name}
                className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-700 last:border-0"
              >
                <div className="flex items-center">
                  <div
                    className={`w-8 h-8 rounded-full bg-${category.color}-100 dark:bg-${category.color}-900 flex items-center justify-center text-${category.color}-600 dark:text-${category.color}-400 mr-3`}
                  >
                    <FontAwesomeIcon icon={item.icon} />
                  </div>
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{item.name}</span>
                </div>
                <span
                  className={`text-sm font-medium ${item.isLoss ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}
                >
                  {item.performance}
                </span>
              </div>
            ))}
            <button
              className={`w-full mt-4 py-2 bg-${category.color}-600 dark:bg-${category.color}-500 hover:bg-${category.color}-700 dark:hover:bg-${category.color}-600 text-white rounded-lg text-sm font-semibold transition-all duration-200 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-${category.color}-500 focus:ring-opacity-50`}
              aria-label={`Ver todos os ${category.title}`}
            >
              Ver todos
            </button>
          </div>
        </div>
      ))}
    </div>
    <div className="bg-white dark:bg-slate-950 rounded-xl shadow-md p-6 mb-8 transition-all duration-300">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Recomendados para você</h3>
        <button
          className="text-blue-600 dark:text-blue-400 text-sm font-semibold hover:text-blue-700 dark:hover:text-blue-300 transition-all duration-200"
          aria-label="Ver mais recomendações"
        >
          Ver mais
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {recommendations.map((rec) => (
          <div
            key={rec.title}
            className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 transition-all duration-200 hover:shadow-md"
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <h4 className="text-base font-semibold text-gray-900 dark:text-gray-100">{rec.title}</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">{rec.details}</p>
              </div>
              <div
                className={`bg-${rec.color}-100 dark:bg-${rec.color}-900 text-${rec.color}-600 dark:text-${rec.color}-400 px-2 py-1 rounded text-xs font-semibold`}
              >
                {rec.type}
              </div>
            </div>
            <div className="flex justify-between items-center mb-4">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">{rec.metrics.dividend ? 'Dividend Yield' : 'Rentabilidade'}</p>
                <p className="text-green-600 dark:text-green-400 font-semibold">{rec.metrics.rentability || rec.metrics.dividend}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">{rec.metrics.liquidity ? 'Liquidez' : rec.metrics.quote ? 'Cota' : 'Taxa'}</p>
                <p className="text-gray-900 dark:text-gray-100 font-semibold">{rec.metrics.liquidity || rec.metrics.quote || rec.metrics.fee}</p>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span
                className="text-xs text-gray-500 dark:text-gray-400 underline cursor-help"
                aria-label={`Risco: ${rec.metrics.risk}`}
              >
                Risco: {rec.metrics.risk}
              </span>
              <button
                className="px-3 py-1 bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 text-white rounded-lg text-xs font-semibold transition-all duration-200 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                aria-label={`Investir em ${rec.title}`}
              >
                Investir
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default ExploreContent;