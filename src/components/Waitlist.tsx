import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";

type Audience = "traveler" | "host";

export function Waitlist({ defaultAudience = "host" as Audience }) {
  const [audience, setAudience] = useState<Audience>(defaultAudience);
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      toast.error("That doesn't look like a real email.");
      return;
    }
    // placeholder — wire to your backend / Resend / Loops later
    setSent(true);
    toast.success(
      audience === "host"
        ? "You're on the host list. We'll be in touch before the doors open."
        : "You're in. We'll send a postcard when stays go live."
    );
  }

  return (
    <div className="w-full max-w-xl">
      <div className="mb-3 flex gap-1 rounded-full border border-border bg-card p-1 text-sm">
        {(["traveler", "host"] as const).map((a) => (
          <button
            key={a}
            type="button"
            onClick={() => setAudience(a)}
            className={
              "relative flex-1 rounded-full px-4 py-1.5 transition-colors " +
              (audience === a
                ? "text-background"
                : "text-muted-foreground hover:text-foreground")
            }
          >
            {audience === a && (
              <motion.span
                layoutId="waitlist-pill"
                className="absolute inset-0 rounded-full bg-foreground"
                transition={{ type: "spring", stiffness: 380, damping: 32 }}
              />
            )}
            <span className="relative">
              {a === "host" ? "I'm Hosting" : "I'm Travelling"}
            </span>
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {!sent ? (
          <motion.form
            key="form"
            onSubmit={onSubmit}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col gap-2 sm:flex-row"
          >
            <Input
              type="email"
              required
              placeholder={
                audience === "host"
                  ? "you@yourplace.com"
                  : "you@gowhereverwhen.com"
              }
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-12 flex-1 border-border bg-card text-base"
            />
            <Button
              type="submit"
              className="group h-12 gap-2 bg-foreground px-6 text-background hover:bg-foreground/90"
            >
              {audience === "host" ? "Join host list" : "Get early access"}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Button>
          </motion.form>
        ) : (
          <motion.div
            key="ok"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="flex h-12 items-center gap-3 rounded-md border border-ember/40 bg-ember/10 px-4 text-sm text-foreground"
          >
            <Check className="h-4 w-4 text-ember" />
            You're on the list. Watch for a note from us.
          </motion.div>
        )}
      </AnimatePresence>

      <p className="mt-3 text-xs text-muted-foreground">
        {audience === "host"
          ? "Choose your subscription tier at launch. No per-booking percentage — ever."
          : "No subscription required. Join early and unlock referral discounts for you and a friend."}
      </p>
    </div>
  );
}
