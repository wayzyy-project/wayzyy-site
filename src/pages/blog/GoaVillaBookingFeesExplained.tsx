import { BlogLayout } from "@/components/BlogLayout";
import { blogPosts } from "@/lib/blogPosts";
import { Link } from "react-router-dom";

const post = blogPosts.find((p) => p.slug === "goa-villa-booking-fees-explained")!;
const linkClass = "text-ember hover:underline";

const faqs = [
  { q: "Why does a Goa villa cost more at checkout?", a: "The browse price may not include every cleaning charge, guest service fee, tax or extra-guest amount. Enter the same dates and full guest count, then compare the final payable total." },
  { q: "Is a cleaning fee the same as a platform fee?", a: "No. A cleaning fee is attached to preparing the property, while a platform fee pays for marketplace services. They should appear as separate lines when both apply." },
  { q: "Does a zero host-commission platform mean the booking has no fees?", a: "Not necessarily. Host commission and guest service fees are different. A platform can charge no percentage commission to the host while still charging guests a disclosed service fee or hosts a subscription." },
  { q: "What is the fairest way to compare two villa listings?", a: "Use identical dates, guest count and cancellation terms. Compare the final payable amount, refundable deposit rules, included services and the host payout rather than comparing only the first nightly number." },
];

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map(({ q, a }) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })),
};

export default function GoaVillaBookingFeesExplained() {
  return (
    <BlogLayout post={post} heroImageAlt="Comparison of Goa villa prices and booking fee lines" extraJsonLd={faqJsonLd}>
      <div className="space-y-6">
        <div className="rounded-2xl border border-ember/30 bg-ember/5 p-6">
          <p className="text-sm text-muted-foreground">
            <strong className="text-foreground">Quick answer:</strong> compare the final payable price for the same dates and number of guests. The nightly rate is only one line. Cleaning, extra guests, a guest service fee and GST may change the total; a refundable security deposit changes cash flow even when it is not part of the stay cost.
          </p>
        </div>

        <p>
          The same Goa villa can show different prices across platforms without the host changing the underlying stay. One marketplace may charge the host a percentage, another may add a guest fee, and another may use a flat host plan. Search results often surface the lowest visible number, so the only reliable comparison happens after you enter the same dates and full guest count.
        </p>
        <p>
          Wayzyy is one of the platforms discussed here, so this is not an independent review. The purpose of this guide is to show the lines you should check on <em>any</em> booking site, including ours.
        </p>

        <h2 className="font-display text-2xl text-foreground mt-8">The seven numbers in a villa booking</h2>
        <div className="overflow-x-auto border border-border rounded-xl">
          <table className="w-full text-sm text-left">
            <thead className="bg-card"><tr><th className="p-3 border-b border-border">Price line</th><th className="p-3 border-b border-border">What it means</th><th className="p-3 border-b border-border">What to ask</th></tr></thead>
            <tbody>
              <tr><td className="p-3 border-b border-border font-medium">Nightly base</td><td className="p-3 border-b border-border">Host-set accommodation price</td><td className="p-3 border-b border-border">Does it change by date or guest count?</td></tr>
              <tr><td className="p-3 border-b border-border font-medium">Extra guests</td><td className="p-3 border-b border-border">Charge above the included occupancy</td><td className="p-3 border-b border-border">How many guests are included?</td></tr>
              <tr><td className="p-3 border-b border-border font-medium">Cleaning</td><td className="p-3 border-b border-border">Per-stay property preparation</td><td className="p-3 border-b border-border">Is it mandatory and charged once?</td></tr>
              <tr><td className="p-3 border-b border-border font-medium">Guest service fee</td><td className="p-3 border-b border-border">Marketplace charge to the traveller</td><td className="p-3 border-b border-border">Is it already included while browsing?</td></tr>
              <tr><td className="p-3 border-b border-border font-medium">Host commission</td><td className="p-3 border-b border-border">Amount deducted from host payout</td><td className="p-3 border-b border-border">Has the host raised the rate to recover it?</td></tr>
              <tr><td className="p-3 border-b border-border font-medium">GST</td><td className="p-3 border-b border-border">Tax calculated under applicable rules</td><td className="p-3 border-b border-border">Is tax itemised in the final total?</td></tr>
              <tr><td className="p-3 font-medium">Security deposit</td><td className="p-3">Refundable amount held against damage</td><td className="p-3">Who holds it and when is it released?</td></tr>
            </tbody>
          </table>
        </div>

        <h2 className="font-display text-2xl text-foreground mt-8">Host commission and guest fees are not the same</h2>
        <p>
          A host commission is deducted from the host's payout. A guest service fee is added to, or included in, what the traveller pays. A platform can have one, both or neither. A claim such as “zero commission” therefore needs one more question: zero commission for whom, and what other fixed or percentage charges remain?
        </p>
        <p>
          Wayzyy does not take a percentage commission from a host on each booking. Hosts use a flat prepaid-credit model, while guests pay a disclosed 7% service fee that is included in the browse price. The booking summary separately shows the accommodation amount, cleaning when applicable, taxes and total. See{" "}
          <Link to="/host/pricing" className={linkClass}>Wayzyy host pricing</Link>{" "}
          for the current host model.
        </p>

        <h2 className="font-display text-2xl text-foreground mt-8">A simple comparison method</h2>
        <ol className="list-decimal pl-6 space-y-3">
          <li><strong>Use identical inputs.</strong> Compare the exact same check-in, checkout and guest count.</li>
          <li><strong>Open the final price breakdown.</strong> Do not compare a search card with another site's checkout.</li>
          <li><strong>Match cancellation terms.</strong> A flexible booking and a non-refundable booking are different products.</li>
          <li><strong>Separate refundable money.</strong> Record a deposit, but do not treat it as a cost unless the rules make deductions unclear.</li>
          <li><strong>Check what is included.</strong> Housekeeping, cook, utilities and extra beds can matter more than a small nightly difference.</li>
        </ol>

        <div className="rounded-xl border border-border bg-card/40 p-5">
          <p className="font-semibold text-foreground">Use this formula</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Final stay cost = accommodation + mandatory cleaning + extra-guest charges + guest service fee + applicable taxes. Keep a refundable deposit beside that total as a separate cash-flow item.
          </p>
        </div>

        <h2 className="font-display text-2xl text-foreground mt-8">Why the same villa can still have a different base rate</h2>
        <p>
          Platform fees are only one cause. Rates may also differ because calendars are not synced, a promotion applies on one site, the cancellation policy differs, or a host updated one channel first. That is why screenshots should include dates, guest count, refund terms and the final breakdown—not just a nightly figure.
        </p>
        <p>
          For the broader platform comparison, read{" "}
          <Link to="/blog/why-villas-goa-different-prices-platforms" className={linkClass}>why Goa villa prices vary across booking sites</Link>. If you are choosing a marketplace rather than a property, see our disclosed comparison of{" "}
          <Link to="/blog/best-airbnb-alternatives-goa" className={linkClass}>Airbnb alternatives in India</Link>.
        </p>

        <h2 className="font-display text-2xl text-foreground mt-8">Red flags in a price breakdown</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>A compulsory charge appears only after you have entered payment details.</li>
          <li>The host asks you to cancel and pay outside the platform for a lower price.</li>
          <li>The security-deposit rules do not say who holds the money or when it is returned.</li>
          <li>The listing's maximum occupancy differs from the number used in the quote.</li>
          <li>Taxes are described as included but are added again at checkout.</li>
        </ul>

        <h2 className="font-display text-2xl text-foreground mt-8">Frequently asked questions</h2>
        <div className="space-y-4">
          {faqs.map(({ q, a }) => <div key={q} className="rounded-xl border border-border p-5"><h3 className="font-semibold text-foreground">{q}</h3><p className="mt-2 text-sm text-muted-foreground">{a}</p></div>)}
        </div>
      </div>
    </BlogLayout>
  );
}
