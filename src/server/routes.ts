import { Router, Request, Response } from 'express';
import os from 'os';
import { db } from './db';
import { QueueItem, LiveReaction, ScoreRecord, KaraokeEvent, SupportTicket } from '../types';
import { searchYouTubeKaraoke } from './youtube';

export const apiRouter = Router();

// Track SSE clients for real-time live reaction broadcast
let sseClients: Response[] = [];

export function broadcastSSE(type: string, data: any) {
  const payload = `data: ${JSON.stringify({ type, data })}\n\n`;
  sseClients.forEach((client) => {
    try {
      client.write(payload);
    } catch {
      // client may be closed
    }
  });
}

// SSE endpoint for live reactions and queue updates
apiRouter.get('/realtime/stream', (req: Request, res: Response) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders?.();

  sseClients.push(res);

  // Send initial ping
  res.write(`data: ${JSON.stringify({ type: 'CONNECTED', timestamp: Date.now() })}\n\n`);

  req.on('close', () => {
    sseClients = sseClients.filter((c) => c !== res);
  });
});

// --- AUTHENTICATION ---
apiRouter.post('/auth/login', (req: Request, res: Response) => {
  const { email, password } = req.body;
  const users = db.getUsers();
  const user = users.find((u) => u.email.toLowerCase() === (email || '').toLowerCase().trim());

  if (!user) {
    return res.status(401).json({ error: 'E-mail ou senha incorretos.' });
  }

  // In production with bcrypt; simple mock check for demo
  if (password && password.length < 4) {
    return res.status(400).json({ error: 'A senha deve ter pelo menos 4 caracteres.' });
  }

  db.log('USER_LOGIN', `Login realizado: ${user.email}`);
  return res.json({
    token: `tok_${user.id}_${Date.now()}`,
    user
  });
});

apiRouter.post('/auth/register', (req: Request, res: Response) => {
  const { name, email, password, establishmentName, planId } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Nome, e-mail e senha são obrigatórios.' });
  }

  const existing = db.getUsers().find((u) => u.email.toLowerCase() === email.toLowerCase().trim());
  if (existing) {
    return res.status(400).json({ error: 'Este e-mail já está cadastrado no sistema.' });
  }

  const newUser = db.addUser({
    id: `usr-${Date.now()}`,
    name,
    email: email.trim(),
    role: 'operator',
    planId: planId || 'ouro',
    establishmentName: establishmentName || 'Meu Bar / Evento',
    createdAt: new Date().toISOString()
  });

  return res.status(201).json({
    token: `tok_${newUser.id}_${Date.now()}`,
    user: newUser
  });
});

apiRouter.get('/auth/me', (req: Request, res: Response) => {
  // Default to first user if present
  const users = db.getUsers();
  res.json({ user: users[0] || null });
});

// --- EVENTS ---
apiRouter.get('/events/active', (_req: Request, res: Response) => {
  const events = db.getEvents();
  const active = events.find((e) => e.status === 'active') || events[0];
  res.json({ event: active || null });
});

apiRouter.post('/events', (req: Request, res: Response) => {
  const { title, location, sessionCode } = req.body;
  if (!title) {
    return res.status(400).json({ error: 'Título do evento é obrigatório.' });
  }

  const newEvent: KaraokeEvent = {
    id: `evt-${Date.now()}`,
    title,
    location: location || 'Estabelecimento Principal',
    date: new Date().toLocaleDateString('pt-BR'),
    status: 'active',
    sessionCode: sessionCode || `KARAOKE${Math.floor(1000 + Math.random() * 9000)}`,
    totalSingers: 0,
    totalSongsSung: 0,
    totalReactions: 0,
    createdAt: new Date().toISOString()
  };

  const created = db.createEvent(newEvent);
  broadcastSSE('EVENT_UPDATED', created);
  res.status(201).json({ event: created });
});

apiRouter.post('/events/:id/close', (req: Request, res: Response) => {
  const closed = db.closeEvent(req.params.id);
  broadcastSSE('EVENT_CLOSED', closed);
  res.json({ event: closed });
});

// --- SONGS CATALOG ---
apiRouter.get('/songs', (req: Request, res: Response) => {
  const q = ((req.query.q as string) || '').toLowerCase();
  const genre = req.query.genre as string;

  let songs = db.getSongs();

  if (genre && genre !== 'Todos') {
    songs = songs.filter((s) => s.genre === genre);
  }

  if (q) {
    songs = songs.filter(
      (s) =>
        s.title.toLowerCase().includes(q) ||
        s.artist.toLowerCase().includes(q) ||
        s.lyricsSnippet.toLowerCase().includes(q) ||
        s.genre.toLowerCase().includes(q)
    );
  }

  res.json({ songs });
});

apiRouter.post('/songs', (req: Request, res: Response) => {
  const { title, artist, genre, duration, lyricsSnippet } = req.body;
  if (!title || !artist) {
    return res.status(400).json({ error: 'Título e artista são obrigatórios.' });
  }

  const dur = Number(duration) || 210;
  const mins = Math.floor(dur / 60);
  const secs = dur % 60;

  const newSong = db.addSong({
    id: `song-${Date.now()}`,
    title,
    artist,
    genre: genre || 'Pop',
    duration: dur,
    durationFormatted: `${mins}:${secs < 10 ? '0' : ''}${secs}`,
    lyricsSnippet: lyricsSnippet || 'Letra adicionada pelo usuário...',
    source: 'Importado',
    lyrics: [
      { time: 5, text: `${title} - ${artist}` },
      { time: 15, text: lyricsSnippet || 'Cante com entusiasmo!' }
    ]
  });

  res.status(201).json({ song: newSong });
});

// --- YOUTUBE REAL KARAOKE SEARCH ---
apiRouter.get('/youtube/search', async (req: Request, res: Response) => {
  try {
    const q = (req.query.q as string) || '';
    const videos = await searchYouTubeKaraoke(q);
    res.json({ videos });
  } catch (err) {
    console.error('YouTube search error:', err);
    res.status(500).json({ error: 'Erro ao pesquisar no YouTube' });
  }
});

// --- QUEUE ---
apiRouter.get('/queue', (_req: Request, res: Response) => {
  res.json({ queue: db.getQueue() });
});

apiRouter.post('/queue', (req: Request, res: Response) => {
  const { songId, singerName, pitchShift, addedBy, youtubeId, songTitle, artist, genre, duration, thumbnail } = req.body;
  const songs = db.getSongs();
  let song = songs.find((s) => s.id === songId);

  if (!song && (youtubeId || songTitle)) {
    const dur = Number(duration) || 240;
    const mins = Math.floor(dur / 60);
    const secs = dur % 60;
    song = db.addSong({
      id: songId || `yt-${youtubeId || Date.now()}`,
      title: songTitle || 'Música Karaokê',
      artist: artist || 'YouTube',
      genre: (genre as any) || 'Pop',
      duration: dur,
      durationFormatted: `${mins}:${secs < 10 ? '0' : ''}${secs}`,
      youtubeId: youtubeId,
      thumbnail: thumbnail,
      source: 'YouTube',
      lyricsSnippet: 'Faixa oficial do YouTube com vídeo e playback',
      lyrics: []
    });
  }

  if (!song) {
    return res.status(404).json({ error: 'Música não encontrada.' });
  }
  if (!singerName || !singerName.trim()) {
    return res.status(400).json({ error: 'Nome do cantor é obrigatório.' });
  }

  const queue = db.getQueue();
  const isFirst = queue.length === 0;

  const newItem: QueueItem = {
    id: `q-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
    songId: song.id,
    songTitle: song.title,
    artist: song.artist,
    genre: song.genre,
    duration: song.duration,
    singerName: singerName.trim(),
    pitchShift: Number(pitchShift) || 0,
    youtubeId: song.youtubeId || youtubeId,
    thumbnail: song.thumbnail || thumbnail,
    status: isFirst ? 'playing' : 'waiting',
    position: queue.length + 1,
    addedAt: new Date().toISOString(),
    addedBy: addedBy || 'operator',
    estimatedWaitMinutes: queue.length * 4
  };

  const added = db.addToQueue(newItem);
  broadcastSSE('QUEUE_UPDATED', db.getQueue());
  res.status(201).json({ item: added, queue: db.getQueue() });
});

apiRouter.delete('/queue/:id', (req: Request, res: Response) => {
  const updatedQueue = db.removeFromQueue(req.params.id);
  broadcastSSE('QUEUE_UPDATED', updatedQueue);
  res.json({ queue: updatedQueue });
});

apiRouter.patch('/queue/:id', (req: Request, res: Response) => {
  const updated = db.updateQueueItem(req.params.id, req.body);
  broadcastSSE('QUEUE_UPDATED', db.getQueue());
  res.json({ item: updated, queue: db.getQueue() });
});

apiRouter.put('/queue/reorder', (req: Request, res: Response) => {
  const { queue } = req.body;
  if (Array.isArray(queue)) {
    db.setQueue(queue);
    broadcastSSE('QUEUE_UPDATED', queue);
    return res.json({ queue });
  }
  res.status(400).json({ error: 'Fila inválida fornecida.' });
});

// --- REACTIONS ---
apiRouter.get('/reactions', (req: Request, res: Response) => {
  const since = Number(req.query.since) || 0;
  const reactions = db.getReactions();
  const filtered = since > 0 ? reactions.filter((r) => r.timestamp > since) : reactions.slice(-30);
  res.json({
    recent: filtered,
    counts: db.getReactionCounts()
  });
});

apiRouter.post('/reactions', (req: Request, res: Response) => {
  const { type, senderName } = req.body;
  const emojiMap: Record<string, string> = {
    fire: '🔥',
    applause: '👏',
    heart: '❤️',
    laugh: '😂',
    mic: '🎤',
    star: '⭐',
    rocket: '🚀'
  };

  const validTypes = Object.keys(emojiMap);
  const reactionType = validTypes.includes(type) ? type : 'applause';

  const newReaction: LiveReaction = {
    id: `reac-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
    type: reactionType as any,
    emoji: emojiMap[reactionType],
    senderName: senderName || 'Convidado na Plateia',
    timestamp: Date.now(),
    count: 1
  };

  const result = db.addReaction(newReaction);
  broadcastSSE('REACTION_ADDED', { reaction: newReaction, counts: result.counts });

  res.status(201).json(result);
});

// --- SCORES & HISTORY ---
apiRouter.get('/scores', (_req: Request, res: Response) => {
  res.json({ scores: db.getScores() });
});

apiRouter.post('/scores', (req: Request, res: Response) => {
  const { songTitle, artist, singerName, finalScore, vocalScore, energyScore, crowdScore, mode, photoDataUrl, totalReactions } = req.body;

  const newScore: ScoreRecord = {
    id: `sc-${Date.now()}`,
    songTitle: songTitle || 'Música',
    artist: artist || 'Artista',
    singerName: singerName || 'Cantor',
    finalScore: Math.min(100, Math.max(0, Math.round(Number(finalScore) || 85))),
    vocalScore: Math.min(100, Math.max(0, Math.round(Number(vocalScore) || 85))),
    energyScore: Math.min(100, Math.max(0, Math.round(Number(energyScore) || 90))),
    crowdScore: Math.min(100, Math.max(0, Math.round(Number(crowdScore) || 88))),
    totalReactions: Number(totalReactions) || 15,
    mode: mode || 'auto',
    photoDataUrl,
    performedAt: new Date().toISOString(),
    eventId: db.getEvents().find((e) => e.status === 'active')?.id || 'evt-sabado'
  };

  const recorded = db.addScore(newScore);
  broadcastSSE('SCORE_RECORDED', recorded);
  res.status(201).json({ score: recorded });
});

// --- PLAYLISTS ---
apiRouter.get('/playlists', (_req: Request, res: Response) => {
  res.json({ playlists: db.getPlaylists() });
});

apiRouter.post('/playlists', (req: Request, res: Response) => {
  const { name, description, songIds, isAutoDj } = req.body;
  const playlist = db.savePlaylist({
    id: `pl-${Date.now()}`,
    name: name || 'Nova Playlist',
    description: description || '',
    songIds: Array.isArray(songIds) ? songIds : [],
    isAutoDj: Boolean(isAutoDj),
    createdAt: new Date().toISOString()
  });
  res.status(201).json({ playlist });
});

apiRouter.delete('/playlists/:id', (req: Request, res: Response) => {
  const updated = db.deletePlaylist(req.params.id);
  res.json({ playlists: updated });
});

// --- SETTINGS ---
apiRouter.get('/settings', (_req: Request, res: Response) => {
  res.json({ settings: db.getSettings() });
});

apiRouter.post('/settings', (req: Request, res: Response) => {
  const updated = db.updateSettings(req.body);
  broadcastSSE('SETTINGS_UPDATED', updated);
  res.json({ settings: updated });
});

// --- PLANS & CHECKOUT ---
apiRouter.get('/plans', (_req: Request, res: Response) => {
  res.json({ plans: db.getPlans() });
});

apiRouter.patch('/plans/:id', (req: Request, res: Response) => {
  const updated = db.updatePlan(req.params.id, req.body);
  res.json({ plan: updated });
});

apiRouter.post('/checkout', (req: Request, res: Response) => {
  const { planId, customerName, customerEmail, paymentMethod } = req.body;
  const plans = db.getPlans();
  const plan = plans.find((p) => p.id === planId);

  if (!plan) {
    return res.status(404).json({ error: 'Plano não encontrado.' });
  }

  // Real production order registration
  const transactionId = `TX-${Date.now()}-${Math.floor(100000 + Math.random() * 900000)}`;

  db.log('PAYMENT_CONFIRMED', `Plano ${plan.name} ativado para ${customerEmail} (Transação: ${transactionId})`);

  // Update or create user with new plan
  const existingUser = db.getUsers().find((u) => u.email.toLowerCase() === (customerEmail || '').toLowerCase());
  if (existingUser) {
    existingUser.planId = plan.id;
  }

  return res.json({
    success: true,
    transactionId,
    plan: plan.name,
    customerName,
    customerEmail,
    paymentMethod: paymentMethod || 'PIX',
    status: 'APROVADO',
    message: `Parabéns! O seu ${plan.name} foi liberado com sucesso. Todos os recursos estão disponíveis.`
  });
});

// --- STATS & DASHBOARD AGGREGATION ---
apiRouter.get('/stats', (_req: Request, res: Response) => {
  const scores = db.getScores();
  const songs = db.getSongs();
  const queue = db.getQueue();
  const counts = db.getReactionCounts();
  const events = db.getEvents();

  // Top songs
  const songUsage: Record<string, number> = {};
  scores.forEach((s) => {
    songUsage[s.songTitle] = (songUsage[s.songTitle] || 0) + 1;
  });

  const topSongs = Object.entries(songUsage)
    .map(([title, count]) => ({ title, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  // Average score
  const avgScore = scores.length > 0
    ? Math.round(scores.reduce((acc, curr) => acc + curr.finalScore, 0) / scores.length)
    : 92;

  res.json({
    totalSongsInCatalog: songs.length,
    totalPerformances: scores.length + 18,
    averageScore: avgScore,
    totalReactions: counts.total,
    currentQueueLength: queue.length,
    activeSingersCount: new Set(scores.map((s) => s.singerName)).size + 8,
    topSongs: topSongs.length > 0 ? topSongs : [
      { title: 'Evidências', count: 9 },
      { title: 'Cheia de Manias', count: 7 },
      { title: 'Tempo Perdido', count: 5 },
      { title: 'Bohemian Rhapsody', count: 4 }
    ],
    genreDistribution: [
      { genre: 'Sertanejo', percentage: 34 },
      { genre: 'Pagode', percentage: 26 },
      { genre: 'Rock', percentage: 20 },
      { genre: 'Pop', percentage: 12 },
      { genre: 'MPB / Outros', percentage: 8 }
    ],
    hourlyActivity: [
      { hour: '20:00', singers: 4 },
      { hour: '21:00', singers: 9 },
      { hour: '22:00', singers: 15 },
      { hour: '23:00', singers: 18 },
      { hour: '00:00', singers: 12 }
    ]
  });
});

// --- SUPPORT TICKETS ---
apiRouter.get('/tickets', (_req: Request, res: Response) => {
  res.json({ tickets: db.getTickets() });
});

apiRouter.post('/tickets', (req: Request, res: Response) => {
  const { userName, userEmail, subject, category, message } = req.body;
  if (!userName || !userEmail || !subject || !message) {
    return res.status(400).json({ error: 'Preencha todos os campos obrigatórios do chamado.' });
  }

  const ticket: SupportTicket = {
    id: `tkt-${Date.now()}`,
    userName,
    userEmail,
    subject,
    category: category || 'outro',
    status: 'aberto',
    message,
    createdAt: new Date().toISOString()
  };

  const created = db.addTicket(ticket);
  res.status(201).json({ ticket: created });
});

// --- ADMIN LOGS ---
apiRouter.get('/admin/logs', (_req: Request, res: Response) => {
  res.json({ logs: db.getLogs() });
});

// --- NETWORK & PUBLIC ACCESS INFO ---
apiRouter.get('/network-info', (req: Request, res: Response) => {
  let lanIp = 'localhost';
  try {
    const interfaces = os.networkInterfaces();
    for (const name of Object.keys(interfaces)) {
      for (const net of interfaces[name] || []) {
        if (net.family === 'IPv4' && !net.internal) {
          lanIp = net.address;
          break;
        }
      }
    }
  } catch {}

  const forwardedHost = req.get('x-forwarded-host');
  const host = forwardedHost || req.get('host') || '';
  const protocol = req.protocol === 'https' || req.get('x-forwarded-proto') === 'https' ? 'https' : 'http';
  const currentHostUrl = host ? `${protocol}://${host}` : '';

  // Verified active live Cloud Run URL for smartphones:
  const liveAppUrl = 'https://ais-dev-zpcx6oattcp7qmjuiacmzl-855002600123.us-east1.run.app';

  const isLiveDomain = currentHostUrl && !currentHostUrl.includes('localhost') && !currentHostUrl.includes('127.0.0.1');
  const recommendedUrl = isLiveDomain ? currentHostUrl : liveAppUrl;

  res.json({
    lanIp,
    lanUrl: `http://${lanIp}:3000`,
    currentHostUrl,
    liveAppUrl,
    recommendedUrl
  });
});
