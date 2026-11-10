import { Link } from "react-router-dom";
import { ArrowLeft, RotateCcw } from "lucide-react";
import { SEO } from "@/components/SEO";
import { ChatPanel } from "@/components/assistant/ChatPanel";
import { useAssistantChat } from "@/hooks/useAssistantChat";

// The full-page version of the assistant (shareable link for agents). The floating panel
// on the rest of the site uses the same chat, so a visit carries over between them.
export default function StayAssistant() {
  const chat = useAssistantChat();

  return (
    <SEO
      title="Plan your Goa stay | Wayzyy"
      description="Tell us your dates, group size and budget, and get stays that are actually free, with the real price."
      path="/chat"
      noindex
    >
      <div className="mx-auto flex h-[100dvh] max-w-2xl flex-col px-2 pb-[calc(3.75rem+env(safe-area-inset-bottom))] pt-3 sm:pb-6">
        <header className="flex items-center justify-between px-3 pb-2">
          <Link to="/" className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" /> Wayzyy
          </Link>
          <button
            type="button"
            onClick={chat.reset}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground"
          >
            <RotateCcw className="h-3.5 w-3.5" /> Start over
          </button>
        </header>
        <div className="px-3">
          <h1 className="font-display text-2xl text-foreground">Plan your Goa stay</h1>
          <p className="mt-1 text-sm text-muted-foreground">Real availability and the full price, taxes included.</p>
        </div>
        <div className="mt-3 min-h-0 flex-1 overflow-hidden rounded-3xl border border-border bg-background shadow-sm">
          <ChatPanel chat={chat} />
        </div>
      </div>
    </SEO>
  );
}
