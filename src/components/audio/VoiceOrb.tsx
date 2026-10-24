import React from 'react';
import { EmotionType } from '../../types';

interface VoiceOrbProps {
  state: 'idle' | 'generating' | 'speaking' | 'paused';
  progress?: number;
  emotion?: EmotionType;
  voiceName?: string;
  onClick?: () => void;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const VoiceOrb: React.FC<VoiceOrbProps> = ({
  state,
  emotion = 'happy',
  voiceName = 'Voiceprint',
  onClick,
  size = 'md',
  className = ''
}) => {
  const sizeClasses = {
    sm: 'w-20 h-20',
    md: 'w-36 h-36 sm:w-44 sm:h-44',
    lg: 'w-48 h-48 sm:w-56 sm:h-56'
  }[size];

  // Map emotion to vibrant secondary halo hues
  const emotionGradients: Record<EmotionType, { from: string; via: string; to: string; shadow: string }> = {
    happy: { from: '#F59E0B', via: '#EC4899', to: '#6845FF', shadow: 'rgba(245, 158, 11, 0.4)' },
    calm: { from: '#10B981', via: '#06B6D4', to: '#6845FF', shadow: 'rgba(16, 185, 129, 0.35)' },
    empathetic: { from: '#EC4899', via: '#A855F7', to: '#6845FF', shadow: 'rgba(236, 72, 153, 0.4)' },
    excited: { from: '#D946EF', via: '#F43F5E', to: '#6845FF', shadow: 'rgba(217, 70, 239, 0.45)' },
    confident: { from: '#3B82F6', via: '#6366F1', to: '#6845FF', shadow: 'rgba(59, 130, 246, 0.4)' },
    professional: { from: '#64748B', via: '#475569', to: '#6845FF', shadow: 'rgba(71, 85, 105, 0.35)' },
    storytelling: { from: '#8B5CF6', via: '#C084FC', to: '#6845FF', shadow: 'rgba(139, 92, 246, 0.4)' },
    sad: { from: '#0EA5E9', via: '#6366F1', to: '#38BDF8', shadow: 'rgba(14, 165, 233, 0.35)' },
    dramatic: { from: '#6366F1', via: '#9333EA', to: '#4F46E5', shadow: 'rgba(99, 102, 241, 0.45)' },
    friendly: { from: '#EAB308', via: '#F97316', to: '#6845FF', shadow: 'rgba(234, 179, 8, 0.4)' }
  };

  const currentGradient = emotionGradients[emotion] || emotionGradients.happy;

  return (
    <div
      className={`relative flex items-center justify-center select-none ${className}`}
      onClick={onClick}
      role="region"
      aria-label={`Voice Orb - State: ${state}, Emotion: ${emotion}, Voice: ${voiceName}`}
    >
      {/* Outer ambient blur background */}
      <div
        className="absolute inset-0 rounded-full blur-2xl opacity-40 transition-all duration-700 pointer-events-none"
        style={{
          background: `radial-gradient(circle, ${currentGradient.from} 0%, ${currentGradient.to} 70%, transparent 100%)`
        }}
      />

      {/* Ripple ring 1 - Speaking wave */}
      {state === 'speaking' && (
        <>
          <div
            className="absolute inset-[-18px] rounded-full border-2 border-brand-400/40 animate-ping pointer-events-none"
            style={{ animationDuration: '2.4s' }}
          />
          <div
            className="absolute inset-[-10px] rounded-full border border-indigo-400/50 animate-pulse pointer-events-none"
            style={{ animationDuration: '1.6s' }}
          />
        </>
      )}

      {/* Rotating halo - Generating state */}
      {state === 'generating' && (
        <div
          className="absolute inset-[-12px] rounded-full border-2 border-dashed border-brand-400/80 animate-spin pointer-events-none"
          style={{ animationDuration: '3.5s' }}
        />
      )}

      {/* Main Orb Sphere */}
      <div
        className={`relative ${sizeClasses} rounded-full flex items-center justify-center cursor-pointer transition-transform duration-300 transform hover:scale-[1.03] active:scale-[0.98] shadow-2xl overflow-hidden`}
        style={{
          boxShadow: `0 0 45px -8px ${currentGradient.shadow}, inset 0 2px 14px rgba(255, 255, 255, 0.4)`
        }}
      >
        {/* Dynamic layered SVG orb mesh */}
        <svg
          viewBox="0 0 200 200"
          className="w-full h-full transform transition-all duration-500"
        >
          <defs>
            <radialGradient id={`orbGrad-${emotion}`} cx="38%" cy="32%" r="68%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
              <stop offset="35%" stopColor={currentGradient.from} stopOpacity="0.85" />
              <stop offset="70%" stopColor={currentGradient.via} stopOpacity="0.9" />
              <stop offset="100%" stopColor={currentGradient.to} stopOpacity="0.95" />
            </radialGradient>

            <linearGradient id="orbGleam" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.6" />
              <stop offset="50%" stopColor="#FFFFFF" stopOpacity="0.0" />
            </linearGradient>

            <filter id="orbGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="8" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Deep core body */}
          <circle cx="100" cy="100" r="92" fill={`url(#orbGrad-${emotion})`} />

          {/* Liquid flow wave 1 */}
          <path
            d="M20,100 Q60,60 100,100 T180,100 A92,92 0 0,1 20,100"
            fill="rgba(255,255,255,0.18)"
            className={state === 'speaking' || state === 'generating' ? 'animate-pulse' : ''}
            style={{ animationDuration: state === 'generating' ? '1.2s' : '2.5s' }}
          />

          {/* Liquid flow wave 2 */}
          <path
            d="M30,120 Q70,160 110,120 T170,120 A92,92 0 0,1 30,120"
            fill="rgba(104,69,255,0.25)"
            className={state === 'speaking' ? 'animate-pulse' : ''}
            style={{ animationDuration: '3s' }}
          />

          {/* Top gloss specular highlight */}
          <ellipse
            cx="75"
            cy="52"
            rx="46"
            ry="24"
            fill="url(#orbGleam)"
            transform="rotate(-25 75 52)"
          />

          {/* Sound wave bars inside orb when speaking */}
          {state === 'speaking' && (
            <g transform="translate(68, 85)" fill="#FFFFFF" opacity="0.95">
              <rect x="0" y="0" width="4" height="28" rx="2" className="animate-wave" style={{ animationDelay: '0.1s' }} />
              <rect x="9" y="-6" width="4" height="40" rx="2" className="animate-wave" style={{ animationDelay: '0.3s' }} />
              <rect x="18" y="-12" width="4" height="52" rx="2" className="animate-wave" style={{ animationDelay: '0.2s' }} />
              <rect x="27" y="-8" width="4" height="44" rx="2" className="animate-wave" style={{ animationDelay: '0.4s' }} />
              <rect x="36" y="-3" width="4" height="34" rx="2" className="animate-wave" style={{ animationDelay: '0.25s' }} />
              <rect x="45" y="2" width="4" height="24" rx="2" className="animate-wave" style={{ animationDelay: '0.35s' }} />
              <rect x="54" y="6" width="4" height="16" rx="2" className="animate-wave" style={{ animationDelay: '0.15s' }} />
            </g>
          )}

          {/* Spinning energy particles when generating */}
          {state === 'generating' && (
            <g transform="translate(100, 100)" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" opacity="0.9">
              <line x1="0" y1="-28" x2="0" y2="-18" className="animate-spin" />
              <line x1="20" y1="-20" x2="13" y2="-13" />
              <line x1="28" y1="0" x2="18" y2="0" />
              <line x1="20" y1="20" x2="13" y2="13" />
              <line x1="0" y1="28" x2="0" y2="18" />
              <line x1="-20" y1="20" x2="-13" y2="13" />
              <line x1="-28" y1="0" x2="-18" y2="0" />
              <line x1="-20" y1="-20" x2="-13" y2="-13" />
            </g>
          )}

          {/* Idle breathing center icon */}
          {state === 'idle' && (
            <g transform="translate(100, 100)">
              <circle cx="0" cy="0" r="14" fill="#FFFFFF" opacity="0.25" className="animate-ping" style={{ animationDuration: '3s' }} />
              <circle cx="0" cy="0" r="7" fill="#FFFFFF" opacity="0.95" />
            </g>
          )}

          {/* Paused state symbol */}
          {state === 'paused' && (
            <g transform="translate(93, 88)" fill="#FFFFFF" opacity="0.95">
              <rect x="0" y="0" width="5" height="24" rx="2.5" />
              <rect x="10" y="0" width="5" height="24" rx="2.5" />
            </g>
          )}
        </svg>

        {/* Gloss rim overlay */}
        <div className="absolute inset-0 rounded-full border border-white/40 pointer-events-none" />
      </div>

      {/* State Badge Pill */}
      <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 whitespace-nowrap z-10">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-white/95 backdrop-blur-md border border-surface-border text-navy-800 shadow-sm">
          {state === 'generating' && (
            <>
              <span className="w-2 h-2 rounded-full bg-brand-600 animate-spin" />
              <span>Synthesizing Voice...</span>
            </>
          )}
          {state === 'speaking' && (
            <>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Speaking: {voiceName}</span>
            </>
          )}
          {state === 'paused' && (
            <>
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              <span>Playback Paused</span>
            </>
          )}
          {state === 'idle' && (
            <>
              <span className="w-2 h-2 rounded-full bg-brand-500" />
              <span>Voiceprint Orb Ready</span>
            </>
          )}
        </span>
      </div>
    </div>
  );
};
