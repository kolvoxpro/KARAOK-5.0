import React, { useState } from 'react';
import { X, Lock, Mail, User, Building, AlertCircle, ArrowRight } from 'lucide-react';
import { api } from '../services/api';
import { User as UserType } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: UserType) => void;
  initialMode?: 'login' | 'register' | 'recovery';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  initialMode = 'login'
}) => {
  const [mode, setMode] = useState<'login' | 'register' | 'recovery'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [establishmentName, setEstablishmentName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recoverySent, setRecoverySent] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (mode === 'login') {
        const res = await api.login(email, password);
        onSuccess(res.user);
        onClose();
      } else if (mode === 'register') {
        const res = await api.register({
          name,
          email,
          password,
          establishmentName: establishmentName || 'Meu Bar de Karaokê'
        });
        onSuccess(res.user);
        onClose();
      } else if (mode === 'recovery') {
        setRecoverySent(true);
      }
    } catch (err: any) {
      setError(err.message || 'Ocorreu um erro. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = async () => {
    setLoading(true);
    try {
      const res = await api.login('operador@karaoke50.com.br', '123456');
      onSuccess(res.user);
      onClose();
    } catch {
      // Fallback local
      onSuccess({
        id: 'usr-demo',
        name: 'DJ Operador Demo',
        email: 'operador@karaoke50.com.br',
        role: 'operator',
        planId: 'diamante',
        createdAt: new Date().toISOString()
      });
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-2xl p-6 sm:p-8 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-neutral-400 hover:text-white p-1 rounded-lg"
          aria-label="Fechar"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-bold text-lg flex items-center justify-center mx-auto mb-3">
            K5
          </div>
          <h2 className="text-2xl font-bold font-display text-white">
            {mode === 'login' && 'Entrar no Karaokê 5.0'}
            {mode === 'register' && 'Criar Conta de Operador'}
            {mode === 'recovery' && 'Recuperar Minha Senha'}
          </h2>
          <p className="text-xs text-neutral-400 mt-1">
            {mode === 'login' && 'Acesse seu painel e gerencie o evento da noite.'}
            {mode === 'register' && 'Configure seu estabelecimento e comece a festa.'}
            {mode === 'recovery' && 'Informe seu e-mail cadastrado para redefinir.'}
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-rose-950/40 border border-rose-800/60 text-xs text-rose-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        {recoverySent ? (
          <div className="space-y-4 text-center py-4">
            <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-800/60 text-emerald-300 text-sm">
              Enviamos um link de recuperação para <strong>{email}</strong>. Verifique sua caixa de entrada e spam.
            </div>
            <button
              onClick={() => { setRecoverySent(false); setMode('login'); }}
              className="text-xs text-cyan-400 hover:underline"
            >
              Voltar para o login
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <>
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">Seu Nome / Nome Artístico</label>
                  <div className="relative">
                    <User className="w-4 h-4 absolute left-3 top-3 text-neutral-500" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Ex: DJ Roberto ou Marcos"
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-lg pl-9 pr-3 py-2 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">Nome do Estabelecimento / Festa</label>
                  <div className="relative">
                    <Building className="w-4 h-4 absolute left-3 top-3 text-neutral-500" />
                    <input
                      type="text"
                      value={establishmentName}
                      onChange={(e) => setEstablishmentName(e.target.value)}
                      placeholder="Ex: Bar do Rock ou Aniversário da Ana"
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-lg pl-9 pr-3 py-2 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1">E-mail</label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-3 text-neutral-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu.email@exemplo.com"
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg pl-9 pr-3 py-2 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>

            {mode !== 'recovery' && (
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-semibold text-neutral-300">Senha</label>
                  {mode === 'login' && (
                    <button
                      type="button"
                      onClick={() => setMode('recovery')}
                      className="text-[11px] text-cyan-400 hover:underline"
                    >
                      Esqueci minha senha
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-3 text-neutral-500" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg pl-9 pr-3 py-2 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 bg-cyan-400 hover:bg-cyan-300 text-neutral-950 font-bold rounded-lg text-sm transition-all shadow-md shadow-cyan-500/20 disabled:opacity-50 mt-2 flex items-center justify-center gap-2"
            >
              {loading ? (
                <span>Processando...</span>
              ) : (
                <>
                  <span>
                    {mode === 'login' && 'ENTRAR NO SISTEMA'}
                    {mode === 'register' && 'CRIAR CONTA'}
                    {mode === 'recovery' && 'ENVIAR LINK'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}

        <div className="mt-6 pt-5 border-t border-neutral-800 flex flex-col gap-3 text-center text-xs">
          {mode === 'login' && (
            <div className="text-neutral-400">
              Não tem uma conta?{' '}
              <button
                onClick={() => setMode('register')}
                className="text-cyan-400 font-semibold hover:underline"
              >
                CRIAR CONTA
              </button>
            </div>
          )}

          {mode === 'register' && (
            <div className="text-neutral-400">
              Já possui conta?{' '}
              <button
                onClick={() => setMode('login')}
                className="text-cyan-400 font-semibold hover:underline"
              >
                ENTRAR
              </button>
            </div>
          )}

          {mode === 'recovery' && (
            <button
              onClick={() => setMode('login')}
              className="text-neutral-400 hover:text-white"
            >
              Voltar ao Login
            </button>
          )}

          <div className="pt-2">
            <button
              onClick={handleQuickDemo}
              className="w-full py-2 px-3 rounded-lg bg-neutral-800/80 hover:bg-neutral-800 text-neutral-300 font-medium text-xs border border-neutral-700/60 transition-colors"
            >
              Acesso Rápido de Teste (Operador Master)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
