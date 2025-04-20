// App.tsx (example adjustment)
import React, { useState } from 'react';
import Sidebar from './SideBar';
import Header from './Header';
import MainAdmin from './MainAdmin';
import NotificationArea from './NotificationArea';
import Modal from './Modal';

interface ModalState {
  type: 'bank' | 'transfer' | 'twofa' | 'confirm' | null;
  data?: any;
}

export function HomeApp () {
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
      <NotificationArea />
      <Modal modalState={modalState} closeModal={closeModal} />
      <div className="flex h-screen overflow-hidden">
        <Sidebar
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
          <Header openModal={openModal} />
          <MainAdmin openModal={openModal} activeTab={activeTab}/>
        </div>
      </div>
    </div>
  );
};