import { useState } from "react";
import { Loader2, Lock, ArrowRight } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import hostBg1 from "@/assets/goa-cinematic/sunset-host.webp";

/**
 * Shown only when Supabase has just handed this tab a PASSWORD_RECOVERY
 * session - i.e. the visitor clicked a "reset your password" email link.
 * Without this, a recovery session looks exactly like a normal signed-in
 * one and HostPortal would send them straight to the dashboard, leaving
 * the password unchanged and the whole point of the email link unmet.
 */
export function SetNewPasswordGate({ onDone }: { onDone: () => void }) {
  const { updatePassword } = useAuth();
  const { toast } = useToast();
  const [password, setPassword] = useState("");
  const [saving, setSaving] = useState(false);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      toast({ title: "Too short", description: "Use at least 6 characters.", variant: "destructive" });
      return;
    }
    setSaving(true);
    const { error } = await updatePassword(password);
    setSaving(false);
    if (error) {
      toast({ title: "Couldn't update password", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Password updated", description: "You're all set." });
    onDone();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-sans select-none bg-white">
      <div className="relative flex h-full w-full">
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
            <div className="liquid-glass flex flex-col items-center text-center space-y-6 rounded-3xl border border-white/20 bg-black/40 backdrop-blur-2xl px-8 py-10 sm:px-10 sm:py-11 shadow-2xl shadow-black/20">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-ember/15">
                <Lock className="h-5 w-5 text-ember" />
              </span>

              <div className="space-y-1.5">
                <h1 className="font-display text-xl font-bold text-white">Set a new password</h1>
                <p className="text-sm text-white/60">Choose a password for your Wayzyy host account.</p>
              </div>

              <form onSubmit={save} className="w-full space-y-3 text-left">
                <label htmlFor="new-password" className="block text-[11px] font-bold uppercase tracking-wide text-white/70">
                  New password
                </label>
                <input
                  id="new-password"
                  type="password"
                  autoFocus
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full h-12 rounded-2xl bg-white/10 px-4 text-sm font-medium text-white placeholder:text-white/40 shadow-sm shadow-black/5 focus:outline-none focus:bg-white/15 focus:ring-2 focus:ring-ember/25 transition-all"
                />

                <button
                  type="submit"
                  disabled={saving}
                  className="w-full h-12 rounded-2xl bg-ember hover:bg-ember/90 text-white font-bold text-xs tracking-wider uppercase shadow-lg shadow-ember/25 hover:shadow-xl hover:shadow-ember/30 active:scale-[0.97] transition-[transform,background-color,box-shadow] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 disabled:active:scale-100"
                >
                  {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                  Save password
                  {!saving && <ArrowRight className="h-4 w-4" />}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
