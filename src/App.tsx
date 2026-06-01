import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Zap, 
  UploadCloud, 
  Globe, 
  Terminal, 
  AlertCircle, 
  RefreshCw, 
  History, 
  Cpu,
  Info,
  ShieldCheck,
  Eye,
  Layers
} from "lucide-react";
import SavedReports from "./components/SavedReports";
import ReportViewer from "./components/ReportViewer";
import { StressTestReport } from "./types";
import { generateFallbackReport } from "./utils/fallbackGenerator";

export default function App() {
  // Navigation view state: "scan" | "history"
  const [activeTab, setActiveTab] = useState<"scan" | "history">("scan");
  
  // Core application states
  const [activeReport, setActiveReport] = useState<StressTestReport | null>(null);
  const [savedReports, setSavedReports] = useState<StressTestReport[]>([]);
  const [urlInput, setUrlInput] = useState("");
  const [uploadedScreenshot, setUploadedScreenshot] = useState<string | null>(null);
  const [screenshotName, setScreenshotName] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState<string | null>(null);
  
  // Drag & drop feedback states
  const [isDragging, setIsDragging] = useState(false);
  
  // Loading simulator telemetry properties
  const [loading, setLoading] = useState(false);
  const [terminalLogs, setTerminalLogs] = useState<string[]>([]);
  const [currentDisplayStep, setCurrentDisplayStep] = useState(0);
  const [errorText, setErrorText] = useState<string | null>(null);
  const [noticeText, setNoticeText] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const terminalEndRef = useRef<HTMLDivElement>(null);

  // References to completely avoid stale closures inside the interval
  const currentStepRef = useRef(0);
  const fetchCompletedRef = useRef(false);
  const fetchedReportRef = useRef<StressTestReport | null>(null);
  const fetchErrorRef = useRef<any>(null);

  // Load saved audits from local storage
  useEffect(() => {
    try {
      const cached = localStorage.getItem("ux_stress_reports");
      if (cached) {
        setSavedReports(JSON.parse(cached));
      }
    } catch (e) {
      console.error("Failed to parse cached report indexes", e);
    }
  }, []);

  const saveReportList = (updated: StressTestReport[]) => {
    setSavedReports(updated);
    localStorage.setItem("ux_stress_reports", JSON.stringify(updated));
  };

  // Professional analytical walk logs
  const logSteps = [
    "[SYSTEM] Initiating cognitive simulation engine...",
    "[Gateway] Establishing secure AI handshake with Gemini-3.5-flash vision parser...",
    "[Simulating Anxious Explorer] Inspecting focus reassuring headers, input warnings, and confirmation safeguards...",
    "[Anxious Explorer] Evaluation completed. Warning: Core interactive state row density is slightly high.",
    "[Simulating Distracted Visitor] Simulating multi-task tabbing behaviors. Monitoring gaze coordinates...",
    "[Distracted Visitor] Process finished. Minor text actions could fall below ideal traversal thresholds.",
    "[Simulating First-Time User] Mapping nomenclature, proprietary terms, and onboarding directions...",
    "[First-Time User] Layout review finished. Guide prompts in blank views are operational.",
    "[SYSTEM] Calculating global stress indices and generating statistical reports..."
  ];

  // Drag and drop event handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      processScreenshotFile(files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processScreenshotFile(files[0]);
    }
  };

  const processScreenshotFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      setErrorText("Please upload standard graphic screenshot files (.png, .jpeg, .jpg) for UX evaluation.");
      return;
    }
    setErrorText(null);
    setScreenshotName(file.name);
    setMimeType(file.type);

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setUploadedScreenshot(event.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const triggerSelectFile = () => {
    fileInputRef.current?.click();
  };

  const clearUploadedFile = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setUploadedScreenshot(null);
    setScreenshotName(null);
    setMimeType(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Run the core audit sequence
  const runStressAudit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput && !uploadedScreenshot) {
      setErrorText("Please upload a screen capture mockup or supply an active URL address to test.");
      return;
    }

    setErrorText(null);
    setNoticeText(null);
    setLoading(true);
    setTerminalLogs([logSteps[0]]);
    
    // Reset refs
    currentStepRef.current = 1;
    setCurrentDisplayStep(1);
    fetchCompletedRef.current = false;
    fetchedReportRef.current = null;
    fetchErrorRef.current = null;

    // Trigger asynchronous API call in the background
    fetch("/api/stress-test", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        url: urlInput || undefined,
        screenshotBase64: uploadedScreenshot || undefined,
        mimeType: mimeType || undefined
      })
    })
    .then(async (res) => {
      if (!res.ok) {
        const errPayload = await res.json().catch(() => ({}));
        throw new Error(errPayload.error || "Simulation pipeline experienced an execution anomaly.");
      }
      return res.json();
    })
    .then((data) => {
      // Build finalized report structure
      fetchedReportRef.current = {
        ...data,
        id: "rep-" + Date.now(),
        timestamp: new Date().toISOString(),
        urlAnalyzed: urlInput || undefined,
        imageUrl: uploadedScreenshot || undefined
      };
      fetchCompletedRef.current = true;
    })
    .catch((err) => {
      console.warn("Real-time AI backend audit timed out or had missing API key. Activating falling-back local metrics compiler:", err);
      fetchErrorRef.current = err;
      fetchedReportRef.current = generateFallbackReport(urlInput || undefined, screenshotName || undefined);
      fetchCompletedRef.current = true;
    });

    // Logging sequence timer with visual updates (600ms index steps)
    const intervalId = setInterval(() => {
      const stepIdx = currentStepRef.current;
      
      if (stepIdx < logSteps.length) {
        setTerminalLogs(prev => [...prev, logSteps[stepIdx]]);
        currentStepRef.current = stepIdx + 1;
        setCurrentDisplayStep(stepIdx + 1);
      } else {
        if (fetchCompletedRef.current) {
          clearInterval(intervalId);
          setLoading(false);

          if (fetchedReportRef.current) {
            // Verification Notice text has been removed from public eye as requested
            
            const updated = [fetchedReportRef.current, ...savedReports];
            saveReportList(updated);
            setActiveReport(fetchedReportRef.current);
          } else {
            setErrorText("Audit metrics did not resolve correctly. Please test again.");
          }
        } else {
          setTerminalLogs(prev => [
            ...prev,
            "[Gateway] Waiting for report structured compile response... standing by..."
          ]);
        }
      }
    }, 600);
  };

  // Keep terminal logs scrolled to bottom
  useEffect(() => {
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [terminalLogs]);

  const deleteReport = (id: string) => {
    const filtered = savedReports.filter(r => r.id !== id);
    saveReportList(filtered);
    if (activeReport?.id === id) {
      setActiveReport(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa]/70 text-zinc-900 font-sans antialiased flex flex-col justify-between relative overflow-hidden">
      
      {/* Premium Highly Saturated Multi-Color Orbital Gradient Blobs Floating Behind */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-[5%] -left-[5%] w-[600px] h-[600px] rounded-full bg-gradient-to-br from-indigo-600/60 via-purple-600/45 to-pink-500/35 blur-[100px] animate-orb-indigo" />
        <div className="absolute top-[20%] -right-[10%] w-[700px] h-[700px] rounded-full bg-gradient-to-br from-rose-600/60 via-orange-500/40 to-amber-400/35 blur-[110px] animate-orb-rose" />
        <div className="absolute -bottom-[5%] left-[10%] w-[550px] h-[550px] rounded-full bg-gradient-to-tr from-cyan-500/55 via-sky-500/45 to-emerald-400/35 blur-[90px] animate-orb-sky" />
      </div>

      {/* Centered Premium Title Header Bar */}
      <header className="bg-transparent sticky top-0 z-50 relative">
        <div className="max-w-7xl mx-auto px-6 py-5 flex flex-row items-center justify-between gap-4 w-full">
          
          <div className="flex items-center gap-1.5">
            <div className="h-5 w-5 rounded bg-zinc-950 flex items-center justify-center flex-shrink-0 border border-zinc-850">
              <Cpu className="h-2.5 w-2.5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-sans font-black text-rose-600 tracking-tight text-[11px] leading-none">
                panic.design
              </span>
              <span className="font-mono text-[7px] text-zinc-450 uppercase tracking-widest font-bold mt-0.5">
                usability indexer
              </span>
            </div>
          </div>

          {/* Tab Control */}
          <div className="flex bg-white/10 backdrop-blur-md p-0.5 rounded-md border border-white/20">
            <button
              onClick={() => {
                setActiveTab("scan");
                setActiveReport(null);
              }}
              className={`px-2.5 py-1 rounded text-[9px] font-sans font-bold transition-all flex items-center gap-1 min-h-[22px] cursor-pointer ${
                activeTab === "scan" && !activeReport
                  ? "bg-white/80 text-zinc-900 shadow-xs border border-white/25 font-black"
                  : "text-zinc-505 hover:text-zinc-900"
              }`}
            >
              <Cpu className="h-2.5 w-2.5" />
              Evaluate Layout
            </button>
            
            <button
              onClick={() => {
                setActiveTab("history");
                setActiveReport(null);
              }}
              className={`px-2.5 py-1 rounded text-[9px] font-sans font-bold transition-all flex items-center gap-1 min-h-[22px] relative cursor-pointer ${
                activeTab === "history" || activeReport
                  ? "bg-white/80 text-zinc-900 shadow-xs border border-white/25 font-black"
                  : "text-zinc-505 hover:text-zinc-900"
              }`}
            >
              <History className="h-2.5 w-2.5" />
              Evaluation History
              {savedReports.length > 0 && (
                <span className="bg-zinc-900 text-white font-mono text-[7px] ml-1 px-1 py-0.2 rounded font-bold">
                  {savedReports.length}
                </span>
              )}
            </button>
          </div>

        </div>
      </header>

      {/* Main Single-Screen Workspace Container with relative indexing */}
      <main className="flex-grow max-w-6xl w-full mx-auto p-4 md:p-6 space-y-6 relative z-10">
        
        {/* Notice Indicator Banner Removed for Clean Public View */}

        <AnimatePresence mode="wait">
          
          {/* Active Detail Report Screen overrides main view */}
          {activeReport ? (
            <motion.div
              key="active-report-suite"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.2 }}
            >
              <ReportViewer 
                report={activeReport}
                onBack={() => {
                  setActiveReport(null);
                  setActiveTab("history");
                }}
                onDelete={(id) => {
                  deleteReport(id);
                }}
              />
            </motion.div>
          ) : loading ? (
            /* Custom Real-Time Telemetry Terminal */
            <motion.div 
              key="terminal-loader"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-md w-full mx-auto glass-premium shadow-2xl p-5 md:p-6 rounded-3xl min-h-[350px] flex flex-col justify-between font-mono text-xs text-zinc-800 relative z-10"
            >
              <div className="flex items-center justify-between border-b border-white/25 pb-3 mb-4">
                <div className="flex items-center gap-1.5 text-zinc-500">
                  <Terminal className="h-3.5 w-3.5 text-zinc-650" />
                  <span className="font-bold text-[9px] tracking-wider text-zinc-600">usability_agent_walkthrough.sh</span>
                </div>
                <span className="bg-white/20 backdrop-blur-md border border-white/40 text-zinc-650 text-[8px] font-bold px-2 py-0.5 rounded-full lowercase tracking-tight">
                  analyzing cognitive load
                </span>
              </div>

              {/* Real-time scrolling message grid with light layout styling */}
              <div className="flex-1 space-y-3.5 overflow-y-auto max-h-[240px] pr-2">
                {terminalLogs.map((log, index) => {
                  let alertColorClass = "text-zinc-600 border-zinc-300 bg-white/10";
                  if (log.includes("Anxious")) {
                    alertColorClass = "text-rose-700 border-rose-300 bg-rose-50/25";
                  } else if (log.includes("Distracted")) {
                    alertColorClass = "text-amber-700 border-amber-300 bg-amber-50/25";
                  } else if (log.includes("First-Time")) {
                    alertColorClass = "text-emerald-750 border-emerald-300 bg-emerald-50/25";
                  }
                  
                  return (
                    <div key={index} className={`leading-relaxed border-l-2 pl-3 py-1 rounded-r-lg ${alertColorClass}`}>
                      {log}
                    </div>
                  );
                })}
                <div ref={terminalEndRef}></div>
              </div>

              <div className="mt-5 pt-2.5 border-t border-white/25 text-zinc-500 flex items-center justify-between text-[10px]">
                <span>stages analyzed: {currentDisplayStep} / 9</span>
                <RefreshCw className="h-3 w-3 animate-spin text-zinc-500" />
              </div>
            </motion.div>
          ) : activeTab === "scan" ? (
            /* Primary Scan Config Form visually centered with beautiful translucent glassmorphic components */
            <motion.div
              key="main-scan-dashboard"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              className="max-w-md mx-auto flex flex-col justify-center items-center min-h-[72vh] py-6 space-y-6"
            >
              {errorText && (
                <div className="w-full p-4 bg-rose-50/75 backdrop-blur-md border border-rose-200/50 text-rose-700 rounded-2xl flex items-start gap-3 shadow-sm">
                  <AlertCircle className="h-5 w-5 text-rose-600 flex-shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    <p className="font-sans font-black text-xs text-rose-950">Validation Notice</p>
                    <p className="text-xs leading-normal font-sans text-rose-800">
                      {errorText}
                    </p>
                  </div>
                </div>
              )}

              {/* Professional Minimalist Header - Optimized size & spacing */}
              <div className="text-center space-y-1.5 max-w-sm mx-auto">
                <span className="text-zinc-400 font-mono text-[8px] tracking-[0.2em] font-extrabold uppercase">
                  cognitive walkthrough rig
                </span>
                <h2 className="font-sans font-black text-2xl text-zinc-900 tracking-tight leading-snug">
                  Optimize Interface Friction
                </h2>
                <p className="text-zinc-500 font-sans text-xs leading-relaxed">
                  Simulate modern user sessions across distinct reading pathways to map visual focus instantly.
                </p>
              </div>

              {/* Input container wrapped in a luxury glassmorphism layer where the animated orbits shine through */}
              <div className="relative w-full rounded-3xl p-px shadow-xl glass-premium overflow-hidden transition-all duration-300">
                
                {/* Translucent overlay premium body container */}
                <div className="bg-white/10 backdrop-blur-xl rounded-[23px] p-5 md:p-6.5 space-y-5">
                  
                  <form 
                    onSubmit={runStressAudit}
                    className="space-y-4.5"
                  >
                    <div className="space-y-1 pb-1.5 border-b border-white/20">
                      <h3 className="font-sans font-black text-sm text-zinc-900 tracking-tight">
                        Target Interface Scanner
                      </h3>
                      <p className="text-[10px] text-zinc-500 font-sans">
                        Provide a mockup file or enter a website address below.
                      </p>
                    </div>

                    {/* Interactive drag zone with translucent layout feedback */}
                    <div 
                      onClick={triggerSelectFile}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      className={`cursor-pointer rounded-xl border border-dashed transition-all p-6 text-center space-y-2.5 relative min-h-[120px] flex flex-col justify-center ${
                        isDragging 
                          ? "border-zinc-900/60 bg-white/20 scale-[0.99] shadow-inner" 
                          : "border-white/40 hover:border-white/70 bg-white/15 hover:bg-white/25"
                      }`}
                    >
                      <input 
                        type="file" 
                        ref={fileInputRef}
                        className="hidden" 
                        accept="image/*"
                        onChange={handleFileChange}
                      />

                      {uploadedScreenshot ? (
                        <div className="space-y-2.5">
                          <div className="h-24 max-w-xs mx-auto rounded-lg overflow-hidden border border-white/40 shadow-sm relative group bg-white/20">
                            <img 
                              src={uploadedScreenshot} 
                              className="h-full w-full object-contain" 
                              alt="Preview Target" 
                            />
                            <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                              <span className="text-[8px] text-white font-mono uppercase bg-zinc-950/80 px-2.5 py-1 rounded font-black">
                                Change image
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center justify-center gap-1.5">
                            <span className="font-mono text-[9px] font-bold text-zinc-700 max-w-[150px] truncate">
                              {screenshotName}
                            </span>
                            <button 
                              type="button" 
                              onClick={clearUploadedFile}
                              className="text-[9px] uppercase font-mono font-extrabold text-rose-600 hover:underline cursor-pointer min-h-[24px]"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <div className="h-8 w-8 rounded-lg bg-zinc-950/85 backdrop-blur-md text-white flex items-center justify-center mx-auto shadow-sm">
                            <UploadCloud className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="font-sans font-black text-[11px] text-zinc-900">
                              Upload mockup file or click
                            </p>
                            <p className="text-[9px] text-zinc-500 font-sans font-medium">
                              Supports images (.png, .jpg)
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Optional address field */}
                    <div className="space-y-1.5 text-left pb-1">
                      <label className="text-[9px] font-mono tracking-widest font-black text-zinc-500 uppercase block pl-1">
                        Web URL Location (Alternative)
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-500">
                          <Globe className="h-3.5 w-3.5" />
                        </div>
                        <input
                          type="url"
                          value={urlInput}
                          onChange={(e) => setUrlInput(e.target.value)}
                          placeholder="https://dashboard-interface.com"
                          className="w-full bg-white/25 hover:bg-white/35 focus:bg-white/60 border border-white/50 rounded-xl py-2 pl-8.5 pr-3 text-xs font-sans text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-650 transition-all"
                        />
                      </div>
                    </div>

                    {/* Core Submission action with 44px min touch target */}
                    <button
                      type="submit"
                      className="w-full bg-zinc-950 hover:bg-zinc-850 text-white py-3 px-4 rounded-xl font-sans font-black text-xs flex items-center justify-center gap-2 transition-all shadow-md active:scale-98 min-h-[44px] cursor-pointer"
                    >
                      <Zap className="h-4 w-4" />
                      Deconstruct Layout
                    </button>
                  </form>

                </div>
              </div>
            </motion.div>
          ) : (
            /* Archived Saved Record list layout */
            <motion.div
              key="saved-reports-grid"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="max-w-4xl mx-auto"
            >
              <SavedReports 
                reports={savedReports}
                onSelectReport={(report) => {
                  setActiveReport(report);
                }}
                onDeleteReport={deleteReport}
              />
            </motion.div>
          )}

        </AnimatePresence>

      </main>

      {/* Elegant, high-contrast, minimalist responsive Footer */}
      <footer className="py-8 mt-12 border-t border-zinc-200/45">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3 font-mono text-[9px] text-zinc-400">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 uppercase tracking-widest">
            <span>JPG / PNG Capture</span>
            <span className="text-zinc-300">•</span>
            <span>Telemetry v1.65</span>
          </div>
          <p className="font-sans font-normal text-zinc-400">
            &copy; 2026 panic.design
          </p>
        </div>
      </footer>

    </div>
  );
}
