import { BlogLayout } from "@/components/BlogLayout";
import { blogPosts } from "@/lib/blogPosts";
import { HelpCircle } from "lucide-react";
import { Link } from "react-router-dom";

const post = blogPosts.find((p) => p.slug === "hotels-in-goa")!;

const ext = "text-ember hover:underline";

const faqs = [
  {
    q: "Is it better to book a hotel or a villa in Goa?",
    a: "It depends on the trip. A hotel suits a one-night stopover, a solo or business trip, or anyone who wants a 24-hour front desk, room service and a resort pool. A villa, apartment or BnB usually works out better for families, groups and stays of three nights or more, because you get more space and a kitchen, and the cost is shared.",
  },
  {
    q: "What are the best areas for hotels in Goa?",
    a: "For nightlife and the busiest beaches: Calangute and Baga. For a calmer North Goa beach: Candolim. For culture, food and Goa's old Latin quarter: Panjim (Panaji). For quiet beaches: South Goa, around Palolem, Patnem and Agonda. Each of these areas also has villas and homestays.",
  },
  {
    q: "Are homestays and BnBs in Goa safe to book?",
    a: "Most are, but fake listings and requests for offline deposits are a real risk, especially in peak season. Book a stay that shows its Goa Tourism registration number, whose host is ID-verified, and where you pay through the platform rather than directly to the host.",
  },
  {
    q: "Does Wayzyy list hotels in Goa?",
    a: "No. Wayzyy lists villas, apartments, homestays and BnBs in Goa. Every host is ID-verified through DigiLocker, and every property goes through geotagged verification checks before it goes live.",
  },
  {
    q: "How much does Wayzyy charge guests?",
    a: "A 7% guest service fee, already included in the price you see. On Airbnb the guest fee is around 15.5%. Hosts on Wayzyy pay a flat subscription instead of a commission on each booking, so they don't need to inflate their nightly rate to cover one.",
  },
  {
    q: "What happens if my Goa stay doesn't match the listing?",
    a: "On Wayzyy, you can file a listing-mismatch claim within two hours of check-in with unedited, geotagged photos. If the host can't be reached for an hour at check-in, you get an automatic 100% refund, platform fees included, plus a ₹500 credit.",
  },
  {
    q: "Is GST charged on hotel and villa stays in Goa?",
    a: "Yes. Since 22 September 2025, stays up to ₹7,500 per unit per night are taxed at 5%, and stays above that at 18%. The same slabs apply to hotel rooms and to a whole villa rented as one unit.",
  },
];

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
};

const areas = [
  { area: "Calangute & Baga", for: "Nightlife, water sports, the busiest beaches", note: "Hotels everywhere, but crowded and noisy in season. A villa a short walk inland is quieter.", link: "/blog/baga-goa-beach-guide", label: "Baga guide" },
  { area: "Candolim", for: "A calmer North Goa beach close to the action", note: "Easy walk to the beach from many apartments and BnBs. Runs down to Sinquerim and Fort Aguada.", link: "/blog/candolim-goa-beach-guide", label: "Candolim guide" },
  { area: "Anjuna & Vagator", for: "Cafés, clubs, sunset spots", note: "Lots of boutique stays and villas. Late-night music in peak season.", link: "/blog/anjuna-goa-beach-guide", label: "Anjuna guide" },
  { area: "Panjim (Panaji)", for: "Culture, food, Fontainhas, festivals", note: "Goa's capital: more city hotels, plus heritage homestays in the old quarter.", link: "/blog/fontainhas-goa-guide", label: "Fontainhas guide" },
  { area: "South Goa (Palolem, Patnem, Agonda)", for: "Quiet beaches, families, longer stays", note: "Fewer big hotels, more beach huts, homestays and villas.", link: "/blog/where-to-stay-in-south-goa", label: "South Goa stays" },
];

export default function HotelsInGoa() {
  return (
    <BlogLayout
      title={post.title}
      description={post.description}
      metaTitle={post.metaTitle}
      metaDescription={post.metaDescription}
      heroImage={post.heroImage}
      heroImageAlt="Split illustration comparing a grey hotel block with two separate room key cards and a reception bell, against a colourful Goan villa with a verified tile, four mugs on the porch and a single house key"
      publishedDate={post.publishedDate}
      slug={post.slug}
      extraJsonLd={faqJsonLd}
    >
      <div className="space-y-6">
        <div className="rounded-2xl border border-ember/30 bg-ember/5 p-6">
          <p className="text-sm text-muted-foreground">
            <strong className="text-foreground">Quick answer:</strong> if you're searching for hotels in Goa, a hotel is the
            right call for a one-night stay, a solo or work trip, or if you want a 24-hour front desk and a resort pool. For
            families, groups and anyone staying three nights or more, a verified villa, apartment or BnB usually gives you more
            space and a kitchen for the same budget. The catch with BnBs has always been trust. That's the gap{" "}
            <Link to="/goa-stays" className={ext}>
              Wayzyy's verified Goa stays
            </Link>{" "}
            are built to close: ID-verified hosts, properties checked before they go live, and a 7% guest fee that's included
            in the price you see.
          </p>
        </div>

        <p>
          "Hotels in Goa" is usually the first thing people search when they plan a trip, and it returns thousands of options, from
          beach resorts in Candolim to budget rooms behind Baga. Most people typing it aren't really set on a hotel, though.
          They want a clean, safe place near the right beach at a fair price. Sometimes that's a hotel. Often it's a villa,
          an apartment or a BnB run by someone who lives in Goa.
        </p>
        <p>
          We're a Goa stays platform, so we're not neutral on this. But we'd rather you book the right thing than the wrong
          thing on our site, so this guide is honest about when a hotel genuinely wins.
        </p>

        <h2 className="font-display text-2xl text-foreground mt-8">When a hotel in Goa is the better choice</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>One night, or a late arrival.</strong> If you're landing at midnight and leaving in the morning, a hotel
            with a 24-hour front desk is simpler.
          </li>
          <li>
            <strong>You want resort facilities.</strong> Big pools, spas, in-house restaurants and kids' clubs are what
            resorts do best.
          </li>
          <li>
            <strong>Solo or work travel.</strong> A single room, daily housekeeping and someone at reception around the clock
            are worth paying for.
          </li>
          <li>
            <strong>You don't want to think about anything.</strong> Hotels are predictable. That's their real selling point.
          </li>
        </ul>

        <h2 className="font-display text-2xl text-foreground mt-8">When a villa, apartment or BnB wins</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>Families and groups.</strong> Four people usually need two hotel rooms. A two-bedroom apartment or villa
            gives you two bedrooms, a living room and a kitchen under one booking.
          </li>
          <li>
            <strong>Three nights or more.</strong> A kitchen, a fridge and a washing machine change a longer trip. So does not
            eating every meal out.
          </li>
          <li>
            <strong>Location.</strong> Some of the best spots, a short walk from a quiet beach or inside an old Goan
            neighbourhood, have no hotels at all, only homes and homestays.
          </li>
          <li>
            <strong>A local host.</strong> The person who lives in Goa knows which shack is good this season, where to park and
            which road floods.
          </li>
        </ul>
        <p>
          On our own September trip to Candolim, we stayed in a 1BHK BnB about 300 metres from the beach. It slept four,
          which would have meant two hotel rooms, and we walked to the sand and to dinner without needing a scooter. Our{" "}
          <Link to="/blog/candolim-goa-beach-guide" className={ext}>
            Candolim guide
          </Link>{" "}
          has the rest of that trip. For a fuller side-by-side, see{" "}
          <Link to="/blog/goa-hotel-vs-villa-vs-homestay" className={ext}>
            hotel vs villa vs homestay in Goa
          </Link>
          .
        </p>

        <h2 className="font-display text-2xl text-foreground mt-8">The real problem with BnBs: trust</h2>
        <p>
          The reason many people stick to hotels isn't price or space. It's the fear of a bad listing: photos that don't
          match, a "2 minutes from the beach" that turns out to be a 20-minute drive, or a host who asks for a deposit by UPI
          and then stops answering. Those risks are real in Goa, especially in peak season, and they're the problems Wayzyy
          is built around.
        </p>

        <p className="italic text-muted-foreground border-l-2 border-ember pl-4">
          <span className="block not-italic text-xs uppercase tracking-wide text-ember mb-1">The hotel promise, for homes</span>
          A hotel's real product is predictability. A verified stay should give you the same certainty, with more space and a
          real Goan home.
        </p>

        <h2 className="font-display text-2xl text-foreground mt-8">How Wayzyy makes a BnB as safe as a hotel</h2>
        <ul className="list-disc pl-6 space-y-3">
          <li>
            <strong>Every host is ID-verified</strong> through DigiLocker, the government's official ID system. You know who
            you're booking with.
          </li>
          <li>
            <strong>Every property is checked before it goes live,</strong> with geotagged verification of the property itself.
            The <strong>Wayzyy Verified</strong> badge also checks the Goa Tourism registration number, so you're booking a
            legal, registered stay. (Not sure why that matters? See{" "}
            <Link to="/blog/is-airbnb-legal-in-goa" className={ext}>
              is Airbnb legal in Goa
            </Link>
            .)
          </li>
          <li>
            <strong>Your money stays with the platform.</strong> Payments go through Razorpay, and funds are held in escrow
            before check-in. You never pay a host directly.
          </li>
          <li>
            <strong>If the place doesn't match the listing,</strong> you can file a claim within two hours of check-in with
            geotagged photos.
          </li>
          <li>
            <strong>If the host can't be reached for an hour at check-in,</strong> you get an automatic 100% refund, platform
            fees included, plus a ₹500 credit.
          </li>
          <li>
            <strong>Reviews are only from guests who actually stayed,</strong> and they're double-blind, so hosts can't
            retaliate against an honest one.
          </li>
        </ul>
        <p>
          Our guide to{" "}
          <Link to="/blog/how-to-book-verified-stay-in-goa" className={ext}>
            booking a verified stay in Goa
          </Link>{" "}
          walks through these checks in detail, including how to spot a fake listing on any platform.
        </p>

        <h2 className="font-display text-2xl text-foreground mt-8">What you pay</h2>
        <p>
          Hotels and homes in Goa pay the same GST: <strong>5%</strong> for stays up to ₹7,500 per unit per night, and{" "}
          <strong>18%</strong> above that, since September 2025. Where the price really differs is the platform fee.
        </p>
        <p>
          On Wayzyy, guests pay a <strong>7% service fee</strong>, and it's already folded into the price you see while
          browsing, so the number on the listing is the number you pay. Airbnb's guest fee runs around 15.5%. Hosts on
          Wayzyy pay a flat subscription instead of a commission on every booking, so they don't need to raise their nightly
          rate to cover a cut. We explain the fee maths in{" "}
          <Link to="/blog/airbnb-pricing-update-15-percent-fee-lowest-price" className={ext}>
            Airbnb's 15.5% fee update
          </Link>
          .
        </p>

        <h2 className="font-display text-2xl text-foreground mt-8">Where to stay in Goa: hotels and homes by area</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border border-border rounded-xl overflow-hidden">
            <thead className="bg-card">
              <tr>
                <th className="text-left p-3 border-b border-border">Area</th>
                <th className="text-left p-3 border-b border-border">Best for</th>
                <th className="text-left p-3 border-b border-border">Hotels vs homes</th>
              </tr>
            </thead>
            <tbody>
              {areas.map((a) => (
                <tr key={a.area}>
                  <td className="p-3 border-b border-border font-medium">
                    <Link to={a.link} className={ext}>
                      {a.area}
                    </Link>
                  </td>
                  <td className="p-3 border-b border-border">{a.for}</td>
                  <td className="p-3 border-b border-border text-muted-foreground">{a.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p>
          Still choosing between the north and the south? Our{" "}
          <Link to="/blog/north-goa-vs-south-goa-guide" className={ext}>
            North Goa vs South Goa
          </Link>{" "}
          guide compares them, and{" "}
          <Link to="/blog/where-to-stay-in-goa-2026" className={ext}>
            where to stay in Goa
          </Link>{" "}
          goes area by area.
        </p>

        <h2 className="font-display text-2xl text-foreground mt-8">Booking tips, whatever you choose</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>Check for a Goa Tourism registration number</strong> on any home or villa listing. No number is a red
            flag.
          </li>
          <li>
            <strong>Never pay a deposit outside the platform,</strong> whether it's a hotel or a home.
          </li>
          <li>
            <strong>Ask "how far on foot?"</strong> rather than "how far from the beach?". In December, a five-minute drive can
            take half an hour. Our{" "}
            <Link to="/blog/goa-december-new-year-guide-2026" className={ext}>
              December guide
            </Link>{" "}
            explains why.
          </li>
          <li>
            <strong>Book Christmas and New Year early.</strong> Good villas for the last week of December go months ahead.
          </li>
        </ul>
        <p>
          If a villa or homestay fits your trip better than a hotel,{" "}
          <Link to="/goa-stays" className={ext}>
            browse verified Goa stays on Wayzyy
          </Link>
          , with real photos and prices and no login needed. If a hotel fits better, book the hotel. Either way, you'll now
          know what you're choosing.
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
