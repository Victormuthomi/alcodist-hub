import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Trash2, Star } from "lucide-react";

const Watchlist = () => {
  const [items, setItems] = useState([]);
  const navigate = useNavigate();

  // Load items from local storage
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("watchlist") || "[]");
    setItems(saved);
  }, []);

  const removeFromWatchlist = (id) => {
    const updatedList = items.filter((item) => item.id !== id);
    setItems(updatedList);
    localStorage.setItem("watchlist", JSON.stringify(updatedList));
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 p-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto flex items-center justify-between mb-12">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="bg-zinc-900 p-3 rounded-full hover:bg-emerald-500 transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-3xl font-black uppercase tracking-tighter">
            My Watchlist
          </h1>
        </div>
        <p className="text-xs font-bold text-zinc-500 tracking-widest uppercase">
          {items.length} Titles Saved
        </p>
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {items.map((item) => (
          <div key={item.id} className="group relative">
            <Link
              to={`/movies/home/${item.media_type}/${item.id}`}
              className="block"
            >
              <div className="aspect-[2/3] bg-zinc-900 rounded-2xl overflow-hidden mb-3 border border-zinc-800 group-hover:border-emerald-500 transition-all shadow-xl">
                <img
                  src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  alt={item.title}
                />
              </div>
            </Link>

            {/* Remove Button */}
            <button
              onClick={() => removeFromWatchlist(item.id)}
              className="absolute top-2 right-2 z-20 p-2 bg-red-500/80 backdrop-blur rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
            >
              <Trash2 size={14} className="text-white" />
            </button>

            <h3 className="text-[11px] font-bold uppercase tracking-tight text-zinc-300 truncate">
              {item.title}
            </h3>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {items.length === 0 && (
        <div className="max-w-7xl mx-auto py-20 text-center">
          <p className="text-zinc-600 font-mono text-xs uppercase tracking-widest">
            Your watchlist is currently empty.
          </p>
          <Link
            to="/movies/home"
            className="mt-6 inline-block text-emerald-500 text-xs font-bold uppercase hover:underline"
          >
            Browse titles
          </Link>
        </div>
      )}
    </div>
  );
};

export default Watchlist;
