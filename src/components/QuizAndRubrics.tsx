import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { QUIZ_QUESTIONS, CRITICAL_THINKING_RUBRIC } from '../data/biologyData';
import { 
  HelpCircle, 
  CheckCircle2, 
  XCircle, 
  Award, 
  Printer, 
  RotateCcw, 
  FileCheck, 
  BarChart, 
  Brain,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';

interface QuizAndRubricsProps {
  quizAnswers?: { [qId: number]: number };
  onAnswerQuestion?: (qId: number, answerIdx: number) => void;
  onResetQuiz?: () => void;
}

export const QuizAndRubrics: React.FC<QuizAndRubricsProps> = ({
  quizAnswers: externalAnswers,
  onAnswerQuestion,
  onResetQuiz,
}) => {
  const [activeTab, setActiveTab] = useState<'quiz' | 'rubric'>('quiz');

  // Quiz State
  const [currentQIndex, setCurrentQIndex] = useState<number>(0);
  const [internalAnswers, setInternalAnswers] = useState<{ [qId: number]: number }>({});
  const [showExplanation, setShowExplanation] = useState<boolean>(false);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  const selectedAnswers = externalAnswers || internalAnswers;
  const currentQ = QUIZ_QUESTIONS[currentQIndex];

  const handleSelectOption = (optIndex: number) => {
    if (selectedAnswers[currentQ.id] !== undefined) return; // locked once selected

    const newAnswers = { ...selectedAnswers, [currentQ.id]: optIndex };
    if (onAnswerQuestion) {
      onAnswerQuestion(currentQ.id, optIndex);
    } else {
      setInternalAnswers(newAnswers);
    }
    setShowExplanation(true);

    if (optIndex === currentQ.correctIndex) {
      confetti({ particleCount: 40, spread: 50, origin: { y: 0.7 } });
    }

    // Check if all answered
    if (Object.keys(newAnswers).length === QUIZ_QUESTIONS.length) {
      setIsCompleted(true);
      confetti({ particleCount: 100, spread: 80, origin: { y: 0.5 } });
    }
  };

  const calculateScore = () => {
    let correct = 0;
    QUIZ_QUESTIONS.forEach((q) => {
      if (selectedAnswers[q.id] === q.correctIndex) correct++;
    });
    return correct;
  };

  const handleResetQuiz = () => {
    if (onResetQuiz) {
      onResetQuiz();
    } else {
      setInternalAnswers({});
    }
    setCurrentQIndex(0);
    setShowExplanation(false);
    setIsCompleted(false);
  };

  const handlePrintRubric = () => {
    window.print();
  };

  return (
    <div className="flex flex-col gap-4 p-4 max-w-6xl mx-auto w-full">
      {/* Tab Switcher: Siswa Kuis vs Guru Rubrik */}
      <div className="flex items-center justify-between bg-slate-900 border border-slate-800 p-3 rounded-xl">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('quiz')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors flex items-center gap-2 ${
              activeTab === 'quiz'
                ? 'bg-cyan-500 text-slate-950 shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Brain className="w-4 h-4" />
            <span>Kuis Berpikir Kritis (10 Soal HOTS)</span>
          </button>

          <button
            onClick={() => setActiveTab('rubric')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors flex items-center gap-2 ${
              activeTab === 'rubric'
                ? 'bg-cyan-500 text-slate-950 shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <FileCheck className="w-4 h-4" />
            <span>Rubrik Asesmen untuk Guru</span>
          </button>
        </div>

        {activeTab === 'rubric' && (
          <button
            onClick={handlePrintRubric}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-950 hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-200 rounded-lg transition-colors"
          >
            <Printer className="w-3.5 h-3.5 text-cyan-400" />
            <span>Cetak / Ekspor Rubrik</span>
          </button>
        )}
      </div>

      {/* QUIZ TAB */}
      {activeTab === 'quiz' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          {/* Progress & Header */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800 mb-5">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-950 border border-cyan-800 px-2 py-0.5 rounded">
                  SOAL {currentQ.id} DARI {QUIZ_QUESTIONS.length}
                </span>
                <span className="text-xs bg-slate-950 border border-slate-800 text-slate-300 px-2 py-0.5 rounded font-mono">
                  Dimensi: {currentQ.thinkingDimension}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Pilih jawaban paling logis berdasarkan bukti anatomi dan fisiologi peredaran darah.
              </p>
            </div>

            {/* Score Tracker */}
            <div className="flex items-center gap-3 bg-slate-950 border border-slate-800 px-4 py-2 rounded-lg text-xs font-mono">
              <span className="text-slate-400">Skor Terjawab:</span>
              <span className="font-bold text-cyan-300 tabular-nums">
                {calculateScore()} / {Object.keys(selectedAnswers).length}
              </span>
            </div>
          </div>

          {/* Question Text */}
          <h3 className="text-base font-bold text-white mb-5 leading-relaxed">
            {currentQ.question}
          </h3>

          {/* Options List */}
          <div className="space-y-2.5 mb-6">
            {currentQ.options.map((option, idx) => {
              const isSelected = selectedAnswers[currentQ.id] === idx;
              const hasAnswered = selectedAnswers[currentQ.id] !== undefined;
              const isCorrect = idx === currentQ.correctIndex;

              let btnStyle = 'bg-slate-950 border-slate-800 text-slate-200 hover:border-slate-700';

              if (hasAnswered) {
                if (isCorrect) {
                  btnStyle = 'bg-emerald-950/70 border-emerald-500 text-emerald-200 font-semibold';
                } else if (isSelected && !isCorrect) {
                  btnStyle = 'bg-rose-950/70 border-rose-500 text-rose-200';
                } else {
                  btnStyle = 'bg-slate-950/40 border-slate-900 text-slate-500 opacity-60';
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  disabled={hasAnswered}
                  className={`w-full text-left p-3.5 rounded-xl border text-xs leading-relaxed flex items-start gap-3 transition-all ${btnStyle}`}
                >
                  <span className="w-5 h-5 rounded-full border border-current flex items-center justify-center shrink-0 font-mono font-bold mt-0.5">
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span className="flex-1">{option}</span>
                  {hasAnswered && isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
                  {hasAnswered && isSelected && !isCorrect && <XCircle className="w-4 h-4 text-rose-400 shrink-0" />}
                </button>
              );
            })}
          </div>

          {/* Formative Explanation Box */}
          {selectedAnswers[currentQ.id] !== undefined && (
            <div className="bg-slate-950/90 border border-slate-800 rounded-xl p-4 mb-5 text-xs animate-in fade-in">
              <span className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider block mb-1">
                Eksplanasi Ilmiah & Kunci Analisis:
              </span>
              <p className="text-slate-300 leading-relaxed">
                {currentQ.explanation}
              </p>
            </div>
          )}

          {/* Bottom Navigation between questions */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-800">
            <button
              onClick={() => setCurrentQIndex((prev) => Math.max(prev - 1, 0))}
              disabled={currentQIndex === 0}
              className="flex items-center gap-1.5 px-3 py-2 bg-slate-950 hover:bg-slate-800 disabled:opacity-40 text-xs font-semibold text-slate-300 rounded-lg border border-slate-800 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Sebelumnya</span>
            </button>

            {/* Quick jump circles */}
            <div className="hidden sm:flex items-center gap-1.5">
              {QUIZ_QUESTIONS.map((q, i) => {
                const ans = selectedAnswers[q.id];
                const isCorr = ans === q.correctIndex;
                let circleClass = 'bg-slate-950 text-slate-400 border-slate-800';
                if (ans !== undefined) {
                  circleClass = isCorr ? 'bg-emerald-600 text-white border-emerald-400' : 'bg-rose-600 text-white border-rose-400';
                }
                if (i === currentQIndex) {
                  circleClass += ' ring-2 ring-cyan-400';
                }
                return (
                  <button
                    key={q.id}
                    onClick={() => setCurrentQIndex(i)}
                    className={`w-6 h-6 rounded-full text-[10px] font-mono font-bold border flex items-center justify-center transition-all ${circleClass}`}
                  >
                    {i + 1}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => setCurrentQIndex((prev) => Math.min(prev + 1, QUIZ_QUESTIONS.length - 1))}
              disabled={currentQIndex === QUIZ_QUESTIONS.length - 1}
              className="flex items-center gap-1.5 px-3 py-2 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-40 text-xs font-bold text-slate-950 rounded-lg transition-colors"
            >
              <span>Selanjutnya</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Completion Score Modal / Banner */}
          {isCompleted && (
            <div className="mt-6 p-5 bg-gradient-to-r from-cyan-950/70 to-slate-900 border border-cyan-500/50 rounded-xl flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-cyan-500/20 border border-cyan-400 flex items-center justify-center text-cyan-400">
                  <Award className="w-7 h-7" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-white">Selamat! Kuis Berpikir Kritis Selesai</h4>
                  <p className="text-xs text-slate-300">
                    Kamu berhasil menjawab benar <strong className="text-cyan-300">{calculateScore()} dari {QUIZ_QUESTIONS.length}</strong> pertanyaan HOTS (Nilai: {(calculateScore() / QUIZ_QUESTIONS.length) * 100}).
                  </p>
                </div>
              </div>

              <button
                onClick={handleResetQuiz}
                className="flex items-center gap-1.5 px-4 py-2 bg-slate-950 hover:bg-slate-800 border border-slate-700 text-xs font-bold text-white rounded-lg transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5 text-cyan-400" />
                <span>Ulangi Kuis</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* RUBRIC TAB (FOR TEACHERS) */}
      {activeTab === 'rubric' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 print:bg-white print:text-black">
          <div className="pb-4 border-b border-slate-800 mb-6">
            <h3 className="text-lg font-bold text-white mb-1">
              Rubrik Penilaian Berpikir Kritis (Facione Framework) untuk Guru Biologi
            </h3>
            <p className="text-xs text-slate-400">
              Instrumen asesmen autentik untuk mengevaluasi kemampuan nalar siswa pada materi Sistem Peredaran Darah Manusia Kelas XI SMA.
            </p>
          </div>

          <div className="space-y-6">
            {CRITICAL_THINKING_RUBRIC.map((dim, idx) => (
              <div key={idx} className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                <div className="mb-2">
                  <h4 className="text-sm font-bold text-cyan-400">{dim.dimension}</h4>
                  <p className="text-xs text-slate-300 italic">{dim.definition}</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 mt-3">
                  {dim.levels.map((lvl) => (
                    <div
                      key={lvl.score}
                      className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-xs flex flex-col justify-between"
                    >
                      <span className="font-mono font-bold text-cyan-300 text-[11px] mb-1">
                        Skor {lvl.score} / 4
                      </span>
                      <p className="text-slate-300 text-[11px] leading-relaxed">
                        {lvl.descriptor}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800 text-xs text-slate-400">
            Panduan Pembobotan: Nilai Akhir Berpikir Kritis = (Total Skor yang Diperoleh / 20) × 100.
          </div>
        </div>
      )}
    </div>
  );
};
