import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserTie, faChartLine, faClock, faMoneyBillWave, faMoon, faSun, faInfoCircle, faBuilding, faChartPie, faWallet } from '@fortawesome/free-solid-svg-icons';

const ProfileContent: React.FC = () => {
  // State for profile, dark mode, modals, and questionnaire
  const [isProfileModalOpen, setIsProfileModalOpen] = useState<boolean>(false);
  const [isQuestionnaireOpen, setIsQuestionnaireOpen] = useState<boolean>(false);
  const [profile, setProfile] = useState({
    type: 'Moderado',
    lastUpdated: '15/03/2023',
    riskTolerance: 5, // 1-10 scale
    experience: 'Intermediário (3-5 anos)',
    financialGoals: 'Crescimento patrimonial e aposentadoria',
    investmentHorizon: 'Médio a longo prazo (5-10 anos)',
  });

  // State for questionnaire responses
  const [questionnaire, setQuestionnaire] = useState({
    riskTolerance: 3, // 1-5 scale, will be scaled to 1-10
    experience: '1-3 anos',
    financialGoals: 'Crescimento patrimonial',
    investmentHorizon: '3-5 anos',
  });

  // User's current investments
  const userInvestments = [
    { name: 'Renda Fixa', value: 50, color: 'blue', items: ['CDB 100% CDI: R$ 25.000', 'Tesouro Selic: R$ 15.000'] },
    { name: 'Renda Variável', value: 30, color: 'green', items: ['Ações Petrobras: R$ 10.000', 'ETF S&P 500: R$ 5.000'] },
    { name: 'Fundos Imobiliários', value: 20, color: 'purple', items: ['FII XPML11: R$ 8.000', 'FII HGLG11: R$ 4.000'] },
  ];

  // Handle questionnaire form changes
  const handleQuestionnaireChange = (field: string, value: string | number) => {
    setQuestionnaire((prev) => ({ ...prev, [field]: value }));
  };

  // Calculate profile based on questionnaire
  const calculateProfile = () => {
    const riskScore = questionnaire.riskTolerance * 2; // Scale 1-5 to 1-10
    let profileType = 'Conservador';
    if (riskScore >= 7) profileType = 'Agressivo';
    else if (riskScore >= 4) profileType = 'Moderado';

    setProfile({
      type: profileType,
      lastUpdated: new Date().toLocaleDateString('pt-BR'),
      riskTolerance: riskScore,
      experience: questionnaire.experience,
      financialGoals: questionnaire.financialGoals,
      investmentHorizon: questionnaire.investmentHorizon,
    });
    console.log(profile)
    setIsQuestionnaireOpen(false);
  };

  return (
    <div className={`relative bg-gradient-to-br from-gray-50 via-white to-cyan-200/60 dark:from-gray-900 dark:via-gray-800 dark:to-cyan-900/60 min-h-screen p-6 md:p-8 overflow-hidden`}>
      {/* Particle Background */}
      {/* <div className="absolute inset-0 pointer-events-none">
        <div className="absolute w-72 h-72 bg-cyan-300/20 dark:bg-cyan-800/30 rounded-full blur-3xl top-0 left-0 animate-float"></div>
        <div className="absolute w-96 h-96 bg-indigo-300/20 dark:bg-indigo-800/30 rounded-full blur-3xl bottom-10 right-10 animate-float-slow"></div>
      </div> */}

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header with Dark Mode Toggle */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500 dark:from-blue-400 dark:to-cyan-300">
            Seu Perfil de Investidor
          </h2> 
        </div>

        {/* Main Content: Profile and Investments */}
        <div className="flex flex-col md:flex-row gap-6">
          {/* Profile Card */}
          <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl shadow-xl p-6 md:w-1/2 transition-all duration-500 hover:shadow-2xl border border-gray-100/50 dark:border-gray-700/20 animate-fade-in-up">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <div className="w-16 h-16 rounded-full bg-blue-100/80 dark:bg-blue-900/80 backdrop-blur-sm flex items-center justify-center text-blue-600 dark:text-blue-400 mr-4 shadow-lg animate-glow">
                  <FontAwesomeIcon icon={faUserTie} className="text-2xl animate-pulse-slow" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">{profile.type}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Última atualização: {profile.lastUpdated}</p>
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

            {/* Risk Tolerance Meter */}
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

            {/* Profile Details */}
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

            {/* Update Profile Button */}
            <button
              onClick={() => setIsQuestionnaireOpen(true)}
              className="w-full py-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-lg text-sm font-semibold hover:from-blue-700 hover:to-cyan-600 transition-all duration-200 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 animate-pulse-button"
              aria-label="Atualizar ou refazer questionário de perfil"
            >
              Atualizar Perfil
            </button>
          </div>

          {/* Minhas Aplicações Card */}
          <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl shadow-xl p-6 md:w-1/2 transition-all duration-500 hover:shadow-2xl border border-gray-100/50 dark:border-gray-700/20 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Minhas Aplicações</h3>
              <button
                className="text-blue-600 dark:text-blue-400 text-sm font-semibold hover:text-blue-700 dark:hover:text-blue-300 transition-all duration-200"
                aria-label="Ver detalhes das aplicações"
              >
                Ver Detalhes
              </button>
            </div>
            <div className="space-y-4">
              {userInvestments.map((category, index) => (
                <div key={category.name} className="bg-gray-50/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <FontAwesomeIcon
                      icon={category.name === 'Renda Fixa' ? faWallet : category.name === 'Renda Variável' ? faChartPie : faBuilding}
                      className={`text-${category.color}-600 dark:text-${category.color}-400 mr-2`}
                    />
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">{category.name}</h4>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-900 dark:text-gray-100">Alocação</span>
                    <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">{category.value}%</span>
                  </div>
                  <div className="w-full bg-gray-200/50 dark:bg-gray-700/50 rounded-full h-2 shadow-inner">
                    <div className={`bg-${category.color}-600 dark:bg-${category.color}-500 h-2 rounded-full`} style={{ width: `${category.value}%` }}></div>
                  </div>
                  <div className="mt-2">
                    {category.items.map((item, i) => (
                      <p key={i} className="text-xs text-gray-600 dark:text-gray-300">{item}</p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Profile Summary Modal */}
        {isProfileModalOpen && (
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
                  <span className="font-semibold">Última Atualização:</span> {profile.lastUpdated}
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

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        @keyframes pulseSlow {
          0%, 100% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.08);
            opacity: 0.9;
          }
        }
        @keyframes pulseButton {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.04);
          }
        }
        @keyframes float {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-20px);
          }
        }
        @keyframes floatSlow {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-30px);
          }
        }
        @keyframes glow {
          0%, 100% {
            box-shadow: 0 0 8px rgba(255, 255, 255, 0.3);
          }
          50% {
            box-shadow: 0 0 16px rgba(255, 255, 255, 0.5);
          }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.4s ease-out both;
        }
        .animate-fade-in {
          animation: fadeIn 0.3s ease-out;
        }
        .animate-pulse-slow {
          animation: pulseSlow 2.5s infinite ease-in-out;
        }
        .animate-pulse-button {
          animation: pulseButton 1.8s infinite ease-in-out;
        }
        .animate-float {
          animation: float 6s infinite ease-in-out;
        }
        .animate-float-slow {
          animation: floatSlow 8s infinite ease-in-out;
        }
        .animate-glow {
          animation: glow 2s infinite ease-in-out;
        }
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 16px;
          height: 16px;
          background: #3b82f6;
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 0 0 4px rgba(0, 0, 0, 0.2);
        }
        input[type="range"]::-moz-range-thumb {
          width: 16px;
          height: 16px;
          background: #3b82f6;
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 0 0 4px rgba(0, 0, 0, 0.2);
        }
      `}</style>
    </div>
  );
};

export default ProfileContent;