import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  Play, 
  Pause, 
  Download, 
  AlertCircle, 
  SlidersHorizontal,
  CheckCircle2,
  Volume2
} from 'lucide-react';
import { Voice, EmotionType, EmotionIntensity, VoiceComparisonItem } from '../../types';
import { EMOTION_OPTIONS } from '../../data/mockData';
import { fishAudioService } from '../../services/fishAudioService';
import { audioEngine } from '../../services/audioService';

interface VoiceComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  messageText: string;
  availableVoices: Voice[];
  initialVoiceA?: Voice;
  initialEmotionA?: EmotionType;
  initialIntensityA?: EmotionIntensity;
  isFishAudioConfigured: boolean;
  fishAudioModel?: string;
}

export const VoiceComparisonModal: React.FC<VoiceComparisonModalProps> = ({
  isOpen,
  onClose,
  messageText,
  availableVoices,
  initialVoiceA,
  initialEmotionA = 'happy',
  initialIntensityA = 'balanced',
  isFishAudioConfigured,
  fishAudioModel = 's2.1-pro-free'
}) => {
  const defaultVoiceA = initialVoiceA || availableVoices[0];

  // Option A configuration
  const [voiceA, setVoiceA] = useState<Voice>(defaultVoiceA);
  const [emotionA, setEmotionA] = useState<EmotionType>(initialEmotionA);
  const [intensityA, setIntensityA] = useState<EmotionIntensity>(initialIntensityA);

  // Option B configuration (defaults to alternate voice)
  const [voiceB, setVoiceB] = useState<Voice>(() => {
    return availableVoices.find((v) => v.id !== defaultVoiceA?.id) || availableVoices[1] || defaultVoiceA;
  });
  const [emotionB, setEmotionB] = useState<EmotionType>('excited');
  const [intensityB, setIntensityB] = useState<EmotionIntensity>('expressive');

  // Results state
  const [resultA, setResultA] = useState<VoiceComparisonItem | null>(null);
  const [resultB, setResultB] = useState<VoiceComparisonItem | null>(null);
  const [isGeneratingA, setIsGeneratingA] = useState(false);
  const [isGeneratingB, setIsGeneratingB] = useState(false);

  // Active playing item ID
  const [activePlayingId, setActivePlayingId] = useState<'A' | 'B' | null>(null);

  if (!isOpen) return null;

  const handleSynthesizeOption = async (option: 'A' | 'B') => {
    const isA = option === 'A';
    const targetVoice = isA ? voiceA : voiceB;
    const targetEmotion = isA ? emotionA : emotionB;
    const targetIntensity = isA ? intensityA : intensityB;

    if (isA) setIsGeneratingA(true);
    else setIsGeneratingB(true);

    try {
      const res = await fishAudioService.synthesizeSpeech({
        text: messageText,
        referenceId: targetVoice.fishAudioReferenceId,
        emotion: targetEmotion,
        intensity: targetIntensity
      });

      const newItem: VoiceComparisonItem = {
        id: `comp-${option}-${Date.now()}`,
        label: `Option ${option}`,
        voiceId: targetVoice.id,
        voiceName: targetVoice.name,
        emotion: targetEmotion,
        intensity: targetIntensity,
        audioUrl: res.audioUrl,
        isFishAudio: res.success,
        modelUsed: res.model || fishAudioModel,
        error: res.success ? undefined : (res.error || 'Synthesis error')
      };

      if (isA) {
        setResultA(newItem);
        setIsGeneratingA(false);
      } else {
        setResultB(newItem);
        setIsGeneratingB(false);
      }
    } catch (err) {
      const errItem: VoiceComparisonItem = {
        id: `comp-${option}-${Date.now()}`,
        label: `Option ${option}`,
        voiceId: targetVoice.id,
        voiceName: targetVoice.name,
        emotion: targetEmotion,
        intensity: targetIntensity,
        isFishAudio: false,
        error: err instanceof Error ? err.message : 'Failed to reach audio service'
      };

      if (isA) {
        setResultA(errItem);
        setIsGeneratingA(false);
      } else {
        setResultB(errItem);
        setIsGeneratingB(false);
      }
    }
  };

  const handleGenerateBoth = async () => {
    handleSynthesizeOption('A');
    handleSynthesizeOption('B');
  };

  const handlePlayAudio = (option: 'A' | 'B') => {
    const item = option === 'A' ? resultA : resultB;
    if (!item) return;

    if (activePlayingId === option) {
      audioEngine.stop();
      setActivePlayingId(null);
      return;
    }

    setActivePlayingId(option);
    const targetVoice = availableVoices.find((v) => v.id === item.voiceId) || voiceA;

    audioEngine.play({
      text: messageText,
      language: targetVoice.language === 'multilingual' ? 'en' : targetVoice.language,
      voiceId: targetVoice.id,
      audioUrl: item.audioUrl,
      emotion: item.emotion,
      intensity: item.intensity,
      onEnd: () => setActivePlayingId(null),
      onError: () => setActivePlayingId(null)
    });
  };

  return (
    <div className="fixed inset-0 bg-navy-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="bg-white rounded-3xl border border-surface-border shadow-2xl w-full max-w-4xl p-5 sm:p-7 relative my-8">
        {/* Close Button */}
        <button
          onClick={() => {
            audioEngine.stop();
            onClose();
          }}
          className="absolute top-5 right-5 p-2 rounded-xl text-navy-400 hover:text-navy-700 hover:bg-surface-warm transition-colors"
          aria-label="Close Comparison Studio"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-700 flex items-center justify-center text-white shadow-sm">
            <SlidersHorizontal className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl sm:text-2xl font-extrabold text-navy-900 tracking-tight">
              A/B Voice Comparison Studio
            </h3>
            <p className="text-xs text-navy-500">
              Benchmark two vocal personas or emotional inflections for the exact same message
            </p>
          </div>
        </div>

        {/* Credit & API notice */}
        <div className={`p-3 mb-5 rounded-2xl border text-xs flex items-start gap-2.5 ${
          isFishAudioConfigured 
            ? 'bg-emerald-50/80 border-emerald-200 text-emerald-950'
            : 'bg-amber-50/80 border-amber-200 text-amber-900'
        }`}>
          <AlertCircle className={`w-4 h-4 shrink-0 mt-0.5 ${isFishAudioConfigured ? 'text-emerald-600' : 'text-amber-600'}`} />
          <div>
            <span className="font-bold">
              {isFishAudioConfigured ? 'Fish Audio Synthesis: ' : 'Comparative Demo Notice: '}
            </span>
            <span>
              {isFishAudioConfigured
                ? `Evaluating Option A and Option B sends separate requests to the Fish Audio API (Model: ${fishAudioModel}) and generates independent audio streams.`
                : 'Backend Fish Audio key not detected. Synthesis will run using local browser speech fallback.'}
            </span>
          </div>
        </div>

        {/* Source Text Preview Card */}
        <div className="bg-surface-warm rounded-2xl p-3.5 mb-6 border border-surface-border">
          <span className="text-[10px] font-bold uppercase tracking-wider text-navy-400 block mb-1">
            Test Message Payload ({messageText.length} characters)
          </span>
          <p className="text-xs sm:text-sm font-semibold text-navy-800 line-clamp-2 italic leading-relaxed">
            &ldquo;{messageText}&rdquo;
          </p>
        </div>

        {/* Comparison Grid: Option A vs Option B */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
          {/* Card A */}
          <div className="bg-white rounded-3xl border border-surface-border p-5 shadow-card flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-surface-border">
                <span className="text-xs font-bold text-brand-700 uppercase tracking-wider bg-brand-50 px-2.5 py-0.5 rounded-full border border-brand-200">
                  Version A
                </span>
                <span className="text-xs font-semibold text-navy-500">{voiceA.name}</span>
              </div>

              {/* Voice select for A */}
              <div className="space-y-3 mb-4">
                <div>
                  <label className="block text-[11px] font-semibold text-navy-600 mb-1">Select Persona</label>
                  <select
                    value={voiceA.id}
                    onChange={(e) => {
                      const v = availableVoices.find(x => x.id === e.target.value);
                      if (v) setVoiceA(v);
                    }}
                    className="w-full p-2 rounded-xl bg-surface-warm border border-surface-border text-xs text-navy-900 font-semibold focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                  >
                    {availableVoices.map((v) => (
                      <option key={v.id} value={v.id}>
                        {v.avatar} {v.name} ({v.accent})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-semibold text-navy-600 mb-1">Emotion</label>
                    <select
                      value={emotionA}
                      onChange={(e) => setEmotionA(e.target.value as EmotionType)}
                      className="w-full p-2 rounded-xl bg-surface-warm border border-surface-border text-xs text-navy-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                    >
                      {EMOTION_OPTIONS.map((em) => (
                        <option key={em.id} value={em.id}>
                          {em.emoji} {em.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-navy-600 mb-1">Intensity</label>
                    <select
                      value={intensityA}
                      onChange={(e) => setIntensityA(e.target.value as EmotionIntensity)}
                      className="w-full p-2 rounded-xl bg-surface-warm border border-surface-border text-xs text-navy-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20 capitalize"
                    >
                      <option value="subtle">Subtle</option>
                      <option value="balanced">Balanced</option>
                      <option value="expressive">Expressive</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Status / Player for A */}
              {resultA && (
                <div className="p-3 rounded-2xl bg-surface-warm border border-surface-border mb-3">
                  {resultA.isFishAudio ? (
                    <div className="flex items-center gap-1.5 text-xs text-emerald-800 font-bold mb-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Ready (Fish Audio MP3)</span>
                    </div>
                  ) : (
                    <div className="text-xs text-amber-700 font-medium mb-2">
                      {resultA.error || 'Generated via Browser Demo fallback'}
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handlePlayAudio('A')}
                      className={`h-9 px-3 rounded-xl flex items-center gap-1.5 text-xs font-bold transition-all shadow-xs ${
                        activePlayingId === 'A'
                          ? 'bg-brand-600 text-white shadow-glow'
                          : 'bg-navy-900 text-white hover:bg-brand-600'
                      }`}
                    >
                      {activePlayingId === 'A' ? (
                        <>
                          <Pause className="w-3.5 h-3.5 fill-current" />
                          <span>Pause A</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-3.5 h-3.5 fill-current" />
                          <span>Play Version A</span>
                        </>
                      )}
                    </button>

                    {resultA.audioUrl && (
                      <button
                        type="button"
                        onClick={() => audioEngine.downloadAudio(resultA.audioUrl!, `voiceprint-A-${voiceA.name}.mp3`)}
                        className="p-2 rounded-xl border border-surface-border hover:bg-white text-navy-600 hover:text-brand-600 transition-colors"
                        title="Download Version A MP3"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => handleSynthesizeOption('A')}
              disabled={isGeneratingA}
              className="w-full py-2.5 px-4 rounded-xl bg-brand-50 hover:bg-brand-100 text-brand-700 border border-brand-200 font-bold text-xs flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              {isGeneratingA ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-brand-600 border-t-transparent rounded-full animate-spin" />
                  <span>Synthesizing Option A...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-brand-600" />
                  <span>{resultA ? 'Re-generate Version A' : 'Synthesize Version A'}</span>
                </>
              )}
            </button>
          </div>

          {/* Card B */}
          <div className="bg-white rounded-3xl border border-surface-border p-5 shadow-card flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-surface-border">
                <span className="text-xs font-bold text-indigo-700 uppercase tracking-wider bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-200">
                  Version B
                </span>
                <span className="text-xs font-semibold text-navy-500">{voiceB.name}</span>
              </div>

              {/* Voice select for B */}
              <div className="space-y-3 mb-4">
                <div>
                  <label className="block text-[11px] font-semibold text-navy-600 mb-1">Select Persona</label>
                  <select
                    value={voiceB.id}
                    onChange={(e) => {
                      const v = availableVoices.find(x => x.id === e.target.value);
                      if (v) setVoiceB(v);
                    }}
                    className="w-full p-2 rounded-xl bg-surface-warm border border-surface-border text-xs text-navy-900 font-semibold focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                  >
                    {availableVoices.map((v) => (
                      <option key={v.id} value={v.id}>
                        {v.avatar} {v.name} ({v.accent})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-semibold text-navy-600 mb-1">Emotion</label>
                    <select
                      value={emotionB}
                      onChange={(e) => setEmotionB(e.target.value as EmotionType)}
                      className="w-full p-2 rounded-xl bg-surface-warm border border-surface-border text-xs text-navy-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                    >
                      {EMOTION_OPTIONS.map((em) => (
                        <option key={em.id} value={em.id}>
                          {em.emoji} {em.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-navy-600 mb-1">Intensity</label>
                    <select
                      value={intensityB}
                      onChange={(e) => setIntensityB(e.target.value as EmotionIntensity)}
                      className="w-full p-2 rounded-xl bg-surface-warm border border-surface-border text-xs text-navy-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20 capitalize"
                    >
                      <option value="subtle">Subtle</option>
                      <option value="balanced">Balanced</option>
                      <option value="expressive">Expressive</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Status / Player for B */}
              {resultB && (
                <div className="p-3 rounded-2xl bg-surface-warm border border-surface-border mb-3">
                  {resultB.isFishAudio ? (
                    <div className="flex items-center gap-1.5 text-xs text-emerald-800 font-bold mb-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Ready (Fish Audio MP3)</span>
                    </div>
                  ) : (
                    <div className="text-xs text-amber-700 font-medium mb-2">
                      {resultB.error || 'Generated via Browser Demo fallback'}
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handlePlayAudio('B')}
                      className={`h-9 px-3 rounded-xl flex items-center gap-1.5 text-xs font-bold transition-all shadow-xs ${
                        activePlayingId === 'B'
                          ? 'bg-indigo-600 text-white shadow-glow'
                          : 'bg-navy-900 text-white hover:bg-indigo-600'
                      }`}
                    >
                      {activePlayingId === 'B' ? (
                        <>
                          <Pause className="w-3.5 h-3.5 fill-current" />
                          <span>Pause B</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-3.5 h-3.5 fill-current" />
                          <span>Play Version B</span>
                        </>
                      )}
                    </button>

                    {resultB.audioUrl && (
                      <button
                        type="button"
                        onClick={() => audioEngine.downloadAudio(resultB.audioUrl!, `voiceprint-B-${voiceB.name}.mp3`)}
                        className="p-2 rounded-xl border border-surface-border hover:bg-white text-navy-600 hover:text-indigo-600 transition-colors"
                        title="Download Version B MP3"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => handleSynthesizeOption('B')}
              disabled={isGeneratingB}
              className="w-full py-2.5 px-4 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 font-bold text-xs flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              {isGeneratingB ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                  <span>Synthesizing Option B...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                  <span>{resultB ? 'Re-generate Version B' : 'Synthesize Version B'}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Global Bottom Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-surface-border flex-wrap gap-3">
          <div className="flex items-center gap-2 text-xs text-navy-500">
            <Volume2 className="w-4 h-4 text-brand-600" />
            <span>Dual stream evaluation • Model: {fishAudioModel}</span>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={handleGenerateBoth}
              disabled={isGeneratingA || isGeneratingB}
              className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs flex items-center gap-2 transition-all shadow-glow disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4" />
              <span>Generate Both Simultaneously</span>
            </button>

            <button
              type="button"
              onClick={() => {
                audioEngine.stop();
                onClose();
              }}
              className="px-4 py-2.5 rounded-xl border border-surface-border text-navy-600 hover:bg-surface-warm font-semibold text-xs transition-colors"
            >
              Done Comparing
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
