import { BlogLayout } from "@/components/BlogLayout";
import { blogPosts } from "@/lib/blogPosts";
import { HelpCircle } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

const post = blogPosts.find((p) => p.slug === "how-to-book-verified-stay-in-goa")!;

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Is it safe to book a short-term rental in Goa?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Generally, yes, but listing volume has grown faster than verification standards across the market. Booking through a platform that checks identity on both sides and keeps payment on the platform removes most of the real risk.",
      },
    },
    {
      "@type": "Question",
      name: "How do I know if a Goa villa listing is fake?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Common signs are a host who asks for an advance payment by UPI or bank transfer outside the platform, pushes you to WhatsApp before you book, can't send a fresh video of the property, or uses photos that appear on other listings.",
      },
    },
    {
      "@type": "Question",
      name: "What does Aadhaar-verified actually mean on a listing?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "It means the host confirmed their identity against a government-issued ID, typically via DigiLocker, rather than just a profile photo. It doesn't prove a property matches its photos, but it means there's a real, traceable person accountable for the listing.",
      },
    },
    {
      "@type": "Question",
      name: "Is it normal for a host to ask for a cash security deposit at check-in?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "A deposit can be legitimate, but it should be stated up front, with the amount and refund terms in writing on the platform. A surprise cash or UPI deposit demanded at the door is a red flag.",
      },
    },
    {
      "@type": "Question",
      name: "How can I tell if a listing's photos are misleading?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Reverse-search the photos, ask the host for a short recent video of the amenities you're paying for, and check whether recent reviews mention the same details.",
      },
    },
    {
      "@type": "Question",
      name: "What should I do if a host cancels last minute?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Keep communication on the platform rather than switching to phone or WhatsApp, and raise a dispute immediately instead of trying to sort it out privately.",
      },
    },
    {
      "@type": "Question",
      name: "How long do I have to report a problem with a listing?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "If the property doesn't match its listing, you need to file within two hours of physical check-in, with unedited, geotagged photos, through support@wayzyy.com.",
      },
    },
    {
      "@type": "Question",
      name: "Why do some platforms hide reviews until after your stay?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "It's called a double-blind review system. Neither side can see the other's review until both are submitted or the 14-day window after checkout closes.",
      },
    },
  ],
};

export default function HowToBookVerifiedStayGoa() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const toggleFaq = (index: number) => setOpenFaq(openFaq === index ? null : index);

  return (
    <BlogLayout
      title={post.title}
      description={post.description}
      metaTitle={post.metaTitle}
      metaDescription={post.metaDescription}
      heroImage={post.heroImage}
      heroImageAlt="Illustration of a lit Goan villa at night with an Aadhaar-verified stamp"
      publishedDate={post.publishedDate}
      slug={post.slug}
      extraJsonLd={faqJsonLd}
    >
      <div className="space-y-6">
        <p>
          In 2025, Goa added over 2,300 new short-term rental listings, more than any other Indian market. That's a lot more choice for travellers, and a lot more room for things to go wrong: verification hasn't kept pace with the boom, and that gap is exactly where the scams live.
        </p>

        <h2 className="font-display text-2xl text-foreground mt-8">Why this matters more in Goa than most places</h2>
        <p>
          Goa's rental market leans heavily on travellers booking from outside the state, or outside the country, without ever seeing the property in person. You're sending money to someone you've never met, for a place you've never stood in. That's perfectly fine when a system verifies who's on the other end. It's a gamble when nothing does.
        </p>
        <p>Two patterns cause most of the damage.</p>

        <h3 className="font-display text-xl text-foreground mt-6">1. The phantom listing</h3>
        <p>
          A fake "host" lists a villa they don't own or manage, collects an advance by UPI, and vanishes. You usually find out when you reach the address and nobody's there, or when the number stops ringing. Nothing about the stay ever existed.
        </p>

        <h3 className="font-display text-xl text-foreground mt-6">2. The "catfished" property</h3>
        <p>
          The villa is real, but it isn't the one in the photos. The listing leans on heavily edited, years-old, or wide-angle shots, while the actual place is poorly maintained, missing advertised amenities like WiFi, a pool, or working AC, or sits next to noisy construction. It's a greyer area than a phantom listing, but you still end up on a trip that isn't the one you paid for.
        </p>

        <p className="italic text-muted-foreground border-l-2 border-ember pl-4">
          <span className="block not-italic text-xs uppercase tracking-wide text-ember mb-1">An honest caveat</span>
          No badge is a guarantee. Identity checks make sure a real, traceable person is accountable for the listing, and property checks make a phantom listing much harder to publish. But photos can still flatter a place, which is why the checks below are worth the five minutes.
        </p>

        <div className="my-8">
          <img
            src="/blog/goa-rental-scam-types-diagram.webp"
            alt="Diagram comparing two Goa rental scams: a phantom listing where a UPI advance leads to an empty plot, and a catfished property where the real villa lacks the pool, WiFi and AC shown in the photos"
            className="w-full rounded-2xl border border-border object-cover"
            loading="lazy"
          />
          <span className="text-xs text-muted-foreground mt-2 block text-center">
            The two scams behind most bad Goa bookings: no property at all, or a real property that isn't the one advertised.
          </span>
        </div>

        <h2 className="font-display text-2xl text-foreground mt-8">What "Aadhaar-verified" actually means</h2>
        <p>
          A verification badge only matters if you know what's behind it. On a genuinely verified marketplace, both host and guest confirm identity against a government-issued ID, usually through{" "}
          <a href="https://www.digilocker.gov.in" target="_blank" rel="noopener noreferrer" className="text-ember hover:underline">
            DigiLocker
          </a>
          , before either side can transact. That's very different from a platform that just asks for a phone number and an email, which anyone can fabricate in five minutes.
        </p>
        <p>
          At Wayzyy, hosts and guests are both verified through Aadhaar and DigiLocker. Identity is only half of it, though. Listings that earn the <strong>Wayzyy Verified</strong> badge have also been screened on the property side: the host's state tourism registration number, proof of ownership or authorised tenancy, and a match between the listing photos and the property's location data. Under our{" "}
          <Link to="/policies/review-rating" className="text-ember hover:underline">
            Review &amp; Rating Policy
          </Link>
          , the badge is stripped if confirmed guest reviews show the property materially differs from its listing.
        </p>
        <p>
          What that buys you as a guest: if the property doesn't match the listing or the host goes silent, there's a real, accountable identity behind the account, and a check on whether the property is theirs to rent in the first place.
        </p>

        <h2 className="font-display text-2xl text-foreground mt-8">Seven warning signs a Goa listing isn't what it claims</h2>
        <ul>
          <li><strong>An advance payment outside the platform.</strong> A UPI or bank transfer "to save on fees" is the classic phantom-listing move. Once money leaves the platform, there's no dispute route left.</li>
          <li><strong>Pressure to move to WhatsApp or a call before you've booked.</strong> Verified marketplaces flag this kind of platform-evasion precisely because it's how scams route around their protections.</li>
          <li>
            <strong>A location that's stretched.</strong> "2 mins from Anjuna beach" that turns out to be a 20-minute ride inland, in a quiet pocket with no easy way back at night. Drop the pin into a maps app and check the real road distance (our{" "}
            <Link to="/blog/anjuna-goa-beach-guide" className="text-ember hover:underline">
              Anjuna beach guide
            </Link>{" "}
            is a good calibration for what "close" actually looks like there).
          </li>
          <li>
            <strong>A surprise offline security deposit.</strong> A host who asks for unrecorded cash or a UPI deposit at check-in, with no refund terms written down. On Wayzyy, damage is handled through a documented claim and an invoice paid on the platform (see the{" "}
            <Link to="/policies/damage-security" className="text-ember hover:underline">
              Damage &amp; Security Policy
            </Link>
            ), not a cash handover at the door.
          </li>
          <li><strong>Reviews that all sound like one person.</strong> Templated praise with no specific detail about the stay.</li>
          <li><strong>No cancellation policy you can find before booking.</strong> A legitimate host has nothing to hide here.</li>
          <li><strong>Photos that don't add up.</strong> Mismatched furniture between shots, everything shot ultra-wide, or no pictures of the exterior or of the amenities you're paying for.</li>
        </ul>

        <p className="italic text-muted-foreground border-l-2 border-ember pl-4">
          <span className="block not-italic text-xs uppercase tracking-wide text-ember mb-1">Quick check</span>
          If a host asks you to talk or pay off-platform before you've confirmed the booking, treat that as a stop sign, not a discount.
        </p>

        <h2 className="font-display text-2xl text-foreground mt-8">A five-minute check before you pay</h2>
        <p>None of this takes long, and it catches most of the problems above.</p>

        <div className="my-8">
          <img
            src="/blog/goa-dispute-deadline-timeline.webp"
            alt="Timeline showing a two-hour window after check-in to file a listing-mismatch claim, plus an automatic full refund if the host is unreachable for an hour"
            className="w-full rounded-2xl border border-border object-cover"
            loading="lazy"
          />
          <span className="text-xs text-muted-foreground mt-2 block text-center">
            Under Wayzyy's Dispute Resolution Policy, the window to report a listing mismatch is two hours from physical check-in.
          </span>
        </div>

        <ol className="list-decimal pl-6 space-y-2 text-muted-foreground text-[15px] leading-relaxed">
          <li><strong className="text-foreground">Pin it.</strong> Drop the location into a maps app, check the real road distance and travel time, and switch to satellite view to spot construction or empty plots next door.</li>
          <li><strong className="text-foreground">Reverse-search the photos.</strong> A quick reverse image search shows whether the same pictures appear on other listings or websites.</li>
          <li><strong className="text-foreground">Ask for a fresh video.</strong> A short, recent clip sent through the in-app chat, showing the pool, the AC running, the WiFi. A genuine host says yes without fuss.</li>
          <li><strong className="text-foreground">Read the sub-scores and look for the badge.</strong> Wayzyy guests rate Accuracy and Location separately from the overall stars, and those two tell you the most about a "catfished" listing.</li>
          <li><strong className="text-foreground">Read the money terms.</strong> Cancellation, refund, and any deposit, in writing, on the platform, before you pay.</li>
          <li><strong className="text-foreground">Keep chat and payment on-platform.</strong> Every protection after this point depends on it.</li>
        </ol>

        <h2 className="font-display text-2xl text-foreground mt-8">Blind reviews are a better signal than star ratings</h2>
        <p>
          Star ratings are easy to game. Two things make Wayzyy's reviews harder to game. First, only a guest who actually completed a check-in can review a stay, so there's no reviewing a booking that never happened. Second, reviews are <strong>double-blind</strong>: neither side can see the other's review until both are in, or until the 14-day window after checkout closes. That removes the incentive to trade a good review for a good one, which is how a lot of inflated scores happen in practice.
        </p>

        <h2 className="font-display text-2xl text-foreground mt-8">If something's actually wrong when you arrive</h2>
        <p>
          Speed matters more than most guests realise. Under Wayzyy's{" "}
          <Link to="/policies/dispute-resolution" className="text-ember hover:underline">
            Dispute Resolution Policy
          </Link>
          , a claim that the property doesn't match its listing has to be filed within <strong>two hours of physical check-in</strong>, with unedited, geotagged photos, through support@wayzyy.com. If you stay the night or use the amenities past that window, you're treated as having accepted the property's condition.
        </p>
        <p>
          If the misrepresentation is validated and the host doesn't fix it straight away, you get a full refund and the listing is suspended. If the host is completely unreachable for an hour at check-in, the policy triggers an automatic 100% refund (platform fees included), suspends the host, and adds a ₹500 credit to your profile. Keep every message in the app: agreements made over WhatsApp or calls aren't considered in later reviews.
        </p>
        <p>
          Curious how that process looks from the other side of the door? We've written up{" "}
          <Link to="/blog/how-dispute-resolution-works-for-hosts" className="text-ember hover:underline">
            how dispute resolution works for hosts on Wayzyy
          </Link>
          .
        </p>

        <h2 className="font-display text-2xl text-foreground mt-8">Where to go next</h2>
        <p>
          Not sure which part of Goa suits your trip? Our{" "}
          <Link to="/blog/north-goa-vs-south-goa-guide" className="text-ember hover:underline">
            North vs South Goa guide
          </Link>{" "}
          breaks down the villages, the vibe, and the seasons. Still comparing platforms? Here's a fee-by-fee look at the{" "}
          <Link to="/blog/best-airbnb-alternatives-goa" className="text-ember hover:underline">
            best Airbnb alternatives in Goa
          </Link>
          , and if you've ever wondered why the same villa costs different amounts in different places,{" "}
          <Link to="/blog/why-villas-goa-different-prices-platforms" className="text-ember hover:underline">
            this breakdown of platform fees
          </Link>{" "}
          explains it.
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
