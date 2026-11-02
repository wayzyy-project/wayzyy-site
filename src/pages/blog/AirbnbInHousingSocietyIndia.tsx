import { BlogLayout } from "@/components/BlogLayout";
import { blogPosts } from "@/lib/blogPosts";
import { HelpCircle } from "lucide-react";
import { Link } from "react-router-dom";

const post = blogPosts.find((p) => p.slug === "airbnb-in-housing-society-india")!;

const ext = "text-ember hover:underline";

const faqs = [
  {
    q: "Can I run an Airbnb in my housing society flat in India?",
    a: "Only if your society allows it, and your state's homestay rules accept flats. A housing society can restrict short-term rentals through its bye-laws and general body resolutions, and courts in Mumbai have upheld such restrictions. Some states, like Himachal Pradesh, don't register flats as homestays at all.",
  },
  {
    q: "Can a housing society ban Airbnb?",
    a: "It can restrict it. In December 2025 the Bombay High Court said a member couldn't host paying guests while a society resolution against it stood, and told him to challenge the resolution in the Cooperative Court. In March 2026 a Mumbai cooperative court upheld the society's rules, calling short-stay listings on web portals commercial activity.",
  },
  {
    q: "Is renting a flat on Airbnb commercial use?",
    a: "A Mumbai cooperative court said in March 2026 that listing flats for short stays on web portals is 'nothing but commercial activity', comparable to running a hotel. The same court said longer stays, such as 11-month paying guest arrangements, are different.",
  },
  {
    q: "Do I need a society NOC to rent my flat?",
    a: "For ordinary long-term renting in Maharashtra, Maharashtra's housing minister said in 2022 that no society NOC is needed. Short-term rentals are different: Goa's tourism registration asks for a society or RWA NOC for flats, Himachal Pradesh required an RWA NOC for apartments, and Mumbai's new short-term rental policy requires a no-objection from the society.",
  },
  {
    q: "What if my society has no rule against Airbnb?",
    a: "Then the society hasn't restricted it yet, but it can pass a resolution at a general body meeting. The safest approach is to tell the committee before you list, agree on guest rules, and get the decision in writing.",
  },
  {
    q: "Can my society fine me for hosting Airbnb guests?",
    a: "Societies have tried. In the Mumbai case, the society imposed daily charges on the member for hosting paying guests. The court upheld the society's rules, though the reported judgment didn't set out a general rule on fines. If you're facing one, get advice from a lawyer who handles cooperative society disputes.",
  },
];

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
};

export default function AirbnbInHousingSocietyIndia() {
  return (
    <BlogLayout
      title={post.title}
      description={post.description}
      metaTitle={post.metaTitle}
      metaDescription={post.metaDescription}
      heroImage={post.heroImage}
      heroImageAlt="Illustration of an apartment building with one lit flat, a Society Notice board, a security booth and a suitcase in front"
      publishedDate={post.publishedDate}
      slug={post.slug}
      extraJsonLd={faqJsonLd}
    >
      <div className="space-y-6">
        <div className="rounded-2xl border border-ember/30 bg-ember/5 p-6">
          <p className="text-sm text-muted-foreground">
            <strong className="text-foreground">Short answer:</strong> you can run an Airbnb from a flat in a housing society
            only if the society allows it and your state accepts flats as homestays. Societies can restrict short-term
            rentals through bye-laws and general body resolutions, and Mumbai courts have backed them: in March 2026 a
            cooperative court called short-stay listings "nothing but commercial activity". Long-term renting is treated
            differently. Talk to your society before you list, and get its decision in writing.
          </p>
        </div>

        <p>
          Most homes in Indian cities are flats in housing societies, so for many would-be hosts this is the real question,
          not whether Airbnb is legal. A flat that's perfectly fine to rent out for 11 months can be off-limits for two-night
          stays. Here's what the law and recent rulings say, and how to approach it with your society.
        </p>

        <h2 className="font-display text-2xl text-foreground mt-8">What the courts have said</h2>
        <p>The clearest rulings come from Mumbai, from the same long-running dispute:</p>
        <ul className="list-disc pl-6 space-y-3">
          <li>
            <strong>Bombay High Court, December 2025</strong> (<em>Mahesh K Mehta v. Bharatiya Friend's Cooperative Housing
            Society</em>). A senior citizen wanted to host paying guests through platforms like Airbnb. His society had passed
            a resolution in 2008 barring members from taking paying guests without permission. The court dismissed his writ
            petition, said he couldn't host paying guests while the resolution stood, and told him to pursue the matter in the
            Cooperative Court.
          </li>
          <li>
            <strong>Mumbai cooperative court, March 2026</strong>, in the same dispute. The court found that listing flats on
            web portals for short stays is "nothing but commercial activity", comparable to running a hotel, and not permitted
            in a residential cooperative society without explicit consent. It upheld the society's rules, citing the
            residential character of the building and the safety of members. It also noted that longer paying-guest
            arrangements, like 11-month stays, are a different matter.
          </li>
        </ul>
        <p>
          These are Maharashtra rulings, but the principle, that a society's bye-laws and general body resolutions bind its
          members until they're set aside, applies to cooperative societies across India.
        </p>

        <p className="italic text-muted-foreground border-l-2 border-ember pl-4">
          <span className="block not-italic text-xs uppercase tracking-wide text-ember mb-1">The key distinction</span>
          Renting your flat to a tenant is residential use. Renting it to a new guest every few nights, through a platform,
          is increasingly treated as commercial use.
        </p>

        <h2 className="font-display text-2xl text-foreground mt-8">Long-term renting vs short stays</h2>
        <p>
          This is where owners often get confused. In 2022, Maharashtra's housing minister said owners don't need a society
          NOC to sell or rent out a flat, since the model bye-laws don't require one. That's about ordinary renting. Short-term
          rentals are a separate question, and the rules for them increasingly <em>do</em> ask for the society's consent:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>Goa:</strong> tourism registration for a flat in a housing society needs a no-objection from the society
            or RWA.{" "}
            <Link to="/blog/goa-airbnb-registration-rules" className={ext}>
              Goa registration guide
            </Link>
            .
          </li>
          <li>
            <strong>Mumbai:</strong> the BMC's approved Short Term Rental Licensing Policy requires a no-objection from the
            society or other permanent residents before a licence is issued.
          </li>
          <li>
            <strong>Himachal Pradesh:</strong> its 2025 rules first required an RWA NOC for apartments, then stopped
            registering homestays in flats altogether.
          </li>
          <li>
            <strong>Kerala:</strong> homestays must be owner-occupied, which rules out most rented-out flats.
          </li>
        </ul>
        <p>
          Our{" "}
          <Link to="/blog/homestay-registration-rules-by-state-india" className={ext}>
            state-by-state registration guide
          </Link>{" "}
          has the rules for each state.
        </p>

        <h2 className="font-display text-2xl text-foreground mt-8">Why societies push back</h2>
        <p>
          In the Mumbai case, the society's arguments were security, foreign guests it hadn't been told about, and the flat
          effectively becoming a guest house. Those are the usual concerns: strangers using lifts and common areas, guests
          who don't know the building's rules, late-night noise, and no one knowing who's in the building. Most society
          disputes are about these practical issues, not about the platform.
        </p>

        <h2 className="font-display text-2xl text-foreground mt-8">How to approach your society</h2>
        <ol className="list-decimal pl-6 space-y-3">
          <li>
            <strong>Read your bye-laws and past resolutions.</strong> Check whether a general body meeting has already
            restricted paying guests or short stays. If it has, you can't simply ignore it.
          </li>
          <li>
            <strong>Talk to the committee before you list.</strong> Explain who'll stay, for how long, and how you'll manage
            check-ins and guests.
          </li>
          <li>
            <strong>Offer house rules.</strong> Guest ID shared with security, maximum occupancy, quiet hours, no parties, a
            local contact for the society to call.
          </li>
          <li>
            <strong>Get the decision in writing.</strong> You'll need the NOC for registration in several states anyway.
          </li>
          <li>
            <strong>Register with your state</strong> where it's required, and file Form C for any foreign guest within 24
            hours.
          </li>
        </ol>
        <p>
          If the society says no, the options are to challenge the resolution through the proper forum, which for
          cooperative societies is usually the Cooperative Court, or to consider longer stays instead. Listing anyway
          invites penalties and a dispute you're likely to lose.
        </p>

        <h2 className="font-display text-2xl text-foreground mt-8">If you're a guest</h2>
        <p>
          Booking a flat in a housing society is legal for guests. Expect the building's security to ask for ID, follow the
          society's rules on noise and common areas, and book through a platform, so you have a refund route if building
          security turns you away. Our guide to{" "}
          <Link to="/blog/how-to-book-verified-stay-in-goa" className={ext}>
            booking a verified stay
          </Link>{" "}
          covers the other checks, and{" "}
          <Link to="/blog/is-airbnb-legal-in-india" className={ext}>
            is Airbnb legal in India
          </Link>{" "}
          explains the wider rules.
        </p>
        <p className="text-sm text-muted-foreground">
          This page summarises reported court decisions and published rules. It isn't legal advice. Society disputes depend
          on your bye-laws and state law, so speak to a lawyer for your specific case.
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
