import React, { useState } from 'react';
import { X, Award, Flame, Mic, Users, Camera, ArrowRight, Sparkles } from 'lucide-react';
import { ScoringMode } from '../types';

interface ScoreModalProps {
  isOpen: boolean;
  onClose: () => void;
  singerName: string;
  songTitle: string;
  artist: string;
  initialScore: number;
  vocalScore: number;
  energyScore: number;
  crowdScore: number;
  reactionsCount: number;
  scoringMode: ScoringMode;
  onNextSinger: () => void;
  onOpenPhotoCapture: () => void;
  onSaveScore: (finalScore: number) => void;
}

export const ScoreModal: React.FC<ScoreModalProps> = ({
  isOpen,
  onClose,
  singerName,
  songTitle,
  artist,
  initialScore,
  vocalScore,
  energyScore,
  crowdScore,
  reactionsCount,
  scoringMode,
  onNextSinger,
  onOpenPhotoCapture,
  onSaveScore
}) => {
  const [score, setScore] = useState(initialScore);
  const [isManualOverride, setIsManualOverride] = useState(scoringMode === 'manual');

  if (!isOpen) return null;

  const getVerdict = (s: number) => {
    if (s >= 95) return 'FENOMENAL! A CASA VEIO ABAIXO!';
    if (s >= 88) return 'SHOW ESPETACULAR! VOCAL AFINADÍSSIMO!';
    if (s >= 75) return 'MUITO BOM! MUITA ENERGIA NO PALCO!';
    return 'VALEU PELA CORAGEM E ANIMAÇÃO!';
  };

  const handleConfirm = () => {
    onSaveScore(score);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-lg bg-neutral-900 border border-neutral-800 rounded-2xl p-6 sm:p-8 shadow-2xl relative text-center">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-neutral-400 hover:text-white p-1 rounded-lg"
          aria-label="Fechar"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="inline-flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">
          <Award className="w-4 h-4" />
          <span>Fim da Apresentação</span>
        </div>

        <h2 className="text-2xl font-bold font-display text-white">
          PARABÉNS, {singerName.toUpperCase()}!
        </h2>
        <p className="text-xs text-neutral-400 mt-0.5 mb-6">
          {songTitle} · {artist}
        </p>

        {/* Big Score Display */}
        <div className="py-6 px-4 bg-neutral-950 border border-neutral-800 rounded-2xl mb-6 relative overflow-hidden">
          <div className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest mb-1">
            Pontuação Oficial
          </div>

          <div className="text-6xl sm:text-7xl font-extrabold font-mono text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-fuchsia-400 to-cyan-400 tabular-nums">
            {score}
          </div>

          <div className="mt-3 text-xs font-bold text-amber-300 tracking-wide flex items-center justify-center gap-1.5">
            <Sparkles className="w-4 h-4" />
            <span>{getVerdict(score)}</span>
          </div>

          <div className="mt-2 text-[10px] text-neutral-500">
            *Pontuação com caráter estritamente recreativo e de entretenimento.
          </div>
        </div>

        {/* Breakdown Indicators */}
        <div className="grid grid-cols-3 gap-3 mb-6 text-xs">
          <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800">
            <Mic className="w-4 h-4 text-cyan-400 mx-auto mb-1" />
            <div className="text-[10px] text-neutral-400">Vocal</div>
            <div className="text-base font-bold font-mono text-white">{vocalScore}%</div>
          </div>

          <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800">
            <Flame className="w-4 h-4 text-rose-400 mx-auto mb-1" />
            <div className="text-[10px] text-neutral-400">Energia</div>
            <div className="text-base font-bold font-mono text-white">{energyScore}%</div>
          </div>

          <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800">
            <Users className="w-4 h-4 text-amber-400 mx-auto mb-1" />
            <div className="text-[10px] text-neutral-400">Plateia</div>
            <div className="text-base font-bold font-mono text-white">+{reactionsCount}</div>
          </div>
        </div>

        {/* Manual adjustment toggle */}
        <div className="mb-6 p-3 bg-neutral-950/60 border border-neutral-800/80 rounded-xl text-left">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="text-neutral-400">Modo de Avaliação: <strong className="text-white capitalize">{scoringMode}</strong></span>
            <button
              onClick={() => setIsManualOverride(!isManualOverride)}
              className="text-cyan-400 text-[11px] hover:underline"
            >
              {isManualOverride ? 'Ocultar ajuste' : 'Ajustar nota manualmente'}
            </button>
          </div>

          {isManualOverride && (
            <div className="pt-2 border-t border-neutral-800">
              <div className="flex justify-between text-xs text-neutral-400 mb-1">
                <span>Nota personalizada:</span>
                <span className="font-mono font-bold text-white">{score}</span>
              </div>
              <input
                type="range"
                min="50"
                max="100"
                value={score}
                onChange={(e) => setScore(Number(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer"
              />
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => {
              onClose();
              onOpenPhotoCapture();
            }}
            className="flex-1 py-3 px-4 rounded-xl bg-fuchsia-600 hover:bg-fuchsia-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md shadow-fuchsia-600/20"
          >
            <Camera className="w-4 h-4" />
            <span>FOTO DO CANTOR</span>
          </button>

          <button
            onClick={() => {
              handleConfirm();
              onNextSinger();
            }}
            className="flex-1 py-3 px-4 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-neutral-950 font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md shadow-cyan-500/20"
          >
            <span>CHAMAR PRÓXIMO</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
