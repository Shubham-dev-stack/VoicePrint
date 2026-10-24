import React from 'react';
import { Flame } from 'lucide-react';
import { MoodPreset, EmotionType, EmotionIntensity, Voice } from '../../types';
import { MOOD_PRESETS } from '../../data/mockData';

interface MoodPresetsBarProps {
  onSelectPreset: (preset: MoodPreset) => void;
  selectedEmotion: EmotionType;
  selectedIntensity: EmotionIntensity;
  selectedVoiceId: string;
  availableVoices: Voice[];
}

export const MoodPresetsBar: React.FC<MoodPresetsBarProps> = ({
  onSelectPreset,
  selectedEmotion,
  selectedIntensity,
  selectedVoiceId
}) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Flame className="w-3.5 h-3.5 text-brand-600" />
          <span className="text-xs font-bold text-navy-800 uppercase tracking-wider">
            Mood & Context Presets
          </span>
        </div>
        <span className="text-[11px] text-navy-400 font-medium hidden sm:inline">
          1-click presets configured for authentic delivery
        </span>
      </div>

      {/* Horizontal scrolling preset chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1.5 scrollbar-none pt-0.5">
        {MOOD_PRESETS.map((preset) => {
          const isPresetActive = 
            selectedEmotion === preset.emotion && 
            selectedIntensity === preset.intensity &&
            selectedVoiceId === preset.recommendedVoiceId;

          return (
            <button
              key={preset.id}
              type="button"
              onClick={() => onSelectPreset(preset)}
              title={`${preset.subtitle} (Emotion: ${preset.emotion}, Intensity: ${preset.intensity})`}
              className={`px-3 py-1.5 rounded-xl border text-xs font-medium whitespace-nowrap flex items-center gap-1.5 transition-all duration-200 group flex-shrink-0 ${
                isPresetActive
                  ? 'bg-brand-600 text-white border-transparent shadow-xs font-bold'
                  : 'bg-white hover:bg-brand-50/70 border-surface-border hover:border-brand-300 text-navy-700 shadow-2xs'
              }`}
            >
              <span className="text-sm">{preset.icon}</span>
              <span className="font-semibold">{preset.title}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-md capitalize font-bold ${
                isPresetActive ? 'bg-white/20 text-white' : 'bg-surface-warm text-navy-400 group-hover:text-brand-600'
              }`}>
                {preset.emotion}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
