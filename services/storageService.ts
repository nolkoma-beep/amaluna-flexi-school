
import { AttendanceRecord, AttendanceType, SPPDRecord } from '../types';

const STORAGE_KEY = 'guruhadir_records';
const PROFILE_KEY = 'guruhadir_user_profile';

// Fixed: Updated return type to include SPPDRecord
export const getRecords = (): (AttendanceRecord | SPPDRecord)[] => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

// Fixed: Updated return type to include SPPDRecord
export const getTodayRecords = (): (AttendanceRecord | SPPDRecord)[] => {
  const records = getRecords();
  const today = new Date().setHours(0, 0, 0, 0);
  return records.filter(r => new Date(r.timestamp).setHours(0, 0, 0, 0) === today);
};

// Fixed: Updated parameter type to support SPPDRecord
export const saveRecord = async (record: AttendanceRecord | SPPDRecord): Promise<{ success: boolean; message: string }> => {
  try {
    const records = getRecords();
    const newRecords = [record, ...records];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newRecords));
    
    // Auto-update Profile
    saveUserProfile(record.name, record.nip);
    
    return { success: true, message: 'Data berhasil disimpan secara lokal.' };
  } catch (error: any) {
    if (error.name === 'QuotaExceededError') {
      return { success: false, message: 'Memori penyimpanan penuh, silakan hapus riwayat lama.' };
    }
    return { success: false, message: 'Gagal menyimpan data.' };
  }
};

export const compressImage = (base64Str: string, maxWidth = 800): Promise<string> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = base64Str;
    img.onload = () => {
      if (img.width <= maxWidth) { resolve(base64Str); return; }
      const canvas = document.createElement('canvas');
      const ratio = maxWidth / img.width;
      canvas.width = maxWidth;
      canvas.height = img.height * ratio;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', 0.7));
      } else {
        resolve(base64Str);
      }
    };
    img.onerror = () => resolve(base64Str);
  });
};

export const saveUserProfile = (name: string, nip: string, photoUrl?: string, role?: string) => {
  const current = getUserProfile();
  const newData: any = { ...current, name, nip };
  if (photoUrl !== undefined) newData.photoUrl = photoUrl;
  if (role !== undefined) newData.role = role;
  localStorage.setItem(PROFILE_KEY, JSON.stringify(newData));
};

export const getUserProfile = (): { name: string; nip: string; photoUrl?: string; role?: string } | null => {
  const data = localStorage.getItem(PROFILE_KEY);
  return data ? JSON.parse(data) : null;
};

export const getTodayStatus = () => {
  const records = getTodayRecords();
  const profile = getUserProfile();
  
  const myRecords = records.filter(r => r.nip === profile?.nip);
  const checkIn = myRecords.find(r => r.type === AttendanceType.CHECK_IN);
  const checkOut = myRecords.find(r => r.type === AttendanceType.CHECK_OUT);
  
  return {
    hasCheckedInToday: !!checkIn,
    hasCheckedOutToday: !!checkOut,
    checkInTime: checkIn?.timestamp,
    checkOutTime: checkOut?.timestamp
  };
};

export const clearAllData = () => {
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(PROFILE_KEY);
};
