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
          The conversation around Airbnb's new fee structure has largely focused on one number - 15.5%. But the percentage itself isn't the biggest issue. What matters is everything that happens because of it.
        </p>
        <p>
          Hosts who decide to absorb the additional fee will see their margins shrink. Those who increase their prices to recover the cost risk becoming less competitive. Neither option is particularly attractive, especially in markets like India where guests often compare properties within very specific budget ranges.
        </p>

        <h2 className="font-display text-2xl text-foreground mt-8">Why Indian Hosts Will Feel This More Than Most Markets</h2>
        <p>
          For many hosts in countries like the US, increasing prices by 10–15% may not dramatically change their competitiveness. In India, however, every price increase can have a noticeable impact on bookings because guests are often far more price-sensitive and compare dozens of similar properties before making a decision.
        </p>
        <p>
          Take Goa as an example. A host isn't just paying Airbnb's commission. They're also covering housekeeping, laundry, maintenance, electricity, internet, staff salaries, property management, repairs, and local taxes. During peak seasons like Christmas and New Year, these costs are easier to absorb because demand is naturally high. During the monsoon or shoulder season, however, margins are already much thinner.
        </p>
        <p>
          Now add an additional platform fee into that equation. Hosts are left with two choices:
        </p>
        <p>
          The first is to absorb the additional cost themselves. While this keeps the listing price attractive, it also reduces profitability. For independent hosts managing one or two properties, that might mean delaying maintenance or earning significantly less from each booking.
        </p>
        <p>
          The second option is to increase the nightly rate. That sounds simple until you look at how guests actually search. Most guests don't browse every property available in Goa. They start with a budget. Someone searching for stays under ₹10,000 per night is unlikely to ever see a villa that's now priced at ₹11,500, even if that increase happened solely because the host was trying to recover higher Airbnb host fees.
        </p>
        <p>
          This creates an entirely new competitive landscape. A villa that previously competed with similar ₹10,000 properties is suddenly competing with premium listings that have always been in the ₹11,000–₹12,000 range. At the same time, the original ₹10,000 price bracket is now filled with newer or lower-priced competitors.
        </p>
        <p>
          In other words, increasing prices doesn't just change your revenue - it changes who you're competing against. This is one of the most overlooked consequences of changes in Airbnb pricing, and it's particularly relevant in seasonal markets like Goa, where small pricing differences can significantly influence booking decisions.
        </p>
        <p>
          For hosts managing multiple properties, the challenge becomes even bigger. A small reduction in occupancy or a slight drop in average nightly rates isn't limited to a single booking - it affects cash flow across the entire portfolio. This is why many experienced hosts are no longer looking at this as just another pricing update. They're looking at it as a business decision that could reshape how they price properties, diversify bookings, and reduce dependence on a single platform.
        </p>

        <h2 className="font-display text-2xl text-foreground mt-8">The Ripple Effect Has Already Started</h2>
        <p>
          The impact of Airbnb's new fee structure isn't limited to higher platform fees. It's already beginning to influence how hosts, co-hosts, and property managers negotiate their businesses.
        </p>
        <p>
          One discussion that recently caught our attention perfectly illustrates this. A host shared that after Airbnb introduced the 15.5% host-only fee model, their co-host wanted to increase their commission from 26% to 32%. The host argued that doing so would mean absorbing both Airbnb's additional fee and the higher co-host commission, significantly reducing their own earnings.
        </p>
        <p>
          Whether the co-host's request is reasonable isn't really the point. The bigger takeaway is that a single platform policy change is now affecting agreements between business partners who had already settled on a revenue-sharing model. This isn't an isolated pricing problem anymore - it's becoming an operational one.
        </p>
        <p>
          The same conversations are happening around property management companies, cleaning services, and revenue managers. Everyone in the hosting ecosystem is asking the same question: Who should absorb the additional cost? Should the host accept lower profits? Should the guest pay more? Should co-hosts reduce their margins? Or should everyone share the burden?
        </p>
        <p>
          There isn't a universal answer, which is exactly why this change has created so much uncertainty within the hosting community.
        </p>
        <p>
          Another challenge is that pricing isn't something hosts can simply adjust overnight. Many guests have already saved properties to their wishlists, compare prices over several weeks, or return to the same villa every year. A sudden increase in pricing can easily be interpreted as the host becoming more expensive, even though the underlying economics of the booking have changed.
        </p>
        <p>
          For hosts managing multiple properties, making pricing decisions has also become more complex. Every property sits within a specific pricing range. Increasing rates to recover the new Airbnb fees for hosts doesn't just affect profitability - it changes where that listing appears in the market and which properties it competes against.
        </p>
        <p>
          This is why many experienced hosts are no longer asking, "How do I recover 15.5%?" They're asking a much bigger question: "How much control do I really have over my business if a single platform decision can change my pricing strategy overnight?"
        </p>
        <p>
          That question goes far beyond Airbnb. It's about long-term sustainability. As more hosts recognize the risks of relying on a single marketplace, many are beginning to diversify - listing on multiple platforms, encouraging repeat direct bookings, and exploring alternatives that give them greater control over pricing and their relationship with guests.
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

        <h2 className="font-display text-xl text-foreground mt-8">The Indian Context: High Fees Meet Lower ADRs</h2>
        <p>
          In the Indian market, this fee consolidation has a distinct psychological impact on guests. Under the old split-fee structure, guests understood that a portion of their payment went to the platform for booking services. With Simplified Pricing, the entire service fee is rolled into the base nightly rate. Because these platform fees are no longer separated, guests often perceive that the host is directly overcharging them, which statistically leads to lower review scores and drives more hosts to sell offline.
        </p>
        <p>
          This perception gap is especially challenging because of local market economics. The average Indian Airbnb ADR (Average Daily Rate) ranges from ₹2,500 to ₹3,500. At this rate, a 15% platform commission is a significant chunk of money percentage-wise. Raising rates to recover it makes listings uncompetitive, while absorbing it directly threatens the viability of smaller homestays.
        </p>

        {/* Indian Context Host Screenshot */}
        <div className="my-8">
          <img
            src="/blog/reddit-host-fee-hike-complaint.webp"
            alt="Reddit post from r/AirBnBHosts discussing the impact of the 15.5% simplified fee structure in India"
            className="w-full rounded-2xl border border-border object-cover"
            loading="lazy"
          />
          <span className="text-xs text-muted-foreground mt-2 block text-center">Indian hosts discussing the psychological impact of fee integration on average ADRs</span>
        </div>

        <h2 className="font-display text-xl text-foreground mt-8">The Support Gap: High Commissions Without Host Protection</h2>
        <p>
          This structural dependence is made worse by a lack of platform accountability when real disputes occur. For hosts, paying a premium 15.5% commission should theoretically guarantee a high level of customer protection and mediation. In reality, host communities are filled with stories of arbitrary refund decisions and loophole exploitation where the platform offers little meaningful support.
        </p>
        <p>
          In recent discussions on host forums, property owners describe cases where guests stay for multiple days and receive a complete refund on trivial pretexts (such as 'no toilet paper') after the host refuses unreasonable demands, such as free catering for large groups. Because there is a clear gap in accountability, hosts carry all the operational risk while paying high fees to a platform that offers them zero recourse.
        </p>

        {/* Support Gap Reddit Screenshot */}
        <div className="my-8">
          <img
            src="/blog/reddit-host-dispute-complaints.webp"
            alt="Reddit forum discussion showing host complaints about arbitrary refunds and loophole exploitation on Airbnb"
            className="w-full rounded-2xl border border-border object-cover"
            loading="lazy"
          />
          <span className="text-xs text-muted-foreground mt-2 block text-center">Hosts sharing experiences of platform disputes and arbitrary payout reversals</span>
        </div>

        <h2 className="font-display text-2xl text-foreground mt-8">Why We Believe Hosts Need More Than One Platform</h2>
        <p>
          The biggest lesson from this entire discussion isn't that Airbnb made the wrong decision. Every platform has the right to evolve its pricing model based on its own business objectives.
        </p>
        <p>
          The bigger lesson is what happens when thousands of businesses depend almost entirely on a single platform. When one company changes its commission structure, hosts immediately have to rethink their pricing strategy. If search algorithms change, hosts adapt again. If fees increase, nightly rates change. If visibility drops, bookings are affected. That's a lot of influence for one platform to have over an entire business.
        </p>
        <p>
          Over the last few months, we've spoken with and onboarded more than 100 hosts across India. While every host has a different property and a different pricing strategy, one concern kept coming up repeatedly:
        </p>
        <p className="italic pl-4 border-l-2 border-ember text-muted-foreground">
          "We don't want to depend on just one platform anymore."
        </p>
        <p>
          Not because Airbnb doesn't work. It clearly does. But putting all your bookings, pricing, and visibility in one place means every policy update has an immediate impact on your business.
        </p>
        <p>
          That's one of the biggest reasons we started building Wayzyy. Our goal isn't to ask hosts to leave Airbnb or stop listing on other OTAs. In fact, we believe most professional hosts will continue using multiple platforms because that's simply how modern hospitality works.
        </p>
        <p>
          What we're trying to build is another distribution channel - one where hosts have greater control over their pricing, can build direct relationships with guests, and aren't forced to rethink their business every time a marketplace changes its rules.
        </p>
        <p>
          For guests, this also creates a better experience. As hosts increase prices to recover higher platform fees, guests inevitably end up paying more. By giving hosts additional ways to reach travelers, platforms can compete on value rather than simply passing higher costs down the chain.
        </p>
        <p>
          Healthy competition benefits everyone:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-muted-foreground text-sm">
          <li>Hosts gain more control over their businesses.</li>
          <li>Guests get more choice and better pricing.</li>
          <li>The market becomes less dependent on decisions made by any single platform.</li>
        </ul>
        <p>
          Ultimately, that's the future we believe the Indian vacation rental industry should move toward - not replacing one platform with another, but creating an ecosystem where hosts have options, guests benefit from genuine competition, and no single policy change can reshape the economics of an entire industry overnight.
        </p>

        {/* Live Interactive Pricing Audit */}
        <InlineCalculator />

        <h2 className="font-display text-2xl text-foreground mt-8">So, What Should Hosts Do Now?</h2>
        <p>
          There isn't a single strategy that works for every host. A beachfront villa in North Goa has a very different pricing strategy than a homestay in Jaipur or a cottage in Himachal. But one thing is becoming increasingly clear: pricing can no longer be something you set once and forget.
        </p>
        <p>
          If you've been relying on the same nightly rates for months, now is the right time to revisit them. Don't increase prices simply because platform fees have changed. Look at your occupancy, operating costs, local competition, and the value your property offers. The goal isn't to recover every rupee overnight - it's to build a pricing strategy that remains sustainable over the long term.
        </p>
        <p>
          This is also a good time to rethink where your bookings come from. If nearly all of your reservations depend on a single platform, every policy update - whether it's commissions, search rankings, cancellation rules, or pricing models - has a direct impact on your business. Diversifying doesn't mean leaving Airbnb. It means making sure Airbnb isn't your only source of guests.
        </p>
        <p>
          Many experienced hosts already follow this approach. They'll list across multiple OTAs, encourage repeat guests to book again, maintain their own website or social presence, and invest in channels they control. The objective isn't simply to increase bookings - it's to reduce dependency.
        </p>

        <h2 className="font-display text-2xl text-foreground mt-8">The Real Cost of the 15.5% Fee Isn't 15.5%</h2>
        <p>
          Airbnb's move to a 15.5% host-only fee will eventually become another milestone in the company's history. Like every platform update before it, hosts will adapt. The more interesting story isn't about the fee itself - it's about what this change reveals.
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
