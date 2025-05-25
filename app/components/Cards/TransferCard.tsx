import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { type IconProp } from '@fortawesome/fontawesome-svg-core';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';

interface TransferCardProps {
  type: 'pix' | 'ted' | 'doc';
  icon: IconProp;
  color: string;
  bg: string;
  title: string;
  description: string;
  features: string[];
  isActive: boolean;
  onSelect: () => void;
}

export const TransferCard = ({
  type,
  icon,
  color,
  bg,
  title,
  description,
  features,
  isActive,
  onSelect,
}: TransferCardProps) => {
  const borderColor = type === 'pix' ? 'blue' : type === 'ted' ? 'indigo' : 'purple';

  return (
    <div
      onClick={onSelect}
      className={`transfer-card bg-white dark:bg-slate-950 rounded-xl p-5 cursor-pointer shadow-md hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 border ${
        isActive
          ? `border-${borderColor}-500 dark:border-${borderColor}-400`
          : 'border-gray-200 dark:border-gray-700'
      } hover:border-${borderColor}-500 dark:hover:border-${borderColor}-400 focus:outline-none focus:ring-2 focus:ring-${borderColor}-500 focus:ring-opacity-50`}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onSelect()}
      aria-label={`Selecionar transferência ${title}`}
    >
      <div className="flex items-center mb-4">
        <div
          className={`h-12 w-12 rounded-full ${bg} dark:bg-opacity-30 flex items-center justify-center mr-4 transition-transform duration-200 hover:scale-110`}
        >
          <FontAwesomeIcon icon={icon} className={`${color} dark:${color.replace('500', '300')} text-xl`} />
        </div>
        <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">{title}</h3>
      </div>
      <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 leading-relaxed">{description}</p>
      <ul className="text-xs text-gray-500 dark:text-gray-400 space-y-2">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center">
            <FontAwesomeIcon
              icon={faCheckCircle}
              className="text-green-500 dark:text-green-400 mr-2 text-sm"
            />
            <span className="font-medium">{feature}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TransferCard;