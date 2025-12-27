
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, MapPin, CheckCircle, AlertCircle, LogIn, LogOut, FileText, User, Users, Calendar, ChevronDown, ChevronUp } from 'lucide-react';
import { Card } from '../components/UIComponents';
import { getTodayStatus, getUserProfile, getTodayRecords } from '../services/storageService';
import { AttendanceType } from '../types';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [status, setStatus] = useState(getTodayStatus());
  const [todayRecords, setTodayRecords] = useState<any[]>([]);
  const [showRecap, setShowRecap] = useState(false);
  const [user, setUser] = useState(getUserProfile());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    const profile = getUserProfile();
    setUser(profile);
    setStatus(getTodayStatus());
    setTodayRecords(getTodayRecords());

    return () => clearInterval(timer);
  }, []);

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 11) return 'Selamat Pagi';
    if (hour < 15) return 'Selamat Siang';
    if (hour < 18) return 'Selamat Sore';
    return 'Selamat Malam';
  };

  return (
    <div className="p-6 space-y-6">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-900 dark:to-indigo-900 rounded-2xl p-6 text-white shadow-xl">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-blue-100 text-sm font-medium mb-1">{format(currentTime, 'EEEE, d MMMM yyyy', { locale: id })}</p>
            <h2 className="text-2xl font-bold mb-1">{getGreeting()}, <br/>{user?.name || 'Bapak/Ibu Guru'}!</h2>
          </div>
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center overflow-hidden border border-white/30">
             {user?.photoUrl ? (
                <img src={user.photoUrl} alt="Profile" className="w-full h-full object-cover" />
             ) : (
                <User className="text-white" size={24} />
             )}
          </div>
        </div>
        
        <div className="mt-6 flex items-center gap-3">
            <div className="bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-lg flex items-center gap-2">
                <Clock size={16} />
                <span className="font-mono font-semibold">{format(currentTime, 'HH:mm:ss')}</span>
            </div>
            {status.hasCheckedInToday ? (
                <div className="bg-green-500/30 backdrop-blur-md px-3 py-1.5 rounded-lg flex items-center gap-2 text-green-50 border border-green-400/30">
                    <CheckCircle size={16} />
                    <span className="text-xs font-semibold">Sudah Absen</span>
                </div>
            ) : (
                <div className="bg-amber-500/30 backdrop-blur-md px-3 py-1.5 rounded-lg flex items-center gap-2 text-amber-50 border border-amber-400/30">
                    <AlertCircle size={16} />
                    <span className="text-xs font-semibold">Belum Absen</span>
                </div>
            )}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Menu Utama</h3>
        <div className="grid grid-cols-2 gap-4">
            {/* Kartu Absen Datang */}
            <button onClick={() => navigate('/attendance/in')} className="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-blue-100 dark:border-blue-900 shadow-sm flex flex-col items-center justify-center gap-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all active:scale-95 group">
                <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
                    <LogIn size={24} />
                </div>
                <span className="font-bold text-gray-700 dark:text-gray-300 text-xs">Absen Datang</span>
            </button>

            {/* Kartu Absen Pulang */}
            <button onClick={() => navigate('/attendance/out')} className="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-orange-100 dark:border-orange-900 shadow-sm flex flex-col items-center justify-center gap-2 hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-all active:scale-95 group">
                <div className="p-3 rounded-full bg-orange-100 dark:bg-orange-900/50 text-orange-600 dark:text-orange-400 group-hover:scale-110 transition-transform">
                    <LogOut size={24} />
                </div>
                <span className="font-bold text-gray-700 dark:text-gray-300 text-xs">Absen Pulang</span>
            </button>

            {/* Kartu Ijin / Sakit */}
            <button onClick={() => navigate('/permission')} className="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-amber-100 dark:border-amber-900 shadow-sm flex flex-col items-center justify-center gap-2 hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-all active:scale-95 group">
                <div className="p-3 rounded-full bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400 group-hover:scale-110 transition-transform">
                    <Calendar size={24} />
                </div>
                <span className="font-bold text-gray-700 dark:text-gray-300 text-xs text-center">Ijin / Sakit</span>
            </button>

            {/* Kartu Rekap Sekolah */}
            <button onClick={() => setShowRecap(!showRecap)} className={`p-5 rounded-2xl border shadow-sm flex flex-col items-center justify-center gap-2 transition-all active:scale-95 group ${showRecap ? 'bg-indigo-600 border-indigo-700 text-white' : 'bg-white dark:bg-gray-800 border-indigo-100 dark:border-indigo-900 text-gray-700 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/20'}`}>
                <div className={`p-3 rounded-full transition-transform group-hover:scale-110 ${showRecap ? 'bg-white/20 text-white' : 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400'}`}>
                    <Users size={24} />
                </div>
                <div className="flex items-center gap-1">
                  <span className="font-bold text-xs uppercase text-center">Rekap Sekolah</span>
                  {showRecap ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </div>
            </button>
        </div>
      </div>

      {showRecap && (
        <div className="animate-in fade-in slide-in-from-top-2 duration-300">
           <Card className="border-t-4 border-indigo-600">
            <div className="flex justify-between items-center mb-4 border-b dark:border-gray-700 pb-2">
              <h4 className="font-bold text-gray-800 dark:text-white flex items-center gap-2 text-sm">
                <Users size={16} className="text-indigo-500" />
                Daftar Hadir Sekolah Hari Ini
              </h4>
            </div>
            <div className="space-y-3 max-h-80 overflow-y-auto no-scrollbar">
              {todayRecords.length === 0 ? (
                <p className="text-center text-xs text-gray-400 py-4">Belum ada data absen hari ini.</p>
              ) : (
                todayRecords.map((rec, i) => (
                  <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-gray-50 dark:bg-gray-700/50 border border-gray-100 dark:border-gray-600">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold ${
                        rec.type === 'DATANG' ? 'bg-green-100 text-green-700' : 
                        rec.type === 'PULANG' ? 'bg-orange-100 text-orange-700' : 'bg-amber-100 text-amber-700'
                      }`}>
                        {rec.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-gray-800 dark:text-gray-200">{rec.name}</p>
                        <p className={`text-[10px] font-bold ${
                          rec.type === 'DATANG' ? 'text-green-600' : 
                          rec.type === 'PULANG' ? 'text-orange-600' : 'text-amber-600'
                        }`}>
                          {rec.type}
                        </p>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono bg-white dark:bg-gray-800 px-1.5 py-0.5 rounded border dark:border-gray-600">
                      {format(rec.timestamp, 'HH:mm')}
                    </span>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>
      )}

      <div>
        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-3">Aktivitas Saya Hari Ini</h3>
        <div className="space-y-3">
            {todayRecords.filter(r => r.nip === user?.nip).length === 0 ? (
                <div className="text-center py-8 text-gray-400 bg-white dark:bg-gray-800 rounded-xl border border-dashed dark:border-gray-700">
                    <p className="text-xs">Belum ada aktivitas hari ini.</p>
                </div>
            ) : (
              todayRecords.filter(r => r.nip === user?.nip).map((record, idx) => (
                    <Card key={idx} className="flex items-center gap-4 !p-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                            record.type === AttendanceType.CHECK_IN ? 'bg-blue-100 text-blue-600' : 
                            record.type === AttendanceType.CHECK_OUT ? 'bg-orange-100 text-orange-600' : 'bg-amber-100 text-amber-600'
                        }`}>
                            {record.type === AttendanceType.CHECK_IN ? <MapPin size={18} /> : 
                             record.type === AttendanceType.CHECK_OUT ? <Clock size={18} /> : <FileText size={18} />}
                        </div>
                        <div className="flex-1">
                            <h4 className="font-semibold text-gray-800 dark:text-gray-200 text-sm">{record.type}</h4>
                            <p className="text-[10px] text-gray-500 truncate">
                              {record.type === 'IJIN' || record.type === 'SAKIT' 
                                ? `${record.startDate} s/d ${record.endDate}`
                                : record.notes || record.locationName || 'Catatan terdaftar'}
                            </p>
                        </div>
                        <div className="text-right">
                            <p className="font-bold text-gray-800 dark:text-gray-200 text-sm">{format(record.timestamp, 'HH:mm')}</p>
                            <p className="text-[10px] text-gray-400">{format(record.timestamp, 'd MMM')}</p>
                        </div>
                    </Card>
                ))
            )}
        </div>
      </div>
    </div>
  );
};
