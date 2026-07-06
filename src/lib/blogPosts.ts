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
  },
];
