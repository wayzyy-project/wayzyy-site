import { BlogLayout } from "@/components/BlogLayout";
import { blogPosts } from "@/lib/blogPosts";
import { Link } from "react-router-dom";

const post = blogPosts.find((p) => p.slug === "goa-private-pool-villas-for-8-people")!;
const linkClass = "text-ember hover:underline";

const faqs = [
  {
    q: "How many bedrooms does a group of eight need in Goa?",
    a: "Four proper bedrooms is the most comfortable arrangement for eight adults. A three-bedroom villa can work only when the listing clearly identifies real extra beds and everyone agrees to the sleeping plan before booking.",
  },
  {
    q: "How do I know whether a Goa villa pool is actually private?",
    a: "Look for an explicit statement that the pool is for the booked villa only. Ask whether another unit, owner or common area shares it, and confirm pool timings and maintenance access in writing.",
  },
  {
    q: "What should eight guests compare besides the nightly price?",
    a: "Compare the final payable total for the same dates and guest count, including cleaning, guest fees and GST. Also check extra-guest charges, deposits, electricity limits and whether cook or housekeeping services cost extra.",
  },
  {
    q: "Which Goa areas work well for a group villa?",
    a: "Anjuna and Vagator suit nightlife trips, Siolim and Assagao suit groups that want quieter surroundings near North Goa, and South Goa suits beach-first trips that value calm over club access.",
  },
];

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map(({ q, a }) => ({
    "@type": "Question",
    name: q,
    acceptedAnswer: { "@type": "Answer", text: a },
  })),
};

export default function GoaPrivatePoolVillasForEight() {
  return (
    <BlogLayout
      post={post}
      heroImageAlt="Private pool and villa in Goa suitable for a group holiday"
      extraJsonLd={faqJsonLd}
    >
      <div className="space-y-6">
        <div className="rounded-2xl border border-ember/30 bg-ember/5 p-6">
          <p className="text-sm text-muted-foreground">
            <strong className="text-foreground">Quick answer:</strong> for eight adults, start with four real bedrooms, a pool that is explicitly private, enough bathrooms, and a final price calculated for all eight guests. Do not book from the headline nightly rate alone. Confirm extra-guest rules, deposits, quiet hours and the exact location before paying.
          </p>
        </div>

        <p>
          A search for “Goa villas with a private pool for 8 people” looks specific, but listings often use the word <em>eight</em> in very different ways. One may have four double bedrooms. Another may have three bedrooms plus two floor mattresses. Both can technically advertise capacity for eight, but they are not the same trip.
        </p>
        <p>
          This guide gives you a decision checklist you can use on any platform. When you are ready to compare live options, start with{" "}
          <Link to="/goa/stays/pools" className={linkClass}>Goa stays with pools</Link>{" "}
          and{" "}
          <Link to="/goa/stays/for-groups" className={linkClass}>stays for groups</Link>.
        </p>

        <h2 className="font-display text-2xl text-foreground mt-8">The six checks that matter most</h2>
        <div className="overflow-x-auto border border-border rounded-xl">
          <table className="w-full text-sm text-left">
            <thead className="bg-card">
              <tr>
                <th className="p-3 border-b border-border">Check</th>
                <th className="p-3 border-b border-border">What to confirm</th>
                <th className="p-3 border-b border-border">Common surprise</th>
              </tr>
            </thead>
            <tbody>
              <tr><td className="p-3 border-b border-border font-medium">Sleeping plan</td><td className="p-3 border-b border-border">Bed type and room for every guest</td><td className="p-3 border-b border-border">“Sleeps 8” includes sofas or floor mattresses</td></tr>
              <tr><td className="p-3 border-b border-border font-medium">Pool access</td><td className="p-3 border-b border-border">Exclusive or shared, timings and maintenance</td><td className="p-3 border-b border-border">The pool belongs to the whole complex</td></tr>
              <tr><td className="p-3 border-b border-border font-medium">Final price</td><td className="p-3 border-b border-border">Total for the same dates and eight guests</td><td className="p-3 border-b border-border">Fees appear only at checkout</td></tr>
              <tr><td className="p-3 border-b border-border font-medium">Bathrooms</td><td className="p-3 border-b border-border">Count, hot water and ensuite access</td><td className="p-3 border-b border-border">Eight adults share one practical bathroom</td></tr>
              <tr><td className="p-3 border-b border-border font-medium">Location</td><td className="p-3 border-b border-border">Real travel time at the hour you will move</td><td className="p-3 border-b border-border">“Near beach” means a long drive in traffic</td></tr>
              <tr><td className="p-3 font-medium">House rules</td><td className="p-3">Visitors, music, parking and quiet hours</td><td className="p-3">The trip plan conflicts with the property rules</td></tr>
            </tbody>
          </table>
        </div>

        <h2 className="font-display text-2xl text-foreground mt-8">1. Translate capacity into an actual sleeping plan</h2>
        <p>
          For eight adults, four bedrooms with double beds is the simplest arrangement. If a three-bedroom property accepts eight, ask where guests seven and eight sleep, whether those are permanent beds, and whether linen is included. Families with children may be happy with sofa beds; four couples usually will not.
        </p>
        <p>
          Also check bathroom access. Three or four bathrooms can make a group trip much easier than one bathroom attached to a bedroom and one common bathroom for everyone else.
        </p>

        <h2 className="font-display text-2xl text-foreground mt-8">2. Confirm what “private pool” means</h2>
        <p>
          A private pool should be reserved for your booked villa. Do not infer that from photographs. Ask whether residents of another unit, the owner or common-area guests can use it. Confirm pool hours, depth, child-safety arrangements and whether maintenance staff enter the pool area during the stay.
        </p>

        <h2 className="font-display text-2xl text-foreground mt-8">3. Compare the total for eight guests</h2>
        <p>
          Put the same dates and all eight guests into every platform before comparing. A lower nightly rate can become a higher final amount after an extra-guest charge, cleaning fee, platform fee and GST. Our{" "}
          <Link to="/blog/goa-villa-booking-fees-explained" className={linkClass}>Goa villa booking-fee guide</Link>{" "}
          shows exactly which lines to compare.
        </p>

        <h2 className="font-display text-2xl text-foreground mt-8">4. Pick the area for the trip you will actually take</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Anjuna and Vagator:</strong> useful for nightlife, cafés and sunset spots. Expect traffic and music in busy periods.</li>
          <li><strong>Siolim and Assagao:</strong> quieter village bases with access to several North Goa beaches. Read our{" "}
            <Link to="/blog/siolim-goa-villas-guide" className={linkClass}>Siolim villa guide</Link>.</li>
          <li><strong>Morjim, Ashwem and Mandrem:</strong> better for a beach-first trip, with longer travel to the busiest nightlife.</li>
          <li><strong>South Goa:</strong> calmer and better suited to groups that want beaches and downtime rather than a North Goa club itinerary.</li>
        </ul>
        <p>
          If the group has not chosen a side yet, use our{" "}
          <Link to="/blog/north-goa-vs-south-goa-guide" className={linkClass}>North Goa versus South Goa comparison</Link>.
        </p>

        <h2 className="font-display text-2xl text-foreground mt-8">5. Put services and rules in writing</h2>
        <p>
          Ask whether housekeeping is daily, whether a cook is included or separately paid, and who buys groceries. Confirm parking for every vehicle, backup power, Wi-Fi, music rules and visitor limits. If a birthday dinner or small gathering is part of the trip, disclose it before booking; “eight staying” and “twenty visiting” are different risks for a host.
        </p>

        <h2 className="font-display text-2xl text-foreground mt-8">6. Check the listing, host and payment path</h2>
        <p>
          Use recent photographs, a complete address area, a verified host identity and a payment flow that keeps the booking on-platform. Avoid moving to an unknown payment account just because someone offers a last-minute discount. Our guide to{" "}
          <Link to="/blog/how-to-book-verified-stay-in-goa" className={linkClass}>booking a verified Goa stay</Link>{" "}
          provides a fuller safety checklist.
        </p>

        <h2 className="font-display text-2xl text-foreground mt-8">Questions to send before paying</h2>
        <ol className="list-decimal pl-6 space-y-2">
          <li>Can you list the bed type and bedroom for each of eight guests?</li>
          <li>Is the pool exclusive to this villa for the full stay?</li>
          <li>What is the final amount for our dates and eight guests, including every mandatory fee and tax?</li>
          <li>Are there separate charges for cleaning, cook, housekeeping, electricity or extra guests?</li>
          <li>What are the visitor, music, parking and quiet-hour rules?</li>
          <li>What deposit is collected, when is it returned, and what evidence is used for deductions?</li>
        </ol>

        <h2 className="font-display text-2xl text-foreground mt-8">Frequently asked questions</h2>
        <div className="space-y-4">
          {faqs.map(({ q, a }) => (
            <div key={q} className="rounded-xl border border-border p-5">
              <h3 className="font-semibold text-foreground">{q}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{a}</p>
            </div>
          ))}
        </div>
      </div>
    </BlogLayout>
  );
}
