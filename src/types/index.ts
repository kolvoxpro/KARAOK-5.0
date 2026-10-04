export type UserRole = 'operator' | 'admin' | 'guest';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  planId?: string;
  establishmentName?: string;
  createdAt: string;
}

export type MusicGenre =
  | 'Sertanejo'
  | 'Pagode'
  | 'Samba'
  | 'Rock'
  | 'Pop'
  | 'MPB'
  | 'Funk'
  | 'Rap'
  | 'Gospel'
  | 'Internacional'
  | 'Anos 80'
  | 'Anos 90'
  | 'Anos 2000'
  | 'Outros';

export interface LyricLine {
  time: number; // in seconds
  text: string;
}

export interface Song {
  id: string;
  title: string;
  artist: string;
  genre: MusicGenre;
  duration: number; // in seconds
  durationFormatted: string;
  lyrics: LyricLine[];
  lyricsSnippet: string;
  audioUrl?: string; // local or authorized url
  youtubeId?: string; // YouTube video ID for real karaoke stream
  thumbnail?: string;
  source: 'Acervo Local' | 'Importado' | 'Online Autorizado' | 'YouTube';
  key?: string; // original musical key (e.g. "G", "Am")
  coverUrl?: string;
}

export type QueueItemStatus = 'playing' | 'waiting' | 'finished' | 'skipped';

export interface QueueItem {
  id: string;
  songId: string;
  songTitle: string;
  artist: string;
  singerName: string;
  genre: MusicGenre;
  duration: number;
  pitchShift: number; // -3 to +3 semitones
  youtubeId?: string;
  thumbnail?: string;
  status: QueueItemStatus;
  position: number;
  addedAt: string;
  addedBy: 'operator' | 'mobile';
  estimatedWaitMinutes?: number;
  score?: number;
}

export type ReactionType = 'fire' | 'applause' | 'heart' | 'laugh' | 'mic' | 'star' | 'rocket';

export interface LiveReaction {
  id: string;
  type: ReactionType;
  emoji: string;
  senderName: string;
  timestamp: number;
  count: number;
}

export interface ReactionCounts {
  fire: number;
  applause: number;
  heart: number;
  laugh: number;
  mic: number;
  star: number;
  rocket: number;
  total: number;
}

export type ScoringMode = 'auto' | 'microphone' | 'crowd' | 'random' | 'manual';

export interface ScoreRecord {
  id: string;
  songTitle: string;
  artist: string;
  singerName: string;
  finalScore: number;
  vocalScore: number;
  energyScore: number;
  crowdScore: number;
  totalReactions: number;
  mode: ScoringMode;
  photoDataUrl?: string;
  performedAt: string;
  eventId: string;
}

export interface KaraokeEvent {
  id: string;
  title: string;
  date: string;
  location: string;
  status: 'active' | 'closed';
  sessionCode: string;
  totalSingers: number;
  totalSongsSung: number;
  totalReactions: number;
  createdAt: string;
}

export interface Playlist {
  id: string;
  name: string;
  description: string;
  songIds: string[];
  isAutoDj: boolean;
  createdAt: string;
}

export interface SystemSettings {
  establishmentName: string;
  logoUrl?: string;
  neonTheme: 'cyan' | 'fuchsia' | 'emerald' | 'amber' | 'violet';
  backgroundStyle: 'abstract' | 'minimal' | 'stage';
  scoringMode: ScoringMode;
  photoCaptureEnabled: boolean;
  photoCountdownSeconds: number;
  autoDjEnabled: boolean;
  intermissionSeconds: number;
  publicScreenWatermark: boolean;
  shortcuts: {
    playPause: string;
    next: string;
    stop: string;
    volumeUp: string;
    volumeDown: string;
    pitchUp: string;
    pitchDown: string;
  };
}

export interface CommercialPlan {
  id: string;
  name: string;
  price: number;
  priceFormatted: string;
  badge?: string;
  description: string;
  features: string[];
  popular?: boolean;
}

export interface SupportTicket {
  id: string;
  userName: string;
  userEmail: string;
  subject: string;
  category: 'instalacao' | 'monitores' | 'audio' | 'celular' | 'pagamento' | 'outro';
  status: 'aberto' | 'em_analise' | 'resolvido';
  message: string;
  createdAt: string;
}
