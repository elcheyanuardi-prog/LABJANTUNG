import { AchievementBadge, UserPerformanceState } from '../types/biology';
import { QUIZ_QUESTIONS } from './biologyData';

export const BADGE_DEFINITIONS: Omit<AchievementBadge, 'progressPercent' | 'isUnlocked' | 'unlockedAt'>[] = [
  {
    id: 'heart-explorer',
    title: 'Heart Explorer',
    subtitle: 'Penjelajah Anatomi Kardiovaskular',
    description: 'Menginspeksi struktur 3D jantung manusia (ruang ventrikel, atrium, katup atrioventrikular, dan pembuluh utama) secara mendalam.',
    category: 'eksplorasi',
    rarity: 'Perak',
    icon: 'Compass',
    requirement: 'Inspeksi minimal 5 struktur jantung pada Heart Explorer 3D.',
    colorScheme: {
      bg: 'bg-cyan-950/40',
      border: 'border-cyan-500/60',
      text: 'text-cyan-400',
      glow: 'shadow-[0_0_15px_rgba(6,182,212,0.25)]',
    },
  },
  {
    id: 'hemodynamic-investigator',
    title: 'Hemodynamic Investigator',
    subtitle: 'Penyelidik Fisiologi Afterload',
    description: 'Membuktikan secara ilmiah hubungan ketebalan miokardium ventrikel kiri vs kanan dengan gradien tekanan afterload sirkulasi sistemik pada Misi 1.',
    category: 'investigasi',
    rarity: 'Emas',
    icon: 'Scale',
    requirement: 'Tuntaskan Misi 1 dan buktikan hipotesis resistensi vaskular sistemik (TPR).',
    colorScheme: {
      bg: 'bg-amber-950/40',
      border: 'border-amber-500/60',
      text: 'text-amber-400',
      glow: 'shadow-[0_0_15px_rgba(245,158,11,0.25)]',
    },
  },
  {
    id: 'master-diagnostician',
    title: 'Master Diagnostician',
    subtitle: 'Detektif Medis Kardiovaskular',
    description: 'Menganalisis tanda vital pasien dan suara murmur stetoskop untuk menegakkan diagnosis stenosis katup dan hipertensi kronis pada Misi 2.',
    category: 'patologi',
    rarity: 'Emas',
    icon: 'Stethoscope',
    requirement: 'Selesaikan minimal 2 kasus pasien pada Misi Investigasi 2 dengan verifikasi bukti yang tepat.',
    colorScheme: {
      bg: 'bg-rose-950/40',
      border: 'border-rose-500/60',
      text: 'text-rose-400',
      glow: 'shadow-[0_0_15px_rgba(244,63,94,0.25)]',
    },
  },
  {
    id: 'auscultation-virtuoso',
    title: 'Auscultation Virtuoso',
    subtitle: 'Pakar Akustik Jantung',
    description: 'Menguasai keterampilan auskultasi stetoskop virtual: membedakan bunyi Lub-Dub normal dengan bising murmur ejeksi dan murmur pansistolik.',
    category: 'patologi',
    rarity: 'Perak',
    icon: 'Volume2',
    requirement: 'Dengarkan dan selidiki auskultasi Pasien B (Stenosis) & Pasien C (Regurgitasi Mitral).',
    colorScheme: {
      bg: 'bg-indigo-950/40',
      border: 'border-indigo-500/60',
      text: 'text-indigo-400',
      glow: 'shadow-[0_0_15px_rgba(99,102,241,0.25)]',
    },
  },
  {
    id: 'critical-thinker-elite',
    title: 'Critical Thinker Elite',
    subtitle: 'Nalar Kritis Tingkat Tinggi',
    description: 'Meraih skor minimal 80% pada Kuis Berpikir Kritis 10 soal HOTS mencakup 5 dimensi nalar Facione (Interpretasi, Analisis, Evaluasi, Inferensi, Eksplanasi).',
    category: 'kuis',
    rarity: 'Platinum',
    icon: 'Brain',
    requirement: 'Jawab minimal 8 soal kuis HOTS dengan benar (Akurasi ≥ 80%).',
    colorScheme: {
      bg: 'bg-emerald-950/40',
      border: 'border-emerald-500/60',
      text: 'text-emerald-400',
      glow: 'shadow-[0_0_15px_rgba(16,185,129,0.25)]',
    },
  },
  {
    id: 'grandmaster-cardiologist',
    title: 'Cardiovascular Grandmaster',
    subtitle: 'Legenda Laboratorium BioLab AI 3D',
    description: 'Pencapaian paripurna bagi siswa yang menuntaskan seluruh rangkaian stasiun eksplorasi 3D, simulasi sirkulasi, kedua misi investigasi, dan kuis berpikir kritis.',
    category: 'master',
    rarity: 'Platinum',
    icon: 'Award',
    requirement: 'Selesaikan Misi 1, seluruh 4 kasus Misi 2, serta raih minimal 70% pada kuis HOTS.',
    colorScheme: {
      bg: 'bg-purple-950/40',
      border: 'border-purple-500/60',
      text: 'text-purple-400',
      glow: 'shadow-[0_0_20px_rgba(168,85,247,0.35)]',
    },
  },
];

export function computeAchievementBadges(performance: UserPerformanceState): AchievementBadge[] {
  // 1. Count quiz score
  let quizCorrect = 0;
  QUIZ_QUESTIONS.forEach((q) => {
    if (performance.quizAnswers[q.id] === q.correctIndex) {
      quizCorrect++;
    }
  });

  const inspectedCount = performance.inspectedHotspots?.length || 5; // default baseline exploration
  const mission2CompletedCount = performance.mission2CompletedCases?.length || 0;

  return BADGE_DEFINITIONS.map((def) => {
    let progressPercent = 0;
    let isUnlocked = false;

    switch (def.id) {
      case 'heart-explorer': {
        const target = 5;
        progressPercent = Math.min(Math.round((inspectedCount / target) * 100), 100);
        isUnlocked = inspectedCount >= target;
        break;
      }
      case 'hemodynamic-investigator': {
        progressPercent = performance.mission1Completed ? 100 : 0;
        isUnlocked = performance.mission1Completed;
        break;
      }
      case 'master-diagnostician': {
        const targetCases = 2;
        progressPercent = Math.min(Math.round((mission2CompletedCount / targetCases) * 100), 100);
        isUnlocked = mission2CompletedCount >= targetCases;
        break;
      }
      case 'auscultation-virtuoso': {
        const hasB = performance.mission2CompletedCases?.includes('case-2');
        const hasC = performance.mission2CompletedCases?.includes('case-3');
        const count = (hasB ? 1 : 0) + (hasC ? 1 : 0);
        progressPercent = Math.round((count / 2) * 100);
        isUnlocked = count >= 2;
        break;
      }
      case 'critical-thinker-elite': {
        const targetScore = 8;
        progressPercent = Math.min(Math.round((quizCorrect / targetScore) * 100), 100);
        isUnlocked = quizCorrect >= targetScore;
        break;
      }
      case 'grandmaster-cardiologist': {
        let criteriaMet = 0;
        if (performance.mission1Completed) criteriaMet++;
        if (mission2CompletedCount >= 4) criteriaMet++;
        if (quizCorrect >= 7) criteriaMet++;
        progressPercent = Math.round((criteriaMet / 3) * 100);
        isUnlocked = criteriaMet === 3;
        break;
      }
      default:
        progressPercent = 0;
        isUnlocked = false;
    }

    // Check if manually unlocked
    if (performance.unlockedBadgeIds?.includes(def.id)) {
      isUnlocked = true;
      progressPercent = 100;
    }

    return {
      ...def,
      progressPercent,
      isUnlocked,
      unlockedAt: isUnlocked ? 'Terbuka Hari Ini' : undefined,
    };
  });
}
