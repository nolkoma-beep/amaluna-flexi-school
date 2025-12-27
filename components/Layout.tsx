import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, ClipboardList, User, Clock } from 'lucide-react';

export const Layout = ({ children }: { children?: React.ReactNode }) => {
  const location = useLocation();
  const pageTitles: Record<string, string> = {
    '/': 'Beranda',
    '/attendance': 'Absensi',
    '/history': 'Riwayat',
    '/profile': 'Profil'
  };

  const title = pageTitles[location.pathname] || 'GuruHadir';

  const getLinkClass = (path: string, exact = false) => {
    const isActive = exact 
      ? location.pathname === path 
      : location.pathname.startsWith(path);
      
    const base = "flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors duration-200";
    const active = "text-blue-600 dark:text-blue-400";
    const inactive = "text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300";
    
    return `${base} ${isActive ? active : inactive}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col max-w-md mx-auto shadow-2xl overflow-hidden relative transition-colors duration-200">
      <header className="bg-white dark:bg-gray-800 px-6 py-4 flex justify-between items-center sticky top-0 z-20 border-b border-gray-100 dark:border-gray-700">
        <div className="flex items-center gap-3">
          <img 
            src="https://iili.io/fVB21F1.jpg" 
            alt="Logo Sekolah" 
            className="w-10 h-10 object-contain drop-shadow-sm rounded-full"
          />
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">{title}</h1>
            <div className="flex flex-col mt-0.5">
              <p className="text-xs font-bold text-gray-700 dark:text-gray-300">AMALUNA FLEXI SCHOOL</p>
              <p className="text-[10px] text-gray-500 dark:text-gray-400 leading-tight">KEC. CIRUAS - KAB. SERANG</p>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto pb-20 no-scrollbar">
        {children}
      </main>

      <nav className="bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700 fixed bottom-0 w-full max-w-md z-30 pb-safe shadow-[0_-4px_10px_rgba(0,0,0,0.03)]">
        <div className="flex justify-around items-center h-16">
          <NavLink to="/" className={getLinkClass('/', true)}>
            <Home size={22} />
            <span className="text-[10px] font-medium">Beranda</span>
          </NavLink>
          
          <NavLink to="/attendance" className={getLinkClass('/attendance')}>
            <Clock size={22} />
            <span className="text-[10px] font-medium">Absen</span>
          </NavLink>

          <NavLink to="/history" className={getLinkClass('/history')}>
            <ClipboardList size={22} />
            <span className="text-[10px] font-medium">Riwayat</span>
          </NavLink>

          <NavLink to="/profile" className={getLinkClass('/profile')}>
            <User size={22} />
            <span className="text-[10px] font-medium">Profil</span>
          </NavLink>
        </div>
      </nav>
    </div>
  );
};