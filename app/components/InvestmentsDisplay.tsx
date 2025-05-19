import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInbox, faSpinner, faArrowUp, faArrowDown } from '@fortawesome/free-solid-svg-icons';
import { useAppStore } from '~/context/appStore';
import type { Investment } from '~/models/investment';
import { mapInvestmentsToDisplay } from '~/utils/map';
import { normalizeInvestmentType, formatPercent } from '~/utils/utils';

interface InvestmentsProps {
  investments: Investment[];
  loading: boolean;
}

export function InvestmentsDisplay({ investments, loading }: InvestmentsProps) {
  const { setView } = useAppStore();
  const investmentsMap = mapInvestmentsToDisplay(investments);

  return (
    <div className="bg-white dark:bg-gray-950 rounded-2xl shadow-lg mb-8 p-6 transition-all duration-300 hover:shadow-xl bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Meus Investimentos</h2>
        <button
          onClick={() => setView('investments')}
          className="text-blue-600 dark:text-blue-400 text-sm font-semibold hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-md px-3 py-1 transition-all duration-200"
        >
          Ver todos
        </button>
      </div>
      {loading ? (
        <div className="flex justify-center items-center h-32">
          <FontAwesomeIcon
            icon={faSpinner}
            className="text-3xl text-gray-500 dark:text-gray-400 animate-spin"
            aria-label="Carregando investimentos"
          />
        </div>
      ) : (
        <div className="space-y-6">
          {investmentsMap.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {investmentsMap.sort((a, b) => b.valueNormalized - a.valueNormalized).slice(0, 3).map((investment, index) => (
                <div
                  key={index}
                  className="border border-gray-200 dark:border-gray-700 rounded-2xl p-5 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 hover:scale-105 hover:shadow-lg transition-all duration-300"
                >
                  <div className="mb-4">
                    <p className="text-sm text-gray-600 dark:text-gray-300 font-medium">
                      {normalizeInvestmentType(investment.type)}
                    </p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white mt-1">
                      {investment.name}
                    </p>
                  </div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    {investment.value}
                  </p>
                  <div className="flex justify-between gap-4">
                    <div className="flex-1">
                      <p className="text-sm text-gray-600 dark:text-gray-300">Aplicado:</p>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">
                        {investment.applied}
                      </p>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-600 dark:text-gray-300">Rendimento:</p>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">
                        {investment.yield}
                      </p>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-600 dark:text-gray-300">Rentabilidade:</p>
                      <p
                        className={`text-sm font-semibold flex items-center gap-1 ${
                          investment.regularMarketChangePercent > 0
                            ? 'text-green-500'
                            : investment.regularMarketChangePercent < 0
                            ? 'text-red-500'
                            : 'text-gray-500'
                        }`}
                      >
                        {investment.regularMarketChangePercent > 0 ? (
                          <FontAwesomeIcon icon={faArrowUp} className="w-3 h-3" />
                        ) : investment.regularMarketChangePercent < 0 ? (
                          <FontAwesomeIcon icon={faArrowDown} className="w-3 h-3" />
                        ) : (
                          <span className="w-3 h-3" />
                        )}
                        {formatPercent(investment.regularMarketChangePercent / 100)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center py-10 text-gray-500 dark:text-gray-400">
              <FontAwesomeIcon icon={faInbox} className="text-4xl mr-4" />
              <p className="text-lg font-medium">Nenhum investimento encontrado</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}