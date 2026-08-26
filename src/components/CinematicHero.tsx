import { useRef, useState, useEffect, useCallback, type ReactNode } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
  useMotionValueEvent,
  useReducedMotion,
  MotionValue,
} from "framer-motion";
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { SiteNav } from "@/components/SiteNav";
import { FanCardDeck } from "@/components/FanCardDeck";

// Resolved via `new URL(..., import.meta.url)` rather than a static import - 
// this component is prerendered for "/" by scripts/ssr-pages.tsx under
// plain Node/tsx, which can't parse a raw binary asset as a module. Vite
// still hashes/optimizes it normally at build time. Same pattern as
// HeroStepOut's background video and the original /experience page this
// component was extracted from.
function asset(name: string) {
  return new URL(`../assets/goa-cinematic/${name}`, import.meta.url).href;
}

const heroSky = asset("hero-sky.webp");
const heroMidground = asset("hero-midground.webp");
const heroForeground = asset("hero-foreground.webp");
const zoomWide = asset("zoom-wide.webp");
const zoomCloser = asset("zoom-closer.webp");
const doorOpen = asset("door-open.webp");
const poolDeck = asset("pool-deck.webp");
const bazaar = asset("bazaar.webp");
const iconLantern = asset("icon-lantern.webp");
const iconLeaf = asset("icon-leaf.webp");
const iconWave = asset("icon-wave.webp");

/**
 * Classic smoothstep - an S-curve ease between two edges, 0 outside
 * [edge0, edge1], 1 past edge1, smooth in between.
 */
function smoothstep(edge0: number, edge1: number, x: number) {
  if (edge0 === edge1) return x < edge0 ? 0 : 1;
  const t = Math.min(1, Math.max(0, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

/**
 * The reusable "enter/exit window" helper from the reference cinematic-
 * scroll technique: given a scroll progress value `x` and four thresholds,
 * returns 0 before the window, smoothsteps up to 1 across [inStart, inEnd],
 * holds at 1, then smoothsteps back down to 0 across [outStart, outEnd].
 * Every scene transition and headline-phrase crossfade in this component is
 * driven through this one function.
 */
function segmentInOut(
  x: number,
  inStart: number,
  inEnd: number,
  outStart: number,
  outEnd: number,
) {
  const fadeIn = smoothstep(inStart, inEnd, x);
  const fadeOut = 1 - smoothstep(outStart, outEnd, x);
  return Math.min(fadeIn, fadeOut);
}

/**
 * Scroll-progress thresholds for the whole sticky stage (0 = stage enters,
 * 1 = stage releases). Door-lantern and door-pool were removed entirely - 
 * the new push-in zoom scene (zoomWide -> zoomCloser -> doorOpen) replaces
 * them, with the FanCardDeck caption cards (`story2`) now riding directly
 * on top of that zoom scene instead: the deck's stagger means card 1 lands
 * roughly with zoomWide, card 2 with zoomCloser, and cards 3-4 together
 * with doorOpen, fading out as pool-deck crossfades in right after the
 * door. Every segment reuses the same 42vh-dwell/16.8vh-crossfade cycle
 * used throughout this file. Stage total is now ~462vh (down from the
 * ~562.8vh mid-build version, since two full segments were cut).
 */
const T = {
  scene1End: 0.25,
  headline: [
    { in: [0.0, 0.0], out: [0.05, 0.07] },
    { in: [0.08, 0.098], out: [0.15, 0.17] },
    { in: [0.18, 0.20], out: [0.23, 0.25] },
  ],
  layersFadeOut: [0.20, 0.25],
  zoomWide: { in: [0.25, 0.28], out: [0.41, 0.44] },
  zoomCloser: { in: [0.25, 0.28], out: [0.41, 0.44] },
  doorOpen: { in: [0.44, 0.47], out: [0.60, 0.63] },
  poolDeck: { in: [0.65, 0.68], out: [0.78, 0.81] },
  story2: { in: [0.44, 0.47], out: [0.60, 0.63] },
  bazaar: { in: [0.81, 0.84], out: [0.96, 1.0] },
  story3: { in: [0.84, 0.87], out: [0.95, 0.98] },
};

function IntroScrollHint({ progress }: { progress: MotionValue<number> }) {
  const reduce = useReducedMotion();
  const opacity = useTransform(progress, [0, 0.04], [1, 0]);

  return (
    <motion.div
      style={{ opacity }}
      className="mt-2 flex items-center justify-center gap-1.5 text-[11px] font-medium uppercase tracking-[0.18em] text-white/70 sm:text-xs"
    >
      <span>Every scene here says something. Scroll to breathe it all in</span>
      <ChevronDown className="h-3.5 w-3.5 animate-bounce text-ember" />
    </motion.div>
  );
}

function buildHeadlinePhrases(progress: MotionValue<number>): { text: ReactNode; ember: boolean }[] {
  return [
    {
      text: (
        <div className="flex flex-col items-center justify-center gap-2 text-center">
          <span className="font-display text-2.5xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Wayzyy. Short term rentals.
          </span>
          <span className="font-display text-xs font-medium text-white/90 sm:text-xl lg:text-2xl">
            Built around hosts and users, not as a marketplace.
          </span>
          <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-ember sm:text-base lg:text-lg">
            Starting with Goa
          </span>
          <IntroScrollHint progress={progress} />
        </div>
      ),
      ember: false,
    },
    {
      text: (
        <div className="flex flex-col items-center justify-center text-center">
          <span className="block font-extrabold text-ember text-3xl sm:text-6xl lg:text-7xl">Goa.</span>
          <span className="block mt-2 text-white text-xl sm:text-4xl lg:text-5xl max-w-3xl">
            A land of beaches, waterfalls, and a getaway from metro cities.
          </span>
        </div>
      ),
      ember: false,
    },
    {
      text: (
        <div className="flex flex-col items-center justify-center text-center">
          <span className="block font-extrabold text-white text-2.5xl sm:text-5xl lg:text-6xl">
            Wayzyy is here to step it up.
          </span>
          <span className="block mt-2 text-white/90 text-lg sm:text-3xl lg:text-4xl max-w-3xl">
            Real villas, real hosts, <span className="text-ember font-bold">and no hidden markup.</span>
          </span>
        </div>
      ),
      ember: false,
    },
  ];
}

const sights = [
  {
    kicker: "Beach",
    title: "Baga Beach",
    line: "Lively shoreline with shacks, water sports, and golden-hour sunsets.",
    icon: iconLantern,
  },
  {
    kicker: "Market",
    title: "Anjuna Flea Market",
    line: "Wednesday market for spices, textiles, and handmade jewelry.",
    icon: iconWave,
  },
  {
    kicker: "Landmark",
    title: "Fort Aguada",
    line: "17th-century Portuguese fort with lighthouse views over the Arabian Sea.",
    icon: iconLeaf,
  },
  {
    kicker: "Waterfall",
    title: "Dudhsagar Falls",
    line: "A four-tiered waterfall deep in the Western Ghats.",
    icon: iconWave,
  },
  {
    kicker: "Plantation",
    title: "Spice Gardens",
    line: "Guided walks through cardamom, pepper, and cinnamon groves.",
    icon: iconLeaf,
  },
];

/**
 * Infinite-loop horizontal card slider. Renders three identical sets of
 * cards back to back and starts scrolled into the middle set; each
 * prev/next tap animates one card-width, and once the transition lands the
 * effect checks whether the active index has drifted into the first or
 * third set - if so it snaps (no transition) back to the equivalent card
 * in the middle set, so the loop never visibly resets.
 */
function SightsSlider() {
  const count = sights.length;
  const [index, setIndex] = useState(count); // start in the middle set
  const [animate, setAnimate] = useState(true);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const reduce = useReducedMotion();

  const tripled = [...sights, ...sights, ...sights];

  const goTo = useCallback(
    (dir: 1 | -1) => {
      setAnimate(true);
      setIndex((i) => i + dir);
    },
    [],
  );

  // Slide duration in ms - kept as one constant so the "wait for the slide
  // to land" timer below can't drift out of sync with the CSS transition.
  const SLIDE_MS = 550;

  // After the slide transition lands, if we've drifted into the clone set
  // on either edge, silently jump back to the matching card in the real
  // (middle) set with no transition - the seam the loop hides. Driven by a
  // timer matched to the transition duration rather than the DOM
  // `transitionend` event, which can be unreliable to depend on alone
  // (skipped by rapid/interrupted transitions, some browser/embedding
  // quirks) - a timer is a simpler, more robust source of truth here.
  useEffect(() => {
    if (!animate) return;
    const id = window.setTimeout(() => {
      setIndex((i) => {
        if (i >= count * 2) {
          setAnimate(false);
          return i - count;
        }
        if (i < count) {
          setAnimate(false);
          return i + count;
        }
        return i;
      });
    }, SLIDE_MS + 20);
    return () => window.clearTimeout(id);
  }, [index, animate, count]);

  // Re-enable the transition on the next tick after a silent jump.
  useEffect(() => {
    if (!animate) {
      const id = requestAnimationFrame(() => setAnimate(true));
      return () => cancelAnimationFrame(id);
    }
  }, [animate]);

  return (
    <div className="relative w-full overflow-hidden">
      <div
        ref={trackRef}
        className="flex gap-5"
        style={{
          transform: `translateX(calc(-${index} * (min(430px, 82vw) + 1.25rem)))`,
          transition:
            animate && !reduce ? `transform ${SLIDE_MS}ms cubic-bezier(0.22,1,0.36,1)` : "none",
        }}
      >
        {tripled.map((s, i) => (
          <div
            key={i}
            className="relative shrink-0 rounded-2xl border border-border/60 bg-paper p-6 text-ink shadow-xl"
            style={{ width: "min(430px, 82vw)", minHeight: 220 }}
          >
            <div className="absolute right-5 top-5 h-11 w-11 overflow-hidden rounded-xl bg-paper ring-1 ring-black/10">
              <img src={s.icon} alt="" className="h-full w-full object-cover" loading="lazy" />
            </div>
            <div className="pr-14">
              <div className="text-xs font-semibold uppercase tracking-[0.2em] text-ember">
                {s.kicker}
              </div>
              <h3 className="mt-2 font-display text-2xl leading-tight">{s.title}</h3>
              <p className="mt-2 text-sm text-ink/70">{s.line}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 flex items-center justify-center gap-3">
        <button
          type="button"
          onClick={() => goTo(-1)}
          aria-label="Previous sight"
          className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-md transition-colors hover:bg-white/20 active:scale-95"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          type="button"
          onClick={() => goTo(1)}
          aria-label="Next sight"
          className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-md transition-colors hover:bg-white/20 active:scale-95"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}

/** One phrase of the flowing headline, its opacity/rise driven by a segmentInOut window on scroll progress. */
function HeadlineBeat({
  progress,
  window: w,
  ember,
  children,
}: {
  progress: MotionValue<number>;
  window: { in: number[]; out: number[] };
  ember: boolean;
  children: ReactNode;
}) {
  const opacity = useTransform(progress, (p) =>
    segmentInOut(p, w.in[0], w.in[1], w.out[0], w.out[1]),
  );
  const y = useTransform(opacity, [0, 1], [16, 0]);

  return (
    <motion.div
      style={{ opacity, y }}
      className={
        "absolute inset-x-0 text-center flex justify-center items-center font-display text-2xl font-bold leading-[1.15] sm:text-5xl md:text-6xl lg:text-7xl " +
        (ember ? "text-ember" : "text-white")
      }
    >
      {children}
    </motion.div>
  );
}

/**
 * Small "scroll to continue" nudge, pinned to the right edge. Only relevant
 * for the first instant someone lands on the hero, before they've scrolled
 * or the choreography has done anything visible yet - so it fades out over
 * the first sliver of scroll progress rather than sitting on screen through
 * the whole cinematic.
 */
function RightScrollCue({ progress }: { progress: MotionValue<number> }) {
  const reduce = useReducedMotion();
  // Stays visible across the whole cinematic (all the way through the
  // bazaar/story3 close), only fading out right at the very end as the
  // sticky stage hands off to the rest of the page.
  const opacity = useTransform(progress, [0, T.bazaar.out[0], T.bazaar.out[1]], [1, 1, 0]);
  // Grows over the first sliver of scroll and then holds at that size
  // ("fixates") for the rest of the cinematic - a visible confirmation,
  // the instant someone starts scrolling, that they've triggered the
  // motion-graphic sequence and should keep going. useTransform clamps to
  // the output range past the input range by default, so it settles at
  // 1.3x and stays there until the same fade-out window as opacity above.
  const grow = useTransform(progress, [0, 0.035], [1, 1.3]);
  // Literal color values, not `hsl(var(--ember))` - framer-motion's color
  // interpolator needs concrete values on both ends of the range, it can't
  // resolve a CSS custom property, so a var() reference here silently fails
  // to animate (and throws a console warning every frame it's evaluated).
  const labelColor = useTransform(progress, [0, 0.035], ["rgba(255,255,255,0.7)", "hsl(25, 100%, 50%)"]);

  return (
    <motion.div
      aria-hidden
      style={{ opacity, scale: grow }}
      className="pointer-events-none absolute inset-y-0 right-2.5 z-20 flex origin-right items-center sm:right-6"
    >
      <div className="flex flex-col items-center gap-2">
        <motion.span
          style={{ color: labelColor }}
          className="text-[10px] font-bold uppercase tracking-[0.25em] [writing-mode:vertical-rl] sm:text-base lg:text-lg"
        >
          Scroll
        </motion.span>
        <motion.span
          animate={reduce ? undefined : { y: [0, 6, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="text-white/60"
        >
          <ChevronDown className="h-4 w-4 sm:h-5 sm:w-5" />
        </motion.span>
      </div>
    </motion.div>
  );
}

function StoryPanelStatic({
  image,
  headline,
  body,
}: {
  image: string;
  headline: string;
  body: string;
}) {
  return (
    <section className="relative flex min-h-[60vh] items-end overflow-hidden px-6 py-16">
      <img src={image} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/10" />
      <div className="relative z-10 mx-auto max-w-xl rounded-2xl border border-white/15 bg-black/35 p-6 text-center backdrop-blur-md sm:p-8">
        <h2 className="text-balance font-display text-3xl leading-tight text-white sm:text-4xl">
          {headline}
        </h2>
        <p className="mt-3 text-pretty text-sm text-white/85 sm:text-base">{body}</p>
      </div>
    </section>
  );
}

interface CinematicHeroProps {
  /**
   * Renders the floating pill navbar inside the hero, same as
   * HeroStepOut does today. Defaults on since this is the homepage hero's
   * job; the /experience route (which already has its own simple
   * back-to-home link) opts out to avoid a redundant second navbar.
   */
  renderNav?: boolean;
  /**
   * The "sights worth the detour" infinite card slider directly beneath
   * the 3-scene stage. Nothing else on the homepage currently surfaces
   * this "things to do in Goa" content, so it stays on by default.
   */
  showSightsSlider?: boolean;
}

/**
 * The cinematic scroll-driven hero: a `position: sticky` stage that plays
 * three scenes as the page scrolls through its `h-[420vh]` runway - 
 * (1) a layered-parallax night balcony scene with a flowing 4-phrase
 * headline, (2) a door → pool "arrival" crossfade sequence with a story
 * panel, (3) a spice-market bazaar scene with a story panel - followed by
 * an infinite-loop "sights worth the detour" card slider. Originally built
 * as the standalone /experience page; extracted here so it can also serve
 * as the homepage hero without duplicating the scroll-choreography logic.
 */
export function CinematicHero({ renderNav = true, showSightsSlider = true }: CinematicHeroProps = {}) {
  const reduce = useReducedMotion();
  const stageRef = useRef<HTMLDivElement | null>(null);

  const { scrollYProgress } = useScroll({
    target: stageRef,
    offset: ["start start", "end end"],
  });
  // Lenis (SmoothScroll) already smooths the raw scroll position at the
  // input level - the same reason EconomicsSection's parallax feeds
  // scrollYProgress straight into useTransform with no extra spring.
  // Springing it again here would double up the smoothing and make the
  // choreography visibly lag behind the user's actual scroll position.
  const progress = scrollYProgress;

  // Mouse-parallax on the foreground layer - identical spring config to
  // HeroStepOut's cursor-glow, reused here to drift the closest depth
  // layer a modest amount around its resting position.
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);
  const springX = useSpring(mouseX, { stiffness: 120, damping: 18, mass: 0.6 });
  const springY = useSpring(mouseY, { stiffness: 120, damping: 18, mass: 0.6 });
  const fgMouseX = useTransform(springX, [0, 1], ["-2.5%", "2.5%"]);
  const fgMouseY = useTransform(springY, [0, 1], ["-2%", "2%"]);
  // Same cursor-drift, extended to the rest of the stage's scenes so the
  // whole cinematic feels responsive to the cursor, not just scene 1. Each
  // scene gets its own (smaller) amplitude - the push-in zoom scenes are
  // already "closer" to camera so a full-strength drift reads as shaky,
  // and the busier bazaar/pool images read best with the subtlest touch.
  const zoomMouseX = useTransform(springX, [0, 1], ["-1.4%", "1.4%"]);
  const zoomMouseY = useTransform(springY, [0, 1], ["-1.1%", "1.1%"]);
  const poolMouseX = useTransform(springX, [0, 1], ["-1%", "1%"]);
  const poolMouseY = useTransform(springY, [0, 1], ["-0.8%", "0.8%"]);
  const bazaarMouseX = useTransform(springX, [0, 1], ["-0.8%", "0.8%"]);
  const bazaarMouseY = useTransform(springY, [0, 1], ["-0.6%", "0.6%"]);
  // Scene 1's midground gets a faint drift too, opposite direction and
  // lower amplitude than the foreground, so the two layers separate in
  // depth as the cursor moves instead of moving as one flat sheet.
  const midMouseX = useTransform(springX, [0, 1], ["1%", "-1%"]);
  const midMouseY = useTransform(springY, [0, 1], ["0.8%", "-0.8%"]);

  function handleMouseMove(e: React.MouseEvent<HTMLElement>) {
    if (reduce) return;
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width);
    mouseY.set((e.clientY - rect.top) / rect.height);
  }

  // This stage has 7 full-bleed photos across three scenes. Cross-fading
  // all of them via opacity alone would mean every one of them stays
  // mounted (and painted/composited) for the entire scroll - seven large
  // decoded images alive at once is unnecessary GPU/paint work for photos
  // that are fully transparent 80% of the time. Instead each scene's
  // images are only mounted while scroll progress is near that scene (with
  // a little buffer on both sides so the crossfade itself still has both
  // images present). The mount/unmount check only needs to happen a
  // handful of times across the whole scroll, so it's driven by a plain
  // useState + a motion-value change listener rather than anything that
  // re-renders per frame.
  const [scene1Mounted, setScene1Mounted] = useState(true);
  const [sceneZoomMounted, setSceneZoomMounted] = useState(false);
  const [scenePoolMounted, setScenePoolMounted] = useState(false);
  const [scene3Mounted, setScene3Mounted] = useState(false);
  useMotionValueEvent(progress, "change", (p) => {
    setScene1Mounted(p < 0.28);
    setSceneZoomMounted(p > 0.24 && p < 0.59);
    setScenePoolMounted(p >= 0.60 && p < T.poolDeck.out[1] + 0.04);
    setScene3Mounted(p > T.bazaar.in[0] - 0.04);
  });

  // Subtle ocean-waves audio, playing only while the pool-deck scene is on
  // screen - fades in/out with the scene's own opacity window rather than
  // hard-cutting, and stays muted for prefers-reduced-motion users (who get
  // the static fallback below instead of this scroll rig entirely, but the
  // guard is kept here too in case that ever changes).
  const waveAudioRef = useRef<HTMLAudioElement | null>(null);
  useEffect(() => {
    const audio = waveAudioRef.current;
    if (!audio || reduce) return;
    if (scenePoolMounted) {
      audio.volume = 0.22;
      audio.currentTime = 0;
      audio.play().catch(() => {
        // Autoplay can still be blocked in some browsers even after
        // scroll interaction - failing silently is correct here, this
        // is ambience, not required content.
      });
    } else {
      audio.pause();
    }
  }, [scenePoolMounted, reduce]);

  // Scene 1 - sky, midground, and foreground are three separate, fully
  // opaque photographs (not transparent-cutout depth layers), so stacking
  // them and only varying a shared opacity would always show just the
  // topmost one (foreground) - sky and midground would never be visible at
  // any scroll position. Sequenced as a crossfade instead, same technique
  // as the Scene 2 door sequence below, just three beats instead of two.
  // Re-synced to the (now 3-beat) headline schedule in `T.headline` above:
  // the intro tagline and the combined "beaches/waterfalls" beat both hold
  // over the plain sky photo, the sky->midground crossfade lands right
  // after that combined beat's out-window finishes, and midground
  // ->foreground lands right as the new factual beat ("Real villas. Real
  // hosts. No hidden markup.") fades in - so the strongest claim in the
  // hero gets the fullest, most settled image behind it.
  const scene1Windows = {
    // sky's "in" window collapses to a single point at 0 so it's already at
    // full opacity the instant the page loads, before any scrolling.
    sky: { in: [0, 0], out: [0.19, 0.22] },
    mid: { in: [0.19, 0.22], out: [0.25, 0.28] },
    fg: { in: [0.25, 0.28], out: [0.3, 0.32] },
  } as const;
  const skyOpacity = useTransform(progress, (p) =>
    segmentInOut(p, ...scene1Windows.sky.in, ...scene1Windows.sky.out),
  );
  const midOpacity = useTransform(progress, (p) =>
    segmentInOut(p, ...scene1Windows.mid.in, ...scene1Windows.mid.out),
  );
  const fgOpacity = useTransform(progress, (p) =>
    segmentInOut(p, ...scene1Windows.fg.in, ...scene1Windows.fg.out),
  );
  const skyY = useTransform(progress, [0, T.scene1End], ["0%", "-4%"]);
  const midY = useTransform(progress, [0, T.scene1End], ["0%", "-11%"]);
  const midScale = useTransform(progress, [0, T.scene1End], [1, 1.05]);
  const fgY = useTransform(progress, [0, T.scene1End], ["0%", "-20%"]);
  const fgScale = useTransform(progress, [0, T.scene1End], [1, 1.1]);

  // Scene 1.5 - push-in zoom (wide aerial -> closer villa -> door open),
  // scaling *up* through each image (1 -> 1.1) so the sequence reads as
  // the camera continuously pushing toward the villa rather than a series
  // of independent stills. The FanCardDeck caption cards (`story2Opacity`
  // below) ride on top of this whole sequence.
  const houseHeadlineOpacity = useTransform(progress, (p) =>
    segmentInOut(p, 0.25, 0.28, 0.40, 0.43),
  );
  const zoomWideOpacity = useTransform(progress, (p) =>
    segmentInOut(p, ...(T.zoomWide.in as [number, number]), ...(T.zoomWide.out as [number, number])),
  );
  const zoomCloserOpacity = useTransform(progress, (p) =>
    segmentInOut(p, ...(T.zoomCloser.in as [number, number]), ...(T.zoomCloser.out as [number, number])),
  );
  const doorOpenOpacity = useTransform(progress, (p) =>
    segmentInOut(p, ...(T.doorOpen.in as [number, number]), ...(T.doorOpen.out as [number, number])),
  );
  const zoomWideScale = useTransform(progress, [T.zoomWide.in[0], T.zoomWide.out[1]], [1.0, 1.25]);
  const zoomCloserScale = useTransform(progress, [T.zoomCloser.in[0], T.zoomCloser.out[1]], [1.05, 1.3]);
  const doorOpenScale = useTransform(progress, [T.doorOpen.in[0], T.doorOpen.out[1]], [1.1, 1.35]);
  const story2Opacity = useTransform(progress, (p) =>
    segmentInOut(p, ...(T.story2.in as [number, number]), ...(T.story2.out as [number, number])),
  );

  // Scene 2 - pool deck, picking up right where the door-open scene ends.
  const poolDeckOpacity = useTransform(progress, (p) =>
    segmentInOut(p, ...(T.poolDeck.in as [number, number]), ...(T.poolDeck.out as [number, number])),
  );
  const poolDeckScale = useTransform(progress, [T.poolDeck.in[0], T.poolDeck.out[1]], [1.06, 1]);

  // Scene 3 - bazaar.
  const bazaarOpacity = useTransform(progress, (p) =>
    segmentInOut(p, ...(T.bazaar.in as [number, number]), ...(T.bazaar.out as [number, number])),
  );
  const bazaarScale = useTransform(progress, [T.bazaar.in[0], 1], [1.08, 1]);
  const story3Opacity = useTransform(progress, (p) =>
    segmentInOut(p, ...(T.story3.in as [number, number]), ...(T.story3.out as [number, number])),
  );

  // Reduced-motion: skip the sticky scroll rig entirely and render a plain,
  // static, readable stack of the same content instead.
  if (reduce) {
    return (
      <div id="top" className="relative bg-ink">
        {renderNav && <SiteNav floating />}
        <section className="relative flex min-h-[70vh] flex-col items-center justify-center gap-4 overflow-hidden px-6 py-24 text-center">
          <img src={heroSky} alt="" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-black/45" />
          <div className="relative z-10 max-w-2xl">
            <h1 className="text-balance font-display text-4xl font-bold leading-tight text-white sm:text-6xl">
              Goa has beaches. Goa has waterfalls. Real villas, real hosts,{" "}
              <span className="text-ember">no hidden markup.</span>
            </h1>
          </div>
        </section>
        <StoryPanelStatic
          image={doorOpen}
          headline="Every stay starts with an open door."
          body="No lobby, no keycard queue, just a host who's already waiting, a lantern lit, and a villa that was empty until it was yours for the week."
        />
        <StoryPanelStatic
          image={bazaar}
          headline="The best mornings start in a market."
          body="Not a tourist trap with printed menus, a real Goan spice street, the kind locals actually shop at, where the best find is whatever the vendor recommends."
        />
        {showSightsSlider && (
          <section className="bg-ink px-6 py-20">
            <h2 className="text-center font-display text-3xl text-white sm:text-4xl">
              Sights worth the detour
            </h2>
            <div className="mx-auto mt-10 max-w-6xl">
              <SightsSlider />
            </div>
          </section>
        )}
        <div
          aria-hidden
          className="relative h-24 bg-gradient-to-b from-ink to-background sm:h-32"
        />
      </div>
    );
  }

  return (
    <div id="top" className="relative bg-ink">
      {renderNav && <SiteNav floating />}

      {/* the tall scroll driver - its height is the entire runway for the
          sticky stage below; scrollYProgress walks 0→1 across it */}
      <div ref={stageRef} className="relative h-[462vh] w-full">
        <audio ref={waveAudioRef} src="/audio/ocean-waves.mp3" preload="none" loop />
        <div
          onMouseMove={handleMouseMove}
          className="sticky top-0 h-screen w-full overflow-hidden bg-ink"
        >
          <RightScrollCue progress={progress} />

          {/* ---------------- Scene 1: opening parallax ---------------- */}
          {scene1Mounted && (
            <motion.div aria-hidden={false} className="absolute inset-0">
              <motion.img
                src={heroSky}
                alt="Goa coastline at night under a full moon"
                loading="eager"
                className="absolute -inset-y-[10%] inset-x-0 h-[120%] w-full object-cover"
                style={{ y: skyY, opacity: skyOpacity }}
              />
              <motion.img
                src={heroMidground}
                alt="A lantern-lit hillside village above the Goan coast at night"
                loading="lazy"
                className="absolute -inset-y-[18%] inset-x-0 h-[136%] w-full object-cover"
                style={{ y: midY, scale: midScale, x: midMouseX, translateY: midMouseY, opacity: midOpacity }}
              />
              <motion.img
                src={heroForeground}
                alt="A guest looking out at the sea from a villa balcony at night"
                loading="lazy"
                className="absolute -inset-y-[26%] inset-x-0 h-[152%] w-full object-cover"
                style={{ y: fgY, scale: fgScale, x: fgMouseX, translateY: fgMouseY, opacity: fgOpacity }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-black/30" />

              {/* flowing headline - one phrase visible at a time */}
              <div className="absolute inset-x-0 top-1/2 flex -translate-y-1/2 flex-col items-center justify-center px-4 sm:px-8 max-w-5xl mx-auto">
                <div className="relative min-h-[7em] w-full max-w-4xl sm:min-h-[4em]">
                  {buildHeadlinePhrases(progress).map((p, i) => (
                    <HeadlineBeat key={i} progress={progress} window={T.headline[i]} ember={p.ember}>
                      {p.text}
                    </HeadlineBeat>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* ---------------- Scene 1.5: push-in zoom toward the villa ---------------- */}
          {sceneZoomMounted && (
            <>
              <motion.img
                src={zoomCloser}
                alt="A dusk view of a lantern-lit Goan villa glowing above the coastline"
                loading="eager"
                className="absolute inset-0 h-full w-full object-cover"
                style={{ opacity: zoomCloserOpacity, scale: zoomCloserScale, x: zoomMouseX, translateY: zoomMouseY }}
              />
              <motion.div
                style={{ opacity: houseHeadlineOpacity }}
                className="pointer-events-none absolute inset-x-0 top-1/2 flex -translate-y-1/2 flex-col items-center justify-center px-4 max-w-4xl mx-auto text-center z-20 space-y-2"
              >
                <span className="font-display text-2.5xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight drop-shadow-lg">
                  Same properties, same villas, same vibes.
                </span>
                <span className="font-display text-base sm:text-2.5xl lg:text-3xl font-medium text-white/95 drop-shadow-md">
                  And definitely with the same people.
                </span>
                <span className="font-display text-xl sm:text-4xl lg:text-5xl font-extrabold text-ember pt-1.5 drop-shadow-lg">
                  Here's how we fix it.
                </span>
              </motion.div>
              <motion.img
                src={doorOpen}
                alt="The villa's carved wooden front door standing open at dusk, lit by hanging lanterns"
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover"
                style={{ opacity: doorOpenOpacity, scale: doorOpenScale, x: zoomMouseX, translateY: zoomMouseY }}
              />
              <motion.div
                style={{ opacity: story2Opacity }}
                className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-black/20"
              />
              <FanCardDeck
                progress={progress}
                // Desktop ignores windowIn/windowOut entirely (it uses the
                // explicit per-card cardWindows below) - these two values
                // now only drive the mobile 2x2 grid, which shows all 4
                // cards at once rather than staged per-image. Timed to
                // doorOpen's own window (not the full zoomWide-to-doorOpen
                // span) so the deck doesn't appear while still showing the
                // wide/closer shots, when "We took the lock off" and
                // "Community, not just a marketplace" would read as wrong
                // relative to what's on screen.
                windowIn={T.doorOpen.in as [number, number]}
                windowOut={T.doorOpen.out as [number, number]}
                cardWindows={[
                  { in: T.doorOpen.in as [number, number], out: T.doorOpen.out as [number, number] },
                  { in: T.doorOpen.in as [number, number], out: T.doorOpen.out as [number, number] },
                  { in: T.doorOpen.in as [number, number], out: T.doorOpen.out as [number, number] },
                  { in: T.doorOpen.in as [number, number], out: T.doorOpen.out as [number, number] },
                ]}
                cards={[
                  {
                    heading: "A beachside villa sounds expensive...",
                    body: "...until you remove middleman fees. Every stay starts with an open door.",
                    tint: "bg-violet-200/15",
                  },
                  {
                    heading: "There's usually a lock between that door and you.",
                    body: "A hidden markup quietly added on top of what the host actually charges.",
                    tint: "bg-orange-200/15",
                  },
                  {
                    heading: "Wayzyy is here to step it up.",
                    body: "0% booking commission, 100% direct host connection. Real villas, real hosts.",
                    tint: "bg-sky-200/15",
                  },
                  {
                    heading: "Community, not just a marketplace.",
                    body: "Connecting 100,000+ developers & travelers with verified Goa homestays.",
                    tint: "bg-amber-200/15",
                  },
                ]}
              />
            </>
          )}

          {/* ---------------- Scene 2: pool deck ---------------- */}
          {scenePoolMounted && (
            <>
              <motion.img
                src={poolDeck}
                alt="A villa infinity pool at dusk under a starry sky"
                loading="eager"
                className="absolute inset-0 h-full w-full object-cover"
                style={{ opacity: poolDeckOpacity, scale: poolDeckScale, x: poolMouseX, translateY: poolMouseY }}
              />
              <div className="absolute inset-x-0 top-1/2 flex -translate-y-1/2 flex-col items-start px-6 sm:px-12 max-w-5xl mx-auto">
                <div className="relative h-[3.4em] w-full max-w-4xl sm:h-[1.6em]">
                  <HeadlineBeat progress={progress} window={T.poolDeck} ember={false}>
                    Breathe out, the waves are getting near.
                  </HeadlineBeat>
                </div>
              </div>
            </>
          )}

          {/* ---------------- Scene 3: bazaar ---------------- */}
          {scene3Mounted && (
            <>
              <motion.img
                src={bazaar}
                alt="A Goan spice-market street at golden hour with lanterns and shopfronts"
                loading="eager"
                className="absolute inset-0 h-full w-full object-cover"
                style={{ opacity: bazaarOpacity, scale: bazaarScale, x: bazaarMouseX, translateY: bazaarMouseY }}
              />
              <motion.div
                style={{ opacity: story3Opacity }}
                className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"
              />
              <FanCardDeck
                progress={progress}
                windowIn={T.story3.in as [number, number]}
                windowOut={T.story3.out as [number, number]}
                cards={[
                  {
                    heading: "The best mornings start in a market.",
                    body: "Not a tourist trap, a real Goan spice street, the kind locals actually shop at.",
                    tint: "bg-violet-200/15",
                  },
                  {
                    heading: "Explore without worrying about the price tag.",
                    body: "Never a hidden markup baked into what you see.",
                    tint: "bg-orange-200/15",
                  },
                  {
                    heading: "You get the right money's worth.",
                    body: "And hosts get paid what they actually charge, no cut skimmed off either side.",
                    tint: "bg-sky-200/15",
                  },
                  {
                    heading: "A community built on harmony.",
                    body: "Between hosts and travelers, not platform fees pulling them apart.",
                    tint: "bg-amber-200/15",
                  },
                ]}
              />
            </>
          )}
        </div>
      </div>

      {/* ---------------- Sights slider - flies in after the stage releases ---------------- */}
      {showSightsSlider && (
        <motion.section
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10% 0px -10% 0px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="relative bg-ink px-6 py-24 sm:py-32"
        >
          <div className="mx-auto max-w-6xl text-center">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.25em] text-white/70">
              <span className="h-1.5 w-1.5 rounded-full bg-ember" />
              While you're here
            </div>
            <h2 className="text-balance font-display text-4xl leading-tight text-white sm:text-5xl">
              Sights worth the detour
            </h2>
            <div className="mx-auto mt-10 flex justify-center">
              <SightsSlider />
            </div>
          </div>
        </motion.section>
      )}

      {/* Bridge - the cinematic stage is bg-ink; the rest of the page runs on
          bg-background. Cross-fading straight from one flat color to the other
          reads as a hard cut ("cinematic thing ends, normal site begins"), so
          this closes the gap with an actual gradient handoff instead of a seam. */}
      <div
        aria-hidden
        className="relative h-24 bg-gradient-to-b from-ink to-background sm:h-32"
      />
    </div>
  );
}

export default CinematicHero;
