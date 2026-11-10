import { useEffect, useRef, useState } from "react";
import { Loader2, Send } from "lucide-react";
import { Msg, SUGGESTIONS, localHref } from "@/lib/assistant";

const inr = (n: number) => `₹${Math.round(n).toLocaleString("en-IN")}`;

interface Chat {
  messages: Msg[];
  sending: boolean;
  error: string | null;
  send: (text: string) => Promise<void>;
}

/**
 * The assistant's conversation and message box. It fills whatever box it is placed in, so the
 * same component serves the floating panel and the full /chat page.
 */
export function ChatPanel({ chat, autoFocus = false }: { chat: Chat; autoFocus?: boolean }) {
  const { messages, sending, error, send } = chat;
  const [input, setInput] = useState("");
  const scroller = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const el = scroller.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [messages, sending]);

  useEffect(() => {
    if (autoFocus) inputRef.current?.focus();
  }, [autoFocus]);

  const submit = (text: string) => {
    if (!text.trim() || sending) return;
    setInput("");
    void send(text);
  };

  const onlyGreeting = messages.length === 1;

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div ref={scroller} className="min-h-0 flex-1 space-y-4 overflow-y-auto px-4 py-4" aria-live="polite">
        {messages.map((m, i) => (
          <div key={i} className={m.role === "user" ? "flex justify-end" : "flex justify-start"}>
            <div className={m.role === "user" ? "max-w-[85%]" : "w-full max-w-[95%]"}>
              <div
                className={
                  m.role === "user"
                    ? "rounded-2xl rounded-br-md bg-gradient-to-r from-[#FF6B00] to-[#E05300] px-4 py-2.5 text-sm text-white shadow-sm"
                    : "rounded-2xl rounded-bl-md border border-border bg-muted/50 px-4 py-2.5 text-sm text-foreground"
                }
              >
                <p className="whitespace-pre-wrap">{m.content}</p>
              </div>
              {m.stays && m.stays.length > 0 && (
                <div className="mt-3 space-y-2.5">
                  {m.stays.map((s) => (
                    <a
                      key={s.id}
                      href={localHref(s.url)}
                      className="block rounded-2xl border border-border bg-background p-3.5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
                    >
                      <p className="text-sm font-bold leading-snug text-foreground">{s.title}</p>
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
                        <span className="shrink-0 whitespace-nowrap rounded-full bg-[#FF6B00]/10 px-3 py-1.5 text-xs font-bold text-[#FF6B00]">
                          View &amp; book →
                        </span>
                      </div>
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {onlyGreeting && !sending && (
          <div className="flex flex-wrap gap-2 pt-1">
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => submit(s)}
                className="rounded-full border border-[#FF6B00]/40 bg-background px-3.5 py-2 text-xs font-semibold text-[#FF6B00] transition-colors hover:bg-[#FF6B00]/10"
              >
                {s}
              </button>
            ))}
          </div>
        )}

        {sending && (
          <div className="flex justify-start">
            <div className="inline-flex items-center gap-2 rounded-2xl rounded-bl-md border border-border bg-muted/50 px-4 py-2.5 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" /> Checking what's free...
            </div>
          </div>
        )}
        {error && <p className="text-center text-xs font-semibold text-destructive">{error}</p>}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          submit(input);
        }}
        className="flex items-center gap-2 border-t border-border bg-background p-3"
      >
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          maxLength={1500}
          placeholder="Dates, guests, area, budget..."
          aria-label="Your message"
          className="min-w-0 flex-1 rounded-full border border-border bg-background px-4 py-3 text-sm outline-none transition-colors focus:border-[#FF6B00]"
        />
        <button
          type="submit"
          disabled={sending || !input.trim()}
          aria-label="Send"
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-[#FF6B00] to-[#E05300] text-white shadow-md shadow-[#FF6B00]/25 transition-opacity disabled:opacity-40"
        >
          <Send className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
}
