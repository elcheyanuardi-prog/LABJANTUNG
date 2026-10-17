import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { Navigation, NavTab } from './components/Navigation';
import { HeartViewer3D } from './components/HeartViewer3D';
import { HeartInfoPanel } from './components/HeartInfoPanel';
import { CirculationSimulator } from './components/CirculationSimulator';
import { InvestigationMissionOne } from './components/InvestigationMissionOne';
import { InvestigationMissionTwo } from './components/InvestigationMissionTwo';
import { VideoLearningStation } from './components/VideoLearningStation';
import { SocraticAITutor } from './components/SocraticAITutor';
import { QuizAndRubrics } from './components/QuizAndRubrics';
import { StudentDashboard } from './components/StudentDashboard';
import { ReferencesModal } from './components/ReferencesModal';
import { StudentLogin, StudentProfile } from './components/StudentLogin';
import { HeartHotspot, CirculationStep, UserPerformanceState, AchievementBadge } from './types/biology';
import { computeAchievementBadges } from './data/achievementBadges';
import { 
  Heart, 
  Activity, 
  FlaskConical, 
  Stethoscope, 
  Bot, 
  Brain, 
  BarChart3,
  ArrowRight, 
  CheckCircle2, 
  Sparkles,
  BookOpen,
  Trophy,
  Award,
  Video,
  X
} from 'lucide-react';

export default function App() {
  // Student Profile Authentication Gate
  const [studentProfile, setStudentProfile] = useState<StudentProfile | null>(() => {
    try {
      const saved = localStorage.getItem('biolab_student_profile');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const handleLogin = (profile: StudentProfile) => {
    setStudentProfile(profile);
    try {
      localStorage.setItem('biolab_student_profile', JSON.stringify(profile));
    } catch {
      // Storage fallback
    }
  };

  const handleLogout = () => {
    setStudentProfile(null);
    try {
      localStorage.removeItem('biolab_student_profile');
    } catch {
      // Storage fallback
    }
  };

  const [activeTab, setActiveTab] = useState<NavTab>('explorer');
  const [selectedHotspot, setSelectedHotspot] = useState<HeartHotspot | null>(null);
  const [bpm, setBpm] = useState<number>(75);
  const [isReferencesOpen, setIsReferencesOpen] = useState<boolean>(false);

  // Shared Student Performance State for Analytics Dashboard
  const [userPerformance, setUserPerformance] = useState<UserPerformanceState>({
    quizAnswers: { 1: 1, 2: 1, 3: 1, 4: 1, 5: 1 }, // pre-populated with initial high quality answers for demonstration
    mission1Completed: true,
    mission1Accuracy: 95,
    mission2CompletedCases: ['case-1', 'case-2'],
    mission2Accuracy: { 'case-1': 100, 'case-2': 100, 'case-3': 85, 'case-4': 95 },
    investigationTimeMinutes: 28,
    inspectedHotspots: ['atrium-kanan', 'ventrikel-kiri', 'aorta', 'katup-mitral'],
  });

  // Achievement Badge Unlock Notification State
  const [unlockedToastBadge, setUnlockedToastBadge] = useState<AchievementBadge | null>(null);
  const prevUnlockedIdsRef = useRef<Set<string>>(new Set());
  const initialLoadRef = useRef<boolean>(true);

  // Monitor badge progression & celebrate newly earned badges
  useEffect(() => {
    const currentBadges = computeAchievementBadges(userPerformance);
    const currentlyUnlocked = currentBadges.filter((b) => b.isUnlocked);
    const currentUnlockedIds = new Set(currentlyUnlocked.map((b) => b.id));

    if (initialLoadRef.current) {
      // First render: record currently unlocked badges without spamming popup
      prevUnlockedIdsRef.current = currentUnlockedIds;
      initialLoadRef.current = false;
      return;
    }

    // Find if a new badge was just unlocked
    for (const b of currentlyUnlocked) {
      if (!prevUnlockedIdsRef.current.has(b.id)) {
        // Newly earned badge!
        setUnlockedToastBadge(b);
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.25 },
          colors: ['#06b6d4', '#f59e0b', '#10b981', '#a855f7'],
        });
        break;
      }
    }

    prevUnlockedIdsRef.current = currentUnlockedIds;
  }, [userPerformance]);

  const handleAnswerQuestion = (qId: number, answerIdx: number) => {
    setUserPerformance((prev) => ({
      ...prev,
      quizAnswers: { ...prev.quizAnswers, [qId]: answerIdx },
    }));
  };

  const handleResetQuiz = () => {
    setUserPerformance((prev) => ({
      ...prev,
      quizAnswers: {},
    }));
  };

  const handleHotspotInspected = (hotspotId: string) => {
    setUserPerformance((prev) => {
      const existing = prev.inspectedHotspots || [];
      if (existing.includes(hotspotId)) return prev;
      return {
        ...prev,
        inspectedHotspots: [...existing, hotspotId],
      };
    });
  };

  const handleMission1Complete = (accuracy: number) => {
    setUserPerformance((prev) => ({
      ...prev,
      mission1Completed: true,
      mission1Accuracy: Math.max(prev.mission1Accuracy || 0, accuracy),
    }));
  };

  const handleMission2CaseComplete = (caseId: string, accuracy: number) => {
    setUserPerformance((prev) => {
      const cases = prev.mission2CompletedCases.includes(caseId)
        ? prev.mission2CompletedCases
        : [...prev.mission2CompletedCases, caseId];
      return {
        ...prev,
        mission2CompletedCases: cases,
        mission2Accuracy: {
          ...prev.mission2Accuracy,
          [caseId]: accuracy,
        },
      };
    });
  };

  // States passed to AI Tutor when user clicks "Bahas dengan AI Tutor"
  const [tutorContext, setTutorContext] = useState<string>('Eksplorasi Jantung dan Sirkulasi Darah');
  const [tutorInitialPrompt, setTutorInitialPrompt] = useState<string>('');
  const [tutorMissionData, setTutorMissionData] = useState<any>(null);

  // Switch to tutor from Hotspot
  const handleAskTutorAboutHotspot = (hotspot: HeartHotspot) => {
    setTutorContext(`Eksplorasi Struktur: ${hotspot.nameId} (${hotspot.nameLatin})`);
    setTutorInitialPrompt(
      `Saya sedang mengamati ${hotspot.nameId} pada model 3D. Bagaimana hubungan antara strukturnya dengan fungsinya dalam sistem peredaran darah?`
    );
    setTutorMissionData({ hotspot });
    setActiveTab('tutor');
  };

  // Switch to tutor from Circulation Step
  const handleAskTutorAboutCirculation = (step: CirculationStep) => {
    setTutorContext(`Sirkulasi Darah: Tahap ${step.step} (${step.title})`);
    setTutorInitialPrompt(
      `Pada tahap ${step.step} (${step.title}), darah mengalir dari ${step.from} ke ${step.to} melalui ${step.through}. Mengapa saturasi O2 dan tekanannya tercatat demikian?`
    );
    setTutorMissionData({ step });
    setActiveTab('tutor');
  };

  // Switch to tutor from Mission 1 or Mission 2
  const handleSendToAITutor = (context: string, studentHypothesis: string, dataSummary: any) => {
    setTutorContext(context);
    setTutorInitialPrompt(studentHypothesis);
    setTutorMissionData(dataSummary);
    setActiveTab('tutor');
  };

  // If student has not logged in, render the login entrance gate
  if (!studentProfile) {
    return <StudentLogin onLogin={handleLogin} />;
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-cyan-500 selection:text-slate-950">
      {/* 3-Zone Clean Top Navigation */}
      <Navigation
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onOpenReferences={() => setIsReferencesOpen(true)}
        studentProfile={studentProfile}
        onLogout={handleLogout}
      />

      {/* Real-time Badge Unlock Notification Toast */}
      {unlockedToastBadge && (
        <div className="fixed top-20 right-4 sm:right-6 z-50 max-w-md w-[calc(100%-2rem)] bg-slate-900 border-2 border-amber-500/80 rounded-2xl p-4 shadow-[0_0_30px_rgba(245,158,11,0.35)] animate-in slide-in-from-top-4 duration-300">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/50 flex items-center justify-center text-amber-400 shrink-0">
                <Trophy className="w-6 h-6 animate-bounce" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800">
                    Lencana Baru Diraih!
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {unlockedToastBadge.rarity}
                  </span>
                </div>
                <h4 className="text-sm font-extrabold text-white mt-1">
                  {unlockedToastBadge.title}
                </h4>
                <p className="text-xs text-amber-300/90 font-medium">
                  {unlockedToastBadge.subtitle}
                </p>
                <p className="text-[11px] text-slate-300 mt-1 line-clamp-2">
                  {unlockedToastBadge.description}
                </p>
              </div>
            </div>

            <button
              onClick={() => setUnlockedToastBadge(null)}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center justify-end gap-2 mt-3 pt-2.5 border-t border-slate-800">
            <button
              onClick={() => {
                setUnlockedToastBadge(null);
                setActiveTab('dashboard');
              }}
              className="px-3.5 py-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 shadow"
            >
              <Award className="w-3.5 h-3.5" />
              <span>Buka Dashboard & Rapor</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Content Workspace */}
      <main className="flex-1 flex flex-col overflow-x-hidden">
        {/* TAB 1: 3D HEART EXPLORER & INFORMATION PANEL */}
        {activeTab === 'explorer' && (
          <div className="flex-1 flex flex-col">
            {/* Intro Bar */}
            <div className="bg-slate-900/60 border-b border-slate-800/80 px-6 py-2 flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2 text-slate-300">
                <span className="font-semibold text-cyan-400">Laboratorium Virtual:</span>
                <span>Eksplorasi Anatomi 3D Jantung Manusia (Kelas XI SMA)</span>
              </div>
              <div className="flex items-center gap-4 text-slate-400">
                <span>Kontrol: Sentuh / Geser Mouse untuk Rotasi · Scroll Zoom</span>
              </div>
            </div>

            {/* Split Screen 3D Viewport + Scientific Inspector */}
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 min-h-[580px]">
              {/* 3D Canvas (8 cols on desktop) */}
              <div className="lg:col-span-8 relative min-h-[460px] lg:min-h-[640px] border-b lg:border-b-0 lg:border-r border-slate-800">
                <HeartViewer3D
                  selectedHotspot={selectedHotspot}
                  onSelectHotspot={setSelectedHotspot}
                  onHotspotInspected={handleHotspotInspected}
                  bpm={bpm}
                  onBpmChange={setBpm}
                />
              </div>

              {/* Information Inspector Panel (4 cols on desktop) */}
              <div className="lg:col-span-4 p-4 bg-slate-950 flex flex-col min-h-[400px]">
                <HeartInfoPanel
                  selectedHotspot={selectedHotspot}
                  onSelectHotspot={(spot) => {
                    setSelectedHotspot(spot);
                    if (spot) handleHotspotInspected(spot.id);
                  }}
                  onAskTutorAboutHotspot={handleAskTutorAboutHotspot}
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: CIRCULATION SIMULATOR */}
        {activeTab === 'circulation' && (
          <div className="flex-1 py-4">
            <CirculationSimulator
              onAskTutorAboutCirculation={handleAskTutorAboutCirculation}
            />
          </div>
        )}

        {/* TAB 3: MISSION 1 (STRUCTURE VS FUNCTION) */}
        {activeTab === 'mission1' && (
          <div className="flex-1 py-4">
            <InvestigationMissionOne 
              onSendToAITutor={handleSendToAITutor}
              onCompleteMission={handleMission1Complete}
            />
          </div>
        )}

        {/* TAB 4: MISSION 2 (CARDIOVASCULAR PATHOLOGY & VITALS) */}
        {activeTab === 'mission2' && (
          <div className="flex-1 py-4">
            <InvestigationMissionTwo 
              onSendToAITutor={handleSendToAITutor}
              onCaseCompleted={handleMission2CaseComplete}
            />
          </div>
        )}

        {/* TAB 5: VIDEO MATERI PEMBELAJARAN */}
        {activeTab === 'video' && (
          <div className="flex-1 py-4">
            <VideoLearningStation
              onAskTutorAboutVideo={(topicPrompt) => {
                setTutorContext('Diskusi Video Pembelajaran Sistem Peredaran Darah');
                setTutorInitialPrompt(topicPrompt);
                setTutorMissionData({ sumber: 'Video Pembelajaran YouTube (youtu.be/E_Pt1XxWP1U)' });
                setActiveTab('tutor');
              }}
            />
          </div>
        )}

        {/* TAB 6: SOCRATIC AI TUTOR */}
        {activeTab === 'tutor' && (
          <div className="flex-1 py-4">
            <SocraticAITutor
              initialContext={tutorContext}
              initialPrompt={tutorInitialPrompt}
              missionData={tutorMissionData}
            />
          </div>
        )}

        {/* TAB 7: QUIZ & RUBRICS */}
        {activeTab === 'quiz' && (
          <div className="flex-1 py-4">
            <QuizAndRubrics
              quizAnswers={userPerformance.quizAnswers}
              onAnswerQuestion={handleAnswerQuestion}
              onResetQuiz={handleResetQuiz}
            />
          </div>
        )}

        {/* TAB 8: DASHBOARD PERFORMA & ANALITIK SISWA */}
        {activeTab === 'dashboard' && (
          <div className="flex-1 py-4">
            <StudentDashboard
              performance={userPerformance}
              onNavigateTab={setActiveTab}
              studentProfile={studentProfile}
            />
          </div>
        )}
      </main>

      {/* Mobile Friendly Bottom Nav Pill Bar (Hidden on desktop, visible on smartphone screens) */}
      <div className="md:hidden sticky bottom-0 left-0 right-0 z-30 bg-slate-900 border-t border-slate-800 px-1.5 py-2 flex items-center justify-around text-[9px]">
        <button
          onClick={() => setActiveTab('explorer')}
          className={`flex flex-col items-center gap-1 p-1 ${
            activeTab === 'explorer' ? 'text-cyan-400 font-bold' : 'text-slate-400'
          }`}
        >
          <Heart className="w-4 h-4" />
          <span>Jantung</span>
        </button>

        <button
          onClick={() => setActiveTab('circulation')}
          className={`flex flex-col items-center gap-1 p-1 ${
            activeTab === 'circulation' ? 'text-cyan-400 font-bold' : 'text-slate-400'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>Sirkulasi</span>
        </button>

        <button
          onClick={() => setActiveTab('mission1')}
          className={`flex flex-col items-center gap-1 p-1 ${
            activeTab === 'mission1' ? 'text-cyan-400 font-bold' : 'text-slate-400'
          }`}
        >
          <FlaskConical className="w-4 h-4" />
          <span>Misi 1</span>
        </button>

        <button
          onClick={() => setActiveTab('mission2')}
          className={`flex flex-col items-center gap-1 p-1 ${
            activeTab === 'mission2' ? 'text-cyan-400 font-bold' : 'text-slate-400'
          }`}
        >
          <Stethoscope className="w-4 h-4" />
          <span>Misi 2</span>
        </button>

        <button
          onClick={() => setActiveTab('video')}
          className={`flex flex-col items-center gap-1 p-1 ${
            activeTab === 'video' ? 'text-cyan-400 font-bold' : 'text-slate-400'
          }`}
        >
          <Video className="w-4 h-4" />
          <span>Video</span>
        </button>

        <button
          onClick={() => setActiveTab('tutor')}
          className={`flex flex-col items-center gap-1 p-1 ${
            activeTab === 'tutor' ? 'text-cyan-400 font-bold' : 'text-slate-400'
          }`}
        >
          <Bot className="w-4 h-4" />
          <span>Tutor</span>
        </button>

        <button
          onClick={() => setActiveTab('quiz')}
          className={`flex flex-col items-center gap-1 p-1 ${
            activeTab === 'quiz' ? 'text-cyan-400 font-bold' : 'text-slate-400'
          }`}
        >
          <Brain className="w-4 h-4" />
          <span>Kuis</span>
        </button>

        <button
          onClick={() => setActiveTab('dashboard')}
          className={`flex flex-col items-center gap-1 p-1 ${
            activeTab === 'dashboard' ? 'text-cyan-400 font-bold' : 'text-slate-400'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Rapor</span>
        </button>
      </div>

      {/* References & User Guide Modal */}
      <ReferencesModal
        isOpen={isReferencesOpen}
        onClose={() => setIsReferencesOpen(false)}
      />
    </div>
  );
}
