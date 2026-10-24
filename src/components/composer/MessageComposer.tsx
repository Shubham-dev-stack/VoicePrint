import React, { useState } from 'react';
import { 
  Sparkles, 
  Bookmark, 
  Trash2, 
  Check, 
  AlertCircle, 
  Globe, 
  Mic2,
  Flame,
  SlidersHorizontal,
  ChevronRight
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Voice, Language, QuickPhrase, EmotionType, EmotionIntensity, MoodPreset } from '../../types';
import { LANGUAGE_OPTIONS } from '../../data/mockData';
import { EmotionStudio } from './EmotionStudio';
import { MoodPresetsBar } from './MoodPresetsBar';

interface MessageComposerProps {
  text: string;
  onTextChange: (newText: string) => void;
  selectedLanguage: Language;
  onLanguageChange: (lang: Language) => void;
  selectedVoice: Voice;
  onVoiceChange: (voice: Voice) => void;
  availableVoices: Voice[];
  quickPhrases: QuickPhrase[];
  selectedEmotion: EmotionType;
  onEmotionChange: (emotion: EmotionType) => void;
  intensity: EmotionIntensity;
  onIntensityChange: (intensity: EmotionIntensity) => void;
  onSelectPreset: (preset: MoodPreset) => void;
  onGenerate: () => void;
  isGenerating: boolean;
  onSaveQuickPhrase: (phraseText: string, lang: Language) => void;
  onOpenComparison?: () => void;
}

export const MessageComposer: React.FC<MessageComposerProps> = ({
  text,
  onTextChange,
  selectedLanguage,
  onLanguageChange,
  selectedVoice,
  onVoiceChange,
  availableVoices,
  quickPhrases,
  selectedEmotion,
  onEmotionChange,
  intensity,
  onIntensityChange,
  onSelectPreset,
  onGenerate,
  isGenerating,
  onSaveQuickPhrase,
  onOpenComparison
}) => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const MAX_CHARS = 1000;

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    if (val.length <= MAX_CHARS) {
      onTextChange(val);
      if (errorMessage) setErrorMessage(null);
    }
  };

  const handleQuickPhraseClick = (phrase: QuickPhrase) => {
    onTextChange(phrase.text);
    onLanguageChange(phrase.language);
    setErrorMessage(null);
  };

  const handleSavePhrase = () => {
    if (!text.trim()) {
      setErrorMessage('Please type a message before saving to Quick Phrases.');
      return;
    }
    onSaveQuickPhrase(text.trim(), selectedLanguage);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2200);
  };

  const handleGenerateClick = () => {
    if (!text.trim()) {
      setErrorMessage('Please enter a message to generate your voiceprint.');
      return;
    }
    setErrorMessage(null);
    
    // Trigger celebratory confetti burst
    try {
      confetti({
        particleCount: 45,
        spread: 60,
        origin: { y: 0.75 },
        colors: ['#6845FF', '#8B5CF6', '#C084FC', '#38BDF8', '#F59E0B']
      });
    } catch {
      // non-critical
    }

    onGenerate();
  };

  // Words count & estimated duration
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const estimatedSeconds = Math.max(1, Math.round(words / 2.3));

  // Quick phrase suggestions for the horizontal pill strip
  const topQuickPhrases = quickPhrases.slice(0, 5);

  return (
    <div className="bg-white rounded-3xl border border-surface-border shadow-card p-5 sm:p-7 relative transition-all space-y-6">
      {/* 1. Mood & Context Presets 1-Click Bar */}
      <MoodPresetsBar
        onSelectPreset={onSelectPreset}
        selectedEmotion={selectedEmotion}
        selectedIntensity={intensity}
        selectedVoiceId={selectedVoice.id}
        availableVoices={availableVoices}
      />

      {/* 2. Top Composer Control Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-surface-border">
        {/* Language selector */}
        <div className="flex items-center gap-2">
          <Globe className="w-4 h-4 text-brand-600 flex-shrink-0" />
          <span className="text-xs font-semibold text-navy-600 uppercase tracking-wider">Language:</span>
          <div className="inline-flex p-1 bg-surface-warm rounded-xl border border-surface-border">
            {LANGUAGE_OPTIONS.map((lang) => (
              <button
                key={lang.id}
                type="button"
                onClick={() => onLanguageChange(lang.id)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  selectedLanguage === lang.id
                    ? 'bg-brand-600 text-white shadow-sm'
                    : 'text-navy-600 hover:text-navy-900 hover:bg-white/60'
                }`}
              >
                {lang.label}
              </button>
            ))}
          </div>
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          {text && (
            <button
              onClick={() => onTextChange('')}
              className="text-xs text-navy-400 hover:text-rose-600 px-2.5 py-1 rounded-lg hover:bg-rose-50 flex items-center gap-1 transition-colors"
              title="Clear text"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear</span>
            </button>
          )}

          <button
            onClick={handleSavePhrase}
            disabled={!text.trim()}
            className={`text-xs px-3 py-1 rounded-lg border flex items-center gap-1.5 transition-all ${
              savedSuccess
                ? 'bg-emerald-50 text-emerald-700 border-emerald-300 font-medium'
                : 'border-surface-border text-navy-600 hover:text-brand-700 hover:border-brand-200 hover:bg-brand-50/50 disabled:opacity-40 disabled:cursor-not-allowed'
            }`}
          >
            {savedSuccess ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>Saved!</span>
              </>
            ) : (
              <>
                <Bookmark className="w-3.5 h-3.5 text-brand-600" />
                <span>Save Quick Phrase</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 3. Main Textarea */}
      <div className="relative">
        <textarea
          value={text}
          onChange={handleTextChange}
          placeholder={
            selectedLanguage === 'hi'
              ? 'अपना संदेश यहाँ लिखें जिसे आप अपनी आवाज़ में सुनना चाहते हैं...'
              : selectedLanguage === 'hinglish'
              ? 'Yahan apna message type karein, jaise "Hello! Main thodi der me call karta hoon"...'
              : 'Type what you want to say in your voice...'
          }
          rows={4}
          className={`w-full p-4 rounded-2xl bg-surface-warm/50 border text-navy-900 placeholder:text-navy-400 focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 text-base sm:text-lg leading-relaxed resize-none transition-all ${
            errorMessage ? 'border-rose-400 bg-rose-50/20' : 'border-surface-border hover:border-navy-300'
          }`}
        />

        {/* Live Counters & Estimates */}
        <div className="flex items-center justify-between text-xs text-navy-400 px-1 mt-1">
          <div className="flex items-center gap-2">
            {words > 0 && (
              <span className="text-navy-500 font-medium">
                {words} {words === 1 ? 'word' : 'words'} • ~{estimatedSeconds}s estimated
              </span>
            )}
          </div>
          <div className="flex items-center gap-1">
            <span className={text.length >= MAX_CHARS * 0.9 ? 'text-amber-600 font-bold' : ''}>
              {text.length}
            </span>
            <span>/ {MAX_CHARS} characters</span>
          </div>
        </div>

        {/* Error notification if empty validation fails */}
        {errorMessage && (
          <div className="flex items-center gap-2 text-rose-600 text-xs font-medium mt-2 bg-rose-50 p-2.5 rounded-xl border border-rose-200">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}
      </div>

      {/* 4. Emotion Studio Controls (10 selectable emotions + intensity) */}
      <EmotionStudio
        selectedEmotion={selectedEmotion}
        onEmotionChange={onEmotionChange}
        intensity={intensity}
        onIntensityChange={onIntensityChange}
      />

      {/* 5. Quick Phrase Buttons strip */}
      <div>
        <div className="flex items-center gap-1.5 mb-2">
          <Flame className="w-3.5 h-3.5 text-brand-600" />
          <span className="text-xs font-semibold text-navy-600">Quick Phrases:</span>
        </div>
        <div className="flex flex-wrap gap-1.5 sm:gap-2">
          {topQuickPhrases.map((phrase) => (
            <button
              key={phrase.id}
              onClick={() => handleQuickPhraseClick(phrase)}
              className="text-xs font-medium px-3 py-1.5 rounded-xl bg-surface-warm hover:bg-brand-50 text-navy-700 hover:text-brand-700 border border-surface-border hover:border-brand-200 transition-all flex items-center gap-1.5 shadow-2xs group"
            >
              <span>{phrase.text}</span>
              <span className="text-[10px] uppercase font-bold text-navy-400 group-hover:text-brand-500">
                {phrase.language}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* 6. Active Voice Selector Cards Row */}
      <div>
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-2">
            <Mic2 className="w-4 h-4 text-brand-600" />
            <span className="text-xs font-semibold text-navy-700 uppercase tracking-wider">
              Selected Vocal Persona
            </span>
          </div>
          <span className="text-xs text-brand-700 font-medium">
            Active: <strong className="text-navy-900">{selectedVoice.name}</strong>
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
          {availableVoices.slice(0, 4).map((voice) => {
            const isSelected = selectedVoice.id === voice.id;
            return (
              <div
                key={voice.id}
                onClick={() => onVoiceChange(voice)}
                className={`p-3 rounded-2xl border cursor-pointer transition-all duration-200 relative text-left ${
                  isSelected
                    ? 'border-brand-500 bg-brand-50/50 shadow-md ring-2 ring-brand-500/20'
                    : 'border-surface-border bg-white hover:border-navy-300 hover:shadow-subtle'
                }`}
              >
                {isSelected && (
                  <span className="absolute top-2 right-2 w-4 h-4 rounded-full bg-brand-600 text-white flex items-center justify-center">
                    <Check className="w-2.5 h-2.5" />
                  </span>
                )}
                <div className="flex items-center gap-2 mb-1.5">
                  <div className={`w-7 h-7 rounded-lg bg-gradient-to-tr ${voice.color} flex items-center justify-center text-sm shadow-xs text-white`}>
                    {voice.avatar}
                  </div>
                  <span className="font-semibold text-sm text-navy-900 truncate">
                    {voice.name}
                  </span>
                </div>
                <p className="text-[11px] text-navy-500 font-medium truncate">
                  {voice.accent}
                </p>
                <div className="mt-1 flex items-center gap-1">
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-navy-100 text-navy-600 font-medium truncate">
                    {voice.tone}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 7. Action Buttons Bar (Generate Voice & A/B Compare) */}
      <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
        <button
          type="button"
          onClick={handleGenerateClick}
          disabled={isGenerating}
          className={`flex-1 w-full py-4 px-6 rounded-2xl font-bold text-base sm:text-lg flex items-center justify-center gap-3 transition-all duration-300 shadow-md ${
            isGenerating
              ? 'bg-brand-400 text-white cursor-wait animate-pulse'
              : 'bg-gradient-to-r from-brand-600 via-brand-700 to-indigo-700 hover:from-brand-500 hover:to-indigo-600 text-white shadow-glow hover:shadow-card-hover active:scale-[0.99]'
          }`}
        >
          {isGenerating ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Synthesizing Voiceprint Stream...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5 fill-current" />
              <span>Generate Voice</span>
              <span className="text-xs font-normal opacity-90 py-0.5 px-2 rounded-full bg-white/20">
                Emotion-Aware
              </span>
            </>
          )}
        </button>

        {onOpenComparison && (
          <button
            type="button"
            onClick={onOpenComparison}
            disabled={!text.trim()}
            className="w-full sm:w-auto px-5 py-4 rounded-2xl border border-brand-200 hover:border-brand-400 bg-brand-50/60 hover:bg-brand-100/70 text-brand-700 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-2xs disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap"
            title="A/B Benchmark two voices or emotion settings"
          >
            <SlidersHorizontal className="w-4 h-4 text-brand-600" />
            <span>A/B Comparison</span>
            <ChevronRight className="w-3.5 h-3.5 text-brand-400" />
          </button>
        )}
      </div>
    </div>
  );
};
