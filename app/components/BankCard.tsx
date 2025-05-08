import type { IconDefinition } from "@fortawesome/fontawesome-svg-core"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faCheck
} from '@fortawesome/free-solid-svg-icons';
import type { BankRegister } from "~/models/maps"

interface BankCardProps {
  bank: BankRegister;
  isSelected: boolean;
  onSelect: () => void;
}

const BankCard = ({ bank, isSelected, onSelect } : BankCardProps) => {
  return (
    <div
      className={`bank-card p-4 border border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer ${
        isSelected ? 'selected border-primary-light dark:border-primary-dark' : ''
      }`}
      onClick={onSelect}
    >
      <div className="flex items-center mb-3">
        <div className={`w-10 h-10 ${bank.iconBg} rounded-full flex items-center justify-center mr-3`}>
          <FontAwesomeIcon icon={bank.icon} className={bank.iconColor} />
        </div>
        <h3 className="font-medium text-gray-800 dark:text-white">{bank.name}</h3>
      </div>
      <div className="text-sm text-gray-600 dark:text-gray-400 mb-3">
        {bank.features.map((feature, index) => (
          <p key={index} className="mb-1">
            <FontAwesomeIcon icon={faCheck} className="fas fa-check-circle text-green-500 mr-1"></FontAwesomeIcon> {feature.title}
          </p>
        ))}
      </div>
      <div className="text-xs text-gray-500 dark:text-gray-400">
        <p>Taxa de manutenção: {bank.fee}</p>
      </div>
    </div>
  );
};

export default BankCard;