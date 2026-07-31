import { motion, useScroll, useTransform } from "framer-motion";
import { Link } from "react-router-dom";
import { ThemeToggle } from "@/components/theme-toggle";
import { KeyJuggler } from "@/components/KeyJuggler";

import { Swords } from "lucide-react";

export function SiteNav() {
  const { scrollY } = useScroll();
  const bgOpacity = useTransform(scrollY, [0, 80], [0, 0.85]);
  const borderOpacity = useTransform(scrollY, [0, 80], [0, 1]);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <motion.div
        style={{ opacity: bgOpacity }}
        className="absolute inset-0 bg-background/90 backdrop-blur-md"
      />
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
          <a className="hover:text-foreground" href="#waitlist">
            Waitlist
          </a>
          <Link className="hover:text-foreground" to="/earnings-calculator">
            Calculator
          </Link>
          <Link className="hover:text-foreground" to="/blog">
            Blog
          </Link>
          <Link
            className="group flex items-center gap-1.5 rounded-full border border-ember/30 bg-ember/10 px-3.5 py-1 text-xs font-bold text-ember transition-colors hover:bg-ember hover:text-white"
            to="/host"
          >
            <KeyJuggler className="h-5 w-5 text-ember group-hover:text-white" />
            Hosting
          </Link>
          <Link
            className="group flex items-center gap-1.5 rounded-full border border-[#FF6B00]/40 bg-[#FF6B00]/10 px-3.5 py-1 text-xs font-bold text-[#FF6B00] transition-all hover:bg-[#FF6B00] hover:text-white shadow-sm shadow-[#FF6B00]/10"
            to="/gig-challenge"
          >
            <Swords className="h-3.5 w-3.5 text-white" />
            <span>$1,000 Challenge</span>
          </Link>
        </nav>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <a
            href="#waitlist"
            className="hidden rounded-full bg-foreground px-4 py-1.5 text-sm text-background transition-colors hover:bg-foreground/90 sm:inline-block"
          >
            Get early access
          </a>
        </div>
      </div>
    </header>
  );
}
