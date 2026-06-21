import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { ArrowLeft, ChevronRight, MessageSquare } from "lucide-react";
import { SEO } from "./SEO";

interface PolicyLayoutProps {
  title: string;
  subtitle?: string;
  effectiveDate?: string;
  children: React.ReactNode;
}

export function PolicyLayout({ title, subtitle, effectiveDate, children }: PolicyLayoutProps) {
  const location = useLocation();
  const path = location.pathname;
  const [showComments, setShowComments] = useState(false);

  useEffect(() => {
    if (!showComments) return;

    // Set up Disqus configuration
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).disqus_config = function (this: any) {
      this.page.url = `https://wayzyy.com${path}`;
      this.page.identifier = path;
      this.page.title = title;
    };

    // Dynamically insert Disqus embed script
    const d = document;
    const s = d.createElement("script");
    s.src = "https://wayzyy.disqus.com/embed.js";
    s.setAttribute("data-timestamp", String(+new Date()));
    s.async = true;
    (d.head || d.body).appendChild(s);
  }, [showComments, path, title]);

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
      "name": `${title} — Wayzyy`,
      "description": subtitle ?? `Wayzyy legal policies and documentation: ${title}.`,
      "publisher": {
        "@type": "Organization",
        "name": "Wayzyy"
      }
    }
  ];

  return (
    <SEO
      title={`${title} — Wayzyy`}
      description={subtitle ?? `Read the official ${title} of Wayzyy. Cozy stays.. without small print.`}
      jsonLd={schemas}
      path={path}
    >
      <div className="min-h-screen bg-background text-foreground">
        {/* Top bar */}
        <div className="border-b border-border bg-background/80 backdrop-blur sticky top-0 z-40">
          <div className="container flex items-center gap-4 py-4">
            <Link
              to="/"
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Wayzyy
            </Link>
            <span className="text-border">·</span>
            <img src="/favicon.png" alt="Wayzyy" className="h-7 w-auto" />
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

          {/* Collapsible Disqus comments widget */}
          <div className="mt-12 pt-12 border-t border-border/80">
            <h3 className="font-display text-2xl text-foreground mb-4">Discussion & Community Feedback</h3>
            {!showComments ? (
              <button
                onClick={() => setShowComments(true)}
                className="inline-flex items-center gap-2 px-5 py-3 border border-border rounded-xl text-sm font-semibold text-foreground bg-card hover:bg-muted/50 transition-colors shadow-sm cursor-pointer"
              >
                <MessageSquare className="h-4 w-4 text-ember" /> Load Community Comments
              </button>
            ) : (
              <div id="disqus_thread" className="min-h-[250px] bg-card/10 rounded-2xl p-6 border border-border/40" />
            )}
          </div>
        </div>
      </div>
    </SEO>
  );
}
