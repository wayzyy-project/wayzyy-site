import { ReactNode } from "react";

type Props = { items: ReactNode[]; className?: string };

export function Marquee({ items, className }: Props) {
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
    <div
      className={
        "relative w-full overflow-hidden border-y border-border/60 bg-background " +
        (className ?? "")
      }
    >
      <div className="flex w-max animate-marquee py-4 text-sm uppercase tracking-[0.25em] text-muted-foreground">
        {row}
        {row}
      </div>
    </div>
  );
}
