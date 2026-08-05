import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ArrowLeft, Mail, Lock, User, Eye, EyeOff, Loader2, Sparkles } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Checkbox } from "@/components/ui/checkbox";

/* ─────────────────────────────────────
   7 luxury host property backgrounds
───────────────────────────────────── */
const SCENES = [
  { url: "https://images.unsplash.com/photo-1613977257592-4a9a32f9141b?auto=format&fit=crop&w=1920&q=80", label: "Luxury Villa", loc: "Assagao, Goa" },
  { url: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1920&q=80", label: "Beachfront Property", loc: "Palolem, Goa" },
  { url: "https://images.unsplash.com/photo-1604328698692-f76ea9498e76?auto=format&fit=crop&w=1920&q=80", label: "Modern Apartment", loc: "Bandra, Mumbai" },
  { url: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1920&q=80", label: "Rooftop Penthouse", loc: "Indiranagar, Bengaluru" },
  { url: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=1920&q=80", label: "Designer Workspace", loc: "Siolim, Goa" },
  { url: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1920&q=80", label: "Mountain Cabin", loc: "Manali, Himachal" },
  { url: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1920&q=80", label: "Host Hospitality", loc: "Vagator, Goa" },
];

type ViewState = "landing" | "login" | "signup";

/* ─────────────────────────────────────
   Liquid Glass CSS styles (injected)
───────────────────────────────────── */
const LIQUID_GLASS_STYLES = `
  /* ── Ken Burns pan ── */
  @keyframes kb { 0%{transform:scale(1.06) translate(0,0)} 50%{transform:scale(1.13) translate(-1.2%,-0.6%)} 100%{transform:scale(1.06) translate(0,0)} }
  @keyframes drift { 0%{transform:translate(0,0) scale(1)} 50%{transform:translate(28px,-18px) scale(1.1)} 100%{transform:translate(0,0) scale(1)} }
  @keyframes float-up { 0%{transform:translateY(0) scale(1);opacity:0} 15%{opacity:0.5} 85%{opacity:0.2} 100%{transform:translateY(-90px) scale(0.5);opacity:0} }
  @keyframes slide-card { from{opacity:0;transform:translateY(18px) scale(0.97)} to{opacity:1;transform:translateY(0) scale(1)} }
  @keyframes pulse-ring { 0%,100%{box-shadow:0 0 0 0 rgba(251,191,36,0)} 50%{box-shadow:0 0 0 4px rgba(251,191,36,0.15)} }

  .kb-scene { animation: kb 30s ease-in-out infinite; }
  .ambient-orb { animation: drift ease-in-out infinite; }
  .float-particle { animation: float-up linear infinite; }
  .card-enter { animation: slide-card 0.55s cubic-bezier(0.22,1,0.36,1) both; }

  /* ── Apple Liquid Glass card ── */
  .lg-card {
    position: relative;
    background: linear-gradient(
      145deg,
      rgba(255,255,255,0.18) 0%,
      rgba(255,255,255,0.06) 40%,
      rgba(255,255,255,0.04) 60%,
      rgba(255,255,255,0.12) 100%
    );
    backdrop-filter: blur(32px) saturate(1.8) brightness(1.05);
    -webkit-backdrop-filter: blur(32px) saturate(1.8) brightness(1.05);
    border-radius: 28px;
    border: 1px solid rgba(255,255,255,0.22);
    box-shadow:
      /* outer depth shadow */
      0 32px 80px rgba(0,0,0,0.45),
      0 8px 24px rgba(0,0,0,0.3),
      /* inner top-left specular highlight (light hitting glass edge) */
      inset 0 1.5px 0 rgba(255,255,255,0.55),
      inset 1.5px 0 0 rgba(255,255,255,0.25),
      /* inner bottom-right shadow (thickness illusion) */
      inset 0 -1px 0 rgba(0,0,0,0.15),
      inset -1px 0 0 rgba(0,0,0,0.08);
    overflow: hidden;
  }

  /* Top specular glint strip */
  .lg-card::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.7) 30%, rgba(255,255,255,0.9) 50%, rgba(255,255,255,0.7) 70%, transparent 100%);
    border-radius: 28px 28px 0 0;
    z-index: 1;
    pointer-events: none;
  }

  /* Subtle inner light glow from top-left */
  .lg-card::after {
    content: '';
    position: absolute;
    top: -60px; left: -60px;
    width: 200px; height: 200px;
    background: radial-gradient(circle, rgba(255,255,255,0.12) 0%, transparent 70%);
    pointer-events: none;
    z-index: 0;
  }

  /* ── Liquid Glass INPUT ── */
  .lg-input {
    width: 100%;
    height: 48px;
    border-radius: 14px;
    border: 1px solid rgba(255,255,255,0.20);
    background: linear-gradient(135deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.05) 100%);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    color: rgba(255,255,255,0.92);
    font-size: 13px;
    padding: 0 44px 0 44px;
    outline: none;
    transition: all 0.22s ease;
    box-shadow:
      inset 0 1px 0 rgba(255,255,255,0.3),
      inset 0 -1px 0 rgba(0,0,0,0.12),
      0 2px 8px rgba(0,0,0,0.15);
  }
  .lg-input::placeholder { color: rgba(255,255,255,0.3); }
  .lg-input:focus {
    border-color: rgba(251,191,36,0.65);
    box-shadow:
      inset 0 1px 0 rgba(255,255,255,0.35),
      inset 0 -1px 0 rgba(0,0,0,0.1),
      0 0 0 3.5px rgba(251,191,36,0.18),
      0 0 20px rgba(251,191,36,0.12),
      0 2px 8px rgba(0,0,0,0.2);
    background: linear-gradient(135deg, rgba(255,255,255,0.16) 0%, rgba(255,255,255,0.08) 100%);
  }

  /* ── Liquid Glass PRIMARY BUTTON ── */
  .lg-btn-primary {
    position: relative;
    width: 100%;
    height: 48px;
    border-radius: 16px;
    border: none;
    background: linear-gradient(145deg, #fbbf24 0%, #f59e0b 45%, #d97706 100%);
    color: rgba(0,0,0,0.88);
    font-size: 13.5px;
    font-weight: 700;
    letter-spacing: 0.015em;
    cursor: pointer;
    overflow: hidden;
    transition: all 0.25s cubic-bezier(0.34,1.56,0.64,1);
    box-shadow:
      0 1px 0 rgba(255,255,255,0.5) inset,
      0 -1px 0 rgba(0,0,0,0.2) inset,
      0 8px 24px rgba(251,191,36,0.35),
      0 2px 6px rgba(251,191,36,0.25);
  }
  .lg-btn-primary::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 50%;
    background: linear-gradient(to bottom, rgba(255,255,255,0.32), transparent);
    border-radius: 16px 16px 0 0;
    pointer-events: none;
  }
  .lg-btn-primary:hover {
    transform: translateY(-2px) scale(1.01);
    box-shadow:
      0 1px 0 rgba(255,255,255,0.55) inset,
      0 -1px 0 rgba(0,0,0,0.2) inset,
      0 14px 36px rgba(251,191,36,0.45),
      0 4px 12px rgba(251,191,36,0.3);
  }
  .lg-btn-primary:active {
    transform: translateY(0) scale(0.99);
    transition-duration: 0.08s;
  }
  .lg-btn-primary:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }

  /* ── Liquid Glass SECONDARY BUTTON ── */
  .lg-btn-secondary {
    position: relative;
    width: 100%;
    height: 48px;
    border-radius: 16px;
    border: 1px solid rgba(255,255,255,0.22);
    background: linear-gradient(145deg, rgba(255,255,255,0.14) 0%, rgba(255,255,255,0.04) 100%);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    color: rgba(255,255,255,0.88);
    font-size: 13.5px;
    font-weight: 600;
    cursor: pointer;
    overflow: hidden;
    transition: all 0.25s cubic-bezier(0.34,1.56,0.64,1);
    box-shadow:
      inset 0 1px 0 rgba(255,255,255,0.38),
      inset 0 -1px 0 rgba(0,0,0,0.12),
      0 4px 16px rgba(0,0,0,0.2);
  }
  .lg-btn-secondary::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 50%;
    background: linear-gradient(to bottom, rgba(255,255,255,0.18), transparent);
    border-radius: 16px 16px 0 0;
    pointer-events: none;
  }
  .lg-btn-secondary:hover {
    transform: translateY(-2px) scale(1.01);
    background: linear-gradient(145deg, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0.10) 100%);
    border-color: rgba(255,255,255,0.32);
    box-shadow:
      inset 0 1px 0 rgba(255,255,255,0.45),
      inset 0 -1px 0 rgba(0,0,0,0.1),
      0 8px 24px rgba(0,0,0,0.28);
  }
  .lg-btn-secondary:active {
    transform: translateY(0) scale(0.99);
    transition-duration: 0.08s;
  }

  /* ── Liquid Glass TOGGLE PILL ── */
  .lg-toggle {
    display: flex;
    border-radius: 20px;
    border: 1px solid rgba(255,255,255,0.16);
    background: linear-gradient(135deg, rgba(255,255,255,0.07), rgba(255,255,255,0.03));
    backdrop-filter: blur(12px);
    padding: 3px;
    box-shadow: inset 0 1px 0 rgba(255,255,255,0.2), 0 2px 8px rgba(0,0,0,0.2);
  }
  .lg-toggle-btn {
    flex: 1;
    padding: 7px 14px;
    border-radius: 16px;
    border: none;
    font-size: 11.5px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.22s cubic-bezier(0.34,1.56,0.64,1);
    background: transparent;
    color: rgba(255,255,255,0.45);
  }
  .lg-toggle-btn.active {
    background: linear-gradient(145deg, #fbbf24 0%, #f59e0b 100%);
    color: rgba(0,0,0,0.85);
    box-shadow: 0 1px 0 rgba(255,255,255,0.4) inset, 0 -1px 0 rgba(0,0,0,0.15) inset, 0 2px 8px rgba(251,191,36,0.4);
  }
  .lg-toggle-btn:hover:not(.active) { color: rgba(255,255,255,0.75); }

  /* ── Liquid Glass SSO BUTTON ── */
  .lg-sso-btn {
    position: relative;
    flex: 1;
    height: 44px;
    border-radius: 14px;
    border: 1px solid rgba(255,255,255,0.18);
    background: linear-gradient(145deg, rgba(255,255,255,0.13) 0%, rgba(255,255,255,0.04) 100%);
    backdrop-filter: blur(14px);
    -webkit-backdrop-filter: blur(14px);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 7px;
    font-size: 11.5px;
    font-weight: 600;
    color: rgba(255,255,255,0.72);
    cursor: pointer;
    overflow: hidden;
    transition: all 0.22s cubic-bezier(0.34,1.56,0.64,1);
    box-shadow:
      inset 0 1px 0 rgba(255,255,255,0.32),
      inset 0 -1px 0 rgba(0,0,0,0.1),
      0 2px 10px rgba(0,0,0,0.18);
  }
  .lg-sso-btn::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 50%;
    background: linear-gradient(to bottom, rgba(255,255,255,0.15), transparent);
    border-radius: 14px 14px 0 0;
    pointer-events: none;
  }
  .lg-sso-btn:hover {
    transform: translateY(-2px);
    background: linear-gradient(145deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.10) 100%);
    color: rgba(255,255,255,0.92);
    border-color: rgba(255,255,255,0.28);
    box-shadow:
      inset 0 1px 0 rgba(255,255,255,0.4),
      inset 0 -1px 0 rgba(0,0,0,0.08),
      0 6px 18px rgba(0,0,0,0.25);
  }
  .lg-sso-btn:active { transform: translateY(0); transition-duration: 0.08s; }

  /* ── Floating label ── */
  .lg-label {
    position: absolute;
    left: 44px;
    font-size: 11px;
    font-weight: 500;
    pointer-events: none;
    transition: all 0.18s ease;
    color: rgba(255,255,255,0.38);
    top: 50%;
    transform: translateY(-50%);
  }
  .lg-label.active {
    top: 6px;
    transform: translateY(0);
    font-size: 9.5px;
    color: rgba(251,191,36,0.85);
  }
`;

/* ─────────────────────────────────────
   Particle
───────────────────────────────────── */
function Particle({ i }: { i: number }) {
  return (
    <div
      className="float-particle absolute rounded-full pointer-events-none"
      style={{
        left: `${8 + (i * 11) % 82}%`,
        top: `${10 + (i * 19) % 75}%`,
        width: `${2 + (i % 3)}px`,
        height: `${2 + (i % 3)}px`,
        background: `rgba(255,255,255,${0.1 + (i % 4) * 0.05})`,
        animationDelay: `${i * 0.8}s`,
        animationDuration: `${7 + (i % 7)}s`,
      }}
    />
  );
}

/* ─────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────── */
export function HostAuthExperience() {
  const { signIn, signUp } = useAuth();
  const { toast } = useToast();

  const [sceneIdx, setSceneIdx] = useState(0);
  const [fadingIdx, setFadingIdx] = useState<number | null>(null);
  const [view, setView] = useState<ViewState>("landing");
  const [flipPhase, setFlipPhase] = useState<"idle" | "out" | "in">("idle");
  const [px, setPx] = useState(0);
  const [py, setPy] = useState(0);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  // Scene carousel
  useEffect(() => {
    const id = setInterval(() => {
      const next = (sceneIdx + 1) % SCENES.length;
      setFadingIdx(next);
      setTimeout(() => { setSceneIdx(next); setFadingIdx(null); }, 1400);
    }, 13000);
    return () => clearInterval(id);
  }, [sceneIdx]);

  // Parallax
  useEffect(() => {
    const h = (e: MouseEvent) => {
      setPx((e.clientX / window.innerWidth - 0.5) * 18);
      setPy((e.clientY / window.innerHeight - 0.5) * 18);
    };
    window.addEventListener("mousemove", h);
    return () => window.removeEventListener("mousemove", h);
  }, []);

  // 3D flip
  const flipTo = useCallback((target: ViewState) => {
    if (flipPhase !== "idle" || target === view) return;
    setFlipPhase("out");
    setTimeout(() => {
      setView(target);
      setFlipPhase("in");
      setTimeout(() => setFlipPhase("idle"), 400);
    }, 360);
  }, [flipPhase, view]);

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
        toast({ title: "Host account created!", description: "Check your inbox to confirm your email, then log in." });
        flipTo("login");
        setName(""); setEmail(""); setPassword(""); setAgreed(false);
      }
    } catch (err: any) {
      toast({ title: "Authentication failed", description: err?.message ?? "Please check your details.", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  const cardTransform =
    flipPhase === "out"
      ? "perspective(1200px) rotateY(-85deg) scale(0.95)"
      : "perspective(1200px) rotateY(0deg) scale(1)";
  const cardOpacity = flipPhase === "out" ? 0.2 : 1;

  return (
    <>
      <style>{LIQUID_GLASS_STYLES}</style>

      {/* ── Full-screen wrapper ── */}
      <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden" style={{ background: "#080c14" }}>

        {/* ── Background scenes ── */}
        <div
          className="absolute inset-[-4%]"
          style={{ transform: `translate3d(${px * 0.55}px,${py * 0.55}px,0)` }}
        >
          <div
            key={`scene-${sceneIdx}`}
            className="kb-scene absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${SCENES[sceneIdx].url})` }}
          />
          {fadingIdx !== null && (
            <div
              className="kb-scene absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: `url(${SCENES[fadingIdx].url})`,
                opacity: 1,
                animation: "none",
                transition: "opacity 1.4s ease",
              }}
            />
          )}
        </div>

        {/* ── Overlays: deep desaturation + dual vignette ── */}
        <div className="absolute inset-0" style={{ backdropFilter: "blur(16px) saturate(0.7) brightness(0.55)", WebkitBackdropFilter: "blur(16px) saturate(0.7) brightness(0.55)" }} />
        <div className="absolute inset-0" style={{ background: "linear-gradient(170deg, rgba(5,8,20,0.75) 0%, rgba(5,8,20,0.25) 40%, rgba(5,8,20,0.65) 100%)" }} />
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 70% 0%, rgba(59,130,246,0.12) 0%, transparent 55%)" }} />

        {/* ── Ambient light orbs ── */}
        <div className="ambient-orb absolute rounded-full pointer-events-none" style={{ top: "-150px", left: "-100px", width: "480px", height: "480px", background: "radial-gradient(circle, rgba(59,130,246,0.13) 0%, transparent 70%)", filter: "blur(60px)", animationDuration: "20s", animationDelay: "0s" }} />
        <div className="ambient-orb absolute rounded-full pointer-events-none" style={{ bottom: "-160px", right: "-80px", width: "440px", height: "440px", background: "radial-gradient(circle, rgba(245,158,11,0.11) 0%, transparent 70%)", filter: "blur(55px)", animationDuration: "25s", animationDelay: "8s" }} />
        <div className="ambient-orb absolute rounded-full pointer-events-none" style={{ top: "35%", right: "-60px", width: "280px", height: "280px", background: "radial-gradient(circle, rgba(99,102,241,0.10) 0%, transparent 70%)", filter: "blur(50px)", animationDuration: "18s", animationDelay: "3s" }} />

        {/* ── Floating particles ── */}
        {Array.from({ length: 20 }).map((_, i) => <Particle key={i} i={i} />)}

        {/* ── Wayzyy wordmark ── */}
        <div className="absolute top-6 left-7 flex items-center gap-2 z-20">
          <img src="/favicon.svg" alt="Wayzyy" className="h-7 w-7 rounded-full" />
          <span style={{ fontFamily: "'Raleway', sans-serif", fontWeight: 700, color: "rgba(255,255,255,0.88)", fontSize: "15px", letterSpacing: "-0.01em" }}>wayzyy</span>
          <span style={{ marginLeft: "4px", borderRadius: "20px", border: "1px solid rgba(251,191,36,0.35)", background: "rgba(251,191,36,0.1)", padding: "2px 8px", fontSize: "9.5px", fontWeight: 700, color: "rgba(251,191,36,0.9)", letterSpacing: "0.08em" }}>HOST</span>
        </div>

        {/* ── Back link ── */}
        <Link to="/" className="absolute top-6 right-7 z-20 flex items-center gap-1.5" style={{ fontSize: "11px", color: "rgba(255,255,255,0.35)", textDecoration: "none", transition: "color 0.2s" }}
          onMouseEnter={e => (e.currentTarget.style.color = "rgba(255,255,255,0.65)")}
          onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.35)")}
        >
          <ArrowLeft style={{ width: "13px", height: "13px" }} />
          wayzyy.com
        </Link>

        {/* ── Scene dots ── */}
        <div className="absolute bottom-6 left-7 z-20 flex items-center gap-2">
          {SCENES.map((s, i) => (
            <div key={i} style={{ height: "3px", borderRadius: "2px", transition: "all 0.6s ease", width: i === sceneIdx ? "22px" : "3px", background: i === sceneIdx ? "#fbbf24" : "rgba(255,255,255,0.2)" }} />
          ))}
          <span style={{ marginLeft: "6px", fontSize: "10.5px", color: "rgba(255,255,255,0.38)", fontWeight: 500 }}>
            {SCENES[sceneIdx].label} <span style={{ color: "rgba(255,255,255,0.18)" }}>·</span> {SCENES[sceneIdx].loc}
          </span>
        </div>

        {/* ══════════════════════════════════
            CARD — 3D flip wrapper
        ══════════════════════════════════ */}
        <div
          className="relative z-10 w-full"
          style={{
            maxWidth: "420px",
            padding: "0 16px",
            transform: cardTransform,
            opacity: cardOpacity,
            transition: "transform 360ms cubic-bezier(0.4,0,0.2,1), opacity 360ms ease",
            transformOrigin: "40% center",
          }}
        >

          {/* ════════ LANDING ════════ */}
          {view === "landing" && (
            <div className="lg-card card-enter" style={{ padding: "40px 36px 36px" }}>
              <div style={{ position: "relative", zIndex: 2 }}>
                {/* Badge */}
                <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", borderRadius: "20px", border: "1px solid rgba(251,191,36,0.35)", background: "rgba(251,191,36,0.10)", padding: "4px 12px", fontSize: "10px", fontWeight: 700, color: "rgba(251,191,36,0.9)", letterSpacing: "0.08em", marginBottom: "20px" }}>
                  <Sparkles style={{ width: "11px", height: "11px" }} />
                  WAYZYY FOR HOSTS
                </div>

                {/* Headline */}
                <h1 style={{ fontFamily: "'Raleway', sans-serif", fontSize: "40px", fontWeight: 800, lineHeight: 1.1, letterSpacing: "-0.025em", color: "rgba(255,255,255,0.95)", margin: "0 0 8px" }}>
                  Host Smarter.<br />
                  <span style={{ background: "linear-gradient(135deg, #fde68a 0%, #fbbf24 35%, #f59e0b 65%, #fde68a 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                    Grow Faster.
                  </span>
                </h1>
                <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.48)", lineHeight: 1.65, margin: "0 0 28px", maxWidth: "300px" }}>
                  Manage bookings, guests, pricing and payouts from one beautiful dashboard.
                </p>

                {/* Social proof pills */}
                <div style={{ display: "flex", gap: "12px", marginBottom: "28px", flexWrap: "wrap" }}>
                  {["✦ Zero commission", "✦ Direct payouts", "✦ Smart pricing"].map(t => (
                    <span key={t} style={{ fontSize: "10px", color: "rgba(255,255,255,0.35)", fontWeight: 500 }}>{t}</span>
                  ))}
                </div>

                {/* CTA buttons */}
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  <button className="lg-btn-primary" onClick={() => flipTo("login")} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                    Log In to Host Dashboard
                    <ArrowRight style={{ width: "15px", height: "15px" }} />
                  </button>
                  <button className="lg-btn-secondary" onClick={() => flipTo("signup")} style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                    Create Host Account
                  </button>
                </div>

                <p style={{ textAlign: "center", fontSize: "10.5px", color: "rgba(255,255,255,0.22)", marginTop: "20px", paddingTop: "16px", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
                  Trusted by 200+ property hosts across India
                </p>
              </div>
            </div>
          )}

          {/* ════════ LOGIN / SIGNUP ════════ */}
          {(view === "login" || view === "signup") && (
            <div className="lg-card card-enter" style={{ padding: "32px 32px 28px" }}>
              <div style={{ position: "relative", zIndex: 2 }}>

                {/* Top bar */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "24px" }}>
                  <button onClick={() => flipTo("landing")} style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "11px", color: "rgba(255,255,255,0.35)", background: "none", border: "none", cursor: "pointer", padding: "0", transition: "color 0.2s" }}
                    onMouseEnter={e => ((e.currentTarget as HTMLButtonElement).style.color = "rgba(255,255,255,0.65)")}
                    onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.color = "rgba(255,255,255,0.35)")}
                  >
                    <ArrowLeft style={{ width: "12px", height: "12px" }} /> Back
                  </button>

                  <div className="lg-toggle">
                    <button className={`lg-toggle-btn${view === "login" ? " active" : ""}`} onClick={() => flipTo("login")}>Log In</button>
                    <button className={`lg-toggle-btn${view === "signup" ? " active" : ""}`} onClick={() => flipTo("signup")}>Sign Up</button>
                  </div>
                </div>

                {/* Heading */}
                <div style={{ marginBottom: "22px" }}>
                  <h2 style={{ fontFamily: "'Raleway', sans-serif", fontSize: "22px", fontWeight: 800, color: "rgba(255,255,255,0.95)", margin: "0 0 4px", letterSpacing: "-0.02em" }}>
                    {view === "login" ? "Welcome back" : "Join Wayzyy Hosts"}
                  </h2>
                  <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.38)", lineHeight: 1.6, margin: 0 }}>
                    {view === "login"
                      ? "Sign in to manage your properties, bookings and payouts."
                      : "Create your free host account. Zero commissions, always."}
                  </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "12px" }} noValidate>

                  {/* Name */}
                  {view === "signup" && (
                    <div style={{ position: "relative" }}>
                      <span className={`lg-label${name || focusedField === "name" ? " active" : ""}`}>Full Name</span>
                      <User style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", width: "16px", height: "16px", color: "rgba(255,255,255,0.3)", pointerEvents: "none" }} />
                      <input
                        className="lg-input"
                        type="text"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        onFocus={() => setFocusedField("name")}
                        onBlur={() => setFocusedField(null)}
                        required
                        placeholder={focusedField === "name" || name ? "" : "Full Name"}
                      />
                    </div>
                  )}

                  {/* Email */}
                  <div style={{ position: "relative" }}>
                    <span className={`lg-label${email || focusedField === "email" ? " active" : ""}`}>Email Address</span>
                    <Mail style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", width: "16px", height: "16px", color: "rgba(255,255,255,0.3)", pointerEvents: "none" }} />
                    <input
                      className="lg-input"
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      onFocus={() => setFocusedField("email")}
                      onBlur={() => setFocusedField(null)}
                      required
                      placeholder={focusedField === "email" || email ? "" : "your@email.com"}
                    />
                  </div>

                  {/* Password */}
                  <div style={{ position: "relative" }}>
                    <span className={`lg-label${password || focusedField === "password" ? " active" : ""}`}>Password</span>
                    <Lock style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", width: "16px", height: "16px", color: "rgba(255,255,255,0.3)", pointerEvents: "none" }} />
                    <input
                      className="lg-input"
                      type={showPwd ? "text" : "password"}
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      onFocus={() => setFocusedField("password")}
                      onBlur={() => setFocusedField(null)}
                      required
                      minLength={6}
                      placeholder={focusedField === "password" || password ? "" : "Min. 6 characters"}
                      style={{ paddingRight: "44px" }}
                    />
                    <button
                      type="button"
                      tabIndex={-1}
                      onClick={() => setShowPwd(!showPwd)}
                      style={{ position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.3)", padding: "0", transition: "color 0.2s" }}
                      onMouseEnter={e => ((e.currentTarget as HTMLButtonElement).style.color = "rgba(255,255,255,0.65)")}
                      onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.color = "rgba(255,255,255,0.3)")}
                    >
                      {showPwd ? <EyeOff style={{ width: "15px", height: "15px" }} /> : <Eye style={{ width: "15px", height: "15px" }} />}
                    </button>
                  </div>

                  {/* Forgot password */}
                  {view === "login" && (
                    <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "-4px" }}>
                      <button type="button" style={{ fontSize: "11px", color: "rgba(255,255,255,0.32)", background: "none", border: "none", cursor: "pointer", padding: 0, transition: "color 0.2s" }}
                        onMouseEnter={e => ((e.currentTarget as HTMLButtonElement).style.color = "rgba(251,191,36,0.8)")}
                        onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.color = "rgba(255,255,255,0.32)")}
                      >
                        Forgot password?
                      </button>
                    </div>
                  )}

                  {/* Terms */}
                  {view === "signup" && (
                    <div style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                      <Checkbox
                        id="lg-terms"
                        checked={agreed}
                        onCheckedChange={v => setAgreed(Boolean(v))}
                        className="mt-0.5 border-white/25 data-[state=checked]:bg-amber-400 data-[state=checked]:border-amber-400 data-[state=checked]:text-slate-900 shrink-0"
                      />
                      <label htmlFor="lg-terms" style={{ fontSize: "10.5px", color: "rgba(255,255,255,0.38)", lineHeight: 1.6, cursor: "pointer", userSelect: "none" }}>
                        I accept the{" "}
                        <Link to="/host-terms" target="_blank" style={{ color: "rgba(251,191,36,0.75)", textDecoration: "underline" }}>Host Terms</Link>,{" "}
                        <Link to="/guest-terms" target="_blank" style={{ color: "rgba(251,191,36,0.75)", textDecoration: "underline" }}>Guest Terms</Link>, and{" "}
                        <Link to="/policies/privacy-policy" target="_blank" style={{ color: "rgba(251,191,36,0.75)", textDecoration: "underline" }}>Privacy Policy</Link>.
                      </label>
                    </div>
                  )}

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={submitting}
                    className="lg-btn-primary"
                    style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", marginTop: "4px" }}
                  >
                    {submitting
                      ? <Loader2 style={{ width: "16px", height: "16px", animation: "spin 1s linear infinite" }} />
                      : <>{view === "login" ? "Log In to Host Dashboard" : "Create Host Account"} <ArrowRight style={{ width: "15px", height: "15px" }} /></>
                    }
                  </button>
                </form>

                {/* SSO */}
                <div style={{ marginTop: "20px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
                    <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.10)" }} />
                    <span style={{ fontSize: "10px", color: "rgba(255,255,255,0.28)", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" }}>or continue with</span>
                    <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.10)" }} />
                  </div>

                  <div style={{ display: "flex", gap: "8px" }}>
                    {/* Google */}
                    <button className="lg-sso-btn" onClick={() => toast({ title: "Google SSO", description: "Coming soon." })}>
                      <svg width="15" height="15" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                      Google
                    </button>

                    {/* Apple */}
                    <button className="lg-sso-btn" onClick={() => toast({ title: "Apple SSO", description: "Coming soon." })}>
                      <svg width="14" height="16" viewBox="0 0 814 1000" fill="rgba(255,255,255,0.85)">
                        <path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76 0-103.7 40.8-165.9 40.8s-105-57.8-155.5-127.4C46 790.7 0 663 0 541.8c0-207.5 135.4-317.3 269-317.3 70.1 0 128.4 46.4 172.5 46.4 42.8 0 110-49 190.5-49 30.2 0 108.2 2.6 168.6 81.2zm-198.5-160.8c-31.1 36.9-82.6 64.8-142.6 64.8-5.1 0-10.2-.3-15.2-.9 1.1-57.7 38.6-114.3 73.3-150.2 38.3-40.3 98.7-69.5 155.2-72.4 1 6.1 1.5 12.2 1.5 18.6 0 55.7-32.1 111.3-72.2 140.1z"/>
                      </svg>
                      Apple
                    </button>

                    {/* Microsoft */}
                    <button className="lg-sso-btn" onClick={() => toast({ title: "Microsoft SSO", description: "Coming soon." })}>
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
            </div>
          )}
        </div>
      </div>
    </>
  );
}
