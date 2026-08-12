import { Link, useLocation } from "react-router-dom";
import { ArrowLeft, ChevronRight } from "lucide-react";
import { SEO } from "./SEO";
import { ThemeToggle } from "./theme-toggle";

interface PolicyLayoutProps {
  title: string;
  subtitle?: string;
  effectiveDate?: string;
  children: React.ReactNode;
}

export function PolicyLayout({ title, subtitle, effectiveDate, children }: PolicyLayoutProps) {
  const location = useLocation();
  const path = location.pathname;

  const schemas = [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://wayzyy.com"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Legal",
          "item": `https://wayzyy.com${path}`
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": title,
          "item": `https://wayzyy.com${path}`
        }
      ]
    },
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": `${title} - Wayzyy`,
      "description": subtitle ?? `Wayzyy legal policies and documentation: ${title}.`,
      "publisher": {
        "@type": "Organization",
        "name": "Wayzyy"
      }
    }
  ];

  return (
    <SEO
      title={`${title} - Wayzyy`}
      description={subtitle ?? `Read the official ${title} of Wayzyy. cozy stays, crazy nights and fair hosting . That's wayzyy.`}
      jsonLd={schemas}
      path={path}
    >
      <div className="min-h-screen bg-background text-foreground">
        {/* Top bar */}
        <div className="border-b border-border bg-background/80 backdrop-blur sticky top-0 z-40">
          <div className="container flex items-center justify-between gap-4 py-4">
            <div className="flex items-center gap-4">
              <Link
                to="/"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Wayzyy
              </Link>
              <span className="text-border">·</span>
              <img src="/favicon.svg" alt="Wayzyy" className="h-9 w-9 rounded-full object-cover" />
            </div>
            <ThemeToggle />
          </div>
        </div>

        {/* Visual Breadcrumbs */}
        <div className="bg-card/20 py-4 border-b border-border/40">
          <div className="container max-w-3xl flex items-center gap-1.5 text-xs text-muted-foreground">
            <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
            <ChevronRight className="h-3 w-3 opacity-60" />
            <span className="hover:text-foreground cursor-default">Legal</span>
            <ChevronRight className="h-3 w-3 opacity-60" />
            <span className="text-foreground font-medium truncate">{title}</span>
          </div>
        </div>

        {/* Header */}
        <div className="border-b border-border bg-card/40 py-12 sm:py-16">
          <div className="container max-w-3xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1 text-xs uppercase tracking-[0.25em] text-muted-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-ember" />
              Legal
            </div>
            <h1 className="font-display text-4xl sm:text-5xl text-foreground mt-2 leading-tight">{title}</h1>
            {subtitle && (
              <p className="mt-4 text-sm text-muted-foreground leading-relaxed max-w-xl">{subtitle}</p>
            )}
            {effectiveDate && (
              <p className="mt-2 text-xs text-muted-foreground">{effectiveDate}</p>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="container max-w-3xl py-12 sm:py-16">
          <div className="policy-content">
            {children}
          </div>

          {/* Footer contact strip */}
          <div className="mt-16 rounded-2xl border border-border bg-card/40 p-6">
            <p className="font-semibold text-foreground mb-1">Questions about this policy?</p>
            <p className="text-sm text-muted-foreground">
              Email us at{" "}
              <a href="mailto:hello@wayzyy.com" className="text-ember hover:underline">
                hello@wayzyy.com
              </a>
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Wayzyy Technologies Private Limited
            </p>
          </div>
        </div>
      </div>
    </SEO>
  );
}
