import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { SiteNav } from "@/components/SiteNav";
import { TextEffect } from "@/components/core/text-effect";
import { ProgressiveBlur } from "@/components/core/progressive-blur";
import { Button } from "@/components/ui/button";

// Resolved via `new URL(..., import.meta.url)` rather than a static import —
// same reason as the old hero photo import: this component is prerendered
// for "/" by scripts/ssr-pages.tsx under plain Node/tsx, which can't parse
// a raw binary asset as a module. Vite still hashes/optimizes it normally
// at build time.
const heroVideo = new URL(
  "../assets/host-auth/host-auth-hero-video.mp4",
  import.meta.url,
).href;

/**
 * Clean, photo-free hero: a still, atmospheric dark-to-background gradient
 * (built entirely from the site's own `--ink` / `--ember` / `--background`
 * tokens — no imagery) with a soft ember glow behind the headline for
 * depth, and a ProgressiveBlur wash at the foot of the section that
 * softens the seam where the hero meets the page below.
 *
 * The gradient anchors on `--ink`, a token that stays a fixed dark shade
 * in both themes (see src/index.css), so the floating white-text pill
 * navbar and headline keep the same contrast regardless of site theme —
 * same job the old photo's dark overlay used to do, minus the photo.
 */
export function HeroStepOut() {
  const reduce = useReducedMotion();

  // Cursor-following ambient glow. Raw mouse position feels artificial, so
  // the position is spring-smoothed (per Emil Kowalski's mouse-tracking
  // guidance) and only used to *drift* the glow a modest distance around
  // its resting spot — this stays decorative background warmth, not a
  // spotlight that chases the pointer.
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);
  const cursorPxX = useMotionValue(400);
  const cursorPxY = useMotionValue(300);
  const springX = useSpring(mouseX, { stiffness: 120, damping: 18, mass: 0.6 });
  const springY = useSpring(mouseY, { stiffness: 120, damping: 18, mass: 0.6 });
  const springPxX = useSpring(cursorPxX, { stiffness: 200, damping: 25 });
  const springPxY = useSpring(cursorPxY, { stiffness: 200, damping: 25 });

  const glowX = useTransform(springX, [0, 1], ["-80px", "80px"]);
  const glowY = useTransform(springY, [0, 1], ["-60px", "60px"]);

  function handleHeroMouseMove(e: React.MouseEvent<HTMLElement>) {
    if (reduce) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const relX = e.clientX - rect.left;
    const relY = e.clientY - rect.top;
    mouseX.set(relX / rect.width);
    mouseY.set(relY / rect.height);
    cursorPxX.set(relX);
    cursorPxY.set(relY);
  }

  return (
    <section
      id="top"
      onMouseMove={reduce ? undefined : handleHeroMouseMove}
      className="relative flex h-screen min-h-[640px] w-full items-end overflow-hidden bg-[hsl(var(--ink))] sm:items-center"
    >
      {/* full-bleed background video — stays invisible (dark base shows
          instead) until playback genuinely starts, so slower connections
          never flash the browser's native paused/loading affordance */}
      {!reduce && (
        <video
          aria-hidden
          autoPlay
          muted
          loop
          playsInline
          disablePictureInPicture
          controlsList="nodownload noplaybackrate nofullscreen"
          onPlaying={(e) => e.currentTarget.classList.remove("opacity-0")}
          className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-500"
        >
          <source src={heroVideo} />
        </video>
      )}

      {/* lighter dark wash over the video so the video is clear, vibrant and visible */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-black/10 to-background/70" />

      {/* Direct Interactive Mouse Spotlight Glow */}
      {!reduce && (
        <motion.div
          aria-hidden
          style={{
            left: springPxX,
            top: springPxY,
            transform: "translate(-50%, -50%)",
          }}
          className="pointer-events-none absolute h-[450px] w-[450px] rounded-full bg-[radial-gradient(circle_at_center,_hsl(var(--ember))/0.35_0%,_hsl(var(--ember))/0.08_45%,_transparent_70%)] blur-2xl transition-opacity duration-300"
        />
      )}

      {/* Ambient background glow */}
      <motion.div
        aria-hidden
        style={reduce ? undefined : { x: glowX, y: glowY }}
        className="pointer-events-none absolute left-[-10%] top-1/3 h-[420px] w-[620px] rounded-full bg-[hsl(var(--ember))]/25 blur-[140px] sm:h-[520px] sm:w-[780px]"
      />
      <div aria-hidden className="grain pointer-events-none absolute inset-0 opacity-70" />

      {/* progressive blur wash at the foot of the hero, softening the
          handoff into the page background below */}
      <ProgressiveBlur
        className="pointer-events-none absolute bottom-0 left-0 h-[35%] w-full"
        blurIntensity={6}
        direction="bottom"
      />

      {/* floating pill navbar */}
      <SiteNav floating />

      {/* headline + supporting copy + CTA */}
      <motion.div
        initial={reduce ? undefined : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full px-[clamp(1.25rem,6vw,6rem)] pb-[clamp(2.5rem,8vh,5rem)] sm:pb-0 text-left flex flex-col items-start justify-start"
      >
        <h1 className="max-w-3xl text-balance font-display text-4xl font-bold leading-[1.05] text-white sm:text-6xl lg:text-7xl text-left">
          <TextEffect per="char" preset="fade" speedSegment={0.015}>
            Goa has beaches.
          </TextEffect>
          <br />
          <span className="text-ember">
            <TextEffect per="char" preset="fade" delay={0.5} speedSegment={0.015}>
              Now Wayzyy too.
            </TextEffect>
          </span>
        </h1>
        <p className="mt-5 max-w-md text-pretty text-base text-white/85 sm:text-lg text-left">
          Honest pricing for travelers. A flat-fee deal for hosts. No
          commissions, no surprises — just real homes and real nights.
        </p>
        <div className="mt-7 flex flex-wrap items-center justify-start gap-3">
          <Button asChild variant="cta" size="pill-lg">
            <a href="#waitlist">Get early access</a>
          </Button>
          {/* Same shape/padding/press-feedback as the site-wide outline CTA,
              recolored for contrast against the video — the hero sits on
              moving footage, not the paper/ink surface the token colors
              assume. */}
          <Button
            asChild
            variant="cta-outline"
            size="pill-lg"
            className="border-white/40 bg-white/10 text-white hover:bg-white/20"
          >
            <a href="/host">List your place</a>
          </Button>
        </div>
      </motion.div>
    </section>
  );
}
