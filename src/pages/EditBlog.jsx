import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { BLOG_URL, AUTHOR_URL } from "../api";
import { LogOut, Plus, Edit3, ArrowLeft, Save } from "lucide-react";

// Markdown Dependencies
import SimpleMDE from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const categories = [
  "Technology",
  "Agriculture",
  "Entertainment",
  "News",
  "Health",
  "Education",
  "Sports",
  "Lifestyle",
];

const EditBlog = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [author, setAuthor] = useState(null);
  const [loadingAuthor, setLoadingAuthor] = useState(true);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState(categories[0]);
  const [imageFile, setImageFile] = useState(null);
  const [imageURL, setImageURL] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("authorToken");
  const authorId = localStorage.getItem("authorId");

  const editorOptions = useMemo(
    () => ({
      spellChecker: false,
      status: false,
    }),
    []
  );

  useEffect(() => {
    if (!token || !authorId) navigate("/authors/login");

    const fetchAuthor = async () => {
      try {
        const res = await fetch(`${AUTHOR_URL}/${authorId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Auth Failed");
        const data = await res.json();
        setAuthor(data.author);
      } catch {
        navigate("/authors/login");
      } finally {
        setLoadingAuthor(false);
      }
    };
    fetchAuthor();
  }, [token, authorId, navigate]);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await fetch(`${BLOG_URL}/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed");
        const data = await res.json();

        setTitle(data.blog.title);
        setCategory(data.blog.category);
        setImageURL(data.blog.image_url || "");
        // Directly set content - No conversion needed now!
        setContent(data.blog.content || "");
      } catch (err) {
        navigate("/authors/dashboard");
      }
    };
    fetchBlog();
  }, [id, token, navigate]);

  const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "razorblogs");
    const res = await fetch(
      "https://api.cloudinary.com/v1_1/dpiitjfzd/upload",
      {
        method: "POST",
        body: formData,
      }
    );
    if (!res.ok) throw new Error("Upload failed");
    const data = await res.json();
    return data.secure_url;
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let finalImageURL = imageURL;
      if (imageFile) {
        finalImageURL = await uploadToCloudinary(imageFile);
      }

      const payload = { title, content, category, image_url: finalImageURL };
      const res = await fetch(`${BLOG_URL}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Update failed");
      navigate(`/blogs/${id}`);
    } catch (err) {
      alert("Failed to update blog. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loadingAuthor)
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-zinc-500 font-mono">
        LOADING_AUTH...
      </div>
    );

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col md:flex-row">
      <aside className="bg-zinc-900 p-8 border-r border-zinc-800 md:w-64 w-full flex flex-col justify-between">
        <nav className="flex flex-col gap-6">
          <Link
            to="/blogs/new"
            className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-zinc-400 hover:text-emerald-500 transition"
          >
            <Plus size={16} /> New_Post
          </Link>
          <Link
            to={`/authors/edit/${authorId}`}
            className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-zinc-400 hover:text-emerald-500 transition"
          >
            <Edit3 size={16} /> Edit_Profile
          </Link>
        </nav>
        <button
          onClick={() => {
            localStorage.clear();
            navigate("/authors/login");
          }}
          className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-zinc-500 hover:text-red-500 transition"
        >
          <LogOut size={16} /> Logout
        </button>
      </aside>

      <main className="flex-1 p-8 md:p-12">
        <header className="flex justify-between items-center mb-10">
          <h1 className="text-3xl font-black uppercase tracking-tighter">
            Edit_Log
          </h1>
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-zinc-500 hover:text-white transition"
          >
            <ArrowLeft size={12} /> Back
          </button>
        </header>

        <form onSubmit={handleUpdate} className="grid lg:grid-cols-2 gap-12">
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:border-emerald-500 outline-none transition"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:border-emerald-500 outline-none transition"
              >
                {categories.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files[0])}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:border-emerald-500 outline-none transition text-zinc-500"
              />
            </div>

            <div className="text-sm">
              <SimpleMDE
                value={content}
                onChange={setContent}
                options={editorOptions}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-bold uppercase tracking-widest py-4 rounded-xl transition flex items-center justify-center gap-2"
            >
              <Save size={14} /> {loading ? "SAVING..." : "Save_Changes"}
            </button>
          </div>

          <div className="border border-zinc-800 rounded-3xl p-8 bg-zinc-900/50">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-6">
              Live_Preview
            </h3>
            {imageFile || imageURL ? (
              <img
                src={imageFile ? URL.createObjectURL(imageFile) : imageURL}
                className="w-full rounded-2xl object-cover aspect-video mb-6 border border-zinc-800"
                alt="Preview"
              />
            ) : null}
            <h3 className="text-2xl font-black uppercase tracking-tighter mb-4">
              {title || "Untitled_Log"}
            </h3>
            <div className="prose prose-invert prose-zinc prose-sm mt-6">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {content}
              </ReactMarkdown>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
};

export default EditBlog;
