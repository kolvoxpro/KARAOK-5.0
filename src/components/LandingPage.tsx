import React, { useState } from 'react';
import {
  Mic2,
  Tv,
  Smartphone,
  Flame,
  Award,
  Music2,
  BarChart3,
  Sliders,
  ShieldCheck,
  CheckCircle2,
  HelpCircle,
  Headphones,
  ArrowRight,
  Sparkles,
  Camera,
  PlayCircle
} from 'lucide-react';
import { CommercialPlan } from '../types';

interface LandingPageProps {
  onEnterSystem: () => void;
  onOpenLogin: () => void;
  onSelectPlan: (planId: string) => void;
  plans: CommercialPlan[];
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onEnterSystem,
  onOpenLogin,
  onSelectPlan,
  plans
}) => {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const heroImage = '/src/assets/images/karaoke_hero_stage_1791038356927.jpg';
  const crowdImage = '/src/assets/images/karaoke_party_crowd_1791038386837.jpg';
  const mobileImage = '/src/assets/images/karaoke_mobile_phone_1791038377142.jpg';

  const faqs = [
    {
      q: 'O sistema funciona sem internet (offline)?',
      a: 'Sim! O KARAOKÊ 5.0 possui arquitetura híbrida. O acervo local, o player profissional, o controle de tom, a fila e o sistema de pontuação funcionam 100% offline no seu computador. Quando conectado, o sistema ativa o controle sincronizado pelo celular e as reações da plateia.'
    },
    {
      q: 'Os convidados precisam instalar algum aplicativo no celular?',
      a: 'Não. Os convidados apenas apontam a câmera do celular para o QR Code na tela. O sistema abre instantaneamente uma página web veloz e responsiva onde escolhem músicas, entram na fila e reagem ao vivo.'
    },
    {
      q: 'Como funciona o suporte a dois monitores (Monitor 1 e Monitor 2)?',
      a: 'O KARAOKÊ 5.0 foi projetado nativamente para dois monitores: o Monitor 1 exibe o painel do operador com controles e atalhos, enquanto o Monitor 2 (sua TV ou projetor HDMI/DisplayPort) exibe a tela cinematográfica com letras sincronizadas, notas e reações, sem nenhum controle administrativo visível para a plateia.'
    },
    {
      q: 'Como é calculada a pontuação do cantor?',
      a: 'Você pode escolher entre 5 modos configuráveis: Automático, Microfone (analisa a frequência e energia vocal captada pelo microfone), Plateia (calculado proporcionalmente às reações enviadas pelos celulares), Aleatório ou Manual.'
    },
    {
      q: 'Posso utilizar meu próprio acervo de músicas e vídeos?',
      a: 'Com certeza. O sistema permite cadastrar e importar suas próprias músicas, faixas locais em MP3/MP4 e organizar suas playlists personalizadas de abertura, intervalo e festa.'
    }
  ];

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col selection:bg-cyan-500 selection:text-black">
      {/* Top Bar Contract: 3 zones */}
      <header className="sticky top-0 z-50 bg-neutral-950/85 backdrop-blur-md border-b border-neutral-800/80 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Zone 1: Single element wordmark */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-cyan-500 to-fuchsia-500 flex items-center justify-center text-neutral-950 font-black shadow-lg shadow-cyan-500/20">
              <Mic2 className="w-5 h-5" />
            </div>
            <span className="text-xl font-extrabold tracking-tight font-display text-white">
              KARAOKÊ <span className="text-cyan-400">5.0</span>
            </span>
          </div>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-neutral-300">
            <a href="#como-funciona" className="hover:text-cyan-400 transition-colors">Como Funciona</a>
            <a href="#recursos" className="hover:text-cyan-400 transition-colors">Recursos</a>
            <a href="#telas" className="hover:text-cyan-400 transition-colors">Modos TV & Celular</a>
            <a href="#planos" className="hover:text-cyan-400 transition-colors">Planos</a>
            <a href="#faq" className="hover:text-cyan-400 transition-colors">Dúvidas</a>
          </nav>

          {/* Zone 3: Primary Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={onOpenLogin}
              className="px-4 py-2 text-sm font-medium text-neutral-300 hover:text-white hover:bg-neutral-900 rounded-lg transition-colors"
            >
              Entrar
            </button>
            <button
              onClick={onEnterSystem}
              className="px-5 py-2 text-sm font-semibold text-neutral-950 bg-cyan-400 hover:bg-cyan-300 rounded-lg shadow-md shadow-cyan-500/20 transition-all flex items-center gap-2"
            >
              <span>Abrir Sistema</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 border-b border-neutral-900">
        <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
          <img
            src={heroImage}
            alt="Palco Karaokê 5.0"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover filter blur-[2px]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/80 to-transparent" />
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-cyan-400 bg-cyan-950/40 border border-cyan-800/50 px-3 py-1 rounded-md">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span>Sistema Profissional para Bares, Eventos & DJs</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight font-display text-white leading-tight">
                Transforme qualquer festa em um <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-fuchsia-400 to-amber-300">palco profissional</span>.
              </h1>

              <p className="text-lg text-neutral-300 max-w-2xl leading-relaxed">
                Controle seu karaokê pelo computador, deixe seus convidados escolherem músicas pelo celular via QR Code, acompanhe pontuações em tempo real, receba reações da plateia e garanta show contínuo na sua TV ou projetor.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <a
                  href="#planos"
                  className="px-6 py-3.5 text-base font-bold text-neutral-950 bg-gradient-to-r from-cyan-400 to-cyan-300 hover:from-cyan-300 hover:to-cyan-200 rounded-xl shadow-lg shadow-cyan-500/25 transition-all"
                >
                  COMPRAR AGORA
                </a>
                <button
                  onClick={onEnterSystem}
                  className="px-6 py-3.5 text-base font-semibold text-neutral-100 bg-neutral-900 hover:bg-neutral-800 border border-neutral-700/80 rounded-xl transition-all flex items-center gap-2"
                >
                  <PlayCircle className="w-5 h-5 text-fuchsia-400" />
                  <span>CONHECER O SISTEMA</span>
                </button>
                <a
                  href="#recursos"
                  className="px-5 py-3.5 text-base font-medium text-neutral-400 hover:text-neutral-200 transition-colors"
                >
                  VER FUNCIONALIDADES
                </a>
              </div>

              {/* Trust markers */}
              <div className="flex items-center gap-6 pt-6 border-t border-neutral-800/60 text-xs text-neutral-400">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Suporte a 2 Monitores (TV + Operador)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Sem app no celular: Direto no QR Code</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Modo Offline Garantido</span>
                </div>
              </div>
            </div>

            {/* Interactive Stage Mockup Preview */}
            <div className="lg:col-span-5">
              <div className="relative rounded-2xl bg-neutral-900 border border-neutral-800 p-4 shadow-2xl shadow-cyan-950/40">
                <div className="flex items-center justify-between pb-3 border-b border-neutral-800 text-xs text-neutral-400">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="font-semibold text-white">SESSÃO AO VIVO</span>
                  </div>
                  <span className="font-mono text-cyan-400">TV 16:9 • FULL HD</span>
                </div>

                <div className="mt-3 relative rounded-xl overflow-hidden bg-neutral-950 aspect-video flex flex-col justify-between p-5 border border-neutral-800">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="text-[10px] uppercase tracking-wider text-fuchsia-400 font-bold">Agora Cantando</div>
                      <div className="text-xl font-extrabold text-white font-display">Evidências</div>
                      <div className="text-xs text-neutral-400">Chitãozinho & Xororó</div>
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] text-neutral-400">Cantor no Palco</div>
                      <div className="text-sm font-bold text-cyan-300">João Silva</div>
                    </div>
                  </div>

                  {/* Karaoke lyric demo */}
                  <div className="text-center py-2 space-y-1">
                    <div className="text-base sm:text-lg font-bold text-amber-300 tracking-wide">
                      "E nessa loucura de dizer que não te quero..."
                    </div>
                    <div className="text-xs text-neutral-400">
                      Vou negando as aparências, disfarçando as evidências
                    </div>
                  </div>

                  <div className="flex justify-between items-center text-xs pt-2 border-t border-neutral-800/80">
                    <div className="flex items-center gap-2 text-neutral-400">
                      <span>Próximo:</span>
                      <span className="text-white font-medium">Mariana Costa (Cheia de Manias)</span>
                    </div>
                    <div className="flex items-center gap-1 text-rose-400 font-mono font-bold">
                      <Flame className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
                      <span>+48</span>
                    </div>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-neutral-800 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-neutral-400">
                    <Smartphone className="w-4 h-4 text-cyan-400" />
                    <span>Acesso convidados: <strong className="text-white">QR Code Ativo</strong></span>
                  </div>
                  <button
                    onClick={onEnterSystem}
                    className="text-cyan-400 hover:text-cyan-300 font-semibold"
                  >
                    Testar Operador &rarr;
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Como Funciona Section */}
      <section id="como-funciona" className="py-20 bg-neutral-900/40 border-b border-neutral-900">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">Fluxo Operacional Descomplicado</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight font-display text-white">
              Como funciona o Karaokê 5.0 no seu evento
            </h2>
            <p className="text-neutral-400 text-base">
              Desenvolvido para que qualquer pessoa consiga operar profissionalmente em menos de 2 minutos.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-7 relative">
              <div className="w-12 h-12 rounded-xl bg-cyan-950 border border-cyan-800 flex items-center justify-center text-cyan-400 font-display font-bold text-xl mb-5">
                01
              </div>
              <h3 className="text-lg font-bold text-white mb-2 font-display">Conecte o PC e a TV</h3>
              <p className="text-sm text-neutral-400 leading-relaxed">
                Abra o Karaokê 5.0 no seu computador e envie o Modo Público para o segundo monitor ou TV. Todos os controles ficam discretos na sua tela de operador.
              </p>
            </div>

            <div className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-7 relative">
              <div className="w-12 h-12 rounded-xl bg-fuchsia-950 border border-fuchsia-800 flex items-center justify-center text-fuchsia-400 font-display font-bold text-xl mb-5">
                02
              </div>
              <h3 className="text-lg font-bold text-white mb-2 font-display">Convidados Leem o QR Code</h3>
              <p className="text-sm text-neutral-400 leading-relaxed">
                Aparece na tela da TV um QR Code dinâmico. O público aponta a câmera do celular, pesquisa qualquer música no catálogo e entra na fila automaticamente.
              </p>
            </div>

            <div className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-7 relative">
              <div className="w-12 h-12 rounded-xl bg-amber-950 border border-amber-800 flex items-center justify-center text-amber-400 font-display font-bold text-xl mb-5">
                03
              </div>
              <h3 className="text-lg font-bold text-white mb-2 font-display">O Show Começa!</h3>
              <p className="text-sm text-neutral-400 leading-relaxed">
                As letras saltam na TV sincronizadas, a plateia envia reações de aplausos e fogo pelo celular, a pontuação é calculada e a foto do momento do show é registrada!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Principais Recursos */}
      <section id="recursos" className="py-20 border-b border-neutral-900">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">Engenharia Completa</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight font-display text-white">
              Tudo o que seu bar ou evento precisa
            </h2>
            <p className="text-neutral-400 text-base">
              Recursos desenhados com base nas reais necessidades de operadores, bares, casas de eventos e DJs de todo o Brasil.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-6 bg-neutral-900/50 border border-neutral-800 rounded-2xl hover:border-neutral-700 transition-colors">
              <Sliders className="w-8 h-8 text-cyan-400 mb-4" />
              <h3 className="text-lg font-bold text-white mb-2">Controle de Tom em Tempo Real</h3>
              <p className="text-sm text-neutral-400">
                Ajuste o tom de qualquer música de -3 a +3 semitons para que qualquer cantor encontre a afinação confortável para sua voz.
              </p>
            </div>

            <div className="p-6 bg-neutral-900/50 border border-neutral-800 rounded-2xl hover:border-neutral-700 transition-colors">
              <Award className="w-8 h-8 text-amber-400 mb-4" />
              <h3 className="text-lg font-bold text-white mb-2">Sistema de Pontuação 0 a 100</h3>
              <p className="text-sm text-neutral-400">
                5 modos configuráveis: automático, análise real de microfone via Web Audio, pontuação da plateia, aleatório ou controle manual do operador.
              </p>
            </div>

            <div className="p-6 bg-neutral-900/50 border border-neutral-800 rounded-2xl hover:border-neutral-700 transition-colors">
              <Flame className="w-8 h-8 text-rose-400 mb-4" />
              <h3 className="text-lg font-bold text-white mb-2">Reações da Plateia ao Vivo</h3>
              <p className="text-sm text-neutral-400">
                O público toca em emojis no celular (🔥 👏 ❤️ 😂 🎤 ⭐ 🚀) e os efeitos sobem flutuando instantaneamente na tela pública da TV!
              </p>
            </div>

            <div className="p-6 bg-neutral-900/50 border border-neutral-800 rounded-2xl hover:border-neutral-700 transition-colors">
              <Camera className="w-8 h-8 text-fuchsia-400 mb-4" />
              <h3 className="text-lg font-bold text-white mb-2">Modo Foto do Cantor</h3>
              <p className="text-sm text-neutral-400">
                Ao término da música, a webcam captura o cantor em moldura comemorativa personalizada com nome, nota e logo do seu evento.
              </p>
            </div>

            <div className="p-6 bg-neutral-900/50 border border-neutral-800 rounded-2xl hover:border-neutral-700 transition-colors">
              <Music2 className="w-8 h-8 text-emerald-400 mb-4" />
              <h3 className="text-lg font-bold text-white mb-2">Modo Automático (Sem Silêncio)</h3>
              <p className="text-sm text-neutral-400">
                Se a fila esvaziar, o sistema toca playlists configuradas de intervalo para nunca deixar o bar ou a festa em silêncio.
              </p>
            </div>

            <div className="p-6 bg-neutral-900/50 border border-neutral-800 rounded-2xl hover:border-neutral-700 transition-colors">
              <BarChart3 className="w-8 h-8 text-indigo-400 mb-4" />
              <h3 className="text-lg font-bold text-white mb-2">Estatísticas e Histórico</h3>
              <p className="text-sm text-neutral-400">
                Acompanhe as músicas mais pedidas, horários de pico do evento, ranking dos melhores cantores e histórico completo.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Telas e Experiência Visual */}
      <section id="telas" className="py-20 bg-neutral-900/40 border-b border-neutral-900">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">Arquitetura de Duas Telas</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight font-display text-white">
                O operador no comando. O público no espetáculo.
              </h2>
              <p className="text-neutral-300 leading-relaxed">
                Nunca mostre controles do Windows ou barras de rolagem para seus clientes. O <strong>Modo Público</strong> foi desenhado exclusivamente para TVs e projetores 16:9 Full HD e 4K, oferecendo contraste ideal para ser lido de qualquer mesa do salão.
              </p>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Tv className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                  <p className="text-sm text-neutral-400">
                    <strong className="text-white">Tela da TV:</strong> Letra em destaque progressivo, nome do cantor, próximo da fila e chuva de reações visuais.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <Smartphone className="w-5 h-5 text-fuchsia-400 shrink-0 mt-0.5" />
                  <p className="text-sm text-neutral-400">
                    <strong className="text-white">Tela do Celular:</strong> Acesso rápido sem cadastro pesado, busca rápida, fila pessoal e botões de reação hápticos.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <p className="text-sm text-neutral-400">
                    <strong className="text-white">Segurança Total:</strong> Convidados só podem sugerir músicas e reagir. Nenhum convidado mexe nas configurações.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="rounded-2xl overflow-hidden border border-neutral-800 bg-neutral-900">
                <img
                  src={mobileImage}
                  alt="Tela do celular Karaokê 5.0"
                  referrerPolicy="no-referrer"
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <div className="text-xs font-bold text-cyan-400 uppercase tracking-wider">Celular do Convidado</div>
                  <p className="text-xs text-neutral-400 mt-1">Busca instantânea e fila sem download de app.</p>
                </div>
              </div>

              <div className="rounded-2xl overflow-hidden border border-neutral-800 bg-neutral-900">
                <img
                  src={crowdImage}
                  alt="Plateia reagindo no Karaokê"
                  referrerPolicy="no-referrer"
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <div className="text-xs font-bold text-fuchsia-400 uppercase tracking-wider">Plateia Interativa</div>
                  <p className="text-xs text-neutral-400 mt-1">Engajamento real com chuva de emojis na TV.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Planos Comerciais */}
      <section id="planos" className="py-20 border-b border-neutral-900">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">Preços Transparentes</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight font-display text-white">
              Escolha o pacote perfeito para sua festa ou bar
            </h2>
            <p className="text-neutral-400 text-base">
              Sem mensalidades abusivas. Acesso completo e profissional.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan) => {
              const isPopular = plan.popular;
              return (
                <div
                  key={plan.id}
                  className={`rounded-2xl p-8 flex flex-col justify-between transition-all relative ${
                    isPopular
                      ? 'bg-neutral-900/90 border-2 border-cyan-400 shadow-2xl shadow-cyan-950/50 ring-1 ring-cyan-400/20'
                      : 'bg-neutral-900/60 border border-neutral-800 hover:border-neutral-700'
                  }`}
                >
                  {plan.badge && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-cyan-400 to-fuchsia-500 text-neutral-950 text-[11px] font-black tracking-wider uppercase px-3 py-0.5 rounded-full shadow-md">
                      {plan.badge}
                    </div>
                  )}

                  <div>
                    <h3 className="text-xl font-bold text-white font-display">{plan.name}</h3>
                    <p className="text-xs text-neutral-400 mt-1 min-h-[32px]">{plan.description}</p>

                    <div className="mt-6 mb-6">
                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl sm:text-4xl font-extrabold font-display text-white">
                          {plan.priceFormatted}
                        </span>
                        <span className="text-xs text-neutral-400 font-medium">pagamento único</span>
                      </div>
                    </div>

                    <div className="space-y-3 pt-6 border-t border-neutral-800 text-xs">
                      {plan.features.map((feature, idx) => (
                        <div key={idx} className="flex items-start gap-2.5 text-neutral-300">
                          <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-8 pt-4">
                    <button
                      onClick={() => onSelectPlan(plan.id)}
                      className={`w-full py-3 px-4 rounded-xl text-sm font-bold transition-all shadow-md ${
                        isPopular
                          ? 'bg-cyan-400 hover:bg-cyan-300 text-neutral-950 shadow-cyan-500/25'
                          : 'bg-neutral-800 hover:bg-neutral-700 text-white'
                      }`}
                    >
                      ADQUIRIR {plan.name}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-20 bg-neutral-900/30 border-b border-neutral-900">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-14 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">Tire Suas Dúvidas</span>
            <h2 className="text-3xl font-extrabold tracking-tight font-display text-white">
              Perguntas Frequentes
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => {
              const isOpen = activeFaq === index;
              return (
                <div
                  key={index}
                  className="rounded-xl border border-neutral-800 bg-neutral-900/60 overflow-hidden"
                >
                  <button
                    onClick={() => setActiveFaq(isOpen ? null : index)}
                    className="w-full px-6 py-4 text-left flex items-center justify-between text-sm sm:text-base font-semibold text-white hover:text-cyan-400 transition-colors"
                  >
                    <span>{faq.q}</span>
                    <HelpCircle className={`w-5 h-5 transition-transform text-neutral-400 ${isOpen ? 'rotate-180 text-cyan-400' : ''}`} />
                  </button>
                  {isOpen && (
                    <div className="px-6 pb-5 text-sm text-neutral-300 leading-relaxed border-t border-neutral-800/80 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto py-12 px-6 border-t border-neutral-900 bg-neutral-950 text-neutral-400 text-xs">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-cyan-400 text-neutral-950 font-black flex items-center justify-center text-xs">
              K5
            </div>
            <span className="font-bold text-white text-sm">KARAOKÊ 5.0</span>
            <span className="text-neutral-500">· "Transforme qualquer festa em um palco."</span>
          </div>

          <div className="flex items-center gap-6">
            <button onClick={onEnterSystem} className="hover:text-cyan-400 transition-colors">Painel do Operador</button>
            <a href="#planos" className="hover:text-cyan-400 transition-colors">Planos</a>
            <a href="#faq" className="hover:text-cyan-400 transition-colors">Suporte & FAQ</a>
          </div>

          <div className="text-neutral-500">
            © 2026 KARAOKÊ 5.0. Todos os direitos reservados.
          </div>
        </div>
      </footer>
    </div>
  );
};
