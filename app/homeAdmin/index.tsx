
import BankContexts from "./banks/Banks"
import TransationMain from "./transactions/Transaction"
import React, { useState } from 'react';
import Dashboard from "./dashboard/Dashboard"
import { HeaderAdmin } from "~/components/Headers/HeaderAdmin"
import { ModalAdmin } from "~/components/Modals/ModalAdmin"
import { SidebarAdmin } from "~/components/Sidebars/SideBarAdmin"
import { NotificationAreaAdmin } from "~/components/Toasts/NotificationAreaAdmin"

interface ModalState {
  type: 'bank' | 'transfer' | 'twofa' | 'confirm' | null;
  data?: any;
}

interface MainContentProps {
  activeTab: string;
  openModal: (type: 'bank' | 'transfer' | 'twofa' | 'confirm', data?: any) => void;
}

export function Index () {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [modalState, setModalState] = useState<ModalState>({ type: null });
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  const toggleSidebar = () => setIsSidebarCollapsed(!isSidebarCollapsed);
  const toggleDarkMode = () => {
    setIsDarkMode((prev: boolean) => {
      const newMode: boolean = !prev;
      localStorage.setItem('darkMode', String(newMode));
      localStorage.setItem('theme', newMode ? 'dark' : 'light');
      if (newMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      return newMode;
    });
  };
  const openModal = (type: ModalState['type'], data?: any) => setModalState({ type, data });
  const closeModal = () => setModalState({ type: null });

  return (
    <div className={`bg-gray-100 dark:bg-gray-900 ${isDarkMode ? 'dark' : ''}`}>
      <NotificationAreaAdmin />
      <ModalAdmin modalState={modalState} closeModal={closeModal} />
      <div className="flex h-screen overflow-hidden">
        <SidebarAdmin
          isCollapsed={isSidebarCollapsed}
          toggleSidebar={toggleSidebar}
          toggleDarkMode={toggleDarkMode}
          setActiveTab={setActiveTab}
          activeTab={activeTab}
          isDarkMode={isDarkMode}
        />
        <div
          className={`content-area flex-1 flex flex-col overflow-hidden ${
            isSidebarCollapsed ? 'content-area-collapsed' : 'content-area-expanded'
          }`}
        >
          <HeaderAdmin openModal={openModal} />
          <main className="flex-1 overflow-y-auto p-6 bg-gray-50 dark:bg-gray-900">
            {activeTab === 'dashboard' && <Dashboard />}
            {activeTab === 'accounts' && <BankContexts />}
            {activeTab === 'transactions' && <TransationMain />}
          </main>
        </div>
      </div>
    </div>
  );
};