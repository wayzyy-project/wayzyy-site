import { BlogLayout } from "@/components/BlogLayout";
import { blogPosts } from "@/lib/blogPosts";
import { HelpCircle } from "lucide-react";
import { Link } from "react-router-dom";

const post = blogPosts.find((p) => p.slug === "is-airbnb-legal-in-india")!;

const ext = "text-ember hover:underline";

const faqs = [
  {
    q: "Is Airbnb legal in India?",
    a: "Yes. There's no national law banning Airbnb or short-term rentals in India. Hosting is regulated by each state, and most tourism states require homestays and rental homes to register with the state tourism department. Guests can book Airbnb stays anywhere in India legally.",
  },
  {
    q: "Do I need a licence to host on Airbnb in India?",
    a: "Usually, yes, from your state rather than from the central government. Goa, Kerala, Karnataka, Himachal Pradesh, Uttarakhand and Rajasthan all have homestay registration schemes, and Mumbai's municipal corporation has approved a short-term rental licence that it says will be implemented shortly.",
  },
  {
    q: "Is it legal to stay in an Airbnb in India as a guest?",
    a: "Yes. The registration rules apply to hosts, not guests. Every adult guest should expect to show government photo ID at check-in, and foreign guests will be asked for their passport and visa because the host has to file Form C within 24 hours.",
  },
  {
    q: "Can my housing society stop me from listing my flat on Airbnb?",
    a: "Often, yes. A Mumbai cooperative court ruled in March 2026 that renting flats for short stays through web portals is commercial activity, and the Bombay High Court said in December 2025 that a member can't host paying guests while a society resolution against it stands.",
  },
  {
    q: "Do Airbnb hosts in India pay tax?",
    a: "Rental income is taxable as income. GST registration is required once turnover crosses ₹20 lakh a year; below that, the platform generally pays GST on bookings. Platforms also deduct 0.1% TDS from payouts.",
  },
  {
    q: "Which Indian city has the strictest short-term rental rules?",
    a: "Mumbai and Delhi are the most complicated right now. Mumbai's BMC policy will require a municipal licence, a society no-objection, an occupancy certificate and police reporting of guests. Delhi withdrew its B&B scheme in June 2026 and is drafting a new policy.",
  },
];

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
};

export default function IsAirbnbLegalInIndia() {
  return (
    <BlogLayout
      title={post.title}
      description={post.description}
      metaTitle={post.metaTitle}
      metaDescription={post.metaDescription}
      heroImage={post.heroImage}
      heroImageAlt="Illustration of an apartment block and a village homestay side by side, with a green tick and a registration certificate between them"
      publishedDate={post.publishedDate}
      slug={post.slug}
      extraJsonLd={faqJsonLd}
    >
      <div className="space-y-6">
        <div className="rounded-2xl border border-ember/30 bg-ember/5 p-6">
          <p className="text-sm text-muted-foreground">
            <strong className="text-foreground">Short answer: yes, Airbnb is legal in India.</strong> No national law bans
            short-term rentals. The rules come from three places instead: your <strong>state</strong> (most tourism states
            require homestay registration), your <strong>city</strong> (Mumbai is bringing in a licence, Delhi is rewriting
            its B&amp;B rules) and your <strong>building</strong> (housing societies can restrict short stays). On top of
            that, every host must report foreign guests on Form C and deal with GST and income tax. For guests, booking an
            Airbnb anywhere in India is legal.
          </p>
        </div>

        <p>
          "Is Airbnb legal in India?" usually gets a yes-or-no answer online. The honest answer is yes, but the conditions
          depend on where the property is. A villa in Goa, a homestay in Kerala and a flat in a Mumbai housing society are
          each governed by different rules. This page sets out how it works across India in 2026.
        </p>

        <h2 className="font-display text-2xl text-foreground mt-8">Layer 1: your state</h2>
        <p>
          India has no national licence for homestays or holiday rentals. Tourism is largely a state subject, and most states
          that see real homestay demand have their own registration scheme. In the past two years, almost all of them have
          tightened or rewritten their rules:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>Goa</strong> requires registration and, since January 2026, the registration number on every listing.
          </li>
          <li>
            <strong>Kerala</strong> makes classification mandatory, and only for homes where the owner lives.
          </li>
          <li>
            <strong>Himachal Pradesh</strong> banned homestays in leased houses and flats in 2025.
          </li>
          <li>
            <strong>Uttarakhand</strong> limited homestays to permanent residents in May 2026 and cancelled 103 registrations
            in Dehradun alone.
          </li>
          <li>
            <strong>Rajasthan</strong> went the other way in February 2026, dropping its owner-residence rule.
          </li>
          <li>
            <strong>Karnataka</strong> launched a registration drive, and its High Court asked for a fuller homestay policy.
          </li>
        </ul>
        <p>
          The details, including room limits, fees and who qualifies, are in our{" "}
          <Link to="/blog/homestay-registration-rules-by-state-india" className={ext}>
            state-by-state homestay registration guide
          </Link>
          . If you're in Goa, the{" "}
          <Link to="/blog/is-airbnb-legal-in-goa" className={ext}>
            Goa-specific answer
          </Link>{" "}
          goes further.
        </p>

        <h2 className="font-display text-2xl text-foreground mt-8">Layer 2: your city</h2>
        <p>
          Big cities are adding their own rules on top. <strong>Mumbai's</strong> municipal corporation has approved a Short
          Term Rental Licensing Policy, which it says will be implemented shortly. It requires a BMC licence before listing,
          a no-objection from the housing society, an occupancy certificate for the building, police reporting of guests and a
          licence charge of 1% of net revenue.
        </p>
        <p>
          <strong>Delhi</strong> withdrew its Bed &amp; Breakfast scheme in June 2026 after a fire at a Malviya Nagar B&amp;B
          killed 21 people, and is working on a replacement policy. Until it's final, fresh B&amp;B registrations are on
          hold.
        </p>

        <h2 className="font-display text-2xl text-foreground mt-8">Layer 3: your building</h2>
        <p>
          This is the layer most first-time hosts miss. Even where the state allows short-term rentals, a{" "}
          <strong>housing society</strong> can restrict them through its bye-laws and general body resolutions. In March 2026,
          a Mumbai cooperative court called listing flats for short stays on web portals "nothing but commercial activity",
          and in December 2025 the Bombay High Court said a member couldn't host paying guests while a society resolution
          against it stood. Our guide to{" "}
          <Link to="/blog/airbnb-in-housing-society-india" className={ext}>
            Airbnb in a housing society
          </Link>{" "}
          covers what that means in practice.
        </p>

        <p className="italic text-muted-foreground border-l-2 border-ember pl-4">
          <span className="block not-italic text-xs uppercase tracking-wide text-ember mb-1">In one line</span>
          Airbnb is legal in India. What decides whether your listing is legal is your state, your city and your building.
        </p>

        <h2 className="font-display text-2xl text-foreground mt-8">Rules that apply everywhere</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>Foreign guests:</strong> every foreign national, including OCI cardholders, must be reported on Form C
            within 24 hours of arrival under the Immigration and Foreigners Act, 2025.{" "}
            <Link to="/blog/form-c-foreign-guests-airbnb-hosts-goa" className={ext}>
              Form C guide
            </Link>
            .
          </li>
          <li>
            <strong>GST:</strong> registration once turnover crosses ₹20 lakh a year. Stays up to ₹7,500 a night are taxed at
            5%, and stays above that at 18%.{" "}
            <Link to="/blog/gst-for-airbnb-hosts-india" className={ext}>
              GST for Airbnb hosts
            </Link>
            .
          </li>
          <li>
            <strong>Income tax:</strong> rental income is taxable, and platforms deduct 0.1% TDS from payouts.
          </li>
          <li>
            <strong>Guest ID:</strong> hosts should check government photo ID for every adult guest. Several states require
            guest registers to be kept for years.
          </li>
        </ul>

        <h2 className="font-display text-2xl text-foreground mt-8">Is it legal for guests?</h2>
        <p>
          Yes, everywhere in India. The rules above apply to hosts. As a guest, the useful checks are whether the listing shows
          a state registration number where one is required, and whether you're paying through the platform rather than
          directly. Unmarried couples can legally stay together too: see{" "}
          <Link to="/blog/unmarried-couples-goa-hotels-villas" className={ext}>
            our guide on that question
          </Link>
          .
        </p>

        <h2 className="font-display text-2xl text-foreground mt-8">Where Wayzyy fits</h2>
        <p>
          We built{" "}
          <Link to="/what-is-wayzyy" className={ext}>
            Wayzyy
          </Link>{" "}
          around this reality. Hosts are ID-verified, properties are checked before they go live, and in Goa we check the
          tourism registration number before a listing earns the Wayzyy Verified badge. We're starting in Goa and expanding
          across India state by state, with each state's rules built into how listings are verified.
        </p>
        <p className="text-sm text-muted-foreground">
          This page summarises published rules and news reports as of November 2026. It isn't legal advice.
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
