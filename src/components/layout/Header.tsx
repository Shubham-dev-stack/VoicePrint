import React from 'react';
import { Menu, Sparkles } from 'lucide-react';
import { ActiveTab, Voice, Language } from '../../types';

interface HeaderProps {
  activeTab: ActiveTab;
  onOpenMobileMenu: () => void;
  activeVoice: Voice;
  activeLanguage: Language;
  onTabChange: (tab: ActiveTab) => void;
  isFishAudioConfigured?: boolean;
  fishAudioModel?: string;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onOpenMobileMenu,
  activeVoice,
  activeLanguage,
  onTabChange,
  isFishAudioConfigured = false,
  fishAudioModel = 's2.1-pro-free'
}) => {
  const getTabTitle = () => {
    switch (activeTab) {
      case 'home':
        return { title: 'Studio Dashboard', subtitle: 'Type, customize, and speak in your cloned voiceprint' };
      case 'my-voice':
        return { title: 'My Voice Identity', subtitle: 'Calibrate, record, and fine-tune your personalized voice clone' };
      case 'quick-phrases':
        return { title: 'Quick Phrases Library', subtitle: 'Save, organize, and trigger instant vocal messages' };
      case 'voice-library':
        return { title: 'Voice Catalog', subtitle: 'Explore studio curated voices across languages and emotional tones' };
      case 'settings':
        return { title: 'Settings & Integration', subtitle: 'Manage Fish Audio API credentials, audio preferences, and privacy' };
    }
  };

  const { title, subtitle } = getTabTitle();

  const getLanguageLabel = (lang: Language) => {
    switch (lang) {
      case 'hi': return 'Hindi';
      case 'hinglish': return 'Hinglish';
      default: return 'English';
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-surface-border px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4">
      {/* Mobile Menu Button & Breadcrumb */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 rounded-xl text-navy-700 hover:bg-surface-warm transition-colors"
          aria-label="Open sidebar menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-extrabold text-navy-900 text-lg sm:text-xl tracking-tight">
              {title}
            </h2>
          </div>
          <p className="text-xs text-navy-500 hidden sm:block">
            {subtitle}
          </p>
        </div>
      </div>

      {/* Right status items */}
      <div className="flex items-center gap-2.5">
        {/* Active Voice Pill */}
        <button
          onClick={() => onTabChange('voice-library')}
          className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-surface-warm border border-surface-border hover:border-brand-300 text-xs text-navy-700 transition-all hover:shadow-xs group"
          title="Switch Active Voice"
        >
          <div className={`w-5 h-5 rounded-md bg-gradient-to-tr ${activeVoice.color} flex items-center justify-center text-xs text-white`}>
            {activeVoice.avatar}
          </div>
          <span className="font-semibold text-navy-900 group-hover:text-brand-700">
            {activeVoice.name}
          </span>
          <span className="text-[10px] text-navy-400">({getLanguageLabel(activeLanguage)})</span>
        </button>

        {/* Engine Status Pill */}
        {isFishAudioConfigured ? (
          <div 
            onClick={() => onTabChange('settings')}
            className="cursor-pointer flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-900 hover:bg-emerald-100/70 transition-all shadow-xs"
            title={`Fish Audio API Live (${fishAudioModel}) via secure backend proxy`}
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
            <span className="hidden sm:inline">Fish Audio API</span>
            <span className="text-[10px] bg-emerald-200/80 text-emerald-900 px-1.5 py-0.2 rounded-md font-bold">
              Live ({fishAudioModel})
            </span>
          </div>
        ) : (
          <div 
            onClick={() => onTabChange('settings')}
            className="cursor-pointer flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-xs font-semibold text-amber-900 hover:bg-amber-100/70 transition-all shadow-xs"
            title="Demo Mode: Backend FISH_API_KEY not configured in server/.env. Using browser speech synthesis fallback."
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
            <span className="hidden sm:inline">Demo Fallback</span>
            <span className="text-[10px] bg-amber-200/80 text-amber-900 px-1.5 py-0.2 rounded-md font-bold">
              Browser Speech
            </span>
          </div>
        )}
      </div>
    </header>
  );
};
