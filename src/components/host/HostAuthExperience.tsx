import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Mail, Lock, User, Eye, EyeOff, Loader2, ArrowRight, ArrowLeft, BookOpen
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/lib/supabase";
import { TextEffect } from "@/components/core/text-effect";
import { ImageComparison, ImageComparisonBase, ImageComparisonImage } from "@/components/core/image-comparison";
import { Tilt } from "@/components/core/tilt";
import { blogPosts } from "@/lib/blogPosts";

import hostBg1 from "@/assets/host-auth/host-login-illustration.png";
import hostBg2 from "@/assets/host-auth/host-signup-illustration.png";

type ViewState = "landing" | "login" | "signup";

// Latest published post — used on the login view.
const latestPost = blogPosts[blogPosts.length - 1];
// A host-economics-focused post — used on the signup view.
const hostFocusedPost =
  blogPosts.find((p) => p.slug === "how-much-can-you-earn-vacation-rental-goa") ?? blogPosts[0];

export function HostAuthExperience() {
  const { signIn, signUp } = useAuth();
  const { toast } = useToast();

  const [view, setView] = useState<ViewState>("landing");

  // Form states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const switchView = (targetView: ViewState) => {
    if (targetView === view) return;
    setView(targetView);
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
    console.group("🔑 [WAYZYY DIAGNOSTIC] Host Authentication");
    console.log("Action:", view);
    console.log("Email:", email);

    try {
      const { data, error } =
        view === "signup"
          ? await signUp(email, password, name)
          : await signIn(email, password);

      if (error) {
        console.error("❌ Auth Error Object:", error);
        throw error;
      }

      console.log("✅ Auth Success Data:", data);

      if (view === "signup") {
        const newUser = data?.user;
        if (newUser) {
          try {
            await supabase.from("profiles").upsert({
              id: newUser.id,
              full_name: name,
              email: email,
              updated_at: new Date().toISOString(),
            });
          } catch (err) {
            console.warn("Profile upsert note:", err);
          }
        }

        toast({
          title: "Confirmation Email Sent! 📩",
          description: "Please check your email inbox to confirm your email address. Once confirmed, you can log in below.",
        });

        // Send them to the login screen
        switchView("login");
      }
    } catch (err: any) {
      console.error("❌ Authentication Catch Error:", err);
      toast({
        title: "Authentication Failed",
        description: err?.message || "Please check your details and try again.",
        variant: "destructive",
      });
    } finally {
      console.groupEnd();
      setSubmitting(false);
    }
  };

  const activeBlogPost = view === "signup" ? hostFocusedPost : latestPost;
  const blogCardLabel = view === "signup" ? "For hosts" : "Latest read";

  return (
    <>
      {/* Import Dancing Script for signature Welcome title */}
      <link
        href="https://fonts.googleapis.com/css2?family=Dancing+Script:wght@600;700&family=Outfit:wght@400;500;600;700&display=swap"
        rel="stylesheet"
      />

      <div className="fixed inset-0 z-50 overflow-hidden font-sans select-none bg-white">
        <div className="relative flex h-full w-full">
          {/* ══════════════════ Background image panel (wipe-transitions between bg1/bg2) — full-bleed ══════════════════ */}
          <div className="absolute inset-0">
            <ImageComparison value={view === "signup" ? "signup" : "login"} className="h-full w-full" duration={0.65}>
              <ImageComparisonBase src={hostBg1} alt="Wayzyy host — Goa coastline at sunset" />
              <ImageComparisonImage
                src={hostBg2}
                alt="Wayzyy host — Goa coastline, alternate view"
                showWhen="signup"
              />
            </ImageComparison>
            {/* Soft, even wash so the photo reads everywhere behind the glass card, rather than being hidden on one side */}
            <div className="absolute inset-0 bg-white/10" />
            <div className="absolute inset-0 bg-gradient-to-b from-white/5 via-white/10 to-white/35" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,rgba(255,255,255,0.25)_100%)]" />
          </div>

          {/* ══════════════════ Top Bar Branding ══════════════════ */}
          <div className="absolute top-6 left-6 right-6 flex items-center justify-between z-20">
            <div className="flex items-center gap-2.5 px-4 py-1.5 rounded-full shadow-lg shadow-black/5 bg-white/80 backdrop-blur-md text-slate-800">
              <img src="/favicon.svg" alt="Wayzyy" className="h-6 w-6 rounded-full object-cover" />
              <span className="font-display font-bold text-sm tracking-tight">
                wayzyy <span className="text-ember font-semibold text-xs ml-1">HOST</span>
              </span>
            </div>

            <Link
              to="/"
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium shadow-lg shadow-black/5 bg-white/80 backdrop-blur-md text-slate-700 hover:bg-white/95 hover:text-slate-900 transition-all"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Back to main site
            </Link>
          </div>

          {/* ══════════════════ Main Content Container ══════════════════ */}
          <div className="relative z-10 flex w-full items-center justify-center px-4 lg:justify-end lg:pr-[8%]">
            <div className="relative w-full max-w-md">
              {/* ================= STAGE 1: LANDING SCREEN ================= */}
              {view === "landing" && (
                <div className="flex flex-col items-center text-center space-y-7 rounded-3xl border border-white/25 bg-white/12 backdrop-blur-xl px-8 py-12 shadow-2xl shadow-black/20">
                  <div className="inline-flex items-center gap-2 rounded-full bg-ember/10 px-4 py-1.5 text-xs font-bold text-ember">
                    <img src="/favicon.svg" alt="Wayzyy" className="h-4 w-4 rounded-full object-cover" />
                    <span>Wayzyy Host Portal</span>
                  </div>

                  <div className="space-y-3">
                    <h1 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 leading-tight">
                      Host Smarter. Grow Faster.
                    </h1>
                    <p className="text-sm text-slate-600 font-medium max-w-sm mx-auto leading-relaxed">
                      Manage bookings, guests, pricing and payouts from one beautiful dashboard.
                    </p>
                  </div>

                  <div className="flex flex-row items-center justify-center gap-3 w-full max-w-xs mx-auto pt-2">
                    <button
                      type="button"
                      onClick={() => switchView("login")}
                      className="flex-1 h-11 px-3 rounded-full bg-ember hover:bg-ember/90 text-white font-bold text-xs tracking-wider uppercase shadow-lg shadow-ember/20 hover:-translate-y-0.5 active:scale-[0.97] active:translate-y-0 transition-[transform,background-color,box-shadow] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap"
                    >
                      LOG IN <ArrowRight className="h-3.5 w-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => switchView("signup")}
                      className="flex-1 h-11 px-3 rounded-full bg-white/70 hover:bg-white text-slate-800 font-bold text-xs tracking-wider uppercase shadow-md shadow-black/5 hover:-translate-y-0.5 active:scale-[0.97] active:translate-y-0 transition-[transform,background-color,box-shadow] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] cursor-pointer whitespace-nowrap"
                    >
                      CREATE ACCOUNT
                    </button>
                  </div>
                </div>
              )}

              {/* ================= STAGE 2 & 3: LOGIN / SIGNUP FORM ================= */}
              {(view === "login" || view === "signup") && (
                <div className="flex flex-col items-center text-center space-y-6 rounded-3xl border border-white/25 bg-white/12 backdrop-blur-xl px-8 py-10 sm:px-10 sm:py-11 shadow-2xl shadow-black/20">
                  <div className="space-y-1.5">
                    <h1 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
                      <TextEffect key={view} per="char" preset="fade">
                        {view === "login" ? "Welcome back, host" : "Join Wayzyy, host"}
                      </TextEffect>
                    </h1>
                    <p className="text-xs font-semibold tracking-wide uppercase text-slate-500">
                      {view === "login" ? "Login with Email" : "Sign up with Email"}
                    </p>
                  </div>

                  {/* Form */}
                  <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4 pt-1">
                    {view === "signup" && (
                      <div className="relative text-left">
                        <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wide text-slate-500">
                          Full Name
                        </label>
                        <div className="relative flex items-center">
                          <User className="absolute left-4 h-4 w-4 text-slate-400 pointer-events-none" />
                          <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            placeholder="e.g. Ananya Sharma"
                            className="w-full h-12 rounded-2xl bg-slate-100/70 pl-11 pr-4 text-sm font-medium text-slate-900 placeholder:text-slate-400 shadow-sm shadow-black/5 focus:outline-none focus:bg-white focus:ring-2 focus:ring-ember/25 transition-all"
                          />
                        </div>
                      </div>
                    )}

                    {/* Email Input */}
                    <div className="relative text-left">
                      <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wide text-slate-500">
                        Email Id
                      </label>
                      <div className="relative flex items-center">
                        <Mail className="absolute left-4 h-4 w-4 text-slate-400 pointer-events-none" />
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          placeholder="thisuix@mail.com"
                          className="w-full h-12 rounded-2xl bg-slate-100/70 pl-11 pr-4 text-sm font-medium text-slate-900 placeholder:text-slate-400 shadow-sm shadow-black/5 focus:outline-none focus:bg-white focus:ring-2 focus:ring-ember/25 transition-all"
                        />
                      </div>
                    </div>

                    {/* Password Input */}
                    <div className="relative text-left">
                      <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wide text-slate-500">
                        Password
                      </label>
                      <div className="relative flex items-center">
                        <Lock className="absolute left-4 h-4 w-4 text-slate-400 pointer-events-none" />
                        <input
                          type={showPassword ? "text" : "password"}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                          minLength={6}
                          placeholder="••••••••••••••••"
                          className="w-full h-12 rounded-2xl bg-slate-100/70 pl-11 pr-11 text-sm font-medium text-slate-900 placeholder:text-slate-400 shadow-sm shadow-black/5 focus:outline-none focus:bg-white focus:ring-2 focus:ring-ember/25 transition-all"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 h-6 w-6 flex items-center justify-center text-slate-400 hover:text-ember active:scale-90 transition-[color,transform] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)]"
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>

                    {view === "login" && (
                      <div className="flex justify-end pr-1">
                        <button
                          type="button"
                          className="text-xs font-semibold text-slate-500 hover:text-ember transition-colors cursor-pointer"
                        >
                          Forgot your password?
                        </button>
                      </div>
                    )}

                    {view === "signup" && (
                      <div className="flex items-start gap-2.5 pt-1 text-left">
                        <Checkbox
                          id="terms-agree"
                          checked={agreedToTerms}
                          onCheckedChange={(checked) => setAgreedToTerms(Boolean(checked))}
                          className="mt-0.5 border-slate-300 data-[state=checked]:bg-ember data-[state=checked]:border-ember data-[state=checked]:text-white shrink-0"
                        />
                        <label htmlFor="terms-agree" className="text-xs font-medium leading-snug text-slate-600 cursor-pointer select-none">
                          I agree to the{" "}
                          <Link to="/host-terms" target="_blank" className="font-semibold text-ember underline hover:text-ember/80">
                            Host Terms
                          </Link>{" "}
                          and{" "}
                          <Link to="/policies/property-import-policy" target="_blank" className="font-semibold text-ember underline hover:text-ember/80">
                            Import Policy
                          </Link>.
                        </label>
                      </div>
                    )}

                    <div className="pt-1">
                      <button
                        type="submit"
                        disabled={submitting}
                        className="w-full h-12 rounded-2xl bg-ember hover:bg-ember/90 text-white font-bold text-xs tracking-wider uppercase shadow-lg shadow-ember/25 hover:shadow-xl hover:shadow-ember/30 active:scale-[0.97] transition-[transform,background-color,box-shadow] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 disabled:active:scale-100"
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
                      <div className="flex-1 h-px bg-slate-200" />
                      <span className="text-[10px] font-bold tracking-wider text-slate-400">OR</span>
                      <div className="flex-1 h-px bg-slate-200" />
                    </div>

                    <div className="flex items-center justify-center gap-4 py-1">
                      <button
                        type="button"
                        onClick={() => toast({ title: "Google Login", description: "Initiating Google SSO..." })}
                        className="w-11 h-11 rounded-full bg-white/70 shadow-md shadow-black/5 flex items-center justify-center hover:bg-white hover:shadow-lg active:scale-[0.97] transition-[transform,background-color,box-shadow] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] cursor-pointer"
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
                        className="w-11 h-11 rounded-full bg-white/70 shadow-md shadow-black/5 flex items-center justify-center hover:bg-white hover:shadow-lg active:scale-[0.97] transition-[transform,background-color,box-shadow] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] cursor-pointer"
                        title="Login with Facebook"
                      >
                        <svg className="h-5 w-5 text-[#1877F2]" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                        </svg>
                      </button>

                      <button
                        type="button"
                        onClick={() => toast({ title: "Apple Login", description: "Initiating Apple SSO..." })}
                        className="w-11 h-11 rounded-full bg-white/70 shadow-md shadow-black/5 flex items-center justify-center hover:bg-white hover:shadow-lg active:scale-[0.97] transition-[transform,background-color,box-shadow] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] cursor-pointer"
                        title="Login with Apple"
                      >
                        <svg className="h-5 w-5 text-slate-900" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.85c.62-.75 1.04-1.8 0.93-2.85-.9.04-2 .6-2.65 1.36-.58.67-1.09 1.75-.95 2.78 1.01.08 2.05-.54 2.67-1.29z"/>
                        </svg>
                      </button>
                    </div>

                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={() => switchView(view === "login" ? "signup" : "login")}
                        className="text-xs font-semibold text-slate-500 hover:text-slate-800 active:scale-[0.97] transition-[color,transform] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] px-4 py-1.5 cursor-pointer"
                      >
                        {view === "login" ? (
                          <>Don't have account? <span className="text-ember underline font-bold">Register Now</span></>
                        ) : (
                          <>Already have an account? <span className="text-ember underline font-bold">Log In</span></>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* ══════════════════ Bottom-left blog tilt card — fixed to the viewport so it's always fully visible ══════════════════ */}
              {(view === "login" || view === "signup") && (
                <div className="hidden md:block fixed bottom-6 left-6 z-20 w-56">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeBlogPost.slug}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -16 }}
                      transition={{ duration: 0.35, ease: "easeOut" }}
                    >
                      <Tilt rotationFactor={7} isReverse springConfig={{ stiffness: 260, damping: 24 }}>
                        <Link
                          to={`/blog/${activeBlogPost.slug}`}
                          className="block overflow-hidden rounded-2xl bg-white/85 backdrop-blur-md shadow-xl shadow-black/10 hover:shadow-2xl transition-shadow"
                        >
                          <div className="relative h-24 w-full overflow-hidden">
                            <img
                              src={activeBlogPost.heroImage}
                              alt={activeBlogPost.title}
                              className="h-full w-full object-cover"
                            />
                            <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-full bg-white/95 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-ember shadow-sm">
                              <BookOpen className="h-3 w-3" /> {blogCardLabel}
                            </span>
                          </div>
                          <div className="p-3">
                            <h3 className="line-clamp-2 text-xs font-bold leading-snug text-slate-900">
                              {activeBlogPost.title}
                            </h3>
                            <p className="mt-1 text-[10px] font-medium text-slate-500">{activeBlogPost.readTime}</p>
                          </div>
                        </Link>
                      </Tilt>
                    </motion.div>
                  </AnimatePresence>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
