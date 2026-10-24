export type Language = 'en' | 'hi' | 'hinglish';

export interface Voice {
  id: string;
  fishAudioReferenceId?: string; // Verified Fish Audio model ID from https://api.fish.audio/model
  isVerifiedFishAudio?: boolean;
  name: string;
  gender: 'male' | 'female' | 'neutral';
  accent: string;
  language: Language | 'multilingual';
  tone: string;
  description: string;
  avatar: string;
  color: string;
  isCustom?: boolean;
  sampleAudioText: string;
  tags: string[];
}

export interface QuickPhrase {
  id: string;
  text: string;
  language: Language;
  category: 'General' | 'Hindi & Hinglish' | 'Assistance' | 'Work';
  isFavorite: boolean;
  usageCount: number;
}

export interface RecentMessage {
  id: string;
  text: string;
  language: Language;
  voiceId: string;
  voiceName: string;
  timestamp: string;
  durationSeconds: number;
  audioUrl?: string; // Real MP3 blob URL from Fish Audio
  isFishAudio?: boolean;
  modelUsed?: string;
}

export interface UserVoiceProfile {
  id: string;
  name: string;
  status: 'ready' | 'recording' | 'processing' | 'uncalibrated';
  samplesCount: number;
  pitch: number; // -50 to +50
  speed: number; // 0.5 to 2.0
  clarity: number; // 0 to 100
  stability: number; // 0 to 100
  referenceAudioName?: string;
  createdAt: string;
}

export interface AudioPlaybackState {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  playbackRate: number;
  currentMessageText: string;
  currentVoiceId: string;
  currentLanguage: Language;
  isFishAudio: boolean;
}

export type ActiveTab = 'home' | 'my-voice' | 'quick-phrases' | 'voice-library' | 'settings';
