import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserTie, faChartLine, faClock, faMoneyBillWave, faBuilding, faChartPie, faWallet, faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import { useInvestmentStore } from '~/context/investmentStore';
import { mapInvestmentsToInvestmentDisplay } from '~/utils/map';
import { useAccountStore } from '~/context/accountStore'
import type { InvestmentProfile } from '~/types/investment'
import { formatDateBR } from '~/utils/util'
import { useToast } from '../Toasts/ToastContext'

export const ProfileContent = () => {
  const [isProfileModalOpen, setIsProfileModalOpen] = useState<boolean>(false);
  const [isQuestionnaireOpen, setIsQuestionnaireOpen] = useState<boolean>(false);
  const { saveInvestmentProfile, user, updateLocalUser } = useAccountStore();
  const { investment } = useInvestmentStore();
  const { openToast } = useToast();

  const initialProfile: InvestmentProfile | null = user.investmentProfile
    ? {
        type: user.investmentProfile.riskTolerance >= 7
          ? 'Agressivo'
          : user.investmentProfile.riskTolerance >= 4
          ? 'Moderado'
          : 'Conservador',
        lastUpdated: user.investmentProfile.lastUpdated || new Date(),
        riskTolerance: user.investmentProfile.riskTolerance || 5,
        experience: user.investmentProfile.experience || 'Intermediário (3-5 anos)',
        financialGoals: user.investmentProfile.financialGoals || 'Crescimento patrimonial e aposentadoria',
        investmentHorizon: user.investmentProfile.investmentHorizon || 'Médio a longo prazo (5-10 anos)',
      }
    : null;

  const [profile, setProfile] = useState<InvestmentProfile | null>(initialProfile);
  const [questionnaire, setQuestionnaire] = useState({
    riskTolerance: profile?.riskTolerance ? Math.round(profile.riskTolerance / 2) : 3,
    experience: profile?.experience || '1-3 anos',
    financialGoals: profile?.financialGoals || 'Crescimento patrimonial',
    investmentHorizon: profile?.investmentHorizon || '3-5 anos',
  });

  const userInvestments = mapInvestmentsToInvestmentDisplay(investment);

  const handleQuestionnaireChange = (field: string, value: string | number) => {
    setQuestionnaire((prev) => ({ ...prev, [field]: value }));
  };

  const calculateProfile = async () => {
    const riskScore = questionnaire.riskTolerance * 2;
    let profileType: 'Conservador' | 'Moderado' | 'Agressivo' = 'Conservador';
    if (riskScore >= 7) profileType = 'Agressivo';
    else if (riskScore >= 4) profileType = 'Moderado';

    const newProfile: InvestmentProfile = {
      type: profileType,
      lastUpdated: new Date(),
      riskTolerance: riskScore,
      experience: questionnaire.experience as InvestmentProfile['experience'],
      financialGoals: questionnaire.financialGoals,
      investmentHorizon: questionnaire.investmentHorizon as InvestmentProfile['investmentHorizon'],
    };

    setProfile(newProfile);
    const response = await saveInvestmentProfile(newProfile);

    openToast({
      type: response ? 'success' : 'error',
      message: response
        ? profile
          ? 'Perfil de investimento atualizado com sucesso!'
          : 'Perfil de investimento criado com sucesso!'
        : 'Erro ao salvar perfil de investimento',
      duration: 5000,
      position: 'top-right',
    });

    response && updateLocalUser('investmentProfile', newProfile);
    setIsQuestionnaireOpen(false);
  };

  const profileButtonText = profile ? 'Atualizar Perfil' : 'Criar Perfil';

  return (
    <div className="relative bg-gradient-to-br from-gray-50 via-white to-cyan-200/60 dark:from-gray-900 dark:via-gray-800 dark:to-cyan-900/60 min-h-screen p-6 md:p-8 overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500 dark:from-blue-400 dark:to-cyan-300">
            Seu Perfil de Investidor
          </h2>
        </div>

        {/* Main Content */}
        <div className="flex flex-col md:flex-row gap-6">
          {/* Shared Card Styling Class */}
          <div className="card bg-white/95 dark:bg-gray-800/95 backdrop-blur-2xl rounded-3xl shadow-xl p-6 transition-all duration-300 hover:shadow-2xl border border-gradient-to-r from-blue-200/50 to-cyan-200/50 dark:from-blue-900/50 dark:to-cyan-900/50 animate-in fade-in-up min-w-[300px] max-w-[600px]">
            {profile ? (
              <>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-100 to-cyan-100 dark:from-blue-900 dark:to-cyan-900 flex items-center justify-center text-blue-600 dark:text-blue-400 mr-4 shadow-lg">
                      <FontAwesomeIcon icon={faUserTie} className="text-2xl" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">{profile.type}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Última atualização: {formatDateBR(profile.lastUpdated)}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsProfileModalOpen(true)}
                    className="text-blue-600 dark:text-blue-400 text-sm font-semibold hover:text-blue-700 dark:hover:text-blue-300 transition-all duration-200"
                    aria-label="Ver detalhes do perfil"
                  >
                    Ver Detalhes
                  </button>
                </div>

                <div className="mb-6">
                  <div className="flex items-center mb-2">
                    <FontAwesomeIcon icon={faChartLine} className="text-gray-500 dark:text-gray-400 mr-2" />
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Tolerância ao Risco</h4>
                  </div>
                  <div className="relative w-full bg-gray-200/50 dark:bg-gray-700/50 rounded-full h-4 shadow-inner">
                    <div
                      className="h-4 rounded-full bg-gradient-to-r from-blue-400 to-cyan-500 dark:from-blue-300 dark:to-cyan-400 transition-all duration-500"
                      style={{ width: `${(profile.riskTolerance / 10) * 100}%` }}
                    ></div>
                    <span className="absolute top-1/2 left-2 transform -translate-y-1/2 text-xs text-gray-600 dark:text-gray-300">
                      Conservador
                    </span>
                    <span className="absolute top-1/2 right-2 transform -translate-y-1/2 text-xs text-gray-600 dark:text-gray-300">
                      Agressivo
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                    Nível: {profile.riskTolerance}/10 ({profile.type})
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <div className="flex items-center mb-2">
                      <FontAwesomeIcon icon={faClock} className="text-gray-500 dark:text-gray-400 mr-2" />
                      <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Horizonte de Investimento</h4>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{profile.investmentHorizon}</p>
                  </div>
                  <div>
                    <div className="flex items-center mb-2">
                      <FontAwesomeIcon icon={faChartLine} className="text-gray-500 dark:text-gray-400 mr-2" />
                      <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Experiência de Investimento</h4>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{profile.experience}</p>
                  </div>
                  <div>
                    <div className="flex items-center mb-2">
                      <FontAwesomeIcon icon={faMoneyBillWave} className="text-gray-500 dark:text-gray-400 mr-2" />
                      <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Objetivos Financeiros</h4>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{profile.financialGoals}</p>
                  </div>
                </div>

                <button
                  onClick={() => setIsQuestionnaireOpen(true)}
                  className="w-full py-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-lg text-sm font-semibold hover:from-blue-700 hover:to-cyan-600 transition-all duration-200 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                  aria-label={profileButtonText}
                >
                  {profileButtonText}
                </button>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-8">
                <p className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Nada encontrado aqui</p>
                <button
                  onClick={() => setIsQuestionnaireOpen(true)}
                  className="py-2 px-6 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-lg text-sm font-semibold hover:from-blue-700 hover:to-cyan-600 transition-all duration-200 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                  aria-label="Criar Perfil"
                >
                  Criar Perfil
                </button>
              </div>
            )}
          </div>

          {/* Minhas Aplicações Card */}
          <div
            className="card bg-white/95 dark:bg-gray-800/95 backdrop-blur-2xl rounded-3xl shadow-xl p-6 transition-all duration-300 hover:shadow-2xl border border-gradient-to-r from-blue-200/50 to-cyan-200/50 dark:from-blue-900/50 dark:to-cyan-900/50 animate-in fade-in-up min-w-[300px] max-w-[600px] flex-grow overflow-y-auto max-h-[80vh]"
            style={{
              scrollbarWidth: 'thin',
              scrollbarColor: 'rgba(59, 130, 246, 0.5) rgba(229, 231, 235, 0.2)', // blue-500 and gray-200 for light mode
            }}
          >
            <style>
              {`
                .card::-webkit-scrollbar {
                  width: 8px;
                }
                .card::-webkit-scrollbar-track {
                  background: rgba(229, 231, 235, 0.2); /* gray-200 with opacity */
                  border-radius: 8px;
                  margin: 4px 0;
                }
                .card::-webkit-scrollbar-thumb {
                  background: rgba(59, 130, 246, 0.5); /* blue-500 with opacity */
                  border-radius: 8px;
                  transition: background 0.2s ease-in-out;
                }
                .card::-webkit-scrollbar-thumb:hover {
                  background: rgba(59, 130, 246, 0.8); /* blue-500 darker on hover */
                }
                .dark .card::-webkit-scrollbar-track {
                  background: rgba(55, 65, 81, 0.2); /* gray-700 with opacity */
                }
                .dark .card::-webkit-scrollbar-thumb {
                  background: rgba(96, 165, 250, 0.5); /* blue-400 with opacity */
                }
                .dark .card::-webkit-scrollbar-thumb:hover {
                  background: rgba(96, 165, 250, 0.8); /* blue-400 darker on hover */
                }
              `}
            </style>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500 dark:from-blue-400 dark:to-cyan-300">
                Minhas Aplicações
              </h3>
              <button
                className="text-blue-600 dark:text-blue-400 text-sm font-semibold hover:text-blue-700 dark:hover:text-blue-300 transition-all duration-200"
                aria-label="Ver detalhes das aplicações"
              >
                Ver Detalhes
              </button>
            </div>
            <div className="space-y-6">
              {userInvestments.length > 0 ? (
                userInvestments.map((category, index) => (
                  <div
                    key={category.name}
                    className="bg-gray-50/70 dark:bg-gray-800/70 backdrop-blur-md rounded-xl p-5 transition-all duration-300 hover:bg-gray-100/70 dark:hover:bg-gray-700/70 animate-in fade-in-up"
                    style={{ animationDelay: `${0.1 * (index + 1)}s` }}
                  >
                    <div className="flex items-center mb-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-100 to-cyan-100 dark:from-blue-900 dark:to-cyan-900 flex items-center justify-center mr-3 transition-transform duration-200 hover:scale-110">
                        <FontAwesomeIcon
                          icon={
                            category.name === 'Renda Fixa'
                              ? faWallet
                              : category.name === 'Renda Variável'
                              ? faChartPie
                              : faBuilding
                          }
                          className={`text-${category.color}-600 dark:text-${category.color}-400 text-lg`}
                        />
                      </div>
                      <h4 className="text-base font-bold text-gray-900 dark:text-gray-100">{category.name}</h4>
                    </div>
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Alocação</span>
                      <span className="text-base font-extrabold text-gray-900 dark:text-gray-100">{category.value}%</span>
                    </div>
                    <div className="w-full bg-gray-200/50 dark:bg-gray-700/50 rounded-full h-3 shadow-inner overflow-hidden">
                      <div
                        className={`h-3 rounded-full bg-gradient-to-r from-${category.color}-500 to-${category.color}-700 dark:from-${category.color}-400 dark:to-${category.color}-600 transition-all duration-500 ease-out`}
                        style={{ width: `${category.value}%` }}
                      ></div>
                    </div>
                    <div className="mt-4 space-y-2">
                      {category.items.map((item, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-100/50 dark:hover:bg-gray-600/50 transition-colors duration-200"
                        >
                          <p className="text-xs font-medium text-gray-600 dark:text-gray-300">{item}</p>
                          <span className={`text-xs text-${category.color}-600 dark:text-${category.color}-400`}>
                            {category.name === 'Renda Fixa' ? '📈' : category.name === 'Renda Variável' ? '📊' : '🏠'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-8 animate-in fade-in zoom-in-95 duration-500">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-100 to-cyan-100 dark:from-blue-900 dark:to-cyan-900 flex items-center justify-center mb-4">
                    <FontAwesomeIcon icon={faPlusCircle} className="text-2xl text-blue-600 dark:text-blue-400" />
                  </div>
                  <h4 className="text-lg font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500 dark:from-blue-400 dark:to-cyan-300 mb-2">
                    Nenhuma aplicação encontrada
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300 text-center mb-4">
                    Adicione investimentos para visualizar suas aplicações aqui!
                  </p>
                  <button
                    onClick={() => {/* Add logic to navigate to investment creation */}}
                    className="py-2 px-6 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-lg text-sm font-semibold hover:from-blue-700 hover:to-cyan-600 transition-all duration-200 hover:shadow-xl transform hover:scale-105"
                    aria-label="Adicionar Investimento"
                  >
                    Adicionar Investimento
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Profile Summary Modal */}
        {isProfileModalOpen && profile && (
          <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
            <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-2xl rounded-3xl p-8 max-w-md w-full shadow-2xl transform transition-all duration-500 animate-fade-in">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Resumo do Perfil</h3>
                <button
                  onClick={() => setIsProfileModalOpen(false)}
                  className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                  aria-label="Fechar modal"
                >
                  ✕
                </button>
              </div>
              <div className="space-y-4">
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  <span className="font-semibold">Tipo de Perfil:</span> {profile.type}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  <span className="font-semibold">Tolerância ao Risco:</span> {profile.riskTolerance}/10
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  <span className="font-semibold">Experiência:</span> {profile.experience}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  <span className="font-semibold">Objetivos Financeiros:</span> {profile.financialGoals}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  <span className="font-semibold">Horizonte de Investimento:</span> {profile.investmentHorizon}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  <span className="font-semibold">Última Atualização:</span> {formatDateBR(profile.lastUpdated)}
                </p>
              </div>
              <button
                onClick={() => setIsProfileModalOpen(false)}
                className="mt-4 w-full py-2 bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 text-white rounded-lg text-sm font-semibold transition-all duration-200"
                aria-label="Fechar resumo do perfil"
              >
                Fechar
              </button>
            </div>
          </div>
        )}

        {/* Questionnaire Modal */}
        {isQuestionnaireOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
            <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-2xl rounded-3xl p-8 max-w-md w-full shadow-2xl transform transition-all duration-500 animate-fade-in">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Questionário de Perfil</h3>
                <button
                  onClick={() => setIsQuestionnaireOpen(false)}
                  className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                  aria-label="Fechar questionário"
                >
                  ✕
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                    Qual é a sua tolerância ao risco? (1 = Muito Baixa, 5 = Muito Alta)
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={questionnaire.riskTolerance}
                    onChange={(e) => handleQuestionnaireChange('riskTolerance', parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-gray-600 dark:text-gray-300">
                    <span>1</span>
                    <span>5</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                    Qual é a sua experiência com investimentos?
                  </label>
                  <select
                    value={questionnaire.experience}
                    onChange={(e) => handleQuestionnaireChange('experience', e.target.value)}
                    className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 py-2 pl-4 pr-8 rounded-lg text-sm text-gray-700 dark:text-gray-100 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  >
                    <option>Iniciante (menos de 1 ano)</option>
                    <option>1-3 anos</option>
                    <option>Intermediário (3-5 anos)</option>
                    <option>Avançado (mais de 5 anos)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                    Quais são seus objetivos financeiros?
                  </label>
                  <select
                    value={questionnaire.financialGoals}
                    onChange={(e) => handleQuestionnaireChange('financialGoals', e.target.value)}
                    className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 py-2 pl-4 pr-8 rounded-lg text-sm text-gray-700 dark:text-gray-100 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  >
                    <option>Preservação de capital</option>
                    <option>Crescimento patrimonial</option>
                    <option>Renda passiva</option>
                    <option>Aposentadoria</option>
                    <option>Outros</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                    Qual é o seu horizonte de investimento?
                  </label>
                  <select
                    value={questionnaire.investmentHorizon}
                    onChange={(e) => handleQuestionnaireChange('investmentHorizon', e.target.value)}
                    className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 py-2 pl-4 pr-8 rounded-lg text-sm text-gray-700 dark:text-gray-100 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  >
                    <option>Curto prazo (menos de 1 ano)</option>
                    <option>1-3 anos</option>
                    <option>3-5 anos</option>
                    <option>Médio a longo prazo (5-10 anos)</option>
                    <option>Longo prazo (mais de 10 anos)</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-4 mt-6">
                <button
                  onClick={() => setIsQuestionnaireOpen(false)}
                  className="py-2 px-6 bg-gray-200/80 dark:bg-gray-600/80 backdrop-blur-sm text-gray-900 dark:text-white rounded-lg text-sm font-semibold hover:bg-gray-300/80 dark:hover:bg-gray-500/80 transition-all duration-200"
                  aria-label="Cancelar questionário"
                >
                  Cancelar
                </button>
                <button
                  onClick={calculateProfile}
                  className="py-2 px-6 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-lg text-sm font-semibold hover:from-blue-700 hover:to-cyan-600 transition-all duration-200"
                  aria-label="Enviar questionário"
                >
                  Enviar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
