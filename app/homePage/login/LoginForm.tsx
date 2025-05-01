import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWallet, faIdCard, faEnvelope, faSignInAlt, faFingerprint, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { faGoogle, faApple } from '@fortawesome/free-brands-svg-icons';

interface LoginFormProps {
  switchToRegister: () => void;
}

const LoginForm = ({ switchToRegister }: LoginFormProps) => {
  const [loginType, setLoginType] = useState('account');
  const [showPassword, setShowPassword] = useState(false);

  const handleBiometric = () => {
    alert('Biometria solicitada. Em um ambiente real, isso acionaria a API de biometria do dispositivo.');
  };

  return (
    <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Acesse sua conta</h2>
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => setLoginType('account')}
            className={`flex-1 mr-2 py-2 px-4 rounded-md font-medium ${
              loginType === 'account'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white'
            }`}
          >
            <FontAwesomeIcon icon={faWallet} className="mr-2" /> Conta
          </button>
          <button
            onClick={() => setLoginType('document')}
            className={`flex-1 mx-2 py-2 px-4 rounded-md font-medium ${
              loginType === 'document'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white'
            }`}
          >
            <FontAwesomeIcon icon={faIdCard} className="mr-2" /> CPF/CNPJ
          </button>
          <button
            onClick={() => setLoginType('email')}
            className={`flex-1 ml-2 py-2 px-4 rounded-md font-medium ${
              loginType === 'email'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white'
            }`}
          >
            <FontAwesomeIcon icon={faEnvelope} className="mr-2" /> E-mail
          </button>
        </div>
        {loginType === 'account' && (
          <div className="space-y-4">
            <div>
              <label htmlFor="accountNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Número da Conta
              </label>
              <input
                type="text"
                id="accountNumber"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md input-field focus:outline-none focus:border-blue-500 dark:focus:border-blue-500 bg-white dark:bg-gray-700 dark:text-white"
                placeholder="Digite o número da conta"
              />
            </div>
            <div>
              <label htmlFor="agencyNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Agência
              </label>
              <input
                type="text"
                id="agencyNumber"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md input-field focus:outline-none focus:border-blue-500 dark:focus:border-blue-500 bg-white dark:bg-gray-700 dark:text-white"
                placeholder="Digite o número da agência"
              />
            </div>
          </div>
        )}
        {loginType === 'document' && (
          <div className="space-y-4">
            <div>
              <label htmlFor="documentNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                CPF/CNPJ
              </label>
              <input
                type="text"
                id="documentNumber"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md input-field focus:outline-none focus:border-blue-500 dark:focus:border-blue-500 bg-white dark:bg-gray-700 dark:text-white"
                placeholder="Digite seu CPF ou CNPJ"
              />
            </div>
          </div>
        )}
        {loginType === 'email' && (
          <div className="space-y-4">
            <div>
              <label htmlFor="loginEmail" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                E-mail
              </label>
              <input
                type="email"
                id="loginEmail"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md input-field focus:outline-none focus:border-blue-500 dark:focus:border-blue-500 bg-white dark:bg-gray-700 dark:text-white"
                placeholder="Digite seu e-mail"
              />
            </div>
          </div>
        )}
        <div className="mt-4">
          <label htmlFor="loginPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Senha
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              id="loginPassword"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md input-field focus:outline-none focus:border-blue-500 dark:focus:border-blue-500 bg-white dark:bg-gray-700 dark:text-white"
              placeholder="Digite sua senha"
            />
            <button
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400"
            >
              <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
            </button>
          </div>
        </div>
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center">
            <input
              id="rememberMe"
              type="checkbox"
              className="h-4 w-4 text-blue-500 dark:text-blue-500 focus:ring-blue-500 dark:focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded"
            />
            <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
              Lembrar-me
            </label>
          </div>
          <a href="#" className="text-sm text-blue-500 dark:text-blue-500 hover:underline">
            Esqueceu a senha?
          </a>
        </div>
      </div>
      <button className="w-full py-3 px-4 bg-blue-600 dark:bg-blue-600 text-white rounded-md font-medium hover:bg-blue-600 dark:hover:bg-blue-600 transition duration-300">
        <FontAwesomeIcon icon={faSignInAlt} className="mr-2" /> Entrar
      </button>
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Não tem uma conta?{' '}
          <button
            onClick={switchToRegister}
            className="text-blue-500 dark:text-blue-500 font-medium hover:underline"
          >
            Cadastre-se
          </button>
        </p>
      </div>
      <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
        <button className="w-full py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition duration-300">
          <FontAwesomeIcon icon={faGoogle} className="mr-2" /> Entrar com Google
        </button>
        <button className="w-full py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition duration-300 mt-3">
          <FontAwesomeIcon icon={faApple} className="mr-2" /> Entrar com Apple
        </button>
      </div>
      <div className="mt-6 text-center">
        <button
          onClick={handleBiometric}
          className="text-sm text-blue-500 dark:text-blue-500 font-medium hover:underline"
        >
          <FontAwesomeIcon icon={faFingerprint} className="mr-1" /> Usar biometria
        </button>
      </div>
    </div>
  );
};

export default LoginForm;