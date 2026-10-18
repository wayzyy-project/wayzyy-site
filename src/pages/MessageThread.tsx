import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Loader2, Send, PanelRight } from "lucide-react";
import { SEO } from "@/components/SEO";
import { AirbnbHeader } from "@/components/marketplace/AirbnbHeader";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";
import { blockUser, unblockUser, isBlocked } from "@/lib/blocks";
import { useToast } from "@/hooks/use-toast";
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
type SystemKind = "request" | "confirmed" | "declined" | "verify" | "guestVerified" | "other";
const parseSystemMessage = (content: string): { kind: SystemKind; lines: Record<string, string> } => {
  let kind: SystemKind = "other";
  if (content.startsWith("Verification Needed") || content.startsWith("Booking Approved")) {
    // The explanation sits between the heading and the Reference line.
    const body = content.split("\n").slice(1).filter((l) => l.trim() && !l.trim().startsWith("Reference:")).join("\n").trim();
    return { kind: "verify", lines: { Note: body, ...(content.startsWith("Booking Approved") ? { Approved: "yes" } : {}) } };
  }
  if (content.startsWith("Guest Verified")) {
    const body = content.split("\n").slice(1).filter((l) => l.trim() && !l.trim().startsWith("Reference:")).join("\n").trim();
    return { kind: "guestVerified", lines: { Note: body } };
  }
  if (content.includes("Booking Request")) kind = "request";
  else if (content.includes("Booking Confirmed")) kind = "confirmed";
  else if (content.includes("Booking Declined")) kind = "declined";
  else if (content.includes("Booking Cancelled")) kind = "other";
  else return { kind: "other", lines: {} };

  const lines: Record<string, string> = {};
  for (const raw of content.split("\n")) {
    const line = raw.trim();
    const [key, ...rest] = line.split(":");
    if (rest.length > 0 && ["Property", "Guest", "Dates", "Guests", "Total Payout", "Total Price", "Guest Verification", "Reference"].includes(key)) {
      lines[key] = rest.join(":").trim();
    }
  }
  return { kind, lines };
};

const SYSTEM_LABEL: Record<SystemKind, string> = {
  request: "Booking Request",
  confirmed: "Booking Confirmed",
  declined: "Booking Declined",
  verify: "Verification Needed",
  guestVerified: "Guest Verified",
  other: "Update",
};

function SystemMessageCard({ content, isHost }: { content: string; isHost: boolean }) {
  const { kind, lines } = parseSystemMessage(content);
  if (kind === "other" && Object.keys(lines).length === 0) {
    return (
      <div className="mx-auto max-w-sm rounded-xl bg-muted/60 px-4 py-3 text-center text-xs text-muted-foreground whitespace-pre-line">
        {content}
      </div>
    );
  }
  if (kind === "verify" || kind === "guestVerified") {
    return (
      <div className="mx-auto max-w-sm rounded-2xl border border-border bg-card p-4">
        <p className="text-[11px] font-bold uppercase tracking-wide text-[#FF6B00]">
          {kind === "verify" ? (lines.Approved ? "Booking Approved" : "Verification Needed") : "Guest Verified"}
        </p>
        <p className="mt-2 whitespace-pre-line text-sm text-foreground">{lines.Note}</p>
        {kind === "verify" && !isHost && (
          <Link
            to="/verify-identity?returnTo=/trips"
            className="mt-3 inline-flex rounded-full bg-[#FF6B00] px-4 py-2 text-xs font-bold text-white"
          >
            Verify now
          </Link>
        )}
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
      {kind === "request" && isHost && lines["Guest Verification"] && lines["Guest Verification"] !== "Verified" && (
        <p className="mt-3 text-xs text-muted-foreground">
          This guest isn&apos;t verified yet. Once you accept, they&apos;ll be asked to verify before their confirmation is sent, so you don&apos;t need to chase them.
        </p>
      )}
    </div>
  );
}

// Same role filtering as the app: guest-only and host-only system messages
// are not shown to the other side.
const isVisibleSystemMessage = (content: string, isHost: boolean): boolean => {
  if (content.includes("confirmed by the host") || content.includes("declined by the host")) return !isHost;
  if (content.startsWith("Verification Needed") || content.startsWith("Booking Approved")) return !isHost;
  if (content.startsWith("Guest Verified")) return isHost;
  if (content.includes("Please confirm or decline")) return isHost;
  return true;
};

const dayLabel = (iso: string) => {
  const d = new Date(iso);
  const today = new Date();
  const y = new Date(); y.setDate(today.getDate() - 1);
  if (d.toDateString() === today.toDateString()) return "Today";
  if (d.toDateString() === y.toDateString()) return "Yesterday";
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", ...(d.getFullYear() !== today.getFullYear() ? { year: "numeric" } : {}) });
};

const Avatar = ({ name, url, size = 36 }: { name: string; url?: string | null; size?: number }) => (
  <span className="flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-muted text-xs font-bold text-muted-foreground" style={{ width: size, height: size }}>
    {url ? <img src={url} alt="" className="h-full w-full object-cover" /> : (name?.charAt(0).toUpperCase() || "?")}
  </span>
);

/**
 * The conversation itself: header, messages, composer. Rendered as the middle
 * column of the inbox on desktop and full screen on phones.
 */
export function ThreadPane({
  threadId,
  onBack,
  detailsOpen,
  onToggleDetails,
}: {
  threadId: string;
  onBack?: () => void;
  detailsOpen?: boolean;
  onToggleDetails?: () => void;
}) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [thread, setThread] = useState<Thread | null>(null);
  const [otherAvatar, setOtherAvatar] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const [blocked, setBlocked] = useState(false);
  const [blockBusy, setBlockBusy] = useState(false);

  useEffect(() => {
    if (!threadId || !user) return;
    let cancelled = false;
    setLoading(true);
    setMessages([]);

    (async () => {
      const { data } = await supabase.from("threads").select("*").eq("id", threadId).maybeSingle();
      if (cancelled) return;
      if (!data || (data.guest_id !== user.id && data.host_id !== user.id)) {
        navigate("/inbox", { replace: true });
        return;
      }
      setThread(data as Thread);
      const otherId = data.host_id === user.id ? data.guest_id : data.host_id;
      supabase.from("profiles").select("avatar_url").eq("id", otherId).maybeSingle().then(({ data: p }) => !cancelled && setOtherAvatar(p?.avatar_url ?? null));
      if (otherId !== user.id) isBlocked(user.id, otherId).then((b) => !cancelled && setBlocked(b));
      const msgs = await fetchMessages(threadId);
      if (!cancelled) { setMessages(msgs); setLoading(false); }
      markThreadRead(threadId, data.host_id === user.id);
    })();

    const channel = subscribeToMessages(threadId, (msg) => {
      setMessages((prev) => (prev.some((m) => m.id === msg.id) ? prev : [...prev, msg]));
    });
    return () => { cancelled = true; channel.unsubscribe(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [threadId, user]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: "end" });
  }, [messages.length, loading]);

  if (!user) return null;
  if (loading || !thread) {
    return <div className="flex h-full items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>;
  }

  const isHostSide = thread.host_id === user.id;
  const otherName = (isHostSide ? thread.guest_name : thread.host_name) || "Wayzyy user";
  const otherId = isHostSide ? thread.guest_id : thread.host_id;
  const canBlock = otherId !== user.id && otherId !== WAYZYY_SYSTEM_ACCOUNT_ID;

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || sending) return;
    setSending(true);
    const content = input.trim();
    setInput("");
    const sent = await sendMessage(thread.id, user.id, isHostSide ? thread.host_name : thread.guest_name, content);
    if (sent) setMessages((prev) => (prev.some((m) => m.id === sent.id) ? prev : [...prev, sent]));
    else { setInput(content); toast({ title: "Message not sent", description: "Check your connection and try again.", variant: "destructive" }); }
    setSending(false);
  };

  const toggleBlock = async () => {
    if (!blocked && !window.confirm(`Block ${otherName}? You won't be able to message each other.`)) return;
    setBlockBusy(true);
    const res = blocked ? await unblockUser(otherId) : await blockUser(user.id, otherId);
    setBlockBusy(false);
    if (!res.ok) { toast({ title: blocked ? "Couldn't unblock" : "Couldn't block", description: res.reason, variant: "destructive" }); return; }
    setBlocked(!blocked);
    toast({ title: blocked ? `${otherName} unblocked` : `${otherName} blocked` });
  };

  const visible = messages.filter((m) => m.sender_id !== WAYZYY_SYSTEM_ACCOUNT_ID || isVisibleSystemMessage(m.content, isHostSide));

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex h-16 shrink-0 items-center gap-3 border-b border-border px-4 sm:px-5">
        {onBack && (
          <button onClick={onBack} aria-label="Back to conversations" className="rounded-full p-2 hover:bg-muted md:hidden">
            <ArrowLeft className="h-5 w-5" />
          </button>
        )}
        <Avatar name={otherName} url={otherAvatar} size={40} />
        <div className="min-w-0 flex-1">
          <p className="truncate text-base font-bold text-foreground">{thread.property_title || otherName}</p>
          <p className="truncate text-xs text-muted-foreground">{otherName}{isHostSide ? " · Guest" : " · Host"}</p>
        </div>
        {canBlock && (
          <button type="button" onClick={toggleBlock} disabled={blockBusy} className="hidden sm:block shrink-0 text-xs text-muted-foreground underline hover:text-foreground disabled:opacity-50">
            {blocked ? "Unblock" : "Block"}
          </button>
        )}
        {onToggleDetails && (
          <button onClick={onToggleDetails} aria-pressed={detailsOpen} aria-label="Reservation details" className={`rounded-full border px-3 py-2 text-xs font-semibold transition-colors ${detailsOpen ? "border-foreground" : "border-border hover:border-foreground/40"}`}>
            <PanelRight className="inline h-4 w-4 sm:mr-1.5" /><span className="hidden sm:inline">{detailsOpen ? "Hide reservation" : "Show reservation"}</span>
          </button>
        )}
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-4 sm:px-6 py-4">
        <div className="mx-auto max-w-3xl space-y-1">
          {visible.length === 0 && <p className="py-16 text-center text-sm text-muted-foreground">Say hello to start the conversation.</p>}
          {visible.map((m, i) => {
            const prev = visible[i - 1];
            const newDay = !prev || new Date(prev.created_at).toDateString() !== new Date(m.created_at).toDateString();
            const isSystem = m.sender_id === WAYZYY_SYSTEM_ACCOUNT_ID;
            const isOwn = m.sender_id === user.id;
            const firstOfRun = newDay || !prev || prev.sender_id !== m.sender_id;
            return (
              <div key={m.id}>
                {newDay && <p className="py-4 text-center text-xs font-semibold text-muted-foreground">{dayLabel(m.created_at)}</p>}
                {isSystem ? (
                  <div className="py-2"><SystemMessageCard content={m.content} isHost={isHostSide} /></div>
                ) : isOwn ? (
                  <div className={`flex flex-col items-end ${firstOfRun ? "pt-3" : "pt-0.5"}`}>
                    {firstOfRun && <span className="mb-1 text-xs text-muted-foreground">{formatTime(m.created_at)}</span>}
                    <div className="max-w-[78%] rounded-2xl rounded-br-md bg-foreground px-4 py-2.5 text-sm leading-relaxed text-background whitespace-pre-wrap break-words">{m.content}</div>
                  </div>
                ) : (
                  <div className={`flex gap-3 ${firstOfRun ? "pt-3" : "pt-0.5"}`}>
                    <div className="w-9 shrink-0 self-end">{(!visible[i + 1] || visible[i + 1].sender_id !== m.sender_id) && <Avatar name={otherName} url={otherAvatar} />}</div>
                    <div className="min-w-0 max-w-[78%]">
                      {firstOfRun && <p className="mb-1 text-xs text-muted-foreground"><span className="font-semibold text-foreground">{otherName}</span>{isHostSide ? "" : " · Host"} <span>{formatTime(m.created_at)}</span></p>}
                      <div className="rounded-2xl rounded-bl-md bg-muted px-4 py-2.5 text-sm leading-relaxed text-foreground whitespace-pre-wrap break-words">{m.content}</div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
          <div ref={bottomRef} />
        </div>
      </div>

      {blocked ? (
        <p className="shrink-0 border-t border-border p-4 text-center text-xs text-muted-foreground">You blocked {otherName}. Unblock to send messages.</p>
      ) : (
        <form onSubmit={handleSend} className="shrink-0 px-4 sm:px-6 pb-4 pt-2">
          <div className="mx-auto flex max-w-3xl items-end gap-2 rounded-2xl border border-border bg-background p-2 focus-within:border-foreground/50">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(e as unknown as React.FormEvent); } }}
              rows={1}
              placeholder="Write a message…"
              className="max-h-40 min-h-[40px] flex-1 resize-none bg-transparent px-3 py-2 text-[15px] outline-none"
            />
            <button type="submit" disabled={!input.trim() || sending} aria-label="Send" className="mb-1 mr-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#FF6B00] text-white disabled:opacity-30">
              {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

// /inbox/:threadId uses the inbox page itself (three columns on desktop).
export default function MessageThread() {
  const { threadId } = useParams<{ threadId: string }>();
  return <ThreadPane threadId={threadId ?? ""} />;
}
