import { BlogLayout } from "@/components/BlogLayout";
import { blogPosts } from "@/lib/blogPosts";
import { HelpCircle } from "lucide-react";
import { Link } from "react-router-dom";

const post = blogPosts.find((p) => p.slug === "india-short-term-rental-trends-2027")!;

const ext = "text-ember hover:underline";

const faqs = [
  {
    q: "How big is India's short-term rental market?",
    a: "Booking.com's How India Travels 2026 report counts about 215,000 digitally listed holiday homes, apartments and homestays in FY26, up from 102,200 in FY23 and 26% higher than the year before. It puts alternative accommodation at about 13% of India's lodging booking value.",
  },
  {
    q: "Is the homestay market in India growing?",
    a: "Yes. Booking.com and VIDEC Consultants project alternative accommodation booking value to grow 21.2% a year through FY29. NITI Aayog estimated the homestay market at about ₹4,722 crore in 2024, with around 11% annual growth projected.",
  },
  {
    q: "Is it still worth starting an Airbnb in India in 2027?",
    a: "It can be, but competition is rising faster than demand in many markets. Airbtics recorded a 49% jump in listings across 20 Indian markets in 2025, while average revenue per listing slipped about 3%. Hosts who price dynamically, register properly and stand out on quality are doing better than those who don't.",
  },
  {
    q: "Which Indian cities are growing fastest for homestays?",
    a: "Booking.com's report found listings more than doubled between June 2025 and June 2026 in Greater Noida, Ghaziabad, Indore and Ayodhya, as growth shifts from metros and classic beach destinations to Tier-2 cities, pilgrimage centres and new leisure corridors.",
  },
  {
    q: "Are business travellers using homestays and rentals in India?",
    a: "Increasingly. Business travellers made up 19% of alternative accommodation bookings in FY26, according to Booking.com's report, projected to rise to 21% by FY27. More space and a separate workspace were the top reasons.",
  },
];

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
};

const stats = [
  { n: "215,000", l: "listed homes, apartments and homestays in FY26", s: "Booking.com, How India Travels 2026" },
  { n: "+26%", l: "growth in listed supply in FY26", s: "Booking.com" },
  { n: "21.2%", l: "projected yearly growth in booking value to FY29", s: "Booking.com" },
  { n: "+49% / −3%", l: "listings vs revenue per listing across 20 markets, 2025", s: "Airbtics" },
];

export default function IndiaShortTermRentalTrends2027() {
  return (
    <BlogLayout
      title={post.title}
      description={post.description}
      metaTitle={post.metaTitle}
      metaDescription={post.metaDescription}
      heroImage={post.heroImage}
      heroImageAlt="Illustration of a rising line chart over a row of small homes in different Indian styles, from a city flat to a hill cottage and a beach villa"
      publishedDate={post.publishedDate}
      slug={post.slug}
      extraJsonLd={faqJsonLd}
    >
      <div className="space-y-6">
        <div className="rounded-2xl border border-ember/30 bg-ember/5 p-6">
          <p className="text-sm text-muted-foreground">
            <strong className="text-foreground">India's short-term rental market in 2027,</strong> in one paragraph: supply
            has more than doubled since FY23 to about 215,000 listed homes, booking value is projected to grow about 21% a year,
            and growth is moving to Tier-2 cities and pilgrimage towns. At the same time, listings are growing faster than
            revenue per listing, states are tightening registration rules, and pricing skill is starting to separate the hosts
            who earn well from those who don't. Here are the eight trends that matter.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {stats.map((s) => (
            <div key={s.l} className="rounded-xl border border-border bg-card p-4">
              <div className="font-display text-2xl text-foreground">{s.n}</div>
              <div className="text-sm text-muted-foreground mt-1">{s.l}</div>
              <div className="text-xs text-muted-foreground/70 mt-2">{s.s}</div>
            </div>
          ))}
        </div>

        <h2 className="font-display text-2xl text-foreground mt-8">1. Supply has more than doubled in three years</h2>
        <p>
          Booking.com's <em>How India Travels 2026 – The Homes Edit</em>, produced with VIDEC Consultants, counts about{" "}
          <strong>215,000 digitally listed</strong> holiday homes, apartments and homestays in FY26, up from 102,200 in FY23.
          Supply grew 26% in FY26 alone, though the report expects that to moderate. Alternative stays now make up around 13% of
          India's lodging booking value. The government sees homes as part of the answer to a shortage of more than 2 lakh hotel
          rooms, as estimated by the Ministry of Tourism.
        </p>

        <h2 className="font-display text-2xl text-foreground mt-8">2. Demand is growing, but supply is growing faster</h2>
        <p>
          Booking value for alternative accommodation is projected to grow <strong>21.2% a year through FY29</strong>. Online
          searches for the category grew 6% between FY24 and FY25, against 2% for hotels. But in many markets, more hosts are
          now chasing the same guests. Airbtics tracked a <strong>49% jump in listings</strong> across 20 Indian markets in
          2025, while average revenue per listing slipped about 3%. The national average listing earned about ₹4.9 lakh. Our{" "}
          <Link to="/blog/how-much-do-airbnb-hosts-earn-india" className={ext}>
            earnings guide
          </Link>{" "}
          breaks that down by city.
        </p>

        <h2 className="font-display text-2xl text-foreground mt-8">3. Growth is moving beyond Goa and the metros</h2>
        <p>
          Metros and classic holiday spots still hold 46% of inventory, but the fastest growth is elsewhere. Between June 2025
          and June 2026, listings <strong>more than doubled in Greater Noida, Ghaziabad, Indore and Ayodhya</strong>, according
          to the Booking.com report. Tier-2 cities, pilgrimage centres and new weekend corridors are where new supply is going
          in 2027.
        </p>

        <h2 className="font-display text-2xl text-foreground mt-8">4. Pricing skill now decides who earns well</h2>
        <p>
          In Bengaluru, Goa, Hyderabad, Jaipur, Mumbai, Pune and Siliguri, properties that priced dynamically earned{" "}
          <strong>108% to 190% more revenue per available room</strong> than fixed-price ones. Goa had the widest gap, at
          190%. With more listings competing, a flat nightly rate all year is the easiest way to fall behind.
        </p>

        <h2 className="font-display text-2xl text-foreground mt-8">5. Business travellers are moving in</h2>
        <p>
          Business travellers made up <strong>19% of alternative accommodation bookings in FY26</strong>, projected to reach
          21% in FY27. Their reasons are practical: more space and a separate bedroom or workspace (41%), room for family or
          colleagues (40%), local experiences (39%) and better value on long stays (37%). Reliable Wi-Fi and a proper desk are
          now selling points, not extras.
        </p>

        <h2 className="font-display text-2xl text-foreground mt-8">6. Regulation is catching up, state by state</h2>
        <p>
          2026 was the busiest year yet for homestay rules. Goa made hosts show their registration numbers on listings.
          Rajasthan and Uttarakhand rewrote their schemes. Himachal barred flats and leased homes. Delhi withdrew its B&amp;B
          scheme after a deadly fire, and Mumbai approved a short-term rental licence. In 2027, expect more registration drives
          and more platforms asked to remove unregistered listings. See{" "}
          <Link to="/blog/homestay-registration-rules-by-state-india" className={ext}>
            the rules in each state
          </Link>
          .
        </p>
        <p>
          The direction may become simpler, though. NITI Aayog's homestay report found registration often took two to six
          months and that nearly half of operators relied on middlemen. It recommended a single digital portal, 30-day approvals
          with deemed approval after that, and treating homestays as residential for utility and property tax.
        </p>

        <h2 className="font-display text-2xl text-foreground mt-8">7. Trust is the product</h2>
        <p>
          Guests are choosing homes for good reasons: in Booking.com's survey, 87% said they create more meaningful memories,
          and 83% saw them as good value and suited to families and groups. But fake listings, offline deposit scams and
          mismatched photos still put many people off booking homes. Verification is becoming a selling point:
          verified hosts, registration numbers on listings and payment held until check-in. That's the bet{" "}
          <Link to="/what-is-wayzyy" className={ext}>
            Wayzyy
          </Link>{" "}
          is built on.
        </p>

        <h2 className="font-display text-2xl text-foreground mt-8">8. Fees and payments are shifting</h2>
        <p>
          Airbnb has moved many listings to a single host-paid fee of 15% to 15.5%, built into the nightly price, and
          lower-fee and subscription models are emerging as alternatives. On the payments side, PayU data cited in the
          Booking.com report shows Buy Now Pay Later and EMI rising from 6% to 15% of travel transactions in 18 months. Guests
          are spreading the cost of bigger trips. See{" "}
          <Link to="/blog/best-airbnb-alternatives-india" className={ext}>
            how the platforms compare
          </Link>
          .
        </p>

        <p className="italic text-muted-foreground border-l-2 border-ember pl-4">
          <span className="block not-italic text-xs uppercase tracking-wide text-ember mb-1">What it means for 2027</span>
          The market is still growing fast, but the easy years are over. Hosts who register, price dynamically and earn
          guests' trust will take the growth. Listings that don't will be competing on price with 215,000 others.
        </p>

        <p>
          If you're thinking of hosting in 2027, start with our{" "}
          <Link to="/blog/airbnb-hosting-india-2027-checklist" className={ext}>
            2027 hosting checklist
          </Link>
          .
        </p>
        <p className="text-sm text-muted-foreground">
          Figures are from Booking.com's How India Travels 2026 report (with VIDEC Consultants; surveys of 2,359 consumers and
          1,131 property owners and managers, June 2026), Airbtics' 2025 India market review and NITI Aayog's Rethinking
          Homestays report, as cited. Market estimates vary by source and method.
        </p>
      </div>

      <div className="border-t border-border mt-16 pt-12">
        <h3 className="font-display text-2xl text-foreground mb-6 flex items-center gap-2">
          <HelpCircle className="w-6 h-6 text-ember" />
          Frequently Asked Questions
        </h3>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <details
              key={index}
              className="group border border-border rounded-xl bg-card overflow-hidden transition-all duration-200"
            >
              <summary className="cursor-pointer list-none [&::-webkit-details-marker]:hidden w-full text-left px-6 py-4 flex items-center justify-between font-display text-foreground hover:bg-muted/50 transition-colors">
                <span>{faq.q}</span>
                <span className="text-muted-foreground font-light text-xl group-open:hidden">+</span>
                <span className="text-muted-foreground font-light text-xl hidden group-open:inline">−</span>
              </summary>
              <div className="px-6 pb-5 text-muted-foreground border-t border-border/50 pt-4 text-sm leading-relaxed">
                {faq.a}
              </div>
            </details>
          ))}
        </div>
      </div>
    </BlogLayout>
  );
}
