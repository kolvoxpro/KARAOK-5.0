import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import confetti from 'canvas-confetti';
import {
  Mic2,
  Flame,
  Award,
  Music2,
  Users,
  Maximize2,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Tv,
  Youtube
} from 'lucide-react';
import { QueueItem, Song, LiveReaction, SystemSettings, KaraokeEvent } from '../types';
import { VideoReactionsRightRail } from './VideoReactionsRightRail';
import { api } from '../services/api';

interface PublicScreenProps {
  currentQueueItem: QueueItem | null;
  currentSong: Song | null;
  nextQueueItems: QueueItem[];
  currentTime: number;
  duration: number;
  pitchShift: number;
  isPlaying: boolean;
  isIntermission: boolean;
  intermissionCountdown: number;
  showingScore: boolean;
  lastScoreData: {
    singerName: string;
    songTitle: string;
    finalScore: number;
    vocalScore?: number;
    energyScore?: number;
    crowdScore?: number;
    reactions: number;
  } | null;
  reactions: LiveReaction[];
  settings: SystemSettings;
  event: KaraokeEvent | null;
  onExitFullscreen?: () => void;
  onBack?: () => void;
}

export const PublicScreen: React.FC<PublicScreenProps> = ({
  currentQueueItem,
  currentSong,
  nextQueueItems,
  currentTime,
  duration,
  pitchShift,
  isPlaying,
  isIntermission,
  intermissionCountdown,
  showingScore,
  lastScoreData,
  reactions,
  settings,
  event,
  onBack
}) => {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [fullscreen, setFullscreen] = useState(false);

  const [publicBaseUrl, setPublicBaseUrl] = useState(() => {
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    if (origin && !origin.includes('localhost') && !origin.includes('127.0.0.1')) return origin;
    return 'https://ais-dev-zpcx6oattcp7qmjuiacmzl-855002600123.us-east1.run.app';
  });

  useEffect(() => {
    api.getNetworkInfo().then((info) => {
      if (info?.recommendedUrl) {
        setPublicBaseUrl(info.recommendedUrl);
      }
    });
  }, []);

  const sessionCode = event?.sessionCode || 'KARAOKE50';
  const mobileUrl = `${publicBaseUrl}?mode=mobile&session=${sessionCode}`;

  useEffect(() => {
    QRCode.toDataURL(mobileUrl, {
      width: 260,
      margin: 1,
      color: {
        dark: '#020617',
        light: '#ffffff'
      }
    })
      .then((url) => setQrDataUrl(url))
      .catch((err) => console.error(err));
  }, [mobileUrl]);

  // Trigger celebration confetti when score screen shows
  useEffect(() => {
    if (showingScore) {
      confetti({
        particleCount: 100,
        spread: 120,
        origin: { y: 0.6 }
      });
    }
  }, [showingScore]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setFullscreen(false)).catch(() => {});
    }
  };

  // Find active synchronized lyric if local song exists
  const lyrics = currentSong?.lyrics || [];
  let activeLyricIndex = -1;
  for (let i = 0; i < lyrics.length; i++) {
    if (currentTime >= lyrics[i].time) {
      activeLyricIndex = i;
    }
  }

  const currentLine = lyrics[activeLyricIndex]?.text || (currentQueueItem ? '♪ Acompanhe o vídeo e cante com o palco ♪' : 'Aguardando próxima música');
  const nextLine = lyrics[activeLyricIndex + 1]?.text || '';

  // Progress percentage
  const effectiveDuration = duration > 0 ? duration : (currentQueueItem?.duration || 210);
  const progressPercent = effectiveDuration > 0 ? Math.min(100, (currentTime / effectiveDuration) * 100) : 0;

  const formatSecs = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="relative w-screen h-screen bg-neutral-950 text-white overflow-hidden flex flex-col justify-between select-none">
      {/* Dynamic Animated Concert Backdrop */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-30">
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-cyan-600/30 blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-fuchsia-600/30 blur-3xl animate-pulse" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-indigo-950/20 blur-3xl" />
      </div>

      {/* Top Bar for TV/Projector */}
      <header className="relative z-10 px-8 py-4 flex items-center justify-between border-b border-neutral-800/80 bg-neutral-950/70 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-400 to-fuchsia-500 flex items-center justify-center text-neutral-950 font-black shadow-lg shadow-cyan-500/20">
            <Mic2 className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xl font-extrabold tracking-tight font-display text-white">
              {settings.establishmentName || 'KARAOKÊ 5.0'}
            </div>
            <div className="text-xs text-neutral-400 font-medium">
              {event?.title || 'Sessão Oficial ao Vivo'} · {event?.location || 'Palco Principal'}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {pitchShift !== 0 && (
            <div className="px-3 py-1 rounded-lg bg-indigo-950/80 border border-indigo-700/80 text-xs font-mono font-bold text-indigo-300">
              TOM {pitchShift > 0 ? `+${pitchShift}` : pitchShift}
            </div>
          )}

          <div className="flex items-center gap-2 bg-neutral-900/80 border border-neutral-800 px-3 py-1.5 rounded-xl text-xs">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            <span className="font-semibold text-neutral-300">TV 16:9 AO VIVO</span>
          </div>

          <button
            onClick={toggleFullscreen}
            className="p-2 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors cursor-pointer"
            title="Tela Cheia (F11)"
          >
            <Maximize2 className="w-4 h-4" />
          </button>

          <button
            onClick={() => {
              if (onBack) {
                onBack();
              } else if (window.history.length > 1) {
                window.history.back();
              } else {
                window.location.href = '/';
              }
            }}
            className="px-3.5 py-1.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-200 hover:text-white border border-neutral-700/80 hover:border-cyan-500/60 text-xs font-bold flex items-center gap-2 transition-all shadow-md group cursor-pointer"
            title="Voltar ao Painel do Operador"
          >
            <ArrowLeft className="w-4 h-4 text-cyan-400 group-hover:-translate-x-0.5 transition-transform" />
            <span>Voltar ao Operador</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center p-6 max-w-6xl mx-auto w-full text-center">
        {/* State A: Intermission Countdown / Announcing Next Singer */}
        {isIntermission ? (
          <div className="space-y-6 animate-fade-in max-w-2xl">
            <div className="inline-flex items-center gap-2 text-amber-400 text-sm font-bold uppercase tracking-wider">
              <Sparkles className="w-5 h-5" />
              <span>Prepare-se para o Próximo Show!</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-black font-display text-white">
              ENTRANDO NO PALCO EM...
            </h1>

            <div className="text-8xl sm:text-9xl font-black font-mono text-cyan-400 tracking-tighter tabular-nums drop-shadow-[0_0_35px_rgba(6,182,212,0.6)]">
              {intermissionCountdown}
            </div>

            {nextQueueItems[0] && (
              <div className="p-6 bg-neutral-900/90 border border-neutral-800 rounded-3xl shadow-2xl">
                <div className="text-xs uppercase text-cyan-400 font-bold tracking-widest mb-1.5">
                  PRÓXIMO CANTOR
                </div>
                <div className="text-3xl sm:text-4xl font-black text-white font-display">
                  {nextQueueItems[0].singerName}
                </div>
                <div className="text-lg text-neutral-300 mt-2">
                  Cantando: <strong className="text-fuchsia-400">{nextQueueItems[0].songTitle}</strong> ({nextQueueItems[0].artist})
                </div>
              </div>
            )}
          </div>
        ) : showingScore && lastScoreData ? (
          /* State B: Celebration Score Screen */
          <div className="space-y-6 animate-fade-in max-w-2xl">
            <div className="inline-flex items-center gap-2 text-amber-400 text-sm font-bold uppercase tracking-wider">
              <Award className="w-5 h-5" />
              <span>Show Finalizado!</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-black font-display text-white">
              PARABÉNS, {lastScoreData.singerName.toUpperCase()}!
            </h1>

            <div className="text-xl text-neutral-300 font-medium">
              {lastScoreData.songTitle}
            </div>

            <div className="py-6 px-12 bg-neutral-900/95 border border-neutral-800 rounded-3xl inline-block shadow-2xl shadow-cyan-950/50">
              <div className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-1">
                Pontuação Oficial
              </div>
              <div className="text-7xl sm:text-8xl font-black font-mono text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-fuchsia-400 to-cyan-400 tabular-nums">
                {lastScoreData.finalScore}
              </div>
              <div className="mt-2 text-sm font-bold text-rose-400 flex items-center justify-center gap-1.5">
                <Flame className="w-4 h-4 fill-rose-500" />
                <span>+{lastScoreData.reactions} REAÇÕES DA PLATEIA</span>
              </div>
            </div>

            {nextQueueItems[0] && (
              <div className="text-sm font-semibold text-neutral-400">
                A seguir: <strong className="text-white">{nextQueueItems[0].singerName}</strong> ({nextQueueItems[0].songTitle})
              </div>
            )}
          </div>
        ) : currentQueueItem ? (
          /* State C: Active Karaoke Performance */
          <div className="w-full flex flex-col justify-between h-full py-2 space-y-4 animate-fade-in">
            {/* Top Song & Singer Info */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-neutral-900/80 border border-neutral-800/80 shadow-lg">
              <div className="text-left">
                <div className="text-xs uppercase font-bold tracking-wider text-cyan-400 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
                  <span>AGORA CANTANDO</span>
                </div>
                <div className="text-2xl sm:text-3xl font-black font-display text-white">
                  {currentQueueItem.songTitle}
                </div>
                <div className="text-sm text-neutral-400 font-medium">
                  {currentQueueItem.artist} · <span className="text-neutral-500">{currentQueueItem.genre}</span>
                </div>
              </div>

              <div className="text-right">
                <div className="text-xs uppercase font-bold text-neutral-400 tracking-wider">CANTOR NO PALCO</div>
                <div className="text-xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-fuchsia-400 font-display">
                  {currentQueueItem.singerName}
                </div>
              </div>
            </div>

            {/* Real YouTube Video Player or Cinematic Large Lyrics */}
            {currentQueueItem.youtubeId ? (
              <div className="flex-1 w-full max-w-5xl mx-auto my-auto relative rounded-3xl overflow-hidden bg-black border border-neutral-800 shadow-2xl flex items-center justify-center min-h-[360px] max-h-[62vh] aspect-video">
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${currentQueueItem.youtubeId}?autoplay=1&enablejsapi=1&controls=0&modestbranding=1&rel=0&iv_load_policy=3&playsinline=1&disablekb=1&fs=0`}
                  title={currentQueueItem.songTitle}
                  className="w-full h-full border-0 pointer-events-none"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  sandbox="allow-scripts allow-same-origin allow-presentation"
                />
                <div className="absolute top-3 right-3 bg-black/80 backdrop-blur-md px-3 py-1 rounded-xl border border-neutral-700/80 flex items-center gap-2 pointer-events-none">
                  <Youtube className="w-3.5 h-3.5 text-rose-500" />
                  <span className="text-[11px] font-bold text-white tracking-wider">YOUTUBE KARAOKÊ OFICIAL</span>
                </div>

                {/* Lateral direita do vídeo: somente os emojis selecionados que subirem ao vivo */}
                <VideoReactionsRightRail reactions={reactions} />
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center space-y-5 px-4 my-auto relative w-full">
                <div className="text-3xl sm:text-5xl lg:text-6xl font-black font-display text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-300 to-amber-100 tracking-tight leading-snug drop-shadow-md">
                  "{currentLine}"
                </div>

                {nextLine && (
                  <div className="text-xl sm:text-2xl font-medium text-neutral-400/80 tracking-normal transition-all duration-300">
                    {nextLine}
                  </div>
                )}

                {/* Lateral direita do palco */}
                <VideoReactionsRightRail reactions={reactions} />
              </div>
            )}

            {/* Song Progress Bar */}
            <div className="w-full space-y-2">
              <div className="w-full bg-neutral-900 h-2.5 rounded-full overflow-hidden border border-neutral-800">
                <div
                  className="bg-gradient-to-r from-cyan-500 via-fuchsia-500 to-amber-400 h-full transition-all duration-500 rounded-full"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <div className="flex justify-between text-xs font-mono text-neutral-400">
                <span>{formatSecs(currentTime)}</span>
                <span>{formatSecs(effectiveDuration)}</span>
              </div>
            </div>
          </div>
        ) : (
          /* State D: Empty Queue (Standby Mode - ONLY songs queued by guests/operator will play) */
          <div className="space-y-6 max-w-xl animate-fade-in">
            <div className="w-16 h-16 rounded-2xl bg-cyan-950/60 border border-cyan-800 text-cyan-400 flex items-center justify-center mx-auto shadow-xl shadow-cyan-950/40">
              <Music2 className="w-8 h-8 animate-bounce" />
            </div>

            <h1 className="text-4xl sm:text-5xl font-extrabold font-display text-white">
              A FILA ESTÁ LIVRE!
            </h1>
            <p className="text-base text-neutral-300 leading-relaxed">
              O palco está esperando por você. Aponte a câmera do seu celular para o QR Code abaixo e escolha sua música no YouTube agora mesmo!
            </p>

            <div className="p-4 bg-white rounded-2xl inline-block shadow-2xl shadow-cyan-950/60 mx-auto">
              {qrDataUrl && (
                <img
                  src={qrDataUrl}
                  alt="QR Code da sessão"
                  className="w-52 h-52 sm:w-60 sm:h-60 object-contain"
                />
              )}
            </div>

            <div className="text-xs font-mono text-cyan-400 tracking-wider uppercase font-bold">
              CÓDIGO: {sessionCode} · ESCOLHA PELO NAVEGADOR DO SEU CELULAR
            </div>
          </div>
        )}
      </main>

      {/* Footer ticker with next singers and mobile QR hint */}
      <footer className="relative z-10 px-8 py-3.5 bg-neutral-950/80 backdrop-blur-md border-t border-neutral-800/80 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Next singers */}
        <div className="flex items-center gap-3 text-xs text-neutral-300">
          <span className="font-bold uppercase tracking-wider text-fuchsia-400 flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5" />
            <span>Na Fila:</span>
          </span>
          {nextQueueItems.length > 0 ? (
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
              {nextQueueItems.slice(0, 3).map((item, i) => (
                <div
                  key={item.id}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-neutral-900 border border-neutral-800"
                >
                  <span className="font-mono text-neutral-500 font-bold">#{i + 1}</span>
                  <span className="font-bold text-white">{item.singerName}</span>
                  <span className="text-neutral-400 truncate max-w-[120px]">({item.songTitle})</span>
                </div>
              ))}
              {nextQueueItems.length > 3 && (
                <span className="text-neutral-400 font-bold">+{nextQueueItems.length - 3} mais</span>
              )}
            </div>
          ) : (
            <span className="text-neutral-500 italic">Nenhum cantor aguardando no momento</span>
          )}
        </div>

        {/* Call to action for smartphone scan */}
        <div className="flex items-center gap-2 text-xs font-bold text-neutral-400">
          <span>Escaneie pelo celular para pedir sua música e reagir</span>
          <ArrowRight className="w-3.5 h-3.5 text-cyan-400" />
        </div>
      </footer>
    </div>
  );
};
