import React from 'react';
import { 
  Sparkles, 
  ShieldCheck, 
  Languages, 
  Zap, 
  Lock
} from 'lucide-react';
import { MessageComposer } from '../composer/MessageComposer';
import { AudioPlayer } from '../audio/AudioPlayer';
import { RecentMessagesList } from '../messages/RecentMessagesList';
import { Voice, Language, QuickPhrase, RecentMessage } from '../../types';

interface HomeViewProps {
  composerText: string;
  onComposerTextChange: (text: string) => void;
  selectedLanguage: Language;
  onLanguageChange: (lang: Language) => void;
  selectedVoice: Voice;
  onVoiceChange: (voice: Voice) => void;
  availableVoices: Voice[];
  quickPhrases: QuickPhrase[];
  onGenerateVoice: () => void;
  isGenerating: boolean;
  onSaveQuickPhrase: (phraseText: string, lang: Language) => void;
  
  // Audio state
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  progress: number;
  playbackRate: number;
  currentAudioText: string;
  isFishAudio?: boolean;
  fishAudioModel?: string;
  onPlayPause: () => void;
  onRestart: () => void;
  onSpeedChange: (speed: number) => void;
  onSeek: (pct: number) => void;

  // Recent messages
  recentMessages: RecentMessage[];
  onPlayRecentMessage: (message: RecentMessage) => void;
  onUseRecentMessage: (message: RecentMessage) => void;
  onDeleteRecentMessage: (id: string) => void;
  onClearAllRecentMessages: () => void;
  currentlyPlayingMessageId: string | null;
}

export const HomeView: React.FC<HomeViewProps> = ({
  composerText,
  onComposerTextChange,
  selectedLanguage,
  onLanguageChange,
  selectedVoice,
  onVoiceChange,
  availableVoices,
  quickPhrases,
  onGenerateVoice,
  isGenerating,
  onSaveQuickPhrase,

  isPlaying,
  currentTime,
  duration,
  progress,
  playbackRate,
  currentAudioText,
  isFishAudio = false,
  fishAudioModel = 's2.1-pro-free',
  onPlayPause,
  onRestart,
  onSpeedChange,
  onSeek,

  recentMessages,
  onPlayRecentMessage,
  onUseRecentMessage,
  onDeleteRecentMessage,
  onClearAllRecentMessages,
  currentlyPlayingMessageId
}) => {
  return (
    <div className="space-y-6 sm:space-y-8 pb-12">
      {/* Main Greeting Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-navy-900 via-navy-950 to-brand-950 text-white p-6 sm:p-9 shadow-xl border border-navy-800">
        {/* Subtle decorative circles */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-brand-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 -mb-16 w-48 h-48 bg-indigo-500/15 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-brand-200 border border-white/10 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-brand-300" />
            <span>Voice Synthesis Demo Studio</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-2 leading-tight">
            Your voice. <span className="bg-gradient-to-r from-brand-300 via-purple-200 to-white bg-clip-text text-transparent">Your words.</span>
          </h1>

          <p className="text-sm sm:text-base text-navy-200 leading-relaxed font-normal">
            Type anything in English, Hindi, or conversational Hinglish and hear a browser demo preview in your selected voice persona.
          </p>

          {/* Feature Highlights Pills */}
          <div className="mt-5 flex flex-wrap items-center gap-2.5 text-xs text-navy-300">
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10">
              <Zap className="w-3 h-3 text-amber-400" />
              <span>Browser Speech Demo</span>
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10">
              <Languages className="w-3 h-3 text-emerald-400" />
              <span>Multilingual (EN, HI, Hinglish)</span>
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10">
              <Lock className="w-3 h-3 text-indigo-400" />
              <span>Fish Audio Hook Prepared</span>
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid: Composer & Audio Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
        {/* Left Column: Composer (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <MessageComposer
            text={composerText}
            onTextChange={onComposerTextChange}
            selectedLanguage={selectedLanguage}
            onLanguageChange={onLanguageChange}
            selectedVoice={selectedVoice}
            onVoiceChange={onVoiceChange}
            availableVoices={availableVoices}
            quickPhrases={quickPhrases}
            onGenerate={onGenerateVoice}
            isGenerating={isGenerating}
            onSaveQuickPhrase={onSaveQuickPhrase}
          />
        </div>

        {/* Right Column: Audio Preview & Player (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <AudioPlayer
            isPlaying={isPlaying}
            currentTime={currentTime}
            duration={duration}
            progress={progress}
            playbackRate={playbackRate}
            currentText={currentAudioText || composerText}
            voice={selectedVoice}
            language={selectedLanguage}
            isFishAudio={isFishAudio}
            fishAudioModel={fishAudioModel}
            onPlayPause={onPlayPause}
            onRestart={onRestart}
            onSpeedChange={onSpeedChange}
            onSeek={onSeek}
          />

          {/* Privacy Notice card */}
          <div className="p-4 rounded-2xl bg-surface-warm border border-surface-border flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center flex-shrink-0 mt-0.5">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-navy-900 mb-0.5">Responsible & Ethical Voice Use</h4>
              <p className="text-xs text-navy-600 leading-relaxed">
                Use only your own voice or a voice you have permission to use. Generated voiceprints are restricted to consented communication.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Messages Section */}
      <div className="pt-2">
        <RecentMessagesList
          messages={recentMessages}
          onPlayMessage={onPlayRecentMessage}
          onUseMessage={onUseRecentMessage}
          onDeleteMessage={onDeleteRecentMessage}
          onClearAll={onClearAllRecentMessages}
          currentlyPlayingId={currentlyPlayingMessageId}
          isPlaying={isPlaying}
        />
      </div>
    </div>
  );
};
