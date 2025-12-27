import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, ClipboardList, FileText, User } from 'lucide-react';

// Fix: Change React.FC to standard function with explicit children prop
export const Layout = ({ children }: { children?: React.ReactNode }) => {
  const location = useLocation();
  const pageTitles: Record<string, string> = {
    '/': 'Beranda',
    '/attendance': 'Absensi',
    '/sppd': 'Laporan SPPD',
    '/history': 'Riwayat'
  };

  const title = pageTitles[location.pathname] || 'GuruHadir';

  const getLinkClass = (path: string, exact = false) => {
    const isActive = exact 
      ? location.pathname === path 
      : location.pathname.startsWith(path);
      
    const base = "flex flex-col items-center justify-center w-full h-full space-y-1";
    const active = "text-blue-600 dark:text-blue-400";
    const inactive = "text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300";
    
    return `${base} ${isActive ? active : inactive}`;
  };

  const getAttendanceLinkClass = () => {
    const isActive = location.pathname.startsWith('/attendance');
    const base = "flex flex-col items-center justify-center w-full h-full space-y-1";
    const activeText = "text-blue-600 dark:text-blue-400";
    const inactiveText = "text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300";
    
    return {
      container: `${base} ${isActive ? activeText : inactiveText}`,
      iconBg: isActive ? 'bg-blue-50 dark:bg-blue-900/30' : ''
    };
  };

  const isSppdActive = location.pathname.startsWith('/sppd');

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col max-w-md mx-auto shadow-2xl overflow-hidden relative transition-colors duration-200">
      <header className="bg-white dark:bg-gray-800 px-6 py-4 flex justify-between items-center sticky top-0 z-20 border-b border-gray-100 dark:border-gray-700 transition-colors duration-200">
        <div className="flex items-center gap-3">
          <img 
            src="https://iili.io/fVB21F1.jpg" 
            alt="Logo Sekolah" 
            className="w-10 h-10 object-contain drop-shadow-sm rounded-full"
          />
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white transition-colors">{title}</h1>
            <div className="flex flex-col mt-0.5">
              <p className="text-xs font-bold text-gray-700 dark:text-gray-300">SD NEGERI JAMBU</p>
              <p className="text-[10px] text-gray-500 dark:text-gray-400 leading-tight">KEC. TUNJUNG TEJA - KAB. SERANG</p>
            </div>
          </div>
        </div>
      </header>
      <main className="flex-1 overflow-y-auto pb-24 no-scrollbar">
        {children}
      </main>
      <nav className="bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700 fixed bottom-0 w-full max-w-md z-30 pb-safe transition-colors duration-200">
        <div className="flex justify-around items-center h-16">
          <NavLink 
            to="/" 
            end
            className={({ isActive }) => 
              isActive ? getLinkClass('/', true) : getLinkClass('/')
            }
          >
            <Home size={22} />
            <span className="text-[10px] font-medium">Beranda</span>
          </NavLink>
          
          <NavLink 
            to="/attendance" 
            className={getAttendanceLinkClass().container}
          >
            <div className={`p-1 rounded-xl ${getAttendanceLinkClass().iconBg}`}>
               <ClipboardList size={22} />
            </div>
            <span className="text-[10px] font-medium">Absen</span>
          </NavLink>

          <div className="-mt-8">
            <NavLink 
              to="/sppd" 
              className={`flex items-center justify-center w-14 h-14 rounded-full shadow-lg shadow-blue-200 dark:shadow-none transition-transform active:scale-95 ${isSppdActive ? 'bg-blue-700 text-white' : 'bg-blue-600 text-white'}`}
            >
              <FileText size={24} />
            </NavLink>
            <div className="text-center mt-1">
              <span className="text-[10px] font-medium text-gray-500 dark:text-gray-400">SPPD</span>
            </div>
          </div>

          <NavLink 
            to="/history" 
            className={getLinkClass('/history')}
          >
            <ClipboardList size={22} />
            <span className="text-[10px] font-medium">Riwayat</span>
          </NavLink>

          <NavLink 
            to="/profile" 
            className={getLinkClass('/profile')}
          >
            <User size={22} />
            <span className="text-[10px] font-medium">Profil</span>
          </NavLink>
        </div>
      </nav>
    </div>
  );
};