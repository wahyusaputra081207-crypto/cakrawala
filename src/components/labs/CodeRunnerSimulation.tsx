import React, { useState } from 'react';
import { Play, RotateCcw, Code2, Terminal, Sparkles, CheckCircle2 } from 'lucide-react';

const PRESETS = [
  {
    id: 'counter',
    name: 'Counter Reaktif & DOM',
    code: `<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; margin: 0; background: #0f172a; color: #f8fafc; }
    .card { background: #1e293b; padding: 24px; border-radius: 12px; border: 1px solid #334155; text-align: center; }
    .display { font-size: 48px; font-weight: bold; color: #38bdf8; margin: 16px 0; font-family: monospace; }
    button { background: #0284c7; color: white; border: none; padding: 10px 20px; font-size: 16px; border-radius: 8px; cursor: pointer; margin: 0 4px; }
    button:hover { background: #0369a1; }
    .status { font-size: 12px; color: #94a3b8; margin-top: 12px; }
  </style>
</head>
<body>
  <div class="card">
    <h3>Eksperimen State Reaktif</h3>
    <div id="val" class="display">0</div>
    <div>
      <button onclick="decrement()">- Kurang</button>
      <button onclick="increment()">+ Tambah</button>
    </div>
    <div id="status" class="status">Siklus render: Siap</div>
  </div>

  <script>
    let count = 0;
    function update() {
      document.getElementById('val').innerText = count;
      document.getElementById('status').innerText = 'Nilai terupdate ke: ' + count;
      console.log('State changed to:', count);
    }
    function increment() { count++; update(); }
    function decrement() { count--; update(); }
  </script>
</body>
</html>`
  },
  {
    id: 'canvas',
    name: 'Animasi Canvas Partikel',
    code: `<!DOCTYPE html>
<html>
<head>
  <style>
    body { margin: 0; overflow: hidden; background: #090d16; }
    canvas { display: block; width: 100vw; height: 100vh; }
  </style>
</head>
<body>
  <canvas id="c"></canvas>
  <script>
    const canvas = document.getElementById('c');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    for(let i = 0; i < 40; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        radius: Math.random() * 3 + 2,
        color: i % 2 === 0 ? '#38bdf8' : '#818cf8'
      });
    }

    function animate() {
      ctx.fillStyle = 'rgba(9, 13, 22, 0.2)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        if(p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if(p.y < 0 || p.y > canvas.height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
      });

      requestAnimationFrame(animate);
    }
    animate();
    console.log('Animasi canvas 40 partikel berjalan!');
  </script>
</body>
</html>`
  }
];

export const CodeRunnerSimulation: React.FC = () => {
  const [activePreset, setActivePreset] = useState<string>('counter');
  const [code, setCode] = useState<string>(PRESETS[0].code);
  const [iframeSrcDoc, setIframeSrcDoc] = useState<string>(PRESETS[0].code);
  const [logs, setLogs] = useState<string[]>(['[Sistem] Editor siap dijalankan. Klik "Jalankan Kode" untuk pratinjau.']);
  const [isRunning, setIsRunning] = useState<boolean>(false);

  const handleRun = () => {
    setIsRunning(true);
    setIframeSrcDoc(code);
    const timestamp = new Date().toLocaleTimeString('id-ID');
    setLogs((prev) => [`[${timestamp}] Eksekusi berhasil diperbarui pada DOM Sandbox.`, ...prev.slice(0, 8)]);
    setTimeout(() => setIsRunning(false), 300);
  };

  const handleSelectPreset = (id: string) => {
    const selected = PRESETS.find((p) => p.id === id);
    if (selected) {
      setActivePreset(id);
      setCode(selected.code);
      setIframeSrcDoc(selected.code);
      setLogs([`[Sistem] Memuat preset: ${selected.name}`]);
    }
  };

  const handleReset = () => {
    const selected = PRESETS.find((p) => p.id === activePreset);
    if (selected) {
      setCode(selected.code);
      setIframeSrcDoc(selected.code);
      setLogs(['[Sistem] Kode telah direset ke versi default.']);
    }
  };

  return (
    <div className="bg-slate-900 text-slate-100 rounded-xl p-5 md:p-6 border border-slate-800">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-800 gap-3">
        <div className="flex items-center gap-2">
          <Code2 className="w-5 h-5 text-sky-400" />
          <div>
            <h3 className="text-lg font-bold text-white tracking-tight">Lab Editor Kode & Sandbox Eksekusi Langsung</h3>
            <p className="text-xs text-slate-400">Lingkungan aman terisolasi untuk menguji HTML, CSS, dan logika JavaScript secara interaktif.</p>
          </div>
        </div>

        {/* Template Selectors */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 hidden sm:inline">Contoh:</span>
          <div className="flex items-center gap-1 bg-slate-800/80 p-1 rounded-lg">
            {PRESETS.map((p) => (
              <button
                key={p.id}
                onClick={() => handleSelectPreset(p.id)}
                className={`px-2.5 py-1 text-xs font-medium rounded transition-colors ${
                  activePreset === p.id ? 'bg-sky-600 text-white' : 'text-slate-300 hover:text-white'
                }`}
              >
                {p.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Split: Code Editor vs Live Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mt-5">
        {/* Left Column: Code Editor */}
        <div className="lg:col-span-6 flex flex-col h-[400px]">
          <div className="flex items-center justify-between bg-slate-950 px-3 py-2 rounded-t-lg border border-slate-800 border-b-0 text-xs">
            <div className="flex items-center gap-2 text-slate-300 font-mono">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80"></span>
              <span className="ml-2 font-medium">index.html (Interaktif)</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleReset}
                className="text-slate-400 hover:text-slate-200 flex items-center gap-1 text-[11px]"
                title="Reset Kode"
              >
                <RotateCcw className="w-3 h-3" />
                Reset
              </button>
              <button
                onClick={handleRun}
                disabled={isRunning}
                className="bg-sky-600 hover:bg-sky-500 text-white px-3 py-1 rounded font-medium flex items-center gap-1.5 transition-colors text-[11px] shadow"
              >
                <Play className="w-3 h-3 fill-current" />
                Jalankan Kode
              </button>
            </div>
          </div>

          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            spellCheck={false}
            className="flex-1 w-full bg-slate-950 text-slate-200 font-mono text-xs p-3.5 border border-slate-800 rounded-b-lg resize-none focus:outline-none focus:border-sky-500 leading-relaxed tracking-wide"
          />
        </div>

        {/* Right Column: Live Output & Console */}
        <div className="lg:col-span-6 flex flex-col h-[400px] space-y-3">
          {/* Output Preview Iframe */}
          <div className="flex-1 flex flex-col rounded-lg border border-slate-800 overflow-hidden bg-slate-950">
            <div className="bg-slate-950 px-3 py-1.5 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                Pratinjau Hasil Nyata
              </span>
              <span className="text-[11px] text-emerald-400 font-mono flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                Live Sandbox
              </span>
            </div>
            <iframe
              srcDoc={iframeSrcDoc}
              title="Interactive Code Output"
              sandbox="allow-scripts"
              className="flex-1 w-full border-0 bg-slate-950"
            />
          </div>

          {/* Mini Console Output */}
          <div className="h-28 bg-slate-950 rounded-lg border border-slate-800 p-2.5 flex flex-col text-xs font-mono">
            <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mb-1 border-b border-slate-900 pb-1">
              <Terminal className="w-3 h-3 text-sky-400" />
              <span>Log Konsol Runtime</span>
            </div>
            <div className="flex-1 overflow-y-auto space-y-0.5 text-[11px] text-slate-300">
              {logs.map((log, i) => (
                <div key={i} className="text-slate-400 truncate">
                  {log}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
