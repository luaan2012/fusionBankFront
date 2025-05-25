import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInbox, faSpinner, faArrowUp, faArrowDown } from '@fortawesome/free-solid-svg-icons';
import { useAppStore } from '~/context/appStore';
import { mapInvestmentsToDisplay } from '~/utils/map';
import type { Investment } from '~/types/investment'
import { normalizeInvestmentType, formatPercent } from '~/utils/util'

interface InvestmentsProps {
  investments: Investment[];
  loading: boolean;
}

export const InvestmentsDisplay = ({ investments, loading }: InvestmentsProps) => {
  const { setView } = useAppStore();
  const investmentsMap = mapInvestmentsToDisplay(investments);

  return (
    <div className="bg-white dark:bg-gray-950 rounded-2xl shadow-lg mb-6 sm:mb-8 p-4 sm:p-6 transition-all duration-300 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="flex justify-between items-center mb-4 sm:mb-6 flex-wrap gap-2">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
          Meus Investimentos
        </h2>
        <button
          onClick={() => setView('investments')}
          className="text-blue-600 dark:text-blue-400 text-sm font-semibold hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-md px-2 sm:px-3 py-1 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          aria-label="Ver todos os investimentos"
        >
          Ver todos
        </button>
      </div>
      {loading ? (
        <div className="flex justify-center items-center h-24 sm:h-32">
          <FontAwesomeIcon
            icon={faSpinner}
            className="text-2xl sm:text-3xl text-gray-500 dark:text-gray-400 animate-spin"
            aria-label="Carregando investimentos"
          />
        </div>
      ) : (
        <div className="space-y-4 sm:space-y-6">
          {investmentsMap.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {investmentsMap
                .sort((a, b) => b.valueNormalized - a.valueNormalized)
                .slice(0, 3)
                .map((investment, index) => (
                  <div
                    key={index}
                    className="border border-gray-200 dark:border-gray-700 rounded-xl p-4 sm:p-5 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 transition-transform duration-300 sm:hover:scale-105 sm:hover:shadow-lg"
                  >
                    <div className="mb-3 sm:mb-4">
                      <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 font-medium truncate">
                        {normalizeInvestmentType(investment.type)}
                      </p>
                      <p className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mt-1 truncate">
                        {investment.name}
                      </p>
                    </div>
                    <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
                      {investment.value}
                    </p>
                    <div className="grid grid-cols-3 gap-2 sm:gap-4">
                      <div>
                        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">Aplicado:</p>
                        <p className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white truncate">
                          {investment.applied}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">Rendimento:</p>
                        <p className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white truncate">
                          {investment.yield}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">Rentabilidade:</p>
                        <p
                          className={`text-xs sm:text-sm font-semibold flex items-center gap-1 ${
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
            <div className="flex flex-col sm:flex-row items-center justify-center py-8 sm:py-10 text-gray-500 dark:text-gray-400">
              <FontAwesomeIcon icon={faInbox} className="text-3xl sm:text-4xl mr-0 sm:mr-4 mb-2 sm:mb-0" />
              <p className="text-base sm:text-lg font-medium text-center sm:text-left">
                Nenhum investimento encontrado
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}