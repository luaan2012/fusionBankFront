interface TabNavigationProps {
  activeTab: string;
  setActiveTab: (login:string) => void;
  resetRegistration: () => void;
}

export const TabNavigation = ({ activeTab, setActiveTab, resetRegistration } : TabNavigationProps) => {
  return (
    <div className="w-full max-w-md mb-8">
      <div className="flex border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={() => setActiveTab('login')}
          className={`flex-1 py-4 px-1 text-center border-b-2 font-medium text-sm ${
            activeTab === 'login'
              ? 'border-primary-light dark:border-primary-dark text-blue-700 dark:text-primary-dark'
              : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
          }`}
        >
          Login
        </button>
        <button
          onClick={() => {
            setActiveTab('register');
            resetRegistration();
          }}
          className={`flex-1 py-4 px-1 text-center border-b-2 font-medium text-sm ${
            activeTab === 'register'
              ? 'border-primary-light dark:border-primary-dark text-blue-700 dark:text-primary-dark'
              : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
          }`}
        >
          Criar Conta
        </button>
      </div>
    </div>
  );
};