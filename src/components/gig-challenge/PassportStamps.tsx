import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

export type StampDef = {
  id: string;
  label: string;
  icon: LucideIcon;
};

/**
 * A vertical passport-stamp tracker. Each entry lights up while its section
 * is in view and un-stamps once you scroll back past it - a live "you are
 * here" indicator, not a permanent collection. Desktop only; not worth the
 * real estate on mobile.
 */
export function PassportStamps({ stamps }: { stamps: StampDef[] }) {
  const [visited, setVisited] = useState<Set<string>>(new Set());

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    stamps.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            setVisited((prev) => {
              const alreadyIn = prev.has(id);
              if (entry.isIntersecting === alreadyIn) return prev;
              const next = new Set(prev);
              if (entry.isIntersecting) {
                next.add(id);
              } else {
                next.delete(id);
              }
              return next;
            });
          });
        },
        { threshold: 0.35 }
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, [stamps]);

  return (
    <div className="pointer-events-none fixed right-5 top-1/2 z-40 hidden -translate-y-1/2 flex-col gap-3 xl:flex">
      {stamps.map(({ id, label, icon: Icon }) => {
        const stamped = visited.has(id);
        return (
          <motion.div
            key={id}
            initial={false}
            animate={
              stamped
                ? { scale: [0.5, 1.15, 1], rotate: [-18, -8, -8], opacity: 1 }
                : { scale: 0.9, rotate: 0, opacity: 0.35 }
            }
            transition={{ duration: 0.45, ease: [0.34, 1.56, 0.64, 1] }}
            title={label}
            className={`flex h-9 w-9 items-center justify-center rounded-full border-2 text-[10px] font-bold uppercase ${
              stamped
                ? "border-[hsl(var(--ember))] text-[hsl(var(--ember))] bg-[hsl(var(--ember))]/10"
                : "border-border/60 text-muted-foreground/50 border-dashed"
            }`}
          >
            <Icon className="h-4 w-4" strokeWidth={stamped ? 2.5 : 1.75} />
          </motion.div>
        );
      })}
    </div>
  );
}
