import React, { useState, useRef } from 'react';
import confetti from 'canvas-confetti';
import { PATIENT_CASES } from '../data/biologyData';
import { PatientCase } from '../types/biology';
import { 
  Stethoscope, 
  Activity, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  Volume2, 
  VolumeX, 
  User, 
  Heart,
  HelpCircle
} from 'lucide-react';

interface InvestigationMissionTwoProps {
  onSendToAITutor: (context: string, studentHypothesis: string, dataSummary: any) => void;
  onCaseCompleted?: (caseId: string, accuracy: number) => void;
}

export const InvestigationMissionTwo: React.FC<InvestigationMissionTwoProps> = ({
  onSendToAITutor,
  onCaseCompleted,
}) => {
  const [selectedCaseId, setSelectedCaseId] = useState<string>('case-2');
  const [selectedDiagnosis, setSelectedDiagnosis] = useState<string>('');
  const [selectedEvidence, setSelectedEvidence] = useState<string[]>([]);
  const [studentReasoning, setStudentReasoning] = useState<string>('');
  const [isAuscultating, setIsAuscultating] = useState<boolean>(false);
  const [verificationFeedback, setVerificationFeedback] = useState<{ isCorrect: boolean; message: string } | null>(null);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const soundTimerRef = useRef<any>(null);

  const currentCase = PATIENT_CASES.find((c) => c.id === selectedCaseId) || PATIENT_CASES[0];

  // Procedural Auscultation Sound Synthesizer based on patient pathology
  const toggleAuscultation = () => {
    if (isAuscultating) {
      if (soundTimerRef.current) clearInterval(soundTimerRef.current);
      setIsAuscultating(false);
      return;
    }

    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') ctx.resume();

      setIsAuscultating(true);

      const playPattern = () => {
        const now = ctx.currentTime;

        // Base S1 (Lub)
        const osc1 = ctx.createOscillator();
        const gain1 = ctx.createGain();
        osc1.frequency.setValueAtTime(70, now);
        osc1.frequency.exponentialRampToValueAtTime(30, now + 0.12);
        gain1.gain.setValueAtTime(0.3, now);
        gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
        osc1.connect(gain1);
        gain1.connect(ctx.destination);
        osc1.start(now);
        osc1.stop(now + 0.13);

        // Pathological Murmur Simulation (White noise buffer filtered)
        if (currentCase.auscultation.sound !== 'Normal (Lub-Dub)') {
          const bufferSize = ctx.sampleRate * 0.16;
          const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
          const output = noiseBuffer.getChannelData(0);
          for (let i = 0; i < bufferSize; i++) {
            output[i] = Math.random() * 2 - 1;
          }
          const whiteNoise = ctx.createBufferSource();
          whiteNoise.buffer = noiseBuffer;

          const filter = ctx.createBiquadFilter();
          filter.type = currentCase.auscultation.sound === 'Murmur Sistolik Ejeksi' ? 'bandpass' : 'lowpass';
          filter.frequency.setValueAtTime(380, now + 0.04);

          const noiseGain = ctx.createGain();
          noiseGain.gain.setValueAtTime(0.18, now + 0.04);
          noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.19);

          whiteNoise.connect(filter);
          filter.connect(noiseGain);
          noiseGain.connect(ctx.destination);

          whiteNoise.start(now + 0.04);
          whiteNoise.stop(now + 0.2);
        }

        // Base S2 (Dub)
        const osc2 = ctx.createOscillator();
        const gain2 = ctx.createGain();
        osc2.frequency.setValueAtTime(100, now + 0.22);
        osc2.frequency.exponentialRampToValueAtTime(45, now + 0.32);
        gain2.gain.setValueAtTime(0.25, now + 0.22);
        gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.32);
        osc2.connect(gain2);
        gain2.connect(ctx.destination);
        osc2.start(now + 0.22);
        osc2.stop(now + 0.33);
      };

      playPattern();
      const intervalMs = (60 / currentCase.vitals.heartRate) * 1000;
      soundTimerRef.current = setInterval(playPattern, intervalMs);
    } catch (e) {
      setIsAuscultating(false);
    }
  };

  // Toggle evidence checklist item
  const toggleEvidenceItem = (item: string) => {
    if (selectedEvidence.includes(item)) {
      setSelectedEvidence(selectedEvidence.filter((x) => x !== item));
    } else {
      setSelectedEvidence([...selectedEvidence, item]);
    }
  };

  // Student validates their diagnosis
  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedDiagnosis === currentCase.correctCondition) {
      confetti({ particleCount: 90, spread: 70, origin: { y: 0.6 } });
      onCaseCompleted?.(currentCase.id, 100);
      setVerificationFeedback({
        isCorrect: true,
        message: `Tepat sekali! Hipotesismu terbukti: ${currentCase.name} mengalami ${currentCase.correctCondition}. Analisismu telah sesuai dengan bukti klinis tanda vital dan auskultasi stetoskop.`,
      });
    } else {
      setVerificationFeedback({
        isCorrect: false,
        message: `Hipotesis belum sepenuhnya cocok dengan bukti. Perhatikan kembali hasil auskultasi suara jantung (${currentCase.auscultation.sound}) dan nilai tekanan darah pasien. Diskusikan dengan AI Tutor untuk menemukan petunjuk!`,
      });
    }
  };

  const handleSendToAI = () => {
    const summary = {
      misi: 'Misi 2: Investigasi Patologi Kardiovaskular',
      pasien: `${currentCase.name} (${currentCase.age} th)`,
      keluhanUtama: currentCase.chiefComplaint,
      tandaVital: currentCase.vitals,
      suaraJantung: currentCase.auscultation.sound,
      hipotesisSiswa: selectedDiagnosis || 'Belum memilih diagnosis final',
      buktiDipilih: selectedEvidence,
      penalaranSiswa: studentReasoning || 'Siswa meminta bimbingan menganalisis keterkaitan gejala dengan struktur jantung.',
    };

    onSendToAITutor(
      `Misi 2: Investigasi Kasus Medis ${currentCase.code} (${currentCase.name})`,
      studentReasoning || `Bagaimana cara membuktikan hubungan antara keluhan ${currentCase.chiefComplaint} dengan data auskultasi ${currentCase.auscultation.sound}?`,
      summary
    );
  };

  return (
    <div className="flex flex-col gap-4 p-4 max-w-7xl mx-auto w-full">
      {/* Title & Mission Header */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-mono font-bold text-rose-400 bg-rose-950 px-2.5 py-0.5 rounded border border-rose-800">
            MISI INVESTIGASI 02
          </span>
          <span className="text-xs text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
            [Patologi Kardiovaskular Berbasis Bukti]
          </span>
        </div>

        <h2 className="text-xl font-bold text-white mb-2">
          Detektif Medis: Analisis Data Vital, Suara Jantung, dan Patologi Peredaran Darah
        </h2>

        <p className="text-xs text-slate-300 leading-relaxed max-w-4xl">
          Siswa bertindak sebagai peneliti laboratorium biologi untuk membedah data pasien simulasi. Analisis keluhan pasien, nilai tekanan darah, curah jantung, dan hasil auskultasi stetoskop untuk merumuskan hipotesis ilmiah mengenai gangguan struktur katup atau pembuluh darah yang terjadi.
        </p>

        {/* Patient Selection Tabs */}
        <div className="flex flex-wrap gap-2 mt-4 pt-3 border-t border-slate-800">
          <span className="text-xs text-slate-400 self-center mr-1">Pilih Rekam Medis:</span>
          {PATIENT_CASES.map((p) => (
            <button
              key={p.id}
              onClick={() => {
                if (isAuscultating && soundTimerRef.current) {
                  clearInterval(soundTimerRef.current);
                  setIsAuscultating(false);
                }
                setSelectedCaseId(p.id);
                setSelectedDiagnosis('');
                setSelectedEvidence([]);
                setVerificationFeedback(null);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                selectedCaseId === p.id
                  ? 'bg-rose-600 text-white border-rose-400 shadow-md scale-105'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
              }`}
            >
              {p.code}: {p.name} ({p.age} th)
            </button>
          ))}
        </div>
      </div>

      {/* Grid: Patient File & Auscultation (5 Cols) vs Scientific Hypothesis Workspace (7 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Column: Patient Clinical Vitals Sheet (5 Cols) */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-800 mb-3">
              <div>
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-cyan-400" />
                  <h3 className="text-base font-bold text-white">{currentCase.name}</h3>
                </div>
                <p className="text-xs text-slate-400">
                  Usia: {currentCase.age} tahun · Jenis Kelamin: {currentCase.gender}
                </p>
              </div>

              <span className="text-xs font-mono font-bold text-slate-300 bg-slate-950 px-2 py-1 rounded border border-slate-800">
                {currentCase.code}
              </span>
            </div>

            {/* Chief Complaint */}
            <div className="mb-4">
              <span className="text-[11px] font-semibold text-amber-400 uppercase tracking-wider block mb-1">
                Keluhan Utama Pasien:
              </span>
              <p className="text-xs text-slate-200 bg-slate-950 p-3 rounded-lg border border-slate-800 leading-relaxed italic">
                "{currentCase.chiefComplaint}"
              </p>
            </div>

            {/* Patient Vitals Matrix vs Normal Reference */}
            <div className="mb-4">
              <span className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider block mb-2">
                Tanda Vital & Parameter Hemodinamik:
              </span>

              <div className="bg-slate-950 rounded-lg border border-slate-800 overflow-hidden text-xs">
                <table className="w-full text-left">
                  <thead className="bg-slate-900/80 text-[10px] text-slate-400 uppercase font-mono">
                    <tr>
                      <th className="py-2 px-3">Parameter</th>
                      <th className="py-2 px-3">Data Pasien</th>
                      <th className="py-2 px-3">Batas Normal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-900 font-mono">
                    <tr>
                      <td className="py-2 px-3 text-slate-300">Tekanan Darah</td>
                      <td className={`py-2 px-3 font-bold ${
                        currentCase.vitals.systolic > 140 ? 'text-rose-400' : currentCase.vitals.systolic < 100 ? 'text-amber-400' : 'text-emerald-400'
                      }`}>
                        {currentCase.vitals.bloodPressure}
                      </td>
                      <td className="py-2 px-3 text-slate-500">&lt; 120/80 mmHg</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 text-slate-300">Heart Rate (Denyut)</td>
                      <td className="py-2 px-3 font-bold text-white">
                        {currentCase.vitals.heartRate} bpm
                      </td>
                      <td className="py-2 px-3 text-slate-500">60 – 100 bpm</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 text-slate-300">Cardiac Output</td>
                      <td className={`py-2 px-3 font-bold ${
                        currentCase.vitals.cardiacOutput < 4.0 ? 'text-amber-400' : 'text-white'
                      }`}>
                        {currentCase.vitals.cardiacOutput} L/menit
                      </td>
                      <td className="py-2 px-3 text-slate-500">4.5 – 6.0 L/min</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 text-slate-300">Ejection Fraction</td>
                      <td className={`py-2 px-3 font-bold ${
                        currentCase.vitals.ejectionFraction < 50 ? 'text-amber-400' : 'text-white'
                      }`}>
                        {currentCase.vitals.ejectionFraction}%
                      </td>
                      <td className="py-2 px-3 text-slate-500">55 – 70%</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 text-slate-300">Saturasi O₂</td>
                      <td className="py-2 px-3 font-bold text-white">
                        {currentCase.vitals.oxygenSaturation}%
                      </td>
                      <td className="py-2 px-3 text-slate-500">95 – 100%</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Interactive Auscultation Stethoscope Simulator */}
            <div className="bg-slate-950 p-3.5 rounded-lg border border-slate-800">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Stethoscope className="w-4 h-4 text-cyan-400" />
                  <span className="text-xs font-semibold text-white">Auskultasi Stetoskop Virtual</span>
                </div>
                <button
                  onClick={toggleAuscultation}
                  className={`px-3 py-1 rounded text-xs font-bold flex items-center gap-1.5 transition-colors ${
                    isAuscultating
                      ? 'bg-rose-500 hover:bg-rose-600 text-white animate-pulse'
                      : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950'
                  }`}
                >
                  {isAuscultating ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                  <span>{isAuscultating ? 'Hentikan Bunyi' : 'Dengarkan Suara Jantung'}</span>
                </button>
              </div>

              <div className="text-xs text-cyan-300 font-semibold mb-1">
                Karakteristik: {currentCase.auscultation.sound}
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                {currentCase.auscultation.description}
              </p>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-400 flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>Data kasus disintesis untuk tujuan pendidikan biologi SMA kelas XI, bukan rujukan diagnosa nyata.</span>
          </div>
        </div>

        {/* Right Column: Hypothesis & Scientific Evidence Workspace (7 Cols) */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-white mb-3 pb-2 border-b border-slate-800 flex items-center gap-2">
              <FileText className="w-4 h-4 text-rose-400" />
              Lembar Kerja Investigasi Ilmiah Siswa
            </h3>

            {/* Prompt for student inquiry */}
            <div className="mb-4 bg-cyan-950/30 p-3.5 rounded-lg border border-cyan-800/50">
              <span className="text-[11px] font-semibold text-cyan-400 uppercase tracking-wider block mb-1">
                Pertanyaan Panduan Investigasi:
              </span>
              <p className="text-xs text-cyan-100 font-medium">
                {currentCase.scientificHypothesisPrompt}
              </p>
            </div>

            <form onSubmit={handleVerify} className="space-y-4">
              {/* Step 1: Formulate Diagnosis Hypothesis */}
              <div>
                <label className="text-xs font-bold text-slate-200 block mb-2">
                  1. Formulasi Hipotesis Diagnosis Kondisi Pasien:
                </label>
                <div className="space-y-1.5">
                  {[
                    'Hipertensi Primer Kronis dengan Hipertrofi Ventrikel Kiri (LVH)',
                    'Stenosis Katup Aorta Berat (Aortic Valve Stenosis)',
                    'Regurgitasi / Insufisiensi Katup Mitral (Mitral Regurgitation)',
                    'Jantung Atlet Sehat (Athletic Heart - Bradikardia Fisiologis)',
                  ].map((diag) => (
                    <label
                      key={diag}
                      className={`flex items-center gap-2.5 p-2.5 rounded-lg border text-xs cursor-pointer transition-colors ${
                        selectedDiagnosis === diag
                          ? 'bg-rose-950/60 border-rose-500 text-white font-semibold'
                          : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <input
                        type="radio"
                        name="patient_diagnosis"
                        checked={selectedDiagnosis === diag}
                        onChange={() => setSelectedDiagnosis(diag)}
                        className="text-rose-500 focus:ring-0"
                      />
                      <span>{diag}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Step 2: Select Evidence Points */}
              <div>
                <label className="text-xs font-bold text-slate-200 block mb-2">
                  2. Pilih Bukti Observasi Klinis yang Mendukung Hipotesismu:
                </label>
                <div className="space-y-1.5">
                  {[
                    `Hasil Auskultasi: ${currentCase.auscultation.sound}`,
                    `Nilai Tekanan Darah Pasien: ${currentCase.vitals.bloodPressure}`,
                    `Nilai Curah Jantung (Cardiac Output): ${currentCase.vitals.cardiacOutput} L/min`,
                    `Keluhan Utama: ${currentCase.chiefComplaint.slice(0, 70)}...`,
                  ].map((ev, idx) => (
                    <label
                      key={idx}
                      className={`flex items-center gap-2.5 p-2 rounded-lg border text-xs cursor-pointer transition-colors ${
                        selectedEvidence.includes(ev)
                          ? 'bg-slate-800 border-cyan-400 text-white'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={selectedEvidence.includes(ev)}
                        onChange={() => toggleEvidenceItem(ev)}
                        className="rounded text-cyan-500 focus:ring-0"
                      />
                      <span>{ev}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Step 3: Scientific Reasoning Claim-Evidence */}
              <div>
                <label className="text-xs font-bold text-slate-200 block mb-1">
                  3. Argumen Hubungan Struktur Jantung dengan Gejala (Claim-Evidence-Reasoning):
                </label>
                <textarea
                  value={studentReasoning}
                  onChange={(e) => setStudentReasoning(e.target.value)}
                  placeholder="Jelaskan secara ilmiah: bagaimana kerusakan pada struktur anatomi (katup/pembuluh/otot) menghasilkan gejala klinis tersebut..."
                  className="w-full text-xs bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 min-h-[75px]"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <button
                  type="submit"
                  disabled={!selectedDiagnosis}
                  className="py-2 px-4 bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white font-bold text-xs rounded-lg transition-colors flex items-center gap-1.5 shadow"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Verifikasi Bukti Hipotesis</span>
                </button>

                <button
                  type="button"
                  onClick={handleSendToAI}
                  className="py-2 px-4 bg-slate-800 hover:bg-slate-700 text-cyan-300 font-semibold text-xs rounded-lg transition-colors flex items-center gap-1.5 border border-slate-700"
                >
                  <span>Minta AI Tutor Menguji Penalaranmu</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>

            {/* Formative Result Alert */}
            {verificationFeedback && (
              <div
                className={`mt-4 p-3.5 rounded-lg border text-xs leading-relaxed animate-in fade-in ${
                  verificationFeedback.isCorrect
                    ? 'bg-emerald-950/60 border-emerald-500 text-emerald-200'
                    : 'bg-amber-950/60 border-amber-500 text-amber-200'
                }`}
              >
                <div className="font-bold mb-1 flex items-center gap-1.5">
                  {verificationFeedback.isCorrect ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-amber-400" />
                  )}
                  <span>{verificationFeedback.isCorrect ? 'Hipotesis Terverifikasi Secara Ilmiah!' : 'Petunjuk Eksplorasi Lanjutan'}</span>
                </div>
                <p>{verificationFeedback.message}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
