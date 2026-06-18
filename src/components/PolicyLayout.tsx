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
  );
}
