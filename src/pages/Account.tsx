import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Bell, Gift, HelpCircle, Lock, Shield, Star, User } from "lucide-react";
import { format } from "date-fns";
import { SEO } from "@/components/SEO";
import { AirbnbHeader } from "@/components/marketplace/AirbnbHeader";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { unblockUser } from "@/lib/blocks";
import { SUPPORT_PHONE } from "@/components/host/HostGetStarted";

// Guest account, the website counterpart of the app's Profile tab. Every
// section reads and writes the same rows/functions the app uses.

const SECTIONS = [
  { id: "profile", label: "Personal info", icon: User },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "wallet", label: "Wallet & referrals", icon: Gift },
  { id: "reviews", label: "Your reviews", icon: Star },
  { id: "blocked", label: "Blocked people", icon: Shield },
  { id: "help", label: "Help & support", icon: HelpCircle },
  { id: "security", label: "Login & security", icon: Lock },
] as const;
type SectionId = typeof SECTIONS[number]["id"];

const NOTIFICATION_GROUPS: { title: string; items: { key: string; title: string; sub: string }[] }[] = [
  { title: "Your trips", items: [
    { key: "booking_confirm", title: "Booking confirmations", sub: "When a booking is confirmed or cancelled" },
    { key: "checkin_remind", title: "Check-in reminders", sub: "24 hours before your stay begins" },
    { key: "host_message", title: "Messages", sub: "New messages about your bookings" },
    { key: "review_remind", title: "Review reminders", sub: "A nudge to review after a stay" },
  ] },
  { title: "Offers & news", items: [
    { key: "deals", title: "Deals & offers", sub: "Discounts and limited-time offers" },
    { key: "wishlist", title: "Wishlist price drops", sub: "When a saved stay gets cheaper" },
    { key: "omeroo_news", title: "Wayzyy news", sub: "Product updates and new features" },
  ] },
  { title: "WhatsApp", items: [
    { key: "whatsapp", title: "Booking alerts on WhatsApp", sub: "New requests, confirmations and reminders (hosts)" },
  ] },
  { title: "Account", items: [
    { key: "security", title: "Security alerts", sub: "Sign-ins and account changes" },
    { key: "policy", title: "Policy updates", sub: "Changes to our Terms and Privacy Policy" },
  ] },
];

const SUPPORT_CATEGORIES = [
  { key: "payment", label: "Payment issue" },
  { key: "booking", label: "Booking problem" },
  { key: "account", label: "Account issue" },
  { key: "host", label: "Issue with a host" },
  { key: "app_bug", label: "Website or app bug" },
  { key: "other", label: "Other" },
];

const GRANT_LABEL: Record<string, string> = {
  backfill_existing_user: "Welcome credit",
  waitlist_signup: "Waitlist credit",
  manual: "Credit from Wayzyy",
  referral_referrer: "Friend joined with your code",
  referral_referred: "Joined with a friend's code",
};

function Toggle({ on, onChange, label }: { on: boolean; onChange: () => void; label: string }) {
  return (
    <button type="button" role="switch" aria-checked={on} aria-label={label} onClick={onChange} className={`relative h-6 w-11 shrink-0 rounded-full p-0.5 transition-colors ${on ? "bg-[#FF6B00]" : "bg-muted-foreground/30"}`}>
      <span className={`block h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${on ? "translate-x-5" : ""}`} />
    </button>
  );
}

const field = "w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-foreground";

export default function Account() {
  const { user, loading, resetPassword } = useAuth() as any;
  const { toast } = useToast();
  const [params, setParams] = useSearchParams();
  const section = (SECTIONS.find((s) => s.id === params.get("s"))?.id ?? "profile") as SectionId;

  const [profile, setProfile] = useState<any>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [prefs, setPrefs] = useState<Record<string, boolean>>({});
  const [grants, setGrants] = useState<any[]>([]);
  const [refCode, setRefCode] = useState("");
  const [reviews, setReviews] = useState<any[]>([]);
  const [blocked, setBlocked] = useState<{ id: string; name: string }[]>([]);
  const [supportCat, setSupportCat] = useState("booking");
  const [supportText, setSupportText] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!user) return;
    supabase.from("profiles").select("name, phone, notification_preferences, wallet_balance, referral_code, referred_by").eq("id", user.id).maybeSingle()
      .then(({ data }) => {
        setProfile(data ?? {});
        setName(data?.name ?? (user.user_metadata?.name as string) ?? "");
        setPhone(data?.phone ?? "");
        setPrefs((data?.notification_preferences as Record<string, boolean>) ?? {});
      });
  }, [user]);

  useEffect(() => {
    if (!user) return;
    if (section === "wallet") {
      supabase.from("wallet_credit_grants").select("*").eq("user_id", user.id).order("created_at", { ascending: false }).then(({ data }) => setGrants(data ?? []));
    }
    if (section === "reviews") {
      supabase.from("reviews").select("id, rating, comment, created_at, properties(title)").eq("reviewer_id", user.id).order("created_at", { ascending: false }).then(({ data }) => setReviews(data ?? []));
    }
    if (section === "blocked") {
      supabase.from("user_blocks").select("blocked_id").eq("blocker_id", user.id).then(async ({ data }) => {
        const ids = (data ?? []).map((r: any) => r.blocked_id);
        if (!ids.length) { setBlocked([]); return; }
        const { data: ps } = await supabase.from("profiles").select("id, name").in("id", ids);
        const names = new Map((ps ?? []).map((p: any) => [p.id, p.name]));
        setBlocked(ids.map((id: string) => ({ id, name: names.get(id) || "Wayzyy user" })));
      });
    }
  }, [user, section]);

  const saveProfile = async () => {
    setBusy(true);
    const digits = phone.replace(/\D/g, "");
    const cleanPhone = digits.length === 10 ? `+91${digits}` : phone.trim();
    const { error } = await supabase.from("profiles").update({ name: name.trim() || null, phone: cleanPhone || null, updated_at: new Date().toISOString() }).eq("id", user.id);
    if (!error) await supabase.auth.updateUser({ data: { name: name.trim() } });
    setBusy(false);
    toast(error ? { title: "Couldn't save", description: error.message, variant: "destructive" } : { title: "Saved" });
  };

  // Missing keys default to on, same as the app.
  // WhatsApp needs an explicit opt-in, so it's off until switched on.
  const prefOn = (k: string) => (k === "whatsapp" ? prefs[k] === true : prefs[k] !== false);
  const togglePref = async (k: string) => {
    const next = { ...prefs, [k]: !prefOn(k) };
    setPrefs(next);
    const { error } = await supabase.from("profiles").update({ notification_preferences: next }).eq("id", user.id);
    if (error) { setPrefs(prefs); toast({ title: "Couldn't update", description: error.message, variant: "destructive" }); }
  };

  const redeem = async () => {
    setBusy(true);
    const { data, error } = await supabase.functions.invoke("redeem-referral-code", { body: { code: refCode.trim().toUpperCase() } });
    setBusy(false);
    if (error || data?.error) { toast({ title: "Couldn't use that code", description: data?.error ?? "Check the code and try again.", variant: "destructive" }); return; }
    toast({ title: "Code applied", description: "Your credit has been added." });
    setRefCode("");
    const { data: p } = await supabase.from("profiles").select("wallet_balance, referral_code, referred_by").eq("id", user.id).maybeSingle();
    setProfile((prev: any) => ({ ...prev, ...p }));
    const { data: g } = await supabase.from("wallet_credit_grants").select("*").eq("user_id", user.id).order("created_at", { ascending: false });
    setGrants(g ?? []);
  };

  const sendSupport = async () => {
    setBusy(true);
    const { data, error } = await supabase.functions.invoke("send-support-email", {
      body: { userId: user.id, userEmail: user.email, userName: name || user.email, category: supportCat, description: supportText.trim() },
    });
    setBusy(false);
    if (error || !data?.success) { toast({ title: "Couldn't send", description: data?.error ?? `Try again, or WhatsApp us on ${SUPPORT_PHONE}.`, variant: "destructive" }); return; }
    toast({ title: "Sent", description: "Our team will reply by email, usually within a day." });
    setSupportText("");
  };

  const sendReset = async () => {
    if (!user?.email) return;
    setBusy(true);
    const res = resetPassword ? await resetPassword(user.email) : await supabase.auth.resetPasswordForEmail(user.email, { redirectTo: `${window.location.origin}/host` });
    setBusy(false);
    const err = (res as any)?.error;
    toast(err ? { title: "Couldn't send the email", description: err.message, variant: "destructive" } : { title: "Check your email", description: `We sent a link to ${user.email} to set a new password.` });
  };

  if (!loading && !user) {
    return (
      <SEO title="Account - Wayzyy" description="Your Wayzyy account.">
        <div className="min-h-screen bg-background"><AirbnbHeader compact />
          <main className="mx-auto max-w-md px-4 py-16 text-center space-y-3">
            <h1 className="text-2xl font-bold font-display">Sign in to see your account</h1>
            <p className="text-sm text-muted-foreground">Your profile, wallet credit and reviews live here.</p>
            <Link to="/host" className="btn-brand inline-flex">Sign in</Link>
          </main>
        </div>
      </SEO>
    );
  }

  return (
    <SEO title="Account - Wayzyy" description="Your Wayzyy account.">
      <div className="min-h-screen bg-background text-foreground">
        <AirbnbHeader compact />
        <main className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-10 py-10">
          <h1 className="text-3xl font-bold font-display">Account</h1>
          {user?.email && <p className="mt-1 text-sm text-muted-foreground">{name || user.email} · {user.email}</p>}

          <div className="mt-8 grid gap-8 md:grid-cols-[220px_1fr]">
            <nav className="flex md:flex-col gap-1 overflow-x-auto no-scrollbar" aria-label="Account sections">
              {SECTIONS.map(({ id, label, icon: Icon }) => (
                <button key={id} onClick={() => setParams({ s: id })} aria-current={section === id ? "page" : undefined}
                  className={`flex shrink-0 items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm text-left transition-colors ${section === id ? "bg-muted font-semibold text-foreground" : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"}`}>
                  <Icon className="h-4 w-4" /> {label}
                </button>
              ))}
            </nav>

            <section className="min-w-0 max-w-2xl space-y-6">
              {section === "profile" && (
                <>
                  <h2 className="text-xl font-bold">Personal info</h2>
                  <label className="block space-y-1.5"><span className="text-sm font-medium">Full name</span><input value={name} onChange={(e) => setName(e.target.value)} className={field} /></label>
                  <label className="block space-y-1.5"><span className="text-sm font-medium">Mobile number</span><input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="98765 43210" inputMode="tel" className={field} /></label>
                  <label className="block space-y-1.5"><span className="text-sm font-medium">Email</span><input value={user?.email ?? ""} disabled className={`${field} opacity-60`} /></label>
                  <div className="flex flex-wrap items-center gap-3">
                    <button onClick={saveProfile} disabled={busy} className="btn-brand">Save</button>
                    <Link to="/verify-identity" className="text-sm font-semibold underline">Verify your identity</Link>
                  </div>
                </>
              )}

              {section === "notifications" && (
                <>
                  <h2 className="text-xl font-bold">Notifications</h2>
                  {NOTIFICATION_GROUPS.map((g) => (
                    <div key={g.title} className="space-y-1">
                      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{g.title}</p>
                      {g.items.map((it) => (
                        <div key={it.key} className="flex items-center justify-between gap-4 border-b border-border py-3">
                          <div><p className="text-sm font-semibold">{it.title}</p><p className="text-xs text-muted-foreground">{it.sub}</p></div>
                          <Toggle on={prefOn(it.key)} onChange={() => togglePref(it.key)} label={it.title} />
                        </div>
                      ))}
                    </div>
                  ))}
                </>
              )}

              {section === "wallet" && (
                <>
                  <h2 className="text-xl font-bold">Wallet & referrals</h2>
                  <div className="rounded-2xl border border-border p-5">
                    <p className="text-sm text-muted-foreground">Wayzyy credit</p>
                    <p className="text-3xl font-bold tabular-nums">₹{Number(profile?.wallet_balance ?? 0).toLocaleString("en-IN")}</p>
                    <p className="mt-1 text-xs text-muted-foreground">Use it at checkout on any stay.</p>
                  </div>
                  {profile?.referral_code && (
                    <div className="rounded-2xl border border-border p-5 space-y-2">
                      <p className="text-sm font-semibold">Your referral code</p>
                      <div className="flex items-center gap-3">
                        <span className="rounded-lg bg-muted px-3 py-1.5 font-mono text-lg tracking-wider">{profile.referral_code}</span>
                        <button onClick={() => { navigator.clipboard?.writeText(profile.referral_code); toast({ title: "Copied" }); }} className="text-sm font-semibold underline">Copy</button>
                      </div>
                      <p className="text-xs text-muted-foreground">Share it. When a friend joins with it, you both get credit.</p>
                    </div>
                  )}
                  {!profile?.referred_by && (
                    <form onSubmit={(e) => { e.preventDefault(); redeem(); }} className="flex gap-2">
                      <input value={refCode} onChange={(e) => setRefCode(e.target.value)} placeholder="Got a friend's code?" className={`${field} uppercase`} />
                      <button disabled={!refCode.trim() || busy} className="btn-brand shrink-0">Apply</button>
                    </form>
                  )}
                  {grants.length > 0 && (
                    <div>
                      <p className="mb-2 text-sm font-semibold">History</p>
                      {grants.map((g) => (
                        <div key={g.id} className="flex items-center justify-between border-b border-border py-2.5 text-sm">
                          <span>{GRANT_LABEL[g.source] ?? "Credit"}<span className="block text-xs text-muted-foreground">{format(new Date(g.created_at), "d MMM yyyy")}{g.redeemed ? " · used" : g.expired ? " · expired" : g.expires_at ? ` · expires ${format(new Date(g.expires_at), "d MMM yyyy")}` : ""}</span></span>
                          <span className="font-semibold tabular-nums">₹{Number(g.amount).toLocaleString("en-IN")}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}

              {section === "reviews" && (
                <>
                  <h2 className="text-xl font-bold">Your reviews</h2>
                  {reviews.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No reviews yet. After a stay, you'll find "Write a review" on <Link to="/trips" className="underline">your trips</Link>.</p>
                  ) : reviews.map((r) => (
                    <div key={r.id} className="rounded-2xl border border-border p-4 space-y-1">
                      <div className="flex items-center justify-between gap-3">
                        <p className="truncate text-sm font-semibold">{(Array.isArray(r.properties) ? r.properties[0] : r.properties)?.title ?? "Stay"}</p>
                        <span className="flex shrink-0 items-center gap-1 text-sm"><Star className="h-4 w-4 fill-[#FF6B00] text-[#FF6B00]" />{r.rating}</span>
                      </div>
                      {r.comment && <p className="text-sm text-muted-foreground">{r.comment}</p>}
                      <p className="text-xs text-muted-foreground">{format(new Date(r.created_at), "d MMM yyyy")}</p>
                    </div>
                  ))}
                </>
              )}

              {section === "blocked" && (
                <>
                  <h2 className="text-xl font-bold">Blocked people</h2>
                  {blocked.length === 0 ? <p className="text-sm text-muted-foreground">You haven't blocked anyone.</p> : blocked.map((b) => (
                    <div key={b.id} className="flex items-center justify-between border-b border-border py-3">
                      <span className="text-sm font-medium">{b.name}</span>
                      <button onClick={async () => { const r = await unblockUser(b.id); if (r.ok) setBlocked((x) => x.filter((y) => y.id !== b.id)); else toast({ title: "Couldn't unblock", description: r.reason, variant: "destructive" }); }} className="text-sm font-semibold underline">Unblock</button>
                    </div>
                  ))}
                </>
              )}

              {section === "help" && (
                <>
                  <h2 className="text-xl font-bold">Help & support</h2>
                  <div className="flex flex-wrap gap-2">
                    <a href={`https://wa.me/${SUPPORT_PHONE.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer" className="rounded-full bg-[#25D366] px-4 py-2 text-sm font-semibold text-white">WhatsApp us</a>
                    <a href={`tel:${SUPPORT_PHONE.replace(/\s/g, "")}`} className="rounded-full border border-border px-4 py-2 text-sm font-semibold">Call {SUPPORT_PHONE}</a>
                    <Link to="/policies" className="rounded-full border border-border px-4 py-2 text-sm font-semibold">Policies</Link>
                    <Link to="/policies/cancellation" className="rounded-full border border-border px-4 py-2 text-sm font-semibold">Cancellation policy</Link>
                  </div>
                  <div className="space-y-3 rounded-2xl border border-border p-5">
                    <p className="text-sm font-semibold">Report an issue</p>
                    <div className="flex flex-wrap gap-2">
                      {SUPPORT_CATEGORIES.map((c) => (
                        <button key={c.key} onClick={() => setSupportCat(c.key)} className={`rounded-full border px-3 py-1.5 text-sm ${supportCat === c.key ? "border-foreground bg-foreground text-background" : "border-border"}`}>{c.label}</button>
                      ))}
                    </div>
                    <textarea value={supportText} onChange={(e) => setSupportText(e.target.value)} rows={4} maxLength={2000} placeholder="Tell us what happened (at least 10 characters)" className={field} />
                    <button onClick={sendSupport} disabled={supportText.trim().length < 10 || busy} className="btn-brand">Send</button>
                  </div>
                </>
              )}

              {section === "security" && (
                <>
                  <h2 className="text-xl font-bold">Login & security</h2>
                  <div className="rounded-2xl border border-border p-5 space-y-2">
                    <p className="text-sm font-semibold">Password</p>
                    <p className="text-sm text-muted-foreground">We'll email {user?.email} a link to set a new password.</p>
                    <button onClick={sendReset} disabled={busy} className="btn-brand">Send reset link</button>
                  </div>
                  <div className="rounded-2xl border border-border p-5 space-y-2">
                    <p className="text-sm font-semibold">Sign out</p>
                    <button onClick={() => supabase.auth.signOut().then(() => { window.location.href = "/"; })} className="rounded-full border border-border px-4 py-2 text-sm font-semibold">Sign out of this device</button>
                  </div>
                  <div className="rounded-2xl border border-red-600/30 p-5 space-y-2">
                    <p className="text-sm font-semibold">Delete account</p>
                    <p className="text-sm text-muted-foreground">Permanently remove your account and data.</p>
                    <Link to="/delete-account" className="text-sm font-semibold text-red-600 underline">Delete my account</Link>
                  </div>
                </>
              )}
            </section>
          </div>
        </main>
      </div>
    </SEO>
  );
}
