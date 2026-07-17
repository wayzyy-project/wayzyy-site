import { useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ArrowLeft, ChevronRight, TrendingUp } from "lucide-react";
import { SEO } from "@/components/SEO";
import { ThemeToggle } from "@/components/theme-toggle";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";

// Real, documented Wayzyy prepaid credit tiers — see /host-terms section 5.2.
// Beyond ₹5,00,000, hosts move to a Custom plan that holds the same 2.0%
// effective rate for any booking volume.
const WAYZYY_TIERS = [
  { cost: 600, limit: 20000, label: "₹600 credit pack" },
  { cost: 1200, limit: 50000, label: "₹1,200 credit pack" },
  { cost: 2200, limit: 100000, label: "₹2,200 credit pack" },
  { cost: 5000, limit: 250000, label: "₹5,000 credit pack" },
  { cost: 10000, limit: 500000, label: "₹10,000 credit pack" },
];

function wayzyyCost(bookingValue: number) {
  for (const tier of WAYZYY_TIERS) {
    if (bookingValue <= tier.limit) {
      return { cost: tier.cost, label: tier.label };
    }
  }
  const cost = bookingValue * 0.02;
  return { cost, label: "Custom plan (2.0% flat)" };
}

function formatINR(n: number) {
  return `₹${Math.round(n).toLocaleString("en-IN")}`;
}

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How much commission does Airbnb charge hosts in India?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Airbnb's host-only fee typically ranges from 16% to 24% of the booking subtotal, depending on the listing's cancellation policy and location. Most Goa villa hosts see an effective rate around 18%.",
      },
    },
    {
      "@type": "Question",
      name: "How does Wayzyy's pricing work instead of commission?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Wayzyy uses a prepaid credit model instead of a per-booking commission. Hosts buy a credit pack that unlocks a set value of bookings — for example, a ₹2,200 pack unlocks ₹1,00,000 in bookings (2.2% effective rate), and a ₹10,000 pack unlocks ₹5,00,000 in bookings (2.0% effective rate). Beyond ₹5,00,000, hosts move to a Custom plan at the same flat 2.0% rate. There is no deduction from individual payouts.",
      },
    },
    {
      "@type": "Question",
      name: "Do I keep 100% of my nightly rate on Wayzyy?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Wayzyy does not deduct a commission from any individual booking payout. Hosts receive the full nightly rate they set; the only cost is the prepaid credit pack purchased upfront.",
      },
    },
  ],
};

export default function EarningsCalculator() {
  const location = useLocation();
  const [bookingValue, setBookingValue] = useState(100000);
  const [airbnbRate, setAirbnbRate] = useState(18);

  const result = useMemo(() => {
    const airbnbFee = bookingValue * (airbnbRate / 100);
    const airbnbTakeHome = bookingValue - airbnbFee;
    const wayzyy = wayzyyCost(bookingValue);
    const wayzyyTakeHome = bookingValue - wayzyy.cost;
    const savings = wayzyyTakeHome - airbnbTakeHome;
    const wayzyyEffectiveRate = (wayzyy.cost / bookingValue) * 100;
    return { airbnbFee, airbnbTakeHome, wayzyy, wayzyyTakeHome, savings, wayzyyEffectiveRate };
  }, [bookingValue, airbnbRate]);

  const schemas = [
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: "Airbnb vs Wayzyy Host Earnings Calculator",
      url: `https://wayzyy.com${location.pathname}`,
      description:
        "Compare how much you'd take home listing a Goa villa on Airbnb versus Wayzyy's no-commission credit model.",
    },
    {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: "Wayzyy Airbnb vs Wayzyy Host Earnings Calculator",
      operatingSystem: "All",
      applicationCategory: "BusinessApplication",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "INR",
      },
      description:
        "Calculate and compare host platform commission fees on Airbnb vs Wayzyy flat prepaid credit packs to see your net home profits.",
    },
    faqJsonLd,
  ];

  return (
    <SEO
      title="Airbnb vs Wayzyy Host Earnings Calculator — Wayzyy"
      description="See exactly how much more you'd take home hosting on Wayzyy instead of Airbnb. Enter your booking value, compare commission vs our flat credit model."
      jsonLd={schemas}
      path={location.pathname}
    >
      <div className="min-h-screen bg-background text-foreground">
        <div className="border-b border-border bg-background/80 backdrop-blur sticky top-0 z-40">
          <div className="container flex items-center justify-between gap-4 py-4">
            <div className="flex items-center gap-4">
              <Link
                to="/"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Wayzyy
              </Link>
              <span className="text-border">·</span>
              <img src="/favicon.png" alt="Wayzyy" className="h-7 w-auto" />
            </div>
            <ThemeToggle />
          </div>
        </div>

        <div className="bg-card/20 py-4 border-b border-border/40">
          <div className="container max-w-3xl flex items-center gap-1.5 text-xs text-muted-foreground">
            <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
            <ChevronRight className="h-3 w-3 opacity-60" />
            <span className="text-foreground font-medium">Earnings Calculator</span>
          </div>
        </div>

        <div className="border-b border-border bg-card/40 py-12 sm:py-16">
          <div className="container max-w-3xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1 text-xs uppercase tracking-[0.25em] text-muted-foreground">
              <TrendingUp className="h-3.5 w-3.5 text-ember" />
              Calculator
            </div>
            <h1 className="font-display text-3xl sm:text-5xl text-foreground mt-2 leading-tight">
              Airbnb vs Wayzyy — Host Earnings Calculator
            </h1>
            <p className="mt-4 text-sm text-muted-foreground leading-relaxed max-w-xl">
              Enter what your villa actually books for in a year and see exactly how much of that Airbnb's
              commission eats up — versus what you'd keep on Wayzyy's flat prepaid credit model.
            </p>
          </div>
        </div>

        <div className="container max-w-3xl py-12 sm:py-16">
          <div className="rounded-2xl border border-border bg-card/40 p-6 sm:p-8">
            <div className="mb-8">
              <div className="flex items-center justify-between mb-3">
                <label htmlFor="booking-value" className="text-sm font-semibold text-foreground">
                  Total booking value (per year)
                </label>
                <Input
                  id="booking-value"
                  type="number"
                  min={1000}
                  step={1000}
                  value={bookingValue}
                  onChange={(e) => setBookingValue(Math.max(1000, Number(e.target.value) || 0))}
                  className="w-36 text-right"
                />
              </div>
              <Slider
                value={[bookingValue]}
                onValueChange={([v]) => setBookingValue(v)}
                min={20000}
                max={2000000}
                step={5000}
              />
              <p className="mt-2 text-xs text-muted-foreground">
                Not sure? Multiply your typical nightly rate × nights booked per year, across all your properties.
              </p>
            </div>

            <div className="mb-8">
              <div className="flex items-center justify-between mb-3">
                <label htmlFor="airbnb-rate" className="text-sm font-semibold text-foreground">
                  Airbnb host commission
                </label>
                <span className="text-sm font-semibold text-foreground">{airbnbRate}%</span>
              </div>
              <Slider
                value={[airbnbRate]}
                onValueChange={([v]) => setAirbnbRate(v)}
                min={16}
                max={24}
                step={0.5}
              />
              <p className="mt-2 text-xs text-muted-foreground">
                Airbnb's host-only fee typically ranges 16–24% depending on your cancellation policy and location.
                Default is 18%, a realistic average for Goa villa listings — adjust to match your own.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="rounded-xl border border-border bg-background p-5">
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-3">Airbnb</p>
                <p className="text-2xl font-display text-foreground">{formatINR(result.airbnbTakeHome)}</p>
                <p className="mt-1 text-xs text-muted-foreground">you take home</p>
                <p className="mt-3 text-xs text-muted-foreground">
                  −{formatINR(result.airbnbFee)} commission ({airbnbRate}%)
                </p>
              </div>
              <div className="rounded-xl border border-ember/40 bg-ember/5 p-5">
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-3">Wayzyy</p>
                <p className="text-2xl font-display text-ember">{formatINR(result.wayzyyTakeHome)}</p>
                <p className="mt-1 text-xs text-muted-foreground">you take home</p>
                <p className="mt-3 text-xs text-muted-foreground">
                  −{formatINR(result.wayzyy.cost)} prepaid credit ({result.wayzyyEffectiveRate.toFixed(1)}% effective, {result.wayzyy.label})
                </p>
              </div>
            </div>

            <div className="mt-6 rounded-xl border border-ember/30 bg-ember/5 p-5 text-center">
              <p className="text-sm text-muted-foreground">You'd keep</p>
              <p className="font-display text-3xl text-ember mt-1">
                {formatINR(Math.max(0, result.savings))} more
              </p>
              <p className="text-sm text-muted-foreground mt-1">on Wayzyy for the same bookings</p>
            </div>
          </div>

          <div className="policy-content mt-16">
            <h2>Wayzyy's Prepaid Credit Tiers</h2>
            <p>
              Instead of a per-booking commission, Wayzyy hosts buy a credit pack upfront that unlocks a set value
              of bookings. There's no deduction from individual payouts — you keep 100% of the nightly rate you set.
            </p>
            <table>
              <caption>Wayzyy host credit tiers</caption>
              <thead>
                <tr>
                  <th>Credit pack</th>
                  <th>Unlocks bookings up to</th>
                  <th>Effective rate</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>₹600</td>
                  <td>₹20,000</td>
                  <td>3.0%</td>
                </tr>
                <tr>
                  <td>₹1,200</td>
                  <td>₹50,000</td>
                  <td>2.4%</td>
                </tr>
                <tr>
                  <td>₹2,200</td>
                  <td>₹1,00,000</td>
                  <td>2.2%</td>
                </tr>
                <tr>
                  <td>₹5,000</td>
                  <td>₹2,50,000</td>
                  <td>2.0%</td>
                </tr>
                <tr>
                  <td>₹10,000</td>
                  <td>₹5,00,000</td>
                  <td>2.0%</td>
                </tr>
                <tr>
                  <td>Custom plan</td>
                  <td>Any amount beyond ₹5,00,000</td>
                  <td>2.0%</td>
                </tr>
              </tbody>
            </table>
            <p>
              From ₹2,50,000/year onward, the effective rate holds at a 2.0% floor — and for bookings beyond
              ₹5,00,000/year, hosts move to a Custom plan at the same flat 2.0% rate, however much you book. Full
              terms are in our <a href="/host-terms">Host Terms of Service</a>.
            </p>

            <h2>Frequently Asked Questions</h2>
            {faqJsonLd.mainEntity.map((faq) => (
              <div key={faq.name} className="mb-6">
                <h3>{faq.name}</h3>
                <p>{faq.acceptedAnswer.text}</p>
              </div>
            ))}

            <div className="mt-12 pt-8 border-t border-border">
              <p className="font-semibold text-foreground mb-4">Also worth reading:</p>
              <ul className="space-y-2">
                <li>
                  <a href="/blog/best-airbnb-alternatives-goa">5 Best Airbnb Alternatives in India for Booking Villas in Goa (2026)</a>
                </li>
                <li>
                  <a href="/blog/why-villas-goa-different-prices-platforms">Why Villas in Goa Cost Different Prices on Different Platforms</a>
                </li>
                <li>
                  <a href="/blog/how-much-can-you-earn-vacation-rental-goa">How Much Can You Actually Earn From a Vacation Rental in Goa?</a>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-16 rounded-2xl border border-border bg-card/40 p-6">
            <p className="font-semibold text-foreground mb-1">Want to list your villa on Wayzyy?</p>
            <p className="text-sm text-muted-foreground">
              Email us at{" "}
              <a href="mailto:hello@wayzyy.com" className="text-ember hover:underline">
                hello@wayzyy.com
              </a>{" "}
              — Wayzyy is launching soon in Goa.
            </p>
          </div>
        </div>
      </div>
    </SEO>
  );
}
