import { BlogLayout } from "@/components/BlogLayout";
import { blogPosts } from "@/lib/blogPosts";
import { HelpCircle } from "lucide-react";
import { Link } from "react-router-dom";

const post = blogPosts.find((p) => p.slug === "airbnb-hosting-india-2027-checklist")!;

const ext = "text-ember hover:underline";

const faqs = [
  {
    q: "What do I need to start hosting on Airbnb in India in 2027?",
    a: "Four things before your first guest: your state's homestay or tourism registration where it's required, permission from your housing society if you're in one, a fire NOC where your state asks for it, and an account on the immigration portal to file Form C for foreign guests. Then plan for GST if you'll cross ₹20 lakh a year, and for income tax on what you earn.",
  },
  {
    q: "What changes for Airbnb hosts in India in 2027?",
    a: "Mumbai's short-term rental licence is due to take effect, Delhi is finalising a new B&B policy, Karnataka has been asked by its High Court to write a fuller homestay policy, and UIDAI plans to stop hotels and hosts from keeping Aadhaar photocopies. Since April 2026, the TDS that platforms deduct falls under section 393(1) of the new Income-tax Act.",
  },
  {
    q: "Is registration mandatory for Airbnb hosts in India?",
    a: "It depends on the state. Goa, Kerala, Karnataka, Himachal Pradesh, Uttarakhand and Rajasthan all have homestay registration rules, and Mumbai's licence will add a city-level layer. There is no single national licence.",
  },
  {
    q: "How much tax do Airbnb hosts pay in India?",
    a: "Rental income is taxed at your income tax slab rate. Platforms deduct 0.1% TDS from payouts, which you claim back when you file. GST registration is required once turnover crosses ₹20 lakh a year, at 5% for stays up to ₹7,500 a night and 18% above that.",
  },
  {
    q: "Can I get a loan to start a homestay in India?",
    a: "The Union Budget 2025-26 extended MUDRA loans to homestays, aimed at small owners and rural tourism. Banks set their own terms, so ask your bank about MUDRA lending for homestays.",
  },
];

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
};

const howToJsonLd = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "How to set up a legal Airbnb or homestay in India in 2027",
  step: [
    { "@type": "HowToStep", name: "Check your state's rules", text: "Find out whether your state requires homestay registration, whether the owner must live there, and whether flats or leased homes qualify." },
    { "@type": "HowToStep", name: "Get building permission", text: "If you're in a housing society, get its written consent. Several states and Mumbai's new licence ask for a society NOC." },
    { "@type": "HowToStep", name: "Register and get safety approvals", text: "Apply for state registration and any required fire NOC before you take bookings." },
    { "@type": "HowToStep", name: "Set up guest reporting", text: "Register on the immigration portal so you can file Form C within 24 hours for every foreign guest." },
    { "@type": "HowToStep", name: "Plan for tax", text: "Track turnover across all channels for the ₹20 lakh GST threshold, and keep records for income tax and the 0.1% TDS platforms deduct." },
  ],
};

export default function AirbnbHostingIndia2027Checklist() {
  return (
    <BlogLayout
      title={post.title}
      description={post.description}
      metaTitle={post.metaTitle}
      metaDescription={post.metaDescription}
      heroImage={post.heroImage}
      heroImageAlt="Illustration of a clipboard checklist with ticked boxes beside a house key, a 2027 calendar page and a rupee coin"
      publishedDate={post.publishedDate}
      slug={post.slug}
      extraJsonLd={[faqJsonLd, howToJsonLd]}
    >
      <div className="space-y-6">
        <div className="rounded-2xl border border-ember/30 bg-ember/5 p-6">
          <p className="text-sm text-muted-foreground">
            <strong className="text-foreground">Hosting on Airbnb in India in 2027</strong> means getting six things right:
            your <strong>state registration</strong>, your <strong>housing society's permission</strong>,{" "}
            <strong>fire safety</strong>, <strong>Form C</strong> for foreign guests, <strong>GST</strong> above ₹20 lakh
            turnover, and <strong>income tax</strong>. The rules are set state by state, and 2027 brings changes in Mumbai,
            Delhi, Karnataka and how hosts handle guests' Aadhaar. This checklist covers all of it in one place.
          </p>
        </div>

        <p>
          Hosting in India got more regulated in 2025 and 2026, and that's not slowing down in 2027. Almost every major
          tourism state has rewritten its homestay rules, cities are adding their own licences, and NITI Aayog has proposed a
          national model framework for homestays. None of this makes hosting harder for a host who sets up properly. It does
          make it riskier for one who doesn't. Here's the full checklist, in the order to do it.
        </p>

        <h2 className="font-display text-2xl text-foreground mt-8">1. Check your state's rules first</h2>
        <p>
          India has no national homestay licence. Your state decides whether you need to register, how many rooms you can let,
          whether you have to live there, and whether a flat or leased home qualifies at all. The differences are big:
          Himachal Pradesh won't register flats or leased houses, Kerala only classifies owner-occupied homes, and Rajasthan
          dropped its owner-residence rule in 2026. Our{" "}
          <Link to="/blog/homestay-registration-rules-by-state-india" className={ext}>
            state-by-state registration guide
          </Link>{" "}
          has the details, and{" "}
          <Link to="/blog/goa-airbnb-registration-rules" className={ext}>
            Goa's rules
          </Link>{" "}
          have their own page.
        </p>

        <h2 className="font-display text-2xl text-foreground mt-8">2. Get your building's permission</h2>
        <p>
          If your home is in a housing society, its bye-laws and general body resolutions can stop you, even where the state
          allows hosting. In March 2026 a Mumbai cooperative court called short-stay listings "commercial activity". Get written
          consent before you list.{" "}
          <Link to="/blog/airbnb-in-housing-society-india" className={ext}>
            Airbnb in a housing society
          </Link>{" "}
          explains the rulings.
        </p>

        <h2 className="font-display text-2xl text-foreground mt-8">3. Register, and get your safety approvals</h2>
        <p>
          Apply for state registration before you take bookings. Registration can take time: NITI Aayog's field survey found it
          often took two to six months. Goa quotes up to 90 days. Several states ask for a fire NOC, and after a fire at a Delhi
          B&amp;B killed 21 people in June 2026, expect fire safety to be checked harder everywhere. Once registered, show your
          registration number on your listings where your state requires it, as Goa has since January 2026.
        </p>

        <h2 className="font-display text-2xl text-foreground mt-8">4. Set up guest reporting</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>Foreign guests:</strong> file Form C within 24 hours of arrival for every foreign national, OCI holders
            included, under the Immigration and Foreigners Act, 2025. Register on the immigration portal once, before your first
            foreign booking.{" "}
            <Link to="/blog/form-c-foreign-guests-airbnb-hosts-goa" className={ext}>
              Form C guide
            </Link>
            .
          </li>
          <li>
            <strong>State statistics:</strong> some states ask for regular guest returns. Goa's is the monthly Form XI on the
            TIME app.{" "}
            <Link to="/blog/goa-time-app-airbnb-hosts" className={ext}>
              How TIME works
            </Link>
            .
          </li>
          <li>
            <strong>Guest registers:</strong> keep records. Rajasthan's 2026 scheme requires guest registers to be kept for
            seven years.
          </li>
          <li>
            <strong>Aadhaar:</strong> UIDAI says storing Aadhaar photocopies breaks the Aadhaar Act, and plans a framework where
            businesses verify Aadhaar through its app or QR codes instead. Check ID, but don't keep copies you don't need.{" "}
            <Link to="/blog/id-proof-for-hotel-check-in-india" className={ext}>
              Guest ID rules
            </Link>
            .
          </li>
        </ul>

        <h2 className="font-display text-2xl text-foreground mt-8">5. Get your tax set up</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>GST:</strong> register once your turnover across all channels crosses ₹20 lakh a year. Stays up to ₹7,500
            a night are taxed at 5% without input tax credit, and stays above that at 18%. Below the threshold, the platform
            generally pays GST on bookings made through it.{" "}
            <Link to="/blog/gst-for-airbnb-hosts-india" className={ext}>
              GST for Airbnb hosts
            </Link>
            .
          </li>
          <li>
            <strong>TDS:</strong> platforms deduct 0.1% from your payouts. Since 1 April 2026 this falls under section 393(1)
            of the Income-tax Act, 2025, replacing section 194-O. Claim it when you file.
          </li>
          <li>
            <strong>Income tax:</strong> hosting income is taxable. Keep records of every expense, from cleaning to repairs, and
            talk to a chartered accountant about how to report it.
          </li>
        </ul>

        <h2 className="font-display text-2xl text-foreground mt-8">6. Choose your platforms and fees</h2>
        <p>
          Platform fees are your biggest running cost after cleaning. Airbnb charges most listings a 15% to 15.5% service fee,
          usually taken from the host. On{" "}
          <Link to="/what-is-wayzyy" className={ext}>
            Wayzyy
          </Link>
          , hosts pay a flat subscription and no per-booking commission, and guests pay a 7% fee included in the price. See{" "}
          <Link to="/blog/how-much-do-airbnb-hosts-earn-india" className={ext}>
            what Airbnb hosts in India actually earn
          </Link>{" "}
          for the numbers.
        </p>

        <h2 className="font-display text-2xl text-foreground mt-8">What to watch in 2027</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>Mumbai:</strong> the BMC's Short Term Rental Licensing Policy, approved for implementation, requires a
            municipal licence, a society no-objection, an occupancy certificate and police reporting of guests.
          </li>
          <li>
            <strong>Delhi:</strong> the old B&amp;B scheme was withdrawn in June 2026. A draft policy proposing up to 8 rooms and
            16 beds awaits approval.
          </li>
          <li>
            <strong>Karnataka:</strong> its High Court has asked the state for a fuller homestay policy covering fire safety,
            food safety and guest checks.
          </li>
          <li>
            <strong>A national framework:</strong> NITI Aayog has recommended simpler registration, a single digital portal,
            30-day approval with deemed approval after that, and treating homestays as residential for utility and property
            tax. If states adopt it, registration should get easier.
          </li>
          <li>
            <strong>Financing:</strong> the Union Budget 2025-26 extended MUDRA loans to homestays, aimed at small and rural
            owners.
          </li>
        </ul>

        <p className="italic text-muted-foreground border-l-2 border-ember pl-4">
          <span className="block not-italic text-xs uppercase tracking-wide text-ember mb-1">The 2027 rule of thumb</span>
          Register first, list second. Unregistered listings are what get removed, fined and named in news reports.
        </p>

        <p>
          Starting from scratch? Our guide to{" "}
          <Link to="/blog/how-to-start-airbnb-business-india" className={ext}>
            starting an Airbnb business in India
          </Link>{" "}
          covers the business side, and{" "}
          <Link to="/blog/is-airbnb-legal-in-india" className={ext}>
            is Airbnb legal in India
          </Link>{" "}
          gives the short answer.
        </p>
        <p className="text-sm text-muted-foreground">
          This checklist summarises published rules and news reports as of November 2026. It isn't legal or tax advice. Check
          your state's current rules and speak to a professional before you start.
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
