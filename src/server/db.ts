import fs from 'fs';
import path from 'path';
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

export interface DatabaseSchema {
  users: User[];
  events: KaraokeEvent[];
  songs: Song[];
  queue: QueueItem[];
  reactions: LiveReaction[];
  reactionCounts: ReactionCounts;
  scores: ScoreRecord[];
  playlists: Playlist[];
  settings: SystemSettings;
  plans: CommercialPlan[];
  tickets: SupportTicket[];
  logs: { id: string; timestamp: string; action: string; details: string }[];
}

const DB_DIR = path.resolve(process.cwd(), 'data');
const DB_PATH = path.join(DB_DIR, 'karaoke_db.json');

const DEFAULT_SETTINGS: SystemSettings = {
  establishmentName: 'KARAOKÊ SHOW BAR',
  logoUrl: '',
  neonTheme: 'cyan',
  backgroundStyle: 'abstract',
  scoringMode: 'auto',
  photoCaptureEnabled: true,
  photoCountdownSeconds: 5,
  autoDjEnabled: false,
  intermissionSeconds: 6,
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
};

const DEFAULT_PLANS: CommercialPlan[] = [
  {
    id: 'prata',
    name: 'PACOTE PRATA',
    price: 37,
    priceFormatted: 'R$ 37,00',
    description: 'Ideal para festas caseiras e pequenas reuniões.',
    features: [
      'Programa Karaokê 5.0 Completo',
      'Acervo local e catálogo rico',
      'Controle pelo celular via QR Code',
      'Sistema de pontuação básico',
      'Controle de tom (-3 a +3)',
      'Personalização visual básica',
      'Modo público para TV/Projetor',
      'Modo operador dedicado',
      'Gerenciamento de playlists',
      'Estatísticas da sessão'
    ]
  },
  {
    id: 'ouro',
    name: 'PACOTE OURO',
    price: 57,
    priceFormatted: 'R$ 57,00',
    badge: 'MAIS ESCOLHIDO',
    popular: true,
    description: 'Para bares, pubs e operadores de eventos frequentes.',
    features: [
      'Tudo do Pacote Prata, mais:',
      'Sistema avançado de reações em tempo real',
      'Modo Foto do Cantor com moldura personalizada',
      'Sugestões inteligentes de repertório',
      'Estatísticas avançadas e gráficos',
      'Recursos extras de personalização de marca',
      'Recursos avançados para eventos e histórico',
      'Modo Auto-DJ sem interrupção de silêncio'
    ]
  },
  {
    id: 'diamante',
    name: 'PACOTE DIAMANTE',
    price: 77,
    priceFormatted: 'R$ 77,00',
    badge: 'PROFISSIONAL',
    description: 'A solução definitiva para grandes eventos, DJs e redes de bares.',
    features: [
      'Tudo do Pacote Ouro, mais:',
      'Todos os recursos ilimitados desbloqueados',
      'Personalização visual total com logo e temas',
      'Recursos profissionais para multi-telas (Dual Monitor 4K)',
      'Gerenciamento multi-operador e admin',
      'Exportação de relatórios e ranking de cantores',
      'Suporte prioritário 24/7 via WhatsApp/Helpdesk'
    ]
  }
];

const DEFAULT_PLAYLISTS: Playlist[] = [];

const INITIAL_QUEUE: QueueItem[] = [];

class Database {
  private data: DatabaseSchema;

  constructor() {
    this.data = this.load();
  }

  private load(): DatabaseSchema {
    try {
      if (fs.existsSync(DB_PATH)) {
        const fileContent = fs.readFileSync(DB_PATH, 'utf-8');
        const parsed = JSON.parse(fileContent);
        // Ensure defaults merge
        return {
          users: parsed.users || this.getDefaultUsers(),
          events: parsed.events || this.getDefaultEvents(),
          songs: parsed.songs || INITIAL_SONGS,
          queue: parsed.queue || INITIAL_QUEUE,
          reactions: parsed.reactions || [],
          reactionCounts: parsed.reactionCounts || { fire: 34, applause: 28, heart: 42, laugh: 12, mic: 19, star: 25, rocket: 16, total: 176 },
          scores: parsed.scores || this.getDefaultScores(),
          playlists: parsed.playlists || DEFAULT_PLAYLISTS,
          settings: { ...DEFAULT_SETTINGS, ...(parsed.settings || {}) },
          plans: parsed.plans || DEFAULT_PLANS,
          tickets: parsed.tickets || this.getDefaultTickets(),
          logs: parsed.logs || []
        };
      }
    } catch (err) {
      console.warn('Could not read existing database file, initializing default:', err);
    }

    const defaultData: DatabaseSchema = {
      users: this.getDefaultUsers(),
      events: this.getDefaultEvents(),
      songs: INITIAL_SONGS,
      queue: INITIAL_QUEUE,
      reactions: [],
      reactionCounts: { fire: 34, applause: 28, heart: 42, laugh: 12, mic: 19, star: 25, rocket: 16, total: 176 },
      scores: this.getDefaultScores(),
      playlists: DEFAULT_PLAYLISTS,
      settings: DEFAULT_SETTINGS,
      plans: DEFAULT_PLANS,
      tickets: this.getDefaultTickets(),
      logs: [
        {
          id: 'log-1',
          timestamp: new Date().toISOString(),
          action: 'SYSTEM_STARTUP',
          details: 'KARAOKÊ 5.0 iniciado com sucesso com persistência ativa.'
        }
      ]
    };

    this.save(defaultData);
    return defaultData;
  }

  private save(dataToSave?: DatabaseSchema) {
    try {
      if (!fs.existsSync(DB_DIR)) {
        fs.mkdirSync(DB_DIR, { recursive: true });
      }
      fs.writeFileSync(DB_PATH, JSON.stringify(dataToSave || this.data, null, 2), 'utf-8');
    } catch (err) {
      console.error('Error writing to database file:', err);
    }
  }

  private getDefaultUsers(): User[] {
    return [
      {
        id: 'usr-admin',
        name: 'Administrador Master',
        email: 'admin@karaoke50.com.br',
        role: 'admin',
        planId: 'diamante',
        establishmentName: 'KARAOKÊ SHOW BAR',
        createdAt: new Date().toISOString()
      },
      {
        id: 'usr-operator',
        name: 'DJ Ricardo (Operador)',
        email: 'operador@karaoke50.com.br',
        role: 'operator',
        planId: 'ouro',
        establishmentName: 'Bar XYZ & Lounge',
        createdAt: new Date().toISOString()
      }
    ];
  }

  private getDefaultEvents(): KaraokeEvent[] {
    return [
      {
        id: 'evt-sabado',
        title: 'KARAOKÊ SÁBADO SUPREMO',
        date: '03/10/2026',
        location: 'Bar XYZ & Lounge',
        status: 'active',
        sessionCode: 'KARAOKE50',
        totalSingers: 14,
        totalSongsSung: 22,
        totalReactions: 312,
        createdAt: new Date().toISOString()
      }
    ];
  }

  private getDefaultScores(): ScoreRecord[] {
    return [
      {
        id: 'sc-1',
        songTitle: 'Evidências',
        artist: 'Chitãozinho & Xororó',
        singerName: 'João Silva',
        finalScore: 94,
        vocalScore: 92,
        energyScore: 98,
        crowdScore: 95,
        totalReactions: 48,
        mode: 'auto',
        performedAt: new Date(Date.now() - 3600000).toISOString(),
        eventId: 'evt-sabado'
      },
      {
        id: 'sc-2',
        songTitle: 'Garganta',
        artist: 'Ana Carolina',
        singerName: 'Beatriz Lima',
        finalScore: 89,
        vocalScore: 90,
        energyScore: 88,
        crowdScore: 89,
        totalReactions: 35,
        mode: 'microphone',
        performedAt: new Date(Date.now() - 7200000).toISOString(),
        eventId: 'evt-sabado'
      },
      {
        id: 'sc-3',
        songTitle: 'Primeiros Erros',
        artist: 'Capital Inicial',
        singerName: 'Lucas Prado',
        finalScore: 96,
        vocalScore: 95,
        energyScore: 99,
        crowdScore: 97,
        totalReactions: 62,
        mode: 'crowd',
        performedAt: new Date(Date.now() - 10800000).toISOString(),
        eventId: 'evt-sabado'
      }
    ];
  }

  private getDefaultTickets(): SupportTicket[] {
    return [
      {
        id: 'tkt-1',
        userName: 'Marcos Vinícius',
        userEmail: 'marcos@barzinho.com',
        subject: 'Como configurar saída de áudio para TV e fone simultaneamente?',
        category: 'audio',
        status: 'resolvido',
        message: 'Gostaria de monitorar pelo fone enquanto a mesa de som recebe o áudio.',
        createdAt: new Date(Date.now() - 86400000).toISOString()
      }
    ];
  }

  // Getters
  public getUsers(): User[] { return this.data.users; }
  public getEvents(): KaraokeEvent[] { return this.data.events; }
  public getSongs(): Song[] { return this.data.songs; }
  public getQueue(): QueueItem[] { return this.data.queue; }
  public getReactions(): LiveReaction[] { return this.data.reactions; }
  public getReactionCounts(): ReactionCounts { return this.data.reactionCounts; }
  public getScores(): ScoreRecord[] { return this.data.scores; }
  public getPlaylists(): Playlist[] { return this.data.playlists; }
  public getSettings(): SystemSettings { return this.data.settings; }
  public getPlans(): CommercialPlan[] { return this.data.plans; }
  public getTickets(): SupportTicket[] { return this.data.tickets; }
  public getLogs() { return this.data.logs; }

  // Setters & mutations
  public addUser(user: User) {
    this.data.users.push(user);
    this.log('USER_REGISTERED', `Novo usuário: ${user.name} (${user.email})`);
    this.save();
    return user;
  }

  public updateSettings(newSettings: Partial<SystemSettings>): SystemSettings {
    this.data.settings = { ...this.data.settings, ...newSettings };
    this.log('SETTINGS_UPDATED', 'Configurações do sistema atualizadas');
    this.save();
    return this.data.settings;
  }

  public setQueue(queue: QueueItem[]) {
    this.data.queue = queue;
    this.save();
  }

  public addToQueue(item: QueueItem): QueueItem {
    this.data.queue.push(item);
    // recalculate positions
    this.data.queue.forEach((q, index) => {
      q.position = index + 1;
      q.estimatedWaitMinutes = index * 4;
    });
    this.log('QUEUE_ADD', `Adicionado à fila: ${item.songTitle} para ${item.singerName}`);
    this.save();
    return item;
  }

  public removeFromQueue(id: string) {
    this.data.queue = this.data.queue.filter((q) => q.id !== id);
    this.data.queue.forEach((q, index) => {
      q.position = index + 1;
      q.estimatedWaitMinutes = index * 4;
    });
    this.log('QUEUE_REMOVE', `Item removido da fila: ${id}`);
    this.save();
    return this.data.queue;
  }

  public updateQueueItem(id: string, updates: Partial<QueueItem>) {
    const item = this.data.queue.find((q) => q.id === id);
    if (item) {
      Object.assign(item, updates);
      this.save();
    }
    return item;
  }

  public addReaction(reaction: LiveReaction) {
    this.data.reactions.push(reaction);
    if (this.data.reactions.length > 50) {
      this.data.reactions.shift();
    }

    // Update counts
    const type = reaction.type;
    if (type in this.data.reactionCounts) {
      (this.data.reactionCounts as any)[type] = ((this.data.reactionCounts as any)[type] || 0) + 1;
      this.data.reactionCounts.total++;
    }

    // Active event count
    const activeEvent = this.data.events.find((e) => e.status === 'active');
    if (activeEvent) {
      activeEvent.totalReactions++;
    }

    this.save();
    return { reaction, counts: this.data.reactionCounts };
  }

  public addScore(score: ScoreRecord) {
    this.data.scores.unshift(score);
    const activeEvent = this.data.events.find((e) => e.status === 'active');
    if (activeEvent) {
      activeEvent.totalSongsSung++;
    }
    this.log('SCORE_RECORDED', `Nota registrada: ${score.finalScore} para ${score.singerName} (${score.songTitle})`);
    this.save();
    return score;
  }

  public addSong(song: Song) {
    this.data.songs.unshift(song);
    this.log('SONG_ADDED', `Nova música no acervo: ${song.title} - ${song.artist}`);
    this.save();
    return song;
  }

  public savePlaylist(playlist: Playlist) {
    const index = this.data.playlists.findIndex((p) => p.id === playlist.id);
    if (index >= 0) {
      this.data.playlists[index] = playlist;
    } else {
      this.data.playlists.push(playlist);
    }
    this.save();
    return playlist;
  }

  public deletePlaylist(id: string) {
    this.data.playlists = this.data.playlists.filter((p) => p.id !== id);
    this.save();
    return this.data.playlists;
  }

  public createEvent(event: KaraokeEvent) {
    this.data.events.forEach((e) => { e.status = 'closed'; });
    this.data.events.unshift(event);
    this.log('EVENT_CREATED', `Evento iniciado: ${event.title} (${event.sessionCode})`);
    this.save();
    return event;
  }

  public closeEvent(id: string) {
    const event = this.data.events.find((e) => e.id === id);
    if (event) {
      event.status = 'closed';
      this.log('EVENT_CLOSED', `Evento encerrado: ${event.title}`);
      this.save();
    }
    return event;
  }

  public addTicket(ticket: SupportTicket) {
    this.data.tickets.unshift(ticket);
    this.log('TICKET_CREATED', `Novo chamado de suporte: ${ticket.subject}`);
    this.save();
    return ticket;
  }

  public updatePlan(id: string, updates: Partial<CommercialPlan>) {
    const plan = this.data.plans.find((p) => p.id === id);
    if (plan) {
      Object.assign(plan, updates);
      this.save();
    }
    return plan;
  }

  public log(action: string, details: string) {
    this.data.logs.unshift({
      id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toISOString(),
      action,
      details
    });
    if (this.data.logs.length > 100) {
      this.data.logs.pop();
    }
  }
}

export const db = new Database();
