import { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight, ArrowLeft, Mail, Lock, User, Eye, EyeOff, Loader2, Sparkles,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Checkbox } from "@/components/ui/checkbox";

/* ─────────────────────────────────────────────────────────
   Background scenes – 7 luxury host-related environments
   ───────────────────────────────────────────────────────── */
const SCENES = [
  {
    url: "https://images.unsplash.com/photo-1613977257592-4a9a32f9141b?auto=format&fit=crop&w=1920&q=80",
    label: "Luxury Villa at Sunrise",
    loc: "Assagao, North Goa",
  },
  {
    url: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1920&q=80",
    label: "Beachfront Property",
    loc: "Palolem, South Goa",
  },
  {
    url: "https://images.unsplash.com/photo-1604328698692-f76ea9498e76?auto=format&fit=crop&w=1920&q=80",
    label: "Modern Apartment Interior",
    loc: "Bandra West, Mumbai",
  },
  {
    url: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1920&q=80",
    label: "Rooftop City Penthouse",
    loc: "Indiranagar, Bengaluru",
  },
  {
    url: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=1920&q=80",
    label: "Beautiful Workspace Rental",
    loc: "Siolim, Goa",
  },
  {
    url: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1920&q=80",
    label: "Cozy Mountain Cabin",
    loc: "Manali, Himachal Pradesh",
  },
  {
    url: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1920&q=80",
    label: "Host Welcoming Guests",
    loc: "Vagator, North Goa",
  },
];

type ViewState = "landing" | "login" | "signup";

/* ─────────────────────────────────────────────────────────
   Floating Particle
   ───────────────────────────────────────────────────────── */
function Particle({ idx }: { idx: number }) {
  const style = {
    left: `${10 + (idx * 13) % 80}%`,
    top: `${5 + (idx * 17) % 85}%`,
    width: `${2 + (idx % 3)}px`,
    height: `${2 + (idx % 3)}px`,
    animationDelay: `${idx * 0.7}s`,
    animationDuration: `${8 + (idx % 6)}s`,
  };
  return (
    <div
      className="absolute rounded-full bg-white/20 animate-particle-float pointer-events-none"
      style={style}
    />
  );
}

/* ─────────────────────────────────────────────────────────
   Main Auth Experience Component
   ───────────────────────────────────────────────────────── */
export function HostAuthExperience() {
  const { signIn, signUp } = useAuth();
  const { toast } = useToast();

  // Scene carousel
  const [sceneIdx, setSceneIdx] = useState(0);
  const [nextSceneIdx, setNextSceneIdx] = useState<number | null>(null);
  const [isCrossfading, setIsCrossfading] = useState(false);

  // View state & 3D flip
  const [view, setView] = useState<ViewState>("landing");
  const [pendingView, setPendingView] = useState<ViewState | null>(null);
  const [flipPhase, setFlipPhase] = useState<"idle" | "out" | "in">("idle");

  // Parallax
  const [px, setPx] = useState(0);
  const [py, setPy] = useState(0);

  // Form
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Focus glow
  const [focusedField, setFocusedField] = useState<string | null>(null);

  // ── Scene crossfade every 12 s ──
  useEffect(() => {
    const id = setInterval(() => {
      const next = (sceneIdx + 1) % SCENES.length;
      setNextSceneIdx(next);
      setIsCrossfading(true);
      setTimeout(() => {
        setSceneIdx(next);
        setNextSceneIdx(null);
        setIsCrossfading(false);
      }, 1200);
    }, 12000);
    return () => clearInterval(id);
  }, [sceneIdx]);

  // ── Mouse parallax ──
  useEffect(() => {
    const move = (e: MouseEvent) => {
      const rx = (e.clientX / window.innerWidth - 0.5) * 20;
      const ry = (e.clientY / window.innerHeight - 0.5) * 20;
      setPx(rx);
      setPy(ry);
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  // ── 3D card flip transition ──
  const flipTo = useCallback((target: ViewState) => {
    if (flipPhase !== "idle" || target === view) return;
    setPendingView(target);
    setFlipPhase("out");
    setTimeout(() => {
      setView(target);
      setPendingView(null);
      setFlipPhase("in");
      setTimeout(() => setFlipPhase("idle"), 420);
    }, 380);
  }, [flipPhase, view]);

  // ── Form submit ──
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (view === "signup" && !agreed) {
      toast({ title: "Accept terms", description: "Please accept the Host Terms to continue.", variant: "destructive" });
      return;
    }
    setSubmitting(true);
    try {
      const { error } = view === "signup"
        ? await signUp(email, password, name)
        : await signIn(email, password);
      if (error) throw error;
      if (view === "signup") {
        toast({ title: "Account created!", description: "Check your inbox to confirm your email, then log in." });
        flipTo("login");
        setName(""); setEmail(""); setPassword(""); setAgreed(false);
      }
    } catch (err: any) {
      toast({ title: "Authentication failed", description: err?.message ?? "Please check your details.", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  // ── Card transform based on flip phase ──
  const cardStyle: React.CSSProperties = {
    transform:
      flipPhase === "out"
        ? "perspective(1400px) rotateY(-90deg) scale(0.94)"
        : flipPhase === "in"
        ? "perspective(1400px) rotateY(0deg) scale(1)"
        : "perspective(1400px) rotateY(0deg) scale(1)",
    opacity: flipPhase === "out" ? 0.3 : 1,
    transition: "transform 380ms cubic-bezier(0.4,0,0.2,1), opacity 380ms ease",
    transformOrigin: "left center",
  };

  const scene = SCENES[sceneIdx];
  const nextScene = nextSceneIdx !== null ? SCENES[nextSceneIdx] : null;

  return (
    <>
      {/* ── Inject keyframes ── */}
      <style>{`
        @keyframes ken-burns {
          0%   { transform: scale(1.0) translate(0px, 0px); }
          50%  { transform: scale(1.08) translate(-8px, -4px); }
          100% { transform: scale(1.0) translate(0px, 0px); }
        }
        @keyframes particle-float {
          0%   { transform: translateY(0) scale(1);   opacity: 0; }
          20%  { opacity: 0.6; }
          80%  { opacity: 0.3; }
          100% { transform: translateY(-80px) scale(0.6); opacity: 0; }
        }
        @keyframes ambient-drift {
          0%   { transform: translate(0, 0) scale(1); }
          50%  { transform: translate(30px, -20px) scale(1.12); }
          100% { transform: translate(0, 0) scale(1); }
        }
        @keyframes label-float {
          from { opacity: 0; transform: translateY(4px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes slide-up-in {
          from { opacity: 0; transform: translateY(20px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        .animate-particle-float { animation: particle-float linear infinite; }
        .animate-slide-up-in    { animation: slide-up-in 0.6s cubic-bezier(0.22,1,0.36,1) both; }
        .animate-ken-burns      { animation: ken-burns 28s ease-in-out infinite; }
        .animate-ambient        { animation: ambient-drift 18s ease-in-out infinite; }
      `}</style>

      {/* ══════════════════════════════════════════════════
          FULL-SCREEN WRAPPER
      ══════════════════════════════════════════════════ */}
      <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-slate-950">

        {/* ── Background scene layer ── */}
        <div
          className="absolute inset-0 transition-transform duration-700 ease-out"
          style={{ transform: `translate3d(${px * 0.6}px, ${py * 0.6}px, 0)` }}
        >
          {/* Current scene with Ken Burns */}
          <div
            key={sceneIdx}
            className="absolute inset-[-4%] bg-cover bg-center animate-ken-burns"
            style={{ backgroundImage: `url(${scene.url})` }}
          />
          {/* Next scene crossfading in */}
          {nextScene && (
            <div
              className="absolute inset-[-4%] bg-cover bg-center animate-ken-burns"
              style={{
                backgroundImage: `url(${nextScene.url})`,
                opacity: isCrossfading ? 1 : 0,
                transition: "opacity 1200ms ease-in-out",
              }}
            />
          )}
        </div>

        {/* ── Atmospheric overlays ── */}
        {/* Deep desaturation + darkening */}
        <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-[14px]" />
        {/* Gradient vignette */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-950/30 to-slate-950/85" />
        {/* Horizontal warm/cool split for depth */}
        <div className="absolute inset-0 bg-gradient-to-tr from-blue-950/30 via-transparent to-amber-900/15" />

        {/* ── Ambient light leaks ── */}
        <div
          className="pointer-events-none absolute top-[-180px] left-[-120px] h-[520px] w-[520px] rounded-full bg-blue-500/12 blur-[140px] animate-ambient"
          style={{ animationDelay: "0s" }}
        />
        <div
          className="pointer-events-none absolute bottom-[-200px] right-[-100px] h-[480px] w-[480px] rounded-full bg-amber-400/10 blur-[130px] animate-ambient"
          style={{ animationDelay: "9s" }}
        />
        <div
          className="pointer-events-none absolute top-[30%] right-[-80px] h-[300px] w-[300px] rounded-full bg-indigo-500/8 blur-[100px] animate-ambient"
          style={{ animationDelay: "4s" }}
        />

        {/* ── Floating particles ── */}
        {Array.from({ length: 18 }).map((_, i) => <Particle key={i} idx={i} />)}

        {/* ── Wayzyy logo wordmark ── */}
        <div className="absolute top-7 left-8 flex items-center gap-2.5 z-10">
          <img src="/favicon.svg" alt="Wayzyy" className="h-7 w-7 rounded-full" />
          <span className="font-display text-base font-bold tracking-tight text-white/90">wayzyy</span>
          <span className="ml-1 rounded-full border border-amber-400/40 bg-amber-400/10 px-2 py-0.5 text-[10px] font-semibold text-amber-300 tracking-wide">
            HOST
          </span>
        </div>

        {/* ── Scene caption ── */}
        <div className="absolute bottom-7 left-8 hidden sm:flex items-center gap-2.5 z-10">
          <div className="flex gap-1.5">
            {SCENES.map((_, i) => (
              <div
                key={i}
                className={`h-1 rounded-full transition-all duration-700 ${
                  i === sceneIdx ? "w-6 bg-amber-400" : "w-1 bg-white/25"
                }`}
              />
            ))}
          </div>
          <span className="text-[11px] text-white/50 font-medium ml-1">
            {scene.label} <span className="text-white/25">·</span> {scene.loc}
          </span>
        </div>

        {/* ── Back to Wayzyy link ── */}
        <Link
          to="/"
          className="absolute top-7 right-8 z-10 flex items-center gap-1.5 text-[11px] text-white/40 hover:text-white/70 transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          wayzyy.com
        </Link>

        {/* ══════════════════════════════════════════════════
            CONTENT PANEL – 3D card
        ══════════════════════════════════════════════════ */}
        <div
          className="relative z-10 w-full max-w-[420px] mx-auto px-4"
          style={cardStyle}
        >

          {/* ────────────── LANDING ────────────── */}
          {view === "landing" && (
            <div className="animate-slide-up-in rounded-3xl border border-white/12 bg-white/[0.07] backdrop-blur-2xl shadow-2xl shadow-black/40 px-8 py-10 flex flex-col items-center text-center gap-7">
              {/* Badge */}
              <div className="flex items-center gap-1.5 rounded-full border border-amber-400/30 bg-amber-400/10 px-3.5 py-1 text-[11px] font-semibold text-amber-300 tracking-wider">
                <Sparkles className="h-3.5 w-3.5" />
                WAYZYY FOR HOSTS
              </div>

              {/* Headline */}
              <div className="space-y-3">
                <h1 className="font-display text-4xl sm:text-[44px] font-bold leading-[1.1] tracking-tight text-white">
                  Host Smarter.<br />
                  <span
                    className="text-transparent bg-clip-text"
                    style={{ backgroundImage: "linear-gradient(135deg, #f59e0b 0%, #fbbf24 40%, #fde68a 70%, #f59e0b 100%)" }}
                  >
                    Grow Faster.
                  </span>
                </h1>
                <p className="text-sm text-white/55 leading-relaxed font-normal max-w-[300px] mx-auto">
                  Manage bookings, guests, pricing and payouts from one beautiful dashboard.
                </p>
              </div>

              {/* Value pillars */}
              <div className="flex gap-4 text-[11px] text-white/40 font-medium">
                <span>✦ Zero commission</span>
                <span>✦ Direct payouts</span>
                <span>✦ Smart pricing</span>
              </div>

              {/* Buttons */}
              <div className="w-full flex flex-col gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => flipTo("login")}
                  className="group relative w-full h-[48px] rounded-2xl font-semibold text-sm tracking-wide text-slate-950 overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-amber-500/25 active:translate-y-0"
                  style={{ background: "linear-gradient(135deg, #f59e0b 0%, #fbbf24 60%, #f59e0b 100%)" }}
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    Log In <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => flipTo("signup")}
                  className="w-full h-[48px] rounded-2xl border border-white/20 bg-white/8 hover:bg-white/14 text-white font-semibold text-sm tracking-wide backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 cursor-pointer"
                >
                  Create Account
                </button>
              </div>

              <p className="text-[11px] text-white/25 pt-1 border-t border-white/8 w-full text-center">
                Trusted by 200+ property hosts across India
              </p>
            </div>
          )}

          {/* ────────────── LOGIN / SIGNUP ────────────── */}
          {(view === "login" || view === "signup") && (
            <div className="animate-slide-up-in rounded-3xl border border-white/12 bg-white/[0.07] backdrop-blur-2xl shadow-2xl shadow-black/40 px-8 py-8 flex flex-col gap-6">

              {/* Top bar */}
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => flipTo("landing")}
                  className="flex items-center gap-1.5 text-[11px] text-white/40 hover:text-white/70 transition-colors cursor-pointer"
                >
                  <ArrowLeft className="h-3.5 w-3.5" /> Back
                </button>

                {/* Login / Signup toggle */}
                <div className="flex rounded-full border border-white/15 bg-white/5 p-1">
                  <button
                    type="button"
                    onClick={() => flipTo("login")}
                    className={`px-4 py-1.5 rounded-full text-[11px] font-semibold transition-all duration-300 cursor-pointer ${
                      view === "login"
                        ? "bg-amber-400 text-slate-900 shadow"
                        : "text-white/50 hover:text-white/80"
                    }`}
                  >
                    Log In
                  </button>
                  <button
                    type="button"
                    onClick={() => flipTo("signup")}
                    className={`px-4 py-1.5 rounded-full text-[11px] font-semibold transition-all duration-300 cursor-pointer ${
                      view === "signup"
                        ? "bg-amber-400 text-slate-900 shadow"
                        : "text-white/50 hover:text-white/80"
                    }`}
                  >
                    Sign Up
                  </button>
                </div>
              </div>

              {/* Heading */}
              <div>
                <h2 className="font-display text-2xl font-bold text-white leading-tight">
                  {view === "login" ? "Welcome back" : "Join Wayzyy Hosts"}
                </h2>
                <p className="text-[12px] text-white/40 mt-1 leading-relaxed">
                  {view === "login"
                    ? "Sign in to your host dashboard to manage bookings & payouts."
                    : "Create your free host account. No platform commissions, ever."}
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>

                {/* Name (signup only) */}
                {view === "signup" && (
                  <div className="relative">
                    <label
                      htmlFor="auth-name"
                      className={`absolute left-11 text-[10px] font-medium pointer-events-none transition-all duration-200 ${
                        name ? "-top-2.5 text-amber-400" : "top-3.5 text-white/35"
                      }`}
                      style={name ? { animation: "label-float 0.18s ease both" } : {}}
                    >
                      Full Name
                    </label>
                    <User className="absolute left-3.5 top-3.5 h-4 w-4 text-white/30" />
                    <input
                      id="auth-name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      onFocus={() => setFocusedField("name")}
                      onBlur={() => setFocusedField(null)}
                      required
                      placeholder={name ? "" : "Full Name"}
                      className={`w-full h-[46px] rounded-xl border bg-white/5 pl-11 pr-4 text-[13px] text-white placeholder:text-white/25 outline-none transition-all duration-200 ${
                        focusedField === "name"
                          ? "border-amber-400/60 shadow-[0_0_0_3px_rgba(251,191,36,0.12)]"
                          : "border-white/12 hover:border-white/22"
                      }`}
                    />
                  </div>
                )}

                {/* Email */}
                <div className="relative">
                  <label
                    htmlFor="auth-email"
                    className={`absolute left-11 text-[10px] font-medium pointer-events-none transition-all duration-200 ${
                      email ? "-top-2.5 text-amber-400" : "top-3.5 text-white/35"
                    }`}
                  >
                    Email Address
                  </label>
                  <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-white/30" />
                  <input
                    id="auth-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={() => setFocusedField("email")}
                    onBlur={() => setFocusedField(null)}
                    required
                    placeholder={email ? "" : "your@email.com"}
                    className={`w-full h-[46px] rounded-xl border bg-white/5 pl-11 pr-4 text-[13px] text-white placeholder:text-white/25 outline-none transition-all duration-200 ${
                      focusedField === "email"
                        ? "border-amber-400/60 shadow-[0_0_0_3px_rgba(251,191,36,0.12)]"
                        : "border-white/12 hover:border-white/22"
                    }`}
                  />
                </div>

                {/* Password */}
                <div className="relative">
                  <label
                    htmlFor="auth-password"
                    className={`absolute left-11 text-[10px] font-medium pointer-events-none transition-all duration-200 ${
                      password ? "-top-2.5 text-amber-400" : "top-3.5 text-white/35"
                    }`}
                  >
                    Password
                  </label>
                  <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-white/30" />
                  <input
                    id="auth-password"
                    type={showPwd ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => setFocusedField("password")}
                    onBlur={() => setFocusedField(null)}
                    required
                    minLength={6}
                    placeholder={password ? "" : "Min. 6 characters"}
                    className={`w-full h-[46px] rounded-xl border bg-white/5 pl-11 pr-11 text-[13px] text-white placeholder:text-white/25 outline-none transition-all duration-200 ${
                      focusedField === "password"
                        ? "border-amber-400/60 shadow-[0_0_0_3px_rgba(251,191,36,0.12)]"
                        : "border-white/12 hover:border-white/22"
                    }`}
                  />
                  <button
                    type="button"
                    tabIndex={-1}
                    onClick={() => setShowPwd(!showPwd)}
                    className="absolute right-3.5 top-3.5 text-white/30 hover:text-white/60 transition-colors cursor-pointer"
                  >
                    {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>

                {/* Forgot password (login only) */}
                {view === "login" && (
                  <div className="flex justify-end -mt-2">
                    <button type="button" className="text-[11px] text-white/35 hover:text-amber-400 transition-colors cursor-pointer">
                      Forgot password?
                    </button>
                  </div>
                )}

                {/* Terms (signup only) */}
                {view === "signup" && (
                  <div className="flex items-start gap-2.5">
                    <Checkbox
                      id="auth-terms"
                      checked={agreed}
                      onCheckedChange={(v) => setAgreed(Boolean(v))}
                      className="mt-0.5 border-white/25 data-[state=checked]:bg-amber-400 data-[state=checked]:border-amber-400 data-[state=checked]:text-slate-900 shrink-0"
                    />
                    <label htmlFor="auth-terms" className="text-[11px] text-white/40 leading-relaxed cursor-pointer select-none">
                      I accept the{" "}
                      <Link to="/host-terms" target="_blank" className="text-amber-400/80 underline hover:text-amber-300">Host Terms</Link>,{" "}
                      <Link to="/guest-terms" target="_blank" className="text-amber-400/80 underline hover:text-amber-300">Guest Terms</Link>, and{" "}
                      <Link to="/policies/privacy-policy" target="_blank" className="text-amber-400/80 underline hover:text-amber-300">Privacy Policy</Link>.
                    </label>
                  </div>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="group w-full h-[46px] rounded-xl font-semibold text-sm text-slate-900 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-amber-500/25 active:translate-y-0 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                  style={{ background: "linear-gradient(135deg, #f59e0b 0%, #fbbf24 60%, #f59e0b 100%)" }}
                >
                  {submitting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      {view === "login" ? "Log In to Host Dashboard" : "Create Host Account"}
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                    </>
                  )}
                </button>
              </form>

              {/* SSO */}
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-px bg-white/10" />
                  <span className="text-[10px] text-white/30 font-medium tracking-wider uppercase">or continue with</span>
                  <div className="flex-1 h-px bg-white/10" />
                </div>

                <div className="grid grid-cols-3 gap-2.5">
                  {/* Google */}
                  <button
                    type="button"
                    onClick={() => toast({ title: "Google", description: "Google SSO coming soon." })}
                    className="flex h-[42px] items-center justify-center gap-2 rounded-xl border border-white/12 bg-white/5 hover:bg-white/10 hover:-translate-y-0.5 transition-all duration-200 text-[11px] font-medium text-white/60 cursor-pointer"
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Google
                  </button>

                  {/* Apple */}
                  <button
                    type="button"
                    onClick={() => toast({ title: "Apple", description: "Apple ID SSO coming soon." })}
                    className="flex h-[42px] items-center justify-center gap-2 rounded-xl border border-white/12 bg-white/5 hover:bg-white/10 hover:-translate-y-0.5 transition-all duration-200 text-[11px] font-medium text-white/60 cursor-pointer"
                  >
                    <svg width="14" height="15" viewBox="0 0 24 29" fill="currentColor" className="text-white">
                      <path d="M17.05 20.28c-.98 2.37-2.07 4.71-3.67 4.74-1.57.04-2.07-1.01-3.85-1.01-1.78 0-2.33 1.01-3.82.97-1.55-.03-2.74-2.47-3.72-4.84C.56 16.53.14 10.97 2.43 8.07c1.13-1.43 2.82-2.27 4.61-2.27 1.73 0 2.82 1.01 4.25 1.01 1.39 0 2.24-1.01 4.24-1.01 1.61 0 3.11.73 4.23 2.07-3.72 2.05-3.11 7.41.29 9.41zM15 2.95c.83-1.08 1.4-2.58 1.24-4.08-1.22.08-2.7.88-3.56 1.97-.77.97-1.44 2.5-1.24 3.98 1.32.09 2.72-.7 3.56-1.87z"/>
                    </svg>
                    Apple
                  </button>

                  {/* Microsoft */}
                  <button
                    type="button"
                    onClick={() => toast({ title: "Microsoft", description: "Microsoft SSO coming soon." })}
                    className="flex h-[42px] items-center justify-center gap-2 rounded-xl border border-white/12 bg-white/5 hover:bg-white/10 hover:-translate-y-0.5 transition-all duration-200 text-[11px] font-medium text-white/60 cursor-pointer"
                  >
                    <svg width="14" height="14" viewBox="0 0 21 21">
                      <rect x="1" y="1" width="9" height="9" fill="#F25022"/>
                      <rect x="11" y="1" width="9" height="9" fill="#7FBA00"/>
                      <rect x="1" y="11" width="9" height="9" fill="#00A4EF"/>
                      <rect x="11" y="11" width="9" height="9" fill="#FFB900"/>
                    </svg>
                    Microsoft
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
