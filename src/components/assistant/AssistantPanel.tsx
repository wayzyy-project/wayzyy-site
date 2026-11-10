import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { BatteryFull, ChevronLeft, RotateCcw, Signal, Wifi, X } from "lucide-react";
import { ChatPanel } from "@/components/assistant/ChatPanel";
import { useAssistantChat } from "@/hooks/useAssistantChat";
import { OPEN_ASSISTANT_EVENT } from "@/lib/assistant";

// Pages where a guest-facing chat would just get in the way (the full /chat page has its own).
const HIDDEN_PREFIXES = ["/chat", "/adminn", "/inbox", "/experience", "/host"];

const clock = () => new Date().toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit", hour12: false });

// The status bar of the phone frame. Desktop only: on a real phone the chat opens as a sheet instead.
function StatusBar() {
  const [time, setTime] = useState(clock);
  useEffect(() => {
    const id = window.setInterval(() => setTime(clock()), 20_000);
    return () => window.clearInterval(id);
  }, []);
  return (
    <div className="relative hidden h-11 shrink-0 items-center justify-between px-7 pt-1 text-[13px] font-semibold text-foreground sm:flex">
      <span className="tabular-nums">{time}</span>
      <span className="absolute left-1/2 top-2.5 h-[30px] w-[108px] -translate-x-1/2 rounded-full bg-black" aria-hidden />
      <span className="flex items-center gap-1.5">
        <Signal className="h-3.5 w-3.5" />
        <Wifi className="h-3.5 w-3.5" />
        <BatteryFull className="h-4 w-4" />
      </span>
    </div>
  );
}

// The chat panel itself. It has no button of its own: the "Plan my stay" button in the header
// and the "describe your trip" line under the search bar open it through an event.
// On desktop it opens as a phone in the middle of a blurred page; on mobile, as a full-height sheet.
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
    // The page behind stays put while the phone is open.
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center sm:items-center" data-lenis-prevent>
      <div
        className="absolute inset-0 bg-black/45 backdrop-blur-md animate-in fade-in duration-300"
        onClick={() => setOpen(false)}
        aria-hidden
      />

      <button
        type="button"
        onClick={() => setOpen(false)}
        aria-label="Close"
        className="absolute right-6 top-6 hidden h-11 w-11 items-center justify-center rounded-full bg-white/90 text-foreground shadow-lg transition-transform hover:scale-105 sm:flex"
      >
        <X className="h-5 w-5" />
      </button>

      {/* Phone body: a dark bezel around the screen on desktop, nothing on mobile. */}
      <section
        role="dialog"
        aria-label="Plan my stay with Wayzyy"
        className="relative h-[92dvh] w-full rounded-t-[28px] bg-background shadow-2xl animate-in fade-in slide-in-from-bottom-10 duration-300 sm:h-[min(800px,calc(100dvh-48px))] sm:w-[390px] sm:rounded-[56px] sm:bg-[#0d0d0d] sm:p-[11px] sm:ring-1 sm:ring-white/15 sm:zoom-in-95"
      >
        {/* side buttons, for the look of a phone */}
        <span className="absolute -left-[3px] top-[120px] hidden h-12 w-[3px] rounded-l bg-[#0d0d0d] sm:block" aria-hidden />
        <span className="absolute -left-[3px] top-[180px] hidden h-12 w-[3px] rounded-l bg-[#0d0d0d] sm:block" aria-hidden />
        <span className="absolute -right-[3px] top-[160px] hidden h-20 w-[3px] rounded-r bg-[#0d0d0d] sm:block" aria-hidden />

        <div className="flex h-full flex-col overflow-hidden rounded-t-[28px] bg-background sm:rounded-[46px]">
          <StatusBar />

          {/* Messaging-app header: Wayzyy is the contact you are chatting with. */}
          <header className="flex shrink-0 items-center gap-3 border-b border-border px-3 py-2.5">
            <button type="button" onClick={() => setOpen(false)} aria-label="Close" className="rounded-full p-1.5 text-[#FF6B00] transition-colors hover:bg-[#FF6B00]/10">
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
          </header>

          <div className="min-h-0 flex-1 bg-[#FFF8F3] dark:bg-background">
            <ChatPanel chat={chat} autoFocus />
          </div>

          {/* home indicator */}
          <div className="hidden shrink-0 justify-center bg-background pb-2 pt-1 sm:flex" aria-hidden>
            <span className="h-[5px] w-32 rounded-full bg-foreground/80" />
          </div>
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
