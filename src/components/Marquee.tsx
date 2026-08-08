import { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";

type Props = { items: ReactNode[]; className?: string };

export function Marquee({ items, className }: Props) {
  const reduce = useReducedMotion();
  const row = (
    <div className="flex shrink-0 items-center gap-12 px-6">
      {items.map((it, i) => (
        <span key={i} className="flex items-center gap-12">
          <span>{it}</span>
          <span className="text-ember">✦</span>
        </span>
      ))}
    </div>
  );
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10% 0px -10% 0px" }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={
        "relative w-full overflow-hidden border-y border-border/60 bg-background " +
        (className ?? "")
      }
    >
      <div className="flex w-max animate-marquee py-4 text-sm uppercase tracking-[0.25em] text-muted-foreground">
        {row}
        {row}
      </div>
    </motion.div>
  );
}
