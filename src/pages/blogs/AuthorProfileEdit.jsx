import React, { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { AUTHOR_URL } from "../../api";
import {
  AiOutlineEye,
  AiOutlineEyeInvisible,
  AiOutlineDelete,
  AiOutlineArrowLeft,
} from "react-icons/ai";

const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/dpiitjfzd/upload";
const UPLOAD_PRESET = "razorblogs";

const AuthorProfileEdit = () => {
  const navigate = useNavigate();
  const params = useParams();
  const storedId = localStorage.getItem("authorId");
  const authorId = params.id || storedId;
  const token = localStorage.getItem("authorToken");

  const [author, setAuthor] = useState({
    name: "",
    email: "",
    phone: "",
    avatar_url: "",
    bio: "",
  });
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [countryCode, setCountryCode] = useState("+254");
  const [avatarFile, setAvatarFile] = useState(null);

  const fetchAuthor = async () => {
    if (!authorId || !token) {
      setError("Missing author information. Please login again.");
      return;
    }
    try {
      setLoading(true);
      const res = await fetch(`${AUTHOR_URL}/${authorId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch author data.");
      const data = await res.json();
      const a = data.author || data;

      let code = "+254";
      let number = a.phone || "";
      if (a.phone?.startsWith("+") && a.phone.length > 3) {
        code = a.phone.slice(0, a.phone.length - 9);
        number = a.phone.slice(-9);
      }

      setCountryCode(code);
      setAuthor({
        name: a.name || "",
        email: a.email || "",
        phone: number,
        avatar_url: a.avatar_url || "",
        bio: a.bio || "",
      });
    } catch (err) {
      console.error(err);
      setError("Error fetching profile data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAuthor();
  }, [authorId, token]);

  const isStrongPassword = (pwd) => {
    return pwd.length >= 8 && /[A-Z]/.test(pwd) && /\d/.test(pwd);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (password && !isStrongPassword(password)) {
      setError("Password too weak (8+ chars, Uppercase, Number).");
      return;
    }

    setLoading(true);
    try {
      let avatarUrl = author.avatar_url;

      if (avatarFile) {
        const formData = new FormData();
        formData.append("file", avatarFile);
        formData.append("upload_preset", UPLOAD_PRESET);

        const cloudRes = await fetch(CLOUDINARY_URL, {
          method: "POST",
          body: formData,
        });
        const cloudData = await cloudRes.json();
        avatarUrl = cloudData.secure_url;
      }

      const body = {
        name: author.name,
        email: author.email,
        phone: countryCode + author.phone,
        avatar_url: avatarUrl,
        bio: author.bio,
      };
      if (password) body.password = password;

      const res = await fetch(`${AUTHOR_URL}/${authorId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Update failed");
      } else {
        setSuccess("Profile updated successfully!");
        setTimeout(() => navigate("/authors/dashboard"), 1500);
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete your account?"))
      return;

    try {
      setLoading(true);
      const res = await fetch(`${AUTHOR_URL}/${authorId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Delete failed");
      localStorage.clear();
      navigate("/");
    } catch (err) {
      console.error(err);
      setError("Failed to delete account.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center py-12 px-6">
      <Link
        to="/authors/dashboard"
        className="w-full max-w-md mb-8 flex items-center gap-2 text-zinc-500 hover:text-emerald-500 transition text-xs font-bold uppercase tracking-widest"
      >
        <AiOutlineArrowLeft /> Back to Dashboard
      </Link>

      <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl p-8">
        <header className="mb-8">
          <h1 className="text-2xl font-black tracking-tighter text-white">
            Edit Profile
          </h1>
          <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mt-1">
            Update your account details.
          </p>
        </header>

        {(error || success) && (
          <p
            className={`text-[10px] font-bold uppercase tracking-widest mb-6 ${
              error ? "text-red-500" : "text-emerald-500"
            }`}
          >
            {error || success}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col items-center gap-4 mb-6">
            <div className="w-24 h-24 rounded-full bg-zinc-800 overflow-hidden border border-zinc-700">
              <img
                src={
                  avatarFile
                    ? URL.createObjectURL(avatarFile)
                    : author.avatar_url || "/default-avatar.png"
                }
                alt="Avatar"
                className="w-full h-full object-cover"
              />
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setAvatarFile(e.target.files[0])}
              className="text-[10px] text-zinc-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-zinc-800 file:text-zinc-300 hover:file:bg-zinc-700"
            />
          </div>

          <input
            type="text"
            placeholder="Full Name"
            value={author.name}
            onChange={(e) =>
              setAuthor((prev) => ({ ...prev, name: e.target.value }))
            }
            className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-800 text-sm focus:outline-none focus:border-emerald-500 transition"
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={author.email}
            onChange={(e) =>
              setAuthor((prev) => ({ ...prev, email: e.target.value }))
            }
            className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-800 text-sm focus:outline-none focus:border-emerald-500 transition"
            required
          />

          <div className="flex gap-2">
            <select
              value={countryCode}
              onChange={(e) => setCountryCode(e.target.value)}
              className="px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-800 text-sm text-zinc-400 focus:outline-none focus:border-emerald-500 transition"
            >
              <option value="+254">+254</option>
              <option value="+1">+1</option>
              <option value="+44">+44</option>
            </select>
            <input
              type="tel"
              placeholder="712345678"
              value={author.phone}
              onChange={(e) =>
                setAuthor((prev) => ({ ...prev, phone: e.target.value }))
              }
              className="flex-1 px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-800 text-sm focus:outline-none focus:border-emerald-500 transition"
              required
            />
          </div>

          <textarea
            placeholder="Short Bio"
            value={author.bio}
            onChange={(e) =>
              setAuthor((prev) => ({ ...prev, bio: e.target.value }))
            }
            className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-800 text-sm focus:outline-none focus:border-emerald-500 transition"
            rows={3}
          />

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="New Password (optional)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-800 text-sm focus:outline-none focus:border-emerald-500 transition"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-4 top-3.5 text-zinc-600 hover:text-emerald-500"
            >
              {showPassword ? (
                <AiOutlineEyeInvisible size={18} />
              ) : (
                <AiOutlineEye size={18} />
              )}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-500 text-zinc-950 font-bold text-xs uppercase tracking-widest py-3 rounded-xl hover:bg-emerald-400 transition"
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>

          <button
            type="button"
            onClick={handleDelete}
            disabled={loading}
            className="w-full bg-zinc-800 text-zinc-400 font-bold text-xs uppercase tracking-widest py-3 rounded-xl hover:text-red-400 hover:bg-zinc-800 transition flex items-center justify-center gap-2"
          >
            <AiOutlineDelete /> Delete Account
          </button>
        </form>
      </div>
    </div>
  );
};

export default AuthorProfileEdit;
