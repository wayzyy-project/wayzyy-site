import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { CinematicHero } from "@/components/CinematicHero";

/**
 * Standalone route for the cinematic scroll sequence. The actual
 * scene/stage/slider logic lives in `CinematicHero` (also used as the
 * homepage hero in src/pages/Index.tsx) so it isn't duplicated between the
 * two places it's rendered — this page just wraps it with a simple
 * back-to-home link and a closing CTA.
 */
export function ExperienceGoa() {
  return (
    <main className="bg-ink">
      <BackLink />
      <CinematicHero renderNav={false} />
      <ClosingCta />
    </main>
  );
}

function BackLink() {
  return (
    <Link
      to="/"
      className="fixed left-4 top-4 z-50 flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-black/30 text-white backdrop-blur-md transition-colors hover:bg-black/50 sm:left-6 sm:top-6"
      aria-label="Back to Wayzyy home"
    >
      <ArrowLeft className="h-5 w-5" />
    </Link>
  );
}

function ClosingCta() {
  return (
    <section className="bg-ink px-6 py-20 text-center sm:py-28">
      <p className="text-pretty text-base text-white/70 sm:text-lg">
        That's the version of Goa we actually built Wayzyy for.
      </p>
      <Link
        to="/"
        className="mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-ember px-6 py-3 text-sm font-semibold text-white transition-transform active:scale-[0.97]"
      >
        Browse real stays
      </Link>
    </section>
  );
}

export default ExperienceGoa;
