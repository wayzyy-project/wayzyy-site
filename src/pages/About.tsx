import { SEO } from "@/components/SEO";
import { SiteFooter } from "@/components/SiteFooter";
import { Link } from "react-router-dom";
import { ArrowLeft, Linkedin, Mail } from "lucide-react";
import aboutSchema from "@/data/aboutSchema.json";


const founders = [
  {
    name: "Anant Sharma",
    role: "Founder & CEO",
    photo: "/team/anant-sharma.webp",
    alt: "Anant Sharma, founder and CEO of Wayzyy",
    bio: "Anant has a B.Tech from GGSIPU and an application-security background. He found and disclosed a trust gap in how Airbnb verifies people, and that is where Wayzyy started.",
    linkedin: null as string | null,
  },
  {
    name: "Akshay Kumar Sharma",
    role: "Co-founder & CTO",
    photo: "/team/akshay-kumar-sharma.webp",
    alt: "Akshay Kumar Sharma, co-founder and CTO of Wayzyy",
    bio: "Akshay founded Geek Room, a community of more than 100,000 developers. He has worked at two US startups and with Mastercard and Groq, and has run one of India's largest hackathons. He builds the product.",
    linkedin: "https://www.linkedin.com/in/akshay-kumar-sharma-37aa55256/",
  },
];

export default function About() {
  return (
    <SEO
      title="Who is behind Wayzyy: the team and why we built it"
      description="Wayzyy is built by Anant Sharma and Akshay Kumar Sharma. Why we started, how we make money, and how we find hosts and guests in Goa."
      path="/about"
      jsonLd={aboutSchema}
    >
      <div className="min-h-screen bg-background text-foreground">
        {/* Navigation Bar */}
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

        {/* Hero */}
        <div className="border-b border-border bg-card/40 py-16 sm:py-24">
          <div className="container max-w-3xl space-y-4">
            <p className="text-xs uppercase tracking-widest text-muted-foreground">About</p>
            <h1 className="font-display text-4xl sm:text-6xl text-foreground leading-tight">
              Who is behind <span className="text-ember font-semibold">Wayzyy</span>
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl font-light leading-relaxed">
              Wayzyy is a short-term rental marketplace for India, built by Wayzyy Technologies Private Limited. We are
              live in Goa. Every host and guest is verified, hosts pay no per-booking commission, and guests see the
              full price before they book.
            </p>
          </div>
        </div>

        <div className="container max-w-3xl py-12 sm:py-16 space-y-16 text-base sm:text-lg text-foreground/90 leading-relaxed">
          {/* Founders */}
          <section className="space-y-8" aria-labelledby="founders-heading">
            <h2 id="founders-heading" className="font-display text-3xl text-foreground border-b border-border/60 pb-3">
              The founders
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {founders.map((f) => (
                <div key={f.name} className="space-y-4">
                  <img
                    src={f.photo}
                    alt={f.alt}
                    width={480}
                    height={600}
                    loading="lazy"
                    decoding="async"
                    className="w-full max-w-xs sm:max-w-none aspect-[4/5] object-cover rounded-2xl border border-border"
                  />
                  <div className="space-y-1">
                    <h3 className="font-display text-2xl text-foreground">{f.name}</h3>
                    <p className="text-sm uppercase tracking-widest text-ember">{f.role}</p>
                  </div>
                  <p className="text-base text-muted-foreground">{f.bio}</p>
                  {f.linkedin && (
                    <a
                      href={f.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm text-foreground hover:text-ember transition-colors"
                    >
                      <Linkedin className="h-4 w-4 text-ember" /> LinkedIn
                    </a>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Why */}
          <section className="space-y-5" aria-labelledby="why-heading">
            <h2 id="why-heading" className="font-display text-3xl text-foreground border-b border-border/60 pb-3">
              Why we built it
            </h2>
            <p>
              Indian hosts rent out their homes on platforms that were not built for India. We kept hearing the same four
              things.
            </p>
            <ul className="space-y-3 list-disc pl-6 marker:text-ember">
              <li>
                Foreign platforms commonly keep somewhere between 15% and 18% of every booking, and the cut grows as a
                host gets better at hosting.
              </li>
              <li>Identities are mostly self-declared, so neither side really knows who they are dealing with.</li>
              <li>
                In a dispute, a staged photo can beat real proof, and refunds tend to default to the guest.
              </li>
              <li>Hosts who refuse to keep cutting their prices can lose visibility on the platform.</li>
            </ul>
            <p>
              There is also a gap on the guest side. Many travellers in India still do not think of a homestay as an
              alternative to a hotel. Part of our job is to change that.
            </p>
          </section>

          {/* What we do differently */}
          <section className="space-y-5" aria-labelledby="different-heading">
            <h2 id="different-heading" className="font-display text-3xl text-foreground border-b border-border/60 pb-3">
              What we do differently
            </h2>
            <ul className="space-y-3 list-disc pl-6 marker:text-ember">
              <li>
                <strong>Verified from the start.</strong> Hosts and guests are checked through DigiLocker-based Aadhaar
                verification.
              </li>
              <li>
                <strong>No per-booking commission for hosts.</strong> A host buys a prepaid credit pack and keeps 100% of
                the nightly rate.
              </li>
              <li>
                <strong>A price guests can see.</strong> Guests pay the nightly rate plus a flat 7% service fee, shown
                before they book.
              </li>
              <li>
                <strong>A fairer dispute process.</strong> Evidence first, then a human review, then a resolution.
              </li>
              <li>
                <strong>Easy to switch.</strong> Hosts can import an existing listing instead of starting from scratch.
              </li>
            </ul>
          </section>

          {/* Money */}
          <section className="space-y-5" aria-labelledby="money-heading">
            <h2 id="money-heading" className="font-display text-3xl text-foreground border-b border-border/60 pb-3">
              How Wayzyy makes money
            </h2>
            <p>
              Two ways. Guests pay a flat 7% service fee on top of the nightly rate, and hosts buy prepaid credit packs.
              We do not take a commission out of the host&apos;s nightly rate. Both numbers are shown upfront.
            </p>
          </section>

          {/* Demand */}
          <section className="space-y-5" aria-labelledby="demand-heading">
            <h2 id="demand-heading" className="font-display text-3xl text-foreground border-b border-border/60 pb-3">
              How we find guests
            </h2>
            <p>
              Our first guests come from Geek Room, the developer community Akshay founded. It has more than 100,000
              members and college chapters across India, and it runs hackathons and meetups where people travel in
              groups. We promote Wayzyy at those events.
            </p>
            <p>
              We also work with partner companies on offsites and event travel, and we plan residency programs for tech
              and startup teams, with Wayzyy as their stay partner. Beyond that, we make short videos that explain
              homestays to everyday travellers, and we meet people offline in cities.
            </p>
          </section>

          {/* Supply */}
          <section className="space-y-5" aria-labelledby="supply-heading">
            <h2 id="supply-heading" className="font-display text-3xl text-foreground border-b border-border/60 pb-3">
              How we find hosts
            </h2>
            <p>
              We meet hosts in person. More than 50 Goa hosts joined in their first month with us, without any paid
              advertising. Our founding hosts start with credits, and listing import means moving over takes minutes.
            </p>
          </section>

          {/* Now and next */}
          <section className="space-y-5" aria-labelledby="next-heading">
            <h2 id="next-heading" className="font-display text-3xl text-foreground border-b border-border/60 pb-3">
              Where we are, and what is next
            </h2>
            <p>
              Wayzyy is live in Goa. Next we are working on Varanasi and Ayodhya, where pilgrimage travel is huge, and we
              have waitlist interest from Rajasthan, Mumbai, Pune and Odisha.
            </p>
            <p>
              We won Best Problem Statement at the Grand Prix Hackathon at Paytm&apos;s office, and were a top 5 nominee
              at the Moonshot awards.
            </p>
          </section>

          {/* Contact */}
          <section className="space-y-5" aria-labelledby="contact-heading">
            <h2 id="contact-heading" className="font-display text-3xl text-foreground border-b border-border/60 pb-3">
              Talk to us
            </h2>
            <p>
              Hosts, guests, companies and press are all welcome. Write to us and a founder will reply.
            </p>
            <a
              href="mailto:hello@wayzyy.com"
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
