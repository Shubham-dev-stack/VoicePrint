/**
 * Audio synthesis engine for Voiceprint.
 * 
 * Supports both:
 * 1. Real Fish Audio API MP3 streaming playback via HTML5 Audio
 * 2. Browser SpeechSynthesis & Web Audio fallback for demo preview
 */

export interface SynthesizerOptions {
  text: string;
  language: 'en' | 'hi' | 'hinglish';
  voiceId: string;
  audioUrl?: string; // When provided, plays real MP3 audio from Fish Audio
  rate?: number;
  pitch?: number;
  onProgress?: (progress: number, currentTime: number, duration: number) => void;
  onStart?: (duration: number) => void;
  onEnd?: () => void;
  onError?: (err: unknown) => void;
}

class AudioEngine {
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private currentAudioElement: HTMLAudioElement | null = null;
  private audioCtx: AudioContext | null = null;
  private progressInterval: number | null = null;
  private isCurrentlyPlaying = false;
  private playbackStartTime = 0;
  private estimatedDuration = 4;
  private elapsedBeforePause = 0;
  private isPaused = false;
  private hasSpoken = false;

  constructor() {
    // Pre-warm speech synthesis voices if available
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.getVoices();
      window.speechSynthesis.onvoiceschanged = () => {
        window.speechSynthesis.getVoices();
      };
    }
  }

  private calculateDuration(text: string, rate: number = 1): number {
    const words = text.trim().split(/\s+/).filter(Boolean).length;
    const baseDuration = Math.max(2.0, (words / 2.25) / rate);
    return Math.min(90, Number(baseDuration.toFixed(1)));
  }

  public play(options: SynthesizerOptions): void {
    this.stop();

    const { text, language, audioUrl, rate = 1.0, pitch = 1.0, onProgress, onStart, onEnd, onError } = options;
    this.elapsedBeforePause = 0;
    this.isPaused = false;
    this.isCurrentlyPlaying = true;
    this.hasSpoken = false;

    // 1. Play Real MP3 Audio from Fish Audio if URL provided
    if (audioUrl) {
      try {
        const audio = new Audio(audioUrl);
        this.currentAudioElement = audio;
        audio.playbackRate = Math.max(0.5, Math.min(2.0, rate));

        audio.onloadedmetadata = () => {
          const dur = audio.duration || this.calculateDuration(text, rate);
          this.estimatedDuration = dur;
          if (onStart) onStart(dur);
        };

        audio.ontimeupdate = () => {
          if (!this.isCurrentlyPlaying || this.isPaused) return;
          const current = audio.currentTime;
          const dur = audio.duration || this.estimatedDuration || 1;
          const prog = Math.min(1, current / dur);
          if (onProgress) {
            onProgress(prog, current, dur);
          }
        };

        audio.onended = () => {
          this.cleanup();
          if (onEnd) onEnd();
        };

        audio.onerror = (e) => {
          console.warn('[AudioEngine] Real audio playback error, falling back to speech synthesis:', e);
          this.cleanup();
          if (onError) onError(e);
          // Fallback to speech synthesis if real audio fails
          this.playSpeechSynthesis(text, language, rate, pitch, onProgress, onStart, onEnd);
        };

        audio.play().catch((err) => {
          console.warn('[AudioEngine] Playback promise rejected (autoplay policy):', err);
          if (onError) onError(err);
        });

        return;
      } catch (err) {
        console.warn('[AudioEngine] Failed to initialize HTMLAudioElement:', err);
      }
    }

    // 2. Fallback to Browser Speech Synthesis (Demo Engine)
    this.playSpeechSynthesis(text, language, rate, pitch, onProgress, onStart, onEnd);
  }

  private playSpeechSynthesis(
    text: string,
    language: 'en' | 'hi' | 'hinglish',
    rate: number,
    pitch: number,
    onProgress?: (progress: number, currentTime: number, duration: number) => void,
    onStart?: (duration: number) => void,
    onEnd?: () => void
  ) {
    this.estimatedDuration = this.calculateDuration(text, rate);
    this.playbackStartTime = performance.now();

    if (onStart) onStart(this.estimatedDuration);

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
        if (window.speechSynthesis.paused) {
          window.speechSynthesis.resume();
        }

        const utterance = new SpeechSynthesisUtterance(text);
        this.currentUtterance = utterance;
        
        utterance.rate = Math.max(0.6, Math.min(1.8, rate));
        utterance.pitch = Math.max(0.6, Math.min(1.4, pitch));

        const voices = window.speechSynthesis.getVoices();
        if (voices.length > 0) {
          if (language === 'hi') {
            const hiVoice = voices.find(v => v.lang.startsWith('hi') || v.name.toLowerCase().includes('hindi'));
            if (hiVoice) utterance.voice = hiVoice;
          } else if (language === 'hinglish') {
            const inVoice = voices.find(v => v.lang.includes('IN') || v.name.toLowerCase().includes('india'));
            if (inVoice) {
              utterance.voice = inVoice;
            } else {
              const enVoice = voices.find(v => v.lang.startsWith('en'));
              if (enVoice) utterance.voice = enVoice;
            }
          } else {
            const enVoice = voices.find(v => v.lang.startsWith('en'));
            if (enVoice) utterance.voice = enVoice;
          }
        }

        utterance.onstart = () => {
          this.hasSpoken = true;
        };

        utterance.onend = () => {
          this.cleanup();
          if (onEnd) onEnd();
        };

        utterance.onerror = (e) => {
          console.warn('SpeechSynthesis error:', e);
          if (!this.hasSpoken) {
            this.playFallbackTones(this.estimatedDuration, onProgress, onEnd);
          } else {
            this.cleanup();
            if (onEnd) onEnd();
          }
        };

        (window as unknown as { __voiceprint_active_utterance?: SpeechSynthesisUtterance }).__voiceprint_active_utterance = utterance;

        window.speechSynthesis.speak(utterance);

        this.progressInterval = window.setInterval(() => {
          if (!this.isCurrentlyPlaying || this.isPaused) return;
          const elapsed = (performance.now() - this.playbackStartTime) / 1000 + this.elapsedBeforePause;
          const progress = Math.min(1, elapsed / this.estimatedDuration);
          
          if (onProgress) {
            onProgress(progress, Math.min(elapsed, this.estimatedDuration), this.estimatedDuration);
          }

          if (elapsed >= this.estimatedDuration && !window.speechSynthesis.speaking) {
            this.cleanup();
            if (onEnd) onEnd();
          }
        }, 100);

        return;
      } catch (err) {
        console.warn('SpeechSynthesis error, falling back to tones:', err);
      }
    }

    this.playFallbackTones(this.estimatedDuration, onProgress, onEnd);
  }

  private playFallbackTones(
    duration: number,
    onProgress?: (progress: number, currentTime: number, duration: number) => void,
    onEnd?: () => void
  ) {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.audioCtx = new AudioCtx();
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(260, this.audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(380, this.audioCtx.currentTime + 0.3);
        osc.frequency.exponentialRampToValueAtTime(310, this.audioCtx.currentTime + duration);

        gain.gain.setValueAtTime(0.001, this.audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.04, this.audioCtx.currentTime + 0.1);
        gain.gain.exponentialRampToValueAtTime(0.0001, this.audioCtx.currentTime + duration);

        osc.connect(gain);
        gain.connect(this.audioCtx.destination);
        osc.start();
        osc.stop(this.audioCtx.currentTime + duration);
      }
    } catch (e) {
      console.warn('Web Audio fallback error:', e);
    }

    this.progressInterval = window.setInterval(() => {
      if (!this.isCurrentlyPlaying || this.isPaused) return;
      const elapsed = (performance.now() - this.playbackStartTime) / 1000 + this.elapsedBeforePause;
      const progress = Math.min(1, elapsed / duration);
      if (onProgress) {
        onProgress(progress, Math.min(elapsed, duration), duration);
      }
      if (elapsed >= duration) {
        this.cleanup();
        if (onEnd) onEnd();
      }
    }, 100);
  }

  public pause(): void {
    if (!this.isCurrentlyPlaying || this.isPaused) return;
    this.isPaused = true;

    if (this.currentAudioElement) {
      this.currentAudioElement.pause();
    } else if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.pause();
    }

    const currentElapsed = (performance.now() - this.playbackStartTime) / 1000;
    this.elapsedBeforePause += currentElapsed;
  }

  public resume(): void {
    if (!this.isCurrentlyPlaying || !this.isPaused) return;
    this.isPaused = false;
    this.playbackStartTime = performance.now();

    if (this.currentAudioElement) {
      this.currentAudioElement.play().catch(e => console.warn('Resume error:', e));
    } else if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.resume();
    }
  }

  public seek(pct: number): void {
    if (this.currentAudioElement && this.currentAudioElement.duration) {
      this.currentAudioElement.currentTime = pct * this.currentAudioElement.duration;
    }
  }

  public setPlaybackRate(rate: number): void {
    if (this.currentAudioElement) {
      this.currentAudioElement.playbackRate = Math.max(0.5, Math.min(2.0, rate));
    }
  }

  public stop(): void {
    this.isCurrentlyPlaying = false;
    this.isPaused = false;
    this.elapsedBeforePause = 0;
    this.cleanup();

    if (this.currentAudioElement) {
      try {
        this.currentAudioElement.pause();
        this.currentAudioElement.currentTime = 0;
      } catch {
        // ignore
      }
      this.currentAudioElement = null;
    }

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }

    if (this.audioCtx) {
      try {
        this.audioCtx.close();
      } catch {
        // ignore
      }
      this.audioCtx = null;
    }
  }

  private cleanup(): void {
    this.isCurrentlyPlaying = false;
    if (this.progressInterval !== null) {
      clearInterval(this.progressInterval);
      this.progressInterval = null;
    }
    this.currentUtterance = null;
    if (typeof window !== 'undefined') {
      delete (window as unknown as { __voiceprint_active_utterance?: SpeechSynthesisUtterance }).__voiceprint_active_utterance;
    }
  }

  public isPlaying(): boolean {
    return this.isCurrentlyPlaying && !this.isPaused;
  }

  public isPausedState(): boolean {
    return this.isCurrentlyPlaying && this.isPaused;
  }

  public getDuration(text: string, rate: number = 1): number {
    if (this.currentAudioElement && this.currentAudioElement.duration) {
      return this.currentAudioElement.duration;
    }
    return this.calculateDuration(text, rate);
  }
}

export const demoAudioService = new AudioEngine();
export const audioEngine = demoAudioService;
