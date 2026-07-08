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
  {
    slug: "goa-scooter-rental-guide",
    title: "Goa Scooter Rental Guide — Everything You Need to Know Before Renting a Scooter in Goa",
    description:
      "Renting a scooter in Goa? Read this breakdown of daily costs, document requirements, traffic laws, and how to avoid common rental pitfalls.",
    metaTitle: "Goa Scooter Rental Guide — Costs, Rules & Tips (2026)",
    metaDescription:
      "Planning to rent a scooter in Goa? Learn typical rental prices, license and ID requirements, speed camera updates, and check-list tips.",
    heroImage: "/blog/goa-scooter-hero.png",
    publishedDate: "2026-07-07",
    readTime: "8 Min Read",
  },
  {
    slug: "best-time-to-visit-goa",
    title: "Best Time to Visit Goa — The Complete Guide for Every Vibe",
    description:
      "When is the best time to visit Goa? Read our breakdown of seasonal weather, travel styles, crowd patterns, and booking strategies.",
    metaTitle: "Best Time to Visit Goa — Seasonality, Weather & Tips (2026)",
    metaDescription:
      "When is the best time to visit Goa? Learn about peak winter tourist periods, monsoon travel, shoulder seasons, and the best months to book a villa.",
    heroImage: "/blog/goa-best-time-hero.png",
    publishedDate: "2026-07-08",
    readTime: "7 Min Read",
  },
  {
    slug: "goa-trip-budget-guide",
    title: "Goa Trip Budget Guide (2026): How Much Does a Goa Trip Actually Cost?",
    description:
      "How much money should you budget for Goa? Read our realistic breakdown of accommodation, food, cafes, scooter rentals, and booking strategies.",
    metaTitle: "Goa Trip Budget Guide (2026): Real Costs & Booking Tips",
    metaDescription:
      "Planning a trip to Goa? Find realistic budget estimates for solo travellers, couples, families, and groups. Learn where to save on stays and transport.",
    heroImage: "/blog/goa-budget-hero.png",
    publishedDate: "2026-07-09",
    readTime: "9 Min Read",
  },
  {
    slug: "assagao-goa-villas-guide",
    title: "Assagao Villas Guide (2026): Why Everyone Wants to Stay in Goa's Most Popular Village",
    description:
      "Why is everyone suddenly talking about Assagao? Read our honest guide to Assagao's villas, cafes, restaurants, and travel style.",
    metaTitle: "Assagao Villas & Stays Guide (2026) — Stays, Cafes & Tips",
    metaDescription:
      "Why is everyone staying in Assagao? Learn about Portuguese villas, cafe scenes, typical costs, and tips for foreigners and remote workers in Goa.",
    heroImage: "/blog/goa-assagao-village.png",
    publishedDate: "2026-07-10",
    readTime: "9 Min Read",
  },
  {
    slug: "siolim-goa-villas-guide",
    title: "Siolim Villas Guide (2026): Why This Quiet North Goa Village is the Best Base for Slow Travel",
    description:
      "Why is everyone suddenly talking about Siolim? Read our honest guide to Siolim's villas, cafes, restaurants, and travel style.",
    metaTitle: "Siolim Villas & Stays Guide (2026) — Stays, Cafes & Tips",
    metaDescription:
      "Why is everyone staying in Siolim? Learn about Portuguese villas, riverfront stays, typical costs, and tips for remote workers in Goa.",
    heroImage: "/blog/goa-siolim-river.png",
    publishedDate: "2026-07-11",
    readTime: "9 Min Read",
  },
  {
    slug: "mandrem-goa-beach-guide",
    title: "Mandrem Beach Guide (2026): Why Experienced Goa Travellers Keep Recommending It",
    description:
      "Why do repeat visitors choose Mandrem? Read our honest guide to Mandrem's beaches, stays, safety tips, cafes, and typical costs.",
    metaTitle: "Mandrem Beach Guide (2026) — Stays, Cafes & Tips",
    metaDescription:
      "Why do repeat travellers stay in Mandrem? Read our guide on beachwear, safety, typical costs, local tips, and workation advice for Mandrem, Goa.",
    heroImage: "/blog/goa-mandrem-sunset-net.jpg",
    publishedDate: "2026-07-12",
    readTime: "9 Min Read",
  },
];
