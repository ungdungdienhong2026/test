import React from 'react';

const Header = () => {
  return (
    <>
      {/* TopAppBar (Desktop) */}
      <header className="hidden md:flex justify-between items-center px-margin-desktop h-20 bg-surface/40 backdrop-blur-xl fixed top-0 right-0 w-[calc(100%-16rem)] z-40 border-b border-outline-variant/30 shadow-none">
        <div className="flex-1 flex items-center">
          <div className="relative w-64 focus-within:ring-1 focus-within:ring-primary rounded-DEFAULT bg-[#0A0F1C] border border-outline-variant/50">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
            <input 
              className="w-full bg-transparent border-none text-on-surface placeholder:text-on-surface-variant/50 pl-10 pr-4 py-2 rounded-DEFAULT focus:ring-0 font-body-md text-body-md" 
              placeholder="Tìm phòng, đồng nghiệp..." 
              type="text"
            />
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <button className="text-on-surface-variant hover:text-primary transition-all p-2 rounded-full hover:bg-surface-variant/20 relative">
            <span className="material-symbols-outlined">notifications</span>
            <span className="absolute top-1 right-2 w-2 h-2 bg-tech-blue rounded-full"></span>
          </button>
          <button className="text-on-surface-variant hover:text-primary transition-all p-2 rounded-full hover:bg-surface-variant/20">
            <span className="material-symbols-outlined">apps</span>
          </button>
        </div>
      </header>

      {/* Mobile Nav Header */}
      <header className="md:hidden flex justify-between items-center px-margin-mobile h-16 bg-surface-dim/40 backdrop-blur-xl fixed top-0 w-full z-40 border-b border-outline-variant/30">
        <h1 className="font-headline-md text-headline-md font-bold text-primary">Tech Noir</h1>
        <button className="text-on-surface">
          <span className="material-symbols-outlined">menu</span>
        </button>
      </header>
    </>
  );
};

export default Header;
