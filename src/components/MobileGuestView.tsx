import React, { useState, useEffect } from 'react';
import {
  Search,
  Plus,
  Flame,
  Clock,
  Music2,
  Users,
  CheckCircle2,
  Sparkles,
  Youtube,
  Loader2,
  Radio,
  Check
} from 'lucide-react';
import { Song, QueueItem, KaraokeEvent } from '../types';
import { api } from '../services/api';

interface MobileGuestViewProps {
  songs: Song[];
  queue: QueueItem[];
  event: KaraokeEvent | null;
  onSongAdded: () => void;
}

export const MobileGuestView: React.FC<MobileGuestViewProps> = ({
  queue,
  event,
  onSongAdded
}) => {
  const [activeTab, setActiveTab] = useState<'acervo' | 'fila' | 'reacoes'>('acervo');
  const [search, setSearch] = useState('');
  const [selectedGenre, setSelectedGenre] = useState<string>('Todos');
  const [youtubeVideos, setYoutubeVideos] = useState<any[]>([]);
  const [loadingYouTube, setLoadingYouTube] = useState(false);

  const [guestName, setGuestName] = useState(() => {
    return localStorage.getItem('karaoke50_guest_name') || '';
  });
  const [modalSong, setModalSong] = useState<any | null>(null);
  const [pitchShift, setPitchShift] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [lastReactionSent, setLastReactionSent] = useState<string | null>(null);

  const genres = [
    'Todos',
    'Sertanejo',
    'Pagode',
    'Rock',
    'Pop',
    'MPB',
    'Funk',
    'Anos 80',
    'Anos 90',
    'Internacional'
  ];

  const reactions = [
    { type: 'fire', emoji: '🔥', label: 'Fogo', desc: 'Arrebentou no palco!' },
    { type: 'applause', emoji: '👏', label: 'Palmas', desc: 'Aplausos da mesa' },
    { type: 'heart', emoji: '❤️', label: 'Coração', desc: 'Emocionou a plateia' },
    { type: 'laugh', emoji: '😂', label: 'Risos', desc: 'Diversão pura' },
    { type: 'mic', emoji: '🎤', label: 'Canta Muito', desc: 'Afinado demais' },
    { type: 'star', emoji: '⭐', label: 'Nota 10', desc: 'Show impecável' },
    { type: 'rocket', emoji: '🚀', label: 'Espetáculo', desc: 'Voando alto' }
  ];

  // Live search on YouTube
  useEffect(() => {
    let active = true;
    const q = selectedGenre !== 'Todos' && !search
      ? `${selectedGenre} karaoke`
      : search;

    const timer = setTimeout(async () => {
      setLoadingYouTube(true);
      try {
        const videos = await api.searchYouTube(q || 'karaoke');
        if (active) {
          setYoutubeVideos(videos);
        }
      } catch (err) {
        console.error(err);
      } finally {
        if (active) setLoadingYouTube(false);
      }
    }, 350);

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [search, selectedGenre]);

  // Check if guest already has a song in queue
  const myQueueItem = guestName
    ? queue.find((q) => q.singerName.toLowerCase() === guestName.toLowerCase() && q.status !== 'finished')
    : null;

  const currentPlaying = queue.find((q) => q.status === 'playing') || queue[0];
  const upcomingQueue = queue.filter((q) => q.status === 'waiting');

  const handleSendReaction = async (type: string, emoji: string) => {
    setLastReactionSent(emoji);
    setTimeout(() => setLastReactionSent(null), 1200);

    try {
      const sender = guestName.trim() || 'Convidado';
      const res = await api.sendReaction(type, sender);
      if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
        const ch = new BroadcastChannel('karaoke50_channel');
        ch.postMessage({ type: 'REACTION_ADDED', data: res });
      }
      try {
        localStorage.setItem('karaoke50_live_reaction', JSON.stringify(res));
      } catch {}
    } catch (err) {
      console.error('Erro ao enviar reação:', err);
    }
  };

  const handleConfirmAddToQueue = async () => {
    if (!modalSong) return;
    if (!guestName.trim()) {
      alert('Por favor informe seu nome ou apelido para o palco.');
      return;
    }

    setSubmitting(true);
    try {
      localStorage.setItem('karaoke50_guest_name', guestName.trim());

      await api.addToQueue(
        modalSong.id || `yt-${modalSong.youtubeId}`,
        guestName.trim(),
        pitchShift,
        'mobile',
        {
          youtubeId: modalSong.youtubeId,
          songTitle: modalSong.title,
          artist: modalSong.artist || modalSong.channel || 'YouTube',
          genre: selectedGenre !== 'Todos' ? selectedGenre : 'Pop',
          duration: modalSong.duration || 240,
          thumbnail: modalSong.thumbnail
        }
      );

      setSuccessMessage(`"${modalSong.title}" adicionada à fila com sucesso!`);
      setModalSong(null);
      onSongAdded();

      if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
        try {
          const ch = new BroadcastChannel('karaoke50_channel');
          const currentQ = await api.getQueue();
          ch.postMessage({ type: 'QUEUE_UPDATED', data: currentQ });
        } catch {}
      }

      setTimeout(() => setSuccessMessage(null), 4000);
      setActiveTab('fila');
    } catch (err: any) {
      alert(err.message || 'Erro ao adicionar música.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col max-w-md mx-auto relative border-x border-neutral-800 shadow-2xl selection:bg-rose-500 selection:text-white pb-32">
      {/* Mobile Top Header (Exclusively Guest View - No Operator Links) */}
      <header className="sticky top-0 z-40 bg-neutral-950/95 backdrop-blur-md px-4 py-3 border-b border-neutral-800 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-rose-500 via-fuchsia-500 to-amber-500 flex items-center justify-center text-white font-black text-xs shadow-md">
            <Youtube className="w-4 h-4" />
          </div>
          <div>
            <h1 className="text-base font-extrabold font-display text-white leading-tight flex items-center gap-1.5">
              <span>KARAOKÊ</span>
              <span className="text-rose-400">5.0</span>
              <span className="text-[9px] font-mono uppercase bg-neutral-800 text-neutral-300 px-1.5 py-0.5 rounded border border-neutral-700">
                PÚBLICO
              </span>
            </h1>
            <p className="text-[10px] text-neutral-400">
              {event?.title || 'Sessão ao Vivo'} · Código: <strong className="text-cyan-400 font-mono">{event?.sessionCode || 'KARAOKE50'}</strong>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 bg-emerald-950/80 border border-emerald-800 px-2 py-1 rounded-lg text-[10px] text-emerald-300 font-bold">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>AO VIVO</span>
        </div>
      </header>

      {/* 3 Main Tabs: Acervo Karaokê & YouTube | Fila em Tempo Real | Reações da Plateia */}
      <nav className="sticky top-[57px] z-30 bg-neutral-900 border-b border-neutral-800 grid grid-cols-3 text-xs font-bold text-center">
        <button
          onClick={() => setActiveTab('acervo')}
          className={`py-3 flex flex-col items-center gap-1 border-b-2 transition-all ${
            activeTab === 'acervo'
              ? 'border-rose-500 text-rose-400 bg-neutral-950/50'
              : 'border-transparent text-neutral-400 hover:text-white'
          }`}
        >
          <Search className="w-4 h-4" />
          <span className="text-[11px]">Acervo YouTube</span>
        </button>

        <button
          onClick={() => setActiveTab('fila')}
          className={`py-3 flex flex-col items-center gap-1 border-b-2 transition-all relative ${
            activeTab === 'fila'
              ? 'border-cyan-400 text-cyan-300 bg-neutral-950/50'
              : 'border-transparent text-neutral-400 hover:text-white'
          }`}
        >
          <Users className="w-4 h-4" />
          <span className="text-[11px]">Fila ao Vivo</span>
          {upcomingQueue.length > 0 && (
            <span className="absolute top-1.5 right-4 w-4 h-4 rounded-full bg-cyan-400 text-neutral-950 text-[9px] font-black flex items-center justify-center">
              {upcomingQueue.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('reacoes')}
          className={`py-3 flex flex-col items-center gap-1 border-b-2 transition-all ${
            activeTab === 'reacoes'
              ? 'border-amber-400 text-amber-300 bg-neutral-950/50'
              : 'border-transparent text-neutral-400 hover:text-white'
          }`}
        >
          <Flame className="w-4 h-4" />
          <span className="text-[11px]">Reações TV</span>
        </button>
      </nav>

      {/* Floating feedback for reaction */}
      {lastReactionSent && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 pointer-events-none animate-bounce bg-neutral-900 border border-neutral-700 px-4 py-2 rounded-full shadow-2xl flex items-center gap-2">
          <span className="text-2xl">{lastReactionSent}</span>
          <span className="text-xs font-bold text-white">Enviado para a lateral do vídeo na TV!</span>
        </div>
      )}

      {/* Success banner */}
      {successMessage && (
        <div className="m-3 p-3 bg-emerald-950/90 border border-emerald-800 rounded-xl text-xs text-emerald-300 flex items-center gap-2 shadow-lg">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Active singer mini-strip (always visible) */}
      {currentPlaying && (
        <div className="m-3 p-3 rounded-2xl bg-neutral-900/90 border border-neutral-800 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2.5 min-w-0">
            {currentPlaying.thumbnail ? (
              <img
                src={currentPlaying.thumbnail}
                alt={currentPlaying.songTitle}
                className="w-10 h-10 rounded-xl object-cover shrink-0 border border-neutral-800"
              />
            ) : (
              <div className="w-10 h-10 rounded-xl bg-rose-950/70 border border-rose-800 flex items-center justify-center text-rose-400 shrink-0">
                <Music2 className="w-5 h-5 animate-pulse" />
              </div>
            )}
            <div className="min-w-0">
              <div className="text-[9px] uppercase font-bold text-rose-400 tracking-wider flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                <span>CANTANDO AGORA NA TV</span>
              </div>
              <div className="text-xs font-bold text-white truncate">{currentPlaying.songTitle}</div>
              <div className="text-[11px] text-neutral-400 truncate">{currentPlaying.singerName}</div>
            </div>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800 shrink-0">
            NO PALCO
          </span>
        </div>
      )}

      {/* TAB 1: ACERVO KARAOKÊ ONLINE & YOUTUBE */}
      {activeTab === 'acervo' && (
        <div className="flex-1 flex flex-col">
          {/* Guest queue tracker if guest has a song */}
          {myQueueItem && (
            <div className="mx-3 mb-2 p-3 rounded-xl bg-fuchsia-950/40 border border-fuchsia-800/60 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-fuchsia-500 text-neutral-950 font-black flex items-center justify-center text-xs">
                  #{myQueueItem.position}
                </div>
                <div>
                  <div className="text-[10px] text-fuchsia-300 font-bold uppercase">Sua Vez na Fila</div>
                  <div className="text-xs font-bold text-white truncate max-w-[160px]">{myQueueItem.songTitle}</div>
                </div>
              </div>
              <div className="text-right text-[11px] text-neutral-400">
                ~{myQueueItem.estimatedWaitMinutes} min
              </div>
            </div>
          )}

          {/* Search Input */}
          <div className="p-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-neutral-500" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Pesquisar karaokê no YouTube (ex: CPM 22, Evidências...)"
                className="w-full bg-neutral-900 border border-neutral-800 rounded-xl pl-10 pr-10 py-3 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-rose-500 transition-colors"
              />
              {loadingYouTube && (
                <Loader2 className="w-4 h-4 absolute right-3.5 top-3.5 text-rose-500 animate-spin" />
              )}
            </div>

            {/* Genre filter chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto py-2.5 no-scrollbar">
              {genres.map((g) => (
                <button
                  key={g}
                  onClick={() => setSelectedGenre(g)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                    selectedGenre === g
                      ? 'bg-rose-500 text-white'
                      : 'bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800'
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          {/* YouTube Video List */}
          <div className="flex-1 px-3 space-y-2.5">
            <div className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider px-1 flex items-center justify-between">
              <span>{youtubeVideos.length} faixas do YouTube</span>
              <span className="text-rose-400 text-[10px]">Playback Oficial</span>
            </div>

            {youtubeVideos.map((video) => (
              <div
                key={video.youtubeId || video.id}
                className="p-3 rounded-2xl bg-neutral-900/70 border border-neutral-800 hover:border-neutral-700 flex items-center justify-between gap-3 transition-colors"
              >
                <div className="relative w-16 h-12 rounded-lg overflow-hidden shrink-0 bg-neutral-950 border border-neutral-800">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute bottom-0.5 right-0.5 px-1 rounded bg-black/80 text-[8px] font-mono text-white">
                    {video.durationFormatted}
                  </span>
                </div>

                <div className="min-w-0 flex-1">
                  <div className="text-xs font-bold text-white truncate">{video.title}</div>
                  <div className="text-[11px] text-neutral-400 truncate">{video.channel}</div>
                </div>

                <button
                  onClick={() => setModalSong(video)}
                  className="py-1.5 px-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center gap-1 shadow-sm shrink-0"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Cantar</span>
                </button>
              </div>
            ))}

            {youtubeVideos.length === 0 && !loadingYouTube && (
              <div className="p-8 text-center text-xs text-neutral-500">
                Nenhuma música encontrada no YouTube. Digite outro nome ou artista.
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: FILA DE MÚSICA EM TEMPO REAL */}
      {activeTab === 'fila' && (
        <div className="flex-1 p-3 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-1.5">
                <Users className="w-4 h-4 text-cyan-400" />
                <span>Fila de Espera ao Vivo</span>
              </h2>
              <p className="text-[11px] text-neutral-400">Acompanhe sua vez de subir ao palco</p>
            </div>
            <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-950 border border-cyan-800 px-2 py-0.5 rounded">
              {upcomingQueue.length} na fila
            </span>
          </div>

          {/* Singer position indicator if this user is in queue */}
          {myQueueItem ? (
            <div className="p-4 rounded-2xl bg-gradient-to-r from-fuchsia-950/60 to-neutral-900 border border-fuchsia-800/80 shadow-lg">
              <div className="text-[11px] text-fuchsia-300 font-bold uppercase tracking-wider mb-1">
                SEU LUGAR NA FILA
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-black text-white font-display">
                    Posição #{myQueueItem.position}
                  </div>
                  <div className="text-xs text-neutral-300 mt-0.5">
                    Música: <strong className="text-white">{myQueueItem.songTitle}</strong>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-bold text-amber-300 font-mono">
                    ~{myQueueItem.estimatedWaitMinutes} min
                  </div>
                  <div className="text-[10px] text-neutral-400">tempo estimado</div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-3.5 rounded-xl bg-neutral-900/60 border border-neutral-800 text-xs text-neutral-300 flex items-center justify-between">
              <span>Você ainda não pediu sua música.</span>
              <button
                onClick={() => setActiveTab('acervo')}
                className="px-2.5 py-1 rounded-lg bg-rose-600 text-white font-bold text-[11px] hover:bg-rose-500"
              >
                Pedir Agora
              </button>
            </div>
          )}

          {/* List of upcoming singers */}
          <div className="space-y-2">
            <div className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider px-1">
              Próximos Cantores
            </div>

            {upcomingQueue.length > 0 ? (
              upcomingQueue.map((item, idx) => (
                <div
                  key={item.id}
                  className="p-3 rounded-xl bg-neutral-900/80 border border-neutral-800 flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="w-6 h-6 rounded-lg bg-neutral-800 text-neutral-300 text-xs font-mono font-bold flex items-center justify-center shrink-0">
                      #{idx + 1}
                    </span>
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-white truncate">{item.singerName}</div>
                      <div className="text-[11px] text-neutral-400 truncate">{item.songTitle} ({item.artist})</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-neutral-400 shrink-0">
                    ~{item.estimatedWaitMinutes}m
                  </span>
                </div>
              ))
            ) : (
              <div className="p-8 text-center rounded-xl bg-neutral-900/40 border border-neutral-800 text-xs text-neutral-500">
                A fila está livre! Seja o próximo a cantar escolhendo sua música no Acervo.
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: REAÇÕES DA PLATEIA */}
      {activeTab === 'reacoes' && (
        <div className="flex-1 p-4 space-y-4">
          <div className="text-center space-y-1">
            <h2 className="text-base font-extrabold text-white flex items-center justify-center gap-1.5 font-display">
              <Flame className="w-5 h-5 text-rose-500 fill-rose-500" />
              <span>Reações da Plateia ao Vivo</span>
            </h2>
            <p className="text-xs text-neutral-400 max-w-xs mx-auto">
              Toque no emoji desejado. Ele subirá imediatamente na <strong>lateral direita do vídeo na TV</strong>!
            </p>
          </div>

          <div className="grid grid-cols-1 gap-2.5">
            {reactions.map((r) => (
              <button
                key={r.type}
                onClick={() => handleSendReaction(r.type, r.emoji)}
                className="p-3.5 rounded-2xl bg-neutral-900 border border-neutral-800 hover:border-neutral-700 active:scale-[0.98] transition-all flex items-center justify-between text-left group shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <span className="text-3xl group-hover:scale-125 transition-transform">
                    {r.emoji}
                  </span>
                  <div>
                    <div className="text-xs font-bold text-white">{r.label}</div>
                    <div className="text-[11px] text-neutral-400">{r.desc}</div>
                  </div>
                </div>

                <span className="px-3 py-1.5 rounded-xl bg-neutral-800 group-hover:bg-rose-600 group-hover:text-white text-[11px] font-bold text-neutral-300 transition-colors">
                  Enviar
                </span>
              </button>
            ))}
          </div>

          <div className="p-3 rounded-xl bg-neutral-900/60 border border-neutral-800 text-[11px] text-neutral-400 text-center">
            💡 Dica: Se quiser enviar mais de uma vez o mesmo emoji, clique várias vezes no mesmo botão!
          </div>
        </div>
      )}

      {/* Bottom Sticky Reaction Quick Bar (Accessible from all tabs) */}
      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto z-40 bg-neutral-950/95 backdrop-blur-md border-t border-neutral-800 px-3 py-2">
        <div className="text-[10px] text-center text-neutral-400 mb-1 font-semibold uppercase tracking-wider flex items-center justify-center gap-1">
          <Sparkles className="w-3 h-3 text-amber-400" />
          <span>Reaja ao vivo na lateral da TV:</span>
        </div>
        <div className="flex items-center justify-between gap-1">
          {reactions.map((r) => (
            <button
              key={r.type}
              onClick={() => handleSendReaction(r.type, r.emoji)}
              className="flex-1 py-1.5 bg-neutral-900 hover:bg-neutral-800 active:scale-90 border border-neutral-800 rounded-lg text-lg flex items-center justify-center transition-transform cursor-pointer"
              title={r.label}
            >
              {r.emoji}
            </button>
          ))}
        </div>
      </div>

      {/* Add To Queue Modal */}
      {modalSong && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-sm bg-neutral-900 border border-neutral-800 rounded-2xl p-6 shadow-2xl relative">
            <h3 className="text-lg font-bold font-display text-white mb-1">
              Confirmar Escolha
            </h3>
            <p className="text-xs text-neutral-400 mb-4 line-clamp-1">
              {modalSong.title}
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">
                  Seu Nome ou Apelido
                </label>
                <input
                  type="text"
                  required
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  placeholder="Ex: João da Mesa 4"
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">
                  Ajuste de Tom Vocal
                </label>
                <div className="grid grid-cols-5 gap-1 text-xs">
                  {[-2, -1, 0, 1, 2].map((shift) => (
                    <button
                      key={shift}
                      type="button"
                      onClick={() => setPitchShift(shift)}
                      className={`py-1.5 rounded-lg border font-mono font-bold transition-colors ${
                        pitchShift === shift
                          ? 'bg-rose-500 text-white border-rose-500'
                          : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-white'
                      }`}
                    >
                      {shift === 0 ? 'Original' : shift > 0 ? `+${shift}` : shift}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setModalSong(null)}
                  className="flex-1 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-medium text-xs transition-colors"
                >
                  Cancelar
                </button>

                <button
                  type="button"
                  disabled={submitting}
                  onClick={handleConfirmAddToQueue}
                  className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-rose-600/20 disabled:opacity-50"
                >
                  <Plus className="w-4 h-4" />
                  <span>{submitting ? 'Adicionando...' : 'Entrar na Fila'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
