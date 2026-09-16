import { useEffect, useState } from "react";
import { Loader2, Phone, ArrowRight } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import hostBg1 from "@/assets/goa-cinematic/sunset-host.webp";

/**
 * One-time phone capture for accounts that reached the portal without a
 * number.
 *
 * Email/password signup collects a phone and persists it through the
 * handle_new_user trigger. Google OAuth has no such step - the provider
 * hands back an email and a name and nothing else - so those accounts
 * arrive with `profiles.phone` empty, and the concierge onboarding flow is
 * a phone call.
 *
 * The gate keys off the absence of a number rather than an "is new user"
 * flag on purpose: it is self-healing. Anyone who signed up before phone
 * was mandatory gets asked once, the next time they log in, and is never
 * asked again - the lookup below runs on every mount, so if the write
 * ever silently failed (the exact bug this replaced) the host is asked
 * again next time rather than being let through with no number on file.
 * A returning host with a number never sees this at all.
 *
 * Visually this is the same surface as HostAuthExperience (photo
 * background, liquid-glass card, ember CTA) rather than a bare page -
 * it sits between that screen and the dashboard, and looking like a
 * different, unbranded app in between was its own bug.
 */
export function HostPhoneGate({ userId, onDone }: { userId: string; onDone: () => void }) {
  const { toast } = useToast();
  const [checking, setChecking] = useState(true);
  const [phone, setPhone] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let cancelled = false;
    supabase
      .from("profiles")
      .select("phone")
      .eq("id", userId)
      .maybeSingle()
      .then(({ data }) => {
        if (cancelled) return;
        const stored = (data?.phone ?? "").replace(/\D/g, "");
        // Same 10-15 digit rule the signup forms and the waitlist API use:
        // a row carrying "+91 " or a 4-digit fragment from before the
        // validation existed should be treated as missing, not as done.
        if (stored.length >= 10 && stored.length <= 15) {
          onDone();
          return;
        }
        setChecking(false);
      });
    return () => {
      cancelled = true;
    };
  }, [userId, onDone]);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    const digits = phone.replace(/\D/g, "");
    if (digits.length < 10 || digits.length > 15) {
      toast({
        title: "Phone number needed",
        description: "Please enter a valid phone / WhatsApp number so our team can reach you about your listings.",
        variant: "destructive",
      });
      return;
    }

    setSaving(true);
    // The session exists here (they are signed in), so RLS permits writing
    // your own profile row - unlike the write attempted straight after
    // email signup, where the email is still unconfirmed and there is no
    // session at all. Errors surface rather than being swallowed: a silent
    // failure here is how the number gets lost.
    const { error } = await supabase
      .from("profiles")
      .update({ phone: phone.trim(), updated_at: new Date().toISOString() })
      .eq("id", userId);
    setSaving(false);

    if (error) {
      toast({ title: "Couldn't save your number", description: error.message, variant: "destructive" });
      return;
    }
    onDone();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-sans select-none bg-white">
      <div className="relative flex h-full w-full">
        {/* Same full-bleed photo + cinematic wash as the login screen. */}
        <div className="absolute inset-0">
          <img src={hostBg1} alt="Wayzyy host - Goa coastline at sunset" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-black/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-black/20" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,rgba(0,0,0,0.35)_100%)]" />
        </div>

        <div className="absolute top-6 left-6 right-6 flex items-center justify-between z-20">
          <div className="flex items-center gap-2.5 px-4 py-1.5 rounded-full shadow-lg shadow-black/5 bg-white/80 backdrop-blur-md text-slate-800">
            <img src="/favicon.svg" alt="Wayzyy" className="h-6 w-6 rounded-full object-cover" />
            <span className="font-display font-bold text-sm tracking-tight">
              wayzyy <span className="text-ember font-semibold text-xs ml-1">HOST</span>
            </span>
          </div>
        </div>

        <div className="relative z-10 flex w-full items-center justify-center px-4">
          <div className="relative w-full max-w-md">
            {checking ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="h-6 w-6 animate-spin text-ember" />
              </div>
            ) : (
              <div className="liquid-glass flex flex-col items-center text-center space-y-6 rounded-3xl border border-white/20 bg-black/40 backdrop-blur-2xl px-8 py-10 sm:px-10 sm:py-11 shadow-2xl shadow-black/20">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-ember/15">
                  <Phone className="h-5 w-5 text-ember" />
                </span>

                <div className="space-y-1.5">
                  <h1 className="font-display text-xl font-bold text-white">One last thing</h1>
                  <p className="text-sm text-white/60">
                    Add your phone number and we'll take you straight to your dashboard.
                  </p>
                </div>

                <form onSubmit={save} className="w-full space-y-3 text-left">
                  <label htmlFor="host-phone" className="block text-[11px] font-bold uppercase tracking-wide text-white/70">
                    Phone / WhatsApp
                  </label>
                  <input
                    id="host-phone"
                    type="tel"
                    autoFocus
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full h-12 rounded-2xl bg-white/10 px-4 text-sm font-medium text-white placeholder:text-white/40 shadow-sm shadow-black/5 focus:outline-none focus:bg-white/15 focus:ring-2 focus:ring-ember/25 transition-all"
                  />
                  <p className="text-[11px] text-white/50">
                    Our onboarding team calls you to walk through your listings. We don't share it with guests.
                  </p>

                  <button
                    type="submit"
                    disabled={saving}
                    className="w-full h-12 rounded-2xl bg-ember hover:bg-ember/90 text-white font-bold text-xs tracking-wider uppercase shadow-lg shadow-ember/25 hover:shadow-xl hover:shadow-ember/30 active:scale-[0.97] transition-[transform,background-color,box-shadow] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 disabled:active:scale-100"
                  >
                    {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                    Continue to dashboard
                    {!saving && <ArrowRight className="h-4 w-4" />}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
