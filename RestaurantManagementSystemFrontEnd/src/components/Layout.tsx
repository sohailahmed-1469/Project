import React from 'react';
import { Outlet } from 'react-router-dom';
import {Sidebar} from './Sidebar';
import {Header} from './Header';
import { useStore } from '../store/useStore';

const Layout: React.FC = () => {
  const isDarkMode = useStore((state) => state.isDarkMode);

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      <Header toggleSidebar={function (): void {
        throw new Error('Function not implemented.');
      } } />
      <div className="flex">
        <Sidebar isSidebarOpen={false} setIsSidebarOpen={function (_value: React.SetStateAction<boolean>): void {
          throw new Error('Function not implemented.');
        } } />
        <main className="flex-1 p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;