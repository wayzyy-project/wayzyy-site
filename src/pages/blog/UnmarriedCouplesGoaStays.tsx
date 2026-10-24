import { BlogLayout } from "@/components/BlogLayout";
import { blogPosts } from "@/lib/blogPosts";
import { HelpCircle } from "lucide-react";
import { Link } from "react-router-dom";

const post = blogPosts.find((p) => p.slug === "unmarried-couples-goa-hotels-villas")!;

const ext = "text-ember hover:underline";

const faqs = [
  {
    q: "Can unmarried couples stay together in a hotel or villa in Goa?",
    a: "Yes. There is no law in India, or in Goa, that stops two consenting adults who aren't married from sharing a hotel room, homestay or villa. Whether a particular property accepts couples is that property's own policy.",
  },
  {
    q: "Is it illegal for unmarried couples to share a hotel room in India?",
    a: "No. The Madras High Court said in 2019 that there are no laws or regulations stopping unmarried adults of the opposite sex from occupying hotel rooms as guests. In 2015 the Bombay High Court called police action against couples in hotels a clear violation of the right to privacy.",
  },
  {
    q: "Do I need a marriage certificate to check in to a hotel in Goa?",
    a: "No law requires one. Hotels and homestays do ask every adult guest for valid photo ID at check-in, and a property can set its own house rules. Check the listing's rules before you book.",
  },
  {
    q: "Why do some hotels refuse unmarried couples?",
    a: "It's a business choice, not a legal requirement. In January 2025 OYO let partner hotels in Meerut refuse unmarried couples at their discretion, citing local feedback. Some hotels across India also refuse guests carrying an ID from the same city.",
  },
  {
    q: "Does Airbnb allow unmarried couples in India?",
    a: "Airbnb's nondiscrimination policy lists marital status as a protected characteristic, so hosts aren't supposed to refuse guests for being married or not. Every adult guest should still expect to show ID at check-in.",
  },
  {
    q: "What ID do couples need for a stay in Goa?",
    a: "A valid government photo ID for each adult, such as Aadhaar, a passport, a driving licence or a voter ID. Foreign guests need their passport and visa, because the host must report them on Form C within 24 hours.",
  },
];

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
};

export default function UnmarriedCouplesGoaStays() {
  return (
    <BlogLayout
      title={post.title}
      description={post.description}
      metaTitle={post.metaTitle}
      metaDescription={post.metaDescription}
      heroImage={post.heroImage}
      heroImageAlt="Illustration of two suitcases and two room keys beside an open villa door in Goa, with palm trees behind"
      publishedDate={post.publishedDate}
      slug={post.slug}
      extraJsonLd={faqJsonLd}
    >
      <div className="space-y-6">
        <div className="rounded-2xl border border-ember/30 bg-ember/5 p-6">
          <p className="text-sm text-muted-foreground">
            <strong className="text-foreground">Short answer: yes.</strong> There's no law in India, or in Goa, that stops two
            unmarried adults from staying together in a hotel, homestay or villa. Indian courts have said so directly. Some
            hotels still refuse couples as their own policy, so check the house rules before you book. Each adult will need a
            valid photo ID at check-in, but nobody can legally demand a marriage certificate.
          </p>
        </div>

        <p>
          This is one of the most-asked questions about travelling in India, and one of the most anxious. Couples planning a
          Goa trip regularly ask whether they'll be turned away at reception, whether they need to carry proof of marriage, or
          whether the police can get involved. The legal answer is clear. The practical answer depends on where you book.
        </p>

        <h2 className="font-display text-2xl text-foreground mt-8">What does the law say?</h2>
        <p>
          No Indian law, central or state, makes it an offence for two consenting adults who aren't married to share a room.
          Goa has no special rule on it either. Courts have confirmed this more than once:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>Madras High Court, 2019:</strong> the court said there are "no laws or regulations forbearing unmarried
            persons of opposite sex to occupy hotel rooms, as guests", and that there's nothing legally wrong in a hotel
            allowing it.
          </li>
          <li>
            <strong>Bombay High Court, 2015:</strong> after police raided hotels near Mumbai and detained couples, the court
            called the police action a clear violation of the right to privacy.
          </li>
        </ul>
        <p>
          The right to privacy is a fundamental right under the Indian Constitution, and adults sharing a room is part of
          their private life.
        </p>

        <p className="italic text-muted-foreground border-l-2 border-ember pl-4">
          <span className="block not-italic text-xs uppercase tracking-wide text-ember mb-1">The distinction that matters</span>
          A hotel refusing couples is following its own policy. It isn't enforcing a law, and no one can require you to prove
          you're married.
        </p>

        <h2 className="font-display text-2xl text-foreground mt-8">So why do some hotels say no?</h2>
        <p>Because they're allowed to set their own house rules. A few patterns you'll come across in India:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>Platform or chain policies.</strong> In January 2025, OYO introduced check-in rules in Meerut that let
            partner hotels refuse unmarried couples at their discretion, citing feedback from local groups. It was a regional
            policy, but it made national news and left many couples unsure what to expect elsewhere.
          </li>
          <li>
            <strong>Local ID refusals.</strong> Some hotels turn away guests whose ID shows an address in the same city. That's
            usually more about the hotel's own caution than about couples.
          </li>
          <li>
            <strong>Individual owners.</strong> A homestay owner who lives on the property may have personal rules. That's
            their call, but it should be stated clearly before you book.
          </li>
        </ul>
        <p>
          In Goa, many villas and apartments are rented as a whole unit with no reception desk at all, which leaves less room
          for surprises. Still, policies vary, and a refusal at check-in on a December night is the last thing you want.
        </p>

        <h2 className="font-display text-2xl text-foreground mt-8">What about Airbnb?</h2>
        <p>
          Airbnb's nondiscrimination policy lists <strong>marital status</strong> as a protected characteristic, which means
          hosts aren't supposed to refuse guests for being married or not. If a host cancels on you for that reason, it goes
          against the platform's own rules, and you can report it.
        </p>
        <p>
          Whichever platform you use, every adult should still expect to show ID. That's a normal check-in step, and for
          foreign guests it's a legal requirement: the host has to report you on{" "}
          <Link to="/blog/form-c-foreign-guests-airbnb-hosts-goa" className={ext}>
            Form C
          </Link>{" "}
          within 24 hours.
        </p>

        <h2 className="font-display text-2xl text-foreground mt-8">How to book in Goa without surprises</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>Read the house rules before you pay.</strong> If a listing is silent on couples and you're unsure, message
            the host first. A clear yes in writing is worth more than a hope at check-in.
          </li>
          <li>
            <strong>Prefer a whole villa or apartment.</strong> You deal with one host, not a front desk, and the booking terms
            are agreed before you arrive.
          </li>
          <li>
            <strong>Carry ID for both of you.</strong> Aadhaar, a passport, a driving licence or a voter ID all work. Foreign
            nationals need a passport and visa.
          </li>
          <li>
            <strong>Pay through the platform.</strong> If you're refused at the door, a platform booking gives you a refund
            route. Cash or UPI paid to a host directly doesn't.
          </li>
          <li>
            <strong>Check the listing is registered.</strong> A Goa Tourism registration number on the listing means a
            legitimate, accountable host. See{" "}
            <Link to="/blog/is-airbnb-legal-in-goa" className={ext}>
              is Airbnb legal in Goa
            </Link>{" "}
            and our guide to{" "}
            <Link to="/blog/how-to-book-verified-stay-in-goa" className={ext}>
              booking a verified stay
            </Link>
            .
          </li>
        </ul>
        <p>
          For where to stay, our{" "}
          <Link to="/blog/where-to-stay-in-goa-2026" className={ext}>
            where to stay in Goa
          </Link>{" "}
          guide breaks it down by area, and{" "}
          <Link to="/blog/north-goa-vs-south-goa-guide" className={ext}>
            North vs South Goa
          </Link>{" "}
          helps if you're choosing between a lively trip and a quiet one.
        </p>
        <p className="text-sm text-muted-foreground">This page explains the legal position as reported. It isn't legal advice.</p>
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
