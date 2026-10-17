import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  Activity, 
  BarChart3, 
  HelpCircle, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight, 
  Scale, 
  FileText,
  RotateCcw
} from 'lucide-react';

interface InvestigationMissionOneProps {
  onSendToAITutor: (context: string, studentHypothesis: string, dataSummary: any) => void;
  onCompleteMission?: (accuracy: number) => void;
}

export const InvestigationMissionOne: React.FC<InvestigationMissionOneProps> = ({
  onSendToAITutor,
  onCompleteMission,
}) => {
  // Independent Variables in Virtual Lab
  const [systemicResistance, setSystemicResistance] = useState<number>(100); // % of normal TPR
  const [exerciseLoad, setExerciseLoad] = useState<'istirahat' | 'ringan' | 'berat'>('istirahat');

  // Student Scientific Reasoning Form
  const [studentHypothesis, setStudentHypothesis] = useState<string>('');
  const [selectedReason, setSelectedReason] = useState<string>('');
  const [submittedVerification, setSubmittedVerification] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; message: string } | null>(null);

  // Fisiologi komputasi berdasarkan variabel
  const exerciseMultiplier = exerciseLoad === 'istirahat' ? 1.0 : exerciseLoad === 'ringan' ? 1.3 : 1.7;
  const lvSystolicPressure = Math.round(120 * (systemicResistance / 100) * exerciseMultiplier);
  const rvSystolicPressure = Math.round(24 * exerciseMultiplier);

  // Left vs Right Ventricle Thickness (mm)
  const lvThickness = +(12.5 * Math.sqrt(systemicResistance / 100)).toFixed(1);
  const rvThickness = 4.2; // relatively constant baseline

  const handleVerifyHypothesis = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittedVerification(true);

    if (selectedReason === 'afterload_tpr') {
      confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
      onCompleteMission?.(100);
      setFeedback({
        isCorrect: true,
        message: 'Luar biasa! Hipotesis dan analisismu tepat secara ilmiah. Ventrikel kiri memiliki miokardium jauh lebih tebal karena harus membangkitkan tekanan hidrostatik ~120 mmHg untuk mengatasi tahanan resistensi pembuluh darah sistemik (afterload) yang membentang ke seluruh tubuh.',
      });
    } else {
      setFeedback({
        isCorrect: false,
        message: 'Pengamatanmu sudah aktif, namun perlu penajaman bukti: Perhatikan bahwa volume darah yang dipompa kedua ventrikel sebenarnya sama (~70 ml per denyut). Perbedaan utamanya terletak pada beban tekanan (afterload) sirkulasi sistemik vs pulmonal. Coba diskusikan dengan AI Tutor!',
      });
    }
  };

  const handleConsultAITutor = () => {
    const summary = {
      misi: 'Misi 1: Struktur vs Fungsi Ketebalan Ventrikel Jantung',
      systemicResistance: `${systemicResistance}%`,
      exerciseLoad,
      lvPressure: `${lvSystolicPressure} mmHg`,
      rvPressure: `${rvSystolicPressure} mmHg`,
      lvThickness: `${lvThickness} mm`,
      rvThickness: `${rvThickness} mm`,
      selectedReason,
      studentText: studentHypothesis,
    };

    onSendToAITutor(
      'Misi 1: Investigasi Ketebalan Otot Ventrikel Kiri vs Ventrikel Kanan',
      studentHypothesis || 'Mengapa dinding ventrikel kiri jauh lebih tebal daripada ventrikel kanan meskipun volume sekuncupnya sama?',
      summary
    );
  };

  return (
    <div className="flex flex-col gap-4 p-4 max-w-7xl mx-auto w-full">
      {/* Title & Mission Brief */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-950 px-2.5 py-0.5 rounded border border-cyan-800">
            MISI INVESTIGASI 01
          </span>
          <span className="text-xs text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
            [Fisiologi Komparatif]
          </span>
        </div>

        <h2 className="text-xl font-bold text-white mb-2">
          Misteri Ketebalan Otot Ventrikel: Mengapa Ventrikel Kiri 3 Kali Lebih Tebal?
        </h2>

        <p className="text-xs text-slate-300 leading-relaxed max-w-4xl">
          <strong className="text-cyan-300">Tantangan Ilmiah:</strong> Pada preparat anatomi, dinding otot ventrikel kiri terukur setebal 10–15 mm, sementara ventrikel kanan hanya 3–5 mm. Siswa sering mengira ventrikel kiri menampung volume darah 3 kali lebih banyak, padahal menurut Hukum Kontinuitas Sirkulasi, volume sekuncup (stroke volume) kedua bilik adalah identik (~70 ml). Uji variabel resistensi dan aktivitas fisik di bawah ini untuk menemukan penyebab sejatinya!
        </p>
      </div>

      {/* Experiment Workbench: Left Variables & Calculations, Right Graph & Reasoning */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Lab Panel: Experimental Controls (5 Cols) */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-white mb-3 pb-2 border-b border-slate-800 flex items-center gap-2">
              <Scale className="w-4 h-4 text-cyan-400" />
              Kontrol Variabel Eksperimen Virtual
            </h3>

            {/* Slider 1: Resistensi Vaskular Sistemik (TPR) */}
            <div className="mb-4 bg-slate-950 p-3.5 rounded-lg border border-slate-800">
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-semibold text-slate-200">
                  Resistensi Pembuluh Darah Sistemik (TPR):
                </label>
                <span className="text-xs font-mono font-bold text-cyan-300 tabular-nums">
                  {systemicResistance}% (Normal: 100%)
                </span>
              </div>
              <input
                type="range"
                min="70"
                max="160"
                step="5"
                value={systemicResistance}
                onChange={(e) => setSystemicResistance(parseInt(e.target.value, 10))}
                className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>Vasodilatasi (Rendah)</span>
                <span>Normal</span>
                <span>Vasokonstriksi (Tinggi)</span>
              </div>
            </div>

            {/* Selector 2: Tingkat Aktivitas Fisik */}
            <div className="mb-4 bg-slate-950 p-3.5 rounded-lg border border-slate-800">
              <label className="text-xs font-semibold text-slate-200 block mb-2">
                Kondisi Beban Tubuh (Beban Kerja Jantung):
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['istirahat', 'ringan', 'berat'] as const).map((load) => (
                  <button
                    key={load}
                    onClick={() => setExerciseLoad(load)}
                    className={`py-2 px-3 text-xs font-medium rounded-lg capitalize border transition-colors ${
                      exerciseLoad === load
                        ? 'bg-cyan-500 text-slate-950 border-cyan-400 font-bold shadow'
                        : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                    }`}
                  >
                    {load}
                  </button>
                ))}
              </div>
            </div>

            {/* Live Data Output Metrics Table */}
            <div className="bg-slate-950 p-3.5 rounded-lg border border-slate-800">
              <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Data Terhitung (Simulasi Fisiologis):
              </h4>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between items-center pb-1.5 border-b border-slate-900">
                  <span className="text-slate-400">Tekanan Sistol Ventrikel Kiri (LV):</span>
                  <span className="font-mono font-bold text-rose-400 tabular-nums">
                    {lvSystolicPressure} mmHg
                  </span>
                </div>
                <div className="flex justify-between items-center pb-1.5 border-b border-slate-900">
                  <span className="text-slate-400">Tekanan Sistol Ventrikel Kanan (RV):</span>
                  <span className="font-mono font-bold text-blue-400 tabular-nums">
                    {rvSystolicPressure} mmHg
                  </span>
                </div>
                <div className="flex justify-between items-center pb-1.5 border-b border-slate-900">
                  <span className="text-slate-400">Rasio Beban Tekanan (LV / RV):</span>
                  <span className="font-mono font-bold text-cyan-300 tabular-nums">
                    {(lvSystolicPressure / rvSystolicPressure).toFixed(1)} : 1
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Volume Sekuncup Tiap Denyutan:</span>
                  <span className="font-mono font-bold text-white tabular-nums">
                    LV = 70 ml | RV = 70 ml (Sama!)
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-400">
            Catatan Epistemologi: Nilai tekanan di atas dihasilkan dari persamaan hukum Ohm hidrolik (ΔP = Q × R).
          </div>
        </div>

        {/* Right Lab Panel: Visual Comparison & Scientific Reasoning (7 Cols) */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-white mb-3 pb-2 border-b border-slate-800 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-cyan-400" />
              Perbandingan Ketebalan Dinding Miokardium (mm)
            </h3>

            {/* Visual Bar Comparison */}
            <div className="grid grid-cols-2 gap-4 mb-5">
              {/* Left Ventricle Card */}
              <div className="bg-slate-950 p-4 rounded-xl border border-rose-900/40 flex flex-col items-center">
                <span className="text-xs font-semibold text-rose-300 mb-1">Ventrikel Kiri</span>
                <span className="text-2xl font-mono font-extrabold text-white mb-2 tabular-nums">
                  {lvThickness} <span className="text-xs text-slate-400 font-normal">mm</span>
                </span>
                {/* Visual Muscle Bar */}
                <div className="w-16 h-28 bg-slate-900 rounded-lg overflow-hidden flex flex-col justify-end p-1 border border-slate-800">
                  <div
                    className="w-full bg-rose-600 rounded transition-all duration-300"
                    style={{ height: `${Math.min((lvThickness / 20) * 100, 100)}%` }}
                  />
                </div>
                <span className="text-[10px] text-slate-400 mt-2 text-center">
                  Afterload Sistemik ({lvSystolicPressure} mmHg)
                </span>
              </div>

              {/* Right Ventricle Card */}
              <div className="bg-slate-950 p-4 rounded-xl border border-blue-900/40 flex flex-col items-center">
                <span className="text-xs font-semibold text-blue-300 mb-1">Ventrikel Kanan</span>
                <span className="text-2xl font-mono font-extrabold text-white mb-2 tabular-nums">
                  {rvThickness} <span className="text-xs text-slate-400 font-normal">mm</span>
                </span>
                {/* Visual Muscle Bar */}
                <div className="w-16 h-28 bg-slate-900 rounded-lg overflow-hidden flex flex-col justify-end p-1 border border-slate-800">
                  <div
                    className="w-full bg-blue-600 rounded transition-all duration-300"
                    style={{ height: `${Math.min((rvThickness / 20) * 100, 100)}%` }}
                  />
                </div>
                <span className="text-[10px] text-slate-400 mt-2 text-center">
                  Afterload Pulmonal ({rvSystolicPressure} mmHg)
                </span>
              </div>
            </div>

            {/* Scientific Reasoning / Hypothesis Form */}
            <form onSubmit={handleVerifyHypothesis} className="bg-slate-950 p-4 rounded-xl border border-slate-800">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-cyan-400" />
                Formulasi Kesimpulan Ilmiah Siswa:
              </h4>

              <div className="space-y-2 mb-3">
                <label className="text-xs text-slate-300 block mb-1">
                  Berdasarkan bukti eksperimen di atas, pilihlah kesimpulan kausalitas yang paling valid:
                </label>

                {[
                  {
                    id: 'volume_capacity',
                    label: 'Ventrikel kiri lebih tebal karena harus menampung volume darah 3 kali lebih banyak dari ventrikel kanan.',
                  },
                  {
                    id: 'afterload_tpr',
                    label: 'Ventrikel kiri lebih tebal karena harus membangkitkan tekanan hidrostatik tinggi (~120 mmHg) untuk melawan resistensi vaskular sistemik yang panjang.',
                  },
                  {
                    id: 'gas_pressure',
                    label: 'Ventrikel kiri lebih tebal karena gas oksigen memiliki berat massa yang lebih berat dibanding gas karbon dioksida.',
                  },
                ].map((opt) => (
                  <label
                    key={opt.id}
                    className={`flex items-start gap-2.5 p-2.5 rounded-lg border text-xs cursor-pointer transition-colors ${
                      selectedReason === opt.id
                        ? 'bg-cyan-950/60 border-cyan-500 text-white'
                        : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <input
                      type="radio"
                      name="scientific_reason"
                      checked={selectedReason === opt.id}
                      onChange={() => setSelectedReason(opt.id)}
                      className="mt-0.5 text-cyan-500 focus:ring-0"
                    />
                    <span>{opt.label}</span>
                  </label>
                ))}
              </div>

              {/* Optional Student Custom Hypothesis Text */}
              <div className="mb-3">
                <label className="text-[11px] text-slate-400 block mb-1">
                  Argumen Tambahan Siswa (opsional):
                </label>
                <textarea
                  value={studentHypothesis}
                  onChange={(e) => setStudentHypothesis(e.target.value)}
                  placeholder="Tuliskan alasanmu sendiri menghubungkan Hukum Laplace atau sirkulasi sistemik..."
                  className="w-full text-xs bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 min-h-[60px]"
                />
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="submit"
                  disabled={!selectedReason}
                  className="py-2 px-4 bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-slate-950 font-bold text-xs rounded-lg transition-colors flex items-center gap-1.5 shadow"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Uji Validitas Kesimpulan</span>
                </button>

                <button
                  type="button"
                  onClick={handleConsultAITutor}
                  className="py-2 px-4 bg-slate-800 hover:bg-slate-700 text-cyan-300 font-semibold text-xs rounded-lg transition-colors flex items-center gap-1.5 border border-slate-700"
                >
                  <span>Bahas dengan Socratic AI Tutor</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>

            {/* Formative Feedback Box */}
            {feedback && (
              <div
                className={`mt-4 p-3.5 rounded-lg border text-xs leading-relaxed animate-in fade-in ${
                  feedback.isCorrect
                    ? 'bg-emerald-950/60 border-emerald-500 text-emerald-200'
                    : 'bg-amber-950/60 border-amber-500 text-amber-200'
                }`}
              >
                <div className="font-bold mb-1 flex items-center gap-1.5">
                  {feedback.isCorrect ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-amber-400" />
                  )}
                  <span>{feedback.isCorrect ? 'Verifikasi Ilmiah: Berhasil' : 'Perlu Pendalaman Konsep'}</span>
                </div>
                <p>{feedback.message}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
