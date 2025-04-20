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
  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);
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
          setActiveTab={setActiveTab} // Pass setActiveTab from HomeAdmin
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