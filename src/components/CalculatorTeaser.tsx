import { Link } from "react-router-dom";
import { ArrowUpRight, TrendingUp } from "lucide-react";
import { Reveal } from "./Reveal";
import { Button } from "@/components/ui/button";

export function CalculatorTeaser() {
  return (
    <section className="relative scroll-smooth-anchor py-20 sm:py-28">
      <div className="container">
        <Reveal>
          <div className="rounded-2xl border border-ember/30 bg-ember/5 p-6 sm:p-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 sm:gap-6">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1 text-xs uppercase tracking-[0.25em] text-muted-foreground">
                <TrendingUp className="h-3.5 w-3.5 text-ember" />
                For hosts
              </div>
              <h2 className="font-display text-2xl sm:text-3xl text-foreground leading-tight">
                Want to know the difference? Calculate it.
              </h2>
              <p className="mt-2 text-sm text-muted-foreground max-w-md">
                See exactly how much more you'd take home listing on Wayzyy instead of Airbnb — enter your real
                booking value and compare side by side.
              </p>
            </div>
            <Button asChild variant="cta-outline" size="pill" className="shrink-0">
              <Link to="/earnings-calculator" className="gap-1.5">
                Try the earnings calculator
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
