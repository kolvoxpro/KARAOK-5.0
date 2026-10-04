import { Song } from '../types';

export const INITIAL_SONGS: Song[] = [
  {
    id: 'song-1',
    title: 'Evidências',
    artist: 'Chitãozinho & Xororó',
    genre: 'Sertanejo',
    duration: 279,
    durationFormatted: '4:39',
    lyricsSnippet: 'E nessa loucura de dizer que não te quero...',
    source: 'Acervo Local',
    key: 'E',
    lyrics: [
      { time: 5, text: 'Quando eu digo que deixei de te amar' },
      { time: 10, text: 'É porque eu te amo' },
      { time: 14, text: 'Quando eu digo que não quero mais você' },
      { time: 19, text: 'É porque eu te quero' },
      { time: 24, text: 'Eu tenho medo de te dar meu coração' },
      { time: 29, text: 'E confessar que eu estou em tuas mãos' },
      { time: 34, text: 'Mas não posso negar o que você me faz' },
      { time: 40, text: 'E nessa loucura de dizer que não te quero' },
      { time: 46, text: 'Vou negando as aparências, disfarçando as evidências' },
      { time: 53, text: 'Mas pra que viver fingindo se eu não posso enganar meu coração?' },
      { time: 61, text: 'Eu sei que te amo!' },
      { time: 66, text: 'Chega de mentiras, de negar o meu desejo' },
      { time: 73, text: 'Eu te quero mais que tudo, eu preciso do seu beijo' },
      { time: 80, text: 'Eu entrego a minha vida pra você fazer o que quiser de mim' },
      { time: 88, text: 'Só quero ouvir você dizer que sim!' }
    ]
  },
  {
    id: 'song-2',
    title: 'Cheia de Manias',
    artist: 'Raça Negra',
    genre: 'Pagode',
    duration: 215,
    durationFormatted: '3:35',
    lyricsSnippet: 'Cheia de manias, toda dengosa...',
    source: 'Acervo Local',
    key: 'C',
    lyrics: [
      { time: 4, text: 'Cheia de manias, toda dengosa' },
      { time: 8, text: 'Menina bonita, sabe que é gostosa' },
      { time: 13, text: 'Com esse seu jeito faz o que quer de mim' },
      { time: 18, text: 'Domina o meu coração' },
      { time: 22, text: 'Eu não posso dizer não' },
      { time: 26, text: 'Você me tem na palma da sua mão' },
      { time: 31, text: 'Diz que me ama, que sente saudade' },
      { time: 36, text: 'Me telefona querendo me ver' },
      { time: 41, text: 'Mas quando a gente se encontra' },
      { time: 46, text: 'Faz aquele charminho pra me enlouquecer' },
      { time: 52, text: 'Então me ajude a segurar essa barra que é gostar de você!' },
      { time: 60, text: 'Didididiê, didididiê, didididiê!' }
    ]
  },
  {
    id: 'song-3',
    title: 'Tempo Perdido',
    artist: 'Legião Urbana',
    genre: 'Rock',
    duration: 301,
    durationFormatted: '5:01',
    lyricsSnippet: 'Todos os dias quando acordo, não tenho mais o tempo que passou...',
    source: 'Acervo Local',
    key: 'C',
    lyrics: [
      { time: 8, text: 'Todos os dias quando acordo' },
      { time: 13, text: 'Não tenho mais o tempo que passou' },
      { time: 19, text: 'Mas tenho muito tempo' },
      { time: 24, text: 'Temos todo o tempo do mundo' },
      { time: 30, text: 'Todos os dias antes de dormir' },
      { time: 36, text: 'Lembro e esqueço como foi o dia' },
      { time: 42, text: 'Sempre em frente, não temos tempo a perder' },
      { time: 49, text: 'Nosso suor sagrado' },
      { time: 54, text: 'É bem mais belo que esse sangue amargo' },
      { time: 60, text: 'E tão sério e selvagem' },
      { time: 68, text: 'Veja o sol dessa manhã tão cinza' },
      { time: 75, text: 'A tempestade que chega é da cor dos teus olhos castanhos' }
    ]
  },
  {
    id: 'song-4',
    title: 'Garganta',
    artist: 'Ana Carolina',
    genre: 'MPB',
    duration: 228,
    durationFormatted: '3:48',
    lyricsSnippet: 'Minha garganta estranha quando não te vejo...',
    source: 'Acervo Local',
    key: 'Am',
    lyrics: [
      { time: 6, text: 'Minha garganta estranha quando não te vejo' },
      { time: 12, text: 'Me dá uma saudade daquelas que doem' },
      { time: 18, text: 'Você me olha de um jeito que me desmonta' },
      { time: 25, text: 'E o que era segredo a cidade já conta' },
      { time: 32, text: 'Vem cá me dar um beijo daqueles de cinema' },
      { time: 39, text: 'Esquece todo mundo, resolve esse dilema' },
      { time: 46, text: 'Porque o amor não espera, o amor é ligeiro' },
      { time: 53, text: 'E eu quero você por inteiro!' }
    ]
  },
  {
    id: 'song-5',
    title: 'Bohemian Rhapsody',
    artist: 'Queen',
    genre: 'Internacional',
    duration: 354,
    durationFormatted: '5:54',
    lyricsSnippet: 'Is this the real life? Is this just fantasy?...',
    source: 'Acervo Local',
    key: 'Bb',
    lyrics: [
      { time: 4, text: 'Is this the real life? Is this just fantasy?' },
      { time: 12, text: 'Caught in a landslide, no escape from reality' },
      { time: 20, text: 'Open your eyes, look up to the skies and see' },
      { time: 29, text: 'I am just a poor boy, I need no sympathy' },
      { time: 35, text: 'Because I am easy come, easy go, little high, little low' },
      { time: 45, text: 'Anyway the wind blows doesn\'t really matter to me, to me' },
      { time: 58, text: 'Mama, just killed a man' },
      { time: 65, text: 'Put a gun against his head, pulled my trigger, now he\'s dead' },
      { time: 76, text: 'Mama, life had just begun' },
      { time: 84, text: 'But now I\'ve gone and thrown it all away' }
    ]
  },
  {
    id: 'song-6',
    title: 'Deixa Acontecer',
    artist: 'Grupo Revelação',
    genre: 'Pagode',
    duration: 235,
    durationFormatted: '3:55',
    lyricsSnippet: 'Deixa acontecer naturalmente, eu não quero ver você chorar...',
    source: 'Acervo Local',
    key: 'F',
    lyrics: [
      { time: 5, text: 'Deixa acontecer naturalmente' },
      { time: 10, text: 'Eu não quero ver você chorar' },
      { time: 15, text: 'Deixa que a voz do coração é quem vai falar' },
      { time: 22, text: 'Nosso amor superou as barreiras da desconfiança' },
      { time: 29, text: 'Renascendo no peito a esperança' },
      { time: 35, text: 'De que o nosso caso tem jeito' },
      { time: 41, text: 'Vem cá me dar um abraço sincero' },
      { time: 47, text: 'É você a razão que eu mais quero!' }
    ]
  },
  {
    id: 'song-7',
    title: 'Dormi na Praça',
    artist: 'Bruno & Marrone',
    genre: 'Sertanejo',
    duration: 178,
    durationFormatted: '2:58',
    lyricsSnippet: 'Seu guarda, eu não sou vagabundo, eu não sou delinquente...',
    source: 'Acervo Local',
    key: 'D',
    lyrics: [
      { time: 6, text: 'Caminhei sozinho pela rua' },
      { time: 12, text: 'Falei com as estrelas e com a lua' },
      { time: 18, text: 'Deitei no banco da praça tentando te esquecer' },
      { time: 25, text: 'Mas o frio da noite fez meu corpo tremer' },
      { time: 32, text: 'Seu guarda, eu não sou vagabundo, eu não sou delinquente' },
      { time: 39, text: 'Sou um cara carente, eu dormi na praça pensando nela' },
      { time: 47, text: 'Seu guarda, seja meu amigo, me bata, me prenda' },
      { time: 54, text: 'Faça tudo comigo, mas não me deixe ficar sem ela!' }
    ]
  },
  {
    id: 'song-8',
    title: 'Primeiros Erros',
    artist: 'Capital Inicial',
    genre: 'Rock',
    duration: 242,
    durationFormatted: '4:02',
    lyricsSnippet: 'Meu caminho é cada manhã, não procure saber onde estou...',
    source: 'Acervo Local',
    key: 'G',
    lyrics: [
      { time: 6, text: 'Meu caminho é cada manhã' },
      { time: 12, text: 'Não procure saber onde estou' },
      { time: 18, text: 'Meu destino não é de ninguém' },
      { time: 24, text: 'Eu não deixo os meus passos no chão' },
      { time: 31, text: 'Se o sol declarar seu amor pela terra' },
      { time: 38, text: 'Se a chuva molhar o meu rosto de novo' },
      { time: 45, text: 'Eu vou te encontrar num sonho qualquer' },
      { time: 52, text: 'Mas se for pra sonhar, me acorde cantando!' }
    ]
  },
  {
    id: 'song-9',
    title: 'Não Quero Dinheiro (Só Quero Amar)',
    artist: 'Tim Maia',
    genre: 'Anos 80',
    duration: 165,
    durationFormatted: '2:45',
    lyricsSnippet: 'Vou pedir pra você voltar, vou pedir pra você ficar...',
    source: 'Acervo Local',
    key: 'A',
    lyrics: [
      { time: 5, text: 'Vou pedir pra você voltar' },
      { time: 9, text: 'Vou pedir pra você ficar' },
      { time: 13, text: 'Eu te amo, eu te adoro, meu amor!' },
      { time: 19, text: 'A semana inteira fiquei esperando' },
      { time: 24, text: 'Pra te ver sorrindo, pra te ver cantando' },
      { time: 29, text: 'Quando a gente ama não pensa em dinheiro' },
      { time: 35, text: 'Só se quer amar, se quer amar, se quer amar!' }
    ]
  },
  {
    id: 'song-10',
    title: 'Billie Jean',
    artist: 'Michael Jackson',
    genre: 'Internacional',
    duration: 294,
    durationFormatted: '4:54',
    lyricsSnippet: 'She was more like a beauty queen from a movie scene...',
    source: 'Acervo Local',
    key: 'F#m',
    lyrics: [
      { time: 10, text: 'She was more like a beauty queen from a movie scene' },
      { time: 16, text: 'I said don\'t mind, but what do you mean, I am the one' },
      { time: 22, text: 'Who will dance on the floor in the round?' },
      { time: 29, text: 'She told me her name was Billie Jean, as she caused a scene' },
      { time: 35, text: 'Then every head turned with eyes that dreamed of being the one' },
      { time: 42, text: 'People always told me be careful of what you do' },
      { time: 48, text: 'Billie Jean is not my lover' },
      { time: 53, text: 'She\'s just a girl who claims that I am the one' },
      { time: 59, text: 'But the kid is not my son!' }
    ]
  },
  {
    id: 'song-11',
    title: 'Anna Júlia',
    artist: 'Los Hermanos',
    genre: 'Anos 90',
    duration: 211,
    durationFormatted: '3:31',
    lyricsSnippet: 'Quem te vê passar assim por mim, não sabe o que é sofrer...',
    source: 'Acervo Local',
    key: 'A',
    lyrics: [
      { time: 6, text: 'Quem te vê passar assim por mim' },
      { time: 12, text: 'Não sabe o que é sofrer' },
      { time: 17, text: 'Ter que ver você assim, tão linda' },
      { time: 23, text: 'Sem poder tocar, sem poder ter você' },
      { time: 30, text: 'Anna Júlia, oh Anna Júlia!' },
      { time: 38, text: 'Se eu pudesse ao menos te dizer' },
      { time: 44, text: 'Que meu coração só bate por você!' }
    ]
  },
  {
    id: 'song-12',
    title: 'Trem-Bala',
    artist: 'Ana Vilela',
    genre: 'MPB',
    duration: 180,
    durationFormatted: '3:00',
    lyricsSnippet: 'Não é sobre ter todas as pessoas do mundo pra si...',
    source: 'Acervo Local',
    key: 'G',
    lyrics: [
      { time: 5, text: 'Não é sobre ter todas as pessoas do mundo pra si' },
      { time: 12, text: 'É sobre saber que em algum lugar alguém zela por ti' },
      { time: 19, text: 'É sobre cantar e poder escutar mais do que a própria voz' },
      { time: 27, text: 'É sobre dançar na chuva de vida que cai sobre nós' },
      { time: 36, text: 'Segura teu filho no colo, sorria e abrace os teus pais' },
      { time: 45, text: 'Enquanto estão aqui, que a vida é trem-bala, parceiro' },
      { time: 53, text: 'E a gente é só passageiro prestes a partir!' }
    ]
  },
  {
    id: 'song-13',
    title: 'A Queda',
    artist: 'Gloria Groove',
    genre: 'Pop',
    duration: 172,
    durationFormatted: '2:52',
    lyricsSnippet: 'Extra, extra! Não perca, grande espetáculo...',
    source: 'Acervo Local',
    key: 'Dm',
    lyrics: [
      { time: 4, text: 'Extra, extra! Não perca!' },
      { time: 8, text: 'Vem ver o circo pegar fogo' },
      { time: 12, text: 'Hoje tem espetáculo, pode aplaudir' },
      { time: 17, text: 'Todo mundo quer ver a queda do palhaço' },
      { time: 22, text: 'Mas ninguém repara no suor do trapézio' },
      { time: 28, text: 'Pede bis, pede mais, atira a primeira pedra' },
      { time: 35, text: 'Quem nunca errou que assista de camarote!' }
    ]
  },
  {
    id: 'song-14',
    title: 'Malandragem',
    artist: 'Cássia Eller',
    genre: 'Rock',
    duration: 250,
    durationFormatted: '4:10',
    lyricsSnippet: 'Quem sabe eu ainda sou uma garotinha...',
    source: 'Acervo Local',
    key: 'E',
    lyrics: [
      { time: 7, text: 'Quem sabe eu ainda sou uma garotinha' },
      { time: 13, text: 'Esperando o ônibus da escola, sozinha' },
      { time: 19, text: 'Cansada com a mochila pesada nas costas' },
      { time: 26, text: 'Eu só peço a Deus um pouco de malandragem' },
      { time: 33, text: 'Pra viver com dignidade nessa viagem' },
      { time: 40, text: 'Eu só peço a Deus uma dose de coragem!' }
    ]
  },
  {
    id: 'song-15',
    title: 'Tá Escrito',
    artist: 'Grupo Revelação / Xande de Pilares',
    genre: 'Samba',
    duration: 210,
    durationFormatted: '3:30',
    lyricsSnippet: 'Guerreiro não gela, não foge da luta...',
    source: 'Acervo Local',
    key: 'D',
    lyrics: [
      { time: 5, text: 'Quem cultiva a semente do amor' },
      { time: 9, text: 'Segue em frente e não se apavora' },
      { time: 14, text: 'Se na vida encontrar dissabor' },
      { time: 18, text: 'Vai saber que a vitória demora' },
      { time: 24, text: 'Ergue essa cabeça, mete o pé e vai na fé' },
      { time: 30, text: 'Manda essa tristeza embora!' },
      { time: 35, text: 'Basta acreditar que um novo dia vai raiar' },
      { time: 42, text: 'Sua hora vai chegar!' }
    ]
  },
  {
    id: 'song-16',
    title: 'Hotel California',
    artist: 'Eagles',
    genre: 'Internacional',
    duration: 390,
    durationFormatted: '6:30',
    lyricsSnippet: 'On a dark desert highway, cool wind in my hair...',
    source: 'Acervo Local',
    key: 'Bm',
    lyrics: [
      { time: 12, text: 'On a dark desert highway, cool wind in my hair' },
      { time: 19, text: 'Warm smell of colitas, rising up through the air' },
      { time: 26, text: 'Up ahead in the distance, I saw a shimmering light' },
      { time: 33, text: 'Welcome to the Hotel California' },
      { time: 41, text: 'Such a lovely place, such a lovely face' },
      { time: 49, text: 'Plenty of room at the Hotel California' },
      { time: 57, text: 'Any time of year, you can find it here' }
    ]
  },
  {
    id: 'song-17',
    title: 'Raridade',
    artist: 'Anderson Freire',
    genre: 'Gospel',
    duration: 305,
    durationFormatted: '5:05',
    lyricsSnippet: 'Não consigo ir além do teu olhar, tudo o que eu consigo é te amar...',
    source: 'Acervo Local',
    key: 'G',
    lyrics: [
      { time: 10, text: 'Não consigo ir além do teu olhar' },
      { time: 18, text: 'Tudo o que eu consigo é te amar' },
      { time: 25, text: 'Você é um espelho que reflete a imagem do Senhor' },
      { time: 34, text: 'Não chore se o mundo ainda não notou' },
      { time: 42, text: 'Você tem valor, o Espírito Santo se move em você' },
      { time: 51, text: 'Você é uma joia preciosa e rara!' }
    ]
  },
  {
    id: 'song-18',
    title: 'Ela Me Faz Tão Bem',
    artist: 'Lulu Santos',
    genre: 'Pop',
    duration: 205,
    durationFormatted: '3:25',
    lyricsSnippet: 'Ela me faz tão bem, ela me faz tão bem...',
    source: 'Acervo Local',
    key: 'C',
    lyrics: [
      { time: 6, text: 'Ela me faz tão bem, ela me faz tão bem' },
      { time: 12, text: 'Que eu também quero fazer isso por ela' },
      { time: 18, text: 'De manhã acordar com um beijo gostoso' },
      { time: 24, text: 'E ver o dia clareando na janela' },
      { time: 30, text: 'Como uma onda no mar, nosso amor vai passar' },
      { time: 37, text: 'E deixar na areia o registro de nós dois!' }
    ]
  }
];
