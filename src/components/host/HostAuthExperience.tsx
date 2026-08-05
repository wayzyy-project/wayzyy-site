import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  Sparkles, Mail, Lock, User, Eye, EyeOff, ArrowRight, Check, Loader2, ArrowLeft
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

const BACKGROUND_SCENES = [
  {
    url: "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1920&q=80",
    title: "Luxury Villa at Sunrise",
    location: "Assagao, Goa",
  },
  {
    url: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1920&q=80",
    title: "Cozy Mountain Cabin",
    location: "Manali, Himachal",
  },
  {
    url: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1920&q=80",
    title: "Beachfront Villa",
    location: "Palolem, South Goa",
  },
  {
    url: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1920&q=80",
    title: "Modern Apartment Interior",
    location: "Bandra, Mumbai",
  },
  {
    url: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1920&q=80",
    title: "Hospitality Lounge & Pool",
    location: "Vagator, Goa",
  },
  {
    url: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1920&q=80",
    title: "Designer Workstation & Rental",
    location: "Siolim, Goa",
  },
  {
    url: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1920&q=80",
    title: "Rooftop City Penthouse",
    location: "Indiranagar, Bengaluru",
  },
];

export function HostAuthExperience() {
  const { signIn, signUp } = useAuth();
  const { toast } = useToast();

  const [currentSceneIdx, setCurrentSceneIdx] = useState(0);
  const [viewState, setViewState] = useState<"landing" | "login" | "signup">("landing");
  const [isFlipping, setIsFlipping] = useState(false);

  // Parallax offsets
  const [parallax, setParallax] = useState({ x: 0, y: 0 });

  // Form states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Background carousel crossfade
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSceneIdx((prev) => (prev + 1) % BACKGROUND_SCENES.length);
    }, 12000);
    return () => clearInterval(timer);
  }, []);

  // Mouse Parallax listener
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX / innerWidth - 0.5) * 16;
      const y = (e.clientY / innerHeight - 0.5) * 16;
      setParallax({ x, y });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const handleTransition = (targetState: "landing" | "login" | "signup") => {
    if (isFlipping || targetState === viewState) return;
    setIsFlipping(true);
    setTimeout(() => {
      setViewState(targetState);
      setIsFlipping(false);
    }, 350);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (viewState === "signup" && !agreedToTerms) {
      toast({
        title: "Terms Agreement Required",
        description: "Please accept the Host Terms & Conditions to create your account.",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);
    try {
      const { error } =
        viewState === "signup"
          ? await signUp(email, password, name)
          : await signIn(email, password);

      if (error) throw error;

      if (viewState === "signup") {
        toast({
          title: "Host Account Created!",
          description: "Check your inbox to confirm your email, then log in to view your dashboard.",
        });
        handleTransition("login");
      }
    } catch (err: any) {
      toast({
        title: "Authentication Failed",
        description: err?.message || "Please check your details and try again.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const scene = BACKGROUND_SCENES[currentSceneIdx];

  return (
    <div className="relative min-h-[92vh] w-full overflow-hidden rounded-3xl border border-white/10 shadow-2xl flex items-center justify-center p-4 sm:p-8 select-none">
      {/* ── Background Imagery with Ken Burns & Parallax ── */}
      <div
        className="absolute inset-0 transition-transform duration-700 ease-out -z-20"
        style={{
          transform: `translate3d(${parallax.x * 0.8}px, ${parallax.y * 0.8}px, 0) scale(1.05)`,
        }}
      >
        {BACKGROUND_SCENES.map((s, idx) => (
          <div
            key={s.url}
            className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out ${
              idx === currentSceneIdx ? "opacity-100 scale-105 animate-ken-burns" : "opacity-0 scale-100"
            }`}
            style={{ backgroundImage: `url(${s.url})` }}
          />
        ))}
      </div>

      {/* ── Atmospheric Overlays: Desaturation, Frosted Vignette, Ambient Particles ── */}
      <div className="absolute inset-0 bg-slate-950/65 backdrop-blur-[12px] -z-10" />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-slate-950/70 -z-10" />

      {/* Floating Ambient Light Leaks */}
      <div className="pointer-events-none absolute -top-40 -left-40 h-96 w-96 rounded-full bg-blue-500/15 blur-[120px] -z-10" />
      <div className="pointer-events-none absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-amber-500/15 blur-[120px] -z-10" />

      {/* Scene Caption indicator */}
      <div className="absolute bottom-6 left-6 hidden sm:flex items-center gap-2 rounded-full border border-white/10 bg-slate-900/60 backdrop-blur-md px-3.5 py-1.5 text-[11px] font-medium text-slate-300 shadow-lg">
        <Sparkles className="h-3.5 w-3.5 text-amber-400 animate-pulse" />
        <span>{scene.title}</span>
        <span className="text-slate-500">·</span>
        <span className="text-slate-400">{scene.location}</span>
      </div>

      {/* ── 3D Rotating Card Container ── */}
      <div
        className="w-full max-w-md perspective-1000"
        style={{
          perspective: "1200px",
        }}
      >
        <div
          className={`w-full transition-all duration-700 ease-in-out transform-gpu ${
            isFlipping ? "rotate-y-90 opacity-40 scale-95" : "rotate-y-0 opacity-100 scale-100"
          }`}
          style={{ transformStyle: "preserve-3d" }}
        >
          {/* ================= STAGE 1: LANDING SCREEN ================= */}
          {viewState === "landing" && (
            <div className="rounded-3xl border border-white/15 bg-slate-900/65 backdrop-blur-xl p-8 sm:p-10 shadow-2xl text-center space-y-8 relative overflow-hidden">
              {/* Subtle Card Glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 via-transparent to-blue-500/10 pointer-events-none" />

              <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-400/10 px-3.5 py-1 text-xs font-semibold text-amber-300 tracking-wide">
                <Sparkles className="h-3.5 w-3.5" /> Wayzyy Host Portal
              </div>

              <div className="space-y-3">
                <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-white leading-tight">
                  Host Smarter. <br />
                  <span className="bg-gradient-to-r from-amber-200 via-orange-300 to-amber-400 bg-clip-text text-transparent">
                    Grow Faster.
                  </span>
                </h1>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-sm mx-auto font-normal">
                  Manage bookings, guests, pricing and payouts from one beautiful dashboard.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-2">
                <button
                  type="button"
                  onClick={() => handleTransition("login")}
                  className="w-full h-11 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-sm shadow-lg shadow-amber-500/20 hover:shadow-amber-500/35 hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
                >
                  Log In <ArrowRight className="h-4 w-4" />
                </button>

                <button
                  type="button"
                  onClick={() => handleTransition("signup")}
                  className="w-full h-11 rounded-2xl border border-white/20 bg-white/5 hover:bg-white/15 text-white font-semibold text-sm backdrop-blur-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
                >
                  Create Account
                </button>
              </div>

              <p className="text-[11px] text-slate-400 pt-2 border-t border-white/10">
                Zero commission cut • Keep 100% of your nightly rates
              </p>
            </div>
          )}

          {/* ================= STAGE 2: LOGIN / SIGNUP FORM ================= */}
          {(viewState === "login" || viewState === "signup") && (
            <div className="rounded-3xl border border-white/15 bg-slate-900/75 backdrop-blur-2xl p-6 sm:p-8 shadow-2xl space-y-6 relative overflow-hidden">
              {/* Back to landing */}
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <button
                  type="button"
                  onClick={() => handleTransition("landing")}
                  className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
                >
                  <ArrowLeft className="h-3.5 w-3.5" /> Back to Overview
                </button>

                <div className="flex rounded-full border border-white/15 bg-white/5 p-1 text-[11px] font-semibold">
                  <button
                    type="button"
                    onClick={() => handleTransition("login")}
                    className={`px-3 py-1 rounded-full transition-all ${
                      viewState === "login"
                        ? "bg-amber-500 text-slate-950 shadow-sm"
                        : "text-slate-300 hover:text-white"
                    }`}
                  >
                    Log In
                  </button>
                  <button
                    type="button"
                    onClick={() => handleTransition("signup")}
                    className={`px-3 py-1 rounded-full transition-all ${
                      viewState === "signup"
                        ? "bg-amber-500 text-slate-950 shadow-sm"
                        : "text-slate-300 hover:text-white"
                    }`}
                  >
                    Sign Up
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <h2 className="font-display text-xl font-bold text-white">
                  {viewState === "login" ? "Sign in to Host Dashboard" : "Create Host Account"}
                </h2>
                <p className="text-xs text-slate-400">
                  {viewState === "login"
                    ? "Enter your credentials to manage your properties and payouts."
                    : "Join India's direct host network with zero platform commissions."}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {viewState === "signup" && (
                  <div className="space-y-1">
                    <div className="relative">
                      <User className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                      <Input
                        placeholder="Full Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="h-[46px] rounded-xl border-white/15 bg-white/5 pl-10 text-xs text-white placeholder:text-slate-400 focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-1">
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                    <Input
                      type="email"
                      placeholder="Email Address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="h-[46px] rounded-xl border-white/15 bg-white/5 pl-10 text-xs text-white placeholder:text-slate-400 focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={6}
                      className="h-[46px] rounded-xl border-white/15 bg-white/5 pl-10 pr-10 text-xs text-white placeholder:text-slate-400 focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-3.5 text-slate-400 hover:text-white"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {viewState === "signup" && (
                  <div className="flex items-start gap-2.5 pt-1">
                    <Checkbox
                      id="terms-check"
                      checked={agreedToTerms}
                      onCheckedChange={(checked) => setAgreedToTerms(Boolean(checked))}
                      className="mt-0.5 border-white/30 data-[state=checked]:bg-amber-500 data-[state=checked]:text-slate-950"
                    />
                    <label htmlFor="terms-check" className="text-[11px] text-slate-300 leading-tight cursor-pointer select-none">
                      I accept the{" "}
                      <Link to="/host-terms" target="_blank" className="text-amber-400 underline hover:text-amber-300">
                        Host Terms
                      </Link>{" "}
                      and{" "}
                      <Link to="/policies/property-import-policy" target="_blank" className="text-amber-400 underline hover:text-amber-300">
                        Import Verification Policy
                      </Link>.
                    </label>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full h-[46px] rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-xs shadow-lg shadow-amber-500/20 hover:shadow-amber-500/35 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
                >
                  {submitting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : viewState === "login" ? (
                    "Log In to Host Portal"
                  ) : (
                    "Create Host Account"
                  )}
                </button>
              </form>

              {/* Social Login Options */}
              <div className="space-y-3 pt-3 border-t border-white/10">
                <p className="text-center text-[10px] uppercase tracking-wider text-slate-400 font-medium">
                  Or continue with SSO
                </p>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => toast({ title: "Google Auth", description: "Google SSO sign-in initiated." })}
                    className="flex h-10 items-center justify-center gap-1.5 rounded-xl border border-white/15 bg-white/5 text-[11px] font-medium text-slate-200 hover:bg-white/15 transition-colors cursor-pointer"
                  >
                    Google
                  </button>
                  <button
                    type="button"
                    onClick={() => toast({ title: "Apple Auth", description: "Apple ID sign-in initiated." })}
                    className="flex h-10 items-center justify-center gap-1.5 rounded-xl border border-white/15 bg-white/5 text-[11px] font-medium text-slate-200 hover:bg-white/15 transition-colors cursor-pointer"
                  >
                    Apple
                  </button>
                  <button
                    type="button"
                    onClick={() => toast({ title: "Microsoft Auth", description: "Microsoft sign-in initiated." })}
                    className="flex h-10 items-center justify-center gap-1.5 rounded-xl border border-white/15 bg-white/5 text-[11px] font-medium text-slate-200 hover:bg-white/15 transition-colors cursor-pointer"
                  >
                    Microsoft
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
