export interface BlogPostMeta {
  slug: string;
  title: string;
  description: string;
  /** <title> / og:title / twitter:title — must stay under 60 chars, written manually */
  metaTitle: string;
  /** meta description / og:description / twitter:description — must stay under 155 chars, written manually */
  metaDescription: string;
  heroImage: string;
  publishedDate: string;
  readTime: string;
}

export const blogPosts: BlogPostMeta[] = [
  {
    slug: "best-airbnb-alternatives-goa",
    title: "5 Best Airbnb Alternatives in India for Booking Villas in Goa (2026)",
    description:
      "Comparing Airbnb, Booking.com, MakeMyTrip, StayVista, SaffronStays, and Wayzyy — real fee data, what each platform actually costs you, and what's worth checking before you confirm.",
    metaTitle: "5 Best Airbnb Alternatives in India for Goa Villas (2026)",
    metaDescription:
      "Airbnb changed its fee model in 2025. Here's how that affects what you pay for a villa in Goa — and which platforms actually cost less.",
    heroImage: "/blog/goa-villa-private-pool-vacation-rental.jpg",
    publishedDate: "2026-07-06",
    readTime: "8 Min Read",
  },
  {
    slug: "why-villas-goa-different-prices-platforms",
    title: "Why Villas in Goa Cost Different Prices on Different Platforms — The Fee Breakdown",
    description:
      "Ever noticed the same villa in Goa priced differently on Airbnb, Booking.com, and other sites? Here is the honest breakdown of platform commissions, hidden fees, and how to book smarter.",
    metaTitle: "Why Goa Villa Prices Vary Across Booking Platforms",
    metaDescription:
      "The same villa in Goa can cost different amounts on Airbnb, Booking.com, and Wayzyy. Here is the honest breakdown of platform fees and commissions.",
    heroImage: "/blog/goa-villa-pricing-comparison.png",
    publishedDate: "2026-07-06",
    readTime: "7 Min Read",
  },
  {
    slug: "north-goa-vs-south-goa-guide",
    title: "North Goa vs South Goa — Which Part Is Actually Right for Your Trip?",
    description:
      "First time visiting Goa or coming back for a workation? Here is the honest breakdown of the vibe, villages, and seasonal differences between North and South Goa.",
    metaTitle: "North Goa vs South Goa — Which Is Best for Your Trip?",
    metaDescription:
      "First time visiting Goa or coming back for a workation? Here is the honest breakdown of the vibe, villages, and seasonal differences between North and South.",
    heroImage: "/blog/goa-north-vs-south-hero.png",
    publishedDate: "2026-07-06",
    readTime: "9 Min Read",
  },
  {
    slug: "workation-goa-guide",
    title: "Workation in Goa — What You Actually Need Before You Book",
    description:
      "Planning to work remotely from Goa? Here is the honest breakdown of coworking spaces, monthly costs, seasonality, and finding verified workation stays.",
    metaTitle: "Workation in Goa — Coworking, Stays & Monthly Budget (2026)",
    metaDescription:
      "Planning to work remotely from Goa? Read the honest guide to coworking, cafes, monthly costs, and Workation Verified villa rentals.",
    heroImage: "/blog/goa-workation-hero.png",
    publishedDate: "2026-07-06",
    readTime: "11 Min Read",
  },
];
