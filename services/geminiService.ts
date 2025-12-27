
import { GoogleGenAI } from "@google/genai";

/**
 * Service to generate formal SPPD report summaries using Google Gemini AI.
 * Follows latest SDK guidelines for initialization and response handling.
 */
export const generateSPPDReport = async (
  destination: string,
  activityType: string,
  duration: string
): Promise<string> => {
  const apiKey = process.env.API_KEY;

  if (!apiKey) {
    return `Laporan Perjalanan Dinas:\n\nTelah dilaksanakan kegiatan ${activityType} di ${destination} selama ${duration}. Kegiatan berjalan dengan baik dan mencapai target yang ditetapkan.`;
  }

  try {
    // ALWAYS use the named parameter for apiKey initialization.
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    // Call generateContent with model name and prompt directly.
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Buatkan laporan ringkas formal untuk guru yang baru saja menyelesaikan SPPD.
      Kegiatan: ${activityType}
      Lokasi: ${destination}
      Durasi: ${duration}
      Berikan hasil dalam 3-4 kalimat Bahasa Indonesia yang sopan.`,
    });

    // Extract text output from response.text property (not a method).
    return response.text || "Gagal menghasilkan laporan otomatis.";
  } catch (error) {
    console.error("AI Error:", error);
    return "Silakan isi laporan secara manual.";
  }
};
