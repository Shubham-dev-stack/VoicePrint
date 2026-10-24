export type Language = 'en' | 'hi' | 'hinglish';

export type EmotionType = 
  | 'happy' 
  | 'calm' 
  | 'empathetic' 
  | 'excited' 
  | 'confident' 
  | 'professional' 
  | 'storytelling' 
  | 'sad' 
  | 'dramatic' 
  | 'friendly';

export type EmotionIntensity = 'subtle' | 'balanced' | 'expressive';

export interface EmotionOption {
  id: EmotionType;
  label: string;
  emoji: string;
  tag: string;
  description: string;
  color: string;
  accentColor: string;
  badgeBg: string;
  badgeBorder: string;
}

export interface MoodPreset {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  emotion: EmotionType;
  intensity: EmotionIntensity;
  recommendedVoiceId: string;
  sampleText: string;
}

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
  isFavorite?: boolean;
}

export type QuickPhraseCategory = 
  | 'Greetings' 
  | 'Daily Conversation' 
  | 'Work & Professional' 
  | 'Thank You' 
  | 'Reassurance'
  | 'General'
  | 'Hindi & Hinglish'
  | 'Assistance'
  | 'Work';

export interface QuickPhrase {
  id: string;
  text: string;
  language: Language;
  category: QuickPhraseCategory;
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
  emotion?: EmotionType;
  intensity?: EmotionIntensity;
  isFavorite?: boolean;
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
  recordedBlobUrl?: string;
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
  currentEmotion?: EmotionType;
}

export interface VoiceComparisonItem {
  id: string;
  label: string; // "Option A" vs "Option B"
  voiceId: string;
  voiceName: string;
  emotion: EmotionType;
  intensity: EmotionIntensity;
  audioUrl?: string;
  duration?: number;
  isLoading?: boolean;
  error?: string;
  isFishAudio?: boolean;
  modelUsed?: string;
}

export type ActiveTab = 'home' | 'my-voice' | 'quick-phrases' | 'voice-library' | 'settings';
