import { isRouteErrorResponse, useNavigate } from 'react-router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { useAccountStore } from '~/context/accountStore'
import { useEffect } from 'react'
import { useToast } from './ToastContext'

export function PageError({ error }: { error: any }) {
  const navigate = useNavigate();
  const { user, checkToken, tokenExpiry} = useAccountStore()
  const { openToast } = useToast()

  useEffect(() => {
    // Aplica ou remove a classe 'dark' com base no estado isDark
    if (user?.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    // Salva a preferência no localStorage apenas no cliente
    if (typeof window !== 'undefined') {
      localStorage.setItem('darkMode', user?.darkMode.toString());
    }

    const validateToken = async () => {
      const isValid = await checkToken();
      if (!isValid) {
        openToast({
          message: 'Sessão expirada, entre novamente.',
          type: 'error',
          position: 'top-right',
          duration: 5000,
        });
        navigate('/');
      }
    };

    validateToken();
  }, [user?.darkMode, tokenExpiry]);

  let message = "Oops! Algo deu errado";
  let details = "Ocorreu um erro inesperado. Tente novamente ou volte para a página inicial.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404 - Página Não Encontrada" : `Erro ${error.status}`;
    details =
      error.status === 404
        ? "A página que você está procurando não foi encontrada."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-900 smooth-transition min-h-screen flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 backdrop-blur-2xl rounded-3xl p-8 w-full max-w-lg shadow-2xl transform transition-all duration-500 animate-fade-in">
        <div className="flex items-center justify-center mb-6">
          <FontAwesomeIcon
            icon={faExclamationTriangle}
            className="text-red-500 dark:text-red-400 text-4xl mr-3 animate-pulse-slow"
          />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white text-center">
            {message}
          </h1>
        </div>
        <p className="text-gray-600 dark:text-gray-300 text-center mb-8 text-lg">
          {details}
        </p>
        {stack && import.meta.env.DEV && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              Detalhes do Erro (Apenas em Desenvolvimento)
            </h2>
            <pre className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg overflow-x-auto text-sm text-gray-800 dark:text-gray-200 max-h-64">
              <code>{stack}</code>
            </pre>
          </div>
        )}
        <div className="flex justify-center">
          <button
            onClick={() => navigate('/')}
            className="relative py-3 px-8 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-full hover:from-blue-700 hover:to-cyan-600 transition-all duration-300 text-base font-semibold shadow-md hover:shadow-xl animate-pulse-button overflow-hidden"
          >
            <span className="relative z-10">Voltar para a Página Inicial</span>
            <span className="absolute inset-0 bg-white/20 opacity-0 hover:opacity-100 transition-opacity duration-300 animate-ripple"></span>
          </button>
        </div>
      </div>
    </div>
  );
}