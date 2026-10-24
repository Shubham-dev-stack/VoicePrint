import React, { useState } from 'react';
import { 
  Search, 
  Play, 
  Pause, 
  Check 
} from 'lucide-react';
import { Voice, Language } from '../../types';

interface VoiceLibraryViewProps {
  voices: Voice[];
  activeVoice: Voice;
  onSelectVoice: (voice: Voice) => void;
  onPreviewVoiceSample: (voiceId: string, sampleText: string, lang: Language) => void;
  previewingVoiceId: string | null;
  isPlayingPreview: boolean;
}

export const VoiceLibraryView: React.FC<VoiceLibraryViewProps> = ({
  voices,
  activeVoice,
  onSelectVoice,
  onPreviewVoiceSample,
  previewingVoiceId,
  isPlayingPreview
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('All');
  const [selectedGender, setSelectedGender] = useState<string>('All');

  const filteredVoices = voices.filter((voice) => {
    const matchesSearch = 
      voice.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      voice.accent.toLowerCase().includes(searchQuery.toLowerCase()) ||
      voice.tone.toLowerCase().includes(searchQuery.toLowerCase()) ||
      voice.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;

    if (selectedLanguage !== 'All') {
      if (selectedLanguage === 'en' && voice.language !== 'en') return false;
      if (selectedLanguage === 'hi' && voice.language !== 'hi') return false;
      if (selectedLanguage === 'hinglish' && voice.language !== 'hinglish') return false;
    }

    if (selectedGender !== 'All' && voice.gender !== selectedGender) {
      return false;
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
    <div className="space-y-6 sm:space-y-8 pb-12">
      {/* Top Header */}
      <div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-navy-900 tracking-tight">
          Voice Catalog & Library
        </h2>
        <p className="text-sm text-navy-500 mt-1">
          Explore handcrafted vocal personas optimized for natural cadences in Hindi, Hinglish, and English.
        </p>
      </div>

      {/* Filters and search */}
      <div className="bg-white rounded-3xl border border-surface-border p-4 sm:p-5 shadow-card space-y-4">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-navy-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by voice name, tone (e.g. Warm, Expressive), or accent..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-surface-warm border border-surface-border text-sm text-navy-900 placeholder:text-navy-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
            />
          </div>

          <span className="text-xs font-semibold text-navy-500 flex-shrink-0">
            {filteredVoices.length} of {voices.length} voices
          </span>
        </div>

        {/* Filter buttons */}
        <div className="flex flex-wrap items-center gap-3 pt-1">
          {/* Language filter */}
          <div className="flex items-center gap-1.5 bg-surface-warm p-1 rounded-xl border border-surface-border text-xs">
            <span className="text-navy-400 px-2 font-semibold">Language:</span>
            {['All', 'en', 'hi', 'hinglish'].map((l) => (
              <button
                key={l}
                onClick={() => setSelectedLanguage(l)}
                className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                  selectedLanguage === l
                    ? 'bg-brand-600 text-white font-bold shadow-xs'
                    : 'text-navy-600 hover:text-navy-900'
                }`}
              >
                {l === 'All' ? 'All' : l === 'en' ? 'English' : l === 'hi' ? 'Hindi' : 'Hinglish'}
              </button>
            ))}
          </div>

          {/* Gender filter */}
          <div className="flex items-center gap-1.5 bg-surface-warm p-1 rounded-xl border border-surface-border text-xs">
            <span className="text-navy-400 px-2 font-semibold">Gender:</span>
            {['All', 'female', 'male'].map((g) => (
              <button
                key={g}
                onClick={() => setSelectedGender(g)}
                className={`px-2.5 py-1 rounded-lg font-medium capitalize transition-all ${
                  selectedGender === g
                    ? 'bg-brand-600 text-white font-bold shadow-xs'
                    : 'text-navy-600 hover:text-navy-900'
                }`}
              >
                {g}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Voice Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredVoices.map((voice) => {
          const isActive = activeVoice.id === voice.id;
          const isThisPreviewing = previewingVoiceId === voice.id && isPlayingPreview;

          return (
            <div
              key={voice.id}
              className={`bg-white rounded-3xl border p-5 sm:p-6 shadow-card hover:shadow-card-hover transition-all duration-300 flex flex-col justify-between relative group ${
                isActive ? 'border-brand-500 ring-2 ring-brand-500/20 bg-brand-50/20' : 'border-surface-border'
              }`}
            >
              {/* Active Badge */}
              {isActive && (
                <div className="absolute top-4 right-4 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-brand-600 text-white text-[11px] font-bold shadow-xs">
                  <Check className="w-3 h-3" />
                  <span>Active Voice</span>
                </div>
              )}

              <div>
                {/* Voice Avatar and Title */}
                <div className="flex items-center gap-3.5 mb-3.5">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${voice.color} flex items-center justify-center text-2xl shadow-sm text-white flex-shrink-0`}>
                    {voice.avatar}
                  </div>
                  <div>
                    <h3 className="font-extrabold text-navy-900 text-base group-hover:text-brand-700 transition-colors">
                      {voice.name}
                    </h3>
                    <p className="text-xs text-navy-500 font-medium">{voice.accent}</p>
                  </div>
                </div>

                {/* Tone badge and language */}
                <div className="flex items-center gap-2 mb-3">
                  {getLanguageTag(voice.language)}
                  <span className="text-[10px] font-semibold text-navy-600 bg-surface-warm px-2 py-0.5 rounded-full border border-surface-border">
                    {voice.tone}
                  </span>
                  {voice.isCustom && (
                    <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full border border-amber-200">
                      Demo Profile
                    </span>
                  )}
                </div>

                {/* Description */}
                <p className="text-xs text-navy-600 leading-relaxed mb-4">
                  {voice.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mb-5">
                  {voice.tags.map((tag) => (
                    <span key={tag} className="text-[10px] font-medium text-navy-400 bg-navy-50 px-2 py-0.5 rounded-md">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Bottom Buttons */}
              <div className="pt-3 border-t border-surface-border flex items-center gap-2">
                {/* Preview sample button */}
                <button
                  onClick={() => onPreviewVoiceSample(voice.id, voice.sampleAudioText, voice.language === 'multilingual' ? 'en' : voice.language)}
                  className={`flex-1 py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                    isThisPreviewing
                      ? 'bg-brand-600 text-white border-transparent shadow-glow'
                      : 'border-surface-border text-navy-700 hover:text-brand-700 hover:border-brand-200 hover:bg-brand-50/50'
                  }`}
                >
                  {isThisPreviewing ? (
                    <>
                      <Pause className="w-3.5 h-3.5 fill-current" />
                      <span>Playing Sample</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Preview Sound</span>
                    </>
                  )}
                </button>

                {/* Select voice button */}
                <button
                  onClick={() => onSelectVoice(voice)}
                  disabled={isActive}
                  className={`py-2 px-4 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-navy-100 text-navy-400 cursor-default'
                      : 'bg-navy-900 hover:bg-brand-600 text-white shadow-xs'
                  }`}
                >
                  {isActive ? 'Selected' : 'Use Voice'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
