import { BlogLayout } from "@/components/BlogLayout";
import { blogPosts } from "@/lib/blogPosts";
import { HelpCircle } from "lucide-react";
import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { InlineCalculator } from "@/components/InlineCalculator";

const post = blogPosts.find((p) => p.slug === "real-cost-of-airbnb-fee")!;

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      "name": "Why will properties cost 15.5% more under Airbnb's new fee structure?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Under the new Simplified Pricing model, Airbnb shifts the entire platform fee (15% to 15.5%) onto the host's invoice instead of splitting it with the guest. Because hosts cannot absorb a 15.5% margin reduction without running at a loss, they are statistically forced to raise their base nightly rates by roughly 15.5% to take home the same net payout. Consequently, the property rate appears 15% more expensive to guests upfront."
      }
    },
    {
      "@type": "Question",
      "name": "What is the math behind Airbnb's split-fee vs simplified host-only fee?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "In the split-fee model, the host pays 3% and the guest pays a 14% to 16.5% service fee at checkout. In the simplified host-only model, the guest pays 0% service fee at checkout, but the host is charged a flat 15.5% fee on the booking subtotal. To take home the same payout of ₹9,700 on a ₹10,000 villa, a host must raise the base rate to ₹11,500 on the host-only model, meaning guests pay ₹11,500 instead of ₹11,400."
      }
    },
    {
      "@type": "Question",
      "name": "How does the guest service fee shift affect host competitiveness?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "By shifting the service fee onto the host payout, properties look more expensive in search results. A villa priced at ₹10,000 suddenly looks like ₹11,500 in search feeds, pushing it into a higher pricing tier where it competes with more premium accommodations, which can negatively affect click-through rates and booking conversions."
      }
    },
    {
      "@type": "Question",
      "name": "How does Wayzyy prevent this 15.5% price inflation?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Wayzyy replaces commission models with prepaid credit packs (equivalent to a 2% to 2.2% effective fee). Because hosts keep 100% of their nightly rates without deductions, they do not need to inflate their base rates by 15.5%. This allows them to offer lower direct rates to guests while keeping higher margins."
      }
    },
    {
      "@type": "Question",
      "name": "How can hosts build a direct booking strategy to avoid fee hikes?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Hosts can list on flat-fee platforms like Wayzyy, build their own direct booking channels, and incentivize repeat guests with direct-booking discounts. By diversifying channels, they prevent a single platform's policy update from dictating their pricing strategy."
      }
    }
  ]
};

function FeeHikeCalculator() {
  const [payout, setPayout] = useState(10000);

  const stats = useMemo(() => {
    // Old Split-Fee (3% host fee)
    const oldBaseRate = payout / 0.97;
    const guestFee = oldBaseRate * 0.142; // ~14.2% average guest fee
    const oldGuestPaid = oldBaseRate + guestFee;

    // New Simplified (15.5% host fee)
    const newBaseRate = payout / 0.845;
    const newGuestPaid = newBaseRate; // 0% guest service fee visible at checkout

    const inflation = ((newBaseRate - oldBaseRate) / oldBaseRate) * 100;
    const absoluteHike = newBaseRate - oldBaseRate;

    return { oldBaseRate, oldGuestPaid, newBaseRate, newGuestPaid, inflation, absoluteHike };
  }, [payout]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="my-8 rounded-2xl border border-ember/30 bg-ember/5 p-6 sm:p-8">
      <div>
        <div className="inline-flex items-center gap-1.5 rounded-full bg-ember/10 border border-ember/25 px-3 py-1 text-[11px] font-medium uppercase tracking-wider text-ember">
          Interactive Fee Hike Calculator
        </div>
        <h3 className="font-display text-xl sm:text-2xl text-foreground mt-2 leading-tight">
          How Airbnb's 15.5% Shift inflates your rates
        </h3>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
          Adjust the slider to your desired Net Take-Home Payout per night. Watch how your base listing price must inflate to preserve your margins.
        </p>
      </div>

      <div className="mt-6 space-y-6">
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Desired Net Host Payout
            </span>
            <span className="font-display text-lg font-bold text-foreground">
              {formatCurrency(payout)}
            </span>
          </div>
          <input
            type="range"
            min="3000"
            max="40000"
            step="1000"
            value={payout}
            onChange={(e) => setPayout(Number(e.target.value))}
            className="w-full h-1.5 bg-border rounded-lg appearance-none cursor-pointer accent-ember focus:outline-none"
          />
          <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
            <span>₹3,000</span>
            <span>₹20,000</span>
            <span>₹40,000</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl border border-border bg-background/50 flex flex-col justify-between">
            <div>
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground block">
                Old Split-Fee Model (3% Host)
              </span>
              <span className="text-sm text-muted-foreground mt-1 block">
                Base Nightly Price: <strong className="text-foreground">{formatCurrency(stats.oldBaseRate)}</strong>
              </span>
            </div>
            <div className="text-xs text-muted-foreground border-t border-border/60 pt-2 mt-3">
              Guest pays: <strong className="text-foreground">{formatCurrency(stats.oldGuestPaid)}</strong> (incl. checkout service fee)
            </div>
          </div>

          <div className="p-4 rounded-xl border border-ember/25 bg-ember/5 flex flex-col justify-between relative overflow-hidden">
            <div>
              <span className="text-[10px] uppercase tracking-wider text-ember/80 block font-medium">
                New Simplified Pricing (15.5% Host)
              </span>
              <span className="text-sm text-muted-foreground mt-1 block">
                Base Nightly Price: <strong className="text-foreground">{formatCurrency(stats.newBaseRate)}</strong>
              </span>
            </div>
            <div className="text-xs text-muted-foreground border-t border-ember/20 pt-2 mt-3 flex items-center justify-between">
              <span>Guest pays: <strong className="text-foreground">{formatCurrency(stats.newGuestPaid)}</strong></span>
              <span className="bg-rose-500/10 text-rose-500 border border-rose-500/20 px-1.5 py-0.5 rounded text-[10px] font-bold">
                +{stats.inflation.toFixed(1)}% Base Price Hike
              </span>
            </div>
          </div>
        </div>

        <div className="p-4 rounded-xl border border-rose-500/20 bg-rose-500/5 text-center text-xs text-muted-foreground">
          To take home a clean <strong className="text-foreground">{formatCurrency(payout)}</strong>, you are forced to raise your nightly base rate by <strong className="text-rose-500">{formatCurrency(stats.absoluteHike)} per night</strong>. In search feeds, your property now appears significantly more expensive to guests.
        </div>
      </div>
    </div>
  );
}

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
        
        <h2 className="font-display text-2xl text-foreground mt-8">The 15.5% Price Hike POV: Why Guest Rates Are Rising</h2>
        <p>
          Let's look at the actual math and psychology of this shift. Previously, Airbnb split its service fees: hosts paid a small 3% commission, and guests paid a 14% to 16.5% service fee visible at checkout. Under the new "Simplified Pricing" structure, the guest service fee at checkout is eliminated (showing ₹0), but the host is charged a flat 15% to 15.5% fee directly on the payout subtotal.
        </p>
        <p>
          Statistically and economically, hosts cannot simply absorb this 15.5% deduction without running their rental businesses at a loss. To protect their net payouts, hosts are mathematically forced to raise their base nightly rates by roughly 15.5%. 
        </p>
        <p>
          For the guest, the property hasn't changed, but it now appears 15% more expensive upfront in search results. This pushes listings into higher pricing tiers where they must compete with more luxurious properties, often leading to a drop in occupancy.
        </p>

        <FeeHikeCalculator />

        <h2 className="font-display text-xl text-foreground mt-8">Comparison Matrix: The Split-Fee vs. Simplified Pricing Math</h2>
        <p>
          To make the impact clear, let's compare what happens when a host wants to earn a net payout of ₹9,700 on a booking:
        </p>

        <div className="overflow-x-auto my-6 border border-border rounded-xl">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-muted/50 border-b border-border font-display text-foreground">
                <th className="p-4 font-semibold">Pricing Metric</th>
                <th className="p-4 font-semibold">Split-Fee Model (Old 3% Host)</th>
                <th className="p-4 font-semibold">Simplified Model (New 15.5% Host)</th>
                <th className="p-4 font-semibold">The Real Impact on Pricing</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              <tr>
                <td className="p-4 text-muted-foreground font-medium">Nightly Base Rate set by Host</td>
                <td className="p-4 text-foreground">₹10,000</td>
                <td className="p-4 text-foreground">₹10,000</td>
                <td className="p-4 text-muted-foreground">Hosts keeping base rate same lose ₹1,250 on payout.</td>
              </tr>
              <tr>
                <td className="p-4 text-muted-foreground font-medium">Guest Service Fee at Checkout</td>
                <td className="p-4 text-foreground">~₹1,400 (Paid by guest)</td>
                <td className="p-4 text-foreground">₹0 (Paid by guest)</td>
                <td className="p-4 text-muted-foreground">Checkout looks "free" to guests, but base rate is inflated.</td>
              </tr>
              <tr>
                <td className="p-4 text-muted-foreground font-medium">Platform Fee Deducted from Host</td>
                <td className="p-4 text-foreground">₹300 (3% host fee)</td>
                <td className="p-4 text-foreground">₹1,550 (15.5% host fee)</td>
                <td className="p-4 font-semibold text-rose-500">Host payout drops from ₹9,700 to ₹8,450.</td>
              </tr>
              <tr className="bg-emerald-500/5">
                <td className="p-4 text-muted-foreground font-medium">Adjusted Rate (To Keep Original Payout)</td>
                <td className="p-4 text-foreground">₹10,000</td>
                <td className="p-4 text-foreground font-semibold text-emerald-500">₹11,500 (+15.5% Hike)</td>
                <td className="p-4 text-muted-foreground">Guest pays more upfront; property shifts to higher price tier.</td>
              </tr>
            </tbody>
          </table>
        </div>

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
