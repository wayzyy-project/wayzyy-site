import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MessageCircle } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { fetchThreads, subscribeToThreads } from "@/lib/messaging";

/** Icon button + live unread dot for the same `threads` table the mobile
 *  app's Inbox reads - dropped into both the guest-facing marketplace header
 *  and the host portal header so either side always has a way in. */
export function MessagesLink({ dark = false }: { dark?: boolean }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [hasUnread, setHasUnread] = useState(false);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;

    const check = async () => {
      const threads = await fetchThreads(user.id);
      if (cancelled) return;
      const isHostSide = (t: { host_id: string }) => t.host_id === user.id;
      setHasUnread(threads.some((t) => (isHostSide(t) ? t.host_unread : t.guest_unread) > 0));
    };
    check();

    const channel = subscribeToThreads(user.id, check);
    return () => { cancelled = true; channel.unsubscribe(); };
  }, [user]);

  if (!user) return null;

  return (
    <button
      onClick={() => navigate("/inbox")}
      className={`relative rounded-full p-2.5 transition-colors border ${
        dark
          ? "text-white hover:bg-white/10 border-white/10"
          : "text-foreground hover:bg-muted border-border/60"
      }`}
      title="Messages"
    >
      <MessageCircle className="h-4 w-4" />
      {hasUnread && (
        <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-[#FF6B00] ring-2 ring-background" />
      )}
    </button>
  );
}
