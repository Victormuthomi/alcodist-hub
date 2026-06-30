import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useOutletContext } from "react-router-dom";
import { Search, Play, Star, Heart } from "lucide-react";

const TMDB_TOKEN = import.meta.env.VITE_TMDB_TOKEN;
const api = axios.create({
  baseURL: "https://api.themoviedb.org/3",
  headers: { Authorization: `Bearer ${TMDB_TOKEN}` },
});

const CATEGORIES = [
  { name: "Action", movie: 28, tv: 10759 },
  { name: "Sci-Fi", movie: 878, tv: 10765 },
  { name: "Horror", movie: 27, tv: 9648 },
  { name: "Comedy", movie: 35, tv: 35 },
  { name: "Drama", movie: 18, tv: 18 },
];

const MoviesHome = () => {
  // Extract real-time sidebar state slice via parent layout tunnel
  const { isSidebarHovered } = useOutletContext() || {};

  const [items, setItems] = useState([]);
  const [featured, setFeatured] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("movie");
  const [activeCategory, setActiveCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  const [watchlist, setWatchlist] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("watchlist") || "[]");
    } catch {
      return [];
    }
  });

  const handleToggleWatchlist = (item) => {
    let currentList = [...watchlist];
    const exists = currentList.find((i) => i.id === item.id);

    if (exists) {
      currentList = currentList.filter((i) => i.id !== item.id);
    } else {
      currentList.push({
        id: item.id,
        title: item.title || item.name,
        poster_path: item.poster_path,
        media_type: item.media_type || filter,
      });
    }

    localStorage.setItem("watchlist", JSON.stringify(currentList));
    setWatchlist(currentList);
  };

  useEffect(() => {
    let mounted = true;

    const fetchData = async () => {
      const isSearch = searchQuery.trim().length > 0;
      const cacheKey = `razorbill_cinema_${filter}_${
        activeCategory?.name || "all"
      }`;

      if (!isSearch) {
        try {
          const cached = localStorage.getItem(cacheKey);
          if (cached) {
            const { cachedItems, cachedFeatured } = JSON.parse(cached);
            setItems(cachedItems);
            setFeatured(cachedFeatured);
            setLoading(false);
          } else {
            setLoading(true);
          }
        } catch {
          setLoading(true);
        }
      } else {
        setLoading(true);
      }

      try {
        const endpoint = isSearch ? "/search/multi" : `/discover/${filter}`;
        const genreId = activeCategory
          ? filter === "movie"
            ? activeCategory.movie
            : activeCategory.tv
          : null;

        const params = isSearch
          ? { query: searchQuery }
          : { with_genres: genreId, sort_by: "popularity.desc" };

        const res = await api.get(endpoint, { params });
        const results = (res.data.results || []).filter(
          (i) => i.media_type !== "person"
        );

        if (mounted) {
          setItems(results);

          if (!isSearch) {
            const nextFeatured = results[0] || null;
            setFeatured(nextFeatured);

            localStorage.setItem(
              cacheKey,
              JSON.stringify({
                cachedItems: results,
                cachedFeatured: nextFeatured,
              })
            );
          }
        }
      } catch (err) {
        console.error("Cinema Engine Fetch Error:", err);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      mounted = false;
    };
  }, [filter, activeCategory, searchQuery]);

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    setActiveCategory(null);
    setSearchQuery("");
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      {/* --- CONTROL BAR (REFACTORED: SNAP TO top-0 AND RAISE INDICES WHEN SIDEBAR IS UNLOCKED) --- */}
      <div
        className={`sticky bg-zinc-950 border-b border-zinc-900 p-4 transition-all duration-300 ease-in-out ${
          isSidebarHovered
            ? "top-0 z-50 shadow-xl shadow-black/40"
            : "top-16 z-30"
        }`}
      >
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-3">
          <form
            onSubmit={(e) => e.preventDefault()}
            className="flex flex-1 gap-2"
          >
            <input
              type="text"
              placeholder="SEARCH TITLES..."
              className="flex-1 bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2.5 md:py-3 text-[10px] font-mono tracking-widest focus:border-emerald-500 outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>

          <div className="flex flex-row gap-2 w-full md:w-auto justify-between md:justify-start">
            <Link
              to="/movies/watchlist"
              className="flex flex-1 md:flex-initial items-center justify-center gap-1.5 px-3 py-2.5 md:px-6 md:py-3 rounded-lg text-[10px] font-bold uppercase tracking-widest bg-zinc-900 hover:bg-zinc-800 transition-colors border border-zinc-800/50 whitespace-nowrap"
            >
              <Heart
                size={11}
                className="text-emerald-500 fill-emerald-500/10"
              />{" "}
              My List ({watchlist.length})
            </Link>

            {["movie", "tv"].map((t) => (
              <button
                key={t}
                onClick={() => handleFilterChange(t)}
                className={`flex-1 md:flex-initial text-center px-3 py-2.5 md:px-6 md:py-3 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all whitespace-nowrap ${
                  filter === t
                    ? "bg-emerald-500 text-zinc-950 font-black"
                    : "bg-zinc-900 hover:bg-zinc-800 text-zinc-400"
                }`}
              >
                {t === "movie" ? "Movies" : "TV Series"}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* --- LOADING INDICATOR SHIELD --- */}
      {loading && items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-48 space-y-3">
          <div className="h-5 w-5 border-2 border-t-transparent border-emerald-500 rounded-full animate-spin" />
          <p className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest">
            Syncing sector feeds...
          </p>
        </div>
      ) : (
        <>
          {/* --- VISUAL HERO --- */}
          {!searchQuery && featured && (
            <div className="relative w-full aspect-[16/9] mb-12 border-b border-zinc-900 overflow-hidden bg-zinc-950">
              <img
                src={`https://image.tmdb.org/t/p/original${featured.backdrop_path}`}
                className="w-full h-full object-cover opacity-80"
                alt={featured.title || featured.name}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r from-zinc-950/60 via-transparent to-transparent hidden md:block" />

              <div className="absolute bottom-4 md:bottom-12 left-4 md:left-12 max-w-2xl right-4 md:right-auto">
                <h1 className="text-xl sm:text-3xl md:text-6xl font-black uppercase tracking-tighter mb-2 md:mb-4 text-white drop-shadow">
                  {featured.title || featured.name}
                </h1>
                <p className="text-zinc-400 text-[11px] md:text-sm mb-4 md:mb-6 line-clamp-2 max-w-lg font-normal leading-relaxed hidden sm:block">
                  {featured.overview}
                </p>
                <Link
                  to={`/movies/home/${featured.media_type || filter}/${
                    featured.id
                  }`}
                  className="inline-flex items-center gap-2 bg-white text-zinc-950 px-5 py-2.5 md:px-8 md:py-4 rounded-lg font-black text-[10px] uppercase tracking-widest hover:bg-emerald-400 transition-colors shadow-lg"
                >
                  Initialize Stream <Play size={11} fill="currentColor" />
                </Link>
              </div>
            </div>
          )}

          {/* --- CATEGORY FILTER --- */}
          {!searchQuery && (
            <div className="max-w-7xl mx-auto px-4 mb-8 flex gap-2 overflow-x-auto pb-2 scrollbar-none">
              <button
                onClick={() => setActiveCategory(null)}
                className={`px-4 py-2 rounded-full text-[9px] font-bold uppercase tracking-widest border transition-colors whitespace-nowrap ${
                  !activeCategory
                    ? "bg-emerald-500 border-emerald-500 text-zinc-950"
                    : "border-zinc-800 text-zinc-400 hover:border-zinc-700"
                }`}
              >
                All Transmissions
              </button>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.name}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 rounded-full text-[9px] font-bold uppercase tracking-widest border transition-colors whitespace-nowrap ${
                    activeCategory?.name === cat.name
                      ? "bg-emerald-500 border-emerald-500 text-zinc-950"
                      : "border-zinc-800 text-zinc-400 hover:border-zinc-600"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          )}

          {/* --- VISUAL GRID --- */}
          <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 pb-20">
            {items.map((item) => {
              const isFavorite = watchlist.some((w) => w.id === item.id);
              return (
                <Link
                  key={item.id}
                  to={`/movies/home/${item.media_type || filter}/${item.id}`}
                  className="group relative flex flex-col"
                >
                  <div className="relative aspect-[2/3] bg-zinc-900 rounded-xl overflow-hidden mb-3 border border-zinc-800/80 group-hover:border-emerald-500/80 transition-all duration-300 shadow-xl">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleToggleWatchlist(item);
                      }}
                      className="absolute top-2 left-2 z-20 p-2 rounded-lg bg-zinc-950/80 backdrop-blur border border-zinc-800/60 hover:bg-emerald-500 hover:text-zinc-950 transition-colors"
                    >
                      <Heart
                        size={12}
                        className={
                          isFavorite
                            ? "fill-emerald-500 text-emerald-500 group-hover:text-zinc-950"
                            : "text-zinc-400"
                        }
                      />
                    </button>

                    {item.poster_path ? (
                      <img
                        src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
                        className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                        alt={item.title || item.name}
                        loading="lazy"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-[9px] text-zinc-600 font-mono tracking-wider">
                        NO ASSET SNAPSHOT
                      </div>
                    )}

                    <div className="absolute top-2 right-2 bg-zinc-950/80 backdrop-blur border border-zinc-800/60 px-2 py-1 rounded text-[9px] font-mono font-bold text-zinc-300 flex items-center gap-1">
                      <Star
                        size={10}
                        className="text-amber-400 fill-amber-400/20"
                      />
                      {item.vote_average ? item.vote_average.toFixed(1) : "0.0"}
                    </div>
                  </div>
                  <h3 className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 group-hover:text-emerald-400 transition-colors truncate px-1">
                    {item.title || item.name}
                  </h3>
                </Link>
              );
            })}

            {items.length === 0 && (
              <div className="col-span-full py-24 text-center font-mono text-[11px] text-zinc-600 uppercase tracking-widest border border-dashed border-zinc-900 rounded-xl">
                No assets matched the active segment filters.
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default MoviesHome;
