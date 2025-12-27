
// Types for teacher attendance and SPPD reports
export enum AttendanceType {
  CHECK_IN = 'DATANG',
  CHECK_OUT = 'PULANG',
  LEAVE = 'IJIN',
  SICK = 'SAKIT',
  SPPD = 'SPPD'
}

export interface AttendanceRecord {
  id: string;
  type: AttendanceType;
  timestamp: number;
  latitude?: number;
  longitude?: number;
  photoUrl?: string; // Base64
  notes?: string;
  locationName?: string;
  name: string;
  nip: string;
  startDate?: string; // Field baru untuk Ijin/Sakit
  endDate?: string;   // Field baru untuk Ijin/Sakit
}

export interface SPPDRecord extends AttendanceRecord {
  destination: string;
  activityType: string;
  startDate: string;
  endDate: string;
  reportSummary: string;
  attachments: string[];
}

export interface UserState {
  hasCheckedInToday: boolean;
  hasCheckedOutToday: boolean;
  lastCheckInTime?: number;
}
