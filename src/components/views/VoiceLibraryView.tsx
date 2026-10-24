import React from 'react';
import { Voice, Language } from '../../types';
import { VoiceDiscoveryPanel } from '../voice/VoiceDiscoveryPanel';

interface VoiceLibraryViewProps {
  voices: Voice[];
  activeVoice: Voice;
  onSelectVoice: (voice: Voice) => void;
  onPreviewVoiceSample: (voiceId: string, sampleText: string, lang: Language) => void;
  previewingVoiceId: string | null;
  isPlayingPreview: boolean;
  onToggleFavorite?: (voiceId: string) => void;
}

export const VoiceLibraryView: React.FC<VoiceLibraryViewProps> = ({
  voices,
  activeVoice,
  onSelectVoice,
  onPreviewVoiceSample,
  previewingVoiceId,
  isPlayingPreview,
  onToggleFavorite
}) => {
  return (
    <div className="space-y-6 sm:space-y-8 pb-12">
      {/* Top Header */}
      <div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-navy-900 tracking-tight">
          Voice Catalog & Library
        </h2>
        <p className="text-sm text-navy-500 mt-1">
          Explore handcrafted vocal personas verified on the Fish Audio neural API, optimized for expressive cadences in Hindi, Hinglish, and English.
        </p>
      </div>

      {/* Voice Discovery Panel */}
      <VoiceDiscoveryPanel
        voices={voices}
        selectedVoice={activeVoice}
        onSelectVoice={onSelectVoice}
        onPreviewVoice={onPreviewVoiceSample}
        previewingVoiceId={previewingVoiceId}
        isPlayingPreview={isPlayingPreview}
        onToggleFavorite={onToggleFavorite}
      />
    </div>
  );
};
