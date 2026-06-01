import React from "react";
import { 
  FileText, 
  Trash2, 
  Activity, 
  TrendingUp, 
  Clock, 
  ExternalLink 
} from "lucide-react";
import { StressTestReport } from "../types";

interface SavedReportsProps {
  reports: StressTestReport[];
  onSelectReport: (report: StressTestReport) => void;
  onDeleteReport: (id: string) => void;
}

export default function SavedReports({ reports, onSelectReport, onDeleteReport }: SavedReportsProps) {
  if (reports.length === 0) {
    return (
      <div className="glass-premium rounded-3xl p-12 text-center max-w-xl mx-auto space-y-4 shadow-sm">
        <div className="h-11 w-11 rounded-full bg-white/15 dark:bg-zinc-900 border border-white/20 text-zinc-900 flex items-center justify-center mx-auto text-base font-black font-mono">
          0
        </div>
        <div className="space-y-1.5">
          <h3 className="font-sans font-black text-base text-zinc-900 tracking-tight">
            History is Empty
          </h3>
          <p className="text-[11px] text-zinc-500 font-sans leading-relaxed">
            You haven't run any custom UX evaluation audits yet. Upload a screenshot or enter a website URL on the dashboard to generate your first audit report.
          </p>
        </div>
      </div>
    );
  }

  // Calculate high-level analytics for the header bar
  const averageFrictionScore = Math.round(reports.reduce((acc, r) => acc + r.globalPanicScore, 0) / reports.length);
  const coreHfrictionIssues = reports.filter(r => r.globalPanicScore >= 75).length;

  return (
    <div className="space-y-6">
      {/* Analytics Overview Line */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-4.5 rounded-3xl glass-premium flex items-center gap-3.5 hover:shadow-lg transition-all">
          <div className="h-9 w-9 rounded-xl bg-white/20 border border-white/25 flex items-center justify-center">
            <Activity className="h-4.5 w-4.5 text-zinc-700" />
          </div>
          <div>
            <span className="font-mono text-[8px] font-extrabold text-zinc-400 block uppercase tracking-widest">
              Total Evaluated Layouts
            </span>
            <span className="font-sans font-black text-xl text-zinc-900 tracking-tight leading-none block mt-1">
              {reports.length}
            </span>
          </div>
        </div>

        <div className="p-4.5 rounded-3xl glass-premium flex items-center gap-3.5 hover:shadow-lg transition-all">
          <div className="h-9 w-9 rounded-xl bg-amber-500/10 border border-amber-500/15 flex items-center justify-center">
            <TrendingUp className="h-4.5 w-4.5 text-orange-500" />
          </div>
          <div>
            <span className="font-mono text-[8px] font-extrabold text-zinc-400 block uppercase tracking-widest">
              Average Friction Score
            </span>
            <span className="font-sans font-black text-xl text-orange-600 tracking-tight leading-none block mt-1">
              {averageFrictionScore}%
            </span>
          </div>
        </div>

        <div className="p-4.5 rounded-3xl glass-premium flex items-center gap-3.5 hover:shadow-lg transition-all">
          <div className="h-9 w-9 rounded-xl bg-red-500/10 border border-red-500/15 flex items-center justify-center">
            <Activity className="h-4.5 w-4.5 text-red-500 animate-none" />
          </div>
          <div>
            <span className="font-mono text-[8px] font-extrabold text-zinc-400 block uppercase tracking-widest">
              High-Friction Screens
            </span>
            <span className="font-sans font-black text-xl text-red-600 tracking-tight leading-none block mt-1">
              {coreHfrictionIssues}
            </span>
          </div>
        </div>
      </div>

      {/* Reports Table list layout */}
      <div className="glass-premium rounded-[24px] overflow-hidden">
        <div className="p-5 border-b border-white/20">
          <h3 className="font-sans font-black text-base text-zinc-900 tracking-tight">
            Evaluation History
          </h3>
          <p className="text-xs text-zinc-500 font-sans mt-0.5">
            Select an audited dashboard record row from the table below to reload its full report.
          </p>
        </div>

        <div className="overflow-x-auto animate-fadeIn">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/10 text-[8.5px] font-mono uppercase tracking-widest text-[#52525b] border-b border-white/20">
                <th className="py-2.5 px-5 font-bold">Report Title / Path</th>
                <th className="py-2.5 px-5 font-bold text-center">Friction Score</th>
                <th className="py-2.5 px-5 font-bold">Timestamp</th>
                <th className="py-2.5 px-5 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {reports.map((report) => {
                const formattedDate = new Date(report.timestamp).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit"
                });

                return (
                  <tr 
                    key={report.id}
                    className="hover:bg-white/20 group transition-all duration-150 cursor-pointer text-xs"
                  >
                    {/* Title with image icon */}
                    <td 
                      onClick={() => onSelectReport(report)}
                      className="py-4 px-5"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-lg border border-zinc-200 bg-zinc-50 flex items-center justify-center text-zinc-400 group-hover:bg-white group-hover:border-zinc-300 flex-shrink-0">
                          {report.imageUrl ? (
                            <img 
                              src={report.imageUrl} 
                              className="h-full w-full object-cover rounded-lg" 
                              alt="Thumbnail" 
                              referrerPolicy="no-referrer"
                            />
                          ) : (
                            <FileText className="h-4.5 w-4.5 text-zinc-500" />
                          )}
                        </div>
                        <div>
                          <span className="font-sans font-black text-zinc-900 leading-none group-hover:underline block">
                            {report.title}
                          </span>
                          {report.urlAnalyzed && (
                            <span className="font-mono text-[9px] text-zinc-400 mt-1 flex items-center gap-1">
                              <ExternalLink className="h-3 w-3" /> {report.urlAnalyzed}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Score Gauge */}
                    <td 
                      onClick={() => onSelectReport(report)}
                      className="py-4 px-5 text-center"
                    >
                      <span className={`inline-block font-mono text-[10px] font-extrabold px-2.5 py-0.5 rounded-full ${
                        report.globalPanicScore >= 80 
                          ? "bg-red-50 text-red-650 border border-red-100" 
                          : report.globalPanicScore >= 50
                          ? "bg-orange-50 text-orange-650 border border-orange-100"
                          : "bg-emerald-50 text-emerald-650 border border-emerald-100"
                      }`}>
                        {report.globalPanicScore}% Friction
                      </span>
                    </td>

                    {/* Timestamp */}
                    <td 
                      onClick={() => onSelectReport(report)}
                      className="py-4 px-5 font-mono text-zinc-500"
                    >
                      <span className="flex items-center gap-1.5 font-semibold text-[11px]">
                        <Clock className="h-3.5 w-3.5 text-zinc-400" />
                        {formattedDate}
                      </span>
                    </td>

                    {/* Action Bar */}
                    <td className="py-4 px-5 text-right font-sans">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation(); // prevent row click triggers
                          onDeleteReport(report.id);
                        }}
                        className="p-1 px-2.5 rounded-lg border border-transparent bg-white/10 hover:border-[#f43f5e]/25 hover:bg-[#f43f5e]/10 text-zinc-400 hover:text-[#f43f5e] transition-colors inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-wider"
                        title="Delete record"
                      >
                        <Trash2 className="h-3 w-3" /> Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
