import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { TrendingUp, ArrowUpRight, Calculator, CheckCircle2, Sparkles } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Reveal } from "./Reveal";

const WAYZYY_TIERS = [
  { cost: 600, limit: 20000, label: "₹600 pack" },
  { cost: 1200, limit: 50000, label: "₹1,200 pack" },
  { cost: 2200, limit: 100000, label: "₹2,200 pack" },
  { cost: 5000, limit: 250000, label: "₹5,000 pack" },
  { cost: 10000, limit: 500000, label: "₹10,000 pack" },
];

const PRESETS = [
  { label: "₹50K", value: 50000 },
  { label: "₹1L", value: 100000 },
  { label: "₹5L (Avg)", value: 500000 },
  { label: "₹10L", value: 1000000 },
  { label: "₹20L", value: 2000000 },
];

function wayzyyCost(bookingValue: number) {
  for (const tier of WAYZYY_TIERS) {
    if (bookingValue <= tier.limit) {
      return { cost: tier.cost, label: tier.label };
    }
  }
  const cost = bookingValue * 0.02;
  return { cost, label: "Custom (2.0%)" };
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
    <section className="relative py-10 sm:py-20 bg-card/20 border-t border-border/50 overflow-hidden">
      {/* Subtle background glow */}
      <div className="pointer-events-none absolute -left-32 top-1/2 h-72 w-72 -translate-y-1/2 rounded-full bg-ember/5 blur-3xl" />
      <div className="pointer-events-none absolute -right-32 top-1/2 h-72 w-72 -translate-y-1/2 rounded-full bg-sky-500/5 blur-3xl" />

      <div className="container relative z-10 px-4 sm:px-6">
        <Reveal>
          <div className="mx-auto max-w-2xl text-center mb-6 sm:mb-8">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-border bg-card px-3.5 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-ember animate-pulse" />
              Host Earnings Calculator
            </div>
            <h2 className="font-display text-3xl sm:text-5xl font-extrabold text-foreground tracking-tight leading-[1.08]">
              See how much more you keep on Wayzyy
            </h2>
            <p className="mt-3 text-sm sm:text-base text-muted-foreground max-w-lg mx-auto leading-relaxed">
              Compare Airbnb's 18% commission against Wayzyy's flat prepaid credit model.
            </p>
          </div>
        </Reveal>

        <Reveal>
          <div className="mx-auto max-w-2xl rounded-2xl sm:rounded-3xl border border-border/80 bg-background/90 p-4 sm:p-7 shadow-xl backdrop-blur-xl">
            {/* Input 1: Total Booking Value */}
            <div className="mb-4 sm:mb-5">
              <div className="flex items-center justify-between gap-2 mb-2">
                <label htmlFor="home-booking-value" className="text-xs sm:text-sm font-semibold text-foreground flex items-center gap-1.5">
                  <Calculator className="h-3.5 w-3.5 text-ember" />
                  Total yearly bookings
                </label>
                <div className="flex items-center rounded-full border border-border bg-card px-3 py-1">
                  <span className="text-xs font-semibold text-muted-foreground mr-1">₹</span>
                  <Input
                    id="home-booking-value"
                    type="number"
                    min={10000}
                    step={5000}
                    value={bookingValue}
                    onChange={(e) => setBookingValue(Math.max(10000, Number(e.target.value) || 0))}
                    className="h-5 w-24 text-right border-0 bg-transparent p-0 text-xs sm:text-sm font-bold text-foreground focus-visible:ring-0"
                  />
                </div>
              </div>

              <Slider
                value={[bookingValue]}
                onValueChange={([v]) => setBookingValue(v)}
                min={20000}
                max={2000000}
                step={5000}
                className="py-1.5"
              />

              {/* Quick preset chips */}
              <div className="flex items-center justify-between gap-1 mt-2">
                {PRESETS.map((p) => (
                  <button
                    key={p.label}
                    type="button"
                    onClick={() => setBookingValue(p.value)}
                    className={`px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-medium transition-all cursor-pointer ${
                      bookingValue === p.value
                        ? "bg-ember text-white font-bold shadow-xs"
                        : "bg-card/70 hover:bg-card border border-border/60 text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Input 2: Airbnb Host Commission */}
            <div className="mb-4 sm:mb-5 pt-3 border-t border-border/40">
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <label htmlFor="home-airbnb-rate" className="text-xs sm:text-sm font-semibold text-foreground">
                  Airbnb commission rate
                </label>
                <span className="rounded-md bg-red-500/10 border border-red-500/20 px-2 py-0.5 text-[11px] font-bold text-red-500">
                  {airbnbRate}%
                </span>
              </div>
              <Slider
                value={[airbnbRate]}
                onValueChange={([v]) => setAirbnbRate(v)}
                min={16}
                max={24}
                step={0.5}
                className="py-1.5"
              />
            </div>

            {/* Side-by-Side Comparison Cards (Compact 2-Column on Mobile & Desktop) */}
            <div className="grid grid-cols-2 gap-2.5 sm:gap-4 mb-4">
              {/* Airbnb Card */}
              <div className="rounded-xl border border-border/80 bg-card/50 p-3 sm:p-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-muted-foreground">Airbnb</span>
                    <span className="text-[9px] sm:text-[11px] font-semibold text-red-500 bg-red-500/10 px-1.5 py-0.5 rounded">
                      -{airbnbRate}%
                    </span>
                  </div>
                  <p className="text-lg sm:text-2xl font-display font-bold text-foreground">
                    {formatINR(result.airbnbTakeHome)}
                  </p>
                  <p className="text-[10px] sm:text-xs text-muted-foreground">Net take-home</p>
                </div>
                <div className="mt-2.5 pt-2 border-t border-border/40 text-[10px] sm:text-xs text-muted-foreground">
                  Loses <span className="font-bold text-red-500">-{formatINR(result.airbnbFee)}</span>
                </div>
              </div>

              {/* Wayzyy Card */}
              <div className="rounded-xl border border-ember/50 bg-ember/10 p-3 sm:p-4 flex flex-col justify-between relative overflow-hidden shadow-xs">
                <div className="absolute top-0 right-0 rounded-bl-lg bg-ember px-2 py-0.5 text-[8px] sm:text-[10px] font-bold text-white uppercase tracking-wider">
                  Best
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-ember">Wayzyy</span>
                    <span className="text-[9px] sm:text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                      ~{result.wayzyyEffectiveRate.toFixed(1)}%
                    </span>
                  </div>
                  <p className="text-lg sm:text-2xl font-display font-bold text-ember">
                    {formatINR(result.wayzyyTakeHome)}
                  </p>
                  <p className="text-[10px] sm:text-xs text-muted-foreground">Net take-home</p>
                </div>
                <div className="mt-2.5 pt-2 border-t border-ember/20 text-[10px] sm:text-xs text-muted-foreground">
                  Cost: <span className="font-bold text-foreground">{formatINR(result.wayzyy.cost)}</span> ({result.wayzyy.label})
                </div>
              </div>
            </div>

            {/* Total Savings Hero Bar */}
            <div className="rounded-xl border border-ember/30 bg-gradient-to-r from-ember/15 via-ember/10 to-amber-500/10 p-3 sm:p-4 text-center">
              <div className="flex items-center justify-center gap-1 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                <Sparkles className="h-3 w-3 text-ember" />
                Extra profit kept
              </div>
              <p className="font-display text-2xl sm:text-3xl font-extrabold text-ember my-0.5">
                +{formatINR(Math.max(0, result.savings))}
              </p>
              <p className="text-[11px] sm:text-xs text-foreground/80">
                You keep <span className="font-semibold text-ember">100% of your nightly rates</span> with zero payout deductions.
              </p>

              <div className="mt-3 flex items-center justify-center gap-2">
                <a
                  href="#waitlist"
                  className="flex-1 sm:flex-initial h-9 px-4 rounded-full bg-ember hover:bg-ember/90 text-white font-bold text-[11px] uppercase tracking-wider shadow-md shadow-ember/20 transition-all flex items-center justify-center gap-1.5"
                >
                  Join Waitlist
                  <CheckCircle2 className="h-3.5 w-3.5" />
                </a>

                <Link
                  to="/earnings-calculator"
                  className="h-9 px-3.5 rounded-full border border-border hover:bg-card text-foreground font-semibold text-[11px] transition-all flex items-center justify-center gap-1"
                >
                  Full Breakdown
                  <ArrowUpRight className="h-3 w-3" />
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
