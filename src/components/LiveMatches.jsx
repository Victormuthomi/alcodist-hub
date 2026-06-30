import React, { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Activity, Tv, Play, Star } from "lucide-react";
import BASE_URL from "../api";

// 1. High-Density, Performant Match Card
const MatchCard = React.memo(({ match }) => {
  const homeTeam = match.teams?.home;
  const awayTeam = match.teams?.away;

  return (
    <div className="group relative bg-zinc-950 border border-zinc-800 rounded-xl p-5 transition-all duration-300 hover:border-zinc-700 hover:bg-zinc-900/50">
      {/* Live Status Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
          </span>
          <span className="font-mono text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
            Live Stream
          </span>
        </div>
        {match.popular && (
          <Star size={13} className="text-amber-400 fill-amber-400/20" />
        )}
      </div>

      {/* Versus Grid Layout */}
      <div className="grid grid-cols-7 items-center gap-2 mb-8">
        {/* Home Team */}
        <div className="col-span-3 flex flex-col items-center gap-3">
          <div className="h-16 w-16 rounded-xl bg-zinc-900 border border-zinc-800/80 p-2 flex items-center justify-center transition-transform duration-300 group-hover:scale-105 shadow-inner">
            {homeTeam?.badge ? (
              <img
                src={homeTeam.badge}
                alt={`${homeTeam.name || "Home"} crest`}
                className="max-w-full max-h-full object-contain"
                loading="lazy"
              />
            ) : (
              <div className="text-xs text-zinc-500 font-mono font-bold uppercase">
                {homeTeam?.name?.slice(0, 2) || "H"}
              </div>
            )}
          </div>
          <span className="text-xs font-bold text-zinc-200 uppercase text-center line-clamp-2 min-h-[2rem] px-1">
            {homeTeam?.name || "Home Team"}
          </span>
        </div>

        {/* Divider Text */}
        <div className="col-span-1 flex justify-center">
          <span className="font-mono text-[10px] text-zinc-600 font-bold tracking-widest">
            VS
          </span>
        </div>

        {/* Away Team */}
        <div className="col-span-3 flex flex-col items-center gap-3">
          <div className="h-16 w-16 rounded-xl bg-zinc-900 border border-zinc-800/80 p-2 flex items-center justify-center transition-transform duration-300 group-hover:scale-105 shadow-inner">
            {awayTeam?.badge ? (
              <img
                src={awayTeam.badge}
                alt={`${awayTeam.name || "Away"} crest`}
                className="max-w-full max-h-full object-contain"
                loading="lazy"
              />
            ) : (
              <div className="text-xs text-zinc-500 font-mono font-bold uppercase">
                {awayTeam?.name?.slice(0, 2) || "A"}
              </div>
            )}
          </div>
          <span className="text-xs font-bold text-zinc-200 uppercase text-center line-clamp-2 min-h-[2rem] px-1">
            {awayTeam?.name || "Away Team"}
          </span>
        </div>
      </div>

      {/* Call to Action Button */}
      <div className="pt-4 border-t border-zinc-800">
        <Link
          to={`/matches/${match.id}`}
          className="flex items-center justify-center gap-2 w-full py-3 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-200 font-mono text-[11px] uppercase tracking-wider hover:bg-emerald-500 hover:text-black hover:border-emerald-500 transition-all duration-200 font-bold"
        >
          <Play size={12} className="fill-current" /> Watch Live Stream
        </Link>
      </div>
    </div>
  );
});

MatchCard.displayName = "MatchCard";

// 2. Core Screen Stream Aggregator Component
const LiveMatches = () => {
  // --- 1. HYDRATE STATE IMMEDIATELY FROM LOCAL STORAGE ---
  const [matches, setMatches] = useState(() => {
    try {
      const cached = localStorage.getItem("razorbill_live_matches");
      return cached ? JSON.parse(cached) : [];
    } catch {
      return [];
    }
  });

  const hasCachedData = matches.length > 0;
  // If we have cached data, bypass the loading screen entirely
  const [loading, setLoading] = useState(!hasCachedData);
  const [isSyncing, setIsSyncing] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    const fetchMatches = async (isBackground = false) => {
      try {
        if (!isBackground) setLoading(true);
        setIsSyncing(true);

        const [liveRes, todayRes] = await Promise.all([
          fetch(`${BASE_URL}/api/matches/live/popular`),
          fetch(`${BASE_URL}/api/matches/today/popular`),
        ]);

        if (!liveRes.ok || !todayRes.ok) {
          throw new Error("Failed to synchronize active match lists.");
        }

        const liveData = await liveRes.json();
        const todayData = await todayRes.json();

        const safeLiveData = Array.isArray(liveData) ? liveData : [];
        const safeTodayData = Array.isArray(todayData) ? todayData : [];

        const badgeMap = {};
        safeTodayData.forEach((m) => {
          if (m?.teams?.home?.name && m?.teams?.home?.badge) {
            badgeMap[m.teams.home.name] = m.teams.home.badge;
          }
          if (m?.teams?.away?.name && m?.teams?.away?.badge) {
            badgeMap[m.teams.away.name] = m.teams.away.badge;
          }
        });

        const mergedMatches = safeLiveData.map((m) => {
          const homeName = m?.teams?.home?.name;
          const awayName = m?.teams?.away?.name;

          return {
            ...m,
            id: m.id || `live-${homeName}-${awayName}`,
            teams: {
              home: {
                ...(m?.teams?.home || {}),
                badge: badgeMap[homeName] || m?.teams?.home?.badge || "",
              },
              away: {
                ...(m?.teams?.away || {}),
                badge: badgeMap[awayName] || m?.teams?.away?.badge || "",
              },
            },
          };
        });

        if (mounted) {
          setMatches(mergedMatches);
          setError(null);
          // --- 2. UPDATE PERSISTENT CACHE SILENTLY ---
          localStorage.setItem(
            "razorbill_live_matches",
            JSON.stringify(mergedMatches)
          );
        }
      } catch (err) {
        if (mounted) {
          setError(err.message);
        }
      } finally {
        if (mounted) {
          setLoading(false);
          setIsSyncing(false);
        }
      }
    };

    // Trigger immediate sync on mount. Pass true if cached snapshots exist to avoid full page masking.
    fetchMatches(hasCachedData);

    // --- 3. AUTONOMOUS INTERVAL LOOP (Every 30 seconds) ---
    const interval = setInterval(() => {
      if (document.visibilityState === "visible") {
        fetchMatches(true);
      }
    }, 30000);

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, [hasCachedData]);

  const sortedMatches = useMemo(() => {
    return [...matches].sort((a, b) => {
      if (!!a.popular === !!b.popular) return 0;
      return a.popular ? -1 : 1;
    });
  }, [matches]);

  if (loading && matches.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-32 space-y-4">
        <Tv className="text-zinc-600 animate-pulse" size={32} />
        <p className="font-mono text-[11px] uppercase tracking-widest text-zinc-500">
          Loading live match feeds...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-2 py-6 space-y-8">
      {/* Feed Information Headers */}
      <div className="flex flex-col items-center text-center space-y-2 relative">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md border border-zinc-800 bg-zinc-950 text-zinc-400 text-[10px] font-mono uppercase tracking-wider">
          <Activity
            size={10}
            className={
              isSyncing ? "text-emerald-400 animate-spin" : "text-emerald-400"
            }
          />
          Active Transmissions
          {isSyncing && (
            <span className="text-[9px] text-zinc-500 normal-case ml-1 tracking-normal">
              (updating...)
            </span>
          )}
        </div>
        <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tight">
          Live Matches
        </h2>
      </div>

      {/* Error state safe alerts */}
      {error && (
        <div className="max-w-md mx-auto p-4 rounded-lg bg-zinc-950 border border-red-900/30 text-center">
          <p className="text-xs text-zinc-500 font-mono">
            Sync Error: {error}. Using local snapshots.
          </p>
        </div>
      )}

      {/* Main Grid Render State */}
      {sortedMatches.length === 0 ? (
        <div className="text-center py-24 border border-dashed border-zinc-800 rounded-xl bg-zinc-950/30">
          <p className="font-mono text-xs text-zinc-500 uppercase tracking-widest">
            No live matches are streaming right now
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedMatches.map((match) => (
            <MatchCard key={match.id} match={match} />
          ))}
        </div>
      )}
    </div>
  );
};

export default LiveMatches;
