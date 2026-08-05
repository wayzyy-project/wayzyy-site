import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Mail, Lock, User, Eye, EyeOff, Loader2, ArrowRight, ArrowLeft, Sparkles
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Checkbox } from "@/components/ui/checkbox";

type ViewState = "landing" | "login" | "signup";

export function HostAuthExperience() {
  const { signIn, signUp } = useAuth();
  const { toast } = useToast();

  const [view, setView] = useState<ViewState>("landing");
  const [isNight, setIsNight] = useState(false);
  const [isRotatingScreen, setIsRotatingScreen] = useState(false);
  const [screenRotationY, setScreenRotationY] = useState(0);

  // Form states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // ── Full Screen 3D Axis Rotation with Day/Night Background Shift ──
  const handleScreenAxisRotation = (targetView: ViewState) => {
    if (isRotatingScreen || targetView === view) return;
    setIsRotatingScreen(true);

    // Phase 1: Rotate entire screen out 90 degrees (300ms)
    setScreenRotationY(90);

    // Phase 2: At 90deg (when view is edge-on), switch background & content
    setTimeout(() => {
      setView(targetView);

      // Toggle Night mode for Signup/Login, Day mode for Landing or toggle on transition
      if (targetView === "signup") {
        setIsNight(true);
      } else if (targetView === "landing") {
        setIsNight(false);
      } else {
        setIsNight((prev) => !prev);
      }

      // Snap rotation to -90 degrees instantly so it swings in smoothly from the other side
      setScreenRotationY(-90);

      // Phase 3: Swing in from -90 to 0 degrees
      setTimeout(() => {
        setScreenRotationY(0);
      }, 50);
    }, 300);

    setTimeout(() => {
      setIsRotatingScreen(false);
    }, 650);
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
        handleScreenAxisRotation("login");
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
      {/* Import Dancing Script for signature Welcome title */}
      <link
        href="https://fonts.googleapis.com/css2?family=Dancing+Script:wght@600;700&family=Outfit:wght@400;500;600;700&display=swap"
        rel="stylesheet"
      />

      {/* ── 3D Viewport Outer Frame ── */}
      <div
        className="fixed inset-0 z-50 overflow-hidden font-sans select-none bg-slate-950"
        style={{ perspective: "1500px" }}
      >
        {/* ── Full Screen Axis-Rotating Screen Layer ── */}
        <div
          className="w-full h-full flex items-center justify-center transition-transform duration-300 ease-in-out transform-gpu relative"
          style={{
            transform: `rotateY(${screenRotationY}deg)`,
            transformStyle: "preserve-3d",
          }}
        >
          {/* ── Day/Night Goa Coastal Painting Background ── */}
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-700 ease-in-out"
            style={{
              backgroundImage: isNight
                ? "url('/goa_coastal_painting_night_bg.png')"
                : "url('/goa_coastal_painting_bg.png')",
            }}
          />

          {/* Atmospheric lighting overlay tuned for Day vs Night */}
          <div
            className={`absolute inset-0 transition-opacity duration-700 ${
              isNight
                ? "bg-slate-950/40 backdrop-brightness-90"
                : "bg-gradient-to-b from-sky-900/10 via-transparent to-slate-900/20"
            }`}
          />

          {/* ── Top Bar Branding ── */}
          <div className="absolute top-6 left-6 right-6 flex items-center justify-between z-20">
            <div
              className={`flex items-center gap-2.5 px-4 py-1.5 rounded-full shadow-md border backdrop-blur-md transition-colors ${
                isNight
                  ? "bg-slate-900/80 border-slate-700/60 text-white"
                  : "bg-white/85 border-white/80 text-slate-800"
              }`}
            >
              <img src="/favicon.svg" alt="Wayzyy" className="h-6 w-6 rounded-full object-cover" />
              <span className="font-display font-bold text-sm tracking-tight">
                wayzyy <span className="text-[#ff6b00] font-semibold text-xs ml-1">HOST</span>
              </span>
            </div>

            <Link
              to="/"
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium shadow-md border backdrop-blur-md transition-all ${
                isNight
                  ? "bg-slate-900/80 border-slate-700/60 text-slate-200 hover:bg-slate-800"
                  : "bg-white/85 border-white/80 text-slate-700 hover:bg-white hover:text-slate-900"
              }`}
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Back to main site
            </Link>
          </div>

          {/* ── Main Content Container (No Heavy Dark Box!) ── */}
          <div className="relative z-10 w-full max-w-md px-4">

            {/* ================= STAGE 1: LANDING SCREEN ================= */}
            {view === "landing" && (
              <div className="flex flex-col items-center text-center space-y-6 py-6">
                <div className="inline-flex items-center gap-2 rounded-full border border-[#ff6b00]/40 bg-white/85 backdrop-blur-md px-4 py-1.5 text-xs font-semibold text-[#ff6b00] shadow-sm">
                  <Sparkles className="h-3.5 w-3.5 text-[#ff6b00]" />
                  <span>Wayzyy Host Portal</span>
                </div>

                <div className="space-y-3">
                  <h1 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 leading-tight drop-shadow-xs">
                    Host Smarter. Grow Faster.
                  </h1>
                  <p className="text-sm text-slate-700 font-medium max-w-sm mx-auto leading-relaxed bg-white/50 backdrop-blur-xs p-2 rounded-xl">
                    Manage bookings, guests, pricing and payouts from one beautiful dashboard.
                  </p>
                </div>

                {/* Modern Ultra-Rounded Buttons */}
                <div className="w-full max-w-xs space-y-3 pt-2">
                  <button
                    type="button"
                    onClick={() => handleScreenAxisRotation("login")}
                    className="w-full h-11 rounded-full bg-[#ff6b00] hover:bg-[#e05e00] text-white font-bold text-xs tracking-wider uppercase shadow-lg shadow-[#ff6b00]/30 hover:shadow-[#ff6b00]/50 hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer border border-[#ff6b00]"
                  >
                    LOG IN <ArrowRight className="h-4 w-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleScreenAxisRotation("signup")}
                    className="w-full h-11 rounded-full bg-white/90 hover:bg-white text-slate-800 font-bold text-xs tracking-wider uppercase shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 border border-white/90 cursor-pointer"
                  >
                    CREATE ACCOUNT
                  </button>
                </div>
              </div>
            )}

            {/* ================= STAGE 2 & 3: LOGIN / SIGNUP FORM ================= */}
            {(view === "login" || view === "signup") && (
              <div className="flex flex-col items-center text-center space-y-5 py-4">
                {/* Home Page Brand Font (Raleway font-display) */}
                <div className="space-y-1">
                  <h1
                    className={`font-display text-3xl sm:text-4xl font-extrabold tracking-tight drop-shadow-sm ${
                      isNight ? "text-white" : "text-slate-900"
                    }`}
                  >
                    {view === "login" ? "Welcome" : "Create Account"}
                  </h1>
                  <p
                    className={`text-xs font-semibold tracking-wide uppercase ${
                      isNight ? "text-slate-300" : "text-slate-700"
                    }`}
                  >
                    {view === "login" ? "Login with Email" : "Sign up with Email"}
                  </p>
                </div>

                {/* Floating Inputs with Solid Bold Icon Badges */}
                <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4 pt-1">
                  {view === "signup" && (
                    <div className="relative text-left">
                      <div className="absolute -top-2.5 left-4 z-10 bg-white px-2.5 py-0.5 rounded-full text-[10px] font-bold text-[#ff6b00] border border-[#ff6b00]/60 shadow-xs">
                        Full Name
                      </div>
                      <div className="relative flex items-center">
                        <div className="absolute left-2 top-2 z-10 w-7 h-7 rounded-full bg-[#ff6b00] text-white flex items-center justify-center shadow-xs pointer-events-none">
                          <User className="h-3.5 w-3.5 stroke-[2.5]" />
                        </div>
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          required
                          placeholder="e.g. Ananya Sharma"
                          className={`w-full h-11 rounded-[22px] border-2 backdrop-blur-md pl-11 pr-4 text-xs font-semibold placeholder:text-slate-400 focus:outline-none focus:border-[#ff6b00] focus:ring-2 focus:ring-[#ff6b00]/30 transition-all shadow-sm ${
                            isNight
                              ? "border-slate-600/90 bg-slate-900/90 text-white"
                              : "border-slate-300/90 bg-white/95 text-slate-900"
                          }`}
                        />
                      </div>
                    </div>
                  )}

                  {/* Email Input */}
                  <div className="relative text-left">
                    <div className="absolute -top-2.5 left-4 z-10 bg-white px-2.5 py-0.5 rounded-full text-[10px] font-bold text-[#ff6b00] border border-[#ff6b00]/60 shadow-xs">
                      Email Id
                    </div>
                    <div className="relative flex items-center">
                      <div className="absolute left-2 top-2 z-10 w-7 h-7 rounded-full bg-[#ff6b00] text-white flex items-center justify-center shadow-xs pointer-events-none">
                        <Mail className="h-3.5 w-3.5 stroke-[2.5]" />
                      </div>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        placeholder="thisuix@mail.com"
                        className={`w-full h-11 rounded-[22px] border-2 backdrop-blur-md pl-11 pr-4 text-xs font-semibold placeholder:text-slate-400 focus:outline-none focus:border-[#ff6b00] focus:ring-2 focus:ring-[#ff6b00]/30 transition-all shadow-sm ${
                          isNight
                            ? "border-slate-600/90 bg-slate-900/90 text-white"
                            : "border-slate-300/90 bg-white/95 text-slate-900"
                        }`}
                      />
                    </div>
                  </div>

                  {/* Password Input */}
                  <div className="relative text-left">
                    <div className="absolute -top-2.5 left-4 z-10 bg-white px-2.5 py-0.5 rounded-full text-[10px] font-bold text-[#ff6b00] border border-[#ff6b00]/60 shadow-xs">
                      Password
                    </div>
                    <div className="relative flex items-center">
                      <div className="absolute left-2 top-2 z-10 w-7 h-7 rounded-full bg-[#ff6b00] text-white flex items-center justify-center shadow-xs pointer-events-none">
                        <Lock className="h-3.5 w-3.5 stroke-[2.5]" />
                      </div>
                      <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        minLength={6}
                        placeholder="••••••••••••••••"
                        className={`w-full h-11 rounded-[22px] border-2 backdrop-blur-md pl-11 pr-11 text-xs font-semibold placeholder:text-slate-400 focus:outline-none focus:border-[#ff6b00] focus:ring-2 focus:ring-[#ff6b00]/30 transition-all shadow-sm ${
                          isNight
                            ? "border-slate-600/90 bg-slate-900/90 text-white"
                            : "border-slate-300/90 bg-white/95 text-slate-900"
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-2 top-2 z-10 w-7 h-7 rounded-full bg-slate-200/90 hover:bg-[#ff6b00] text-slate-700 hover:text-white flex items-center justify-center transition-colors shadow-xs"
                      >
                        {showPassword ? (
                          <EyeOff className="h-3.5 w-3.5 stroke-[2.5]" />
                        ) : (
                          <Eye className="h-3.5 w-3.5 stroke-[2.5]" />
                        )}
                      </button>
                    </div>
                  </div>

                  {view === "login" && (
                    <div className="flex justify-end pr-1">
                      <button
                        type="button"
                        className={`text-xs font-extrabold tracking-tight px-3 py-1 rounded-full border shadow-xs transition-all cursor-pointer ${
                          isNight
                            ? "bg-slate-900/90 border-slate-700 text-slate-100 hover:text-[#ff6b00] hover:border-[#ff6b00]"
                            : "bg-white/95 border-slate-300/90 text-slate-900 hover:text-[#ff6b00] hover:border-[#ff6b00]"
                        }`}
                      >
                        Forgot your password?
                      </button>
                    </div>
                  )}

                  {view === "signup" && (
                    <div className="flex items-center justify-center pt-1">
                      <div
                        className={`flex items-center gap-2.5 px-4 py-2 rounded-full border shadow-xs transition-all ${
                          isNight
                            ? "bg-slate-900/90 border-slate-700 text-slate-100"
                            : "bg-white/95 border-slate-300/90 text-slate-900"
                        }`}
                      >
                        <Checkbox
                          id="terms-agree"
                          checked={agreedToTerms}
                          onCheckedChange={(checked) => setAgreedToTerms(Boolean(checked))}
                          className="border-[#ff6b00] data-[state=checked]:bg-[#ff6b00] data-[state=checked]:text-white shrink-0"
                        />
                        <label
                          htmlFor="terms-agree"
                          className="text-xs font-bold leading-snug cursor-pointer select-none"
                        >
                          I agree to the{" "}
                          <Link to="/host-terms" target="_blank" className="font-extrabold text-[#ff6b00] underline hover:text-[#e05e00]">
                            Host Terms
                          </Link>{" "}
                          and{" "}
                          <Link to="/policies/property-import-policy" target="_blank" className="font-extrabold text-[#ff6b00] underline hover:text-[#e05e00]">
                            Import Policy
                          </Link>.
                        </label>
                      </div>
                    </div>
                  )}

                  {/* Modern Sleek Minimal Rounded Pill Submit Button */}
                  <div className="pt-1">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="px-8 h-10 rounded-full bg-[#ff6b00] hover:bg-[#e05e00] text-white font-bold text-xs tracking-wider uppercase shadow-md shadow-[#ff6b00]/30 hover:shadow-lg hover:shadow-[#ff6b00]/50 hover:scale-105 active:scale-95 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer mx-auto border border-[#ff6b00]"
                    >
                      {submitting ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : view === "login" ? (
                        "LOG IN"
                      ) : (
                        "REGISTER NOW"
                      )}
                    </button>
                  </div>
                </form>

                {/* OR Divider */}
                <div className="w-full max-w-xs space-y-3 pt-2">
                  <div className="flex items-center gap-3">
                    <div className={`flex-1 h-px ${isNight ? "bg-slate-700/80" : "bg-slate-300"}`} />
                    <span className={`text-[10px] font-bold tracking-wider ${isNight ? "text-slate-400" : "text-slate-500"}`}>
                      OR
                    </span>
                    <div className={`flex-1 h-px ${isNight ? "bg-slate-700/80" : "bg-slate-300"}`} />
                  </div>

                  {/* Separate Floating Circular Social Buttons (No Big Bar!) */}
                  <div className="flex items-center justify-center gap-4 py-1">
                    {/* Google Circle */}
                    <button
                      type="button"
                      onClick={() => toast({ title: "Google Login", description: "Initiating Google SSO..." })}
                      className="w-11 h-11 rounded-full bg-white shadow-md border border-slate-200/80 flex items-center justify-center hover:scale-110 hover:shadow-lg transition-all duration-200 cursor-pointer"
                      title="Login with Google"
                    >
                      <svg className="h-5 w-5" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                    </button>

                    {/* Facebook Circle */}
                    <button
                      type="button"
                      onClick={() => toast({ title: "Facebook Login", description: "Initiating Facebook SSO..." })}
                      className="w-11 h-11 rounded-full bg-white shadow-md border border-slate-200/80 flex items-center justify-center hover:scale-110 hover:shadow-lg transition-all duration-200 cursor-pointer"
                      title="Login with Facebook"
                    >
                      <svg className="h-5 w-5 text-[#1877F2]" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                      </svg>
                    </button>

                    {/* Apple Circle */}
                    <button
                      type="button"
                      onClick={() => toast({ title: "Apple Login", description: "Initiating Apple SSO..." })}
                      className="w-11 h-11 rounded-full bg-white shadow-md border border-slate-200/80 flex items-center justify-center hover:scale-110 hover:shadow-lg transition-all duration-200 cursor-pointer"
                      title="Login with Apple"
                    >
                      <svg className="h-5 w-5 text-slate-900" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.85c.62-.75 1.04-1.8 0.93-2.85-.9.04-2 .6-2.65 1.36-.58.67-1.09 1.75-.95 2.78 1.01.08 2.05-.54 2.67-1.29z"/>
                      </svg>
                    </button>
                  </div>

                  {/* Switch View Trigger */}
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => handleScreenAxisRotation(view === "login" ? "signup" : "login")}
                      className={`text-xs font-semibold transition-all px-4 py-1.5 rounded-full border shadow-xs cursor-pointer ${
                        isNight
                          ? "bg-slate-900/90 border-slate-700/80 text-slate-200 hover:bg-slate-800"
                          : "bg-white/90 border-white/90 text-slate-800 hover:bg-white"
                      }`}
                    >
                      {view === "login" ? (
                        <>Don't have account? <span className="text-[#ff6b00] underline font-bold">Register Now</span></>
                      ) : (
                        <>Already have an account? <span className="text-[#ff6b00] underline font-bold">Log In</span></>
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
