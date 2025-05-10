import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMoon, faSun } from '@fortawesome/free-solid-svg-icons';

const ThemeToggle = () => {
  // Define o tema escuro como padrão, mas só verifica localStorage no cliente
  const [isDark, setIsDark] = useState(true); // Padrão: tema escuro

  useEffect(() => {
    // Executa apenas no lado do cliente
    if (typeof window !== 'undefined') {
      // Verifica se há uma preferência salva no localStorage
      const savedMode = localStorage.getItem('darkMode');
      // Aplica o valor salvo ou mantém o padrão (true)
      setIsDark(savedMode !== null ? savedMode === 'true' : true);
    }
  }, []); // Executa apenas uma vez, ao montar o componente

  useEffect(() => {
    // Aplica ou remove a classe 'dark' com base no estado isDark
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    // Salva a preferência no localStorage apenas no cliente
    if (typeof window !== 'undefined') {
      localStorage.setItem('darkMode', isDark.toString());
    }
  }, [isDark]);

  return (
    <button
      onClick={() => setIsDark(!isDark)}
      className="absolute top-4 right-4 p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
    >
      {isDark ? (
        <FontAwesomeIcon icon={faSun} className="text-primary" />
      ) : (
        <FontAwesomeIcon icon={faMoon} className="text-primary" />
      )}
    </button>
  );
};

export default ThemeToggle;