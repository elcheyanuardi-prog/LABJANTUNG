import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  Heart, 
  Sparkles, 
  GraduationCap, 
  User, 
  ArrowRight, 
  ShieldCheck, 
  Activity, 
  Atom, 
  Fingerprint,
  CheckCircle2,
  Lock
} from 'lucide-react';

export interface StudentProfile {
  name: string;
  className: 'XI 1' | 'XI 2';
  attendanceNo?: string;
}

interface StudentLoginProps {
  onLogin: (student: StudentProfile) => void;
}

export const StudentLogin: React.FC<StudentLoginProps> = ({ onLogin }) => {
  const [name, setName] = useState<string>('');
  const [className, setClassName] = useState<'XI 1' | 'XI 2'>('XI 1');
  const [attendanceNo, setAttendanceNo] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [isEntering, setIsEntering] = useState<boolean>(false);
  const [entryStage, setEntryStage] = useState<number>(0);

  // Play high-tech lab access chime
  const playAccessSound = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const now = audioCtx.currentTime;

      // Double high chime (authorization grant)
      const osc1 = audioCtx.createOscillator();
      const gain1 = audioCtx.createGain();
      osc1.type = 'triangle';
      osc1.frequency.setValueAtTime(587.33, now); // D5
      osc1.frequency.exponentialRampToValueAtTime(880, now + 0.15); // A5
      gain1.gain.setValueAtTime(0.15, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
      osc1.connect(gain1);
      gain1.connect(audioCtx.destination);
      osc1.start(now);
      osc1.stop(now + 0.3);

      const osc2 = audioCtx.createOscillator();
      const gain2 = audioCtx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(880, now + 0.15);
      osc2.frequency.exponentialRampToValueAtTime(1174.66, now + 0.35); // D6
      gain2.gain.setValueAtTime(0.15, now + 0.15);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
      osc2.connect(gain2);
      gain2.connect(audioCtx.destination);
      osc2.start(now + 0.15);
      osc2.stop(now + 0.45);
    } catch {
      // Audio autoplay gracefully handled
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg('Silakan masukkan nama lengkap siswa.');
      return;
    }
    if (name.trim().length < 3) {
      setErrorMsg('Nama siswa minimal 3 karakter.');
      return;
    }

    setErrorMsg('');
    setIsEntering(true);
    playAccessSound();

    // Trigger celebratory particle burst
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#06b6d4', '#38bdf8', '#3b82f6', '#10b981'],
    });

    // Multi-phase high-tech entry animation sequence
    setEntryStage(1); // "Memverifikasi identitas laboratorium..."
    setTimeout(() => {
      setEntryStage(2); // "Menyiapkan modul 3D & AI Socratic Tutor..."
    }, 700);

    setTimeout(() => {
      setEntryStage(3); // "Otorisasi Berhasil! Memasuki Lab..."
    }, 1400);

    setTimeout(() => {
      onLogin({
        name: name.trim(),
        className,
        attendanceNo: attendanceNo.trim() || undefined,
      });
    }, 2100);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between relative overflow-hidden select-none font-sans">
      {/* Background Decorative Bio-Grid & Radial Glows */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(6,182,212,0.15),rgba(255,255,255,0))] pointer-events-none" />
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Grid Pattern overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(#38bdf8 1px, transparent 1px), linear-gradient(90deg, #38bdf8 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }}
      />

      {/* Header bar */}
      <header className="relative z-10 px-6 py-4 flex items-center justify-between border-b border-slate-800/80 bg-slate-950/60 backdrop-blur-sm">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
            <Heart className="w-5 h-5 animate-pulse text-rose-500" />
          </div>
          <div>
            <div className="text-base font-extrabold tracking-tight text-white flex items-center gap-1.5">
              <span className="text-cyan-400">BioLab</span>
              <span>AI 3D</span>
            </div>
            <span className="text-[10px] text-slate-400 block -mt-0.5">Laboratorium Biologi Virtual Berbasis AI</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono text-cyan-400 bg-cyan-950/80 px-2.5 py-1 rounded border border-cyan-800">
            Biologi SMA Kelas XI
          </span>
          <span className="hidden sm:inline-block text-[11px] text-slate-400 bg-slate-900 px-2.5 py-1 rounded border border-slate-800">
            Materi Sistem Peredaran Darah
          </span>
        </div>
      </header>

      {/* Main Login Card or Animated Entrance Sequence */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {isEntering ? (
            /* Futuristic Laboratory Portal Entrance Animation */
            <div className="bg-slate-900/90 border border-cyan-500/50 rounded-2xl p-8 shadow-[0_0_50px_rgba(6,182,212,0.25)] text-center animate-in zoom-in-95 duration-300 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-pulse" />

              {/* Pulsing Holographic Ring */}
              <div className="relative w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border-2 border-cyan-400/30 animate-ping opacity-60" />
                <div className="absolute inset-2 rounded-full border-2 border-t-cyan-400 border-r-rose-400 border-b-transparent border-l-transparent animate-spin" />
                <div className="w-16 h-16 rounded-full bg-cyan-500/20 border border-cyan-400/60 flex items-center justify-center text-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.5)]">
                  <Heart className="w-8 h-8 text-rose-500 animate-pulse" />
                </div>
              </div>

              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-cyan-400 bg-cyan-950/80 px-3 py-1 rounded-full border border-cyan-800 inline-block mb-3">
                OTORISASI AKSES LABORATORIUM
              </span>

              <h2 className="text-xl font-extrabold text-white mb-2">
                Selamat Datang, {name}!
              </h2>
              <p className="text-xs text-cyan-300 font-medium mb-6">
                Peserta Didik Kelas {className} {attendanceNo ? `· No. Absen ${attendanceNo}` : ''}
              </p>

              {/* Dynamic Status Progress Step */}
              <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3.5 mb-6 text-left">
                <div className="flex items-center gap-2.5 text-xs text-slate-200 mb-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>
                    {entryStage === 1 && 'Memverifikasi profil peserta didik & izin lab virtual...'}
                    {entryStage === 2 && 'Menginisialisasi modul anatomi 3D & Socratic AI Tutor...'}
                    {entryStage >= 3 && 'Koneksi terjalin! Memasuki ruang laboratorium 3D...'}
                  </span>
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 rounded-full transition-all duration-700 ease-out"
                    style={{
                      width: entryStage === 1 ? '35%' : entryStage === 2 ? '75%' : '100%'
                    }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-center gap-2 text-xs text-slate-400">
                <Activity className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                <span>Memuat instrumen ilmiah kardiovaskular...</span>
              </div>
            </div>
          ) : (
            /* Student Credentials Form Card */
            <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl">
              {/* Form Header */}
              <div className="text-center mb-6">
                <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mx-auto mb-3 shadow-[0_0_20px_rgba(6,182,212,0.15)]">
                  <GraduationCap className="w-7 h-7 text-cyan-400" />
                </div>
                <h1 className="text-xl font-extrabold text-white">
                  Presensi & Masuk Laboratorium
                </h1>
                <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
                  Silakan masukkan identitas diri untuk memulai eksplorasi 3D, investigasi data, dan kuis berpikir kritis.
                </p>
              </div>

              {/* Form Input */}
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                {/* Field 1: Nama Lengkap Siswa */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Nama Lengkap Siswa <span className="text-rose-400">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                        if (errorMsg) setErrorMsg('');
                      }}
                      placeholder="Contoh: Budi Santoso"
                      className="w-full bg-slate-950 border border-slate-700 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none transition-colors"
                    />
                  </div>
                </div>

                {/* Field 2: Pilihan Kelas (XI 1 & XI 2) */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Rombongan Belajar (Kelas) <span className="text-rose-400">*</span>
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setClassName('XI 1')}
                      className={`py-2.5 px-4 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                        className === 'XI 1'
                          ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.3)]'
                          : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white hover:border-slate-700'
                      }`}
                    >
                      <Atom className="w-4 h-4" />
                      <span>Kelas XI 1</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setClassName('XI 2')}
                      className={`py-2.5 px-4 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                        className === 'XI 2'
                          ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.3)]'
                          : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white hover:border-slate-700'
                      }`}
                    >
                      <Atom className="w-4 h-4" />
                      <span>Kelas XI 2</span>
                    </button>
                  </div>
                </div>

                {/* Field 3: Nomor Absen / Presensi (Opsional) */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-semibold text-slate-300">
                      Nomor Presensi / Absen
                    </label>
                    <span className="text-[11px] text-slate-500 font-mono">Opsional</span>
                  </div>
                  <input
                    type="number"
                    min="1"
                    max="45"
                    value={attendanceNo}
                    onChange={(e) => setAttendanceNo(e.target.value)}
                    placeholder="Contoh: 14"
                    className="w-full bg-slate-950 border border-slate-700 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none transition-colors"
                  />
                </div>

                {/* Error feedback */}
                {errorMsg && (
                  <div className="text-xs text-rose-400 bg-rose-950/50 border border-rose-800 rounded-lg p-2.5 text-center">
                    {errorMsg}
                  </div>
                )}

                {/* Submit Action Button */}
                <button
                  type="submit"
                  className="w-full mt-2 py-3 px-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-extrabold text-sm rounded-xl transition-all shadow-[0_0_20px_rgba(6,182,212,0.25)] hover:shadow-[0_0_25px_rgba(6,182,212,0.4)] flex items-center justify-center gap-2 active:scale-[0.99] cursor-pointer"
                >
                  <span>Masuk ke Laboratorium Virtual</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              {/* Privacy and Ethics notice */}
              <div className="mt-6 pt-4 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Privasi aman: Data sesi hanya disimpan lokal untuk keperluan rapor praktikum.</span>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer attribution */}
      <footer className="relative z-10 px-6 py-3 border-t border-slate-800/80 bg-slate-950/80 text-center text-xs text-slate-500 flex flex-wrap items-center justify-between gap-2">
        <span>BioLab AI 3D — Virtual Biology Laboratory SMA</span>
        <span>Pembelajaran Kurikulum Merdeka Fase F</span>
      </footer>
    </div>
  );
};
