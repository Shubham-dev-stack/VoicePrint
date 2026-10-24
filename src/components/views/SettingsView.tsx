import React, { useState, useEffect } from 'react';
import { 
  ExternalLink, 
  ShieldAlert, 
  Download, 
  Trash2, 
  Server, 
  Code2,
  CheckCircle2,
  AlertTriangle,
  Play
} from 'lucide-react';
import { Language, RecentMessage } from '../../types';
import { fishAudioService, BackendStatus } from '../../services/fishAudioService';
import { audioEngine } from '../../services/audioService';

interface SettingsViewProps {
  defaultLanguage: Language;
  onDefaultLanguageChange: (lang: Language) => void;
  recentMessages: RecentMessage[];
  onClearAllHistory: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  defaultLanguage,
  onDefaultLanguageChange,
  recentMessages,
  onClearAllHistory
}) => {
  const [backendStatus, setBackendStatus] = useState<BackendStatus | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [testResult, setTestResult] = useState<{
    status: 'idle' | 'testing' | 'success' | 'error';
    message?: string;
    audioUrl?: string;
  }>({ status: 'idle' });
  const [autoPlay, setAutoPlay] = useState(true);

  const checkStatus = async () => {
    setIsChecking(true);
    const status = await fishAudioService.checkBackendStatus();
    setBackendStatus(status);
    setIsChecking(false);
  };

  // Check backend status on mount
  useEffect(() => {
    let isMounted = true;
    fishAudioService.checkBackendStatus().then((status) => {
      if (isMounted) {
        setBackendStatus(status);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const handleTestSynthesis = async () => {
    setTestResult({ status: 'testing' });
    const res = await fishAudioService.synthesizeSpeech({
      text: 'Voiceprint Fish Audio synthesis test successful.',
      referenceId: '802e3bc2b27e49c2995d23ef70e6ac89' // Verified English model
    });

    if (res.success && res.audioUrl) {
      setTestResult({
        status: 'success',
        message: `Verified! Audio synthesized using Fish Audio model (${res.model || 's2.1-pro-free'}).`,
        audioUrl: res.audioUrl
      });
      // Play the test sound
      audioEngine.play({
        text: 'Voiceprint Fish Audio synthesis test successful.',
        language: 'en',
        voiceId: 'test',
        audioUrl: res.audioUrl
      });
    } else {
      setTestResult({
        status: 'error',
        message: res.error || 'Test request failed. Ensure server is running and FISH_API_KEY is configured in server/.env.'
      });
    }
  };

  const handleExportHistory = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(recentMessages, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `voiceprint_history_${new Date().toISOString().slice(0,10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-6 sm:space-y-8 pb-12 max-w-4xl">
      {/* Title */}
      <div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-navy-900 tracking-tight">
          Settings & Integrations
        </h2>
        <p className="text-sm text-navy-500 mt-1">
          Monitor your secure Fish Audio proxy backend, configure speech behavior, and manage history.
        </p>
      </div>

      {/* Backend & Fish Audio API Status Card */}
      <div className="bg-white rounded-3xl border border-surface-border shadow-card p-6 sm:p-8 relative overflow-hidden">
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-surface-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-700 flex items-center justify-center text-white shadow-sm">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-navy-900 text-base">Fish Audio Secure Proxy Server</h3>
              <p className="text-xs text-navy-500">Node.js / Express backend with s2.1-pro-free model</p>
            </div>
          </div>

          <a 
            href="https://fish.audio" 
            target="_blank" 
            rel="noreferrer"
            className="text-xs font-semibold text-brand-600 hover:text-brand-800 flex items-center gap-1 transition-colors"
          >
            <span>Fish Audio Portal</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Security Notice */}
        <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200 text-xs text-emerald-900 leading-relaxed mb-6">
          <strong>Security Architecture:</strong> API credentials are kept exclusively on the server in <code className="font-mono bg-emerald-100/80 px-1.5 py-0.5 rounded font-bold">server/.env</code> and read via <code className="font-mono bg-emerald-100/80 px-1.5 py-0.5 rounded font-bold">process.env.FISH_API_KEY</code>. Keys are never transmitted to the browser, browser logs, or client bundles.
        </div>

        {/* Live Diagnostics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mb-6">
          {/* Card 1: Server Status */}
          <div className="p-4 rounded-2xl bg-surface-warm border border-surface-border">
            <span className="text-[11px] font-bold uppercase tracking-wider text-navy-400 block mb-1">
              Backend Server
            </span>
            <div className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${backendStatus?.isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
              <span className="text-sm font-bold text-navy-900">
                {backendStatus?.isOnline ? 'Online (Port 3001)' : 'Offline'}
              </span>
            </div>
            <p className="text-[11px] text-navy-500 mt-1">
              {backendStatus?.isOnline ? 'Proxying /api/tts' : 'Run "npm run server"'}
            </p>
          </div>

          {/* Card 2: Fish Audio Key Status */}
          <div className="p-4 rounded-2xl bg-surface-warm border border-surface-border">
            <span className="text-[11px] font-bold uppercase tracking-wider text-navy-400 block mb-1">
              FISH_API_KEY
            </span>
            <div className="flex items-center gap-2">
              {backendStatus?.fishAudioConfigured ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span className="text-sm font-bold text-emerald-800">Configured</span>
                </>
              ) : (
                <>
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span className="text-sm font-bold text-amber-800">Not Set</span>
                </>
              )}
            </div>
            <p className="text-[11px] text-navy-500 mt-1">
              {backendStatus?.fishAudioConfigured ? 'Loaded securely in server' : 'Edit server/.env'}
            </p>
          </div>

          {/* Card 3: Model Header */}
          <div className="p-4 rounded-2xl bg-surface-warm border border-surface-border">
            <span className="text-[11px] font-bold uppercase tracking-wider text-navy-400 block mb-1">
              Active Model Header
            </span>
            <div className="text-sm font-mono font-bold text-brand-700 truncate">
              {backendStatus?.model || 's2.1-pro-free'}
            </div>
            <p className="text-[11px] text-navy-500 mt-1">
              Configured in FISH_AUDIO_MODEL
            </p>
          </div>
        </div>

        {/* Live Test Button */}
        <div className="pt-1 border-t border-surface-border/80 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={handleTestSynthesis}
            disabled={testResult.status === 'testing' || !backendStatus?.isOnline}
            className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-2"
          >
            {testResult.status === 'testing' ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Calling POST /api/tts...</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Test Live Fish Audio API Ping</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={checkStatus}
            disabled={isChecking}
            className="px-4 py-2.5 rounded-xl border border-surface-border hover:bg-surface-warm text-navy-700 text-xs font-semibold transition-all"
          >
            {isChecking ? 'Refreshing...' : 'Refresh Status'}
          </button>

          {/* Test Status feedback */}
          {testResult.status === 'success' && (
            <div className="w-full mt-2 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>{testResult.message}</span>
            </div>
          )}

          {testResult.status === 'error' && (
            <div className="w-full mt-2 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-600 flex-shrink-0" />
              <span>{testResult.message}</span>
            </div>
          )}
        </div>

        {/* Environment setup instructions */}
        <div className="mt-6 pt-5 border-t border-surface-border/80">
          <div className="flex items-center gap-2 mb-2 text-xs font-bold text-navy-800">
            <Code2 className="w-4 h-4 text-brand-600" />
            <span>Environment Setup (server/.env)</span>
          </div>
          <div className="bg-navy-950 text-navy-200 rounded-2xl p-3.5 font-mono text-[11px] leading-relaxed overflow-x-auto">
            <div className="text-navy-400"># server/.env (protected by .gitignore)</div>
            <div>FISH_API_KEY=sk-fish-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx</div>
            <div className="text-emerald-300">FISH_AUDIO_MODEL=s2.1-pro-free</div>
            <div className="text-amber-300">PORT=3001</div>
          </div>
        </div>
      </div>

      {/* General Studio Preferences */}
      <div className="bg-white rounded-3xl border border-surface-border shadow-card p-6 sm:p-8 space-y-5">
        <h3 className="font-bold text-navy-900 text-base pb-3 border-b border-surface-border">
          Studio Preferences
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-navy-700 mb-1.5">
              Default Input Language
            </label>
            <select
              value={defaultLanguage}
              onChange={(e) => onDefaultLanguageChange(e.target.value as Language)}
              className="w-full p-2.5 rounded-xl bg-surface-warm border border-surface-border text-xs text-navy-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
            >
              <option value="en">English (Default)</option>
              <option value="hi">Hindi (हिंदी)</option>
              <option value="hinglish">Hinglish</option>
            </select>
          </div>

          <div className="flex items-center justify-between p-3 rounded-2xl bg-surface-warm border border-surface-border">
            <div>
              <p className="text-xs font-semibold text-navy-800">Auto-play Generation</p>
              <p className="text-[11px] text-navy-400">Play audio right after voice synthesis</p>
            </div>
            <input
              type="checkbox"
              checked={autoPlay}
              onChange={(e) => setAutoPlay(e.target.checked)}
              className="w-4 h-4 accent-brand-600 rounded cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Privacy, Ethics and Data Management */}
      <div className="bg-white rounded-3xl border border-surface-border shadow-card p-6 sm:p-8 space-y-4">
        <h3 className="font-bold text-navy-900 text-base pb-3 border-b border-surface-border flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-brand-600" />
          <span>Ethics, Privacy & History</span>
        </h3>

        <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 text-xs text-amber-900 leading-relaxed">
          <strong className="font-semibold block mb-1">Consented Identity Policy</strong>
          Only use voices that you own or have explicit authorization to clone. Voiceprint prevents deceptive impersonation by maintaining transparency around synthetic speech generation.
        </div>

        <div className="pt-2 flex flex-wrap items-center gap-3">
          <button
            onClick={handleExportHistory}
            disabled={recentMessages.length === 0}
            className="px-4 py-2.5 rounded-xl border border-surface-border hover:border-brand-200 hover:bg-brand-50 text-navy-700 hover:text-brand-700 text-xs font-semibold flex items-center gap-1.5 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Download className="w-4 h-4" />
            <span>Export Message History (.JSON)</span>
          </button>

          <button
            onClick={onClearAllHistory}
            disabled={recentMessages.length === 0}
            className="px-4 py-2.5 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-semibold flex items-center gap-1.5 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Trash2 className="w-4 h-4" />
            <span>Clear Local History</span>
          </button>
        </div>
      </div>
    </div>
  );
};
