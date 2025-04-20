import React, { useState } from 'react';

const ReportsContent: React.FC = () => {
    const [showTaxResult, setShowTaxResult] = useState<boolean>(false);

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold dark:text-white">Relatórios e Impostos</h3>
                <button className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium">
                    <i className="fas fa-download mr-2"></i> Exportar tudo
                </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-white dark:bg-gray-700 rounded-xl shadow-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h4 className="font-medium dark:text-white">Extrato Mensal</h4>
                        <i className="fas fa-file-invoice-dollar text-gray-400"></i>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-300 mb-4">Detalhamento de todas as movimentações do mês.</p>
                    {['Junho 2023', 'Maio 2023', 'Abril 2023'].map(month => (
                        <div key={month} className="flex justify-between items-center py-2">
                            <span className="text-sm dark:text-white">{month}</span>
                            <button className="text-blue-500 text-sm font-medium">Download</button>
                        </div>
                    ))}
                </div>
                <div className="bg-white dark:bg-gray-700 rounded-xl shadow-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h4 className="font-medium dark:text-white">Informe de Rendimentos</h4>
                        <i className="fas fa-receipt text-gray-400"></i>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-300 mb-4">Rendimentos para Imposto de Renda.</p>
                    {['2023 (Atual)', '2022', '2021'].map(year => (
                        <div key={year} className="flex justify-between items-center py-2">
                            <span className="text-sm dark:text-white">{year}</span>
                            <button className="text-blue-500 text-sm font-medium">Download</button>
                        </div>
                    ))}
                </div>
                <div className="bg-white dark:bg-gray-700 rounded-xl shadow-lg p-6 md:col-span-2">
                    <div className="flex items-center justify-between mb-4">
                        <h4 className="font-medium dark:text-white">Calculadora de Impostos</h4>
                        <i className="fas fa-calculator text-gray-400"></i>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-300 mb-4">Simule o imposto devido.</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-2 dark:text-gray-300">Tipo de investimento</label>
                            <select className="w-full bg-gray-100 dark:bg-gray-600 border-0 py-2 pl-4 pr-8 rounded-lg text-sm focus:outline-none dark:text-gray-300">
                                <option>Renda Fixa (CDB, LCI, LCA)</option>
                                <option>Tesouro Direto</option>
                                <option>Fundos de Investimento</option>
                                <option>Ações</option>
                                <option>FIIs</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2 dark:text-gray-300">Valor investido</label>
                            <input
                                type="text"
                                className="w-full bg-gray-100 dark:bg-gray-600 border-0 py-2 pl-4 pr-8 rounded-lg text-sm focus:outline-none dark:text-gray-300"
                                placeholder="R$ 0,00"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2 dark:text-gray-300">Data de aplicação</label>
                            <input
                                type="date"
                                className="w-full bg-gray-100 dark:bg-gray-600 border-0 py-2 pl-4 pr-8 rounded-lg text-sm focus:outline-none dark:text-gray-300"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2 dark:text-gray-300">Data de resgate</label>
                            <input
                                type="date"
                                className="w-full bg-gray-100 dark:bg-gray-600 border-0 py-2 pl-4 pr-8 rounded-lg text-sm focus:outline-none dark:text-gray-300"
                            />
                        </div>
                    </div>
                    <button
                        onClick={() => setShowTaxResult(true)}
                        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium"
                    >
                        Calcular Imposto
                    </button>
                    {showTaxResult && (
                        <div className="mt-6 bg-blue-50 dark:bg-blue-900 rounded-lg p-4 animate-fade-in">
                            <div className="flex items-center">
                                <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-800 flex items-center justify-center text-blue-500 dark:text-blue-300 mr-3">
                                    <i className="fas fa-info-circle"></i>
                                </div>
                                <div>
                                    <p className="text-sm font-medium dark:text-white">
                                        Imposto devido: <span className="text-blue-500">R$ 245,67</span>
                                    </p>
                                    <p className="text-xs text-blue-700 dark:text-blue-200">Alíquota de 15% (período entre 1 e 2 anos)</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ReportsContent;