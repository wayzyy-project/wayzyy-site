import { Link } from "react-router-dom";
import { blogPosts } from "@/lib/blogPosts";

// Words that appear in nearly every slug and say nothing about the topic.
const STOP = new Set([
  "goa", "guide", "the", "to", "in", "of", "a", "an", "and", "vs", "for", "on",
  "2026", "best", "how", "why", "what", "is", "your", "we", "you",
]);

// Slug keywords that mark a topic cluster. Two posts sharing a cluster are
// treated as related even when their slugs share no literal word.
const CLUSTERS: Record<string, string[]> = {
  beach: ["beach", "beaches", "butterfly", "cola", "agonda", "palolem", "patnem", "galgibaga", "kakolem", "baga", "calangute", "candolim", "anjuna", "vagator", "morjim", "mandrem", "ashwem"],
  north: ["north", "assagao", "siolim", "anjuna", "vagator", "morjim", "mandrem", "ashwem", "baga", "calangute", "candolim"],
  south: ["south", "palolem", "patnem", "agonda", "galgibaga", "cola", "kakolem", "butterfly", "cotigao", "cabo"],
  stay: ["stay", "villa", "villas", "homestay", "hotel", "where"],
  host: ["airbnb", "host", "earn", "rental", "business", "rental", "fee", "costs", "scale", "wayzyy", "registration", "dispute", "commission"],
  plan: ["trip", "budget", "itinerary", "time", "monsoon", "transport", "scooter", "workation", "family", "food", "nightlife", "markets", "cafes"],
};

const tokens = (slug: string) => slug.split("-").filter((t) => t && !STOP.has(t));

const clustersOf = (toks: string[]) =>
  Object.entries(CLUSTERS)
    .filter(([, words]) => toks.some((t) => words.includes(t)))
    .map(([name]) => name);

export function RelatedGuides({ currentSlug }: { currentSlug: string }) {
  const here = tokens(currentSlug);
  const hereClusters = new Set(clustersOf(here));

  const related = blogPosts
    .filter((p) => p.slug !== currentSlug && !p.slug.includes("sarvam"))
    .map((p) => {
      const toks = tokens(p.slug);
      const literal = toks.filter((t) => here.includes(t)).length;
      const shared = clustersOf(toks).filter((c) => hereClusters.has(c)).length;
      return { p, score: literal * 3 + shared * 2 };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score || b.p.publishedDate.localeCompare(a.p.publishedDate))
    .slice(0, 6)
    .map((x) => x.p);

  if (related.length === 0) return null;

  return (
    <aside className="mt-16" aria-labelledby="related-guides-heading">
      <h2 id="related-guides-heading" className="font-display text-2xl text-foreground mb-4">
        Keep reading
      </h2>
      <ul className="space-y-3">
        {related.map((p) => (
          <li key={p.slug}>
            <Link to={`/blog/${p.slug}`} className="text-ember hover:underline font-medium">
              {p.title}
            </Link>
          </li>
        ))}
      </ul>
      <p className="mt-6 text-sm text-muted-foreground">
        Looking for a place to stay?{" "}
        <Link to="/goa-stays" className="text-ember hover:underline">Browse verified stays in Goa</Link>
        {" · "}
        <Link to="/airbnb-alternative" className="text-ember hover:underline">Why hosts and guests choose Wayzyy</Link>
        {" · "}
        <Link to="/blog" className="text-ember hover:underline">All Goa guides</Link>
      </p>
    </aside>
  );
}
