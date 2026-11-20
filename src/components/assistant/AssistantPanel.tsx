import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { ChevronLeft, RotateCcw, X } from "lucide-react";
import { ChatPanel } from "@/components/assistant/ChatPanel";
import { useAssistantChat } from "@/hooks/useAssistantChat";
import { OPEN_ASSISTANT_EVENT } from "@/lib/assistant";

// Pages where a guest-facing chat would just get in the way (the full /chat page has its own).
const HIDDEN_PREFIXES = ["/chat", "/adminn", "/inbox", "/experience", "/host"];

// The chat panel itself. It has no button of its own: the "Plan my stay" button in the header
// and the "describe your trip" line under the search bar open it through an event.
// It behaves like a right-side companion drawer so the page remains visible and scrollable behind it.
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
    <div className="pointer-events-none fixed inset-0 z-[60]">
      <div
        className="pointer-events-none absolute inset-0 bg-black/10 animate-in fade-in duration-300"
        aria-hidden
      />

      {/* Right-side drawer. It is full-height so the conversation has room to breathe, while the
          pointer-transparent shell lets the page behind it continue to scroll. */}
      <section
        role="dialog"
        aria-label="Plan my stay with Wayzyy"
        className="pointer-events-auto absolute right-0 top-0 flex h-[100dvh] w-full max-w-[440px] flex-col overflow-hidden rounded-l-[28px] border-l border-border bg-background shadow-2xl animate-in fade-in slide-in-from-right-10 duration-300 sm:rounded-l-[32px]"
      >
        {/* Messaging-app header: Wayzyy is the contact you are chatting with. */}
        <header className="flex shrink-0 items-center gap-3 border-b border-border px-3 py-3">
          <button type="button" onClick={() => setOpen(false)} aria-label="Close assistant" className="rounded-full p-1.5 text-[#FF6B00] transition-colors hover:bg-[#FF6B00]/10">
            <ChevronLeft className="h-6 w-6" />
          </button>
          <span className="relative shrink-0">
            <img src="/logo.svg" alt="" className="h-10 w-10 rounded-full" />
            <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-background bg-emerald-500" aria-hidden />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-[15px] font-bold leading-tight text-foreground">Wayzyy</p>
            <p className="text-[11px] leading-tight text-emerald-600">online · real prices, live availability</p>
          </div>
          <button type="button" onClick={chat.reset} aria-label="Start over" className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
            <RotateCcw className="h-4 w-4" />
          </button>
          <button type="button" onClick={() => setOpen(false)} aria-label="Close" className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
            <X className="h-5 w-5" />
          </button>
        </header>

        <div className="min-h-0 flex-1 bg-[#FFF8F3] dark:bg-background">
          <ChatPanel chat={chat} autoFocus />
        </div>
      </section>
    </div>
  );
}

export function AssistantPanel() {
  const { pathname } = useLocation();
  if (HIDDEN_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`))) return null;
  return <PanelInner />;
}
