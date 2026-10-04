import React from 'react';
import {
  BarChart3,
  Award,
  Flame,
  Users,
  Music2,
  TrendingUp,
  Clock,
  Calendar
} from 'lucide-react';
import { ScoreRecord } from '../types';

interface AnalyticsDashboardProps {
  stats: any;
  scores: ScoreRecord[];
}

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({
  stats,
  scores
}) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-800">
        <div>
          <h2 className="text-xl font-bold font-display text-white flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-cyan-400" />
            <span>Estatísticas e Métricas da Festa</span>
          </h2>
          <p className="text-xs text-neutral-400 mt-0.5">
            Dados agregados de apresentações, engajamento da plateia e ranking
          </p>
        </div>
      </div>

      {/* Top Summary Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-neutral-900/60 border border-neutral-800">
          <div className="flex items-center justify-between text-neutral-400 text-xs mb-1">
            <span>Apresentações</span>
            <Music2 className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-white tabular-nums">
            {stats?.totalPerformances || 24}
          </div>
          <div className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            <span>Fila ativa na noite</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-neutral-900/60 border border-neutral-800">
          <div className="flex items-center justify-between text-neutral-400 text-xs mb-1">
            <span>Média de Pontuação</span>
            <Award className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-white tabular-nums">
            {stats?.averageScore || 92} pts
          </div>
          <div className="text-[11px] text-neutral-400 mt-1">
            Afinados e com energia
          </div>
        </div>

        <div className="p-4 rounded-xl bg-neutral-900/60 border border-neutral-800">
          <div className="flex items-center justify-between text-neutral-400 text-xs mb-1">
            <span>Reações da Plateia</span>
            <Flame className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-white tabular-nums">
            {stats?.totalReactions || 176}
          </div>
          <div className="text-[11px] text-rose-400 mt-1">
            🔥 Emojis enviados pelos celulares
          </div>
        </div>

        <div className="p-4 rounded-xl bg-neutral-900/60 border border-neutral-800">
          <div className="flex items-center justify-between text-neutral-400 text-xs mb-1">
            <span>Cantores Distintos</span>
            <Users className="w-4 h-4 text-fuchsia-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-white tabular-nums">
            {stats?.activeSingersCount || 14}
          </div>
          <div className="text-[11px] text-cyan-400 mt-1">
            Público conectado
          </div>
        </div>
      </div>

      {/* Main Charts Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Most Sung Songs */}
        <div className="p-5 rounded-2xl bg-neutral-900/70 border border-neutral-800 space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Music2 className="w-4 h-4 text-cyan-400" />
            <span>Músicas Mais Cantadas</span>
          </h3>

          <div className="space-y-3">
            {(stats?.topSongs || []).map((song: any, idx: number) => {
              const maxCount = stats?.topSongs[0]?.count || 10;
              const pct = Math.round((song.count / maxCount) * 100);

              return (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-neutral-200">
                      #{idx + 1} {song.title}
                    </span>
                    <span className="font-mono text-cyan-400 tabular-nums">
                      {song.count} vezes
                    </span>
                  </div>
                  <div className="w-full bg-neutral-950 h-2 rounded-full overflow-hidden border border-neutral-800">
                    <div
                      className="bg-gradient-to-r from-cyan-500 to-cyan-400 h-full rounded-full transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Popular Genres Distribution */}
        <div className="p-5 rounded-2xl bg-neutral-900/70 border border-neutral-800 space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-fuchsia-400" />
            <span>Gêneros Mais Populares</span>
          </h3>

          <div className="space-y-3">
            {(stats?.genreDistribution || []).map((item: any, idx: number) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-neutral-200">{item.genre}</span>
                  <span className="font-mono text-fuchsia-400 tabular-nums">
                    {item.percentage}%
                  </span>
                </div>
                <div className="w-full bg-neutral-950 h-2 rounded-full overflow-hidden border border-neutral-800">
                  <div
                    className="bg-gradient-to-r from-fuchsia-500 to-indigo-400 h-full rounded-full transition-all duration-500"
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Hourly Peak Activity */}
        <div className="p-5 rounded-2xl bg-neutral-900/70 border border-neutral-800 space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-400" />
            <span>Horários de Maior Movimento</span>
          </h3>

          <div className="flex items-end justify-between gap-3 h-40 pt-4 px-2">
            {(stats?.hourlyActivity || []).map((hour: any, idx: number) => {
              const maxSingers = 20;
              const heightPct = Math.min(100, Math.round((hour.singers / maxSingers) * 100));

              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                  <span className="text-[11px] font-mono text-amber-300 font-bold tabular-nums">
                    {hour.singers}
                  </span>
                  <div
                    className="w-full bg-gradient-to-t from-amber-500/80 to-amber-300 rounded-t-md transition-all duration-500"
                    style={{ height: `${heightPct}%` }}
                  />
                  <span className="text-[10px] text-neutral-400 font-mono">
                    {hour.hour}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Score Leaderboard */}
        <div className="p-5 rounded-2xl bg-neutral-900/70 border border-neutral-800 space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Award className="w-4 h-4 text-emerald-400" />
            <span>Top Cantores da Noite</span>
          </h3>

          <div className="space-y-2">
            {scores.slice(0, 5).map((sc, idx) => (
              <div
                key={sc.id}
                className="p-2.5 rounded-xl bg-neutral-950/60 border border-neutral-800/80 flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-6 h-6 rounded-md flex items-center justify-center font-mono font-bold text-[11px] ${
                      idx === 0
                        ? 'bg-amber-400 text-neutral-950'
                        : idx === 1
                        ? 'bg-slate-300 text-neutral-950'
                        : 'bg-neutral-800 text-neutral-400'
                    }`}
                  >
                    #{idx + 1}
                  </div>
                  <div>
                    <div className="font-bold text-white">{sc.singerName}</div>
                    <div className="text-[11px] text-neutral-400">{sc.songTitle}</div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-base font-bold font-mono text-cyan-400 tabular-nums">
                    {sc.finalScore} pts
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
