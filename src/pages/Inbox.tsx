import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Loader2, MessageCircle, ArrowLeft } from "lucide-react";
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

export default function Inbox() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [threads, setThreads] = useState<Thread[]>([]);
  const [loading, setLoading] = useState(true);

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

  if (authLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <>
      <SEO title="Messages | Wayzyy" description="Your conversations with hosts and guests." />
      <AirbnbHeader />
      <div className="pt-24 pb-16 min-h-screen">
        <div className="container max-w-2xl">
          <div className="mb-6 flex items-center gap-3">
            <Link to="/" className="text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <h1 className="font-display text-2xl font-bold">Messages</h1>
          </div>

          {!user ? (
            <SignInPrompt />
          ) : loading ? (
            <div className="flex justify-center py-16">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : threads.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-20 text-center text-muted-foreground">
              <MessageCircle className="h-10 w-10 opacity-40" />
              <p>No conversations yet. Message a host from any listing page to start one.</p>
            </div>
          ) : (
            <div className="divide-y divide-border rounded-2xl border border-border overflow-hidden">
              {threads.map((t) => {
                const isHostSide = t.host_id === user.id;
                const otherName = isHostSide ? t.guest_name : t.host_name;
                const otherAvatar = isHostSide ? t.guest_avatar : t.host_avatar;
                const unread = isHostSide ? t.host_unread : t.guest_unread;
                return (
                  <button
                    key={t.id}
                    onClick={() => navigate(`/inbox/${t.id}`)}
                    className="flex w-full items-center gap-3 p-4 text-left hover:bg-muted/40 transition-colors"
                  >
                    <div className="h-11 w-11 shrink-0 rounded-full bg-muted overflow-hidden flex items-center justify-center text-sm font-bold text-muted-foreground">
                      {otherAvatar ? (
                        <img src={otherAvatar} alt={otherName} className="h-full w-full object-cover" />
                      ) : (
                        otherName?.charAt(0).toUpperCase() ?? "?"
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className={`truncate text-sm ${unread ? "font-bold text-foreground" : "font-semibold text-foreground"}`}>
                          {otherName}
                        </p>
                        <span className="shrink-0 text-[11px] text-muted-foreground">{timeAgo(t.last_message_at)}</span>
                      </div>
                      <p className="truncate text-xs text-muted-foreground">{t.property_title}</p>
                      <p className={`truncate text-xs mt-0.5 ${unread ? "font-semibold text-foreground" : "text-muted-foreground"}`}>
                        {t.last_message ?? "No messages yet"}
                      </p>
                    </div>
                    {unread > 0 && <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-[#FF6B00]" />}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
