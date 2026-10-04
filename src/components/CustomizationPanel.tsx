import React, { useState } from 'react';
import {
  Palette,
  Building,
  Image,
  Tv,
  Keyboard,
  Sparkles,
  CheckCircle2,
  Save,
  RotateCcw
} from 'lucide-react';
import { SystemSettings, ScoringMode } from '../types';

interface CustomizationPanelProps {
  settings: SystemSettings;
  onSaveSettings: (settings: Partial<SystemSettings>) => void;
}

export const CustomizationPanel: React.FC<CustomizationPanelProps> = ({
  settings,
  onSaveSettings
}) => {
  const [establishmentName, setEstablishmentName] = useState(settings.establishmentName);
  const [logoUrl, setLogoUrl] = useState(settings.logoUrl || '');
  const [neonTheme, setNeonTheme] = useState(settings.neonTheme);
  const [backgroundStyle, setBackgroundStyle] = useState(settings.backgroundStyle);
  const [scoringMode, setScoringMode] = useState<ScoringMode>(settings.scoringMode);
  const [photoCaptureEnabled, setPhotoCaptureEnabled] = useState(settings.photoCaptureEnabled);
  const [autoDjEnabled, setAutoDjEnabled] = useState(settings.autoDjEnabled);
  const [publicScreenWatermark, setPublicScreenWatermark] = useState(settings.publicScreenWatermark);
  const [intermissionSeconds, setIntermissionSeconds] = useState(settings.intermissionSeconds);

  // Shortcuts
  const [playPauseKey, setPlayPauseKey] = useState(settings.shortcuts?.playPause || 'Space');
  const [nextKey, setNextKey] = useState(settings.shortcuts?.next || 'Enter');
  const [stopKey, setStopKey] = useState(settings.shortcuts?.stop || 'Escape');

  const [savedSuccess, setSavedSuccess] = useState(false);

  const neonColors = [
    { id: 'cyan', name: 'Electric Cyan', hex: '#06b6d4', ring: 'ring-cyan-400' },
    { id: 'fuchsia', name: 'Cyber Magenta', hex: '#d946ef', ring: 'ring-fuchsia-400' },
    { id: 'emerald', name: 'Emerald Stage', hex: '#10b981', ring: 'ring-emerald-400' },
    { id: 'amber', name: 'Golden Glow', hex: '#f59e0b', ring: 'ring-amber-400' },
    { id: 'violet', name: 'Neon Purple', hex: '#8b5cf6', ring: 'ring-violet-400' }
  ];

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSettings({
      establishmentName,
      logoUrl,
      neonTheme: neonTheme as any,
      backgroundStyle,
      scoringMode,
      photoCaptureEnabled,
      autoDjEnabled,
      publicScreenWatermark,
      intermissionSeconds: Number(intermissionSeconds),
      shortcuts: {
        ...settings.shortcuts,
        playPause: playPauseKey,
        next: nextKey,
        stop: stopKey
      }
    });

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-800">
        <div>
          <h2 className="text-xl font-bold font-display text-white flex items-center gap-2">
            <Palette className="w-5 h-5 text-cyan-400" />
            <span>Personalização do Sistema & Identidade Visual</span>
          </h2>
          <p className="text-xs text-neutral-400 mt-0.5">
            Configure o nome do seu bar, logotipo, paleta neon, animações e atalhos de teclado
          </p>
        </div>

        {savedSuccess && (
          <div className="px-3.5 py-1.5 rounded-lg bg-emerald-950/80 border border-emerald-800 text-emerald-300 text-xs font-semibold flex items-center gap-1.5 animate-fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Configurações salvas com sucesso!</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Live Preview Bar */}
        <div className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800">
          <div className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2">
            Pré-Visualização na Tela Pública (TV)
          </div>
          <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-neutral-950 text-sm shadow-lg"
                style={{
                  backgroundColor: neonColors.find((c) => c.id === neonTheme)?.hex || '#06b6d4'
                }}
              >
                K5
              </div>
              <div>
                <div className="text-base font-extrabold text-white font-display">
                  {establishmentName || 'KARAOKÊ SHOW BAR'}
                </div>
                <div className="text-xs text-neutral-400">
                  {publicScreenWatermark ? 'Powered by KARAOKÊ 5.0' : 'Sessão Exclusiva'}
                </div>
              </div>
            </div>

            <div className="text-right">
              <div className="text-[10px] text-neutral-400">TEMA ATIVO</div>
              <div
                className="text-xs font-bold uppercase"
                style={{
                  color: neonColors.find((c) => c.id === neonTheme)?.hex || '#06b6d4'
                }}
              >
                {neonTheme}
              </div>
            </div>
          </div>
        </div>

        {/* Brand & Name */}
        <div className="p-5 rounded-2xl bg-neutral-900/60 border border-neutral-800 space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Building className="w-4 h-4 text-cyan-400" />
            <span>Identidade do Bar ou Evento</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-neutral-300 mb-1">
                Nome do Estabelecimento / Festa
              </label>
              <input
                type="text"
                value={establishmentName}
                onChange={(e) => setEstablishmentName(e.target.value)}
                placeholder="Ex: Bar XYZ & Lounge"
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="block font-semibold text-neutral-300 mb-1">
                URL da Logomarca (Opcional)
              </label>
              <input
                type="url"
                value={logoUrl}
                onChange={(e) => setLogoUrl(e.target.value)}
                placeholder="https://exemplo.com/logo.png"
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-400"
              />
            </div>
          </div>
        </div>

        {/* Neon Theme Selector */}
        <div className="p-5 rounded-2xl bg-neutral-900/60 border border-neutral-800 space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-fuchsia-400" />
            <span>Paleta de Cores Neon</span>
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {neonColors.map((color) => {
              const isSelected = neonTheme === color.id;
              return (
                <button
                  key={color.id}
                  type="button"
                  onClick={() => setNeonTheme(color.id as any)}
                  className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center gap-2 ${
                    isSelected
                      ? 'bg-neutral-800 border-neutral-600 shadow-md ring-2 ring-cyan-400/50'
                      : 'bg-neutral-950 border-neutral-800/80 hover:border-neutral-700'
                  }`}
                >
                  <div
                    className="w-8 h-8 rounded-full shadow-lg"
                    style={{ backgroundColor: color.hex }}
                  />
                  <span className="text-xs font-semibold text-white">{color.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Public Screen & Countdown Settings */}
        <div className="p-5 rounded-2xl bg-neutral-900/60 border border-neutral-800 space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Tv className="w-4 h-4 text-amber-400" />
            <span>Configurações da Tela Pública (TV / Projetor)</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-neutral-300 mb-1">
                Tempo de Espera Entre Cantores (segundos)
              </label>
              <input
                type="number"
                min="3"
                max="30"
                value={intermissionSeconds}
                onChange={(e) => setIntermissionSeconds(Number(e.target.value))}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-neutral-300 mb-1">
                Modo Padrão de Pontuação
              </label>
              <select
                value={scoringMode}
                onChange={(e) => setScoringMode(e.target.value as any)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-2.5 py-2 text-white focus:outline-none"
              >
                <option value="auto">Automático (Vocal + Plateia)</option>
                <option value="microphone">Microfone (Análise de Frequência)</option>
                <option value="crowd">Plateia (Baseado em Reações)</option>
                <option value="random">Aleatório Divertido</option>
                <option value="manual">Manual (Definido pelo Operador)</option>
              </select>
            </div>

            <div className="flex flex-col justify-end space-y-2 pt-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={photoCaptureEnabled}
                  onChange={(e) => setPhotoCaptureEnabled(e.target.checked)}
                  className="w-4 h-4 accent-cyan-400 rounded"
                />
                <span className="text-neutral-300 font-semibold">Ativar Modo Foto do Cantor</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={publicScreenWatermark}
                  onChange={(e) => setPublicScreenWatermark(e.target.checked)}
                  className="w-4 h-4 accent-cyan-400 rounded"
                />
                <span className="text-neutral-300 font-semibold">Exibir Logo Karaokê 5.0 na TV</span>
              </label>
            </div>
          </div>
        </div>

        {/* Keyboard Shortcuts */}
        <div className="p-5 rounded-2xl bg-neutral-900/60 border border-neutral-800 space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Keyboard className="w-4 h-4 text-emerald-400" />
            <span>Atalhos de Teclado Personalizados</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-neutral-300 mb-1">Play / Pausar</label>
              <input
                type="text"
                value={playPauseKey}
                onChange={(e) => setPlayPauseKey(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-white font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold text-neutral-300 mb-1">Próxima Música</label>
              <input
                type="text"
                value={nextKey}
                onChange={(e) => setNextKey(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-white font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold text-neutral-300 mb-1">Parar (Stop)</label>
              <input
                type="text"
                value={stopKey}
                onChange={(e) => setStopKey(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-white font-mono"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="w-full sm:w-auto px-6 py-3 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-neutral-950 font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md shadow-cyan-500/25"
        >
          <Save className="w-4 h-4" />
          <span>SALVAR TODAS AS PERSONALIZAÇÕES</span>
        </button>
      </form>
    </div>
  );
};
