import React, { useState, useRef, useEffect } from 'react';
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
  Check,
  Download,
  AlertCircle,
  ExternalLink,
  Info
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
  // Real Audio Recording State
  const [isRecording, setIsRecording] = useState(false);
  const [recordTimer, setRecordTimer] = useState(0);
  const [recordingError, setRecordingError] = useState<string | null>(null);
  const [recordedAudioUrl, setRecordedAudioUrl] = useState<string | null>(null);
  const [isPlayingRecorded, setIsPlayingRecorded] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [isUploaded, setIsUploaded] = useState(false);

  // References for MediaRecorder and Audio playback
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerIntervalRef = useRef<number | null>(null);
  const recordedAudioElementRef = useRef<HTMLAudioElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Local adjustment sliders
  const [pitch, setPitch] = useState(userProfile.pitch);
  const [speed, setSpeed] = useState(userProfile.speed);
  const [clarity, setClarity] = useState(userProfile.clarity);
  const [stability, setStability] = useState(userProfile.stability);

  // Clean up recording and timers on unmount
  useEffect(() => {
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.stop();
      }
      if (recordedAudioUrl) {
        URL.revokeObjectURL(recordedAudioUrl);
      }
    };
  }, [recordedAudioUrl]);

  // Start real browser MediaRecorder capture
  const startRecording = async () => {
    setRecordingError(null);
    audioChunksRef.current = [];

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Your browser does not support microphone audio capture.');
      }

      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        } 
      });

      const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
        ? 'audio/webm;codecs=opus'
        : MediaRecorder.isTypeSupported('audio/mp4')
        ? 'audio/mp4'
        : '';

      const recorder = mimeType ? new MediaRecorder(stream, { mimeType }) : new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        // Stop all tracks on the stream to release the mic light
        stream.getTracks().forEach((track) => track.stop());

        const blob = new Blob(audioChunksRef.current, { type: mimeType || 'audio/webm' });
        if (blob.size > 0) {
          if (recordedAudioUrl) URL.revokeObjectURL(recordedAudioUrl);
          const url = URL.createObjectURL(blob);
          setRecordedAudioUrl(url);
          onUpdateProfile({ samplesCount: userProfile.samplesCount + 1 });
        }
      };

      recorder.start(150);
      setIsRecording(true);
      setRecordTimer(0);

      timerIntervalRef.current = window.setInterval(() => {
        setRecordTimer((prev) => {
          if (prev >= 20) {
            stopRecording();
            return 20;
          }
          return prev + 1;
        });
      }, 1000);
    } catch (err: unknown) {
      console.error('Microphone error:', err);
      const message = err instanceof Error ? err.message : 'Microphone access denied or unavailable.';
      setRecordingError(message);
      setIsRecording(false);
    }
  };

  // Stop recording
  const stopRecording = () => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }

    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
  };

  const handleToggleRecord = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  // Play / Pause the recorded audio snippet
  const togglePlayRecordedAudio = () => {
    if (!recordedAudioUrl) return;

    if (!recordedAudioElementRef.current) {
      recordedAudioElementRef.current = new Audio(recordedAudioUrl);
      recordedAudioElementRef.current.onended = () => setIsPlayingRecorded(false);
    } else if (recordedAudioElementRef.current.src !== recordedAudioUrl) {
      recordedAudioElementRef.current.src = recordedAudioUrl;
      recordedAudioElementRef.current.onended = () => setIsPlayingRecorded(false);
    }

    if (isPlayingRecorded) {
      recordedAudioElementRef.current.pause();
      setIsPlayingRecorded(false);
    } else {
      recordedAudioElementRef.current.play().then(() => {
        setIsPlayingRecorded(true);
      }).catch((e) => {
        console.error('Audio play error:', e);
        setIsPlayingRecorded(false);
      });
    }
  };

  // Handle local file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (recordedAudioUrl) URL.revokeObjectURL(recordedAudioUrl);
      const url = URL.createObjectURL(file);
      setRecordedAudioUrl(url);
      setIsUploaded(true);
      onUpdateProfile({ samplesCount: userProfile.samplesCount + 1 });
      setTimeout(() => setIsUploaded(false), 3000);
    }
  };

  const handleSaveAdjustments = () => {
    onUpdateProfile({ pitch, speed, clarity, stability });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
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
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 border border-brand-200 text-brand-700 text-xs font-semibold mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Vocal Profile & Microphone Studio</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-navy-900 tracking-tight">
          My Voiceprint Studio
        </h2>
        <p className="text-sm text-navy-500 mt-1">
          Record your authentic voice sample or upload clean audio to calibrate your vocal identity.
        </p>
      </div>

      {/* Voice Status & Calibration Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        {/* Card 1: Calibration Status */}
        <div className="bg-white rounded-3xl p-5 border border-surface-border shadow-card flex items-start justify-between">
          <div>
            <span className="text-xs font-bold text-brand-600 uppercase tracking-wider block mb-1">
              Microphone Capture
            </span>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-bold text-navy-900">
                {recordedAudioUrl ? 'Sample Recorded' : 'Ready to Record'}
              </h3>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                recordedAudioUrl 
                  ? 'bg-emerald-100 text-emerald-800 border-emerald-200' 
                  : 'bg-surface-warm text-navy-600 border-surface-border'
              }`}>
                {recordedAudioUrl ? 'Active Clip' : 'Standby'}
              </span>
            </div>
            <p className="text-xs text-navy-500 mt-1">
              {recordedAudioUrl ? 'Ready for export or audition' : 'Use browser microphone'}
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-brand-50 border border-brand-200 flex items-center justify-center text-brand-600">
            <Mic className="w-6 h-6" />
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
              {userProfile.samplesCount > 0 ? 'Recorded & uploaded clips' : 'No samples added yet'}
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600">
            <FileAudio className="w-6 h-6" />
          </div>
        </div>

        {/* Card 3: Acoustic Fingerprint */}
        <div className="bg-white rounded-3xl p-5 border border-surface-border shadow-card flex items-start justify-between">
          <div>
            <span className="text-xs font-bold text-navy-400 uppercase tracking-wider block mb-1">
              Cloning Protocol
            </span>
            <h3 className="text-xl font-bold text-navy-900">Fish Audio Ready</h3>
            <p className="text-xs text-brand-600 font-medium mt-1">
              S2 Reference Audio Architecture
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-600">
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

            {/* Error banner if microphone fails */}
            {recordingError && (
              <div className="p-3.5 mb-4 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="font-bold block">Microphone Access Error:</strong>
                  <span>{recordingError}</span>
                  <p className="mt-1 text-[11px] text-rose-600">
                    Please allow microphone permissions in your browser bar and reload.
                  </p>
                </div>
              </div>
            )}

            <p className="text-xs text-navy-600 mb-3 leading-relaxed">
              Read the calibration sentence below using your natural conversational tone:
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
                    {Array.from({ length: 16 }).map((_, i) => (
                      <span
                        key={i}
                        className="w-1.5 bg-rose-500 rounded-full animate-wave"
                        style={{
                          height: `${Math.max(12, Math.abs(Math.sin((i + recordTimer) * 0.8)) * 40 + 10)}px`,
                          animationDelay: `${(i % 5) * 0.1}s`
                        }}
                      />
                    ))}
                  </div>
                  <div className="flex items-center gap-2 text-rose-600 font-bold text-sm">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-600 animate-ping" />
                    <span>Live Recording: 0:{recordTimer < 10 ? `0${recordTimer}` : recordTimer} / 0:20</span>
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center mx-auto mb-2">
                    <Mic className="w-6 h-6" />
                  </div>
                  <p className="text-xs font-medium text-navy-600">
                    Click below to capture real audio from your microphone
                  </p>
                </div>
              )}

              <div className="mt-4 flex items-center gap-3">
                <button
                  type="button"
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
                      <span>Stop & Capture Clip</span>
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

            {/* Playback of Recorded Sample */}
            {recordedAudioUrl && (
              <div className="p-4 mb-5 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={togglePlayRecordedAudio}
                    className="w-10 h-10 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center shadow-xs transition-colors"
                    title={isPlayingRecorded ? "Pause recording" : "Play recording"}
                  >
                    {isPlayingRecorded ? <Square className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 ml-0.5 fill-current" />}
                  </button>
                  <div>
                    <h4 className="text-xs font-bold text-emerald-950">Recorded Voiceprint Snippet</h4>
                    <p className="text-[11px] text-emerald-700">Ready for playback or export</p>
                  </div>
                </div>

                <a
                  href={recordedAudioUrl}
                  download="my_voiceprint_reference.webm"
                  className="px-3 py-1.5 rounded-xl bg-white border border-emerald-300 text-emerald-800 text-xs font-semibold hover:bg-emerald-100/60 flex items-center gap-1.5 transition-colors shadow-2xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download</span>
                </a>
              </div>
            )}

            {/* Upload alternative */}
            <div className="pt-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="audio/*"
                onChange={handleFileUpload}
                className="hidden"
              />
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-surface-border hover:border-brand-300 rounded-2xl p-6 text-center transition-colors cursor-pointer bg-surface-warm/30 group"
              >
                <Upload className="w-8 h-8 text-brand-600 mx-auto mb-2 group-hover:scale-105 transition-transform" />
                <p className="text-xs font-bold text-navy-800">
                  Or upload an existing clean audio recording
                </p>
                <p className="text-[11px] text-navy-400 mt-0.5">
                  Supports WAV, MP3, WebM, FLAC (Clean acoustic environment recommended)
                </p>
                <button
                  type="button"
                  className="mt-3 px-4 py-1.5 rounded-xl text-xs font-semibold bg-white border border-surface-border text-navy-700 group-hover:text-brand-700 group-hover:border-brand-200 transition-colors shadow-2xs"
                >
                  {isUploaded ? 'File Uploaded Successfully!' : 'Select File from Device'}
                </button>
              </div>
            </div>
          </div>

          {/* Reference Audio Samples List */}
          <div className="bg-white rounded-3xl border border-surface-border shadow-card p-5 sm:p-7">
            <h3 className="font-bold text-navy-900 text-base mb-3">
              Standard Calibration Datasets (Audition Samples)
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
                      type="button"
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
                type="button"
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
                  <label className="font-semibold text-navy-700">Clarity & Articulation</label>
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
                  <label className="font-semibold text-navy-700">Emotional Dynamic Range</label>
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
                  <span>Steady</span>
                </div>
              </div>
            </div>

            {/* Test & Save buttons */}
            <div className="mt-7 space-y-2.5">
              <button
                type="button"
                onClick={() => onTestVoice("Hello! This is an audition of your customized voiceprint acoustic profile.")}
                className="w-full py-2.5 px-4 rounded-xl border border-brand-300 text-brand-700 hover:bg-brand-50 font-semibold text-xs flex items-center justify-center gap-2 transition-colors"
              >
                <Volume2 className="w-4 h-4 text-brand-600" />
                <span>{isPlayingTest ? 'Auditioning Voice...' : 'Audition Settings (Test Speech)'}</span>
              </button>

              <button
                type="button"
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

          {/* Honest Fish Audio Custom Clone Guide */}
          <div className="p-5 rounded-3xl bg-surface-warm border border-surface-border text-xs text-navy-700 space-y-3 shadow-card">
            <div className="flex items-center gap-2 text-navy-900 font-bold">
              <Info className="w-4 h-4 text-brand-600" />
              <span>How Fish Audio Voice Cloning Works</span>
            </div>
            <p className="leading-relaxed text-navy-600">
              Fish Audio S2 supports zero-shot voice cloning using reference audio embeddings. To deploy your own custom voice ID:
            </p>
            <ol className="list-decimal list-inside space-y-1 text-navy-600 text-[11px]">
              <li>Record or export your clean audio clip above (10-20 seconds).</li>
              <li>Upload it to your <a href="https://fish.audio" target="_blank" rel="noreferrer" className="text-brand-600 font-semibold underline inline-flex items-center gap-0.5">Fish Audio Studio <ExternalLink className="w-2.5 h-2.5" /></a> account.</li>
              <li>Obtain your unique 32-character Voice Reference ID.</li>
              <li>Configure it in <strong>Settings</strong> or add it to your custom voice catalog.</li>
            </ol>
          </div>

          {/* Consent and Security Card */}
          <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 text-xs text-emerald-950 space-y-2">
            <div className="flex items-center gap-2 font-bold text-emerald-900">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Voice Authenticity Guarantee</span>
            </div>
            <p className="leading-relaxed text-[11px] text-emerald-800">
              Only record voices you have explicit permission to use. Voiceprint never transmits your biometric voice sample to third parties without your direct API key authorization.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
