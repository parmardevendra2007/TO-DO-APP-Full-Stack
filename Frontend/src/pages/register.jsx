import { useState } from "react";
import axios from "axios";
// ─── Password strength helper ─────────────────────────────────────────────────
function getStrength(pw) {
  let score = 0;
  if (pw.length >= 6) score++;
  if (pw.length >= 10) score++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++;
  if (/[0-9]/.test(pw) && /[^A-Za-z0-9]/.test(pw)) score++;
  const map = [
    { label: "Too weak",  color: "bg-red-400"    },
    { label: "Fair",      color: "bg-orange-400"  },
    { label: "Good",      color: "bg-yellow-400"  },
    { label: "Strong",    color: "bg-green-500"   },
  ];
  return { score, ...map[score - 1] ?? { label: "Too short", color: "bg-gray-200" } };
}

// ─── Eye icons ────────────────────────────────────────────────────────────────
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
    <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94
             M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19
             m-6.72-1.07a3 3 0 11-4.24-4.24"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
);

// ─── Spinner ──────────────────────────────────────────────────────────────────
const Spinner = () => (
  <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24" fill="none">
    <circle className="opacity-25" cx="12" cy="12" r="10"
            stroke="currentColor" strokeWidth="4"/>
    <path className="opacity-75" fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.37 0 0 5.37 0 12h4z"/>
  </svg>
);

// ─── Main component ───────────────────────────────────────────────────────────
export default function RegisterPage() {
  const [form, setForm]         = useState({ email: "", password: "", confirm: "" });
  const [errors, setErrors]     = useState({});
  const [showPass, setShowPass] = useState(false);
  const [showConf, setShowConf] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [toast, setToast]       = useState(null); // { type: 'success'|'error', msg }

  const strength = form.password ? getStrength(form.password) : null;

  // ── Validation ──────────────────────────────────────────────────────────────
  function validate() {
    const e = {};
    if (!form.email)
      e.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = "Please enter a valid email address.";

    if (!form.password)
      e.password = "Password is required.";
    else if (form.password.length < 6)
      e.password = "Password must be at least 6 characters.";

    if (!form.confirm)
      e.confirm = "Please confirm your password.";
    else if (form.confirm !== form.password)
      e.confirm = "Passwords do not match.";

    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    // Clear the error for the changed field
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  }

  // ── Submit ──────────────────────────────────────────────────────────────────
  async function handleSubmit(e) {
    e.preventDefault();
    setToast(null);
    if (!validate()) return;

    setLoading(true);
    try {
      await axios.post("https://to-do-app-full-stack.vercel.app/api/register", {
        email:    form.email,
        password: form.password,
      });
      setToast({ type: "success", msg: "Account created! Redirecting to login…" });
      setTimeout(() => (window.location.href = "/login"), 1800);
    } catch (err) {
      const msg =
        err?.response?.data?.error ?? "Registration failed. Please try again.";
      setToast({ type: "error", msg });
    } finally {
      setLoading(false);
    }
  }

  // ── Input class helper ──────────────────────────────────────────────────────
  function inputClass(field) {
    const base =
      "w-full h-11 rounded-xl pl-10 pr-10 text-sm bg-gray-50 border transition-all duration-150 outline-none focus:bg-white focus:ring-2 focus:ring-indigo-100 text-gray-800 placeholder-gray-400";
    if (errors[field]) return `${base} border-red-400 bg-red-50 focus:border-red-400 focus:ring-red-100`;
    return `${base} border-gray-200 focus:border-indigo-400`;
  }

  // ─────────────────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-indigo-50 flex items-center justify-center px-4 py-10">
      <div
        className="bg-white rounded-3xl border border-indigo-100 shadow-xl shadow-indigo-50
                   w-full max-w-md px-9 py-10
                   animate-[fadeUp_0.45s_cubic-bezier(.22,.68,0,1.2)_forwards]"
        style={{ opacity: 0, animation: "fadeUp 0.45s cubic-bezier(.22,.68,0,1.2) 0.1s forwards" }}
      >

        {/* ── Logo ── */}
        <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-6"
             style={{ background: "linear-gradient(135deg,#4f6ef7,#7c3aed)" }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M12 2L3 7v5c0 5.25 3.75 10.15 9 11.35C17.25 22.15 21 17.25 21 12V7L12 2z"
                  fill="rgba(255,255,255,0.9)"/>
            <path d="M9 12l2 2 4-4" stroke="#4f6ef7" strokeWidth="2"
                  strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

        <h1 className="text-[22px] font-semibold text-gray-900 tracking-tight mb-1">
          Create your account
        </h1>
        <p className="text-sm text-gray-500 mb-7">
          Start your journey — it only takes a moment.
        </p>

        {/* ── Toast ── */}
        {toast && (
          <div className={`flex items-start gap-2 text-sm rounded-xl px-4 py-3 mb-5 border
            ${toast.type === "success"
              ? "bg-green-50 border-green-200 text-green-800"
              : "bg-red-50  border-red-200  text-red-800"}`}>
            {toast.type === "success"
              ? <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="mt-0.5 shrink-0"><circle cx="12" cy="12" r="10"/><path d="M9 12l2 2 4-4"/></svg>
              : <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="mt-0.5 shrink-0"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            }
            <span>{toast.msg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>

          {/* ── Email ── */}
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
                id="email" name="email" type="email"
                value={form.email} onChange={handleChange}
                placeholder="you@example.com"
                autoComplete="email"
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

          {/* ── Password ── */}
          <div className="mb-4">
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
                id="password" name="password"
                type={showPass ? "text" : "password"}
                value={form.password} onChange={handleChange}
                placeholder="Min. 6 characters"
                autoComplete="new-password"
                className={inputClass("password")}
              />
              <button type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-indigo-500 transition-colors"
                onClick={() => setShowPass((v) => !v)}>
                {showPass ? <EyeOff/> : <EyeOpen/>}
              </button>
            </div>

            {/* Strength bar */}
            {form.password && (
              <div className="mt-2">
                <div className="flex gap-1 mb-1">
                  {[0, 1, 2, 3].map((i) => (
                    <div key={i}
                      className={`flex-1 h-[3px] rounded-full transition-colors duration-300
                        ${i < strength.score ? strength.color : "bg-gray-200"}`}/>
                  ))}
                </div>
                <p className="text-[11px] text-gray-500">{strength.label}</p>
              </div>
            )}

            {errors.password && (
              <p className="flex items-center gap-1 text-[12px] text-red-500 mt-1.5">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                {errors.password}
              </p>
            )}
          </div>

          {/* ── Confirm Password ── */}
          <div className="mb-6">
            <label className="block text-[13px] font-medium text-gray-700 mb-1.5">
              Confirm password
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                </svg>
              </span>
              <input
                id="confirm" name="confirm"
                type={showConf ? "text" : "password"}
                value={form.confirm} onChange={handleChange}
                placeholder="Re-enter your password"
                autoComplete="new-password"
                className={inputClass("confirm")}
              />
              <button type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-indigo-500 transition-colors"
                onClick={() => setShowConf((v) => !v)}>
                {showConf ? <EyeOff/> : <EyeOpen/>}
              </button>
            </div>
            {errors.confirm && (
              <p className="flex items-center gap-1 text-[12px] text-red-500 mt-1.5">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                {errors.confirm}
              </p>
            )}
          </div>

          {/* ── Submit ── */}
          <button type="submit" disabled={loading}
            className="w-full h-[46px] rounded-xl text-white text-[15px] font-medium
                       flex items-center justify-center gap-2
                       transition-all duration-150
                       hover:-translate-y-[1px] hover:shadow-lg hover:shadow-indigo-200
                       active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
            style={{ background: "linear-gradient(135deg,#4f6ef7,#7c3aed)" }}>
            {loading ? (
              <><Spinner/><span>Creating account…</span></>
            ) : (
              "Create Account"
            )}
          </button>
        </form>

        {/* ── Login link ── */}
        <p className="text-center text-sm text-gray-400 mt-6">
          Already have an account?{" "}
          <a href="/login"
             className="text-indigo-500 font-medium hover:text-purple-600 hover:underline transition-colors">
            Login
          </a>
        </p>
      </div>

      {/* Keyframe for fade-in animation */}
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(18px) scale(0.98); }
          to   { opacity: 1; transform: translateY(0)    scale(1);    }
        }
      `}</style>
    </div>
  );
}