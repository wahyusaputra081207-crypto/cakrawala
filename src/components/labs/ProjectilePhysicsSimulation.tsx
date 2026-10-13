import React, { useState, useRef, useEffect, useId } from 'react';
import { Play, RotateCcw, Target, Gauge } from 'lucide-react';

export const ProjectilePhysicsSimulation: React.FC = () => {
  const [angle, setAngle] = useState<number>(45);
  const [velocity, setVelocity] = useState<number>(28);
  const [gravity, setGravity] = useState<number>(9.8);
  const [isFiring, setIsFiring] = useState<boolean>(false);
  const [flightProgress, setFlightProgress] = useState<number>(1); // 0 to 1

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animRef = useRef<number | null>(null);

  const angleInputId = useId();
  const velocityInputId = useId();

  // Theoretical physics calculations
  const rad = (angle * Math.PI) / 180;
  const tTotal = (2 * velocity * Math.sin(rad)) / gravity;
  const rMax = (Math.pow(velocity, 2) * Math.sin(2 * rad)) / gravity;
  const hMax = (Math.pow(velocity, 2) * Math.pow(Math.sin(rad), 2)) / (2 * gravity);

  // Animate flight when firing
  const handleFire = () => {
    setIsFiring(true);
    setFlightProgress(0);
    const startTime = performance.now();
    const duration = Math.min(3000, Math.max(1200, tTotal * 400));

    const step = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / duration);
      setFlightProgress(progress);

      if (progress < 1) {
        animRef.current = requestAnimationFrame(step);
      } else {
        setIsFiring(false);
      }
    };

    if (animRef.current) cancelAnimationFrame(animRef.current);
    animRef.current = requestAnimationFrame(step);
  };

  const handleReset = () => {
    if (animRef.current) cancelAnimationFrame(animRef.current);
    setIsFiring(false);
    setFlightProgress(1);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Coordinate mapping: origin at (50, height - 40)
    const originX = 50;
    const originY = height - 40;
    const scale = Math.min((width - 80) / Math.max(100, rMax * 1.1), (height - 80) / Math.max(30, hMax * 1.3));

    // Draw coordinate ground
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(30, originY);
    ctx.lineTo(width - 20, originY);
    ctx.stroke();

    // Distance ticks every 20m
    ctx.fillStyle = '#64748b';
    ctx.font = '10px monospace';
    ctx.textAlign = 'center';
    for (let d = 0; d <= rMax * 1.2; d += 20) {
      const x = originX + d * scale;
      if (x < width - 20) {
        ctx.beginPath();
        ctx.moveTo(x, originY - 3);
        ctx.lineTo(x, originY + 5);
        ctx.stroke();
        ctx.fillText(`${d}m`, x, originY + 16);
      }
    }

    // Draw Cannon Base & Barrel
    ctx.save();
    ctx.translate(originX, originY);
    ctx.rotate(-rad);
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(0, -5, 26, 10);
    ctx.restore();

    ctx.beginPath();
    ctx.arc(originX, originY, 8, 0, Math.PI * 2);
    ctx.fillStyle = '#0284c7';
    ctx.fill();

    // Draw Parabolic Trajectory Path
    ctx.strokeStyle = '#0284c7';
    ctx.setLineDash([4, 4]);
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(originX, originY);

    const steps = 60;
    for (let i = 0; i <= steps; i++) {
      const t = (i / steps) * tTotal;
      const x = velocity * Math.cos(rad) * t;
      const y = velocity * Math.sin(rad) * t - 0.5 * gravity * Math.pow(t, 2);
      ctx.lineTo(originX + x * scale, originY - y * scale);
    }
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw Current Projectile Position during flight
    const currentT = flightProgress * tTotal;
    const currentX = velocity * Math.cos(rad) * currentT;
    const currentY = Math.max(0, velocity * Math.sin(rad) * currentT - 0.5 * gravity * Math.pow(currentT, 2));
    const px = originX + currentX * scale;
    const py = originY - currentY * scale;

    // Glow around projectile
    ctx.beginPath();
    ctx.arc(px, py, 6, 0, Math.PI * 2);
    ctx.fillStyle = '#f43f5e';
    ctx.fill();
    ctx.strokeStyle = '#fda4af';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Peak height indicator
    const peakX = originX + (rMax / 2) * scale;
    const peakY = originY - hMax * scale;
    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    ctx.arc(peakX, peakY, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillText(`Puncak: ${hMax.toFixed(1)}m`, peakX, peakY - 8);

    // Target landing point
    const landX = originX + rMax * scale;
    ctx.fillStyle = '#10b981';
    ctx.beginPath();
    ctx.arc(landX, originY, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillText(`Jatuh: ${rMax.toFixed(1)}m`, landX, originY - 8);

  }, [angle, velocity, gravity, flightProgress, rMax, hMax, tTotal, rad]);

  return (
    <div className="bg-slate-900 text-slate-100 rounded-xl p-5 md:p-6 border border-slate-800">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-800 gap-3">
        <div className="flex items-center gap-2">
          <Target className="w-5 h-5 text-sky-400" />
          <div>
            <h3 className="text-lg font-bold text-white tracking-tight">Laboratorium Kinematika & Gerak Parabola</h3>
            <p className="text-xs text-slate-400">Eksplorasi trajektori 2D, komponen kecepatan vektor, dan pengaruh medan gravitasi.</p>
          </div>
        </div>

        {/* Planet Presets */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-800/80 rounded-lg">
          <button
            onClick={() => setGravity(9.8)}
            className={`px-2.5 py-1 text-xs font-medium rounded transition-colors ${
              gravity === 9.8 ? 'bg-sky-600 text-white' : 'text-slate-300 hover:text-white'
            }`}
          >
            Bumi (9.8 m/s²)
          </button>
          <button
            onClick={() => setGravity(3.71)}
            className={`px-2.5 py-1 text-xs font-medium rounded transition-colors ${
              gravity === 3.71 ? 'bg-amber-600 text-white' : 'text-slate-300 hover:text-white'
            }`}
          >
            Mars (3.71 m/s²)
          </button>
          <button
            onClick={() => setGravity(1.62)}
            className={`px-2.5 py-1 text-xs font-medium rounded transition-colors ${
              gravity === 1.62 ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:text-white'
            }`}
          >
            Bulan (1.62 m/s²)
          </button>
        </div>
      </div>

      {/* Main Grid: Visual Canvas & Telemetry Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mt-5">
        {/* Left Column: Canvas Arena */}
        <div className="lg:col-span-8 flex flex-col space-y-3">
          <div className="bg-slate-950 rounded-lg border border-slate-800 p-2 overflow-hidden flex flex-col items-center">
            <canvas
              ref={canvasRef}
              width={640}
              height={280}
              className="w-full max-w-full h-auto select-none"
            />
          </div>

          {/* Metric Telemetry Cards */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-slate-950/80 p-3 rounded-lg border border-slate-800">
              <span className="text-[11px] text-slate-400 font-medium">Jarak Tempuh (R Maks)</span>
              <div className="text-lg font-bold font-mono text-emerald-400 tabular-nums mt-0.5">
                {rMax.toFixed(1)} <span className="text-xs font-normal text-slate-400">meter</span>
              </div>
            </div>
            <div className="bg-slate-950/80 p-3 rounded-lg border border-slate-800">
              <span className="text-[11px] text-slate-400 font-medium">Ketinggian Puncak (H Maks)</span>
              <div className="text-lg font-bold font-mono text-amber-400 tabular-nums mt-0.5">
                {hMax.toFixed(1)} <span className="text-xs font-normal text-slate-400">meter</span>
              </div>
            </div>
            <div className="bg-slate-950/80 p-3 rounded-lg border border-slate-800">
              <span className="text-[11px] text-slate-400 font-medium">Waktu Terbang (T Total)</span>
              <div className="text-lg font-bold font-mono text-sky-400 tabular-nums mt-0.5">
                {tTotal.toFixed(2)} <span className="text-xs font-normal text-slate-400">detik</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Sliders & Actions */}
        <div className="lg:col-span-4 bg-slate-950/60 p-4 rounded-lg border border-slate-800 space-y-5">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Gauge className="w-4 h-4 text-sky-400" />
              Kontrol Peluncuran
            </span>
            <button
              onClick={handleReset}
              className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              Reset
            </button>
          </div>

          {/* Slider 1: Sudut Elevasi */}
          <div>
            <div className="flex justify-between items-center text-xs mb-1.5">
              <label htmlFor={angleInputId} className="text-slate-300 font-medium">Sudut Elevasi (θ)</label>
              <span className={`font-mono font-semibold tabular-nums ${angle === 45 ? 'text-emerald-400' : 'text-sky-400'}`}>
                {angle}° {angle === 45 && '(Optimal R-Max)'}
              </span>
            </div>
            <input
              id={angleInputId}
              type="range"
              min="10"
              max="80"
              step="1"
              value={angle}
              onChange={(e) => setAngle(parseInt(e.target.value, 10))}
              className="w-full accent-sky-500 bg-slate-800 h-1.5 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
              <span>10° (Datar)</span>
              <span>45° (Terjauh)</span>
              <span>80° (Tinggi)</span>
            </div>
          </div>

          {/* Slider 2: Kecepatan Awal */}
          <div>
            <div className="flex justify-between items-center text-xs mb-1.5">
              <label htmlFor={velocityInputId} className="text-slate-300 font-medium">Kecepatan Awal (v₀)</label>
              <span className="font-mono font-semibold tabular-nums text-sky-400">
                {velocity} m/s
              </span>
            </div>
            <input
              id={velocityInputId}
              type="range"
              min="10"
              max="50"
              step="1"
              value={velocity}
              onChange={(e) => setVelocity(parseInt(e.target.value, 10))}
              className="w-full accent-sky-500 bg-slate-800 h-1.5 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
              <span>10 m/s</span>
              <span>30 m/s</span>
              <span>50 m/s</span>
            </div>
          </div>

          {/* Launch Trigger Button */}
          <button
            onClick={handleFire}
            disabled={isFiring}
            className={`w-full py-2.5 px-4 rounded-lg font-semibold text-xs flex items-center justify-center gap-2 shadow transition-all ${
              isFiring
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                : 'bg-sky-600 hover:bg-sky-500 text-white active:scale-95'
            }`}
          >
            <Play className="w-4 h-4 fill-current" />
            {isFiring ? 'Sedang Meluncur...' : 'Luncurkan Meriam Sekarang'}
          </button>

          {/* Principle note */}
          <div className="p-3 bg-slate-900 rounded border border-slate-800 text-xs text-slate-400 space-y-1">
            <span className="font-semibold text-slate-300">Catatan Fisika:</span>
            <p className="leading-relaxed">
              Jarak terjauh dicapai pada sudut <strong>45°</strong> karena nilai dari <code className="text-sky-300">sin(2θ)</code> mencapai titik puncaknya (1) tepat saat 2θ = 90°.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
