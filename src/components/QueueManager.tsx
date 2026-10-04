import React, { useState } from 'react';
import {
  ListMusic,
  Plus,
  ArrowUp,
  ArrowDown,
  Trash2,
  Edit2,
  Play,
  SkipForward,
  Clock,
  User,
  Sliders,
  Check,
  X
} from 'lucide-react';
import { QueueItem, Song } from '../types';

interface QueueManagerProps {
  queue: QueueItem[];
  songs: Song[];
  onPlayItem: (item: QueueItem) => void;
  onRemoveItem: (id: string) => void;
  onMoveUp: (index: number) => void;
  onMoveDown: (index: number) => void;
  onUpdateItem: (id: string, updates: Partial<QueueItem>) => void;
  onOpenAddModal: () => void;
  onOpenQrCode: () => void;
}

export const QueueManager: React.FC<QueueManagerProps> = ({
  queue,
  songs,
  onPlayItem,
  onRemoveItem,
  onMoveUp,
  onMoveDown,
  onUpdateItem,
  onOpenAddModal,
  onOpenQrCode
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editSinger, setEditSinger] = useState('');
  const [editPitch, setEditPitch] = useState(0);

  const startEdit = (item: QueueItem) => {
    setEditingId(item.id);
    setEditSinger(item.singerName);
    setEditPitch(item.pitchShift);
  };

  const saveEdit = (id: string) => {
    onUpdateItem(id, {
      singerName: editSinger,
      pitchShift: editPitch
    });
    setEditingId(null);
  };

  return (
    <div className="space-y-6">
      {/* Header with actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-800">
        <div>
          <h2 className="text-xl font-bold font-display text-white flex items-center gap-2">
            <ListMusic className="w-5 h-5 text-cyan-400" />
            <span>Fila de Músicas em Tempo Real</span>
          </h2>
          <p className="text-xs text-neutral-400 mt-0.5">
            {queue.length} {queue.length === 1 ? 'música na fila' : 'músicas na fila'} · Arraste ou use os botões para reordenar
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onOpenQrCode}
            className="px-3.5 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-xs font-semibold text-neutral-200 transition-colors flex items-center gap-1.5"
          >
            <span>QR Code para Convidados</span>
          </button>

          <button
            onClick={onOpenAddModal}
            className="px-4 py-2 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-neutral-950 text-xs font-bold transition-all shadow-md shadow-cyan-500/20 flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Adicionar Música</span>
          </button>
        </div>
      </div>

      {/* Queue Items Table / Cards */}
      {queue.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-neutral-900/40 border border-neutral-800/80 space-y-3">
          <div className="w-12 h-12 rounded-xl bg-neutral-800 flex items-center justify-center text-neutral-400 mx-auto">
            <ListMusic className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-white">A fila está vazia no momento</h3>
          <p className="text-xs text-neutral-400 max-w-sm mx-auto">
            Adicione músicas manualmente no catálogo ou deixe os convidados escolherem via celular apontando para o QR Code.
          </p>
          <div className="pt-2 flex justify-center gap-3">
            <button
              onClick={onOpenAddModal}
              className="px-4 py-2 bg-cyan-400 text-neutral-950 font-bold text-xs rounded-xl hover:bg-cyan-300 transition-colors"
            >
              Buscar no Acervo
            </button>
            <button
              onClick={onOpenQrCode}
              className="px-4 py-2 bg-neutral-800 text-white font-medium text-xs rounded-xl hover:bg-neutral-700 transition-colors"
            >
              Exibir QR Code
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-2.5">
          {queue.map((item, index) => {
            const isPlaying = item.status === 'playing';
            const isEditing = editingId === item.id;

            return (
              <div
                key={item.id}
                className={`p-4 rounded-xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-3 ${
                  isPlaying
                    ? 'bg-cyan-950/30 border-cyan-500/60 shadow-lg shadow-cyan-950/20'
                    : 'bg-neutral-900/70 border-neutral-800/80 hover:border-neutral-700'
                }`}
              >
                {/* Left zone: Position & Song/Singer info */}
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center font-mono font-bold text-sm shrink-0 ${
                      isPlaying
                        ? 'bg-cyan-400 text-neutral-950 shadow-md shadow-cyan-500/30'
                        : 'bg-neutral-800 text-neutral-300'
                    }`}
                  >
                    #{item.position}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-white truncate">{item.songTitle}</span>
                      {isPlaying && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-cyan-400 text-neutral-950 animate-pulse">
                          CANTANDO
                        </span>
                      )}
                      {item.pitchShift !== 0 && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-indigo-950 text-indigo-300 border border-indigo-800">
                          TOM {item.pitchShift > 0 ? `+${item.pitchShift}` : item.pitchShift}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 text-xs text-neutral-400 mt-0.5">
                      <span>{item.artist}</span>
                      <span>·</span>
                      <span className="text-neutral-500">{item.genre}</span>
                      <span>·</span>
                      <span className="flex items-center gap-1 text-cyan-300 font-medium">
                        <User className="w-3 h-3 text-cyan-400" />
                        {isEditing ? (
                          <input
                            type="text"
                            value={editSinger}
                            onChange={(e) => setEditSinger(e.target.value)}
                            className="bg-neutral-950 border border-neutral-700 rounded px-1.5 py-0.5 text-xs text-white"
                          />
                        ) : (
                          item.singerName
                        )}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Middle zone: Wait time & Source */}
                <div className="flex items-center gap-4 text-xs text-neutral-400 md:justify-center">
                  <div className="flex items-center gap-1 font-mono">
                    <Clock className="w-3.5 h-3.5 text-neutral-500" />
                    <span>~{item.estimatedWaitMinutes} min</span>
                  </div>

                  <span className="text-[11px] text-neutral-500 bg-neutral-950 px-2 py-0.5 rounded border border-neutral-800">
                    {item.addedBy === 'mobile' ? '📱 Celular' : '💻 Operador'}
                  </span>
                </div>

                {/* Right zone: Actions */}
                <div className="flex items-center gap-1.5 shrink-0 self-end md:self-center">
                  {isEditing ? (
                    <>
                      <div className="flex items-center gap-1 mr-2">
                        <span className="text-[10px] text-neutral-400">Tom:</span>
                        {[-2, -1, 0, 1, 2].map((t) => (
                          <button
                            key={t}
                            onClick={() => setEditPitch(t)}
                            className={`w-6 h-6 rounded text-[10px] font-mono font-bold ${
                              editPitch === t
                                ? 'bg-cyan-400 text-neutral-950'
                                : 'bg-neutral-800 text-neutral-400 hover:text-white'
                            }`}
                          >
                            {t === 0 ? '0' : t > 0 ? `+${t}` : t}
                          </button>
                        ))}
                      </div>
                      <button
                        onClick={() => saveEdit(item.id)}
                        className="p-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white"
                        title="Salvar"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-400"
                        title="Cancelar"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </>
                  ) : (
                    <>
                      {!isPlaying && (
                        <button
                          onClick={() => onPlayItem(item)}
                          className="px-2.5 py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 text-xs font-semibold flex items-center gap-1"
                          title="Tocar Agora"
                        >
                          <Play className="w-3.5 h-3.5 fill-current" />
                          <span>Tocar</span>
                        </button>
                      )}

                      <button
                        disabled={index === 0}
                        onClick={() => onMoveUp(index)}
                        className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white disabled:opacity-30 disabled:pointer-events-none"
                        title="Mover para cima"
                      >
                        <ArrowUp className="w-4 h-4" />
                      </button>

                      <button
                        disabled={index === queue.length - 1}
                        onClick={() => onMoveDown(index)}
                        className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white disabled:opacity-30 disabled:pointer-events-none"
                        title="Mover para baixo"
                      >
                        <ArrowDown className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => startEdit(item)}
                        className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white"
                        title="Editar cantor/tom"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => onRemoveItem(item.id)}
                        className="p-1.5 rounded-lg bg-neutral-800 hover:bg-rose-950 text-neutral-400 hover:text-rose-400 transition-colors"
                        title="Remover da fila"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
