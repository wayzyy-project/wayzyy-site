import { motion } from "framer-motion";
import { Reveal } from "./Reveal";

function BoldText({ children }: { children: string }) {
  const parts = children.split(/(\*\*[^*]+\*\*)/g);
  return (
    <>
      {parts.map((part, i) =>
        part.startsWith("**") && part.endsWith("**") ? (
          <strong key={i} className="text-foreground font-semibold">
            {part.slice(2, -2)}
          </strong>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
}

const complaints = [
  {
    handle: "u/cookieguggleman",
    subreddit: "r/AirbnbHosts",
    age: "1y ago",
    title: "LOTS of host discontent with Airbnb, seems like a breaking point",
    body: "I am seeing so much discontent with hosts and AIRBNB these days. On several Reddit groups, Facebook groups, etc. I'm seeing people **put their STRs up for sale** in my area. It feels like AIRBNB is reaching a **breaking point**, and the **industry is ripe for disruption**. What are your thoughts? I would love an alternative, but VRBO stinks. Anyone on any other sites besides Booking and VRBO where they're getting traction?",
  },
  {
    handle: "u/GoodGuyGoing",
    subreddit: "r/airbnb_hosts",
    age: "2mo ago",
    title: "Airbnb — An Unreliable Partner",
    body: "We had a **4.97 rating from 50 reviews**, then in short succession we got a couple of guests that had problems with the stairs leading to the villa. We got a few **1 and 2 star ratings** and wham!, we got **suspended. Just like that**, thrown off the site. My commitment to Airbnb is no longer the same — I will hence forward charge **$10–20 more on Airbnb** than we do on Booking.com.",
  },
  {
    handle: "u/Soggy-Maintenance",
    subreddit: "r/airbnb_hosts",
    age: "2y ago",
    title: "The 2 big ways Airbnb is failing its users",
    body: "For me, the 2 big ways that Airbnb is failing is **oversaturation and unhappy users**. My last stay was approximately **$8K and we had no AC** — spent the first week being promised repair people would stop by (no-shows). Two of the places we rented had obvious **insect issues** we were forced to deal with ourselves. **Airbnb has virtually lost my business.** I've never had an issue with a hotel. Nor do I pay a cleaning fee and then have a hotel make me **change and wash my own linens** before I leave.",
  },
];

export function TestimonialsSection() {
  return (
    <section id="why-omero" className="relative scroll-smooth-anchor overflow-hidden py-28 sm:py-40">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,hsl(var(--ember)/0.12),transparent_65%)]"
      />
      <div className="container relative">
        <Reveal>
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs uppercase tracking-[0.25em] text-muted-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-ember" />
            Why Omero
          </div>
        </Reveal>

        <Reveal delay={0.05}>
          <h2 className="max-w-4xl font-display text-4xl leading-[1.04] text-foreground sm:text-6xl text-balance">
            This all{" "}
            <span className="italic text-ember">had to stop.</span>
          </h2>
        </Reveal>

        <Reveal delay={0.08}>
          <p className="mt-5 max-w-2xl text-pretty text-base text-muted-foreground sm:text-lg">
            Hosts leaving in droves. Travelers overpaying for substandard stays. Platforms that don't pick sides — until they pick the wrong one. Here's what the community has been saying.
          </p>
        </Reveal>

        {/* scrollable complaint cards */}
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {complaints.map((c, i) => (
            <Reveal key={c.title} delay={0.06 * i}>
              <motion.div
                whileHover={{ y: -4 }}
                transition={{ type: "spring", stiffness: 300, damping: 22 }}
                className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card p-6 sm:p-7"
              >
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-ember/30 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                {/* header */}
                <div className="mb-4 flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="font-medium text-ember">{c.subreddit}</span>
                  <span>·</span>
                  <span>{c.handle}</span>
                  <span>·</span>
                  <span>{c.age}</span>
                </div>
                <h3 className="mb-3 font-display text-lg text-foreground leading-snug">
                  {c.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  <BoldText>{c.body}</BoldText>
                </p>
              </motion.div>
            </Reveal>
          ))}
        </div>

        {/* mission statement */}
        <Reveal delay={0.12}>
          <div className="mt-14 rounded-2xl border border-ember/30 bg-ember/5 p-6 sm:p-10">
            <p className="font-display text-2xl leading-snug text-foreground sm:text-4xl text-balance">
              This is what we're building against.
            </p>
            <p className="mt-4 max-w-3xl text-pretty text-base text-muted-foreground sm:text-lg">
              Omero is built around one idea: a platform that takes strict measures against bad actors on all sides — so hosts can run legitimate businesses, travelers can book with real confidence, and a community worth belonging to actually exists.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
