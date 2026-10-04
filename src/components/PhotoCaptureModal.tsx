import React, { useRef, useState, useEffect } from 'react';
import { X, Camera, Download, Sparkles, RefreshCw, AlertCircle } from 'lucide-react';

interface PhotoCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  singerName: string;
  songTitle: string;
  score: number;
  eventName: string;
  onPhotoSaved?: (dataUrl: string) => void;
}

export const PhotoCaptureModal: React.FC<PhotoCaptureModalProps> = ({
  isOpen,
  onClose,
  singerName,
  songTitle,
  score,
  eventName,
  onPhotoSaved
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedPhotoUrl, setCapturedPhotoUrl] = useState<string | null>(null);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setCapturedPhotoUrl(null);
      setCameraError(null);
      startCamera();
    } else {
      stopCamera();
    }
    return () => {
      stopCamera();
    };
  }, [isOpen]);

  const startCamera = async () => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Câmera não suportada neste navegador.');
      }
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { width: 1280, height: 720 },
        audio: false
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.play();
      }
    } catch (err: any) {
      console.warn('Camera access issue:', err);
      setCameraError('Câmera indisponível ou permissão não concedida. Usando moldura ilustrativa.');
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  };

  const triggerCountdownAndCapture = () => {
    setCountdown(3);
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(interval);
          takeSnapshot();
          return null;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const takeSnapshot = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 800;
    canvas.height = 600;

    // Draw background/photo
    if (video && stream && video.videoWidth > 0) {
      ctx.drawImage(video, 0, 0, 800, 600);
    } else {
      // Fallback stage gradient
      const grad = ctx.createLinearGradient(0, 0, 800, 600);
      grad.addColorStop(0, '#090d16');
      grad.addColorStop(0.5, '#1e1b4b');
      grad.addColorStop(1, '#020617');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 800, 600);

      ctx.fillStyle = 'rgba(6, 182, 212, 0.15)';
      ctx.beginPath();
      ctx.arc(400, 260, 160, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 36px Syne, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('🎤 ' + singerName.toUpperCase(), 400, 260);
    }

    // Modern commemorative frame border
    ctx.lineWidth = 12;
    ctx.strokeStyle = '#06b6d4';
    ctx.strokeRect(6, 6, 788, 588);

    // Inner dark translucent banner overlay
    ctx.fillStyle = 'rgba(15, 23, 42, 0.88)';
    ctx.fillRect(0, 460, 800, 140);

    // Header top badge
    ctx.fillStyle = '#06b6d4';
    ctx.fillRect(0, 0, 800, 48);

    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 20px Syne, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('✨ MOMENTO DO SHOW! · KARAOKÊ 5.0 ✨', 400, 32);

    // Bottom banner text
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 28px Syne, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(singerName, 30, 508);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '16px Plus Jakarta Sans, sans-serif';
    ctx.fillText(`Música: ${songTitle} · ${eventName}`, 30, 538);

    const dateStr = new Date().toLocaleDateString('pt-BR');
    ctx.fillStyle = '#64748b';
    ctx.font = '13px Plus Jakarta Sans, sans-serif';
    ctx.fillText(`Data: ${dateStr}`, 30, 565);

    // Big score badge on right
    ctx.fillStyle = '#d946ef';
    ctx.beginPath();
    ctx.arc(710, 530, 46, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 32px JetBrains Mono, monospace';
    ctx.textAlign = 'center';
    ctx.fillText(score.toString(), 710, 536);

    ctx.font = '10px Plus Jakarta Sans, sans-serif';
    ctx.fillText('NOTA FINAL', 710, 558);

    const dataUrl = canvas.toDataURL('image/png');
    setCapturedPhotoUrl(dataUrl);
    if (onPhotoSaved) {
      onPhotoSaved(dataUrl);
    }
  };

  const handleDownload = () => {
    if (!capturedPhotoUrl) return;
    const a = document.createElement('a');
    a.href = capturedPhotoUrl;
    a.download = `karaoke50_${singerName.replace(/\s+/g, '_')}_${Date.now()}.png`;
    a.click();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-xl bg-neutral-900 border border-neutral-800 rounded-2xl p-6 sm:p-8 shadow-2xl relative text-center">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-neutral-400 hover:text-white p-1 rounded-lg"
          aria-label="Fechar"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="inline-flex items-center gap-2 text-fuchsia-400 text-xs font-bold uppercase tracking-wider mb-2">
          <Camera className="w-4 h-4" />
          <span>Registro da Noite</span>
        </div>

        <h2 className="text-2xl font-bold font-display text-white">
          MOMENTO DO SHOW!
        </h2>
        <p className="text-xs text-neutral-400 mt-1 mb-4">
          Foto comemorativa com nome do cantor, música e nota alcançada.
        </p>

        {cameraError && !capturedPhotoUrl && (
          <div className="mb-3 p-2.5 rounded-lg bg-amber-950/40 border border-amber-800/60 text-xs text-amber-300 flex items-center gap-2 text-left">
            <AlertCircle className="w-4 h-4 shrink-0 text-amber-400" />
            <span>{cameraError}</span>
          </div>
        )}

        <div className="relative rounded-xl overflow-hidden bg-neutral-950 border border-neutral-800 aspect-4/3 max-w-md mx-auto flex items-center justify-center">
          {capturedPhotoUrl ? (
            <img
              src={capturedPhotoUrl}
              alt="Foto do cantor"
              className="w-full h-full object-contain"
            />
          ) : (
            <>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
              {countdown !== null && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/60 z-20">
                  <div className="text-7xl font-extrabold text-cyan-400 animate-ping font-display">
                    {countdown}
                  </div>
                </div>
              )}
            </>
          )}

          <canvas ref={canvasRef} className="hidden" />
        </div>

        {/* Singer and score details */}
        <div className="mt-4 p-3 bg-neutral-950 border border-neutral-800 rounded-xl flex items-center justify-between text-xs">
          <div className="text-left">
            <div className="text-white font-bold text-sm">{singerName}</div>
            <div className="text-neutral-400">{songTitle}</div>
          </div>
          <div className="text-right">
            <div className="text-[10px] text-neutral-400">PONTUAÇÃO</div>
            <div className="text-lg font-mono font-bold text-fuchsia-400">{score} pts</div>
          </div>
        </div>

        <div className="mt-4 flex gap-3">
          {capturedPhotoUrl ? (
            <>
              <button
                onClick={() => {
                  setCapturedPhotoUrl(null);
                  startCamera();
                }}
                className="flex-1 py-2.5 px-3 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-medium text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <RefreshCw className="w-4 h-4 text-neutral-400" />
                <span>Tirar Outra</span>
              </button>

              <button
                onClick={handleDownload}
                className="flex-1 py-2.5 px-3 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-neutral-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md shadow-cyan-500/20"
              >
                <Download className="w-4 h-4" />
                <span>Salvar Foto (PNG)</span>
              </button>
            </>
          ) : (
            <button
              onClick={triggerCountdownAndCapture}
              className="w-full py-3 px-4 bg-fuchsia-500 hover:bg-fuchsia-400 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow-md shadow-fuchsia-500/25"
            >
              <Camera className="w-4 h-4" />
              <span>CAPTURAR FOTO DO CANTOR (3s)</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
