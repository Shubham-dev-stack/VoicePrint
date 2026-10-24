/**
 * Fish Audio API Service (Client Adapter)
 * 
 * Communicates with the secure backend server at `/api/tts` and `/api/status`.
 * The real API key is held exclusively on the server (server/.env) and never
 * exposed in browser requests, responses, or client bundles.
 */

export interface FishAudioSynthesisRequest {
  text: string;
  referenceId?: string;
  voiceId?: string;
  emotion?: string;
  intensity?: string;
  speed?: number;
}

export interface FishAudioSynthesisResult {
  success: boolean;
  audioUrl?: string;
  audioBlob?: Blob;
  isRealFishAudio: boolean;
  model?: string;
  emotion?: string;
  intensity?: string;
  error?: string;
  code?: string;
  details?: string;
}

export interface BackendStatus {
  status: string;
  service?: string;
  fishAudioConfigured: boolean;
  model: string;
  isOnline: boolean;
  error?: string;
}

class FishAudioService {
  private apiBase = '/api';

  /**
   * Check backend health and whether Fish Audio credentials are configured.
   */
  public async checkBackendStatus(): Promise<BackendStatus> {
    try {
      const response = await fetch(`${this.apiBase}/status`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        return {
          status: 'error',
          fishAudioConfigured: false,
          model: 's2.1-pro-free',
          isOnline: false,
          error: `Backend returned status ${response.status}`
        };
      }

      const data = await response.json();
      return {
        status: data.status || 'ok',
        service: data.service,
        fishAudioConfigured: Boolean(data.fishAudioConfigured),
        model: data.model || 's2.1-pro-free',
        isOnline: true
      };
    } catch (err) {
      console.warn('[FishAudioService] Backend unreachable at /api/status:', err);
      return {
        status: 'offline',
        fishAudioConfigured: false,
        model: 's2.1-pro-free',
        isOnline: false,
        error: 'Backend server not responding. Run "npm run server" to start it.'
      };
    }
  }

  /**
   * Synthesize real speech by calling the backend proxy endpoint `POST /api/tts`.
   */
  public async synthesizeSpeech(request: FishAudioSynthesisRequest): Promise<FishAudioSynthesisResult> {
    try {
      const response = await fetch(`${this.apiBase}/tts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          text: request.text,
          reference_id: request.referenceId || undefined,
          emotion: request.emotion || undefined,
          intensity: request.intensity || undefined,
          speed: request.speed || undefined
        })
      });

      const contentType = response.headers.get('content-type') || '';

      // If the backend returned an error JSON
      if (!response.ok) {
        let errorData: { error?: string; code?: string; details?: string } = {};
        try {
          if (contentType.includes('application/json')) {
            errorData = await response.json();
          } else {
            const rawText = await response.text();
            errorData = { error: rawText };
          }
        } catch {
          errorData = { error: `Server returned HTTP ${response.status}` };
        }

        return {
          success: false,
          isRealFishAudio: false,
          error: errorData.error || `Speech generation failed (HTTP ${response.status})`,
          code: errorData.code || `HTTP_${response.status}`,
          details: errorData.details
        };
      }

      // Check for audio/mpeg response
      if (!contentType.includes('audio')) {
        return {
          success: false,
          isRealFishAudio: false,
          error: 'Unexpected response format from audio generation server.',
          code: 'INVALID_CONTENT_TYPE'
        };
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      const model = response.headers.get('x-fish-audio-model') || 's2.1-pro-free';
      const emotion = response.headers.get('x-voiceprint-emotion') || request.emotion;
      const intensity = response.headers.get('x-voiceprint-intensity') || request.intensity;

      return {
        success: true,
        isRealFishAudio: true,
        audioBlob,
        audioUrl,
        model,
        emotion,
        intensity
      };
    } catch (err) {
      console.error('[FishAudioService] Network or server error:', err);
      return {
        success: false,
        isRealFishAudio: false,
        error: 'Cannot reach backend server on http://localhost:3001. Ensure backend is running.',
        code: 'NETWORK_ERROR',
        details: err instanceof Error ? err.message : String(err)
      };
    }
  }
}

export const fishAudioService = new FishAudioService();
