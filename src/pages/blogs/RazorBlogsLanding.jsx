import React, { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { BLOG_URL } from "../../api";
import { ChevronDown } from "lucide-react";

const CACHE_KEY = "alcodist_blog_cache";
const BATCH_LIMIT = 10; // Matches your Go backend's pagination size

const Skeleton = () => (
  <div className="animate-pulse w-full bg-zinc-900 rounded-2xl h-64 border border-zinc-800" />
);

const BlogCard = ({ post }) => {
  const readers = post.blog.readers || 0;
  const author = post.authorName || "Guest";
  const category = post.blog.category || "General";

  return (
    <Link
      to={`/blogs/${post.blog.id}`}
      className="group flex flex-col bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden hover:border-emerald-500 transition-all"
    >
      <div className="h-48 w-full bg-zinc-950 flex items-center justify-center overflow-hidden">
        <img
          src={post.blog.image_url}
          alt={post.blog.title}
          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>

      <div className="p-6 flex flex-col flex-grow">
        <span className="text-emerald-500 text-[10px] font-bold uppercase tracking-widest mb-2">
          {category}
        </span>
        <h4 className="text-xl font-bold mb-4 leading-tight group-hover:text-emerald-400">
          {post.blog.title}
        </h4>

        <div className="mt-auto pt-4 border-t border-zinc-800 flex justify-between items-center text-[10px] uppercase font-black tracking-widest text-zinc-500">
          <span>{author}</span>
          <span>{readers} Readers</span>
        </div>
      </div>
    </Link>
  );
};

export default function AlcodistBlogs() {
  const [posts, setPosts] = useState(
    () => JSON.parse(localStorage.getItem(CACHE_KEY)) || []
  );
  const [loading, setLoading] = useState(posts.length === 0);
  const [visibleCount, setVisibleCount] = useState(4);
  const [hasMoreServer, setHasMoreServer] = useState(true); // Tracks if DB has more records

  // Initial Fetch: Load Page 1 from Go backend (?limit=10&skip=0)
  useEffect(() => {
    fetch(`${BLOG_URL}?limit=${BATCH_LIMIT}&skip=0`)
      .then((res) => res.json())
      .then((data) => {
        setPosts(data);
        localStorage.setItem(CACHE_KEY, JSON.stringify(data));

        // If backend returns less than our limit, we've exhausted the database
        if (data.length < BATCH_LIMIT) {
          setHasMoreServer(false);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  // Handle Paginated "View More" operations
  const handleViewMore = () => {
    const nextVisible = visibleCount + 4;
    setVisibleCount(nextVisible);

    // If the UI needs more records than currently stored in state,
    // AND the server still has data left, fetch the next batch!
    if (nextVisible >= list.length && hasMoreServer) {
      const nextSkip = posts.length; // Offset equals current total items loaded

      fetch(`${BLOG_URL}?limit=${BATCH_LIMIT}&skip=${nextSkip}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.length < BATCH_LIMIT) {
            setHasMoreServer(false);
          }

          setPosts((prev) => {
            const updated = [...prev, ...data];
            localStorage.setItem(CACHE_KEY, JSON.stringify(updated));
            return updated;
          });
        })
        .catch((err) => console.error(err));
    }
  };

  const { featured, list } = useMemo(() => {
    if (!posts.length) return { featured: null, list: [] };

    const sortedByDate = [...posts].sort(
      (a, b) => new Date(b.blog.created_at) - new Date(a.blog.created_at)
    );
    const latest = sortedByDate[0];
    const popular = sortedByDate
      .slice(1)
      .sort((a, b) => (b.blog.readers || 0) - (a.blog.readers || 0));

    return { featured: latest, list: popular };
  }, [posts]);

  const getSynopsis = (content) => {
    if (!content) return "";
    return content.replace(/[*#_`]/g, "").substring(0, 150) + "...";
  };

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <nav className="max-w-5xl mx-auto px-6 py-6 flex gap-6 justify-end items-center border-b border-zinc-900">
        <Link
          to="/authors/register"
          className="text-[10px] font-bold uppercase text-zinc-500 hover:text-emerald-500"
        >
          Register
        </Link>
        <Link
          to="/authors/login"
          className="text-[10px] font-bold uppercase text-zinc-500 hover:text-emerald-500"
        >
          Login
        </Link>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-12">
        <header className="mb-16">
          <h1 className="text-6xl font-black tracking-tighter mb-4">
            Alcodist Blogs
          </h1>
          <p className="text-zinc-500 text-lg max-w-lg">
            This is a community blog site where people can share blogs, stories,
            and ideas.
          </p>
        </header>

        {/* Featured Hero Banner */}
        <section className="mb-20">
          {loading ? (
            <Skeleton />
          ) : featured ? (
            <Link
              to={`/blogs/${featured.blog.id}`}
              className="block bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden"
            >
              <div className="w-full bg-zinc-950 flex items-center justify-center p-2">
                <img
                  src={featured.blog.image_url}
                  alt={featured.blog.title}
                  className="w-full h-auto object-contain"
                />
              </div>
              <div className="p-8">
                <h2 className="text-3xl font-bold mb-4">
                  {featured.blog.title}
                </h2>
                <p className="text-zinc-400 mb-6 text-sm leading-relaxed">
                  {getSynopsis(featured.blog.content)}
                </p>
                <div className="flex gap-4 text-[10px] text-zinc-500 font-bold uppercase tracking-widest border-t border-zinc-800 pt-6">
                  <span>{featured.authorName}</span>
                  <span>
                    {new Date(featured.blog.created_at).toLocaleDateString()}
                  </span>
                  <span>{featured.blog.readers || 0} Readers</span>
                </div>
              </div>
            </Link>
          ) : null}
        </section>

        {/* Popular & Latest Grid */}
        <section>
          <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-600 mb-8">
            Popular & Latest
          </h3>
          <div className="grid md:grid-cols-2 gap-8">
            {loading
              ? [1, 2, 3, 4].map((i) => <Skeleton key={i} />)
              : list
                  .slice(0, visibleCount)
                  .map((post) => <BlogCard key={post.blog.id} post={post} />)}
          </div>

          {/* Render button if local UI has hidden cards OR if server has more batches */}
          {(visibleCount < list.length || hasMoreServer) && (
            <button
              onClick={handleViewMore}
              className="mt-12 flex items-center gap-2 text-emerald-500 text-xs font-bold uppercase tracking-widest transition-colors hover:text-emerald-400"
            >
              View More <ChevronDown size={14} />
            </button>
          )}
        </section>
      </div>
    </main>
  );
}
