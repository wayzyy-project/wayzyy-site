import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion, type PanInfo } from "framer-motion";
import {
  ArrowLeft,
  ArrowUpRight,
  AtSign,
  Briefcase,
  Instagram,
  Linkedin,
  Mail,
  Smartphone,
  Sparkles,
  Twitter,
} from "lucide-react";
import { SEO } from "@/components/SEO";
import { ThemeToggle } from "@/components/theme-toggle";
import cardSocials from "@/assets/goa-cinematic/bazaar.webp";
import cardContact from "@/assets/goa-cinematic/sunset-host.webp";
import cardApp from "@/assets/goa-cinematic/pool-deck.webp";

type Row = {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  sub?: string;
  href?: string;
};

type Card = {
  id: string;
  spine: string;
  eyebrow: string;
  title: string;
  image: string;
  rows: Row[];
  cta?: { label: string; href: string };
  note?: string;
};

const CARDS: Card[] = [
  {
    id: "socials",
    spine: "Socials",
    eyebrow: "Follow along",
    title: "We post the real thing",
    image: cardSocials,
    rows: [
      { icon: Instagram, label: "Instagram", sub: "@staywayzyy", href: "https://www.instagram.com/staywayzyy/" },
      { icon: Linkedin, label: "LinkedIn", sub: "/company/wayzyy", href: "https://www.linkedin.com/company/wayzyy/" },
      { icon: Twitter, label: "X", sub: "@wayzyycom", href: "https://x.com/wayzyycom" },
    ],
  },
  {
    id: "contact",
    spine: "Contact",
    eyebrow: "Say hello",
    title: "A real person replies",
    image: cardContact,
    rows: [
      { icon: Mail, label: "General", sub: "hello@wayzyy.com", href: "mailto:hello@wayzyy.com" },
      { icon: Briefcase, label: "Hosts and partnerships", sub: "hello@wayzyy.com", href: "mailto:hello@wayzyy.com?subject=Hosting%20with%20Wayzyy" },
      { icon: AtSign, label: "Press", sub: "hello@wayzyy.com", href: "mailto:hello@wayzyy.com?subject=Press" },
    ],
    cta: { label: "Email us", href: "mailto:hello@wayzyy.com" },
  },
  {
    id: "app",
    spine: "The app",
    eyebrow: "Almost there",
    title: "Going live soon",
    image: cardApp,
    rows: [{ icon: Smartphone, label: "iOS and Android", sub: "In the works" }],
    note: "We're putting the finishing touches on it. Follow along on socials and you'll know the day it lands.",
  },
];

/** One card in the deck. Front card is interactive; the ones behind are decorative. */
function DeckCard({ card, isFront }: { card: Card; isFront: boolean }) {
  return (
    <div className="relative h-full w-full overflow-hidden rounded-[28px] bg-neutral-900 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.6)]">
      <img src={card.image} alt="" aria-hidden className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/45" />

      {/* vertical spine, mirrors the reference card's side band */}
      <div className="absolute inset-y-0 right-0 flex w-14 flex-col items-center justify-between bg-black/85 py-6">
        <span className="rounded-md bg-white/10 px-2 py-2 text-[9px] font-semibold uppercase tracking-wider text-white/80 [writing-mode:vertical-rl]">
          Wayzyy
        </span>
        <span className="font-display text-2xl font-bold text-white [writing-mode:vertical-rl] rotate-180">
          {card.spine}
        </span>
      </div>

      {/* content */}
      <div className="absolute inset-y-0 left-0 right-14 flex flex-col justify-between p-6">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[hsl(25,100%,62%)]">
            {card.eyebrow}
          </p>
          <h2 className="mt-1.5 font-display text-xl font-bold leading-tight text-white sm:text-2xl">
            {card.title}
          </h2>
        </div>

        <div className="rounded-2xl border border-white/15 bg-white/[0.07] p-3 backdrop-blur-md">
          {card.rows.map((row, i) => {
            const Icon = row.icon;
            const inner = (
              <>
                <Icon className="h-4 w-4 shrink-0 text-white/85" />
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-medium text-white">{row.label}</span>
                  {row.sub && <span className="block truncate text-xs text-white/60">{row.sub}</span>}
                </span>
                {row.href && <ArrowUpRight className="h-4 w-4 shrink-0 text-white/50" />}
              </>
            );

            const cls = `flex items-center gap-3 rounded-xl px-2.5 py-2.5 transition-colors ${
              row.href ? "hover:bg-white/10" : ""
            } ${i > 0 ? "mt-0.5 border-t border-white/10 pt-3" : ""}`;

            return row.href ? (
              <a
                key={row.label}
                href={row.href}
                target={row.href.startsWith("http") ? "_blank" : undefined}
                rel={row.href.startsWith("http") ? "noopener noreferrer" : undefined}
                // Cards behind the front one shouldn't be tabbable or clickable.
                tabIndex={isFront ? 0 : -1}
                className={cls}
              >
                {inner}
              </a>
            ) : (
              <div key={row.label} className={cls}>
                {inner}
              </div>
            );
          })}

          {card.note && <p className="px-2.5 pb-1 pt-3 text-xs leading-relaxed text-white/60">{card.note}</p>}

          {card.cta && (
            <a
              href={card.cta.href}
              tabIndex={isFront ? 0 : -1}
              className="mt-3 flex items-center justify-center gap-2 rounded-full bg-white/90 px-5 py-3 text-sm font-semibold text-black transition-colors hover:bg-white"
            >
              {card.cta.label} <ArrowUpRight className="h-4 w-4" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Links() {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);
  const count = CARDS.length;

  // The deck fans out less on narrow screens, otherwise the flanking cards
  // push past the viewport edge instead of peeking.
  const [narrow, setNarrow] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 480px)");
    const sync = () => setNarrow(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  // Shortest signed distance from the active card, so the deck wraps around.
  const offsetOf = (i: number) => {
    let d = i - active;
    if (d > count / 2) d -= count;
    if (d < -count / 2) d += count;
    return d;
  };

  const go = (dir: number) => setActive((a) => (a + dir + count) % count);

  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x < -60 || info.velocity.x < -400) go(1);
    else if (info.offset.x > 60 || info.velocity.x > 400) go(-1);
  };

  return (
    <SEO
      title="Wayzyy — all our links in one place"
      description="Every Wayzyy link in one place: our socials, how to reach a real person, and the app."
      path="/links"
    >
      <div className="relative min-h-screen overflow-hidden bg-[#0b0b0d] text-white">
        <div className="pointer-events-none absolute -top-32 left-1/2 h-[420px] w-[760px] -translate-x-1/2 rounded-full bg-ember/20 blur-[130px]" />

        <header className="relative mx-auto flex max-w-5xl items-center justify-between px-5 py-5">
          <Link
            to="/"
            className="flex items-center gap-1.5 rounded-full border border-white/15 bg-black/50 px-3 py-1.5 text-xs font-medium text-white/70 backdrop-blur-md transition-colors hover:text-white"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Wayzyy home
          </Link>
          <ThemeToggle />
        </header>

        {/* extra bottom padding clears the global MobileTabBar */}
        <main className="relative mx-auto flex max-w-5xl flex-col items-center px-5 pb-28 sm:pb-16">
          <div className="text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-ember/40 bg-ember/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-ember">
              <Sparkles className="h-3 w-3" /> Wayzyy
            </span>
            <h1 className="mt-4 font-display text-3xl font-bold sm:text-4xl">Everything, one place.</h1>
            <p className="mx-auto mt-2 max-w-sm text-sm text-white/60">
              Swipe through, or tap a card to bring it forward.
            </p>
          </div>

          {/* deck */}
          <div className="relative mt-10 flex h-[520px] w-full max-w-[360px] items-center justify-center sm:max-w-[380px]">
            {CARDS.map((card, i) => {
              const off = offsetOf(i);
              const isFront = off === 0;
              const abs = Math.abs(off);

              return (
                <motion.div
                  key={card.id}
                  drag={isFront && !reduce ? "x" : false}
                  dragElastic={0.18}
                  dragConstraints={{ left: 0, right: 0 }}
                  onDragEnd={onDragEnd}
                  onClick={() => !isFront && setActive(i)}
                  animate={{
                    x: off * (narrow ? 46 : 76),
                    scale: 1 - abs * 0.08,
                    opacity: abs > 1 ? 0 : 1,
                    rotate: off * 4,
                  }}
                  transition={
                    reduce ? { duration: 0 } : { type: "spring", stiffness: 260, damping: 30 }
                  }
                  style={{ zIndex: count - abs }}
                  className={`absolute h-[470px] w-[300px] sm:w-[320px] ${
                    isFront ? "cursor-grab active:cursor-grabbing" : "cursor-pointer"
                  }`}
                  aria-hidden={!isFront}
                >
                  <DeckCard card={card} isFront={isFront} />
                </motion.div>
              );
            })}
          </div>

          {/* dots */}
          <div className="mt-8 flex items-center gap-2">
            {CARDS.map((card, i) => (
              <button
                key={card.id}
                onClick={() => setActive(i)}
                aria-label={`Show ${card.spine}`}
                aria-current={i === active}
                className={`h-2 rounded-full transition-all ${
                  i === active ? "w-7 bg-ember" : "w-2 bg-white/25 hover:bg-white/45"
                }`}
              />
            ))}
          </div>

          <p className="mt-10 text-center text-xs text-white/35">
            wayzyy.com · stays without the small print
          </p>
        </main>
      </div>
    </SEO>
  );
}
