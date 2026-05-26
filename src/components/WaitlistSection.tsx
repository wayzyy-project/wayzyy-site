import { Reveal } from "./Reveal";
import { Waitlist } from "./Waitlist";

export function WaitlistSection() {
  return (
    <section
      id="waitlist"
      className="relative scroll-smooth-anchor overflow-hidden border-t border-border py-28 sm:py-36"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_0%,hsl(var(--ember)/0.18),transparent_60%),radial-gradient(circle_at_80%_100%,hsl(var(--ember)/0.10),transparent_55%)]"
      />
      <div className="container relative">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_1fr] lg:items-center">
          <div>
            <Reveal>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1 text-xs uppercase tracking-[0.25em] text-muted-foreground">
                <span className="h-1.5 w-1.5 rounded-full bg-ember" />
                Coming soon
              </div>
            </Reveal>
            <Reveal delay={0.05}>
              <h2 className="font-display text-4xl leading-[1.04] text-foreground sm:text-6xl text-balance">
                Be the first to walk through{" "}
                <span className="italic text-ember">the door.</span>
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-5 max-w-xl text-pretty text-base text-muted-foreground sm:text-lg">
                Two lists. One for travelers who want stays without the small
                print. One for hosts ready for a fair subscription model.
                Join early — referral discounts go live for the first wave.
              </p>
            </Reveal>
          </div>
          <Reveal delay={0.15}>
            <div className="rounded-2xl border border-border bg-background/80 p-6 backdrop-blur sm:p-8">
              <Waitlist />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
