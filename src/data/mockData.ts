import { Voice, QuickPhrase, RecentMessage, UserVoiceProfile, EmotionOption, MoodPreset } from '../types';

export const EMOTION_OPTIONS: EmotionOption[] = [
  {
    id: 'happy',
    label: 'Happy',
    emoji: '😊',
    tag: 'happy, cheerful',
    description: 'Upbeat, radiant, and optimistic with positive inflections',
    color: 'from-amber-400 to-orange-500',
    accentColor: '#F59E0B',
    badgeBg: 'bg-amber-50',
    badgeBorder: 'border-amber-200'
  },
  {
    id: 'calm',
    label: 'Calm',
    emoji: '😌',
    tag: 'calm, peaceful, soothing',
    description: 'Peaceful, centered, and relaxing with steady pacing',
    color: 'from-teal-400 to-emerald-500',
    accentColor: '#10B981',
    badgeBg: 'bg-teal-50',
    badgeBorder: 'border-teal-200'
  },
  {
    id: 'empathetic',
    label: 'Warm & Empathetic',
    emoji: '🤗',
    tag: 'warm, compassionate, gentle',
    description: 'Compassionate, supportive, and sincere with soothing care',
    color: 'from-rose-400 to-pink-500',
    accentColor: '#EC4899',
    badgeBg: 'bg-rose-50',
    badgeBorder: 'border-rose-200'
  },
  {
    id: 'excited',
    label: 'Excited',
    emoji: '🎉',
    tag: 'excited, enthusiastic, high energy',
    description: 'Vibrant, high energy, and celebratory with spirited cadence',
    color: 'from-fuchsia-500 to-purple-600',
    accentColor: '#D946EF',
    badgeBg: 'bg-fuchsia-50',
    badgeBorder: 'border-fuchsia-200'
  },
  {
    id: 'confident',
    label: 'Confident',
    emoji: '💪',
    tag: 'confident, bold, decisive',
    description: 'Direct, assured, and commanding with strong vocal presence',
    color: 'from-blue-500 to-indigo-600',
    accentColor: '#3B82F6',
    badgeBg: 'bg-blue-50',
    badgeBorder: 'border-blue-200'
  },
  {
    id: 'professional',
    label: 'Professional',
    emoji: '🧑‍💼',
    tag: 'professional, articulate, executive',
    description: 'Polished, articulate, and business-ready with crisp diction',
    color: 'from-slate-600 to-navy-800',
    accentColor: '#475569',
    badgeBg: 'bg-slate-50',
    badgeBorder: 'border-slate-200'
  },
  {
    id: 'storytelling',
    label: 'Storytelling',
    emoji: '📖',
    tag: 'storytelling, narrative flow, expressive',
    description: 'Engaging, narrative, and immersive with dynamic tonal shifts',
    color: 'from-violet-500 to-purple-700',
    accentColor: '#8B5CF6',
    badgeBg: 'bg-violet-50',
    badgeBorder: 'border-violet-200'
  },
  {
    id: 'sad',
    label: 'Sad / Emotional',
    emoji: '😢',
    tag: 'sad, tender, emotional',
    description: 'Tender, vulnerable, and poignant with subtle softness',
    color: 'from-sky-400 to-blue-500',
    accentColor: '#0EA5E9',
    badgeBg: 'bg-sky-50',
    badgeBorder: 'border-sky-200'
  },
  {
    id: 'dramatic',
    label: 'Dramatic',
    emoji: '✨',
    tag: 'dramatic, intense, theatrical',
    description: 'Theatrical, suspenseful, and cinematic with compelling pauses',
    color: 'from-indigo-600 to-violet-900',
    accentColor: '#6366F1',
    badgeBg: 'bg-indigo-50',
    badgeBorder: 'border-indigo-200'
  },
  {
    id: 'friendly',
    label: 'Friendly',
    emoji: '🙂',
    tag: 'friendly, approachable, conversational',
    description: 'Warm, casual, and approachable for natural conversation',
    color: 'from-amber-400 to-yellow-500',
    accentColor: '#EAB308',
    badgeBg: 'bg-yellow-50',
    badgeBorder: 'border-yellow-200'
  }
];

export const MOOD_PRESETS: MoodPreset[] = [
  {
    id: 'preset-morning-greeting',
    title: 'Morning Greeting',
    subtitle: 'Upbeat and refreshing welcome',
    icon: '☀️',
    emotion: 'happy',
    intensity: 'balanced',
    recommendedVoiceId: 'ananya-in',
    sampleText: 'Good morning! Wishing you a brilliant and productive day ahead.'
  },
  {
    id: 'preset-friendly-chat',
    title: 'Friendly Conversation',
    subtitle: 'Casual and warm peer dialogue',
    icon: '💬',
    emotion: 'friendly',
    intensity: 'balanced',
    recommendedVoiceId: 'priya-hinglish',
    sampleText: 'Hey there! Kaise ho? Catch up karte hain thodi der mein.'
  },
  {
    id: 'preset-calm-explanation',
    title: 'Calm Explanation',
    subtitle: 'Clear, patient, and soothing guidance',
    icon: '🌿',
    emotion: 'calm',
    intensity: 'subtle',
    recommendedVoiceId: 'meera-hinglish',
    sampleText: 'Take your time. Let us walk through each step together calmly.'
  },
  {
    id: 'preset-pro-announcement',
    title: 'Professional Announcement',
    subtitle: 'Polished executive clarity',
    icon: '📢',
    emotion: 'professional',
    intensity: 'balanced',
    recommendedVoiceId: 'elena-global',
    sampleText: 'We are pleased to introduce our latest product milestone to all stakeholders.'
  },
  {
    id: 'preset-emotional-story',
    title: 'Emotional Story',
    subtitle: 'Deeply expressive narrative',
    icon: '🎭',
    emotion: 'storytelling',
    intensity: 'expressive',
    recommendedVoiceId: 'kabir-hindi',
    sampleText: 'रात गहरी थी, और हवा में एक अजीब सी खामोशी तैर रही थी...'
  },
  {
    id: 'preset-energetic-pitch',
    title: 'Energetic Presentation',
    subtitle: 'High energy and enthusiastic delivery',
    icon: '⚡',
    emotion: 'excited',
    intensity: 'expressive',
    recommendedVoiceId: 'aarav-in',
    sampleText: 'Welcome everyone! Today we are unveiling the next evolution of voice intelligence!'
  },
  {
    id: 'preset-reassurance',
    title: 'Reassuring Message',
    subtitle: 'Gentle empathy and calm reassurance',
    icon: '🛡️',
    emotion: 'empathetic',
    intensity: 'balanced',
    recommendedVoiceId: 'meera-hinglish',
    sampleText: 'Everything is in order. We have your back and will handle this smoothly.'
  },
  {
    id: 'preset-celebration',
    title: 'Celebration',
    subtitle: 'Joyful shoutout and festive cheers',
    icon: '🎉',
    emotion: 'excited',
    intensity: 'expressive',
    recommendedVoiceId: 'rohan-hi',
    sampleText: 'Congratulations team! We did it, let’s celebrate this amazing milestone!'
  }
];

export const INITIAL_VOICES: Voice[] = [
  {
    id: 'my-voiceprint-1',
    name: 'My Voiceprint',
    gender: 'neutral',
    accent: 'Personal (Fish Audio Base)',
    language: 'multilingual',
    tone: 'Adaptive Base Model',
    description: 'Custom profile leveraging Fish Audio foundation model with adaptive calibration vectors.',
    avatar: '🎙️',
    color: 'from-violet-500 to-indigo-600',
    isCustom: true,
    isVerifiedFishAudio: true,
    sampleAudioText: 'Hello, this is a test of my customized Voiceprint synthesis.',
    tags: ['Custom Voiceprint', 'Fish Audio Live', 'Adaptive', 'Bilingual'],
    isFavorite: true
  },
  {
    id: 'aarav-in',
    fishAudioReferenceId: '802e3bc2b27e49c2995d23ef70e6ac89',
    isVerifiedFishAudio: true,
    name: 'Aarav',
    gender: 'male',
    accent: 'Clear & Energetic English',
    language: 'en',
    tone: 'Confident & Clear',
    description: 'A grounded and crisp voice, verified on Fish Audio (Energetic Male model).',
    avatar: '👨🏽',
    color: 'from-amber-500 to-orange-600',
    sampleAudioText: 'Hello! I hope you are having an inspired and productive day.',
    tags: ['Fish Audio Live', 'Conversational', 'Confident', 'Clear'],
    isFavorite: true
  },
  {
    id: 'ananya-in',
    fishAudioReferenceId: '933563129e564b19a115bedd57b7406a',
    isVerifiedFishAudio: true,
    name: 'Ananya',
    gender: 'female',
    accent: 'Natural Studio English',
    language: 'en',
    tone: 'Warm & Bright',
    description: 'Upbeat and crystal-clear articulation, verified on Fish Audio (Sarah model).',
    avatar: '👩🏽',
    color: 'from-pink-500 to-rose-600',
    sampleAudioText: 'Hey there! Tell me what you need and I will help you craft it.',
    tags: ['Fish Audio Live', 'Modern', 'Friendly', 'Warm'],
    isFavorite: true
  },
  {
    id: 'priya-hinglish',
    fishAudioReferenceId: '4d7609058bd34213b1378b29efbde1f1',
    isVerifiedFishAudio: true,
    name: 'Priya',
    gender: 'female',
    accent: 'Conversational Hindi & Hinglish',
    language: 'hinglish',
    tone: 'Casual & Youthful',
    description: 'Fluid colloquial cadence for Hindi & Hinglish, verified on Fish Audio.',
    avatar: '✨',
    color: 'from-purple-500 to-brand-600',
    sampleAudioText: 'Arre, don’t worry! Hum isko easily solve kar lenge.',
    tags: ['Fish Audio Live', 'Hinglish', 'Expressive', 'Youthful'],
    isFavorite: true
  },
  {
    id: 'kabir-hindi',
    fishAudioReferenceId: '2e88923b8e4c4b49b9595397d7d6ccbc',
    isVerifiedFishAudio: true,
    name: 'Kabir',
    gender: 'male',
    accent: 'Resonant Hindustani',
    language: 'hi',
    tone: 'Deep & Storyteller',
    description: 'Resonant Devanagari pronunciation with poetic depth, verified on Fish Audio.',
    avatar: '🌟',
    color: 'from-teal-500 to-emerald-600',
    sampleAudioText: 'नमस्ते, मैं आपकी सहायता के लिए सदैव उपलब्ध हूँ।',
    tags: ['Fish Audio Live', 'Deep', 'Storytelling', 'Resonant']
  },
  {
    id: 'meera-hinglish',
    fishAudioReferenceId: '1600f0a2e2af4ef3af1b350367683ede',
    isVerifiedFishAudio: true,
    name: 'Meera',
    gender: 'female',
    accent: 'Bilingual Hinglish / English',
    language: 'hinglish',
    tone: 'Empathetic & Calm',
    description: 'Gentle, thoughtful communication with soft inflections, verified on Fish Audio.',
    avatar: '💼',
    color: 'from-blue-500 to-cyan-600',
    sampleAudioText: 'Meeting reschedule ho gayi hai, please ek baar check kar lijiye.',
    tags: ['Fish Audio Live', 'Empathetic', 'Calm', 'Bilingual']
  },
  {
    id: 'rohan-hi',
    fishAudioReferenceId: '528f686ef2154885b368dd4b93fb8728',
    isVerifiedFishAudio: true,
    name: 'Rohan',
    gender: 'male',
    accent: 'Energetic Hindi & Hinglish',
    language: 'hi',
    tone: 'High Energy & Cheerful',
    description: 'Vibrant and expressive tone for dynamic speech, verified on Fish Audio.',
    avatar: '🎧',
    color: 'from-amber-600 to-yellow-500',
    sampleAudioText: 'सब बढ़िया है भाई! चलो आज शाम को मिलते हैं।',
    tags: ['Fish Audio Live', 'Excited', 'Casual', 'Lively']
  },
  {
    id: 'elena-global',
    fishAudioReferenceId: '711cf3ed00ab441a8f54a45058047b7a',
    isVerifiedFishAudio: true,
    name: 'Elena',
    gender: 'female',
    accent: 'International English (Verity)',
    language: 'en',
    tone: 'Professional & Elegant',
    description: 'Polished studio narrator cadence, verified on Fish Audio (Verity model).',
    avatar: '🌐',
    color: 'from-indigo-500 to-sky-600',
    sampleAudioText: 'Welcome to Voiceprint. Your personal identity in any room.',
    tags: ['Fish Audio Live', 'Professional', 'Studio', 'Articulate']
  }
];

export const INITIAL_QUICK_PHRASES: QuickPhrase[] = [
  {
    id: 'qp-1',
    text: 'Hello, how can I help?',
    language: 'en',
    category: 'Greetings',
    isFavorite: true,
    usageCount: 48
  },
  {
    id: 'qp-2',
    text: 'Please give me a moment',
    language: 'en',
    category: 'Reassurance',
    isFavorite: true,
    usageCount: 39
  },
  {
    id: 'qp-3',
    text: 'Thank you',
    language: 'en',
    category: 'Thank You',
    isFavorite: true,
    usageCount: 61
  },
  {
    id: 'qp-4',
    text: 'Mujhe thoda waqt chahiye',
    language: 'hinglish',
    category: 'Daily Conversation',
    isFavorite: true,
    usageCount: 34
  },
  {
    id: 'qp-5',
    text: 'Main yahan hoon',
    language: 'hinglish',
    category: 'Greetings',
    isFavorite: true,
    usageCount: 36
  },
  {
    id: 'qp-6',
    text: 'Namaste! Aap sabhi ka swagat hai.',
    language: 'hi',
    category: 'Greetings',
    isFavorite: false,
    usageCount: 22
  },
  {
    id: 'qp-7',
    text: 'I have reviewed the proposal and it looks great.',
    language: 'en',
    category: 'Work & Professional',
    isFavorite: false,
    usageCount: 25
  },
  {
    id: 'qp-8',
    text: 'Bohot bohot dhanyawaad aapki help ke liye!',
    language: 'hinglish',
    category: 'Thank You',
    isFavorite: false,
    usageCount: 19
  },
  {
    id: 'qp-9',
    text: 'Don’t worry, everything is under control.',
    language: 'en',
    category: 'Reassurance',
    isFavorite: false,
    usageCount: 17
  },
  {
    id: 'qp-10',
    text: 'Chalo milke isko resolve karte hain.',
    language: 'hinglish',
    category: 'Daily Conversation',
    isFavorite: false,
    usageCount: 28
  }
];

export const INITIAL_RECENT_MESSAGES: RecentMessage[] = [
  {
    id: 'rm-1',
    text: 'Good morning everyone! Welcome to Voiceprint 2.0 Emotion Studio.',
    language: 'en',
    voiceId: 'ananya-in',
    voiceName: 'Ananya',
    timestamp: 'Just now',
    durationSeconds: 4,
    emotion: 'happy',
    intensity: 'balanced',
    isFishAudio: true,
    modelUsed: 's2.1-pro-free'
  },
  {
    id: 'rm-2',
    text: 'Arre, don’t take any tension! Hum isko smoothly handle kar lenge.',
    language: 'hinglish',
    voiceId: 'priya-hinglish',
    voiceName: 'Priya',
    timestamp: '10 mins ago',
    durationSeconds: 3,
    emotion: 'empathetic',
    intensity: 'balanced',
    isFishAudio: false
  },
  {
    id: 'rm-3',
    text: 'Please give me a moment to double-check the final numbers.',
    language: 'en',
    voiceId: 'aarav-in',
    voiceName: 'Aarav',
    timestamp: '1 hour ago',
    durationSeconds: 3,
    emotion: 'calm',
    intensity: 'subtle',
    isFishAudio: true,
    modelUsed: 's2.1-pro-free'
  }
];

export const DEFAULT_USER_PROFILE: UserVoiceProfile = {
  id: 'usr-voice-01',
  name: 'Personal Voice Studio Profile',
  status: 'ready',
  samplesCount: 3,
  pitch: 0,
  speed: 1.0,
  clarity: 96,
  stability: 94,
  referenceAudioName: 'studio_calibration_sample_01.wav',
  createdAt: '2026-10-24'
};

export const LANGUAGE_OPTIONS: { id: 'en' | 'hi' | 'hinglish'; label: string; native: string; badge: string }[] = [
  { id: 'en', label: 'English', native: 'English (Global / IN)', badge: 'EN' },
  { id: 'hi', label: 'Hindi', native: 'हिंदी (Devanagari)', badge: 'HI' },
  { id: 'hinglish', label: 'Hinglish', native: 'Hinglish (Colloquial)', badge: 'HN-EN' },
];
