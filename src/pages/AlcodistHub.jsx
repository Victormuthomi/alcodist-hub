import React from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Github,
  Database,
  Shield,
  Zap,
  BookOpen,
  Code,
} from "lucide-react";

const Principle = ({ icon: Icon, title, body }) => (
  <div className="p-6 border border-zinc-900 bg-zinc-900/20 rounded-xl hover:border-emerald-500/30 transition-all">
    <Icon className="text-emerald-500 mb-4" size={20} />
    <h3 className="font-mono text-[10px] uppercase tracking-widest text-zinc-100 mb-2">
      {title}
    </h3>
    <p className="text-[11px] text-zinc-500 uppercase leading-relaxed">
      {body}
    </p>
  </div>
);

export default function AlcodistHub() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 p-6 md:p-12">
      {/* --- NAV --- */}
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-[10px] uppercase tracking-widest text-zinc-500 hover:text-emerald-400 mb-12"
      >
        <ArrowLeft size={12} /> Back to Terminal
      </Link>

      <div className="max-w-4xl mx-auto">
        {/* --- HEADER --- */}
        <div className="mb-20">
          <h1 className="text-4xl font-black uppercase tracking-tighter mb-4">
            Alcodist <span className="text-zinc-700">Hub</span>
          </h1>
          <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-emerald-500">
            System Status: Fully Open Source // v1.0.0
          </p>
        </div>

        {/* --- CORE PRINCIPLES --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-20">
          <Principle
            icon={Database}
            title="Radical Generosity"
            body="Zero paywalls. Zero subscriptions. Software built to serve the many."
          />
          <Principle
            icon={Code}
            title="Engineering Pride"
            body="Clean architecture, defensive testing, and high-fidelity delivery."
          />
          <Principle
            icon={Shield}
            title="Privacy Sovereignty"
            body="No data mining. No ads. Just the pure stream."
          />
          <Principle
            icon={Zap}
            title="Evolution"
            body="A living repository that iterates with the community."
          />
        </div>

        {/* --- CREDITS --- */}
        <div className="border-t border-zinc-900 pt-12 flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-widest mb-1">
              Muthomi Victor
            </h4>
            <p className="text-[10px] text-zinc-500 uppercase tracking-widest">
              Systems Architect
            </p>
          </div>

          <div className="flex gap-4">
            <a
              href="https://github.com/Victormuthomi"
              className="text-[10px] uppercase tracking-widest flex items-center gap-2 hover:text-emerald-400"
            >
              <Github size={14} /> Source
            </a>
            <a
              href="https://muthomivictor.vercel.app/"
              className="text-[10px] uppercase tracking-widest flex items-center gap-2 hover:text-emerald-400"
            >
              <BookOpen size={14} /> Portfolio
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
