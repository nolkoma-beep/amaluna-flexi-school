
import React, { useEffect, useState } from 'react';
import { getRecords } from '../services/storageService';
import { AttendanceRecord, AttendanceType } from '../types';
import { Card } from '../components/UIComponents';
import { format } from 'date-fns';
import id from 'date-fns/locale/id';
import { MapPin, FileText } from 'lucide-react';

export const History: React.FC = () => {
  const [records, setRecords] = useState<AttendanceRecord[]>([]);

  useEffect(() => {
    const data = getRecords() as AttendanceRecord[];
    setRecords(data);
  }, []);

  const safeFormatDate = (timestamp: number) => {
    if (!timestamp || isNaN(timestamp)) return 'Tanggal Error';
    try {
        return format(timestamp, 'dd MMM yyyy, HH:mm', { locale: id });
    } catch (e) {
        return 'Format Salah';
    }
  };

  const getBadgeStyle = (type: AttendanceType) => {
    switch (type) {
        case AttendanceType.CHECK_IN:
            return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300';
        case AttendanceType.CHECK_OUT:
            return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300';
        case AttendanceType.LEAVE:
            return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300';
        case AttendanceType.SICK:
            return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300';
        default:
            return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="p-6 pb-24 min-h-screen">
       <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Riwayat Kehadiran</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Catatan seluruh aktivitas Anda.</p>
      </div>

      <div className="space-y-4">
        {records.length === 0 ? (
            <div className="text-center py-12">
                <p className="text-gray-400 dark:text-gray-500 text-sm">Belum ada data riwayat.</p>
            </div>
        ) : (
            records.map((record) => (
                <Card key={record.id} className="relative overflow-hidden">
                    <div className="flex justify-between items-start mb-3 border-b border-gray-100 dark:border-gray-700 pb-2">
                        <div className="flex flex-col">
                             <div className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider self-start mb-1 ${getBadgeStyle(record.type)}`}>
                                {record.type}
                            </div>
                            <span className="text-xs text-gray-400 dark:text-gray-500 font-mono">
                                {safeFormatDate(record.timestamp)}
                            </span>
                        </div>
                        <div className="text-right">
                            <p className="text-xs font-bold text-gray-700 dark:text-gray-200 truncate max-w-[120px]">{record.name}</p>
                            <p className="text-[10px] text-gray-400 dark:text-gray-500">NIP. {record.nip}</p>
                        </div>
                    </div>

                    <div className="flex gap-4 mt-2">
                        {record.photoUrl && (
                            <div className="w-20 h-20 rounded-lg bg-gray-200 dark:bg-gray-700 overflow-hidden shrink-0 border border-gray-200 dark:border-gray-700 shadow-sm">
                                <img src={record.photoUrl} alt="Bukti" className="w-full h-full object-cover" />
                            </div>
                        )}
                        <div className="flex-1 space-y-2">
                            <p className="text-sm font-medium text-gray-800 dark:text-gray-200 flex items-start gap-1">
                                {record.type === AttendanceType.LEAVE || record.type === AttendanceType.SICK ? (
                                    <FileText size={14} className="text-gray-400 dark:text-gray-500 mt-0.5 shrink-0" />
                                ) : (
                                    <MapPin size={14} className="text-gray-400 dark:text-gray-500 mt-0.5 shrink-0" />
                                )}
                                <span className="line-clamp-2">{record.locationName}</span>
                            </p>
                            {record.notes && (
                                <div className="text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/50 p-2 rounded italic">
                                    "{record.notes}"
                                </div>
                            )}
                        </div>
                    </div>
                </Card>
            ))
        )}
      </div>
    </div>
  );
};
