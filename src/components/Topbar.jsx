import React from 'react';

const Topbar = () => {
  return (
    <header className="hidden md:flex fixed top-0 right-0 w-[calc(100%-16rem)] z-40 bg-surface/40 backdrop-blur-xl border-b border-outline-variant/30 justify-between items-center px-margin-desktop h-20 shadow-none">
      {/* Search Bar */}
      <div className="flex items-center relative w-96 group">
        <span className="material-symbols-outlined absolute left-3 text-on-surface-variant group-focus-within:text-primary transition-colors z-10 pointer-events-none">search</span>
        <input 
          className="w-full bg-surface-container-low border border-outline-variant/50 text-on-surface font-body-md text-body-md rounded-full py-2.5 pl-10 pr-4 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all placeholder:text-on-surface-variant/50" 
          placeholder="Search rooms, colleagues, or files..." 
          type="text"
        />
      </div>
      
      {/* Trailing Actions */}
      <div className="flex items-center gap-4">
        <button className="relative text-on-surface-variant hover:text-primary transition-all p-2 rounded-full hover:bg-surface-variant/30 focus-within:ring-1 focus-within:ring-primary">
          <span className="material-symbols-outlined">notifications</span>
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-error ring-2 ring-surface"></span>
        </button>
        <button className="text-on-surface-variant hover:text-primary transition-all p-2 rounded-full hover:bg-surface-variant/30 focus-within:ring-1 focus-within:ring-primary">
          <span className="material-symbols-outlined">apps</span>
        </button>
      </div>
    </header>
  );
};

export default Topbar;
