import React, { useEffect, useState, useMemo } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { BLOG_URL, COMMENTS_URL } from "../api";
import { ArrowLeft, MessageSquare, LogIn, ArrowUpRight } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function BlogDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [allBlogs, setAllBlogs] = useState([]);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newComment, setNewComment] = useState("");
  const [username, setUsername] = useState("");

  const fetchData = async () => {
    try {
      const [blogRes, allRes, commentRes] = await Promise.all([
        fetch(`${BLOG_URL}/${id}`),
        fetch(BLOG_URL),
        fetch(`${COMMENTS_URL}/${id}`),
      ]);

      if (!blogRes.ok) throw new Error("Could not load post.");

      const blogData = await blogRes.json();
      const allData = await allRes.json();
      const commentData = await commentRes.json();

      setBlog(blogData);
      setAllBlogs(allData);
      setComments(Array.isArray(commentData) ? commentData : []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    window.scrollTo(0, 0);
  }, [id]);

  const relatedPosts = useMemo(() => {
    return allBlogs.filter((p) => p.blog.id !== id).slice(0, 3);
  }, [allBlogs, id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || !username.trim()) return;
    try {
      const res = await fetch(COMMENTS_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ blog_id: id, content: newComment, username }),
      });
      if (res.ok) {
        setNewComment("");
        setUsername("");
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-emerald-500 font-mono">
        Loading...
      </div>
    );
  if (error)
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-zinc-500">
        {error}
      </div>
    );

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      {/* Header aligned to content width */}
      <header className="border-b border-zinc-800 bg-zinc-950 sticky top-0 z-50 max-w-5xl mx-auto px-6">
        <nav className="py-5 flex justify-between items-center">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-zinc-400 hover:text-emerald-500 transition"
          >
            <ArrowLeft size={12} /> Back
          </button>
          <Link
            to="/authors/login"
            className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-emerald-500 hover:text-white transition"
          >
            <LogIn size={12} /> Login
          </Link>
        </nav>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-16 grid lg:grid-cols-3 gap-16">
        <div className="lg:col-span-2">
          <span className="text-emerald-500 text-[10px] font-bold uppercase tracking-widest mb-4 block">
            {blog.blog.category || "General"}
          </span>
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-8 leading-tight">
            {blog.blog.title}
          </h1>

          {blog.blog.image_url && (
            <img
              src={blog.blog.image_url}
              alt={blog.blog.title}
              className="w-full h-auto rounded-3xl mb-12 border border-zinc-800"
            />
          )}

          <article className="prose prose-invert prose-zinc prose-lg max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {blog.blog.content}
            </ReactMarkdown>
          </article>

          <section className="mt-20 pt-12 border-t border-zinc-800">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-8 flex items-center gap-2">
              <MessageSquare size={14} /> Comments ({comments.length})
            </h3>
            <div className="space-y-6 mb-12">
              {comments.map((c, i) => (
                <div
                  key={i}
                  className="p-6 bg-zinc-900 rounded-2xl border border-zinc-800"
                >
                  <p className="text-emerald-500 text-[10px] font-bold uppercase tracking-widest mb-2">
                    {c.username}
                  </p>
                  <p className="text-zinc-300 text-sm">{c.content}</p>
                </div>
              ))}
            </div>
            <form
              onSubmit={handleSubmit}
              className="p-6 bg-zinc-900 rounded-2xl border border-zinc-800 space-y-4"
            >
              <input
                placeholder="Name"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:border-emerald-500 outline-none transition"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <textarea
                placeholder="Write a comment..."
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:border-emerald-500 outline-none transition h-24"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              />
              <button className="w-full bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-bold uppercase tracking-widest py-3 rounded-xl transition">
                Post Comment
              </button>
            </form>
          </section>
        </div>

        <aside className="space-y-12">
          <div className="space-y-6">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
              Related Stories
            </h3>
            {relatedPosts.map((p) => (
              <Link
                key={p.blog.id}
                to={`/blogs/${p.blog.id}`}
                className="block group p-4 bg-zinc-900 rounded-2xl border border-zinc-800 hover:border-emerald-500/50 transition"
              >
                <p className="text-zinc-100 font-bold text-sm mb-2">
                  {p.blog.title}
                </p>
                <div className="flex justify-between items-center text-[10px] uppercase font-bold text-zinc-500">
                  <span>{p.blog.category}</span>
                  <ArrowUpRight
                    size={14}
                    className="opacity-0 group-hover:opacity-100"
                  />
                </div>
              </Link>
            ))}
          </div>

          <div className="p-8 bg-zinc-900 rounded-3xl border border-zinc-800">
            <h3 className="text-xl font-black uppercase tracking-tighter mb-4">
              Join the Journal.
            </h3>
            <p className="text-sm text-zinc-400 mb-6">
              Get access to contribute your own stories to the archive.
            </p>
            <Link
              to="/authors/register"
              className="block w-full text-center bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-bold uppercase tracking-widest py-3 rounded-xl transition"
            >
              Get Access
            </Link>
          </div>
        </aside>
      </div>
    </main>
  );
}
