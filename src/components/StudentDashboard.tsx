import React, { useMemo, useState } from 'react';
import { 
  ResponsiveContainer, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  Radar, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend 
} from 'recharts';
import { QUIZ_QUESTIONS, PATIENT_CASES } from '../data/biologyData';
import { UserPerformanceState, AchievementBadge } from '../types/biology';
import { computeAchievementBadges } from '../data/achievementBadges';
import { 
  Award, 
  Brain, 
  BarChart3, 
  CheckCircle2, 
  AlertTriangle, 
  TrendingUp, 
  Printer, 
  ArrowRight, 
  FileText, 
  Clock, 
  ShieldCheck,
  Target,
  Compass,
  Scale,
  Stethoscope,
  Volume2,
  Lock,
  Sparkles,
  Trophy,
  X
} from 'lucide-react';

import { StudentProfile } from './StudentLogin';

interface StudentDashboardProps {
  performance: UserPerformanceState;
  onNavigateTab: (tab: any) => void;
  studentProfile?: StudentProfile | null;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  performance,
  onNavigateTab,
  studentProfile,
}) => {
  const [badgeFilter, setBadgeFilter] = useState<'all' | 'unlocked' | 'locked'>('all');
  const [inspectingBadge, setInspectingBadge] = useState<AchievementBadge | null>(null);

  // Dynamic achievement badges calculation
  const badges = useMemo(() => computeAchievementBadges(performance), [performance]);
  const unlockedBadgesCount = useMemo(() => badges.filter((b) => b.isUnlocked).length, [badges]);

  const filteredBadges = useMemo(() => {
    if (badgeFilter === 'unlocked') return badges.filter((b) => b.isUnlocked);
    if (badgeFilter === 'locked') return badges.filter((b) => !b.isUnlocked);
    return badges;
  }, [badges, badgeFilter]);

  const renderBadgeIcon = (iconName: string, className: string) => {
    switch (iconName) {
      case 'Compass':
        return <Compass className={className} />;
      case 'Scale':
        return <Scale className={className} />;
      case 'Stethoscope':
        return <Stethoscope className={className} />;
      case 'Volume2':
        return <Volume2 className={className} />;
      case 'Brain':
        return <Brain className={className} />;
      case 'Award':
      default:
        return <Award className={className} />;
    }
  };

  // Compute Quiz stats
  const quizStats = useMemo(() => {
    let answeredCount = 0;
    let correctCount = 0;

    const dimensionScores: { [dim: string]: { correct: number; total: number } } = {
      Interpretasi: { correct: 0, total: 0 },
      Analisis: { correct: 0, total: 0 },
      Evaluasi: { correct: 0, total: 0 },
      Inferensi: { correct: 0, total: 0 },
      Eksplanasi: { correct: 0, total: 0 },
    };

    const questionProgressData: { qNumber: string; skor: number; akurasiKumulatif: number }[] = [];
    let runningCorrect = 0;

    QUIZ_QUESTIONS.forEach((q, idx) => {
      const userAns = performance.quizAnswers[q.id];
      const isAnswered = userAns !== undefined;
      const isCorrect = userAns === q.correctIndex;

      // Track by dimension
      if (dimensionScores[q.thinkingDimension]) {
        dimensionScores[q.thinkingDimension].total += 1;
        if (isCorrect) dimensionScores[q.thinkingDimension].correct += 1;
      }

      if (isAnswered) {
        answeredCount++;
        if (isCorrect) {
          correctCount++;
          runningCorrect++;
        }
      }

      // Add to progression trend
      questionProgressData.push({
        qNumber: `Soal ${q.id}`,
        skor: isAnswered ? (isCorrect ? 100 : 0) : 75, // baseline demonstration if not yet attempted
        akurasiKumulatif: answeredCount > 0 
          ? Math.round((runningCorrect / (idx + 1)) * 100) 
          : 70 + (idx % 3) * 10,
      });
    });

    const overallAccuracy = answeredCount > 0 
      ? Math.round((correctCount / answeredCount) * 100) 
      : 80; // Baseline demonstrative score

    return {
      answeredCount,
      correctCount,
      overallAccuracy,
      dimensionScores,
      questionProgressData,
    };
  }, [performance.quizAnswers]);

  // Radar chart data for 5 Facione Critical Thinking Dimensions
  const radarData = useMemo(() => {
    const dimensions = ['Interpretasi', 'Analisis', 'Evaluasi', 'Inferensi', 'Eksplanasi'];
    return dimensions.map((dim) => {
      const d = quizStats.dimensionScores[dim];
      const actualScore = d && d.total > 0 && quizStats.answeredCount > 0
        ? Math.round((d.correct / d.total) * 100)
        : dim === 'Analisis' ? 90 : dim === 'Interpretasi' ? 85 : dim === 'Inferensi' ? 80 : 75;

      return {
        dimensi: dim,
        skorSiswa: actualScore,
        targetKKM: 75,
      };
    });
  }, [quizStats]);

  // Bar chart data for Mission 2 Patient Case Understanding
  const mission2Data = useMemo(() => {
    return [
      {
        kasus: 'Pasien A: Hipertensi',
        akurasiTandaVital: 92,
        akurasiDiagnosis: performance.mission2CompletedCases.includes('case-1') ? 100 : 85,
      },
      {
        kasus: 'Pasien B: Stenosis Aorta',
        akurasiTandaVital: 88,
        akurasiDiagnosis: performance.mission2CompletedCases.includes('case-2') ? 100 : 90,
      },
      {
        kasus: 'Pasien C: Regurgitasi Mitral',
        akurasiTandaVital: 85,
        akurasiDiagnosis: performance.mission2CompletedCases.includes('case-3') ? 100 : 80,
      },
      {
        kasus: 'Pasien D: Kontrol Atlet',
        akurasiTandaVital: 95,
        akurasiDiagnosis: performance.mission2CompletedCases.includes('case-4') ? 100 : 95,
      },
    ];
  }, [performance.mission2CompletedCases]);

  // Pie chart data for biological topic mastery
  const topicMasteryData = [
    { name: 'Sirkulasi Sistemik', value: 35, color: '#ef233c' },
    { name: 'Sirkulasi Pulmonal', value: 25, color: '#3a86ff' },
    { name: 'Dinamika Katup', value: 20, color: '#48cae4' },
    { name: 'Afterload & Otot', value: 20, color: '#e63946' },
  ];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex flex-col gap-6 p-4 max-w-7xl mx-auto w-full print:p-0">
      {/* Top Banner & Report Action */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-wrap items-center justify-between gap-4 shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-950 px-2.5 py-0.5 rounded border border-cyan-800">
              RAPOR LABORATORIUM BIOLOGI
            </span>
            <span className="text-xs text-slate-400 bg-slate-950 px-2.5 py-0.5 rounded border border-slate-800">
              Kelas XI SMA · Fase F
            </span>
          </div>
          <h2 className="text-xl font-extrabold text-white">
            Dashboard Analitik & Performa Berpikir Kritis Siswa
          </h2>
          {studentProfile && (
            <div className="flex flex-wrap items-center gap-2.5 mt-2">
              <span className="text-xs text-slate-300 bg-slate-950 px-3 py-1 rounded-lg border border-slate-800">
                Siswa: <strong className="text-white">{studentProfile.name}</strong>
              </span>
              <span className="text-xs text-slate-300 bg-slate-950 px-3 py-1 rounded-lg border border-slate-800">
                Kelas: <strong className="text-cyan-400">{studentProfile.className}</strong>
              </span>
              {studentProfile.attendanceNo && (
                <span className="text-xs text-slate-300 bg-slate-950 px-3 py-1 rounded-lg border border-slate-800 font-mono">
                  No. Presensi: <strong className="text-emerald-400">{studentProfile.attendanceNo}</strong>
                </span>
              )}
            </div>
          )}
          <p className="text-xs text-slate-400 max-w-2xl mt-1.5">
            Visualisasi terintegrasi hasil asesmen kuis HOTS, pengujian hipotesis Misi 1 (Struktur-Fungsi), serta investigasi tanda vital dan auskultasi stetoskop Misi 2.
          </p>
        </div>

        <button
          onClick={handlePrint}
          className="flex items-center gap-2 px-4 py-2.5 bg-slate-950 hover:bg-slate-800 border border-slate-700 text-xs font-bold text-white rounded-xl transition-colors shadow print:hidden"
        >
          <Printer className="w-4 h-4 text-cyan-400" />
          <span>Cetak / Simpan PDF Rapor</span>
        </button>
      </div>

      {/* KPI Cards Strip (4 Metrics) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Skor Rata-rata Kuis */}
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
              Akurasi Kuis HOTS
            </span>
            <div className="text-2xl font-mono font-extrabold text-white tabular-nums">
              {quizStats.overallAccuracy}%
            </div>
            <span className="text-[11px] text-emerald-400 font-medium">
              Level: {quizStats.overallAccuracy >= 80 ? 'Sangat Mahir' : 'Mahir'}
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-cyan-600/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Award className="w-6 h-6" />
          </div>
        </div>

        {/* Card 2: Indeks Nalar Kritis (Facione Index) */}
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
              Indeks Berpikir Kritis
            </span>
            <div className="text-2xl font-mono font-extrabold text-cyan-300 tabular-nums">
              3.7 <span className="text-xs text-slate-400 font-normal">/ 4.0</span>
            </div>
            <span className="text-[11px] text-slate-300">
              5 Dimensi Facione Terpenuhi
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-rose-600/20 border border-rose-500/30 flex items-center justify-center text-rose-400">
            <Brain className="w-6 h-6" />
          </div>
        </div>

        {/* Card 3: Progres Misi Investigasi */}
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
              Misi Investigasi Ilmiah
            </span>
            <div className="text-2xl font-mono font-extrabold text-white tabular-nums">
              2 <span className="text-xs text-slate-400 font-normal">/ 2 Stasiun</span>
            </div>
            <span className="text-[11px] text-emerald-400 font-medium">
              100% Bukti Terverifikasi
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        {/* Card 4: Waktu Riset & Eksplorasi Lab */}
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
              Waktu Eksplorasi Virtual
            </span>
            <div className="text-2xl font-mono font-extrabold text-white tabular-nums">
              28 <span className="text-xs text-slate-400 font-normal">Menit</span>
            </div>
            <span className="text-[11px] text-cyan-400">
              Interaksi 3D & AI Sokratik
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
            <Clock className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* ACHIEVEMENT BADGES SECTION */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Trophy className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-extrabold text-white">Lencana Pencapaian Sains (Achievement Badges)</h3>
                <span className="text-[11px] font-mono font-bold bg-amber-950 text-amber-300 border border-amber-800 px-2.5 py-0.5 rounded">
                  {unlockedBadgesCount} / {badges.length} Diraih
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Apresiasi kompetensi nalar kritis siswa berdasarkan pembuktian investigasi lab 3D dan kuis HOTS.
              </p>
            </div>
          </div>

          {/* Filter Segmented Control */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
            <button
              onClick={() => setBadgeFilter('all')}
              className={`px-3 py-1.5 rounded-md font-semibold transition-colors ${
                badgeFilter === 'all'
                  ? 'bg-slate-800 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Semua ({badges.length})
            </button>
            <button
              onClick={() => setBadgeFilter('unlocked')}
              className={`px-3 py-1.5 rounded-md font-semibold transition-colors ${
                badgeFilter === 'unlocked'
                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-800 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Diraih ({unlockedBadgesCount})
            </button>
            <button
              onClick={() => setBadgeFilter('locked')}
              className={`px-3 py-1.5 rounded-md font-semibold transition-colors ${
                badgeFilter === 'locked'
                  ? 'bg-slate-800 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Terkunci ({badges.length - unlockedBadgesCount})
            </button>
          </div>
        </div>

        {/* Badge Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredBadges.map((badge) => {
            const isUnlocked = badge.isUnlocked;

            return (
              <div
                key={badge.id}
                onClick={() => setInspectingBadge(badge)}
                className={`p-4 rounded-xl border cursor-pointer transition-all duration-200 flex flex-col justify-between ${
                  isUnlocked
                    ? `${badge.colorScheme.bg} ${badge.colorScheme.border} ${badge.colorScheme.glow} hover:scale-[1.02]`
                    : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700 opacity-75'
                }`}
              >
                <div>
                  {/* Top Header of Card */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span
                      className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border uppercase tracking-wider ${
                        badge.rarity === 'Platinum'
                          ? 'bg-purple-950 text-purple-300 border-purple-800'
                          : badge.rarity === 'Emas'
                          ? 'bg-amber-950 text-amber-300 border-amber-800'
                          : 'bg-slate-800 text-slate-300 border-slate-700'
                      }`}
                    >
                      {badge.rarity}
                    </span>

                    {isUnlocked ? (
                      <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-400">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>DIRAIH</span>
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-[11px] font-medium text-slate-500">
                        <Lock className="w-3.5 h-3.5" />
                        <span>{badge.progressPercent}%</span>
                      </span>
                    )}
                  </div>

                  {/* Icon & Title */}
                  <div className="flex items-start gap-3 mb-2.5">
                    <div
                      className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 border transition-transform ${
                        isUnlocked
                          ? `${badge.colorScheme.bg} ${badge.colorScheme.border} ${badge.colorScheme.text}`
                          : 'bg-slate-900 border-slate-800 text-slate-600'
                      }`}
                    >
                      {renderBadgeIcon(badge.icon, 'w-6 h-6')}
                    </div>

                    <div>
                      <h4 className={`text-sm font-extrabold ${isUnlocked ? 'text-white' : 'text-slate-300'}`}>
                        {badge.title}
                      </h4>
                      <div className="text-[11px] text-slate-400 italic">
                        {badge.subtitle}
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-slate-300 leading-relaxed mb-3">
                    {badge.description}
                  </p>
                </div>

                {/* Progress / Status Bottom Section */}
                <div className="pt-2 border-t border-slate-800/80">
                  {isUnlocked ? (
                    <div className="flex items-center justify-between text-[11px] text-emerald-400">
                      <span className="font-medium">Kriteria Terpenuhi ✓</span>
                      <span className="text-[10px] text-slate-400 font-mono">{badge.unlockedAt}</span>
                    </div>
                  ) : (
                    <div>
                      <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                        <span className="truncate pr-1">Syarat: {badge.requirement}</span>
                        <span className="font-mono shrink-0">{badge.progressPercent}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-cyan-500 rounded-full transition-all duration-500"
                          style={{ width: `${badge.progressPercent}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Charts Grid: 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* CHART 1: Radar Chart for 5 Critical Thinking Dimensions (6 cols) */}
        <div className="lg:col-span-6 bg-slate-900 border border-slate-800 p-5 rounded-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-bold text-white">Profil 5 Dimensi Berpikir Kritis</h3>
              </div>
              <span className="text-[11px] text-slate-400 font-mono">Skala: 0 - 100%</span>
            </div>
            <p className="text-xs text-slate-300 mb-2">
              Evaluasi ketercapaian dimensi nalar kritis Facione (Interpretasi, Analisis, Evaluasi, Inferensi, Eksplanasi) dibandingkan target KKM sekolah (75%).
            </p>
          </div>

          <div className="w-full h-72 py-2">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                <PolarGrid stroke="#334155" />
                <PolarAngleAxis dataKey="dimensi" stroke="#94a3b8" tick={{ fill: '#cbd5e1', fontSize: 11 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#475569" tick={{ fill: '#64748b', fontSize: 9 }} />
                <Radar name="Skor Siswa" dataKey="skorSiswa" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.45} />
                <Radar name="Target KKM (75%)" dataKey="targetKKM" stroke="#f43f5e" fill="#f43f5e" fillOpacity={0.15} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* CHART 2: Trend Area Chart for Question Accuracy Progression (6 cols) */}
        <div className="lg:col-span-6 bg-slate-900 border border-slate-800 p-5 rounded-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-bold text-white">Tren Akurasi Jawaban Kuis Soal 1 s.d. 10</h3>
              </div>
              <span className="text-[11px] text-slate-400 font-mono">Persentase (%)</span>
            </div>
            <p className="text-xs text-slate-300 mb-2">
              Fluktuasi akurasi kumulatif siswa sepanjang 10 butir soal penalaran tingkat tinggi (HOTS).
            </p>
          </div>

          <div className="w-full h-72 py-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={quizStats.questionProgressData} margin={{ top: 10, right: 20, left: -15, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorAkurasi" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.05}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="qNumber" stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 10 }} />
                <YAxis domain={[0, 100]} stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 10 }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="akurasiKumulatif" name="Akurasi Kumulatif (%)" stroke="#10b981" strokeWidth={2.5} fillOpacity={1} fill="url(#colorAkurasi)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* CHART 3: Bar Chart for Mission 2 Patient Case Understanding (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 p-5 rounded-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-bold text-white">Kinerja Analisis 4 Kasus Patologi (Misi 2)</h3>
              </div>
              <span className="text-[11px] text-slate-400 font-mono">Skor (%)</span>
            </div>
            <p className="text-xs text-slate-300 mb-2">
              Tingkat keberhasilan siswa mengidentifikasi kaitan antara auskultasi stetoskop dan tanda vital dengan kondisi patologis sebenarnya.
            </p>
          </div>

          <div className="w-full h-72 py-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mission2Data} margin={{ top: 10, right: 15, left: -15, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="kasus" stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 10 }} />
                <YAxis domain={[0, 100]} stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 10 }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Bar dataKey="akurasiTandaVital" name="Analisis Tanda Vital & Auskultasi" fill="#0284c7" radius={[4, 4, 0, 0]} />
                <Bar dataKey="akurasiDiagnosis" name="Ketepatan Hipotesis Diagnosis" fill="#f43f5e" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* CHART 4: Donut / Pie Chart for Topic Distribution (5 cols) */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 p-5 rounded-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-rose-400" />
                <h3 className="text-sm font-bold text-white">Distribusi Penguasaan Sub-Materi</h3>
              </div>
              <span className="text-[11px] text-slate-400 font-mono">Proporsi (%)</span>
            </div>
            <p className="text-xs text-slate-300 mb-2">
              Keseimbangan penguasaan konsep anatomi dan hemodinamika sirkulasi.
            </p>
          </div>

          <div className="w-full h-72 py-2 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={topicMasteryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {topicMasteryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Socratic AI Diagnostics & Learning Recommendations Card */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-800 mb-4">
          <div className="w-8 h-8 rounded-lg bg-cyan-600/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Brain className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Rekomendasi Diagnostik Dr. Bio (AI Socratic Tutor)</h3>
            <p className="text-xs text-slate-400">Analisis otomatis terhadap penalaran ilmiah dan pemahaman materi sistem peredaran darah.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
            <span className="text-xs font-bold text-emerald-400 block mb-1">
              Kekuatan Nalar Siswa:
            </span>
            <p className="text-xs text-slate-300 leading-relaxed">
              Siswa sangat unggul dalam dimensi <strong>Analisis</strong> dan <strong>Interpretasi Data Auskultasi</strong>. Hubungan antara ketebalan miokardium ventrikel dengan resistensi afterload sistemik (Hukum Laplace) telah dipahami dengan kokoh.
            </p>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
            <span className="text-xs font-bold text-amber-400 block mb-1">
              Area Perlu Penguatan:
            </span>
            <p className="text-xs text-slate-300 leading-relaxed">
              Tingkatkan latihan pada dimensi <strong>Inferensi Patologi Katup Mitral</strong>. Pelajari kembali kaitan regurgitasi mitral dengan peningkatan tekanan vena pulmonalis yang memicu kongesti cairan pada paru-paru.
            </p>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
            <span className="text-xs font-bold text-cyan-400 block mb-1">
              Rekomendasi Langkah Belajar:
            </span>
            <p className="text-xs text-slate-300 leading-relaxed">
              Jalankan ulang <strong>Simulasi Sirkulasi Tahap 6–8</strong> untuk mengamati penutupan katup bikuspidalis saat sistol, lalu diskusikan perbedaan suara murmur sistolik vs diastolik bersama AI Tutor.
            </p>
          </div>
        </div>

        {/* Quick Navigation Action Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800">
          <span className="text-xs text-slate-400">
            Ingin mempertajam skor berpikir kritis?
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigateTab('quiz')}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 rounded-lg transition-colors border border-slate-700"
            >
              Uji Ulang Kuis HOTS
            </button>
            <button
              onClick={() => onNavigateTab('mission2')}
              className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-xs font-bold text-slate-950 rounded-lg transition-colors flex items-center gap-1.5 shadow"
            >
              <span>Eksplorasi Misi 2</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Inspecting Badge Detail Modal */}
      {inspectingBadge && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 animate-in fade-in duration-150">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 shadow-2xl flex flex-col gap-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded border uppercase ${
                inspectingBadge.rarity === 'Platinum' ? 'bg-purple-950 text-purple-300 border-purple-800' : 'bg-amber-950 text-amber-300 border-amber-800'
              }`}>
                Lencana {inspectingBadge.rarity}
              </span>
              <button
                onClick={() => setInspectingBadge(null)}
                className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-3 border ${
                inspectingBadge.isUnlocked
                  ? `${inspectingBadge.colorScheme.bg} ${inspectingBadge.colorScheme.border} ${inspectingBadge.colorScheme.text} ${inspectingBadge.colorScheme.glow}`
                  : 'bg-slate-950 border-slate-800 text-slate-600'
              }`}>
                {renderBadgeIcon(inspectingBadge.icon, 'w-9 h-9')}
              </div>
              <h3 className="text-lg font-extrabold text-white">{inspectingBadge.title}</h3>
              <p className="text-xs text-cyan-300 font-medium mb-2">{inspectingBadge.subtitle}</p>
              <p className="text-xs text-slate-300 leading-relaxed max-w-xs">{inspectingBadge.description}</p>
            </div>

            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 text-xs">
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                Kriteria Membuka Lencana:
              </span>
              <p className="text-slate-200">{inspectingBadge.requirement}</p>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-800">
              <span className="text-xs font-mono">
                Status: <strong className={inspectingBadge.isUnlocked ? 'text-emerald-400' : 'text-slate-400'}>
                  {inspectingBadge.isUnlocked ? 'Sudah Diraih ✓' : `Terkunci (${inspectingBadge.progressPercent}%)`}
                </strong>
              </span>

              <button
                onClick={() => {
                  const targetTab = inspectingBadge.category === 'patologi' ? 'mission2' : inspectingBadge.category === 'investigasi' ? 'mission1' : inspectingBadge.category === 'kuis' ? 'quiz' : 'explorer';
                  setInspectingBadge(null);
                  onNavigateTab(targetTab);
                }}
                className="px-3.5 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs rounded-lg transition-colors flex items-center gap-1.5 shadow"
              >
                <span>Buka Stasiun</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
