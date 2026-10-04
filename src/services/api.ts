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
  SupportTicket
} from '../types';
import { INITIAL_SONGS } from '../data/initialCatalog';

// Offline fallback state in localStorage for complete zero-downtime offline support
const OFFLINE_KEY_QUEUE = 'karaoke50_offline_queue';
const OFFLINE_KEY_SETTINGS = 'karaoke50_offline_settings';
const OFFLINE_KEY_SCORES = 'karaoke50_offline_scores';

function getOfflineStorage<T>(key: string, fallback: T): T {
  try {
    const val = localStorage.getItem(key);
    return val ? JSON.parse(val) : fallback;
  } catch {
    return fallback;
  }
}

function setOfflineStorage<T>(key: string, val: T) {
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch {}
}

export const api = {
  // Check online status
  isOnline(): boolean {
    return typeof navigator !== 'undefined' ? navigator.onLine : true;
  },

  // Auth
  async login(email: string, password: string): Promise<{ token: string; user: User }> {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Falha no login');
      }
      return await res.json();
    } catch (err: any) {
      // Local fallback login if offline
      if (!navigator.onLine) {
        const fallbackUser: User = {
          id: 'usr-local',
          name: email.split('@')[0] || 'Operador Local',
          email,
          role: 'operator',
          planId: 'diamante',
          createdAt: new Date().toISOString()
        };
        return { token: 'tok_offline', user: fallbackUser };
      }
      throw err;
    }
  },

  async register(data: { name: string; email: string; password: string; establishmentName?: string; planId?: string }): Promise<{ token: string; user: User }> {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Erro ao registrar usuário');
    }
    return await res.json();
  },

  async getCurrentUser(): Promise<User | null> {
    try {
      const res = await fetch('/api/auth/me');
      if (res.ok) {
        const data = await res.json();
        return data.user;
      }
    } catch {}
    return null;
  },

  // Events
  async getActiveEvent(): Promise<KaraokeEvent> {
    try {
      const res = await fetch('/api/events/active');
      if (res.ok) {
        const data = await res.json();
        if (data.event) return data.event;
      }
    } catch {}
    return {
      id: 'evt-local',
      title: 'KARAOKÊ SÁBADO SUPREMO',
      date: new Date().toLocaleDateString('pt-BR'),
      location: 'Palco Karaokê 5.0',
      status: 'active',
      sessionCode: 'KARAOKE50',
      totalSingers: 14,
      totalSongsSung: 22,
      totalReactions: 312,
      createdAt: new Date().toISOString()
    };
  },

  async createEvent(title: string, location?: string, sessionCode?: string): Promise<KaraokeEvent> {
    const res = await fetch('/api/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, location, sessionCode })
    });
    const data = await res.json();
    return data.event;
  },

  // YouTube Real Karaoke Search
  async searchYouTube(query: string): Promise<any[]> {
    try {
      const res = await fetch(`/api/youtube/search?q=${encodeURIComponent(query)}`);
      if (res.ok) {
        const data = await res.json();
        return data.videos || [];
      }
    } catch (err) {
      console.warn('YouTube search request failed:', err);
    }
    return [];
  },

  // Songs
  async getSongs(query = '', genre = 'Todos'): Promise<Song[]> {
    try {
      const params = new URLSearchParams();
      if (query) params.set('q', query);
      if (genre && genre !== 'Todos') params.set('genre', genre);

      const res = await fetch(`/api/songs?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        return data.songs;
      }
    } catch {}
    // Offline filter
    let list = INITIAL_SONGS;
    if (genre && genre !== 'Todos') {
      list = list.filter((s) => s.genre === genre);
    }
    if (query) {
      const q = query.toLowerCase();
      list = list.filter((s) => s.title.toLowerCase().includes(q) || s.artist.toLowerCase().includes(q) || s.lyricsSnippet.toLowerCase().includes(q));
    }
    return list;
  },

  async addSong(songData: Partial<Song>): Promise<Song> {
    const res = await fetch('/api/songs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(songData)
    });
    const data = await res.json();
    return data.song;
  },

  // Queue
  async getQueue(): Promise<QueueItem[]> {
    try {
      const res = await fetch('/api/queue');
      if (res.ok) {
        const data = await res.json();
        setOfflineStorage(OFFLINE_KEY_QUEUE, data.queue);
        return data.queue;
      }
    } catch {}
    return getOfflineStorage<QueueItem[]>(OFFLINE_KEY_QUEUE, []);
  },

  async addToQueue(
    songId: string,
    singerName: string,
    pitchShift = 0,
    addedBy: 'operator' | 'mobile' = 'operator',
    extra?: {
      youtubeId?: string;
      songTitle?: string;
      artist?: string;
      genre?: string;
      duration?: number;
      thumbnail?: string;
    }
  ): Promise<QueueItem> {
    try {
      const res = await fetch('/api/queue', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          songId,
          singerName,
          pitchShift,
          addedBy,
          youtubeId: extra?.youtubeId,
          songTitle: extra?.songTitle,
          artist: extra?.artist,
          genre: extra?.genre,
          duration: extra?.duration,
          thumbnail: extra?.thumbnail
        })
      });
      if (res.ok) {
        const data = await res.json();
        return data.item;
      }
    } catch {}

    // Offline addition
    const songs = INITIAL_SONGS;
    const song = songs.find((s) => s.id === songId) || {
      id: songId,
      title: extra?.songTitle || 'Música do YouTube',
      artist: extra?.artist || 'YouTube',
      genre: (extra?.genre as any) || 'Pop',
      duration: extra?.duration || 240,
      durationFormatted: '4:00',
      youtubeId: extra?.youtubeId,
      thumbnail: extra?.thumbnail,
      lyricsSnippet: 'Faixa do YouTube',
      lyrics: [],
      source: 'YouTube' as const
    };
    const currentQueue = getOfflineStorage<QueueItem[]>(OFFLINE_KEY_QUEUE, []);
    const newItem: QueueItem = {
      id: `q-offline-${Date.now()}`,
      songId: song.id,
      songTitle: song.title,
      artist: song.artist,
      singerName,
      genre: song.genre,
      duration: song.duration,
      pitchShift,
      youtubeId: extra?.youtubeId || (song as any).youtubeId,
      thumbnail: extra?.thumbnail || (song as any).thumbnail,
      status: currentQueue.length === 0 ? 'playing' : 'waiting',
      position: currentQueue.length + 1,
      addedAt: new Date().toISOString(),
      addedBy,
      estimatedWaitMinutes: currentQueue.length * 4
    };
    currentQueue.push(newItem);
    setOfflineStorage(OFFLINE_KEY_QUEUE, currentQueue);
    return newItem;
  },

  async removeFromQueue(id: string): Promise<QueueItem[]> {
    try {
      const res = await fetch(`/api/queue/${id}`, { method: 'DELETE' });
      if (res.ok) {
        const data = await res.json();
        return data.queue;
      }
    } catch {}
    const queue = getOfflineStorage<QueueItem[]>(OFFLINE_KEY_QUEUE, []).filter((q) => q.id !== id);
    setOfflineStorage(OFFLINE_KEY_QUEUE, queue);
    return queue;
  },

  async updateQueueItem(id: string, updates: Partial<QueueItem>): Promise<QueueItem | null> {
    try {
      const res = await fetch(`/api/queue/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      if (res.ok) {
        const data = await res.json();
        return data.item;
      }
    } catch {}
    return null;
  },

  async reorderQueue(queue: QueueItem[]): Promise<QueueItem[]> {
    try {
      const res = await fetch('/api/queue/reorder', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ queue })
      });
      if (res.ok) {
        const data = await res.json();
        return data.queue;
      }
    } catch {}
    setOfflineStorage(OFFLINE_KEY_QUEUE, queue);
    return queue;
  },

  // Reactions
  async sendReaction(type: string, senderName = 'Convidado'): Promise<any> {
    const res = await fetch('/api/reactions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, senderName })
    });
    return await res.json();
  },

  async getReactions(since = 0): Promise<{ recent: LiveReaction[]; counts: ReactionCounts }> {
    try {
      const url = since > 0 ? `/api/reactions?since=${since}` : '/api/reactions';
      const res = await fetch(url);
      if (res.ok) return await res.json();
    } catch {}
    return {
      recent: [],
      counts: { fire: 0, applause: 0, heart: 0, laugh: 0, mic: 0, star: 0, rocket: 0, total: 0 }
    };
  },

  // Scores
  async saveScore(scoreData: Partial<ScoreRecord>): Promise<ScoreRecord> {
    try {
      const res = await fetch('/api/scores', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(scoreData)
      });
      if (res.ok) {
        const data = await res.json();
        return data.score;
      }
    } catch {}

    const localRecord: ScoreRecord = {
      id: `sc-offline-${Date.now()}`,
      songTitle: scoreData.songTitle || 'Música',
      artist: scoreData.artist || 'Artista',
      singerName: scoreData.singerName || 'Cantor',
      finalScore: scoreData.finalScore || 90,
      vocalScore: scoreData.vocalScore || 88,
      energyScore: scoreData.energyScore || 92,
      crowdScore: scoreData.crowdScore || 90,
      totalReactions: scoreData.totalReactions || 20,
      mode: scoreData.mode || 'auto',
      photoDataUrl: scoreData.photoDataUrl,
      performedAt: new Date().toISOString(),
      eventId: 'evt-offline'
    };
    const current = getOfflineStorage<ScoreRecord[]>(OFFLINE_KEY_SCORES, []);
    current.unshift(localRecord);
    setOfflineStorage(OFFLINE_KEY_SCORES, current);
    return localRecord;
  },

  async getScores(): Promise<ScoreRecord[]> {
    try {
      const res = await fetch('/api/scores');
      if (res.ok) {
        const data = await res.json();
        return data.scores;
      }
    } catch {}
    return getOfflineStorage<ScoreRecord[]>(OFFLINE_KEY_SCORES, []);
  },

  // Playlists
  async getPlaylists(): Promise<Playlist[]> {
    try {
      const res = await fetch('/api/playlists');
      if (res.ok) {
        const data = await res.json();
        return data.playlists;
      }
    } catch {}
    return [];
  },

  async savePlaylist(playlistData: Partial<Playlist>): Promise<Playlist> {
    const res = await fetch('/api/playlists', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(playlistData)
    });
    const data = await res.json();
    return data.playlist;
  },

  // Settings
  async getSettings(): Promise<SystemSettings> {
    try {
      const res = await fetch('/api/settings');
      if (res.ok) {
        const data = await res.json();
        setOfflineStorage(OFFLINE_KEY_SETTINGS, data.settings);
        return data.settings;
      }
    } catch {}
    return getOfflineStorage<SystemSettings>(OFFLINE_KEY_SETTINGS, {
      establishmentName: 'KARAOKÊ SHOW BAR',
      neonTheme: 'cyan',
      backgroundStyle: 'abstract',
      scoringMode: 'auto',
      photoCaptureEnabled: true,
      photoCountdownSeconds: 5,
      autoDjEnabled: true,
      intermissionSeconds: 8,
      publicScreenWatermark: true,
      shortcuts: {
        playPause: 'Space',
        next: 'Enter',
        stop: 'Escape',
        volumeUp: 'ArrowUp',
        volumeDown: 'ArrowDown',
        pitchUp: 'PageUp',
        pitchDown: 'PageDown'
      }
    });
  },

  async updateSettings(settings: Partial<SystemSettings>): Promise<SystemSettings> {
    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });
      if (res.ok) {
        const data = await res.json();
        return data.settings;
      }
    } catch {}
    const cur = await this.getSettings();
    const updated = { ...cur, ...settings };
    setOfflineStorage(OFFLINE_KEY_SETTINGS, updated);
    return updated;
  },

  // Stats
  async getStats(): Promise<any> {
    try {
      const res = await fetch('/api/stats');
      if (res.ok) return await res.json();
    } catch {}
    return {
      totalSongsInCatalog: INITIAL_SONGS.length,
      totalPerformances: 24,
      averageScore: 92,
      totalReactions: 176,
      currentQueueLength: 3,
      activeSingersCount: 14,
      topSongs: [
        { title: 'Evidências', count: 9 },
        { title: 'Cheia de Manias', count: 7 },
        { title: 'Tempo Perdido', count: 5 }
      ],
      genreDistribution: [
        { genre: 'Sertanejo', percentage: 35 },
        { genre: 'Pagode', percentage: 25 },
        { genre: 'Rock', percentage: 20 },
        { genre: 'Pop', percentage: 12 },
        { genre: 'Outros', percentage: 8 }
      ],
      hourlyActivity: [
        { hour: '20h', singers: 4 },
        { hour: '21h', singers: 8 },
        { hour: '22h', singers: 15 },
        { hour: '23h', singers: 18 }
      ]
    };
  },

  // Plans & Checkout
  async getPlans(): Promise<CommercialPlan[]> {
    try {
      const res = await fetch('/api/plans');
      if (res.ok) {
        const data = await res.json();
        return data.plans;
      }
    } catch {}
    return [];
  },

  async processCheckout(planId: string, customerName: string, customerEmail: string, paymentMethod: string): Promise<any> {
    const res = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ planId, customerName, customerEmail, paymentMethod })
    });
    return await res.json();
  },

  // Tickets
  async submitTicket(data: Partial<SupportTicket>): Promise<SupportTicket> {
    const res = await fetch('/api/tickets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const json = await res.json();
    return json.ticket;
  },

  async getTickets(): Promise<SupportTicket[]> {
    try {
      const res = await fetch('/api/tickets');
      if (res.ok) {
        const data = await res.json();
        return data.tickets;
      }
    } catch {}
    return [];
  },

  // Admin logs
  async getLogs(): Promise<any[]> {
    try {
      const res = await fetch('/api/admin/logs');
      if (res.ok) {
        const data = await res.json();
        return data.logs;
      }
    } catch {}
    return [];
  },

  // Network & Public Access Info for Real Smartphone Scanning
  async getNetworkInfo(): Promise<{
    lanIp: string;
    lanUrl: string;
    currentHostUrl: string;
    publicSharedUrl: string;
    publicDevUrl: string;
    recommendedUrl: string;
  }> {
    try {
      const res = await fetch('/api/network-info');
      if (res.ok) return await res.json();
    } catch {}
    const isCloud = typeof window !== 'undefined' && window.location.origin.includes('.run.app');
    const cloudUrl = isCloud ? window.location.origin : 'https://ais-pre-zpcx6oattcp7qmjuiacmzl-855002600123.us-east1.run.app';
    return {
      lanIp: 'localhost',
      lanUrl: 'http://localhost:3000',
      currentHostUrl: typeof window !== 'undefined' ? window.location.origin : '',
      publicSharedUrl: 'https://ais-pre-zpcx6oattcp7qmjuiacmzl-855002600123.us-east1.run.app',
      publicDevUrl: 'https://ais-dev-zpcx6oattcp7qmjuiacmzl-855002600123.us-east1.run.app',
      recommendedUrl: cloudUrl
    };
  }
};
