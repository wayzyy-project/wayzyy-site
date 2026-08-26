import { Reveal } from "./Reveal";
import { PartyPopper, Users, CreditCard, Lock } from "lucide-react";
import { PartyFigurines } from "./PartyFigurines";

const perks = [
  { icon: PartyPopper, label: "Find your perfect Wayzyy" },
  { icon: Users, label: "Manage guest headcount" },
  { icon: CreditCard, label: "Payments, all in one place" },
  { icon: Lock, label: "Full privacy & security" },
];

export function HousePartiesSection() {
  return (
    <section className="relative overflow-hidden py-12 sm:py-24 border-t border-border/40">
      {/* blurred backdrop */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-br from-ember/15 via-background to-background"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-40 -top-40 h-[400px] w-[400px] rounded-full bg-ember/10 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-20 -left-20 h-[300px] w-[300px] rounded-full bg-ember/8 blur-3xl"
      />

      <div className="container relative px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <Reveal>
            <div className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-ember/40 bg-ember/10 px-3 py-1 text-xs font-semibold text-ember">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-ember" />
              Coming Soon
            </div>
          </Reveal>

          <Reveal delay={0.05}>
            <h2 className="font-display text-3xl leading-[1.08] text-foreground sm:text-5xl text-balance font-extrabold">
              Host your next{" "}
              <span className="italic text-ember">house party.</span>{" "}
              Sorted.
            </h2>
          </Reveal>

          <Reveal delay={0.08}>
            <p className="mx-auto mt-3 max-w-lg text-pretty text-xs sm:text-base text-muted-foreground leading-relaxed">
              Find your perfect Wayzyy, lock in your venue, and manage guests, payments, and headcount — all on one platform. You handle the vibe. We handle the rest.
            </p>
          </Reveal>

          {/* party figurines illustration */}
          <Reveal delay={0.1}>
            <div className="mx-auto mt-6 max-w-sm sm:max-w-md">
              <PartyFigurines className="w-full text-foreground scale-95" />
              {/* ground shadow */}
              <div className="mx-auto -mt-1 h-1.5 w-3/4 rounded-full bg-foreground/8 blur-sm" />
            </div>
          </Reveal>

          {/* 2x2 Grid on Mobile, Single Row on Laptop/Desktop */}
          <Reveal delay={0.12}>
            <div className="mt-6 sm:mt-8 grid grid-cols-2 gap-2 md:flex md:flex-nowrap md:items-center md:justify-center md:gap-3 max-w-sm sm:max-w-md md:max-w-4xl mx-auto">
              {perks.map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  className="flex items-center justify-center gap-1.5 rounded-xl md:rounded-full border border-border bg-card/80 px-3 md:px-3.5 py-2 text-[11px] sm:text-xs text-muted-foreground backdrop-blur text-center font-medium shadow-xs whitespace-nowrap"
                >
                  <Icon className="h-3.5 w-3.5 shrink-0 text-ember" />
                  <span>{label}</span>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.15}>
            <div className="mt-6 rounded-xl sm:rounded-2xl border border-ember/20 bg-ember/5 p-4 sm:p-5 text-xs sm:text-sm text-muted-foreground">
              Secure your Wayzyy. Count your people. Collect payments. Stay protected. All under one roof —{" "}
              <span className="text-foreground font-semibold">no spreadsheets, no group chats, no chaos.</span>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
