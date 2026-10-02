import { BlogLayout } from "@/components/BlogLayout";
import { blogPosts } from "@/lib/blogPosts";
import { HelpCircle } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

const post = blogPosts.find((p) => p.slug === "goa-airbnb-registration-rules")!;

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Is Airbnb legal in Goa?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, but every homestay, B&B, villa rental or apartment listed for short-term rental must be registered under Category D of the Goa Registration of Tourist Trade Rules, 1985. Operating without that registration is what's actually illegal, not the act of listing on Airbnb itself.",
      },
    },
    {
      "@type": "Question",
      name: "What changed for Airbnb hosts in Goa in January 2026?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "An administrative order dated 13 January 2026 made it mandatory to display your tourism registration number directly on your listing. Airbnb, Booking.com and Wayzyy can all be directed by the Goa Tourism Department to remove a listing if the number is missing or invalid.",
      },
    },
    {
      "@type": "Question",
      name: "How long does Goa homestay registration take?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The Department of Tourism states processing can take up to 90 days, so apply three to four months before you intend to go live, not the week before.",
      },
    },
    {
      "@type": "Question",
      name: "How much does it cost to register a homestay or villa in Goa?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Roughly ₹1,000 a year for most Homestay or B&B registrations, plus a variable Fire NOC fee based on property size. Confirm the current fee on goaonline.gov.in, since it's subject to revision.",
      },
    },
    {
      "@type": "Question",
      name: "What is Form XI?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "A monthly filing of occupancy and guest statistics, due online before the 5th of the following month. Missing it is a separate violation from your registration status and can block renewal.",
      },
    },
    {
      "@type": "Question",
      name: "What documents do I need to register a homestay or villa in Goa?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "A trade or house tax receipt, proof of identity, a Fire NOC, and ownership documents (or a lease/notarised NOC if you're not the owner). Properties inside a housing society also need an RWA NOC - usually free, but often the slowest step if the society is unresponsive.",
      },
    },
    {
      "@type": "Question",
      name: "Do I need GST registration to run a homestay in Goa?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "It becomes mandatory once your annual rental income from the property crosses ₹20 lakh, separately from your tourism registration. Confirm the specifics with a tax professional.",
      },
    },
    {
      "@type": "Question",
      name: "Why did my listing get rejected even though I'm registered with the government?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Government registration and a platform's own listing verification are two different checks. Common rejection reasons include photos taken outside the app (so GPS data doesn't embed), an address that doesn't match the verification photos' GPS pin, low-quality images, or an incomplete amenity checklist.",
      },
    },
    {
      "@type": "Question",
      name: "What percentage of Goa hosts are actually registered?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "There's no official public figure. Based on Wayzyy's own host base, roughly 85 to 90 percent are registered - though that's skewed higher than the market overall, since these hosts were recruited through direct outreach to established operators.",
      },
    },
  ],
};

export default function GoaAirbnbRegistrationRules() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const toggleFaq = (index: number) => setOpenFaq(openFaq === index ? null : index);

  return (
    <BlogLayout
      title={post.title}
      description={post.description}
      metaTitle={post.metaTitle}
      metaDescription={post.metaDescription}
      heroImage={post.heroImage}
      heroImageAlt="Illustration of a yellow Goan house front with teal shutters, an arched door, and a blue-bordered tile plaque reading Goa Tourism Reg. No."
      publishedDate={post.publishedDate}
      slug={post.slug}
      extraJsonLd={faqJsonLd}
    >
      <div className="space-y-6">
        <div className="rounded-2xl border border-ember/30 bg-ember/5 p-6">
          <p className="text-sm text-muted-foreground">
            <strong className="text-foreground">Quick answer:</strong> since an administrative order dated 13 January 2026, every short-term rental host in Goa must display their tourism registration number on their listing itself, not just hold one on file. Airbnb, Booking.com and Wayzyy can all be told by the Goa Tourism Department to pull a listing that doesn't comply. Registration itself isn't new - it's required under the Goa Registration of Tourist Trade Rules, 1985 - but enforcement just got a lot more visible.
          </p>
        </div>

        <h2 className="font-display text-2xl text-foreground mt-8">What actually changed</h2>
        <p>
          Short-term rental accommodation in Goa - homestays, B&amp;Bs, rented apartments, villas - has needed to register with the Department of Tourism since 1985, under Category D of the Goa Registration of Tourist Trade Rules. That part isn't new, and it isn't unique to Goa; most Indian states have some version of it. What changed is enforcement.
        </p>
        <p>
          We spoke with an official from Goa's Department of Tourism while working on our own compliance process, and the message was direct: the state is done treating this as a paperwork formality. The January 2026 order requires the registration number to be displayed on the listing itself - not filed away somewhere, visible to anyone booking. Airbnb has already built a dedicated field for Goa hosts to enter it. And platforms, Wayzyy included, can be directed to remove a listing outright if the number is missing or doesn't check out.
        </p>

        <p className="italic text-muted-foreground border-l-2 border-ember pl-4">
          <span className="block not-italic text-xs uppercase tracking-wide text-ember mb-1">What this means in practice</span>
          A listing with no visible registration number isn't just non-compliant on a technicality anymore. It's one complaint away from being pulled, on any platform.
        </p>

        <h2 className="font-display text-2xl text-foreground mt-8">The part that actually trips hosts up: timing</h2>
        <p>
          The Department of Tourism states that processing can take up to 90 days. That's not a worst case - it's the stated normal. Hosts who apply the week they want to go live are the ones who end up stuck.
        </p>
        <p>
          We saw this directly during onboarding. One host came to us with nine properties ready to list. He could only make one of them live. The rest had registration documents that were incomplete or stuck in process, and there was nothing to do but wait. Nine properties, one listing, for months - not because of anything wrong with the properties, but because registration wasn't started early enough.
        </p>

        <h2 className="font-display text-2xl text-foreground mt-8">It's not a one-time form</h2>
        <p>
          Registration gets most of the attention, but it's not where compliance ends. Registered hosts also have to file <strong>Form XI</strong> - a monthly return of occupancy and guest statistics - online, before the 5th of the following month. Miss it, and that's treated as its own separate violation from your registration status, one that can block your renewal even if the original registration was never in question.
        </p>
        <p>In other words: registering is the entry fee. Form XI is the recurring bill, and it's the one hosts more commonly forget.</p>

        <h2 className="font-display text-2xl text-foreground mt-8">What it actually costs</h2>
        <p>
          For most Homestay or B&amp;B registrations, the government fee is roughly ₹1,000 a year, plus a variable Fire NOC fee that scales with the size of the property. That's the official cost. The real cost, for a lot of hosts, is the 90-day wait and the paperwork - proof of ownership or a rental agreement, identity documents, a site plan - not the fee itself.
        </p>

        <h2 className="font-display text-2xl text-foreground mt-8">The documents you'll actually need</h2>
        <p>
          Per the Department of Tourism's own 13 January 2026 order, the list is shorter than it used to be - it was deliberately trimmed to cut the paperwork burden. You'll need: the original trade tax or house tax receipt for the property, proof of identity (Aadhaar, passport, driving licence, or PAN), a Fire NOC from the Directorate of Fire and Emergency Services, and ownership documents (title deed, gift deed, sale deed, or Form I &amp; XIV). If you don't own the property outright, add a lease and licence agreement or a notarised NOC from the owner. If the property sits inside a housing society, add an NOC from the RWA or homeowners' association too.
        </p>
        <p>
          That last one is worth flagging on its own. The Fire NOC fee varies by property size and the Directorate's own assessment, so it's hard to predict. But the RWA or society NOC is usually free or close to it - the cost isn't the problem. The problem is the wait, if your society is slow to respond. Budget time for it, not money.
        </p>

        <h2 className="font-display text-2xl text-foreground mt-8">How the application actually works</h2>
        <p>
          The process itself runs entirely through the{" "}
          <a href="https://goaonline.gov.in" target="_blank" rel="noopener noreferrer" className="text-ember hover:underline">
            Goa Online portal
          </a>{" "}
          (goaonline.gov.in). Create an account with your email and mobile number, fill out <strong>Form XXIII</strong>, upload the documents above, and submit. Save the acknowledgment number you're given - that's what you'll use to track the application's status, and given the 90-day runway, you'll likely be checking it more than once.
        </p>

        <h2 className="font-display text-2xl text-foreground mt-8">GST: the other registration hosts forget</h2>
        <p>
          Tourism registration isn't the only compliance threshold. If your annual rental income from the property crosses ₹20 lakh, GST registration becomes mandatory, separately from anything the Department of Tourism requires. We're not tax advisors, and GST specifics (filing frequency, applicable rate for your situation) are worth confirming with an actual accountant rather than a blog post - but the ₹20 lakh threshold itself is the number hosts most commonly don't realise applies to them until it already has.
        </p>

        <h2 className="font-display text-2xl text-foreground mt-8">A separate problem: why platform listings get rejected</h2>
        <p>
          Government registration is one hurdle. Getting approved by a booking platform's own verification is a different one, and it trips up a surprising number of first-time hosts for reasons that have nothing to do with the Goa Rules. The pattern we see most: photos pulled from a phone gallery instead of taken live inside the platform's app, which means the GPS data needed to confirm location never embeds correctly. Close behind that: a listed address that doesn't quite match the GPS pin from the verification photos, blurry or dark photos that get rejected automatically before any human reviews them, and an incomplete amenity checklist that can quietly drop an otherwise-approved listing out of filtered search results. None of this is about the TTRC number. It's worth knowing anyway, since it's the next wall hosts hit right after clearing the first one. (For the guest side of verification, see our guide on{" "}
          <Link to="/blog/how-to-book-verified-stay-in-goa" className="text-ember hover:underline">
            how to book a verified stay in Goa
          </Link>
          .)
        </p>

        <h2 className="font-display text-2xl text-foreground mt-8">Who's actually registered: a number nobody else has published</h2>
        <p>
          We don't have a government-wide figure, and we're not aware of one being published anywhere. What we do have is a read on our own host base, built from direct outreach rather than self-serve sign-ups. By our own count, somewhere around <strong>85 to 90 percent</strong> of hosts on Wayzyy are registered with Goa Tourism.
        </p>
        <p>
          That number almost certainly runs higher than the Goa short-term rental market as a whole, and we'd say so plainly: Wayzyy's hosts were recruited one conversation at a time, which skews toward people already running this as a real business rather than renting out a spare room occasionally. The pattern we actually see is consistent with that - operators with multiple properties, the ones for whom this is a livelihood rather than a side income, take registration seriously. It's the smaller, single-property hosts who are most likely to let it slide, usually not out of defiance but because the process is slow enough to fall off the to-do list.
        </p>

        <h2 className="font-display text-2xl text-foreground mt-8">What this means if you're booking, not hosting</h2>
        <p>
          A visible registration number is one of the few checks you can actually do yourself before paying for a stay - it means a real, licensed operator is behind the listing, not just a profile with nice photos. It's one of the things we check for before a listing earns the <strong>Wayzyy Verified</strong> badge, alongside the identity checks covered in our guide on{" "}
          <Link to="/blog/how-to-book-verified-stay-in-goa" className="text-ember hover:underline">
            how to book a verified stay in Goa
          </Link>
          .
        </p>

        <h2 className="font-display text-2xl text-foreground mt-8">If you're a host, start here</h2>
        <p>
          This piece is the context: what changed, why, and what we've actually seen happen to hosts who leave it too late. For the actual step-by-step - documents, the exact process on goaonline.gov.in, renewal timelines - we built a free, plain-language reference: the{" "}
          <Link to="/goa-host-compliance-checklist" className="text-ember hover:underline">
            Goa Host's Compliance Checklist
          </Link>
          . Start there, and start before you need to, given the 90-day runway.
        </p>
      </div>

      <div className="border-t border-border mt-16 pt-12">
        <h3 className="font-display text-2xl text-foreground mb-6 flex items-center gap-2">
          <HelpCircle className="w-6 h-6 text-ember" />
          Frequently Asked Questions
        </h3>
        <div className="space-y-4">
          {faqJsonLd.mainEntity.map((faq, index) => (
            <div
              key={index}
              className="border border-border rounded-xl bg-card overflow-hidden transition-all duration-200"
            >
              <button
                onClick={() => toggleFaq(index)}
                className="w-full text-left px-6 py-4 flex items-center justify-between font-display text-foreground hover:bg-muted/50 transition-colors"
              >
                <span>{faq.name}</span>
                <span className="text-muted-foreground font-light text-xl">
                  {openFaq === index ? "−" : "+"}
                </span>
              </button>
              {openFaq === index && (
                <div className="px-6 pb-5 text-muted-foreground border-t border-border/50 pt-4 text-sm leading-relaxed">
                  {faq.acceptedAnswer.text}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </BlogLayout>
  );
}
