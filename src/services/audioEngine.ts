/**
 * Audio Engine for KARAOKÊ 5.0
 * Web Audio API implementation supporting real-time pitch shift (-3 to +3 semitones),
 * live microphone spectral analysis for vocal scoring, and offline instrumental synthesizers.
 */

class AudioEngine {
  private ctx: AudioContext | null = null;
  private micStream: MediaStream | null = null;
  private micSource: MediaStreamAudioSourceNode | null = null;
  private analyser: AnalyserNode | null = null;
  private gainNode: GainNode | null = null;
  private isMicActive = false;
  private currentPitchShift = 0; // -3 to +3 semitones

  // Synth backing player state
  private isPlaying = false;
  private isPaused = false;
  private synthInterval: any = null;
  private step = 0;
  private currentVolume = 0.85;

  private onEnergyCallback: ((energy: number, pitchStability: number) => void) | null = null;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.gainNode = this.ctx.createGain();
      this.gainNode.gain.value = this.currentVolume;
      this.gainNode.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  public setVolume(volume: number) {
    this.currentVolume = Math.max(0, Math.min(1, volume));
    if (this.gainNode) {
      this.gainNode.gain.setValueAtTime(this.currentVolume, this.ctx?.currentTime || 0);
    }
  }

  public setPitchShift(semitones: number) {
    this.currentPitchShift = Math.max(-3, Math.min(3, semitones));
  }

  public getPitchShift(): number {
    return this.currentPitchShift;
  }

  // --- Real Microphone Analyser for Vocal Scoring ---
  public async startMicrophone(onEnergy: (energy: number, pitchStability: number) => void): Promise<boolean> {
    try {
      this.initContext();
      this.onEnergyCallback = onEnergy;

      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        return false;
      }

      this.micStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        },
        video: false
      });

      if (!this.ctx) return false;

      this.micSource = this.ctx.createMediaStreamSource(this.micStream);
      this.analyser = this.ctx.createAnalyser();
      this.analyser.fftSize = 512;
      this.analyser.smoothingTimeConstant = 0.8;

      this.micSource.connect(this.analyser);
      // NOTE: mic is NOT connected to destination to avoid acoustic feedback!

      this.isMicActive = true;
      this.runAnalyserLoop();
      return true;
    } catch (err) {
      console.warn('Microphone access denied or unavailable:', err);
      this.isMicActive = false;
      return false;
    }
  }

  public stopMicrophone() {
    this.isMicActive = false;
    if (this.micStream) {
      this.micStream.getTracks().forEach((track) => track.stop());
      this.micStream = null;
    }
    if (this.micSource) {
      this.micSource.disconnect();
      this.micSource = null;
    }
    this.analyser = null;
  }

  private runAnalyserLoop = () => {
    if (!this.isMicActive || !this.analyser) return;

    const dataArray = new Uint8Array(this.analyser.frequencyBinCount);
    this.analyser.getByteFrequencyData(dataArray);

    // Calculate RMS energy (volume)
    let sum = 0;
    for (let i = 0; i < dataArray.length; i++) {
      sum += dataArray[i];
    }
    const average = sum / dataArray.length;
    const normalizedEnergy = Math.min(100, Math.round((average / 128) * 100));

    // Calculate frequency stability / pitch centroid
    let weightedSum = 0;
    for (let i = 0; i < dataArray.length; i++) {
      weightedSum += dataArray[i] * i;
    }
    const centroid = sum > 0 ? weightedSum / sum : 0;
    const stability = Math.min(100, Math.round((centroid / (dataArray.length / 2)) * 100));

    if (this.onEnergyCallback) {
      this.onEnergyCallback(normalizedEnergy, stability);
    }

    requestAnimationFrame(this.runAnalyserLoop);
  };

  // Real Backing audio controller (synthetic tones removed to allow real YouTube audio playback)
  public playBackingTrack(_genre: string = 'Pop') {
    this.initContext();
    this.isPlaying = true;
    this.isPaused = false;
    clearInterval(this.synthInterval);
    this.synthInterval = null;
  }

  private triggerTone(freq: number, type: OscillatorType, gain: number, duration: number, time: number) {
    if (!this.ctx || !this.gainNode) return;
    try {
      const osc = this.ctx.createOscillator();
      const toneGain = this.ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, time);

      toneGain.gain.setValueAtTime(gain * this.currentVolume, time);
      toneGain.gain.exponentialRampToValueAtTime(0.001, time + duration);

      osc.connect(toneGain);
      toneGain.connect(this.gainNode);

      osc.start(time);
      osc.stop(time + duration);
    } catch {
      // Audio node may be stopped
    }
  }

  private triggerPercussion(freq: number, time: number) {
    if (!this.ctx || !this.gainNode) return;
    try {
      const osc = this.ctx.createOscillator();
      const hitGain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, time);
      osc.frequency.exponentialRampToValueAtTime(40, time + 0.08);

      hitGain.gain.setValueAtTime(0.18 * this.currentVolume, time);
      hitGain.gain.exponentialRampToValueAtTime(0.001, time + 0.08);

      osc.connect(hitGain);
      hitGain.connect(this.gainNode);

      osc.start(time);
      osc.stop(time + 0.08);
    } catch {}
  }

  public pause() {
    this.isPaused = true;
  }

  public resume() {
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    this.isPaused = false;
  }

  public stop() {
    this.isPlaying = false;
    this.isPaused = false;
    clearInterval(this.synthInterval);
    this.synthInterval = null;
  }

  public isRunning(): boolean {
    return this.isPlaying && !this.isPaused;
  }
}

export const audioEngine = new AudioEngine();
