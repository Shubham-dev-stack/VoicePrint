import React from 'react';
import { Sparkles, Info } from 'lucide-react';
import { EmotionType, EmotionIntensity } from '../../types';
import { EMOTION_OPTIONS } from '../../data/mockData';

interface EmotionStudioProps {
  selectedEmotion: EmotionType;
  onEmotionChange: (emotion: EmotionType) => void;
  intensity: EmotionIntensity;
  onIntensityChange: (intensity: EmotionIntensity) => void;
  className?: string;
}

export const EmotionStudio: React.FC<EmotionStudioProps> = ({
  selectedEmotion,
  onEmotionChange,
  intensity,
  onIntensityChange,
  className = ''
}) => {
  const currentEmotionObj = EMOTION_OPTIONS.find((e) => e.id === selectedEmotion) || EMOTION_OPTIONS[0];

  const intensityOptions: { id: EmotionIntensity; label: string; desc: string }[] = [
    { id: 'subtle', label: 'Subtle', desc: 'Mild inflection, natural restraint' },
    { id: 'balanced', label: 'Balanced', desc: 'Natural conversational dynamic' },
    { id: 'expressive', label: 'Expressive', desc: 'Bold emotional peaks, cinematic flair' },
  ];

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Header with selected summary */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-brand-50 border border-brand-200 text-brand-600 flex items-center justify-center text-sm shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-brand-600" />
          </div>
          <div>
            <span className="text-xs font-bold text-navy-900 uppercase tracking-wider block">
              Emotion & Vocal Tone
            </span>
            <p className="text-[11px] text-navy-500">
              Steer Fish Audio vocal inflection using natural expressive conditioning
            </p>
          </div>
        </div>

        {/* Selected Emotion Pill */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-warm border border-surface-border text-xs self-start sm:self-auto shadow-2xs">
          <span className="text-base leading-none">{currentEmotionObj.emoji}</span>
          <span className="font-bold text-navy-900">{currentEmotionObj.label}</span>
          <span className="text-navy-400">•</span>
          <span className="text-[11px] font-semibold text-brand-700 capitalize">
            {intensity}
          </span>
        </div>
      </div>

      {/* 10 Emotion Selector Chips Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
        {EMOTION_OPTIONS.map((emotion) => {
          const isSelected = selectedEmotion === emotion.id;
          return (
            <button
              key={emotion.id}
              type="button"
              onClick={() => onEmotionChange(emotion.id)}
              className={`p-2.5 rounded-2xl border text-left transition-all duration-200 group relative flex flex-col justify-between ${
                isSelected
                  ? 'border-brand-500 bg-brand-50/60 shadow-sm ring-2 ring-brand-500/25 scale-[1.01]'
                  : 'border-surface-border bg-white hover:border-brand-300 hover:bg-surface-warm/60 shadow-2xs'
              }`}
            >
              <div className="flex items-center justify-between gap-1.5 mb-1.5">
                <span className="text-xl group-hover:scale-110 transition-transform duration-200">
                  {emotion.emoji}
                </span>
                {isSelected && (
                  <span className="w-2 h-2 rounded-full bg-brand-600" />
                )}
              </div>

              <div>
                <span className={`block text-xs font-bold truncate ${
                  isSelected ? 'text-brand-900' : 'text-navy-800 group-hover:text-brand-700'
                }`}>
                  {emotion.label}
                </span>
                <span className="block text-[10px] text-navy-400 line-clamp-1 leading-tight mt-0.5">
                  {emotion.description}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Emotion Details and Intensity Controls Bar */}
      <div className="p-3.5 rounded-2xl bg-surface-warm/80 border border-surface-border flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        {/* Active description */}
        <div className="flex items-center gap-2.5 text-xs text-navy-700 flex-1 min-w-0">
          <span className="text-xl flex-shrink-0">{currentEmotionObj.emoji}</span>
          <div className="min-w-0">
            <span className="font-bold text-navy-900">{currentEmotionObj.label}: </span>
            <span className="text-navy-600 text-[11px] leading-relaxed">
              {currentEmotionObj.description}
            </span>
          </div>
        </div>

        {/* Intensity Selection Buttons */}
        <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-surface-border shadow-2xs self-stretch md:self-auto">
          <span className="text-[10px] font-bold uppercase tracking-wider text-navy-400 px-2 flex items-center gap-1">
            <Info className="w-3 h-3 text-brand-500" />
            <span>Intensity:</span>
          </span>

          {intensityOptions.map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => onIntensityChange(opt.id)}
              title={opt.desc}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                intensity === opt.id
                  ? 'bg-brand-600 text-white shadow-xs font-bold'
                  : 'text-navy-600 hover:text-navy-900 hover:bg-surface-warm'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
