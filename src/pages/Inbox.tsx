import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Loader2, MessageCircle, ArrowLeft, X, Search } from "lucide-react";
import { format } from "date-fns";
import { supabase } from "@/lib/supabase";
import { ThreadPane } from "./MessageThread";
import { propertyPath } from "@/lib/propertySlug";
import { SEO } from "@/components/SEO";
import { AirbnbHeader } from "@/components/marketplace/AirbnbHeader";
import { useAuth } from "@/hooks/useAuth";
import { fetchThreads, subscribeToThreads, Thread } from "@/lib/messaging";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

// Same `threads` table the mobile app's Inbox tab reads - a conversation
// started on the app shows up here, and vice versa, because it's one
// conversation, not two separate inboxes that happen to look alike.

function SignInPrompt() {
  const { signIn } = useAuth();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const { error } = await signIn(email, password);
    setSubmitting(false);
    if (error) toast({ title: "Couldn't sign in", description: error.message, variant: "destructive" });
  };

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-sm flex-col justify-center gap-4 px-4">
      <h1 className="font-display text-2xl">Sign in to view messages</h1>
      <p className="text-sm text-muted-foreground">
        Your messages are the same ones you'd see in the Wayzyy app - sign in with the same account.
      </p>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <Button type="submit" disabled={submitting} className="w-full">
          {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Sign in"}
        </Button>
      </form>
    </div>
  );
}

const timeAgo = (iso: string) => {
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "now";
  if (mins < 60) return `${mins}m`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d`;
  return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
};

const STATUS_TEXT: Record<string, string> = {
  pending: "Request sent - waiting for the host",
  confirmed: "Your reservation is confirmed",
  completed: "Your reservation has ended",
  cancelled: "This reservation was cancelled",
  not_approved: "The host declined this request",
};

// Right column: the stay this conversation is about, like Airbnb's
// "Reservation" panel. Shows the latest booking between these two people
// for this listing, or just the listing if nothing was booked.
function ReservationPanel({ thread, userId, onClose }: { thread: Thread; userId: string; onClose: () => void }) {
  const [prop, setProp] = useState<any>(null);
  const [booking, setBooking] = useState<any>(null);
  const isHostSide = thread.host_id === userId;

  useEffect(() => {
    let cancelled = false;
    supabase.from("properties").select("id, title, images, city, location").eq("id", thread.property_id).maybeSingle()
      .then(({ data }) => !cancelled && setProp(data));
    supabase.from("bookings").select("id, status, check_in, check_out, guests, total_price")
      .eq("property_id", thread.property_id).eq("guest_id", thread.guest_id)
      .order("created_at", { ascending: false }).limit(1).maybeSingle()
      .then(({ data }) => !cancelled && setBooking(data));
    return () => { cancelled = true; };
  }, [thread.id, thread.property_id, thread.guest_id]);

  const status = booking?.status ?? null;
  const ended = status === "confirmed" && booking?.check_out < new Date().toISOString().slice(0, 10);

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex h-[72px] shrink-0 items-center justify-between border-b border-border px-6">
        <h2 className="text-lg font-bold">Reservation</h2>
        <button onClick={onClose} aria-label="Close reservation details" className="rounded-full p-2 hover:bg-muted"><X className="h-5 w-5" /></button>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto p-6 space-y-6">
        {prop?.images?.[0] && <img src={prop.images[0]} alt="" className="aspect-[4/3] w-full rounded-2xl object-cover" />}
        <div>
          <h3 className="text-2xl font-bold leading-tight">{prop?.title ?? thread.property_title}</h3>
          <p className="mt-1 text-sm text-muted-foreground">{isHostSide ? `Guest: ${thread.guest_name}` : `Hosted by ${thread.host_name}`}</p>
        </div>
        {booking ? (
          <>
            <div>
              <p className="text-sm font-semibold">{ended ? STATUS_TEXT.completed : STATUS_TEXT[status] ?? status}</p>
              {status === "pending" && !isHostSide && <p className="mt-1 text-sm text-muted-foreground">You'll get a message here as soon as the host responds.</p>}
            </div>
            <div className="grid grid-cols-2 divide-x divide-border rounded-2xl border border-border">
              <div className="p-4"><p className="text-sm font-semibold">Check-in</p><p className="text-sm text-muted-foreground">{format(new Date(booking.check_in), "EEE, d MMM")}</p></div>
              <div className="p-4 text-right"><p className="text-sm font-semibold">Checkout</p><p className="text-sm text-muted-foreground">{format(new Date(booking.check_out), "EEE, d MMM")}</p></div>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Guests</span><span>{booking.guests}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">{isHostSide ? "Guest paid" : "Total paid"}</span><span className="font-semibold">₹{Number(booking.total_price).toLocaleString("en-IN")}</span></div>
            </div>
          </>
        ) : (
          <p className="text-sm text-muted-foreground">No reservation yet for this stay.</p>
        )}
        <div className="flex flex-col gap-2 border-t border-border pt-5 text-sm">
          {prop && <Link to={propertyPath({ id: prop.id, title: prop.title, city: prop.city })} className="font-semibold underline">View listing</Link>}
          <Link to={isHostSide ? "/host/bookings" : "/trips"} className="font-semibold underline">{isHostSide ? "Manage bookings" : "Go to your trips"}</Link>
          {!isHostSide && <Link to="/account?s=help" className="font-semibold underline">Get help with this stay</Link>}
        </div>
      </div>
    </div>
  );
}

export default function Inbox() {
  const { threadId } = useParams<{ threadId?: string }>();
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [threads, setThreads] = useState<Thread[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [detailsOpen, setDetailsOpen] = useState(true);

  useEffect(() => {
    if (!user) { setLoading(false); return; }
    let cancelled = false;
    const load = async () => {
      const data = await fetchThreads(user.id);
      if (!cancelled) { setThreads(data); setLoading(false); }
    };
    load();
    const channel = subscribeToThreads(user.id, load);
    return () => { cancelled = true; channel.unsubscribe(); };
  }, [user]);

  // Desktop opens the newest conversation straight away, like Airbnb.
  useEffect(() => {
    if (!threadId && threads.length > 0 && window.matchMedia("(min-width: 1024px)").matches) {
      navigate(`/inbox/${threads[0].id}`, { replace: true });
    }
  }, [threadId, threads, navigate]);

  if (authLoading) {
    return <div className="flex min-h-[60vh] items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>;
  }

  const active = threads.find((t) => t.id === threadId) ?? null;
  const q = query.trim().toLowerCase();
  const shown = q ? threads.filter((t) => [t.guest_name, t.host_name, t.property_title, t.last_message].some((v) => v?.toLowerCase().includes(q))) : threads;

  return (
    <>
      <SEO title="Messages | Wayzyy" description="Your conversations with hosts and guests." noindex />
      <div className="flex h-[100dvh] flex-col bg-background">
        <AirbnbHeader compact />
        {!user ? (
          <SignInPrompt />
        ) : (
          <div className="flex min-h-0 flex-1 border-t border-border">
            {/* Conversations */}
            <aside className={`${threadId ? "hidden lg:flex" : "flex"} w-full lg:w-[380px] shrink-0 flex-col border-r border-border`}>
              <div className="flex h-[72px] shrink-0 items-center gap-3 px-6">
                <Link to="/" aria-label="Back to stays" className="rounded-full p-2 -ml-2 hover:bg-muted"><ArrowLeft className="h-5 w-5" /></Link>
                <h1 className="flex-1 text-2xl font-bold">Messages</h1>
              </div>
              <div className="px-6 pb-3">
                <label className="flex items-center gap-2 rounded-full border border-border px-4 py-2 focus-within:border-foreground/50">
                  <Search className="h-4 w-4 text-muted-foreground" />
                  <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search messages" className="flex-1 bg-transparent text-sm outline-none" />
                </label>
              </div>
              <div className="min-h-0 flex-1 overflow-y-auto px-3 pb-4">
                {loading ? (
                  <div className="flex justify-center py-16"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
                ) : shown.length === 0 ? (
                  <div className="flex flex-col items-center gap-3 px-6 py-20 text-center text-sm text-muted-foreground">
                    <MessageCircle className="h-10 w-10 opacity-40" />
                    <p>{q ? "No conversations match that search." : "No messages yet. When you book or enquire about a stay, the conversation shows up here."}</p>
                  </div>
                ) : shown.map((t) => {
                  const isHostSide = t.host_id === user.id;
                  const otherName = (isHostSide ? t.guest_name : t.host_name) || "Wayzyy";
                  const otherAvatar = isHostSide ? t.guest_avatar : t.host_avatar;
                  const unread = isHostSide ? t.host_unread : t.guest_unread;
                  const selected = t.id === threadId;
                  return (
                    <button
                      key={t.id}
                      onClick={() => navigate(`/inbox/${t.id}`)}
                      aria-current={selected ? "true" : undefined}
                      className={`relative flex w-full items-start gap-3 rounded-2xl p-3 text-left transition-colors ${selected ? "bg-muted" : "hover:bg-muted/50"}`}
                    >
                      {unread > 0 && <span className="absolute left-0.5 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-[#FF6B00]" aria-label="Unread" />}
                      <span className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-muted text-sm font-bold text-muted-foreground">
                        {otherAvatar ? <img src={otherAvatar} alt="" className="h-full w-full object-cover" /> : otherName.charAt(0).toUpperCase()}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="flex items-baseline justify-between gap-2">
                          <span className="truncate text-xs text-muted-foreground">{otherName}</span>
                          <span className="shrink-0 text-xs text-muted-foreground">{timeAgo(t.last_message_at)}</span>
                        </span>
                        <span className={`block truncate text-[15px] ${unread ? "font-bold" : "font-semibold"} text-foreground`}>{t.property_title}</span>
                        <span className={`line-clamp-2 text-sm ${unread ? "text-foreground" : "text-muted-foreground"}`}>{t.last_message ?? "No messages yet"}</span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </aside>

            {/* Conversation */}
            <main className={`${threadId ? "flex" : "hidden lg:flex"} min-w-0 flex-1 flex-col`}>
              {threadId ? (
                <ThreadPane
                  threadId={threadId}
                  onBack={() => navigate("/inbox")}
                  detailsOpen={detailsOpen}
                  onToggleDetails={() => setDetailsOpen((v) => !v)}
                />
              ) : (
                <div className="flex flex-1 flex-col items-center justify-center gap-2 text-sm text-muted-foreground">
                  <MessageCircle className="h-10 w-10 opacity-40" />
                  Pick a conversation to read it.
                </div>
              )}
            </main>

            {/* Reservation */}
            {active && detailsOpen && (
              <aside className="hidden xl:flex w-[400px] shrink-0 flex-col border-l border-border">
                <ReservationPanel thread={active} userId={user.id} onClose={() => setDetailsOpen(false)} />
              </aside>
            )}
          </div>
        )}
      </div>
    </>
  );
}
