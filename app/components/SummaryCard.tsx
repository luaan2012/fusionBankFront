import React from 'react';

interface Performance {
    value: string;
    trend: 'up' | 'down';
    period: string;
}

interface SummaryCardProps {
    title: string;
    icon: string;
    value: string;
    performance: Performance;
}

const SummaryCard: React.FC<SummaryCardProps> = ({ title, icon, value, performance }) => (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-500 dark:text-gray-300 text-sm font-medium">{title}</h3>
            <i className={`${icon} text-gray-400`}></i>
        </div>
        <p className={`text-${title === 'Melhor Ativo' ? 'lg' : '2xl'} font-bold dark:text-white`}>{value}</p>
        <div className="mt-2 flex items-center">
            <span className={`text-green-500 dark:dark-profit text-sm font-medium`}>
                <i className={`fas fa-arrow-${performance.trend} mr-1`}></i> {performance.value}
            </span>
            <span className="text-gray-500 dark:text-gray-400 text-sm ml-2">{performance.period}</span>
        </div>
    </div>
);

export default SummaryCard;