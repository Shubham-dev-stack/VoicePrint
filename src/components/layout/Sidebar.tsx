import React from 'react';
import { 
  Home, 
  Mic, 
  Sparkles, 
  Layers, 
  Settings, 
  ShieldCheck, 
  Activity, 
  ChevronRight
} from 'lucide-react';
import { ActiveTab } from '../../types';

interface SidebarProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  favoritesCount: number;
  isFishAudioConfigured?: boolean;
  fishAudioModel?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onTabChange,
  isOpenMobile,
  onCloseMobile,
  favoritesCount,
  isFishAudioConfigured = false,
  fishAudioModel = 's2.1-pro-free'
}) => {
  const navItems = [
    { id: 'home' as ActiveTab, label: 'Home', icon: Home, description: 'Composer & Studio' },
    { id: 'my-voice' as ActiveTab, label: 'My Voice', icon: Mic, description: 'Simulated Voice Profile', badge: 'Demo' },
    { id: 'quick-phrases' as ActiveTab, label: 'Quick Phrases', icon: Sparkles, description: 'Saved & Instant Phrases', count: favoritesCount },
    { id: 'voice-library' as ActiveTab, label: 'Voice Library', icon: Layers, description: 'Browse Voice Catalog' },
    { id: 'settings' as ActiveTab, label: 'Settings', icon: Settings, description: 'Audio & API Setup' },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div 
          className="fixed inset-0 bg-navy-950/40 backdrop-blur-xs z-40 lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Main Sidebar */}
      <aside className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-white border-r border-surface-border flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
        isOpenMobile ? 'translate-x-0' : '-translate-x-full'
      }`}>
        {/* Brand Logo & Tagline Header */}
        <div className="p-6 border-b border-surface-border">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-brand-600 via-brand-700 to-indigo-800 flex items-center justify-center text-white shadow-glow relative overflow-hidden group">
              {/* Dynamic sound wave lines */}
              <div className="flex items-center gap-[2.5px]">
                <span className="w-1 h-3.5 bg-white/90 rounded-full animate-wave" style={{ animationDelay: '0.1s' }} />
                <span className="w-1 h-6 bg-white rounded-full animate-wave" style={{ animationDelay: '0.3s' }} />
                <span className="w-1 h-4 bg-white/90 rounded-full animate-wave" style={{ animationDelay: '0.2s' }} />
                <span className="w-1 h-2 bg-white/70 rounded-full animate-wave" style={{ animationDelay: '0.4s' }} />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="font-extrabold text-xl tracking-tight text-navy-900">
                  Voiceprint
                </h1>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-md bg-brand-100 text-brand-800">
                  v1.0
                </span>
              </div>
              <p className="text-xs font-medium text-brand-600 tracking-wide">
                Your identity. Your voice.
              </p>
            </div>
          </div>
        </div>

        {/* Navigation list */}
        <nav className="flex-1 px-4 py-5 space-y-1.5 overflow-y-auto" aria-label="Main Navigation">
          <div className="px-3 pb-2 text-[11px] font-bold uppercase tracking-wider text-navy-400">
            Workspace
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onTabChange(item.id);
                  onCloseMobile();
                }}
                className={`w-full px-3.5 py-3 rounded-2xl flex items-center gap-3 transition-all duration-200 text-left group ${
                  isActive
                    ? 'bg-brand-50 text-brand-700 font-bold border border-brand-200/80 shadow-xs'
                    : 'text-navy-600 hover:text-navy-900 hover:bg-surface-warm font-medium'
                }`}
              >
                <div className={`p-2 rounded-xl transition-colors ${
                  isActive 
                    ? 'bg-brand-600 text-white shadow-xs' 
                    : 'bg-navy-50 text-navy-500 group-hover:bg-brand-100/60 group-hover:text-brand-600'
                }`}>
                  <Icon className="w-4 h-4" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-sm truncate">{item.label}</span>
                    {item.badge && (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                        {item.badge}
                      </span>
                    )}
                    {item.count !== undefined && item.count > 0 && (
                      <span className="text-[11px] font-bold px-1.5 py-0.2 rounded-full bg-navy-100 text-navy-600">
                        {item.count}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-navy-400 font-normal truncate mt-0.5">
                    {item.description}
                  </p>
                </div>
              </button>
            );
          })}
        </nav>

        {/* Engine Status / Fish Audio API pill */}
        <div className="p-4 mx-4 mb-3 rounded-2xl bg-surface-warm border border-surface-border">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-navy-800 flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-brand-600" />
              <span>Synthesis Status</span>
            </span>
            {isFishAudioConfigured ? (
              <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Fish Audio Live
              </span>
            ) : (
              <span className="flex items-center gap-1 text-[11px] font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                Demo Fallback
              </span>
            )}
          </div>
          <p className="text-[11px] text-navy-500 leading-relaxed">
            {isFishAudioConfigured
              ? `Connected to Fish Audio (${fishAudioModel}) via secure server proxy.`
              : 'Local browser speech synthesis active. Real Fish Audio backend is not connected.'}
          </p>
          <button
            onClick={() => onTabChange('settings')}
            className="mt-2.5 text-xs font-semibold text-brand-600 hover:text-brand-800 flex items-center gap-1 transition-colors"
          >
            <span>Configure API in Settings</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Footer Privacy Notice */}
        <div className="p-4 border-t border-surface-border bg-white text-navy-500">
          <div className="flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
            <p className="text-[11px] leading-relaxed text-navy-600">
              <strong className="text-navy-900 font-semibold block mb-0.5">Privacy Notice</strong>
              Use only your own voice or a voice you have permission to use.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};
