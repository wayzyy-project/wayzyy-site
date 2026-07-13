import { Link, useLocation } from "react-router-dom";
import { ArrowLeft, ChevronRight } from "lucide-react";
import { SEO } from "./SEO";
import { ThemeToggle } from "./theme-toggle";

interface BlogLayoutProps {
  title: string;
  description: string;
  /** Search-result <title> / og:title — keep under 60 chars, distinct from the on-page H1 */
  metaTitle: string;
  /** Search-result meta description / og:description — keep under 155 chars, distinct from the on-page subtitle */
  metaDescription: string;
  heroImage: string;
  heroImageAlt: string;
  publishedDate: string;
  slug: string;
  children: React.ReactNode;
  extraJsonLd?: Record<string, unknown> | Record<string, unknown>[];
}

export function BlogLayout({
  title,
  description,
  metaTitle,
  metaDescription,
  heroImage,
  heroImageAlt,
  publishedDate,
  slug,
  children,
  extraJsonLd,
}: BlogLayoutProps) {
  const location = useLocation();
  const path = location.pathname;

  const schemas = [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://wayzyy.com" },
        { "@type": "ListItem", "position": 2, "name": "Blog", "item": "https://wayzyy.com/blog" },
        { "@type": "ListItem", "position": 3, "name": title, "item": `https://wayzyy.com${path}` },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "headline": title,
      "description": metaDescription,
      "image": heroImage.startsWith("http") ? heroImage : `https://wayzyy.com${heroImage}`,
      "datePublished": publishedDate,
      "author": {
        "@type": "Organization",
        "name": "Wayzyy",
      },
      "publisher": {
        "@type": "Organization",
        "name": "Wayzyy",
        "logo": {
          "@type": "ImageObject",
          "url": "https://wayzyy.com/favicon.png",
        },
      },
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": `https://wayzyy.com${path}`,
      },
    },
    ...(extraJsonLd ? (Array.isArray(extraJsonLd) ? extraJsonLd : [extraJsonLd]) : []),
  ];

  return (
    <SEO title={metaTitle} description={metaDescription} jsonLd={schemas} path={path} ogType="article" ogImage={heroImage}>
      <div className="min-h-screen bg-background text-foreground">
        <div className="border-b border-border bg-background/80 backdrop-blur sticky top-0 z-40">
          <div className="container flex items-center justify-between gap-4 py-4">
            <div className="flex items-center gap-4">
              <Link
                to="/blog"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Blog
              </Link>
              <span className="text-border">·</span>
              <img src="/favicon.svg" alt="Wayzyy" className="h-9 w-9 rounded-full object-cover" />
            </div>
            <ThemeToggle />
          </div>
        </div>

        <div className="bg-card/20 py-4 border-b border-border/40">
          <div className="container max-w-3xl flex items-center gap-1.5 text-xs text-muted-foreground">
            <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
            <ChevronRight className="h-3 w-3 opacity-60" />
            <Link to="/blog" className="hover:text-foreground transition-colors">Blog</Link>
            <ChevronRight className="h-3 w-3 opacity-60" />
            <span className="text-foreground font-medium truncate">{title}</span>
          </div>
        </div>

        <div className="border-b border-border bg-card/40 py-12 sm:py-16">
          <div className="container max-w-3xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1 text-xs uppercase tracking-[0.25em] text-muted-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-ember" />
              Blog
            </div>
            <h1 className="font-display text-3xl sm:text-5xl text-foreground mt-2 leading-tight">{title}</h1>
            <p className="mt-4 text-sm text-muted-foreground leading-relaxed max-w-xl">{description}</p>
            <p className="mt-2 text-xs text-muted-foreground">
              Published {new Date(publishedDate).toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" })}
            </p>
          </div>
        </div>

        <div className="container max-w-3xl pt-10">
          <img
            src={heroImage}
            alt={heroImageAlt}
            className={`w-full aspect-video rounded-2xl border border-border ${
              heroImage.includes("excalidraw") || 
              heroImage.includes("differently") || 
              heroImage.includes("booking-vs-wayzyy")
                ? "object-contain bg-white p-4 sm:p-6"
                : "object-cover"
            }`}
            loading="eager"
            {...({ fetchpriority: "high" } as Record<string, string>)}
          />
        </div>

        <div className="container max-w-3xl py-12 sm:py-16">
          <div className="policy-content">{children}</div>

          <div className="mt-16 rounded-2xl border border-border bg-card/40 p-6">
            <p className="font-semibold text-foreground mb-1">Want to list your villa on Wayzyy?</p>
            <p className="text-sm text-muted-foreground">
              Email us at{" "}
              <a href="mailto:hello@wayzyy.com" className="text-ember hover:underline">
                hello@wayzyy.com
              </a>{" "}
              — Wayzyy is launching soon in Goa.
            </p>
          </div>
        </div>
      </div>
    </SEO>
  );
}
