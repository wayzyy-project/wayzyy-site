import { BlogLayout } from "@/components/BlogLayout";
import { blogPosts } from "@/lib/blogPosts";
import { HelpCircle } from "lucide-react";
import { Link } from "react-router-dom";

const post = blogPosts.find((p) => p.slug === "best-airbnb-alternatives-india")!;

const ext = "text-ember hover:underline";

const faqs = [
  {
    q: "What is the best alternative to Airbnb in India?",
    a: "It depends on what you're booking. For premium managed villas, StayVista, SaffronStays and Lohono Stays are the main names. For the widest choice alongside hotels, MakeMyTrip, Booking.com and Agoda list homestays and apartments. For verified homes with lower guest fees, Wayzyy lists ID-verified hosts, starting in Goa.",
  },
  {
    q: "Which Airbnb alternative has the lowest fees in India?",
    a: "Fees change, so check the final price before you pay. Airbnb now charges most listings a 15% to 15.5% service fee, usually taken from the host and built into the nightly price; under its older split model, guests paid around 14%. Wayzyy charges guests 7%, included in the price shown, and hosts pay a flat subscription instead of a per-booking commission. Managed villa brands usually show one all-in price.",
  },
  {
    q: "Is MakeMyTrip good for booking homestays?",
    a: "MakeMyTrip has a large homestays and villas section, and it's convenient if you're also booking flights. Quality varies by host, so check reviews, photos and whether the property is registered with the state where that applies.",
  },
  {
    q: "Are villa brands like StayVista better than Airbnb?",
    a: "They're different. StayVista, SaffronStays and Lohono manage their homes themselves, with on-ground teams and set standards, which makes stays more predictable but usually pricier. Airbnb and other marketplaces connect you directly with individual hosts, so there's more variety in price and quality.",
  },
  {
    q: "Is Vrbo available in India?",
    a: "Vrbo lists some whole-home rentals in India, but its inventory is much smaller than in the US or Europe. Most Indian travellers use Airbnb, MakeMyTrip, Booking.com or the villa brands instead.",
  },
];

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
};

const options = [
  { name: "Wayzyy", type: "Marketplace of verified homes", best: "ID-verified hosts, lower guest fee", note: "Hosts verified via DigiLocker, properties checked before going live. 7% guest fee shown upfront. Starting in Goa, expanding state by state." },
  { name: "MakeMyTrip & Goibibo", type: "Travel super-app", best: "One app for flights, hotels and homestays", note: "Large homestays and villas section. Quality varies by host." },
  { name: "Booking.com", type: "Global marketplace", best: "Free cancellation and pay-later options", note: "Apartments, villas and homestays alongside hotels." },
  { name: "Agoda", type: "Global marketplace", best: "Deals on apartments and homes", note: "Strong across Asia, with a homes section next to hotels." },
  { name: "StayVista", type: "Managed villa brand", best: "Premium villas with on-ground staff", note: "1,200+ homes across 85+ destinations, by its own count." },
  { name: "SaffronStays", type: "Managed villa brand", best: "Luxury villas near big cities", note: "Strong in Maharashtra, expanding in North India." },
  { name: "Lohono Stays", type: "Managed villa brand (Isprava)", best: "Design-led luxury villas", note: "Goa, Alibaug, the Nilgiris and more." },
  { name: "amã Stays & Trails", type: "Branded homestays (IHCL)", best: "Heritage bungalows and boutique homes", note: "Backed by the Taj group's parent company." },
];

export default function BestAirbnbAlternativesIndia() {
  return (
    <BlogLayout
      title={post.title}
      description={post.description}
      metaTitle={post.metaTitle}
      metaDescription={post.metaDescription}
      heroImage={post.heroImage}
      heroImageAlt="Illustration of several phone screens side by side, each showing a different holiday home listing in India"
      publishedDate={post.publishedDate}
      slug={post.slug}
      extraJsonLd={faqJsonLd}
    >
      <div className="space-y-6">
        <div className="rounded-2xl border border-ember/30 bg-ember/5 p-6">
          <p className="text-sm text-muted-foreground">
            <strong className="text-foreground">Quick answer:</strong> the main Airbnb alternatives in India fall into three
            groups. <strong>Managed villa brands</strong> (StayVista, SaffronStays, Lohono Stays) run their own homes to a set
            standard. <strong>Travel marketplaces</strong> (MakeMyTrip, Booking.com, Agoda) list homes next to hotels.{" "}
            <strong>Verified-home marketplaces</strong> like Wayzyy connect you with ID-verified hosts at a lower guest fee.
            Which is best depends on whether you want predictability, choice or price.
          </p>
        </div>

        <p>
          India's holiday rental market has grown fast. Homestays and villas passed 200,000 units in FY2026, growing 26% in a
          year and faster than branded hotel rooms. Airbnb is still the name most people search, but it's far from the only
          option, and for many trips it isn't the cheapest. This guide compares the real alternatives. If you're looking for
          Goa specifically, see our{" "}
          <Link to="/blog/best-airbnb-alternatives-goa" className={ext}>
            Goa-only comparison
          </Link>
          .
        </p>
        <p>
          We should say up front: Wayzyy is one of the options below. We've tried to describe every platform fairly, including
          where others are the better choice.
        </p>

        <h2 className="font-display text-2xl text-foreground mt-8">The options at a glance</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border border-border rounded-xl overflow-hidden">
            <thead className="bg-card">
              <tr>
                <th className="text-left p-3 border-b border-border">Platform</th>
                <th className="text-left p-3 border-b border-border">Type</th>
                <th className="text-left p-3 border-b border-border">Best for</th>
                <th className="text-left p-3 border-b border-border">Worth knowing</th>
              </tr>
            </thead>
            <tbody>
              {options.map((o) => (
                <tr key={o.name}>
                  <td className="p-3 border-b border-border font-medium whitespace-nowrap">{o.name}</td>
                  <td className="p-3 border-b border-border">{o.type}</td>
                  <td className="p-3 border-b border-border">{o.best}</td>
                  <td className="p-3 border-b border-border text-muted-foreground">{o.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2 className="font-display text-2xl text-foreground mt-8">Managed villa brands</h2>
        <p>
          <strong>StayVista</strong>, <strong>SaffronStays</strong> and <strong>Lohono Stays</strong> (part of Isprava) don't
          just list homes. They manage them, with their own standards, housekeeping and on-ground teams. StayVista, founded in
          2015 with one home in Lonavala, now says it has more than 1,200 homes across 85-plus destinations. These brands are
          the closest thing to a hotel experience in a private villa, and they're usually priced accordingly. They're a good
          choice for a big group trip where you want no surprises. They're less useful for a budget stay or a simple room.
        </p>
        <p>
          <strong>amã Stays &amp; Trails</strong>, backed by the Taj group's parent IHCL, sits in a similar space with
          heritage bungalows and boutique homes.
        </p>

        <h2 className="font-display text-2xl text-foreground mt-8">Travel marketplaces</h2>
        <p>
          <strong>MakeMyTrip</strong> (and its sister app <strong>Goibibo</strong>), <strong>Booking.com</strong> and{" "}
          <strong>Agoda</strong> all list homestays, apartments and villas alongside hotels. Their strengths are breadth and
          convenience: one app for flights and stays, loyalty wallets, and on Booking.com, free-cancellation and pay-later
          options on many listings. The trade-off is that homes are a side business for them, so quality checks vary a lot from
          host to host. Read reviews closely and check for a state registration number where one is required.
        </p>

        <h2 className="font-display text-2xl text-foreground mt-8">Verified-home marketplaces: where Wayzyy fits</h2>
        <p>
          The gap between the villa brands (consistent but expensive) and the big marketplaces (cheap but uneven) is trust.
          That's the gap{" "}
          <Link to="/what-is-wayzyy" className={ext}>
            Wayzyy
          </Link>{" "}
          is built for:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>Every host is ID-verified</strong> through DigiLocker, and every property is checked before it goes live.
          </li>
          <li>
            <strong>Guests pay a 7% service fee,</strong> included in the price shown. Airbnb's service fee is 15% to 15.5% on
            most listings, usually built into the host's nightly price.
          </li>
          <li>
            <strong>Hosts pay a flat subscription, not a commission,</strong> so there's no per-booking cut to push nightly
            rates up.
          </li>
          <li>
            <strong>Payments are held until check-in,</strong> and if the host can't be reached for an hour at check-in, you
            get a full refund plus a ₹500 credit.
          </li>
        </ul>
        <p>
          We're starting in Goa and expanding across India state by state.{" "}
          <Link to="/goa-stays" className={ext}>
            Browse verified Goa stays
          </Link>
          , or read how we compare in{" "}
          <Link to="/blog/airbnb-vs-booking-vs-wayzyy" className={ext}>
            Airbnb vs Booking.com vs Wayzyy
          </Link>
          .
        </p>

        <h2 className="font-display text-2xl text-foreground mt-8">How to choose</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>Big group, special occasion, money less important:</strong> a managed villa brand.
          </li>
          <li>
            <strong>Booking flights and stay together, or want free cancellation:</strong> MakeMyTrip or Booking.com.
          </li>
          <li>
            <strong>Want a real home with a verified host at a lower fee:</strong> Wayzyy, where we operate.
          </li>
          <li>
            <strong>Whatever you pick:</strong> compare the final price including fees and GST, pay only through the platform,
            and check the host's registration where your state requires it. Our{" "}
            <Link to="/blog/homestay-registration-rules-by-state-india" className={ext}>
              state-by-state rules guide
            </Link>{" "}
            explains which states do.
          </li>
        </ul>
        <p className="text-sm text-muted-foreground">
          Platform details are based on each company's public information as of November 2026 and can change. Check current
          fees and policies before booking.
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
