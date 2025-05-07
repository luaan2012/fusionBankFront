import { faInbox } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react';
import type { Investment } from '~/models/investment'
import { mapInvestmentsToDisplay } from '~/utils/map'

interface InvestmentsProps{
  investments: Investment[];
}

export function InvestmentsDisplay({investments}: InvestmentsProps) {
  const investmentsMap = mapInvestmentsToDisplay(investments)

  return (
    <div className="bg-white dark:bg-dark-secondary rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-light">Meus Investimentos</h2>
        <a href="#" className="text-primary-light hover:text-primary-dark text-sm">
          Ver todos
        </a>
      </div>
      <div className="space-y-4">
        {investmentsMap.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {investmentsMap.map((investment, index) => (
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
        ) : (
          <div className="flex items-center justify-center flex-1 text-gray-500 dark:text-gray-400">
            <FontAwesomeIcon icon={faInbox} className="text-2xl mr-2" />
            <p>Nada encontrado ainda</p>
          </div>
        )}
      </div>
    </div>
  );
};