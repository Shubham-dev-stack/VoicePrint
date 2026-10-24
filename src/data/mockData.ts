import { Voice, QuickPhrase, RecentMessage, UserVoiceProfile } from '../types';

export const INITIAL_VOICES: Voice[] = [
  {
    id: 'my-voiceprint-1',
    name: 'My Voiceprint (Custom)',
    gender: 'neutral',
    accent: 'Personal (Fish Audio Base)',
    language: 'multilingual',
    tone: 'Natural (Base Model)',
    description: 'Uses Fish Audio base model TTS until your personalized voice model is cloned.',
    avatar: '🎙️',
    color: 'from-violet-500 to-indigo-600',
    isCustom: true,
    isVerifiedFishAudio: true,
    sampleAudioText: 'Hello, this is a test of the Fish Audio voiceprint synthesis.',
    tags: ['Custom Voiceprint', 'Fish Audio', 'Base Model']
  },
  {
    id: 'aarav-in',
    fishAudioReferenceId: '802e3bc2b27e49c2995d23ef70e6ac89',
    isVerifiedFishAudio: true,
    name: 'Aarav',
    gender: 'male',
    accent: 'Clear & Energetic',
    language: 'en',
    tone: 'Calm & Warm',
    description: 'A grounded and clear voice, verified on Fish Audio (Energetic Male model).',
    avatar: '👨🏽',
    color: 'from-amber-500 to-orange-600',
    sampleAudioText: 'Hello! I hope you are having a wonderful, productive day.',
    tags: ['Fish Audio Live', 'Conversational', 'Clear']
  },
  {
    id: 'ananya-in',
    fishAudioReferenceId: '933563129e564b19a115bedd57b7406a',
    isVerifiedFishAudio: true,
    name: 'Ananya',
    gender: 'female',
    accent: 'Natural English (Sarah)',
    language: 'en',
    tone: 'Expressive & Bright',
    description: 'Upbeat and clear articulation, verified on Fish Audio (Sarah model).',
    avatar: '👩🏽',
    color: 'from-pink-500 to-rose-600',
    sampleAudioText: 'Hey there! Let me know what you need and I will handle it.',
    tags: ['Fish Audio Live', 'Modern', 'Friendly']
  },
  {
    id: 'priya-hinglish',
    fishAudioReferenceId: '4d7609058bd34213b1378b29efbde1f1',
    isVerifiedFishAudio: true,
    name: 'Priya',
    gender: 'female',
    accent: 'Conversational Hindi / Hinglish',
    language: 'hinglish',
    tone: 'Casual & Youthful',
    description: 'Natural cadence for Hindi & Hinglish, verified on Fish Audio (Girl Hindi model).',
    avatar: '✨',
    color: 'from-purple-500 to-brand-600',
    sampleAudioText: 'Arre, don’t worry! Hum isko easily solve kar lenge.',
    tags: ['Fish Audio Live', 'Hinglish', 'Expressive']
  },
  {
    id: 'kabir-hindi',
    fishAudioReferenceId: '2e88923b8e4c4b49b9595397d7d6ccbc',
    isVerifiedFishAudio: true,
    name: 'Kabir',
    gender: 'male',
    accent: 'Resonant Hindi / Hinglish',
    language: 'hi',
    tone: 'Polite & Resonant',
    description: 'Resonant Hindustani pronunciation, verified on Fish Audio (Hindi male model).',
    avatar: '🌟',
    color: 'from-teal-500 to-emerald-600',
    sampleAudioText: 'नमस्ते, मैं आपकी सहायता के लिए सदैव उपलब्ध हूँ।',
    tags: ['Fish Audio Live', 'Deep', 'Respectful']
  },
  {
    id: 'meera-hinglish',
    fishAudioReferenceId: '1600f0a2e2af4ef3af1b350367683ede',
    isVerifiedFishAudio: true,
    name: 'Meera',
    gender: 'female',
    accent: 'Bilingual Hinglish / English',
    language: 'hinglish',
    tone: 'Gentle & Professional',
    description: 'Polite Hindi and smooth English communication, verified on Fish Audio.',
    avatar: '💼',
    color: 'from-blue-500 to-cyan-600',
    sampleAudioText: 'Meeting reschedule ho gayi hai, please ek baar check kar lijiye.',
    tags: ['Fish Audio Live', 'Warm', 'Bilingual']
  },
  {
    id: 'rohan-hi',
    fishAudioReferenceId: '528f686ef2154885b368dd4b93fb8728',
    isVerifiedFishAudio: true,
    name: 'Rohan',
    gender: 'male',
    accent: 'Conversational Hindi',
    language: 'hi',
    tone: 'Energetic & Cheerful',
    description: 'Friendly and expressive tone, verified on Fish Audio (Gojo Hindi model).',
    avatar: '🎧',
    color: 'from-amber-600 to-yellow-500',
    sampleAudioText: 'सब बढ़िया है भाई! चलो आज शाम को मिलते हैं।',
    tags: ['Fish Audio Live', 'Casual', 'Lively']
  },
  {
    id: 'elena-global',
    fishAudioReferenceId: '711cf3ed00ab441a8f54a45058047b7a',
    isVerifiedFishAudio: true,
    name: 'Elena',
    gender: 'female',
    accent: 'Studio English (Verity)',
    language: 'en',
    tone: 'Polished & Elegant',
    description: 'Clear studio pronunciation, verified on Fish Audio (Verity model).',
    avatar: '🌐',
    color: 'from-indigo-500 to-sky-600',
    sampleAudioText: 'Welcome to Voiceprint. Your personal identity in any room.',
    tags: ['Fish Audio Live', 'Studio', 'Crisp']
  }
];

export const INITIAL_QUICK_PHRASES: QuickPhrase[] = [
  {
    id: 'qp-1',
    text: 'Hello, how can I help?',
    language: 'en',
    category: 'General',
    isFavorite: true,
    usageCount: 42
  },
  {
    id: 'qp-2',
    text: 'Please give me a moment',
    language: 'en',
    category: 'Assistance',
    isFavorite: true,
    usageCount: 38
  },
  {
    id: 'qp-3',
    text: 'Thank you',
    language: 'en',
    category: 'General',
    isFavorite: true,
    usageCount: 56
  },
  {
    id: 'qp-4',
    text: 'Mujhe thoda waqt chahiye',
    language: 'hinglish',
    category: 'Hindi & Hinglish',
    isFavorite: true,
    usageCount: 29
  },
  {
    id: 'qp-5',
    text: 'Main yahan hoon',
    language: 'hinglish',
    category: 'Hindi & Hinglish',
    isFavorite: true,
    usageCount: 31
  },
  {
    id: 'qp-6',
    text: 'Aap kaise hain?',
    language: 'hinglish',
    category: 'Hindi & Hinglish',
    isFavorite: false,
    usageCount: 19
  },
  {
    id: 'qp-7',
    text: 'नमस्ते, आपका दिन शुभ हो।',
    language: 'hi',
    category: 'Hindi & Hinglish',
    isFavorite: false,
    usageCount: 15
  },
  {
    id: 'qp-8',
    text: 'I am on my way, will reach in 10 minutes.',
    language: 'en',
    category: 'Work',
    isFavorite: false,
    usageCount: 23
  },
  {
    id: 'qp-9',
    text: 'Could you please repeat that?',
    language: 'en',
    category: 'Assistance',
    isFavorite: false,
    usageCount: 18
  },
  {
    id: 'qp-10',
    text: 'Sab theek hai, don’t take any tension.',
    language: 'hinglish',
    category: 'Hindi & Hinglish',
    isFavorite: false,
    usageCount: 27
  }
];

export const INITIAL_RECENT_MESSAGES: RecentMessage[] = [
  {
    id: 'rm-1',
    text: 'Hello everyone! I am speaking through my custom Voiceprint today.',
    language: 'en',
    voiceId: 'my-voiceprint-1',
    voiceName: 'My Voiceprint',
    timestamp: 'Just now',
    durationSeconds: 4
  },
  {
    id: 'rm-2',
    text: 'Mujhe thoda waqt chahiye, main review karke batata hoon.',
    language: 'hinglish',
    voiceId: 'priya-hinglish',
    voiceName: 'Priya',
    timestamp: '15 mins ago',
    durationSeconds: 3
  },
  {
    id: 'rm-3',
    text: 'Please give me a moment to double-check these numbers.',
    language: 'en',
    voiceId: 'aarav-in',
    voiceName: 'Aarav',
    timestamp: '2 hours ago',
    durationSeconds: 3
  },
  {
    id: 'rm-4',
    text: 'नमस्ते, धन्यवाद इस बेहतरीन मीटिंग के लिए।',
    language: 'hi',
    voiceId: 'kabir-hindi',
    voiceName: 'Kabir',
    timestamp: 'Yesterday',
    durationSeconds: 4
  }
];

export const DEFAULT_USER_PROFILE: UserVoiceProfile = {
  id: 'usr-voice-01',
  name: 'Demo Voiceprint Profile (Prototype)',
  status: 'ready',
  samplesCount: 4,
  pitch: 0,
  speed: 1.0,
  clarity: 94,
  stability: 92,
  referenceAudioName: 'voice_calibration_sample_clean.wav',
  createdAt: '2026-10-22'
};

export const LANGUAGE_OPTIONS: { id: 'en' | 'hi' | 'hinglish'; label: string; native: string; badge: string }[] = [
  { id: 'en', label: 'English', native: 'English (IN/Global)', badge: 'EN' },
  { id: 'hi', label: 'Hindi', native: 'हिंदी (Devanagari)', badge: 'HI' },
  { id: 'hinglish', label: 'Hinglish', native: 'Hinglish (Conversational)', badge: 'HN-EN' },
];
