import React from "react";
import { Link } from "react-router-dom";
import { Play, Monitor, Layers } from "lucide-react";
import bill from "../../assets/bill.png";

export default function Movies() {
  return (
    <section className="relative flex flex-col items-center justify-center text-center text-white py-24 px-4 sm:px-6 min-h-[70vh] bg-zinc-950 border border-zinc-900 rounded-3xl m-2 sm:m-4 shadow-2xl overflow-hidden">
      {/* CSS-Only Depth Pattern */}
      <div
        className="absolute inset-0 opacity-[0.05] pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(#52525b 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      {/* Subtle Bottom-Right Glow for Contrast */}
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-emerald-500/5 blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-4xl w-full relative z-10">
        {/* Badge Telemetry */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="h-[1px] w-6 bg-zinc-800" />
          <span className="font-mono text-[9px] uppercase tracking-[0.4em] text-emerald-400 font-bold">
            Movies Section
          </span>
          <div className="h-[1px] w-6 bg-zinc-800" />
        </div>

        {/* Brand Header */}
        <h2 className="flex flex-wrap items-center justify-center gap-3 text-4xl sm:text-6xl md:text-7xl font-black tracking-tighter uppercase leading-none mb-6">
          <span className="text-white">MOVIES</span>
          <span className="bg-emerald-400 text-zinc-950 text-[18px] sm:text-3xl md:text-4xl font-mono font-black px-3 py-1 rounded-xl tracking-widest shadow-md shadow-emerald-500/10">
            .STREAM
          </span>
        </h2>

        {/* Direct Subtext */}
        <p className="font-mono text-[11px] sm:text-xs uppercase tracking-[0.25em] max-w-xl mx-auto mb-12 text-zinc-500 leading-relaxed">
          Watch the latest <span className="text-zinc-300">Movies</span>, full{" "}
          <span className="text-zinc-300">Series</span>, and live entertainment
          in one place.
        </p>

        {/* Graphic Asset */}
        <div className="relative group max-w-xs mx-auto mb-4">
          <img
            src={bill}
            alt="media"
            className="relative w-44 md:w-56 mx-auto drop-shadow-[0_25px_40px_rgba(0,0,0,0.8)] transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      </div>

      {/* Action Hub */}
      <div className="mt-8 w-full max-w-xs sm:max-w-none relative z-10">
        <Link
          to="/movies/home"
          className="group relative inline-flex w-full sm:w-auto items-center justify-center gap-3 px-12 py-4 bg-zinc-100 text-zinc-950 rounded-xl overflow-hidden transition-all duration-200 hover:bg-emerald-400 active:scale-95 shadow-lg shadow-black/40"
        >
          <span className="font-black text-xs uppercase tracking-widest">
            Open Movies
          </span>
          <Play size={13} fill="currentColor" />
        </Link>

        {/* Metadata */}
        <div className="mt-8 flex justify-center items-center gap-4 font-mono text-[9px] text-zinc-600 uppercase tracking-widest font-medium">
          <span className="flex items-center gap-1.5">
            <Monitor size={11} /> 4K Quality
          </span>
          <span className="text-zinc-800">•</span>
          <span className="flex items-center gap-1.5">
            <Layers size={11} /> 500+ Videos
          </span>
        </div>
      </div>
    </section>
  );
}
