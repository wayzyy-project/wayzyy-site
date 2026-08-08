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
}

// Shallow fan geometry — rotation and vertical stagger per card index,
// centered so the deck reads symmetric regardless of card count.
const ROTATIONS = [-8, -3, 3, 8];
const Y_OFFSETS = [10, -4, -4, 10];
const X_OFFSETS = [-70, -24, 24, 70];

/** One card of the fanned deck — its own entrance/exit window nested inside the deck's overall window, staggered slightly per index. */
function DeckCard({
  card,
  index,
  count,
  progress,
  windowIn,
  windowOut,
}: {
  card: FanCard;
  index: number;
  count: number;
  progress: MotionValue<number>;
  windowIn: [number, number];
  windowOut: [number, number];
}) {
  // Stagger each card's entrance by a small fraction of the deck's own
  // in-window width so cards fan in one after another rather than all at
  // once; exits are kept in sync (no stagger) so the deck merges away as a
  // single unit rather than peeling apart.
  const stagger = index * 0.025;
  const inStart = windowIn[0] + stagger;
  const inEnd = Math.min(windowIn[1] + stagger, windowOut[0]);

  const t = useTransform(progress, (p) => segmentInOut(p, inStart, inEnd, windowOut[0], windowOut[1]));

  const mid = (count - 1) / 2;
  const slot = index - mid + (ROTATIONS.length - count) / 2;
  const baseRotate = ROTATIONS[Math.min(index, ROTATIONS.length - 1)] * (count <= 2 ? 0.6 : 1);
  const baseY = Y_OFFSETS[Math.min(index, Y_OFFSETS.length - 1)];
  const baseX = slot * (count <= 2 ? 210 : 190);

  const opacity = t;
  const scale = useTransform(t, [0, 1], [0.85, 1]);
  const rotate = useTransform(t, [0, 1], [baseRotate * 2.2, baseRotate]);
  const y = useTransform(t, [0, 1], [baseY + 40, baseY]);

  return (
    <motion.div
      style={{ opacity, scale, rotate, y, x: baseX }}
      className={
        "liquid-glass absolute hidden w-80 rounded-2xl p-7 shadow-xl sm:flex sm:w-96 sm:p-9 sm:flex-col " + card.tint
      }
    >
      <h3 className="font-display text-2xl leading-tight text-white sm:text-3xl">{card.heading}</h3>
      <p className="mt-3 text-base leading-snug text-white/80 sm:text-lg">{card.body}</p>
    </motion.div>
  );
}

/**
 * Mobile equivalent — the absolute-positioned rotated fan doesn't fit small
 * viewports (fixed widths + rotation caused cards to overflow both the
 * screen width and the deck's height, per user report). Below `sm` we swap
 * to a static 2x2 grid instead: all 4 cards visible at once, no
 * rotate/offset/scroll, just a per-card fade-in.
 */
function MobileDeckCard({
  card,
  index,
  progress,
  windowIn,
  windowOut,
}: {
  card: FanCard;
  index: number;
  progress: MotionValue<number>;
  windowIn: [number, number];
  windowOut: [number, number];
}) {
  const stagger = index * 0.02;
  const inStart = windowIn[0] + stagger;
  const inEnd = Math.min(windowIn[1] + stagger, windowOut[0]);
  const t = useTransform(progress, (p) => segmentInOut(p, inStart, inEnd, windowOut[0], windowOut[1]));
  const opacity = t;
  const y = useTransform(t, [0, 1], [16, 0]);

  return (
    <motion.div
      style={{ opacity, y }}
      className={"liquid-glass rounded-xl p-3 shadow-xl " + card.tint}
    >
      <h3 className="font-display text-sm leading-tight text-white">{card.heading}</h3>
      <p className="mt-1 text-[11px] leading-snug text-white/80">{card.body}</p>
    </motion.div>
  );
}

/**
 * A fanned "hand of cards" deck of short pastel-glass panels, replacing a
 * single static caption card. Cards fan in staggered (scale+rotate+opacity)
 * within `windowIn`, hold, then fade/scale down together across
 * `windowOut` so the transition to whatever comes next reads as a merge
 * rather than a jump-cut — same segmentInOut scroll-choreography pattern
 * used throughout CinematicHero.
 */
export function FanCardDeck({ cards, progress, windowIn, windowOut }: FanCardDeckProps) {
  return (
    <>
      {/* Desktop: absolute rotated fan */}
      <div className="pointer-events-none absolute inset-x-0 bottom-[14%] hidden justify-center px-6 sm:flex">
        <div className="relative flex h-[26rem] w-full max-w-6xl items-center justify-center">
          {cards.map((card, i) => (
            <DeckCard
              key={card.heading}
              card={card}
              index={i}
              count={cards.length}
              progress={progress}
              windowIn={windowIn}
              windowOut={windowOut}
            />
          ))}
        </div>
      </div>

      {/* Mobile: static 2x2 grid, all cards visible at once */}
      <div className="pointer-events-none absolute inset-x-0 bottom-[10%] grid grid-cols-2 gap-2 px-4 sm:hidden">
        {cards.map((card, i) => (
          <MobileDeckCard
            key={card.heading}
            card={card}
            index={i}
            progress={progress}
            windowIn={windowIn}
            windowOut={windowOut}
          />
        ))}
      </div>
    </>
  );
}

export default FanCardDeck;
