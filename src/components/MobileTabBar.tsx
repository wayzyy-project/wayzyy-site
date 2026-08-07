import { Link, useLocation } from "react-router-dom";
import { Home, Sparkles, Calculator, BookOpen, KeyRound } from "lucide-react";

interface Tab {
  label: string;
  icon: typeof Home;
  href: string;
  /** Matches the active route by prefix instead of exact path. */
  matchPrefix?: string;
}

const tabs: Tab[] = [
  { label: "Home", icon: Home, href: "/" },
  { label: "Why", icon: Sparkles, href: "/#why" },
  { label: "Calculator", icon: Calculator, href: "/earnings-calculator", matchPrefix: "/earnings-calculator" },
  { label: "Blog", icon: BookOpen, href: "/blog", matchPrefix: "/blog" },
  { label: "Host", icon: KeyRound, href: "/host", matchPrefix: "/host" },
];

// Routes that already have their own full-screen chrome (auth overlays,
// admin dashboards) where a persistent bottom tab bar would just get in
// the way rather than help navigation.
const HIDDEN_PREFIXES = ["/adminn"];

/**
 * iOS-style bottom tab bar, mobile only. Lets a visitor jump straight to
 * the site's main destinations without hunting through the header nav
 * (which collapses on small screens). Active tab is derived from the
 * current route so it always reflects where you actually are.
 */
export function MobileTabBar() {
  const location = useLocation();
  const path = location.pathname;

  if (HIDDEN_PREFIXES.some((p) => path.startsWith(p))) return null;

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 backdrop-blur-lg [padding-bottom:env(safe-area-inset-bottom)] sm:hidden"
      aria-label="Site sections"
    >
      <div className="grid grid-cols-5">
        {tabs.map((tab) => {
          const isActive = tab.matchPrefix
            ? path.startsWith(tab.matchPrefix)
            : tab.href === "/#why"
              ? path === "/" && location.hash === "#why"
              : path === "/" && tab.href === "/" && location.hash !== "#why";
          const Icon = tab.icon;
          return (
            <Link
              key={tab.label}
              to={tab.href}
              className={`flex flex-col items-center justify-center gap-1 py-2.5 text-[11px] font-medium transition-colors active:scale-95 ${
                isActive ? "text-ember" : "text-muted-foreground"
              }`}
            >
              <Icon className="h-5 w-5" strokeWidth={isActive ? 2.4 : 2} />
              {tab.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
