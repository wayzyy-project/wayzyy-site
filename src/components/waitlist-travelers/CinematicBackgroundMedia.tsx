// PLACEHOLDER ASSET - swap for the real background when it's ready.
//
// The traveler waitlist page (/waitlist/travelers) wants a cinematic,
// warm amber/twilight cliff-and-clouds background (the user was given a
// generation prompt for this - video or static). That asset doesn't exist
// yet, so this component stands in with `hero-sky.webp`, the same
// twilight sky/cliff still already used by the homepage's CinematicHero.
//
// This is intentionally the *only* place that decision lives: swapping to
// a real <video> later (once the asset exists) is a one-line change
// inside this file - replace the <img> below with a <video autoPlay muted
// loop playsInline> pointed at the new asset - nothing in
// WaitlistTravelers.tsx needs to change.
//
// Resolved via `new URL(..., import.meta.url)` rather than a static
// import, matching CinematicHero/HeroStepOut: this page is prerendered by
// scripts/ssr-pages.tsx under plain Node/tsx, which can't parse a raw
// binary asset as a module. Vite still hashes/optimizes it normally at
// build time.
const heroSky = new URL(
  "../../assets/goa-cinematic/hero-sky.webp",
  import.meta.url,
).href;

export function CinematicBackgroundMedia() {
  return (
    <>
      <img
        src={heroSky}
        alt=""
        aria-hidden
        className="fixed inset-0 w-full h-full object-cover z-0"
      />
      {/* Darkening wash so white headline/footer text stays legible over
          whatever the background happens to be - same technique
          CinematicHero uses on its sky/foreground layers. */}
      <div aria-hidden className="fixed inset-0 z-0 bg-black/40" />
    </>
  );
}
