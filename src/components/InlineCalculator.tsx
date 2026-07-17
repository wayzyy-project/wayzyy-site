import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Calculator, CheckCircle2 } from "lucide-react";

const WAYZYY_TIERS = [
  { cost: 600, limit: 20000 },
  { cost: 1200, limit: 50000 },
  { cost: 2200, limit: 100000 },
  { cost: 5000, limit: 250000 },
  { cost: 10000, limit: 500000 },
];

function calculateWayzyyCost(val: number) {
  for (const tier of WAYZYY_TIERS) {
    if (val <= tier.limit) return tier.cost;
  }
  return val * 0.02; // 2.0% Custom flat plan beyond 5L
}

export function InlineCalculator() {
  const [revenue, setRevenue] = useState(500000);

  const stats = useMemo(() => {
    const airbnbFee = revenue * 0.18; // 18% average commission (incl. GST)
    const wayzyyFee = calculateWayzyyCost(revenue);
    const monthlySavings = airbnbFee - wayzyyFee;
    const yearlySavings = monthlySavings * 12;
    return { airbnbFee, wayzyyFee, monthlySavings, yearlySavings };
  }, [revenue]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="my-10 overflow-hidden rounded-2xl border border-ember/30 bg-ember/5 backdrop-blur-sm">
      <div className="p-6 sm:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/60 pb-6 mb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-ember/10 border border-ember/25 px-3 py-1 text-[11px] font-medium uppercase tracking-wider text-ember">
              <Calculator className="h-3 w-3" />
              Live Interactive Math
            </div>
            <h3 className="font-display text-xl sm:text-2xl text-foreground mt-2 leading-tight">
              Calculate Your True Earning Leak
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              See how much you lose to Airbnb's 18% fees versus Wayzyy's flat-rate credits.
            </p>
          </div>
          <Link
            to="/earnings-calculator"
            className="self-start md:self-center shrink-0 inline-flex items-center gap-1 text-xs sm:text-sm font-medium text-ember hover:text-ember/80 transition-colors"
          >
            Open Full Calculator
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="space-y-6">
          {/* Slider Input */}
          <div>
            <div className="flex justify-between items-center mb-3">
              <label className="text-sm font-medium text-muted-foreground">
                Average Monthly Booking Value
              </label>
              <span className="font-display text-lg font-bold text-foreground">
                {formatCurrency(revenue)}
              </span>
            </div>
            <input
              type="range"
              min="50000"
              max="1500000"
              step="50000"
              value={revenue}
              onChange={(e) => setRevenue(Number(e.target.value))}
              className="w-full h-1.5 bg-border rounded-lg appearance-none cursor-pointer accent-ember focus:outline-none"
            />
            <div className="flex justify-between text-[10px] sm:text-xs text-muted-foreground mt-1">
              <span>₹50K</span>
              <span>₹5L</span>
              <span>₹10L</span>
              <span>₹15L</span>
            </div>
          </div>

          {/* Comparison Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-border bg-background/50 flex flex-col justify-between">
              <div>
                <span className="text-[11px] uppercase tracking-wider text-muted-foreground">
                  Airbnb Commission (18%)
                </span>
                <div className="text-xl sm:text-2xl font-bold text-foreground mt-1">
                  {formatCurrency(stats.airbnbFee)}
                </div>
              </div>
              <p className="text-[11px] text-muted-foreground mt-2 leading-relaxed">
                Traditional commission models charge a flat rate that scales indefinitely with your bookings.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-ember/20 bg-ember/5 flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-ember/5 rounded-full blur-xl pointer-events-none"></div>
              <div>
                <span className="text-[11px] uppercase tracking-wider text-ember/80 font-medium">
                  Wayzyy Cost (Flat Pack)
                </span>
                <div className="text-xl sm:text-2xl font-bold text-ember mt-1">
                  {formatCurrency(stats.wayzyyFee)}
                </div>
              </div>
              <p className="text-[11px] text-ember/70 mt-2 leading-relaxed font-medium">
                No commission deducted from individual payouts. Unlock booking volumes with simple credits.
              </p>
            </div>
          </div>

          {/* Savings Highlight */}
          <div className="p-5 rounded-xl border border-emerald-500/20 bg-emerald-500/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-500 uppercase tracking-wider">
                <CheckCircle2 className="h-4 w-4" />
                Extra Net Profit Kept
              </div>
              <h4 className="text-lg sm:text-xl font-bold text-foreground mt-1 leading-tight">
                {formatCurrency(stats.monthlySavings)} / Month
              </h4>
            </div>
            <div className="sm:text-right">
              <span className="text-xs text-muted-foreground uppercase tracking-wider block">
                Additional Annual Profit
              </span>
              <span className="text-lg sm:text-xl font-bold text-emerald-500">
                {formatCurrency(stats.yearlySavings)} / Year
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
