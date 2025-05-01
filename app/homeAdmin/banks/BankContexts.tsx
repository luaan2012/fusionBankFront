import React, { useState, useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUniversity,
  faSearch,
  faChevronLeft,
  faChevronRight,
  faArrowLeft,
  faCheck,
  faEdit,
  faTimes,
  faShieldAlt,
  faCheckCircle,
  faMinus,
  faPlus,
  faMobileAlt,
  faFingerprint,
  faSave,
  faCoins,
  faCog,
  faEye
} from '@fortawesome/free-solid-svg-icons';

// Types
interface Bank {
  id: number;
  name: string;
  ispb: string;
  logo: string;
  activeAccounts: number;
  totalBalance: number;
}

interface Account {
  id: number;
  bankId: number;
  name: string;
  document: string;
  email: string;
  phone: string;
  address: string;
  agency: string;
  account: string;
  balance: number;
  limit: number;
  status: 'active' | 'blocked';
  lastUpdate: string;
}

interface History {
  id: number;
  accountId: number;
  admin: string;
  date: string;
  changes: string;
  reason: string;
}

// Sample Data
const banks: Bank[] = [
  { id: 1, name: "Banco XYZ", ispb: "12345678", logo: "https://via.placeholder.com/30", activeAccounts: 1240, totalBalance: 12345678.90 },
  { id: 2, name: "Banco ABC", ispb: "87654321", logo: "https://via.placeholder.com/30/ff9900", activeAccounts: 856, totalBalance: 8765432.10 },
  { id: 3, name: "Banco Comercial", ispb: "45678912", logo: "https://via.placeholder.com/30/0099ff", activeAccounts: 532, totalBalance: 3456789.00 },
  { id: 4, name: "Banco Nacional", ispb: "78912345", logo: "https://via.placeholder.com/30/9900ff", activeAccounts: 124, totalBalance: 987654.32 },
];

const accounts: Account[] = [
  { id: 1, bankId: 1, name: "Fulano de Tal", document: "123.456.789-00", email: "fulano@email.com", phone: "(11) 98765-4321", address: "Rua das Flores, 123 - São Paulo/SP", agency: "1234", account: "5678-9", balance: 12345.67, limit: 5000.00, status: "active", lastUpdate: "2023-05-15T10:30:00Z" },
  { id: 2, bankId: 1, name: "Empresa XYZ LTDA", document: "12.345.678/0001-99", email: "contato@xyz.com.br", phone: "(11) 2345-6789", address: "Av. Paulista, 1000 - São Paulo/SP", agency: "1234", account: "9876-5", balance: -1234.56, limit: 10000.00, status: "active", lastUpdate: "2023-05-10T14:15:00Z" },
  { id: 3, bankId: 2, name: "Ciclano Silva", document: "987.654.321-00", email: "ciclano@email.com", phone: "(21) 98765-1234", address: "Rua do Comércio, 45 - Rio de Janeiro/RJ", agency: "4321", account: "1234-5", balance: 5432.10, limit: 3000.00, status: "active", lastUpdate: "2023-05-12T09:45:00Z" },
  { id: 4, bankId: 2, name: "Beltrano Souza", document: "456.789.123-00", email: "beltrano@email.com", phone: "(31) 98765-6789", address: "Av. Afonso Pena, 1000 - Belo Horizonte/MG", agency: "5678", account: "3456-7", balance: 2345.67, limit: 2000.00, status: "blocked", lastUpdate: "2023-04-28T16:20:00Z" },
];

const history: History[] = [
  { id: 1, accountId: 1, admin: "Admin 1", date: "2023-05-15T10:30:00Z", changes: "Saldo: R$ 10.000,00 → R$ 12.345,67", reason: "Ajuste" },
  { id: 2, accountId: 1, admin: "Admin 2", date: "2023-04-20T14:15:00Z", changes: "Limite: R$ 3.000,00 → R$ 5.000,00", reason: "Bonificação" },
  { id: 3, accountId: 2, admin: "Admin 1", date: "2023-05-10T14:15:00Z", changes: "Saldo: R$ 1.000,00 → R$ -1.234,56", reason: "Correção" },
];

// Utility Components
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ variant = 'primary', children, className = '', ...props }) => {
  const baseStyles = 'px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 disabled:opacity-50';
  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600',
    secondary: 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 border border-gray-300 dark:border-gray-600',
    danger: 'bg-red-600 text-white hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600',
  };

  return (
    <button className={`${baseStyles} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

const Input: React.FC<InputProps> = ({ className = '', ...props }) => (
  <input
    className={`w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors ${className}`}
    {...props}
  />
);

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  className?: string;
}

const Select: React.FC<SelectProps> = ({ className = '', ...props }) => (
  <select
    className={`w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors ${className}`}
    {...props}
  />
);

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  className?: string;
}

const Textarea: React.FC<TextareaProps> = ({ className = '', ...props }) => (
  <textarea
    className={`w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors ${className}`}
    {...props}
  />
);

// Main Component
const BankContexts: React.FC = () => {
  const [search, setSearch] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('name');
  const [selectedBank, setSelectedBank] = useState<Bank | null>(null);
  const [editAccount, setEditAccount] = useState<Account | null>(null);
  const [activeTab, setActiveTab] = useState<'data' | 'balance' | 'history'>('data');
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  const [showToast, setShowToast] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>('');

  // Filter and sort banks
  const filteredBanks = useMemo(() => {
    let result = banks.filter(bank =>
      bank.name.toLowerCase().includes(search.toLowerCase()) ||
      bank.ispb.includes(search)
    );
    if (sortBy === 'name') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'accounts') {
      result.sort((a, b) => b.activeAccounts - a.activeAccounts);
    } else if (sortBy === 'ispb') {
      result.sort((a, b) => a.ispb.localeCompare(b.ispb));
    }
    return result;
  }, [search, sortBy]);

  // Load accounts for selected bank
  const bankAccounts = useMemo(() =>
    selectedBank ? accounts.filter(a => a.bankId === selectedBank.id) : [],
    [selectedBank]
  );

  // Load history for selected account
  const accountHistory = useMemo(() =>
    editAccount ? history.filter(h => h.accountId === editAccount.id) : [],
    [editAccount]
  );

  // View accounts for a bank
  const viewBankAccounts = (bankId: number) => {
    const bank = banks.find(b => b.id === bankId);
    if (bank) {
      setSelectedBank(bank);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Edit account
  const handleEditAccount = (accountId: number) => {
    const account = accounts.find(a => a.id === accountId);
    if (account) setEditAccount(account);
  };

  // Save data or balance
  const handleSave = (type: 'data' | 'balance') => {
    if (type === 'balance' && !(document.getElementById('changeReason') as HTMLSelectElement)?.value) {
      alert('Por favor, selecione um motivo para a alteração');
      return;
    }
    setShowAuthModal(true);
  };

  // Confirm authentication
  const confirmAuth = () => {
    const password = (document.getElementById('adminPassword') as HTMLInputElement)?.value;
    if (!password) {
      alert('Por favor, insira sua senha administrativa');
      return;
    }
    setShowAuthModal(false);
    setEditAccount(null);
    setToastMessage('Alterações salvas com sucesso!');
    setShowToast(true);
    setTimeout(() => setShowToast(false), 5000);
  };

  return (
    <div className="min-h-screen font-sans antialiased bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 transition-colors duration-300">
      <div className="container mx-auto px-4 py-8">
        {/* Banks Table */}
        {!selectedBank && (
          <div className="rounded-lg p-6 shadow-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
              <div className="relative w-full md:w-96">
                <Input
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Pesquisar banco por nome ou ISPB"
                />
                <FontAwesomeIcon icon={faSearch} className="absolute right-3 top-3.5 text-gray-400 dark:text-gray-500" />
              </div>
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Ordenar por:</label>
                <Select
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value)}
                >
                  <option value="name">Nome (A-Z)</option>
                  <option value="accounts">Contas ativas</option>
                  <option value="ispb">Código ISPB</option>
                </Select>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Banco</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Código ISPB</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Contas Ativas</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Ações</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredBanks.map(bank => (
                    <tr
                      key={bank.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                      onClick={() => viewBankAccounts(bank.id)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <img className="w-10 h-10 rounded-full bg-gray-100 p-1" src={bank.logo} alt={bank.name} />
                          <div className="ml-4 text-sm font-medium text-gray-800 dark:text-gray-200">{bank.name}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">{bank.ispb}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">{bank.activeAccounts.toLocaleString('pt-BR')}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex justify-end gap-2">
                          <Button variant="secondary">
                            <FontAwesomeIcon icon={faCog} />
                          </Button>
                          <Button
                            variant="primary"
                            onClick={e => { e.stopPropagation(); viewBankAccounts(bank.id); }}
                          >
                            <FontAwesomeIcon icon={faEye} /> Visualizar Contas
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Exibindo 1 a {Math.min(10, filteredBanks.length)} de {filteredBanks.length} bancos
              </div>
              <div className="flex gap-1">
                <Button variant="secondary" disabled>
                  <FontAwesomeIcon icon={faChevronLeft} />
                </Button>
                <Button variant="primary">1</Button>
                <Button variant="secondary">2</Button>
                <Button variant="secondary">
                  <FontAwesomeIcon icon={faChevronRight} />
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Accounts Section */}
        {selectedBank && (
          <div className="rounded-lg p-6 shadow-sm mt-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-semibold flex items-center">
                  <img className="w-8 h-8 rounded-full bg-gray-100 p-1 mr-3" src={selectedBank.logo} alt={selectedBank.name} />
                  {selectedBank.name}
                  <span className="ml-3 text-sm font-normal text-gray-500 dark:text-gray-400">ISPB: {selectedBank.ispb}</span>
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {selectedBank.activeAccounts.toLocaleString('pt-BR')} contas ativas | 
                  R$ {selectedBank.totalBalance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              </div>
              <Button
                variant="secondary"
                onClick={() => setSelectedBank(null)}
              >
                <FontAwesomeIcon icon={faArrowLeft} /> Voltar
              </Button>
            </div>
            <div className="flex flex-wrap items-center gap-3 mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Ações em lote:</span>
              <Select>
                <option disabled selected>Selecione uma ação</option>
                <option>Aumentar limite em 10%</option>
                <option>Bloquear contas inativas</option>
                <option>Atualizar dados cadastrais</option>
              </Select>
              <Button variant="primary">
                Aplicar <FontAwesomeIcon icon={faCheck} />
              </Button>
            </div>
            <div className="overflow-x-auto mb-4">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Titular</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">CPF/CNPJ</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Agência/Conta</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Saldo</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Limite</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Ações</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {bankAccounts.map(account => (
                    <tr key={account.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-gray-200">{account.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">{account.document}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">{account.agency}/{account.account}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600 dark:text-red-400">{account.balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-orange-600 dark:text-orange-400">{account.limit.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${account.status === 'active' ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'}`}>
                          {account.status === 'active' ? 'Ativo' : 'Bloqueado'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Button
                          variant="primary"
                          onClick={() => handleEditAccount(account.id)}
                        >
                          <FontAwesomeIcon icon={faEdit} /> Editar
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Exibindo 1 a {Math.min(10, bankAccounts.length)} de {bankAccounts.length} contas
              </div>
              <div className="flex gap-1">
                <Button variant="secondary" disabled>
                  <FontAwesomeIcon icon={faChevronLeft} />
                </Button>
                <Button variant="primary">1</Button>
                <Button variant="secondary">2</Button>
                <Button variant="secondary">
                  <FontAwesomeIcon icon={faChevronRight} />
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Account Modal */}
        {editAccount && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold flex items-center text-gray-800 dark:text-gray-200">
                  <FontAwesomeIcon icon={faEdit} className="mr-2 text-blue-500" /> Editar Conta
                </h2>
                <Button variant="secondary" onClick={() => setEditAccount(null)}>
                  <FontAwesomeIcon icon={faTimes} />
                </Button>
              </div>
              <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
                <ul className="flex flex-wrap -mb-px">
                  {(['data', 'balance', 'history'] as const).map(tab => (
                    <li key={tab} className="mr-2">
                      <button
                        className={`inline-block p-4 text-sm font-medium ${activeTab === tab ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-200'}`}
                        onClick={() => setActiveTab(tab)}
                      >
                        {tab === 'data' ? 'Dados Cadastrais' : tab === 'balance' ? 'Saldo e Crédito' : 'Histórico'}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
              {activeTab === 'data' && (
                <div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Nome Completo*</label>
                      <Input type="text" defaultValue={editAccount.name} required />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">CPF/CNPJ*</label>
                      <Input type="text" defaultValue={editAccount.document} readOnly className="bg-gray-100 dark:bg-gray-700" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">E-mail*</label>
                      <Input type="email" defaultValue={editAccount.email} required />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Telefone*</label>
                      <Input type="tel" defaultValue={editAccount.phone} required />
                    </div>
                  </div>
                  <div className="mb-6">
                    <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Endereço*</label>
                    <Textarea defaultValue={editAccount.address} rows={3} required />
                  </div>
                  <div className="flex justify-end">
                    <Button variant="primary" onClick={() => handleSave('data')}>
                      <FontAwesomeIcon icon={faSave} /> Salvar Dados
                    </Button>
                  </div>
                </div>
              )}
              {activeTab === 'balance' && (
                <div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Saldo Disponível (R$)*</label>
                      <div className="flex items-center">
                        <Button variant="secondary" className="rounded-r-none">
                          <FontAwesomeIcon icon={faMinus} />
                        </Button>
                        <Input
                          type="number"
                          defaultValue={editAccount.balance.toFixed(2)}
                          className="text-center border-x-0 rounded-none"
                          step="0.01"
                          min="0"
                        />
                        <Button variant="secondary" className="rounded-l-none">
                          <FontAwesomeIcon icon={faPlus} />
                        </Button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Limite do Cartão (R$)*</label>
                      <div className="flex items-center">
                        <Button variant="secondary" className="rounded-r-none">
                          <FontAwesomeIcon icon={faMinus} />
                        </Button>
                        <Input
                          type="number"
                          defaultValue={editAccount.limit.toFixed(2)}
                          className="text-center border-x-0 rounded-none"
                          step="0.01"
                          min="0"
                        />
                        <Button variant="secondary" className="rounded-l-none">
                          <FontAwesomeIcon icon={faPlus} />
                        </Button>
                      </div>
                    </div>
                  </div>
                  <div className="mb-6">
                    <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Motivo da Alteração*</label>
                    <Select id="changeReason">
                      <option value="" disabled selected>Selecione um motivo</option>
                      <option value="adjustment">Ajuste</option>
                      <option value="bonus">Bonificação</option>
                      <option value="correction">Correção</option>
                      <option value="other">Outro</option>
                    </Select>
                  </div>
                  <div className="mb-6">
                    <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Descrição Adicional (opcional)</label>
                    <Textarea
                      rows={2}
                      placeholder="Detalhe o motivo da alteração"
                    />
                  </div>
                  <div className="flex justify-end">
                    <Button variant="primary" onClick={() => handleSave('balance')}>
                      <FontAwesomeIcon icon={faCoins} /> Atualizar Valores
                    </Button>
                  </div>
                </div>
              )}
              {activeTab === 'history' && (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Data</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Administrador</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Alterações</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Motivo</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                      {accountHistory.map(item => (
                        <tr key={item.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">{new Date(item.date).toLocaleString('pt-BR')}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">{item.admin}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">{item.changes}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">{item.reason}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Authentication Modal */}
        {showAuthModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 w-full max-w-md mx-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold flex items-center text-gray-800 dark:text-gray-200">
                  <FontAwesomeIcon icon={faShieldAlt} className="mr-2 text-blue-500" /> Autenticação
                </h2>
                <Button variant="secondary" onClick={() => setShowAuthModal(false)}>
                  <FontAwesomeIcon icon={faTimes} />
                </Button>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-6">Autentique-se para confirmar a alteração:</p>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Senha Administrativa*</label>
                  <Input
                    type="password"
                    id="adminPassword"
                    placeholder="Digite sua senha"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Autenticação de Dois Fatores</label>
                  <div className="flex items-center gap-3">
                    <Button variant="secondary" className="flex-1">
                      <FontAwesomeIcon icon={faMobileAlt} /> Token SMS
                    </Button>
                    <Button variant="secondary" className="flex-1">
                      <FontAwesomeIcon icon={faFingerprint} /> Biometria
                    </Button>
                  </div>
                </div>
              </div>
              <div className="flex justify-between mt-6">
                <Button variant="secondary" onClick={() => setShowAuthModal(false)}>
                  Cancelar
                </Button>
                <Button variant="primary" onClick={confirmAuth}>
                  <FontAwesomeIcon icon={faCheckCircle} /> Confirmar
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Success Toast */}
        {showToast && (
          <div className="fixed bottom-4 right-4 p-4 bg-green-600 dark:bg-green-700 text-white rounded-lg shadow-lg flex items-center z-50 animate-slide-in">
            <FontAwesomeIcon icon={faCheckCircle} className="text-xl mr-3" />
            <div>
              <p className="font-medium">{toastMessage}</p>
              <p className="text-sm opacity-90">Dados atualizados no sistema.</p>
            </div>
            <Button variant="secondary" className="ml-4 opacity-70 hover:opacity-100" onClick={() => setShowToast(false)}>
              <FontAwesomeIcon icon={faTimes} />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BankContexts;