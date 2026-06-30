import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AUTHOR_URL } from "../api";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

const countryCodes = [
  { code: "+254", name: "Kenya" },
  { code: "+1", name: "USA" },
  { code: "+44", name: "UK" },
  { code: "+91", name: "India" },
];

const AuthorRegister = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [countryCode, setCountryCode] = useState("+254");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const navigate = useNavigate();

  const validatePassword = (pwd) => {
    const minLength = 8;
    const hasUpper = /[A-Z]/.test(pwd);
    const hasLower = /[a-z]/.test(pwd);
    const hasNumber = /[0-9]/.test(pwd);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(pwd);
    return (
      pwd.length >= minLength && hasUpper && hasLower && hasNumber && hasSpecial
    );
  };

  const validatePhone = (num) => /^\d{9}$/.test(num);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setPasswordError("");
    setPhoneError("");

    if (!validatePassword(password)) {
      setPasswordError(
        "Password must be 8+ chars, with uppercase, lowercase, number, and special character."
      );
      return;
    }

    if (!validatePhone(phoneNumber)) {
      setPhoneError("Phone number must be exactly 9 digits (e.g., 712345678).");
      return;
    }

    const fullPhone = `${countryCode}${phoneNumber}`;
    setLoading(true);

    try {
      const res = await fetch(`${AUTHOR_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone: fullPhone, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Registration failed.");
      } else {
        navigate("/authors/login");
      }
    } catch (err) {
      console.error(err);
      setError("System unreachable. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        <header className="mb-12 text-center">
          <h1 className="text-4xl font-black tracking-tighter mb-2">
            Register
          </h1>
          <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest">
            Create your account to start sharing.
          </p>
        </header>

        <div className="bg-zinc-900 rounded-2xl p-8 border border-zinc-800">
          {(error || passwordError || phoneError) && (
            <p className="text-red-500 text-[10px] font-bold uppercase tracking-widest mb-6">
              {error || passwordError || phoneError}
            </p>
          )}

          <form onSubmit={handleRegister} className="space-y-4">
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-800 text-sm focus:outline-none focus:border-emerald-500 transition"
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-800 text-sm focus:outline-none focus:border-emerald-500 transition"
              required
            />

            <div className="flex gap-2">
              <select
                value={countryCode}
                onChange={(e) => setCountryCode(e.target.value)}
                className="px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-800 text-sm text-zinc-400 focus:outline-none focus:border-emerald-500 transition"
              >
                {countryCodes.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.code}
                  </option>
                ))}
              </select>
              <input
                type="text"
                placeholder="712345678"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="flex-1 px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-800 text-sm focus:outline-none focus:border-emerald-500 transition"
                required
              />
            </div>

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
              {loading ? "Registering..." : "Create Account"}
            </button>
          </form>

          <div className="mt-8 text-center border-t border-zinc-800 pt-6">
            <p className="text-zinc-500 text-[10px] uppercase font-bold tracking-widest">
              Already have an account?{" "}
              <Link
                to="/authors/login"
                className="text-emerald-500 hover:underline"
              >
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthorRegister;
