import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSpinner,
  faChartPie,
  faCreditCard,
  faPiggyBank,
  faExclamationCircle,
} from '@fortawesome/free-solid-svg-icons';
import { ActionMapper, formatNumberAccount, formatToBRL, translateAccountType } from '../utils/utils';
import { useAppStore } from '~/context/appStore';
import type { Account } from '~/models/account';
import type { Investment } from '~/models/investment';
import type { Card } from 'types';

interface AccountSummaryProps {
  user: Account | null;
  investment: Investment[];
  card: Card[];
  loadingUser: boolean;
  loadingInvestment: boolean;
  loadingCard: boolean;
}

export function AccountSummary({ user, investment, card, loadingCard, loadingInvestment, loadingUser }: AccountSummaryProps) {
  const { setView } = useAppStore();

  // Calcula totais de investimentos
  const investmentTotal = investment.reduce((acc, curr) => acc + curr.totalBalance, 0);
  const paidOffTotal = investment.reduce((acc, curr) => acc + curr.paidOff, 0);

  // Mock budget tracker
  const budget = {
    spent: 1800.0,
    limit: 5000.0,
  };

  // Mock credit card overview
  const creditCard = {
    balance: 1200.0,
    dueDate: '2025-05-25',
  };

  // Função para renderizar mensagem de "Nada encontrado"
  const renderEmptyState = (message: string) => (
    <div className="flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-400 animate-fade-in">
      <FontAwesomeIcon icon={faExclamationCircle} className="text-2xl mb-2" />
      <p className="text-sm font-medium">{message}</p>
    </div>
  );

  return (
    <div
      className="bg-white mb-6 dark:bg-slate-950 rounded-xl shadow-md p-6 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800"
      role="region"
      aria-labelledby="account-summary-title"
    >
      <div className="flex justify-between items-center mb-6">
        <h2 id="account-summary-title" className="text-xl font-semibold text-gray-900 dark:text-gray-100">
          Minha Conta
        </h2>
        <button
          onClick={() => setView('accountEdit')}
          className="text-blue-600 dark:text-blue-400 text-sm font-medium hover:underline transition-colors duration-200 cursor-pointer"
          aria-label="Ver detalhes da conta"
        >
          Ver detalhes
        </button>
      </div>

      {/* Widgets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Account Card */}
        <div
          className="rounded-xl p-4 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 border border-gray-200 dark:border-gray-700 shadow-md hover:shadow-lg transition-all duration-300 animate-slide-in w-full"
          role="region"
          aria-labelledby="account-card-title"
        >
          <h3 id="account-card-title" className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
            Conta
          </h3>
          {loadingUser ? (
            <div className="flex justify-center items-center h-32">
              <FontAwesomeIcon icon={faSpinner} className="text-2xl text-gray-500 animate-spin" aria-label="Carregando conta" />
            </div>
          ) : !user ? (
            renderEmptyState('Nenhuma conta encontrada')
          ) : (
            <div>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                    {translateAccountType(user.accountType)}
                  </p>
                  <p className="text-base font-semibold text-gray-900 dark:text-gray-100 mt-1">
                    {formatNumberAccount(user.accountNumber)}
                  </p>
                </div>
                <span
                  className={`text-xs font-medium px-3 py-1 rounded-full ${
                    'active' === 'active'
                      ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300'
                      : 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300'
                  }`}
                >
                  {'active' === 'active' ? 'Ativa' : 'Inativa'}
                  <span className="sr-only">Status da conta</span>
                </span>
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                {formatToBRL(user.balance)}
              </p>
              <div className="flex flex-wrap gap-2">
                {ActionMapper(user.accountType)?.map((actionItem, actionIdx) => (
                  <button
                    key={actionIdx}
                    className="text-xs font-medium px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer hover:bg-blue-700 dark:hover:bg-blue-600 hover:shadow-md"
                    onClick={() => setView(actionItem?.route)}
                    aria-label={`Executar ${actionItem?.action} para conta ${user?.accountNumber}`}
                  >
                    {actionItem?.action}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Investment Snapshot */}
        <div
          className="rounded-xl p-4 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 border border-gray-200 dark:border-gray-700 shadow-md hover:shadow-lg transition-all duration-300 animate-slide-in w-full"
          role="region"
          aria-labelledby="investment-snapshot-title"
        >
          <h3 id="investment-snapshot-title" className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
            Resumo de Investimentos
          </h3>
          {loadingInvestment ? (
            <div className="flex justify-center items-center h-32">
              <FontAwesomeIcon icon={faSpinner} className="text-2xl text-gray-500 animate-spin" aria-label="Carregando investimentos" />
            </div>
          ) : investment.length === 0 ? (
            renderEmptyState('Nenhum investimento encontrado')
          ) : (
            <div>
              <div className="flex items-center mb-4">
                <FontAwesomeIcon icon={faChartPie} className="text-2xl text-blue-600 dark:text-blue-400 mr-2" />
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                    Total investido: {formatToBRL(investmentTotal)}
                  </p>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                    Retornos recentes: <span className="text-green-600 dark:text-green-400">{formatToBRL(paidOffTotal)}</span>
                  </p>
                </div>
              </div>
              <button
                className="flex items-center px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-700 dark:hover:bg-blue-600 hover:shadow-md hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                onClick={() => setView('investments')}
                aria-label="Explorar opções de investimento"
              >
                Explorar investimentos
              </button>
            </div>
          )}
        </div>

        {/* Budget Tracker */}
        <div
          className="rounded-xl p-4 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 border border-gray-200 dark:border-gray-700 shadow-md hover:shadow-lg transition-all duration-300 animate-slide-in w-full"
          role="region"
          aria-labelledby="budget-tracker-title"
        >
          <h3 id="budget-tracker-title" className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
            Controle de Orçamento
          </h3>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">Orçamento Mensal</p>
          <div className="mb-4">
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
              <div
                className="bg-yellow-600 h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${(budget.spent / budget.limit) * 100}%` }}
              ></div>
            </div>
            <div className="flex justify-between mt-1">
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Gasto: {formatToBRL(budget.spent)}
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Limite: {formatToBRL(budget.limit)}
              </p>
            </div>
            <span className="sr-only">
              Progresso: {(budget.spent / budget.limit) * 100}% do orçamento utilizado
            </span>
          </div>
          <button
            className="flex items-center px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-700 dark:hover:bg-blue-600 hover:shadow-md hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
            onClick={() => setView('budget')}
            aria-label="Gerenciar orçamento mensal"
          >
            <FontAwesomeIcon icon={faPiggyBank} className="mr-2" />
            Gerenciar orçamento
          </button>
        </div>

        {/* Credit Card */}
        <div
          className="rounded-xl p-4 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 border border-gray-200 dark:border-gray-700 shadow-md hover:shadow-lg transition-all duration-300 animate-slide-in w-full"
          role="region"
          aria-labelledby="credit-card-title"
        >
          <h3 id="credit-card-title" className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
            Cartão de Crédito
          </h3>
          {loadingCard ? (
            <div className="flex justify-center items-center h-32">
              <FontAwesomeIcon icon={faSpinner} className="text-2xl text-gray-500 animate-spin" aria-label="Carregando cartão de crédito" />
            </div>
          ) : card.length === 0 ? (
            renderEmptyState('Nenhum cartão de crédito encontrado')
          ) : (
            <div>
              <div className="flex items-center mb-4">
                <FontAwesomeIcon icon={faCreditCard} className="text-2xl text-blue-600 dark:text-blue-400 mr-2" />
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                    Saldo atual: <span className="text-red-600 dark:text-red-400">{formatToBRL(creditCard.balance)}</span>
                  </p>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                    Vencimento: {creditCard.dueDate}
                  </p>
                </div>
              </div>
              <button
                className="flex items-center px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-700 dark:hover:bg-blue-600 hover:shadow-md hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                onClick={() => setView('pay-credit')}
                aria-label="Pagar fatura do cartão de crédito"
              >
                Pagar fatura
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}