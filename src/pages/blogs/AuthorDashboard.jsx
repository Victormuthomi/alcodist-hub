import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AUTHOR_URL, BLOG_URL } from "../../api";
import {
  AiOutlineLogout,
  AiOutlinePlus,
  AiOutlineEdit,
  AiOutlineEye,
  AiOutlineMenu,
  AiOutlineClose,
  AiOutlineDelete,
} from "react-icons/ai";

const DashboardSkeleton = () => (
  <div className="animate-pulse space-y-6">
    <div className="grid grid-cols-3 gap-6">
      {[1, 2, 3].map((i) => (
        <div key={i} className="h-24 bg-zinc-900 rounded-2xl" />
      ))}
    </div>
    <div className="grid md:grid-cols-3 gap-6">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="h-64 bg-zinc-900 rounded-2xl" />
      ))}
    </div>
  </div>
);

const AuthorsDashboard = () => {
  const navigate = useNavigate();
  const [author, setAuthor] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const token = localStorage.getItem("authorToken");
  const authorId = localStorage.getItem("authorId");

  useEffect(() => {
    if (!token || !authorId) {
      localStorage.clear();
      navigate("/authors/login");
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        const authorRes = await fetch(`${AUTHOR_URL}/${authorId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!authorRes.ok) throw new Error("Auth failed");
        const data = await authorRes.json();
        setAuthor(data.author);

        const blogsRes = await fetch(`${BLOG_URL}/author/${authorId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const blogsData = blogsRes.ok ? await blogsRes.json() : [];

        setBlogs(
          blogsData
            .map((item) => ({
              id: item.blog.id,
              title: item.blog.title,
              content: item.blog.content,
              type: item.blog.type || "blog",
              readers: item.blog.readers || 0,
              created_at: item.blog.created_at,
            }))
            .sort((a, b) => b.readers - a.readers)
        );
      } catch (err) {
        console.error(err);
        localStorage.clear();
        navigate("/authors/login");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [token, authorId, navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/authors/login");
  };

  const handleDelete = async (blogId) => {
    if (!confirm("Delete this entry?")) return;
    try {
      const res = await fetch(`${BLOG_URL}/${blogId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) setBlogs((prev) => prev.filter((b) => b.id !== blogId));
    } catch (err) {
      alert("Failed to delete.");
    }
  };

  const totalViews = blogs.reduce((sum, b) => sum + b.readers, 0);

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "flex" : "hidden"
        } md:flex flex-col w-full md:w-64 border-r border-zinc-900 p-6 bg-zinc-950 z-50 fixed inset-0 md:relative`}
      >
        <div className="flex justify-between items-center mb-8 md:hidden">
          <span className="text-xs font-bold tracking-tighter">ALCODIST</span>
          <button onClick={() => setSidebarOpen(false)}>
            <AiOutlineClose />
          </button>
        </div>

        <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-8 hidden md:block">
          Dashboard
        </h2>

        <nav className="flex flex-col gap-2 flex-grow">
          <Link
            to="/blogs/new"
            className="flex items-center gap-3 p-3 bg-zinc-900 rounded-xl hover:bg-emerald-500/10 hover:text-emerald-400 transition"
          >
            <AiOutlinePlus size={16} />{" "}
            <span className="text-xs font-bold uppercase">New Entry</span>
          </Link>
          <Link
            to={`/authors/edit/${authorId}`}
            className="flex items-center gap-3 p-3 rounded-xl hover:bg-zinc-900 transition"
          >
            <AiOutlineEdit size={16} />{" "}
            <span className="text-xs font-bold uppercase">Settings</span>
          </Link>
          <Link
            to={`/authors/${authorId}`}
            className="flex items-center gap-3 p-3 rounded-xl hover:bg-zinc-900 transition"
          >
            <AiOutlineEye size={16} />{" "}
            <span className="text-xs font-bold uppercase">Public View</span>
          </Link>
        </nav>

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 p-3 text-zinc-500 hover:text-red-400 transition"
        >
          <AiOutlineLogout size={16} />{" "}
          <span className="text-xs font-bold uppercase">Logout</span>
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-12">
        <div className="flex justify-between items-start mb-12">
          <div>
            <h1 className="text-3xl font-black tracking-tighter mb-2">
              {author?.name || "Author"}
            </h1>
            <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest">
              {author?.email}
            </p>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={handleLogout}
              className="hidden md:flex items-center gap-2 text-xs font-bold uppercase text-zinc-500 hover:text-red-400 transition"
            >
              <AiOutlineLogout size={14} /> Logout
            </button>
            <button onClick={() => setSidebarOpen(true)} className="md:hidden">
              <AiOutlineMenu size={20} />
            </button>
          </div>
        </div>

        {loading ? (
          <DashboardSkeleton />
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
              <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800">
                <h3 className="text-[10px] text-zinc-500 uppercase tracking-widest">
                  Entries
                </h3>
                <p className="text-2xl font-bold mt-2">{blogs.length}</p>
              </div>
              <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800">
                <h3 className="text-[10px] text-zinc-500 uppercase tracking-widest">
                  Total Reach
                </h3>
                <p className="text-2xl font-bold mt-2 text-emerald-500">
                  {totalViews}
                </p>
              </div>
              <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800 flex items-center justify-center">
                <Link
                  to="/blogs/new"
                  className="text-zinc-500 hover:text-emerald-500 transition"
                >
                  <AiOutlinePlus size={24} />
                </Link>
              </div>
            </div>

            <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-8">
              Repository
            </h2>
            {blogs.length === 0 ? (
              <div className="border border-zinc-800 rounded-2xl p-12 text-center text-zinc-600 text-xs">
                No entries found.
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {blogs.map((blog) => (
                  <div
                    key={blog.id}
                    className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl flex flex-col hover:border-zinc-700 transition"
                  >
                    <h3 className="font-bold mb-2 flex-grow">{blog.title}</h3>
                    <div className="flex justify-between items-center mt-6 pt-6 border-t border-zinc-800">
                      <span className="text-[10px] text-zinc-500">
                        {blog.readers} Readers
                      </span>
                      <div className="flex gap-4">
                        <Link to={`/blogs/${blog.id}`}>
                          <AiOutlineEye size={14} />
                        </Link>
                        <Link to={`/blogs/${blog.id}/edit`}>
                          <AiOutlineEdit size={14} />
                        </Link>
                        <button
                          onClick={() => handleDelete(blog.id)}
                          className="text-red-500"
                        >
                          <AiOutlineDelete size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default AuthorsDashboard;
