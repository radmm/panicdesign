import React from "react";
import { 
  ShieldAlert, 
  Sparkles, 
  Trash2, 
  Layers, 
  Flame, 
  Maximize, 
  CheckSquare, 
  Square, 
  ArrowLeft,
  Wrench,
  AlertOctagon,
  Copy,
  Printer,
  Award,
  Fingerprint,
  AlertCircle
} from "lucide-react";
import { StressTestReport, ActionableFix } from "../types";
import PersonaDetail from "./PersonaDetail";
import BehavioralDashboard from "./BehavioralDashboard";

interface ReportViewerProps {
  report: StressTestReport;
  onBack: () => void;
  onDelete?: (id: string) => void;
}

export default function ReportViewer({ report, onBack, onDelete }: ReportViewerProps) {
  // Local state to track completed checkbox fixes
  const [completedFixes, setCompletedFixes] = React.useState<Record<number, boolean>>({});
  const [copied, setCopied] = React.useState(false);

  const toggleFix = (index: number) => {
    setCompletedFixes(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const copyReportLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Helper colors for panic intensity
  const getPanicColorClass = (score: number) => {
    if (score >= 80) return "text-red-500 bg-red-500/10 border-red-500/20";
    if (score >= 50) return "text-amber-500 bg-amber-500/10 border-amber-500/20";
    return "text-emerald-500 bg-emerald-500/10 border-emerald-500/20";
  };

  const getDifficultyColorClass = (diff: string) => {
    switch (diff.toLowerCase()) {
      case "easy": return "text-emerald-700";
      case "medium": return "text-amber-700";
      default: return "text-rose-700";
    }
  };

  const getImpactColorClass = (impact: string) => {
    switch (impact.toLowerCase()) {
      case "critical": return "text-rose-600 font-black";
      case "highly beneficial": return "text-zinc-700 font-bold";
      default: return "text-zinc-500";
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Top action header bar */}
      <div className="flex items-center justify-between border-b border-zinc-200/60 pb-4">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-xs font-sans font-medium text-zinc-600 hover:text-zinc-900 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Dashboard
        </button>

        <div className="flex items-center gap-2">
          {onDelete && (
            <button 
              onClick={() => onDelete(report.id)}
              className="p-2 text-zinc-400 hover:text-rose-600 hover:bg-rose-50/50 rounded-xl transition-all"
              title="Delete analysis report"
            >
              <Trash2 className="h-4.5 w-4.5" />
            </button>
          )}
          <button 
            onClick={copyReportLink}
            className="p-2 text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 rounded-xl transition-all flex items-center gap-1 text-xs font-sans font-medium"
          >
            <Copy className="h-4 w-4" /> {copied ? "Copied Link!" : "Copy URL"}
          </button>
          <button 
            onClick={() => window.print()}
            className="p-2 text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 rounded-xl transition-all flex items-center gap-1 text-xs font-sans font-medium"
          >
            <Printer className="h-4 w-4" /> Print PDF
          </button>
        </div>
      </div>

      {/* Main Title Banner with global score gauge */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 bg-zinc-950/75 backdrop-blur-2xl text-[#f5f5f5] rounded-[32px] p-6 border border-white/5 shadow-md relative overflow-hidden">
        {/* Subtle decorative background light glow */}
        <div className="absolute right-0 bottom-0 w-80 h-80 bg-rose-500/10 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute left-0 top-0 w-60 h-60 bg-amber-500/5 rounded-full blur-[80px] pointer-events-none"></div>

        {/* Diagnostic Metadata & Info */}
        <div className="md:col-span-3 space-y-4 relative z-10">
          <div className="flex flex-wrap gap-2 items-center">
            <span className="font-mono text-[8.5px] tracking-[0.2em] text-zinc-400 font-bold uppercase">
              UI EVALUATION REPORT
            </span>
            {report.urlAnalyzed && (
              <span className="bg-white/5 border border-white/10 font-mono text-[8px] text-zinc-300 px-2 py-0.5 rounded">
                {report.urlAnalyzed}
              </span>
            )}
          </div>

          <h2 className="font-sans font-black text-2xl md:text-3xl text-white tracking-tight leading-none">
            {report.title}
          </h2>

          <div className="p-3.5 rounded-[20px] bg-white/5 border border-white/5 text-zinc-300 space-y-1">
            <span className="font-mono text-[8px] uppercase tracking-widest text-[#f43f5e] font-extrabold flex items-center gap-1.5">
              <ShieldAlert className="h-3 w-3" /> Executive Summary (Cognitive Walkthrough)
            </span>
            <p className="font-sans text-xs leading-relaxed italic text-zinc-200">
              &ldquo;{report.brutalSummary}&rdquo;
            </p>
          </div>
        </div>

        {/* Global Panic Score Gauge Container - REDESIGNED CIRCULAR STAT DIAL with round edges */}
        <div className="md:col-span-1 bg-white/5 backdrop-blur-md rounded-[24px] border border-white/5 p-4 flex flex-col items-center justify-center relative z-10 min-h-36">
          <div className="w-full flex items-center justify-between mb-2">
            <span className="font-mono text-[8px] text-zinc-400 font-bold uppercase tracking-widest">
              friction score
            </span>
            <Flame className={`h-3.5 w-3.5 ${report.globalPanicScore >= 70 ? "text-rose-400 animate-pulse" : "text-amber-400"}`} />
          </div>

          {/* Premium Circular SVG Progress Indicator */}
          <div className="relative flex items-center justify-center my-1.5">
            <svg className="w-24 h-24 transform -rotate-90">
              {/* Background circle */}
              <circle
                cx="48"
                cy="48"
                r="38"
                stroke="rgba(255, 255, 255, 0.05)"
                strokeWidth="5"
                fill="transparent"
              />
              {/* Foreground circle with color mapping */}
              <circle
                cx="48"
                cy="48"
                r="38"
                stroke={report.globalPanicScore >= 70 ? "#f43f5e" : report.globalPanicScore >= 45 ? "#fbbf24" : "#10b981"}
                strokeWidth="5"
                fill="transparent"
                strokeDasharray="238.76"
                strokeDashoffset={238.76 - (report.globalPanicScore / 100) * 238.76}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute text-center">
              <span className="font-sans font-black text-2xl text-white block leading-none">
                {report.globalPanicScore}
              </span>
              <span className="font-mono text-[7px] text-zinc-400 uppercase tracking-widest block mt-0.5 font-bold">
                strain index
              </span>
            </div>
          </div>

          <div className="w-full text-center mt-1">
            <span className="font-mono text-[8px] text-zinc-400 uppercase tracking-widest font-black leading-none">
              cognitive load: {report.globalPanicScore}%
            </span>
          </div>
        </div>
      </div>

      {/* Panic Certificate Official Verdict Badge */}
      {report.panicCertificate && (
        <div className={`p-5 rounded-[24px] border border-dashed flex flex-col md:flex-row items-center justify-between gap-4 backdrop-blur-md relative ${
          report.panicCertificate.verdict === "Panic-Proof" 
            ? "border-emerald-300 bg-emerald-50/10 text-emerald-800" 
            : report.panicCertificate.verdict === "Work In Progress"
            ? "border-amber-300 bg-amber-50/10 text-amber-800"
            : "border-rose-300 bg-rose-50/10 text-rose-800"
        }`}>
          <div className="flex items-start gap-4">
            <div className={`h-11 w-11 rounded-full flex items-center justify-center shrink-0 border shadow-xs ${
              report.panicCertificate.verdict === "Panic-Proof" 
                ? "bg-emerald-100 border-emerald-250 text-emerald-600" 
                : report.panicCertificate.verdict === "Work In Progress"
                ? "bg-amber-100 border-amber-250 text-amber-600"
                : "bg-rose-100 border-rose-250 text-rose-600"
            }`}>
              <Award className="h-5.5 w-5.5" />
            </div>
            <div className="space-y-1">
              <span className="font-mono text-[8px] uppercase tracking-[0.2em] opacity-80 font-bold block">
                OFFICIAL DESIGN AUDIT CERTIFICATE
              </span>
              <h3 className="font-sans font-black text-xs tracking-tight text-zinc-900 uppercase">
                VERDICT: {report.panicCertificate.verdict}
              </h3>
              <p className="font-sans text-[11.5px] text-zinc-700 leading-relaxed max-w-3xl font-medium">
                {report.panicCertificate.text}
              </p>
            </div>
          </div>
          <div className="shrink-0 select-none hidden md:block">
            <span className={`inline-block border font-mono text-[8.5px] uppercase font-black tracking-widest px-3 py-1 rounded-[10px] transform rotate-3 ${
              report.panicCertificate.verdict === "Panic-Proof"
                ? "border-emerald-500 text-emerald-600"
                : report.panicCertificate.verdict === "Work In Progress"
                ? "border-amber-500 text-amber-600"
                : "border-rose-500 text-rose-600"
            }`}>
              VERIFIED COMPLIANCE
            </span>
          </div>
        </div>
      )}

      {/* Two Column Section: Aesthetic Critique & Screenshot Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Screenshot View if uploaded */}
        <div className="lg:col-span-2 glass-premium rounded-[24px] p-4 space-y-3.5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[8px] uppercase tracking-widest text-[#52525b] font-bold">
              Analyzed UI Element
            </span>
            <span className="bg-zinc-950/5 border border-zinc-950/5 text-zinc-600 font-mono text-[8px] px-2 py-0.5 rounded font-black tracking-widest uppercase">
              Target Frame
            </span>
          </div>

          <div className="flex-1 flex items-center justify-center bg-white/10 border border-white/20 rounded-xl overflow-hidden min-h-[140px] px-2 py-3 animate-none">
            {report.imageUrl ? (
              <img 
                src={report.imageUrl} 
                alt="Analyzed UI Screenshot" 
                className="max-h-40 object-contain shadow-xs rounded-lg"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="text-center p-4 space-y-1.5">
                <AlertOctagon className="h-4 w-4 text-zinc-400 mx-auto animate-none" />
                <p className="font-sans text-[10px] text-zinc-500 leading-normal">
                  Audit executed via URL parsing rules.<br />No physical PNG screenshot provided.
                </p>
              </div>
            )}
          </div>

          <p className="font-mono text-[8px] text-zinc-400 text-center leading-normal uppercase tracking-wider">
            Evaluating alignment, weights & readability
          </p>
        </div>

        {/* Style & Aesthetic Critique */}
        <div className="lg:col-span-3 glass-premium rounded-[24px] p-5 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-white/20 pb-2.5">
              <div>
                <span className="font-mono text-[8px] uppercase tracking-widest text-zinc-500 block font-bold">
                  DESIGN JUDGE
                </span>
                <h3 className="font-sans font-extrabold text-zinc-900 text-xs tracking-tight leading-none mt-1">
                  Aesthetic & Harmony Analysis
                </h3>
              </div>
              <div className="text-right">
                <span className="text-zinc-400 font-mono text-[8px] block uppercase font-bold">GRADE</span>
                <span className="font-sans font-black text-[#d97706] text-base leading-none">{report.visualAestheticRating}</span>
              </div>
            </div>

            <p className="text-zinc-700 font-sans text-xs leading-relaxed">
              {report.aestheticCritique}
            </p>
          </div>

          <div className="mt-4 border-t border-white/15 pt-3 flex gap-2 items-center bg-white/15 p-2 rounded-xl">
            <Sparkles className="h-4 w-4 text-amber-500 flex-shrink-0 animate-none" />
            <p className="text-[10px] text-zinc-500 leading-normal font-sans">
              Feedback evaluates typography matching, tracking density, placement of call-to-actions, and element redundancy.
            </p>
          </div>
        </div>
      </div>

      {/* Silent Structural Scan Mapped Zones */}
      {report.namedUIZones && report.namedUIZones.length > 0 && (
        <div className="glass-premium rounded-[20px] p-4.5 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-200/50 pb-2">
            <div className="flex items-center gap-2">
              <Fingerprint className="h-4 w-4 text-zinc-800" />
              <h3 className="font-sans font-black text-xs text-zinc-950 tracking-tight leading-none uppercase">
                Silent UI Structural Scan Map
              </h3>
            </div>
            <span className="font-mono text-[7px] bg-[#0d0e11] text-amber-400 px-1.5 py-0.5 rounded font-bold tracking-widest">
              SCAN INDEXING COMPLETED
            </span>
          </div>
          <p className="text-[10.5px] text-zinc-500 leading-normal font-sans">
            Our background visual parser completed an isolated boundaries segment scan of your interface structure prior to stress simulation. Detected active layout regions:
          </p>
          <div className="flex flex-wrap gap-2 pt-1 font-mono text-[7.5px] font-bold uppercase tracking-wider select-none text-zinc-600">
            {report.namedUIZones.map((zone, idx) => (
              <span key={idx} className="bg-zinc-100/60 border border-zinc-200 px-2.5 py-1 rounded-xl flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 bg-indigo-500 rounded-full animate-pulse" />
                <span>ZONE_{idx + 1}: {zone}</span>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Embedded Client Persona Simulations Component */}
      <PersonaDetail personas={report.personas} />

      {/* Universal Friction Intersections (Elevated to High Priority) */}
      {report.universalComplaints && report.universalComplaints.length > 0 && (
        <div className="p-3.5 border border-rose-200/60 bg-rose-50/10 rounded-2xl space-y-3 shadow-xs">
          <div className="space-y-0.5">
            <span className="font-mono text-[7.5px] uppercase tracking-[0.2em] text-rose-600 font-black flex items-center gap-1 select-none">
              <AlertCircle className="h-3 w-3" /> UNIVERSAL CHURN TRIGGERS
            </span>
            <h3 className="font-sans font-black text-zinc-900 text-[11px] tracking-tight uppercase leading-none mt-0.5">
              Overlapping Stress Nodes ({report.universalComplaints.length}) — Core Fix Priorities
            </h3>
            <p className="text-zinc-500 text-[10px] font-sans mt-1 leading-normal">
              These elements triggered critical friction thresholds across 3 or more distinct simulated user personas simultaneously.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {report.universalComplaints.map((complaint, index) => (
              <div key={index} className="bg-white/40 border border-rose-100/40 p-3 rounded-xl flex flex-col justify-between gap-2.5">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="bg-rose-600 text-white font-mono text-[7px] font-black w-4.5 h-4.5 rounded-full flex items-center justify-center shrink-0">
                      U{index + 1}
                    </span>
                    <h4 className="font-mono text-[8.5px] font-black text-zinc-850 bg-zinc-100 border border-zinc-200/80 px-1.5 py-0.5 rounded truncate max-w-full">
                      {complaint.element}
                    </h4>
                  </div>
                  <p className="font-sans text-[10.5px] text-zinc-600 leading-relaxed">
                    <strong>Context:</strong> {complaint.reason}
                  </p>
                </div>
                <div className="bg-[#0b0c0e] text-zinc-300 p-2 rounded-lg border border-zinc-900/60 w-full overflow-x-auto text-[8.5px] font-mono leading-tight select-text mt-1.5 shadow-inner">
                  <span className="block text-amber-500 font-extrabold text-[6.5px] font-mono tracking-widest uppercase mb-0.5 select-none">
                    Unified Code replacement:
                  </span>
                  <pre className="whitespace-pre-wrap font-mono text-zinc-300 text-[8.5px] leading-normal max-h-28 overflow-y-auto break-all select-all pt-0.5 font-medium">
                    <code>{complaint.solution || "/* Dynamic code generation in progress... please trigger a fresh audit scan. */"}</code>
                  </pre>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Actionable Code Fixes & Layout Adjustments */}
      <div className="glass-premium rounded-[20px] p-4.5 space-y-3.5">
        <div>
          <h3 className="font-sans font-black text-xs text-zinc-900 tracking-tight flex items-center gap-1.5 leading-none">
            <Wrench className="h-3.5 w-3.5 text-zinc-700" />
            Recommended UI Upgrades ({(report.fixes || []).length})
          </h3>
          <p className="text-[10px] text-zinc-500 mt-1 font-sans font-normal leading-normal">
            Targeted layout and visual adjustments calculated to optimize reading pathways and minimize conversion friction.
          </p>
        </div>

        {/* Actionable fixes lists */}
        <div className="space-y-2">
          {(report.fixes || []).map((fix, index) => {
            const isCompleted = !!completedFixes[index];
            return (
              <div 
                key={index}
                onClick={() => toggleFix(index)}
                className={`p-3 border rounded-xl flex gap-2.5 cursor-pointer transition-all ${
                  isCompleted 
                    ? "bg-emerald-50/15 border-emerald-305/30" 
                    : "bg-white/30 border-white/10 hover:bg-white/50"
                }`}
              >
                {/* Custom toggle checkbox */}
                <div className="mt-0.5 flex-shrink-0">
                  {isCompleted ? (
                    <CheckSquare className="h-3.5 w-3.5 text-emerald-600" />
                  ) : (
                    <Square className="h-3.5 w-3.5 text-zinc-450 hover:text-zinc-650" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 space-y-0.5">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-1.5 border-b border-white/10 pb-1">
                    <span className={`font-sans font-bold text-[11px] text-zinc-900 leading-snug ${isCompleted ? "line-through text-zinc-400 font-normal" : "text-zinc-900"}`}>
                      {fix.issue}
                    </span>
                    {/* Minimalist modern metadata indicator tags */}
                    <div className="flex items-center gap-1.5 flex-shrink-0 font-mono text-[7.5px] uppercase tracking-wider text-zinc-400 select-none">
                      <span className={getDifficultyColorClass(fix.difficulty)}>
                        {fix.difficulty}
                      </span>
                      <span>•</span>
                      <span className={getImpactColorClass(fix.impact)}>
                        {fix.impact}
                      </span>
                    </div>
                  </div>

                  <p className={`text-[10.5px] font-sans leading-normal pt-0.5 ${isCompleted ? "text-zinc-400 italic" : "text-zinc-650"}`}>
                    {fix.recommendation}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Dynamic Premium Ambient Gradient Connection */}
      <div className="relative py-4 select-none pointer-events-none flex flex-col items-center justify-center">
        {/* Glow backdrop blob */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70%] h-12 bg-gradient-to-r from-rose-500/12 via-amber-400/9 to-purple-600/12 rounded-full blur-2xl opacity-90" />
        {/* Subtle multi-stop gradient track with fadeout edges */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-rose-500/25 via-amber-500/35 via-purple-600/25 to-transparent" />
        {/* Sleek central cognitive node badge indicating active telemetry simulation connection */}
        <div className="absolute bg-white/75 backdrop-blur-md border border-rose-500/15 px-3 py-0.5 rounded-full text-[7.5px] font-mono font-bold tracking-widest text-zinc-500 lowercase flex items-center gap-1.5 shadow-xs">
          <span className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-pulse" />
          live telemetry bridge
        </div>
      </div>

      {/* Advanced Animated Behavioral Dashboard Projection */}
      <BehavioralDashboard report={report} />
    </div>
  );
}
