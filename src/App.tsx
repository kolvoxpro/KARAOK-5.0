import React, { useState, useEffect, useRef } from 'react';
import { api } from './services/api';
import { audioEngine } from './services/audioEngine';
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
} from './types';
import { INITIAL_SONGS } from './data/initialCatalog';
import { LandingPage } from './components/LandingPage';
import { OperatorDashboard } from './components/OperatorDashboard';
import { PublicScreen } from './components/PublicScreen';
import { MobileGuestView } from './components/MobileGuestView';
import { AuthModal } from './components/AuthModal';
import { CheckoutModal } from './components/CheckoutModal';
import { QrCodeModal } from './components/QrCodeModal';
import { DualMonitorGuide } from './components/DualMonitorGuide';
import { PhotoCaptureModal } from './components/PhotoCaptureModal';
import { ScoreModal } from './components/ScoreModal';

// Cross-tab broadcast channel for instantaneous real-time sync across monitors & devices
let syncChannel: BroadcastChannel | null = null;
try {
  if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
    syncChannel = new BroadcastChannel('karaoke50_channel');
  }
} catch {}

export default function App() {
  // Navigation / View state
  const [currentView, setCurrentView] = useState<'landing' | 'operator' | 'public' | 'mobile'>('landing');

  // Modals state
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<CommercialPlan | null>(null);
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [dualMonitorGuideOpen, setDualMonitorGuideOpen] = useState(false);
  const [photoCaptureOpen, setPhotoCaptureOpen] = useState(false);
  const [scoreModalOpen, setScoreModalOpen] = useState(false);

  // Core Data
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [event, setEvent] = useState<KaraokeEvent | null>(null);
  const [songs, setSongs] = useState<Song[]>(INITIAL_SONGS);
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [reactions, setReactions] = useState<LiveReaction[]>([]);
  const [reactionCounts, setReactionCounts] = useState<ReactionCounts>({
    fire: 0,
    applause: 0,
    heart: 0,
    laugh: 0,
    mic: 0,
    star: 0,
    rocket: 0,
    total: 0
  });
  const [scores, setScores] = useState<ScoreRecord[]>([]);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [settings, setSettings] = useState<SystemSettings>({
    establishmentName: 'KARAOKÊ SHOW BAR',
    neonTheme: 'cyan',
    backgroundStyle: 'abstract',
    scoringMode: 'auto',
    photoCaptureEnabled: true,
    photoCountdownSeconds: 5,
    autoDjEnabled: false, // Explicitly disabled: only songs placed by audience/operator are queued
    intermissionSeconds: 5,
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
  const [plans, setPlans] = useState<CommercialPlan[]>([]);
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [logs, setLogs] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [isOnline, setIsOnline] = useState<boolean>(true);

  // Player & Performance State
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackTime, setPlaybackTime] = useState(0);
  const [duration, setDuration] = useState(210);
  const [pitchShift, setPitchShift] = useState(0);
  const [volume, setVolume] = useState(0.85);
  const [isMuted, setIsMuted] = useState(false);
  const [isIntermission, setIsIntermission] = useState(false);
  const [intermissionCountdown, setIntermissionCountdown] = useState(5);
  const [showingScore, setShowingScore] = useState(false);
  const [lastScoreData, setLastScoreData] = useState<{
    singerName: string;
    songTitle: string;
    finalScore: number;
    vocalScore: number;
    energyScore: number;
    crowdScore: number;
    reactions: number;
  } | null>(null);

  const playbackTimerRef = useRef<any>(null);
  const seenReactionIdsRef = useRef<Set<string>>(new Set());
  const isTransitioningRef = useRef<boolean>(false);

  // 1. Detect query params on mount (e.g. ?mode=public or ?mode=mobile)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const mode = params.get('mode');
    if (mode === 'public') {
      setCurrentView('public');
    } else if (mode === 'mobile') {
      setCurrentView('mobile');
    }

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    setIsOnline(navigator.onLine);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // 2. Fetch initial data from server or local offline fallback
  useEffect(() => {
    const loadData = async () => {
      try {
        const [
          userRes,
          eventRes,
          songsRes,
          queueRes,
          reactionsRes,
          scoresRes,
          playlistsRes,
          settingsRes,
          plansRes,
          ticketsRes,
          logsRes,
          statsRes
        ] = await Promise.all([
          api.getCurrentUser(),
          api.getActiveEvent(),
          api.getSongs(),
          api.getQueue(),
          api.getReactions(),
          api.getScores(),
          api.getPlaylists(),
          api.getSettings(),
          api.getPlans(),
          api.getTickets(),
          api.getLogs(),
          api.getStats()
        ]);

        if (userRes) setCurrentUser(userRes);
        if (eventRes) setEvent(eventRes);
        if (songsRes && songsRes.length > 0) setSongs(songsRes);
        if (queueRes) setQueue(queueRes);
        if (reactionsRes) {
          setReactions(reactionsRes.recent);
          setReactionCounts(reactionsRes.counts);
          reactionsRes.recent.forEach((r) => seenReactionIdsRef.current.add(r.id));
        }
        if (scoresRes) setScores(scoresRes);
        if (playlistsRes) setPlaylists(playlistsRes);
        if (settingsRes) setSettings({ ...settingsRes, autoDjEnabled: false });
        if (plansRes) setPlans(plansRes);
        if (ticketsRes) setTickets(ticketsRes);
        if (logsRes) setLogs(logsRes);
        if (statsRes) setStats(statsRes);
      } catch (err) {
        console.warn('Initial data loaded with local fallback:', err);
      }
    };

    loadData();
  }, []);

  // 3. Robust Real-time sync: SSE + BroadcastChannel + window Storage event + 600ms polling fallback
  useEffect(() => {
    // A. BroadcastChannel cross-tab message handler
    if (syncChannel) {
      syncChannel.onmessage = (e) => {
        const { type, data } = e.data || {};
        if (type === 'REACTION_ADDED') {
          handleIncomingReaction(data.reaction, data.counts);
        } else if (type === 'QUEUE_UPDATED') {
          setQueue(data);
        } else if (type === 'SCORE_RECORDED') {
          setScores((prev) => [data, ...prev]);
        }
      };
    }

    // B. LocalStorage storage event handler
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'karaoke50_live_reaction' && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          handleIncomingReaction(parsed.reaction, parsed.counts);
        } catch {}
      } else if (e.key === 'karaoke50_offline_queue' && e.newValue) {
        try {
          const parsedQ = JSON.parse(e.newValue);
          setQueue(parsedQ);
        } catch {}
      }
    };
    window.addEventListener('storage', handleStorage);

    // C. Server-Sent Events (SSE)
    let eventSource: EventSource | null = null;
    try {
      eventSource = new EventSource('/api/realtime/stream');
      eventSource.onmessage = (e) => {
        try {
          const payload = JSON.parse(e.data);
          if (payload.type === 'REACTION_ADDED') {
            handleIncomingReaction(payload.data.reaction, payload.data.counts);
          } else if (payload.type === 'QUEUE_UPDATED') {
            setQueue(payload.data);
          } else if (payload.type === 'SCORE_RECORDED') {
            setScores((prev) => [payload.data, ...prev]);
          } else if (payload.type === 'SETTINGS_UPDATED') {
            setSettings(payload.data);
          }
        } catch {}
      };
    } catch {}

    // D. 600ms polling fallback for reaction & queue reliability (no clock dependency)
    const pollInterval = setInterval(async () => {
      try {
        const res = await api.getReactions(0);
        if (res.counts) {
          setReactionCounts(res.counts);
        }
        if (res.recent && res.recent.length > 0) {
          const brandNew = res.recent.filter((r) => !seenReactionIdsRef.current.has(r.id));
          if (brandNew.length > 0) {
            brandNew.forEach((r) => {
              seenReactionIdsRef.current.add(r.id);
            });
            setReactions((prev) => [...prev.slice(-30), ...brandNew]);
          }
        }
      } catch {}
    }, 600);

    return () => {
      if (eventSource) eventSource.close();
      window.removeEventListener('storage', handleStorage);
      clearInterval(pollInterval);
    };
  }, []);

  const handleIncomingReaction = (reaction: LiveReaction, counts?: ReactionCounts) => {
    if (!reaction) return;
    if (!seenReactionIdsRef.current.has(reaction.id)) {
      seenReactionIdsRef.current.add(reaction.id);
      setReactions((prev) => [...prev.slice(-30), reaction]);
    }
    if (counts) {
      setReactionCounts(counts);
    } else {
      setReactionCounts((prev) => {
        const next = { ...prev };
        const k = reaction.type as keyof ReactionCounts;
        if (typeof next[k] === 'number') {
          (next[k] as number) += 1;
        }
        next.total = (next.total || 0) + 1;
        return next;
      });
    }
  };

  // Current playing item in queue
  const currentQueueItem = queue.find((q) => q.status === 'playing') || (queue.length > 0 ? queue[0] : null);
  const nextQueueItems = queue.filter((q) => q.id !== currentQueueItem?.id && q.status !== 'finished');

  // Update duration whenever active queue item changes
  useEffect(() => {
    if (currentQueueItem) {
      setDuration(currentQueueItem.duration || 210);
      setPitchShift(currentQueueItem.pitchShift || 0);
    } else {
      setPlaybackTime(0);
      setIsPlaying(false);
    }
  }, [currentQueueItem?.id]);

  // Audio Engine & Playback Timer Loop (NO SYNTHESIZER SOUNDS - Real YouTube playback)
  useEffect(() => {
    if (isPlaying && currentQueueItem) {
      audioEngine.setPitchShift(pitchShift);
      audioEngine.setVolume(isMuted ? 0 : volume);

      clearInterval(playbackTimerRef.current);
      playbackTimerRef.current = setInterval(() => {
        setPlaybackTime((prev) => {
          if (prev >= duration) {
            handleSongEnded();
            return duration;
          }
          return prev + 1;
        });
      }, 1000);
    } else {
      clearInterval(playbackTimerRef.current);
    }

    return () => {
      clearInterval(playbackTimerRef.current);
    };
  }, [isPlaying, duration, pitchShift, volume, isMuted, currentQueueItem?.id]);

  // ADVANCE DIRECTLY TO THE NEXT SINGER IN THE KARAOKE LIST (NO LOOPING, NO RANDOM SONGS)
  const handleSongEnded = () => {
    if (isTransitioningRef.current) return;
    isTransitioningRef.current = true;

    setIsPlaying(false);

    if (currentQueueItem) {
      // 1. Calculate Score (0 to 100)
      const baseVocal = Math.floor(86 + Math.random() * 11);
      const energy = Math.floor(88 + Math.random() * 10);
      const reactionBonus = Math.min(12, Math.floor(reactionCounts.total / 4));
      const finalScore = Math.min(100, Math.round((baseVocal + energy) / 2 + reactionBonus));

      const scorePayload = {
        singerName: currentQueueItem.singerName,
        songTitle: currentQueueItem.songTitle,
        finalScore,
        vocalScore: baseVocal,
        energyScore: energy,
        crowdScore: 90 + reactionBonus,
        reactions: reactionCounts.total
      };

      setLastScoreData(scorePayload);
      setShowingScore(true);

      // Save score to database
      api.saveScore({
        songTitle: currentQueueItem.songTitle,
        artist: currentQueueItem.artist,
        singerName: currentQueueItem.singerName,
        finalScore,
        vocalScore: baseVocal,
        energyScore: energy,
        crowdScore: 90 + reactionBonus,
        totalReactions: reactionCounts.total,
        mode: settings.scoringMode
      }).then((savedScore) => {
        setScores((prev) => [savedScore, ...prev]);
        if (syncChannel) {
          syncChannel.postMessage({ type: 'SCORE_RECORDED', data: savedScore });
        }
      }).catch(() => {});

      // Identify next song in the queue
      const remainingQueue = queue.filter((q) => q.id !== currentQueueItem.id);

      // Show congratulations & score for 5.5 seconds, then advance directly to next singer!
      setTimeout(() => {
        setShowingScore(false);

        // Remove the finished song from queue (PREVENTS ANY LOOPING)
        api.removeFromQueue(currentQueueItem.id);
        setQueue(remainingQueue);

        if (syncChannel) {
          syncChannel.postMessage({ type: 'QUEUE_UPDATED', data: remainingQueue });
        }

        if (remainingQueue.length > 0) {
          // Display the Next Singer Announcement on TV & screen
          const nextSingerItem = remainingQueue[0];
          setIsIntermission(true);
          setIntermissionCountdown(5);

          let counter = 5;
          const countdownTimer = setInterval(() => {
            counter -= 1;
            setIntermissionCountdown(counter);

            if (counter <= 0) {
              clearInterval(countdownTimer);
              setIsIntermission(false);

              // Mark next item as playing
              api.updateQueueItem(nextSingerItem.id, { status: 'playing' });
              const updatedQueue = remainingQueue.map((item, idx) =>
                idx === 0 ? { ...item, status: 'playing' as const } : item
              );
              setQueue(updatedQueue);

              // Automatically start playing the next song!
              setPlaybackTime(0);
              setDuration(nextSingerItem.duration || 210);
              setIsPlaying(true);
              isTransitioningRef.current = false;
            }
          }, 1000);
        } else {
          // Queue is now empty! Standby mode waiting for audience to queue songs.
          // DO NOT ADD RANDOM SONGS!
          setIsIntermission(false);
          setIsPlaying(false);
          setPlaybackTime(0);
          isTransitioningRef.current = false;
        }
      }, 5500);
    } else {
      isTransitioningRef.current = false;
    }
  };

  const handleNextSinger = () => {
    handleSongEnded();
  };

  // Player controls
  const handlePlay = () => {
    if (!currentQueueItem && queue.length > 0) {
      api.updateQueueItem(queue[0].id, { status: 'playing' });
      setQueue((prev) => prev.map((q, idx) => idx === 0 ? { ...q, status: 'playing' } : q));
    }
    setIsPlaying(true);
  };

  const handlePause = () => setIsPlaying(false);

  const handleStop = () => {
    setIsPlaying(false);
    setPlaybackTime(0);
  };

  const handleNext = () => {
    handleSongEnded();
  };

  const handlePrevious = () => {
    setPlaybackTime(0);
  };

  const handlePitchChange = (p: number) => {
    setPitchShift(p);
    audioEngine.setPitchShift(p);
    if (currentQueueItem) {
      api.updateQueueItem(currentQueueItem.id, { pitchShift: p });
    }
  };

  const handleVolumeChange = (v: number) => {
    setVolume(v);
    setIsMuted(false);
    audioEngine.setVolume(v);
  };

  const handleToggleMute = () => {
    setIsMuted(!isMuted);
    audioEngine.setVolume(!isMuted ? 0 : volume);
  };

  const handleSeek = (time: number) => {
    setPlaybackTime(time);
  };

  // Send a reaction directly from operator or guest
  const handleSendReaction = async (type: string, sender = 'Operador') => {
    try {
      const res = await api.sendReaction(type, sender);
      if (res && res.reaction) {
        handleIncomingReaction(res.reaction, res.counts);
        if (syncChannel) {
          syncChannel.postMessage({ type: 'REACTION_ADDED', data: res });
        }
        try {
          localStorage.setItem('karaoke50_live_reaction', JSON.stringify(res));
        } catch {}
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Queue actions
  const handleAddToQueue = async (song: Song, singerName: string, pitch = 0) => {
    const item = await api.addToQueue(song.id, singerName, pitch, 'operator', {
      youtubeId: song.youtubeId,
      songTitle: song.title,
      artist: song.artist,
      genre: song.genre,
      duration: song.duration,
      thumbnail: song.thumbnail
    });
    setQueue((prev) => {
      const nextQ = [...prev, item];
      if (syncChannel) {
        syncChannel.postMessage({ type: 'QUEUE_UPDATED', data: nextQ });
      }
      return nextQ;
    });
  };

  const handleRemoveFromQueue = async (id: string) => {
    const updated = await api.removeFromQueue(id);
    setQueue(updated);
    if (syncChannel) {
      syncChannel.postMessage({ type: 'QUEUE_UPDATED', data: updated });
    }
  };

  const handleUpdateQueueItem = async (id: string, updates: Partial<QueueItem>) => {
    await api.updateQueueItem(id, updates);
    setQueue((prev) => {
      const nextQ = prev.map((q) => (q.id === id ? { ...q, ...updates } : q));
      if (syncChannel) {
        syncChannel.postMessage({ type: 'QUEUE_UPDATED', data: nextQ });
      }
      return nextQ;
    });
  };

  const handleSaveSettings = async (newSettings: Partial<SystemSettings>) => {
    const updated = await api.updateSettings(newSettings);
    setSettings(updated);
  };

  const handleUpdatePlan = async (id: string, updates: Partial<CommercialPlan>) => {
    const res = await fetch(`/api/plans/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    if (res.ok) {
      const data = await res.json();
      setPlans((prev) => prev.map((p) => (p.id === id ? data.plan : p)));
    }
  };

  const handleSubmitTicket = async (ticketData: Partial<SupportTicket>) => {
    const tkt = await api.submitTicket(ticketData);
    setTickets((prev) => [tkt, ...prev]);
  };

  const handleOpenPlanCheckout = (planId: string) => {
    const p = plans.find((plan) => plan.id === planId) || plans[1] || null;
    setSelectedPlan(p);
    setCheckoutModalOpen(true);
  };

  const handlePaymentApproved = (planId: string) => {
    if (currentUser) {
      setCurrentUser({ ...currentUser, planId });
    }
  };

  // Open Public TV Screen in a dedicated clean window for Monitor 2
  const handleOpenPublicWindow = () => {
    const baseUrl = window.location.origin;
    window.open(`${baseUrl}?mode=public`, 'KaraokePublicWindow', 'width=1920,height=1080');
  };

  // Render view
  if (currentView === 'public') {
    return (
      <PublicScreen
        currentQueueItem={currentQueueItem}
        currentSong={null}
        nextQueueItems={nextQueueItems}
        currentTime={playbackTime}
        duration={duration}
        pitchShift={pitchShift}
        isPlaying={isPlaying}
        isIntermission={isIntermission}
        intermissionCountdown={intermissionCountdown}
        showingScore={showingScore}
        lastScoreData={lastScoreData}
        reactions={reactions}
        settings={settings}
        event={event}
        onBack={() => {
          if (window.location.search.includes('mode=public')) {
            window.history.pushState({}, '', window.location.pathname);
          }
          setCurrentView('operator');
        }}
      />
    );
  }

  if (currentView === 'mobile') {
    return (
      <MobileGuestView
        songs={songs}
        queue={queue}
        event={event}
        onSongAdded={async () => {
          const q = await api.getQueue();
          setQueue(q);
          if (syncChannel) {
            syncChannel.postMessage({ type: 'QUEUE_UPDATED', data: q });
          }
        }}
      />
    );
  }

  return (
    <>
      {currentView === 'landing' ? (
        <LandingPage
          plans={plans}
          onEnterSystem={() => setCurrentView('operator')}
          onOpenLogin={() => setAuthModalOpen(true)}
          onSelectPlan={handleOpenPlanCheckout}
        />
      ) : (
        <OperatorDashboard
          currentUser={currentUser}
          event={event}
          songs={songs}
          queue={queue}
          reactions={reactions}
          reactionCounts={reactionCounts}
          scores={scores}
          playlists={playlists}
          settings={settings}
          plans={plans}
          tickets={tickets}
          logs={logs}
          stats={stats}
          isOnline={isOnline}
          onLogout={() => {
            setCurrentUser(null);
            setCurrentView('landing');
          }}
          onOpenPublicScreen={() => setCurrentView('public')}
          onOpenQrCode={() => setQrModalOpen(true)}
          onOpenDualMonitorGuide={() => setDualMonitorGuideOpen(true)}
          onOpenPhotoCapture={() => setPhotoCaptureOpen(true)}
          onOpenScoreModal={() => setScoreModalOpen(true)}
          onUpdateQueue={setQueue}
          onAddToQueue={handleAddToQueue}
          onRemoveFromQueue={handleRemoveFromQueue}
          onUpdateQueueItem={handleUpdateQueueItem}
          onAddNewSong={async (song) => {
            const added = await api.addSong(song);
            setSongs((prev) => [added, ...prev]);
          }}
          onSavePlaylist={async (pl) => {
            const saved = await api.savePlaylist(pl);
            setPlaylists((prev) => {
              const idx = prev.findIndex((p) => p.id === saved.id);
              if (idx >= 0) {
                const next = [...prev];
                next[idx] = saved;
                return next;
              }
              return [...prev, saved];
            });
          }}
          onDeletePlaylist={async (id) => {
            const updated = await fetch(`/api/playlists/${id}`, { method: 'DELETE' }).then((r) => r.json());
            setPlaylists(updated.playlists || []);
          }}
          onSaveSettings={handleSaveSettings}
          onUpdatePlan={handleUpdatePlan}
          onSubmitTicket={handleSubmitTicket}
          onSendReaction={handleSendReaction}
          // Player state
          currentQueueItem={currentQueueItem}
          isPlaying={isPlaying}
          playbackTime={playbackTime}
          duration={duration}
          pitchShift={pitchShift}
          volume={volume}
          isMuted={isMuted}
          onPlay={handlePlay}
          onPause={handlePause}
          onStop={handleStop}
          onNext={handleNext}
          onPrevious={handlePrevious}
          onPitchChange={handlePitchChange}
          onVolumeChange={handleVolumeChange}
          onToggleMute={handleToggleMute}
          onSeek={handleSeek}
        />
      )}

      {/* Global Modals */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={(user) => {
          setCurrentUser(user);
          setCurrentView('operator');
        }}
      />

      <CheckoutModal
        isOpen={checkoutModalOpen}
        onClose={() => setCheckoutModalOpen(false)}
        plan={selectedPlan}
        onPaymentApproved={handlePaymentApproved}
      />

      <QrCodeModal
        isOpen={qrModalOpen}
        onClose={() => setQrModalOpen(false)}
        event={event}
        onOpenMobileView={() => setCurrentView('mobile')}
      />

      <DualMonitorGuide
        isOpen={dualMonitorGuideOpen}
        onClose={() => setDualMonitorGuideOpen(false)}
        onOpenPublicWindow={handleOpenPublicWindow}
      />

      <PhotoCaptureModal
        isOpen={photoCaptureOpen}
        onClose={() => setPhotoCaptureOpen(false)}
        singerName={currentQueueItem?.singerName || 'Cantor Convidado'}
        songTitle={currentQueueItem?.songTitle || 'Show Musical'}
        score={lastScoreData?.finalScore || 94}
        eventName={event?.title || 'KARAOKÊ SÁBADO'}
      />

      <ScoreModal
        isOpen={scoreModalOpen}
        onClose={() => setScoreModalOpen(false)}
        singerName={currentQueueItem?.singerName || 'Cantor da Vez'}
        songTitle={currentQueueItem?.songTitle || 'Música da Noite'}
        artist={currentQueueItem?.artist || 'Artista'}
        initialScore={lastScoreData?.finalScore || 92}
        vocalScore={lastScoreData?.vocalScore || 88}
        energyScore={lastScoreData?.energyScore || 94}
        crowdScore={lastScoreData?.crowdScore || 91}
        reactionsCount={reactionCounts.total}
        scoringMode={settings.scoringMode}
        onNextSinger={handleNextSinger}
        onOpenPhotoCapture={() => setPhotoCaptureOpen(true)}
        onSaveScore={(s) => {
          if (lastScoreData) {
            setLastScoreData({ ...lastScoreData, finalScore: s });
          }
        }}
      />
    </>
  );
}
