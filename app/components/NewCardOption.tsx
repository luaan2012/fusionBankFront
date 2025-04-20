import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

interface NewCardOptionProps {
  onRequestNewCard: () => void;
}

const NewCardOption: React.FC<NewCardOptionProps> = ({ onRequestNewCard }) => {
  return (
    <div className="bg-white dark:bg-dark-700 rounded-xl shadow-lg overflow-hidden transition-transform duration-300 hover:shadow-xl flex items-center justify-center">
      <div className="p-8 text-center">
        <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
          <FontAwesomeIcon icon={faPlus} className="text-blue-500 dark:text-blue-300 text-2xl" />
        </div>
        <h3 className="text-lg font-semibold mb-2 dark:text-white">Solicitar novo cartão</h3>
        <p className="text-sm text-gray-500 dark:text-gray-300 mb-4">
          Escolha entre crédito, débito ou virtual
        </p>
        <button
          onClick={onRequestNewCard}
          className="px-6 py-2 bg-blue-500 text-white rounded-lg text-sm"
        >
          Solicitar agora
        </button>
      </div>
    </div>
  );
};

export default NewCardOption;