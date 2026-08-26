import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { TrendingUp, ArrowUpRight, Calculator, CheckCircle2 } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Reveal } from "./Reveal";

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

export function HomeCalculatorSection() {
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

  return (
    <section className="relative py-20 sm:py-28 bg-card/20 border-t border-border/50 overflow-hidden">
      {/* Background ambience */}
      <div className="pointer-events-none absolute -left-40 top-1/2 h-96 w-96 -translate-y-1/2 rounded-full bg-ember/5 blur-3xl" />
      <div className="pointer-events-none absolute -right-40 top-1/2 h-96 w-96 -translate-y-1/2 rounded-full bg-sky-500/5 blur-3xl" />

      <div className="container relative z-10">
        <Reveal>
          <div className="mx-auto max-w-3xl text-center mb-12">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-ember/30 bg-ember/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.25em] text-ember">
              <TrendingUp className="h-3.5 w-3.5" />
              Interactive Host Earnings Calculator
            </div>
            <h2 className="font-display text-3xl sm:text-5xl text-foreground font-extrabold tracking-tight leading-tight">
              See how much more you'd keep on Wayzyy
            </h2>
            <p className="mt-4 text-sm sm:text-base text-muted-foreground max-w-xl mx-auto leading-relaxed">
              Enter your real booking value and compare Airbnb's 18% commission against Wayzyy's flat prepaid credit model.
            </p>
          </div>
        </Reveal>

        <Reveal>
          <div className="mx-auto max-w-3xl rounded-3xl border border-white/15 bg-background/80 p-6 sm:p-10 shadow-2xl backdrop-blur-xl">
            {/* Slider 1: Total Booking Value */}
            <div className="mb-8 space-y-3">
              <div className="flex items-center justify-between gap-4">
                <label htmlFor="home-booking-value" className="text-sm font-bold text-foreground flex items-center gap-2">
                  <Calculator className="h-4 w-4 text-ember" />
                  Total yearly booking value
                </label>
                <div className="flex items-center gap-1 rounded-xl border border-border bg-card px-3 py-1.5 shadow-sm">
                  <Input
                    id="home-booking-value"
                    type="number"
                    min={10000}
                    step={5000}
                    value={bookingValue}
                    onChange={(e) => setBookingValue(Math.max(10000, Number(e.target.value) || 0))}
                    className="h-7 w-28 text-right border-0 bg-transparent p-0 text-sm font-bold text-foreground focus-visible:ring-0"
                  />
                </div>
              </div>
              <Slider
                value={[bookingValue]}
                onValueChange={([v]) => setBookingValue(v)}
                min={20000}
                max={2000000}
                step={5000}
                className="py-2"
              />
              <div className="flex justify-between text-[11px] font-medium text-muted-foreground">
                <span>₹20,000</span>
                <span>₹5,000,00 (Goa Villa Average)</span>
                <span>₹20,00,000</span>
              </div>
            </div>

            {/* Slider 2: Airbnb Host Commission */}
            <div className="mb-8 space-y-3">
              <div className="flex items-center justify-between gap-4">
                <label htmlFor="home-airbnb-rate" className="text-sm font-bold text-foreground">
                  Airbnb host commission rate
                </label>
                <span className="rounded-lg bg-red-500/10 border border-red-500/20 px-2.5 py-1 text-xs font-bold text-red-500">
                  {airbnbRate}%
                </span>
              </div>
              <Slider
                value={[airbnbRate]}
                onValueChange={([v]) => setAirbnbRate(v)}
                min={16}
                max={24}
                step={0.5}
                className="py-2"
              />
            </div>

            {/* Comparison Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {/* Airbnb Card */}
              <div className="rounded-2xl border border-border/80 bg-card/60 p-6 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Airbnb</span>
                    <span className="text-[11px] font-semibold text-red-500 bg-red-500/10 px-2 py-0.5 rounded-full">
                      -{airbnbRate}% commission
                    </span>
                  </div>
                  <p className="text-3xl font-display font-extrabold text-foreground">{formatINR(result.airbnbTakeHome)}</p>
                  <p className="mt-1 text-xs text-muted-foreground font-medium">Net take-home payout</p>
                </div>
                <p className="mt-4 pt-3 border-t border-border/40 text-xs text-muted-foreground">
                  Loses <span className="font-bold text-red-500">{formatINR(result.airbnbFee)}</span> to platform fees
                </p>
              </div>

              {/* Wayzyy Card */}
              <div className="rounded-2xl border border-ember/50 bg-ember/10 p-6 flex flex-col justify-between relative overflow-hidden shadow-lg shadow-ember/5">
                <div className="absolute top-0 right-0 rounded-bl-xl bg-ember px-3 py-0.5 text-[10px] font-bold text-white uppercase tracking-wider">
                  Recommended
                </div>
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-ember">Wayzyy</span>
                    <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                      ~{result.wayzyyEffectiveRate.toFixed(1)}% rate
                    </span>
                  </div>
                  <p className="text-3xl font-display font-extrabold text-ember">{formatINR(result.wayzyyTakeHome)}</p>
                  <p className="mt-1 text-xs text-muted-foreground font-medium">Net take-home payout</p>
                </div>
                <p className="mt-4 pt-3 border-t border-ember/20 text-xs text-muted-foreground">
                  Only <span className="font-bold text-foreground">{formatINR(result.wayzyy.cost)}</span> prepaid credit pack ({result.wayzyy.label})
                </p>
              </div>
            </div>

            {/* Total Savings Highlight Box */}
            <div className="mt-6 rounded-2xl border border-ember/40 bg-gradient-to-r from-ember/15 via-ember/10 to-amber-500/15 p-6 text-center shadow-md">
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Your Net Extra Revenue</p>
              <p className="font-display text-3xl sm:text-4xl font-extrabold text-ember mt-1">
                +{formatINR(Math.max(0, result.savings))} Extra Income
              </p>
              <p className="text-xs sm:text-sm text-foreground/80 font-medium mt-1">
                You keep <span className="font-bold text-ember">100% of your nightly rates</span> on Wayzyy with zero payout deductions.
              </p>

              <div className="mt-5 flex flex-col sm:flex-row items-center justify-center gap-3">
                <a
                  href="#waitlist"
                  className="w-full sm:w-auto h-11 px-6 rounded-full bg-ember hover:bg-ember/90 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-ember/25 transition-all flex items-center justify-center gap-2"
                >
                  Join Goa Host Waitlist
                  <CheckCircle2 className="h-4 w-4" />
                </a>

                <Link
                  to="/earnings-calculator"
                  className="w-full sm:w-auto h-11 px-5 rounded-full border border-border hover:bg-card text-foreground font-semibold text-xs transition-all flex items-center justify-center gap-1.5"
                >
                  Full Calculator breakdown
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
