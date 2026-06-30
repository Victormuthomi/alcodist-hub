import React from "react";
import Hero from "../components/Hero";
import { AiOutlineLink, AiOutlineMail, AiFillGithub } from "react-icons/ai";

export default function HomePage() {
  return (
    <div className="w-full min-h-screen flex flex-col bg-zinc-950 text-zinc-100 selection:bg-emerald-500 selection:text-black">
      <main className="flex-grow flex flex-col items-center justify-center py-20 px-6">
        <Hero />

        {/* Personal Connection */}
        <section className="w-full max-w-lg mt-24 text-center">
          <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-6">
            Designed & Architected by Alcodist
          </h2>

          <p className="text-zinc-300 leading-relaxed text-md mb-8">
            This platform is an open-source playground—built for performance,
            designed for clarity, and free for everyone. I'm Alcodist. If you
            connect with this work, feel free to explore my portfolio, check out
            my code, or reach out to collaborate.
          </p>

          <div className="flex flex-wrap justify-center gap-3">
            <a
              href="https://muthomivictor.vercel.app/"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 px-5 py-2.5 border border-zinc-800 rounded-lg hover:border-zinc-500 transition text-xs font-bold uppercase tracking-widest"
            >
              <AiOutlineLink /> Portfolio
            </a>
            <a
              href="https://github.com/Victormuthomi"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 px-5 py-2.5 border border-zinc-800 rounded-lg hover:border-zinc-500 transition text-xs font-bold uppercase tracking-widest"
            >
              <AiFillGithub /> GitHub
            </a>
            <a
              href="mailto:victor.muthomi.alcodist@gmail.com"
              className="flex items-center gap-2 px-5 py-2.5 border border-zinc-800 rounded-lg hover:border-emerald-500 hover:text-emerald-500 transition text-xs font-bold uppercase tracking-widest"
            >
              <AiOutlineMail /> Email Me
            </a>
          </div>
        </section>
      </main>

      <footer className="w-full py-8 text-center border-t border-zinc-900">
        <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest">
          © {new Date().getFullYear()} Alcodist • Open Source
        </p>
      </footer>
    </div>
  );
}
