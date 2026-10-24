import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { HomeView } from './components/views/HomeView';
import { MyVoiceView } from './components/views/MyVoiceView';
import { QuickPhrasesView } from './components/views/QuickPhrasesView';
import { VoiceLibraryView } from './components/views/VoiceLibraryView';
import { SettingsView } from './components/views/SettingsView';
import { ToastContainer, ToastMessage } from './components/common/Toast';
import { 
  ActiveTab, 
  Voice, 
  Language, 
  QuickPhrase, 
  RecentMessage, 
  UserVoiceProfile 
} from './types';
import { 
  INITIAL_VOICES, 
  INITIAL_QUICK_PHRASES, 
  INITIAL_RECENT_MESSAGES, 
  DEFAULT_USER_PROFILE 
} from './data/mockData';
import { demoAudioService } from './services/audioService';
import { fishAudioService } from './services/fishAudioService';

export function App() {
  // Navigation & UI state
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Fish Audio Backend status
  const [isFishAudioConfigured, setIsFishAudioConfigured] = useState(false);
  const [fishAudioModel, setFishAudioModel] = useState('s2.1-pro-free');

  // Composer state
  const [composerText, setComposerText] = useState(
    'Hello, how can I help? Main yahan hoon aapki help karne ke liye.'
  );
  const [selectedLanguage, setSelectedLanguage] = useState<Language>('hinglish');
  const [selectedVoice, setSelectedVoice] = useState<Voice>(INITIAL_VOICES[0]);
  const [availableVoices] = useState<Voice[]>(INITIAL_VOICES);
  const [currentAudioUrl, setCurrentAudioUrl] = useState<string | undefined>(undefined);

  // Quick phrases with LocalStorage fallback
  const [quickPhrases, setQuickPhrases] = useState<QuickPhrase[]>(() => {
    try {
      const saved = localStorage.getItem('voiceprint_quick_phrases');
      return saved ? JSON.parse(saved) : INITIAL_QUICK_PHRASES;
    } catch {
      return INITIAL_QUICK_PHRASES;
    }
  });

  // Recent messages with LocalStorage fallback
  const [recentMessages, setRecentMessages] = useState<RecentMessage[]>(() => {
    try {
      const saved = localStorage.getItem('voiceprint_recent_messages');
      return saved ? JSON.parse(saved) : INITIAL_RECENT_MESSAGES;
    } catch {
      return INITIAL_RECENT_MESSAGES;
    }
  });

  // User voice clone profile
  const [userProfile, setUserProfile] = useState<UserVoiceProfile>(() => {
    try {
      const saved = localStorage.getItem('voiceprint_user_profile');
      return saved ? JSON.parse(saved) : DEFAULT_USER_PROFILE;
    } catch {
      return DEFAULT_USER_PROFILE;
    }
  });

  // Synthesis loading state
  const [isGenerating, setIsGenerating] = useState(false);

  // Audio Player state
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(4);
  const [progress, setProgress] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1.0);
  const [currentAudioText, setCurrentAudioText] = useState(
    'Hello, how can I help? Main yahan hoon aapki help karne ke liye.'
  );
  const [isCurrentAudioFishAudio, setIsCurrentAudioFishAudio] = useState(false);
  const [currentlyPlayingMessageId, setCurrentlyPlayingMessageId] = useState<string | null>(null);

  // Voice library audition preview state
  const [previewingVoiceId, setPreviewingVoiceId] = useState<string | null>(null);
  const [isPlayingPreview, setIsPlayingPreview] = useState(false);

  // Check backend and Fish Audio status on mount
  useEffect(() => {
    const checkBackend = async () => {
      const status = await fishAudioService.checkBackendStatus();
      setIsFishAudioConfigured(status.fishAudioConfigured);
      if (status.model) setFishAudioModel(status.model);
    };
    checkBackend();
  }, []);

  // Persist quick phrases
  useEffect(() => {
    try {
      localStorage.setItem('voiceprint_quick_phrases', JSON.stringify(quickPhrases));
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
  }, [quickPhrases]);

  // Persist recent messages
  useEffect(() => {
    try {
      localStorage.setItem('voiceprint_recent_messages', JSON.stringify(recentMessages));
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
  }, [recentMessages]);

  // Persist profile
  useEffect(() => {
    try {
      localStorage.setItem('voiceprint_user_profile', JSON.stringify(userProfile));
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
  }, [userProfile]);

  const addToast = (type: 'success' | 'info' | 'error', title: string, message?: string) => {
    const id = Date.now().toString() + Math.random().toString().slice(2, 6);
    setToasts((prev) => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Trigger audio playback for arbitrary text (Fish Audio MP3 or SpeechSynthesis fallback)
  const startAudioPlayback = (
    textToSpeak: string,
    voiceToUse: Voice = selectedVoice,
    langToUse: Language = selectedLanguage,
    audioUrl?: string,
    isFishAudio = false,
    onFinish?: () => void
  ) => {
    setCurrentAudioText(textToSpeak);
    setCurrentAudioUrl(audioUrl);
    setIsPlaying(true);
    setIsCurrentAudioFishAudio(isFishAudio);

    demoAudioService.play({
      text: textToSpeak,
      language: langToUse,
      voiceId: voiceToUse.id,
      audioUrl: audioUrl,
      rate: playbackRate,
      pitch: userProfile.pitch ? 1 + (userProfile.pitch / 50) * 0.2 : 1.0,
      onStart: (dur) => {
        setDuration(dur);
        setCurrentTime(0);
        setProgress(0);
        setIsPlaying(true);
      },
      onProgress: (prog, curr, dur) => {
        setProgress(prog);
        setCurrentTime(curr);
        setDuration(dur);
      },
      onEnd: () => {
        setIsPlaying(false);
        setProgress(1);
        setCurrentlyPlayingMessageId(null);
        setPreviewingVoiceId(null);
        setIsPlayingPreview(false);
        if (onFinish) onFinish();
      },
      onError: () => {
        setIsPlaying(false);
        setCurrentlyPlayingMessageId(null);
      }
    });
  };

  // Generate Voice Action (Calls Fish Audio backend API with fallback)
  const handleGenerateVoice = async (overrideText?: string, overrideLang?: Language) => {
    const textToSpeak = (overrideText !== undefined ? overrideText : composerText).trim();
    const langToUse = overrideLang || selectedLanguage;
    if (!textToSpeak) return;

    setIsGenerating(true);
    demoAudioService.stop();

    try {
      const res = await fishAudioService.synthesizeSpeech({
        text: textToSpeak,
        referenceId: selectedVoice.fishAudioReferenceId
      });

      setIsGenerating(false);

      if (res.success && res.audioUrl) {
        setIsCurrentAudioFishAudio(true);
        setCurrentAudioUrl(res.audioUrl);

        const newRecentItem: RecentMessage = {
          id: 'msg-' + Date.now(),
          text: textToSpeak,
          language: langToUse,
          voiceId: selectedVoice.id,
          voiceName: selectedVoice.name,
          timestamp: 'Just now',
          durationSeconds: 4,
          audioUrl: res.audioUrl,
          isFishAudio: true,
          modelUsed: res.model
        };

        setRecentMessages((prev) => [newRecentItem, ...prev.slice(0, 19)]);
        setCurrentlyPlayingMessageId(newRecentItem.id);

        startAudioPlayback(textToSpeak, selectedVoice, langToUse, res.audioUrl, true);

        addToast(
          'success',
          '⚡ Real Fish Audio Generated!',
          `Synthesized live with "${selectedVoice.name}" (${res.model || fishAudioModel}).`
        );
      } else {
        // Fallback to browser demo preview if Fish Audio is unavailable
        setIsCurrentAudioFishAudio(false);
        setCurrentAudioUrl(undefined);
        const estimatedDur = demoAudioService.getDuration(textToSpeak, playbackRate);

        const newRecentItem: RecentMessage = {
          id: 'msg-' + Date.now(),
          text: textToSpeak,
          language: langToUse,
          voiceId: selectedVoice.id,
          voiceName: selectedVoice.name,
          timestamp: 'Just now',
          durationSeconds: estimatedDur,
          isFishAudio: false
        };

        setRecentMessages((prev) => [newRecentItem, ...prev.slice(0, 19)]);
        setCurrentlyPlayingMessageId(newRecentItem.id);

        startAudioPlayback(textToSpeak, selectedVoice, langToUse, undefined, false);

        addToast(
          'info',
          'Browser Speech Fallback',
          res.error || 'Fish Audio backend unavailable. Played using local browser speech.'
        );
      }
    } catch {
      setIsGenerating(false);
      setIsCurrentAudioFishAudio(false);
      setCurrentAudioUrl(undefined);
      startAudioPlayback(textToSpeak, selectedVoice, langToUse, undefined, false);
      addToast('error', 'Generation Notice', 'Falling back to browser speech synthesis.');
    }
  };

  // Play / Pause toggle
  const handlePlayPause = () => {
    if (isPlaying) {
      demoAudioService.pause();
      setIsPlaying(false);
    } else {
      if (demoAudioService.isPausedState()) {
        demoAudioService.resume();
        setIsPlaying(true);
      } else {
        startAudioPlayback(
          currentAudioText || composerText,
          selectedVoice,
          selectedLanguage,
          currentAudioUrl,
          isCurrentAudioFishAudio
        );
      }
    }
  };

  const handleRestart = () => {
    demoAudioService.stop();
    startAudioPlayback(
      currentAudioText || composerText,
      selectedVoice,
      selectedLanguage,
      currentAudioUrl,
      isCurrentAudioFishAudio
    );
  };

  const handleSpeedChange = (speed: number) => {
    setPlaybackRate(speed);
    demoAudioService.setPlaybackRate(speed);
  };

  const handleSeek = (pct: number) => {
    setProgress(pct);
    setCurrentTime(duration * pct);
    demoAudioService.seek(pct);
  };

  // Replay message from recent list (Preserves real Fish Audio MP3 if recorded)
  const handlePlayRecentMessage = (msg: RecentMessage) => {
    setCurrentlyPlayingMessageId(msg.id);
    const voiceObj = availableVoices.find((v) => v.id === msg.voiceId) || selectedVoice;
    setSelectedVoice(voiceObj);
    setSelectedLanguage(msg.language);
    setCurrentAudioUrl(msg.audioUrl);
    startAudioPlayback(msg.text, voiceObj, msg.language, msg.audioUrl, Boolean(msg.isFishAudio));
  };

  // Load message into composer
  const handleUseRecentMessage = (msg: RecentMessage) => {
    setComposerText(msg.text);
    setSelectedLanguage(msg.language);
    const voiceObj = availableVoices.find((v) => v.id === msg.voiceId) || selectedVoice;
    setSelectedVoice(voiceObj);
    setActiveTab('home');
    addToast('info', 'Loaded into Composer', 'Message copied to composer.');
  };

  const handleDeleteRecentMessage = (id: string) => {
    setRecentMessages((prev) => prev.filter((m) => m.id !== id));
    if (currentlyPlayingMessageId === id) {
      demoAudioService.stop();
      setIsPlaying(false);
      setCurrentlyPlayingMessageId(null);
    }
  };

  const handleClearAllRecent = () => {
    demoAudioService.stop();
    setIsPlaying(false);
    setRecentMessages([]);
    addToast('info', 'History Cleared', 'All recent voice messages have been removed.');
  };

  // Save phrase to Quick Phrases
  const handleSaveQuickPhrase = (phraseText: string, lang: Language) => {
    const existing = quickPhrases.find((p) => p.text.toLowerCase() === phraseText.toLowerCase());
    if (existing) {
      if (!existing.isFavorite) {
        setQuickPhrases((prev) =>
          prev.map((p) => (p.id === existing.id ? { ...p, isFavorite: true } : p))
        );
      }
      addToast('info', 'Already in Library', 'Phrase is marked as favorite.');
      return;
    }

    const newPhrase: QuickPhrase = {
      id: 'qp-' + Date.now(),
      text: phraseText,
      language: lang,
      category: lang === 'en' ? 'General' : 'Hindi & Hinglish',
      isFavorite: true,
      usageCount: 1
    };

    setQuickPhrases((prev) => [newPhrase, ...prev]);
    addToast('success', 'Phrase Saved to Favorites', 'Now accessible in your shortcut bar.');
  };

  const handleToggleFavoritePhrase = (id: string) => {
    setQuickPhrases((prev) =>
      prev.map((p) => (p.id === id ? { ...p, isFavorite: !p.isFavorite } : p))
    );
  };

  const handleAddCustomPhrase = (phrase: Omit<QuickPhrase, 'id' | 'usageCount'>) => {
    const newPhrase: QuickPhrase = {
      ...phrase,
      id: 'qp-' + Date.now(),
      usageCount: 0
    };
    setQuickPhrases((prev) => [newPhrase, ...prev]);
    addToast('success', 'Quick Phrase Created', `Added "${phrase.text}" to ${phrase.category}.`);
  };

  const handleDeletePhrase = (id: string) => {
    setQuickPhrases((prev) => prev.filter((p) => p.id !== id));
  };

  const handleUsePhraseInComposer = (phrase: QuickPhrase, autoSpeak = false) => {
    setComposerText(phrase.text);
    setSelectedLanguage(phrase.language);
    setActiveTab('home');

    // Update usage count
    setQuickPhrases((prev) =>
      prev.map((p) => (p.id === phrase.id ? { ...p, usageCount: p.usageCount + 1 } : p))
    );

    if (autoSpeak) {
      handleGenerateVoice(phrase.text, phrase.language);
    }
  };

  // Voice library selection
  const handleSelectVoice = (voice: Voice) => {
    setSelectedVoice(voice);
    if (voice.language !== 'multilingual') {
      setSelectedLanguage(voice.language);
    }
    addToast('success', 'Active Voice Set', `${voice.name} (${voice.accent}) is now active.`);
  };

  // Audition preview in Voice Library (Plays real Fish Audio if model verified)
  const handlePreviewVoiceSample = async (voiceId: string, sampleText: string, lang: Language) => {
    if (isPlayingPreview && previewingVoiceId === voiceId) {
      demoAudioService.stop();
      setIsPlayingPreview(false);
      setPreviewingVoiceId(null);
      return;
    }

    const voiceObj = availableVoices.find((v) => v.id === voiceId) || selectedVoice;
    setPreviewingVoiceId(voiceId);
    setIsPlayingPreview(true);

    // If verified Fish Audio voice and backend configured, try real Fish Audio synthesis
    if (voiceObj.fishAudioReferenceId && isFishAudioConfigured) {
      const res = await fishAudioService.synthesizeSpeech({
        text: sampleText,
        referenceId: voiceObj.fishAudioReferenceId
      });

      if (res.success && res.audioUrl) {
        setIsCurrentAudioFishAudio(true);
        startAudioPlayback(sampleText, voiceObj, lang, res.audioUrl, true, () => {
          setIsPlayingPreview(false);
          setPreviewingVoiceId(null);
        });
        return;
      }
    }

    // Otherwise fallback to browser demo speech
    setIsCurrentAudioFishAudio(false);
    startAudioPlayback(sampleText, voiceObj, lang, undefined, false, () => {
      setIsPlayingPreview(false);
      setPreviewingVoiceId(null);
    });
  };

  const favoritesCount = quickPhrases.filter((p) => p.isFavorite).length;

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-navy-900 flex font-sans selection:bg-brand-500 selection:text-white">
      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          demoAudioService.stop();
          setIsPlaying(false);
        }}
        isOpenMobile={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
        favoritesCount={favoritesCount}
        isFishAudioConfigured={isFishAudioConfigured}
        fishAudioModel={fishAudioModel}
      />

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-72 flex flex-col min-w-0 min-h-screen">
        {/* Sticky Header */}
        <Header
          activeTab={activeTab}
          onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
          activeVoice={selectedVoice}
          activeLanguage={selectedLanguage}
          onTabChange={setActiveTab}
          isFishAudioConfigured={isFishAudioConfigured}
          fishAudioModel={fishAudioModel}
        />

        {/* Dynamic View Body */}
        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto">
          {activeTab === 'home' && (
            <HomeView
              composerText={composerText}
              onComposerTextChange={setComposerText}
              selectedLanguage={selectedLanguage}
              onLanguageChange={setSelectedLanguage}
              selectedVoice={selectedVoice}
              onVoiceChange={setSelectedVoice}
              availableVoices={availableVoices}
              quickPhrases={quickPhrases}
              onGenerateVoice={handleGenerateVoice}
              isGenerating={isGenerating}
              onSaveQuickPhrase={handleSaveQuickPhrase}
              
              isPlaying={isPlaying}
              currentTime={currentTime}
              duration={duration}
              progress={progress}
              playbackRate={playbackRate}
              currentAudioText={currentAudioText}
              isFishAudio={isCurrentAudioFishAudio}
              fishAudioModel={fishAudioModel}
              onPlayPause={handlePlayPause}
              onRestart={handleRestart}
              onSpeedChange={handleSpeedChange}
              onSeek={handleSeek}

              recentMessages={recentMessages}
              onPlayRecentMessage={handlePlayRecentMessage}
              onUseRecentMessage={handleUseRecentMessage}
              onDeleteRecentMessage={handleDeleteRecentMessage}
              onClearAllRecentMessages={handleClearAllRecent}
              currentlyPlayingMessageId={currentlyPlayingMessageId}
            />
          )}

          {activeTab === 'my-voice' && (
            <MyVoiceView
              userProfile={userProfile}
              onUpdateProfile={(updated) => {
                setUserProfile((prev) => ({ ...prev, ...updated }));
                addToast('success', 'Profile Updated', 'Voice calibration vector adjusted.');
              }}
              onTestVoice={(sample) => {
                handleGenerateVoice(sample);
              }}
              isPlayingTest={isPlaying}
            />
          )}

          {activeTab === 'quick-phrases' && (
            <QuickPhrasesView
              phrases={quickPhrases}
              onToggleFavorite={handleToggleFavoritePhrase}
              onAddPhrase={handleAddCustomPhrase}
              onDeletePhrase={handleDeletePhrase}
              onUsePhraseInComposer={handleUsePhraseInComposer}
            />
          )}

          {activeTab === 'voice-library' && (
            <VoiceLibraryView
              voices={availableVoices}
              activeVoice={selectedVoice}
              onSelectVoice={handleSelectVoice}
              onPreviewVoiceSample={handlePreviewVoiceSample}
              previewingVoiceId={previewingVoiceId}
              isPlayingPreview={isPlayingPreview}
            />
          )}

          {activeTab === 'settings' && (
            <SettingsView
              defaultLanguage={selectedLanguage}
              onDefaultLanguageChange={(lang) => {
                setSelectedLanguage(lang);
                addToast('info', 'Default Language Set', `Default language is now ${lang.toUpperCase()}`);
              }}
              recentMessages={recentMessages}
              onClearAllHistory={handleClearAllRecent}
            />
          )}
        </main>
      </div>

      {/* Floating Notifications Toast Container */}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />
    </div>
  );
}

export default App;
