import React, { useState } from 'react';
import {
  HelpCircle,
  BookOpen,
  MessageSquare,
  Send,
  CheckCircle2,
  Tv,
  Mic,
  Smartphone,
  WifiOff
} from 'lucide-react';
import { SupportTicket } from '../types';

interface SupportPanelProps {
  tickets: SupportTicket[];
  onSubmitTicket: (ticket: Partial<SupportTicket>) => Promise<void>;
}

export const SupportPanel: React.FC<SupportPanelProps> = ({
  tickets,
  onSubmitTicket
}) => {
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState<any>('audio');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName || !userEmail || !subject || !message) return;

    setSubmitting(true);
    try {
      await onSubmitTicket({
        userName,
        userEmail,
        subject,
        category,
        message
      });
      setSuccess(true);
      setSubject('');
      setMessage('');
      setTimeout(() => setSuccess(false), 4000);
    } catch (err) {
      alert('Erro ao enviar chamado.');
    } finally {
      setSubmitting(false);
    }
  };

  const tutorials = [
    {
      icon: Tv,
      title: 'Como configurar TV e Dois Monitores',
      desc: 'Conecte o HDMI na TV, aperte Win + P e escolha "Estender". Abra o Modo Público e aperte F11 para tela cheia.'
    },
    {
      icon: Smartphone,
      title: 'Como os convidados conectam pelo celular',
      desc: 'Basta exibir o QR Code na TV. Os convidados apontam a câmera e entram direto na fila sem baixar app.'
    },
    {
      icon: Mic,
      title: 'Como configurar o microfone e notas',
      desc: 'Conecte seu microfone USB ou mesa de som no computador e ative a permissão de áudio para pontuação automática.'
    },
    {
      icon: WifiOff,
      title: 'Como operar 100% offline sem internet',
      desc: 'O acervo local, o player, o controle de tom e a fila funcionam totalmente sem conexão em qualquer lugar.'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="pb-4 border-b border-neutral-800">
        <h2 className="text-xl font-bold font-display text-white flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-cyan-400" />
          <span>Central de Ajuda & Suporte Técnico</span>
        </h2>
        <p className="text-xs text-neutral-400 mt-0.5">
          Tutoriais de configuração, guias de montagem e abertura de chamados técnicos
        </p>
      </div>

      {/* Tutorials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {tutorials.map((tut, idx) => {
          const Icon = tut.icon;
          return (
            <div key={idx} className="p-4 rounded-xl bg-neutral-900/60 border border-neutral-800 flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-cyan-950 border border-cyan-800 flex items-center justify-center text-cyan-400 shrink-0">
                <Icon className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">{tut.title}</h3>
                <p className="text-xs text-neutral-400 mt-1 leading-relaxed">{tut.desc}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Open Ticket Form & Tickets History */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7 p-6 rounded-2xl bg-neutral-900 border border-neutral-800">
          <h3 className="text-base font-bold text-white font-display mb-1 flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-cyan-400" />
            <span>Abrir Chamado de Suporte</span>
          </h3>
          <p className="text-xs text-neutral-400 mb-4">
            Nossa equipe técnica responde chamados com prioridade para operadores.
          </p>

          {success && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-950/80 border border-emerald-800 text-xs text-emerald-300 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Chamado registrado com sucesso no banco de dados!</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-neutral-300 mb-1">Seu Nome</label>
                <input
                  type="text"
                  required
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="Nome do operador"
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block font-semibold text-neutral-300 mb-1">Seu E-mail</label>
                <input
                  type="email"
                  required
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  placeholder="email@exemplo.com"
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-neutral-300 mb-1">Categoria</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-2.5 py-2 text-white focus:outline-none"
                >
                  <option value="audio">Áudio / Microfones / Mesa de Som</option>
                  <option value="monitores">Configuração de 2 Monitores / TV</option>
                  <option value="celular">Conexão do Celular / QR Code</option>
                  <option value="instalacao">Instalação & Atualizações</option>
                  <option value="pagamento">Planos & Pagamento</option>
                  <option value="outro">Outro Assunto</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-neutral-300 mb-1">Assunto Resumido</label>
                <input
                  type="text"
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Ex: Dúvida sobre saída de som"
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-neutral-300 mb-1">Mensagem Detalhada</label>
              <textarea
                rows={3}
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Descreva o que está acontecendo..."
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-400"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="py-2.5 px-4 bg-cyan-400 hover:bg-cyan-300 text-neutral-950 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-all shadow-md shadow-cyan-500/20 disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{submitting ? 'Enviando...' : 'Enviar Chamado'}</span>
            </button>
          </form>
        </div>

        {/* Existing tickets list */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-neutral-900 border border-neutral-800">
          <h3 className="text-base font-bold text-white font-display mb-1">
            Seus Chamados Anteriores
          </h3>
          <p className="text-xs text-neutral-400 mb-4">
            Acompanhe o andamento das solicitações
          </p>

          <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
            {tickets.map((tkt) => (
              <div key={tkt.id} className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 text-xs space-y-1">
                <div className="flex items-start justify-between gap-2">
                  <span className="font-bold text-white truncate">{tkt.subject}</span>
                  <span
                    className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase shrink-0 ${
                      tkt.status === 'resolvido'
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                        : 'bg-amber-950 text-amber-300 border border-amber-800'
                    }`}
                  >
                    {tkt.status === 'resolvido' ? 'Resolvido' : 'Em Análise'}
                  </span>
                </div>
                <p className="text-neutral-400 text-[11px] line-clamp-2">{tkt.message}</p>
                <div className="text-[10px] text-neutral-500 pt-1">
                  {new Date(tkt.createdAt).toLocaleDateString('pt-BR')} · {tkt.category}
                </div>
              </div>
            ))}
            {tickets.length === 0 && (
              <div className="text-xs text-neutral-500 italic text-center py-8">
                Nenhum chamado aberto no momento.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
