import { BlogLayout } from "@/components/BlogLayout";
import { blogPosts } from "@/lib/blogPosts";
import { HelpCircle, ChevronDown, MapPin, Compass, Clock, ShieldCheck, Sun, Calendar, AlertCircle, Sparkles, Heart } from "lucide-react";
import { useState } from "react";
import { WayzyyLocationPromo } from "@/components/WayzyyLocationPromo";

const post = blogPosts.find((p) => p.slug === "ekadasha-teertha-yatra-goa-guide")!;

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What is the Ekadasha Teertha Yatra in Goa?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The Ekadasha Teertha Yatra is a government-backed 3-day pilgrimage circuit linking 11 of Goa's most historical and sacred temples across North, Central, and South Goa.",
      },
    },
    {
      "@type": "Question",
      name: "Which 11 temples are covered in the Ekadasha Teertha Yatra?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Day 1 (North): Shree Mahaganapati (Khandola), Shree Devki Krishna (Marcel), Shri Anant (Savoi-Verem), Shri Mahadev (Tambdi Surla). Day 2 (Central): Shri Brahmadev (Brahma Karmali), Shrimat Dattawadi (Sanquelim), Shri Saptakoteshwar (Narve). Day 3 (South): Shree Parashuram (Poinguinim), Shree Shantadurga Kunkalikarin (Fatorpa), Shri Damodar (Zambaulim), Shri Hari Mandir (Margao).",
      },
    },
    {
      "@type": "Question",
      name: "Is there an entry fee for the temples on the yatra?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No, entry to all 11 temples on the Ekadasha Teertha Yatra circuit is completely free. Voluntary donations for temple upkeep are accepted.",
      },
    },
    {
      "@type": "Question",
      name: "Is the Ekadasha Teertha Yatra suitable for elderly parents and senior citizens?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, it is designed for a relaxed, slow-paced travel experience. Renting a private car or taxi and staying in centrally located family-friendly vacation rentals with kitchens makes it very comfortable for seniors.",
      },
    },
    {
      "@type": "Question",
      name: "How many days are required to complete the Ekadasha Teertha Yatra?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The official circuit is designed to be completed in 3 days, covering North Goa on Day 1, Central Goa on Day 2, and South Goa on Day 3.",
      },
    },
  ],
};

const faqs = [
  {
    question: "What is the Ekadasha Teertha Yatra in Goa?",
    answer:
      "The Ekadasha Teertha Yatra is a government-backed 3-day pilgrimage circuit linking 11 of Goa's most historical and sacred temples across North, Central, and South Goa.",
  },
  {
    question: "Which 11 temples are covered in the Ekadasha Teertha Yatra?",
    answer:
      "Day 1 (North): Shree Mahaganapati (Khandola), Shree Devki Krishna (Marcel), Shri Anant (Savoi-Verem), Shri Mahadev (Tambdi Surla). Day 2 (Central): Shri Brahmadev (Brahma Karmali), Shrimat Dattawadi (Sanquelim), Shri Saptakoteshwar (Narve). Day 3 (South): Shree Parashuram (Poinguinim), Shree Shantadurga Kunkalikarin (Fatorpa), Shri Damodar (Zambaulim), Shri Hari Mandir (Margao).",
  },
  {
    question: "Is there an entry fee for the temples on the yatra?",
    answer:
      "No, entry to all 11 temples on the Ekadasha Teertha Yatra circuit is completely free. Voluntary donations for temple upkeep are accepted.",
  },
  {
    question: "Is the Ekadasha Teertha Yatra suitable for elderly parents and senior citizens?",
    answer:
      "Yes, it is designed for a relaxed, slow-paced travel experience. Renting a private car or taxi and staying in centrally located family-friendly vacation rentals with kitchens makes it very comfortable for seniors.",
  },
  {
    question: "How many days are required to complete the Ekadasha Teertha Yatra?",
    answer:
      "The official circuit is designed to be completed in 3 days, covering North Goa on Day 1, Central Goa on Day 2, and South Goa on Day 3.",
  },
];

export default function EkadashaTeerthaYatraGuide() {
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
      heroImageAlt="Traditional Goan temple with ornate white Deepastambha lamp tower for Ekadasha Teertha Yatra"
      publishedDate={post.publishedDate}
      slug={post.slug}
      extraJsonLd={[faqJsonLd]}
    >

      <div className="space-y-10 text-foreground/90 leading-relaxed text-base sm:text-lg">
        {/* Intro */}
        <p className="text-xl sm:text-2xl font-light text-foreground leading-snug">
          Goa may be world-famous for its coastline, but beyond the beaches lies a deeply rooted spiritual heritage. Recognizing this, the Goa government introduced the <strong className="font-semibold text-ember">Ekadasha Teertha Yatra</strong> - a curated three-day pilgrimage connecting <strong className="font-semibold text-ember">11 of Goa’s most sacred and historic temples</strong> across North, Central, and South Goa.
        </p>

        <p>
          Whether you’re planning a meaningful family trip with your parents or grandparents, seeking pre-colonial historical roots, or wanting to experience Goa's peaceful hinterlands, this complete guide covers the 11 sacred temples, day-by-day itineraries, transport options, senior-friendly travel tips, and recommended stay locations.
        </p>

        {/* Hero Image */}
        <div className="my-8 rounded-2xl overflow-hidden border border-border shadow-lg">
          <img
            src="/blog/ekadasha-teertha-yatra-goa-hero.png"
            alt="Traditional Goan temple with ornate white Deepastambha lamp tower for Ekadasha Teertha Yatra"
            className="w-full h-auto object-cover max-h-[550px]"
          />
          <p className="p-3 text-xs sm:text-sm text-center text-muted-foreground bg-card/60 border-t border-border">
            Traditional Goan temple featuring the iconic multi-tiered Deepastambha (lamp tower) on the Ekadasha Teertha Yatra circuit.
          </p>
        </div>

        {/* Section 1: Overview */}
        <section className="space-y-6">
          <h2 className="font-display text-3xl sm:text-4xl text-foreground border-b border-border/60 pb-3">
            What is the Ekadasha Teertha Yatra?
          </h2>
          <p>
            The <strong className="font-semibold text-foreground">Ekadasha Teertha Yatra</strong> is an official government-backed pilgrimage circuit that links 11 historically significant temples spread across Goa. Rather than visiting temples individually, pilgrims follow a structured 3-day route covering shrines dedicated to Lord Shiva, Lord Ganesha, Lord Vishnu, Goddess Shantadurga, Lord Dattatreya, Lord Parashuram, and Lord Brahma.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-6">
            <div className="p-6 rounded-2xl border border-border bg-card/40 space-y-2 text-center">
              <span className="text-3xl font-display text-ember">Day 1</span>
              <h3 className="font-display text-lg text-foreground">North Goa Circuit</h3>
              <p className="text-xs text-muted-foreground">Khandola, Marcel, Savoi-Verem, & Tambdi Surla</p>
            </div>
            <div className="p-6 rounded-2xl border border-border bg-card/40 space-y-2 text-center">
              <span className="text-3xl font-display text-ember">Day 2</span>
              <h3 className="font-display text-lg text-foreground">Central Goa Circuit</h3>
              <p className="text-xs text-muted-foreground">Brahma Karmali, Sanquelim, & Narve</p>
            </div>
            <div className="p-6 rounded-2xl border border-border bg-card/40 space-y-2 text-center">
              <span className="text-3xl font-display text-ember">Day 3</span>
              <h3 className="font-display text-lg text-foreground">South Goa Circuit</h3>
              <p className="text-xs text-muted-foreground">Poinguinim, Fatorpa, Zambaulim, & Margao</p>
            </div>
          </div>
        </section>

        {/* Section 2: Why it was introduced & Who it's for */}
        <section className="space-y-6">
          <h2 className="font-display text-3xl sm:text-4xl text-foreground border-b border-border/60 pb-3">
            Why Was the Yatra Introduced & Who Is It For?
          </h2>
          <p>
            Many of Goa's temples survived centuries of migrations, changing dynasties, and colonial rule. The Ekadasha Teertha Yatra encourages slower, thoughtful travel - giving visitors time to appreciate the architecture, forest surroundings, and living traditions of local Goan communities.
          </p>

          <div className="p-6 rounded-2xl border border-border bg-card/30 space-y-4">
            <h3 className="font-display text-xl text-foreground flex items-center gap-2">
              <Heart className="h-5 w-5 text-ember" /> Who Should Consider This Pilgrimage?
            </h3>
            <ul className="text-sm text-muted-foreground space-y-2 list-disc list-inside">
              <li><strong>Families with Parents or Grandparents:</strong> A relaxed, comfortable alternative to crowded beach itineraries.</li>
              <li><strong>Senior Citizens:</strong> Slow-paced travel with easy accessibility and peaceful temple courtyards.</li>
              <li><strong>Heritage & History Enthusiasts:</strong> Explore pre-colonial Kadamba stone carvings and rare deity idols.</li>
              <li><strong>Cultural Travelers:</strong> Experience authentic local rituals, Goan temple festivals, and traditional thalis.</li>
            </ul>
          </div>
        </section>

        {/* Section 3: The 11 Temples Detailed Breakdown */}
        <section className="space-y-8">
          <h2 className="font-display text-3xl sm:text-4xl text-foreground border-b border-border/60 pb-3">
            The 11 Sacred Temples You Will Visit
          </h2>

          {/* Day 1 */}
          <div className="space-y-6">
            <h3 className="font-display text-2xl text-ember border-b border-border/40 pb-2">
              Day 1: North Goa Temples
            </h3>

            <div className="p-5 rounded-xl border border-border bg-card/30 space-y-2">
              <h4 className="font-semibold text-foreground text-lg flex items-center gap-2">
                <MapPin className="h-5 w-5 text-ember" /> 1. Shree Mahaganapati Temple, Khandola
              </h4>
              <p className="text-sm text-muted-foreground">
                One of Goa’s oldest and most revered Ganesh shrines. The idol was originally relocated from Divar Island during historical migrations, set in a peaceful traditional village complex.
              </p>
            </div>

            <div className="p-5 rounded-xl border border-border bg-card/30 space-y-2">
              <h4 className="font-semibold text-foreground text-lg flex items-center gap-2">
                <MapPin className="h-5 w-5 text-ember" /> 2. Shree Devki Krishna Temple, Marcel
              </h4>
              <p className="text-sm text-muted-foreground">
                The <strong>only temple in Goa where Lord Krishna is worshipped alongside his mother Devaki</strong>, celebrating the sacred mother-child bond. Famous for its annual <em>Chikhal Kalo</em> mud festival.
              </p>
            </div>

            <div className="p-5 rounded-xl border border-border bg-card/30 space-y-2">
              <h4 className="font-semibold text-foreground text-lg flex items-center gap-2">
                <MapPin className="h-5 w-5 text-ember" /> 3. Shri Anant Temple, Savoi-Verem
              </h4>
              <p className="text-sm text-muted-foreground">
                Hidden amidst spice plantations, this is Goa’s only temple dedicated to Lord Vishnu in his <em>Anant Shayana</em> (reclining) posture, featuring a tranquil temple pond and wooden carvings.
              </p>
            </div>

            <div className="p-5 rounded-xl border border-border bg-card/30 space-y-2">
              <h4 className="font-semibold text-foreground text-lg flex items-center gap-2">
                <MapPin className="h-5 w-5 text-ember" /> 4. Shri Mahadev Temple, Tambdi Surla
              </h4>
              <p className="text-sm text-muted-foreground">
                An 800-year-old black basalt Kadamba masterpiece nestled deep in the jungle of Bhagwan Mahaveer Wildlife Sanctuary - Goa's oldest surviving active stone temple.
              </p>
            </div>
          </div>

          {/* Day 2 */}
          <div className="space-y-6 pt-4">
            <h3 className="font-display text-2xl text-ember border-b border-border/40 pb-2">
              Day 2: Central Goa Temples
            </h3>

            <div className="p-5 rounded-xl border border-border bg-card/30 space-y-2">
              <h4 className="font-semibold text-foreground text-lg flex items-center gap-2">
                <MapPin className="h-5 w-5 text-ember" /> 5. Shri Brahmadev Temple, Brahma Karmali
              </h4>
              <p className="text-sm text-muted-foreground">
                One of India’s extremely rare temples dedicated to <strong>Lord Brahma</strong>, housing an exquisite 12th-century black granite carved idol from the Kadamba era.
              </p>
            </div>

            <div className="p-5 rounded-xl border border-border bg-card/30 space-y-2">
              <h4 className="font-semibold text-foreground text-lg flex items-center gap-2">
                <MapPin className="h-5 w-5 text-ember" /> 6. Shrimat Dattawadi Temple, Sanquelim
              </h4>
              <p className="text-sm text-muted-foreground">
                A serene pilgrimage destination dedicated to Lord Dattatreya, celebrated across Western India for its spiritual atmosphere and grand annual <em>Datta Jayanti</em> festival.
              </p>
            </div>

            <div className="p-5 rounded-xl border border-border bg-card/30 space-y-2">
              <h4 className="font-semibold text-foreground text-lg flex items-center gap-2">
                <MapPin className="h-5 w-5 text-ember" /> 7. Shri Saptakoteshwar Temple, Narve
              </h4>
              <p className="text-sm text-muted-foreground">
                Once the royal deity of the Kadamba dynasty, this historic Shiva shrine was famously renovated by Chhatrapati Shivaji Maharaj in 1668.
              </p>
            </div>
          </div>

          {/* Day 3 */}
          <div className="space-y-6 pt-4">
            <h3 className="font-display text-2xl text-ember border-b border-border/40 pb-2">
              Day 3: South Goa Temples
            </h3>

            <div className="p-5 rounded-xl border border-border bg-card/30 space-y-2">
              <h4 className="font-semibold text-foreground text-lg flex items-center gap-2">
                <MapPin className="h-5 w-5 text-ember" /> 8. Shree Parashuram Temple, Poinguinim
              </h4>
              <p className="text-sm text-muted-foreground">
                Dedicated to Lord Parashuram (6th incarnation of Vishnu), who according to ancient mythology created the Konkan coast by firing his arrow into the sea.
              </p>
            </div>

            <div className="p-5 rounded-xl border border-border bg-card/30 space-y-2">
              <h4 className="font-semibold text-foreground text-lg flex items-center gap-2">
                <MapPin className="h-5 w-5 text-ember" /> 9. Shree Shantadurga Kunkalikarin Temple, Fatorpa
              </h4>
              <p className="text-sm text-muted-foreground">
                One of South Goa’s most important shrines, dedicated to Goddess Shantadurga. Known for its traditional Goan architecture and famous annual <em>Zatra</em> festival.
              </p>
            </div>

            <div className="p-5 rounded-xl border border-border bg-card/30 space-y-2">
              <h4 className="font-semibold text-foreground text-lg flex items-center gap-2">
                <MapPin className="h-5 w-5 text-ember" /> 10. Shri Damodar Temple, Zambaulim
              </h4>
              <p className="text-sm text-muted-foreground">
                Situated along the banks of the sacred Kushavati River, famous for its picturesque setting, healing river bath rituals, and colorful <em>Shigmo</em> festival.
              </p>
            </div>

            <div className="p-5 rounded-xl border border-border bg-card/30 space-y-2">
              <h4 className="font-semibold text-foreground text-lg flex items-center gap-2">
                <MapPin className="h-5 w-5 text-ember" /> 11. Shri Hari Mandir, Margao
              </h4>
              <p className="text-sm text-muted-foreground">
                The final stop on the circuit, dedicated to Lord Vithoba and Goddess Rakhumai in the heart of Margao, known for its annual <em>Dindi</em> procession.
              </p>
            </div>
          </div>
        </section>

        {/* Location Promo */}
        <WayzyyLocationPromo
          title="Traveling with family or elderly parents on the Yatra?"
          description="Book family-friendly villas and homestays with kitchens and caretakers across Ponda, Margao, and Central Goa on Wayzyy - zero host commissions, honest traveler pricing."
        />

        {/* Section 4: Travel Modes & Best Time */}
        <section className="space-y-6">
          <h2 className="font-display text-3xl sm:text-4xl text-foreground border-b border-border/60 pb-3">
            How to Travel the Circuit & Best Time to Visit
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 rounded-xl border border-border bg-card/30 space-y-2">
              <h3 className="font-semibold text-foreground flex items-center gap-2">
                <Compass className="h-4 w-4 text-ember" /> Private Taxi
              </h3>
              <p className="text-sm text-muted-foreground">
                Hiring a dedicated car/taxi for 3 days is ideal for senior citizens. Local drivers know the temple timings and parking spots.
              </p>
            </div>
            <div className="p-5 rounded-xl border border-border bg-card/30 space-y-2">
              <h3 className="font-semibold text-foreground flex items-center gap-2">
                <Sun className="h-4 w-4 text-ember" /> Self-Drive Car
              </h3>
              <p className="text-sm text-muted-foreground">
                Gives families full flexibility to stop for meals, visit spice plantations, and move at their own comfortable pace.
              </p>
            </div>
            <div className="p-5 rounded-xl border border-border bg-card/30 space-y-2">
              <h3 className="font-semibold text-foreground flex items-center gap-2">
                <Calendar className="h-4 w-4 text-ember" /> Best Season
              </h3>
              <p className="text-sm text-muted-foreground">
                <strong>Nov to Feb:</strong> Cool, pleasant weather (20°C–26°C). <strong>Monsoon (Jun–Sep):</strong> Lush forest greenery, especially around Tambdi Surla.
              </p>
            </div>
          </div>
        </section>

        {/* Section 5: Senior & Family Stays */}
        <section className="space-y-6">
          <h2 className="font-display text-3xl sm:text-4xl text-foreground border-b border-border/60 pb-3">
            Where to Stay & Tips for Senior Citizens
          </h2>
          <p>
            Since the temples span North, Central, and South Goa, <strong className="font-semibold text-foreground">Ponda or Margao</strong> serve as ideal central base locations.
          </p>
          <div className="p-6 rounded-2xl border border-ember/30 bg-ember/5 space-y-3">
            <h3 className="font-display text-xl text-foreground">Why Vacation Rentals Beat Hotels for Pilgrimages</h3>
            <p className="text-sm text-foreground/90">
              When traveling with elderly parents, standard hotel rooms can be restrictive. Booking a <strong className="font-semibold text-foreground">Wayzyy vacation rental, villa, or homestay</strong> provides:
            </p>
            <ul className="text-sm text-foreground/90 space-y-1.5 list-disc list-inside pt-1">
              <li>Full kitchens for preparing familiar home-cooked meals.</li>
              <li>Ground-floor bedrooms for easy mobility without stairs.</li>
              <li>Quiet residential surroundings for restful sleep.</li>
              <li>On-site caretakers to assist with luggage and local transport.</li>
            </ul>
          </div>
        </section>

        {/* Practical tips */}
        <section className="space-y-6">
          <h2 className="font-display text-3xl sm:text-4xl text-foreground border-b border-border/60 pb-3">
            Practical Visitor Etiquette & Checklist
          </h2>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <Clock className="h-5 w-5 text-ember shrink-0 mt-0.5" />
              <span><strong>Start Early:</strong> Begin each day by 7:30 AM to finish afternoon temple visits before peak sun.</span>
            </li>
            <li className="flex items-start gap-2">
              <ShieldCheck className="h-5 w-5 text-ember shrink-0 mt-0.5" />
              <span><strong>Dress Code:</strong> Shoulders and knees must be covered. Slip-on footwear is ideal since shoes are removed before entering precinct gates.</span>
            </li>
            <li className="flex items-start gap-2">
              <AlertCircle className="h-5 w-5 text-ember shrink-0 mt-0.5" />
              <span><strong>Cash & Offerings:</strong> Carry small currency notes for voluntary temple donations, prasadam, and coconut offerings.</span>
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
            Final Thoughts: Discovering Goa's Sacred Hinterlands
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base">
            The Ekadasha Teertha Yatra offers a rich, peaceful perspective on Goa’s living heritage. For families, senior citizens, and cultural travelers, it is a deeply rewarding 3-day journey through faith, history, and community.
          </p>
          <div className="pt-4 text-xs sm:text-sm text-muted-foreground border-t border-border/60">
            Planning your pilgrimage stay? Explore verified family homestays and villas across Goa on{" "}
            <strong className="text-foreground">Wayzyy</strong> or email us at{" "}
            <a href="mailto:hello@wayzyy.com" className="text-ember underline font-medium">
              hello@wayzyy.com
            </a>.
          </div>
        </section>
      </div>
    </BlogLayout>
  );
}
