import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import MobileNavBar from './MobileNavBar';

const Layout = () => {
  return (
    <div className="text-on-surface font-body-md min-h-screen flex relative overflow-x-hidden bg-[#0A0F1C]">
      {/* Ambient Background Glow */}
      <div className="fixed top-[-20%] left-[-10%] w-[50%] h-[50%] bg-tech-blue/10 rounded-full blur-[120px] pointer-events-none z-0"></div>
      <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[100px] pointer-events-none z-0"></div>

      <Sidebar />
      <MobileNavBar />
      
      <main className="flex-1 md:ml-64 relative z-10 flex flex-col min-h-screen pb-16 md:pb-0">
        <Header />
        
        {/* Main Content Area */}
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
