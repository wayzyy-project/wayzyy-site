import { useEffect, useState } from "react";
import { MessageCircle, X } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

// One-tap opt-in for WhatsApp booking alerts (new requests, confirmations,
// reminders). WhatsApp needs each person's agreement, so this is the host's
// own choice: it sets notification_preferences.whatsapp, which the backend's
// _shared/whatsapp.ts checks before sending anything.
export function WhatsAppOptIn({ userId }: { userId: string }) {
  const { toast } = useToast();
  const [state, setState] = useState<{ on: boolean; phone: string; prefs: Record<string, unknown> } | null>(null);
  const [phone, setPhone] = useState("");
  const [busy, setBusy] = useState(false);
  const [hidden, setHidden] = useState(() => {
    try { return sessionStorage.getItem("wayzyy_wa_optin_hidden") === "1"; } catch { return false; }
  });

  useEffect(() => {
    supabase.from("profiles").select("phone, notification_preferences").eq("id", userId).maybeSingle().then(({ data }) => {
      const prefs = (data?.notification_preferences as Record<string, unknown>) ?? {};
      setState({ on: prefs.whatsapp === true, phone: data?.phone ?? "", prefs });
    });
  }, [userId]);

  if (!state || state.on || hidden) return null;
  const digits = (state.phone || "").replace(/\D/g, "");
  const needsPhone = digits.length < 10;

  const turnOn = async () => {
    const entered = phone.replace(/\D/g, "");
    if (needsPhone && entered.length !== 10) {
      toast({ title: "Enter your 10-digit mobile number", variant: "destructive" });
      return;
    }
    setBusy(true);
    const patch: Record<string, unknown> = { notification_preferences: { ...state.prefs, whatsapp: true } };
    if (needsPhone) patch.phone = `+91${entered}`;
    const { error } = await supabase.from("profiles").update(patch).eq("id", userId);
    setBusy(false);
    if (error) { toast({ title: "Couldn't turn it on", description: error.message, variant: "destructive" }); return; }
    setState({ ...state, on: true });
    toast({ title: "WhatsApp alerts are on", description: "You'll get new booking requests and reminders on WhatsApp." });
  };

  return (
    <section className="flex flex-col gap-3 rounded-2xl border border-[#25D366]/40 bg-[#25D366]/10 p-4 sm:flex-row sm:items-center">
      <MessageCircle className="h-6 w-6 shrink-0 text-[#1a9e4b]" />
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-foreground">Get booking requests on WhatsApp</p>
        <p className="text-xs text-muted-foreground">New requests, confirmations and check-in reminders, so you can reply within the 6 hours. You can turn this off any time in Account → Notifications.</p>
      </div>
      {needsPhone && (
        <input value={phone} onChange={(e) => setPhone(e.target.value)} inputMode="tel" placeholder="Mobile number" maxLength={14}
          className="w-full rounded-full border border-border bg-background px-4 py-2 text-sm text-foreground placeholder:text-muted-foreground sm:w-44" />
      )}
      <div className="flex items-center gap-2">
        <button onClick={turnOn} disabled={busy} className="btn-brand">{busy ? "Turning on…" : "Turn on"}</button>
        <button onClick={() => { setHidden(true); try { sessionStorage.setItem("wayzyy_wa_optin_hidden", "1"); } catch { /* */ } }}
          aria-label="Not now" className="rounded-full p-2 text-muted-foreground hover:bg-muted"><X className="h-4 w-4" /></button>
      </div>
    </section>
  );
}
