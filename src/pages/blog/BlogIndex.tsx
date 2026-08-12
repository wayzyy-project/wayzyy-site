import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { SEO } from "@/components/SEO";
import { ThemeToggle } from "@/components/theme-toggle";
import { blogPosts } from "@/lib/blogPosts";

export default function BlogIndex() {
  const schemas = [
    {
      "@context": "https://schema.org",
      "@type": "Blog",
      "name": "Wayzyy Blog",
      "url": "https://wayzyy.com/blog",
      "publisher": { "@type": "Organization", "name": "Wayzyy" },
    },
  ];

  return (
    <SEO
      title="Wayzyy Blog - Villas, Vacation Rentals & Honest Travel Guides"
      description="Guides on booking villas in Goa, comparing Airbnb alternatives, and finding transparent, locally hosted vacation rentals in India."
      jsonLd={schemas}
      path="/blog"
    >
      <div className="min-h-screen bg-background text-foreground">
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

        <div className="border-b border-border bg-card/40 py-12 sm:py-16">
          <div className="container max-w-7xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1 text-xs uppercase tracking-[0.25em] text-muted-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-ember" />
              Blog
            </div>
            <h1 className="font-display text-4xl sm:text-5xl text-foreground mt-2 leading-tight">
              Wayzyy Blog
            </h1>
            <p className="mt-4 text-sm text-muted-foreground leading-relaxed max-w-xl">
              Honest guides on booking villas, comparing vacation rental platforms, and finding better stays in Goa.
            </p>
          </div>
        </div>

        <div className="container max-w-7xl py-12 sm:py-16 grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {blogPosts.map((post) => (
            <Link
              key={post.slug}
              to={`/blog/${post.slug}`}
              className="group flex flex-col h-full rounded-2xl border border-border bg-card/40 overflow-hidden hover:border-ember/60 transition-colors"
            >
              <img
                src={post.heroImage}
                alt={post.title}
                className="w-full aspect-video object-cover"
                loading="lazy"
              />
              <div className="p-6 flex flex-col flex-grow">
                <h2 className="font-display text-xl text-foreground group-hover:text-ember transition-colors line-clamp-2">
                  {post.title}
                </h2>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed flex-grow line-clamp-3">
                  {post.description}
                </p>
                <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground border-t border-border/40 pt-3">
                  <span>{post.readTime}</span>
                  <span>
                    {new Date(post.publishedDate).toLocaleDateString("en-IN", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </SEO>
  );
}
