import React from 'react';
import { HeartHotspot } from '../types/biology';
import { HEART_HOTSPOTS } from '../data/biologyData';
import { Info, Gauge, AlertCircle, Heart, ArrowRight } from 'lucide-react';

interface HeartInfoPanelProps {
  selectedHotspot: HeartHotspot | null;
  onSelectHotspot: (hotspot: HeartHotspot | null) => void;
  onAskTutorAboutHotspot: (hotspot: HeartHotspot) => void;
}

export const HeartInfoPanel: React.FC<HeartInfoPanelProps> = ({
  selectedHotspot,
  onSelectHotspot,
  onAskTutorAboutHotspot,
}) => {
  if (!selectedHotspot) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col h-full overflow-y-auto">
        <div className="flex items-center gap-2 mb-3">
          <Info className="w-5 h-5 text-cyan-400" />
          <h3 className="text-base font-bold text-white">Inspektor Anatomi Kardiovaskular</h3>
        </div>

        <p className="text-xs text-slate-300 mb-4 leading-relaxed">
          Pilih salah satu dari 12 struktur kunci jantung di bawah ini atau klik langsung pin pada model 3D untuk meninjau kaitan struktur, fungsi mekanik, dan fisiologi hemodinamika.
        </p>

        {/* Quick select structure list */}
        <div className="flex flex-col gap-1.5 flex-1 overflow-y-auto pr-1">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
            Daftar Struktur Kunci Jantung:
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
            {HEART_HOTSPOTS.map((hotspot) => (
              <button
                key={hotspot.id}
                onClick={() => onSelectHotspot(hotspot)}
                className="flex items-center justify-between p-2 rounded-lg bg-slate-950/60 hover:bg-slate-800/80 border border-slate-800/80 hover:border-cyan-500/40 text-left transition-colors group"
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: hotspot.color }}
                  />
                  <div>
                    <div className="text-xs font-semibold text-slate-200 group-hover:text-cyan-400">
                      {hotspot.nameId}
                    </div>
                    <div className="text-[10px] text-slate-400 italic">
                      {hotspot.nameLatin}
                    </div>
                  </div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-400 shrink-0" />
              </button>
            ))}
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
          <span>Klasifikasi Saturasi:</span>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 text-red-400">
              <span className="w-2 h-2 rounded-full bg-red-500" /> Darah Kaya O₂
            </span>
            <span className="flex items-center gap-1 text-blue-400">
              <span className="w-2 h-2 rounded-full bg-blue-500" /> Darah Kaya CO₂
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col h-full overflow-y-auto">
      {/* Header with Name & Latin */}
      <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-lg font-bold text-white">{selectedHotspot.nameId}</h3>
            <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
              selectedHotspot.oxygenated 
                ? 'bg-red-950/80 text-red-300 border-red-800/80' 
                : 'bg-blue-950/80 text-blue-300 border-blue-800/80'
            }`}>
              {selectedHotspot.oxygenated ? 'Kaya Oksigen' : 'Miskin Oksigen (Kaya CO₂)'}
            </span>
          </div>
          <p className="text-xs italic text-cyan-400 font-medium">{selectedHotspot.nameLatin}</p>
        </div>

        <button
          onClick={() => onSelectHotspot(null)}
          className="text-xs text-slate-400 hover:text-white px-2 py-1 rounded bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 transition-colors"
        >
          Tutup
        </button>
      </div>

      {/* Pressure Metric Gauge */}
      <div className="my-3 p-3 bg-slate-950/80 border border-slate-800 rounded-lg flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Gauge className="w-4 h-4 text-cyan-400" />
          <span className="text-xs text-slate-300 font-medium">Rentang Tekanan Fisiologis:</span>
        </div>
        <span className="text-xs font-mono font-bold text-cyan-300 tabular-nums">
          {selectedHotspot.pressureRange}
        </span>
      </div>

      {/* Anatomical Structure Description */}
      <div className="mb-3">
        <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
          <Info className="w-3.5 h-3.5 text-cyan-400" />
          Karakteristik Struktur
        </h4>
        <p className="text-xs text-slate-200 leading-relaxed bg-slate-950/40 p-2.5 rounded-lg border border-slate-800/60">
          {selectedHotspot.structureDescription}
        </p>
      </div>

      {/* Function Description */}
      <div className="mb-3">
        <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
          <Heart className="w-3.5 h-3.5 text-rose-400" />
          Fungsi Mekanis & Hemodinamik
        </h4>
        <p className="text-xs text-slate-200 leading-relaxed bg-slate-950/40 p-2.5 rounded-lg border border-slate-800/60">
          {selectedHotspot.functionDescription}
        </p>
      </div>

      {/* Structure vs Function Scientific Relationship */}
      <div className="mb-3">
        <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
          Hubungan Struktur dengan Fungsi (Nalar Kritis):
        </h4>
        <p className="text-xs text-cyan-200 leading-relaxed bg-cyan-950/30 p-2.5 rounded-lg border border-cyan-800/50">
          {selectedHotspot.anatomicalPhysiologicalRelation}
        </p>
      </div>

      {/* Clinical Notes */}
      <div className="mb-4">
        <h4 className="text-xs font-semibold text-amber-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
          <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
          Catatan Klinis / Patologi Terkait
        </h4>
        <p className="text-xs text-slate-300 leading-relaxed bg-amber-950/20 p-2.5 rounded-lg border border-amber-900/40">
          {selectedHotspot.clinicalNote}
        </p>
      </div>

      {/* Socratic Discussion Button */}
      <div className="mt-auto pt-2">
        <button
          onClick={() => onAskTutorAboutHotspot(selectedHotspot)}
          className="w-full py-2 px-3 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-2 shadow"
        >
          <span>Diskusikan Struktur Ini dengan AI Tutor</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
