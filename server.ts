import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());

// Initialize GoogleGenAI SDK safely
const apiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;

if (apiKey) {
  try {
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  } catch (err) {
    console.error('Gagal menginisialisasi GoogleGenAI SDK:', err);
  }
}

// Socratic Biology Tutor API Endpoint
app.post('/api/gemini/socratic-tutor', async (req: Request, res: Response) => {
  const { messages, currentContext, missionData } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'Format pesan tidak valid.' });
  }

  const systemInstruction = `Anda adalah Dr. Bio, AI Socratic Biology Tutor di BioLab AI 3D untuk siswa SMA Kelas XI materi Sistem Peredaran Darah Manusia.
Peran Anda adalah melatih nalar kritis dan pemahaman konsep sains siswa, BUKAN memberikan jawaban instan atau mendikte kesimpulan.

Pedoman Sokratik Utama:
1. Jangan langsung memberikan jawaban benar atau kesimpulan utuh kepada siswa.
2. Tanggapi dengan ramah, validasi upaya berpikir siswa (misal: "Analisis awalmu menarik...", "Pengamatan yang tajam...").
3. Ajukan HANYA 1–2 pertanyaan panduan reflektif yang merangsang siswa menghubungkan bukti:
   - Hubungan struktur miokardium ventrikel kiri (tebal 12-15 mm) vs ventrikel kanan (3-5 mm) dengan besarnya beban tekanan (afterload sirkulasi sistemik vs pulmonal).
   - Arah katup atrioventrikular (trikuspid/bikuspid) dan semilunar (aorta/pulmonal) dalam mencegah aliran balik darah (regurgitasi).
   - Data tanda vital pasien: Tekanan darah, Ejection Fraction, Heart Rate, suara jantung (lub-dub normal vs murmur akibat stenosis/insufisiensi katup).
4. Ajak siswa membedakan antara konsep teoretis, data simulasi matematika, dan observasi empiris.
5. Gunakan bahasa Indonesia yang santun, ilmiah, baku, dan membakar semangat ilmiah siswa SMA.
6. PERINGATAN KESELAMATAN: Selalu tegaskan bahwa ini adalah analisis biologi edukasi virtual di laboratorium sekolah dan bukan diagnosis medis klinis nyata.

Konteks Pembelajaran Saat Ini:
${currentContext || 'Eksplorasi Jantung dan Sirkulasi Darah'}
Data Tambahan Siswa:
${JSON.stringify(missionData || {})}`;

  // If Gemini API client is available, call Gemini API
  if (aiClient) {
    try {
      // Build conversation history format for gemini-3.8-flash
      const formattedContents = messages.map((m: { role: string; content: string }) => ({
        role: m.role === 'user' ? 'user' : 'model',
        parts: [{ text: m.content }],
      }));

      const response = await aiClient.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: formattedContents,
        config: {
          systemInstruction,
          temperature: 0.7,
        },
      });

      const responseText = response.text || 'Dr. Bio sedang menganalisis data observasimu. Coba amati kembali aliran darah pada katup.';
      return res.json({ reply: responseText });
    } catch (error: any) {
      console.error('Error saat memanggil Gemini API:', error);
      // Fallback response with pedagogical scaffolding
      return res.json({
        reply: getHeuristicSocraticReply(messages[messages.length - 1]?.content || '', currentContext),
        isFallback: true,
      });
    }
  } else {
    // Socratic rule-based heuristic when API key is not yet provided
    const userQuery = messages[messages.length - 1]?.content || '';
    return res.json({
      reply: getHeuristicSocraticReply(userQuery, currentContext),
      isFallback: true,
    });
  }
});

function getHeuristicSocraticReply(query: string, context?: string): string {
  const q = query.toLowerCase();

  if (q.includes('ventrikel kiri') || q.includes('tebal') || q.includes('dinding')) {
    return 'Hipotesismu mengenai ketebalan dinding miokardium sangat menarik! Sekarang perhatikan lintasan darahnya: ventrikel kiri memompa darah ke seluruh tubuh (sirkulasi sistemik), sedangkan ventrikel kanan hanya ke paru-paru (sirkulasi pulmonal). Menurutmu, sirkulasi mana yang memerlukan gaya dorong (tekanan hidrostatik) yang jauh lebih besar, dan mengapa otot jantung harus beradaptasi demikian?';
  }

  if (q.includes('katup') || q.includes('bocor') || q.includes('stenosis') || q.includes('murmur')) {
    return 'Analisis yang tajam tentang fungsi katup! Katup jantung normalnya hanya membuka satu arah saat sistol atau diastol. Jika katup mengalami penyempitan (stenosis) atau gagal menutup rapat (insufisiensi), apa yang akan terjadi pada volume darah yang terdorong maju, dan mengapa dokter bisa mendengar suara desir tambahan (murmur) pada stetoskop?';
  }

  if (q.includes('tekanan darah') || q.includes('hipertensi') || q.includes('140') || q.includes('160')) {
    return 'Pengamatan data vital yang bagus! Pasien dengan tekanan darah tinggi (hipertensi) memiliki resistensi pembuluh darah perifer yang meningkat. Bagaimana ventrikel kiri harus bekerja keras secara terus-menerus melawan tekanan afterload yang tinggi tersebut, dan apa dampak jangka panjangnya terhadap massa otot jantung?';
  }

  if (q.includes('paru') || q.includes('oksigen') || q.includes('pulmonal')) {
    return 'Bagus! Ingatlah bahwa arteri pulmonalis mengalirkan darah berkadar CO2 tinggi dari ventrikel kanan menuju alveolus paru-paru. Apa perbedaan kandungan gas darah sebelum memasuki kapiler alveolus dibanding saat keluar melalui vena pulmonalis menuju atrium kiri?';
  }

  return 'Pertanyaan atau pemikiran yang sangat baik! Untuk menguji hipotesismu lebih dalam, coba hubungkan dengan data yang kamu lihat pada simulator: Apa bukti fisiologis utama dari model jantung atau data tabel pasien yang paling mendukung argumenmu tersebut?';
}

// Setup Vite middleware in dev or static files in production
async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req: Request, res: Response, next) => {
      if (req.path.startsWith('/api')) return next();
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`BioLab AI 3D server running on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Server startup failed:', err);
});
