import { useRef, type ReactNode } from "react";
import { motion, useScroll, useTransform, useReducedMotion, type MotionValue } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { SiteNav } from "@/components/SiteNav";

// Same `new URL(..., import.meta.url)` pattern as CinematicHero: this
// component is prerendered for "/" by scripts/ssr-pages.tsx under plain
// Node/tsx, which can't parse a raw binary asset as a module.
function asset(name: string) {
  return new URL(`../assets/goa-cinematic/${name}`, import.meta.url).href;
}

const bandBeach = asset("hero-midground.webp");
const bandPool = asset("pool-deck.webp");
const bandVilla = asset("door-open.webp");

/**
 * The hero as three stacked bands, each taking a third of the viewport,
 * each carrying one line of the argument over its own photograph.
 *
 * This replaces the scroll-driven crossfade stage (CinematicHero), where
 * the same three lines were revealed one at a time across a ~260vh runway.
 * The trade is deliberate: the crossfade version looked better in motion
 * but cost the visitor three screens of scrolling before the pitch was
 * even stated. Here all three land in the first viewport, and scrolling
 * is spent on the advantage cards instead of on re-reading the headline.
 */

interface Band {
  image: string;
  /** object-position, so each photo is cropped to its most legible third. */
  focus: string;
  alt: string;
  title: ReactNode;
  sub?: ReactNode;
}

const BANDS: Band[] = [
  {
    image: bandBeach,
    focus: "50% 62%",
    alt: "A Goan shoreline at night under a star field",
    title: (
      <>
        Wayzyy. <span className="whitespace-nowrap">Short term rentals.</span>
      </>
    ),
    sub: "Built around hosts and users, not as a marketplace.",
  },
  {
    image: bandPool,
    focus: "50% 45%",
    alt: "A lit pool deck at a Goan villa after sunset",
    title: <>Wayzyy is here to step it up.</>,
    sub: (
      <>
        0% booking commission, <span className="text-ember">100% direct host connection.</span>
      </>
    ),
  },
  {
    image: bandVilla,
    focus: "50% 50%",
    alt: "An open carved doorway into a Goan villa, lanterns lit",
    title: <>Same villas. Same properties.</>,
    sub: (
      <>
        <span className="text-ember">Without the markup.</span>
      </>
    ),
  },
];

/**
 * One band. No entrance animation, deliberately.
 *
 * An earlier version faded each band in from opacity 0 with a per-index
 * delay. That means the hero - the first thing anyone sees, and the whole
 * pitch - is invisible until JS runs and finishes animating. Any hiccup
 * (slow device, frozen rAF, a JS error above it in the tree) leaves a
 * black screen with no text. The photo and the words are the product here,
 * so they render immediately; the motion lives in the hover state and the
 * scroll cue instead, where failing just means "no flourish".
 */
function HeroBand({ band, index }: { band: Band; index: number }) {
  return (
    <section
      // Each band is a third of the stage. `min-h-0` matters: without it a
      // flex child refuses to shrink below its intrinsic content height,
      // and the three bands overflow 100vh on short viewports.
      className="group relative flex min-h-0 flex-1 items-center justify-center overflow-hidden"
    >
      {/* Photograph. Scales very slightly on hover - enough to feel alive,
          not enough to read as a zoom effect. */}
      <div
        aria-hidden
        className="absolute inset-0 bg-cover transition-transform duration-[1200ms] ease-out motion-safe:group-hover:scale-[1.04]"
        style={{ backgroundImage: `url(${band.image})`, backgroundPosition: band.focus }}
      />
      {/* Scrim. Heavier in the middle where the type sits, so the photo
          keeps its edges while the words stay readable over any crop. */}
      <div
        aria-hidden
        className="absolute inset-0 bg-[linear-gradient(90deg,rgba(10,12,18,0.82)_0%,rgba(10,12,18,0.55)_45%,rgba(10,12,18,0.78)_100%)] transition-opacity duration-700 motion-safe:group-hover:opacity-85"
      />
      {/* Hairline between bands, matching the divider in the sketch. */}
      {index > 0 && <div aria-hidden className="absolute inset-x-0 top-0 h-px bg-white/15" />}

      <img src={band.image} alt={band.alt} className="sr-only" aria-hidden="false" />

      <div className="relative z-10 max-w-4xl px-6 text-center">
        <h2 className="font-display text-xl font-extrabold leading-tight tracking-tight text-white text-balance sm:text-3xl lg:text-5xl">
          {band.title}
        </h2>
        {band.sub && (
          <p className="mx-auto mt-1.5 max-w-2xl text-xs font-medium text-white/85 text-balance sm:mt-3 sm:text-base lg:text-xl">
            {band.sub}
          </p>
        )}
      </div>
    </section>
  );
}

const ADVANTAGES = [
  {
    heading: "A beachside villa sounds expensive...",
    body: "...until you remove middleman fees. Every stay starts with an open door.",
    tint: "from-violet-300/15",
  },
  {
    heading: "There's usually a lock between that door and you.",
    body: "A hidden markup quietly added on top of what the host actually charges.",
    tint: "from-orange-300/15",
  },
  {
    heading: "Wayzyy is here to step it up.",
    body: "0% booking commission, 100% direct host connection. Real villas, real hosts.",
    tint: "from-sky-300/15",
  },
  {
    heading: "Community, not just a marketplace.",
    body: "Connecting 100,000+ developers & travelers with verified Goa homestays.",
    tint: "from-amber-300/15",
  },
];

/**
 * One advantage card.
 *
 * Deliberately NOT gated on JS for visibility. The first two attempts here
 * used framer's `whileInView` (IntersectionObserver) and then a `useScroll`
 * progress mapping, and both share the same failure mode: if the observer
 * or the rAF loop doesn't run, the card stays at opacity 0 and the section
 * renders as an empty black rectangle. On a marketing page that is the
 * worst possible failure - the content is simply gone, silently.
 *
 * A CSS `animate-in` entrance was tried next and fails the same way:
 * `fill-mode: both` pins the from-state (opacity 0) until the animation
 * actually runs, so a frozen animation clock hides the content just as
 * effectively. The card is therefore always visible, and its motion is a
 * hover lift - a transform, which degrades to simply not moving.
 */
function AdvantageCard({ card, index }: { card: (typeof ADVANTAGES)[number]; index: number }) {
  return (
    <article
      // min-w-0 so a long heading can't push the card past its grid column
      // on narrow screens (grid items default to min-width:auto).
      className={`relative min-w-0 overflow-hidden rounded-2xl border border-white/15 bg-gradient-to-b ${card.tint} to-transparent p-5 backdrop-blur-md transition-transform duration-500 hover:-translate-y-1 sm:p-6`}
    >
      <div className="mb-4 flex items-center justify-between gap-3">
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-ember text-xs font-bold text-white">
          {index + 1}
        </span>
        <span className="text-[9px] font-semibold uppercase tracking-[0.18em] text-white/55">
          Wayzyy advantage
        </span>
      </div>
      <h3 className="font-display text-lg font-bold leading-snug text-white text-balance sm:text-xl">
        {card.heading}
      </h3>
      <p className="mt-3 text-sm leading-relaxed text-white/75">{card.body}</p>
    </article>
  );
}

function AdvantageCards() {
  const reduce = useReducedMotion() ?? false;
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  // Gentle parallax on the backdrop only - the cards themselves stay put,
  // so nothing moves under the reader's eye while they're reading.
  const bgY = useTransform(scrollYProgress, [0, 1], ["-6%", "6%"]);

  return (
    <section ref={ref} className="relative overflow-hidden py-20 sm:py-28">
      <motion.div
        aria-hidden
        style={{ y: reduce ? 0 : bgY }}
        className="absolute inset-x-0 -inset-y-[8%] bg-cover bg-center"
      >
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${bandVilla})` }} />
        <div className="absolute inset-0 bg-[rgba(8,10,15,0.62)]" />
      </motion.div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6">
        <p className="mb-8 text-center text-[11px] font-semibold uppercase tracking-[0.22em] text-ember sm:text-xs">
          The Wayzyy advantage
        </p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {ADVANTAGES.map((card, i) => (
            <AdvantageCard key={card.heading} card={card} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ChurchFeature() {
  const churchCards = [
    {
      heading: "The best mornings start in a market.",
      body: "Not a tourist trap, a real Goan spice street, the kind locals actually shop at.",
      tint: "from-violet-300/15",
    },
    {
      heading: "Explore without worrying about the price tag.",
      body: "Never a hidden markup baked into what you see.",
      tint: "from-orange-300/15",
    },
    {
      heading: "You get the right money's worth.",
      body: "And hosts get paid what they actually charge, no cut skimmed off either side.",
      tint: "from-sky-300/15",
    },
    {
      heading: "A community built on harmony.",
      body: "Between hosts and travelers, not platform fees pulling them apart.",
      tint: "from-amber-300/15",
    },
  ] as const;

  return (
    <section className="relative min-h-[70svh] overflow-hidden bg-ink py-12 sm:py-16">
      <img
        src="/blog/goa-siolim-church.webp"
        alt="A historic Goan church surrounded by tropical greenery"
        className="absolute inset-0 h-full w-full object-cover"
        loading="lazy"
      />
      <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/45 to-black/25" />
      <div className="relative z-10 mx-auto flex min-h-[58svh] max-w-7xl flex-col justify-center px-4 sm:px-6">
        <p className="mb-6 text-center text-[11px] font-semibold uppercase tracking-[0.22em] text-ember sm:text-xs">
          The Wayzyy advantage
        </p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {churchCards.map((card, i) => (
            <AdvantageCard key={card.heading} card={card} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

export function HeroTriptych() {
  const reduce = useReducedMotion() ?? false;

  return (
    <>
      {/* Rendered OUTSIDE the hero on purpose. SiteNav is `fixed z-50`, but
          the hero below is an `isolate` stacking context - nesting the nav
          inside it capped its z-index at the hero's own level, so every
          section further down the page (case-study cards, marquee) painted
          straight over the navbar once you scrolled past the hero. */}
      <SiteNav />

      <div className="relative isolate h-[100svh] w-full overflow-hidden bg-ink">
        {/* The three bands. flex-col + flex-1 gives an exact third each,
            and survives the mobile URL bar resizing the viewport (svh). */}
        <div className="flex h-full w-full flex-col">
          {BANDS.map((band, i) => (
            <HeroBand key={i} band={band} index={i} />
          ))}
        </div>

        <div className="pointer-events-none absolute inset-x-0 bottom-4 z-20 flex flex-col items-center gap-1 text-white/70">
          <span className="text-[10px] font-medium uppercase tracking-[0.18em] sm:text-[11px]">
            Scroll to see why
          </span>
          <ChevronDown className="h-3.5 w-3.5 text-ember motion-safe:animate-bounce" />
        </div>
      </div>

      <AdvantageCards />
      <ChurchFeature />
    </>
  );
}
