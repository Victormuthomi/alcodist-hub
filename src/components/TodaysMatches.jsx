import React, {
  useEffect,
  useState,
  useMemo,
  useCallback,
  useRef,
} from "react";
import { Link } from "react-router-dom";
import {
  Trophy,
  Bell,
  BellRing,
  Play,
  Search,
  Activity,
  Clock,
} from "lucide-react";
import notifySound from "../assets/notify.mp3";
import BASE_URL from "../api";

const TodayMatches = () => {
  const [matchesBySport, setMatchesBySport] = useState({});
  const [sportsMap, setSportsMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [notified, setNotified] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("notifiedMatches") || "[]");
    } catch {
      return [];
    }
  });

  const notifyTimers = useRef({});

  useEffect(() => {
    let mounted = true;
    const fetchData = async () => {
      try {
        setLoading(true);
        // Retained precise network queries matching your backend configuration
        const [sportsRes, matchesRes] = await Promise.all([
          fetch(`${BASE_URL}/api/sports`),
          fetch(`${BASE_URL}/api/matches/today/popular`),
        ]);

        if (!sportsRes.ok || !matchesRes.ok)
          throw new Error("Failed to synchronize daily match schedule.");

        const sportsData = await sportsRes.json();
        const todayMatches = await matchesRes.json();

        if (!mounted) return;

        // Verify array safety structures before executing mapping tasks
        const safeSportsData = Array.isArray(sportsData) ? sportsData : [];
        const safeTodayMatches = Array.isArray(todayMatches)
          ? todayMatches
          : [];

        const sMap = {};
        safeSportsData.forEach((s) => (sMap[s.id] = s.name));
        setSportsMap(sMap);

        // Grouping and Sorting by Chronological Order (Earliest First)
        const grouped = safeTodayMatches.reduce((acc, m) => {
          const cat = m.category || "other";
          if (!acc[cat]) acc[cat] = [];
          acc[cat].push(m);
          return acc;
        }, {});

        // Sort items inside each sport category accurately by kickoff timestamps
        Object.keys(grouped).forEach((cat) => {
          grouped[cat].sort((a, b) => new Date(a.date) - new Date(b.date));
        });

        setMatchesBySport(grouped);
      } catch (err) {
        if (mounted) setError(err.message);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchData();
    return () => {
      mounted = false;
      Object.values(notifyTimers.current).forEach(clearTimeout);
    };
  }, []);

  const handleNotify = useCallback(
    (matchId, matchTime) => {
      if (notified.includes(matchId)) return;
      const updated = [...notified, matchId];
      setNotified(updated);
      localStorage.setItem("notifiedMatches", JSON.stringify(updated));

      const notifyAt = new Date(matchTime).getTime() - 10 * 60 * 1000;
      const delay = notifyAt - Date.now();

      notifyTimers.current[matchId] = setTimeout(
        () => {
          new Audio(notifySound).play().catch(() => {});
        },
        delay > 0 ? delay : 1000
      );
    },
    [notified]
  );

  const filteredEntries = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return Object.entries(matchesBySport)
      .map(([id, matches]) => [
        id,
        matches.filter(
          (m) =>
            m.teams?.home?.name?.toLowerCase().includes(term) ||
            m.teams?.away?.name?.toLowerCase().includes(term)
        ),
      ])
      .filter(([_, matches]) => matches.length > 0)
      .sort(([a], [b]) => {
        const nameA = sportsMap[a] || "";
        return nameA.toLowerCase() === "football" ? -1 : 1;
      });
  }, [searchTerm, matchesBySport, sportsMap]);

  // Premium, Standardized Loading State
  if (loading)
    return (
      <div className="flex flex-col items-center justify-center py-32 space-y-4">
        <Clock className="text-zinc-600 animate-pulse" size={32} />
        <p className="font-mono text-[11px] uppercase tracking-widest text-zinc-500">
          Loading today's schedule...
        </p>
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto px-2 py-6 space-y-10">
      {/* Search Header Dashboard Area */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-zinc-800 pb-8">
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 text-zinc-500 font-mono text-[11px] uppercase tracking-wider">
            <Clock size={12} className="text-emerald-400" /> Live System Time:{" "}
            <span className="text-zinc-300">
              {new Date().toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tight">
            Match Schedule
          </h2>
        </div>

        {/* Minimalist Search Box */}
        <div className="relative w-full md:w-80">
          <Search
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-600 focus-within:text-zinc-400 transition-colors"
            size={16}
          />
          <input
            type="text"
            placeholder="Search by team name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg py-3 pl-10 pr-4 text-xs font-mono text-white placeholder:text-zinc-600 focus:outline-none focus:border-zinc-700 transition-colors"
          />
        </div>
      </div>

      {/* Network Connectivity Issues Handler */}
      {error && (
        <div className="max-w-md mx-auto p-4 rounded-lg bg-zinc-950 border border-red-900/30 text-center">
          <p className="text-xs text-zinc-500 font-mono">
            Sync Error: {error}. Retrying interface updates...
          </p>
        </div>
      )}

      {/* Structured Category Feeds */}
      {filteredEntries.length === 0 ? (
        <div className="text-center py-24 border border-dashed border-zinc-800 rounded-xl bg-zinc-950/30">
          <p className="font-mono text-xs text-zinc-500 uppercase tracking-widest">
            No matching events found on today's program
          </p>
        </div>
      ) : (
        filteredEntries.map(([sportId, matches]) => (
          <section key={sportId} className="space-y-6">
            {/* Minimalist Section Separator Header */}
            <div className="flex items-center gap-4">
              <span className="flex-none bg-zinc-900 border border-zinc-800 px-3 py-1 rounded-md font-mono text-[11px] text-zinc-300 font-bold uppercase tracking-wider">
                {sportsMap[sportId] || "Other Sports"}
              </span>
              <div className="h-px flex-grow bg-zinc-900" />
            </div>

            {/* Subgrid Card Core Element Container */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {matches.map((match) => (
                <div
                  key={match.id}
                  className="group relative bg-zinc-950 border border-zinc-800 rounded-xl p-5 transition-all duration-300 hover:border-zinc-700 hover:bg-zinc-900/50"
                >
                  {/* Card Status / Configuration Header */}
                  <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-1.5 text-zinc-400">
                      <div className="h-1.5 w-1.5 rounded-full bg-zinc-700 group-hover:bg-emerald-400 transition-colors duration-300" />
                      <span className="font-mono text-xs font-bold text-zinc-400 tracking-tight">
                        {new Date(match.date).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>

                    {/* Schedule Reminder Button Toggle */}
                    <button
                      onClick={() => handleNotify(match.id, match.date)}
                      className={`p-2 rounded-lg border transition-all duration-200 ${
                        notified.includes(match.id)
                          ? "bg-emerald-950/40 border-emerald-900/50 text-emerald-400"
                          : "bg-zinc-900 border-zinc-800 text-zinc-500 hover:text-zinc-200 hover:border-zinc-700"
                      }`}
                      title={
                        notified.includes(match.id)
                          ? "Reminder Armed"
                          : "Set Reminder"
                      }
                    >
                      {notified.includes(match.id) ? (
                        <BellRing size={13} />
                      ) : (
                        <Bell size={13} />
                      )}
                    </button>
                  </div>

                  {/* Team Layout Information Grid */}
                  <div className="grid grid-cols-7 items-center gap-2 mb-8">
                    {/* Home Side Asset Block */}
                    <div className="col-span-3 flex flex-col items-center gap-3">
                      {/* Soft Square Shield Housing Layout protects rectangular logos */}
                      <div className="h-14 w-14 rounded-xl bg-zinc-900 border border-zinc-800/80 p-2 flex items-center justify-center transition-transform duration-300 group-hover:scale-105 shadow-inner">
                        {match.teams?.home?.badge ? (
                          <img
                            src={match.teams.home.badge}
                            alt=""
                            className="max-w-full max-h-full object-contain"
                          />
                        ) : (
                          <div className="text-xs text-zinc-600 font-mono font-bold uppercase">
                            {match.teams?.home?.name?.slice(0, 2) || "H"}
                          </div>
                        )}
                      </div>
                      <span className="text-xs font-bold text-zinc-200 uppercase text-center line-clamp-2 min-h-[2rem] px-1">
                        {match.teams?.home?.name || "Home Team"}
                      </span>
                    </div>

                    {/* Middle Versus Indicator text split */}
                    <div className="col-span-1 flex justify-center">
                      <span className="font-mono text-[10px] text-zinc-600 font-bold">
                        VS
                      </span>
                    </div>

                    {/* Away Side Asset Block */}
                    <div className="col-span-3 flex flex-col items-center gap-3">
                      {/* Soft Square Shield Housing Layout protects rectangular logos */}
                      <div className="h-14 w-14 rounded-xl bg-zinc-900 border border-zinc-800/80 p-2 flex items-center justify-center transition-transform duration-300 group-hover:scale-105 shadow-inner">
                        {match.teams?.away?.badge ? (
                          <img
                            src={match.teams.away.badge}
                            alt=""
                            className="max-w-full max-h-full object-contain"
                          />
                        ) : (
                          <div className="text-xs text-zinc-600 font-mono font-bold uppercase">
                            {match.teams?.away?.name?.slice(0, 2) || "A"}
                          </div>
                        )}
                      </div>
                      <span className="text-xs font-bold text-zinc-200 uppercase text-center line-clamp-2 min-h-[2rem] px-1">
                        {match.teams?.away?.name || "Away Team"}
                      </span>
                    </div>
                  </div>

                  {/* Operational Footer Action Layout */}
                  <div className="pt-4 border-t border-zinc-800">
                    {match.sources?.length ? (
                      <Link
                        to={`/matches/${match.id}`}
                        className="flex items-center justify-center gap-2 w-full py-3 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-200 font-mono text-[11px] uppercase tracking-wider hover:bg-emerald-500 hover:text-black hover:border-emerald-500 transition-all duration-200 font-bold"
                      >
                        <Play size={11} className="fill-current" /> Watch
                        Broadcast
                      </Link>
                    ) : (
                      <div className="text-center py-2.5 text-[10px] font-mono text-zinc-600 uppercase tracking-widest bg-zinc-950 rounded-md border border-zinc-900/60">
                        Awaiting Stream Link
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))
      )}
    </div>
  );
};

export default TodayMatches;
