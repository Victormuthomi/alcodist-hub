import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { BLOG_URL } from "../../api.js";
import {
  Terminal,
  Database,
  Rocket,
  Upload,
  Image as ImageIcon,
} from "lucide-react";
import { AiOutlineEye } from "react-icons/ai";
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

const contentTypes = [
  { id: "blog", label: "Blog Post", icon: <Rocket size={14} /> },
  { id: "tdd", label: "Technical Guide", icon: <Terminal size={14} /> },
  { id: "case study", label: "Case Study", icon: <Database size={14} /> },
];

const NewBlog = () => {
  const navigate = useNavigate();
  const [type, setType] = useState("blog");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState(categories[0]);
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState("");
  const [techStack, setTechStack] = useState("");
  const [imageFile, setImageFile] = useState(null);

  const token = localStorage.getItem("authorToken");

  const editorOptions = useMemo(
    () => ({
      spellChecker: false,
      status: false,
      placeholder: "Start writing your content here...",
    }),
    []
  );

  const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "razorblogs"); // Ensure this matches your preset
    const res = await fetch(
      "https://api.cloudinary.com/v1_1/dpiitjfzd/upload",
      {
        method: "POST",
        body: formData,
      }
    );
    if (!res.ok) throw new Error("Image upload failed");
    const data = await res.json();
    return data.secure_url;
  };

  const handlePublish = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageUrl = "";
      if (imageFile) {
        imageUrl = await uploadToCloudinary(imageFile);
      }

      const body = {
        title,
        content,
        category,
        type,
        image_url: imageUrl,
        metadata: { tech_stack: techStack },
      };

      const res = await fetch(BLOG_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) throw new Error("Failed to publish");
      navigate("/authors/dashboard");
    } catch (err) {
      console.error(err);
      alert("Failed to publish post.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020202] text-gray-300 font-sans flex flex-col md:flex-row">
      {/* Sidebar - Same as before */}
      <aside className="bg-black border-r border-white/5 p-8 md:w-72">
        <div className="mb-10">
          <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white mb-4">
            <Terminal size={20} />
          </div>
          <h2 className="text-[10px] font-bold uppercase tracking-widest text-gray-600">
            Alcodist Dashboard
          </h2>
        </div>
        <nav className="flex flex-col gap-2">
          {contentTypes.map((t) => (
            <button
              key={t.id}
              onClick={() => setType(t.id)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-medium transition-all ${
                type === t.id
                  ? "bg-emerald-600 text-white"
                  : "hover:bg-white/5 text-gray-500"
              }`}
            >
              {t.icon} {t.label}
            </button>
          ))}
        </nav>
      </aside>

      <main className="flex-1 p-8 md:p-16 max-w-7xl mx-auto w-full">
        <header className="mb-12">
          <h1 className="text-4xl font-bold text-white tracking-tight mb-2">
            Create New Post
          </h1>
        </header>

        <form
          onSubmit={handlePublish}
          className="grid grid-cols-1 lg:grid-cols-12 gap-12"
        >
          <div className="lg:col-span-7 space-y-8">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-400">
                  Post Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-emerald-500 outline-none"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-400">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-emerald-500 outline-none"
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Image Upload Input */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-400">
                Featured Image
              </label>
              <div className="relative border border-dashed border-white/10 rounded-xl p-4 flex items-center gap-4 bg-white/[0.02]">
                <Upload size={20} className="text-emerald-500" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files[0])}
                  className="text-xs text-gray-400 w-full"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-400">
                Content
              </label>
              <SimpleMDE
                value={content}
                onChange={setContent}
                options={editorOptions}
              />
            </div>

            <button
              disabled={loading}
              className="w-full py-4 bg-emerald-600 text-white font-bold rounded-2xl hover:bg-emerald-500 transition-all shadow-xl"
            >
              {loading ? "Publishing..." : "Publish Post"}
            </button>
          </div>

          <aside className="lg:col-span-5">
            <div className="sticky top-8 space-y-6">
              <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                <AiOutlineEye /> Live Preview
              </h2>
              <div className="bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-10 min-h-[400px]">
                {/* Image Preview */}
                {imageFile && (
                  <img
                    src={URL.createObjectURL(imageFile)}
                    alt="Preview"
                    className="w-full rounded-2xl mb-6 object-cover aspect-video"
                  />
                )}
                <span className="text-[10px] uppercase tracking-widest text-emerald-500 border border-emerald-500/30 px-2 py-1 rounded">
                  {type}
                </span>
                <h3 className="text-3xl font-bold text-white tracking-tight mt-2">
                  {title || "Untitled Post"}
                </h3>
                <div className="prose prose-invert prose-sm max-w-none mt-6">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {content}
                  </ReactMarkdown>
                </div>
              </div>
            </div>
          </aside>
        </form>
      </main>
    </div>
  );
};

export default NewBlog;
