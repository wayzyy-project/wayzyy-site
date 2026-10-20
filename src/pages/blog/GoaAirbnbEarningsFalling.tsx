import { BlogLayout } from "@/components/BlogLayout";
import { blogPosts } from "@/lib/blogPosts";
import { Link } from "react-router-dom";

const post = blogPosts.find((p) => p.slug === "why-goa-airbnb-earnings-are-falling")!;

const faqs = [
  {
    q: "Are Airbnb earnings in Goa going down?",
    a: "For many hosts, yes. AirDNA data reported by Mint in August 2026 shows Airbnb revenue in Goa down 7-14% as listings across Indian cities grew 21-72% year on year. More villas are competing for roughly the same guests, so nightly rates and occupancy are under pressure.",
  },
  {
    q: "How much does Airbnb take from hosts in India now?",
    a: "Most hosts are now on Airbnb's single 15.5% host fee, deducted from every payout. To keep the same payout as before, a host has to raise prices by about 18.3%, which makes the listing look more expensive in search.",
  },
  {
    q: "Is a monthly rental better than Airbnb in Goa?",
    a: "Sometimes. A guaranteed monthly booking avoids vacancy, cleaning between guests and per-booking commission. A slightly lower monthly figure can beat a higher theoretical nightly income once those costs are counted, especially in the monsoon.",
  },
  {
    q: "How can Goa hosts keep more of each booking?",
    a: "Price for the season rather than one year-round rate, offer weekly and monthly discounts, register with Goa Tourism so you can list everywhere, and add a lower-commission channel next to Airbnb so not every booking loses 15.5%.",
  },
];

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
};

export default function GoaAirbnbEarningsFalling() {
  return (
    <BlogLayout
      title={post.title}
      description={post.description}
      metaTitle={post.metaTitle}
      metaDescription={post.metaDescription}
      heroImage={post.heroImage}
      heroImageAlt="Illustration of a house key for hosts beside a beach umbrella for guests"
      publishedDate={post.publishedDate}
      slug={post.slug}
      extraJsonLd={faqJsonLd}
    >
      <div className="space-y-6">
        <p>
          In 2024, actress and entrepreneur Parul Gulati said on a podcast that her new two-bedroom villa in Goa would earn around
          ₹40,000 a night on Airbnb. In August 2026 she went back on the same podcast and said the real number was closer to ₹11,000.
          "Reality hit me," she said, "because back then there weren't so many villas, so many luxury villas."
        </p>
        <p>
          Her story went viral because it is not unusual. Plenty of Goa hosts bought or converted a property on the strength of
          2022's post-Covid boom and are now earning a fraction of what they planned. This guide looks at why it's happening, using
          the numbers that are public, and what hosts can actually do about it.
        </p>

        <h2 className="font-display text-2xl text-foreground mt-8">What the Numbers Say</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>Supply is up sharply.</strong> AirDNA data cited by Mint shows Airbnb listings in Indian cities grew between 21% and 72%
            year on year to June 2026.
          </li>
          <li>
            <strong>Goa revenue is down.</strong> The same data shows host revenue falling 7-14% in Goa, Jaipur, Udaipur, Varanasi and Jodhpur.
          </li>
          <li>
            <strong>Yields look like normal rentals.</strong> Gulati told Mint she bought her Nerul villa for ₹3.1 crore in 2021 and earns about
            ₹15-16 lakh a year, which Mint puts at a 3.3% yield. Long-term rentals in India typically yield 2-4%.
          </li>
          <li>
            <strong>Demand is still growing.</strong> Airbnb says Indian travellers' bookings rose 60% year on year in Q2 2026. The problem isn't
            fewer guests; it's more villas competing for each one.
          </li>
        </ul>

        <h2 className="font-display text-2xl text-foreground mt-8">Why Goa Hosts Are Earning Less</h2>
        <h3 className="font-display text-xl text-foreground">1. Too many similar villas</h3>
        <p>
          Two- and three-bedroom pool villas in Assagao, Siolim, Anjuna and Nerul look alike in search results. When guests can't tell them
          apart, they pick on price, and every host ends up cutting rates.
        </p>
        <h3 className="font-display text-xl text-foreground">2. Seasonality nobody planned for</h3>
        <p>
          Goa earns most of its money between November and February. A projection based on a December night rate, multiplied by 365, is
          the most common mistake, and it's exactly the one Gulati described: "I did not understand an off-season or a peak season very well."
        </p>
        <h3 className="font-display text-xl text-foreground">3. The 15.5% fee</h3>
        <p>
          Most Indian hosts have now moved to Airbnb's single 15.5% host fee. A ₹11,000 night pays out ₹9,295. To take home the same
          amount as before, hosts must raise prices about 18.3%, which pushes the villa into a pricier bracket in search just when
          competition is strongest. Our <Link to="/earnings-calculator">payout calculator</Link> shows the exact numbers for your rate.
        </p>
        <h3 className="font-display text-xl text-foreground">4. Costs that don't fall with the rate</h3>
        <p>
          Cleaning, laundry, electricity, pool maintenance, staff, GST and the registration fee stay the same whether the night sold for
          ₹40,000 or ₹11,000. A lower rate hits the margin much harder than the headline suggests.
        </p>

        <h2 className="font-display text-2xl text-foreground mt-8">What Hosts Can Actually Do</h2>
        <ol className="list-decimal pl-6 space-y-3">
          <li>
            <strong>Price by season, not by hope.</strong> Set separate rates for peak (mid-December to New Year), high season (November to
            March), shoulder months and the monsoon. Raise weekends and festival dates, and let the quiet months go cheaper.
          </li>
          <li>
            <strong>Sell longer stays.</strong> Mint quotes a Goa host specialist saying ₹1.2 lakh guaranteed for a month can beat a
            theoretical ₹1.5 lakh from nightly bookings once vacancy, cleaning and commission are counted. Weekly and monthly discounts, plus
            a good desk and WiFi, open up the workation market (see our <Link to="/goa/stays/workation">Goa workation stays</Link>).
          </li>
          <li>
            <strong>Stand out on something specific.</strong> Sleeps 10 with a pool, pet-friendly, a real workspace, walk to the beach. Pick
            the one thing your villa does best and make it the first photo and the first line of the listing.
          </li>
          <li>
            <strong>Register properly.</strong> A Goa Tourism registration (₹1,000 a year for most homestays) lets you list on every platform
            and builds guest trust. Our <Link to="/blog/goa-airbnb-registration-rules">registration guide</Link> walks through it.
          </li>
          <li>
            <strong>Don't send every booking through a 15.5% channel.</strong> Keep Airbnb for reach, but add direct bookings from repeat guests
            and a lower-commission platform so a share of your nights keeps more of the rate.
          </li>
        </ol>

        <h2 className="font-display text-2xl text-foreground mt-8">What That Fee Difference Is Worth</h2>
        <p>
          Take a villa earning ₹15 lakh a year in bookings, roughly Gulati's figure. At 15.5%, Airbnb's fees come to about ₹2.3 lakh a year.
          On Wayzyy, hosts buy a prepaid credit pack instead of paying commission, which works out to about 2% at that volume, or roughly
          ₹30,000. Even if only half your bookings came through a lower-fee channel, that's around ₹1 lakh a year back in your pocket.
        </p>
        <p>
          (We're Wayzyy, so we're biased. Run your own numbers in the <Link to="/earnings-calculator">calculator</Link>, and see{" "}
          <Link to="/blog/how-much-can-you-earn-vacation-rental-goa">what Goa vacation rentals really earn</Link> for a full profit breakdown.)
        </p>

        <h2 className="font-display text-2xl text-foreground mt-8">The Bottom Line</h2>
        <p>
          Goa isn't a bad place to host. Guests are still coming, in larger numbers than ever. But the easy years, when any pool villa filled
          itself at a premium, are over. The hosts doing well now price for the season, sell longer stays, stand out on one thing, and don't
          hand 15.5% of every booking to a single platform.
        </p>
        <p>
          If you host in Goa and want to try a lower-fee channel, you can <Link to="/host">list your property on Wayzyy</Link>. It's free to
          start and you keep 100% of your nightly rate.
        </p>

        <h2 className="font-display text-2xl text-foreground mt-12 mb-6">Frequently Asked Questions</h2>
        {faqs.map((f) => (
          <div key={f.q} className="mb-6">
            <h3 className="font-display text-lg text-foreground">{f.q}</h3>
            <p>{f.a}</p>
          </div>
        ))}

        <p className="text-sm text-muted-foreground">
          Sources: Mint, "More Airbnb homes, less money? Why Indian hosts are losing their rental premium" (26 Aug 2026); Times of India and
          Moneycontrol coverage of Parul Gulati's podcast appearance (Aug 2026); Airbnb's "Simplifying Airbnb service fees" page (updated 13 Oct 2026).
        </p>
      </div>
    </BlogLayout>
  );
}
