import { BlogLayout } from "@/components/BlogLayout";
import { blogPosts } from "@/lib/blogPosts";
import { HelpCircle } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { InlineCalculator } from "@/components/InlineCalculator";

const post = blogPosts.find((p) => p.slug === "real-cost-of-airbnb-fee")!;

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      "name": "What is Airbnb's 15.5% Simplified Pricing structure?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Airbnb's Simplified Pricing is a host-only fee structure where the host pays a flat 15% to 15.5% commission directly on every booking subtotal. Guests no longer see a separate Airbnb service fee at checkout because the entire service cost is absorbed on the host's side. This replaces the traditional split-fee model (where hosts paid ~3% and guests paid a separate service fee of 14% to 16.5%)."
      }
    },
    {
      "@type": "Question",
      "name": "Why is Airbnb forcing hosts to use Simplified Pricing?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Airbnb enforces Simplified Pricing for hosts who connect their accounts to third-party software (such as property management systems or channel managers). The platform's goal is to present a clean, transparent upfront price to guests without itemized service fee markups, though it effectively shifts the tax and platform cost burden directly onto the host's payout."
      }
    },
    {
      "@type": "Question",
      "name": "Should I raise my prices by 15.5% on Airbnb to recover the cost?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Simply raising your nightly rates by 15.5% is a risky strategy. It can push your property into a higher pricing bracket where you compete with more luxurious listings, potentially reducing your search ranking and occupancy. Instead of a single blanket raise, hosts should analyze local competition, seasonality, and operate a multi-channel direct booking strategy to diversify risk."
      }
    },
    {
      "@type": "Question",
      "name": "How does Wayzyy's fee model compare to Airbnb's 15.5% fee?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Wayzyy uses a recharge-based prepaid credit system instead of a per-booking commission. For example, a ₹2,200 credit pack unlocks ₹1,00,000 in booking value, which equals an effective platform cost of 2.2%. Beyond ₹5,00,000, hosts move to a Custom plan at a flat 2.0% rate. Because Wayzyy does not deduct commissions from payouts, hosts keep 100% of their nightly rates."
      }
    },
    {
      "@type": "Question",
      "name": "Is it possible to list my property on both Airbnb and Wayzyy?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. Most professional hosts use a multi-channel strategy. You can list on Airbnb to capture top-of-funnel traffic and list on Wayzyy to offer direct-rate bookings without commissions, helping you reward repeat guests and build business independence."
      }
    }
  ]
};

export default function RealCostOfAirbnbFee() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <BlogLayout
      title={post.title}
      description={post.description}
      metaTitle={post.metaTitle}
      metaDescription={post.metaDescription}
      heroImage={post.heroImage}
      heroImageAlt="Sleek host home office flat-lay with laptop displaying performance charts and tropical palm trees outside the window"
      publishedDate={post.publishedDate}
      slug={post.slug}
      extraJsonLd={faqJsonLd}
    >
      <div className="space-y-6">
        <p>
          The conversation around Airbnb's new fee structure has largely focused on one number—15.5%. But the percentage itself isn't the biggest issue. What matters is everything that happens because of it.
        </p>
        <p>
          Hosts who decide to absorb the additional fee will see their margins shrink. Those who increase their prices to recover the cost risk becoming less competitive. Neither option is particularly attractive, especially in markets like India where guests often compare properties within very specific budget ranges.
        </p>
        <p>
          That pricing decision has a ripple effect. A villa that was comfortably competing around the ₹10,000 mark may now need to be listed at ₹11,500 or more. The property hasn't changed. The amenities haven't changed. The experience hasn't changed. Yet it suddenly finds itself competing with an entirely different set of listings simply because it has moved into a new price bracket.
        </p>
        <p>
          Guests experience the change differently. Someone who stayed at the same villa last year or has had it saved in their wishlist may simply notice that prices have gone up. Most won't know that platform economics played a role in that increase. To them, it looks like the host decided to charge more.
        </p>
        <p>
          For hosts, however, the decision is rarely that simple. Every increase has to be weighed against occupancy, visibility, repeat bookings, and local competition. It's no longer just about setting the right nightly rate—it's about deciding how much of the additional cost the business can realistically absorb.
        </p>
        <p>
          Perhaps that's the biggest takeaway from all of this. The discussion isn't really about a 15.5% commission. It's about how much influence a single platform can have over thousands of independent businesses.
        </p>
        <p>
          One policy update is enough to trigger changes in pricing strategies, revenue-sharing agreements, guest expectations, and even long-term business planning. That's a level of dependence every host should think about, regardless of which platform they use.
        </p>
        <p>
          This is exactly why many professional hosts don't rely on just one booking channel anymore. They diversify their bookings, build repeat guest relationships, and gradually reduce the risk of having a single platform dictate how their business operates.
        </p>
        <p>
          At Wayzyy, that's the future we believe in. Over the last few months, we've had conversations with more than 100 hosts across India. While every host has different goals and operates in a different market, one concern keeps coming up: they want more control over their business.
        </p>
        <p>
          Wayzyy wasn't built to convince hosts to leave Airbnb or any other OTA. It was built because competition creates healthier marketplaces. When hosts have multiple ways to reach guests, they gain more flexibility over pricing, guests get better choices, and the industry becomes less vulnerable to decisions made by any single platform.
        </p>

        {/* Live Interactive Pricing Audit */}
        <InlineCalculator />

        <p>
          The 15.5% fee change will eventually become just another update in Airbnb's history. The bigger question is whether the industry learns from it. Because the strongest hosting businesses won't be the ones that react to every platform update—they'll be the ones that aren't completely dependent on any single platform in the first place.
        </p>

        <h2 className="font-display text-2xl text-foreground mt-8">So, What Should Hosts Do Now?</h2>
        <p>
          There isn't a single strategy that works for every host. A beachfront villa in North Goa has a very different pricing strategy than a homestay in Jaipur or a cottage in Himachal. But one thing is becoming increasingly clear: pricing can no longer be something you set once and forget.
        </p>
        <p>
          If you've been relying on the same nightly rates for months, now is the right time to revisit them. Don't increase prices simply because platform fees have changed. Look at your occupancy, operating costs, local competition, and the value your property offers. The goal isn't to recover every rupee overnight—it's to build a pricing strategy that remains sustainable over the long term.
        </p>
        <p>
          This is also a good time to rethink where your bookings come from. If nearly all of your reservations depend on a single platform, every policy update—whether it's commissions, search rankings, cancellation rules, or pricing models—has a direct impact on your business. Diversifying doesn't mean leaving Airbnb. It means making sure Airbnb isn't your only source of guests.
        </p>
        <p>
          Many experienced hosts already follow this approach. They'll list across multiple OTAs, encourage repeat guests to book again, maintain their own website or social presence, and invest in channels they control. The objective isn't simply to increase bookings—it's to reduce dependency.
        </p>
        <p>
          Technology can help too, but it shouldn't replace good judgement. Whether you're using Airbnb Smart Pricing, PriceLabs, or another dynamic pricing tool, remember that they're designed to support your decisions, not make them for you. No algorithm understands your property's unique strengths, your local market, or upcoming events as well as you do.
        </p>
        <p>
          Finally, don't make pricing decisions in isolation. Talk to other hosts in your city. Compare occupancy trends, understand how others are responding to the new fee structure, and learn from what's working. The strongest hosting communities have always been built on shared knowledge, and that's more valuable today than ever before.
        </p>
        <p>
          The platforms will continue to evolve. Fees will change. Algorithms will change. Guest behaviour will change. The hosts who succeed won't necessarily be the ones with the lowest prices. They'll be the ones who adapt the fastest while staying in control of their business.
        </p>

        <h2 className="font-display text-2xl text-foreground mt-8">Final Thoughts</h2>
        <p>
          Airbnb's move to a 15.5% host-only fee will eventually become another milestone in the company's history. Like every platform update before it, hosts will adapt. The more interesting story isn't about the fee itself—it's about what this change reveals.
        </p>
        <p>
          It highlights how quickly the economics of a hosting business can shift when one platform updates its policies. A decision made in a boardroom can influence pricing strategies, guest expectations, occupancy targets, and even the profitability of thousands of independent hosts across different markets.
        </p>
        <p>
          For Indian hosts, where margins are often tighter and pricing is highly competitive, those effects are even more pronounced. Recovering an additional cost isn't simply a matter of increasing nightly rates. Every adjustment changes how a property is positioned, who it competes with, and how guests perceive its value.
        </p>
        <p>
          That's why the conversation shouldn't stop at "How do I recover the extra 15.5%?" A better question is: "How can I build a hosting business that's resilient to changes like this?"
        </p>
        <p>
          The answer will look different for every host. Some will refine their pricing strategy. Others will invest in repeat guests, explore direct bookings, or expand to additional marketplaces. Most will probably do a combination of all three. What matters is having options.
        </p>
        <p>
          The strongest hosting businesses aren't defined by the platform they list on. They're defined by how well they adapt when the market changes. And if there's one lesson from Airbnb's latest pricing update, it's that having more control over your business has never been more valuable.
        </p>
      </div>

      {/* FAQ Accordion Section */}
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
