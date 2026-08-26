import { motion, useTransform, type MotionValue } from "framer-motion";

/**
 * Duplicated from CinematicHero.tsx rather than imported, to avoid a
 * circular import between the two modules (CinematicHero renders
 * FanCardDeck, and FanCardDeck needs this same enter/exit-window helper).
 * Keep in sync with the copy there if the curve ever changes.
 */
function smoothstep(edge0: number, edge1: number, x: number) {
  if (edge0 === edge1) return x < edge0 ? 0 : 1;
  const t = Math.min(1, Math.max(0, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}
function segmentInOut(x: number, inStart: number, inEnd: number, outStart: number, outEnd: number) {
  const fadeIn = smoothstep(inStart, inEnd, x);
  const fadeOut = 1 - smoothstep(outStart, outEnd, x);
  return Math.min(fadeIn, fadeOut);
}

export interface FanCard {
  heading: string;
  body: string;
  /** Tailwind bg color/gradient class for the pastel-glass tint overlay. */
  tint: string;
}

interface FanCardDeckProps {
  cards: FanCard[];
  progress: MotionValue<number>;
  windowIn: [number, number];
  windowOut: [number, number];
  /**
   * Optional per-card [in, out] windows - when provided, each card fades
   * in/out on its own schedule instead of a uniform stagger inside
   * `windowIn`/`windowOut`. Use this when cards need to track specific
   * background images (e.g. card N should be visible exactly while image N
   * is on screen) rather than all bunching up near the start of a shared
   * window. Must be the same length as `cards`.
   */
  cardWindows?: { in: [number, number]; out: [number, number] }[];
}

// Subtle rotation and vertical stagger per card index for a refined fanned look
const ROTATIONS = [-3, -1, 1, 3];
const Y_OFFSETS = [8, -2, -2, 8];

/** One card of the fanned deck - its own entrance/exit window nested inside the deck's overall window, staggered slightly per index. */
function DeckCard({
  card,
  index,
  progress,
  windowIn,
  windowOut,
  ownWindow,
}: {
  card: FanCard;
  index: number;
  count: number;
  progress: MotionValue<number>;
  windowIn: [number, number];
  windowOut: [number, number];
  ownWindow?: { in: [number, number]; out: [number, number] };
}) {
  const [inStart, inEnd, outStart, outEnd] = ownWindow
    ? [ownWindow.in[0], ownWindow.in[1], ownWindow.out[0], ownWindow.out[1]]
    : (() => {
        const stagger = index * 0.025;
        return [windowIn[0] + stagger, Math.min(windowIn[1] + stagger, windowOut[0]), windowOut[0], windowOut[1]];
      })();

  const t = useTransform(progress, (p) => segmentInOut(p, inStart, inEnd, outStart, outEnd));

  const baseRotate = ROTATIONS[Math.min(index, ROTATIONS.length - 1)];
  const baseY = Y_OFFSETS[Math.min(index, Y_OFFSETS.length - 1)];

  const opacity = t;
  const scale = useTransform(t, [0, 1], [0.88, 1]);
  const rotate = useTransform(t, [0, 1], [baseRotate * 2, baseRotate]);
  const y = useTransform(t, [0, 1], [baseY + 30, baseY]);

  return (
    <motion.div
      style={{ opacity, scale, rotate, y }}
      className={
        "liquid-glass flex flex-col justify-between w-full rounded-2xl p-4 shadow-xl sm:p-5 md:p-6 lg:p-7 backdrop-blur-xl border border-white/20 " +
        card.tint
      }
    >
      <div>
        <h3 className="font-display text-sm font-bold leading-snug text-white sm:text-base md:text-lg lg:text-xl">
          {card.heading}
        </h3>
        <p className="mt-2 text-xs font-normal leading-relaxed text-white/80 sm:text-sm lg:text-base">
          {card.body}
        </p>
      </div>
    </motion.div>
  );
}

/** One card of the mobile 2x2 grid - clean liquid-glass styling. */
function MobileDeckCard({
  card,
  index,
}: {
  card: FanCard;
  index: number;
}) {
  return (
    <div
      className={
        "liquid-glass flex flex-col justify-between w-full rounded-2xl p-3 sm:p-4 shadow-xl backdrop-blur-xl border border-white/20 text-left bg-black/40 " +
        card.tint
      }
    >
      <div>
        <div className="flex items-center gap-1.5 mb-1 text-left">
          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-ember text-[10px] font-bold text-white shadow-xs">
            {index + 1}
          </span>
          <h3 className="font-display text-xs font-bold leading-snug text-white text-left line-clamp-2">{card.heading}</h3>
        </div>
        <p className="pl-6 text-[11px] font-normal leading-relaxed text-white/85 text-left line-clamp-3">{card.body}</p>
      </div>
    </div>
  );
}

/**
 * Side-by-side hand of cards deck of pastel-glass panels in the hero section.
 * Cards fan in staggered (scale+rotate+opacity) within `windowIn`, hold,
 * then fade/scale down together across `windowOut`.
 */
export function FanCardDeck({ cards, progress, windowIn, windowOut, cardWindows }: FanCardDeckProps) {
  // Synchronized enter/exit fade over windowIn / windowOut for the entire deck
  const t = useTransform(progress, (p) =>
    segmentInOut(p, windowIn[0], windowIn[1], windowOut[0], windowOut[1]),
  );
  const opacity = t;
  const y = useTransform(t, [0, 1], [30, 0]);
  const scale = useTransform(t, [0, 1], [0.94, 1]);

  return (
    <>
      {/* Desktop & Tablet: Side-by-side 4-column grid centered in viewport with zero clipping */}
      <div className="pointer-events-none absolute inset-x-0 bottom-[10%] hidden justify-center px-4 sm:px-6 md:px-8 sm:flex sm:items-center z-20">
        <div className="mx-auto grid w-full max-w-7xl grid-cols-4 gap-3 md:gap-4 lg:gap-6">
          {cards.map((card, i) => (
            <DeckCard
              key={card.heading}
              card={card}
              index={i}
              count={cards.length}
              progress={progress}
              windowIn={windowIn}
              windowOut={windowOut}
              ownWindow={cardWindows?.[i]}
            />
          ))}
        </div>
      </div>

      {/* Mobile: 2x2 grid centered on screen, displaying all 4 cards together as a clean unified set */}
      <motion.div
        style={{ opacity, y, scale }}
        className="pointer-events-none absolute inset-x-3 top-1/2 -translate-y-1/2 z-20 grid grid-cols-2 gap-2.5 max-w-md mx-auto sm:hidden"
      >
        {cards.map((card, i) => (
          <MobileDeckCard key={card.heading} card={card} index={i} />
        ))}
      </motion.div>
    </>
  );
}

export default FanCardDeck;
