import { BlogLayout } from "@/components/BlogLayout";
import { blogPosts } from "@/lib/blogPosts";
import { HelpCircle } from "lucide-react";
import { Link } from "react-router-dom";

const post = blogPosts.find((p) => p.slug === "homestay-registration-rules-by-state-india")!;

const ext = "text-ember hover:underline";

const faqs = [
  {
    q: "Is homestay registration mandatory in India?",
    a: "There's no single national rule. Registration is set by each state, and most major tourism states now require it: Goa, Kerala, Karnataka, Himachal Pradesh, Uttarakhand and Rajasthan all have homestay registration schemes. The Ministry of Tourism also runs a voluntary national classification for homestays.",
  },
  {
    q: "Which states require the homestay owner to live on the property?",
    a: "Kerala only classifies homestays where the owner and family live in the house. Uttarakhand's revised scheme is open only to permanent residents of the state who live in the building. Rajasthan dropped its owner-residence condition in February 2026, and Himachal Pradesh's 2025 rules don't require the owner to live in the unit.",
  },
  {
    q: "Can I run a homestay in a rented or leased house?",
    a: "It depends on the state. Himachal Pradesh banned homestays in leased houses and flats in 2025, and Kerala doesn't classify leased homes. Rajasthan's 2026 scheme allows an owner, lessee or caretaker to run the unit. Check your state's rules before signing a lease.",
  },
  {
    q: "How many rooms can a homestay have in India?",
    a: "It varies: Kerala allows up to 6 rooms, while Rajasthan and Uttarakhand now allow up to 8 rooms and 24 beds. Goa's Category D covers 1 to 6 lettable rooms. Larger properties are usually treated as guest houses or hotels under different rules.",
  },
  {
    q: "What happened to Delhi's bed and breakfast scheme?",
    a: "Delhi withdrew its B&B scheme in June 2026 after a fire at a Malviya Nagar B&B killed 21 people, and the Assembly passed a bill to repeal the 2007 B&B law. A new B&B policy was drafted in May 2026 but hadn't been finalised by August 2026. Fresh registrations under the old law are on hold.",
  },
  {
    q: "Do I need a licence to run an Airbnb in Mumbai?",
    a: "Mumbai's municipal corporation (BMC) has approved a Short Term Rental Licensing Policy that will require a BMC licence, a no-objection from the housing society, police reporting of guests and an occupancy certificate for the building. The BMC says it will be implemented shortly. Housing societies can already restrict short-term rentals through their bye-laws.",
  },
  {
    q: "Is there a national homestay registration in India?",
    a: "Only a voluntary one. The Ministry of Tourism runs an Incredible India classification for homestays and bed-and-breakfast units. It doesn't replace state registration, which is what decides whether you can legally operate.",
  },
];

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
};

const rows = [
  { state: "Goa", mandatory: "Yes", rule: "Goa Registration of Tourist Trade Rules, 1985 (Category D)", key: "1–6 rooms. Registration number must be shown on listings since Jan 2026. Monthly Form XI on the TIME app." },
  { state: "Kerala", mandatory: "Yes (classification)", rule: "Kerala Tourism homestay classification", key: "Owner must live there. Up to 6 rooms. Diamond, Gold or Silver. Valid 3 years. ₹3,750 fee." },
  { state: "Karnataka", mandatory: "Yes", rule: "Karnataka Tourism Trade Act, 2015; homestay guidelines 2025", key: "Registration drive in 2026. High Court asked for a fuller homestay policy in June 2026." },
  { state: "Himachal Pradesh", mandatory: "Yes", rule: "HP Home Stay Rules, 2025", key: "Owner-occupied independent houses only. Leased houses and flats banned. Fees by area and size." },
  { state: "Uttarakhand", mandatory: "Yes", rule: "Revised homestay scheme (May 2026)", key: "Permanent residents only. Up to 8 rooms, 24 beds. 5-year registration proposed." },
  { state: "Rajasthan", mandatory: "Yes", rule: "Homestay (Paying Guest House) Scheme, 2026", key: "Up to 8 rooms, 24 beds. Owner, lessee or caretaker can run it. Guest register kept 7 years." },
  { state: "Maharashtra", mandatory: "Scheme-based; Mumbai licensing coming", rule: "Directorate of Tourism homestay scheme; BMC Short Term Rental policy", key: "Tourist homes and homestays scheme extended to cities in 2025. Mumbai policy needs a BMC licence and society NOC." },
  { state: "Delhi", mandatory: "In transition", rule: "B&B scheme withdrawn June 2026", key: "Repeal bill passed. New policy drafted, not final. Fresh registrations on hold." },
];

export default function HomestayRegistrationRulesByStateIndia() {
  return (
    <BlogLayout
      title={post.title}
      description={post.description}
      metaTitle={post.metaTitle}
      metaDescription={post.metaDescription}
      heroImage={post.heroImage}
      heroImageAlt="Illustration of six homestay registration certificates on a wooden table, labelled Goa, Kerala, Himachal, Rajasthan, Uttarakhand and Karnataka"
      publishedDate={post.publishedDate}
      slug={post.slug}
      extraJsonLd={faqJsonLd}
    >
      <div className="space-y-6">
        <div className="rounded-2xl border border-ember/30 bg-ember/5 p-6">
          <p className="text-sm text-muted-foreground">
            <strong className="text-foreground">Quick answer:</strong> India has no national licence for homestays or Airbnb
            rentals. Each state sets its own rules, and most tourism states now require registration with the state tourism
            department before you take guests. The rules differ on three things that matter most: whether the owner has to live
            there, how many rooms you can let, and whether rented or leased homes qualify. 2026 brought big changes in Delhi,
            Rajasthan, Uttarakhand, Karnataka and Mumbai.
          </p>
        </div>

        <p>
          If you're planning to host on Airbnb, Wayzyy or any other platform, the first question isn't the platform. It's
          your state. A two-bedroom flat that can be registered in one state can't be registered at all in another. This guide
          sets out the rules in India's main homestay states as of late 2026, with what changed this year. For the national
          picture, see{" "}
          <Link to="/blog/is-airbnb-legal-in-india" className={ext}>
            is Airbnb legal in India
          </Link>
          .
        </p>

        <h2 className="font-display text-2xl text-foreground mt-8">The rules at a glance</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border border-border rounded-xl overflow-hidden">
            <thead className="bg-card">
              <tr>
                <th className="text-left p-3 border-b border-border">State</th>
                <th className="text-left p-3 border-b border-border">Registration</th>
                <th className="text-left p-3 border-b border-border">Rule</th>
                <th className="text-left p-3 border-b border-border">Key conditions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.state}>
                  <td className="p-3 border-b border-border font-medium whitespace-nowrap">{r.state}</td>
                  <td className="p-3 border-b border-border">{r.mandatory}</td>
                  <td className="p-3 border-b border-border">{r.rule}</td>
                  <td className="p-3 border-b border-border text-muted-foreground">{r.key}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2 className="font-display text-2xl text-foreground mt-8">Goa</h2>
        <p>
          Goa has the oldest and most enforced framework. Homestays, villas and rented apartments with one to six lettable
          rooms register under <strong>Category D</strong> of the Goa Registration of Tourist Trade Rules, 1985, through the
          Goa Online portal. Since <strong>13 January 2026</strong>, the registration number must appear on the listing
          itself, and platforms can be told to remove listings without it. Registered hosts also upload monthly guest
          statistics (Form XI) on the TIME app by the 5th. Our{" "}
          <Link to="/blog/goa-airbnb-registration-rules" className={ext}>
            Goa registration guide
          </Link>{" "}
          has the full process.
        </p>

        <h2 className="font-display text-2xl text-foreground mt-8">Kerala</h2>
        <p>
          Kerala Tourism says classification is <strong>mandatory</strong> for anyone starting a homestay. A
          government-appointed committee inspects the property and grades it <strong>Diamond, Gold or Silver</strong>. The
          rules are strict on what counts as a homestay: the <strong>owner and family must physically live in the
          house</strong>, leased or rented houses aren't eligible, and up to <strong>6 rooms</strong> can be let.
          Classification lasts three years, and the application fee is ₹3,750 per homestay, paid online.
        </p>

        <h2 className="font-display text-2xl text-foreground mt-8">Karnataka</h2>
        <p>
          Homestays in Karnataka are registered by the Department of Tourism under the{" "}
          <strong>Karnataka Tourism Trade (Facilitation and Regulation) Act, 2015</strong>, with revised homestay guidelines
          issued in 2025. 2026 has been busy. In June, the Karnataka High Court, hearing a Kodagu homestay's licence
          cancellation, said the 2015 Act doesn't adequately cover safety, hygiene and security, and asked the state to frame
          a comprehensive homestay policy, suggesting a 10-point framework covering fire safety, food safety, guest ID
          checks and proportionate rules for small family homestays. By July, more than 500 homestays had applied for
          registration after the Tourism Commissioner urged unregistered operators to come forward.
        </p>

        <h2 className="font-display text-2xl text-foreground mt-8">Himachal Pradesh</h2>
        <p>
          The <strong>Himachal Pradesh Home Stay Rules, 2025</strong> replaced the 2008 scheme. Every homestay must register
          with the Department of Tourism and Civil Aviation after a site inspection, and renew every one or three years. Fees
          depend on location and size: in municipal areas, ₹8,000 for one to three rooms and ₹12,000 for four to six, with
          lower fees in planning areas and villages. Apartments need a resident welfare association NOC.
        </p>
        <p>
          In July 2025 the state tightened the rules: homestays can no longer run from <strong>leased houses, flats or
          partial units</strong>. Only independent houses owned by the applicant, verified in land records, qualify, and
          existing units had to re-register on a new portal.
        </p>

        <h2 className="font-display text-2xl text-foreground mt-8">Uttarakhand</h2>
        <p>
          Uttarakhand revised its homestay scheme in <strong>May 2026</strong>. It's now limited to{" "}
          <strong>permanent residents of the state</strong> who own and live in the building, though an authorised operator
          can run it under a registered agreement. The room limit went up from 6 to <strong>8 rooms</strong>, capped at 24
          beds, and registration is proposed to last five years with online self-renewal. A new category lets 8 to 10
          homestays in a village cluster register together as a community unit.
        </p>
        <p>
          Enforcement is real. In May 2026, Dehradun's administration cancelled <strong>103 homestay registrations</strong>{" "}
          after inspecting 153 properties. Owners were found running them as commercial hotels, not living on site, lacking
          fire safety and food licences, overfilling rooms, and in some cases not filing Form C for foreign guests.
        </p>

        <h2 className="font-display text-2xl text-foreground mt-8">Rajasthan</h2>
        <p>
          The <strong>Rajasthan Homestay (Paying Guest House) Scheme, 2026</strong>, launched in February, went the other
          way on ownership. The old rule that the owner or a family member must live on the premises was{" "}
          <strong>removed</strong>: an owner, lessee or appointed caretaker can now run the unit. The limit rose from 5 to{" "}
          <strong>8 rooms and 24 beds</strong>, every room needs an attached bathroom, and the unit must be in a residential
          complex. Hosts must keep guest registers for at least seven years and report foreign visitors. Applications go to
          local Tourism Department offices, or Tourist Reception Centres in rural areas.
        </p>

        <h2 className="font-display text-2xl text-foreground mt-8">Maharashtra and Mumbai</h2>
        <p>
          Maharashtra's Directorate of Tourism runs registration for tourist homes, homestays, tourism villas and tourist
          apartments, and extended it to urban areas in July 2025. Mumbai is about to get its own layer. The BMC has
          approved a <strong>Short Term Rental Licensing Policy</strong> that it says will be implemented shortly. It
          requires a BMC licence before listing, a no-objection from the society or other residents, an occupancy
          certificate for the building, police reporting of guests, and a licence charge of 1% of net revenue.
        </p>
        <p>
          Mumbai housing societies can also restrict short-term rentals on their own. A Mumbai cooperative court ruled in
          March 2026 that letting a flat for short stays through web portals is commercial activity. More in our guide to{" "}
          <Link to="/blog/airbnb-in-housing-society-india" className={ext}>
            Airbnb in a housing society
          </Link>
          .
        </p>

        <h2 className="font-display text-2xl text-foreground mt-8">Delhi</h2>
        <p>
          Delhi is in transition. After a fire at a Malviya Nagar B&amp;B killed 21 people in June 2026 (the property was
          permitted six rooms but allegedly running 25, without a fire NOC), the government{" "}
          <strong>withdrew its Bed &amp; Breakfast scheme</strong>, and the Assembly passed a bill repealing the 2007 B&amp;B
          law. Existing certificates can continue where they don't conflict with the new framework, but fresh registrations
          are on hold. A draft B&amp;B Policy 2026, proposing up to 8 rooms and 16 beds, mandatory fire compliance, CCTV and
          online registration, was still awaiting approval as of August 2026.
        </p>

        <h2 className="font-display text-2xl text-foreground mt-8">The national scheme</h2>
        <p>
          The Ministry of Tourism runs a <strong>voluntary</strong> Incredible India classification for bed-and-breakfast
          and homestay units. It can help with credibility, but it doesn't replace state registration, which is what
          decides whether you can legally operate.
        </p>

        <h2 className="font-display text-2xl text-foreground mt-8">Rules that apply everywhere</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>Form C:</strong> every foreign guest must be reported to the immigration authorities within 24 hours, in
            every state.{" "}
            <Link to="/blog/form-c-foreign-guests-airbnb-hosts-goa" className={ext}>
              How Form C works
            </Link>
            .
          </li>
          <li>
            <strong>GST:</strong> registration once turnover crosses ₹20 lakh a year, with 5% or 18% depending on the nightly
            rate.{" "}
            <Link to="/blog/gst-for-airbnb-hosts-india" className={ext}>
              GST for Airbnb hosts
            </Link>
            .
          </li>
          <li>
            <strong>Your building:</strong> a housing society can restrict short-term rentals even where the state allows
            them.
          </li>
          <li>
            <strong>Fire safety:</strong> after Delhi's fire, expect fire NOCs and inspections to be enforced harder
            everywhere.
          </li>
        </ul>

        <h2 className="font-display text-2xl text-foreground mt-8">Before you list</h2>
        <p>
          Check three things in order: your state's homestay rules, your building's rules, and your registration status. On{" "}
          <Link to="/what-is-wayzyy" className={ext}>
            Wayzyy
          </Link>
          , hosts are ID-verified and properties are checked before going live, and we're launching state by state, starting
          with Goa. If you're thinking about starting out, our guide to{" "}
          <Link to="/blog/how-to-start-airbnb-business-india" className={ext}>
            starting an Airbnb business in India
          </Link>{" "}
          covers the business side.
        </p>
        <p className="text-sm text-muted-foreground">
          This guide summarises published rules and news reports as of November 2026. It isn't legal advice. State rules
          change often, so confirm with your state tourism department before you apply.
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
