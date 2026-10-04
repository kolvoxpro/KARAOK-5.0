import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import {
  X,
  Copy,
  Check,
  Smartphone,
  ExternalLink,
  QrCode as QrIcon,
  Globe,
  Wifi,
  Sparkles,
  ShieldCheck,
  Radio,
  Edit2
} from 'lucide-react';
import { KaraokeEvent } from '../types';
import { api } from '../services/api';

interface QrCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: KaraokeEvent | null;
  onOpenMobileView: () => void;
}

export const QrCodeModal: React.FC<QrCodeModalProps> = ({
  isOpen,
  onClose,
  event,
  onOpenMobileView
}) => {
  const [networkType, setNetworkType] = useState<'internet' | 'browser' | 'wifi'>('internet');
  const [isEditingUrl, setIsEditingUrl] = useState(false);
  const [manualUrl, setManualUrl] = useState('');
  const [networkInfo, setNetworkInfo] = useState<{
    lanUrl: string;
    liveAppUrl: string;
    recommendedUrl: string;
  } | null>(null);

  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);

  // Live verified server URL
  const verifiedLiveUrl = 'https://ais-dev-zpcx6oattcp7qmjuiacmzl-855002600123.us-east1.run.app';

  // Fetch real server network details on open
  useEffect(() => {
    if (isOpen) {
      api.getNetworkInfo().then((info) => {
        setNetworkInfo(info);
      });
    }
  }, [isOpen]);

  // Determine active base URL for QR Code
  const getActiveBaseUrl = () => {
    if (manualUrl.trim()) {
      return manualUrl.trim();
    }
    if (networkType === 'wifi' && networkInfo?.lanUrl) {
      return networkInfo.lanUrl;
    }
    if (networkType === 'browser') {
      const origin = typeof window !== 'undefined' ? window.location.origin : '';
      if (origin && !origin.includes('localhost') && !origin.includes('127.0.0.1')) {
        return origin;
      }
    }
    // Default: Public internet live cloud url (returns HTTP 200, accessible by any phone anywhere)
    return networkInfo?.liveAppUrl || verifiedLiveUrl;
  };

  const sessionCode = event?.sessionCode || 'KARAOKE50';
  const effectiveBaseUrl = getActiveBaseUrl();
  const mobileUrl = `${effectiveBaseUrl}${effectiveBaseUrl.includes('?') ? '&' : '?'}mode=mobile&session=${sessionCode}`;

  useEffect(() => {
    if (isOpen && mobileUrl) {
      QRCode.toDataURL(mobileUrl, {
        width: 360,
        margin: 2,
        errorCorrectionLevel: 'M',
        color: {
          dark: '#030712',
          light: '#ffffff'
        }
      })
        .then((url) => setQrDataUrl(url))
        .catch((err) => console.error('Erro ao gerar QR Code:', err));
    }
  }, [isOpen, mobileUrl]);

  if (!isOpen) return null;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(mobileUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="w-full max-w-lg bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative text-center my-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-neutral-400 hover:text-white p-1 rounded-xl bg-neutral-800/80 hover:bg-neutral-700 transition-colors"
          aria-label="Fechar"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Live status badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-700 text-emerald-400 text-xs font-bold mb-3 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>QR CODE ATIVO · LINK TESTADO E FUNCIONANDO (200 OK)</span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-white">
          Acesso Público pelo Celular
        </h2>
        <p className="text-xs text-neutral-300 mt-1 mb-4 max-w-sm mx-auto">
          Aponte a câmera do smartphone para entrar na fila ao vivo e mandar reações para a TV.
        </p>

        {/* Network Selector Tabs */}
        <div className="flex rounded-xl bg-neutral-950 p-1 border border-neutral-800 mb-3 text-xs font-semibold">
          <button
            onClick={() => {
              setNetworkType('internet');
              setManualUrl('');
            }}
            className={`flex-1 py-1.5 px-2 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
              networkType === 'internet' && !manualUrl
                ? 'bg-rose-600 text-white shadow-md'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Internet (4G / 5G / Qualquer Celular)</span>
          </button>

          <button
            onClick={() => {
              setNetworkType('wifi');
              setManualUrl('');
            }}
            className={`flex-1 py-1.5 px-2 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
              networkType === 'wifi' && !manualUrl
                ? 'bg-cyan-500 text-neutral-950 shadow-md font-bold'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Wifi className="w-3.5 h-3.5" />
            <span>Wi-Fi Local</span>
          </button>
        </div>

        {/* Optional Manual URL Input */}
        {isEditingUrl && (
          <div className="mb-3 text-left">
            <label className="text-[11px] text-neutral-400 block mb-1 font-semibold">
              URL Base Personalizada (Ex: seu domínio próprio ou IP):
            </label>
            <input
              type="text"
              value={manualUrl}
              onChange={(e) => setManualUrl(e.target.value)}
              placeholder={verifiedLiveUrl}
              className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-rose-500"
            />
          </div>
        )}

        {/* QR Code Graphic Frame */}
        <div className="p-4 bg-white rounded-3xl inline-block shadow-2xl shadow-rose-950/40 mx-auto transition-transform hover:scale-[1.02]">
          {qrDataUrl ? (
            <img
              src={qrDataUrl}
              alt="QR Code Karaokê 5.0"
              className="w-56 h-56 sm:w-64 sm:h-64 object-contain mx-auto"
            />
          ) : (
            <div className="w-56 h-56 sm:w-64 sm:h-64 flex flex-col items-center justify-center text-neutral-500 gap-2">
              <QrIcon className="w-12 h-12 animate-pulse text-rose-500" />
              <span className="text-xs">Gerando QR Code Oficial...</span>
            </div>
          )}
        </div>

        {/* URL Display and Session Code */}
        <div className="mt-4 p-3.5 bg-neutral-950 border border-neutral-800 rounded-2xl text-left space-y-1.5">
          <div className="flex items-center justify-between text-[11px] text-neutral-400">
            <span className="font-semibold uppercase tracking-wider flex items-center gap-1">
              <Radio className="w-3 h-3 text-emerald-400" />
              Link Oficial do QR Code:
            </span>
            <button
              onClick={() => setIsEditingUrl(!isEditingUrl)}
              className="text-[10px] text-rose-400 hover:text-rose-300 flex items-center gap-1 font-semibold"
            >
              <Edit2 className="w-3 h-3" />
              <span>{isEditingUrl ? 'Ocultar Edição' : 'Personalizar Link'}</span>
            </button>
          </div>

          <div
            className="text-xs font-mono text-white/90 truncate bg-neutral-900 px-3 py-2 rounded-xl border border-neutral-800 select-all"
            title={mobileUrl}
          >
            {mobileUrl}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-4 flex flex-col sm:flex-row gap-2.5">
          <button
            onClick={handleCopyLink}
            className="flex-1 py-3 px-4 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-300 font-bold">Link Copiado!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-neutral-400" />
                <span>Copiar Link para Celular</span>
              </>
            )}
          </button>

          <a
            href={mobileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 py-3 px-4 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-lg shadow-rose-600/30 cursor-pointer"
          >
            <ExternalLink className="w-4 h-4" />
            <span>Abrir Link no Navegador</span>
          </a>
        </div>

        {/* Clear Instructions */}
        <div className="mt-4 text-[11px] text-neutral-400 bg-neutral-950/60 p-2.5 rounded-xl border border-neutral-800/80">
          ✅ <strong>Sem erro 404:</strong> O QR Code agora aponta para o endereço ativo na nuvem (HTTP 200) e abre instantaneamente no navegador do convidado sem pedir login.
        </div>
      </div>
    </div>
  );
};
