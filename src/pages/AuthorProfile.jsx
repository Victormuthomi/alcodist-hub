import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { AUTHOR_URL, BLOG_URL } from "../api";
import {
  AiOutlineEdit,
  AiOutlineLogout,
  AiOutlineArrowLeft,
} from "react-icons/ai";

const AuthorProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("authorToken");
  const localAuthorId = localStorage.getItem("authorId");

  const [author, setAuthor] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isPrivate, setIsPrivate] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const privateView = token && localAuthorId === id;
        setIsPrivate(privateView);

        const endpoint = privateView
          ? `${AUTHOR_URL}/${id}`
          : `${AUTHOR_URL}/public/${id}`;
        const headers = privateView ? { Authorization: `Bearer ${token}` } : {};

        const res = await fetch(endpoint, { headers });
        if (!res.ok) throw new Error("Failed to fetch author");
        const data = await res.json();
        const authorData = data.author || data;
        setAuthor(authorData);

        if (!privateView) {
          const blogsRes = await fetch(`${BLOG_URL}/author/${id}`);
          if (blogsRes.ok) {
            const blogsData = await blogsRes.json();
            setBlogs(blogsData);
          }
        }
      } catch (err) {
        console.error(err);
        if (token) navigate("/authors/login");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [id, token, localAuthorId, navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/authors/login");
  };

  if (loading)
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-500 flex items-center justify-center font-bold uppercase tracking-widest text-xs">
        Loading...
      </div>
    );

  if (!author)
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-500 flex items-center justify-center font-bold uppercase tracking-widest text-xs">
        Profile not found
      </div>
    );

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center p-6 md:p-12 text-white">
      <Link
        to={isPrivate ? "/authors/dashboard" : "/"}
        className="self-start mb-12 flex items-center gap-2 text-zinc-500 hover:text-emerald-500 transition text-xs font-bold uppercase tracking-widest"
      >
        <AiOutlineArrowLeft /> Back
      </Link>

      <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-2xl w-full max-w-sm flex flex-col items-center gap-6">
        {/* Avatar */}
        <div className="w-24 h-24 rounded-full bg-zinc-800 flex items-center justify-center overflow-hidden border border-zinc-700">
          {author.avatar_url ? (
            <img
              src={author.avatar_url}
              alt={author.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-3xl font-black text-zinc-500">
              {author.name?.[0]?.toUpperCase()}
            </span>
          )}
        </div>

        <div className="text-center">
          <h1 className="text-2xl font-black tracking-tighter mb-2">
            {author.name}
          </h1>
          {author.bio && <p className="text-zinc-500 text-sm">{author.bio}</p>}
        </div>

        {isPrivate ? (
          <div className="w-full space-y-4">
            <div className="space-y-1">
              <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest">
                Email
              </p>
              <p className="text-sm">{author.email}</p>
            </div>
            {author.phone && (
              <div className="space-y-1">
                <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest">
                  Phone
                </p>
                <p className="text-sm">{author.phone}</p>
              </div>
            )}
            <div className="pt-6 border-t border-zinc-800 flex flex-col gap-2">
              <Link
                to={`/authors/edit/${id}`}
                className="w-full bg-emerald-500 text-zinc-950 py-3 rounded-xl font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-emerald-400 transition"
              >
                <AiOutlineEdit /> Edit Profile
              </Link>
              <button
                onClick={handleLogout}
                className="w-full bg-zinc-800 text-zinc-400 py-3 rounded-xl font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:text-red-400 transition"
              >
                <AiOutlineLogout /> Logout
              </button>
            </div>
          </div>
        ) : (
          <div className="w-full pt-6 border-t border-zinc-800">
            <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-6">
              Entries by {author.name}
            </h2>
            {blogs.length === 0 ? (
              <p className="text-zinc-600 text-xs text-center">
                No entries found.
              </p>
            ) : (
              <div className="flex flex-col gap-4">
                {blogs.slice(0, 5).map(({ blog }) => (
                  <Link
                    key={blog.id}
                    to={`/blogs/${blog.id}`}
                    className="flex gap-4 items-center bg-zinc-950 p-3 rounded-xl border border-zinc-800 hover:border-emerald-500 transition"
                  >
                    <div className="w-12 h-12 bg-zinc-900 rounded-lg flex-shrink-0 flex items-center justify-center">
                      {blog.image_url ? (
                        <img
                          src={blog.image_url}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <span className="text-[10px] text-zinc-600">N/A</span>
                      )}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold leading-tight">
                        {blog.title}
                      </h3>
                      <p className="text-[10px] text-zinc-500 line-clamp-1 mt-1">
                        {blog.content.replace(/<\/?[^>]+(>|$)/g, "")}
                      </p>
                    </div>
                  </Link>
                ))}
                {blogs.length > 5 && (
                  <Link
                    to={`/blogs/author/${id}`}
                    className="text-xs font-bold text-emerald-500 hover:underline mt-2"
                  >
                    View More
                  </Link>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthorProfile;
