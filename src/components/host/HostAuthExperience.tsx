import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Mail, Lock, User, Eye, EyeOff, Loader2, ArrowRight, ArrowLeft, Sparkles, Check
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Checkbox } from "@/components/ui/checkbox";

type ViewState = "landing" | "login" | "signup";

export function HostAuthExperience() {
  const { signIn, signUp } = useAuth();
  const { toast } = useToast();

  const [view, setView] = useState<ViewState>("landing");
  const [flipDegree, setFlipDegree] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);

  // Form states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // ── Disc Flip 3D Rotation Handler ──
  const handleDiscFlip = (targetView: ViewState) => {
    if (isFlipping || targetView === view) return;
    setIsFlipping(true);

    // Rotate 180 degrees like a spinning disc
    setFlipDegree((prev) => prev + 180);

    // Switch state at the halfway 90 degree mark (250ms)
    setTimeout(() => {
      setView(targetView);
    }, 250);

    setTimeout(() => {
      setIsFlipping(false);
    }, 500);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (view === "signup" && !agreedToTerms) {
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
        view === "signup"
          ? await signUp(email, password, name)
          : await signIn(email, password);

      if (error) throw error;

      if (view === "signup") {
        toast({
          title: "Host Account Created!",
          description: "Check your inbox to confirm your email, then log in to view your dashboard.",
        });
        handleDiscFlip("login");
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

  return (
    <>
      {/* Import Cursive font for the signature Welcome header matching reference screenshot */}
      <link
        href="https://fonts.googleapis.com/css2?family=Dancing+Script:wght@600;700&family=Outfit:wght@400;500;600;700&display=swap"
        rel="stylesheet"
      />

      <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden font-sans select-none">
        {/* ── Generated Clean Goa Coastal Painting Background ── */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-1000 ease-out"
          style={{
            backgroundImage: "url('/goa_coastal_painting_bg.png')",
          }}
        />

        {/* Soft subtle gradient to enhance foreground contrast while keeping background clean & clear */}
        <div className="absolute inset-0 bg-gradient-to-b from-sky-900/10 via-transparent to-sky-950/20" />

        {/* ── Top Bar Branding ── */}
        <div className="absolute top-6 left-6 right-6 flex items-center justify-between z-20">
          <div className="flex items-center gap-2.5 bg-white/80 backdrop-blur-md px-4 py-1.5 rounded-full shadow-md border border-white/60">
            <img src="/favicon.svg" alt="Wayzyy" className="h-6 w-6 rounded-full object-cover" />
            <span className="font-display font-bold text-sm tracking-tight text-slate-800">
              wayzyy <span className="text-sky-600 font-semibold text-xs ml-1">HOST</span>
            </span>
          </div>

          <Link
            to="/"
            className="flex items-center gap-1.5 bg-white/80 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-medium text-slate-700 hover:text-slate-900 shadow-md border border-white/60 transition-all hover:bg-white"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to main site
          </Link>
        </div>

        {/* ── 3D Disc Flip Container (No heavy dark background box!) ── */}
        <div
          className="relative z-10 w-full max-w-md px-4"
          style={{ perspective: "1200px" }}
        >
          <div
            className="w-full transition-transform duration-500 ease-in-out transform-gpu"
            style={{
              transform: `rotateY(${flipDegree}deg)`,
              transformStyle: "preserve-3d",
            }}
          >
            {/* ================= STAGE 1: LANDING SCREEN ================= */}
            {view === "landing" && (
              <div className="flex flex-col items-center text-center space-y-6 py-6">
                <div className="inline-flex items-center gap-2 rounded-full border border-sky-400/40 bg-white/80 backdrop-blur-md px-4 py-1.5 text-xs font-semibold text-sky-700 shadow-sm">
                  <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                  <span>Wayzyy Host Portal</span>
                </div>

                <div className="space-y-3">
                  <h1
                    className="text-4xl sm:text-5xl font-bold tracking-tight text-slate-900 leading-tight"
                    style={{ fontFamily: "'Dancing Script', cursive" }}
                  >
                    Host Smarter. Grow Faster.
                  </h1>
                  <p className="text-sm text-slate-700 font-medium max-w-sm mx-auto leading-relaxed bg-white/40 backdrop-blur-xs p-2 rounded-xl">
                    Manage bookings, guests, pricing and payouts from one beautiful dashboard.
                  </p>
                </div>

                {/* Elegant Rounded Slim Buttons */}
                <div className="w-full max-w-xs space-y-3 pt-2">
                  <button
                    type="button"
                    onClick={() => handleDiscFlip("login")}
                    className="w-full h-11 rounded-full bg-sky-500 hover:bg-sky-600 text-white font-bold text-sm tracking-wide shadow-lg shadow-sky-500/30 hover:shadow-sky-500/50 hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer border border-sky-400/50"
                  >
                    LOGIN <ArrowRight className="h-4 w-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDiscFlip("signup")}
                    className="w-full h-11 rounded-full bg-white/85 hover:bg-white text-slate-800 font-bold text-sm tracking-wide shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 border border-white/80 cursor-pointer"
                  >
                    CREATE ACCOUNT
                  </button>
                </div>
              </div>
            )}

            {/* ================= STAGE 2 & 3: LOGIN / SIGNUP FORM ================= */}
            {(view === "login" || view === "signup") && (
              <div className="flex flex-col items-center text-center space-y-5 py-4">
                {/* Script Welcome Title */}
                <div className="space-y-1">
                  <h1
                    className="text-4xl sm:text-5xl font-bold text-sky-800 drop-shadow-sm"
                    style={{ fontFamily: "'Dancing Script', cursive" }}
                  >
                    {view === "login" ? "Welcome" : "Create Account"}
                  </h1>
                  <p className="text-xs font-medium text-slate-600 tracking-wide uppercase">
                    {view === "login" ? "Login with Email" : "Sign up with Email"}
                  </p>
                </div>

                {/* Clean Floating Inputs - No enclosing heavy box! */}
                <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4 pt-1">
                  {view === "signup" && (
                    <div className="relative text-left">
                      <div className="absolute -top-2.5 left-4 z-10 bg-sky-100/90 backdrop-blur-md px-2 py-0.5 rounded-full text-[10px] font-bold text-sky-800 border border-sky-300/60 shadow-xs">
                        Full Name
                      </div>
                      <div className="relative">
                        <User className="absolute left-3.5 top-3.5 h-4 w-4 text-sky-600" />
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          required
                          placeholder="e.g. Ananya Sharma"
                          className="w-full h-11 rounded-2xl border-2 border-sky-300/80 bg-sky-50/70 backdrop-blur-md pl-10 pr-4 text-xs font-semibold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-400/30 transition-all shadow-sm"
                        />
                      </div>
                    </div>
                  )}

                  {/* Email Input Field */}
                  <div className="relative text-left">
                    <div className="absolute -top-2.5 left-4 z-10 bg-sky-100/90 backdrop-blur-md px-2 py-0.5 rounded-full text-[10px] font-bold text-sky-800 border border-sky-300/60 shadow-xs">
                      Email Id
                    </div>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-sky-600" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        placeholder="thisuix@mail.com"
                        className="w-full h-11 rounded-2xl border-2 border-sky-300/80 bg-sky-50/70 backdrop-blur-md pl-10 pr-4 text-xs font-semibold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-400/30 transition-all shadow-sm"
                      />
                    </div>
                  </div>

                  {/* Password Input Field */}
                  <div className="relative text-left">
                    <div className="absolute -top-2.5 left-4 z-10 bg-sky-100/90 backdrop-blur-md px-2 py-0.5 rounded-full text-[10px] font-bold text-sky-800 border border-sky-300/60 shadow-xs">
                      Password
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-sky-600" />
                      <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        minLength={6}
                        placeholder="••••••••••••••••"
                        className="w-full h-11 rounded-2xl border-2 border-sky-300/80 bg-sky-50/70 backdrop-blur-md pl-10 pr-10 text-xs font-semibold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-400/30 transition-all shadow-sm"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-3.5 text-slate-500 hover:text-sky-700"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  {view === "login" && (
                    <div className="flex justify-end pr-1">
                      <button
                        type="button"
                        className="text-[11px] font-semibold text-slate-600 hover:text-sky-700 transition-colors"
                      >
                        Forgot your password?
                      </button>
                    </div>
                  )}

                  {view === "signup" && (
                    <div className="flex items-start gap-2 text-left pt-1">
                      <Checkbox
                        id="terms-agree"
                        checked={agreedToTerms}
                        onCheckedChange={(checked) => setAgreedToTerms(Boolean(checked))}
                        className="mt-0.5 border-sky-400 data-[state=checked]:bg-sky-500 data-[state=checked]:text-white shrink-0"
                      />
                      <label htmlFor="terms-agree" className="text-[11px] text-slate-700 font-medium leading-snug cursor-pointer select-none">
                        I agree to the{" "}
                        <Link to="/host-terms" target="_blank" className="font-bold text-sky-700 underline">
                          Host Terms
                        </Link>{" "}
                        and{" "}
                        <Link to="/policies/property-import-policy" target="_blank" className="font-bold text-sky-700 underline">
                          Import Policy
                        </Link>.
                      </label>
                    </div>
                  )}

                  {/* LOGIN / SIGNUP Submit Button */}
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full h-11 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs tracking-wider uppercase shadow-lg shadow-sky-500/30 hover:shadow-sky-500/50 hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer border border-sky-400/50"
                  >
                    {submitting ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : view === "login" ? (
                      "LOGIN"
                    ) : (
                      "REGISTER NOW"
                    )}
                  </button>
                </form>

                {/* OR Divider with Minimal Social Icons */}
                <div className="w-full max-w-sm space-y-3 pt-2">
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-px bg-slate-300/80" />
                    <span className="text-[10px] font-bold text-slate-500 tracking-wider">OR</span>
                    <div className="flex-1 h-px bg-slate-300/80" />
                  </div>

                  {/* Social Buttons Card */}
                  <div className="flex items-center justify-center gap-4 bg-white/75 backdrop-blur-md p-2.5 rounded-2xl shadow-sm border border-white/90">
                    <button
                      type="button"
                      onClick={() => toast({ title: "Google Login", description: "Initiating Google SSO..." })}
                      className="p-2 rounded-xl hover:bg-sky-100/60 transition-colors cursor-pointer"
                      title="Login with Google"
                    >
                      <svg className="h-5 w-5" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                    </button>

                    <button
                      type="button"
                      onClick={() => toast({ title: "Facebook Login", description: "Initiating Facebook SSO..." })}
                      className="p-2 rounded-xl hover:bg-sky-100/60 transition-colors cursor-pointer"
                      title="Login with Facebook"
                    >
                      <svg className="h-5 w-5 text-[#1877F2]" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                      </svg>
                    </button>

                    <button
                      type="button"
                      onClick={() => toast({ title: "Apple Login", description: "Initiating Apple SSO..." })}
                      className="p-2 rounded-xl hover:bg-sky-100/60 transition-colors cursor-pointer"
                      title="Login with Apple"
                    >
                      <svg className="h-5 w-5 text-slate-900" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.85c.62-.75 1.04-1.8 0.93-2.85-.9.04-2 .6-2.65 1.36-.58.67-1.09 1.75-.95 2.78 1.01.08 2.05-.54 2.67-1.29z"/>
                      </svg>
                    </button>
                  </div>

                  {/* Switch between Login and Signup */}
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => handleDiscFlip(view === "login" ? "signup" : "login")}
                      className="text-xs font-semibold text-slate-700 hover:text-sky-800 transition-colors bg-white/60 backdrop-blur-xs px-3 py-1.5 rounded-full border border-white/80 cursor-pointer shadow-xs"
                    >
                      {view === "login" ? (
                        <>Don't have account? <span className="text-sky-700 underline font-bold">Register Now</span></>
                      ) : (
                        <>Already have an account? <span className="text-sky-700 underline font-bold">Log In</span></>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
