import React from 'react';
import { Play, Clock, Trash2, ArrowUpRight, MessageSquare, Download } from 'lucide-react';
import { RecentMessage } from '../../types';
import { EMOTION_OPTIONS } from '../../data/mockData';
import { audioEngine } from '../../services/audioService';

interface RecentMessagesListProps {
  messages: RecentMessage[];
  onPlayMessage: (message: RecentMessage) => void;
  onUseMessage: (message: RecentMessage) => void;
  onDeleteMessage: (id: string) => void;
  onClearAll?: () => void;
  currentlyPlayingId?: string | null;
  isPlaying?: boolean;
}

export const RecentMessagesList: React.FC<RecentMessagesListProps> = ({
  messages,
  onPlayMessage,
  onUseMessage,
  onDeleteMessage,
  onClearAll,
  currentlyPlayingId,
  isPlaying
}) => {
  const getLanguageBadge = (lang: string) => {
    switch (lang) {
      case 'hi':
        return <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">HINDI</span>;
      case 'hinglish':
        return <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">HINGLISH</span>;
      default:
        return <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-sky-100 text-sky-800 border border-sky-200">ENGLISH</span>;
    }
  };

  const getEmotionBadge = (emotion?: string) => {
    if (!emotion) return null;
    const emObj = EMOTION_OPTIONS.find((e) => e.id === emotion);
    if (!emObj) return null;
    return (
      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200 flex items-center gap-1">
        <span>{emObj.emoji}</span>
        <span className="capitalize">{emObj.label}</span>
      </span>
    );
  };

  return (
    <div className="bg-white rounded-3xl border border-surface-border shadow-card p-5 sm:p-7">
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-surface-border">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-brand-600" />
          <h3 className="font-bold text-navy-900 text-base">Recent Voice Messages</h3>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-navy-100 text-navy-600">
            {messages.length}
          </span>
        </div>

        {messages.length > 0 && onClearAll && (
          <button
            onClick={onClearAll}
            className="text-xs text-navy-400 hover:text-rose-600 font-medium transition-colors"
          >
            Clear all
          </button>
        )}
      </div>

      {messages.length === 0 ? (
        <div className="py-10 text-center flex flex-col items-center justify-center">
          <div className="w-12 h-12 rounded-2xl bg-surface-warm flex items-center justify-center text-navy-400 mb-3">
            <MessageSquare className="w-6 h-6" />
          </div>
          <p className="text-sm font-semibold text-navy-700">No voice messages generated yet</p>
          <p className="text-xs text-navy-400 mt-1 max-w-xs">
            Generate your first message using the Emotion Studio above to build your conversation history.
          </p>
        </div>
      ) : (
        <div className="divide-y divide-surface-border/60">
          {messages.map((item) => {
            const isThisPlaying = currentlyPlayingId === item.id && isPlaying;
            return (
              <div
                key={item.id}
                className="py-3.5 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3 group transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                    {getLanguageBadge(item.language)}
                    <span className="text-xs font-semibold text-brand-800 bg-brand-50 px-2 py-0.5 rounded-md border border-brand-100">
                      {item.voiceName}
                    </span>
                    {getEmotionBadge(item.emotion)}
                    {item.isFishAudio ? (
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        Fish Audio AI
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                        Browser Demo
                      </span>
                    )}
                    <span className="text-[11px] text-navy-400 flex items-center gap-1">
                      <span>•</span>
                      <span>{item.timestamp}</span>
                    </span>
                  </div>
                  <p className="text-sm text-navy-800 font-medium line-clamp-2 leading-relaxed">
                    {item.text}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1.5 self-end sm:self-center flex-shrink-0">
                  {/* Replay button */}
                  <button
                    onClick={() => onPlayMessage(item)}
                    className={`h-9 px-3 rounded-xl flex items-center gap-1.5 text-xs font-semibold transition-all shadow-xs ${
                      isThisPlaying
                        ? 'bg-brand-600 text-white shadow-glow'
                        : 'bg-surface-warm hover:bg-brand-50 text-navy-700 hover:text-brand-700 border border-surface-border hover:border-brand-300'
                    }`}
                    title="Play this message"
                  >
                    {isThisPlaying ? (
                      <>
                        <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                        <span>Playing</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>Replay</span>
                      </>
                    )}
                  </button>

                  {/* Download MP3 button if audioUrl available */}
                  {item.audioUrl && (
                    <button
                      onClick={() => audioEngine.downloadAudio(item.audioUrl!, `voiceprint-${item.id}.mp3`)}
                      className="p-2 rounded-xl text-navy-500 hover:text-brand-700 hover:bg-surface-warm border border-transparent hover:border-surface-border transition-colors"
                      title="Download MP3"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  )}

                  {/* Load into composer */}
                  <button
                    onClick={() => onUseMessage(item)}
                    className="p-2 rounded-xl text-navy-500 hover:text-brand-600 hover:bg-surface-warm border border-transparent hover:border-surface-border transition-colors"
                    title="Load back into composer"
                  >
                    <ArrowUpRight className="w-4 h-4" />
                  </button>

                  {/* Delete */}
                  <button
                    onClick={() => onDeleteMessage(item.id)}
                    className="p-2 rounded-xl text-navy-400 hover:text-rose-600 hover:bg-rose-50 transition-colors opacity-80 group-hover:opacity-100"
                    title="Delete message"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
