import { motion, useScroll, useTransform } from "framer-motion";
import { Link } from "react-router-dom";
import { ThemeToggle } from "@/components/theme-toggle";
import { KeyJuggler } from "@/components/KeyJuggler";

export function SiteNav() {
  const { scrollY } = useScroll();
  const bg = useTransform(
    scrollY,
    [0, 80],
    ["hsla(0,0%,0%,0)", "hsla(var(--background) / 0.75)"]
  );
  const border = useTransform(scrollY, [0, 80], ["0", "1px"]);
  const blur = useTransform(scrollY, [0, 80], ["blur(0px)", "blur(10px)"]);

  return (
    <motion.header
      style={{
        backgroundColor: bg,
        backdropFilter: blur as unknown as string,
        WebkitBackdropFilter: blur as unknown as string,
        borderBottomWidth: border as unknown as string,
      }}
      className="fixed inset-x-0 top-0 z-50 border-border"
    >
      <div className="w-full px-[clamp(1.25rem,6vw,6rem)] flex h-20 items-center justify-between">
        <a href="#top" className="group flex items-center">
          <img src="/favicon.svg" alt="Wayzyy" className="h-11 w-11 rounded-full object-cover" />
        </a>
        <nav className="hidden items-center gap-8 text-sm text-muted-foreground sm:flex">
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
            className="group flex items-center gap-1.5 font-bold text-ember hover:text-ember/80"
            to="/host"
          >
            <KeyJuggler className="h-6 w-6 text-ember" />
            Hosting
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
    </motion.header>
  );
}
