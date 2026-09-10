import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Loader2, Send } from "lucide-react";
import { SEO } from "@/components/SEO";
import { AirbnbHeader } from "@/components/marketplace/AirbnbHeader";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";
import {
  Message,
  Thread,
  fetchMessages,
  sendMessage,
  subscribeToMessages,
  markThreadRead,
  WAYZYY_SYSTEM_ACCOUNT_ID,
} from "@/lib/messaging";

const formatTime = (iso: string) =>
  new Date(iso).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });

// Same booking-event parsing mobile's MessageThreadScreen does, so a
// "Booking Confirmed" system message reads the same on web as in the app,
// not as a wall of raw newline-joined text.
type SystemKind = "request" | "confirmed" | "declined" | "other";
const parseSystemMessage = (content: string): { kind: SystemKind; lines: Record<string, string> } => {
  let kind: SystemKind = "other";
  if (content.includes("Booking Request")) kind = "request";
  else if (content.includes("Booking Confirmed")) kind = "confirmed";
  else if (content.includes("Booking Declined")) kind = "declined";
  else if (content.includes("Booking Cancelled")) kind = "other";
  else return { kind: "other", lines: {} };

  const lines: Record<string, string> = {};
  for (const raw of content.split("\n")) {
    const line = raw.trim();
    const [key, ...rest] = line.split(":");
    if (rest.length > 0 && ["Property", "Guest", "Dates", "Guests", "Total Payout", "Total Price", "Reference"].includes(key)) {
      lines[key] = rest.join(":").trim();
    }
  }
  return { kind, lines };
};

const SYSTEM_LABEL: Record<SystemKind, string> = {
  request: "Booking Request",
  confirmed: "Booking Confirmed",
  declined: "Booking Declined",
  other: "Update",
};

function SystemMessageCard({ content }: { content: string }) {
  const { kind, lines } = parseSystemMessage(content);
  if (kind === "other" && Object.keys(lines).length === 0) {
    return (
      <div className="mx-auto max-w-sm rounded-xl bg-muted/60 px-4 py-3 text-center text-xs text-muted-foreground whitespace-pre-line">
        {content}
      </div>
    );
  }
  return (
    <div className="mx-auto max-w-sm rounded-2xl border border-border bg-card p-4">
      <p className="text-[11px] font-bold uppercase tracking-wide text-[#FF6B00]">{SYSTEM_LABEL[kind]}</p>
      <div className="mt-2 space-y-1 text-sm">
        {Object.entries(lines).map(([k, v]) => (
          <p key={k} className="text-foreground">
            <span className="text-muted-foreground">{k}: </span>
            {v}
          </p>
        ))}
      </div>
    </div>
  );
}

export default function MessageThread() {
  const { threadId } = useParams<{ threadId: string }>();
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [thread, setThread] = useState<Thread | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!authLoading && !user) navigate("/inbox", { replace: true });
  }, [authLoading, user, navigate]);

  useEffect(() => {
    if (!threadId || !user) return;
    let cancelled = false;

    (async () => {
      const { data } = await supabase.from("threads").select("*").eq("id", threadId).maybeSingle();
      if (cancelled) return;
      if (!data || (data.guest_id !== user.id && data.host_id !== user.id)) {
        navigate("/inbox", { replace: true });
        return;
      }
      setThread(data as Thread);
      const msgs = await fetchMessages(threadId);
      if (!cancelled) { setMessages(msgs); setLoading(false); }
      markThreadRead(threadId, data.host_id === user.id);
    })();

    const channel = subscribeToMessages(threadId, (msg) => {
      setMessages((prev) => (prev.some((m) => m.id === msg.id) ? prev : [...prev, msg]));
      if (thread) markThreadRead(threadId, thread.host_id === user.id);
    });
    return () => { cancelled = true; channel.unsubscribe(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [threadId, user]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !thread || !user || sending) return;
    setSending(true);
    const isHostSide = thread.host_id === user.id;
    const senderName = isHostSide ? thread.host_name : thread.guest_name;
    const content = input.trim();
    setInput("");
    const sent = await sendMessage(thread.id, user.id, senderName, content);
    if (sent) setMessages((prev) => (prev.some((m) => m.id === sent.id) ? prev : [...prev, sent]));
    setSending(false);
  };

  if (authLoading || (loading && user)) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }
  if (!user || !thread) return null;

  const isHostSide = thread.host_id === user.id;
  const otherName = isHostSide ? thread.guest_name : thread.host_name;

  return (
    <>
      <SEO title={`${otherName} | Wayzyy Messages`} description="Conversation about your Wayzyy stay." />
      <div className="flex min-h-screen flex-col">
        <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
          <div className="container flex h-16 max-w-2xl items-center gap-3">
            <Link to="/inbox" className="text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-foreground">{otherName}</p>
              <p className="truncate text-xs text-muted-foreground">{thread.property_title}</p>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto">
          <div className="container max-w-2xl space-y-3 py-6">
            {messages.map((m) => {
              const isSystem = m.sender_id === WAYZYY_SYSTEM_ACCOUNT_ID;
              const isOwn = m.sender_id === user.id;
              if (isSystem) return <SystemMessageCard key={m.id} content={m.content} />;
              return (
                <div key={m.id} className={`flex ${isOwn ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm whitespace-pre-wrap break-words ${
                      isOwn ? "bg-[#FF6B00] text-white" : "bg-muted text-foreground"
                    }`}
                  >
                    {m.content}
                    <p className={`mt-1 text-[10px] ${isOwn ? "text-white/70" : "text-muted-foreground"}`}>
                      {formatTime(m.created_at)}
                    </p>
                  </div>
                </div>
              );
            })}
            <div ref={bottomRef} />
          </div>
        </div>

        <form onSubmit={handleSend} className="sticky bottom-0 border-t border-border bg-background p-3">
          <div className="container flex max-w-2xl items-center gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 rounded-full border border-border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B00]/40"
            />
            <button
              type="submit"
              disabled={!input.trim() || sending}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#FF6B00] text-white disabled:opacity-40"
            >
              {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
