import { useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Link } from "react-router-dom";
import { ThemeToggle } from "@/components/theme-toggle";
import { KeyJuggler } from "@/components/KeyJuggler";
import { ChallengeTopBanner } from "@/components/gig-challenge/ChallengeTopBanner";
import { Swords, ChevronDown, Calculator, ArrowUpRight } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

/** Real host-relevant links surfaced in the "Hosting" nav dropdown — pulled
 *  from actual host-focused posts in src/lib/blogPosts.ts, not placeholders. */
const hostLinks: { to: string; label: string; description: string }[] = [
  {
    to: "/host",
    label: "Host portal",
    description: "List your property and manage bookings",
  },
  {
    to: "/earnings-calculator",
    label: "Earnings calculator",
    description: "See what you'd keep vs Airbnb, side by side",
  },
  {
    to: "/blog/how-much-can-you-earn-vacation-rental-goa",
    label: "How much can you actually earn?",
    description: "The real profit breakdown for a Goa vacation rental",
  },
  {
    to: "/blog/hidden-costs-of-running-an-airbnb",
    label: "The hidden costs of running an Airbnb",
    description: "What nobody tells new hosts",
  },
  {
    to: "/blog/real-cost-of-airbnb-fee",
    label: "The real cost of Airbnb's 15.5% fee",
    description: "Isn't actually 15.5% — here's the ripple effect",
  },
];

/**
 * Accessible hover/focus dropdown for the "Hosting" nav item, built on
 * Radix's DropdownMenu (via shadcn) rather than hand-rolled CSS :hover so it
 * works identically on keyboard, touch, and mouse. Controlled `open` state
 * lets it open on hover in addition to Radix's built-in click/keyboard
 * handling, with a short close delay so moving the pointer from trigger to
 * content doesn't drop the menu.
 */
function HostNavMenu({ variant }: { variant: "floating" | "solid" }) {
  const [open, setOpen] = useState(false);
  const closeTimer = useRef<number | null>(null);

  const openNow = () => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    setOpen(true);
  };
  const closeSoon = () => {
    closeTimer.current = window.setTimeout(() => setOpen(false), 150);
  };

  const triggerClass =
    variant === "floating"
      ? "group liquid-glass flex items-center gap-1.5 rounded-full px-3.5 py-1 text-xs font-bold text-white outline-none transition-colors hover:bg-white hover:text-ink data-[state=open]:bg-white data-[state=open]:text-ink"
      : "group flex items-center gap-1.5 rounded-full border border-ember/30 bg-ember/10 px-3.5 py-1 text-xs font-bold text-ember outline-none transition-colors hover:bg-ember hover:text-white data-[state=open]:bg-ember data-[state=open]:text-white";

  const contentClass =
    variant === "floating"
      ? "liquid-glass z-50 w-80 rounded-2xl border border-white/15 bg-black/60 p-2 text-white shadow-2xl"
      : "z-50 w-80 rounded-2xl border border-border bg-popover p-2 text-popover-foreground shadow-2xl";

  const itemClass =
    variant === "floating"
      ? "flex flex-col gap-0.5 rounded-xl px-3 py-2.5 text-sm outline-none transition-colors hover:bg-white/10 focus:bg-white/10 cursor-pointer"
      : "flex flex-col gap-0.5 rounded-xl px-3 py-2.5 text-sm outline-none transition-colors hover:bg-ember/10 focus:bg-ember/10 cursor-pointer";

  const descriptionClass = variant === "floating" ? "text-xs text-white/60" : "text-xs text-muted-foreground";

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <div onMouseEnter={openNow} onMouseLeave={closeSoon}>
        <DropdownMenuTrigger className={triggerClass}>
          <KeyJuggler className={variant === "floating" ? "h-5 w-5 text-white group-hover:text-ink" : "h-5 w-5 text-ember group-hover:text-white"} />
          Hosting
          <ChevronDown className="h-3 w-3 transition-transform group-data-[state=open]:rotate-180" />
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="start"
          sideOffset={12}
          className={contentClass}
          onMouseEnter={openNow}
          onMouseLeave={closeSoon}
        >
          {hostLinks.map((link) => (
            <DropdownMenuItem key={link.to} asChild className={itemClass}>
              <Link to={link.to}>
                <span className="flex items-center gap-1.5 font-semibold">
                  {link.to === "/earnings-calculator" && <Calculator className="h-3.5 w-3.5 shrink-0 text-ember" />}
                  {link.label}
                  <ArrowUpRight className="ml-auto h-3.5 w-3.5 shrink-0 opacity-40" />
                </span>
                <span className={descriptionClass}>{link.description}</span>
              </Link>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </div>
    </DropdownMenu>
  );
}

interface SiteNavProps {
  /**
   * When true, renders as a floating, semi-transparent pill navbar
   * (meant to sit inside a full-bleed hero photo) instead of the
   * default fixed, edge-to-edge, scroll-aware opaque bar.
   * Defaults to false everywhere except pages that opt in explicitly.
   */
  floating?: boolean;
}

export function SiteNav({ floating = false }: SiteNavProps) {
  const { scrollY } = useScroll();
  const bgOpacity = useTransform(scrollY, [0, 80], [0, 0.85]);
  const borderOpacity = useTransform(scrollY, [0, 80], [0, 1]);

  if (floating) {
    return (
      <header className="absolute inset-x-0 top-0 z-50">
        <div className="w-full px-[clamp(1rem,5vw,4rem)] pt-[clamp(1rem,3vw,2rem)]">
          <div className="liquid-glass mx-auto flex h-16 max-w-5xl items-center justify-between rounded-full px-4 sm:px-6">
            <a href="#top" className="group flex items-center">
              <img src="/favicon.svg" alt="Wayzyy" className="h-9 w-9 rounded-full object-cover" />
            </a>
            <nav className="hidden items-center gap-6 text-sm text-white/90 sm:flex">
              <a className="hover:text-white" href="#why">
                Why
              </a>
              <a className="hover:text-white" href="#two-sides">
                Two sides
              </a>
              <Link className="hover:text-white" to="/waitlist">
                Waitlist
              </Link>
              <Link className="hover:text-white" to="/earnings-calculator">
                Calculator
              </Link>
              <Link className="hover:text-white" to="/blog">
                Blog
              </Link>
              <HostNavMenu variant="floating" />
              <Link
                className="group liquid-glass flex items-center gap-1.5 rounded-full px-3.5 py-1 text-xs font-bold text-white transition-all hover:bg-white hover:text-ink"
                to="/gig-challenge"
              >
                <Swords className="h-3.5 w-3.5 text-white group-hover:text-ink transition-colors" />
                <span>$1,000 Challenge</span>
              </Link>
            </nav>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <Link
                to="/waitlist"
                className="hidden rounded-full bg-white px-4 py-1.5 text-sm text-ink transition-colors hover:bg-white/90 sm:inline-block"
              >
                Get early access
              </Link>
            </div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <ChallengeTopBanner />
      {/* Scroll-driven background: the outer motion.div owns the
          fade-in opacity (absolute positioning must live here, not on the
          liquid-glass element — liquid-glass sets `position: relative`,
          which would stomp an `absolute` utility applied to the same
          node). The inner div carries the actual liquid-glass treatment
          plus an explicit inline background-color: liquid-glass's own
          `background` is a near-transparent 1% white, fine for a photo
          hero but unreadable once real page content is scrolling behind
          an opaque nav — the inline style (highest-specificity, always
          wins over any class) restores the solid backdrop this nav needs
          for legibility while still keeping liquid-glass's blur, inset
          highlight, and gradient-edge border. */}
      <motion.div style={{ opacity: bgOpacity }} className="absolute inset-0">
        <div
          className="liquid-glass h-full w-full"
          style={{ backgroundColor: "hsl(var(--background) / 0.9)" }}
        />
      </motion.div>
      <motion.div
        style={{ opacity: borderOpacity }}
        className="absolute inset-x-0 bottom-0 h-[1px] bg-border"
      />
      <div className="relative z-10 w-full px-[clamp(1.25rem,6vw,6rem)] flex h-20 items-center justify-between">
        <a href="#top" className="group flex items-center">
          <img src="/favicon.svg" alt="Wayzyy" className="h-11 w-11 rounded-full object-cover" />
        </a>
        <nav className="hidden items-center gap-6 text-sm text-muted-foreground sm:flex">
          <a className="hover:text-foreground" href="#why">
            Why
          </a>
          <a className="hover:text-foreground" href="#two-sides">
            Two sides
          </a>
          <Link className="hover:text-foreground" to="/waitlist">
            Waitlist
          </Link>
          <Link className="hover:text-foreground" to="/earnings-calculator">
            Calculator
          </Link>
          <Link className="hover:text-foreground" to="/blog">
            Blog
          </Link>
          <HostNavMenu variant="solid" />
          <Link
            className="group flex items-center gap-1.5 rounded-full border border-[#FF6B00]/40 bg-[#FF6B00]/10 px-3.5 py-1 text-xs font-bold text-[#FF6B00] transition-all hover:bg-[#FF6B00] hover:text-white shadow-sm shadow-[#FF6B00]/10"
            to="/gig-challenge"
          >
            <Swords className="h-3.5 w-3.5 text-[#FF6B00] dark:text-white group-hover:text-white transition-colors" />
            <span>$1,000 Challenge</span>
          </Link>
        </nav>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link
            to="/waitlist"
            className="hidden rounded-full bg-foreground px-4 py-1.5 text-sm text-background transition-colors hover:bg-foreground/90 sm:inline-block"
          >
            Get early access
          </Link>
        </div>
      </div>
    </header>
  );
}
