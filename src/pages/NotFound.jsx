import React from "react";
import { Link } from "react-router-dom";
import pen from "../assets/pen.png";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center text-center p-6 text-white">
      {/* Visual */}
      <img src={pen} alt="Lost page" className="w-48 mb-8 opacity-80" />

      {/* Heading */}
      <h1 className="text-5xl font-black tracking-tighter mb-4">
        404 <span className="text-zinc-600">/</span> Page Lost
      </h1>

      {/* Narrative Text */}
      <p className="text-zinc-400 max-w-sm mb-8 text-sm leading-relaxed">
        It seems this page has gone missing. Much like a draft forgotten in a
        notebook, we can't find what you're looking for. It may have been moved,
        deleted, or perhaps it was never written.
      </p>

      {/* Action */}
      <Link
        to="/"
        className="bg-emerald-500 text-zinc-950 px-8 py-3 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-emerald-400 transition"
      >
        Return Home
      </Link>
    </div>
  );
}
