import React, { useState, useEffect } from 'react';
import { CIRCULATION_STEPS } from '../data/biologyData';
import { CirculationStep } from '../types/biology';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  ChevronRight, 
  ChevronLeft, 
  Gauge, 
  Flame, 
  Wind, 
  Activity, 
  Layers,
  ArrowRight
} from 'lucide-react';

interface CirculationSimulatorProps {
  onAskTutorAboutCirculation: (step: CirculationStep) => void;
}

export const CirculationSimulator: React.FC<CirculationSimulatorProps> = ({
  onAskTutorAboutCirculation,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(3000); // 3 seconds per step
  const [filterCircuit, setFilterCircuit] = useState<'all' | 'pulmonal' | 'sistemik'>('all');

  const currentStep = CIRCULATION_STEPS[currentStepIndex];

  // Auto progression when playing
  useEffect(() => {
    if (!isPlaying) return;

    const timer = setInterval(() => {
      setCurrentStepIndex((prev) => (prev + 1) % CIRCULATION_STEPS.length);
    }, playbackSpeed);

    return () => clearInterval(timer);
  }, [isPlaying, playbackSpeed]);

  const handleNext = () => {
    setCurrentStepIndex((prev) => (prev + 1) % CIRCULATION_STEPS.length);
  };

  const handlePrev = () => {
    setCurrentStepIndex((prev) => (prev - 1 + CIRCULATION_STEPS.length) % CIRCULATION_STEPS.length);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentStepIndex(0);
  };

  return (
    <div className="flex flex-col h-full gap-4 p-4 max-w-7xl mx-auto w-full">
      {/* Top Header & Epistemological Distinction */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900 border border-slate-800 p-4 rounded-xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-lg font-bold text-white">Simulasi Sirkulasi Pulmonal & Sistemik</h2>
            <span className="text-xs bg-cyan-950 text-cyan-300 border border-cyan-800 px-2 py-0.5 rounded">
              [Data Simulasi Fisiologis]
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Urutan perjalanan eritrosit melalui peredaran darah ganda lengkap dengan tekanan hidrostatik dan saturasi gas.
          </p>
        </div>

        {/* Filter circuit tabs */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
          <button
            onClick={() => setFilterCircuit('all')}
            className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
              filterCircuit === 'all'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Semua Siklus (10 Tahap)
          </button>
          <button
            onClick={() => {
              setFilterCircuit('pulmonal');
              setCurrentStepIndex(0);
            }}
            className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
              filterCircuit === 'pulmonal'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Peredaran Darah Kecil
          </button>
          <button
            onClick={() => {
              setFilterCircuit('sistemik');
              setCurrentStepIndex(5);
            }}
            className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
              filterCircuit === 'sistemik'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Peredaran Darah Besar
          </button>
        </div>
      </div>

      {/* Main Grid: Visual Pathway Diagram + Dynamic Metrics + Detail Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 flex-1">
        {/* Left Col (7 cols): Visual Circuit Stages Timeline */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-800">
              <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Peta Aliran Hemodinamika:
              </span>
              <span className="text-xs font-mono text-cyan-400">
                Tahap {currentStep.step} / {CIRCULATION_STEPS.length}
              </span>
            </div>

            {/* Stepper Timeline List */}
            <div className="flex flex-col gap-2 max-h-[460px] overflow-y-auto pr-1">
              {CIRCULATION_STEPS.filter(
                (s) => filterCircuit === 'all' || s.circuit === filterCircuit
              ).map((stepItem) => {
                const isActive = stepItem.step === currentStep.step;
                const isOxygenated = stepItem.o2Saturation >= 90;

                return (
                  <div
                    key={stepItem.step}
                    onClick={() => setCurrentStepIndex(stepItem.step - 1)}
                    className={`p-3 rounded-lg border cursor-pointer transition-all ${
                      isActive
                        ? 'bg-slate-800 border-cyan-400 shadow-lg scale-[1.01]'
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-mono font-bold ${
                            isActive
                              ? 'bg-cyan-400 text-slate-950'
                              : 'bg-slate-800 text-slate-300'
                          }`}
                        >
                          {stepItem.step}
                        </span>
                        <span className={`text-xs font-bold ${isActive ? 'text-white' : 'text-slate-300'}`}>
                          {stepItem.title}
                        </span>
                      </div>

                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                          isOxygenated
                            ? 'bg-red-950/70 text-red-300 border-red-800'
                            : 'bg-blue-950/70 text-blue-300 border-blue-800'
                        }`}
                      >
                        {stepItem.circuit === 'pulmonal' ? 'Sirkulasi Pulmonal' : 'Sirkulasi Sistemik'}
                      </span>
                    </div>

                    {/* Flow Route */}
                    <div className="flex items-center gap-1.5 text-xs text-slate-400 pl-8">
                      <span className="text-slate-300">{stepItem.from}</span>
                      <ArrowRight className="w-3 h-3 text-cyan-400 shrink-0" />
                      <span className="text-cyan-300 italic">{stepItem.through}</span>
                      <ArrowRight className="w-3 h-3 text-cyan-400 shrink-0" />
                      <span className="text-slate-300 font-semibold">{stepItem.to}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Playback Controls Deck */}
          <div className="mt-4 pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 bg-slate-950/80 p-3 rounded-lg">
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrev}
                className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors"
                title="Tahap Sebelumnya"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className={`px-3 py-2 rounded-lg font-bold text-xs flex items-center gap-1.5 transition-colors ${
                  isPlaying
                    ? 'bg-amber-500 hover:bg-amber-400 text-slate-950'
                    : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950'
                }`}
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                <span>{isPlaying ? 'Jeda Simulasi' : 'Jalankan Otomatis'}</span>
              </button>

              <button
                onClick={handleNext}
                className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors"
                title="Tahap Berikutnya"
              >
                <ChevronRight className="w-4 h-4" />
              </button>

              <button
                onClick={handleReset}
                className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-lg transition-colors"
                title="Reset ke Tahap 1"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>

            {/* Playback Speed */}
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span>Kecepatan:</span>
              <button
                onClick={() => setPlaybackSpeed(4000)}
                className={`px-2 py-1 rounded text-xs ${
                  playbackSpeed === 4000 ? 'bg-cyan-950 text-cyan-300 border border-cyan-700 font-bold' : 'hover:text-white'
                }`}
              >
                1x
              </button>
              <button
                onClick={() => setPlaybackSpeed(2200)}
                className={`px-2 py-1 rounded text-xs ${
                  playbackSpeed === 2200 ? 'bg-cyan-950 text-cyan-300 border border-cyan-700 font-bold' : 'hover:text-white'
                }`}
              >
                1.5x
              </button>
              <button
                onClick={() => setPlaybackSpeed(1200)}
                className={`px-2 py-1 rounded text-xs ${
                  playbackSpeed === 1200 ? 'bg-cyan-950 text-cyan-300 border border-cyan-700 font-bold' : 'hover:text-white'
                }`}
              >
                2x
              </button>
            </div>
          </div>
        </div>

        {/* Right Col (5 cols): Real-Time Hemodynamic Telemetry & Scientific Detail */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          {/* Active Step Scientific Detail Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col gap-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wider">
                Fisiologi Tahap {currentStep.step}
              </span>
              <span className="text-xs text-slate-400 font-mono">
                {currentStep.gasStatus}
              </span>
            </div>

            <h3 className="text-base font-bold text-white">{currentStep.title}</h3>

            <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-3 rounded-lg border border-slate-800">
              {currentStep.description}
            </p>

            {/* Route Summary */}
            <div className="bg-slate-950/80 border border-slate-800/80 rounded-lg p-3 text-xs flex flex-col gap-2">
              <div className="flex justify-between">
                <span className="text-slate-400">Titik Asal:</span>
                <span className="text-white font-medium">{currentStep.from}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Melintasi Katup / Saluran:</span>
                <span className="text-cyan-300 font-medium">{currentStep.through}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Tujuan Akhir:</span>
                <span className="text-white font-medium">{currentStep.to}</span>
              </div>
            </div>

            {/* Live Hemodynamic Telemetry Gauges */}
            <div className="grid grid-cols-3 gap-2 mt-1">
              {/* Pressure */}
              <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-center">
                <div className="flex items-center justify-center gap-1 text-[11px] text-slate-400 mb-1">
                  <Gauge className="w-3 h-3 text-cyan-400" />
                  <span>Tekanan</span>
                </div>
                <div className="text-base font-mono font-bold text-white tabular-nums">
                  {currentStep.pressureAvg} <span className="text-[10px] text-slate-400 font-normal">mmHg</span>
                </div>
              </div>

              {/* O2 Saturation */}
              <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-center">
                <div className="flex items-center justify-center gap-1 text-[11px] text-slate-400 mb-1">
                  <Flame className="w-3 h-3 text-rose-400" />
                  <span>Saturasi O₂</span>
                </div>
                <div className="text-base font-mono font-bold text-rose-400 tabular-nums">
                  {currentStep.o2Saturation}%
                </div>
              </div>

              {/* CO2 Pressure */}
              <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-center">
                <div className="flex items-center justify-center gap-1 text-[11px] text-slate-400 mb-1">
                  <Wind className="w-3 h-3 text-blue-400" />
                  <span>Tekanan CO₂</span>
                </div>
                <div className="text-base font-mono font-bold text-blue-400 tabular-nums">
                  {currentStep.co2Pressure} <span className="text-[10px] text-slate-400 font-normal">mmHg</span>
                </div>
              </div>
            </div>

            {/* Socratic Guidance Trigger */}
            <button
              onClick={() => onAskTutorAboutCirculation(currentStep)}
              className="mt-2 w-full py-2.5 px-3 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-2 shadow"
            >
              <span>Diskusikan Tahap Ini dengan AI Tutor</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
