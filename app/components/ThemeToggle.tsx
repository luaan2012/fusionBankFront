import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMoon } from '@fortawesome/free-solid-svg-icons'
import { faSun } from '@fortawesome/free-solid-svg-icons'

const ThemeToggle = () => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const darkModeSetting = localStorage.getItem('darkMode') === 'true';
    setIsDark(darkModeSetting);
  }, []);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', isDark.toString());
  }, [isDark]);

  return (
    <button
      onClick={() => setIsDark(!isDark)}
      className="absolute top-4 right-4 p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
    >
      { !isDark ? <FontAwesomeIcon icon={faMoon} className="mr-2 text-primary" /> : ""}
      { isDark ? <FontAwesomeIcon icon={faSun} className="mr-2 text-primary" /> : ""}
    </button>
  );
};

export default ThemeToggle;