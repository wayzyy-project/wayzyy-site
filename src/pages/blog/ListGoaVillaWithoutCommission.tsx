import { BlogLayout } from "@/components/BlogLayout";
import { blogPosts } from "@/lib/blogPosts";
import { Link } from "react-router-dom";

const post = blogPosts.find((p) => p.slug === "list-goa-villa-without-commission")!;
const linkClass = "text-ember hover:underline";

const faqs = [
  { q: "Can a Goa host list without paying commission on every booking?", a: "Yes. Some marketplaces use a subscription, credits or a flat listing model instead of deducting a percentage from every host payout. Check guest fees and fixed costs as well as host commission." },
  { q: "Does zero host commission mean zero platform cost?", a: "No. It means the host is not charged a percentage of each booking. A platform may still charge a subscription, credits, payment-processing costs or a disclosed guest service fee." },
  { q: "What documents does a Goa villa host need?", a: "Requirements depend on the property and guest type, but hosts should review Goa Tourism registration, identity and bank verification, guest reporting and foreign-guest Form C obligations before going live." },
  { q: "Should hosts list on more than one platform?", a: "Many do, but every connected calendar must be kept current. Use iCal or a channel manager where available, keep one source of truth for pricing, and verify blocked dates after every manual change." },
];

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map(({ q, a }) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })),
};

export default function ListGoaVillaWithoutCommission() {
  return (
    <BlogLayout post={post} heroImageAlt="Goa villa host and traveller connected through a booking platform" extraJsonLd={faqJsonLd}>
      <div className="space-y-6">
        <div className="rounded-2xl border border-ember/30 bg-ember/5 p-6">
          <p className="text-sm text-muted-foreground">
            <strong className="text-foreground">Quick answer:</strong> choose a platform that charges the host a flat plan, credits or subscription instead of a percentage of every booking. Then compare the complete model: guest fees, payment handling, verification, dispute support, calendar sync and the work required to remain compliant in Goa.
          </p>
        </div>

        <p>
          “No commission” can mean several things. It may mean no percentage is deducted from the host payout, while the host pays a fixed plan. It may mean the guest pays the marketplace fee. Or it may mean the platform generates an enquiry and leaves payment and support to the host. Those models create very different costs and risks.
        </p>
        <p>
          Wayzyy is the platform behind this guide, so the comparison is not independent. We use a flat prepaid-credit model for hosts rather than taking a percentage from every booking. The framework below is meant to help you evaluate us and every alternative with the same questions.
        </p>

        <h2 className="font-display text-2xl text-foreground mt-8">Three common listing models</h2>
        <div className="overflow-x-auto border border-border rounded-xl">
          <table className="w-full text-sm text-left">
            <thead className="bg-card"><tr><th className="p-3 border-b border-border">Model</th><th className="p-3 border-b border-border">How the host pays</th><th className="p-3 border-b border-border">Best question to ask</th></tr></thead>
            <tbody>
              <tr><td className="p-3 border-b border-border font-medium">Per-booking commission</td><td className="p-3 border-b border-border">A percentage is deducted from each payout</td><td className="p-3 border-b border-border">What will I receive from a ₹20,000 booking?</td></tr>
              <tr><td className="p-3 border-b border-border font-medium">Subscription or credits</td><td className="p-3 border-b border-border">A fixed recurring or prepaid cost</td><td className="p-3 border-b border-border">What happens when credits expire or volume changes?</td></tr>
              <tr><td className="p-3 font-medium">Direct enquiry</td><td className="p-3">Listing or lead fee, sometimes no transaction service</td><td className="p-3">Who handles payment, fraud, cancellation and disputes?</td></tr>
            </tbody>
          </table>
        </div>

        <h2 className="font-display text-2xl text-foreground mt-8">Calculate the effective cost, not just the headline rate</h2>
        <p>
          Take one realistic month and calculate all platform costs divided by confirmed booking revenue. Include commission, subscription or credits, payment charges, refunds you must absorb, discounts required for visibility and the time spent handling enquiries that never convert.
        </p>
        <p>
          Then check the guest side. A large guest fee can make your property look expensive even when your payout is unchanged. Our{" "}
          <Link to="/blog/goa-villa-booking-fees-explained" className={linkClass}>booking-fee guide</Link>{" "}
          explains how travellers compare the final amount.
        </p>

        <h2 className="font-display text-2xl text-foreground mt-8">What a commission-free listing still needs</h2>
        <ul className="list-disc pl-6 space-y-3">
          <li><strong>Accurate availability:</strong> connect every channel through iCal or a channel manager, and verify that blocks sync in both directions.</li>
          <li><strong>A complete listing:</strong> current photos, actual sleeping capacity, amenity details, house rules and an honest location description.</li>
          <li><strong>Clear pricing:</strong> nightly price, extra guests, cleaning, taxes and deposit rules should be visible before payment.</li>
          <li><strong>Verified payout details:</strong> the legal host identity and bank account need to match the platform's checks.</li>
          <li><strong>On-platform records:</strong> keep booking messages and agreements in the platform so a dispute has a usable evidence trail.</li>
        </ul>

        <h2 className="font-display text-2xl text-foreground mt-8">Goa compliance before you publish</h2>
        <p>
          Platform pricing does not replace legal compliance. Review the property registration, guest reporting and tax obligations that apply to your operation. Wayzyy's{" "}
          <Link to="/goa-host-compliance-checklist" className={linkClass}>Goa host compliance checklist</Link>{" "}
          is the quickest starting point. We also maintain explainers for{" "}
          <Link to="/blog/goa-airbnb-registration-rules" className={linkClass}>Goa registration rules</Link>,{" "}
          <Link to="/blog/goa-time-app-airbnb-hosts" className={linkClass}>TIME app reporting</Link>, and{" "}
          <Link to="/blog/form-c-foreign-guests-airbnb-hosts-goa" className={linkClass}>Form C for foreign guests</Link>.
        </p>
        <p className="text-sm text-muted-foreground">
          These guides are practical summaries, not legal or tax advice. Confirm obligations for your property and business structure with the relevant department or a qualified adviser.
        </p>

        <h2 className="font-display text-2xl text-foreground mt-8">How Wayzyy's host model works</h2>
        <p>
          Wayzyy does not deduct a percentage commission from each host booking. Hosts use prepaid listing credits, while the guest service fee is disclosed separately in the platform's pricing model. Current pack details and conditions belong on the{" "}
          <Link to="/host/pricing" className={linkClass}>host pricing page</Link>{" "}
          rather than in a blog post that can go stale.
        </p>
        <p>
          Before joining, also read the{" "}
          <Link to="/host-terms" className={linkClass}>host terms</Link>{" "}
          and the{" "}
          <Link to="/policies/dispute-resolution" className={linkClass}>dispute-resolution policy</Link>. A low fee is useful only if payout, cancellations and disputes are clear.
        </p>

        <h2 className="font-display text-2xl text-foreground mt-8">A host's comparison checklist</h2>
        <ol className="list-decimal pl-6 space-y-2">
          <li>What is my exact payout on a representative booking?</li>
          <li>What does the guest pay in total?</li>
          <li>Who collects payment and handles refunds?</li>
          <li>How are chargebacks, damage and review disputes handled?</li>
          <li>How quickly does calendar data sync?</li>
          <li>What verification is completed before a listing goes live?</li>
          <li>Can I export my listing and booking records?</li>
          <li>What fixed costs continue during a low-booking month?</li>
        </ol>

        <div className="rounded-2xl border border-border bg-card/40 p-6">
          <h2 className="font-display text-xl text-foreground">Ready to compare the numbers?</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Use the{" "}
            <Link to="/earnings-calculator" className={linkClass}>Wayzyy earnings calculator</Link>{" "}
            to model a Goa villa's revenue, then review the current host pricing before you submit a listing.
          </p>
        </div>

        <h2 className="font-display text-2xl text-foreground mt-8">Frequently asked questions</h2>
        <div className="space-y-4">
          {faqs.map(({ q, a }) => <div key={q} className="rounded-xl border border-border p-5"><h3 className="font-semibold text-foreground">{q}</h3><p className="mt-2 text-sm text-muted-foreground">{a}</p></div>)}
        </div>
      </div>
    </BlogLayout>
  );
}
