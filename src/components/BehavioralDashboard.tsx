import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Activity, 
  TrendingUp, 
  MousePointer, 
  Timer, 
  HeartCrack, 
  Zap, 
  Gauge, 
  Sparkles,
  Info,
  Eye,
  AlertOctagon,
  BrainCircuit,
  MousePointerClick
} from "lucide-react";
import { StressTestReport } from "../types";

interface BehavioralDashboardProps {
  report: StressTestReport;
}

type SimulationState = "stressed" | "fatigued" | "distracted" | "optimal";

export default function BehavioralDashboard({ report }: BehavioralDashboardProps) {
  const [simState, setSimState] = React.useState<SimulationState>("stressed");
  const [selectedHotspot, setSelectedHotspot] = React.useState<number | null>(null);

  // Derive coefficients based on simulation context and actual report panic score
  const basePanic = report.globalPanicScore;

  const simulationConfig = {
    stressed: {
      label: "stressed / frustrated",
      multiplier: 1.4,
      rageClickProb: Math.min(98, Math.round(basePanic * 1.15)),
      focalDelay: "1.4s",
      decisionHesitation: "+4.8s",
      sentimentScore: "poor (24%)",
      attentionSpan: "normal (3.2s)",
      gazeStability: "18% (dispersed)",
      velocity: "75 px/s",
      dwellMean: "0.45s",
      trendDesc: "eye movements show erratic jitter around elements.",
      wavePath: "M 0,60 Q 10,22 20,68 T 40,24 T 60,72 T 80,18 T 100,55",
      waveArea: "M 0,60 Q 10,22 20,68 T 40,24 T 60,72 T 80,18 T 100,55 L 100,100 L 0,100 Z",
      strokeColor: "#f43f5e",
      fillColor: "url(#grad-stressed)",
      hotspotsSeverity: [92, 85, 40, 78, 65, 30, 95, 12, 50, 88, 72, 10],
      hotspotDiagnostics: [
        "unresponsive element clicked multiple times - high user annoyance.",
        "aesthetic misalignment caused high gaze duration with zero interaction.",
        "primary action button missed entirely on first focus viewport pass.",
        "form input field tracking constraints induced immediate mouse shake.",
        "visual clutter led to circular scanning behavior indicating despair.",
        "safe zone. natural navigation alignment observed.",
        "repeated rage click triggers detected on high emphasis element.",
        "marginal focus center - ignored.",
        "text alignment tracking density confused structural hierarchy reading flow.",
        "aesthetic balance disruption forced repetitive element scanning.",
        "misleading anchor structure triggered wrong tab click events.",
        "stable baseline area."
      ],
      pathReduction: [100, 84, 52, 31, 14]
    },
    fatigued: {
      label: "fatigued / sleepy",
      multiplier: 0.9,
      rageClickProb: Math.min(45, Math.round(basePanic * 0.5)),
      focalDelay: "3.8s",
      decisionHesitation: "+8.5s",
      sentimentScore: "subdued (58%)",
      attentionSpan: "extremely low (1.1s)",
      gazeStability: "64% (languid)",
      velocity: "12 px/s",
      dwellMean: "2.90s",
      trendDesc: "long fixations on blank structural sections.",
      wavePath: "M 0,55 C 25,48 50,68 75,52 T 100,60",
      waveArea: "M 0,55 C 25,48 50,68 75,52 T 100,60 L 100,100 L 0,100 Z",
      strokeColor: "#eab308",
      fillColor: "url(#grad-fatigued)",
      hotspotsSeverity: [30, 20, 10, 60, 45, 15, 40, 5, 25, 70, 50, 8],
      hotspotDiagnostics: [
        "delayed visual acquisition. leftmost visual path ignored entirely.",
        "slow fixation rate. dwell time exceeds normal standard deviations.",
        "secondary action. ignored due to low interactive contrast.",
        "unread instructions block. long, dense paragraphs skipped completely.",
        "hesitant hover patterns - user struggled to recognize input viability.",
        "safe zone. standard component recognition.",
        "low reactive acceleration. click action executed late.",
        "ignored margins completely.",
        "confusing tracking pattern. required double passes to process text.",
        "structural misalignment. forced scrolling behavior back and forth.",
        "weak link contrast caused user to search repeatedly for clickable elements.",
        "unprocessed segment."
      ],
      pathReduction: [100, 90, 78, 44, 28]
    },
    distracted: {
      label: "distracted explorer",
      multiplier: 1.2,
      rageClickProb: Math.min(80, Math.round(basePanic * 0.9)),
      focalDelay: "0.8s",
      decisionHesitation: "+2.2s",
      sentimentScore: "flaccid (44%)",
      attentionSpan: "fragmented (1.8s)",
      gazeStability: "29% (erratic)",
      velocity: "54 px/s",
      dwellMean: "0.85s",
      trendDesc: "eye clusters bounce over multiple text paths.",
      wavePath: "M 0,58 Q 15,75 30,30 T 60,65 T 85,25 T 100,55",
      waveArea: "M 0,58 Q 15,75 30,30 T 60,65 T 85,25 T 100,55 L 100,100 L 0,100 Z",
      strokeColor: "#f97316",
      fillColor: "url(#grad-distracted)",
      hotspotsSeverity: [70, 50, 95, 20, 80, 10, 60, 15, 85, 40, 65, 5],
      hotspotDiagnostics: [
        "high saccadic jumps - eyes bounced repeatedly without focal acquisition.",
        "unremarkable card element. skipped due to lack of visual trigger hook.",
        "floating widget conflict. took focal prominence over core features.",
        "text block passed without dwell threshold trigger.",
        "rushed interactive action caused validation check failure.",
        "mild focus baseline.",
        "premature click on unverified layout segment.",
        "no focus registered.",
        "heavy decorative visual noise drew gaze away from conversion buttons.",
        "low-level micro-aesthetic layout error ignored.",
        "failed navigation trigger. user backed out instantly.",
        "ignored segment."
      ],
      pathReduction: [100, 72, 45, 20, 8]
    },
    optimal: {
      label: "optimal core user",
      multiplier: 0.5,
      rageClickProb: 5,
      focalDelay: "0.4s",
      decisionHesitation: "0.2s",
      sentimentScore: "excellent (89%)",
      attentionSpan: "high (6.5s)",
      gazeStability: "88% (stabilized)",
      velocity: "28 px/s",
      dwellMean: "1.20s",
      trendDesc: "gaze vectors line up perfectly with layout landmarks.",
      wavePath: "M 0,62 Q 25,28 50,62 T 100,58",
      waveArea: "M 0,62 Q 25,28 50,62 T 100,58 L 100,100 L 0,100 Z",
      strokeColor: "#10b981",
      fillColor: "url(#grad-optimal)",
      hotspotsSeverity: [12, 10, 5, 20, 15, 8, 10, 4, 18, 11, 22, 6],
      hotspotDiagnostics: [
        "clean intake sequence. natural visual reading pattern.",
        "aesthetic structure validated by fluid horizontal eye tracking.",
        "action button processed seamlessly without path confusion.",
        "input placeholder understood on initial pass.",
        "standard mouse acceleration - positive target control.",
        "perfect visual alignment zone.",
        "consistent action pathway follow-through.",
        "standard peripheral awareness.",
        "legible subtitle processed correctly on first attempt.",
        "balanced spacing allowed quick cognitive bypass to core details.",
        "direct link click with minimal cursor hesitation.",
        "neutral baseline zone."
      ],
      pathReduction: [100, 96, 92, 88, 82]
    }
  };

  const activeConf = simulationConfig[simState];
  const derivedGlobalFriction = Math.min(100, Math.round(basePanic * activeConf.multiplier));

  return (
    <div className="glass-premium rounded-[24px] p-5.5 space-y-6 mt-6 border-t border-white/25 animate-fadeIn animate-duration-500">
      {/* Title block resembling sleek Locus panel aesthetics */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div>
          <span className="font-mono text-[8.5px] tracking-widest text-[#d97706] font-bold block mb-0.5 lowercase">
            advanced simulator
          </span>
          <h3 className="font-sans font-black text-sm text-zinc-900 tracking-tight flex items-center gap-2 lowercase">
            <BrainCircuit className="h-4.5 w-4.5 text-zinc-800 animate-pulse" />
            behavioral statistics & spatial diagnostics
          </h3>
          <p className="text-[10px] text-zinc-550 mt-1 font-sans font-medium lowercase">
            dynamic viewport projection calculating interactive dropoffs, visual retention blocks, and real-time stress waves under client context.
          </p>
        </div>

        {/* Minimalist tab switcher with premium glass morphism and individual state glow accents */}
        <div className="flex flex-wrap gap-1.5 bg-white/10 backdrop-blur-md border border-white/20 p-1 rounded-xl shadow-xs">
          {(Object.keys(simulationConfig) as SimulationState[]).map((state) => {
            const isActive = simState === state;
            let activeStyle = "";
            let textLabel = "";
            
            switch (state) {
              case "stressed":
                textLabel = "stressed";
                activeStyle = "bg-rose-500/25 text-rose-800 border-rose-500/70 shadow-md shadow-rose-500/10";
                break;
              case "fatigued":
                textLabel = "fatigued";
                activeStyle = "bg-amber-500/25 text-amber-800 border-amber-500/70 shadow-md shadow-amber-500/10";
                break;
              case "distracted":
                textLabel = "distracted";
                activeStyle = "bg-orange-500/25 text-orange-850 border-orange-500/70 shadow-md shadow-orange-500/10";
                break;
              case "optimal":
                textLabel = "optimal";
                activeStyle = "bg-emerald-500/25 text-emerald-800 border-emerald-500/70 shadow-md shadow-emerald-500/10";
                break;
            }
            
            return (
              <button
                key={state}
                id={`sim-tab-${state}`}
                onClick={() => {
                  setSimState(state);
                  setSelectedHotspot(null);
                }}
                className={`px-3 py-1.5 text-[10px] font-mono lowercase tracking-wider font-extrabold rounded-lg border transition-all duration-300 ${
                  isActive
                    ? `${activeStyle} backdrop-blur-xl`
                    : "bg-white/15 backdrop-blur-md border-white/20 text-zinc-500 hover:bg-white/30 hover:text-zinc-800 hover:border-white/40 shadow-xs"
                }`}
              >
                {textLabel}
              </button>
            );
          })}
        </div>
      </div>

      {/* Row 1 Grid: Friction Quotient and Goal Path Completion side-by-side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Panel 1: Dynamic Gauge & Panic Metrics Quotient */}
        <div className="bg-white/30 border border-white/10 rounded-[20px] p-4 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[8.5px] tracking-wider text-zinc-500 font-extrabold lowercase">
                friction quotient
              </span>
              <span className="bg-orange-500/10 border border-orange-500/15 text-orange-600 font-mono text-[8px] px-1.5 py-0.5 rounded font-black lowercase tracking-wider">
                core gauging
              </span>
            </div>

            {/* Simulated interactive circular gauge - Perfectly mathematical center alignment (cx: 50, cy: 50) */}
            <div id="sim-gauge-container" className="flex flex-col items-center justify-center py-2 relative">
              <div className="relative h-28 w-28 flex items-center justify-center">
                {/* SVG Dial background and responsive filled arch - Rotated natively inside SVG to guarantee perfect center vertical/horizontal alignment */}
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="38"
                    stroke="#e4e4e7"
                    strokeWidth="8"
                    fill="transparent"
                    className="opacity-40"
                    transform="rotate(-90 50 50)"
                  />
                  <motion.circle
                    cx="50"
                    cy="50"
                    r="38"
                    stroke={derivedGlobalFriction > 70 ? "#ef4444" : derivedGlobalFriction > 40 ? "#f59e0b" : "#10b981"}
                    strokeWidth="8"
                    fill="transparent"
                    strokeDasharray="238.76"
                    initial={{ strokeDashoffset: 238.76 }}
                    animate={{ strokeDashoffset: 238.76 - (238.76 * derivedGlobalFriction) / 100 }}
                    transition={{ type: "spring", stiffness: 60, damping: 12 }}
                    transform="rotate(-90 50 50)"
                  />
                </svg>
                
                {/* Inner central metrics quotient text - Absolutely positioned mathematically dead-center */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none z-10 text-center">
                  <motion.span 
                    key={derivedGlobalFriction}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="font-sans font-black text-2xl text-zinc-900 tracking-tighter leading-none"
                  >
                    {derivedGlobalFriction}%
                  </motion.span>
                  <span className="block font-mono text-[7px] text-zinc-400 font-black lowercase mt-1 tracking-wider leading-none">
                    panic rating
                  </span>
                </div>
              </div>

              {/* Status indicators */}
              <div className="text-center mt-2.5">
                <span className={`font-sans font-black text-[11px] lowercase tracking-wider ${
                  derivedGlobalFriction > 70 ? "text-red-650" : derivedGlobalFriction > 40 ? "text-amber-600" : "text-emerald-700"
                }`}>
                  {derivedGlobalFriction > 70 ? "critical resistance" : derivedGlobalFriction > 40 ? "hesitant threshold" : "fluid processing"}
                </span>
              </div>
            </div>
          </div>

          {/* Micro numerical diagnostics array matching the top right of the user image */}
          <div className="border-t border-white/10 pt-3.5 space-y-2">
            <div className="flex justify-between items-center text-[10.5px]">
              <span className="text-zinc-550 font-sans flex items-center gap-1.5 lowercase">
                <MousePointer className="h-3 w-3 text-zinc-400" />
                rage click probability
              </span>
              <span className="font-mono font-bold text-zinc-900">
                {activeConf.rageClickProb}%
              </span>
            </div>
            
            <div className="flex justify-between items-center text-[10.5px]">
              <span className="text-zinc-550 font-sans flex items-center gap-1.5 lowercase">
                <Timer className="h-3 w-3 text-zinc-400" />
                first focal fixation
              </span>
              <span className="font-mono font-bold text-zinc-900">
                {activeConf.focalDelay}
              </span>
            </div>

            <div className="flex justify-between items-center text-[10.5px]">
              <span className="text-zinc-550 font-sans flex items-center gap-1.5 lowercase">
                <Activity className="h-3 w-3 text-zinc-400" />
                cognitive hesitation
              </span>
              <span className="font-mono font-bold text-zinc-900">
                {activeConf.decisionHesitation}
              </span>
            </div>
          </div>
        </div>

        {/* Panel 3: Simulated User Dropoff Funnel */}
        <div className="bg-white/30 border border-white/10 rounded-[20px] p-4 flex flex-col justify-between space-y-4">
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[8.5px] tracking-wider text-zinc-500 font-extrabold lowercase">
                goal path completion
              </span>
              <span className="text-zinc-450 font-mono text-[7.5px] lowercase tracking-wider font-extrabold block">
                conversion drop
              </span>
            </div>
            <p className="text-[9.5px] text-zinc-500 font-sans leading-normal lowercase">
              projection of simulated visitor progression from initial view down to payload completion.
            </p>
          </div>

          {/* Animated vertical graphs resembling "Track your team" in the image layout */}
          <div className="space-y-2.5 pb-1">
            {[
              { idx: 0, label: "1. load view", color: "bg-emerald-500" },
              { idx: 1, label: "2. visual focus", color: "bg-emerald-500" },
              { idx: 2, label: "3. locate cta", color: "bg-amber-500" },
              { idx: 3, label: "4. input fields", color: "bg-amber-500" },
              { idx: 4, label: "5. hit action", color: "bg-rose-500" }
            ].map((step) => {
              const basePercentage = activeConf.pathReduction[step.idx];
              // Interleave calculated panic degradation
              const degradationFactor = step.idx > 0 ? (basePanic / 130) : 0;
              const pathValue = Math.max(2, Math.round(basePercentage * (1 - degradationFactor)));

              return (
                <div key={step.idx} className="space-y-1">
                  <div className="flex justify-between items-center text-[10.5px] font-sans select-none">
                    <span className="text-zinc-600 font-medium lowercase tracking-wide">{step.label}</span>
                    <span className="font-bold text-zinc-800 font-mono text-[9.5px]">{pathValue}%</span>
                  </div>
                  {/* Outer container */}
                  <div className="w-full h-2 bg-white/45 border border-white/10 rounded-full overflow-hidden">
                    <motion.div
                      className={`h-full rounded-full ${step.color}`}
                      initial={{ width: "0%" }}
                      animate={{ width: `${pathValue}%` }}
                      transition={{ type: "spring", stiffness: 50, damping: 10, delay: step.idx * 0.05 }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Feedback summary footer */}
          <div className="border-t border-white/10 pt-3 flex gap-2 items-center">
            <TrendingUp className="h-3.5 w-3.5 text-zinc-500 flex-shrink-0" />
            <p className="text-[9.5px] text-zinc-500 leading-normal font-sans lowercase">
              high interface weights and misaligned headings reduce cta conversion potential by <strong className="text-zinc-800 font-bold">{Math.round((100 - activeConf.pathReduction[4]) * activeConf.multiplier)}%</strong>.
            </p>
          </div>
        </div>

      </div>

      {/* Row 2 Grid: Spatial Attention Heat-Grid and Attention Oscilloscope Graph side-by-side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Panel 2: Interactive Friction Heat Grid Map */}
        <div className="bg-white/30 border border-white/10 rounded-[20px] p-4 flex flex-col justify-between space-y-3.5">
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[8.5px] tracking-wider text-zinc-500 font-extrabold lowercase">
                spatial attention heat-grid
              </span>
              <span className="text-zinc-400 font-mono text-[7px] lowercase tracking-wider font-extrabold flex items-center gap-1">
                <MousePointerClick className="h-2.5 w-2.5 text-zinc-550" /> interactive nodes
              </span>
            </div>
            <p className="text-[9.5px] text-zinc-500 font-sans leading-normal lowercase">
              click individual viewport cells to display local biomechanical friction and eye-tracking trajectory analytics.
            </p>
          </div>

          {/* Grid layout resembling the multi-cell grid block at the center bottom of image */}
          <div className="grid grid-cols-4 gap-2 py-1.5" id="simulator-interactive-heatgrid">
            {activeConf.hotspotsSeverity.map((sev, idx) => {
              // Color spectrum mapping based on hot cell intensity
              let bgStyle = "";
              if (sev > 80) bgStyle = "bg-rose-500/90 border-rose-600/30 text-white";
              else if (sev > 60) bgStyle = "bg-rose-400/70 border-rose-500/20 text-zinc-900";
              else if (sev > 40) bgStyle = "bg-amber-400/60 border-amber-500/20 text-zinc-900";
              else if (sev > 20) bgStyle = "bg-blue-400/30 border-blue-500/10 text-zinc-900";
              else bgStyle = "bg-zinc-100 border-zinc-200 text-zinc-400";

              const isSelected = selectedHotspot === idx;

              return (
                <button
                  key={idx}
                  id={`heatgrid-btn-${idx}`}
                  onClick={() => setSelectedHotspot(isSelected ? null : idx)}
                  className={`h-9 rounded-lg border flex flex-col items-center justify-center transition-all relative ${bgStyle} ${
                    isSelected ? "ring-2 ring-zinc-800 scale-102 z-10 shadow-xs border-transparent" : "hover:scale-[1.03]"
                  }`}
                  title={`scan region ${idx + 1}`}
                >
                  <span className="font-mono text-[8.5px] font-black tracking-tighter opacity-70">
                    {idx + 1}
                  </span>
                  <span className="font-mono text-[7.5px] scale-90 font-bold select-none opacity-50">
                    {sev}%
                  </span>
                </button>
              );
            })}
          </div>

          {/* Diagnostic feedback card below grid */}
          <div className="h-[54px] bg-white/70 border border-white/30 p-2 rounded-xl flex items-center justify-center text-center overflow-hidden">
            <AnimatePresence mode="wait">
              {selectedHotspot !== null ? (
                <motion.div
                  key={selectedHotspot}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  className="space-y-0.5 text-left w-full px-1"
                >
                  <span className="font-mono text-[7.5px] lowercase font-black tracking-widest text-[#d97706] block">
                    region {selectedHotspot + 1} friction profile
                  </span>
                  <p className="text-[10px] text-zinc-700 font-sans leading-tight line-clamp-2 lowercase">
                    {activeConf.hotspotDiagnostics[selectedHotspot]}
                  </p>
                </motion.div>
              ) : (
                <div className="space-y-0.5 select-none opacity-75">
                  <Info className="h-3.5 w-3.5 text-zinc-400 mx-auto animate-none" />
                  <p className="text-[9.5px] text-zinc-500 font-sans tracking-wide lowercase">
                    select any numbered quadrant above to diagnose local friction events.
                  </p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Panel 4: Cognitive Eye-Tracking Oscilloscope - NEW GRAPH SECTION */}
        <div className="bg-white/30 border border-white/10 rounded-[20px] p-4 flex flex-col justify-between space-y-4">
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[8.5px] tracking-wider text-zinc-500 font-extrabold lowercase">
                attention oscilloscope
              </span>
              <span className="text-zinc-450 font-mono text-[7.5px] lowercase tracking-wider font-extrabold block">
                live wave
              </span>
            </div>
            <p className="text-[9.5px] text-zinc-500 font-sans leading-normal lowercase">
              fluctuating wave projection of user gaze focus duration and saccade progression over simulated intervals.
            </p>
          </div>

          {/* Morphing Dynamic line chart using SVG & motion.path - Increased size to h-32 so slopes and peaks are completely visible without clipping */}
          <div className="h-32 w-full bg-white/45 border border-white/10 rounded-xl relative overflow-hidden flex items-center justify-center">
            {/* Background reference grid lines */}
            <div className="absolute inset-0 flex flex-col justify-between px-2 py-3 pointer-events-none opacity-25">
              <div className="border-b border-dashed border-zinc-400/55 w-full" />
              <div className="border-b border-dashed border-zinc-400/55 w-full" />
              <div className="border-b border-dashed border-zinc-400/55 w-full" />
            </div>

            <svg className="w-full h-full absolute inset-0 overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none">
              <defs>
                <linearGradient id="grad-stressed" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#f43f5e" stopOpacity="0.0" />
                </linearGradient>
                <linearGradient id="grad-fatigued" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#eab308" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#eab308" stopOpacity="0.0" />
                </linearGradient>
                <linearGradient id="grad-distracted" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f97316" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#f97316" stopOpacity="0.0" />
                </linearGradient>
                <linearGradient id="grad-optimal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Area path with color transition */}
              <motion.path
                d={activeConf.waveArea}
                fill={activeConf.fillColor}
                transition={{ type: "spring", stiffness: 60, damping: 13 }}
              />

              {/* Stroke line path with color transition */}
              <motion.path
                d={activeConf.wavePath}
                fill="none"
                stroke={activeConf.strokeColor}
                strokeWidth="1.5"
                strokeLinecap="round"
                transition={{ type: "spring", stiffness: 60, damping: 13 }}
              />
            </svg>

            {/* Float values badge inside chart */}
            <div className="absolute top-2 right-2 bg-zinc-900/10 backdrop-blur-xs font-mono text-[7px] text-zinc-650 px-1.5 py-0.5 rounded select-none">
              {activeConf.velocity}
            </div>
          </div>

          {/* Eye tracking stats bottom panel */}
          <div className="border-t border-white/10 pt-3.5 space-y-2">
            <div className="flex justify-between items-center text-[10.5px]">
              <span className="text-zinc-550 font-sans flex items-center gap-1.5 lowercase">
                <Eye className="h-3 w-3 text-zinc-400" />
                gaze fixation stability
              </span>
              <span className="font-mono font-bold text-zinc-900 lowercase">
                {activeConf.gazeStability}
              </span>
            </div>

            <div className="flex justify-between items-center text-[10.5px]">
              <span className="text-zinc-550 font-sans flex items-center gap-1.5 lowercase">
                <Timer className="h-3 w-3 text-zinc-400" />
                mean dwell duration
              </span>
              <span className="font-mono font-bold text-zinc-900 lowercase">
                {activeConf.dwellMean}
              </span>
            </div>
            
            <p className="text-[9.5px] text-zinc-500 italic font-sans leading-tight pt-0.5 line-clamp-1 border-t border-dashed border-zinc-200/50 pt-1.5 lowercase">
              {activeConf.trendDesc}
            </p>
          </div>
        </div>

      </div>

      {/* Decorative Biomechanical Heart Wave Graph at the very bottom */}
      <div className="bg-white/20 border border-white/10 p-3 rounded-xl flex flex-col md:flex-row items-center justify-between gap-3 text-[10px]">
        <div className="flex items-center gap-2">
          <Activity className="h-4 w-4 text-rose-500 animate-pulse flex-shrink-0" />
          <div>
            <span className="font-mono text-[8.5px] tracking-wider text-zinc-400 block font-bold lowercase">
              cognitive processing waveform
            </span>
            <p className="text-zinc-650 font-sans tracking-wide text-[10px] lowercase">
              anxious eye jittering matches high frequency micro-disruptions in user attention vectors.
            </p>
          </div>
        </div>
        
        {/* Animated SVG Sparkwave Representing Attention / Heartrate */}
        <div className="w-48 h-8 flex items-center select-none overflow-hidden pr-2">
          <svg className="w-full h-full text-rose-500/80" viewBox="0 0 100 20" stroke="currentColor" fill="none" strokeWidth="1.5">
            <path
              d="M 0,10 L 10,10 L 15,10 L 18,3 L 21,17 L 24,10 L 35,10 L 38,1 L 41,19 L 44,10 L 55,10 L 58,5 L 61,15 L 64,10 L 75,10 L 80,10 L 82,-1 L 85,10 Z"
              className="path-animated"
              style={{
                strokeDasharray: "200",
                strokeDashoffset: "200",
                animation: `dash ${simState === "stressed" ? "2.5s" : simState === "distracted" ? "4s" : "6s"} linear infinite`
              }}
            />
          </svg>
          <style dangerouslySetInnerHTML={{__html: `
            @keyframes dash {
              to {
                strokeDashoffset: 0;
              }
            }
          `}} />
        </div>
      </div>
    </div>
  );
}
