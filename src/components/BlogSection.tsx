import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "./Reveal";
import { blogPosts } from "@/lib/blogPosts";

export function BlogSection() {
  if (blogPosts.length === 0) return null;

  const [featured, ...rest] = blogPosts;
  const secondary = rest.slice(0, 3);

  return (
    <section id="blog" className="relative scroll-smooth-anchor py-28 sm:py-40">
      <div className="container">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <Link
              to={`/blog/${featured.slug}`}
              className="group block h-full overflow-hidden rounded-2xl border border-border bg-card transition-colors hover:border-ember/60"
            >
              <img
                src={featured.heroImage}
                alt={featured.title}
                className="aspect-video w-full object-cover"
                loading="lazy"
              />
              <div className="p-6 sm:p-8">
                <h3 className="font-display text-2xl text-foreground transition-colors group-hover:text-ember sm:text-3xl">
                  {featured.title}
                </h3>
                <p className="mt-3 text-pretty text-sm text-muted-foreground sm:text-base">
                  {featured.description}
                </p>
                <p className="mt-4 text-xs text-muted-foreground">{featured.readTime}</p>
              </div>
            </Link>
          </Reveal>

          <Reveal delay={0.05}>
            <div className="flex h-full flex-col justify-center">
              <div className="mb-3 inline-flex w-fit items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs uppercase tracking-[0.25em] text-muted-foreground">
                <span className="h-1.5 w-1.5 rounded-full bg-ember" />
                Blogs
              </div>
              <h2 className="font-display text-4xl leading-[1.04] text-foreground sm:text-6xl text-balance">
                Stay ahead, with our latest reads
              </h2>
              <Link
                to="/blog"
                className="mt-6 inline-flex w-fit items-center gap-1.5 text-sm font-medium text-ember hover:underline"
              >
                View all Blogs
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </Reveal>
        </div>

        {secondary.length > 0 && (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:mt-16 lg:grid-cols-3">
            {secondary.map((post, i) => (
              <Reveal key={post.slug} delay={0.05 * (i + 1)}>
                <Link
                  to={`/blog/${post.slug}`}
                  className="group block h-full overflow-hidden rounded-2xl border border-border bg-card transition-colors hover:border-ember/60"
                >
                  <img
                    src={post.heroImage}
                    alt={post.title}
                    className="aspect-video w-full object-cover"
                    loading="lazy"
                  />
                  <div className="p-6">
                    <h3 className="font-display text-xl text-foreground transition-colors group-hover:text-ember">
                      {post.title}
                    </h3>
                    <p className="mt-2 text-pretty text-sm text-muted-foreground">
                      {post.description}
                    </p>
                    <p className="mt-3 text-xs text-muted-foreground">{post.readTime}</p>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
