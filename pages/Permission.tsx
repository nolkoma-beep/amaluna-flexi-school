
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, FileText, Camera, ArrowLeft, CheckCircle, AlertTriangle } from 'lucide-react';
import { Button, Card, Input, TextArea } from '../components/UIComponents';
import { saveRecord, getUserProfile, compressImage } from '../services/storageService';
import { AttendanceType } from '../types';

export const Permission: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(getUserProfile());
  const [type, setType] = useState<AttendanceType>(AttendanceType.LEAVE);
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');
  const [photo, setPhoto] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const profile = getUserProfile();
    if (!profile) navigate('/login');
    setUser(profile);
  }, [navigate]);

  const handlePhotoCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = async (ev) => {
        const originalBase64 = ev.target?.result as string;
        try {
            const compressedBase64 = await compressImage(originalBase64, 800);
            setPhoto(compressedBase64);
        } catch (err) {
            setPhoto(originalBase64);
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    if (!notes || !photo || !startDate || !endDate) {
      alert("Mohon lengkapi semua data, termasuk tanggal dan bukti foto.");
      return;
    }

    setIsSubmitting(true);
    const result = await saveRecord({
      id: Date.now().toString(),
      type: type,
      timestamp: Date.now(),
      photoUrl: photo,
      notes,
      startDate,
      endDate,
      name: user?.name || '',
      nip: user?.nip || '',
      locationName: 'Pengajuan Ijin/Sakit'
    });

    setIsSubmitting(false);
    if (result.success) {
      alert("Keterangan berhasil dikirim.");
      navigate('/');
    } else {
      alert(result.message);
    }
  };

  return (
    <div className="p-6 pb-24">
      <div className="mb-6 p-4 -mx-6 -mt-6 bg-gradient-to-r from-amber-500 to-yellow-500 text-white shadow-md">
         <div className="flex items-center gap-3 mb-2">
            <button onClick={() => navigate('/')} className="p-1 rounded-full hover:bg-white/20 transition-colors">
                <ArrowLeft size={24} />
            </button>
            <h2 className="text-xl font-bold flex items-center gap-2">
                <Calendar size={24} />
                Input Ijin / Sakit
            </h2>
         </div>
         <p className="text-white/80 text-sm pl-10">Laporkan alasan ketidakhadiran Anda.</p>
      </div>

      <div className="space-y-6">
        <Card>
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Kategori</h3>
            <div className="grid grid-cols-2 gap-3">
                <button 
                    onClick={() => setType(AttendanceType.LEAVE)}
                    className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${
                        type === AttendanceType.LEAVE 
                        ? 'bg-amber-50 border-amber-500 text-amber-700 dark:bg-amber-900/30 dark:border-amber-700 dark:text-amber-400' 
                        : 'bg-white border-gray-100 text-gray-500 dark:bg-gray-800 dark:border-gray-700'
                    }`}
                >
                    <FileText size={24} />
                    <span className="font-bold text-xs uppercase">Ijin</span>
                </button>
                <button 
                    onClick={() => setType(AttendanceType.SICK)}
                    className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${
                        type === AttendanceType.SICK 
                        ? 'bg-red-50 border-red-500 text-red-700 dark:bg-red-900/30 dark:border-red-700 dark:text-red-400' 
                        : 'bg-white border-gray-100 text-gray-500 dark:bg-gray-800 dark:border-gray-700'
                    }`}
                >
                    <AlertTriangle size={24} />
                    <span className="font-bold text-xs uppercase">Sakit</span>
                </button>
            </div>
        </Card>

        <Card className="space-y-4">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">Periode Ketidakhadiran</h3>
            <div className="grid grid-cols-2 gap-4">
              <Input 
                  label="Mulai Tanggal" 
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
              />
              <Input 
                  label="Sampai Tanggal" 
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
        </Card>

        <Card>
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Detail Keterangan</h3>
            <TextArea 
                label="Alasan" 
                placeholder="Berikan alasan yang jelas..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
            />
        </Card>

        <Card className="text-center p-6 border-dashed border-2 border-gray-200 dark:border-gray-600">
            <h3 className="font-bold text-gray-800 dark:text-gray-200 mb-4 flex items-center justify-center gap-2">
                <Camera size={18} className="text-amber-600" />
                Bukti Foto / Surat
            </h3>

            {photo ? (
                <div className="relative rounded-lg overflow-hidden bg-black">
                    <img src={photo} alt="Bukti" className="w-full h-64 object-cover" />
                    <button 
                        onClick={() => setPhoto(null)} 
                        className="absolute bottom-4 right-4 bg-red-500 text-white p-2 rounded-full shadow-lg"
                    >
                        <Camera size={20} />
                    </button>
                </div>
            ) : (
                <div className="py-4">
                    <div className="w-20 h-20 bg-amber-50 dark:bg-amber-900/30 text-amber-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Camera size={40} />
                    </div>
                    <p className="text-gray-500 dark:text-gray-400 text-xs mb-6">Ambil foto surat keterangan atau bukti pendukung.</p>
                    <div className="relative">
                        <Button className="w-full bg-amber-600" icon={Camera}>Buka Kamera</Button>
                        <input 
                            type="file" 
                            accept="image/*" 
                            capture="environment" 
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            onChange={handlePhotoCapture}
                        />
                    </div>
                </div>
            )}
        </Card>

        <Button 
            className="w-full bg-amber-600 shadow-xl" 
            onClick={handleSubmit}
            isLoading={isSubmitting}
            disabled={!photo || !notes}
        >
            KIRIM KETERANGAN
        </Button>
      </div>
    </div>
  );
};
