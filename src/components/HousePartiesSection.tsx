import { motion } from "framer-motion";
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
    <section className="relative overflow-hidden py-28 sm:py-40">
      {/* blurred backdrop */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-br from-ember/20 via-background to-background"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-40 -top-40 h-[600px] w-[600px] rounded-full bg-ember/10 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-20 -left-20 h-[400px] w-[400px] rounded-full bg-ember/8 blur-3xl"
      />

      <div className="container relative">
        <div className="mx-auto max-w-3xl text-center">
          <Reveal>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-ember/40 bg-ember/10 px-4 py-1.5 text-sm font-medium text-ember">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-ember" />
              Coming Soon
            </div>
          </Reveal>

          <Reveal delay={0.05}>
            <h2 className="font-display text-4xl leading-[1.04] text-foreground sm:text-6xl text-balance">
              Host your next{" "}
              <span className="italic text-ember">house party.</span>{" "}
              Sorted.
            </h2>
          </Reveal>

          <Reveal delay={0.1}>
            <p className="mx-auto mt-6 max-w-xl text-pretty text-base text-muted-foreground sm:text-lg">
              Find your perfect Wayzyy, lock in your venue, and manage guests, payments, and headcount - all on one platform. You handle the vibe. We handle the rest.
            </p>
          </Reveal>

          {/* party figurines illustration */}
          <Reveal delay={0.12}>
            <div className="mx-auto mt-10 max-w-lg">
              <PartyFigurines className="w-full text-foreground" />
              {/* ground shadow */}
              <div className="mx-auto -mt-1 h-2 w-4/5 rounded-full bg-foreground/8 blur-md" />
            </div>
          </Reveal>

          <Reveal delay={0.14}>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
              {perks.map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  className="flex items-center gap-2 rounded-full border border-border bg-card/80 px-4 py-2 text-sm text-muted-foreground backdrop-blur"
                >
                  <Icon className="h-3.5 w-3.5 text-ember" />
                  {label}
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.18}>
            <div className="mt-10 rounded-2xl border border-ember/20 bg-ember/5 p-6 text-sm text-muted-foreground">
              Secure your Wayzyy. Count your people. Collect payments. Stay protected. All under one roof - {" "}
              <span className="text-foreground font-medium">no spreadsheets, no group chats, no chaos.</span>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
