import { useState, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { mp } from "@/lib/mixpanel";

export function WayzyyLocationPromo() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      toast.error("That doesn't look like a real email.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, audience: "traveler" }),
      });
      if (!res.ok) throw new Error("Failed");
      mp.waitlistSignup("traveler", email);
      setSent(true);
      toast.success("You're in. We'll let you know the moment stays go live!");
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="my-10 bg-card/60 border border-border/80 rounded-2xl p-6 sm:p-8 relative overflow-hidden shadow-xl shadow-ember/5">
      {/* Glow effect */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-ember/10 rounded-full blur-3xl pointer-events-none" />
      
      <div className="relative z-10 space-y-4">
        <span className="inline-flex items-center rounded-full bg-ember/10 px-3 py-1 text-xs font-semibold text-ember">
          Direct Bookings, Zero Markups
        </span>
        <h3 className="font-display text-2xl text-foreground">
          Planning your stay nearby? Get it up to 20% cheaper on Wayzyy
        </h3>
        <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
          Statistically speaking, global booking platforms mark up rates by up to 20% to cover commissions and service fees. Because <strong>Wayzyy doesn't add any markup from our end</strong>, you get direct direct-from-host pricing for the same property. 
        </p>
        <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
          Our team is working hard to get in front of your eyes. With over <strong>500 properties</strong> and <strong>50 hosts</strong> already onboarding, we are increasing the options before our launch so that we have choices for all your travel needs.
        </p>

        <div className="pt-2">
          {!sent ? (
            <form onSubmit={onSubmit} className="flex flex-col sm:flex-row gap-2 max-w-md">
              <Input
                type="email"
                required
                placeholder="Enter your email to get early access"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-11 border-border bg-background text-sm"
              />
              <Button
                type="submit"
                disabled={loading}
                className="group h-11 gap-1.5 bg-foreground text-background hover:bg-foreground/90 disabled:opacity-60 font-semibold"
              >
                Join Waitlist
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Button>
            </form>
          ) : (
            <div className="flex items-center gap-2 text-ember font-medium">
              <CheckCircle2 className="h-5 h-5" />
              <span>You're on the list! We'll notify you when stays go live.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
