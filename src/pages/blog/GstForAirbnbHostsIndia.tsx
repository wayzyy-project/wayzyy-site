import { BlogLayout } from "@/components/BlogLayout";
import { blogPosts } from "@/lib/blogPosts";
import { HelpCircle } from "lucide-react";
import { Link } from "react-router-dom";

const post = blogPosts.find((p) => p.slug === "gst-for-airbnb-hosts-india")!;

const ext = "text-ember hover:underline";

const faqs = [
  {
    q: "Do Airbnb hosts in India have to pay GST?",
    a: "Only above the threshold. You have to register for GST once your total turnover crosses ₹20 lakh in a financial year. Below that, you don't register, and on bookings made through a platform like Airbnb, the platform generally pays the GST itself under section 9(5) of the CGST Act.",
  },
  {
    q: "What is the GST rate on Airbnb and homestay stays?",
    a: "Since 22 September 2025, stays priced up to ₹7,500 per unit per night attract 5% GST without input tax credit. Stays above ₹7,500 per unit per night attract 18% GST with input tax credit.",
  },
  {
    q: "Who pays GST on an Airbnb booking in India, the host or Airbnb?",
    a: "If the host is below the ₹20 lakh threshold and not liable to register, Airbnb, as the e-commerce operator, pays the GST on accommodation booked through it. If the host is registered or liable to register, the host charges and pays GST on their own bookings.",
  },
  {
    q: "Is short-term rental income exempt from GST like house rent?",
    a: "No. The GST exemption for renting a residential dwelling covers letting a home for someone to live in. Short stays for tourists are treated as accommodation services, which are taxable.",
  },
  {
    q: "Does the ₹7,500 limit apply per room or per villa?",
    a: "Per unit per day. If you rent out an entire villa as one unit, the nightly price of the villa is what counts. If you rent rooms separately, each room's nightly price counts. Ask your accountant how this applies to your listing.",
  },
  {
    q: "Does Airbnb deduct tax from host payouts in India?",
    a: "Yes. E-commerce operators deduct 0.1% income tax (TDS) on the gross amount of bookings through their platform. Since 1 April 2026 this sits in section 393(1) of the Income-tax Act, 2025, which replaced section 194-O. The deduction shows in your tax statement and can be claimed against your income tax.",
  },
  {
    q: "Do I need GST registration for my Goa homestay?",
    a: "Not below ₹20 lakh of annual turnover. GST registration is separate from your Goa Tourism registration, which is required regardless of income.",
  },
];

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
};

export default function GstForAirbnbHostsIndia() {
  return (
    <BlogLayout
      title={post.title}
      description={post.description}
      metaTitle={post.metaTitle}
      metaDescription={post.metaDescription}
      heroImage={post.heroImage}
      heroImageAlt="Illustration of a villa key, a calculator showing 5% and 18%, and a booking receipt on a wooden table"
      publishedDate={post.publishedDate}
      slug={post.slug}
      extraJsonLd={faqJsonLd}
    >
      <div className="space-y-6">
        <div className="rounded-2xl border border-ember/30 bg-ember/5 p-6">
          <p className="text-sm text-muted-foreground">
            <strong className="text-foreground">Short answer:</strong> Airbnb hosts in India only need GST registration once
            their turnover crosses <strong>₹20 lakh a year</strong>. Below that, GST on bookings made through Airbnb is
            generally paid by Airbnb itself. The rate depends on your nightly price: <strong>5%</strong> (without input tax
            credit) for stays up to ₹7,500 per unit per night, and <strong>18%</strong> (with input tax credit) above that.
            These rates have applied since 22 September 2025.
          </p>
        </div>

        <p>
          GST is the part of hosting most people find confusing, mostly because the answer depends on three things: how much
          you earn, how much you charge per night, and whether the booking came through a platform. This page walks through
          each one. It's written for hosts in Goa, but the GST rules are the same across India.
        </p>

        <h2 className="font-display text-2xl text-foreground mt-8">Do you need to register for GST?</h2>
        <p>
          Only if your <strong>aggregate turnover crosses ₹20 lakh in a financial year</strong>. That's the threshold for
          service providers in Goa and most Indian states. Turnover means all your taxable income from the business, across
          every platform and direct booking, not just Airbnb.
        </p>
        <p>
          GST registration is completely separate from your{" "}
          <Link to="/blog/goa-airbnb-registration-rules" className={ext}>
            Goa Tourism registration
          </Link>
          . Tourism registration is required for every short-term rental, whatever it earns. GST registration only kicks in
          above ₹20 lakh.
        </p>

        <h2 className="font-display text-2xl text-foreground mt-8">Short stays aren't "rent"</h2>
        <p>
          A common assumption is that renting out a home is exempt from GST. That exemption covers letting a residential
          dwelling for someone to live in, like a tenant on an 11-month lease. A tourist staying a few nights is different.
          Short stays are treated as <strong>accommodation services</strong>, the same category as hotels and guest houses,
          and they're taxable.
        </p>

        <h2 className="font-display text-2xl text-foreground mt-8">What rate applies?</h2>
        <p>
          The GST Council cut the rate on budget accommodation in September 2025. From <strong>22 September 2025</strong>:
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border border-border rounded-xl overflow-hidden">
            <thead className="bg-card">
              <tr>
                <th className="text-left p-3 border-b border-border">Price per unit per night</th>
                <th className="text-left p-3 border-b border-border">GST rate</th>
                <th className="text-left p-3 border-b border-border">Input tax credit</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="p-3 border-b border-border">Up to ₹7,500</td>
                <td className="p-3 border-b border-border font-medium">5%</td>
                <td className="p-3 border-b border-border">Not available</td>
              </tr>
              <tr>
                <td className="p-3">Above ₹7,500</td>
                <td className="p-3 font-medium">18%</td>
                <td className="p-3">Available</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          Before the change, stays up to ₹7,500 were taxed at 12% with input tax credit. The new 5% rate is lower, but it
          comes without input tax credit, so registered hosts can no longer offset GST paid on their own expenses against it.
        </p>
        <p>
          The rate goes by the price <strong>per unit per night</strong>. For a whole villa rented as one unit, that's the
          villa's nightly rate. A ₹12,000-a-night villa falls in the 18% slab. A ₹3,000 homestay room falls in the 5% slab.
          If you price close to ₹7,500, the line matters: a villa at ₹7,400 and one at ₹7,600 sit in different slabs.
        </p>

        <h2 className="font-display text-2xl text-foreground mt-8">Who actually pays: you or Airbnb?</h2>
        <p>
          This is where platform bookings differ from direct ones. Under <strong>section 9(5) of the CGST Act</strong>, the
          government has notified accommodation services as a category where the e-commerce operator, the platform, is
          responsible for paying GST. The exception is when the host is liable to register for GST themselves.
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>Host below ₹20 lakh, booking through Airbnb or another platform:</strong> the platform pays GST on the
            booking. You don't register or file.
          </li>
          <li>
            <strong>Host above ₹20 lakh (or voluntarily registered):</strong> you charge GST on your bookings and pay it
            yourself, and you file regular GST returns.
          </li>
          <li>
            <strong>Direct bookings (WhatsApp, your own website):</strong> no platform is involved, so if you're registered, you
            charge GST. If you're below the threshold and not registered, there's no GST to charge.
          </li>
        </ul>
        <p className="italic text-muted-foreground border-l-2 border-ember pl-4">
          <span className="block not-italic text-xs uppercase tracking-wide text-ember mb-1">The ₹20 lakh trap</span>
          Turnover counts across every channel. A host making ₹12 lakh on Airbnb and ₹10 lakh from direct bookings has crossed
          the threshold, even though neither channel alone has.
        </p>

        <h2 className="font-display text-2xl text-foreground mt-8">What about income tax?</h2>
        <p>
          GST and income tax are separate. Whatever your GST position, rental income from short stays is taxable as income.
          Platforms acting as e-commerce operators deduct <strong>0.1% TDS</strong> on the gross amount of your bookings. This
          was section 194-O of the old Income-tax Act; since 1 April 2026 it's section 393(1) of the Income-tax Act, 2025, at
          the same rate. It shows in your tax statement, and you claim it when you file your return. Whether your income is
          treated as house property or business income depends on how you run it, so this is a question for a chartered
          accountant.
        </p>

        <h2 className="font-display text-2xl text-foreground mt-8">A quick checklist for hosts</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>Add up your annual turnover across every platform and direct booking.</li>
          <li>If it's under ₹20 lakh and you only take platform bookings, you don't need to register for GST.</li>
          <li>If it's over ₹20 lakh, register, charge 5% or 18% depending on your nightly rate, and file returns.</li>
          <li>Keep your tourism registration, Form XI and Form C up to date. GST doesn't replace any of them.</li>
          <li>Claim the 0.1% TDS when you file income tax.</li>
        </ul>
        <p>
          If you're working out what hosting actually earns after fees and tax, our pieces on{" "}
          <Link to="/blog/hidden-costs-of-running-an-airbnb" className={ext}>
            the hidden costs of running an Airbnb
          </Link>{" "}
          and{" "}
          <Link to="/blog/how-much-can-you-earn-vacation-rental-goa" className={ext}>
            what a Goa vacation rental can earn
          </Link>{" "}
          go further.
        </p>
        <p className="text-sm text-muted-foreground">
          This page explains the rules as published and isn't tax advice. GST and income tax depend on your exact situation,
          so confirm with a chartered accountant before you file.
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
