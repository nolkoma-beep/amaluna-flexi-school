import { saveUserProfile } from './storageService';

const AUTH_KEY = 'guruhadir_is_authenticated';

// Database Foto (Mapping Nama -> URL)
const PHOTO_DATABASE: Record<string, string> = {
  "ASEP AWALUDIN,S.Pd": "https://iili.io/fzNJbOQ.jpg",
  "MUNJI, S.Pd.I": "https://iili.io/fzN21uR.jpg",
  "MARTINI, S.Pd.I": "https://iili.io/fzNFX7s.jpg",
  "MINARTI, S.Pd.I": "https://iili.io/fzNKoyG.jpg",
  "DEWI HOFIANTINI, S.Pd": "https://iili.io/fzNCTJ9.jpg",
  "A. BAIRONI,S.Pd": "https://iili.io/fzNCUen.jpg",
  "HERNAWATI, S.Pd": "https://iili.io/fzNfoKP.jpg",
  "AHMAD FAHMI, S.Pd.I": "https://iili.io/fzN3GHb.jpg",
  "AMNIATUSHALIHAT, S.Pd": "https://iili.io/fzNq7ku.jpg"
};

// Database Jabatan (Mapping Nama -> Role)
const ROLE_DATABASE: Record<string, string> = {
  "ASEP AWALUDIN,S.Pd": "Kepala Sekolah",
  "MUNJI, S.Pd.I": "Guru Agama",
  "MARTINI, S.Pd.I": "Guru Kelas",
  "MINARTI, S.Pd.I": "Guru Kelas",
  "DEWI HOFIANTINI, S.Pd": "Guru Kelas",
  "A. BAIRONI,S.Pd": "Guru Kelas",
  "HERNAWATI, S.Pd": "Guru Kelas",
  "AHMAD FAHMI, S.Pd.I": "Guru Kelas",
  "AMNIATUSHALIHAT, S.Pd": "Guru PJOK"
};

// Helper untuk mencari foto berdasarkan nama (Case Insensitive)
const getPhotoByName = (name: string): string | undefined => {
  if (!name) return undefined;
  const normalizedSearch = name.trim().toLowerCase();
  const matchedKey = Object.keys(PHOTO_DATABASE).find(key => 
    key.toLowerCase() === normalizedSearch
  );
  return matchedKey ? PHOTO_DATABASE[matchedKey] : undefined;
};

// Helper untuk mencari jabatan berdasarkan nama (Case Insensitive)
const getRoleByName = (name: string): string => {
  if (!name) return "Guru Kelas"; // Default
  const normalizedSearch = name.trim().toLowerCase();
  const matchedKey = Object.keys(ROLE_DATABASE).find(key => 
    key.toLowerCase() === normalizedSearch
  );
  return matchedKey ? ROLE_DATABASE[matchedKey] : "Guru Kelas";
};

export interface LoginResult {
  success: boolean;
  message?: string;
}

export const login = async (username: string, password: string): Promise<LoginResult> => {
  if (!username || !password) return { success: false, message: "Username dan Password harus diisi." };

  // LOGIN LOKAL (TANPA GOOGLE SHEET)
  // Password default untuk semua user: 123456
  if (password === '123456') {
    localStorage.setItem(AUTH_KEY, 'true');
    
    // Normalisasi input username agar cocok dengan database (misal: "asep awaludin" -> "ASEP AWALUDIN,S.Pd" jika memungkinkan, 
    // tapi di sini kita pakai input mentah user dulu, atau kita cari key yang mirip)
    
    // Logika sederhana: Cari di database, kalau ada pakai datanya. Kalau tidak ada, buat data baru.
    const normalizedUsername = username.trim();
    
    // Coba cari nama resmi di database yang mengandung kata dari username input
    const matchedKey = Object.keys(PHOTO_DATABASE).find(key => 
        key.toLowerCase().includes(normalizedUsername.toLowerCase())
    );

    const displayName = matchedKey || normalizedUsername.toUpperCase();
    const photo = getPhotoByName(displayName);
    const role = getRoleByName(displayName);
    
    // Simpan profil lokal
    // NIP dummy karena tidak ada database NIP
    saveUserProfile(displayName, "190000000000000000", photo, role);
    
    return { success: true };
  }

  return { success: false, message: "Password salah. Default: 123456" };
};

export const logout = () => {
  localStorage.removeItem(AUTH_KEY);
};

export const isAuthenticated = (): boolean => {
  return localStorage.getItem(AUTH_KEY) === 'true';
};