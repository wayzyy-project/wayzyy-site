import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Loader2, Send } from "lucide-react";
import { SEO } from "@/components/SEO";
import { supabase } from "@/lib/supabase";

interface StayCard {
  id: string;
  title: string;
  location: string;
  bedrooms: number | null;
  maxGuests: number | null;
  pool: "private" | "pool" | "none";
  jacuzzi: boolean;
  nights: number;
  total: number;
  perNight: number;
  url: string;
  calendarSynced: boolean;
  note?: string;
}

interface Msg {
  role: "user" | "assistant";
  content: string;
  stays?: StayCard[];
}

const STORAGE_KEY = "wayzyy_assistant_chat_v1";
const SESSION_KEY = "wayzyy_assistant_session_v1";

// One id per chat, so the team sees a conversation as one record rather than many messages.
function chatSessionId(fresh = false): string {
  try {
    const existing = sessionStorage.getItem(SESSION_KEY);
    if (existing && !fresh) return existing;
    const id = crypto.randomUUID();
    sessionStorage.setItem(SESSION_KEY, id);
    return id;
  } catch {
    return crypto.randomUUID();
  }
}
const GREETING: Msg = {
  role: "assistant",
  content:
    "Hi! I can help you find a stay in Goa. Tell me your dates, how many of you are travelling, and roughly what you're looking for (area, pool, budget), and I'll check what's actually free.",
};

const inr = (n: number) => `₹${Math.round(n).toLocaleString("en-IN")}`;
// The server gives absolute links; keep navigation inside the app.
const localHref = (url: string) => {
  try {
    const u = new URL(url);
    return `${u.pathname}${u.search}`;
  } catch {
    return url;
  }
};

function loadChat(): Msg[] {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    const parsed = raw ? (JSON.parse(raw) as Msg[]) : null;
    if (Array.isArray(parsed) && parsed.length > 0) return parsed;
  } catch {
    // Storage can be blocked (private windows) - start fresh.
  }
  return [GREETING];
}

export default function StayAssistant() {
  const [messages, setMessages] = useState<Msg[]>(loadChat);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(messages.slice(-40)));
    } catch {
      // Nothing to do - the chat just won't survive a refresh.
    }
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, sending]);

  const send = async (text: string) => {
    const content = text.trim();
    if (!content || sending) return;
    const next: Msg[] = [...messages, { role: "user", content }];
    setMessages(next);
    setInput("");
    setError(null);
    setSending(true);
    try {
      // Only the words go to the server; cards are rebuilt from fresh searches there.
      const { data, error: fnError } = await supabase.functions.invoke("trip-assistant", {
        body: { sessionId: chatSessionId(), messages: next.map(({ role, content: c }) => ({ role, content: c })) },
      });
      if (fnError || !data?.reply) throw new Error(fnError?.message || data?.error || "No reply");
      setMessages([...next, { role: "assistant", content: String(data.reply), stays: Array.isArray(data.stays) ? data.stays : [] }]);
    } catch {
      setError("Sorry, I couldn't reach the assistant. Please try again, or message the Wayzyy team.");
    } finally {
      setSending(false);
    }
  };

  const reset = () => {
    chatSessionId(true);
    setMessages([GREETING]);
    setError(null);
  };

  return (
    <SEO
      title="Plan your Goa stay | Wayzyy"
      description="Tell us your dates, group size and budget, and get stays that are actually free, with the real price."
      path="/chat"
      noindex
    >
      <div className="mx-auto flex min-h-[100dvh] max-w-2xl flex-col px-4 pb-28 pt-4 sm:pb-6">
        <header className="flex items-center justify-between py-2">
          <Link to="/" className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" /> Wayzyy
          </Link>
          <button type="button" onClick={reset} className="text-xs font-semibold text-muted-foreground underline underline-offset-2 hover:text-foreground">
            Start over
          </button>
        </header>

        <h1 className="mt-2 font-display text-2xl text-foreground">Plan your Goa stay</h1>
        <p className="mt-1 text-sm text-muted-foreground">Real availability and the full price, taxes included.</p>

        <div className="mt-5 flex-1 space-y-4" aria-live="polite">
          {messages.map((m, i) => (
            <div key={i} className={m.role === "user" ? "flex justify-end" : "flex justify-start"}>
              <div className={m.role === "user" ? "max-w-[85%]" : "w-full max-w-[95%]"}>
                <div
                  className={
                    m.role === "user"
                      ? "rounded-2xl rounded-br-md bg-[#FF6B00] px-4 py-2.5 text-sm text-white"
                      : "rounded-2xl rounded-bl-md border border-border bg-muted/40 px-4 py-2.5 text-sm text-foreground"
                  }
                >
                  <p className="whitespace-pre-wrap">{m.content}</p>
                </div>
                {m.stays && m.stays.length > 0 && (
                  <div className="mt-3 space-y-3">
                    {m.stays.map((s) => (
                      <a
                        key={s.id}
                        href={localHref(s.url)}
                        className="block rounded-2xl border border-border bg-background p-4 transition-colors hover:bg-muted/40"
                      >
                        <p className="text-sm font-bold text-foreground">{s.title}</p>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          {s.location}
                          {s.bedrooms ? ` · ${s.bedrooms} bedrooms` : ""}
                          {s.maxGuests ? ` · up to ${s.maxGuests} guests` : ""}
                          {s.pool === "private" ? " · private pool" : s.pool === "pool" ? " · pool" : ""}
                          {s.jacuzzi ? " · jacuzzi" : ""}
                        </p>
                        <div className="mt-2 flex items-end justify-between gap-3">
                          <div>
                            <p className="font-price text-lg font-bold leading-tight text-foreground">{inr(s.total)}</p>
                            <p className="text-xs text-muted-foreground">
                              for {s.nights} {s.nights === 1 ? "night" : "nights"} · {inr(s.perNight)}/night
                            </p>
                          </div>
                          <span className="shrink-0 whitespace-nowrap text-xs font-bold text-[#FF6B00]">View &amp; book →</span>
                        </div>
                        {s.note && <p className="mt-1 text-[11px] font-semibold text-[#FF6B00]">{s.note}</p>}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
          {sending && (
            <div className="flex justify-start">
              <div className="inline-flex items-center gap-2 rounded-2xl rounded-bl-md border border-border bg-muted/40 px-4 py-2.5 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" /> Checking...
              </div>
            </div>
          )}
          {error && <p className="text-center text-xs font-semibold text-destructive">{error}</p>}
          <div ref={endRef} />
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            void send(input);
          }}
          className="fixed inset-x-0 bottom-[calc(3.75rem+env(safe-area-inset-bottom))] z-30 border-t border-border bg-background px-4 py-3 sm:static sm:mt-4 sm:border-0 sm:bg-transparent sm:px-0 sm:py-0"
        >
          <div className="mx-auto flex max-w-2xl items-center gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              maxLength={1500}
              placeholder="e.g. 3 BHK with pool, 26 Dec to 2 Jan, 6 guests"
              aria-label="Your message"
              className="min-w-0 flex-1 rounded-full border border-border bg-background px-4 py-3 text-sm outline-none focus:border-[#FF6B00]"
            />
            <button
              type="submit"
              disabled={sending || !input.trim()}
              aria-label="Send"
              className="btn-brand flex h-11 w-11 shrink-0 items-center justify-center rounded-full disabled:opacity-40"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </form>
      </div>
    </SEO>
  );
}
