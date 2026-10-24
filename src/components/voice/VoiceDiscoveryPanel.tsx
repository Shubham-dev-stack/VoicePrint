import React, { useState } from 'react';
import { 
  Search, 
  Play, 
  Pause, 
  Check, 
  Star, 
  Sparkles,
  SlidersHorizontal
} from 'lucide-react';
import { Voice, Language } from '../../types';

interface VoiceDiscoveryPanelProps {
  voices: Voice[];
  selectedVoice: Voice;
  onSelectVoice: (voice: Voice) => void;
  onPreviewVoice: (voiceId: string, sampleText: string, lang: Language) => void;
  previewingVoiceId: string | null;
  isPlayingPreview: boolean;
  onToggleFavorite?: (voiceId: string) => void;
  className?: string;
  isCompact?: boolean;
}

export const VoiceDiscoveryPanel: React.FC<VoiceDiscoveryPanelProps> = ({
  voices,
  selectedVoice,
  onSelectVoice,
  onPreviewVoice,
  previewingVoiceId,
  isPlayingPreview,
  onToggleFavorite,
  className = '',
  isCompact = false
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGender, setSelectedGender] = useState<string>('All');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('All');
  const [selectedStyle, setSelectedStyle] = useState<string>('All');

  const styleFilterOptions = ['All', 'Conversational', 'Warm', 'Clear', 'Expressive', 'Deep', 'Professional', 'Storytelling'];

  const filteredVoices = voices.filter((v) => {
    // Search query match
    const q = searchQuery.toLowerCase();
    const matchesSearch = 
      v.name.toLowerCase().includes(q) ||
      v.accent.toLowerCase().includes(q) ||
      v.tone.toLowerCase().includes(q) ||
      v.tags.some(t => t.toLowerCase().includes(q));

    if (!matchesSearch) return false;

    // Gender filter
    if (selectedGender !== 'All' && v.gender !== selectedGender) {
      return false;
    }

    // Language filter
    if (selectedLanguage !== 'All') {
      if (selectedLanguage === 'en' && v.language !== 'en') return false;
      if (selectedLanguage === 'hi' && v.language !== 'hi') return false;
      if (selectedLanguage === 'hinglish' && v.language !== 'hinglish') return false;
    }

    // Style filter
    if (selectedStyle !== 'All') {
      const hasStyle = v.tags.some(t => t.toLowerCase().includes(selectedStyle.toLowerCase())) ||
        v.tone.toLowerCase().includes(selectedStyle.toLowerCase());
      if (!hasStyle) return false;
    }

    return true;
  });

  const getLanguageTag = (lang: string) => {
    switch (lang) {
      case 'hi':
        return <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">Hindi</span>;
      case 'hinglish':
        return <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">Hinglish</span>;
      case 'multilingual':
        return <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-800">Multilingual</span>;
      default:
        return <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-100 text-sky-800">English</span>;
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Title & Filter Controls Header */}
      <div className="bg-white rounded-3xl border border-surface-border p-4 sm:p-5 shadow-card space-y-3.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center text-sm font-bold shadow-2xs">
              <SlidersHorizontal className="w-4 h-4 text-brand-600" />
            </div>
            <div>
              <h3 className="font-bold text-navy-900 text-base">Voice Discovery</h3>
              <p className="text-[11px] text-navy-500">Curated vocal personas verified on Fish Audio</p>
            </div>
          </div>

          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-surface-warm text-navy-600 border border-surface-border">
            {filteredVoices.length} voices
          </span>
        </div>

        {/* Search input */}
        <div className="relative">
          <Search className="w-4 h-4 text-navy-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by voice name, accent, tone..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-surface-warm border border-surface-border text-xs text-navy-900 placeholder:text-navy-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
          />
        </div>

        {/* Filter Badges Strip */}
        <div className="space-y-2 pt-1 border-t border-surface-border/60">
          {/* Gender presentation filter */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-[11px] font-bold text-navy-400 uppercase tracking-wider w-14 flex-shrink-0">
              Gender:
            </span>
            <div className="flex items-center gap-1 overflow-x-auto scrollbar-none">
              {['All', 'female', 'male'].map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => setSelectedGender(g)}
                  className={`px-2.5 py-0.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                    selectedGender === g
                      ? 'bg-brand-600 text-white shadow-2xs font-bold'
                      : 'bg-surface-warm text-navy-600 hover:text-navy-900'
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          {/* Language filter */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-[11px] font-bold text-navy-400 uppercase tracking-wider w-14 flex-shrink-0">
              Lang:
            </span>
            <div className="flex items-center gap-1 overflow-x-auto scrollbar-none">
              {['All', 'en', 'hi', 'hinglish'].map((l) => (
                <button
                  key={l}
                  type="button"
                  onClick={() => setSelectedLanguage(l)}
                  className={`px-2.5 py-0.5 rounded-lg text-xs font-semibold transition-all ${
                    selectedLanguage === l
                      ? 'bg-brand-600 text-white shadow-2xs font-bold'
                      : 'bg-surface-warm text-navy-600 hover:text-navy-900'
                  }`}
                >
                  {l === 'All' ? 'All' : l === 'en' ? 'English' : l === 'hi' ? 'Hindi' : 'Hinglish'}
                </button>
              ))}
            </div>
          </div>

          {/* Style filter */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-[11px] font-bold text-navy-400 uppercase tracking-wider w-14 flex-shrink-0">
              Style:
            </span>
            <div className="flex items-center gap-1 overflow-x-auto pb-0.5 scrollbar-none">
              {styleFilterOptions.map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setSelectedStyle(st)}
                  className={`px-2 py-0.5 rounded-lg text-[11px] font-semibold transition-all whitespace-nowrap ${
                    selectedStyle === st
                      ? 'bg-brand-600 text-white shadow-2xs font-bold'
                      : 'bg-surface-warm text-navy-500 hover:text-navy-900'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Voice Cards Grid */}
      <div className={`grid gap-3 ${isCompact ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'}`}>
        {filteredVoices.map((voice) => {
          const isSelected = selectedVoice.id === voice.id;
          const isPreviewing = previewingVoiceId === voice.id && isPlayingPreview;

          return (
            <div
              key={voice.id}
              className={`bg-white rounded-3xl border p-4 sm:p-5 shadow-card hover:shadow-card-hover transition-all duration-200 flex flex-col justify-between group relative ${
                isSelected
                  ? 'border-brand-500 ring-2 ring-brand-500/25 bg-brand-50/20'
                  : 'border-surface-border'
              }`}
            >
              {/* Selected Active Badge */}
              {isSelected && (
                <span className="absolute top-3.5 right-3.5 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-brand-600 text-white text-[10px] font-bold shadow-xs">
                  <Check className="w-3 h-3" />
                  <span>Active</span>
                </span>
              )}

              <div>
                {/* Voice Avatar and Title */}
                <div className="flex items-center gap-3 mb-2.5">
                  <div className={`w-11 h-11 rounded-2xl bg-gradient-to-tr ${voice.color} flex items-center justify-center text-xl shadow-xs text-white flex-shrink-0`}>
                    {voice.avatar}
                  </div>
                  <div className="min-w-0 pr-14">
                    <h4 className="font-bold text-navy-900 text-sm truncate group-hover:text-brand-700 transition-colors">
                      {voice.name}
                    </h4>
                    <p className="text-[11px] text-navy-500 truncate font-medium">{voice.accent}</p>
                  </div>
                </div>

                {/* Tone badge and language */}
                <div className="flex flex-wrap items-center gap-1.5 mb-2.5">
                  {getLanguageTag(voice.language)}
                  <span className="text-[10px] font-semibold text-navy-600 bg-surface-warm px-2 py-0.5 rounded-full border border-surface-border">
                    {voice.tone}
                  </span>
                  {voice.isVerifiedFishAudio && (
                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                      <Sparkles className="w-2.5 h-2.5 text-emerald-600" />
                      <span>Verified Model</span>
                    </span>
                  )}
                </div>

                {/* Description */}
                <p className="text-xs text-navy-600 leading-relaxed mb-3 line-clamp-2">
                  {voice.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {voice.tags.slice(0, 3).map((tag) => (
                    <span key={tag} className="text-[10px] font-medium text-navy-400 bg-navy-50 px-1.5 py-0.5 rounded">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="pt-2.5 border-t border-surface-border flex items-center justify-between gap-2">
                {/* Preview sample button */}
                <button
                  type="button"
                  onClick={() => onPreviewVoice(voice.id, voice.sampleAudioText, voice.language === 'multilingual' ? 'en' : voice.language)}
                  className={`flex-1 py-1.5 px-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                    isPreviewing
                      ? 'bg-brand-600 text-white border-transparent shadow-xs'
                      : 'border-surface-border text-navy-700 hover:text-brand-700 hover:border-brand-200 hover:bg-brand-50/50'
                  }`}
                >
                  {isPreviewing ? (
                    <>
                      <Pause className="w-3.5 h-3.5 fill-current" />
                      <span>Playing</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Preview</span>
                    </>
                  )}
                </button>

                {/* Favorite button if callback provided */}
                {onToggleFavorite && (
                  <button
                    type="button"
                    onClick={() => onToggleFavorite(voice.id)}
                    className="p-2 rounded-xl border border-surface-border hover:bg-surface-warm text-navy-400 hover:text-amber-500 transition-colors"
                    title={voice.isFavorite ? 'Remove favorite' : 'Add to favorites'}
                  >
                    <Star className={`w-3.5 h-3.5 ${voice.isFavorite ? 'fill-amber-400 text-amber-500' : ''}`} />
                  </button>
                )}

                {/* Select voice button */}
                <button
                  type="button"
                  onClick={() => onSelectVoice(voice)}
                  disabled={isSelected}
                  className={`py-1.5 px-3.5 rounded-xl text-xs font-bold transition-all ${
                    isSelected
                      ? 'bg-navy-100 text-navy-400 cursor-default'
                      : 'bg-navy-900 hover:bg-brand-600 text-white shadow-2xs'
                  }`}
                >
                  {isSelected ? 'Selected' : 'Use Voice'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
