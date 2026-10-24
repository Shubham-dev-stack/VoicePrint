import React, { useEffect, useState } from 'react';

interface AudioVisualizerProps {
  isPlaying: boolean;
  barCount?: number;
  progress?: number;
  className?: string;
  onBarClick?: (indexPercent: number) => void;
}

export const AudioVisualizer: React.FC<AudioVisualizerProps> = ({
  isPlaying,
  barCount = 36,
  progress = 0,
  className = '',
  onBarClick
}) => {
  // Pre-generate stable pseudo-random wave heights
  const [baseHeights] = useState<number[]>(() => {
    return Array.from({ length: barCount }, (_, i) => {
      // Create organic audio speech-like wave envelope
      const centerFactor = Math.sin((i / barCount) * Math.PI);
      const randomNoise = 0.25 + 0.75 * Math.sin(i * 1.7) * Math.cos(i * 0.9);
      const height = Math.max(15, Math.min(95, Math.round(centerFactor * randomNoise * 90 + 15)));
      return height;
    });
  });

  const [dynamicMultipliers, setDynamicMultipliers] = useState<number[]>(() =>
    Array(barCount).fill(1)
  );

  useEffect(() => {
    if (!isPlaying) {
      return;
    }

    const interval = setInterval(() => {
      setDynamicMultipliers(
        Array.from({ length: barCount }, () => 0.4 + Math.random() * 0.8)
      );
    }, 120);

    return () => clearInterval(interval);
  }, [isPlaying, barCount]);

  return (
    <div 
      className={`flex items-center gap-[3px] sm:gap-1 h-16 px-2 py-1 select-none ${className}`}
      role="region"
      aria-label="Audio waveform visualizer"
    >
      {baseHeights.map((baseHeight, idx) => {
        const barProgress = idx / barCount;
        const isPast = barProgress <= progress;
        const currentMultiplier = isPlaying ? dynamicMultipliers[idx] : 1;
        const currentHeight = Math.max(8, Math.min(56, Math.round(baseHeight * 0.55 * currentMultiplier)));

        return (
          <button
            key={idx}
            type="button"
            aria-label={`Jump to ${Math.round(barProgress * 100)}%`}
            onClick={() => onBarClick && onBarClick(barProgress)}
            className={`flex-1 rounded-full transition-all duration-150 cursor-pointer focus:outline-none focus:ring-1 focus:ring-brand-500 ${
              isPast
                ? 'bg-gradient-to-t from-brand-600 to-brand-400 opacity-95 shadow-sm'
                : 'bg-navy-200 hover:bg-brand-200 opacity-60'
            }`}
            style={{
              height: `${currentHeight}px`,
            }}
          />
        );
      })}
    </div>
  );
};
