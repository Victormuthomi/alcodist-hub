import React from "react";
import Results from "../components/Results";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const ResultsPage = () => {
  return (
    <div className="min-h-screen bg-obsidian-950 py-20 px-4 sm:px-12">
      {/* Top Breadcrumb */}
      <div className="max-w-7xl mx-auto mb-12">
        <Link
          to="/matches"
          className="inline-flex items-center gap-2 text-lab-slate hover:text-white transition-colors font-mono text-[10px] uppercase tracking-widest"
        >
          <ArrowLeft size={14} /> Back to Transmission
        </Link>
      </div>

      <div className="max-w-7xl mx-auto">
        <header className="mb-16 text-center lg:text-left space-y-4">
          <h1 className="text-5xl md:text-7xl font-black text-white italic uppercase tracking-tighter">
            ARCHIVE<span className="text-lab-emerald">.LOGS</span>
          </h1>
          <div className="h-1 w-24 bg-lab-emerald" />
        </header>

        {/* Reusing the Intelligent Shell */}
        <Results />
      </div>
    </div>
  );
};

export default ResultsPage;
