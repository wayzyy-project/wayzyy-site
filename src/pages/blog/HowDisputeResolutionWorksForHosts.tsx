import { BlogLayout } from "@/components/BlogLayout";
import { blogPosts } from "@/lib/blogPosts";
import { HelpCircle } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

const post = blogPosts.find((p) => p.slug === "how-dispute-resolution-works-for-hosts")!;

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What counts as evidence in a Wayzyy dispute?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Timestamped photos, in-app messages, and check-in and check-out documentation carry the most weight. Evidence submitted after the fact, with no timestamp trail, is weighed accordingly.",
      },
    },
    {
      "@type": "Question",
      name: "How long does a dispute take on Wayzyy?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "There are three levels. Level 1 gives both sides up to 24 hours to resolve it in the app chat. Level 2 is Wayzyy mediation, with a decision within 48 hours of the evidence being complete. Level 3 is a final review you can request within 7 days of the Level 2 outcome.",
      },
    },
    {
      "@type": "Question",
      name: "Is a guest allowed to threaten a bad review to get a refund?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. Wayzyy's Review & Rating Policy names a guest threatening a negative review to extract an unapproved refund as prohibited review extortion, and content involving it is deleted.",
      },
    },
    {
      "@type": "Question",
      name: "Will one bad review or dispute hurt my listing's visibility?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "A dispute on its own isn't a ranking factor. Automated warnings start only once a listing has at least five reviews and its average falls below 4.0.",
      },
    },
    {
      "@type": "Question",
      name: "What happens to guests who repeatedly cause problems?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Doctored evidence leads to an immediate permanent ban, and a guest who doesn't pay a validated damage invoice within 7 days is suspended across the marketplace.",
      },
    },
    {
      "@type": "Question",
      name: "Can a removed guest just make a new account?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "It's much harder than on a platform that only asks for an email and a phone number, because accounts are anchored to a verified identity through Aadhaar and DigiLocker.",
      },
    },
    {
      "@type": "Question",
      name: "What is a double-blind review?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Neither host nor guest can see the other's review until both have submitted, or until the 14-day window after checkout closes.",
      },
    },
  ],
};

export default function HowDisputeResolutionWorksForHosts() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const toggleFaq = (index: number) => setOpenFaq(openFaq === index ? null : index);

  return (
    <BlogLayout
      title={post.title}
      description={post.description}
      metaTitle={post.metaTitle}
      metaDescription={post.metaDescription}
      heroImage={post.heroImage}
      heroImageAlt="Illustration of a guest's one-star review threat in a chat bubble beside a shield labelled Evidence first"
      publishedDate={post.publishedDate}
      slug={post.slug}
      extraJsonLd={faqJsonLd}
    >
      <div className="space-y-6">
        <p>
          Most hosts don't leave a platform because hosting got harder. They leave because, at the one moment they needed the platform to actually back them, it didn't. If you've been at this a while, you probably already know exactly which moment we mean.
        </p>

        <h2 className="font-display text-2xl text-foreground mt-8">The pattern hosts already know</h2>
        <p>
          It tends to go the same way everywhere. Day three of a four-night stay, a guest messages that something isn't right: the AC is "barely working," the pool "wasn't clean." Then comes the line that changes the whole conversation, that they'd hate to have to mention it in their review. Support, working from a script and with no feel for what a villa in Goa actually needs, grants the refund to close the ticket. Your calm, documented account of what happened gets filed as one side of a "he-said, she-said."
        </p>
        <p>
          And here's the thing: the guest's leverage was never really about what happened in the room. It was about the review, sitting there unfiled, as a threat. One of the case studies we built Wayzyy around is a Superhost with ten years and thousands of reviews who lost a night to exactly this, and then watched their warning to other hosts get deleted while the guest's one-star stayed up.
        </p>

        <div className="rounded-2xl border border-ember/30 bg-ember/5 p-6 my-8">
          <p className="text-xs uppercase tracking-wide text-ember mb-2">Why this keeps happening on legacy platforms</p>
          <p className="italic text-foreground mb-2">
            Reviews are visible and mutable at the same time, so whoever holds theirs back the longest holds the leverage.
          </p>
          <p className="text-sm text-muted-foreground">
            Once a review can be dangled, submitted, or withdrawn depending on how a dispute goes, it stops measuring the stay and starts measuring who blinked first.
          </p>
        </div>

        <h2 className="font-display text-2xl text-foreground mt-8">What's built to stop it</h2>
        <p>Three things, and the nice part is that none of them depends on you winning an argument in the moment.</p>
        <ul>
          <li>
            <strong>The threat itself is against the rules.</strong> Our{" "}
            <Link to="/policies/review-rating" className="text-ember hover:underline">
              Review &amp; Rating Policy
            </Link>{" "}
            names this exact tactic: using the review system as a financial threat, including a guest threatening a negative review to extract an unapproved refund, is prohibited "review extortion," and content involving it is deleted. It cuts both ways, too: a host can't withhold a positive review to coerce a waiver on a valid damage claim.
          </li>
          <li>
            <strong>Reviews can't be traded.</strong> Only a guest who actually completed a check-in can review a stay, and reviews are double-blind: neither side sees the other's until both are in, or until the 14-day window after checkout closes.
          </li>
          <li>
            <strong>Complaints about the listing have a deadline.</strong> A claim that the property doesn't match its listing must be filed within two hours of physical check-in, with geotagged photos. A guest who stays past that window is treated as having accepted the property's condition.
          </li>
        </ul>

        <p className="italic text-muted-foreground border-l-2 border-ember pl-4">
          <span className="block not-italic text-xs uppercase tracking-wide text-ember mb-1">An honest note</span>
          None of this stops honest criticism. A guest who had a genuinely bad stay can still say so in their review, and Wayzyy won't remove it because you'd rather it wasn't there. The rules are aimed at using a review as a bargaining chip, not at reviews themselves.
        </p>

        <h2 className="font-display text-2xl text-foreground mt-8">How a dispute actually moves</h2>
        <p>
          The{" "}
          <Link to="/policies/dispute-resolution" className="text-ember hover:underline">
            Dispute Resolution Policy
          </Link>{" "}
          sets out three levels, and you go through them in order.
        </p>

        <div className="my-8">
          <img
            src="/blog/wayzyy-dispute-resolution-levels.webp"
            alt="Diagram of Wayzyy's three dispute levels: talk it through in the app for up to 24 hours, Wayzyy mediation with a decision within 48 hours, and a final review requested within 7 days"
            className="w-full rounded-2xl border border-border object-cover"
            loading="lazy"
          />
          <span className="text-xs text-muted-foreground mt-2 block text-center">
            The three escalation levels, per Wayzyy's Dispute Resolution Policy.
          </span>
        </div>

        <div className="overflow-x-auto my-6 border border-border rounded-xl">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-muted/50 border-b border-border font-display text-foreground">
                <th className="p-4 font-semibold">Level</th>
                <th className="p-4 font-semibold">Window</th>
                <th className="p-4 font-semibold">What happens</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60 text-muted-foreground">
              <tr>
                <td className="p-4 font-medium text-foreground">1 — Talk it through</td>
                <td className="p-4">Up to 24 hours</td>
                <td className="p-4">In-app chat only. Both sides try to agree; off-platform agreements aren't considered later.</td>
              </tr>
              <tr>
                <td className="p-4 font-medium text-foreground">2 — Wayzyy mediation</td>
                <td className="p-4">Log within 72h of checkout</td>
                <td className="p-4">Compliance reviews chat, photos and history; decides within 48h of complete evidence.</td>
              </tr>
              <tr>
                <td className="p-4 font-medium text-foreground">3 — Final review</td>
                <td className="p-4">Request within 7 days</td>
                <td className="p-4">A senior lead with no part in Level 2 issues Wayzyy's final word.</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p>
          Two honest limits: Wayzyy is a marketplace intermediary, not a party to your rental agreement, and none of this replaces your right to go to court if you need to.
        </p>

        <h2 className="font-display text-2xl text-foreground mt-8">What "evidence-first" means in practice</h2>
        <p>
          The policy is refreshingly blunt about it. Photos need their original, unedited metadata showing the exact date, time and GPS location, and cropped files get discarded. Chat logs have to be complete and continuous, not a few convenient screenshots. Everything goes through the app dashboard or support@wayzyy.com, because evidence sent through other platforms is rejected. And doctored evidence is treated as fraud, with an immediate permanent ban.
        </p>
        <p>
          That last rule is what stops a late-night photo set of "replaced bedding" from beating your clean check-in photos just because it arrived first.
        </p>

        <h2 className="font-display text-2xl text-foreground mt-8">Mistakes that quietly weaken your case</h2>
        <p>Most hosts who lose a dispute didn't do anything unreasonable. They just made one of these small moves under pressure:</p>
        <ul>
          <li><strong>Taking it to WhatsApp "to sort it out quickly."</strong> It feels friendlier, but off-platform agreements are completely barred from consideration later.</li>
          <li><strong>Missing the clocks.</strong> You have 72 hours after checkout to escalate a stay dispute and 24 hours to file a damage claim. Late claims aren't just weaker, they're barred.</li>
          <li><strong>Replying in the heat of the moment.</strong> Keep your messages factual: what you observed, when, and what you offered.</li>
          <li><strong>Having no baseline.</strong> To qualify for damage mediation, you need dated photos from a walkthrough right before arrival, plus a walkthrough at checkout, before any cleaning or repairs.</li>
          <li><strong>Editing or embellishing anything.</strong> Cropped files are discarded and doctored evidence means a permanent ban. Leave the record as it is.</li>
        </ul>

        <div className="my-8">
          <img
            src="/blog/wayzyy-dispute-deadlines-diagram.webp"
            alt="Four deadlines hosts and guests should know: 2 hours after check-in for listing-mismatch claims, 24 hours after checkout for damage claims, 72 hours after checkout to escalate a stay dispute, and 7 days to request a Level 3 review"
            className="w-full rounded-2xl border border-border object-cover"
            loading="lazy"
          />
          <span className="text-xs text-muted-foreground mt-2 block text-center">
            Deadlines from the Dispute Resolution and Damage &amp; Security Policies.
          </span>
        </div>

        <h2 className="font-display text-2xl text-foreground mt-8">Cutting down disputes before they start</h2>
        <p>
          Honestly, a lot of disputes aren't really disputes. They're expectation gaps. The guest arrived expecting one thing and found another, and the argument is about who's to blame rather than what's true. The fix is mostly in your listing.
        </p>
        <p>
          Describe the place the way it actually is, including the AC that takes ten minutes to cool a room or the construction next door. State your house rules, cancellation terms and any deposit up front, in writing. Keep an inventory of your high-value items with their purchase invoices, since damage claims need them (the{" "}
          <Link to="/policies/damage-security" className="text-ember hover:underline">
            Damage &amp; Security Policy
          </Link>{" "}
          spells out exactly what's required). It's the flip side of the "catfished property" problem we cover in our guide for guests on{" "}
          <Link to="/blog/how-to-book-verified-stay-in-goa" className="text-ember hover:underline">
            how to book a verified stay in Goa
          </Link>
          : guests are being told to check for exactly these things, so hosts who are upfront get fewer disputes and better reviews.
        </p>

        <h2 className="font-display text-2xl text-foreground mt-8">What does and doesn't affect your visibility</h2>
        <p>
          Search placement is driven by your rating health, review volume, how quickly you respond, and booking completion rate, and it can't be bought. A dispute on its own isn't a ranking factor.
        </p>
        <p>
          Automated consequences only start once a listing has at least five reviews. An average of 3.0 to 3.9 brings a warning and a drop in placement, and below 3.0 the listing is suspended pending a compliance review. At 4.0 and above you're in good standing. So one difficult stay won't sink you. What matters is the overall pattern.
        </p>

        <h2 className="font-display text-2xl text-foreground mt-8">Guests who don't play fair</h2>
        <p>
          Doctored evidence brings an immediate permanent ban. A guest who doesn't pay a validated damage invoice within 7 days is suspended across the whole marketplace and gets a permanent non-payment marker on their profile. And because accounts are anchored to a verified identity, it's much harder for someone to just reappear under a fresh email.
        </p>

        <h2 className="font-display text-2xl text-foreground mt-8">If you're in a dispute right now</h2>
        <ol className="list-decimal pl-6 space-y-2 text-muted-foreground text-[15px] leading-relaxed">
          <li><strong className="text-foreground">Document immediately.</strong> Unedited photos with their original date, time and GPS data, alongside your dated walkthrough photos from before arrival.</li>
          <li><strong className="text-foreground">Keep it in the app.</strong> Level 1 gives you both up to 24 hours to resolve it in the chat.</li>
          <li><strong className="text-foreground">Escalate in time.</strong> Tap "Escalate to Wayzyy" or email support@wayzyy.com with the booking reference: within 72 hours of checkout for stay disputes, 24 hours for damage claims.</li>
          <li><strong className="text-foreground">Know the endgame.</strong> A Level 2 decision comes within 48 hours of the evidence being complete, and you can ask for a Level 3 review within 7 days.</li>
        </ol>
        <p>
          For the exact terms, see our{" "}
          <Link to="/policies" className="text-ember hover:underline">
            policies page
          </Link>
          . Related reading:{" "}
          <Link to="/blog/hidden-costs-of-running-an-airbnb" className="text-ember hover:underline">
            the hidden costs of running an Airbnb
          </Link>
          ,{" "}
          <Link to="/blog/why-we-decided-to-build-wayzyy-differently" className="text-ember hover:underline">
            why we built Wayzyy differently
          </Link>
          , and the{" "}
          <Link to="/earnings-calculator" className="text-ember hover:underline">
            earnings calculator
          </Link>
          .
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
