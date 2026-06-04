import React from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  const navItems = [
    { name: 'Tổng quan', icon: 'dashboard', path: '/' },
    { name: 'Phòng họp', icon: 'meeting_room', path: '/rooms' },
    { name: 'Lịch của tôi', icon: 'calendar_today', path: '/schedule' },
    { name: 'Cài đặt', icon: 'settings', path: '/settings' },
  ];

  return (
    <nav className="hidden md:flex flex-col h-full py-base bg-surface-dim/40 backdrop-blur-xl border-r border-outline-variant/30 shadow-sm fixed left-0 top-0 w-64 z-50">
      <div className="px-gutter mb-8 mt-4">
        <h1 className="font-headline-md text-headline-md font-bold text-primary tracking-tight">Tech Noir</h1>
        <p className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest mt-1">Đặt phòng cao cấp</p>
      </div>

      <div className="flex flex-col gap-2 px-base flex-1">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors active:scale-95 duration-150 border-l-4 ${
                isActive
                  ? 'text-primary font-bold border-tech-blue bg-primary/10'
                  : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-variant/20 border-transparent'
              }`
            }
          >
            <span className="material-symbols-outlined">{item.icon}</span>
            <span className="font-label-md text-label-md">{item.name}</span>
          </NavLink>
        ))}
      </div>

      <div className="px-gutter mt-auto mb-6">
        <button className="w-full py-3 bg-tech-blue hover:bg-tech-blue/90 text-white rounded-DEFAULT font-label-md text-label-md transition-all active:scale-95 flex items-center justify-center gap-2">
          <span className="material-symbols-outlined text-[18px]">add</span>
          Đặt phòng
        </button>
      </div>

      <div className="flex flex-col gap-1 px-base mt-auto border-t border-outline-variant/30 pt-4 mb-4">
        <a className="flex items-center gap-3 px-4 py-2 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-variant/20 transition-colors text-sm" href="#">
          <span className="material-symbols-outlined text-[20px]">help</span>
          <span className="font-label-md text-label-md">Hỗ trợ</span>
        </a>
        <a className="flex items-center gap-3 px-4 py-2 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-variant/20 transition-colors text-sm" href="#">
          <span className="material-symbols-outlined text-[20px]">logout</span>
          <span className="font-label-md text-label-md">Đăng xuất</span>
        </a>
      </div>
      
      <div className="mt-4 pt-4 border-t border-outline-variant/30 flex items-center gap-3 px-6 mb-4">
        <img alt="User Profile" className="w-10 h-10 rounded-full border border-outline-variant/30" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCiObukeojxprDMB-yNZZ7f6XA9k1oBnFaTQb96Rj_lAOeGZsYppeJg_OHMqW48SP5Dlv0Grb2O91Xs3ep5zg78zPN6k9F0M7H2h92psLneCoGvFVbOSjonnWZSH25O-meJauSBREdEzKHkJLJqjWomTy-34WjX0JLkiNAQstsm1zC4qsTo7azDC9holDbpMaqvQm-6nSJpcA5OYU2Ul6sf44fG5Qgl34p2m5vvJtODnIuNIilmDw7UQFcGu18yHK0iGyb5t08sqnA"/>
        <div>
          <p className="font-label-md text-label-md text-on-surface font-semibold">Alex Mercer</p>
          <p className="font-label-sm text-label-sm text-on-surface-variant">Giám đốc Vận hành</p>
        </div>
      </div>
    </nav>
  );
};

export default Sidebar;
