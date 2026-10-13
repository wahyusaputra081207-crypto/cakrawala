import React, { useState, useId } from 'react';
import { RotateCcw, Play, Pause, Activity } from 'lucide-react';

export const BohrEffectSimulation: React.FC = () => {
  const [ph, setPh] = useState<number>(7.4);
  const [pco2, setPco2] = useState<number>(40);
  const [temp, setTemp] = useState<number>(37.0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);

  const phInputId = useId();
  const pco2InputId = useId();
  const tempInputId = useId();

  // Bohr Shift calculation
  // Normal values: pH 7.4, pCO2 40 mmHg, Temp 37 C
  // Right shift (decreased affinity, easier O2 release): lower pH, higher pCO2, higher Temp
  // Left shift (increased affinity, harder O2 release): higher pH, lower pCO2, lower Temp
  const deltaPh = 7.4 - ph; // positive if acidic (causes right shift)
  const deltaCo2 = (pco2 - 40) / 40; // positive if high CO2
  const deltaTemp = (temp - 37) / 10;

  // Shift parameter in mmHg (P50 shifts from nominal 26.8 mmHg)
  const shift = deltaPh * 28 + deltaCo2 * 8 + deltaTemp * 6;
  const p50 = Math.max(12, Math.min(50, 26.8 + shift));

  // Determine metabolic state
  const isElevated = shift > 3.0;
  const isAlkalotic = shift < -3.0;

  // Calculate saturation curve points for SVG (pO2 from 0 to 100 mmHg)
  // Hill equation approximation: S = (pO2^n) / (pO2^n + P50^n), n ~ 2.7
  const n = 2.7;
  const points = [];
  const nominalPoints = [];
  for (let po2 = 0; po2 <= 100; po2 += 4) {
    const s = Math.pow(po2, n) / (Math.pow(po2, n) + Math.pow(p50, n));
    const sNominal = Math.pow(po2, n) / (Math.pow(po2, n) + Math.pow(26.8, n));
    // SVG coordinates: width 380, height 200 (x: 40 -> 360, y: 170 -> 20)
    const x = 40 + (po2 / 100) * 320;
    const y = 170 - s * 150;
    const yNominal = 170 - sNominal * 150;
    points.push(`${x.toFixed(1)},${y.toFixed(1)}`);
    nominalPoints.push(`${x.toFixed(1)},${yNominal.toFixed(1)}`);
  }
  const curvePath = `M ${points.join(' L ')}`;
  const nominalCurvePath = `M ${nominalPoints.join(' L ')}`;

  // Apply clinical preset
  const applyPreset = (preset: 'normal' | 'exercise' | 'alkalosis') => {
    if (preset === 'normal') {
      setPh(7.4);
      setPco2(40);
      setTemp(37.0);
    } else if (preset === 'exercise') {
      setPh(7.15);
      setPco2(58);
      setTemp(38.8);
    } else if (preset === 'alkalosis') {
      setPh(7.6);
      setPco2(26);
      setTemp(36.2);
    }
  };

  return (
    <div className="bg-slate-900 text-slate-100 rounded-xl p-5 md:p-6 border border-slate-800">
      {/* Simulation Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-800 gap-3">
        <div>
          <div className="flex items-center gap-3">
            <h3 className="text-lg font-bold text-white tracking-tight">Simulasi Efek Bohr & Afinitas Oksigen Seluler</h3>
            {isElevated ? (
              <span className="text-xs font-semibold text-rose-400 bg-rose-950/80 px-2 py-0.5 rounded border border-rose-800/60">
                ▲ PERGESERAN KANAN (ASIDOSIS/LATIHAN)
              </span>
            ) : isAlkalotic ? (
              <span className="text-xs font-semibold text-amber-400 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-800/60">
                ▼ PERGESERAN KIRI (ALKALOSIS)
              </span>
            ) : (
              <span className="text-xs font-semibold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800/60">
                ● STATUS NOMINAL (FISIOLOGIS)
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Model interaktif pertukaran gas kapiler berdasarkan kurva disosiasi hemoglobin Hill (P50: {p50.toFixed(1)} mmHg)
          </p>
        </div>

        {/* Preset Buttons */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-800/80 rounded-lg shrink-0">
          <button
            onClick={() => applyPreset('normal')}
            className={`px-2.5 py-1 text-xs font-medium rounded transition-colors ${
              ph === 7.4 && pco2 === 40 && temp === 37 ? 'bg-sky-600 text-white' : 'text-slate-300 hover:text-white'
            }`}
          >
            Istirahat Normal
          </button>
          <button
            onClick={() => applyPreset('exercise')}
            className={`px-2.5 py-1 text-xs font-medium rounded transition-colors ${
              ph === 7.15 ? 'bg-rose-600 text-white' : 'text-slate-300 hover:text-white'
            }`}
          >
            Latihan Berat
          </button>
          <button
            onClick={() => applyPreset('alkalosis')}
            className={`px-2.5 py-1 text-xs font-medium rounded transition-colors ${
              ph === 7.6 ? 'bg-amber-600 text-white' : 'text-slate-300 hover:text-white'
            }`}
          >
            Hiperventilasi
          </button>
        </div>
      </div>

      {/* Two-Zone Sandbox Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6 items-start">
        {/* Left Interactive Stage (Graph + Capillary Animation) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Real-time Dissociation Curve SVG */}
          <div className="bg-slate-950 rounded-lg p-3 border border-slate-800 relative">
            <div className="flex items-center justify-between px-2 pt-1 pb-2 text-xs text-slate-400 border-b border-slate-900">
              <span className="font-semibold text-slate-300">Kurva Disosiasi Hemoglobin Oksigen</span>
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5 text-slate-400">
                  <span className="inline-block w-3 h-0.5 bg-slate-600 border-t border-dashed border-slate-400"></span>
                  Garis Standar (pH 7.4)
                </span>
                <span className="flex items-center gap-1.5 text-sky-400 font-medium">
                  <span className="inline-block w-3 h-0.5 bg-sky-400"></span>
                  Kondisi Aktif (P50 = {p50.toFixed(1)})
                </span>
              </div>
            </div>

            <svg viewBox="0 0 380 200" className="w-full h-52 mt-1 select-none">
              {/* Grid Lines */}
              <line x1="40" y1="20" x2="40" y2="170" stroke="#334155" strokeWidth="1" />
              <line x1="40" y1="170" x2="360" y2="170" stroke="#334155" strokeWidth="1" />
              
              {/* Horizontal Reference Lines (25%, 50%, 75%, 100%) */}
              {[25, 50, 75, 100].map((val) => {
                const y = 170 - (val / 100) * 150;
                return (
                  <g key={val}>
                    <line x1="40" y1={y} x2="360" y2={y} stroke="#1e293b" strokeWidth="1" strokeDasharray="3 3" />
                    <text x="32" y={y + 3} fill="#64748b" fontSize="8" textAnchor="end" className="font-mono tabular-nums">
                      {val}%
                    </text>
                  </g>
                );
              })}

              {/* Vertical Reference Lines (20, 40, 60, 80, 100 mmHg) */}
              {[20, 40, 60, 80, 100].map((po2) => {
                const x = 40 + (po2 / 100) * 320;
                return (
                  <g key={po2}>
                    <line x1={x} y1="20" x2={x} y2="170" stroke="#1e293b" strokeWidth="1" strokeDasharray="3 3" />
                    <text x={x} y="183" fill="#64748b" fontSize="8" textAnchor="middle" className="font-mono tabular-nums">
                      {po2}
                    </text>
                  </g>
                );
              })}

              {/* Nominal Reference Line */}
              <path d={nominalCurvePath} fill="none" stroke="#475569" strokeWidth="1.5" strokeDasharray="4 4" />

              {/* Active Condition Line */}
              <path d={curvePath} fill="none" stroke={isElevated ? '#f43f5e' : isAlkalotic ? '#f59e0b' : '#38bdf8'} strokeWidth="2.5" />

              {/* P50 Marker Point */}
              {(() => {
                const p50X = 40 + (p50 / 100) * 320;
                const p50Y = 170 - 0.5 * 150;
                return (
                  <g>
                    <line x1={p50X} y1={p50Y} x2={p50X} y2="170" stroke="#f43f5e" strokeWidth="1" strokeDasharray="2 2" />
                    <circle cx={p50X} cy={p50Y} r="4" fill="#f43f5e" />
                    <text x={p50X + 6} y={p50Y - 4} fill="#f43f5e" fontSize="8" fontWeight="bold">
                      P50 ({p50.toFixed(1)} mmHg)
                    </text>
                  </g>
                );
              })()}

              {/* Axis Labels */}
              <text x="200" y="196" fill="#94a3b8" fontSize="9" textAnchor="middle">
                Tekanan Parsial Oksigen (pO₂ mmHg)
              </text>
              <text x="12" y="95" fill="#94a3b8" fontSize="9" textAnchor="middle" transform="rotate(-90 12 95)">
                Saturasi Hb (% O₂)
              </text>
            </svg>
          </div>

          {/* Microvascular Capillary Particle Simulation */}
          <div className="bg-slate-950 rounded-lg p-3 border border-slate-800">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span className="font-semibold text-slate-300">Simulasi Aliran Eritrosit & Pelepasan O₂ ke Sel</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300"
                  title={isPlaying ? 'Jeda' : 'Lanjutkan'}
                >
                  {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <div className="relative h-24 bg-gradient-to-r from-red-950/30 via-slate-900 to-sky-950/30 rounded border border-slate-800 overflow-hidden flex items-center px-4">
              <div className="absolute inset-x-0 top-0 h-1 bg-red-800/40"></div>
              <div className="absolute inset-x-0 bottom-0 h-1 bg-red-800/40"></div>

              {/* Flowing RBC items */}
              <div className={`flex w-full items-center justify-between ${isPlaying ? 'animate-pulse' : ''}`}>
                {[1, 2, 3, 4, 5].map((idx) => {
                  const o2Count = Math.max(1, Math.min(4, Math.round(4 - shift / 6)));
                  return (
                    <div key={idx} className="relative flex flex-col items-center">
                      <div className="w-10 h-7 bg-red-600/90 rounded-full border border-red-400/80 shadow flex items-center justify-center">
                        <span className="text-[10px] font-bold text-white font-mono">{o2Count} O₂</span>
                      </div>
                      <span className="text-[9px] text-slate-400 mt-1">Eritrosit #{idx}</span>
                    </div>
                  );
                })}
              </div>

              {/* Free oxygen bubbles escaping into tissues */}
              {isElevated && (
                <div className="absolute bottom-2 right-12 text-[10px] font-medium text-rose-300 flex items-center gap-1 bg-rose-950/60 px-2 py-0.5 rounded border border-rose-800/40">
                  <Activity className="w-3 h-3 text-rose-400 animate-spin" />
                  O₂ Lepas Cepat ke Jaringan Aktif!
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Zone: Controls & Parameters Deck */}
        <div className="lg:col-span-5 bg-slate-950/60 p-4 rounded-lg border border-slate-800 space-y-5">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <span className="text-xs font-semibold text-slate-300">Variabel Fisiologis</span>
            <button
              onClick={() => applyPreset('normal')}
              className="text-xs text-sky-400 hover:text-sky-300 flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              Reset Normal
            </button>
          </div>

          {/* Slider 1: Blood pH */}
          <div>
            <div className="flex justify-between items-center text-xs mb-1.5">
              <label htmlFor={phInputId} className="text-slate-300 font-medium">pH Darah Arteri</label>
              <span className={`font-mono font-semibold tabular-nums ${ph < 7.35 ? 'text-rose-400' : ph > 7.45 ? 'text-amber-400' : 'text-emerald-400'}`}>
                {ph.toFixed(2)}
              </span>
            </div>
            <input
              id={phInputId}
              type="range"
              min="6.90"
              max="7.80"
              step="0.05"
              value={ph}
              onChange={(e) => setPh(parseFloat(e.target.value))}
              className="w-full accent-sky-500 bg-slate-800 h-1.5 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
              <span>6.90 (Asidosis Berat)</span>
              <span>7.40 (Normal)</span>
              <span>7.80 (Alkalosis)</span>
            </div>
          </div>

          {/* Slider 2: pCO2 */}
          <div>
            <div className="flex justify-between items-center text-xs mb-1.5">
              <label htmlFor={pco2InputId} className="text-slate-300 font-medium">Tekanan Parsial CO₂ (pCO₂)</label>
              <span className={`font-mono font-semibold tabular-nums ${pco2 > 45 ? 'text-rose-400' : pco2 < 35 ? 'text-amber-400' : 'text-emerald-400'}`}>
                {pco2} mmHg
              </span>
            </div>
            <input
              id={pco2InputId}
              type="range"
              min="20"
              max="80"
              step="1"
              value={pco2}
              onChange={(e) => setPco2(parseInt(e.target.value, 10))}
              className="w-full accent-sky-500 bg-slate-800 h-1.5 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
              <span>20 mmHg (Hipokapnia)</span>
              <span>40 mmHg</span>
              <span>80 mmHg (Hiperkapnia)</span>
            </div>
          </div>

          {/* Slider 3: Temperature */}
          <div>
            <div className="flex justify-between items-center text-xs mb-1.5">
              <label htmlFor={tempInputId} className="text-slate-300 font-medium">Suhu Tubuh</label>
              <span className={`font-mono font-semibold tabular-nums ${temp > 37.5 ? 'text-rose-400' : 'text-emerald-400'}`}>
                {temp.toFixed(1)} °C
              </span>
            </div>
            <input
              id={tempInputId}
              type="range"
              min="35.0"
              max="41.0"
              step="0.2"
              value={temp}
              onChange={(e) => setTemp(parseFloat(e.target.value))}
              className="w-full accent-sky-500 bg-slate-800 h-1.5 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
              <span>35.0 °C (Hipotermia)</span>
              <span>37.0 °C</span>
              <span>41.0 °C (Demam/Lari)</span>
            </div>
          </div>

          {/* Explanation Box */}
          <div className="p-3 bg-slate-900 rounded border border-slate-800 text-xs space-y-1.5">
            <div className="font-semibold text-slate-200">Prinsip Fisiologi:</div>
            <p className="text-slate-400 leading-relaxed">
              {isElevated ? (
                <>
                  <strong className="text-rose-400">Kurva Bergeser ke Kanan:</strong> Nilai P50 meningkat ({p50.toFixed(1)} mmHg). 
                  Ion H⁺ dan CO₂ mengikat residu spesifik pada molekul globin, menstabilkan struktur bentuk-T (Tense State) yang melepaskan oksigen ke otot yang bekerja keras.
                </>
              ) : isAlkalotic ? (
                <>
                  <strong className="text-amber-400">Kurva Bergeser ke Kiri:</strong> Nilai P50 menurun ({p50.toFixed(1)} mmHg). 
                  Hemoglobin berada dalam bentuk-R (Relaxed State), mengikat oksigen lebih kuat dan enggan melepaskannya ke jaringan seluler.
                </>
              ) : (
                <>
                  <strong className="text-emerald-400">Kondisi Normal Fisiologis:</strong> Nilai P50 standar 26.8 mmHg. 
                  Saturasi optimal terjadi di kapiler alveolus paru-paru (~98%) dan terjadi pelepasan seimbang di jaringan istirahat (~75%).
                </>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
