import React, { useMemo } from "react";
import { Activity, Calendar, Trophy, BarChart3 } from "lucide-react";
import LiveMatches from "../components/LiveMatches";
import TodaysMatches from "../components/TodaysMatches";
import Results from "../components/Results";
import razor from "../assets/razor.jpeg";

export default function MatchesPage() {
  // Premium background blend utilizing unified deep zinc tones
  const backgroundStyle = useMemo(
    () => ({
      backgroundImage: `linear-gradient(to bottom, rgba(9, 9, 11, 0.85), rgba(9, 9, 11, 0.98)), url(${razor})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundAttachment: "fixed",
    }),
    []
  );

  return (
    <div
      className="min-h-screen text-zinc-100 selection:bg-emerald-500 selection:text-black"
      style={backgroundStyle}
    >
      {/* 1. Dashboard Master Header */}
      <header className="pt-16 pb-12 px-4 text-center space-y-3 max-w-xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md border border-zinc-800 bg-zinc-950/60 backdrop-blur-md text-zinc-400 text-[10px] font-mono uppercase tracking-wider">
          <Trophy size={11} className="text-emerald-400" /> Live Broadcasting
          Hub
        </div>

        <h1 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tight">
          Match Center
        </h1>

        <p className="font-mono text-[11px] text-zinc-500 uppercase tracking-widest leading-relaxed">
          Real-time event streams, daily programming schedules, and historical
          data archives.
        </p>
      </header>

      {/* 2. Unified Scroll Content Stream */}
      <main className="max-w-7xl mx-auto pb-24 px-4 space-y-20">
        {/* SECTION A: ACTIVE LIVE TRANMISSIONS (Top Priority) */}
        <section className="relative group">
          <div className="absolute -inset-y-4 -inset-x-2 bg-zinc-900/10 rounded-2xl group-hover:bg-zinc-900/20 transition-colors duration-500 pointer-events-none" />
          <div className="relative space-y-4">
            <div className="flex items-center gap-3 px-2">
              <div className="flex items-center justify-center h-7 w-7 rounded-md bg-emerald-950 border border-emerald-900/60 text-emerald-400">
                <Activity size={14} className="animate-pulse" />
              </div>
              <h3 className="font-mono text-xs font-bold text-zinc-400 uppercase tracking-widest">
                Live Channels
              </h3>
            </div>
            <LiveMatches />
          </div>
        </section>

        {/* SECTION B: UPCOMING SCHEDULE FOR TODAY */}
        <section className="relative group">
          <div className="absolute -inset-y-4 -inset-x-2 bg-zinc-900/10 rounded-2xl group-hover:bg-zinc-900/20 transition-colors duration-500 pointer-events-none" />
          <div className="relative space-y-4">
            <div className="flex items-center gap-3 px-2">
              <div className="flex items-center justify-center h-7 w-7 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-400">
                <Calendar size={14} />
              </div>
              <h3 className="font-mono text-xs font-bold text-zinc-400 uppercase tracking-widest">
                Upcoming Fixtures
              </h3>
            </div>
            <TodaysMatches />
          </div>
        </section>

        {/* SECTION C: HISTORICAL RESULTS ARCHIVE */}
        <section className="relative group border-t border-zinc-900 pt-16">
          <div className="relative space-y-4">
            <div className="flex items-center gap-3 px-2">
              <div className="flex items-center justify-center h-7 w-7 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-400">
                <BarChart3 size={14} />
              </div>
              <h3 className="font-mono text-xs font-bold text-zinc-400 uppercase tracking-widest">
                Recent Results
              </h3>
            </div>
            <Results />
          </div>
        </section>
      </main>

      {/* 3. Global Dashboard Footer */}
      <footer className="py-12 border-t border-zinc-900 flex flex-col items-center justify-center space-y-2 bg-zinc-950/40 backdrop-blur-sm">
        <p className="font-mono text-[10px] text-zinc-600 uppercase tracking-widest">
          &copy; {new Date().getFullYear()} Sports Streaming Platform
        </p>
      </footer>
    </div>
  );
}
