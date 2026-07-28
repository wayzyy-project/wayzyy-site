import { BlogLayout } from "@/components/BlogLayout";
import { blogPosts } from "@/lib/blogPosts";
import { HelpCircle, ChevronDown, MapPin, Compass, Clock, ShieldCheck, Sun, Calendar, AlertCircle, Sparkles } from "lucide-react";
import { useState } from "react";
import { WayzyyLocationPromo } from "@/components/WayzyyLocationPromo";

const post = blogPosts.find((p) => p.slug === "goa-spiritual-tourism-guide")!;

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What are the most important spiritual sites to visit in Goa?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Key spiritual sites include the 12th-century Tambdi Surla Mahadev Temple, Shri Manguesh Temple in Priol, Shri Shantadurga Temple in Kavlem, and the UNESCO World Heritage Basilica of Bom Jesus in Old Goa.",
      },
    },
    {
      "@type": "Question",
      name: "How can I get around Goa to visit spiritual and heritage sites?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Renting a scooter (₹300–₹500/day) or self-drive car is the most flexible option. Private taxis are available for full-day temple tours, and local Kadamba buses connect major towns like Panjim, Ponda, and Margao.",
      },
    },
    {
      "@type": "Question",
      name: "What dress code and etiquette should I follow at Goa temples and churches?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Dress modestly with shoulders and knees covered. Remove footwear before entering temple sanctums, avoid photography inside inner worship areas, and maintain a quiet, respectful presence.",
      },
    },
    {
      "@type": "Question",
      name: "Can I find vegetarian or vegan food near spiritual sites in Goa?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, pure vegetarian restaurants and Goan thali houses are widely available around temple towns like Ponda, Priol, and Old Goa, offering traditional veg meals starting from ₹100–₹200.",
      },
    },
  ],
};

const faqs = [
  {
    question: "What are the most important spiritual sites to visit in Goa?",
    answer:
      "Goa is home to ancient heritage sites including the 12th-century Tambdi Surla Mahadev Temple, Shri Manguesh Temple in Priol, Shri Shantadurga Temple in Kavlem, and the UNESCO World Heritage Basilica of Bom Jesus in Old Goa. Each site showcases a unique blend of Kadamba, Maratha, and Indo-Portuguese architectural styles.",
  },
  {
    question: "How can I get around Goa to visit spiritual and heritage sites?",
    answer:
      "Renting a scooter (₹300–₹500/day) or self-drive car is the most convenient way to explore hinterland temples. Private taxis can be hired for full-day itineraries (~₹2,500–₹3,500), while state Kadamba buses connect main bus stands in Panjim, Margao, and Ponda.",
  },
  {
    question: "What dress code and etiquette should I follow at Goa temples and churches?",
    answer:
      "Visitors are expected to dress modestly with shoulders and knees covered. Always remove shoes before entering Hindu temple precincts, avoid taking photos inside inner sanctums, and refrain from loud conversations during prayer hours.",
  },
  {
    question: "Can I find vegetarian or vegan food near spiritual sites in Goa?",
    answer:
      "Yes, pure vegetarian eateries and traditional Goan thali stalls are located around major temple hubs like Ponda and Priol. You can enjoy authentic vegetarian Goan meals (thalis, kokum curry, and snacks) starting at ₹100–₹200.",
  },
];

export default function GoaSpiritualTourismGuide() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <BlogLayout
      title={post.title}
      description={post.description}
      metaTitle={post.metaTitle}
      metaDescription={post.metaDescription}
      heroImage={post.heroImage}
      heroImageAlt="Historic cathedral and ancient spiritual heritage in Goa"
      publishedDate={post.publishedDate}
      slug={post.slug}
      extraJsonLd={[faqJsonLd]}
    >

      <div className="space-y-10 text-foreground/90 leading-relaxed text-base sm:text-lg">
        {/* Intro */}
        <p className="text-xl sm:text-2xl font-light text-foreground leading-snug">
          Most travelers associate Goa exclusively with sun-drenched beaches and nightlife. But beyond the coast lies a vibrant, centuries-old <strong className="font-semibold text-ember">spiritual and heritage landscape</strong>—where 12th-century stone shrines, hilltop temples, and UNESCO-listed Portuguese cathedrals coexist in serene jungle valleys.
        </p>

        <p>
          This guide delivers an honest, practical roadmap for exploring Goa’s spiritual side in 2026. From ancient Kadamba architecture and temple etiquette to quiet stay locations, transport options, and vegetarian food hubs, here is everything you need to experience Goa’s peaceful hinterlands.
        </p>

        {/* Hero Image */}
        <div className="my-8 rounded-2xl overflow-hidden border border-border shadow-lg">
          <img
            src="/blog/goa-hero.jpg"
            alt="Historic cathedral and ancient spiritual heritage in Goa"
            className="w-full h-auto object-cover max-h-[550px]"
          />
          <p className="p-3 text-xs sm:text-sm text-center text-muted-foreground bg-card/60 border-t border-border">
            Goa’s unique fusion of Indo-Portuguese cathedrals, ancient Kadamba shrines, and quiet hinterland villages.
          </p>
        </div>

        {/* Section: What it's actually like */}
        <section className="space-y-6">
          <h2 className="font-display text-3xl sm:text-4xl text-foreground border-b border-border/60 pb-3">
            What Goa's Spiritual Tourism Is Actually Like
          </h2>
          <p>
            Visiting Goa's sacred sites is an invitation to slow down. On weekday mornings, temple courtyards are filled with the rustle of banyan leaves, bird calls, and the gentle ring of temple bells—a world away from coastal traffic.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
            <div className="p-6 rounded-2xl border border-border bg-card/40 space-y-3">
              <h3 className="font-display text-xl text-foreground flex items-center gap-2">
                <Compass className="h-5 w-5 text-ember" /> Deep Cultural Roots
              </h3>
              <p className="text-sm text-muted-foreground">
                Goa's hinterlands house sacred sites dating back to the 12th century, showcasing indigenous Kadamba stonework alongside post-colonial Maratha and Baroque architecture.
              </p>
            </div>
            <div className="p-6 rounded-2xl border border-border bg-card/40 space-y-3">
              <h3 className="font-display text-xl text-foreground flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-ember" /> Tranquil Hinterland Vibe
              </h3>
              <p className="text-sm text-muted-foreground">
                Framed by spice plantations and national parks, hinterland spiritual circuits offer clean air, quiet mornings, and a relaxed, respectful community atmosphere.
              </p>
            </div>
          </div>
        </section>

        {/* Section: Key Spiritual Sites */}
        <section className="space-y-6">
          <h2 className="font-display text-3xl sm:text-4xl text-foreground border-b border-border/60 pb-3">
            Key Spiritual & Heritage Sites to Visit
          </h2>
          <p>
            Whether you are planning a full-day heritage circuit or seeking morning reflection, these key landmarks represent Goa’s rich spiritual tapestry:
          </p>

          <div className="space-y-4">
            <div className="p-5 rounded-xl border border-border bg-card/30 space-y-2">
              <h3 className="font-semibold text-foreground text-lg flex items-center gap-2">
                <MapPin className="h-5 w-5 text-ember" /> 1. Tambdi Surla Mahadev Temple (Sanguem)
              </h3>
              <p className="text-sm text-muted-foreground">
                Goa’s oldest active temple (12th century), built from hand-carved black basalt stone inside the forests of Bhagwan Mahaveer Wildlife Sanctuary.
              </p>
            </div>
            <div className="p-5 rounded-xl border border-border bg-card/30 space-y-2">
              <h3 className="font-semibold text-foreground text-lg flex items-center gap-2">
                <MapPin className="h-5 w-5 text-ember" /> 2. Shri Manguesh Temple (Priol, Ponda)
              </h3>
              <p className="text-sm text-muted-foreground">
                Famous for its elegant seven-story lamp tower (Deepastambha) and classic Goan Hindu temple architecture dedicated to Lord Shiva.
              </p>
            </div>
            <div className="p-5 rounded-xl border border-border bg-card/30 space-y-2">
              <h3 className="font-semibold text-foreground text-lg flex items-center gap-2">
                <MapPin className="h-5 w-5 text-ember" /> 3. Shri Shantadurga Temple (Kavlem)
              </h3>
              <p className="text-sm text-muted-foreground">
                A serene complex featuring a harmonious blend of Portuguese archways and traditional Hindu sanctuary design amidst green hills.
              </p>
            </div>
            <div className="p-5 rounded-xl border border-border bg-card/30 space-y-2">
              <h3 className="font-semibold text-foreground text-lg flex items-center gap-2">
                <MapPin className="h-5 w-5 text-ember" /> 4. Basilica of Bom Jesus & Se Cathedral (Old Goa)
              </h3>
              <p className="text-sm text-muted-foreground">
                UNESCO World Heritage monuments displaying breathtaking Manueline and Baroque architecture holding historical artifacts and ancient art.
              </p>
            </div>
          </div>
        </section>

        {/* Section: How to reach */}
        <section className="space-y-6">
          <h2 className="font-display text-3xl sm:text-4xl text-foreground border-b border-border/60 pb-3">
            How to Reach & Navigate Sacred Sites
          </h2>
          <p>
            Most temple circuits are concentrated around Ponda taluka and the central hinterlands:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-5 rounded-xl border border-border bg-card/30 space-y-2">
              <h3 className="font-semibold text-foreground flex items-center gap-2">
                <Sun className="h-4 w-4 text-ember" /> From Panjim / Old Goa
              </h3>
              <p className="text-sm text-muted-foreground">
                Ponda temples are approx. 25–30 km (40 minutes by car/scooter). Old Goa cathedrals are just 10 km from Panjim city center.
              </p>
            </div>
            <div className="p-5 rounded-xl border border-border bg-card/30 space-y-2">
              <h3 className="font-semibold text-foreground flex items-center gap-2">
                <Calendar className="h-4 w-4 text-ember" /> From Margao / South Goa
              </h3>
              <p className="text-sm text-muted-foreground">
                Ponda is approx. 17 km from Margao (25 minutes). Sanguem and Tambdi Surla are 45 km inland via scenic jungle roads.
              </p>
            </div>
          </div>
        </section>

        {/* Location Promo */}
        <WayzyyLocationPromo
          title="Planning a quiet stay near Goa's heritage villages?"
          description="Explore verified homestays and villas across Goa on Wayzyy — zero host commissions, honest traveler pricing, and direct host connections."
        />

        {/* Section: Where to Stay */}
        <section className="space-y-6">
          <h2 className="font-display text-3xl sm:text-4xl text-foreground border-b border-border/60 pb-3">
            Where to Stay Near Spiritual Sites
          </h2>
          <p>
            Choosing accommodation away from party hubs allows you to wake up to bird calls and cool morning breezes.
          </p>
          <div className="p-6 rounded-2xl border border-ember/30 bg-ember/5 space-y-3">
            <h3 className="font-display text-xl text-foreground">Recommended Locations</h3>
            <p className="text-sm text-foreground/90">
              Consider staying in <strong>Ponda, Old Goa, Raia, or Divar Island</strong> for quick access to central temples and churches, or choose quiet villas in <strong>South Goa (Agonda, Palolem, or Quepem)</strong> if you prefer a peaceful coastal-hinterland base.
            </p>
          </div>
        </section>

        {/* Section: Practical Info */}
        <section className="space-y-6">
          <h2 className="font-display text-3xl sm:text-4xl text-foreground border-b border-border/60 pb-3">
            Practical Information & Visitor Etiquette
          </h2>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <Clock className="h-5 w-5 text-ember shrink-0 mt-0.5" />
              <span><strong>Visiting Hours:</strong> Most temples open by 6:00 AM and close around 7:30 PM (some close for brief afternoon breaks between 1:00 PM – 3:00 PM).</span>
            </li>
            <li className="flex items-start gap-2">
              <ShieldCheck className="h-5 w-5 text-ember shrink-0 mt-0.5" />
              <span><strong>Dress Code:</strong> Shoulders and knees must be covered. Avoid sleeveless shirts or beachwear inside religious grounds.</span>
            </li>
            <li className="flex items-start gap-2">
              <AlertCircle className="h-5 w-5 text-ember shrink-0 mt-0.5" />
              <span><strong>Photography:</strong> Photography inside inner sanctums is strictly prohibited. Always look for signage or ask temple staff.</span>
            </li>
          </ul>
        </section>

        {/* FAQ Section */}
        <section className="space-y-6 pt-6">
          <h2 className="font-display text-3xl sm:text-4xl text-foreground border-b border-border/60 pb-3 flex items-center gap-3">
            <HelpCircle className="h-7 w-7 text-ember" /> Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="rounded-xl border border-border bg-card/40 overflow-hidden transition-colors"
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full p-5 text-left font-display text-lg text-foreground flex items-center justify-between gap-4 hover:text-ember transition-colors"
                >
                  <span>{faq.question}</span>
                  <ChevronDown
                    className={`h-5 w-5 text-muted-foreground transition-transform duration-200 ${
                      openFaq === index ? "rotate-180 text-ember" : ""
                    }`}
                  />
                </button>
                {openFaq === index && (
                  <div className="px-5 pb-5 text-sm text-muted-foreground leading-relaxed border-t border-border/40 pt-3">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Final Thoughts & CTA */}
        <section className="mt-12 p-8 rounded-2xl border border-border bg-card/60 space-y-4 text-center">
          <h2 className="font-display text-2xl sm:text-3xl text-foreground">
            Final Thoughts: Is Goa's Spiritual Side Worth Exploring?
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base">
            Exploring Goa's spiritual side unlocks a rich, tranquil layer of the state that most beachgoers completely miss. If you appreciate ancient architecture, quiet morning walks, and authentic cultural roots, hinterland Goa will exceed your expectations.
          </p>
          <div className="pt-4 text-xs sm:text-sm text-muted-foreground border-t border-border/60">
            Want to list your villa or homestay on Wayzyy? Email us at{" "}
            <a href="mailto:hello@wayzyy.com" className="text-ember underline font-medium">
              hello@wayzyy.com
            </a>{" "}
            — Wayzyy is launching soon across Goa.
          </div>
        </section>
      </div>
    </BlogLayout>
  );
}
