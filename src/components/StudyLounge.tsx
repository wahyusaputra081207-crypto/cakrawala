import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Volume2, VolumeX, Users, Clock, Coffee, FileEdit } from 'lucide-react';
import { STUDY_LOUNGE_PARTICIPANTS } from '../data/mockData';

export const StudyLounge: React.FC = () => {
  // Pomodoro states: 'focus' (25m), 'shortBreak' (5m), 'longBreak' (15m)
  const [timerMode, setTimerMode] = useState<'focus' | 'shortBreak' | 'longBreak'>('focus');
  const [timeLeft, setTimeLeft] = useState<number>(25 * 60);
  const [isRunning, setIsRunning] = useState<boolean>(false);

  // Web Audio Synth for ambient focus sound
  const [ambientSound, setAmbientSound] = useState<'off' | 'rain' | 'whitenoise'>('off');
  const audioCtxRef = useRef<AudioContext | null>(null);
  const noiseNodeRef = useRef<AudioNode | null>(null);

  // Shared study notes state
  const [studyNotes, setStudyNotes] = useState<string>(
    `- Catatan Rumus Gerak Parabola: R = (v0^2 * sin(2θ)) / g\n- Review Efek Bohr: Penurunan pH menurunkan afinitas Hb terhadap O2\n- Target hari ini: Selesaikan Kuis Modul 1 Frontend React`
  );

  // Timer Tick
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      setIsRunning(false);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, timeLeft]);

  const switchMode = (mode: 'focus' | 'shortBreak' | 'longBreak') => {
    setTimerMode(mode);
    setIsRunning(false);
    if (mode === 'focus') setTimeLeft(25 * 60);
    if (mode === 'shortBreak') setTimeLeft(5 * 60);
    if (mode === 'longBreak') setTimeLeft(15 * 60);
  };

  const resetTimer = () => {
    setIsRunning(false);
    if (timerMode === 'focus') setTimeLeft(25 * 60);
    if (timerMode === 'shortBreak') setTimeLeft(5 * 60);
    if (timerMode === 'longBreak') setTimeLeft(15 * 60);
  };

  // Web Audio Noise Generator
  const toggleAmbientSound = (type: 'rain' | 'whitenoise') => {
    if (ambientSound === type) {
      stopAudio();
      setAmbientSound('off');
      return;
    }

    stopAudio();
    try {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioContextClass();
      audioCtxRef.current = ctx;

      const bufferSize = ctx.sampleRate * 2;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);

      // Generate soft pink/white noise
      let b0 = 0, b1 = 0, b2 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        if (type === 'rain') {
          // Low pass pink filtering for soft rain effect
          b0 = 0.99 * b0 + white * 0.05;
          b1 = 0.95 * b1 + white * 0.05;
          b2 = 0.85 * b2 + white * 0.1;
          output[i] = (b0 + b1 + b2) * 0.2;
        } else {
          output[i] = white * 0.06;
        }
      }

      const whiteNoise = ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;

      const gainNode = ctx.createGain();
      gainNode.gain.setValueAtTime(0.15, ctx.currentTime);

      whiteNoise.connect(gainNode);
      gainNode.connect(ctx.destination);
      whiteNoise.start();

      noiseNodeRef.current = whiteNoise;
      setAmbientSound(type);
    } catch {
      setAmbientSound('off');
    }
  };

  const stopAudio = () => {
    if (audioCtxRef.current) {
      try {
        audioCtxRef.current.close();
      } catch {}
      audioCtxRef.current = null;
    }
  };

  useEffect(() => {
    return () => {
      stopAudio();
    };
  }, []);

  const formatMinutes = Math.floor(timeLeft / 60);
  const formatSeconds = timeLeft % 60;
  const timeFormatted = `${String(formatMinutes).padStart(2, '0')}:${String(formatSeconds).padStart(2, '0')}`;

  return (
    <section id="ruang-belajar" className="py-12 bg-white border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between pb-6 border-b border-slate-200 gap-4">
          <div>
            <div className="text-xs font-semibold text-sky-600 uppercase tracking-wider mb-1">
              Fokus & Produktivitas Belajar
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
              Ruang Belajar Virtual & Timer Pomodoro
            </h2>
            <p className="text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
              Jaga ritme konsentrasi tinggi bersama sesama pelajar dengan teknik interval Pomodoro, audio suasana fokus, dan papan catatan cepat.
            </p>
          </div>

          <div className="text-xs text-slate-500 font-mono flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>4 Pelajar Sedang Aktif di Sesi Belajar</span>
          </div>
        </div>

        {/* 3-Column Layout: Pomodoro Timer, Scratchpad Notes, Active Peers */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-8">
          {/* Column 1: Pomodoro Timer (5 cols) */}
          <div className="lg:col-span-5 bg-slate-900 text-white rounded-2xl p-6 border border-slate-800 flex flex-col justify-between shadow-sm">
            <div>
              {/* Mode Switchers */}
              <div className="flex items-center justify-center gap-1 p-1 bg-slate-800 rounded-lg max-w-xs mx-auto mb-6">
                <button
                  onClick={() => switchMode('focus')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                    timerMode === 'focus' ? 'bg-sky-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Fokus (25m)
                </button>
                <button
                  onClick={() => switchMode('shortBreak')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                    timerMode === 'shortBreak' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Jeda (5m)
                </button>
                <button
                  onClick={() => switchMode('longBreak')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                    timerMode === 'longBreak' ? 'bg-amber-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Istirahat (15m)
                </button>
              </div>

              {/* Huge Tabular Digital Clock */}
              <div className="text-center my-4">
                <div className="text-6xl sm:text-7xl font-bold font-mono tracking-tight text-white tabular-nums">
                  {timeFormatted}
                </div>
                <div className="text-xs text-slate-400 mt-2 font-medium">
                  {timerMode === 'focus'
                    ? 'Sesi Konsentrasi Mendalam (Deep Work)'
                    : 'Waktu Istirahat & Relaksasi Otak'}
                </div>
              </div>

              {/* Timer Controls */}
              <div className="flex items-center justify-center gap-3 my-6">
                <button
                  onClick={() => setIsRunning(!isRunning)}
                  className={`px-6 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 shadow-md transition-all ${
                    isRunning
                      ? 'bg-amber-600 hover:bg-amber-500 text-white'
                      : 'bg-sky-600 hover:bg-sky-500 text-white active:scale-95'
                  }`}
                >
                  {isRunning ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
                  <span>{isRunning ? 'Jeda Timer' : 'Mulai Sesi'}</span>
                </button>

                <button
                  onClick={resetTimer}
                  className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-colors"
                  title="Reset Timer"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Ambient Sound Bar */}
            <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-400 flex items-center gap-1.5">
                <Volume2 className="w-4 h-4 text-sky-400" />
                Suasana Fokus:
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => toggleAmbientSound('rain')}
                  className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors ${
                    ambientSound === 'rain' ? 'bg-sky-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  Rintik Hujan
                </button>
                <button
                  onClick={() => toggleAmbientSound('whitenoise')}
                  className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors ${
                    ambientSound === 'whitenoise' ? 'bg-sky-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  White Noise
                </button>
                {ambientSound !== 'off' && (
                  <button
                    onClick={() => {
                      stopAudio();
                      setAmbientSound('off');
                    }}
                    className="p-1 rounded bg-slate-800 text-rose-400 hover:bg-slate-700"
                    title="Matikan Suara"
                  >
                    <VolumeX className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Column 2: Scratchpad & Quick Study Notes (4 cols) */}
          <div className="lg:col-span-4 bg-slate-50 rounded-2xl p-5 border border-slate-200 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <FileEdit className="w-4 h-4 text-sky-600" />
                  <span className="text-xs font-bold text-slate-900">Papan Catatan Belajar Sesi Ini</span>
                </div>
                <span className="text-[11px] text-slate-400">Tersimpan otomatis</span>
              </div>

              <textarea
                value={studyNotes}
                onChange={(e) => setStudyNotes(e.target.value)}
                rows={8}
                placeholder="Tuliskan poin penting materi, rumus yang sedang dihafal, atau daftar tugas belajar..."
                className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs text-slate-800 font-mono leading-relaxed focus:outline-none focus:ring-1 focus:ring-sky-500 resize-none"
              />
            </div>

            <div className="text-[11px] text-slate-500 mt-3 flex items-center justify-between">
              <span>Tips: Gunakan Pomodoro 25/5 untuk latihan intensif.</span>
              <button
                onClick={() => setStudyNotes('')}
                className="text-slate-400 hover:text-rose-600 text-[11px]"
              >
                Kosongkan
              </button>
            </div>
          </div>

          {/* Column 3: Active Study Peers (3 cols) */}
          <div className="lg:col-span-3 bg-white rounded-2xl p-5 border border-slate-200 flex flex-col">
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-sky-600" />
                <span className="text-xs font-bold text-slate-900">Rekan Belajar Aktif</span>
              </div>
              <span className="text-[10px] text-emerald-600 font-semibold">Online</span>
            </div>

            <div className="space-y-3.5 flex-1">
              {STUDY_LOUNGE_PARTICIPANTS.map((peer) => (
                <div key={peer.id} className="flex items-center gap-3">
                  <img
                    src={peer.avatar}
                    alt={peer.name}
                    referrerPolicy="no-referrer"
                    className="w-8 h-8 rounded-full object-cover border border-slate-200"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-bold text-slate-900 truncate">{peer.name}</div>
                    <div className="text-[11px] text-slate-500 truncate">{peer.status}</div>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono tabular-nums shrink-0">
                    {peer.minutes}m
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 text-center">
              <span className="text-[11px] text-slate-500">
                Kamu bergabung sebagai <strong className="text-slate-800">Fahri Wahyu</strong>
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
