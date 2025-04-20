import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { faUniversity, faSearch, faPowerOff, faMoon, faChevronLeft, faChevronRight, faArrowLeft, faCheck, faEdit, faTimes, faShieldAlt, faCheckCircle, faMinus, faPlus, faMobileAlt, faFingerprint, faSave, faCoins, faCog, faEye } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

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
// Main Component
const BankContexts: React.FC = () => {
  const [search, setSearch] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('name');
  const [selectedBank, setSelectedBank] = useState<Bank | null>(null);
  const [editAccount, setEditAccount] = useState<Account | null>(null);
  const [activeTab, setActiveTab] = useState<string>('data');
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
    if (type === 'balance' && !document.getElementById('changeReason')?.nodeValue) {
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
    <div className={`min-h-screen font-sans antialiased transition-colors duration-300 bg-gray-900}`}>
      <div className="container mx-auto px-4 py-8">
        
        {/* Banks Table */}
        {!selectedBank && (
          <div className="card-light dark:card-dark rounded-lg p-6 shadow-sm bg-white dark:bg-gray-800 border dark:border-gray-600">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
              <div className="relative w-full md:w-96">
                <input
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500"
                  placeholder="Buscar banco por nome ou código ISPB"
                />
                <FontAwesomeIcon icon={faSearch} className="absolute right-3 top-3.5 text-gray-400" />
              </div>
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Ordenar por:</label>
                <select
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value)}
                  className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 text-sm"
                >
                  <option value="name">Nome (A-Z)</option>
                  <option value="accounts">Contas ativas</option>
                  <option value="ispb">Código ISPB</option>
                </select>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Banco</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Código ISPB</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Contas Ativas</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Ações</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredBanks.map(bank => (
                    <tr
                      key={bank.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                      onClick={() => viewBankAccounts(bank.id)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <img className="w-10 h-10 rounded-full bg-gray-100 p-1" src={bank.logo} alt={bank.name} />
                          <div className="ml-4 text-sm font-medium">{bank.name}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">{bank.ispb}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">{bank.activeAccounts.toLocaleString('pt-BR')}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button className="text-blue-500 hover:text-blue-700 mr-3">
                        <FontAwesomeIcon icon={faCog}/>
                        </button>
                        <button
                          className="text-blue-500 hover:text-blue-700"
                          onClick={e => { e.stopPropagation(); viewBankAccounts(bank.id); }}
                        >
                          <FontAwesomeIcon icon={faEye} className="inline mr-1" /> Ver Contas
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Mostrando 1 a {Math.min(10, filteredBanks.length)} de {filteredBanks.length} bancos
              </div>
              <div className="flex gap-1">
                <button className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50" disabled>
                <FontAwesomeIcon icon={faChevronLeft} />
                </button>
                <button className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 font-medium text-blue-500">1</button>
                <button className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700">2</button>
                <button className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700">
                <FontAwesomeIcon icon={faChevronRight} />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Accounts Section */}
        {selectedBank && (
          <div className="card-light dark:card-dark rounded-lg p-6 shadow-sm mt-6 bg-white dark:bg-gray-800 border dark:border-gray-600">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-semibold flex items-center">
                  <img className="w-8 h-8 rounded-full bg-gray-100 p-1 mr-3" src={selectedBank.logo} alt={selectedBank.name} />
                  {selectedBank.name}
                  <span className="ml-3 text-sm font-normal text-gray-500 dark:text-gray-400">ISPB: {selectedBank.ispb}</span>
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  <span>{selectedBank.activeAccounts.toLocaleString('pt-BR')}</span> contas ativas | 
                  R$ {selectedBank.totalBalance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              </div>
              <button
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                onClick={() => setSelectedBank(null)}
              >
                <FontAwesomeIcon icon={faArrowLeft} className="inline mr-2" /> Voltar para bancos
              </button>
            </div>
            <div className="flex flex-wrap items-center gap-3 mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Ações em lote:</span>
              <select className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 text-sm">
                <option disabled selected>Selecione uma ação</option>
                <option>Aumentar limite em 10%</option>
                <option>Bloquear contas inativas</option>
                <option>Atualizar dados cadastrais</option>
              </select>
              <button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-lg">
                Aplicar <FontAwesomeIcon icon={faCheck} className="inline ml-1" />
              </button>
            </div>
            <div className="overflow-x-auto mb-4">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Titular</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">CPF/CNPJ</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Agência/Conta</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Saldo</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Limite</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Ações</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {bankAccounts.map(account => (
                    <tr key={account.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{account.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">{account.document}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">{account.agency}/{account.account}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-red-500 dark:text-red-400">{account.balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-orange-500 dark:text-orange-400">{account.limit.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${account.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {account.status === 'active' ? 'Ativo' : 'Bloqueado'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          className="text-blue-500 hover:text-blue-700"
                          onClick={() => handleEditAccount(account.id)}
                        >
                          <FontAwesomeIcon icon={faEdit} className="inline mr-1" /> Editar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Mostrando 1 a {Math.min(10, bankAccounts.length)} de {bankAccounts.length} contas
              </div>
              <div className="flex gap-1">
                <button className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50" disabled>
                <FontAwesomeIcon icon={faChevronLeft} />
                </button>
                <button className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 font-medium text-blue-500">1</button>
                <button className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700">2</button>
                <button className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700">
                <FontAwesomeIcon icon={faChevronRight} />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Account Modal */}
        {editAccount && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 border dark:border-gray-600 rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold flex items-center">
                <FontAwesomeIcon icon={faEdit} className="mr-2 text-blue-500" /> Editar Conta
                </h2>
                <button className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300" onClick={() => setEditAccount(null)}>
                <FontAwesomeIcon icon={faTimes} />
                </button>
              </div>
              <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
                <ul className="flex flex-wrap -mb-px">
                  <li className="mr-2">
                    <button
                      className={`inline-block p-4 ${activeTab === 'data' ? 'border-b-2 border-blue-500 text-blue-500 font-medium' : ''}`}
                      onClick={() => setActiveTab('data')}
                    >
                      Dados Cadastrais
                    </button>
                  </li>
                  <li className="mr-2">
                    <button
                      className={`inline-block p-4 ${activeTab === 'balance' ? 'border-b-2 border-blue-500 text-blue-500 font-medium' : ''}`}
                      onClick={() => setActiveTab('balance')}
                    >
                      Saldo e Crédito
                    </button>
                  </li>
                  <li className="mr-2">
                    <button
                      className={`inline-block p-4 ${activeTab === 'history' ? 'border-b-2 border-blue-500 text-blue-500 font-medium' : ''}`}
                      onClick={() => setActiveTab('history')}
                    >
                      Histórico
                    </button>
                  </li>
                </ul>
              </div>
              {activeTab === 'data' && (
                <div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label className="block text-sm font-medium mb-1">Nome Completo*</label>
                      <input
                        type="text"
                        defaultValue={editAccount.name}
                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">CPF/CNPJ*</label>
                      <input
                        type="text"
                        defaultValue={editAccount.document}
                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-700"
                        readOnly
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">E-mail*</label>
                      <input
                        type="email"
                        defaultValue={editAccount.email}
                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Telefone*</label>
                      <input
                        type="tel"
                        defaultValue={editAccount.phone}
                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                  </div>
                  <div className="mb-6">
                    <label className="block text-sm font-medium mb-1">Endereço*</label>
                    <textarea
                      defaultValue={editAccount.address}
                      rows={3}
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div className="flex justify-end">
                    <button
                      className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg"
                      onClick={() => handleSave('data')}
                    >
                      <FontAwesomeIcon icon={faSave} className="inline mr-2" /> Salvar Dados
                    </button>
                  </div>
                </div>
              )}
              {activeTab === 'balance' && (
                <div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label className="block text-sm font-medium mb-1">Saldo Disponível (R$)*</label>
                      <div className="flex items-center">
                        <button className="p-2 border border-gray-300 dark:border-gray-600 rounded-l-lg bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600">
                        <FontAwesomeIcon icon={faMinus} />
                        </button>
                        <input
                          type="number"
                          defaultValue={editAccount.balance.toFixed(2)}
                          className="flex-1 p-3 border-t border-b border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 text-center"
                          step="0.01"
                          min="0"
                        />
                        <button className="p-2 border border-gray-300 dark:border-gray-600 rounded-r-lg bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600">
                        <FontAwesomeIcon icon={faPlus} />
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Limite do Cartão (R$)*</label>
                      <div className="flex items-center">
                        <button className="p-2 border border-gray-300 dark:border-gray-600 rounded-l-lg bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600">
                        <FontAwesomeIcon icon={faMinus} />
                        </button>
                        <input
                          type="number"
                          defaultValue={editAccount.limit.toFixed(2)}
                          className="flex-1 p-3 border-t border-b border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 text-center"
                          step="0.01"
                          min="0"
                        />
                        <button className="p-2 border border-gray-300 dark:border-gray-600 rounded-r-lg bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600">
                        <FontAwesomeIcon icon={faPlus} />
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="mb-6">
                    <label className="block text-sm font-medium mb-1">Motivo da Alteração*</label>
                    <select
                      id="changeReason"
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="" disabled selected>Selecione um motivo</option>
                      <option value="adjustment">Ajuste</option>
                      <option value="bonus">Bonificação</option>
                      <option value="correction">Correção</option>
                      <option value="other">Outro</option>
                    </select>
                  </div>
                  <div className="mb-6">
                    <label className="block text-sm font-medium mb-1">Descrição Adicional (opcional)</label>
                    <textarea
                      rows={2}
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500"
                      placeholder="Detalhe o motivo da alteração"
                    />
                  </div>
                  <div className="flex justify-end">
                    <button
                      className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg"
                      onClick={() => handleSave('balance')}
                    >
                        <FontAwesomeIcon icon={faCoins} className="inline mr-2" /> Atualizar Valores
                    </button>
                  </div>
                </div>
              )}
              {activeTab === 'history' && (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-800">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Data</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Admin</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Alterações</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Motivo</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                      {accountHistory.map(item => (
                        <tr key={item.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">{new Date(item.date).toLocaleString('pt-BR')}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">{item.admin}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">{item.changes}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">{item.reason}</td>
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
            <div className="bg-white dark:bg-gray-800 border dark:border-gray-600 rounded-lg p-6 w-full max-w-md mx-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold flex items-center">
                <FontAwesomeIcon icon={faShieldAlt} className="mr-2 text-blue-500" /> Autenticação Requerida
                </h2>
                <button className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300" onClick={() => setShowAuthModal(false)}>
                <FontAwesomeIcon icon={faTimes} />
                </button>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-6">Para confirmar esta alteração, por favor autentique-se:</p>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Senha Administrativa*</label>
                  <input
                    type="password"
                    id="adminPassword"
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500"
                    placeholder="Digite sua senha"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Autenticação de Dois Fatores</label>
                  <div className="flex items-center gap-3">
                    <button className="flex-1 p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700">
                    <FontAwesomeIcon icon={faMobileAlt} className="inline mr-2" /> Token SMS
                    </button>
                    <button className="flex-1 p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700">
                    <FontAwesomeIcon icon={faFingerprint} className="inline mr-2" /> Biometria
                    </button>
                  </div>
                </div>
                <div className="hidden">
                  <label className="block text-sm font-medium mb-1">Código de Token*</label>
                  <input
                    type="text"
                    id="tokenCode"
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500"
                    placeholder="Digite o código de 6 dígitos"
                    maxLength={6}
                  />
                </div>
              </div>
              <div className="flex justify-between mt-6">
                <button
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                  onClick={() => setShowAuthModal(false)}
                >
                  Cancelar
                </button>
                <button
                  className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg"
                  onClick={confirmAuth}
                >
                  <FontAwesomeIcon icon={faCheckCircle} className="inline mr-2" /> Confirmar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Success Toast */}
        {showToast && (
          <div className="fixed bottom-4 right-4 p-4 bg-green-500 text-white rounded-lg shadow-lg flex items-center z-50">
            <FontAwesomeIcon icon={faCheckCircle} className="text-xl mr-3" />
            <div>
              <p className="font-medium">{toastMessage}</p>
              <p className="text-sm opacity-90">As informações foram atualizadas no sistema.</p>
            </div>
            <button className="ml-4 opacity-70 hover:opacity-100" onClick={() => setShowToast(false)}>
            <FontAwesomeIcon icon={faTimes} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BankContexts;
