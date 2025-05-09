import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

interface NewCardOptionProps {
  onRequestNewCard: () => void;
}

const NewCardOption: React.FC<NewCardOptionProps> = ({ onRequestNewCard }) => {
  return (
    <div className="bg-white dark:bg-slate-950 rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="p-8 text-center">
        <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
          <FontAwesomeIcon icon={faPlus} className="text-blue-600 dark:text-blue-400 text-3xl" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
          Solicitar novo cartão
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 leading-relaxed">
          Escolha entre crédito, débito ou virtual
        </p>
        <button
          onClick={onRequestNewCard}
          className="px-6 py-2.5 bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 text-white rounded-lg text-sm font-semibold transition-all duration-200 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          aria-label="Solicitar novo cartão"
        >
          Solicitar agora
        </button>
      </div>
    </div>
  );
};

export default NewCardOption;