import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

interface PolicyLayoutProps {
  title: string;
  subtitle?: string;
  effectiveDate?: string;
  children: React.ReactNode;
}

export function PolicyLayout({ title, subtitle, effectiveDate, children }: PolicyLayoutProps) {
  return (
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

      {/* Header */}
      <div className="border-b border-border bg-card/40 py-12 sm:py-16">
        <div className="container max-w-3xl">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1 text-xs uppercase tracking-[0.25em] text-muted-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-ember" />
            Legal
          </div>
          <h1 className="font-display text-4xl sm:text-5xl text-foreground mt-2">{title}</h1>
          {subtitle && (
            <p className="mt-3 text-muted-foreground text-sm">{subtitle}</p>
          )}
          {effectiveDate && (
            <p className="mt-2 text-xs text-muted-foreground">Effective Date: {effectiveDate}</p>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="container max-w-3xl py-12 sm:py-16">
        <div className="prose prose-neutral dark:prose-invert max-w-none
          prose-headings:font-display prose-headings:text-foreground
          prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4 prose-h2:border-b prose-h2:border-border prose-h2:pb-2
          prose-h3:text-lg prose-h3:mt-6 prose-h3:mb-3
          prose-p:text-muted-foreground prose-p:leading-relaxed
          prose-li:text-muted-foreground
          prose-strong:text-foreground
          prose-a:text-ember prose-a:no-underline hover:prose-a:underline
        ">
          {children}
        </div>

        {/* Footer contact strip */}
        <div className="mt-16 rounded-2xl border border-border bg-card/40 p-6 text-sm text-muted-foreground">
          <p className="font-medium text-foreground mb-1">Questions about this policy?</p>
          <p>Email us at <a href="mailto:hello@wayzyy.com" className="text-ember hover:underline">hello@wayzyy.com</a></p>
          <p className="mt-1">Wayzyy Technologies Private Limited · 3 E 32, Nehru Nagar, Ghaziabad</p>
        </div>
      </div>
    </div>
  );
}
