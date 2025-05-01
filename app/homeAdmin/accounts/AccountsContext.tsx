import React from 'react';

const AccountsContent: React.FC = () => {
  const accounts = [
    {
      name: 'João Silva',
      email: 'joao@email.com',
      cpf: '123.456.789-00',
      bank: 'Banco Digital',
      agencyAccount: '0001 / 123456-7',
      balance: '12.345,67',
      status: 'Ativo',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    },
    {
      name: 'Maria Souza',
      email: 'maria@email.com',
      cpf: '987.654.321-00',
      bank: 'Banco Invest',
      agencyAccount: '0002 / 654321-8',
      balance: '8.765,43',
      status: 'Pendente',
      avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    },
    {
      name: 'Carlos Oliveira',
      email: 'carlos@email.com',
      cpf: '12.345.678/0001-99',
      bank: 'Banco Cartões',
      agencyAccount: '0003 / 987654-3',
      balance: '45.678,90',
      status: 'Bloqueado',
      avatar: 'https://randomuser.me/api/portraits/men/75.jpg',
    },
    {
      name: 'Ana Santos',
      email: 'ana@email.com',
      cpf: '456.789.123-00',
      bank: 'Banco Empréstimos',
      agencyAccount: '0004 / 456789-0',
      balance: '3.210,45',
      status: 'Ativo',
      avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
    },
  ];

  return (
    <div id="accountsContent">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Gerenciamento de Contas</h2>
        <div className="flex space-x-3">
          <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
            <i className="fas fa-filter mr-2"></i> Filtrar
          </button>
          <button className="px-4 py-2 bg-primary-light dark:bg-primary-dark text-white rounded-md hover:bg-primary-dark dark:hover:bg-blue-900">
            <i className="fas fa-plus mr-2"></i> Adicionar
          </button>
        </div>
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden mb-6">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Buscar contas..."
                  className="pl-8 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"
                />
                <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
              </div>
              <div className="flex items-center space-x-2">
                <label className="text-sm text-gray-500 dark:text-gray-400">Status:</label>
                <select className="text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700">
                  <option>Todos</option>
                  <option>Ativo</option>
                  <option>Bloqueado</option>
                  <option>Pendente</option>
                </select>
              </div>
              <div className="flex items-center space-x-2">
                <label className="text-sm text-gray-500 dark:text-gray-400">Tipo:</label>
                <select className="text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700">
                  <option>Todos</option>
                  <option>PF</option>
                  <option>PJ</option>
                </select>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 rounded-md flex items-center">
                <i className="fas fa-file-export mr-1"></i> Exportar
              </button>
              <button className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 rounded-md flex items-center">
                <i className="fas fa-cog"></i>
              </button>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="data-table w-full">
            <thead>
              <tr className="text-left text-gray-500 dark:text-gray-400">
                <th className="px-6 py-3">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 dark:border-gray-600 text-primary-light dark:text-primary-dark focus:ring-primary-light dark:focus:ring-primary-dark"
                  />
                </th>
                <th className="px-6 py-3">Titular</th>
                <th className="px-6 py-3">CPF/CNPJ</th>
                <th className="px-6 py-3">Banco</th>
                <th className="px-6 py-3">Agência/Conta</th>
                <th className="px-6 py-3">Saldo</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="text-gray-700 dark:text-gray-300">
              {accounts.map((account, index) => (
                <tr key={index}>
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 dark:border-gray-600 text-primary-light dark:text-primary-dark focus:ring-primary-light dark:focus:ring-primary-dark"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <img src={account.avatar} alt="User" className="w-8 h-8 rounded-full mr-3" />
                      <div>
                        <p className="font-medium">{account.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{account.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">{account.cpf}</td>
                  <td className="px-6 py-4">{account.bank}</td>
                  <td className="px-6 py-4">{account.agencyAccount}</td>
                  <td className="px-6 py-4">R$ {account.balance}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                        account.status === 'Ativo'
                          ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300'
                          : account.status === 'Pendente'
                          ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-300'
                          : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-300'
                      }`}
                    >
                      {account.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end space-x-2">
                      <button className="p-1 text-gray-400 hover:text-blue-500" title="Editar">
                        <i className="fas fa-edit"></i>
                      </button>
                      <button
                        className={`p-1 text-gray-400 ${
                          account.status === 'Bloqueado' ? 'hover:text-green-500' : 'hover:text-red-500'
                        }`}
                        title={account.status === 'Bloqueado' ? 'Desbloquear' : 'Bloquear'}
                      >
                        <i className={`fas ${account.status === 'Bloqueado' ? 'fa-unlock' : 'fa-lock'}`}></i>
                      </button>
                      <button className="p-1 text-gray-400 hover:text-purple-500" title="Ajustar Limites">
                        <i className="fas fa-sliders-h"></i>
                      </button>
                      <button className="p-1 text-gray-400 hover:text-green-500" title="Ajustar Saldo">
                        <i className="fas fa-money-bill-wave"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <div className="text-sm text-gray-500 dark:text-gray-400">Mostrando 1 a 4 de 128 contas</div>
          <div className="flex space-x-2">
            <button className="px-3 py-1 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
              <i className="fas fa-chevron-left"></i>
            </button>
            <button className="px-3 py-1 rounded-md bg-primary-light dark:bg-primary-dark text-white">1</button>
            <button className="px-3 py-1 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">2</button>
            <button className="px-3 py-1 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">3</button>
            <button className="px-3 py-1 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
              <i className="fas fa-chevron-right"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountsContent;