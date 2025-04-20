import React from 'react';

interface CategoryItem {
    name: string;
    performance: string;
    icon: string;
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
            { name: 'Tesouro Direto', performance: '+5.3%', icon: 'fa-landmark' },
            { name: 'CDB', performance: '+6.1%', icon: 'fa-university' },
            { name: 'LCI/LCA', performance: '+5.8%', icon: 'fa-home' },
        ],
    },
    {
        title: 'Renda Variável',
        description: 'Maior potencial de retorno',
        color: 'green',
        items: [
            { name: 'Ações', performance: '+12.7%', icon: 'fa-chart-line' },
            { name: 'FIIs', performance: '+8.3%', icon: 'fa-building' },
            { name: 'ETFs', performance: '+9.5%', icon: 'fa-globe' },
        ],
    },
    {
        title: 'Fundos',
        description: 'Diversificação profissional',
        color: 'purple',
        items: [
            { name: 'Multimercado', performance: '+7.2%', icon: 'fa-balance-scale' },
            { name: 'Imobiliário', performance: '+6.8%', icon: 'fa-home' },
            { name: 'Cambial', performance: '-1.2%', icon: 'fa-dollar-sign', isLoss: true },
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
            <h3 className="text-lg font-semibold dark:text-white">Explorar Investimentos</h3>
            <div className="relative w-64">
                <input
                    type="text"
                    placeholder="Buscar ativos..."
                    className="w-full bg-gray-100 dark:bg-gray-700 border-0 py-2 pl-10 pr-4 rounded-lg text-sm focus:outline-none dark:text-gray-300"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <i className="fas fa-search text-gray-400"></i>
                </div>
            </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {categories.map(category => (
                <div key={category.title} className="bg-white dark:bg-gray-700 rounded-xl shadow-lg overflow-hidden">
                    <div className={`bg-${category.color}-500 p-4 text-white`}>
                        <div className="flex justify-between items-center">
                            <h3 className="text-lg font-semibold">{category.title}</h3>
                            <i className="fas fa-chart-bar text-xl"></i>
                        </div>
                        <p className="text-sm opacity-90 mt-1">{category.description}</p>
                    </div>
                    <div className="p-4">
                        {category.items.map(item => (
                            <div key={item.name} className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-600 last:border-0">
                                <div className="flex items-center">
                                    <div className={`w-8 h-8 rounded-full bg-${category.color}-100 dark:bg-${category.color}-900 flex items-center justify-center text-${category.color}-500 dark:text-${category.color}-300 mr-3`}>
                                        <i className={`fas ${item.icon}`}></i>
                                    </div>
                                    <span className="text-sm dark:text-white">{item.name}</span>
                                </div>
                                <span className={`text-sm font-medium ${item.isLoss ? 'text-red-500 dark:dark-loss' : 'text-green-500 dark:dark-profit'}`}>
                                    {item.performance}
                                </span>
                            </div>
                        ))}
                        <button className={`w-full mt-4 py-2 bg-${category.color}-500 text-white rounded-lg text-sm font-medium hover:bg-${category.color}-600`}>
                            Ver todos
                        </button>
                    </div>
                </div>
            ))}
        </div>
        <div className="bg-white dark:bg-gray-700 rounded-xl shadow-lg p-6 mb-8">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold dark:text-white">Recomendados para você</h3>
                <button className="text-blue-500 text-sm font-medium">Ver mais</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {recommendations.map(rec => (
                    <div key={rec.title} className="bg-gray-50 dark:bg-gray-600 rounded-lg p-4">
                        <div className="flex justify-between items-start mb-3">
                            <div>
                                <h4 className="font-medium dark:text-white">{rec.title}</h4>
                                <p className="text-sm text-gray-500 dark:text-gray-300">{rec.details}</p>
                            </div>
                            <div className={`bg-${rec.color}-100 dark:bg-${rec.color}-900 text-${rec.color}-500 dark:text-${rec.color}-300 px-2 py-1 rounded text-xs font-medium`}>
                                {rec.type}
                            </div>
                        </div>
                        <div className="flex justify-between items-center mb-4">
                            <div>
                                <p className="text-xs text-gray-500 dark:text-gray-300">{rec.metrics.dividend ? 'Dividend Yield' : 'Rentabilidade'}</p>
                                <p className="text-green-500 dark:dark-profit font-medium">{rec.metrics.rentability || rec.metrics.dividend}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 dark:text-gray-300">{rec.metrics.liquidity ? 'Liquidez' : rec.metrics.quote ? 'Cota' : 'Taxa'}</p>
                                <p className="dark:text-white font-medium">{rec.metrics.liquidity || rec.metrics.quote || rec.metrics.fee}</p>
                            </div>
                        </div>
                        <div className="flex justify-between items-center">
                            <div className="tooltip">
                                <span className="text-xs text-gray-500 dark:text-gray-300 underline cursor-help">Risco</span>
                                <span className="tooltip-text">{rec.metrics.risk}</span>
                            </div>
                            <button className="px-3 py-1 bg-blue-500 text-white rounded text-xs font-medium hover:bg-blue-600">
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