import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Image as ImageIcon, X, User, Briefcase, UploadCloud, Sparkles } from 'lucide-react';
import { Button, Input, TextArea, Card } from '../components/UIComponents';
import { saveRecord, getUserProfile, compressImage } from '../services/storageService';
import { generateSPPDReport } from '../services/geminiService';
import { AttendanceType, SPPDRecord } from '../types';

export const SPPD: React.FC = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(getUserProfile());
  const [isSaving, setIsSaving] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  // Form Data
  const [activity, setActivity] = useState('');
  const [dest, setDest] = useState('');
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [report, setReport] = useState('');
  const [photos, setPhotos] = useState<(string | null)[]>([null, null, null, null]);

  useEffect(() => {
    if (!profile) setProfile(getUserProfile());
  }, []);

  const handleAIHelp = async () => {
    if (!activity || !dest) {
      alert("Harap isi Jenis Kegiatan dan Lokasi terlebih dahulu agar AI bisa membantu.");
      return;
    }
    setIsGenerating(true);
    const duration = start && end ? `${start} s/d ${end}` : "waktu yang ditentukan";
    const aiText = await generateSPPDReport(dest, activity, duration);
    setReport(aiText);
    setIsGenerating(false);
  };

  const handlePhoto = (idx: number, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const reader = new FileReader();
      reader.onload = async (ev) => {
        const compressed = await compressImage(ev.target?.result as string);
        const newPhotos = [...photos];
        newPhotos[idx] = compressed;
        setPhotos(newPhotos);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleSave = async () => {
    if (!profile?.name || !activity || !report) {
      alert("Harap lengkapi semua data wajib.");
      return;
    }

    setIsSaving(true);
    const validPhotos = photos.filter(p => p !== null) as string[];
    const record: SPPDRecord = {
      id: Date.now().toString(),
      type: AttendanceType.SPPD,
      timestamp: Date.now(),
      name: profile.name,
      nip: profile.nip,
      activityType: activity,
      destination: dest,
      startDate: start,
      endDate: end,
      reportSummary: report,
      attachments: validPhotos
    };

    const res = await saveRecord(record);
    setIsSaving(false);
    if (res.success) {
      alert("Laporan SPPD berhasil disimpan.");
      navigate('/');
    }
  };

  return (
    <div className="p-6 space-y-6 pb-24">
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-4 -mx-6 -mt-6 mb-2 shadow-md">
        <h2 className="text-xl font-bold flex items-center gap-2">
            <Briefcase size={24} /> Laporan SPPD
        </h2>
      </div>

      <Card className="space-y-4 border-l-4 border-blue-500">
        <h3 className="font-bold flex items-center gap-2 text-sm uppercase text-gray-500"><User size={16}/> Pelaksana</h3>
        <Input label="Nama" value={profile?.name || ''} readOnly className="bg-gray-50 dark:bg-gray-700" />
        <Input label="Jenis Kegiatan" placeholder="Contoh: Rapat MKKS, Workshop..." value={activity} onChange={e => setActivity(e.target.value)} />
        <Input label="Lokasi Tujuan" placeholder="Contoh: Dinas Pendidikan Serang" value={dest} onChange={e => setDest(e.target.value)} />
        <div className="grid grid-cols-2 gap-3">
          <Input label="Mulai" type="date" value={start} onChange={e => setStart(e.target.value)} />
          <Input label="Selesai" type="date" value={end} onChange={e => setEnd(e.target.value)} />
        </div>
      </Card>

      <Card className="space-y-4 border-l-4 border-purple-500">
        <div className="flex justify-between items-center">
          <h3 className="font-bold flex items-center gap-2 text-sm uppercase text-gray-500"><FileText size={16}/> Laporan Hasil</h3>
          <button 
            onClick={handleAIHelp}
            disabled={isGenerating}
            className="text-[10px] bg-purple-100 text-purple-700 px-2 py-1 rounded-full font-bold flex items-center gap-1 hover:bg-purple-200 transition-colors"
          >
            <Sparkles size={12} className={isGenerating ? 'animate-pulse' : ''} />
            {isGenerating ? 'MENYUSUN...' : 'BANTUAN AI'}
          </button>
        </div>
        <TextArea 
          label="" 
          placeholder="Uraikan hasil kegiatan..." 
          rows={6} 
          value={report} 
          onChange={e => setReport(e.target.value)} 
        />
      </Card>

      <Card className="space-y-4 border-l-4 border-pink-500">
        <h3 className="font-bold flex items-center gap-2 text-sm uppercase text-gray-500"><ImageIcon size={16}/> Lampiran (Max 4)</h3>
        <div className="grid grid-cols-2 gap-3">
          {photos.map((p, i) => (
            <div key={i} className="aspect-square relative">
              {p ? (
                <>
                  <img src={p} className="w-full h-full object-cover rounded-lg" />
                  <button onClick={() => { const n = [...photos]; n[i] = null; setPhotos(n); }} className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"><X size={12}/></button>
                </>
              ) : (
                <label className="w-full h-full border-2 border-dashed flex flex-col items-center justify-center rounded-lg bg-gray-50 dark:bg-gray-800 cursor-pointer">
                  <UploadCloud size={24} className="text-gray-400" />
                  <input type="file" className="hidden" accept="image/*" onChange={e => handlePhoto(i, e)} />
                </label>
              )}
            </div>
          ))}
        </div>
      </Card>

      <Button onClick={handleSave} isLoading={isSaving} className="w-full bg-purple-600">SIMPAN LAPORAN</Button>
    </div>
  );
};