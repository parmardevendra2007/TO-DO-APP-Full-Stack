import { useState } from "react";
import axios from "axios";

const EyeOpen = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
       stroke="currentColor" strokeWidth="1.8">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
);

const EyeOff = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
       stroke="currentColor" strokeWidth="1.8">
    <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8
             a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4
             c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19
             m-6.72-1.07a3 3 0 11-4.24-4.24"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
);

const Spinner = () => (
  <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24" fill="none">
    <circle className="opacity-25" cx="12" cy="12" r="10"
            stroke="currentColor" strokeWidth="4"/>
    <path className="opacity-75" fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.37 0 0 5.37 0 12h4z"/>
  </svg>
);

export default function LoginPage() {
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [errors,   setErrors]   = useState({});
  const [loading,  setLoading]  = useState(false);
  const [toast,    setToast]    = useState(null); // { type, msg }

  // ── Validation ──────────────────────────────────────────────────────────────
  function validate() {
    const e = {};
    if (!email)
      e.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      e.email = "Please enter a valid email.";
    if (!password)
      e.password = "Password is required.";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  // ── Submit ──────────────────────────────────────────────────────────────────
  async function handleSubmit(e) {
    e.preventDefault();
    setToast(null);
    if (!validate()) return;

    setLoading(true);
    try {
      await axios.post("https://to-do-app-full-stack.vercel.app/api/login", { email, password },{
  withCredentials: true,
}
      );
      setToast({ type: "success", msg: "Login successful! Redirecting…" });
      setTimeout(() => (window.location.href = "/dashboard"), 1600);
    } catch (err) {
      const msg = err?.response?.data?.error ?? "Invalid email or password.";
      setToast({ type: "error", msg });
    } finally {
      setLoading(false);
    }
  }

  // ── Input class ─────────────────────────────────────────────────────────────
  const inputClass = (field) =>
    `w-full h-11 rounded-xl pl-10 pr-10 text-sm bg-gray-50 border outline-none
     transition-all duration-150 placeholder-gray-400 text-gray-800
     focus:bg-white focus:ring-2
     ${errors[field]
       ? "border-red-400 bg-red-50 focus:border-red-400 focus:ring-red-100"
       : "border-gray-200 focus:border-indigo-400 focus:ring-indigo-100"}`;

  // ─────────────────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-indigo-50 flex items-center justify-center px-4 py-10">
      <div
        className="bg-white rounded-3xl border border-indigo-100 shadow-xl shadow-indigo-50
                   w-full max-w-sm px-9 py-10"
        style={{ animation: "fadeUp 0.4s cubic-bezier(.22,.68,0,1.2) 0.08s both" }}
      >

        {/* Logo */}
        <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-6"
             style={{ background: "linear-gradient(135deg,#4f6ef7,#7c3aed)" }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M12 2L3 7v5c0 5.25 3.75 10.15 9 11.35C17.25 22.15 21 17.25 21 12V7L12 2z"
                  fill="rgba(255,255,255,0.9)"/>
            <path d="M9 12l2 2 4-4" stroke="#4f6ef7" strokeWidth="2"
                  strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

        <h1 className="text-[21px] font-semibold text-gray-900 tracking-tight mb-1">
          Welcome back
        </h1>
        <p className="text-[13.5px] text-gray-500 mb-7">
          Sign in to your account to continue.
        </p>

        {/* Toast */}
        {toast && (
          <div className={`flex items-start gap-2 text-sm rounded-xl px-4 py-3 mb-5 border
            ${toast.type === "success"
              ? "bg-green-50 border-green-200 text-green-800"
              : "bg-red-50 border-red-200 text-red-800"}`}>
            {toast.type === "success"
              ? <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="mt-0.5 shrink-0"><circle cx="12" cy="12" r="10"/><path d="M9 12l2 2 4-4"/></svg>
              : <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="mt-0.5 shrink-0"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            }
            {toast.msg}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>

          {/* Email */}
          <div className="mb-4">
            <label className="block text-[13px] font-medium text-gray-700 mb-1.5">
              Email address
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <rect x="2" y="4" width="20" height="16" rx="2"/>
                  <path d="M2 7l10 7 10-7"/>
                </svg>
              </span>
              <input
                type="email" value={email} placeholder="you@example.com"
                autoComplete="email"
                onChange={(e) => { setEmail(e.target.value); setErrors((p) => ({ ...p, email: undefined })); }}
                className={inputClass("email")}
              />
            </div>
            {errors.email && (
              <p className="flex items-center gap-1 text-[12px] text-red-500 mt-1.5">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                {errors.email}
              </p>
            )}
          </div>

          {/* Password */}
          <div className="mb-1">
            <label className="block text-[13px] font-medium text-gray-700 mb-1.5">
              Password
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <rect x="3" y="11" width="18" height="11" rx="2"/>
                  <path d="M7 11V7a5 5 0 0110 0v4"/>
                </svg>
              </span>
              <input
                type={showPass ? "text" : "password"}
                value={password} placeholder="Enter your password"
                autoComplete="current-password"
                onChange={(e) => { setPassword(e.target.value); setErrors((p) => ({ ...p, password: undefined })); }}
                className={inputClass("password")}
              />
              <button type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-indigo-500 transition-colors"
                onClick={() => setShowPass((v) => !v)}>
                {showPass ? <EyeOff/> : <EyeOpen/>}
              </button>
            </div>
            {errors.password && (
              <p className="flex items-center gap-1 text-[12px] text-red-500 mt-1.5">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                {errors.password}
              </p>
            )}
          </div>

          {/* Forgot password */}
          

          {/* Submit */}
          <button type="submit" disabled={loading}
            className="w-full h-[46px] rounded-xl text-white text-[15px] font-medium
                       flex items-center justify-content-center gap-2
                       transition-all duration-150
                       hover:-translate-y-[1px] hover:shadow-lg hover:shadow-indigo-200
                       active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed
                       justify-center"
            style={{ background: "linear-gradient(135deg,#4f6ef7,#7c3aed)" }}>
            {loading ? <><Spinner/><span>Signing in…</span></> : "Sign In"}
          </button>
        </form>

        {/* Register link */}
        <p className="text-center text-[13.5px] text-gray-400 mt-6">
          Don't have an account?{" "}
          <a href="/register"
             className="text-indigo-500 font-medium hover:text-purple-600 hover:underline transition-colors">
            Register
          </a>
        </p>
      </div>

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px) scale(0.98); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
}