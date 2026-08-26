import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Check, MapPin, Phone, Mail, Sparkles, Building2 } from "lucide-react";
import { mp } from "@/lib/mixpanel";

type Audience = "host" | "traveler";

const POPULAR_CITIES = [
  { id: "Goa", label: "Goa 🏖️" },
  { id: "Bangalore", label: "Bangalore 🌆" },
  { id: "Jaipur", label: "Jaipur 🏰" },
  { id: "other", label: "Other City 📍" },
];

export function Waitlist({ defaultAudience = "host" as Audience }) {
  const [audience, setAudience] = useState<Audience>(defaultAudience);
  const [selectedCity, setSelectedCity] = useState<string>("Goa");
  const [customCity, setCustomCity] = useState<string>("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const effectiveCity = selectedCity === "other" ? (customCity.trim() || "Other") : selectedCity;

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      toast.error("Please enter a valid email address.");
      return;
    }

    if (audience === "host" && (!phone || phone.trim().length < 8)) {
      toast.error("Please provide your contact number / WhatsApp so our onboarding team can reach you.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          audience,
          city: effectiveCity,
          phone: phone.trim(),
        }),
      });

      if (!res.ok) throw new Error("Failed to submit waitlist");

      mp.waitlistSignup(audience, email);
      setSent(true);
      toast.success(
        audience === "host"
          ? `Welcome to the ${effectiveCity} Founding Hosts List! Our team will reach out on WhatsApp/Email.`
          : `You're in! We'll notify you as stays unlock in ${effectiveCity}.`
      );
    } catch {
      toast.error("Something went wrong. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-xl space-y-4">
      {/* Audience Toggle */}
      <div className="flex gap-1 rounded-full border border-border/80 bg-card/90 p-1 text-xs sm:text-sm shadow-inner backdrop-blur-md">
        {(["host", "traveler"] as const).map((a) => (
          <button
            key={a}
            type="button"
            onClick={() => setAudience(a)}
            className={
              "relative flex-1 rounded-full px-4 py-2 font-bold transition-all active:scale-[0.97] " +
              (audience === a
                ? "text-background"
                : "text-muted-foreground hover:text-foreground")
            }
          >
            {audience === a && (
              <motion.span
                layoutId="waitlist-pill"
                className="absolute inset-0 rounded-full bg-foreground shadow-sm"
                transition={{ type: "spring", stiffness: 380, damping: 32 }}
              />
            )}
            <span className="relative flex items-center justify-center gap-1.5">
              {a === "host" ? "🏠 I'm Hosting / Property Owner" : "✈️ I'm a Traveler / Guest"}
            </span>
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {!sent ? (
          <motion.form
            key="form"
            onSubmit={onSubmit}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-4 rounded-2xl border border-border/60 bg-card/60 p-4 sm:p-6 backdrop-blur-xl shadow-xl"
          >
            {/* City Selection */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-ember" />
                Select Your City / Region
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {POPULAR_CITIES.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setSelectedCity(c.id)}
                    className={`h-10 px-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-center text-center ${
                      selectedCity === c.id
                        ? "border-ember bg-ember/15 text-ember ring-1 ring-ember/40 shadow-sm"
                        : "border-border/60 bg-muted/30 text-muted-foreground hover:text-foreground hover:bg-muted/60"
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>

              {selectedCity === "other" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="mt-2.5"
                >
                  <Input
                    type="text"
                    required
                    placeholder="Enter your city name (e.g. Mumbai, Delhi, Manali, Pondicherry)"
                    value={customCity}
                    onChange={(e) => setCustomCity(e.target.value)}
                    className="h-11 rounded-xl bg-background/80 px-4 text-xs sm:text-sm"
                  />
                </motion.div>
              )}
            </div>

            {/* Email Input */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5 flex items-center gap-1.5">
                <Mail className="h-3.5 w-3.5 text-ember" />
                Email Address <span className="text-ember">*</span>
              </label>
              <Input
                type="email"
                required
                placeholder={
                  audience === "host"
                    ? "host@yourvilla.com"
                    : "traveler@gmail.com"
                }
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-11 rounded-xl bg-background/80 px-4 text-xs sm:text-sm placeholder:text-muted-foreground/60"
              />
            </div>

            {/* Contact / Phone / WhatsApp Input */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Phone className="h-3.5 w-3.5 text-ember" />
                  Phone Number / WhatsApp
                  {audience === "host" && <span className="text-ember">*</span>}
                </span>
                <span className="text-[10px] text-muted-foreground font-normal">
                  {audience === "host" ? "For early onboarding & direct host pass" : "Optional"}
                </span>
              </label>
              <Input
                type="tel"
                required={audience === "host"}
                placeholder="+91 98765 43210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="h-11 rounded-xl bg-background/80 px-4 text-xs sm:text-sm placeholder:text-muted-foreground/60"
              />
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              variant="cta"
              disabled={loading}
              className="w-full h-12 rounded-xl text-xs font-bold uppercase tracking-wider gap-2 shadow-lg shadow-ember/20 cursor-pointer"
            >
              {loading ? (
                "Submitting…"
              ) : audience === "host" ? (
                <>Join {effectiveCity} Host Waitlist <ArrowRight className="h-4 w-4" /></>
              ) : (
                <>Get Early Access in {effectiveCity} <ArrowRight className="h-4 w-4" /></>
              )}
            </Button>
          </motion.form>
        ) : (
          <motion.div
            key="ok"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="rounded-2xl border border-ember/40 bg-ember/10 p-6 sm:p-8 text-center space-y-3 shadow-xl backdrop-blur-md"
          >
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-ember text-white shadow-lg shadow-ember/30">
              <Check className="h-6 w-6" />
            </div>
            <h3 className="font-display text-xl sm:text-2xl font-extrabold text-foreground">
              You're on the {effectiveCity} {audience === "host" ? "Founding Hosts" : "Early Travelers"} List!
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
              {audience === "host"
                ? "Our team is onboarding homestays and villas in waves. We will reach out on WhatsApp and email before doors open."
                : "We've locked in your early access. You'll receive private booking links the moment verified stays go live."}
            </p>
            <div className="pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSent(false);
                  setEmail("");
                  setPhone("");
                }}
                className="rounded-xl text-xs font-semibold"
              >
                Add another property or email
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <p className="text-[11px] text-muted-foreground text-center sm:text-left leading-relaxed">
        {audience === "host"
          ? "✨ 0% per-booking commission. 100% direct guest connection with Aadhaar digital verification."
          : "✨ No hidden booking markups. Transparent, verified homestays across Goa, Bangalore, Jaipur & beyond."}
      </p>
    </div>
  );
}
