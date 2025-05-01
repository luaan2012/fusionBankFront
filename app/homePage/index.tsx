import ThemeToggle from '~/components/ThemeToggle'
import TabNavigation from '~/components/TabNavigation'
import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUniversity } from '@fortawesome/free-solid-svg-icons'
import LoginForm from './login/LoginForm'
import RegistrationForm from './register/RegistrationForm'

export function Index() {
    const [activeTab, setActiveTab] = useState<string>('login');

  const resetRegistration = () => {
    // This will be passed to RegistrationForm to reset its state
    setActiveTab('register');
  };
  
  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      <ThemeToggle />
      <div className="container mx-auto px-4 py-12 flex flex-col items-center justify-center">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-blue-700 dark:text-primary-dark">
            <FontAwesomeIcon icon={faUniversity} className="mr-2 text-primary-light dark:text-primary-dark" /> Banco Digital
          </h1>
        </div>
        <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} resetRegistration={resetRegistration} />
        {activeTab === 'login' ? (
          <LoginForm switchToRegister={() => setActiveTab('register')} />
        ) : (
          <RegistrationForm />
        )}
      </div>
    </div>
  );
}


