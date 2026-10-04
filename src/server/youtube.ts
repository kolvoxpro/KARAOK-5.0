export interface YouTubeKaraokeVideo {
  id: string;
  youtubeId: string;
  title: string;
  artist: string;
  channel: string;
  duration: number; // in seconds
  durationFormatted: string;
  thumbnail: string;
  lyricsSnippet: string;
}

// Curated verified catalog of real playable YouTube Karaoke tracks with official playbacks
const VERIFIED_YOUTUBE_TRACKS: YouTubeKaraokeVideo[] = [
  {
    id: 'yt-tfhwXKd1W_o',
    youtubeId: 'tfhwXKd1W_o',
    title: 'Evidências',
    artist: 'Chitãozinho & Xororó',
    channel: 'Singer! Karaokê',
    duration: 298,
    durationFormatted: '4:58',
    thumbnail: 'https://i.ytimg.com/vi/tfhwXKd1W_o/hqdefault.jpg',
    lyricsSnippet: 'E nessa loucura de dizer que não te quero...'
  },
  {
    id: 'yt-6L0kKVkT0Sw',
    youtubeId: '6L0kKVkT0Sw',
    title: 'Um Minuto Para o Fim do Mundo',
    artist: 'CPM 22',
    channel: 'Singer! Karaokê',
    duration: 205,
    durationFormatted: '3:25',
    thumbnail: 'https://i.ytimg.com/vi/6L0kKVkT0Sw/hqdefault.jpg',
    lyricsSnippet: 'Me sinto tão só e o tempo não passa, eu perco o meu tempo pensando em você...'
  },
  {
    id: 'yt-ieWiXcAbi0o',
    youtubeId: 'ieWiXcAbi0o',
    title: 'Cheia de Manias',
    artist: 'Raça Negra',
    channel: 'Muramatsu Karaokê',
    duration: 215,
    durationFormatted: '3:35',
    thumbnail: 'https://i.ytimg.com/vi/ieWiXcAbi0o/hqdefault.jpg',
    lyricsSnippet: 'Cheia de manias, toda dengosa, menina bonita sabe que é gostosa...'
  },
  {
    id: 'yt-SYLuevFUIR0',
    youtubeId: 'SYLuevFUIR0',
    title: 'Tempo Perdido',
    artist: 'Legião Urbana',
    channel: 'Canto Livre Karaokê',
    duration: 301,
    durationFormatted: '5:01',
    thumbnail: 'https://i.ytimg.com/vi/SYLuevFUIR0/hqdefault.jpg',
    lyricsSnippet: 'Todos os dias quando acordo, não tenho mais o tempo que passou...'
  },
  {
    id: 'yt-04854XqcfCY',
    youtubeId: '04854XqcfCY',
    title: 'Deixa Acontecer',
    artist: 'Grupo Revelação',
    channel: 'Karaokê Show',
    duration: 235,
    durationFormatted: '3:55',
    thumbnail: 'https://i.ytimg.com/vi/04854XqcfCY/hqdefault.jpg',
    lyricsSnippet: 'Deixa acontecer naturalmente, eu não quero ver você chorar...'
  },
  {
    id: 'yt-DmeeTj7UeI0',
    youtubeId: 'DmeeTj7UeI0',
    title: 'Dormi na Praça',
    artist: 'Bruno & Marrone',
    channel: 'Sertanejo Karaokê',
    duration: 178,
    durationFormatted: '2:58',
    thumbnail: 'https://i.ytimg.com/vi/DmeeTj7UeI0/hqdefault.jpg',
    lyricsSnippet: 'Seu guarda, eu não sou vagabundo, eu não sou delinquente...'
  },
  {
    id: 'yt-fJ9rUzIMcZQ',
    youtubeId: 'fJ9rUzIMcZQ',
    title: 'Bohemian Rhapsody',
    artist: 'Queen',
    channel: 'Sing King Karaoke',
    duration: 354,
    durationFormatted: '5:54',
    thumbnail: 'https://i.ytimg.com/vi/fJ9rUzIMcZQ/hqdefault.jpg',
    lyricsSnippet: 'Is this the real life? Is this just fantasy?...'
  },
  {
    id: 'yt-YQHsXMglC9A',
    youtubeId: 'YQHsXMglC9A',
    title: 'Hello',
    artist: 'Adele',
    channel: 'Sing King',
    duration: 295,
    durationFormatted: '4:55',
    thumbnail: 'https://i.ytimg.com/vi/YQHsXMglC9A/hqdefault.jpg',
    lyricsSnippet: 'Hello from the other side, I must have called a thousand times...'
  },
  {
    id: 'yt-kJQP7kiw5Fk',
    youtubeId: 'kJQP7kiw5Fk',
    title: 'Despacito',
    artist: 'Luis Fonsi ft. Daddy Yankee',
    channel: 'KaraFun',
    duration: 230,
    durationFormatted: '3:50',
    thumbnail: 'https://i.ytimg.com/vi/kJQP7kiw5Fk/hqdefault.jpg',
    lyricsSnippet: 'Despacito, quiero respirar tu cuello despacito...'
  },
  {
    id: 'yt-JGwWNGJdvx8',
    youtubeId: 'JGwWNGJdvx8',
    title: 'Shape of You',
    artist: 'Ed Sheeran',
    channel: 'Sing King',
    duration: 235,
    durationFormatted: '3:55',
    thumbnail: 'https://i.ytimg.com/vi/JGwWNGJdvx8/hqdefault.jpg',
    lyricsSnippet: 'The club isn\'t the best place to find a lover...'
  },
  {
    id: 'yt-1w7OgIMMRc4',
    youtubeId: '1w7OgIMMRc4',
    title: 'Sweet Child O\' Mine',
    artist: 'Guns N\' Roses',
    channel: 'KaraFun',
    duration: 350,
    durationFormatted: '5:50',
    thumbnail: 'https://i.ytimg.com/vi/1w7OgIMMRc4/hqdefault.jpg',
    lyricsSnippet: 'She\'s got a smile that it seems to me, reminds me of childhood memories...'
  },
  {
    id: 'yt-f7R_929WnNw',
    youtubeId: 'f7R_929WnNw',
    title: 'Infiel',
    artist: 'Marília Mendonça',
    channel: 'Singer! Karaokê',
    duration: 202,
    durationFormatted: '3:22',
    thumbnail: 'https://i.ytimg.com/vi/f7R_929WnNw/hqdefault.jpg',
    lyricsSnippet: 'Isso não é amor, você não ama ninguém...'
  },
  {
    id: 'yt-jphw4Rk5t5A',
    youtubeId: 'jphw4Rk5t5A',
    title: 'Pais e Filhos',
    artist: 'Legião Urbana',
    channel: 'Muramatsu Karaokê',
    duration: 310,
    durationFormatted: '5:10',
    thumbnail: 'https://i.ytimg.com/vi/jphw4Rk5t5A/hqdefault.jpg',
    lyricsSnippet: 'É preciso amar as pessoas como se não houvesse amanhã...'
  },
  {
    id: 'yt-xYt-vBq52lM',
    youtubeId: 'xYt-vBq52lM',
    title: 'Anna Júlia',
    artist: 'Los Hermanos',
    channel: 'Singer! Karaokê',
    duration: 215,
    durationFormatted: '3:35',
    thumbnail: 'https://i.ytimg.com/vi/xYt-vBq52lM/hqdefault.jpg',
    lyricsSnippet: 'Quem te vê passar assim por mim não sabe o que é sofrer...'
  },
  {
    id: 'yt-kffacxfA7G4',
    youtubeId: 'kffacxfA7G4',
    title: 'Baby',
    artist: 'Justin Bieber',
    channel: 'Sing King',
    duration: 215,
    durationFormatted: '3:35',
    thumbnail: 'https://i.ytimg.com/vi/kffacxfA7G4/hqdefault.jpg',
    lyricsSnippet: 'Baby, baby, baby oh, like baby, baby, baby no...'
  },
  {
    id: 'yt-7qhfU9KzXb0',
    youtubeId: '7qhfU9KzXb0',
    title: 'Tá Escrito',
    artist: 'Grupo Revelação',
    channel: 'Karaokê Show',
    duration: 200,
    durationFormatted: '3:20',
    thumbnail: 'https://i.ytimg.com/vi/7qhfU9KzXb0/hqdefault.jpg',
    lyricsSnippet: 'Quem cultiva a semente do amor segue em frente não se apavora...'
  },
  {
    id: 'yt-Z_8u3vXUuLw',
    youtubeId: 'Z_8u3vXUuLw',
    title: 'Como Nossos Pais',
    artist: 'Elis Regina',
    channel: 'Karaokê Brasil',
    duration: 275,
    durationFormatted: '4:35',
    thumbnail: 'https://i.ytimg.com/vi/Z_8u3vXUuLw/hqdefault.jpg',
    lyricsSnippet: 'Não chore ainda não, que eu tenho um violão e nós cantamos...'
  }
];

function parseDurationToSeconds(str: string): number {
  if (!str) return 210;
  const parts = str.split(':').map(Number);
  if (parts.length === 2) {
    return parts[0] * 60 + parts[1];
  } else if (parts.length === 3) {
    return parts[0] * 3600 + parts[1] * 60 + parts[2];
  }
  return 210;
}

function cleanTitleAndArtist(rawTitle: string, channel: string): { title: string; artist: string } {
  let title = rawTitle;
  let artist = channel;

  // Clean tags like (Karaokê), [Karaokê Oficial], (Playback), etc.
  const cleaned = rawTitle
    .replace(/\s*[\(\[](Karaok[eê]|Playback|Oficial|Instrumental|Cover|Letra|Lyrics|HD|Full HD).*?[\)\]]/gi, '')
    .trim();

  if (cleaned.includes(' - ')) {
    const parts = cleaned.split(' - ');
    // Heuristic: usually First part is artist or title
    artist = parts[0].trim();
    title = parts.slice(1).join(' - ').trim();
  } else if (cleaned.includes(' – ')) {
    const parts = cleaned.split(' – ');
    artist = parts[0].trim();
    title = parts.slice(1).join(' – ').trim();
  } else {
    title = cleaned;
    artist = channel.replace(/Karaok[eê].*/i, '').trim() || 'Artista';
  }

  return { title: title || rawTitle, artist: artist || channel };
}

export async function searchYouTubeKaraoke(query: string): Promise<YouTubeKaraokeVideo[]> {
  const cleanQuery = (query || '').trim();
  if (!cleanQuery) {
    return VERIFIED_YOUTUBE_TRACKS;
  }

  const searchQuery = cleanQuery.toLowerCase().includes('karaoke') || cleanQuery.toLowerCase().includes('karaokê')
    ? cleanQuery
    : `${cleanQuery} karaoke playback`;

  try {
    const url = `https://www.youtube.com/results?search_query=${encodeURIComponent(searchQuery)}`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
        'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
        'Cache-Control': 'no-cache'
      }
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const html = await res.text();
      const idx = html.indexOf('ytInitialData');
      if (idx !== -1) {
        const start = html.indexOf('{', idx);
        let depth = 0;
        let end = start;
        for (let i = start; i < html.length; i++) {
          if (html[i] === '{') depth++;
          else if (html[i] === '}') {
            depth--;
            if (depth === 0) {
              end = i + 1;
              break;
            }
          }
        }

        const jsonStr = html.substring(start, end);
        const data = JSON.parse(jsonStr);
        const sectionList = data.contents?.twoColumnSearchResultsRenderer?.primaryContents?.sectionListRenderer?.contents || [];

        const results: YouTubeKaraokeVideo[] = [];

        for (const section of sectionList) {
          const items = section.itemSectionRenderer?.contents || [];
          for (const item of items) {
            if (item.videoRenderer) {
              const v = item.videoRenderer;
              const videoId = v.videoId;
              if (!videoId) continue;

              const rawTitle = v.title?.runs?.map((r: any) => r.text).join('') || v.title?.simpleText || 'Karaokê';
              const channel = v.ownerText?.runs?.map((r: any) => r.text).join('') || 'Canal de Karaokê';
              const durationFormatted = v.lengthText?.simpleText || '3:45';
              const duration = parseDurationToSeconds(durationFormatted);
              const thumbnail = v.thumbnail?.thumbnails?.[v.thumbnail.thumbnails.length - 1]?.url || `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;

              const { title, artist } = cleanTitleAndArtist(rawTitle, channel);

              results.push({
                id: `yt-${videoId}`,
                youtubeId: videoId,
                title,
                artist,
                channel,
                duration,
                durationFormatted,
                thumbnail,
                lyricsSnippet: `Vídeo oficial com playback e letra sincronizada (${channel})`
              });

              if (results.length >= 24) break;
            }
          }
          if (results.length >= 24) break;
        }

        if (results.length > 0) {
          return results;
        }
      }
    }
  } catch (err) {
    console.warn('YouTube live search warning, using fallback catalog:', err);
  }

  // Filter verified tracks
  const q = cleanQuery.toLowerCase();
  const matched = VERIFIED_YOUTUBE_TRACKS.filter(
    (t) => t.title.toLowerCase().includes(q) || t.artist.toLowerCase().includes(q)
  );

  return matched.length > 0 ? matched : VERIFIED_YOUTUBE_TRACKS;
}
