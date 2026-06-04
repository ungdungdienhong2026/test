import React from 'react';
import { NavLink } from 'react-router-dom';

const MobileNavBar = () => {
  const navItems = [
    { name: 'Tổng quan', icon: 'dashboard', path: '/' },
    { name: 'Phòng họp', icon: 'meeting_room', path: '/rooms' },
    { name: 'Lịch', icon: 'calendar_today', path: '/schedule' },
    { name: 'Cài đặt', icon: 'settings', path: '/settings' },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 w-full bg-surface/80 backdrop-blur-xl border-t border-outline-variant/30 flex justify-around items-center h-16 z-50 px-2 pb-safe">
      {navItems.map((item) => (
        <NavLink
          key={item.name}
          to={item.path}
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 p-2 transition-colors ${
              isActive
                ? 'text-primary font-bold'
                : 'text-on-surface-variant hover:text-primary'
            }`
          }
        >
          <span className="material-symbols-outlined">{item.icon}</span>
          <span className="font-label-sm text-[10px]">{item.name}</span>
        </NavLink>
      ))}
    </nav>
  );
};

export default MobileNavBar;
