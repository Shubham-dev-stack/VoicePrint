import React, { useState } from 'react';
import { 
  Mic, 
  Upload, 
  Sliders, 
  Play, 
  Square, 
  RefreshCw, 
  Sparkles, 
  ShieldCheck,
  FileAudio,
  Volume2,
  Check
} from 'lucide-react';
import { UserVoiceProfile } from '../../types';

interface MyVoiceViewProps {
  userProfile: UserVoiceProfile;
  onUpdateProfile: (updated: Partial<UserVoiceProfile>) => void;
  onTestVoice: (sampleText: string) => void;
  isPlayingTest: boolean;
}

export const MyVoiceView: React.FC<MyVoiceViewProps> = ({
  userProfile,
  onUpdateProfile,
  onTestVoice,
  isPlayingTest
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordTimer, setRecordTimer] = useState(0);
  const [isUploaded, setIsUploaded] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Local adjustment state
  const [pitch, setPitch] = useState(userProfile.pitch);
  const [speed, setSpeed] = useState(userProfile.speed);
  const [clarity, setClarity] = useState(userProfile.clarity);
  const [stability, setStability] = useState(userProfile.stability);

  // Simulated audio recording
  const handleToggleRecord = () => {
    if (isRecording) {
      setIsRecording(false);
      setRecordTimer(0);
      onUpdateProfile({ samplesCount: userProfile.samplesCount + 1 });
    } else {
      setIsRecording(true);
      setRecordTimer(0);
      const interval = setInterval(() => {
        setRecordTimer((prev) => {
          if (prev >= 10) {
            clearInterval(interval);
            setIsRecording(false);
            onUpdateProfile({ samplesCount: userProfile.samplesCount + 1 });
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    }
  };

  const handleSaveAdjustments = () => {
    onUpdateProfile({ pitch, speed, clarity, stability });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const sampleReferenceFiles = [
    { name: 'voice_calibration_sample_01.wav', duration: '0:14', quality: '98% High SNR', size: '1.2 MB' },
    { name: 'conversational_reading_hindi.wav', duration: '0:22', quality: '95% Natural', size: '2.4 MB' },
    { name: 'work_vocabulary_hinglish.wav', duration: '0:18', quality: '96% Clean', size: '1.8 MB' },
  ];

  return (
    <div className="space-y-6 sm:space-y-8 pb-12">
      {/* Title Header */}
      <div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-navy-900 tracking-tight">
          My Voiceprint Studio
        </h2>
        <p className="text-sm text-navy-500 mt-1">
          Calibrate and clone your unique vocal identity for zero-shot text-to-speech synthesis.
        </p>
      </div>

      {/* Voice Status & Calibration Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        {/* Card 1: Calibration Status */}
        <div className="bg-white rounded-3xl p-5 border border-surface-border shadow-card flex items-start justify-between">
          <div>
            <span className="text-xs font-bold text-amber-600 uppercase tracking-wider block mb-1">
              Simulation Status
            </span>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-bold text-navy-900">Prototype Profile</h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">Simulated</span>
            </div>
            <p className="text-xs text-navy-500 mt-1">
              UI prototype for calibration flow
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 text-sm font-bold">
            Demo
          </div>
        </div>

        {/* Card 2: Training Samples */}
        <div className="bg-white rounded-3xl p-5 border border-surface-border shadow-card flex items-start justify-between">
          <div>
            <span className="text-xs font-bold text-navy-400 uppercase tracking-wider block mb-1">
              Reference Audio
            </span>
            <h3 className="text-xl font-bold text-navy-900">{userProfile.samplesCount} Sample Clips</h3>
            <p className="text-xs text-navy-500 mt-1">
              Demo sample recordings
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-brand-50 border border-brand-200 flex items-center justify-center text-brand-600">
            <FileAudio className="w-6 h-6" />
          </div>
        </div>

        {/* Card 3: Acoustic Fingerprint */}
        <div className="bg-white rounded-3xl p-5 border border-surface-border shadow-card flex items-start justify-between">
          <div>
            <span className="text-xs font-bold text-navy-400 uppercase tracking-wider block mb-1">
              Audio Backend
            </span>
            <h3 className="text-xl font-bold text-navy-900">Browser Speech</h3>
            <p className="text-xs text-amber-700 font-medium mt-1">
              Fish Audio API pending connection
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600">
            <Sparkles className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Main Studio Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
        {/* Left Column: Record / Upload Reference Audio (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Recording Studio Card */}
          <div className="bg-white rounded-3xl border border-surface-border shadow-card p-5 sm:p-7">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-surface-border">
              <div className="flex items-center gap-2">
                <Mic className="w-5 h-5 text-brand-600" />
                <h3 className="font-bold text-navy-900 text-base">Record Calibration Sample</h3>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-surface-warm text-navy-600 border border-surface-border">
                Recommended: 10-15s
              </span>
            </div>

            <div className="p-3 mb-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 leading-relaxed">
              <strong>Future Feature Notice:</strong> Direct voice model training and custom weight calibration requires training a dedicated model on Fish Audio. For now, you can test verified public voiceprints or Fish Audio's base voice model.
            </div>

            <p className="text-xs text-navy-600 mb-4 leading-relaxed">
              Read the calibration sentence below using your natural conversational tone (UI preview):
            </p>

            {/* Prompt reading prompt box */}
            <div className="bg-surface-warm p-4 rounded-2xl border border-surface-border mb-5">
              <p className="text-sm font-semibold text-navy-800 leading-relaxed italic">
                &ldquo;Hello, this is my authentic voiceprint. I am recording this calibration sample so Voiceprint can accurately reproduce my natural tone, pacing, and Hindi-English pronunciation.&rdquo;
              </p>
            </div>

            {/* Dynamic VU Meter & Record Button */}
            <div className="flex flex-col items-center justify-center py-6 bg-navy-50/50 rounded-2xl border border-navy-100 mb-5">
              {isRecording ? (
                <div className="flex flex-col items-center gap-3">
                  <div className="flex items-center gap-1.5 h-12">
                    {Array.from({ length: 12 }).map((_, i) => (
                      <span
                        key={i}
                        className="w-1.5 bg-rose-500 rounded-full animate-wave"
                        style={{
                          height: `${Math.max(10, Math.sin(i) * 36 + 10)}px`,
                          animationDelay: `${i * 0.08}s`
                        }}
                      />
                    ))}
                  </div>
                  <div className="flex items-center gap-2 text-rose-600 font-bold text-sm">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-600 animate-ping" />
                    <span>Recording... 0:{recordTimer < 10 ? `0${recordTimer}` : recordTimer}</span>
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center mx-auto mb-2">
                    <Mic className="w-6 h-6" />
                  </div>
                  <p className="text-xs font-medium text-navy-600">
                    Click the button below to start microphone capture
                  </p>
                </div>
              )}

              <div className="mt-4 flex items-center gap-3">
                <button
                  onClick={handleToggleRecord}
                  className={`px-6 py-3 rounded-2xl font-bold text-sm flex items-center gap-2 transition-all shadow-sm ${
                    isRecording
                      ? 'bg-rose-600 hover:bg-rose-700 text-white'
                      : 'bg-brand-600 hover:bg-brand-700 text-white shadow-glow'
                  }`}
                >
                  {isRecording ? (
                    <>
                      <Square className="w-4 h-4 fill-current" />
                      <span>Stop & Save Sample</span>
                    </>
                  ) : (
                    <>
                      <Mic className="w-4 h-4" />
                      <span>Start Recording</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Upload alternative */}
            <div className="pt-2">
              <div className="border-2 border-dashed border-surface-border hover:border-brand-300 rounded-2xl p-6 text-center transition-colors cursor-pointer bg-surface-warm/30">
                <Upload className="w-8 h-8 text-brand-600 mx-auto mb-2" />
                <p className="text-xs font-bold text-navy-800">
                  Or upload an existing clean audio recording
                </p>
                <p className="text-[11px] text-navy-400 mt-0.5">
                  Supports WAV, MP3, FLAC (16kHz or 44.1kHz, max 25MB)
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setIsUploaded(true);
                    onUpdateProfile({ samplesCount: userProfile.samplesCount + 1 });
                    setTimeout(() => setIsUploaded(false), 3000);
                  }}
                  className="mt-3 px-4 py-1.5 rounded-xl text-xs font-semibold bg-white border border-surface-border text-navy-700 hover:text-brand-700 hover:border-brand-200 transition-colors shadow-2xs"
                >
                  {isUploaded ? 'Sample Added Successfully!' : 'Select File from Device'}
                </button>
              </div>
            </div>
          </div>

          {/* Reference Audio Samples List */}
          <div className="bg-white rounded-3xl border border-surface-border shadow-card p-5 sm:p-7">
            <h3 className="font-bold text-navy-900 text-base mb-3">
              Sample Reference Clips (Demo Mock Data)
            </h3>
            <div className="divide-y divide-surface-border">
              {sampleReferenceFiles.map((file, idx) => (
                <div key={idx} className="py-3 flex items-center justify-between gap-3 first:pt-0 last:pb-0">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center text-xs font-bold">
                      #{idx + 1}
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-navy-900">{file.name}</p>
                      <p className="text-[11px] text-navy-400">{file.duration} • {file.size} • {file.quality}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onTestVoice("Listening to reference calibration snippet.")}
                      className="p-1.5 rounded-lg text-navy-500 hover:text-brand-600 hover:bg-surface-warm transition-colors"
                      title="Play reference"
                    >
                      <Play className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Voice Characteristics Adjustments (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl border border-surface-border shadow-card p-5 sm:p-7">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-surface-border">
              <div className="flex items-center gap-2">
                <Sliders className="w-5 h-5 text-brand-600" />
                <h3 className="font-bold text-navy-900 text-base">Acoustic Characteristics</h3>
              </div>
              <button
                onClick={() => {
                  setPitch(0);
                  setSpeed(1.0);
                  setClarity(94);
                  setStability(92);
                }}
                className="text-xs text-navy-400 hover:text-navy-700 flex items-center gap-1 transition-colors"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            </div>

            <div className="space-y-5">
              {/* Pitch */}
              <div>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <label className="font-semibold text-navy-700">Pitch Offset</label>
                  <span className="font-mono text-brand-700 font-bold">{pitch > 0 ? `+${pitch}` : pitch} semitones</span>
                </div>
                <input
                  type="range"
                  min="-20"
                  max="20"
                  value={pitch}
                  onChange={(e) => setPitch(Number(e.target.value))}
                  className="w-full accent-brand-600 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-navy-400 mt-1">
                  <span>Deeper</span>
                  <span>Natural</span>
                  <span>Higher</span>
                </div>
              </div>

              {/* Cadence / Speed */}
              <div>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <label className="font-semibold text-navy-700">Speaking Pace</label>
                  <span className="font-mono text-brand-700 font-bold">{speed.toFixed(2)}x</span>
                </div>
                <input
                  type="range"
                  min="0.75"
                  max="1.35"
                  step="0.05"
                  value={speed}
                  onChange={(e) => setSpeed(Number(e.target.value))}
                  className="w-full accent-brand-600 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-navy-400 mt-1">
                  <span>Deliberate</span>
                  <span>Normal (1.0x)</span>
                  <span>Energetic</span>
                </div>
              </div>

              {/* Clarity */}
              <div>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <label className="font-semibold text-navy-700">Clarity & Phoneme Articulation</label>
                  <span className="font-mono text-brand-700 font-bold">{clarity}%</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="100"
                  value={clarity}
                  onChange={(e) => setClarity(Number(e.target.value))}
                  className="w-full accent-brand-600 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-navy-400 mt-1">
                  <span>Relaxed</span>
                  <span>Studio Sharp</span>
                </div>
              </div>

              {/* Stability */}
              <div>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <label className="font-semibold text-navy-700">Emotional Stability</label>
                  <span className="font-mono text-brand-700 font-bold">{stability}%</span>
                </div>
                <input
                  type="range"
                  min="40"
                  max="100"
                  value={stability}
                  onChange={(e) => setStability(Number(e.target.value))}
                  className="w-full accent-brand-600 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-navy-400 mt-1">
                  <span>Expressive</span>
                  <span>Consistent</span>
                </div>
              </div>
            </div>

            {/* Test & Save buttons */}
            <div className="mt-7 space-y-2.5">
              <button
                onClick={() => onTestVoice("Hello! This is a real-time audition of your customized voiceprint settings.")}
                className="w-full py-2.5 px-4 rounded-xl border border-brand-300 text-brand-700 hover:bg-brand-50 font-semibold text-xs flex items-center justify-center gap-2 transition-colors"
              >
                <Volume2 className="w-4 h-4 text-brand-600" />
                <span>{isPlayingTest ? 'Auditioning Voice...' : 'Audition Settings (Test Speech)'}</span>
              </button>

              <button
                onClick={handleSaveAdjustments}
                className="w-full py-3 px-4 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-sm"
              >
                {savedSuccess ? (
                  <>
                    <Check className="w-4 h-4 text-white" />
                    <span>Profile Saved!</span>
                  </>
                ) : (
                  <span>Save Voiceprint Profile</span>
                )}
              </button>
            </div>
          </div>

          {/* Consent and Security Card */}
          <div className="p-4 rounded-2xl bg-surface-warm border border-surface-border text-xs text-navy-600 space-y-2">
            <div className="flex items-center gap-2 text-navy-900 font-bold">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Voice Authenticity Guarantee</span>
            </div>
            <p className="leading-relaxed">
              Demo mode: Sample audio recordings and slider adjustments are simulated locally in your browser. When the real Fish Audio API is connected, reference samples will be transmitted securely to the synthesis endpoint.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
