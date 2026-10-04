import React, { useState } from 'react';
import { PlaySquare, Plus, Music2, Trash2, CheckCircle2, Radio, Play } from 'lucide-react';
import { Playlist, Song } from '../types';

interface PlaylistsManagerProps {
  playlists: Playlist[];
  songs: Song[];
  onSavePlaylist: (playlist: Partial<Playlist>) => void;
  onDeletePlaylist: (id: string) => void;
  onQueuePlaylist: (playlist: Playlist) => void;
}

export const PlaylistsManager: React.FC<PlaylistsManagerProps> = ({
  playlists,
  songs,
  onSavePlaylist,
  onDeletePlaylist,
  onQueuePlaylist
}) => {
  const [isCreating, setIsCreating] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isAutoDj, setIsAutoDj] = useState(false);
  const [selectedSongIds, setSelectedSongIds] = useState<string[]>([]);

  const handleToggleSong = (id: string) => {
    if (selectedSongIds.includes(id)) {
      setSelectedSongIds(selectedSongIds.filter((s) => s !== id));
    } else {
      setSelectedSongIds([...selectedSongIds, id]);
    }
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onSavePlaylist({
      name: name.trim(),
      description: description.trim(),
      isAutoDj,
      songIds: selectedSongIds
    });

    setIsCreating(false);
    setName('');
    setDescription('');
    setSelectedSongIds([]);
    setIsAutoDj(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-800">
        <div>
          <h2 className="text-xl font-bold font-display text-white flex items-center gap-2">
            <PlaySquare className="w-5 h-5 text-cyan-400" />
            <span>Gerenciamento de Playlists & Auto-DJ</span>
          </h2>
          <p className="text-xs text-neutral-400 mt-0.5">
            Crie seleções para aquecimento, intervalos ou modo automático quando a fila estiver vazia
          </p>
        </div>

        <button
          onClick={() => setIsCreating(true)}
          className="px-4 py-2 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-neutral-950 text-xs font-bold transition-all shadow-md shadow-cyan-500/20 flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Nova Playlist</span>
        </button>
      </div>

      {/* Auto-DJ Info Card */}
      <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center shrink-0">
            <Radio className="w-5 h-5" />
          </div>
          <div>
            <div className="text-sm font-bold text-white flex items-center gap-2">
              <span>Fila Controlada Exclusivamente pelo Público e Operador</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
                SEM MÚSICAS ALEATÓRIAS
              </span>
            </div>
            <p className="text-xs text-neutral-400 mt-0.5">
              O sistema não adiciona músicas aleatórias à fila. Apenas músicas pesquisadas no YouTube e adicionadas pelo público via QR Code ou pelo operador serão cantadas.
            </p>
          </div>
        </div>
      </div>

      {/* Empty State when no playlists */}
      {playlists.length === 0 && (
        <div className="p-12 text-center rounded-2xl bg-neutral-900/50 border border-neutral-800 space-y-3">
          <div className="w-12 h-12 rounded-xl bg-cyan-950/60 border border-cyan-800 text-cyan-400 flex items-center justify-center mx-auto">
            <Music2 className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-white">Nenhuma playlist aleatória criada</h3>
          <p className="text-xs text-neutral-400 max-w-md mx-auto">
            Todas as playlists aleatórias foram removidas conforme solicitado. O palco toca somente as músicas adicionadas pelo público no QR Code ou pelo operador na busca do YouTube.
          </p>
        </div>
      )}

      {/* Grid of Playlists */}
      {playlists.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {playlists.map((playlist) => {
          const playlistSongs = songs.filter((s) => playlist.songIds.includes(s.id));

          return (
            <div
              key={playlist.id}
              className="p-5 rounded-2xl bg-neutral-900/70 border border-neutral-800 hover:border-neutral-700 flex flex-col justify-between transition-colors gap-4"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-base font-bold text-white font-display">{playlist.name}</h3>
                    <p className="text-xs text-neutral-400 mt-0.5">{playlist.description}</p>
                  </div>
                  {playlist.isAutoDj && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-fuchsia-950 text-fuchsia-300 border border-fuchsia-800 shrink-0">
                      AUTO-DJ
                    </span>
                  )}
                </div>

                <div className="mt-4 space-y-1.5 border-t border-neutral-800/80 pt-3">
                  <div className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
                    {playlistSongs.length} Músicas Selecionadas:
                  </div>
                  <div className="space-y-1 max-h-36 overflow-y-auto pr-1">
                    {playlistSongs.map((s) => (
                      <div key={s.id} className="text-xs text-neutral-300 flex items-center justify-between py-1 border-b border-neutral-900">
                        <span className="truncate">{s.title} - <span className="text-neutral-500">{s.artist}</span></span>
                        <span className="text-[10px] font-mono text-neutral-500">{s.durationFormatted}</span>
                      </div>
                    ))}
                    {playlistSongs.length === 0 && (
                      <div className="text-xs text-neutral-500 italic">Nenhuma música adicionada ainda.</div>
                    )}
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-neutral-800 flex items-center justify-between">
                <button
                  onClick={() => onDeletePlaylist(playlist.id)}
                  className="p-2 rounded-lg bg-neutral-800 hover:bg-rose-950 text-neutral-400 hover:text-rose-400 transition-colors"
                  title="Excluir Playlist"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                <button
                  onClick={() => onQueuePlaylist(playlist)}
                  className="px-3.5 py-1.5 rounded-lg bg-cyan-400 hover:bg-cyan-300 text-neutral-950 text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Adicionar Todas à Fila</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
      )}

      {/* Create Playlist Modal */}
      {isCreating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-lg bg-neutral-900 border border-neutral-800 rounded-2xl p-6 shadow-2xl relative">
            <h3 className="text-lg font-bold font-display text-white mb-4">
              Criar Nova Playlist
            </h3>

            <form onSubmit={handleCreate} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-neutral-300 mb-1">Nome da Playlist</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: Aquecimento Sertanejo"
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block font-semibold text-neutral-300 mb-1">Descrição</label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Ex: Músicas para cantar em coro"
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="autoDjCheck"
                  checked={isAutoDj}
                  onChange={(e) => setIsAutoDj(e.target.checked)}
                  className="w-4 h-4 accent-cyan-400 rounded"
                />
                <label htmlFor="autoDjCheck" className="text-neutral-300 font-semibold cursor-pointer">
                  Utilizar no Auto-DJ (reproduzir se a fila de cantores esvaziar)
                </label>
              </div>

              {/* Select songs list */}
              <div>
                <label className="block font-semibold text-neutral-300 mb-1.5">
                  Selecione as Músicas ({selectedSongIds.length} selecionadas)
                </label>
                <div className="max-h-48 overflow-y-auto space-y-1 p-2 rounded-xl bg-neutral-950 border border-neutral-800">
                  {songs.map((song) => {
                    const isSelected = selectedSongIds.includes(song.id);
                    return (
                      <div
                        key={song.id}
                        onClick={() => handleToggleSong(song.id)}
                        className={`p-2 rounded-lg cursor-pointer flex items-center justify-between text-xs transition-colors ${
                          isSelected
                            ? 'bg-cyan-950/60 text-cyan-200 border border-cyan-800/80'
                            : 'hover:bg-neutral-900 text-neutral-400'
                        }`}
                      >
                        <span className="truncate">{song.title} - {song.artist}</span>
                        {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="flex-1 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-medium"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-neutral-950 font-bold"
                >
                  Salvar Playlist
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
