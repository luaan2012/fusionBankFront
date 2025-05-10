import { faInbox, faSpinner } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useAppStore } from '~/context/appStore'
import type { Investment } from '~/models/investment'
import { mapInvestmentsToDisplay } from '~/utils/map'

interface InvestmentsProps{
  investments: Investment[];
  loading: boolean
}

export function InvestmentsDisplay({investments, loading}: InvestmentsProps) {
  const { setView } = useAppStore()
  const investmentsMap = mapInvestmentsToDisplay(investments)

  return (
    <div className="bg-white dark:bg-slate-950 rounded-xl shadow-lg mb-6 p-6 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Meus Investimentos</h2>
        <button
          onClick={() => setView('investments')}
          className="text-blue-600 dark:text-blue-400 text-sm font-medium hover:underline transition-colors duration-200 cursor-pointer"
        >
          Ver todos
        </button>
      </div>
      {loading ? 
          <div className="flex justify-center items-center h-full">
            <FontAwesomeIcon icon={faSpinner} className="text-2xl text-gray-500 animate-spin" aria-label="Carregando conta" />
          </div> :
        <div className="space-y-4">
          {investmentsMap.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {investmentsMap.map((investment, index) => (
                <div
                  key={index}
                  className="border border-gray-200 dark:border-gray-700 rounded-xl p-5 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 hover:shadow-md transition-all duration-300"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                        {investment.type}
                      </p>
                      <p className="text-base font-semibold text-gray-900 dark:text-gray-100 mt-1">
                        {investment.name}
                      </p>
                    </div>
                    <span className="bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 text-xs font-medium px-3 py-1 rounded-full">
                      {investment.rate}
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    {investment.value}
                  </p>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full mb-3 overflow-hidden">
                    <div
                      className={`h-3 ${investment.progressColor} rounded-full transition-all duration-500`}
                      style={{ width: `${investment.progress}%` }}
                      aria-label={`Progresso do investimento: ${investment.progress}%`}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 font-medium">
                    <span>Aplicado: {investment?.applied}</span>
                    <span>Rendimento: {investment?.yield}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center py-8 text-gray-500 dark:text-gray-400">
              <FontAwesomeIcon icon={faInbox} className="text-3xl mr-3" />
              <p className="text-base font-medium">Nada encontrado ainda</p>
            </div>
          )}
        </div>
      }
    </div>
  );
};