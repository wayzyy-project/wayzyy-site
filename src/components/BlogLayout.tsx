import { Link, useLocation } from "react-router-dom";
import { ArrowLeft, ChevronRight } from "lucide-react";
import { SEO } from "./SEO";
import { ThemeToggle } from "./theme-toggle";

import { BlogPostMeta } from "@/lib/blogPosts";

interface BlogLayoutProps {
  post?: BlogPostMeta;
  title?: string;
  description?: string;
  /** Search-result <title> / og:title — keep under 60 chars, distinct from the on-page H1 */
  metaTitle?: string;
  /** Search-result meta description / og:description — keep under 155 chars, distinct from the on-page subtitle */
  metaDescription?: string;
  heroImage?: string;
  heroImageAlt?: string;
  publishedDate?: string;
  slug?: string;
  children: React.ReactNode;
  extraJsonLd?: Record<string, unknown> | Record<string, unknown>[];
}

export function BlogLayout(props: BlogLayoutProps) {
  const location = useLocation();
  const path = location.pathname;

  const post = props.post;
  const title = props.title || post?.title || "";
  const description = props.description || post?.description || "";
  const metaTitle = props.metaTitle || post?.metaTitle || title;
  const metaDescription = props.metaDescription || post?.metaDescription || description;
  const heroImage = props.heroImage || post?.heroImage || "/og-image.png";
  const heroImageAlt = props.heroImageAlt || title;
  const publishedDate = props.publishedDate || post?.publishedDate || "2026-08-01";
  const { children, extraJsonLd } = props;


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

          <div className="mt-16 rounded-2xl border border-border bg-card/40 p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p className="font-semibold text-foreground mb-1">Want to list your villa on Wayzyy?</p>
              <p className="text-sm text-muted-foreground">
                Email us at{" "}
                <a href="mailto:hello@wayzyy.com" className="text-ember hover:underline font-medium">
                  hello@wayzyy.com
                </a>{" "}
                — Wayzyy is launching soon in Goa.
              </p>
            </div>
            <div className="flex items-center gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-border/40">
              <a
                href="https://www.instagram.com/staywayzyy/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Wayzyy Instagram"
                className="p-2.5 rounded-full border border-border bg-background hover:border-ember text-muted-foreground hover:text-ember transition-colors"
              >
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              </a>
              <a
                href="https://www.linkedin.com/company/wayzyy/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Wayzyy LinkedIn"
                className="p-2.5 rounded-full border border-border bg-background hover:border-ember text-muted-foreground hover:text-ember transition-colors"
              >
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
              </a>
              <a
                href="https://x.com/wayzyycom"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Wayzyy X / Twitter"
                className="p-2.5 rounded-full border border-border bg-background hover:border-ember text-muted-foreground hover:text-ember transition-colors"
              >
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </SEO>
  );
}
