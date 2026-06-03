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
  Layers,
  Sparkles,
  Smartphone,
  Shield,
  Percent,
  Compass,
  AlertTriangle
} from "lucide-react";
import { PersonaReport } from "../types";

import anxiousAvatar from "../assets/images/anxious_avatar_1780323287333.png";
import firstTimeAvatar from "../assets/images/first_time_avatar_1780323310756.png";
import distractedAvatar from "../assets/images/distracted_avatar_1780323329427.png";
import impatientAvatar from "../assets/images/impatient_avatar_1780486843572.png";
import skepticAvatar from "../assets/images/skeptic_avatar_1780486860800.png";

interface PersonaDetailProps {
  personas: {
    anxious: PersonaReport;
    distracted: PersonaReport;
    firstTime: PersonaReport;
    impatientMobile: PersonaReport;
    skeptic: PersonaReport;
  };
}

export default function PersonaDetail({ personas }: PersonaDetailProps) {
  // Local state to track which persona's details are expanded (default to true/open)
  const [expanded, setExpanded] = useState<Record<string, boolean>>({
    anxious: true,
    distracted: true,
    firstTime: true,
    impatientMobile: true,
    skeptic: true
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
      description: "Needs high visual reliability, explicit backtracks, and explicit helper tooltips. Extremely risk-averse.",
      report: personas.anxious,
      color: "from-rose-500 to-red-600",
      bgClass: "hover:shadow-lg transition-transform hover:-translate-y-0.5 border-zinc-200/85",
      textColor: "text-rose-600",
      icon: AlertOctagon,
      avatar: anxiousAvatar,
      initials: "AE"
    },
    {
      key: "distracted" as const,
      name: "Distracted User",
      subtitle: "Attention State",
      description: "Multitasker with rapid eye traversal. Misses low-contrast details, tiny anchors, or quiet notes.",
      report: personas.distracted,
      color: "from-amber-400 to-orange-500",
      bgClass: "hover:shadow-lg transition-transform hover:-translate-y-0.5 border-zinc-200/85",
      textColor: "text-amber-600",
      icon: Eye,
      avatar: distractedAvatar,
      initials: "DU"
    },
    {
      key: "firstTime" as const,
      name: "First-Time Visitor",
      subtitle: "Vocabulary State",
      description: "Has zero context or industry terminology alignment. Needs clean, welcoming introductory pathways.",
      report: personas.firstTime,
      color: "from-emerald-400 to-teal-500",
      bgClass: "hover:shadow-lg transition-transform hover:-translate-y-0.5 border-zinc-200/85",
      textColor: "text-emerald-600",
      icon: Layers,
      avatar: firstTimeAvatar,
      initials: "FT"
    },
    {
      key: "impatientMobile" as const,
      name: "Impatient Mobile",
      subtitle: "Viewport State",
      description: "Tapping single-handedly on small screens. Zero tolerance for lagging visual reflows or compact hitboxes.",
      report: personas.impatientMobile,
      color: "from-purple-500 to-indigo-600",
      bgClass: "hover:shadow-lg transition-transform hover:-translate-y-0.5 border-zinc-200/85",
      textColor: "text-purple-600",
      icon: Smartphone,
      avatar: impatientAvatar,
      initials: "IM"
    },
    {
      key: "skeptic" as const,
      name: "The Trust Skeptic",
      subtitle: "Security State",
      description: "Looks for dark patterns, vague billing statements, credit card traps, and excessive data collection queries.",
      report: personas.skeptic,
      color: "from-zinc-700 to-zinc-900",
      bgClass: "hover:shadow-lg transition-transform hover:-translate-y-0.5 border-zinc-200/85",
      textColor: "text-zinc-700",
      icon: Shield,
      avatar: skepticAvatar,
      initials: "SK"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Structural Header with spacious styling */}
      <div className="border-b border-zinc-200/80 pb-4 max-w-4xl">
        <h3 className="font-sans font-black text-sm text-zinc-900 tracking-tight flex items-center gap-2">
          <Brain className="h-4.5 w-4.5 text-zinc-900" />
          Persona Friction Statistics ({personaCards.length})
        </h3>
        <p className="text-xs text-zinc-550 font-sans mt-1">
          Interactive metrics mapping visual orientation, drop-off rates, and element stress ratings simultaneously across 5 simulated profiles.
        </p>
      </div>

      {/* 5 Parallel statistics cards (Responsive Grid) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {personaCards.map(({ key, name, subtitle, description, report, color, bgClass, textColor, icon: IconComponent, avatar, initials }) => {
          if (!report) return null;
          const isExpanded = !!expanded[key];
          
          return (
            <div 
              key={key}
              className="glass-premium rounded-[24px] p-5 flex flex-col justify-between border border-white/40 shadow-xs hover:shadow-md transition-all h-full"
            >
              <div className="space-y-4">
                
                {/* Micro heading line */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-zinc-400">
                    <IconComponent className={`h-3 w-3 ${textColor}`} />
                    <span className="font-mono text-[8px] uppercase tracking-widest font-extrabold shadow-none">
                      {subtitle}
                    </span>
                  </div>
                  <span className="bg-zinc-100 border border-zinc-200/50 font-mono text-[7px] text-zinc-500 px-1.5 py-0.5 rounded-md uppercase font-bold tracking-wider">
                    SIMULATION
                  </span>
                </div>

                {/* Persona Identification header with beautiful minimalist circular avatar */}
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full border border-zinc-200 bg-zinc-50 overflow-hidden shrink-0 select-none flex items-center justify-center">
                    {avatar ? (
                      <img 
                        src={avatar} 
                        alt={name} 
                        className="h-full w-full object-cover rounded-full"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className={`h-full w-full text-white font-sans font-black flex items-center justify-center text-xs uppercase tracking-widest bg-gradient-to-br ${color}`}>
                        {initials}
                      </div>
                    )}
                  </div>
                  <div>
                    <h4 className="font-sans font-black text-[13px] text-zinc-900 tracking-tight leading-tight">
                      {name}
                    </h4>
                    <span className="font-mono text-[8px] uppercase tracking-wider text-zinc-400 font-bold block">
                      Target Audience
                    </span>
                  </div>
                </div>

                <p className="text-zinc-650 font-sans text-xs leading-relaxed min-h-12">
                  {description}
                </p>

                {/* Massive Statistics Graphic Label */}
                <div className="pt-1.5">
                  <div className="flex items-baseline gap-1">
                    <span className="font-sans font-black text-5xl text-zinc-900 tracking-tighter leading-none">
                      {report.score}%
                    </span>
                    <span className="font-mono text-[9px] uppercase font-bold text-zinc-400 tracking-wide">
                      Stress
                    </span>
                  </div>
                  
                  {/* Styled visual baseline bar indicator */}
                  <div className="h-1.5 w-full bg-zinc-100 rounded-full overflow-hidden mt-2.5">
                    <div 
                      className={`h-full bg-gradient-to-r ${color} transition-all duration-750`}
                      style={{ width: `${report.score}%` }}
                    ></div>
                  </div>
                </div>

                {/* Rich Performance Metrics Hub */}
                <div className="grid grid-cols-3 gap-2 pt-3 pb-1 border-t border-b border-zinc-100 font-mono text-[8.5px] text-zinc-500 font-bold uppercase select-none">
                  <div className="space-y-0.5 text-center">
                    <span className="block text-zinc-400 font-extrabold text-[7.5px] tracking-wider">DROP-OFF</span>
                    <span className="text-zinc-900 font-black text-xs block leading-none mt-1">
                      {report.dropOffProbability ?? Math.floor(report.score * 0.9)}%
                    </span>
                  </div>
                  <div className="space-y-0.5 text-center border-l border-r border-zinc-100">
                    <span className="block text-zinc-400 font-extrabold text-[7.5px] tracking-wider">TRUST RTG</span>
                    <span className="text-zinc-900 font-black text-xs block leading-none mt-1">
                      {report.trustRating ?? Math.max(100 - report.score, 15)}%
                    </span>
                  </div>
                  <div className="space-y-0.5 text-center">
                    <span className="block text-zinc-400 font-extrabold text-[7.5px] tracking-wider">HOTSPOTS</span>
                    <span className="text-zinc-900 font-black text-xs block leading-none mt-1 flex items-center justify-center gap-0.5">
                      <AlertTriangle className="h-2.5 w-2.5 text-zinc-400 mt-0.5" />
                      {report.frictionPointsCount ?? report.frictionPoints.length}
                    </span>
                  </div>
                </div>

                {/* Scannable metrics list */}
                <div className="pt-2">
                  <div className="space-y-1">
                    <span className="text-zinc-400 font-extrabold text-[8px] uppercase tracking-wider block font-mono">Primary Failure Risk</span>
                    <p className="text-xs text-zinc-700 font-sans font-medium leading-relaxed italic">
                      &ldquo;{report.biggestRisk}&rdquo;
                    </p>
                  </div>
                </div>

              </div>

              {/* Expansion Details Drawer with Toggle */}
              <div className="pt-3.5 mt-3.5 border-t border-zinc-200/65 space-y-3.5">
                
                <button
                  onClick={() => toggleExpand(key)}
                  className="w-full flex items-center justify-between text-xs font-sans font-extrabold text-zinc-800 hover:text-zinc-600 transition-colors uppercase tracking-wider py-1 cursor-pointer"
                >
                  <span className="text-[10px] tracking-widest">
                    {isExpanded ? "Hide Inner Dialogue" : "Read Full Dialogue"}
                  </span>
                  {isExpanded ? (
                    <ChevronUp className="h-3.5 w-3.5 text-zinc-800" />
                  ) : (
                    <ChevronDown className="h-3.5 w-3.5 text-zinc-800" />
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
                      <div className="p-3 bg-[#0d0e11] text-zinc-200 border border-zinc-800 rounded-2xl relative overflow-hidden">
                        <span className="font-mono text-[8px] uppercase tracking-widest font-extrabold text-amber-400 block mb-1">
                          Simulated Inner Monologue
                        </span>
                        <p className="font-sans text-[11.5px] italic text-zinc-300 leading-relaxed">
                          &ldquo;{report.quote}&rdquo;
                        </p>
                      </div>

                      {/* Friction Point Bullet Row items */}
                      <div className="space-y-2.5">
                        <span className="font-mono text-[8px] uppercase font-bold text-zinc-400 block tracking-widest leading-none">
                          Friction Map Areas ({report.frictionPoints.length})
                        </span>

                        <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                          {report.frictionPoints.map((point, index) => (
                            <div 
                              key={index}
                              className="p-3 bg-zinc-50 border border-zinc-200 rounded-xl space-y-1.5"
                            >
                              <div className="flex items-center justify-between">
                                <span className="font-sans font-extrabold text-xs text-zinc-900 flex items-center gap-1.5">
                                  <span className="w-4.5 h-4.5 bg-zinc-900 text-white text-[9px] font-mono rounded-full flex items-center justify-center shrink-0">
                                    {index + 1}
                                  </span>
                                  <code className="text-[10.5px] bg-zinc-100 text-zinc-800 px-1 py-0.5 rounded">
                                    {point.element}
                                  </code>
                                </span>
                                <span className={`text-[7.5px] font-mono uppercase font-black px-1.5 py-0.5 rounded-[4px] shrink-0 ${
                                  point.severity === "high"
                                    ? "bg-rose-50 text-rose-600 border border-rose-100"
                                    : "bg-amber-50 text-amber-600 border border-amber-100"
                                }`}>
                                  {point.severity}
                                </span>
                              </div>

                              <div className="text-[11px] font-sans text-zinc-600 leading-relaxed pl-1">
                                {point.namedZone && (
                                  <div className="mb-1">
                                    <span className="font-mono text-[7.5px] font-extrabold uppercase bg-indigo-50 text-indigo-600 border border-indigo-100 px-1 py-0.3 rounded">
                                      Zone: {point.namedZone}
                                    </span>
                                  </div>
                                )}
                                <p className="text-zinc-400 text-[8.5px] font-bold uppercase tracking-wider">
                                  Location: {point.locationDescription}
                                </p>
                                <p className="text-zinc-600 mt-1">
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
