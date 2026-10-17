import React, { useState, useEffect } from 'react';
import { 
  Play, 
  BookOpen, 
  Sparkles, 
  Bot, 
  CheckCircle2, 
  ExternalLink, 
  Share2, 
  Clock, 
  FileText, 
  Bookmark, 
  Save, 
  AlertCircle 
} from 'lucide-react';

interface VideoLearningStationProps {
  onAskTutorAboutVideo: (topicPrompt: string) => void;
}

export const VideoLearningStation: React.FC<VideoLearningStationProps> = ({
  onAskTutorAboutVideo,
}) => {
  const [studentNotes, setStudentNotes] = useState<string>(() => {
    return localStorage.getItem('biolab_student_video_notes') || '';
  });
  const [savedStatus, setSavedStatus] = useState<string>('');

  const handleSaveNotes = () => {
    localStorage.setItem('biolab_student_video_notes', studentNotes);
    setSavedStatus('Catatan berhasil disimpan!');
    setTimeout(() => setSavedStatus(''), 3000);
  };

  const keyConcepts = [
    {
      title: 'Struktur Miokardium & 4 Ruang Jantung',
      desc: 'Perbedaan anatomis dinding ventrikel kiri (tebal 12–15 mm) vs ventrikel kanan (3–5 mm) dan 2 atrium penampung.',
      prompt: 'Saya baru menonton video tentang 4 ruang jantung. Mengapa atrium hanya memiliki dinding tipis sementara ventrikel memiliki dinding miokardium yang sangat tebal?',
    },
    {
      title: 'Sirkulasi Pulmonal (Peredaran Darah Kecil)',
      desc: 'Ventrikel Kanan → Arteri Pulmonalis → Paru-paru (alveolus O₂/CO₂) → Vena Pulmonalis → Atrium Kiri.',
      prompt: 'Dalam video dijelaskan bahwa arteri pulmonalis membawa darah kaya CO2, sedangkan umumnya arteri membawa O2. Mengapa dinamakan arteri jika membawa CO2?',
    },
    {
      title: 'Sirkulasi Sistemik (Peredaran Darah Besar)',
      desc: 'Ventrikel Kiri → Aorta → Seluruh Tubuh → Vena Kava Superior/Inferior → Atrium Kanan.',
      prompt: 'Bagaimana peranan katup semilunar aorta dalam menjaga tekanan darah diastolik saat ventrikel kiri berelaksasi?',
    },
    {
      title: 'Mekanisme Katup & Suara Jantung Lub-Dub',
      desc: 'Katup AV (Trikuspid & Bikuspid) menutup menghasilkan S1 (Lub); Katup Semilunar menutup menghasilkan S2 (Dub).',
      prompt: 'Di video disebutkan suara Lub dan Dub terjadi karena penutupan katup. Katup mana saja yang menghasilkan suara Lub dan suara Dub?',
    },
  ];

  return (
    <div className="flex flex-col gap-6 p-4 max-w-7xl mx-auto w-full">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-wrap items-center justify-between gap-4 shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-mono font-bold text-rose-400 bg-rose-950 px-2.5 py-0.5 rounded border border-rose-800">
              MATERI TAMBAHAN AUDIO-VISUAL
            </span>
            <span className="text-xs text-slate-400 bg-slate-950 px-2.5 py-0.5 rounded border border-slate-800">
              Kelas XI SMA · Fase F
            </span>
          </div>
          <h2 className="text-xl font-extrabold text-white">
            Video Pembelajaran: Sistem Peredaran Darah Manusia
          </h2>
          <p className="text-xs text-slate-400 max-w-2xl mt-1">
            Media pembelajaran audiovisual sebagai penguat pemahaman konsep anatomis dan fisiologis sebelum menguji hipotesis di laboratorium virtual 3D.
          </p>
        </div>

        <a
          href="https://youtu.be/E_Pt1XxWP1U?si=h0vVDp_wyOFrLUnb"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2 bg-slate-950 hover:bg-slate-800 border border-slate-700 text-xs font-bold text-slate-200 rounded-xl transition-colors shadow"
        >
          <span>Buka di YouTube</span>
          <ExternalLink className="w-3.5 h-3.5 text-rose-400" />
        </a>
      </div>

      {/* Main Grid: Video Player (7 cols) + Socratic Reflection & Notes (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Responsive 16:9 YouTube Player */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
            {/* 16:9 Aspect Ratio Container */}
            <div className="relative w-full pt-[56.25%] bg-black">
              <iframe
                className="absolute inset-0 w-full h-full border-0"
                src="https://www.youtube.com/embed/E_Pt1XxWP1U?rel=0"
                title="Video Pembelajaran Sistem Peredaran Darah Manusia"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>

            {/* Video Subtitle & Metainfo */}
            <div className="p-4 bg-slate-900/90 border-t border-slate-800 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-slate-300">
                <Play className="w-4 h-4 text-rose-500 fill-rose-500" />
                <span className="font-semibold text-white">Sistem Peredaran Darah Manusia</span>
              </div>
              <span className="text-[11px] font-mono text-slate-400">
                Tautan: youtu.be/E_Pt1XxWP1U
              </span>
            </div>
          </div>

          {/* Student Active Note Taking Box */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col gap-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-bold text-white">Catatan & Rangkuman Siswa</h3>
              </div>
              {savedStatus && (
                <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1 animate-in fade-in">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{savedStatus}</span>
                </span>
              )}
            </div>

            <textarea
              rows={4}
              value={studentNotes}
              onChange={(e) => setStudentNotes(e.target.value)}
              placeholder="Tuliskan temuan baru, konsep penting, atau hal yang ingin kamu tanyakan ke Dr. Bio setelah menyimak video..."
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-slate-200 placeholder-slate-500 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 outline-none resize-none leading-relaxed"
            />

            <div className="flex justify-end">
              <button
                onClick={handleSaveNotes}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-bold text-white rounded-xl transition-colors flex items-center gap-1.5 shadow"
              >
                <Save className="w-3.5 h-3.5 text-cyan-400" />
                <span>Simpan Catatan Belajar</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Key Takeaways & Direct Socratic Triggers */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-800 mb-4">
              <div className="w-8 h-8 rounded-lg bg-cyan-600/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Bahas Konsep Video Bersama AI Tutor</h3>
                <p className="text-[11px] text-slate-400">Pilih topik video untuk didiskusikan secara sokratik dengan Dr. Bio.</p>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              {keyConcepts.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 hover:border-slate-700 transition-colors flex flex-col justify-between gap-2.5"
                >
                  <div>
                    <h4 className="text-xs font-bold text-white mb-1 flex items-center gap-1.5">
                      <span className="w-4 h-4 rounded-full bg-cyan-950 border border-cyan-800 text-cyan-400 font-mono text-[10px] flex items-center justify-center">
                        {idx + 1}
                      </span>
                      <span>{item.title}</span>
                    </h4>
                    <p className="text-[11px] text-slate-300 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>

                  <button
                    onClick={() => onAskTutorAboutVideo(item.prompt)}
                    className="self-start text-[11px] font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 mt-1 transition-colors group"
                  >
                    <span>Diskusikan dengan Dr. Bio</span>
                    <Sparkles className="w-3 h-3 group-hover:scale-110 transition-transform" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Epistemological Distinction Box */}
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 text-xs text-slate-400 flex items-start gap-3">
            <AlertCircle className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong>Panduan Belajar:</strong> Video ini menyajikan representasi animasi teoretis. Bandingkan animasi dalam video dengan model 3D anatomi realistis dan data fisiologis pada <strong>Heart Explorer</strong> dan <strong>Misi Investigasi</strong>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
