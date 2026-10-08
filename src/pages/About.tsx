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
              live in Goa. We are hosts ourselves, and we built the platform we wished we had: one where hosts keep
              what they earn and guests see the full price before they book.
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

          <section className="space-y-5" aria-labelledby="start-heading">
            <h2 id="start-heading" className="font-display text-3xl text-foreground border-b border-border/60 pb-3">
              How we started
            </h2>
            <p>
              We are hosts ourselves, so we know what it takes to run a property. There is the lease, the maintenance, the caretaker&apos;s pay and a dozen smaller things that never show up in a listing. On top of all that, a platform takes its cut of every booking.
            </p>
            <p>
              So we did our homework. We read through Reddit threads, and we talked to people who have been hosting for eight to ten years. They watched the BNB space grow in India, and they watched it change as it moved from a mostly Western crowd to an Indian one. We heard about Goa and Udaipur, about Delhi NCR, and about the way travel to the northeast is growing.
            </p>
            <p>
              The same things kept coming up.
            </p>
            <ul className="space-y-3 list-disc pl-6 marker:text-ember">
              <li>Many people still do not know what a BNB is, or do not think of it as a real choice.</li>
              <li>Newer travellers often assume a BNB is an expensive way to travel with less hospitality than a hotel. Today the quality, the service and the price are often just as good, and people have not been told.</li>
              <li>The commission keeps hurting hosts as they add more properties.</li>
              <li>Marketing has to be top-notch now, and small hosts, especially people running studio apartments, struggle with it.</li>
            </ul>
            <p>
              We also saw one question come up again and again in WhatsApp and Facebook groups of hosts:
            </p>
            <blockquote className="border-l-2 border-ember pl-5 py-1 text-xl sm:text-2xl font-display text-foreground">
              &ldquo;What if someone builds an Indian version of Airbnb?&rdquo;
            </blockquote>
            <p>
              In our view, that is a sign that hosts want more choice, and that the biggest platform has been slow to change its policies for India. That question is where Wayzyy comes from.
            </p>
          </section>

          <section className="space-y-5" aria-labelledby="category-heading">
            <h2 id="category-heading" className="font-display text-3xl text-foreground border-b border-border/60 pb-3">
              Category first, then the brand
            </h2>
            <p>
              The BNB market in India is big, but it is not growing as fast as it should. Every millennial and every Gen Z traveller should know what a BNB is, and many still do not. We think this is where Airbnb fell short in India.
            </p>
            <p>
              So our idea has always been to market the category first and the brand second. Every reel, every post and every partnership we do is aimed at Gen Z and millennials, and made to feel relatable.
            </p>
            <p>
              And we do not only mean premium villas with swimming pools. Wayzyy is just as much for the studio apartment that someone manages near a college. That is where we want to grow.
            </p>
          </section>

          <section className="space-y-5" aria-labelledby="model-heading">
            <h2 id="model-heading" className="font-display text-3xl text-foreground border-b border-border/60 pb-3">
              Why we do not mark up bookings
            </h2>
            <p>
              Most platforms work like a shopkeeper. Buy something for 10 rupees, sell it for 12, and keep the difference. That is a fine way to run a shop. We think it is a hard way to run a hosting business, because the markup keeps growing as a host grows.
            </p>
            <p>
              We follow a simpler idea. We want every host to make money, and we want to give them ways to make more. A host buys a simple prepaid recharge pack instead of paying a cut on every booking, and keeps 100% of the nightly rate. Guests pay a flat 7% service fee, and they see it before they book. Nothing else is stacked on top.
            </p>
            <p>
              That also takes away one headache for hosts who already have leases, maintenance and caretaker fees to manage.
            </p>
          </section>

          <section className="space-y-5" aria-labelledby="different-heading">
            <h2 id="different-heading" className="font-display text-3xl text-foreground border-b border-border/60 pb-3">
              What else we do about the problems
            </h2>
            <ul className="space-y-3 list-disc pl-6 marker:text-ember">
              <li><strong>Verification.</strong> Wayzyy uses Aadhaar through DigiLocker to verify hosts and guests, so people know who they are dealing with.</li>
              <li><strong>Fairer disputes.</strong> Evidence first, then a human review, then a resolution.</li>
              <li><strong>Easy to switch.</strong> Hosts can import an existing listing instead of starting from scratch.</li>
            </ul>
          </section>

          <section className="space-y-5" aria-labelledby="hosts-heading">
            <h2 id="hosts-heading" className="font-display text-3xl text-foreground border-b border-border/60 pb-3">
              How we find hosts
            </h2>
            <p>
              We meet hosts in person and run onboarding calls, because we want the right people on the platform, not just the most people. A lot of hosts also reach us through word of mouth and our social channels. More than 50 Goa hosts joined in their first month with us, without paid advertising.
            </p>
            <p>
              Founding hosts start with credits, and listing import means switching takes minutes.
            </p>
          </section>

          <section className="space-y-5" aria-labelledby="guests-heading">
            <h2 id="guests-heading" className="font-display text-3xl text-foreground border-b border-border/60 pb-3">
              How we find guests
            </h2>
            <p>
              Our first guests come from Geek Room, the developer community Akshay founded. It has more than 100,000 members and college chapters across India, and it runs hackathons and meetups where people travel in groups. We promote Wayzyy at those events.
            </p>
            <p>
              We also work with partner companies on offsites and event travel, and we plan residency programs for tech and startup teams, with Wayzyy as their stay partner. And we make short videos that explain BNBs to everyday travellers, because that is how we reach Gen Z and millennials.
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
