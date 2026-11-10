import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { RotateCcw, Sparkles, X } from "lucide-react";
import { ChatPanel } from "@/components/assistant/ChatPanel";
import { useAssistantChat } from "@/hooks/useAssistantChat";
import { OPEN_ASSISTANT_EVENT } from "@/lib/assistant";

// Pages where a guest-facing chat would just get in the way (the full /chat page has its own).
const HIDDEN_PREFIXES = ["/chat", "/adminn", "/inbox", "/experience", "/host"];

// The chat panel itself. It has no button of its own: the "Plan my stay" button in the header
// and the "describe your trip" line under the search bar open it through an event.
function PanelInner() {
  const chat = useAssistantChat();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const openIt = () => setOpen(true);
    window.addEventListener(OPEN_ASSISTANT_EVENT, openIt);
    return () => window.removeEventListener(OPEN_ASSISTANT_EVENT, openIt);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 z-[59] bg-black/30 sm:bg-transparent" onClick={() => setOpen(false)} aria-hidden />
      <section
        role="dialog"
        aria-label="Wayzyy assistant"
        className="fixed inset-x-0 bottom-0 z-[60] flex h-[85dvh] flex-col overflow-hidden rounded-t-3xl border border-border bg-background shadow-2xl animate-in fade-in slide-in-from-bottom-4 sm:inset-x-auto sm:bottom-auto sm:right-6 sm:top-[84px] sm:h-[620px] sm:max-h-[calc(100dvh-6.5rem)] sm:w-[400px] sm:rounded-3xl sm:slide-in-from-top-2"
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
  );
}

export function AssistantPanel() {
  const { pathname } = useLocation();
  if (HIDDEN_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`))) return null;
  return <PanelInner />;
}
