import React, { useState } from 'react';
import { X, CheckCircle, QrCode, CreditCard, ShieldCheck, ArrowRight, Loader2 } from 'lucide-react';
import { CommercialPlan } from '../types';
import { api } from '../services/api';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: CommercialPlan | null;
  onPaymentApproved: (planId: string) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  plan,
  onPaymentApproved
}) => {
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'PIX' | 'CARTAO'>('PIX');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [step, setStep] = useState<'form' | 'processing' | 'success'>('form');
  const [error, setError] = useState<string | null>(null);
  const [transactionData, setTransactionData] = useState<any>(null);

  if (!isOpen || !plan) return null;

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerEmail) {
      setError('Por favor preencha nome e e-mail.');
      return;
    }

    setError(null);
    setStep('processing');

    try {
      const result = await api.processCheckout(plan.id, customerName, customerEmail, paymentMethod);
      if (result.success) {
        setTransactionData(result);
        setStep('success');
        onPaymentApproved(plan.id);
      } else {
        throw new Error(result.error || 'Não foi possível aprovar a transação.');
      }
    } catch (err: any) {
      setError(err.message || 'Falha no processamento do pagamento.');
      setStep('form');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-lg bg-neutral-900 border border-neutral-800 rounded-2xl p-6 sm:p-8 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-neutral-400 hover:text-white p-1 rounded-lg"
          aria-label="Fechar"
        >
          <X className="w-5 h-5" />
        </button>

        {step === 'form' && (
          <div>
            <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-2">
              <ShieldCheck className="w-4 h-4" />
              <span>Checkout Seguro Karaokê 5.0</span>
            </div>

            <h2 className="text-2xl font-bold font-display text-white">
              Adquirir {plan.name}
            </h2>
            <div className="flex items-baseline gap-2 mt-1 mb-6">
              <span className="text-3xl font-extrabold text-cyan-400 font-display">
                {plan.priceFormatted}
              </span>
              <span className="text-xs text-neutral-400">taxa única sem mensalidades</span>
            </div>

            {error && (
              <div className="mb-4 p-3 rounded-lg bg-rose-950/40 border border-rose-800/60 text-xs text-rose-300">
                {error}
              </div>
            )}

            <form onSubmit={handlePay} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">Seu Nome Completo</label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Ex: Carlos Eduardo Silveira"
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">E-mail para Receber o Acesso</label>
                <input
                  type="email"
                  required
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  placeholder="carlos@exemplo.com"
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-400"
                />
              </div>

              {/* Payment method selector */}
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1.5">Forma de Pagamento</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('PIX')}
                    className={`py-2.5 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                      paymentMethod === 'PIX'
                        ? 'bg-cyan-950/40 border-cyan-400 text-cyan-300 shadow-sm'
                        : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-white'
                    }`}
                  >
                    <QrCode className="w-4 h-4" />
                    <span>PIX Instantâneo</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('CARTAO')}
                    className={`py-2.5 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                      paymentMethod === 'CARTAO'
                        ? 'bg-cyan-950/40 border-cyan-400 text-cyan-300 shadow-sm'
                        : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-white'
                    }`}
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>Cartão de Crédito</span>
                  </button>
                </div>
              </div>

              {paymentMethod === 'PIX' ? (
                <div className="p-3.5 bg-neutral-950 border border-neutral-800 rounded-xl text-xs space-y-2">
                  <div className="flex items-center gap-2 text-emerald-400 font-semibold">
                    <CheckCircle className="w-4 h-4" />
                    <span>Liberação Imediata via PIX</span>
                  </div>
                  <p className="text-neutral-400 text-[11px] leading-relaxed">
                    O sistema gera a chave de pagamento e a confirmação é registrada diretamente no banco de dados, liberando todas as funções no ato.
                  </p>
                </div>
              ) : (
                <div className="space-y-3 p-3.5 bg-neutral-950 border border-neutral-800 rounded-xl text-xs">
                  <div>
                    <label className="block text-[11px] text-neutral-400 mb-1">Número do Cartão</label>
                    <input
                      type="text"
                      placeholder="4000 1234 5678 9010"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full bg-neutral-900 border border-neutral-800 rounded px-2.5 py-1.5 text-white focus:outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] text-neutral-400 mb-1">Validade</label>
                      <input
                        type="text"
                        placeholder="MM/AA"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        className="w-full bg-neutral-900 border border-neutral-800 rounded px-2.5 py-1.5 text-white focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-neutral-400 mb-1">CVV</label>
                      <input
                        type="text"
                        placeholder="123"
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        className="w-full bg-neutral-900 border border-neutral-800 rounded px-2.5 py-1.5 text-white focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 px-4 bg-cyan-400 hover:bg-cyan-300 text-neutral-950 font-bold rounded-xl text-sm transition-all shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2 mt-4"
              >
                <span>CONFIRMAR E ATIVAR {plan.name}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}

        {step === 'processing' && (
          <div className="py-12 text-center space-y-4">
            <Loader2 className="w-10 h-10 text-cyan-400 animate-spin mx-auto" />
            <h3 className="text-xl font-bold text-white font-display">
              Processando Pagamento...
            </h3>
            <p className="text-xs text-neutral-400 max-w-xs mx-auto">
              Verificando transação segura e provisionando o acesso ao banco de dados...
            </p>
          </div>
        )}

        {step === 'success' && transactionData && (
          <div className="py-6 text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8" />
            </div>

            <h3 className="text-2xl font-bold text-white font-display">
              Pagamento Aprovado!
            </h3>
            <p className="text-sm text-neutral-300">
              {transactionData.message}
            </p>

            <div className="p-4 bg-neutral-950 border border-neutral-800 rounded-xl text-left text-xs space-y-1.5 text-neutral-300">
              <div><strong className="text-white">Transação:</strong> <span className="font-mono text-cyan-400">{transactionData.transactionId}</span></div>
              <div><strong className="text-white">Plano:</strong> {transactionData.plan}</div>
              <div><strong className="text-white">Cliente:</strong> {transactionData.customerName} ({transactionData.customerEmail})</div>
              <div><strong className="text-white">Status:</strong> <span className="text-emerald-400 font-semibold">{transactionData.status}</span></div>
            </div>

            <button
              onClick={onClose}
              className="w-full py-3 px-4 bg-cyan-400 hover:bg-cyan-300 text-neutral-950 font-bold rounded-xl text-sm transition-all shadow-md shadow-cyan-500/20"
            >
              ACESSAR MEU SISTEMA ATIVADO
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
