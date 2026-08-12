import { BlogLayout } from "@/components/BlogLayout";
import { blogPosts } from "@/lib/blogPosts";
import { HelpCircle, ChevronDown, MapPin, Compass, Clock, ShieldCheck, Sun, Calendar, AlertCircle } from "lucide-react";
import { useState } from "react";
import { WayzyyLocationPromo } from "@/components/WayzyyLocationPromo";

const post = blogPosts.find((p) => p.slug === "tambdi-surla-temple-goa-guide")!;

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What is the best time to visit Tambdi Surla Temple?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The best time to visit Tambdi Surla Temple is from October to February, when the weather is cooler and more pleasant (20°C to 25°C). Monsoon season (June to September) is also popular for lush forest scenery and flowing streams.",
      },
    },
    {
      "@type": "Question",
      name: "How do I get to Tambdi Surla Temple from Panjim?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "To get to Tambdi Surla Temple from Panjim (65 km away), you can hire a private taxi (takes ~2 hours) or rent a scooter/car. Bus routes connect to nearby Mollem/Margao, followed by local transport.",
      },
    },
    {
      "@type": "Question",
      name: "Are there accommodation options near Tambdi Surla Temple?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, there are budget guesthouses, nature homestays, and verified villas nearby in Mollem and South/Central Goa. Platforms like Wayzyy offer direct host bookings for nearby villas.",
      },
    },
    {
      "@type": "Question",
      name: "Can I take photos inside the temple?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, photography is permitted in the outer temple grounds and complex. Flash photography and tripods are restricted inside the sanctum, and visitors should respect worshippers.",
      },
    },
    {
      "@type": "Question",
      name: "What are the entry fees for the temple?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Entry to Tambdi Surla Temple is free for all visitors. Voluntary donations are welcomed for site maintenance.",
      },
    },
    {
      "@type": "Question",
      name: "Is the temple suitable for families with children?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, the peaceful environment makes it ideal for families. However, parents should supervise young children near stone steps and natural stream rocks.",
      },
    },
    {
      "@type": "Question",
      name: "Are there any restaurants or food stalls near the temple?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "There are small local tea stalls and snack shops near the parking area serving tea, fresh coconut water, and Goan snacks. Larger restaurants are available 10 km away in Mollem.",
      },
    },
    {
      "@type": "Question",
      name: "Can I use my mobile phone's network inside the temple complex?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Mobile network coverage (Jio/Airtel) can be patchy due to the dense forest surroundings in Bhagwan Mahaveer Sanctuary. Downloading offline maps in advance is recommended.",
      },
    },
  ],
};

const faqs = [
  {
    question: "What is the best time to visit Tambdi Surla Temple?",
    answer:
      "The best time to visit Tambdi Surla Temple is from October to February, when the weather is cooler and more pleasant. During this period, the temperature ranges from 20°C to 25°C, making it ideal for exploring the temple and its surroundings. Monsoon season (June to September) is also breathtaking if you want to see the surrounding jungle at its greenest.",
  },
  {
    question: "How do I get to Tambdi Surla Temple from Panjim?",
    answer:
      "To get to Tambdi Surla Temple from Panjim, you can hire a taxi or drive a self-drive car/scooter. The distance is approximately 65 km and takes around 2 hours. Alternatively, you can take a bus to Ponda or Mollem and hire local transport to the temple.",
  },
  {
    question: "Are there any accommodation options near the temple?",
    answer:
      "Yes, there are accommodation options near Tambdi Surla Temple, including budget-friendly guesthouses, eco-resorts, and verified villas. At Wayzyy, travellers can find verified homestays and villas in nearby areas for an authentic experience without platform markups.",
  },
  {
    question: "Can I take photos inside the temple?",
    answer:
      "Yes, you can take photos in the complex and surrounding garden. However, please be respectful of the sacred space and worshippers. Flash photography and tripod usage are generally not permitted inside the inner sanctum.",
  },
  {
    question: "What are the entry fees for the temple?",
    answer:
      "Entry to Tambdi Surla Temple is completely free for all visitors. The site is maintained under the Archaeological Survey of India (ASI). Voluntary donations are accepted for local temple upkeep.",
  },
  {
    question: "Is the temple suitable for families with children?",
    answer:
      "Yes, the temple is suitable for families with children. The surrounding lawns and quiet forest environment make it a peaceful cultural visit. Keep an eye on young children near slippery stones along the stream.",
  },
  {
    question: "Are there any restaurants or food stalls near the temple?",
    answer:
      "There are a few small local stalls near the entrance selling coconut water, tea, and basic snacks. For full meals, head towards the town of Mollem (about 10 km away) where local Goan thali places are located.",
  },
  {
    question: "Can I use my mobile phone's network inside the temple complex?",
    answer:
      "Mobile network coverage inside the sanctuary can be patchy depending on your provider. Airtel and Jio have decent signals near the main entrance, but downloading offline maps before leaving the coast is highly recommended.",
  },
];

export default function TambdiSurlaTempleGuide() {
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
      heroImageAlt="12th-century Mahadev Temple at Tambdi Surla inside Bhagwan Mahaveer Wildlife Sanctuary"
      publishedDate={post.publishedDate}
      slug={post.slug}
      extraJsonLd={[faqJsonLd]}
    >

      <div className="space-y-10 text-foreground/90 leading-relaxed text-base sm:text-lg">
        {/* Intro */}
        <p className="text-xl sm:text-2xl font-light text-foreground leading-snug">
          Most Goa guides describe <strong className="font-semibold text-ember">Tambdi Surla Temple Goa</strong> as a serene escape from the coastline's bustling beaches. They're not wrong, but there's far more to it. This 12th-century black basalt temple, surrounded by the deep rainforests of Bhagwan Mahaveer Sanctuary, offers a timeless charm that remains one of Goa’s best-kept secrets.
        </p>

        <p>
          This guide takes you through every practical aspect of visiting Tambdi Surla Temple Goa - from optimal travel timings and road routes to history, Kadamba architecture, surrounding waterfalls, and honest expectations. Whether you’re a history buff, nature enthusiast, or traveler seeking Goa’s quiet hinterlands, here is everything you need to plan your trip.
        </p>

        {/* Hero Image */}
        <div className="my-8 rounded-2xl overflow-hidden border border-border shadow-lg">
          <img
            src="/blog/tambdi-surla-temple-goa-hero.png"
            alt="Tambdi Surla Temple Goa surrounded by Western Ghats jungle"
            className="w-full h-auto object-cover max-h-[550px]"
          />
          <p className="p-3 text-xs sm:text-sm text-center text-muted-foreground bg-card/60 border-t border-border">
            The 12th-century Mahadev Temple at Tambdi Surla nestled inside the Bhagwan Mahaveer Wildlife Sanctuary.
          </p>
        </div>

        {/* Section: At a glance */}
        <section className="space-y-6">
          <h2 className="font-display text-3xl sm:text-4xl text-foreground border-b border-border/60 pb-3">
            Tambdi Surla Temple at a Glance
          </h2>
          <p>
            Dedicated to Lord Shiva, the Mahadev Temple at Tambdi Surla is the only surviving specimen of Kadamba-Yadava dynasty architecture in Goa. Constructed out of weather-resistant weathered black basalt stone transported across the Western Ghats, it survived centuries of colonial conquests due to its remote jungle location.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
            <div className="p-6 rounded-2xl border border-border bg-card/40 space-y-3">
              <h3 className="font-display text-xl text-foreground flex items-center gap-2">
                <Compass className="h-5 w-5 text-ember" /> History & Heritage
              </h3>
              <p className="text-sm text-muted-foreground">
                Built in the 12th century by Queen Jayakeshi I of the Kadamba Dynasty. It stands as Goa’s oldest active temple structure, preserved in its original stone form.
              </p>
            </div>
            <div className="p-6 rounded-2xl border border-border bg-card/40 space-y-3">
              <h3 className="font-display text-xl text-foreground flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-ember" /> Architecture & Material
              </h3>
              <p className="text-sm text-muted-foreground">
                Hand-carved grey-black basalt stone with an intricate sanctum (garbhagriha), pillar hall (mandapa), and a low-sloped stone roof designed for heavy monsoon rainfall.
              </p>
            </div>
          </div>
        </section>

        {/* Section: Is it worth visiting? */}
        <section className="space-y-6">
          <h2 className="font-display text-3xl sm:text-4xl text-foreground border-b border-border/60 pb-3">
            Is Tambdi Surla Temple Worth Visiting?
          </h2>
          <p>
            If your idea of Goa is restricted to beach shacks and night markets, Tambdi Surla will feel like stepping into a completely different country. On weekday mornings, the only sounds echoing across the clearing are jungle birds, chirping cicadas, and the occasional chime of the temple bell.
          </p>
          <div className="p-6 rounded-2xl border border-ember/30 bg-ember/5 space-y-3">
            <h3 className="font-display text-xl text-foreground">Expectations vs Reality</h3>
            <p className="text-sm text-foreground/90">
              The complex is smaller and more rustic than massive South Indian temple complexes, but its intimate setting amidst ancient trees and the crisp air of the Surla River valley creates an unmatched atmosphere.
            </p>
          </div>
        </section>

        {/* Section: Surroundings Image & What it's like */}
        <section className="space-y-6">
          <h2 className="font-display text-3xl sm:text-4xl text-foreground border-b border-border/60 pb-3">
            What Tambdi Surla Temple Is Actually Like
          </h2>
          <p>
            The temple sits in a natural bowl framed by green hills. A clear freshwater stream flows along the edge of the manicured temple lawn, where visitors often sit to cool their feet after exploring the stone sanctum.
          </p>

          <div className="my-8 rounded-2xl overflow-hidden border border-border shadow-lg">
            <img
              src="/blog/tambdi-surla-surroundings.png"
              alt="Jungle trail and freshwater river stream near Tambdi Surla Temple"
              className="w-full h-auto object-cover max-h-[500px]"
            />
            <p className="p-3 text-xs sm:text-sm text-center text-muted-foreground bg-card/60 border-t border-border">
              The lush jungle pathway and freshwater stream flowing alongside the temple complex.
            </p>
          </div>
        </section>

        {/* Section: How to reach */}
        <section className="space-y-6">
          <h2 className="font-display text-3xl sm:text-4xl text-foreground border-b border-border/60 pb-3">
            How to Reach Tambdi Surla Temple
          </h2>
          <p>
            Tambdi Surla is situated in Sanguem taluka, near the village of Bolcornem inside Bhagwan Mahaveer Wildlife Sanctuary.
          </p>

          <div className="space-y-4">
            <div className="p-5 rounded-xl border border-border bg-card/30">
              <h3 className="font-semibold text-foreground flex items-center gap-2 text-lg">
                <MapPin className="h-5 w-5 text-ember" /> Driving Distances & Times
              </h3>
              <ul className="mt-3 text-sm text-muted-foreground space-y-2 list-disc list-inside">
                <li><strong>From Panjim:</strong> ~65 km (approx. 1 hr 45 min via NH66 & NH748)</li>
                <li><strong>From Margao:</strong> ~45 km (approx. 1 hr 20 min via Sanvordem road)</li>
                <li><strong>From Baga / Calangute:</strong> ~75 km (approx. 2 hours)</li>
                <li><strong>From Palolem / Agonda:</strong> ~70 km (approx. 1 hr 50 min)</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Section: Carvings & Details */}
        <section className="space-y-6">
          <h2 className="font-display text-3xl sm:text-4xl text-foreground border-b border-border/60 pb-3">
            What to See and Do
          </h2>
          <p>
            Inside the mandapa, four massive monolithic basalt pillars feature hand-carved relief panels of Lord Shiva, Vishnu, Brahma, and mythological motifs including elephants, lotus flowers, and rosette patterns.
          </p>

          <div className="my-8 rounded-2xl overflow-hidden border border-border shadow-lg">
            <img
              src="/blog/tambdi-surla-carvings.png"
              alt="Intricate black basalt stone carvings on Kadamba temple pillars"
              className="w-full h-auto object-cover max-h-[500px]"
            />
            <p className="p-3 text-xs sm:text-sm text-center text-muted-foreground bg-card/60 border-t border-border">
              Intricate 12th-century basalt pillar carvings depicting Kadamba craftsmanship.
            </p>
          </div>

          <h3 className="font-display text-2xl text-foreground mt-4">Trekking to Tambdi Surla Waterfall</h3>
          <p>
            For adventurous visitors, a 90-minute jungle trek (approx. 3.5 km each way) starting from behind the temple leads to the secluded <strong>Tambdi Surla Waterfall</strong>. During monsoon and post-monsoon months, hiring a local forest guide is recommended due to dense foliage and stream crossings.
          </p>
        </section>

        {/* Location Promo */}
        <WayzyyLocationPromo
          title="Looking for a verified stay near Goa's nature trails?"
          description="Explore handpicked, zero-commission villas and homestays across Goa on Wayzyy - fair pricing for travelers and full profits for local hosts."
        />

        {/* Section: Best Time */}
        <section className="space-y-6">
          <h2 className="font-display text-3xl sm:text-4xl text-foreground border-b border-border/60 pb-3">
            Best Time to Visit Tambdi Surla
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-5 rounded-xl border border-border bg-card/30 space-y-2">
              <h3 className="font-semibold text-foreground flex items-center gap-2">
                <Sun className="h-4 w-4 text-ember" /> Winter Season (Oct – Feb)
              </h3>
              <p className="text-sm text-muted-foreground">
                Ideal pleasant weather (20°C–26°C), clear skies, and easy road travel. Great for photography and nature walks.
              </p>
            </div>
            <div className="p-5 rounded-xl border border-border bg-card/30 space-y-2">
              <h3 className="font-semibold text-foreground flex items-center gap-2">
                <Calendar className="h-4 w-4 text-ember" /> Monsoon Season (Jun – Sep)
              </h3>
              <p className="text-sm text-muted-foreground">
                The jungle turns vibrant green, streams are full, and rain clouds shroud the surrounding hills. Carry rain gear and sturdy footwear.
              </p>
            </div>
          </div>
        </section>

        {/* Section: Practical Info */}
        <section className="space-y-6">
          <h2 className="font-display text-3xl sm:text-4xl text-foreground border-b border-border/60 pb-3">
            Practical Information & Rules
          </h2>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <Clock className="h-5 w-5 text-ember shrink-0 mt-0.5" />
              <span><strong>Timings:</strong> 7:00 AM to 5:30 PM daily.</span>
            </li>
            <li className="flex items-start gap-2">
              <ShieldCheck className="h-5 w-5 text-ember shrink-0 mt-0.5" />
              <span><strong>Entry Fee:</strong> Free entry. Parking is available near the entrance gate.</span>
            </li>
            <li className="flex items-start gap-2">
              <AlertCircle className="h-5 w-5 text-ember shrink-0 mt-0.5" />
              <span><strong>Dress Code:</strong> Modest clothing covering shoulders and knees is recommended as it remains an active place of worship.</span>
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
            Final Thoughts: Is Tambdi Surla Temple Worth It?
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base">
            Tambdi Surla Temple is a rare gem in Goa’s heritage landscape. It offers an irreplaceable look into ancient Kadamba history surrounded by pristine forest. If you want to experience the quiet, authentic side of Goa, it is undeniably worth the trip.
          </p>
          <div className="pt-4 text-xs sm:text-sm text-muted-foreground border-t border-border/60">
            Want to list your villa or homestay on Wayzyy? Email us at{" "}
            <a href="mailto:hello@wayzyy.com" className="text-ember underline font-medium">
              hello@wayzyy.com
            </a>{" "}
           - Wayzyy is launching soon across Goa.
          </div>
        </section>
      </div>
    </BlogLayout>
  );
}
