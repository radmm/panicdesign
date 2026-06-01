import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  AlertCircle, 
  ChevronDown, 
  ChevronUp, 
  AlertOctagon, 
  Brain, 
  HelpCircle,
  Eye,
  Layers
} from "lucide-react";
import { PersonaReport } from "../types";

interface PersonaDetailProps {
  personas: {
    anxious: PersonaReport;
    distracted: PersonaReport;
    firstTime: PersonaReport;
  };
}

export default function PersonaDetail({ personas }: PersonaDetailProps) {
  // Local state to track which persona's details are expanded
  const [expanded, setExpanded] = useState<Record<string, boolean>>({
    anxious: false,
    distracted: false,
    firstTime: false
  });

  const toggleExpand = (key: string) => {
    setExpanded(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const personaCards = [
    {
      key: "anxious" as const,
      name: "Anxious Explorer",
      subtitle: "Reassurance State",
      description: "Needs high visual reliability, explicit backtracks, and helper tooltips. Extremely risk-averse.",
      report: personas.anxious,
      color: "from-rose-500 to-red-600",
      bgClass: "hover:shadow-lg transition-shadow border-zinc-200/85",
      textColor: "text-rose-600",
      icon: AlertOctagon,
    },
    {
      key: "distracted" as const,
      name: "Distracted User",
      subtitle: "Attention State",
      description: "Multitasker with rapid eye traversal. Misses low-contrast details, tiny anchors, or quiet notes.",
      report: personas.distracted,
      color: "from-amber-400 to-orange-500",
      bgClass: "hover:shadow-lg transition-shadow border-zinc-200/85",
      textColor: "text-amber-600",
      icon: Eye,
    },
    {
      key: "firstTime" as const,
      name: "First-Time Visitor",
      subtitle: "Vocabulary State",
      description: "Has zero context or terminology alignment. Needs high-quality introductory paths.",
      report: personas.firstTime,
      color: "from-emerald-400 to-teal-500",
      bgClass: "hover:shadow-lg transition-shadow border-zinc-200/85",
      textColor: "text-emerald-600",
      icon: Layers,
    }
  ];

  return (
    <div className="space-y-6">
      {/* Structural Header with spacious styling */}
      <div className="border-b border-white/20 pb-4 max-w-4xl">
        <h3 className="font-sans font-black text-base text-zinc-900 tracking-tight flex items-center gap-2">
          <Brain className="h-4.5 w-4.5 text-zinc-805" />
          Persona Friction Statistics
        </h3>
        <p className="text-xs text-zinc-550 font-sans mt-1">
          Interactive metrics mapping visual orientation and element stress ratings simultaneously across separate navigators.
        </p>
      </div>

      {/* 3 Parallel statistics cards (Locus-Like web UI) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {personaCards.map(({ key, name, subtitle, description, report, color, bgClass, textColor, icon: IconComponent }) => {
          const isExpanded = !!expanded[key];
          
          return (
            <div 
              key={key}
              className="glass-premium rounded-[24px] p-5.5 flex flex-col justify-between hover:shadow-xl transition-all"
            >
              <div className="space-y-5">
                
                {/* Micro heading line */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-zinc-450">
                    <IconComponent className={`h-4.5 w-4.5 ${textColor}`} />
                    <span className="font-mono text-[9px] uppercase tracking-widest font-extrabold text-zinc-400">
                      {subtitle}
                    </span>
                  </div>
                  <span className="bg-zinc-100 font-mono text-[9px] text-zinc-500 px-2.5 py-0.5 rounded-full font-bold">
                    SYSTEM SIM
                  </span>
                </div>

                {/* Persona Identification header */}
                <div>
                  <h4 className="font-sans font-black text-lg text-zinc-900 tracking-tight">
                    {name}
                  </h4>
                  <p className="text-zinc-500 font-sans text-xs mt-1 leading-relaxed">
                    {description}
                  </p>
                </div>

                {/* Massive Statistics Graphic Label (Locus-Inspired) */}
                <div className="pt-2">
                  <div className="flex items-baseline gap-1">
                    <span className="font-sans font-black text-6xl text-zinc-900 tracking-tighter leading-none">
                      {report.score}%
                    </span>
                    <span className="font-mono text-[10px] uppercase font-bold text-zinc-400 tracking-wide">
                      Friction
                    </span>
                  </div>
                  
                  {/* Styled visual baseline bar indicator */}
                  <div className="h-1.5 w-full bg-zinc-100 rounded-full overflow-hidden mt-3">
                    <div 
                      className={`h-full bg-gradient-to-r ${color} transition-all duration-750`}
                      style={{ width: `${report.score}%` }}
                    ></div>
                  </div>
                </div>

                {/* Basic Scannable metrics list */}
                <div className="pt-2 space-y-2 border-t border-zinc-150/60">
                  <div className="flex justify-between text-xs">
                    <span className="text-zinc-400 font-medium font-sans">Cognitive Load:</span>
                    <span className="font-mono text-zinc-800 font-extrabold uppercase">{report.cognitiveLoad}</span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-zinc-400 font-medium text-xs font-sans">Primary Churn Risk:</span>
                    <p className="text-xs text-zinc-700 font-sans font-medium leading-relaxed">
                      {report.biggestRisk}
                    </p>
                  </div>
                </div>

              </div>

              {/* Expansion Details Drawer with elegant motion and Read More toggle button */}
              <div className="pt-4 mt-5 border-t border-zinc-150/60 space-y-4">
                
                <button
                  onClick={() => toggleExpand(key)}
                  className="w-full flex items-center justify-between text-xs font-sans font-extrabold text-zinc-900 hover:text-zinc-650 transition-colors uppercase tracking-wider py-1 cursor-pointer"
                >
                  <span>{isExpanded ? "Hide Details" : "Read More Details"}</span>
                  {isExpanded ? (
                    <ChevronUp className="h-4 w-4 text-zinc-800" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-zinc-800" />
                  )}
                </button>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden space-y-4 pt-1"
                    >
                      {/* Quote card */}
                      <div className="p-3.5 bg-[#0f0f11] text-zinc-200 border border-zinc-850 rounded-xl relative overflow-hidden">
                        <span className="font-mono text-[8px] uppercase tracking-wider font-extrabold text-amber-400 block mb-1">
                          Simulated Mind State
                        </span>
                        <p className="font-sans text-xs italic text-zinc-350 leading-relaxed font-serif">
                          &ldquo;{report.quote}&rdquo;
                        </p>
                      </div>

                      {/* Friction Point Bullet Row items */}
                      <div className="space-y-2.5">
                        <span className="font-mono text-[9px] uppercase font-bold text-zinc-450 block tracking-widest leading-none">
                          Identified Hotspots ({report.frictionPoints.length})
                        </span>

                        <div className="space-y-2">
                          {report.frictionPoints.map((point, index) => (
                            <div 
                              key={index}
                              className="p-3 bg-zinc-50 border border-zinc-250/50 rounded-xl space-y-1.5"
                            >
                              <div className="flex items-center justify-between">
                                <span className="font-sans font-black text-xs text-zinc-900 flex items-center gap-1">
                                  <span className="w-4 h-4 bg-zinc-905 text-white bg-zinc-900 text-[9px] font-mono rounded-full flex items-center justify-center">
                                    {index + 1}
                                  </span>
                                  {point.element}
                                </span>
                                <span className={`text-[8px] font-mono uppercase font-black px-1.5 py-0.5 rounded ${
                                  point.severity === "high"
                                    ? "bg-red-50 text-red-600 border border-red-100"
                                    : "bg-amber-50 text-amber-600 border border-amber-100"
                                }`}>
                                  {point.severity}
                                </span>
                              </div>

                              <div className="text-[11px] font-sans text-zinc-650 leading-relaxed space-y-1 pl-5">
                                <p className="text-zinc-400 font-extrabold text-[9px] uppercase tracking-wide">
                                  Location: {point.locationDescription}
                                </p>
                                <p className="text-zinc-600">
                                  {point.panicTrigger}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                    </motion.div>
                  )}
                </AnimatePresence>

              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
