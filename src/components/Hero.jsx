import React from "react";
import { Link } from "react-router-dom";
import {
  Zap,
  Download,
  Play,
  Film,
  Newspaper,
  Heart,
  ArrowUpRight,
} from "lucide-react";

export default function Hero() {
  const primaryBento = [
    {
      to: "/matches",
      title: "Live Sports Arena",
      description:
        "Watch live football, cricket, and global matches. Fast streams, updated in real time so you never miss a goal.",
      icon: <Play className="text-emerald-400 fill-emerald-400/10" size={22} />,
      tag: "Live Now",
      badgeClass: "border-emerald-500/20 bg-emerald-500/5 text-emerald-400",
      hoverColor:
        "hover:border-emerald-500/40 hover:shadow-[0_0_30px_rgba(16,185,129,0.03)]",
    },
    {
      to: "/movies",
      title: "Movies Lounge",
      description:
        "A clean collection of free movies and TV shows. High-quality streaming with zero ads and zero tracking.",
      icon: <Film className="text-zinc-100" size={22} />,
      tag: "HD Streaming",
      badgeClass: "border-zinc-800 bg-zinc-900/60 text-zinc-300",
      hoverColor:
        "hover:border-zinc-700 hover:shadow-[0_0_30px_rgba(255,255,255,0.02)]",
    },
  ];

  const secondaryBento = [
    {
      to: "/blogs",
      title: "Community Blogs",
      description:
        "Read helpful guides, development updates, and announcements from the team.",
      icon: (
        <Newspaper
          className="text-zinc-400 group-hover:text-emerald-400 transition-colors"
          size={18}
        />
      ),
      tag: "Updates",
    },
    {
      to: "/about",
      title: "Our Story",
      description:
        "Why we built this platform, our simple code philosophy, and how it all works.",
      icon: (
        <Heart
          className="text-zinc-400 group-hover:text-emerald-400 transition-colors"
          size={18}
        />
      ),
      tag: "About Us",
    },
  ];

  return (
    <section className="relative w-full py-12 md:py-16 px-4 sm:px-6 lg:px-8 overflow-hidden text-zinc-100">
      {/* Soft Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[450px] bg-gradient-to-b from-emerald-500/[0.03] via-transparent to-transparent blur-[120px] rounded-full pointer-events-none z-0" />

      <div className="max-w-6xl w-full mx-auto space-y-12 md:space-y-14 relative z-10">
        {/* Main Branding Header */}
        <div className="text-center space-y-5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/20 bg-emerald-500/5 text-emerald-400 text-[10px] font-mono uppercase tracking-[0.2em] shadow-inner">
            <Zap size={10} className="animate-pulse" /> Platform Status: Online
          </div>

          {/* Overhauled Title: Scaled perfectly for mobile & consistent with layout */}
          <h1 className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-none uppercase">
            <span className="text-white">ALCODIST</span>
            <span className="bg-emerald-400 text-zinc-950 text-xl sm:text-4xl md:text-5xl lg:text-6xl font-mono font-black px-2.5 py-0.5 sm:px-4 sm:py-1 rounded-xl sm:rounded-2xl tracking-widest shadow-lg shadow-emerald-500/10">
              HUB
            </span>
          </h1>

          <p className="font-mono text-[10px] sm:text-xs text-zinc-500 max-w-xl mx-auto uppercase tracking-[0.25em] leading-relaxed">
            Free Live Sports <span className="text-zinc-700">//</span> Movies
            &amp; Series Lounge
          </p>
        </div>

        {/* Navigation Grid */}
        <div className="space-y-4">
          {/* Main Cards: Sports and Movies side-by-side */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {primaryBento.map((item, index) => (
              <Link
                key={index}
                to={item.to}
                className={`group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-zinc-900 bg-zinc-950/40 p-6 sm:p-8 md:p-10 transition-all duration-300 backdrop-blur-md ${item.hoverColor}`}
              >
                <div className="flex justify-between items-start mb-12 sm:mb-16">
                  <div className="p-3 bg-zinc-900/80 border border-zinc-800 rounded-xl group-hover:bg-zinc-800 transition-colors duration-300 shadow-md">
                    {item.icon}
                  </div>
                  <span
                    className={`text-[9px] font-mono border px-2 py-0.5 rounded uppercase tracking-wider font-bold shadow-inner ${item.badgeClass}`}
                  >
                    {item.tag}
                  </span>
                </div>

                <div className="space-y-3">
                  {/* Cleaned up: Removed italic from card headers */}
                  <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight uppercase flex items-center gap-2">
                    {item.title}
                    <ArrowUpRight
                      size={16}
                      className="opacity-0 -translate-y-1 translate-x-1 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all duration-300 text-emerald-400"
                    />
                  </h2>
                  <p className="text-xs text-zinc-400 leading-relaxed max-w-md">
                    {item.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>

          {/* Secondary Cards: Blogs and About Us */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {secondaryBento.map((item, index) => (
              <Link
                key={index}
                to={item.to}
                className="group flex items-center justify-between p-5 rounded-xl border border-zinc-900/60 bg-zinc-950/20 hover:bg-zinc-900/20 hover:border-zinc-800 transition-all duration-300 backdrop-blur-sm"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className="p-2 bg-zinc-900/40 border border-zinc-900 rounded-lg group-hover:border-zinc-800 transition-colors flex-shrink-0">
                    {item.icon}
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-xs font-bold text-zinc-300 group-hover:text-white transition-colors uppercase tracking-wide">
                      {item.title}
                    </h3>
                    <p className="text-[11px] text-zinc-500 line-clamp-1 mt-0.5 max-w-sm">
                      {item.description}
                    </p>
                  </div>
                </div>
                <span className="text-[9px] font-mono border border-zinc-900 px-2 py-0.5 rounded text-zinc-500 uppercase tracking-wider bg-zinc-950/40 flex-shrink-0 ml-2">
                  {item.tag}
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-4 border-t border-zinc-900/40">
          <Link
            to="/about"
            className="w-full sm:w-auto px-10 py-3.5 rounded-xl bg-zinc-100 text-zinc-950 font-black text-xs uppercase tracking-wider hover:bg-emerald-400 hover:text-zinc-950 transition-all duration-200 active:scale-95 text-center shadow-lg shadow-black/40"
          >
            Explore Platform
          </Link>

          <a
            href="https://razorsports-backend.vercel.app/razorbill.apk"
            className="group flex items-center justify-center gap-2.5 font-mono text-[10px] text-zinc-500 hover:text-zinc-300 transition-colors uppercase tracking-widest w-full sm:w-auto"
          >
            <Download
              size={13}
              className="group-hover:animate-bounce text-emerald-400"
            />
            Download Android App
          </a>
        </div>
      </div>
    </section>
  );
}
