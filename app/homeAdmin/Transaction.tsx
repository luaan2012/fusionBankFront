import React, { useState, useEffect } from 'react';
import Cleave from 'cleave.js/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowUp,
  faArrowDown,
  faSearch,
  faFileInvoiceDollar,
  faShieldAlt,
  faTimes,
  faMobileAlt,
  faFingerprint,
  faCheck,
  faCheckCircle,
  faHome,
  faArrowRight
} from '@fortawesome/free-solid-svg-icons';

// Interfaces
interface Account {
  id: number;
  name: string;
  cpf?: string;
  cnpj?: string;
  bank: string;
  agency: string;
  account: string;
  type: string;
  balance: number;
}

// Sample account data
const accounts: Account[] = [
  {
    id: 1,
    name: 'Fulano de Tal',
    cpf: '123.456.789-00',
    bank: 'Banco XYZ',
    agency: '1234',
    account: '5678-9',
    type: 'Conta corrente',
    balance: 12345.67,
  },
  {
    id: 2,
    name: 'Ciclano Silva',
    cpf: '987.654.321-00',
    bank: 'Banco ABC',
    agency: '4321',
    account: '9876-5',
    type: 'Conta corrente',
    balance: 5432.10,
  },
  {
    id: 3,
    name: 'Empresa XYZ LTDA',
    cnpj: '12.345.678/0001-99',
    bank: 'Banco Comercial',
    agency: '7890',
    account: '12345-6',
    type: 'Conta empresarial',
    balance: 98765.43,
  },
  {
    id: 4,
    name: 'Beltrano Souza',
    cpf: '456.789.123-00',
    bank: 'Banco Nacional',
    agency: '5678',
    account: '3456-7',
    type: 'Conta poupança',
    balance: 2345.67,
  },
];

// Account Search Component
const AccountSearch: React.FC<{
  type: 'origin' | 'destination';
  onSelect: (account: Account) => void;
  selectedAccount: Account | null;
}> = ({ type, onSelect, selectedAccount }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<Account[]>([]);

  useEffect(() => {
    if (searchTerm.length < 3) {
      setResults([]);
      return;
    }

    const filtered = accounts.filter(
      (account) =>
        account.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (account.cpf && account.cpf.includes(searchTerm)) ||
        (account.cnpj && account.cnpj.includes(searchTerm)) ||
        `${account.agency}${account.account}`.includes(searchTerm.replace(/\D/g, '')),
    );
    setResults(filtered);
  }, [searchTerm]);

  const handleSelect = (account: Account) => {
    onSelect(account);
    setSearchTerm('');
    setResults([]);
  };

  return (
    <div className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
      <h2 className="mb-4 flex items-center text-lg font-semibold text-gray-800 dark:text-gray-100">
        <FontAwesomeIcon
          icon={type === 'origin' ? faArrowUp : faArrowDown}
          className={`mr-2 ${type === 'origin' ? 'text-red-500' : 'text-green-500'}`}
        />
        Conta de {type === 'origin' ? 'Origem' : 'Destino'}
      </h2>
      <div className="relative mb-4">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full rounded-lg border border-gray-300 bg-white p-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
          placeholder="Buscar por nome, CPF/CNPJ ou número da conta"
        />
        <FontAwesomeIcon icon={faSearch} className="absolute right-3 top-3.5 text-gray-400" />
      </div>
      {results.length > 0 && (
        <div className="max-h-60 overflow-y-auto">
          {results.map((account) => (
            <div
              key={account.id}
              className="cursor-pointer border-b border-gray-200 p-3 hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-600"
              onClick={() => handleSelect(account)}
            >
              <div className="font-medium text-gray-800 dark:text-gray-100">{account.name}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {account.bank} | Ag {account.agency} Cc {account.account}
              </div>
              {account.cpf && <div className="text-xs text-gray-400">CPF: {account.cpf}</div>}
              {account.cnpj && <div className="text-xs text-gray-400">CNPJ: {account.cnpj}</div>}
            </div>
          ))}
        </div>
      )}
      {results.length === 0 && searchTerm.length >= 3 && (
        <div className="p-3 text-gray-500 dark:text-gray-400">Nenhuma conta encontrada</div>
      )}
      {selectedAccount && (
        <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-700">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-medium text-gray-800 dark:text-gray-100">{selectedAccount.name}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">{selectedAccount.bank}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Ag {selectedAccount.agency} | Cc {selectedAccount.account}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-gray-800 dark:text-gray-100">
                {type === 'origin' ? 'Saldo disponível' : 'Tipo de conta'}
              </p>
              <p
                className={`text-${
                  type === 'origin'
                    ? 'lg font-bold text-green-600 dark:text-green-400'
                    : 'sm font-medium text-blue-500 dark:text-blue-400'
                }`}
              >
                {type === 'origin'
                  ? `R$ ${selectedAccount.balance.toFixed(2).replace('.', ',')}`
                  : selectedAccount.type}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Transfer Form Component
const TransferForm: React.FC<{
  origin: Account | null;
  destination: Account | null;
  onConfirm: (details: { amount: number; date: string; description: string; reason: string }) => void;
}> = ({ origin, destination, onConfirm }) => {
  const [amount, setAmount] = useState('');
  const [transferDate, setTransferDate] = useState('immediate');
  const [customDate, setCustomDate] = useState('');
  const [description, setDescription] = useState('');
  const [reason, setReason] = useState('');
  const [amountError, setAmountError] = useState(false);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setAmount(value);
    const numericValue = parseFloat(value.replace(/[^\d,]/g, '').replace(',', '.')) || 0;
    setAmountError(!!origin && numericValue > origin.balance);
  };

  const handleSubmit = () => {
    const numericAmount = parseFloat(amount.replace(/[^\d,]/g, '').replace(',', '.')) || 0;
    if (numericAmount <= 0) {
      alert('Por favor, insira um valor válido');
      return;
    }
    if (origin && numericAmount > origin.balance) {
      alert('Saldo insuficiente na conta de origem');
      return;
    }
    if (!reason.trim()) {
      alert('Por favor, informe o motivo da transferência manual');
      return;
    }

    let formattedDate = '';
    if (transferDate === 'immediate') {
      formattedDate = new Date().toLocaleDateString('pt-BR');
    } else if (transferDate === 'next_day') {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      formattedDate = tomorrow.toLocaleDateString('pt-BR');
    } else {
      formattedDate = new Date(customDate).toLocaleDateString('pt-BR');
    }

    onConfirm({
      amount: numericAmount,
      date: formattedDate,
      description,
      reason,
    });
  };

  return (
    <div className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
      <h2 className="mb-6 flex items-center text-lg font-semibold text-gray-800 dark:text-gray-100">
        <FontAwesomeIcon icon={faFileInvoiceDollar} className="mr-2 text-blue-500" />
        Detalhes da Transferência
      </h2>
      <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <label htmlFor="transferAmount" className="mb-1 block text-sm font-medium text-gray-800 dark:text-gray-100">
            Valor (R$)
          </label>
          <div className="relative">
            <Cleave
              id="transferAmount"
              value={amount}
              onChange={handleAmountChange}
              className="w-full rounded-lg border border-gray-300 bg-white p-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
              placeholder="0,00"
              options={{
                numeral: true,
                numeralThousandsGroupStyle: 'thousand',
                numeralDecimalMark: ',',
                numeralDecimalScale: 2,
                prefix: 'R$ ',
                noImmediatePrefix: true,
                rawValueTrimPrefix: true,
              }}
            />
            {amountError && <div className="mt-1 text-xs text-red-500">Saldo insuficiente</div>}
          </div>
        </div>
        <div>
          <label htmlFor="transferDate" className="mb-1 block text-sm font-medium text-gray-800 dark:text-gray-100">
            Data da Transferência
          </label>
          <select
            id="transferDate"
            value={transferDate}
            onChange={(e) => setTransferDate(e.target.value)}
            className="w-full rounded-lg border border-gray-300 bg-white p-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
          >
            <option value="immediate">Imediata</option>
            <option value="next_day">Próximo dia útil</option>
            <option value="custom">Agendar</option>
          </select>
          {transferDate === 'custom' && (
            <input
              type="date"
              id="customDate"
              value={customDate}
              onChange={(e) => setCustomDate(e.target.value)}
              className="mt-3 w-full rounded-lg border border-gray-300 bg-white p-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
            />
          )}
        </div>
      </div>
      <div className="mb-6">
        <label
          htmlFor="transferDescription"
          className="mb-1 block text-sm font-medium text-gray-800 dark:text-gray-100"
        >
          Descrição (opcional)
        </label>
        <textarea
          id="transferDescription"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={2}
          maxLength={100}
          className="w-full rounded-lg border border-gray-300 bg-white p-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
          placeholder="Ex: Transferência para pagamento de fornecedor"
        />
        <div className="text-right text-xs text-gray-500 dark:text-gray-400">
          {description.length}/100 caracteres
        </div>
      </div>
      <div className="mb-6">
        <label htmlFor="transferReason" className="mb-1 block text-sm font-medium text-gray-800 dark:text-gray-100">
          Motivo da transferência manual*
        </label>
        <textarea
          id="transferReason"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          rows={2}
          required
          className="w-full rounded-lg border border-gray-300 bg-white p-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
          placeholder="Justificativa para esta transferência manual"
        />
        <div className="text-xs text-gray-500 dark:text-gray-400">
          Este campo será registrado para fins de auditoria.
        </div>
      </div>
      <div className="flex justify-end">
        <button
          onClick={handleSubmit}
          className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
        >
          Continuar <FontAwesomeIcon icon={faArrowRight} className="ml-2" />
        </button>
      </div>
    </div>
  );
};

// Confirmation Modal Component
const ConfirmationModal: React.FC<{
  origin: Account | null;
  destination: Account | null;
  transferDetails: { amount: number; date: string; description: string; reason: string };
  onConfirm: () => void;
  onCancel: () => void;
}> = ({ origin, destination, transferDetails, onConfirm, onCancel }) => {
  const [password, setPassword] = useState('');
  const [tokenCode, setTokenCode] = useState('');
  const [showTokenInput, setShowTokenInput] = useState(false);

  const handleSubmit = () => {
    if (!password) {
      alert('Por favor, insira sua senha administrativa');
      return;
    }
    onConfirm();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">
            <FontAwesomeIcon icon={faShieldAlt} className="mr-2 text-blue-500" />
            Confirmar Transferência
          </h2>
          <button onClick={onCancel} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>
        <div className="mb-6">
          <h3 className="mb-2 font-medium text-gray-800 dark:text-gray-100">Detalhes da Transferência</h3>
          <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-700">
            <div className="mb-3">
              <p className="text-sm text-gray-500 dark:text-gray-400">De:</p>
              <p className="font-medium text-gray-800 dark:text-gray-100">
                {origin?.bank} | Ag {origin?.agency} | Cc {origin?.account} ({origin?.name})
              </p>
            </div>
            <div className="mb-3">
              <p className="text-sm text-gray-500 dark:text-gray-400">Para:</p>
              <p className="font-medium text-gray-800 dark:text-gray-100">
                {destination?.bank} | Ag {destination?.agency} | Cc {destination?.account} ({destination?.name})
              </p>
            </div>
            <div className="mb-3">
              <p className="text-sm text-gray-500 dark:text-gray-400">Valor:</p>
              <p className="text-xl font-bold text-gray-800 dark:text-gray-100">
                R$ {transferDetails.amount.toFixed(2).replace('.', ',')}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Data:</p>
              <p className="font-medium text-gray-800 dark:text-gray-100">{transferDetails.date}</p>
            </div>
          </div>
        </div>
        <div className="mb-6">
          <h3 className="mb-2 font-medium text-gray-800 dark:text-gray-100">Autenticação</h3>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="adminPassword"
                className="mb-1 block text-sm font-medium text-gray-800 dark:text-gray-100"
              >
                Senha Administrativa*
              </label>
              <input
                type="password"
                id="adminPassword"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white p-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
                placeholder="Digite sua senha"
                required
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-800 dark:text-gray-100">
                Autenticação de Dois Fatores
              </label>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowTokenInput(true)}
                  className="flex-1 rounded-lg border border-gray-300 bg-white p-3 text-gray-800 transition-colors hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600"
                >
                  <FontAwesomeIcon icon={faMobileAlt} className="mr-2" />
                  Token SMS
                </button>
                <button className="flex-1 rounded-lg border border-gray-300 bg-white p-3 text-gray-800 transition-colors hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600">
                  <FontAwesomeIcon icon={faFingerprint} className="mr-2" />
                  Biometria
                </button>
              </div>
            </div>
            {showTokenInput && (
              <div>
                <label htmlFor="tokenCode" className="mb-1 block text-sm font-medium text-gray-800 dark:text-gray-100">
                  Código de Token*
                </label>
                <input
                  type="text"
                  id="tokenCode"
                  value={tokenCode}
                  onChange={(e) => setTokenCode(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 bg-white p-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
                  placeholder="Digite o código de 6 dígitos"
                  maxLength={6}
                />
              </div>
            )}
          </div>
        </div>
        <div className="flex justify-between">
          <button
            onClick={onCancel}
            className="rounded-lg border border-gray-300 px-4 py-2 text-gray-800 transition-colors hover:bg-gray-100 dark:border-gray-600 dark:text-gray-100 dark:hover:bg-gray-600"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            className="rounded-lg bg-blue-600 px-6 py-2 font-medium text-white transition-colors hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
          >
            <FontAwesomeIcon icon={faCheckCircle} className="mr-2" />
            Confirmar Transferência
          </button>
        </div>
      </div>
    </div>
  );
};

// Success Modal Component
const SuccessModal: React.FC<{
  destination: Account | null;
  transferDetails: { amount: number; date: string };
  onClose: () => void;
}> = ({ destination, transferDetails, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-md rounded-lg bg-white p-8 text-center shadow-lg dark:bg-gray-800">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900 mx-auto">
          <FontAwesomeIcon icon={faCheck} className="text-3xl text-green-500 dark:text-green-400" />
        </div>
        <h2 className="mb-2 text-xl font-bold text-gray-800 dark:text-gray-100">
          Transferência realizada com sucesso!
        </h2>
        <p className="mb-6 text-gray-500 dark:text-gray-400">
          A transação foi concluída e registrada no sistema.
        </p>
        <div className="mb-6 rounded-lg bg-gray-50 p-4 dark:bg-gray-700">
          <p className="font-medium text-gray-800 dark:text-gray-100">
            R$ {transferDetails.amount.toFixed(2).replace('.', ',')}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Para: {destination?.name} | {destination?.bank}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">Data: {transferDetails.date}</p>
        </div>
        <button
          onClick={onClose}
          className="w-full rounded-lg bg-blue-600 px-6 py-2 font-medium text-white transition-colors hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
        >
          <FontAwesomeIcon icon={faHome} className="mr-2" />
          Voltar ao Dashboard
        </button>
      </div>
    </div>
  );
};

// Main App Component
const TransationMain: React.FC = () => {
  const [origin, setOrigin] = useState<Account | null>(null);
  const [destination, setDestination] = useState<Account | null>(null);
  const [transferDetails, setTransferDetails] = useState<{
    amount: number;
    date: string;
    description: string;
    reason: string;
  } | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleOriginSelect = (account: Account) => {
    setOrigin(account);
  };

  const handleDestinationSelect = (account: Account) => {
    if (origin && account.id === origin.id) {
      alert('Não é possível selecionar a mesma conta como origem e destino');
      return;
    }
    setDestination(account);
  };

  const handleConfirm = (details: { amount: number; date: string; description: string; reason: string }) => {
    if (details.amount > 100000) {
      alert('ATENÇÃO: Transferências acima de R$ 100.000,00 requerem aprovação de dois administradores.');
    }
    setTransferDetails(details);
    setShowConfirmation(true);
  };

  const handleConfirmationConfirm = () => {
    setShowConfirmation(false);
    setShowSuccess(true);
  };

  const handleClose = () => {
    setShowSuccess(false);
    setOrigin(null);
    setDestination(null);
    setTransferDetails(null);
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans antialiased transition-colors duration-300 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex items-center justify-between relative">
          <div className="flex flex-1 items-center">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white font-bold">
              1
            </div>
            <div className="ml-2 text-sm font-medium text-blue-600 dark:text-blue-400">Selecionar Contas</div>
          </div>
          <div className="mx-2 h-1 flex-1 bg-blue-600 dark:bg-blue-400"></div>
          <div className="flex flex-1 items-center">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-300 text-gray-500 dark:bg-gray-700 dark:text-gray-400 font-bold">
              2
            </div>
            <div className="ml-2 text-sm font-medium text-gray-500 dark:text-gray-400">Detalhes</div>
          </div>
          <div className="mx-2 h-1 flex-1 bg-gray-300 dark:bg-gray-700"></div>
          <div className="flex flex-1 items-center">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-300 text-gray-500 dark:bg-gray-700 dark:text-gray-400 font-bold">
              3
            </div>
            <div className="ml-2 text-sm font-medium text-gray-500 dark:text-gray-400">Confirmar</div>
          </div>
        </div>
        <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <AccountSearch type="origin" onSelect={handleOriginSelect} selectedAccount={origin} />
          <AccountSearch type="destination" onSelect={handleDestinationSelect} selectedAccount={destination} />
        </div>
        {origin && destination && (
          <TransferForm origin={origin} destination={destination} onConfirm={handleConfirm} />
        )}
        {showConfirmation && transferDetails && (
          <ConfirmationModal
            origin={origin}
            destination={destination}
            transferDetails={transferDetails}
            onConfirm={handleConfirmationConfirm}
            onCancel={() => setShowConfirmation(false)}
          />
        )}
        {showSuccess && transferDetails && (
          <SuccessModal
            destination={destination}
            transferDetails={transferDetails}
            onClose={handleClose}
          />
        )}
      </div>
    </div>
  );
};

export default TransationMain;