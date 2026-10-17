import React from 'react';
import { BookOpen, Video, User, LogOut } from 'lucide-react';
import { StudentProfile } from './StudentLogin';

export type NavTab = 'explorer' | 'circulation' | 'mission1' | 'mission2' | 'video' | 'tutor' | 'quiz' | 'dashboard';

interface NavigationProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  onOpenReferences: () => void;
  studentProfile?: StudentProfile | null;
  onLogout?: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  onSelectTab,
  onOpenReferences,
  studentProfile,
  onLogout,
}) => {
  return (
    <header className="flex items-center justify-between gap-4 px-4 sm:px-6 py-3 bg-slate-900 border-b border-slate-800 shrink-0 select-none">
      {/* Zone 1: Brand Wordmark */}
      <div 
        onClick={() => onSelectTab('explorer')}
        className="text-lg font-extrabold tracking-tight text-white whitespace-nowrap shrink-0 cursor-pointer flex items-center gap-2 hover:opacity-90 transition-opacity"
      >
        <span className="text-cyan-400">BioLab</span>
        <span>AI 3D</span>
      </div>

      {/* Zone 2: Navigation Links */}
      <nav className="hidden lg:flex items-center gap-4 xl:gap-5 text-xs font-semibold text-slate-300">
        <button
          onClick={() => onSelectTab('explorer')}
          className={`hover:text-cyan-400 transition-colors whitespace-nowrap shrink-0 ${
            activeTab === 'explorer' ? 'text-cyan-400 border-b-2 border-cyan-400 pb-0.5' : ''
          }`}
        >
          Model Jantung 3D
        </button>

        <button
          onClick={() => onSelectTab('circulation')}
          className={`hover:text-cyan-400 transition-colors whitespace-nowrap shrink-0 ${
            activeTab === 'circulation' ? 'text-cyan-400 border-b-2 border-cyan-400 pb-0.5' : ''
          }`}
        >
          Simulasi Sirkulasi
        </button>

        <button
          onClick={() => onSelectTab('mission1')}
          className={`hover:text-cyan-400 transition-colors whitespace-nowrap shrink-0 ${
            activeTab === 'mission1' ? 'text-cyan-400 border-b-2 border-cyan-400 pb-0.5' : ''
          }`}
        >
          Misi 1: Struktur & Fungsi
        </button>

        <button
          onClick={() => onSelectTab('mission2')}
          className={`hover:text-cyan-400 transition-colors whitespace-nowrap shrink-0 ${
            activeTab === 'mission2' ? 'text-cyan-400 border-b-2 border-cyan-400 pb-0.5' : ''
          }`}
        >
          Misi 2: Patologi & Vitals
        </button>

        <button
          onClick={() => onSelectTab('video')}
          className={`hover:text-cyan-400 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
            activeTab === 'video' ? 'text-cyan-400 border-b-2 border-cyan-400 pb-0.5' : ''
          }`}
        >
          <Video className="w-3.5 h-3.5 text-rose-400" />
          <span>Video Materi</span>
        </button>

        <button
          onClick={() => onSelectTab('tutor')}
          className={`hover:text-cyan-400 transition-colors whitespace-nowrap shrink-0 ${
            activeTab === 'tutor' ? 'text-cyan-400 border-b-2 border-cyan-400 pb-0.5' : ''
          }`}
        >
          Socratic AI Tutor
        </button>

        <button
          onClick={() => onSelectTab('quiz')}
          className={`hover:text-cyan-400 transition-colors whitespace-nowrap shrink-0 ${
            activeTab === 'quiz' ? 'text-cyan-400 border-b-2 border-cyan-400 pb-0.5' : ''
          }`}
        >
          Kuis & Rubrik
        </button>

        <button
          onClick={() => onSelectTab('dashboard')}
          className={`hover:text-cyan-400 transition-colors whitespace-nowrap shrink-0 ${
            activeTab === 'dashboard' ? 'text-cyan-400 border-b-2 border-cyan-400 pb-0.5' : ''
          }`}
        >
          Dashboard Siswa
        </button>
      </nav>

      {/* Zone 3: Student Badge Profile & References Button */}
      <div className="flex items-center gap-2.5 shrink-0">
        {studentProfile && (
          <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1.5">
            <div className="w-6 h-6 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
              <User className="w-3.5 h-3.5" />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-[11px] font-bold text-white leading-tight max-w-[120px] truncate">
                {studentProfile.name}
              </span>
              <span className="text-[10px] text-cyan-400 font-mono leading-none">
                {studentProfile.className}
              </span>
            </div>
            {onLogout && (
              <button
                onClick={onLogout}
                title="Keluar / Ganti Siswa"
                className="ml-1 p-1 text-slate-400 hover:text-rose-400 transition-colors rounded hover:bg-slate-800"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        )}

        <button
          onClick={onOpenReferences}
          className="px-3 py-1.5 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-slate-600 rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 shadow-sm"
        >
          <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
          <span className="hidden sm:inline">Panduan & Rujukan</span>
        </button>
      </div>
    </header>
  );
};
