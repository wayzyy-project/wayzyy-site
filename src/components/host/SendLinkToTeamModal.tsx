import { useState } from "react";
import { Send, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

interface SendLinkToTeamModalProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * The alternative to self-serve "Import Listing": a host past their
 * self-serve cap (or who'd rather not deal with the import flow) can just
 * hand us the URL directly instead of messaging it over WhatsApp/email,
 * which is what everyone was doing before this existed.
 */
export function SendLinkToTeamModal({ isOpen, onClose }: SendLinkToTeamModalProps) {
  const { session } = useAuth();
  const { toast } = useToast();
  const [url, setUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.access_token) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/host-submit-link", {
        method: "POST",
        headers: { Authorization: `Bearer ${session.access_token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body?.error || "Failed to send link");
      toast({ title: "Link sent to our team", description: "We'll import it and follow up once it's ready for pricing." });
      setUrl("");
      onClose();
    } catch (err: any) {
      toast({ title: "Couldn't send link", description: err?.message, variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="liquid-glass w-full max-w-md rounded-3xl border border-white/15 bg-black/60 p-6">
        <div className="mb-4 flex items-start justify-between">
          <div>
            <h2 className="font-display text-lg font-bold text-white">Send a link to our team</h2>
            <p className="mt-1 text-xs text-white/60">
              We'll import this listing for you instead of you doing it yourself.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1.5 text-white/60 transition-colors hover:bg-white/10 hover:text-white"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="listing-url" className="text-xs text-white/70">
              Listing URL
            </Label>
            <Input
              id="listing-url"
              type="url"
              required
              autoFocus
              placeholder="https://www.airbnb.co.in/rooms/..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="mt-1.5 border-white/20 bg-white/5 text-white placeholder:text-white/30"
            />
          </div>

          <Button
            type="submit"
            disabled={submitting || !url.trim()}
            className="w-full gap-1.5 bg-ember text-white hover:bg-ember/90"
          >
            {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            Send to team
          </Button>
        </form>
      </div>
    </div>
  );
}
