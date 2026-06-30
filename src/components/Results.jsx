import React from "react";
import { Database, ChevronRight, Terminal } from "lucide-react";

const Results = () => {
  return (
    <div className="w-full rounded-2xl border border-zinc-900 bg-zinc-950/20 p-8 sm:p-12 transition-all duration-300 backdrop-blur-sm flex flex-col sm:flex-row items-center justify-between gap-6 my-6">
      {/* Left Column: Icon and Info */}
      <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left min-w-0">
        <div className="p-3 bg-zinc-900/40 border border-zinc-900 rounded-xl flex-shrink-0">
          <Database className="text-zinc-500 animate-pulse" size={22} />
        </div>

        <div className="space-y-1.5 min-w-0">
          <h2 className="flex items-center justify-center sm:justify-start gap-2 text-lg font-black text-white uppercase tracking-tight">
            <span>Match Results</span>
            <span className="bg-zinc-800 text-zinc-400 text-[9px] font-mono font-bold px-2 py-0.5 rounded uppercase tracking-wider">
              Coming Soon
            </span>
          </h2>
          <p className="text-xs text-zinc-500 max-w-md leading-relaxed">
            Historical stats, live match scores, and past tournament metrics are
            currently being indexed.
          </p>
        </div>
      </div>

      {/* Right Column: Clean Status Action */}
      <div className="flex flex-col items-center sm:items-end gap-2 flex-shrink-0 w-full sm:w-auto">
        <button
          disabled
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl border border-zinc-900 bg-zinc-950/40 text-zinc-600 font-mono text-[10px] uppercase tracking-widest cursor-not-allowed"
        >
          <Terminal size={12} /> System Offline
        </button>
      </div>
    </div>
  );
};

export default Results;
