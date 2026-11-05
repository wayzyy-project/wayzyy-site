import { SEO } from "@/components/SEO";
import { SiteFooter } from "@/components/SiteFooter";
import { Link } from "react-router-dom";
import { ArrowLeft, Mail } from "lucide-react";

const roles = [
  {
    id: "gtm",
    title: "Go-to-market (growth)",
    blurb:
      "You will help more hosts list and more guests book on Wayzyy, starting in Goa. This is a hands-on role close to the founders, not a desk job.",
    does: [
      "Find and onboard Goa hosts through calls, visits and word of mouth.",
      "Run partnerships with communities, colleges and companies that travel in groups, such as offsites and hackathons.",
      "Turn guest and host conversations into content, offers and landing pages that bring in bookings.",
      "Track what is working each week (listings added, enquiries, bookings) and drop what is not.",
    ],
    fit: [
      "You have grown something from zero, even a small community, newsletter, page or side project.",
      "You are comfortable talking to strangers on the phone and on WhatsApp.",
      "You write clearly and like numbers more than opinions.",
      "You know how people in India travel and book stays.",
    ],
  },
  {
    id: "video",
    title: "Video editor (content repurposing)",
    blurb:
      "You will take the content we already make and turn it into short videos that explain BNBs to Gen Z and millennials, and make them want to book one.",
    does: [
      "Cut founder talks, host stories, property walkthroughs and our blog guides into Reels, Shorts and other short clips.",
      "Reuse one piece of content in many formats, with strong hooks, captions and pacing.",
      "Make the videos feel relatable and quick to watch, not like an ad.",
      "Keep a steady weekly output and learn from which videos get watched and shared.",
    ],
    fit: [
      "You have a portfolio of short-form videos you edited yourself.",
      "You are fast with a phone-first workflow and tools like CapCut, Premiere or DaVinci.",
      "You notice what holds attention in the first three seconds.",
      "You are curious about travel and Goa.",
    ],
  },
];

const steps = [
  "Email us the role you want, a short note on why, and a link to your work (a portfolio, reels or something you grew).",
  "A founder reads it and replies, whether the answer is yes or not yet.",
  "A short call, then a small paid or practical task related to the role.",
  "We decide quickly and tell you what happens next.",
];

export default function Careers() {
  return (
    <SEO
      title="Careers at Wayzyy: go-to-market and video editor roles"
      description="Wayzyy is hiring for go-to-market (growth) and short-form video editors to help us grow the Goa stays platform. See the roles and how to apply."
      path="/careers"
    >
      <div className="min-h-screen bg-background text-foreground">
        <div className="border-b border-border bg-background/80 backdrop-blur sticky top-0 z-40">
          <div className="container flex items-center justify-between gap-4 py-4">
            <div className="flex items-center gap-4">
              <Link
                to="/"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                Home
              </Link>
              <span className="text-border">·</span>
              <img src="/favicon.svg" alt="Wayzyy" className="h-9 w-9 rounded-full object-cover" />
            </div>
          </div>
        </div>

        <div className="border-b border-border bg-card/40 py-16 sm:py-24">
          <div className="container max-w-3xl space-y-4">
            <p className="text-xs uppercase tracking-widest text-muted-foreground">Careers</p>
            <h1 className="font-display text-4xl sm:text-6xl text-foreground leading-tight">
              Help us grow <span className="text-ember font-semibold">Wayzyy</span>
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl font-light leading-relaxed">
              We are a small team and we are hiring for two roles right now: go-to-market (growth) and video editors who
              repurpose our content.
            </p>
          </div>
        </div>

        <div className="container max-w-3xl py-12 sm:py-16 space-y-16 text-base sm:text-lg text-foreground/90 leading-relaxed">
          <section className="space-y-5" aria-labelledby="what-heading">
            <h2 id="what-heading" className="font-display text-3xl text-foreground border-b border-border/60 pb-3">
              What we are building
            </h2>
            <p>
              Wayzyy is a short-term rental marketplace for India, live in Goa. Hosts keep 100% of their nightly rate and
              pay for a simple prepaid recharge pack instead of a commission on every booking. Guests pay a flat 7%
              service fee, and they see the full price before they book.
            </p>
            <p>
              Hosts and guests are verified with Aadhaar through DigiLocker, disputes are decided on evidence, and a
              host can import an existing listing in minutes. Read more on our{" "}
              <Link to="/about/team" className="text-ember hover:underline">about page</Link>.
            </p>
            <p>
              Our approach is to market the category first and the brand second. Many people in India still do not know
              what a BNB is, so most of our work is explaining it in a way Gen Z and millennials find relatable.
            </p>
          </section>

          <section className="space-y-8" aria-labelledby="roles-heading">
            <h2 id="roles-heading" className="font-display text-3xl text-foreground border-b border-border/60 pb-3">
              Open roles
            </h2>
            {roles.map((r) => (
              <div key={r.id} id={r.id} className="rounded-2xl border border-border bg-card/40 p-6 sm:p-8 space-y-5">
                <h3 className="font-display text-2xl text-foreground">{r.title}</h3>
                <p className="text-muted-foreground">{r.blurb}</p>
                <div className="space-y-2">
                  <p className="text-sm uppercase tracking-widest text-ember">What you will do</p>
                  <ul className="space-y-2 list-disc pl-6 marker:text-ember">
                    {r.does.map((d) => (
                      <li key={d}>{d}</li>
                    ))}
                  </ul>
                </div>
                <div className="space-y-2">
                  <p className="text-sm uppercase tracking-widest text-ember">What we look for</p>
                  <ul className="space-y-2 list-disc pl-6 marker:text-ember">
                    {r.fit.map((f) => (
                      <li key={f}>{f}</li>
                    ))}
                  </ul>
                </div>
                <a
                  href={`mailto:hello@wayzyy.com?subject=${encodeURIComponent(`Application: ${r.title}`)}`}
                  className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-5 py-3 text-sm font-medium text-foreground hover:border-ember transition-colors"
                >
                  <Mail className="h-4 w-4 text-ember" /> Apply for this role
                </a>
              </div>
            ))}
            <p className="text-muted-foreground">
              Pay, location and how many hours a week are discussed on the first call, so we can fit the role to you.
            </p>
          </section>

          <section className="space-y-5" aria-labelledby="apply-heading">
            <h2 id="apply-heading" className="font-display text-3xl text-foreground border-b border-border/60 pb-3">
              How to apply
            </h2>
            <ol className="space-y-3 list-decimal pl-6 marker:text-ember">
              {steps.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ol>
            <a
              href="mailto:hello@wayzyy.com?subject=Careers%20at%20Wayzyy"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card/40 px-5 py-3 text-sm font-medium text-foreground hover:border-ember transition-colors"
            >
              <Mail className="h-4 w-4 text-ember" /> hello@wayzyy.com
            </a>
          </section>
        </div>

        <SiteFooter />
      </div>
    </SEO>
  );
}
