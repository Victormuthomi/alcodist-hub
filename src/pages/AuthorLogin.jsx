import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AUTHOR_URL } from "../api";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

const AuthorLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("authorToken");
    const authorId = localStorage.getItem("authorId");
    if (token && authorId) navigate("/authors/dashboard");
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${AUTHOR_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Login failed");
        return;
      }

      localStorage.setItem("authorToken", data.token);
      localStorage.setItem("authorId", data.authorId);
      navigate("/authors/dashboard");
    } catch (err) {
      console.error(err);
      setError("System unreachable. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <header className="mb-12 text-center">
          <h1 className="text-4xl font-black tracking-tighter mb-2">Login</h1>
          <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest">
            Enter your credentials to access the hub.
          </p>
        </header>

        <div className="bg-zinc-900 rounded-2xl p-8 border border-zinc-800">
          {error && (
            <p className="text-red-500 text-[10px] font-bold uppercase tracking-widest mb-6">
              {error}
            </p>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-800 text-sm focus:outline-none focus:border-emerald-500 transition"
              required
            />

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-800 text-sm focus:outline-none focus:border-emerald-500 transition"
                required
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
              {loading ? "Authenticating..." : "Login"}
            </button>
          </form>

          <div className="mt-8 text-center border-t border-zinc-800 pt-6">
            <p className="text-zinc-500 text-[10px] uppercase font-bold tracking-widest">
              Not registered?{" "}
              <Link
                to="/authors/register"
                className="text-emerald-500 hover:underline"
              >
                Register
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthorLogin;
