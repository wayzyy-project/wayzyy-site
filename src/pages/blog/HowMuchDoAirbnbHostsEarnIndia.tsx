import { BlogLayout } from "@/components/BlogLayout";
import { blogPosts } from "@/lib/blogPosts";
import { HelpCircle } from "lucide-react";
import { Link } from "react-router-dom";

const post = blogPosts.find((p) => p.slug === "how-much-do-airbnb-hosts-earn-india")!;

const ext = "text-ember hover:underline";

const faqs = [
  {
    q: "How much does an Airbnb host earn in India?",
    a: "The average active listing in India earned about ₹4.9 lakh in 2025, according to Airbtics, at an average nightly rate of ₹3,330 and 40% occupancy. That's gross booking revenue, before platform fees, costs and tax, and it varies hugely by city and property.",
  },
  {
    q: "Which Indian city earns the most on Airbnb?",
    a: "Among major markets in Airbtics' 2025 data, Mumbai led with about ₹9.4 lakh average annual revenue and 58% occupancy, followed by Goa at about ₹6.8 lakh and 47% occupancy. Bengaluru averaged about ₹3.8 lakh.",
  },
  {
    q: "Is Airbnb profitable in India?",
    a: "It can be, but the averages hide a wide spread. Platform fees, cleaning, utilities, maintenance, GST above ₹20 lakh turnover and income tax all come out of gross revenue, and many listings sit empty for most of the year. A realistic plan uses local occupancy, not the best month.",
  },
  {
    q: "How much do Airbnb hosts in Manali or Shimla earn?",
    a: "AirROI's data for the 12 months to October 2026 puts average annual revenue at about ₹3.2 lakh in Manali and ₹3.5 lakh in Shimla, with occupancy in the low-to-mid 20s and average nightly rates of ₹6,000 to ₹8,000.",
  },
  {
    q: "How much does Airbnb take from hosts in India?",
    a: "Airbnb's fee structure has shifted towards a single host-only fee of around 15.5% on many listings, where the host pays the whole service fee. On Wayzyy, hosts pay a flat subscription and no per-booking commission.",
  },
];

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
};

const cities = [
  { market: "India average (2025)", revenue: "₹4.88 lakh", adr: "₹3,330", occ: "40%", src: "Airbtics" },
  { market: "Mumbai (2025)", revenue: "₹9.45 lakh", adr: "₹4,423", occ: "58%", src: "Airbtics" },
  { market: "Goa (2025)", revenue: "₹6.80 lakh", adr: "₹3,922", occ: "47%", src: "Airbtics" },
  { market: "Bengaluru (2025)", revenue: "₹3.81 lakh", adr: "₹2,086", occ: "49%", src: "Airbtics" },
  { market: "Shimla (to Oct 2026)", revenue: "₹3.52 lakh", adr: "₹7,965", occ: "22%", src: "AirROI" },
  { market: "Manali (to Oct 2026)", revenue: "₹3.16 lakh", adr: "₹6,305", occ: "24%", src: "AirROI" },
  { market: "Dharamshala (to Oct 2026)", revenue: "₹2.99 lakh", adr: "₹5,345", occ: "27%", src: "AirROI" },
  { market: "Kasauli (to Oct 2026)", revenue: "₹8.53 lakh", adr: "₹20,300", occ: "18%", src: "AirROI" },
];

export default function HowMuchDoAirbnbHostsEarnIndia() {
  return (
    <BlogLayout
      title={post.title}
      description={post.description}
      metaTitle={post.metaTitle}
      metaDescription={post.metaDescription}
      heroImage={post.heroImage}
      heroImageAlt="Illustration of a bar chart rising beside a house key and a stack of rupee coins"
      publishedDate={post.publishedDate}
      slug={post.slug}
      extraJsonLd={faqJsonLd}
    >
      <div className="space-y-6">
        <div className="rounded-2xl border border-ember/30 bg-ember/5 p-6">
          <p className="text-sm text-muted-foreground">
            <strong className="text-foreground">Quick answer:</strong> the average active Airbnb listing in India earned about{" "}
            <strong>₹4.9 lakh in 2025</strong> in gross booking revenue, at an average nightly rate of ₹3,330 and 40%
            occupancy, according to short-term rental analytics firm Airbtics. Mumbai (about ₹9.4 lakh) and Goa (about ₹6.8
            lakh) were the strongest major markets. That's before platform fees, running costs and tax, which can take a large
            share, so the figure that matters is net earnings in your area.
          </p>
        </div>

        <p>
          "How much do Airbnb hosts earn in India?" is the first question almost every would-be host asks, and the answers
          online range from wildly optimistic to useless. This page puts the best available third-party data in one place,
          explains what the numbers do and don't include, and shows how to estimate your own earnings.
        </p>

        <h2 className="font-display text-2xl text-foreground mt-8">Average Airbnb earnings by city</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border border-border rounded-xl overflow-hidden">
            <thead className="bg-card">
              <tr>
                <th className="text-left p-3 border-b border-border">Market</th>
                <th className="text-left p-3 border-b border-border">Avg. annual revenue</th>
                <th className="text-left p-3 border-b border-border">Avg. nightly rate</th>
                <th className="text-left p-3 border-b border-border">Occupancy</th>
                <th className="text-left p-3 border-b border-border">Source</th>
              </tr>
            </thead>
            <tbody>
              {cities.map((c) => (
                <tr key={c.market}>
                  <td className="p-3 border-b border-border font-medium">{c.market}</td>
                  <td className="p-3 border-b border-border">{c.revenue}</td>
                  <td className="p-3 border-b border-border">{c.adr}</td>
                  <td className="p-3 border-b border-border">{c.occ}</td>
                  <td className="p-3 border-b border-border text-muted-foreground">{c.src}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-sm text-muted-foreground">
          Airbtics figures are for calendar year 2025 (published January 2026). AirROI figures are for the 12 months to October
          2026. Both are estimates of gross booking revenue per active listing, built from listing calendars, and both firms
          use their own models, so treat them as a guide rather than exact numbers.
        </p>

        <h2 className="font-display text-2xl text-foreground mt-8">What the numbers tell you</h2>
        <ul className="list-disc pl-6 space-y-3">
          <li>
            <strong>Occupancy beats price in cities.</strong> Mumbai earns the most not because it's the most expensive per
            night, but because listings there are booked 58% of the time, against 40% nationally.
          </li>
          <li>
            <strong>Hill stations are high-rate, low-occupancy.</strong> Shimla and Manali charge ₹6,000 to ₹8,000 a night but
            are booked less than a quarter of the year, so annual revenue ends up below the national average.
          </li>
          <li>
            <strong>Luxury pockets are outliers.</strong> Kasauli's average of over ₹8.5 lakh comes from nightly rates above
            ₹20,000 and a small number of listings. A typical flat won't earn that.
          </li>
          <li>
            <strong>Supply is growing fast.</strong> Airbtics recorded a 49% jump in listings across the 20 markets it tracks in
            2025, while average revenue per listing slipped about 3%. More hosts are sharing the same guests. India's holiday
            rental stock passed 200,000 units in FY2026, up 26%.
          </li>
        </ul>

        <h2 className="font-display text-2xl text-foreground mt-8">From revenue to what you actually keep</h2>
        <p>Gross revenue isn't income. Before anything reaches you, these come out:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>Platform fees.</strong> Airbnb has moved many listings to a host-only fee of about 15.5% of each booking.
            Our breakdown of{" "}
            <Link to="/blog/airbnb-pricing-update-15-percent-fee-lowest-price" className={ext}>
              Airbnb's 15.5% fee
            </Link>{" "}
            shows what that does to your payout.
          </li>
          <li>
            <strong>Running costs.</strong> Cleaning, laundry, utilities, internet, repairs, toiletries and furnishing
            replacement. See{" "}
            <Link to="/blog/hidden-costs-of-running-an-airbnb" className={ext}>
              the hidden costs of running an Airbnb
            </Link>
            .
          </li>
          <li>
            <strong>Tax.</strong> Rental income is taxable, platforms deduct 0.1% TDS, and GST applies once turnover crosses
            ₹20 lakh a year.{" "}
            <Link to="/blog/gst-for-airbnb-hosts-india" className={ext}>
              GST for Airbnb hosts
            </Link>
            .
          </li>
          <li>
            <strong>Compliance costs.</strong> State registration fees, fire NOCs and renewals, which vary by state.{" "}
            <Link to="/blog/homestay-registration-rules-by-state-india" className={ext}>
              Rules by state
            </Link>
            .
          </li>
        </ul>

        <p className="italic text-muted-foreground border-l-2 border-ember pl-4">
          <span className="block not-italic text-xs uppercase tracking-wide text-ember mb-1">A simple way to estimate</span>
          Nightly rate × nights booked in a year = gross revenue. Subtract platform fees, then your monthly costs × 12. Use your
          area's real occupancy, not the peak month.
        </p>

        <h2 className="font-display text-2xl text-foreground mt-8">How to earn more from the same home</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>Price by season and weekday,</strong> not one flat rate. December in Goa and May in the hills can carry the
            year.
          </li>
          <li>
            <strong>Fill the off-season</strong> with longer workation stays at a discount rather than leaving the calendar
            empty.
          </li>
          <li>
            <strong>Cut the fee you pay.</strong> On{" "}
            <Link to="/what-is-wayzyy" className={ext}>
              Wayzyy
            </Link>
            , hosts pay a flat subscription with no per-booking commission, so a busy month doesn't mean a bigger platform cut.
          </li>
          <li>
            <strong>Get registered.</strong> In states like Goa, unregistered listings can be removed, which costs far more
            than the registration fee.
          </li>
        </ul>
        <p>
          For a Goa-specific earnings breakdown, see{" "}
          <Link to="/blog/how-much-can-you-earn-vacation-rental-goa" className={ext}>
            how much you can earn from a vacation rental in Goa
          </Link>{" "}
          and{" "}
          <Link to="/blog/why-goa-airbnb-earnings-are-falling" className={ext}>
            why Goa Airbnb earnings are falling
          </Link>
          .
        </p>
        <p className="text-sm text-muted-foreground">
          Figures are third-party estimates as cited and aren't a forecast of what any listing will earn. This isn't financial
          or tax advice.
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
