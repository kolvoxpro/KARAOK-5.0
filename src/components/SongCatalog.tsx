import React, { useState, useEffect } from 'react';
import { Search, Plus, Music2, FolderPlus, Clock, Disc3, Tag, Youtube, Loader2, Sparkles } from 'lucide-react';
import { Song, MusicGenre } from '../types';
import { api } from '../services/api';

interface SongCatalogProps {
  songs: Song[];
  onAddToQueue: (song: Song, singerName: string, pitchShift: number) => void;
  onAddNewSong: (songData: Partial<Song>) => void;
}

export const SongCatalog: React.FC<SongCatalogProps> = ({
  songs,
  onAddToQueue,
  onAddNewSong
}) => {
  const [search, setSearch] = useState('');
  const [selectedGenre, setSelectedGenre] = useState<string>('Todos');
  const [activeSource, setActiveSource] = useState<'youtube' | 'local'>('youtube');
  const [youtubeVideos, setYoutubeVideos] = useState<any[]>([]);
  const [loadingYouTube, setLoadingYouTube] = useState(false);

  const [selectedSong, setSelectedSong] = useState<any | null>(null);
  const [singerName, setSingerName] = useState('');
  const [pitchShift, setPitchShift] = useState(0);

  // New local song modal
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newArtist, setNewArtist] = useState('');
  const [newGenre, setNewGenre] = useState<MusicGenre>('Pop');
  const [newDuration, setNewDuration] = useState('210');
  const [newSnippet, setNewSnippet] = useState('');

  const genres: (MusicGenre | 'Todos')[] = [
    'Todos',
    'Sertanejo',
    'Pagode',
    'Samba',
    'Rock',
    'Pop',
    'MPB',
    'Funk',
    'Rap',
    'Gospel',
    'Internacional',
    'Anos 80',
    'Anos 90',
    'Anos 2000'
  ];

  // Perform YouTube search whenever search or genre changes
  useEffect(() => {
    let active = true;
    const query = selectedGenre !== 'Todos' && !search
      ? `${selectedGenre} karaoke`
      : search;

    const timer = setTimeout(async () => {
      setLoadingYouTube(true);
      try {
        const videos = await api.searchYouTube(query || 'karaoke');
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

  const filteredLocal = songs.filter((s) => {
    const matchesGenre = selectedGenre === 'Todos' || s.genre === selectedGenre;
    const q = search.toLowerCase();
    const matchesQuery =
      !search ||
      s.title.toLowerCase().includes(q) ||
      s.artist.toLowerCase().includes(q) ||
      s.lyricsSnippet.toLowerCase().includes(q) ||
      s.genre.toLowerCase().includes(q);
    return matchesGenre && matchesQuery;
  });

  const handleOpenAdd = (item: any) => {
    setSelectedSong(item);
    setSingerName('');
    setPitchShift(0);
  };

  const handleConfirmAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSong) return;
    if (!singerName.trim()) {
      alert('Informe o nome do cantor.');
      return;
    }

    const songObj: Song = {
      id: selectedSong.id || `yt-${selectedSong.youtubeId}`,
      title: selectedSong.title,
      artist: selectedSong.artist || selectedSong.channel || 'YouTube',
      genre: (selectedGenre !== 'Todos' ? selectedGenre : 'Pop') as MusicGenre,
      duration: selectedSong.duration || 240,
      durationFormatted: selectedSong.durationFormatted || '4:00',
      youtubeId: selectedSong.youtubeId,
      thumbnail: selectedSong.thumbnail,
      source: selectedSong.youtubeId ? 'YouTube' : 'Acervo Local',
      lyricsSnippet: selectedSong.lyricsSnippet || 'Faixa oficial de karaokê',
      lyrics: selectedSong.lyrics || []
    };

    onAddToQueue(songObj, singerName.trim(), pitchShift);
    setSelectedSong(null);
  };

  const handleCreateSong = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newArtist.trim()) return;

    onAddNewSong({
      title: newTitle.trim(),
      artist: newArtist.trim(),
      genre: newGenre,
      duration: Number(newDuration) || 200,
      lyricsSnippet: newSnippet.trim() || 'Letra cadastrada pelo operador...'
    });

    setIsAddingNew(false);
    setNewTitle('');
    setNewArtist('');
    setNewSnippet('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-800">
        <div>
          <h2 className="text-xl font-bold font-display text-white flex items-center gap-2">
            <Youtube className="w-6 h-6 text-rose-500" />
            <span>Acervo de Karaokê Online & YouTube</span>
          </h2>
          <p className="text-xs text-neutral-400 mt-0.5">
            Pesquise qualquer música do YouTube para cantar com playback e vídeo oficial com letra
          </p>
        </div>

        {/* Source switcher tabs */}
        <div className="flex items-center gap-2">
          <div className="flex items-center p-1 bg-neutral-900 border border-neutral-800 rounded-xl text-xs">
            <button
              onClick={() => setActiveSource('youtube')}
              className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-colors ${
                activeSource === 'youtube'
                  ? 'bg-rose-600 text-white shadow-md'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Youtube className="w-3.5 h-3.5" />
              <span>YouTube Karaokê</span>
            </button>
            <button
              onClick={() => setActiveSource('local')}
              className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-colors ${
                activeSource === 'local'
                  ? 'bg-cyan-400 text-neutral-950 shadow-md'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Music2 className="w-3.5 h-3.5" />
              <span>Acervo Local ({songs.length})</span>
            </button>
          </div>

          <button
            onClick={() => setIsAddingNew(true)}
            className="px-3.5 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <FolderPlus className="w-4 h-4 text-cyan-400" />
            <span>Cadastrar Manual</span>
          </button>
        </div>
      </div>

      {/* Search Input & Genre Bar */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-neutral-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Pesquisar música no YouTube (ex: Evidências karaokê, Marília Mendonça, Queen, Sertanejo)..."
            className="w-full bg-neutral-900 border border-neutral-800 rounded-xl pl-10 pr-10 py-3 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-rose-500 transition-colors shadow-inner"
          />
          {loadingYouTube && (
            <Loader2 className="w-4 h-4 absolute right-3.5 top-3.5 text-rose-500 animate-spin" />
          )}
        </div>

        {/* Genre filter buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-1 no-scrollbar">
          {genres.map((g) => (
            <button
              key={g}
              onClick={() => setSelectedGenre(g)}
              className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedGenre === g
                  ? 'bg-rose-500 text-white shadow-sm'
                  : 'bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800'
              }`}
            >
              {g}
            </button>
          ))}
        </div>
      </div>

      {/* Results View: YouTube or Local */}
      {activeSource === 'youtube' ? (
        <div>
          <div className="flex items-center justify-between text-xs text-neutral-400 mb-3 px-1">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-rose-400" />
              <span>Resultados do YouTube Karaokê ({youtubeVideos.length} vídeos prontos para cantar)</span>
            </span>
            {loadingYouTube && <span className="text-rose-400 font-mono">Buscando faixas ao vivo...</span>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {youtubeVideos.map((video) => (
              <div
                key={video.youtubeId || video.id}
                className="p-3.5 rounded-2xl bg-neutral-900/80 border border-neutral-800 hover:border-neutral-700 flex flex-col justify-between transition-all gap-3 group shadow-md"
              >
                {/* Thumbnail & Video Header */}
                <div className="space-y-2.5">
                  <div className="relative rounded-xl overflow-hidden aspect-video bg-neutral-950 border border-neutral-800">
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded bg-black/80 text-[10px] font-mono text-white font-bold">
                      {video.durationFormatted}
                    </div>
                    <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-rose-600/90 text-[10px] font-bold text-white flex items-center gap-1 shadow-md">
                      <Youtube className="w-3 h-3" />
                      <span>KARAOKÊ</span>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-white leading-snug line-clamp-2" title={video.title}>
                      {video.title}
                    </h3>
                    <div className="text-xs text-neutral-400 mt-1 flex items-center justify-between">
                      <span className="truncate max-w-[180px]">{video.channel}</span>
                      <span className="text-[10px] font-mono text-neutral-500 shrink-0">HD</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-neutral-800/80 flex items-center justify-between">
                  <span className="text-[11px] text-neutral-500 font-medium">
                    Playback + Letra
                  </span>

                  <button
                    onClick={() => handleOpenAdd(video)}
                    className="px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-all shadow-md shadow-rose-600/20 flex items-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Cantar Esta</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {youtubeVideos.length === 0 && !loadingYouTube && (
            <div className="p-12 text-center text-xs text-neutral-400 bg-neutral-900/40 rounded-2xl border border-neutral-800">
              Nenhuma faixa de karaokê encontrada para esta pesquisa no YouTube. Digite outro nome ou selecione um gênero.
            </div>
          )}
        </div>
      ) : (
        /* Local Songs Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredLocal.map((song) => (
            <div
              key={song.id}
              className="p-4 rounded-xl bg-neutral-900/60 border border-neutral-800 hover:border-neutral-700 flex flex-col justify-between transition-colors gap-3"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-sm font-bold text-white leading-tight">{song.title}</h3>
                    <div className="text-xs text-neutral-400 font-medium mt-0.5">{song.artist}</div>
                  </div>
                  <span className="text-[10px] font-mono text-neutral-400 bg-neutral-950 px-2 py-0.5 rounded border border-neutral-800 shrink-0">
                    {song.durationFormatted}
                  </span>
                </div>

                <div className="mt-2 text-xs text-neutral-400 italic line-clamp-2 bg-neutral-950/50 p-2 rounded-lg border border-neutral-800/60">
                  "{song.lyricsSnippet}"
                </div>
              </div>

              <div className="pt-2 border-t border-neutral-800/80 flex items-center justify-between">
                <span className="text-[11px] font-medium text-cyan-400 flex items-center gap-1">
                  <Tag className="w-3 h-3 text-cyan-500" />
                  <span>{song.genre}</span>
                </span>

                <button
                  onClick={() => handleOpenAdd(song)}
                  className="px-3 py-1.5 rounded-lg bg-cyan-400 hover:bg-cyan-300 text-neutral-950 text-xs font-bold transition-all shadow-sm flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Adicionar à Fila</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add To Queue Modal */}
      {selectedSong && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-2xl p-6 shadow-2xl relative">
            <h3 className="text-lg font-bold font-display text-white mb-1">
              Colocar na Fila do Karaokê
            </h3>
            <p className="text-xs text-neutral-400 mb-4 line-clamp-1">
              {selectedSong.title}
            </p>

            <form onSubmit={handleConfirmAdd} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">
                  Nome do Cantor
                </label>
                <input
                  type="text"
                  required
                  autoFocus
                  value={singerName}
                  onChange={(e) => setSingerName(e.target.value)}
                  placeholder="Ex: Carlos da Mesa 5"
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">
                  Ajuste de Tom (Pitch Shift)
                </label>
                <div className="grid grid-cols-7 gap-1 text-xs">
                  {[-3, -2, -1, 0, 1, 2, 3].map((shift) => (
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
                      {shift === 0 ? '0' : shift > 0 ? `+${shift}` : shift}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedSong(null)}
                  className="flex-1 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-medium text-xs transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md shadow-rose-600/20"
                >
                  Confirmar na Fila
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add New Song Modal */}
      {isAddingNew && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-2xl p-6 shadow-2xl relative">
            <h3 className="text-lg font-bold font-display text-white mb-4">
              Cadastrar Nova Música Local
            </h3>

            <form onSubmit={handleCreateSong} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-neutral-300 mb-1">Título da Música</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Ex: Como Nossos Pais"
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block font-semibold text-neutral-300 mb-1">Artista / Intérprete</label>
                <input
                  type="text"
                  required
                  value={newArtist}
                  onChange={(e) => setNewArtist(e.target.value)}
                  placeholder="Ex: Elis Regina"
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-neutral-300 mb-1">Gênero Musical</label>
                  <select
                    value={newGenre}
                    onChange={(e) => setNewGenre(e.target.value as any)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-2.5 py-2 text-white focus:outline-none"
                  >
                    {genres.filter((g) => g !== 'Todos').map((g) => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-neutral-300 mb-1">Duração (segundos)</label>
                  <input
                    type="number"
                    value={newDuration}
                    onChange={(e) => setNewDuration(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-neutral-300 mb-1">Trecho Marcante da Letra</label>
                <textarea
                  rows={2}
                  value={newSnippet}
                  onChange={(e) => setNewSnippet(e.target.value)}
                  placeholder="Ex: Minha dor é perceber que apesar de termos feito tudo o que fizemos..."
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-white focus:outline-none"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddingNew(false)}
                  className="flex-1 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-medium"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-neutral-950 font-bold"
                >
                  Salvar no Acervo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
