import { Link } from "react-router-dom";
import { ChevronRight, ArrowLeft } from "lucide-react";
import { SEO } from "@/components/SEO";
import { ThemeToggle } from "@/components/theme-toggle";
import { POLICY_TOC, EFFECTIVE_DATE } from "@/data/legalDocs";

export default function Policies() {
  return (
    <SEO
      title="Policies - Wayzyy"
      description="Every Wayzyy policy in one place: guest and host terms, cancellations, payments, safety, discrimination, disputes, and grievance redressal."
      path="/policies"
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

        {/* Header */}
        <div className="border-b border-border bg-card/40 py-12 sm:py-16">
          <div className="container max-w-3xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1 text-xs uppercase tracking-[0.25em] text-muted-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-ember" />
              Legal
            </div>
            <h1 className="font-display text-4xl sm:text-5xl text-foreground mt-2 leading-tight">Policies</h1>
            <p className="mt-4 text-sm text-muted-foreground leading-relaxed max-w-xl">
              These documents together make up Wayzyy's Terms of Service. They explain what guests and
              hosts can expect from each other and from us, and how bookings, payments, and disputes are
              handled. Tap any document below to read it in full.
            </p>
            <p className="mt-2 text-xs text-muted-foreground">Effective {EFFECTIVE_DATE}</p>
          </div>
        </div>

        {/* Document groups */}
        <div className="container max-w-3xl py-12 sm:py-16">
          <div className="space-y-8">
            {POLICY_TOC.map((group) => (
              <div key={group.heading}>
                <p className="text-xs uppercase tracking-widest text-muted-foreground/60 mb-3">
                  {group.heading}
                </p>
                <div className="rounded-2xl border border-border overflow-hidden bg-card/40">
                  {group.links.map((link, idx) => (
                    <Link
                      key={link.href}
                      to={link.href}
                      className={`flex items-center justify-between px-5 py-4 text-sm text-foreground hover:bg-card/80 transition-colors ${
                        idx > 0 ? "border-t border-border/60" : ""
                      }`}
                    >
                      {link.title}
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Footer contact strip */}
          <div className="mt-16 rounded-2xl border border-border bg-card/40 p-6">
            <p className="font-semibold text-foreground mb-1">Questions about any of these policies?</p>
            <p className="text-sm text-muted-foreground">
              Email us at{" "}
              <a href="mailto:hello@wayzyy.com" className="text-ember hover:underline">
                hello@wayzyy.com
              </a>
            </p>
            <p className="mt-1 text-sm text-muted-foreground">Wayzyy Technologies Private Limited</p>
          </div>
        </div>
      </div>
    </SEO>
  );
}
