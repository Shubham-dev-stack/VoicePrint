import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Resolve directory name in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from server directory
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json({ limit: '1mb' }));

/**
 * Health & Configuration Status Check
 * NOTE: Never returns the raw API key to the client.
 */
app.get('/api/status', (_req: Request, res: Response) => {
  const apiKey = process.env.FISH_API_KEY?.trim();
  const isKeyConfigured = Boolean(
    apiKey && 
    apiKey.length > 10 && 
    !apiKey.includes('PASTE_YOUR')
  );
  const model = process.env.FISH_AUDIO_MODEL?.trim() || 's2.1-pro-free';

  res.json({
    status: 'ok',
    service: 'Voiceprint Backend',
    fishAudioConfigured: isKeyConfigured,
    model: model,
    timestamp: new Date().toISOString()
  });
});

/**
 * Query Verified Public Voice Models from Fish Audio
 */
app.get('/api/voices', async (_req: Request, res: Response) => {
  const apiKey = process.env.FISH_API_KEY?.trim();

  // Curated verified voices fallback
  const verifiedVoicesFallback = [
    {
      id: '802e3bc2b27e49c2995d23ef70e6ac89',
      title: 'Energetic Male (English)',
      language: 'en',
      gender: 'male',
      tags: ['clear', 'conversational', 'energetic']
    },
    {
      id: '933563129e564b19a115bedd57b7406a',
      title: 'Sarah (English)',
      language: 'en',
      gender: 'female',
      tags: ['warm', 'friendly', 'natural']
    },
    {
      id: '4d7609058bd34213b1378b29efbde1f1',
      title: 'Girl Hindi (Conversational)',
      language: 'hi',
      gender: 'female',
      tags: ['hindi', 'conversational', 'expressive']
    },
    {
      id: '2e88923b8e4c4b49b9595397d7d6ccbc',
      title: 'Resonant Hindi / Hinglish',
      language: 'hi',
      gender: 'male',
      tags: ['hindi', 'deep', 'bilingual']
    },
    {
      id: '711cf3ed00ab441a8f54a45058047b7a',
      title: 'Verity (English)',
      language: 'en',
      gender: 'male',
      tags: ['narrator', 'professional']
    }
  ];

  if (!apiKey || apiKey.includes('PASTE_YOUR')) {
    return res.json({ voices: verifiedVoicesFallback, isLive: false });
  }

  try {
    const upstreamRes = await fetch('https://api.fish.audio/model?page_size=15&sort_by=task_count', {
      headers: {
        'Authorization': `Bearer ${apiKey}`
      }
    });

    if (!upstreamRes.ok) {
      return res.json({ voices: verifiedVoicesFallback, isLive: false });
    }

    const data = (await upstreamRes.json()) as { items?: Array<{ _id: string; title: string; languages?: string[]; tags?: string[] }> };
    const items = data.items || [];
    const formatted = items.map(item => ({
      id: item._id,
      title: item.title,
      language: item.languages?.[0] || 'en',
      tags: item.tags || []
    }));

    res.json({ voices: formatted.length > 0 ? formatted : verifiedVoicesFallback, isLive: true });
  } catch (err) {
    console.warn('[Backend] Failed to fetch live voice models, using verified fallback list:', err);
    res.json({ voices: verifiedVoicesFallback, isLive: false });
  }
});

/**
 * Text-to-Speech Endpoint
 * Calls Fish Audio API and returns MP3 audio stream
 */
app.post('/api/tts', async (req: Request, res: Response) => {
  const apiKey = process.env.FISH_API_KEY?.trim();
  const model = process.env.FISH_AUDIO_MODEL?.trim() || 's2.1-pro-free';

  // 1. Check API Key
  if (!apiKey || apiKey.length < 10 || apiKey.includes('PASTE_YOUR')) {
    return res.status(500).json({
      error: 'Fish Audio API key is not configured in server/.env',
      code: 'MISSING_API_KEY',
      details: 'Please set FISH_API_KEY in server/.env with a valid credential from fish.audio'
    });
  }

/**
 * Helper: Map emotion and intensity into natural language prompt tags for Fish Audio S2
 */
function formatEmotionTag(emotion?: string, intensity?: string): string {
  if (!emotion) return '';
  const level = (intensity || 'balanced').toLowerCase();

  switch (emotion.toLowerCase()) {
    case 'happy':
      return level === 'expressive' ? '[joyful, laughing, very happy]' : level === 'subtle' ? '[subtle smile, lighthearted]' : '[happy, cheerful]';
    case 'calm':
      return level === 'expressive' ? '[deeply calm, soothing, meditative]' : level === 'subtle' ? '[relaxed, tranquil]' : '[calm, peaceful]';
    case 'empathetic':
      return level === 'expressive' ? '[deeply empathetic, compassionate, heartfelt]' : level === 'subtle' ? '[warm, gentle]' : '[empathetic, caring]';
    case 'excited':
      return level === 'expressive' ? '[ecstatic, thrilled, high energy]' : level === 'subtle' ? '[eager, enthusiastic]' : '[excited, animated]';
    case 'confident':
      return level === 'expressive' ? '[commanding, powerful, bold]' : level === 'subtle' ? '[assured, steady]' : '[confident, resolute]';
    case 'professional':
      return level === 'expressive' ? '[executive, sharp, authoritative]' : level === 'subtle' ? '[polite, measured]' : '[professional, articulate]';
    case 'storytelling':
      return level === 'expressive' ? '[epic theatrical narration, dynamic cadence]' : level === 'subtle' ? '[narrative flow]' : '[storyteller, engaging voice]';
    case 'sad':
      return level === 'expressive' ? '[tearful, heartbroken, sorrowful]' : level === 'subtle' ? '[melancholic, subdued]' : '[sad, emotional]';
    case 'dramatic':
      return level === 'expressive' ? '[high drama, intense suspense, breathtaking]' : level === 'subtle' ? '[poised, theatrical]' : '[dramatic, compelling]';
    case 'friendly':
      return level === 'expressive' ? '[super friendly, welcoming, vibrant warmth]' : level === 'subtle' ? '[cordial, pleasant]' : '[friendly, approachable]';
    default:
      return `[${emotion}]`;
  }
}

  // 2. Input Validation
  const { text, reference_id, emotion, intensity } = req.body || {};

  if (!text || typeof text !== 'string') {
    return res.status(400).json({
      error: 'Invalid input: "text" field is required and must be a string.',
      code: 'INVALID_TEXT'
    });
  }

  const trimmedText = text.trim();
  if (trimmedText.length === 0) {
    return res.status(400).json({
      error: 'Input text cannot be empty or whitespace only.',
      code: 'EMPTY_TEXT'
    });
  }

  if (trimmedText.length > 1000) {
    return res.status(400).json({
      error: `Text length (${trimmedText.length} chars) exceeds the 1,000 character limit for speech synthesis.`,
      code: 'TEXT_TOO_LONG'
    });
  }

  // Validate reference_id if provided
  let validReferenceId: string | undefined = undefined;
  if (reference_id && typeof reference_id === 'string' && reference_id.trim().length > 0) {
    validReferenceId = reference_id.trim();
  }

  // 3. Prepare Upstream Request to Fish Audio
  // Inject natural language emotion instruction tag if emotion provided
  const emotionTag = formatEmotionTag(emotion, intensity);
  const upstreamText = emotionTag ? `${emotionTag} ${trimmedText}` : trimmedText;

  const upstreamPayload: { text: string; format: string; reference_id?: string } = {
    text: upstreamText,
    format: 'mp3'
  };

  if (validReferenceId) {
    upstreamPayload.reference_id = validReferenceId;
  }

  try {
    console.log(`[Backend] Generating speech (${trimmedText.length} chars, emotion: ${emotion || 'neutral'}/${intensity || 'balanced'}, model: ${model}, ref: ${validReferenceId || 'default'})...`);

    const fishAudioResponse = await fetch('https://api.fish.audio/v1/tts', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'model': model
      },
      body: JSON.stringify(upstreamPayload)
    });

    // 4. Handle Upstream Errors
    if (!fishAudioResponse.ok) {
      let errorBody = '';
      try {
        errorBody = await fishAudioResponse.text();
      } catch {
        errorBody = 'No error details provided by upstream service';
      }

      console.error(`[Backend] Fish Audio API error: ${fishAudioResponse.status}`, errorBody);

      if (fishAudioResponse.status === 401) {
        return res.status(401).json({
          error: 'Authentication failed with Fish Audio. Your FISH_API_KEY may be invalid or expired.',
          code: 'UNAUTHORIZED',
          status: 401
        });
      }

      if (fishAudioResponse.status === 402 || fishAudioResponse.status === 429) {
        return res.status(429).json({
          error: 'Fish Audio account quota exceeded or rate limit reached. Please check your account credits.',
          code: 'QUOTA_EXCEEDED',
          status: fishAudioResponse.status
        });
      }

      if (fishAudioResponse.status === 400) {
        return res.status(400).json({
          error: 'Fish Audio rejected the request. The reference voice model ID may be invalid or deprecated.',
          code: 'UPSTREAM_BAD_REQUEST',
          details: errorBody,
          status: 400
        });
      }

      return res.status(fishAudioResponse.status).json({
        error: `Upstream Fish Audio service returned error code ${fishAudioResponse.status}`,
        code: 'UPSTREAM_ERROR',
        details: errorBody,
        status: fishAudioResponse.status
      });
    }

    // 5. Stream or Send Audio Response
    const audioBuffer = await fishAudioResponse.arrayBuffer();
    const buffer = Buffer.from(audioBuffer);

    console.log(`[Backend] Successfully generated MP3 audio (${buffer.byteLength} bytes).`);

    res.set({
      'Content-Type': 'audio/mpeg',
      'Content-Length': buffer.byteLength.toString(),
      'X-Fish-Audio-Model': model,
      'X-Voiceprint-Emotion': emotion || 'neutral',
      'X-Voiceprint-Intensity': intensity || 'balanced',
      'Cache-Control': 'no-cache'
    });

    return res.send(buffer);
  } catch (error) {
    console.error('[Backend] Network or server error contacting Fish Audio:', error);
    return res.status(502).json({
      error: 'Failed to connect to the Fish Audio API. Please verify your internet connection.',
      code: 'GATEWAY_ERROR',
      details: error instanceof Error ? error.message : String(error)
    });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`[Voiceprint Backend] Server listening on http://localhost:${PORT}`);
  console.log(`[Voiceprint Backend] Model: ${process.env.FISH_AUDIO_MODEL || 's2.1-pro-free'}`);
  console.log(`[Voiceprint Backend] API Key loaded: ${Boolean(process.env.FISH_API_KEY)}`);
});
