import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { MessageCircle, RotateCcw, Sparkles, X } from "lucide-react";
import { ChatPanel } from "@/components/assistant/ChatPanel";
import { useAssistantChat } from "@/hooks/useAssistantChat";
import { OPEN_ASSISTANT_EVENT } from "@/lib/assistant";

// Pages where a guest-facing chat would just get in the way (the full /chat page has its own).
const HIDDEN_PREFIXES = ["/chat", "/adminn", "/inbox", "/experience", "/host"];
const NUDGE_KEY = "wayzyy_assistant_nudge_seen";

function BubbleInner({ onProperty }: { onProperty: boolean }) {
  const chat = useAssistantChat();
  const [open, setOpen] = useState(false);
  const [nudge, setNudge] = useState(false);

  // "Chat instead" buttons elsewhere on the site open the panel through this event.
  useEffect(() => {
    const openIt = () => { setOpen(true); setNudge(false); };
    window.addEventListener(OPEN_ASSISTANT_EVENT, openIt);
    return () => window.removeEventListener(OPEN_ASSISTANT_EVENT, openIt);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  // A single, gentle hello once per visit - never again after it is dismissed or the chat is opened.
  useEffect(() => {
    let seen = false;
    try { seen = sessionStorage.getItem(NUDGE_KEY) === "1"; } catch { /* ignore */ }
    if (seen || onProperty) return;
    const t = setTimeout(() => setNudge(true), 8000);
    return () => clearTimeout(t);
  }, [onProperty]);

  const dismissNudge = () => {
    setNudge(false);
    try { sessionStorage.setItem(NUDGE_KEY, "1"); } catch { /* ignore */ }
  };

  // On a stay's page a phone already has a sticky price bar at the bottom; the bubble would pile on top of it.
  const bubbleVisibility = onProperty ? "max-lg:hidden" : "";

  return (
    <>
      {!open && (
        <div className={`fixed right-4 bottom-[calc(4.75rem+env(safe-area-inset-bottom))] z-40 flex flex-col items-end gap-2 sm:right-6 sm:bottom-6 ${bubbleVisibility}`}>
          {nudge && (
            <div className="relative max-w-[240px] rounded-2xl rounded-br-md border border-border bg-background p-3.5 pr-8 shadow-xl animate-in fade-in slide-in-from-bottom-2">
              <p className="text-sm font-semibold text-foreground">Need help finding a stay?</p>
              <p className="mt-0.5 text-xs text-muted-foreground">Tell me your dates and group, I'll check what's free.</p>
              <button
                type="button"
                onClick={dismissNudge}
                aria-label="Dismiss"
                className="absolute right-2 top-2 rounded-full p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          )}
          <button
            type="button"
            onClick={() => { setOpen(true); dismissNudge(); }}
            aria-label="Open the Wayzyy assistant"
            className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#FF6B00] to-[#E05300] px-4 py-3.5 text-sm font-bold text-white shadow-xl shadow-[#FF6B00]/30 transition-transform hover:scale-105 active:scale-95 sm:px-5"
          >
            <MessageCircle className="h-5 w-5" />
            <span className="hidden sm:inline">Plan my stay</span>
          </button>
        </div>
      )}

      {open && (
        <>
          <div className="fixed inset-0 z-[59] bg-black/30 sm:hidden" onClick={() => setOpen(false)} aria-hidden />
          <section
            role="dialog"
            aria-label="Wayzyy assistant"
            className="fixed inset-x-0 bottom-0 z-[60] flex h-[85dvh] flex-col overflow-hidden rounded-t-3xl border border-border bg-background shadow-2xl animate-in fade-in slide-in-from-bottom-4 sm:inset-x-auto sm:bottom-6 sm:right-6 sm:h-[620px] sm:max-h-[calc(100dvh-3rem)] sm:w-[390px] sm:rounded-3xl"
          >
            <header className="flex items-center gap-3 border-b border-border bg-gradient-to-r from-[#FF6B00] to-[#E05300] px-4 py-3.5 text-white">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20">
                <Sparkles className="h-4.5 w-4.5" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold leading-tight">Wayzyy assistant</p>
                <p className="text-[11px] leading-tight text-white/85">Real availability and the full price</p>
              </div>
              <button type="button" onClick={chat.reset} aria-label="Start over" className="rounded-full p-2 text-white/90 transition-colors hover:bg-white/15">
                <RotateCcw className="h-4 w-4" />
              </button>
              <button type="button" onClick={() => setOpen(false)} aria-label="Close" className="rounded-full p-2 text-white/90 transition-colors hover:bg-white/15">
                <X className="h-5 w-5" />
              </button>
            </header>
            <div className="min-h-0 flex-1">
              <ChatPanel chat={chat} autoFocus />
            </div>
          </section>
        </>
      )}
    </>
  );
}

export function AssistantBubble() {
  const { pathname } = useLocation();
  if (HIDDEN_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`))) return null;
  return <BubbleInner onProperty={pathname.startsWith("/property/")} />;
}
