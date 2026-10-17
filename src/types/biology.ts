export interface HeartHotspot {
  id: string;
  nameId: string;
  nameLatin: string;
  category: 'ruang' | 'katup' | 'pembuluh';
  position: [number, number, number];
  color: string;
  oxygenated: boolean;
  pressureRange: string;
  structureDescription: string;
  functionDescription: string;
  anatomicalPhysiologicalRelation: string;
  clinicalNote: string;
}

export interface CirculationStep {
  step: number;
  circuit: 'pulmonal' | 'sistemik';
  title: string;
  from: string;
  through: string;
  to: string;
  gasStatus: string;
  o2Saturation: number; // percentage
  co2Pressure: number; // mmHg
  pressureAvg: number; // mmHg
  description: string;
}

export interface PatientCase {
  id: string;
  code: string;
  name: string;
  age: number;
  gender: string;
  chiefComplaint: string;
  vitals: {
    bloodPressure: string; // e.g., "168/104 mmHg"
    systolic: number;
    diastolic: number;
    heartRate: number; // bpm
    cardiacOutput: number; // L/min (normal ~ 5.0)
    ejectionFraction: number; // % (normal 55-70%)
    respiratoryRate: number; // x/menit
    oxygenSaturation: number; // %
  };
  auscultation: {
    sound: 'Normal (Lub-Dub)' | 'Murmur Sistolik Ejeksi' | 'Murmur Pansistolik' | 'Gallop S3/S4';
    description: string;
  };
  keySymptoms: string[];
  anatomicalImpact: string;
  scientificHypothesisPrompt: string;
  correctCondition: string;
  evidencePoints: string[];
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  thinkingDimension: 'Interpretasi' | 'Analisis' | 'Evaluasi' | 'Inferensi' | 'Eksplanasi';
}

export interface RubricLevel {
  score: number;
  descriptor: string;
}

export interface RubricDimension {
  dimension: string;
  definition: string;
  levels: RubricLevel[];
}

export interface AchievementBadge {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  category: 'eksplorasi' | 'investigasi' | 'patologi' | 'kuis' | 'master';
  rarity: 'Perunggu' | 'Perak' | 'Emas' | 'Platinum';
  icon: string;
  requirement: string;
  unlockedAt?: string;
  progressPercent: number;
  isUnlocked: boolean;
  colorScheme: {
    bg: string;
    border: string;
    text: string;
    glow: string;
  };
}

export interface UserPerformanceState {
  quizAnswers: { [qId: number]: number };
  mission1Completed: boolean;
  mission1Accuracy: number;
  mission2CompletedCases: string[];
  mission2Accuracy: { [caseId: string]: number };
  investigationTimeMinutes: number;
  inspectedHotspots?: string[];
  unlockedBadgeIds?: string[];
}

