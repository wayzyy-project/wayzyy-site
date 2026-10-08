import { BlogLayout } from "@/components/BlogLayout";
import { blogPosts } from "@/lib/blogPosts";
import { HelpCircle, ArrowRight, ShieldCheck, CheckCircle2, TrendingDown, Percent, Sparkles, Building2, Wallet } from "lucide-react";
import { useState, useMemo } from "react";
import { Link } from "react-router-dom";

const post = blogPosts.find((p) => p.slug === "airbnb-pricing-update-15-percent-fee-lowest-price")!;

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      "name": "What is the recent Airbnb 15.5% pricing update?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Airbnb has expanded its Simplified Pricing model, where the platform charges a flat 15% to 15.5% host-only service fee instead of splitting the fee between host and guest. While this removes the visible guest service fee at checkout, hosts are forced to raise their base nightly rates by 15% to 18% to protect their net earnings, resulting in higher upfront prices for travelers."
      }
    },
    {
      "@type": "Question",
      "name": "Why is the exact same villa cheaper on Wayzyy than Airbnb or MakeMyTrip?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Wayzyy does not charge percentage-based commissions on bookings. Guests pay zero booking fees, and hosts operate on low flat-fee credit packs (equivalent to around 2% effective platform cost). Because hosts do not lose 15% to 22% of their payout to the platform, they list their properties at honest, direct rates on Wayzyy."
      }
    },
    {
      "@type": "Question",
      "name": "How much can a traveler save by booking on Wayzyy instead of Airbnb?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Travelers typically save 12% to 20% on the exact same property. On a 3-night villa booking priced at ₹15,000 per night, savings are roughly ₹8,000 to ₹9,500. On a 7-night vacation at ₹20,000 per night, travelers save between ₹24,000 and ₹29,000."
      }
    },
    {
      "@type": "Question",
      "name": "How does Booking.com and MakeMyTrip commission compare with Airbnb?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "MakeMyTrip charges hosts between 18% and 22% commission plus traveler convenience fees. Booking.com charges 15% to 18% host commission. In both cases, property owners inflate their rack rates on these OTAs to compensate for the hefty commission deductions."
      }
    },
    {
      "@type": "Question",
      "name": "Are bookings on Wayzyy verified and secure?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. Wayzyy implements DigiLocker government ID verification for guests, verified geotagged property checks for hosts, secure Razorpay escrow payments, and clear cancellation policies without middleman price gouging."
      }
    }
  ]
};

function ComparisonCalculator() {
  const [nightlyRate, setNightlyRate] = useState(15000);
  const [nights, setNights] = useState(3);

  const calc = useMemo(() => {
    // Base host earnings target per night
    const hostTarget = nightlyRate;
    const staySubtotal = hostTarget * nights;

    // Wayzyy direct model: Host lists at direct rate. Zero guest commission.
    const wayzyyTotal = staySubtotal;

    // Airbnb model:
    // Host has to list at hostTarget / 0.845 on Simplified (15.5% cut) or 14% guest fee + 3% host fee + 18% GST on fees
    // In both cases the traveler pays roughly 17.5% - 19% more overall.
    const airbnbRatePerNight = Math.round(hostTarget / 0.845);
    const airbnbTotal = airbnbRatePerNight * nights;

    // MakeMyTrip model:
    // MMT takes ~20% commission from host + convenience fees + GST on service
    const mmtRatePerNight = Math.round(hostTarget / 0.81);
    const mmtTotal = mmtRatePerNight * nights;

    // Booking.com model:
    // Booking.com takes ~16.5% commission
    const bookingRatePerNight = Math.round(hostTarget / 0.835);
    const bookingTotal = bookingRatePerNight * nights;

    const savingsVsAirbnb = airbnbTotal - wayzyyTotal;
    const savingsVsMmt = mmtTotal - wayzyyTotal;

    return {
      wayzyyTotal,
      airbnbTotal,
      mmtTotal,
      bookingTotal,
      savingsVsAirbnb,
      savingsVsMmt,
    };
  }, [nightlyRate, nights]);

  const fmt = (n: number) => "₹" + n.toLocaleString("en-IN");

  return (
    <div className="my-10 rounded-3xl border border-white/10 bg-gradient-to-b from-card/80 to-card/40 p-6 sm:p-8 backdrop-blur-xl shadow-2xl">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-6">
        <div className="inline-flex items-center gap-2 rounded-full bg-ember/10 border border-ember/25 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-ember">
          <Sparkles className="w-3.5 h-3.5" /> Interactive Price Comparison
        </div>
        <span className="text-xs text-muted-foreground font-mono">Live Simulation</span>
      </div>

      <h3 className="font-display text-2xl sm:text-3xl text-foreground font-bold leading-tight">
        See how much you overpay on OTAs for the same stay
      </h3>
      <p className="text-sm text-muted-foreground mt-2">
        Select your nightly budget and duration. Compare what you actually pay for the exact same property and host across platforms.
      </p>

      {/* Sliders */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6 p-5 rounded-2xl bg-black/20 border border-white/5">
        <div>
          <div className="flex justify-between items-center text-sm font-medium mb-2">
            <span className="text-foreground">Host Direct Nightly Rate:</span>
            <span className="text-ember font-bold font-mono text-base">{fmt(nightlyRate)}/night</span>
          </div>
          <input
            type="range"
            min={3000}
            max={50000}
            step={1000}
            value={nightlyRate}
            onChange={(e) => setNightlyRate(Number(e.target.value))}
            className="w-full accent-[#FF6B00] cursor-pointer"
          />
          <div className="flex justify-between text-[11px] text-muted-foreground mt-1">
            <span>₹3,000 (Cozy Stay)</span>
            <span>₹50,000 (Luxury Villa)</span>
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center text-sm font-medium mb-2">
            <span className="text-foreground">Length of Stay:</span>
            <span className="text-ember font-bold font-mono text-base">{nights} {nights === 1 ? "Night" : "Nights"}</span>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {[3, 7, 14, 30].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setNights(n)}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition-all ${
                  nights === n
                    ? "bg-[#FF6B00] text-white shadow-lg shadow-[#FF6B00]/30"
                    : "bg-white/5 hover:bg-white/10 text-muted-foreground"
                }`}
              >
                {n} Nights
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Price Grid */}
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Wayzyy Card */}
        <div className="relative rounded-2xl border-2 border-ember bg-ember/10 p-5 flex flex-col justify-between shadow-xl">
          <div className="absolute -top-3 left-4 bg-ember text-white px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider">
            Lowest Price Guaranteed
          </div>
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-ember mt-1">Wayzyy</div>
            <div className="text-xs text-muted-foreground mt-0.5">Direct host pricing (0% commission)</div>
            <div className="font-display text-3xl font-black text-foreground mt-4">{fmt(calc.wayzyyTotal)}</div>
          </div>
          <div className="mt-5 pt-4 border-t border-ember/20 text-[11px] text-emerald-400 font-semibold flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
            <span>Zero middleman markup</span>
          </div>
        </div>

        {/* Airbnb Card */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5 flex flex-col justify-between">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-foreground/80">Airbnb</div>
            <div className="text-xs text-muted-foreground mt-0.5">15.5% simplified fee markup</div>
            <div className="font-display text-2xl font-bold text-foreground mt-4">{fmt(calc.airbnbTotal)}</div>
          </div>
          <div className="mt-5 pt-4 border-t border-white/10 text-[11px] text-rose-400 font-medium">
            Overpay by <strong className="font-bold">{fmt(calc.savingsVsAirbnb)}</strong>
          </div>
        </div>

        {/* MakeMyTrip Card */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5 flex flex-col justify-between">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-foreground/80">MakeMyTrip</div>
            <div className="text-xs text-muted-foreground mt-0.5">18% to 22% OTA cut + platform fees</div>
            <div className="font-display text-2xl font-bold text-foreground mt-4">{fmt(calc.mmtTotal)}</div>
          </div>
          <div className="mt-5 pt-4 border-t border-white/10 text-[11px] text-rose-400 font-medium">
            Overpay by <strong className="font-bold">{fmt(calc.savingsVsMmt)}</strong>
          </div>
        </div>

        {/* Booking.com Card */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5 flex flex-col justify-between">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-foreground/80">Booking.com</div>
            <div className="text-xs text-muted-foreground mt-0.5">15% to 18% host commission markup</div>
            <div className="font-display text-2xl font-bold text-foreground mt-4">{fmt(calc.bookingTotal)}</div>
          </div>
          <div className="mt-5 pt-4 border-t border-white/10 text-[11px] text-rose-400 font-medium">
            Overpay by <strong className="font-bold">{fmt(calc.bookingTotal - calc.wayzyyTotal)}</strong>
          </div>
        </div>
      </div>

      {/* Summary Callout Banner */}
      <div className="mt-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
            <Wallet className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <p className="text-sm font-bold text-emerald-300">
              You save {fmt(calc.savingsVsAirbnb)} on Airbnb and {fmt(calc.savingsVsMmt)} on MakeMyTrip
            </p>
            <p className="text-xs text-emerald-400/80">
              For the exact same villa, same bedrooms, same check-in dates, and the same host.
            </p>
          </div>
        </div>
        <Link
          to="/goa-stays"
          className="shrink-0 inline-flex items-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-black px-4 py-2 text-xs font-bold transition-all shadow-md"
        >
          Browse Stays in Goa <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}

export default function AirbnbPricingUpdate15PercentFee() {
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
      publishedDate={post.publishedDate}
      readTime={post.readTime}
      slug={post.slug}
      jsonLd={faqJsonLd}
    >
      {/* Introduction */}
      <p className="lead text-lg sm:text-xl text-foreground/90 font-medium leading-relaxed">
        If you have looked at homestays or villas recently, you have probably noticed something frustrating: prices feel significantly higher than they were a year ago, even for the exact same property.
      </p>

      <p>
        The biggest reason behind this surge is a major structural change in how short-term rental platforms charge fees. In particular, Airbnb has been rolling out its <strong>Simplified Pricing</strong> update, shifting from a split-fee model to a flat <strong>15% to 15.5% host-only fee</strong> across more accounts and regions.
      </p>

      <p>
        On paper, Airbnb pitched this as making checkout cleaner because guests do not see a separate line item labeled "Service Fee." In reality, hosts cannot afford to absorb a 15.5% cut from their revenue without operating at a loss. To make the exact same take-home income, hosts were forced to hike their base nightly listing rates by 15% to 18%.
      </p>

      <p>
        Here is the truth about how the math works, why other Online Travel Agencies (OTAs) like MakeMyTrip and Booking.com charge even higher markups, and how Wayzyy eliminates these middlemen fees to consistently be the cheapest place in the market for booking the exact same villa or homestay.
      </p>

      {/* Excalidraw Sketch Illustration */}
      <div className="my-10 rounded-3xl border border-white/10 bg-white p-4 sm:p-6 shadow-2xl overflow-hidden">
        <img
          src="/illustrations/airbnb-pricing-update-cheapest-wayzyy.svg"
          alt="Excalidraw diagram comparing Airbnb, Booking.com, and Wayzyy fee models showing why Wayzyy offers the cheapest prices"
          className="w-full h-auto object-contain rounded-2xl"
          loading="eager"
        />
        <p className="text-center text-xs text-slate-500 mt-3 font-mono">
          Figure 1: How traditional OTA commission models inflate guest prices vs Wayzyy's direct host model.
        </p>
      </div>

      {/* Visual Architectural Sketch Card */}
      <div className="my-10 rounded-3xl border border-white/10 bg-card/60 p-6 sm:p-8 backdrop-blur-md">
        <h3 className="text-xl font-display font-bold text-foreground mb-4">
          How Middleman Commissions Inflate Your Booking
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Legacy OTAs Sketch Box */}
          <div className="rounded-2xl border border-rose-500/20 bg-rose-500/5 p-5">
            <div className="flex items-center justify-between pb-3 border-b border-rose-500/20 mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-rose-400">Legacy OTAs (Airbnb / MMT / Booking)</span>
              <span className="text-xs font-mono text-rose-300">15% - 22% Cut</span>
            </div>
            <div className="space-y-3 text-xs">
              <div className="flex justify-between items-center p-2.5 rounded-lg bg-black/20 border border-white/5">
                <span className="text-muted-foreground">Host Target Take-Home:</span>
                <span className="font-mono font-bold text-foreground">₹15,000 / night</span>
              </div>
              <div className="flex justify-between items-center p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/20">
                <span className="text-rose-300 font-medium">+ Platform Commission / Host Fee (15.5%):</span>
                <span className="font-mono font-bold text-rose-300">+₹2,750 / night</span>
              </div>
              <div className="flex justify-between items-center p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/20">
                <span className="text-rose-300 font-medium">+ 18% GST on Platform Service Fee:</span>
                <span className="font-mono font-bold text-rose-300">+₹495 / night</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-xl bg-rose-500/20 border border-rose-500/40 text-sm font-bold">
                <span className="text-white">Total Guest Pays:</span>
                <span className="font-mono text-rose-200">₹18,245 / night</span>
              </div>
            </div>
          </div>

          {/* Wayzyy Direct Model Box */}
          <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-5">
            <div className="flex items-center justify-between pb-3 border-b border-emerald-500/20 mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">Wayzyy Direct Model</span>
              <span className="text-xs font-mono text-emerald-300">0% Guest Commission</span>
            </div>
            <div className="space-y-3 text-xs">
              <div className="flex justify-between items-center p-2.5 rounded-lg bg-black/20 border border-white/5">
                <span className="text-muted-foreground">Host Direct Rack Rate:</span>
                <span className="font-mono font-bold text-foreground">₹15,000 / night</span>
              </div>
              <div className="flex justify-between items-center p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                <span className="text-emerald-300 font-medium">+ Guest Booking Commission:</span>
                <span className="font-mono font-bold text-emerald-300">₹0 (Zero)</span>
              </div>
              <div className="flex justify-between items-center p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                <span className="text-emerald-300 font-medium">+ Flat Host Credit Fee:</span>
                <span className="font-mono font-bold text-emerald-300">~2% prepaid by host</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-sm font-bold">
                <span className="text-white">Total Guest Pays:</span>
                <span className="font-mono text-emerald-300">₹15,000 / night</span>
              </div>
            </div>
          </div>
        </div>

        <p className="text-xs text-muted-foreground mt-4 text-center">
          Net result: The guest saves <strong>₹3,245 per night</strong> on the exact same property, while the host takes home 100% of their desired rate.
        </p>
      </div>

      {/* Section 1: The 15.5% Shift Explained */}
      <h2>What is Airbnb's 15.5% Fee Update?</h2>
      <p>
        Traditionally, Airbnb operated primarily on a <strong>Split-Fee</strong> model. The host paid roughly 3% of the booking subtotal, and the guest was charged a variable 14% to 16.5% service fee at checkout.
      </p>

      <p>
        In recent updates, Airbnb has pushed its <strong>Simplified Pricing (Host-Only Fee)</strong>. Under Simplified Pricing:
      </p>

      <ul>
        <li>The guest sees 0% added as a separate service fee line item at checkout.</li>
        <li>Airbnb deducts <strong>15% to 15.5%</strong> directly from the host payout on every booking.</li>
        <li>In many countries, software-connected hosts (hosts using channel managers) are mandated to use this 15.5% host-only structure.</li>
      </ul>

      <p>
        While marketing claims this offers a cleaner checkout experience, the economic reality is simple: vacation rentals have high fixed operating overheads. Between electricity bills, pool cleaning, gardeners, housekeeping staff, laundry, property managers, and property maintenance, host net margins are often between 20% and 30%.
      </p>

      <p>
        If a platform suddenly takes 15.5% off the gross revenue, a host loses more than half their actual profit margin unless they raise their prices. Consequently, hosts simply multiply their rates to compensate, leaving guests to bear the full cost of the hike.
      </p>

      {/* Section 2: Comparison Across All Platforms */}
      <h2>How Other Booking Sites Compare: The OTA Commission Matrix</h2>
      <p>
        Airbnb is not alone in taking hefty cuts. Major travel booking platforms all operate on double-digit commission models:
      </p>

      <div className="my-8 overflow-x-auto">
        <table className="w-full text-left border-collapse border border-white/10 rounded-2xl overflow-hidden text-sm">
          <thead>
            <tr className="bg-white/10 text-foreground font-semibold border-b border-white/10">
              <th className="p-3.5 sm:p-4">Platform</th>
              <th className="p-3.5 sm:p-4">Platform Fee / Commission</th>
              <th className="p-3.5 sm:p-4">Who Pays the Cut?</th>
              <th className="p-3.5 sm:p-4">Impact on Final Rate</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-muted-foreground">
            <tr className="hover:bg-white/5 transition-colors">
              <td className="p-3.5 sm:p-4 font-bold text-foreground">Airbnb (Simplified)</td>
              <td className="p-3.5 sm:p-4 font-mono text-rose-400">15.0% - 15.5%</td>
              <td className="p-3.5 sm:p-4">Deducted from host payout</td>
              <td className="p-3.5 sm:p-4 text-rose-300">Base prices padded by ~18%</td>
            </tr>
            <tr className="hover:bg-white/5 transition-colors">
              <td className="p-3.5 sm:p-4 font-bold text-foreground">Airbnb (Split Fee)</td>
              <td className="p-3.5 sm:p-4 font-mono text-rose-400">3% host + 14-16% guest</td>
              <td className="p-3.5 sm:p-4">Split between host & guest</td>
              <td className="p-3.5 sm:p-4 text-rose-300">High surprise fees added at checkout</td>
            </tr>
            <tr className="hover:bg-white/5 transition-colors">
              <td className="p-3.5 sm:p-4 font-bold text-foreground">MakeMyTrip (MMT)</td>
              <td className="p-3.5 sm:p-4 font-mono text-rose-400">18.0% - 22.0%</td>
              <td className="p-3.5 sm:p-4">Host commission + convenience fee</td>
              <td className="p-3.5 sm:p-4 text-rose-300">Rates inflated by 20% to 25%</td>
            </tr>
            <tr className="hover:bg-white/5 transition-colors">
              <td className="p-3.5 sm:p-4 font-bold text-foreground">Booking.com</td>
              <td className="p-3.5 sm:p-4 font-mono text-rose-400">15.0% - 18.0%</td>
              <td className="p-3.5 sm:p-4">Host commission + processing</td>
              <td className="p-3.5 sm:p-4 text-rose-300">Rates marked up to cover deductions</td>
            </tr>
            <tr className="hover:bg-white/5 transition-colors">
              <td className="p-3.5 sm:p-4 font-bold text-foreground">StayVista / Luxury Villa Agents</td>
              <td className="p-3.5 sm:p-4 font-mono text-rose-400">25.0% - 35.0%</td>
              <td className="p-3.5 sm:p-4">Aggregator management fee</td>
              <td className="p-3.5 sm:p-4 text-rose-300">Massive markups on luxury inventory</td>
            </tr>
            <tr className="bg-ember/10 text-foreground font-medium hover:bg-ember/15 transition-colors">
              <td className="p-3.5 sm:p-4 font-bold text-ember flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" /> Wayzyy
              </td>
              <td className="p-3.5 sm:p-4 font-mono text-emerald-400 font-bold">0% Guest Fee (Flat Host Packs)</td>
              <td className="p-3.5 sm:p-4 text-white">Direct host-to-guest model</td>
              <td className="p-3.5 sm:p-4 text-emerald-300 font-bold">Guaranteed direct rack rate</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Interactive Calculator Insertion */}
      <ComparisonCalculator />

      {/* Section 3: Real Stay Scenarios */}
      <h2>Real Numbers: How Much You Save on Different Trips</h2>
      <p>
        Let us look at three common travel scenarios for a holiday in Goa and break down the exact math:
      </p>

      <div className="space-y-6 my-8">
        {/* Scenario 1 */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-ember">Scenario 1: 3-Night Weekend Getaway</span>
            <span className="text-xs font-mono text-muted-foreground">3BHK Pool Villa in Assagao</span>
          </div>
          <p className="text-sm text-foreground/90 mb-4">
            A premium 3-bedroom private pool villa in Assagao with a direct host target rate of <strong>₹18,000 per night</strong>.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-black/30 border border-white/5">
              <span className="text-muted-foreground block mb-1">Airbnb Final Price:</span>
              <span className="font-mono text-base font-bold text-rose-400">₹63,900</span>
            </div>
            <div className="p-3 rounded-xl bg-black/30 border border-white/5">
              <span className="text-muted-foreground block mb-1">MakeMyTrip Final Price:</span>
              <span className="font-mono text-base font-bold text-rose-400">₹66,600</span>
            </div>
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
              <span className="text-emerald-400 font-semibold block mb-1">Wayzyy Direct Price:</span>
              <span className="font-mono text-base font-bold text-emerald-300">₹54,000</span>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-white/10 text-xs font-semibold text-emerald-400">
            Total Savings on Wayzyy: ₹9,900 to ₹12,600 (Equivalent to 2 gourmet dinners and airport cabs in Goa).
          </div>
        </div>

        {/* Scenario 2 */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-ember">Scenario 2: 7-Night Family Vacation</span>
            <span className="text-xs font-mono text-muted-foreground">Heritage Portuguese Villa in Siolim</span>
          </div>
          <p className="text-sm text-foreground/90 mb-4">
            A 4-bedroom heritage home for a week with a direct host target rate of <strong>₹25,000 per night</strong>.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-black/30 border border-white/5">
              <span className="text-muted-foreground block mb-1">Airbnb Final Price:</span>
              <span className="font-mono text-base font-bold text-rose-400">₹2,07,100</span>
            </div>
            <div className="p-3 rounded-xl bg-black/30 border border-white/5">
              <span className="text-muted-foreground block mb-1">MakeMyTrip Final Price:</span>
              <span className="font-mono text-base font-bold text-rose-400">₹2,16,000</span>
            </div>
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
              <span className="text-emerald-400 font-semibold block mb-1">Wayzyy Direct Price:</span>
              <span className="font-mono text-base font-bold text-emerald-300">₹1,75,000</span>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-white/10 text-xs font-semibold text-emerald-400">
            Total Savings on Wayzyy: ₹32,100 to ₹41,000 (Enough to cover the flight tickets for your entire group).
          </div>
        </div>

        {/* Scenario 3 */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-ember">Scenario 3: 14-Night Workation</span>
            <span className="text-xs font-mono text-muted-foreground">1BHK Apartment near Anjuna / Mandrem Beach</span>
          </div>
          <p className="text-sm text-foreground/90 mb-4">
            A high-speed WiFi serviced apartment for remote working at a direct host target rate of <strong>₹3,500 per night</strong>.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-black/30 border border-white/5">
              <span className="text-muted-foreground block mb-1">Airbnb Final Price:</span>
              <span className="font-mono text-base font-bold text-rose-400">₹57,960</span>
            </div>
            <div className="p-3 rounded-xl bg-black/30 border border-white/5">
              <span className="text-muted-foreground block mb-1">MakeMyTrip Final Price:</span>
              <span className="font-mono text-base font-bold text-rose-400">₹60,480</span>
            </div>
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
              <span className="text-emerald-400 font-semibold block mb-1">Wayzyy Direct Price:</span>
              <span className="font-mono text-base font-bold text-emerald-300">₹49,000</span>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-white/10 text-xs font-semibold text-emerald-400">
            Total Savings on Wayzyy: ₹8,960 to ₹11,480 (Covers a 2-week scooter rental and your daily cafe coffee budget).
          </div>
        </div>
      </div>

      {/* Section 4: Why Wayzyy is Able to Offer This */}
      <h2>How Wayzyy Offers the Lowest Prices Without Cutting Quality</h2>
      <p>
        People often ask: <em>"If a villa is ₹15,000 on Wayzyy and ₹18,000 on Airbnb, is it a different room or a lower tier service?"</em>
      </p>

      <p>
        The answer is no. It is the exact same villa, the exact same host, the exact same bed linens, and the exact same keys handed to you at check-in.
      </p>

      <p>
        Here is why Wayzyy can structurally maintain the lowest rates in the market:
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
        <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
          <div className="flex items-center gap-2.5 text-foreground font-bold text-sm mb-2">
            <TrendingDown className="w-4 h-4 text-emerald-400" />
            Zero Commission Model
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Wayzyy does not take 15% to 22% commissions from hosts. Instead, hosts pay a flat, nominal recharge credit pack (equivalent to roughly 2% effective platform cost). Because hosts do not lose a fifth of their revenue, they pass the savings directly to you.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
          <div className="flex items-center gap-2.5 text-foreground font-bold text-sm mb-2">
            <ShieldCheck className="w-4 h-4 text-ember" />
            Verified Direct Host Connection
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Every listing on Wayzyy is verified with geotagged property checks and official DigiLocker KYC identity verification. You get the safety and convenience of a premier tech platform without the inflated middleman tax.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
          <div className="flex items-center gap-2.5 text-foreground font-bold text-sm mb-2">
            <Percent className="w-4 h-4 text-emerald-400" />
            No Checkout "Surprise" Fees
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            What you see is what you pay. There are no surprise guest service fee percentages, hidden booking fees, or inflated currency conversion margins tacked onto your invoice at the final screen.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
          <div className="flex items-center gap-2.5 text-foreground font-bold text-sm mb-2">
            <Building2 className="w-4 h-4 text-ember" />
            Empowering Independent Hosts
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            When you book through Wayzyy, your money supports real, local villa owners and homestay operators rather than funding massive corporate aggregator margins and overseas platform fees.
          </p>
        </div>
      </div>

      {/* Section 5: FAQs */}
      <h2 className="mt-12 mb-6">Frequently Asked Questions</h2>
      <div className="space-y-4">
        {faqJsonLd.mainEntity.map((item, idx) => (
          <div
            key={idx}
            className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden transition-colors"
          >
            <button
              type="button"
              onClick={() => toggleFaq(idx)}
              className="w-full text-left p-5 flex items-center justify-between gap-4 font-semibold text-foreground text-sm sm:text-base hover:text-ember transition-colors"
            >
              <span>{item.name}</span>
              <HelpCircle className={`w-5 h-5 shrink-0 transition-transform ${openFaq === idx ? "rotate-180 text-ember" : "text-muted-foreground"}`} />
            </button>
            {openFaq === idx && (
              <div className="px-5 pb-5 text-xs sm:text-sm text-muted-foreground leading-relaxed border-t border-white/5 pt-4">
                {item.acceptedAnswer.text}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Final Words & CTA */}
      <h2 className="mt-12">The Bottom Line</h2>
      <p>
        The recent Airbnb 15.5% pricing update is part of a broader trend among major OTAs: shifting more costs onto hosts, who in turn pass higher rates onto travelers.
      </p>

      <p>
        You do not have to pay an extra ₹8,000 to ₹40,000 on your next vacation just to book through a legacy middleman. With Wayzyy, you get verified homestays, private pool villas, and cozy beach apartments directly from hosts at honest prices.
      </p>

      <div className="mt-10 rounded-3xl border border-ember/30 bg-gradient-to-r from-ember/15 via-ember/10 to-transparent p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div>
          <h3 className="font-display text-xl sm:text-2xl font-bold text-white mb-2">
            Ready to explore verified stays in Goa?
          </h3>
          <p className="text-xs sm:text-sm text-white/80 max-w-xl">
            Browse authentic homestays and private pool villas in Assagao, Siolim, Candolim, Anjuna, and South Goa with zero guest booking markups.
          </p>
        </div>
        <Link
          to="/goa-stays"
          className="inline-flex items-center gap-2 rounded-2xl bg-ember hover:bg-ember/90 text-white font-bold px-6 py-3.5 text-sm transition-all shadow-lg shadow-ember/30 shrink-0"
        >
          Explore Goa Stays <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </BlogLayout>
  );
}
