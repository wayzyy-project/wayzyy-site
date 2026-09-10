import { useEffect, useState } from "react";
import { Loader2, Phone, ArrowRight } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

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
 * asked again. A returning host with a number never sees this at all.
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

  // Nothing is rendered while the lookup is in flight. Showing the form
  // first would flash "add your phone number" at every returning host who
  // already has one.
  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950">
        <Loader2 className="h-6 w-6 animate-spin text-ember" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-5 py-12">
      <div className="w-full max-w-sm rounded-3xl border border-white/10 bg-white/5 p-7 text-center shadow-2xl backdrop-blur-xl">
        <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-ember/15">
          <Phone className="h-5 w-5 text-ember" />
        </span>

        <h1 className="mt-4 font-display text-xl font-bold text-white">One last thing</h1>
        <p className="mt-1.5 text-sm text-white/60">
          Add your phone number and we'll take you straight to your dashboard.
        </p>

        <form onSubmit={save} className="mt-6 space-y-3 text-left">
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
            className="h-12 w-full rounded-2xl bg-white/10 px-4 text-sm font-medium text-white placeholder:text-white/40 focus:bg-white/15 focus:outline-none focus:ring-2 focus:ring-ember/25"
          />
          <p className="text-[11px] text-white/50">
            Our onboarding team calls you to walk through your listings. We don't share it with guests.
          </p>

          <button
            type="submit"
            disabled={saving}
            className="mt-2 flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-ember text-sm font-bold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            Continue to dashboard
            {!saving && <ArrowRight className="h-4 w-4" />}
          </button>
        </form>
      </div>
    </div>
  );
}
