import React from 'react';

interface SidebarProps {
  isCollapsed: boolean;
  toggleSidebar: () => void;
  toggleDarkMode: () => void;
  setActiveTab: (tab: string) => void;
  isDarkMode: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({
  isCollapsed,
  toggleSidebar,
  toggleDarkMode,
  setActiveTab,
  isDarkMode,
}) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'fa-tachometer-alt' },
    { id: 'banks', label: 'Bancos', icon: 'fa-university', group: 'Gerenciamento' },
    { id: 'accounts', label: 'Contas', icon: 'fa-users', group: 'Gerenciamento' },
    { id: 'transactions', label: 'Transações', icon: 'fa-exchange-alt', group: 'Gerenciamento' },
    { id: 'invoices', label: 'Boletos', icon: 'fa-barcode', group: 'Gerenciamento' },
    { id: 'users', label: 'Usuários', icon: 'fa-user-cog', group: 'Sistema' },
    { id: 'audit', label: 'Auditoria', icon: 'fa-clipboard-list', group: 'Sistema' },
    { id: 'settings', label: 'Configurações', icon: 'fa-cog', group: 'Sistema' },
  ];

  return (
    <div
      className={`sidebar bg-gray-800 dark:bg-gray-900 text-white w-64 h-full fixed flex flex-col ${
        isCollapsed ? 'sidebar-collapsed' : ''
      }`}
    >
      <div className="sidebar-header flex items-center justify-between p-4 border-b border-gray-700">
        <div className="flex items-center sidebar-header-text">
          <i className="fas fa-university text-xl mr-2 text-blue-400"></i>
          <span className="text-xl font-bold">Admin Banking</span>
        </div>
        <button onClick={toggleSidebar} className="text-gray-400 hover:text-white">
          <i className="fas fa-bars"></i>
        </button>
      </div>

      <div className="p-4 border-b border-gray-700 flex items-center sidebar-header-text">
        <div className="relative">
          <img
            src="https://randomuser.me/api/portraits/men/75.jpg"
            alt="Admin"
            className="w-10 h-10 rounded-full"
          />
          <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-800"></span>
        </div>
        <div className="ml-3">
          <p className="text-sm font-medium">Admin Master</p>
          <p className="text-xs text-gray-400">superadmin@banco.com</p>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto">
        <div className="p-2">
          {['Principal', 'Gerenciamento', 'Sistema'].map((group) => (
            <div key={group} className="mb-2">
              {navItems.some((item) => item.group === group || (group === 'Principal' && !item.group)) && (
                <p className="text-xs uppercase text-gray-500 px-4 py-2 sidebar-header-text">{group}</p>
              )}
              <ul>
                {navItems
                  .filter((item) => item.group === group || (group === 'Principal' && !item.group))
                  .map((item) => (
                    <li key={item.id}>
                      <a
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          setActiveTab(item.id);
                        }}
                        className={`sidebar-item flex items-center px-4 py-3 text-sm font-medium rounded-lg ${
                          item.id === 'dashboard' ? 'bg-gray-700 text-white' : 'text-gray-300 hover:bg-gray-700'
                        }`}
                      >
                        <i className={`fas ${item.icon} mr-3`}></i>
                        <span className="sidebar-item-text">{item.label}</span>
                      </a>
                    </li>
                  ))}
              </ul>
            </div>
          ))}
        </div>
      </nav>

      <div className="p-4 border-t border-gray-700 flex items-center justify-between">
        <button className="sidebar-item flex items-center text-sm font-medium text-gray-300 hover:text-white">
          <i className="fas fa-sign-out-alt mr-3"></i>
          <span className="sidebar-item-text">Sair</span>
        </button>
        <button onClick={toggleDarkMode} className="text-gray-400 hover:text-white">
          <i className={`fas ${isDarkMode ? 'fa-sun' : 'fa-moon'}`}></i>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;