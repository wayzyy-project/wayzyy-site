import { BlogLayout } from "@/components/BlogLayout";
import { blogPosts } from "@/lib/blogPosts";
import { HelpCircle } from "lucide-react";
import { Link } from "react-router-dom";

const post = blogPosts.find((p) => p.slug === "is-airbnb-legal-in-goa")!;

const ext = "text-ember hover:underline";

const faqs = [
  {
    q: "Is Airbnb legal in Goa?",
    a: "Yes. Renting your home, villa or apartment to tourists through Airbnb is legal in Goa, as long as the property is registered with the Goa Department of Tourism and the registration number is shown on the listing. What's not allowed is running a short-term rental without that registration.",
  },
  {
    q: "Is it legal to stay in an Airbnb in Goa as a guest?",
    a: "Yes. Guests aren't breaking any law by booking an Airbnb in Goa. The registration duty is on the host. As a guest, a visible Goa Tourism registration number on the listing is the simplest sign that the host is compliant.",
  },
  {
    q: "What registration does an Airbnb in Goa need?",
    a: "Registration with the Goa Department of Tourism under the Goa Registration of Tourist Trade Act, 1982 and its 1985 Rules. Homestays, B&Bs, villas and rented apartments with one to six lettable rooms fall under Category D. The application is made on goaonline.gov.in, and the department says processing can take up to 90 days.",
  },
  {
    q: "Do Airbnb hosts in Goa have to show a registration number?",
    a: "Yes. Under an administrative order dated 13 January 2026, the registration number must appear on the listing itself. Airbnb has a field for it, and the Tourism Department can direct platforms to remove listings that don't show a valid number.",
  },
  {
    q: "What happens if an Airbnb in Goa isn't registered?",
    a: "The Tourism Department's April 2026 notice warns of strict action against unregistered units, including closure and legal proceedings, and says inspection teams are checking. Platforms can also be told to take the listing down.",
  },
  {
    q: "Is a Goa Airbnb host's job done once they're registered?",
    a: "No. Registered hosts must also upload monthly guest statistics (Form XI) on the TIME app by the 5th of each month, and report every foreign guest on Form C within 24 hours of arrival. GST applies too once rental income crosses ₹20 lakh a year.",
  },
  {
    q: "Can I rent out my flat in a housing society on Airbnb in Goa?",
    a: "Yes, but you'll need a no-objection certificate from the society or RWA as part of your tourism registration, in addition to ownership documents or the owner's NOC and a Fire NOC.",
  },
];

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
};

export default function IsAirbnbLegalInGoa() {
  return (
    <BlogLayout
      title={post.title}
      description={post.description}
      metaTitle={post.metaTitle}
      metaDescription={post.metaDescription}
      heroImage={post.heroImage}
      heroImageAlt="Illustration of a Goan villa front door with a green tick on a tile plaque reading Goa Tourism Reg. No."
      publishedDate={post.publishedDate}
      slug={post.slug}
      extraJsonLd={faqJsonLd}
    >
      <div className="space-y-6">
        <div className="rounded-2xl border border-ember/30 bg-ember/5 p-6">
          <p className="text-sm text-muted-foreground">
            <strong className="text-foreground">Short answer: yes, Airbnb is legal in Goa,</strong> but only for registered
            properties. Any home, villa, homestay or apartment rented to tourists must be registered with the Goa Department of
            Tourism, and since January 2026 the registration number has to be shown on the listing. Unregistered listings can be
            removed, and the department has warned unregistered operators of closure and legal action. For guests, booking an
            Airbnb in Goa is completely legal.
          </p>
        </div>

        <p>
          "Is Airbnb legal in Goa?" gets asked a lot, usually after someone reads about a crackdown. The confusion is
          understandable. Goa hasn't banned Airbnb. What it has done is start enforcing a registration rule that has existed
          since the 1980s. This page answers the question directly, for hosts and for guests, with links to the detail.
        </p>

        <h2 className="font-display text-2xl text-foreground mt-8">Is it legal for hosts?</h2>
        <p>
          Yes, if you're registered. Short-term renting in Goa is regulated by the <strong>Goa Registration of Tourist Trade
          Act, 1982</strong> and its <strong>1985 Rules</strong>. Homestays, B&amp;Bs, villas and rented apartments with one to
          six lettable rooms (up to 12 beds) fall under <strong>Category D</strong>. Airbnb's own Goa help page says the same
          thing: Category D hosts must register their property with the Department of Tourism, and operating without
          registration may not be permitted under Goa law.
        </p>
        <p>
          Registration is done on the{" "}
          <a href="https://goaonline.gov.in" target="_blank" rel="noopener noreferrer" className={ext}>
            Goa Online portal
          </a>
          . The department quotes up to 90 days to process an application, so it has to be started well before you want to
          take bookings. Our{" "}
          <Link to="/blog/goa-airbnb-registration-rules" className={ext}>
            Goa Airbnb registration rules
          </Link>{" "}
          guide covers the documents and the process in detail.
        </p>

        <h2 className="font-display text-2xl text-foreground mt-8">What changed in 2026</h2>
        <p>
          The law didn't change. Enforcement did. An administrative order dated <strong>13 January 2026</strong> requires the
          registration number to be displayed on the listing itself, and allows the Tourism Department to direct platforms to
          remove listings that don't comply. Airbnb added a dedicated field so Goa hosts can enter it.
        </p>
        <p>
          In April 2026, the department went further. Its notice said individuals renting through Airbnb or similar platforms
          must register, warned unregistered hotels and guest houses of closure and legal proceedings, and said inspection
          teams would be checking licences across the state.
        </p>

        <p className="italic text-muted-foreground border-l-2 border-ember pl-4">
          <span className="block not-italic text-xs uppercase tracking-wide text-ember mb-1">In one line</span>
          Airbnb isn't the problem in Goa. An unregistered property is, on any platform.
        </p>

        <h2 className="font-display text-2xl text-foreground mt-8">Is it legal for guests?</h2>
        <p>
          Completely. There's no rule against tourists booking a home or villa through Airbnb or any other platform. The
          registration duty sits with the host. The one thing worth checking as a guest is whether the listing shows a Goa
          Tourism registration number. It's the quickest sign of a legitimate, compliant host, and an unregistered listing is
          the one most likely to be taken down, sometimes after you've paid. Our guide on{" "}
          <Link to="/blog/how-to-book-verified-stay-in-goa" className={ext}>
            booking a verified stay in Goa
          </Link>{" "}
          covers the other checks.
        </p>
        <p>
          Foreign visitors should expect the host to ask for a passport and visa at check-in. That's not the host being
          difficult: Indian law requires every foreign guest to be reported on{" "}
          <Link to="/blog/form-c-foreign-guests-airbnb-hosts-goa" className={ext}>
            Form C
          </Link>{" "}
          within 24 hours.
        </p>

        <h2 className="font-display text-2xl text-foreground mt-8">Being registered isn't the whole job</h2>
        <p>A legal Airbnb in Goa has four ongoing obligations, not one:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>Tourism registration</strong>, with the number shown on every listing.{" "}
            <Link to="/blog/goa-airbnb-registration-rules" className={ext}>
              How to register
            </Link>
            .
          </li>
          <li>
            <strong>Monthly guest statistics</strong> (Form XI) on the TIME app by the 5th of each month. Your registration
            isn't renewed until the previous year's data is in.{" "}
            <Link to="/blog/goa-time-app-airbnb-hosts" className={ext}>
              How TIME works
            </Link>
            .
          </li>
          <li>
            <strong>Form C</strong> for every foreign guest within 24 hours of arrival. The Goa government puts the penalty at
            ₹50,000 per unreported guest.{" "}
            <Link to="/blog/form-c-foreign-guests-airbnb-hosts-goa" className={ext}>
              Form C guide
            </Link>
            .
          </li>
          <li>
            <strong>GST</strong> once rental income crosses ₹20 lakh a year. Below that, platforms like Airbnb generally pay
            GST on your bookings.{" "}
            <Link to="/blog/gst-for-airbnb-hosts-india" className={ext}>
              GST for Airbnb hosts
            </Link>
            .
          </li>
        </ul>

        <h2 className="font-display text-2xl text-foreground mt-8">Is this just an Airbnb rule?</h2>
        <p>
          No. The registration requirement applies to the property, not the platform. The same rules apply whether you list on
          Airbnb, Booking.com, MakeMyTrip, Wayzyy or take bookings directly over WhatsApp. The 2026 order was simply the first
          time platforms were brought into enforcement, which is why it's usually reported as an "Airbnb rule".
        </p>
        <p>
          If you're a host, start with our free{" "}
          <Link to="/goa-host-compliance-checklist" className={ext}>
            Goa Host's Compliance Checklist
          </Link>
          . If you're a guest, check for the registration number and book through a platform that holds your payment until
          check-in.
        </p>
        <p className="text-sm text-muted-foreground">This page explains the rules as published. It isn't legal advice.</p>
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
