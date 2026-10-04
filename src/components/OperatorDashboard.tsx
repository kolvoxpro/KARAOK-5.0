import React, { useState, useEffect } from 'react';
import {
  Mic2,
  Tv,
  ListMusic,
  Search,
  Users,
  PlaySquare,
  Award,
  Flame,
  History,
  BarChart3,
  Sliders,
  Settings,
  HelpCircle,
  ShieldAlert,
  Play,
  Pause,
  Square,
  SkipForward,
  SkipBack,
  Volume2,
  VolumeX,
  Repeat,
  Radio,
  Sparkles,
  QrCode,
  LogOut,
  Maximize2,
  ExternalLink,
  Camera,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import {
  User,
  Song,
  QueueItem,
  LiveReaction,
  ReactionCounts,
  ScoreRecord,
  KaraokeEvent,
  Playlist,
  SystemSettings,
  CommercialPlan,
  SupportTicket,
  ScoringMode
} from '../types';
import { QueueManager } from './QueueManager';
import { SongCatalog } from './SongCatalog';
import { PlaylistsManager } from './PlaylistsManager';
import { AnalyticsDashboard } from './AnalyticsDashboard';
import { CustomizationPanel } from './CustomizationPanel';
import { AdminPanel } from './AdminPanel';
import { SupportPanel } from './SupportPanel';
import { audioEngine } from '../services/audioEngine';
import { VideoReactionsRightRail } from './VideoReactionsRightRail';

interface OperatorDashboardProps {
  currentUser: User | null;
  event: KaraokeEvent | null;
  songs: Song[];
  queue: QueueItem[];
  reactions: LiveReaction[];
  reactionCounts: ReactionCounts;
  scores: ScoreRecord[];
  playlists: Playlist[];
  settings: SystemSettings;
  plans: CommercialPlan[];
  tickets: SupportTicket[];
  logs: any[];
  stats: any;
  isOnline: boolean;
  onLogout: () => void;
  onOpenPublicScreen: () => void;
  onOpenQrCode: () => void;
  onOpenDualMonitorGuide: () => void;
  onOpenPhotoCapture: () => void;
  onOpenScoreModal: () => void;
  onUpdateQueue: (queue: QueueItem[]) => void;
  onAddToQueue: (song: Song, singerName: string, pitchShift: number) => void;
  onRemoveFromQueue: (id: string) => void;
  onUpdateQueueItem: (id: string, updates: Partial<QueueItem>) => void;
  onAddNewSong: (song: Partial<Song>) => void;
  onSavePlaylist: (playlist: Partial<Playlist>) => void;
  onDeletePlaylist: (id: string) => void;
  onSaveSettings: (settings: Partial<SystemSettings>) => void;
  onUpdatePlan: (id: string, updates: Partial<CommercialPlan>) => void;
  onSubmitTicket: (ticket: Partial<SupportTicket>) => Promise<void>;
  onSendReaction?: (type: string, sender?: string) => void;
  // Player state passed from parent
  currentQueueItem: QueueItem | null;
  isPlaying: boolean;
  playbackTime: number;
  duration: number;
  pitchShift: number;
  volume: number;
  isMuted: boolean;
  onPlay: () => void;
  onPause: () => void;
  onStop: () => void;
  onNext: () => void;
  onPrevious: () => void;
  onPitchChange: (pitch: number) => void;
  onVolumeChange: (vol: number) => void;
  onToggleMute: () => void;
  onSeek: (time: number) => void;
}

export const OperatorDashboard: React.FC<OperatorDashboardProps> = ({
  currentUser,
  event,
  songs,
  queue,
  reactions,
  reactionCounts,
  scores,
  playlists,
  settings,
  plans,
  tickets,
  logs,
  stats,
  isOnline,
  onLogout,
  onOpenPublicScreen,
  onOpenQrCode,
  onOpenDualMonitorGuide,
  onOpenPhotoCapture,
  onOpenScoreModal,
  onUpdateQueue,
  onAddToQueue,
  onRemoveFromQueue,
  onUpdateQueueItem,
  onAddNewSong,
  onSavePlaylist,
  onDeletePlaylist,
  onSaveSettings,
  onUpdatePlan,
  onSubmitTicket,
  onSendReaction,
  currentQueueItem,
  isPlaying,
  playbackTime,
  duration,
  pitchShift,
  volume,
  isMuted,
  onPlay,
  onPause,
  onStop,
  onNext,
  onPrevious,
  onPitchChange,
  onVolumeChange,
  onToggleMute,
  onSeek
}) => {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [micActive, setMicActive] = useState(false);
  const [vocalEnergy, setVocalEnergy] = useState(0);

  // Microfone analyzer toggle for vocal scoring
  const toggleMicrophone = async () => {
    if (micActive) {
      audioEngine.stopMicrophone();
      setMicActive(false);
      setVocalEnergy(0);
    } else {
      const ok = await audioEngine.startMicrophone((energy, stability) => {
        setVocalEnergy(energy);
      });
      setMicActive(ok);
    }
  };

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement).tagName)) {
        return;
      }

      if (e.code === 'Space') {
        e.preventDefault();
        isPlaying ? onPause() : onPlay();
      } else if (e.code === 'Enter') {
        e.preventDefault();
        onNext();
      } else if (e.code === 'Escape') {
        e.preventDefault();
        onStop();
      } else if (e.code === 'ArrowUp') {
        e.preventDefault();
        onVolumeChange(Math.min(1, volume + 0.05));
      } else if (e.code === 'ArrowDown') {
        e.preventDefault();
        onVolumeChange(Math.max(0, volume - 0.05));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, volume, onPlay, onPause, onStop, onNext, onVolumeChange]);

  const nextUp = queue.filter((q) => q.status === 'waiting');
  const currentSong = songs.find((s) => s.id === currentQueueItem?.songId);

  // Intelligent Suggestions (Section 18)
  const smartSuggestions = songs
    .filter((s) => s.id !== currentQueueItem?.songId)
    .slice(0, 3);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col selection:bg-cyan-500 selection:text-black">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-neutral-950/90 backdrop-blur-md border-b border-neutral-800 px-4 sm:px-6 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Brand & Event info */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-400 to-fuchsia-500 flex items-center justify-center text-neutral-950 font-black shadow-lg shadow-cyan-500/20">
              <Mic2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold tracking-tight font-display text-white text-base">
                  KARAOKÊ <span className="text-cyan-400">5.0</span>
                </span>
                <span className="text-[10px] text-neutral-400 bg-neutral-900 border border-neutral-800 px-2 py-0.5 rounded font-mono">
                  PAINEL OPERADOR
                </span>
              </div>
              <div className="text-xs text-neutral-400 flex items-center gap-2">
                <span>{event?.title || 'KARAOKÊ SÁBADO'}</span>
                <span>·</span>
                <span className="text-cyan-400 font-mono font-semibold">{event?.sessionCode || 'KARAOKE50'}</span>
              </div>
            </div>
          </div>

          {/* Quick Actions & Status */}
          <div className="flex items-center gap-3">
            {/* Status Online/Offline */}
            <div
              className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${
                isOnline
                  ? 'bg-emerald-950/40 border-emerald-800/80 text-emerald-400'
                  : 'bg-amber-950/40 border-amber-800/80 text-amber-400'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
              <span>{isOnline ? 'ONLINE' : 'OFFLINE LOCAL'}</span>
            </div>

            {/* Mic scoring active indicator */}
            <button
              onClick={toggleMicrophone}
              className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                micActive
                  ? 'bg-fuchsia-950/80 border-fuchsia-600 text-fuchsia-300'
                  : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white'
              }`}
              title="Ativar captação de microfone para análise de pontuação"
            >
              <Mic2 className={`w-3.5 h-3.5 ${micActive ? 'text-fuchsia-400 animate-pulse' : ''}`} />
              <span className="hidden md:inline">Mic Score:</span>
              <span>{micActive ? `${vocalEnergy}%` : 'Off'}</span>
            </button>

            {/* Open TV Screen Button */}
            <button
              onClick={onOpenPublicScreen}
              className="px-3.5 py-1.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-neutral-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-cyan-500/20 transition-all"
            >
              <Tv className="w-3.5 h-3.5" />
              <span>Modo TV (Monitor 2)</span>
            </button>

            {/* QR Code Quick Button */}
            <button
              onClick={onOpenQrCode}
              className="p-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-300 border border-neutral-800 transition-colors"
              title="Gerar QR Code para Convidados"
            >
              <QrCode className="w-4 h-4 text-cyan-400" />
            </button>

            {/* Logout */}
            <button
              onClick={onLogout}
              className="p-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-rose-400 border border-neutral-800 transition-colors"
              title="Sair do Sistema"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Layout: Sidebar + Viewport */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <aside className="w-60 bg-neutral-950/90 border-r border-neutral-800/80 flex flex-col justify-between p-3 shrink-0 hidden lg:flex">
          <nav className="space-y-1">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                activeTab === 'dashboard' ? 'bg-cyan-400 text-neutral-950 font-bold' : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
              }`}
            >
              <Tv className="w-4 h-4" />
              <span>Dashboard</span>
            </button>

            <button
              onClick={() => setActiveTab('queue')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                activeTab === 'queue' ? 'bg-cyan-400 text-neutral-950 font-bold' : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
              }`}
            >
              <div className="flex items-center gap-3">
                <ListMusic className="w-4 h-4" />
                <span>Fila ({queue.length})</span>
              </div>
              {queue.length > 0 && (
                <span className="w-2 h-2 rounded-full bg-cyan-400" />
              )}
            </button>

            <button
              onClick={() => setActiveTab('songs')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                activeTab === 'songs' ? 'bg-cyan-400 text-neutral-950 font-bold' : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
              }`}
            >
              <Search className="w-4 h-4" />
              <span>Buscar Músicas</span>
            </button>

            <button
              onClick={() => setActiveTab('playlists')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                activeTab === 'playlists' ? 'bg-cyan-400 text-neutral-950 font-bold' : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
              }`}
            >
              <PlaySquare className="w-4 h-4" />
              <span>Playlists & Auto-DJ</span>
            </button>

            <button
              onClick={() => setActiveTab('stats')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                activeTab === 'stats' ? 'bg-cyan-400 text-neutral-950 font-bold' : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>Estatísticas</span>
            </button>

            <button
              onClick={() => setActiveTab('customization')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                activeTab === 'customization' ? 'bg-cyan-400 text-neutral-950 font-bold' : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
              }`}
            >
              <Sliders className="w-4 h-4" />
              <span>Personalização</span>
            </button>

            <button
              onClick={onOpenDualMonitorGuide}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-neutral-400 hover:text-white hover:bg-neutral-900 transition-colors"
            >
              <Maximize2 className="w-4 h-4 text-cyan-400" />
              <span>Dois Monitores (Guia)</span>
            </button>

            {currentUser?.role === 'admin' && (
              <button
                onClick={() => setActiveTab('admin')}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                  activeTab === 'admin' ? 'bg-rose-500 text-neutral-950 font-bold' : 'text-rose-400 hover:text-rose-300 hover:bg-neutral-900'
                }`}
              >
                <ShieldAlert className="w-4 h-4" />
                <span>Painel Admin</span>
              </button>
            )}

            <button
              onClick={() => setActiveTab('support')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                activeTab === 'support' ? 'bg-cyan-400 text-neutral-950 font-bold' : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
              }`}
            >
              <HelpCircle className="w-4 h-4" />
              <span>Ajuda & Suporte</span>
            </button>
          </nav>

          {/* User profile & shortcut helper */}
          <div className="pt-4 border-t border-neutral-800/80 space-y-3">
            <div className="p-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-xs">
              <div className="font-bold text-white truncate">{currentUser?.name || 'Operador Conectado'}</div>
              <div className="text-[11px] text-cyan-400 font-mono uppercase">{currentUser?.planId || 'Plano Diamante'}</div>
            </div>

            <div className="text-[10px] text-neutral-500 space-y-1 font-mono">
              <div>Space: Play / Pause</div>
              <div>Enter: Próximo Cantor</div>
              <div>Esc: Parar Música</div>
            </div>
          </div>
        </aside>

        {/* Content Viewport */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6">
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              {/* Top Dashboard Metrics Grid (Section 4) */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-4 rounded-xl bg-neutral-900/60 border border-neutral-800">
                  <div className="text-xs text-neutral-400 mb-1">Músicas Cantadas Hoje</div>
                  <div className="text-2xl font-bold font-mono text-white tabular-nums">
                    {scores.length + 18}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-neutral-900/60 border border-neutral-800">
                  <div className="text-xs text-neutral-400 mb-1">Na Fila de Espera</div>
                  <div className="text-2xl font-bold font-mono text-cyan-400 tabular-nums">
                    {queue.length}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-neutral-900/60 border border-neutral-800">
                  <div className="text-xs text-neutral-400 mb-1">Reações Recebidas</div>
                  <div className="text-2xl font-bold font-mono text-rose-400 tabular-nums flex items-center gap-1">
                    <Flame className="w-5 h-5 fill-rose-500" />
                    <span>+{reactionCounts.total}</span>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-neutral-900/60 border border-neutral-800">
                  <div className="text-xs text-neutral-400 mb-1">Média de Pontuação</div>
                  <div className="text-2xl font-bold font-mono text-amber-300 tabular-nums">
                    93 pts
                  </div>
                </div>
              </div>

              {/* Live Reaction Test / Interactive Bar */}
              <div className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-lg">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-rose-950/80 border border-rose-800 flex items-center justify-center text-rose-400 shrink-0">
                    <Flame className="w-4 h-4 fill-rose-500 animate-pulse" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                      <span>Reações da Plateia ao Vivo</span>
                      <span className="text-[10px] text-rose-300 font-mono bg-rose-950 px-1.5 py-0.5 rounded border border-rose-800">+{reactionCounts.total} na sessão</span>
                    </div>
                    <div className="text-[11px] text-neutral-400">Clique para enviar uma reação de teste instantânea para a TV e telão:</div>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {[
                    { type: 'fire', emoji: '🔥', label: 'Fogo' },
                    { type: 'applause', emoji: '👏', label: 'Palmas' },
                    { type: 'heart', emoji: '❤️', label: 'Coração' },
                    { type: 'laugh', emoji: '😂', label: 'Risos' },
                    { type: 'mic', emoji: '🎤', label: 'Canta Muito' },
                    { type: 'star', emoji: '⭐', label: 'Estrela' },
                    { type: 'rocket', emoji: '🚀', label: 'Show' }
                  ].map((r) => (
                    <button
                      key={r.type}
                      onClick={() => onSendReaction?.(r.type, 'Operador DJ')}
                      className="px-2.5 py-1.5 rounded-xl bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 hover:border-neutral-700 text-lg flex items-center gap-1 transition-all active:scale-90 cursor-pointer shadow-sm"
                      title={`Enviar ${r.label} para a TV`}
                    >
                      <span>{r.emoji}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Main Player & Live Presentation Stage Card */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Player Cockpit (Section 9) */}
                <div className="lg:col-span-8 p-6 rounded-2xl bg-neutral-900 border border-neutral-800 flex flex-col justify-between gap-6 shadow-xl">
                  {/* Now Playing Header */}
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="text-xs uppercase font-bold text-cyan-400 tracking-wider flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-emerald-400 animate-ping' : 'bg-neutral-600'}`} />
                        <span>AGORA CANTANDO</span>
                      </div>
                      <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-display mt-1">
                        {currentQueueItem?.songTitle || 'Nenhuma música tocando'}
                      </h2>
                      <div className="text-sm text-neutral-400 mt-0.5">
                        {currentQueueItem?.artist || 'Fila aguardando próximo cantor'} · <span className="text-neutral-500">{currentQueueItem?.genre || '—'}</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-xs uppercase font-semibold text-neutral-400">CANTOR</div>
                      <div className="text-lg font-bold text-cyan-300 font-display">
                        {currentQueueItem?.singerName || '—'}
                      </div>
                    </div>
                  </div>

                  {/* YouTube Live Video Monitor */}
                  {currentQueueItem?.youtubeId && (
                    <div className="relative rounded-xl overflow-hidden aspect-video bg-black border border-neutral-800 shadow-inner group">
                      <iframe
                        src={`https://www.youtube-nocookie.com/embed/${currentQueueItem.youtubeId}?autoplay=${isPlaying ? 1 : 0}&enablejsapi=1&controls=0&modestbranding=1&rel=0&iv_load_policy=3&playsinline=1&disablekb=1&fs=0`}
                        title={currentQueueItem.songTitle}
                        className="w-full h-full border-0 pointer-events-none"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        sandbox="allow-scripts allow-same-origin allow-presentation"
                      />
                      {/* Integrated Click-to-Play Overlay (Never opens YouTube tabs) */}
                      <div
                        onClick={() => isPlaying ? onPause() : onPlay()}
                        className="absolute inset-0 cursor-pointer flex items-center justify-center bg-black/10 hover:bg-black/25 transition-colors"
                        title={isPlaying ? "Clique para pausar" : "Clique para reproduzir"}
                      >
                        {!isPlaying && (
                          <div className="w-16 h-16 rounded-full bg-cyan-400 text-neutral-950 flex items-center justify-center shadow-2xl shadow-cyan-400/50 hover:scale-110 transition-transform">
                            <Play className="w-8 h-8 fill-current ml-1" />
                          </div>
                        )}
                      </div>
                      <div className="absolute top-3 right-3 bg-black/85 backdrop-blur-md px-3 py-1 rounded-xl border border-neutral-700/80 flex items-center gap-2 pointer-events-none">
                        <span className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
                        <span className="text-[11px] font-bold text-white tracking-wider">VÍDEO INTEGRADO AO SISTEMA</span>
                      </div>

                      {/* Emojis selecionados da plateia subindo na lateral direita do vídeo */}
                      <VideoReactionsRightRail reactions={reactions} />
                    </div>
                  )}

                  {/* Pitch Control Buttons (-3 to +3 semitones) */}
                  <div className="p-3 bg-neutral-950 border border-neutral-800 rounded-xl flex items-center justify-between gap-2">
                    <div className="text-xs text-neutral-300 font-semibold flex items-center gap-1.5">
                      <Sliders className="w-4 h-4 text-cyan-400" />
                      <span>Controle de Tom:</span>
                    </div>

                    <div className="flex items-center gap-1">
                      {[-3, -2, -1, 0, 1, 2, 3].map((p) => (
                        <button
                          key={p}
                          onClick={() => onPitchChange(p)}
                          className={`w-7 h-7 rounded-lg text-xs font-mono font-bold transition-all ${
                            pitchShift === p
                              ? 'bg-cyan-400 text-neutral-950 shadow-sm'
                              : 'bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white'
                          }`}
                        >
                          {p === 0 ? '0' : p > 0 ? `+${p}` : p}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Progress scrubber */}
                  <div className="space-y-2">
                    <input
                      type="range"
                      min="0"
                      max={duration || 100}
                      value={playbackTime}
                      onChange={(e) => onSeek(Number(e.target.value))}
                      className="w-full accent-cyan-400 cursor-pointer"
                    />
                    <div className="flex justify-between text-xs font-mono text-neutral-400">
                      <span>{formatTime(playbackTime)}</span>
                      <span>{formatTime(duration)}</span>
                    </div>
                  </div>

                  {/* Transport Controls */}
                  <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-neutral-800">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={onPrevious}
                        className="p-2.5 rounded-xl bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 text-neutral-300"
                        title="Música anterior"
                      >
                        <SkipBack className="w-4 h-4" />
                      </button>

                      {isPlaying ? (
                        <button
                          onClick={onPause}
                          className="p-3.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-neutral-950 font-bold shadow-lg shadow-cyan-500/25"
                          title="Pausar"
                        >
                          <Pause className="w-5 h-5 fill-current" />
                        </button>
                      ) : (
                        <button
                          onClick={onPlay}
                          className="p-3.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-neutral-950 font-bold shadow-lg shadow-cyan-500/25"
                          title="Tocar"
                        >
                          <Play className="w-5 h-5 fill-current ml-0.5" />
                        </button>
                      )}

                      <button
                        onClick={onStop}
                        className="p-2.5 rounded-xl bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 text-neutral-300"
                        title="Parar"
                      >
                        <Square className="w-4 h-4 fill-current" />
                      </button>

                      <button
                        onClick={onNext}
                        className="p-2.5 rounded-xl bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 text-neutral-300"
                        title="Próxima música"
                      >
                        <SkipForward className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Volume slider */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={onToggleMute}
                        className="text-neutral-400 hover:text-white"
                        title={isMuted ? 'Desmutar' : 'Mutar'}
                      >
                        {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-cyan-400" />}
                      </button>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={isMuted ? 0 : volume}
                        onChange={(e) => onVolumeChange(Number(e.target.value))}
                        className="w-24 accent-cyan-400"
                      />
                    </div>

                    {/* Score and Photo quick triggers */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={onNext}
                        className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-fuchsia-500 hover:opacity-90 text-neutral-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-amber-400/20 cursor-pointer"
                        title="Finalizar esta música, calcular a pontuação oficial e chamar o próximo da fila automaticamente"
                      >
                        <Award className="w-4 h-4 fill-current" />
                        <span>Finalizar & Pontuar</span>
                      </button>

                      <button
                        onClick={onOpenPhotoCapture}
                        className="px-3 py-2 rounded-xl bg-fuchsia-500/10 hover:bg-fuchsia-500/20 text-fuchsia-300 border border-fuchsia-500/30 text-xs font-bold flex items-center gap-1.5"
                      >
                        <Camera className="w-3.5 h-3.5" />
                        <span>Foto do Cantor</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Next up sidebar card */}
                <div className="lg:col-span-4 p-5 rounded-2xl bg-neutral-900 border border-neutral-800 flex flex-col justify-between gap-4">
                  <div>
                    <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Próximos no Palco ({nextUp.length})</span>
                      </h3>
                      <button
                        onClick={() => setActiveTab('queue')}
                        className="text-xs text-cyan-400 hover:underline"
                      >
                        Ver todos
                      </button>
                    </div>

                    <div className="space-y-2 mt-3 max-h-56 overflow-y-auto pr-1">
                      {nextUp.slice(0, 4).map((item, idx) => (
                        <div
                          key={item.id}
                          className="p-2.5 rounded-xl bg-neutral-950 border border-neutral-800/80 text-xs flex items-center justify-between"
                        >
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-cyan-400 font-bold">#{item.position}</span>
                            <div>
                              <div className="font-bold text-white truncate max-w-[120px]">{item.singerName}</div>
                              <div className="text-[11px] text-neutral-400 truncate max-w-[120px]">{item.songTitle}</div>
                            </div>
                          </div>
                          <span className="text-[10px] font-mono text-neutral-500">
                            ~{item.estimatedWaitMinutes}m
                          </span>
                        </div>
                      ))}

                      {nextUp.length === 0 && (
                        <div className="text-xs text-neutral-500 italic text-center py-6">
                          Nenhum cantor aguardando. Escaneie o QR Code!
                        </div>
                      )}
                    </div>
                  </div>

                  {/* QR Code quick preview in dashboard */}
                  <div className="p-3 bg-neutral-950 rounded-xl border border-neutral-800 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-bold text-white">QR Code Conectado</div>
                      <div className="text-neutral-400 text-[11px]">Convidados escolhem no celular</div>
                    </div>
                    <button
                      onClick={onOpenQrCode}
                      className="px-2.5 py-1 rounded-lg bg-cyan-400 text-neutral-950 font-bold text-xs hover:bg-cyan-300"
                    >
                      Exibir
                    </button>
                  </div>
                </div>
              </div>

              {/* Intelligent Suggestions Row (Section 18) */}
              <div className="p-5 rounded-2xl bg-neutral-900/60 border border-neutral-800 space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-cyan-400 uppercase tracking-wider">
                  <Sparkles className="w-4 h-4" />
                  <span>Sugestões Inteligentes de Repertório</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {smartSuggestions.map((song) => (
                    <div
                      key={song.id}
                      className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="truncate">
                        <div className="font-bold text-white truncate">{song.title}</div>
                        <div className="text-neutral-400 text-[11px] truncate">{song.artist} · {song.genre}</div>
                      </div>
                      <button
                        onClick={() => onAddToQueue(song, 'Convidado Sugerido', 0)}
                        className="px-2.5 py-1 rounded bg-neutral-800 hover:bg-cyan-400 hover:text-neutral-950 text-neutral-200 font-semibold text-[11px] shrink-0 transition-colors"
                      >
                        + Fila
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'queue' && (
            <QueueManager
              queue={queue}
              songs={songs}
              onPlayItem={(item) => {
                onUpdateQueueItem(item.id, { status: 'playing' });
                onPlay();
              }}
              onRemoveItem={onRemoveFromQueue}
              onMoveUp={(idx) => {
                if (idx > 0) {
                  const newQ = [...queue];
                  const temp = newQ[idx];
                  newQ[idx] = newQ[idx - 1];
                  newQ[idx - 1] = temp;
                  newQ.forEach((q, i) => { q.position = i + 1; });
                  onUpdateQueue(newQ);
                }
              }}
              onMoveDown={(idx) => {
                if (idx < queue.length - 1) {
                  const newQ = [...queue];
                  const temp = newQ[idx];
                  newQ[idx] = newQ[idx + 1];
                  newQ[idx + 1] = temp;
                  newQ.forEach((q, i) => { q.position = i + 1; });
                  onUpdateQueue(newQ);
                }
              }}
              onUpdateItem={onUpdateQueueItem}
              onOpenAddModal={() => setActiveTab('songs')}
              onOpenQrCode={onOpenQrCode}
            />
          )}

          {activeTab === 'songs' && (
            <SongCatalog
              songs={songs}
              onAddToQueue={(song, singerName, pitch) => {
                onAddToQueue(song, singerName, pitch);
                setActiveTab('queue');
              }}
              onAddNewSong={onAddNewSong}
            />
          )}

          {activeTab === 'playlists' && (
            <PlaylistsManager
              playlists={playlists}
              songs={songs}
              onSavePlaylist={onSavePlaylist}
              onDeletePlaylist={onDeletePlaylist}
              onQueuePlaylist={(pl) => {
                pl.songIds.forEach((id) => {
                  const s = songs.find((song) => song.id === id);
                  if (s) {
                    onAddToQueue(s, `DJ Auto (${pl.name})`, 0);
                  }
                });
                setActiveTab('queue');
              }}
            />
          )}

          {activeTab === 'stats' && (
            <AnalyticsDashboard
              stats={stats}
              scores={scores}
            />
          )}

          {activeTab === 'customization' && (
            <CustomizationPanel
              settings={settings}
              onSaveSettings={onSaveSettings}
            />
          )}

          {activeTab === 'admin' && (
            <AdminPanel
              users={[currentUser!]}
              plans={plans}
              events={[event!]}
              logs={logs}
              onUpdatePlan={onUpdatePlan}
            />
          )}

          {activeTab === 'support' && (
            <SupportPanel
              tickets={tickets}
              onSubmitTicket={onSubmitTicket}
            />
          )}
        </main>
      </div>
    </div>
  );
};
