
import { GoogleGenAI } from "@google/genai";

export const generateSPPDReport = async (
  destination: string,
  activityType: string,
  duration: string
): Promise<string> => {
  // Fix: Use process.env.API_KEY directly as per guidelines.
  const apiKey = process.env.API_KEY;

  if (!apiKey) {
    console.warn("API Key is missing. Returning mock data.");
    return `[Mode Demo - API Key tidak ditemukan]\n\nLaporan Kegiatan ${activityType} di ${destination}.\n\nDurasi: ${duration}\n\nSaya telah melaksanakan ${activityType} sesuai surat tugas. Kegiatan berjalan lancar, koordinasi telah dilakukan dengan pihak terkait, dan seluruh agenda kegiatan telah diselesaikan dengan baik.`;
  }

  try {
    // Fix: named parameter for apiKey and correct model name
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const prompt = `
      Bertindaklah sebagai guru profesional yang sedang membuat Laporan Perjalanan Dinas (SPPD).
      Buatkan paragraf "Laporan Hasil Kegiatan" yang formal, ringkas, dan jelas dalam Bahasa Indonesia.
      
      Konteks:
      - Jenis Kegiatan: ${activityType}
      - Lokasi/Tujuan: ${destination}
      - Durasi: ${duration}
      
      Fokus pada hasil kegiatan, ketercapaian tujuan, dan penutup yang sopan. Panjang sekitar 3-5 kalimat.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    // Fix: .text is a property, not a method
    return response.text || "Gagal membuat laporan otomatis.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Terjadi kesalahan saat menghubungi asisten AI. Silakan tulis laporan secara manual.";
  }
};
