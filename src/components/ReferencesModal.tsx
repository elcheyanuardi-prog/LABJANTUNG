import React from 'react';
import { SCIENTIFIC_REFERENCES } from '../data/biologyData';
import { BookOpen, X, CheckCircle, ShieldAlert, Award, ExternalLink } from 'lucide-react';

interface ReferencesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ReferencesModal: React.FC<ReferencesModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-600/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Petunjuk Laboratorium & Sumber Pustaka</h3>
              <p className="text-[11px] text-slate-400">BioLab AI 3D — Kurikulum Biologi SMA Kelas XI</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Guide Section */}
        <div>
          <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <CheckCircle className="w-3.5 h-3.5 text-cyan-400" />
            Petunjuk Penggunaan Laboratorium Virtual:
          </h4>
          <ul className="space-y-1.5 text-xs text-slate-300 list-disc pl-5 leading-relaxed">
            <li>
              <strong>Heart Explorer 3D:</strong> Gunakan klik-dan-tarik untuk memutar model, scroll untuk memperbesar/memperkecil, atau klik pin penanda untuk mengamati data anatomi tiap ruang, katup, dan pembuluh darah.
            </li>
            <li>
              <strong>Kontrol Bedah Dalam:</strong> Gunakan tombol "Bedah Dalam" di dock bawah untuk melihat katup internal trikuspidalis, mitral, aorta, dan sekat jantung.
            </li>
            <li>
              <strong>Simulasi Sirkulasi:</strong> Ikuti urutan peredaran darah besar & kecil 10 tahap. Perhatikan perubahan warna eritrosit saat mengalami pertukaran gas di paru-paru dan jaringan tubuh.
            </li>
            <li>
              <strong>Misi Investigasi 1 & 2:</strong> Uji hipotesis mengenai ketebalan ventrikel dan diagnosis 4 kasus penyakit kardiovaskular berdasarkan bukti tanda vital dan auskultasi.
            </li>
            <li>
              <strong>Socratic AI Tutor:</strong> Berdialog dengan Dr. Bio untuk menggali penalaran ilmiah secara mendalam. AI ini akan memandumu dengan pertanyaan reflektif.
            </li>
          </ul>
        </div>

        {/* Ethical Safety Notice */}
        <div className="bg-amber-950/20 border border-amber-900/40 rounded-xl p-3.5 text-xs text-amber-200">
          <div className="flex items-center gap-2 font-bold mb-1">
            <ShieldAlert className="w-4 h-4 text-amber-400" />
            <span>Prinsip Keamanan & Etika Sains:</span>
          </div>
          <p className="leading-relaxed text-[11px] text-amber-300">
            Aplikasi ini dibuat secara khusus untuk simulasi pembelajaran biologi sekolah dan pengembangan literasi sains. Data pasien disintesis untuk menggambarkan konsep patofisiologi kardiovaskular. AI Tutor tidak digunakan untuk diagnosis medis manusia di dunia nyata.
          </p>
        </div>

        {/* Video Learning Reference Section */}
        <div>
          <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <ExternalLink className="w-3.5 h-3.5 text-rose-400" />
            Media Pembelajaran Tambahan (Video Audiovisual):
          </h4>
          <a
            href="https://youtu.be/E_Pt1XxWP1U?si=h0vVDp_wyOFrLUnb"
            target="_blank"
            rel="noopener noreferrer"
            className="block bg-slate-950 p-3 rounded-lg border border-slate-800 hover:border-cyan-500/50 transition-colors group"
          >
            <div className="font-bold text-white group-hover:text-cyan-300 transition-colors flex items-center justify-between">
              <span>Video Pembelajaran: Sistem Peredaran Darah Manusia</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-cyan-400" />
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              Tautan: https://youtu.be/E_Pt1XxWP1U · Ringkasan sirkulasi darah besar, kecil, dan anatomi jantung.
            </div>
          </a>
        </div>

        {/* Literature References Section */}
        <div>
          <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Award className="w-3.5 h-3.5 text-rose-400" />
            Sumber Referensi Ilmiah Baku:
          </h4>
          <div className="space-y-2.5">
            {SCIENTIFIC_REFERENCES.map((ref, idx) => (
              <div key={idx} className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-xs">
                <div className="font-bold text-white mb-0.5">{ref.title}</div>
                <div className="text-[11px] text-slate-400 mb-1">
                  Penulis: {ref.authors} ({ref.year}) · Penerbit: {ref.publisher}
                </div>
                <div className="text-[11px] text-cyan-300 font-medium mb-1">
                  Bagian: {ref.chapter}
                </div>
                <div className="text-[10px] text-slate-500 italic">
                  Relevansi: {ref.relevance}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Close Button */}
        <div className="pt-2 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-lg transition-colors"
          >
            Mengerti & Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
