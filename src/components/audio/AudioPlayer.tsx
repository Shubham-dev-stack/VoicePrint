import React from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  Copy, 
  Check, 
  Info, 
  CheckCircle2, 
  Download
} from 'lucide-react';
import { AudioVisualizer } from './AudioVisualizer';
import { Voice, Language, EmotionType, EmotionIntensity } from '../../types';
import { EMOTION_OPTIONS } from '../../data/mockData';
import { audioEngine } from '../../services/audioService';

interface AudioPlayerProps {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  progress: number;
  playbackRate: number;
  currentText: string;
  voice: Voice;
  language: Language;
  audioUrl?: string;
  isFishAudio?: boolean;
  fishAudioModel?: string;
  emotion?: EmotionType;
  intensity?: EmotionIntensity;
  onPlayPause: () => void;
  onRestart: () => void;
  onSpeedChange: (speed: number) => void;
  onSeek?: (fraction: number) => void;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({
  isPlaying,
  currentTime,
  duration,
  progress,
  playbackRate,
  currentText,
  voice,
  language,
  audioUrl,
  isFishAudio = false,
  fishAudioModel = 's2.1-pro-free',
  emotion = 'happy',
  intensity = 'balanced',
  onPlayPause,
  onRestart,
  onSpeedChange,
  onSeek
}) => {
  const [copied, setCopied] = React.useState(false);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleCopy = () => {
    if (!currentText) return;
    navigator.clipboard.writeText(currentText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!audioUrl) return;
    const cleanVoice = voice.name.toLowerCase().replace(/[^a-z0-9]/g, '-');
    audioEngine.downloadAudio(audioUrl, `voiceprint-${cleanVoice}-${emotion}.mp3`);
  };

  const getLanguageLabel = (lang: Language) => {
    switch (lang) {
      case 'hi': return 'Hindi (हिंदी)';
      case 'hinglish': return 'Hinglish';
      default: return 'English';
    }
  };

  const emotionObj = EMOTION_OPTIONS.find((e) => e.id === emotion) || EMOTION_OPTIONS[0];
  const speedOptions = [0.8, 1.0, 1.25, 1.5];

  return (
    <div className="bg-white rounded-3xl border border-surface-border shadow-card p-5 sm:p-7 relative overflow-hidden transition-all duration-300">
      {/* Subtle background glow */}
      <div className={`absolute -top-12 -right-12 w-48 h-48 rounded-full blur-3xl pointer-events-none ${
        isFishAudio ? 'bg-emerald-100/60' : 'bg-brand-100/60'
      }`} />

      {/* Header Info */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-2xl bg-gradient-to-tr ${voice.color} flex items-center justify-center text-xl shadow-sm text-white flex-shrink-0`}>
            {voice.avatar}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-navy-900 text-base">{voice.name}</h3>
              <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-brand-50 text-brand-700 border border-brand-200">
                {getLanguageLabel(language)}
              </span>
            </div>
            <p className="text-xs text-navy-500">{voice.tone} • {voice.accent}</p>
          </div>
        </div>

        {/* Emotion & Engine Status Badges */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Active Emotion Badge */}
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface-warm border border-surface-border text-xs font-semibold text-navy-800 shadow-2xs">
            <span>{emotionObj.emoji}</span>
            <span>{emotionObj.label}</span>
            <span className="text-[10px] uppercase font-bold text-brand-600 bg-brand-50 px-1.5 py-0.2 rounded">
              {intensity}
            </span>
          </div>

          {/* Engine Status Badge */}
          {isFishAudio ? (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-300 text-xs font-bold shadow-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>⚡ Real Fish Audio AI</span>
            </div>
          ) : (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50/90 text-amber-800 border border-amber-200 text-xs font-medium shadow-xs">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              <span>Browser Speech Demo</span>
            </div>
          )}
        </div>
      </div>

      {/* Current Spoken Message Snippet */}
      {currentText ? (
        <div className="bg-surface-warm rounded-2xl p-3.5 mb-5 border border-surface-border/60">
          <div className="flex items-start justify-between gap-3">
            <p className="text-sm font-medium text-navy-800 line-clamp-2 leading-relaxed">
              &ldquo;{currentText}&rdquo;
            </p>
            <button
              onClick={handleCopy}
              className="text-navy-400 hover:text-navy-700 p-1 rounded-lg transition-colors flex-shrink-0"
              title="Copy message text"
              aria-label="Copy message text"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-surface-warm rounded-2xl p-4 mb-5 border border-dashed border-surface-border text-center">
          <p className="text-sm text-navy-500">
            Type a message above or pick a quick phrase, then click <strong className="text-brand-700">Generate Voice</strong>.
          </p>
        </div>
      )}

      {/* Animated Waveform Visualizer */}
      <div className="bg-navy-50/60 rounded-2xl p-3 mb-4 border border-navy-100">
        <AudioVisualizer
          isPlaying={isPlaying}
          progress={progress}
          onBarClick={(pct) => onSeek && onSeek(pct)}
        />
        
        {/* Scrubber track */}
        <div className="mt-2 flex items-center gap-3">
          <span className="text-xs font-mono text-navy-500 min-w-[36px]">
            {formatTime(currentTime)}
          </span>
          <div 
            className="flex-1 h-2 bg-navy-200 rounded-full overflow-hidden cursor-pointer relative"
            onClick={(e) => {
              if (!onSeek) return;
              const rect = e.currentTarget.getBoundingClientRect();
              const pct = (e.clientX - rect.left) / rect.width;
              onSeek(Math.max(0, Math.min(1, pct)));
            }}
          >
            <div 
              className={`h-full rounded-full transition-all duration-100 ${
                isFishAudio ? 'bg-emerald-600' : 'bg-brand-600'
              }`}
              style={{ width: `${Math.round(progress * 100)}%` }}
            />
          </div>
          <span className="text-xs font-mono text-navy-500 min-w-[36px] text-right">
            {formatTime(duration || 4)}
          </span>
        </div>
      </div>

      {/* Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
        {/* Play / Restart / Download Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={onPlayPause}
            disabled={!currentText}
            aria-label={isPlaying ? 'Pause preview' : 'Play preview'}
            className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-200 shadow-sm ${
              !currentText
                ? 'bg-navy-100 text-navy-400 cursor-not-allowed'
                : isPlaying
                ? 'bg-brand-600 text-white shadow-glow hover:bg-brand-700'
                : 'bg-navy-900 text-white hover:bg-brand-600 hover:shadow-card-hover'
            }`}
          >
            {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
          </button>

          <button
            onClick={onRestart}
            disabled={!currentText}
            aria-label="Restart audio playback"
            className="w-10 h-10 rounded-xl border border-navy-200 flex items-center justify-center text-navy-600 hover:text-navy-900 hover:bg-navy-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            title="Restart playback"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Download MP3 Button (Real Fish Audio streams) */}
          {audioUrl && (
            <button
              onClick={handleDownload}
              className="h-10 px-3 rounded-xl border border-brand-200 bg-brand-50 hover:bg-brand-100 text-brand-700 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs"
              title="Download generated MP3 file"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download MP3</span>
            </button>
          )}

          <div className="hidden sm:flex items-center gap-1.5 ml-2 text-xs text-navy-500">
            <Volume2 className="w-4 h-4 text-brand-600" />
            <span>{isFishAudio ? 'MP3 • 44.1 kHz' : 'Browser WebSpeech'}</span>
          </div>
        </div>

        {/* Speed selectors */}
        <div className="flex items-center gap-1 bg-navy-50 p-1 rounded-xl border border-navy-200">
          <span className="text-[11px] font-semibold text-navy-400 px-1.5 uppercase">Speed</span>
          {speedOptions.map((speed) => (
            <button
              key={speed}
              onClick={() => onSpeedChange(speed)}
              className={`px-2 py-1 rounded-lg text-xs font-medium transition-all ${
                playbackRate === speed
                  ? 'bg-white text-brand-700 shadow-sm font-semibold'
                  : 'text-navy-600 hover:text-navy-900'
              }`}
            >
              {speed}x
            </button>
          ))}
        </div>
      </div>

      {/* Engine Status Notification Box */}
      {isFishAudio ? (
        <div className="mt-5 p-3.5 rounded-2xl bg-emerald-50/80 border border-emerald-200 flex items-start gap-2.5 text-xs text-navy-700">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-emerald-900">Fish Audio Emotion Synthesis Active: </span>
            <span>
              Generated in real-time by official <strong>Fish Audio API</strong> (Model: <code className="font-mono font-semibold text-emerald-800">{fishAudioModel}</code>) with natural <strong className="text-emerald-950 font-semibold">{emotionObj.label}</strong> ({intensity}) emotional modulation.
            </span>
          </div>
        </div>
      ) : (
        <div className="mt-5 p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200 flex items-start gap-2.5 text-xs text-navy-700">
          <Info className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-amber-900">Browser Audio Preview: </span>
            <span>
              Rendered using local browser speech synthesis with emotional pitch/cadence emulation. Connect your Fish Audio API key in Settings to stream authentic neural voices.
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
