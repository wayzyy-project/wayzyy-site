import { BlogLayout } from "@/components/BlogLayout";
import { blogPosts } from "@/lib/blogPosts";
import { Link } from "react-router-dom";
import { Music, Sun, ShieldAlert, Compass, HelpCircle } from "lucide-react";
import { useState } from "react";

const post = blogPosts.find((p) => p.slug === "goa-nightlife-guide")!;

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      "name": "Is Goa nightlife only about clubs?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Not at all. While Goa is famous for its clubs, many travellers now visit for sunset bars, live music, cocktail lounges, night markets, beachside dining, jazz performances and cultural experiences like the Arambol Drum Circle or the Silent Noise Party."
      }
    },
    {
      "@type": "Question",
      "name": "Which part of Goa has the best nightlife?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "North Goa offers the greatest variety, including cocktail bars, live music venues, beach bars and markets. South Goa is better suited to travellers looking for quieter evenings, beach shacks, acoustic music and relaxed dining."
      }
    },
    {
      "@type": "Question",
      "name": "What is a sundowner in Goa?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "A sundowner is an evening tradition where people gather at beach bars, cliffside restaurants or cafés to enjoy drinks while watching the sunset. It's one of Goa's most popular social experiences and often marks the beginning of the evening rather than simply being a drink before dinner."
      }
    },
    {
      "@type": "Question",
      "name": "Which beaches are best to visit at night in Goa?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Popular evening beaches include Vagator, Anjuna, Palolem, Agonda and Arambol. Each offers a different atmosphere, ranging from lively beach cafés to peaceful shoreline walks."
      }
    },
    {
      "@type": "Question",
      "name": "Is South Goa good for nightlife?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. South Goa offers a calmer style of nightlife focused on beach shacks, live music, romantic dinners and experiences like the Silent Noise Party near Palolem rather than large clubs."
      }
    },
    {
      "@type": "Question",
      "name": "Are Goa's casinos worth visiting?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "If you're interested in gaming, live entertainment and river cruises, they're worth experiencing once. Travellers looking for a more relaxed evening often prefer cocktail bars, sunset venues or live music instead."
      }
    },
    {
      "@type": "Question",
      "name": "Is Goa safe at night?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Most tourist areas remain active well into the evening, especially during the peak season. Using registered taxis after drinking, staying in well-populated areas and planning your return journey in advance are sensible precautions, just as they would be in any popular travel destination."
      }
    },
    {
      "@type": "Question",
      "name": "What time does nightlife usually start in Goa?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Many evenings begin around sunset, between 5:30 PM and 7:00 PM, with bars and restaurants becoming livelier as the night progresses. Clubs generally become busiest later in the evening."
      }
    },
    {
      "@type": "Question",
      "name": "What should I wear for a night out in Goa?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Smart casual clothing works almost everywhere. Beachwear is acceptable at many beachfront venues during sunset, while upscale restaurants and cocktail bars are better suited to casual evening attire."
      }
    },
    {
      "@type": "Question",
      "name": "Do I need to book bars or restaurants in advance?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "During the peak season from November to March, popular sunset venues and restaurants often fill up quickly. Booking ahead is recommended, especially for weekends and special occasions."
      }
    }
  ]
};

export default function GoaNightlifeGuide() {
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
      heroImageAlt="Vibrant outdoor music party at Leopard Valley in South Goa at night"
      publishedDate={post.publishedDate}
      slug={post.slug}
      extraJsonLd={faqJsonLd}
    >
      {/* 1. North Goa vs South Goa Nightlife */}
      <div className="space-y-6">
        <p>
          One of the most common questions travellers ask before planning their evenings is whether North Goa or South Goa offers the better nightlife.
        </p>
        <p>
          The honest answer is that neither is objectively better. They're simply built around completely different experiences.
        </p>
        <p>
          North Goa is where you'll find the greatest variety. Within a short drive, you can watch the sunset from a cliff in Vagator, have dinner in Assagao, discover a hidden cocktail bar in Panjim and finish the evening listening to live music in Anjuna. Every night can look different, which is exactly why this part of the state continues to attract first-time visitors, groups of friends and travellers who enjoy having plenty of options.
        </p>

        <div className="my-8">
          <img
            src="/blog/goa-cafe-jameson.webp"
            alt="Warm intimate cocktail bar in Assagao, Goa"
            className="w-full rounded-2xl border border-border object-cover aspect-video"
            loading="lazy"
          />
          <span className="text-xs text-muted-foreground block text-center mt-2 italic">
            Goa's hidden cocktail bars and speakeasies offer a refined alternative to crowded nightclubs.
          </span>
        </div>

        <p>
          South Goa moves at a noticeably slower pace. Even after sunset, the atmosphere remains relaxed, with beach shacks, small restaurants and quiet bars replacing the high-energy venues that dominate parts of the north. An evening here often revolves around a long seafood dinner overlooking the water, a walk along an almost empty beach or live acoustic music playing softly in the background. Research also shows increasing interest in South Goa's nightlife, suggesting that more travellers are actively looking for experiences beyond the traditional party circuit.
        </p>
        <p>
          Choosing between the two becomes much easier once you stop asking which side has the &quot;best&quot; nightlife and start asking how you want your evening to feel.
        </p>
        <p>
          If your idea of a memorable night includes discovering cocktail bars, exploring markets, trying different restaurants and having the flexibility to decide where the evening goes next, North Goa is likely to suit you better.
        </p>
        <p>
          If you picture quieter beaches, intimate cafés, peaceful dinners and evenings that end with the sound of the waves rather than loud music, South Goa offers a completely different but equally rewarding experience.
        </p>
        <p className="font-semibold text-foreground text-center my-4">
          Neither choice means missing out. It simply means experiencing a different side of Goa.
        </p>
      </div>

      {/* 2. Things Worth Knowing */}
      <div className="space-y-6 mt-12 border-t border-border pt-10">
        <h2 className="font-display text-2xl text-foreground">A Few Things Worth Knowing Before You Head Out</h2>
        <p>
          A little planning can make your evenings much smoother, especially if you're visiting Goa for the first time.
        </p>
        <p>
          Transport is the first thing to think about. Renting a scooter works well during the day, but if you plan on enjoying cocktails or spending the evening at multiple venues, booking a taxi is the safer option. Services like GoaMiles operate across much of the state, although availability becomes more limited late at night in quieter areas, so arranging your return journey in advance is often a good idea.
        </p>
        <p>
          Seasonality also makes a noticeable difference. Between November and March, almost every venue is operating at full capacity, live music calendars are packed and night markets are at their busiest. Visit during the monsoon and you'll discover a quieter side of Goa. While some seasonal beach shacks close, many cocktail bars, restaurants and indoor venues continue to welcome visitors, creating a more relaxed atmosphere that regular travellers often enjoy.
        </p>
        <p>
          One final point that's easy to overlook is timing. Popular sunset venues begin filling up well before the sun actually sets, particularly during peak season. Arriving thirty to forty-five minutes early not only gives you a better table but also lets you enjoy the gradual transition from afternoon to evening—the part of the experience many people remember most.
        </p>

        <div className="my-8">
          <img
            src="/blog/goa-sign-i-love.webp"
            alt="Neon sign displaying I love Goa glowing red at night"
            className="w-full rounded-2xl border border-border object-cover aspect-video"
            loading="lazy"
          />
        </div>
      </div>

      {/* 3. The Best Nights Rarely Follow a Plan */}
      <div className="space-y-6 mt-12">
        <h2 className="font-display text-2xl text-foreground">The Best Nights in Goa Rarely Follow a Plan</h2>
        <p>
          The more time you spend in Goa, the more you realise that the evenings people talk about years later usually aren't the ones packed with the most activities.
        </p>
        <p className="font-semibold text-foreground">
          They're the evenings that unfolded naturally.
        </p>
        <p>
          A sunset drink becomes dinner. Dinner turns into live music after someone at the next table recommends a nearby venue. On another night, a quick visit to a market ends with dessert from a food stall and an unplanned walk along the beach. Those moments rarely appear on an itinerary, yet they're often the memories that define a trip.
        </p>

        <div className="my-8">
          <img
            src="/blog/goa-beach-reflection.webp"
            alt="Warm lights reflecting on wet sand at Palolem beach in South Goa at night"
            className="w-full rounded-2xl border border-border object-cover aspect-video"
            loading="lazy"
          />
          <span className="text-xs text-muted-foreground block text-center mt-2 italic">
            Candle-lit beach dinner shacks at Palolem Beach, reflecting a classic Goan night.
          </span>
        </div>

        <p>
          Goa has always been a place that rewards curiosity more than schedules.
        </p>
        <p>
          Give yourself enough time to wander, say yes to a recommendation from a local or another traveller and don't feel pressured to tick every famous venue off a list. Chances are, your favourite night won't be the one you spent planning—it'll be the one that happened almost by accident.
        </p>
      </div>

      {/* 4. Best Nightlife Isn't About Staying Out Latest */}
      <div className="space-y-6 mt-12 border-t border-border pt-10">
        <h2 className="font-display text-2xl text-foreground">Goa's Best Nightlife Isn't About Staying Out the Latest</h2>
        <p>
          After spending time across different parts of Goa, one thing becomes obvious: the nights people remember aren't always the loudest ones.
        </p>
        <p>
          They're the evenings that unfold naturally. You head out for a sunset drink, discover a cocktail bar recommended by a local, wander through a night market after dinner and somehow end the night sitting on the beach talking with friends. None of it was planned, and that's exactly why it stays with you.
        </p>
        <p>
          Goa gives you the freedom to create your own version of nightlife. One evening might revolve around live music in Panjim, another around cocktails in Assagao or sunset views from Vagator. The following night could be as simple as seafood by the beach in Agonda or joining a drum circle in Arambol without spending a single rupee. Every experience feels different because every part of Goa comes alive in its own way once the sun goes down.
        </p>
        <p>
          Instead of asking where the biggest party is happening tonight, try asking yourself a different question:
        </p>
        <p className="font-semibold text-foreground text-lg italic text-center py-2">
          &quot;What kind of evening would make this trip memorable?&quot;
        </p>
        <p>
          Once you know the answer, choosing where to go becomes surprisingly easy.
        </p>
      </div>

      {/* 5. Stay Close to the Experiences */}
      <div className="space-y-6 mt-12 bg-muted/20 border border-border rounded-2xl p-6 sm:p-8">
        <h2 className="font-display text-xl font-semibold text-foreground">Stay Close to the Experiences You'll Actually Enjoy</h2>
        <p className="text-sm leading-relaxed">
          One detail that's easy to overlook while planning a Goa trip is how much your accommodation influences your evenings.
        </p>
        <p className="text-sm leading-relaxed">
          Choosing a villa close to the experiences you care about means spending less time travelling and more time enjoying your trip. If sunset bars and lively restaurants are high on your list, staying around Anjuna, Vagator or Assagao makes exploring effortless. Travellers looking for quieter nights often feel more at home in Morjim, Ashwem, Mandrem or Agonda, where evenings move at a slower pace.
        </p>
        <p className="text-sm leading-relaxed">
          That's the approach we've taken at Wayzyy. Rather than simply listing properties, we help travellers discover stays that match the kind of holiday they're planning. Whether you're looking for a villa close to Goa's best cocktail bars, somewhere peaceful for long beach walks after dinner or a base for exploring different neighbourhoods every evening, choosing the right location often shapes the entire trip.
        </p>
        <p className="text-sm leading-relaxed">
          Because Wayzyy works directly with verified local hosts through a host-first model, travellers can often find better value than on larger booking platforms while staying close to the experiences that matter most.
        </p>
      </div>

      {/* 6. Interlinks */}
      <div className="mt-16 rounded-2xl border border-border bg-card/60 p-6 sm:p-8">
        <h3 className="font-display text-xl font-semibold text-foreground mb-4">
          Also Worth Reading
        </h3>
        <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
          If you're still planning your Goa itinerary, these guides will help you make the most of your trip:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-sm">
          <div>
            <Link to="/blog/north-goa-vs-south-goa-guide" className="text-ember hover:underline block font-semibold mb-1">North Goa vs South Goa</Link>
            <p className="text-xs text-muted-foreground leading-relaxed">A practical comparison to help you decide which side matches your style.</p>
          </div>
          <div>
            <Link to="/blog/best-time-to-visit-goa" className="text-ember hover:underline block font-semibold mb-1">Best Time to Visit Goa</Link>
            <p className="text-xs text-muted-foreground leading-relaxed">Understand how different seasons change the beaches and nightlife.</p>
          </div>
          <div>
            <Link to="/blog/anjuna-goa-beach-guide" className="text-ember hover:underline block font-semibold mb-1">Anjuna Guide</Link>
            <p className="text-xs text-muted-foreground leading-relaxed">Explore Goa's most vibrant destination for beach clubs and night markets.</p>
          </div>
        </div>
      </div>

      {/* Visible FAQs */}
      <div id="faq-section" className="mt-16 border-t border-border pt-12">
        <h3 className="font-display text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
          <HelpCircle className="h-6 w-6 text-ember" />
          Frequently Asked Questions
        </h3>
        <div className="space-y-4">
          {faqJsonLd.mainEntity.map((faq, i) => (
            <div key={i} className="border border-border rounded-xl bg-card overflow-hidden">
              <button
                onClick={() => toggleFaq(i)}
                className="w-full text-left p-5 font-semibold text-foreground flex items-center justify-between hover:bg-muted/10 transition-colors"
              >
                <span>{faq.name}</span>
                <span className="text-xl text-ember font-light">{openFaq === i ? "−" : "+"}</span>
              </button>
              {openFaq === i && (
                <div className="p-5 border-t border-border bg-background/50 text-sm text-muted-foreground leading-relaxed">
                  {faq.acceptedAnswer.text}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </BlogLayout>
  );
}
