import React from 'react';
import { X, Monitor, Tv, ArrowRight, CheckCircle2, ExternalLink } from 'lucide-react';

interface DualMonitorGuideProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenPublicWindow: () => void;
}

export const DualMonitorGuide: React.FC<DualMonitorGuideProps> = ({
  isOpen,
  onClose,
  onOpenPublicWindow
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-xl bg-neutral-900 border border-neutral-800 rounded-2xl p-6 sm:p-8 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-neutral-400 hover:text-white p-1 rounded-lg"
          aria-label="Fechar"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="inline-flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-2">
          <Monitor className="w-4 h-4" />
          <span>Configuração Profissional</span>
        </div>

        <h2 className="text-2xl font-bold font-display text-white">
          Suporte a Dois Monitores (Dual Screen)
        </h2>
        <p className="text-xs text-neutral-400 mt-1 mb-6">
          Separe os controles do operador do show exibido na TV ou projetor do bar.
        </p>

        {/* Visual Diagram */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 text-center">
            <Monitor className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
            <div className="text-xs font-bold text-white uppercase tracking-wider">Monitor 1 (Operador)</div>
            <p className="text-[11px] text-neutral-400 mt-1">
              Fila, busca de músicas, volume, tom, notas e configurações secretas.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 text-center">
            <Tv className="w-8 h-8 text-fuchsia-400 mx-auto mb-2" />
            <div className="text-xs font-bold text-white uppercase tracking-wider">Monitor 2 (TV/Projetor)</div>
            <p className="text-[11px] text-neutral-400 mt-1">
              Letras sincronizadas, cantor atual, reações da plateia e QR Code.
            </p>
          </div>
        </div>

        {/* Instructions */}
        <div className="space-y-3 mb-6 text-xs text-neutral-300">
          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <span>
              <strong>Passo 1:</strong> Conecte sua TV ou projetor na saída HDMI ou DisplayPort do computador.
            </span>
          </div>

          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <span>
              <strong>Passo 2:</strong> No Windows, pressione <kbd className="px-1.5 py-0.5 bg-neutral-800 rounded font-mono text-[10px]">Win + P</kbd> e selecione a opção <strong>"Estender"</strong> (nunca duplicar).
            </span>
          </div>

          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <span>
              <strong>Passo 3:</strong> Clique no botão abaixo para abrir a <strong>Tela Pública</strong> em uma janela separada.
            </span>
          </div>

          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <span>
              <strong>Passo 4:</strong> Arraste a janela para a TV e pressione <kbd className="px-1.5 py-0.5 bg-neutral-800 rounded font-mono text-[10px]">F11</kbd> para tela cheia cinematográfica!
            </span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => {
              onOpenPublicWindow();
              onClose();
            }}
            className="flex-1 py-3 px-4 bg-cyan-400 hover:bg-cyan-300 text-neutral-950 font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow-md shadow-cyan-500/20"
          >
            <ExternalLink className="w-4 h-4" />
            <span>ABRIR TELA PÚBLICA (MONITOR 2)</span>
          </button>

          <button
            onClick={onClose}
            className="py-3 px-4 bg-neutral-800 hover:bg-neutral-700 text-white font-medium rounded-xl text-xs transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
