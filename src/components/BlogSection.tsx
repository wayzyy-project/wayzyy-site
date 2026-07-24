import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "./Reveal";
import { blogPosts } from "@/lib/blogPosts";

export function BlogSection() {
  const hostPricingPost = blogPosts.find((p) => p.slug === "why-villas-goa-different-prices-platforms") ?? blogPosts[0];
  const northSouthPost = blogPosts.find((p) => p.slug === "north-goa-vs-south-goa-guide") ?? blogPosts[1];

  const featuredPosts = [
    {
      ...hostPricingPost,
      badge: "Host Pricing & Fee Flowchart Included",
      subtitle: "Complete comparison of platform take-rates, guest checkout pricing, and visual host revenue flowchart.",
    },
    {
      ...northSouthPost,
      badge: "North vs South Goa Guide",
      subtitle: "Village-by-village breakdown of rental yields, guest vibes, and seasonal trade-offs for hosts & travellers.",
    },
  ];

  return (
    <section id="blog" className="relative scroll-smooth-anchor py-24 sm:py-32 border-t border-border bg-card/20">
      <div className="container max-w-6xl mx-auto px-4">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <Reveal>
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 rounded-full border border-ember/30 bg-ember/10 px-3.5 py-1 text-xs uppercase tracking-wider text-ember font-semibold">
                <span className="h-1.5 w-1.5 rounded-full bg-ember" />
                Host & Property Guides
              </div>
              <h2 className="font-display text-3xl sm:text-5xl font-bold text-foreground tracking-tight">
                Featured Host Guides & Market Analysis
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground max-w-2xl">
                In-depth price comparisons, interactive fee flowcharts, and village breakdowns built specifically for villa hosts and smart travelers.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.05}>
            <Link
              to="/blog"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-ember hover:underline shrink-0"
            >
              View all Guides & Articles
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </Reveal>
        </div>

        {/* 2 Host-Focused Guide Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {featuredPosts.map((post, idx) => (
            <Reveal key={post.slug} delay={0.08 * (idx + 1)}>
              <Link
                to={`/blog/${post.slug}`}
                className="group flex flex-col h-full overflow-hidden rounded-3xl border border-border bg-card transition-all duration-300 hover:border-ember/60 hover:shadow-xl"
              >
                <div className="relative aspect-video w-full overflow-hidden bg-muted">
                  <img
                    src={post.heroImage}
                    alt={post.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute top-4 left-4 rounded-full border border-ember/40 bg-black/75 backdrop-blur-md px-3 py-1 text-[11px] font-semibold text-white shadow-md">
                    📊 {post.badge}
                  </div>
                </div>

                <div className="flex flex-col justify-between flex-1 p-6 sm:p-8 space-y-4">
                  <div className="space-y-3">
                    <h3 className="font-display text-xl sm:text-2xl font-bold text-foreground transition-colors group-hover:text-ember leading-snug">
                      {post.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {post.subtitle}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
                    <span>{post.readTime}</span>
                    <span className="font-semibold text-ember group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                      Read Complete Guide →
                    </span>
                  </div>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
