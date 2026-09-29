import { BlogLayout } from "@/components/BlogLayout";
import { blogPosts } from "@/lib/blogPosts";
import { HelpCircle } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

const post = blogPosts.find((p) => p.slug === "fontainhas-goa-guide")!;

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How much time do you need in Fontainhas?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "One day is genuinely enough, most of it in a couple of relaxed hours. Treat it as a stop within a wider Goa trip rather than a base to spend several days in.",
      },
    },
    {
      "@type": "Question",
      name: "When is the best time to visit Fontainhas?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Early morning or late afternoon for the light and cooler walking temperatures. If you can time it for February, the Fontainhas Festival turns the quarter into a walkable art exhibition. Visiting in September still works well; expect flowering trees and some weathered facades straight after the rains.",
      },
    },
    {
      "@type": "Question",
      name: "Where should I park in Fontainhas?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Park outside the quarter, the internal lanes are too narrow for comfortable driving. Options include the roadside near the main road, the parking along the boundary of the nearby park, or the area near Domino's.",
      },
    },
    {
      "@type": "Question",
      name: "Is it okay to photograph the colorful houses?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Ask first, and respect any signage. A number of homeowners have put up \"no photography\" signs after repeated disruption from visitors shooting reels against their houses.",
      },
    },
    {
      "@type": "Question",
      name: "What's the story behind the name Fontainhas?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "It comes from \"Fonte Phoenix,\" a natural spring that once sat at the foot of the Altinho hills at the edge of the neighborhood.",
      },
    },
  ],
};

export default function FontainhasGoaGuide() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const toggleFaq = (index: number) => setOpenFaq(openFaq === index ? null : index);

  return (
    <BlogLayout
      title={post.title}
      description={post.description}
      metaTitle={post.metaTitle}
      metaDescription={post.metaDescription}
      heroImage={post.heroImage}
      heroImageAlt="A narrow lane in Fontainhas, Panjim, with pink Portuguese-era houses, azulejo tiles under the windows, and residents' cars and scooters parked along the road under a cloudy sky"
      publishedDate={post.publishedDate}
      slug={post.slug}
      extraJsonLd={faqJsonLd}
    >
      <div className="space-y-6">
        <p>
          Most first-time visitors head straight for the beaches and never see this side of Goa at all — a residential quarter in the middle of Panjim where the streets are narrow enough that two scooters barely pass, and every house has been repainted, by unofficial rule, since the Portuguese era.
        </p>

        <h2 className="font-display text-2xl text-foreground mt-8">What Fontainhas actually is</h2>
        <p>
          Fontainhas sits between the Altinho hills and Ourem Creek in the heart of Panjim (Panaji), Goa's capital. It was originally laid out as a plantation in the late 18th century, then converted into a residential quarter for Portuguese administrators when the colonial government shifted its headquarters to Panjim in the early 1800s. UNESCO recognised it as a Heritage Zone in 1984, and the result is one of the few places anywhere you can actually spend the night inside a protected heritage district rather than just visit it.
        </p>
        <p>
          The name comes from <em>Fonte Phoenix</em> — Fountain of Phoenix — a natural spring that once sat at the foot of the Altinho hills, right at the edge of the neighborhood.
        </p>
        <p>
          What actually catches most visitors off guard isn't the color, it's how little the quarter feels like India at all. The house fronts, the balconies, the narrow cobbled lanes: it reads as a small Portuguese town that happens to sit in the middle of Panjim, and the effect is stronger in person than any photo manages to capture.
        </p>

        <h2 className="font-display text-2xl text-foreground mt-8">A short walk through it</h2>
        <p>Fontainhas rewards wandering more than planning, but if you want a loose route, this covers the core:</p>

        <div className="my-8">
          <img
            src="/blog/fontainhas-walking-route-map.webp"
            alt="Schematic walking route through Fontainhas from the Chapel of St. Sebastian and the main lanes to Confeitaria 31 de Janeiro, a gallery stop and Joseph Bar in the evening"
            className="w-full rounded-2xl border border-border object-cover"
            loading="lazy"
          />
          <span className="text-xs text-muted-foreground mt-2 block text-center">A schematic route, not to scale.</span>
        </div>

        <ol className="list-decimal pl-6 space-y-2 text-muted-foreground text-[15px] leading-relaxed">
          <li><strong className="text-foreground">Chapel of St. Sebastian</strong> — A whitewashed 19th-century chapel that stands out precisely because everything around it is color. Step inside for the altarpieces and a crucifix locals consider unusual: the figure's eyes are open rather than closed.</li>
          <li><strong className="text-foreground">The main lanes</strong> — Ochre yellow, deep red, and pastel blue houses with wooden-shuttered windows and wrought-iron balconies. A few of the most-photographed houses now have signs asking visitors not to shoot photos or reels against them, so check for signage before you set up a shot. Go in September, straight after the rains, as we did, and expect character over polish: some facades looked weathered and a few were wrapped in blue tarpaulin.</li>
          <li><strong className="text-foreground">Confeitaria 31 de Janeiro</strong> — One of Goa's oldest bakeries (its signboard says established 1930), still baking in a wood-fired oven. This is the daytime stop to actually sit down at.</li>
          <li><strong className="text-foreground">A gallery stop</strong> — Small independent galleries are tucked between the residences, showing local and contemporary Goan artists, worth ten minutes even if you're not planning to buy anything.</li>
          <li><strong className="text-foreground">Joseph Bar, in the evening</strong> — An old-school local tavern and one of the classic places in Fontainhas for feni. Worth coming back for after dark rather than fitting into the daytime walk.</li>
        </ol>

        <p className="italic text-muted-foreground border-l-2 border-ember pl-4">
          <span className="block not-italic text-xs uppercase tracking-wide text-ember mb-1">Good to know</span>
          Fontainhas is a lived-in residential neighborhood, not an open-air museum — people's front doors and gardens are part of the view. Some homeowners have started putting up signs after years of visitors shooting Instagram reels against their houses uninvited. Read the signage, and if a house is marked, move on rather than argue it.
        </p>

        <h2 className="font-display text-2xl text-foreground mt-8">Eating and drinking like a local</h2>
        <p>
          Two stops worth actually planning around rather than stumbling into: Confeitaria 31 de Janeiro for the morning, and Joseph Bar once evening comes around. The signboards say "Joseph Bar," though plenty of people write "Joseph's Bar," so search for either. It's an old-school, no-frills tavern and one of the classic local spots for feni. Order the cheese-topped potatoes; it's the one dish worth going out of your way for.
        </p>
        <p>
          At the bakery, the signpost out front points you to bebinca, pastéis de nata, bolo sans rival and doce de grão, which makes a decent shopping list for a first visit.
        </p>

        <div className="my-8">
          <div className="grid grid-cols-2 gap-3">
            <img
              src="/blog/joseph-bar-fontainhas.webp"
              alt="Joseph Bar's blue-painted frontage in Fontainhas, Panjim, with hand-painted signboards, a red corrugated awning, and potted plants along a white picket fence"
              className="w-full h-full rounded-2xl border border-border object-cover aspect-[3/4]"
              loading="lazy"
            />
            <img
              src="/blog/confeitaria-31-de-janeiro-signboard.webp"
              alt="Round signboard for Confeitaria 31 de Janeiro, a bakery established in 1930, above a colourful signpost pointing to bebinca, pasteis de nata, bolo sans rival and doce de grao"
              className="w-full h-full rounded-2xl border border-border object-cover aspect-[3/4]"
              loading="lazy"
            />
          </div>
          <span className="text-xs text-muted-foreground mt-2 block text-center">
            Left: Joseph Bar's frontage on the lane. Right: the signboard and signpost outside Confeitaria 31 de Janeiro. Our photos from September 2026, with faces, number plates and a phone number blurred.
          </span>
        </div>

        <h2 className="font-display text-2xl text-foreground mt-8">The one time of year to actually plan around</h2>
        <p>
          Every February, the Fontainhas Festival turns the quarter into a walkable exhibition — art, music, and several private homes opening their doors as pop-up galleries for the weekend. If your trip dates are flexible at all, this is worth building the visit around rather than bolting on.
        </p>

        <h2 className="font-display text-2xl text-foreground mt-8">Practical bits</h2>
        <ul>
          <li><strong>Time needed:</strong> one day is genuinely enough, and most of that is a couple of relaxed hours — this is a stop on a Goa trip, not somewhere to base yourself for several days.</li>
          <li><strong>Parking:</strong> the internal lanes are too narrow to drive comfortably, so park outside the quarter. Roadside near the main road works, as does the parking that runs along the boundary of the nearby park, or the area near Domino's.</li>
          <li><strong>Best light:</strong> early morning or late afternoon, both for temperature and for photos of the house fronts.</li>
          <li><strong>The local market:</strong> worth a look, and good quality, but noticeably pricier than markets like Anjuna's, go for the browsing more than the bargain.</li>
          <li><strong>Pair it with:</strong> Panjim's Mandovi riverfront and the Goa State Museum are close enough to combine into one Panjim day.</li>
        </ul>

        <h2 className="font-display text-2xl text-foreground mt-8">Where to base yourself</h2>
        <p>
          Fontainhas itself has a handful of heritage homestays tucked into the old houses, but most travellers base out of Panjim proper or North Goa and treat this as a half-day trip. It also sits naturally on a route between North and South Goa, an easy stop to slot in if you're driving between the two rather than a special trip on its own. If you're planning the wider Panjim–North Goa split,{" "}
          <Link to="/blog/where-to-stay-in-goa" className="text-ember hover:underline">
            our guide to where to stay in Goa
          </Link>{" "}
          covers how to think about it by travel style.
        </p>
      </div>

      <div className="border-t border-border mt-16 pt-12">
        <h3 className="font-display text-2xl text-foreground mb-6 flex items-center gap-2">
          <HelpCircle className="w-6 h-6 text-ember" />
          Frequently Asked Questions
        </h3>
        <div className="space-y-4">
          {faqJsonLd.mainEntity.map((faq, index) => (
            <div
              key={index}
              className="border border-border rounded-xl bg-card overflow-hidden transition-all duration-200"
            >
              <button
                onClick={() => toggleFaq(index)}
                className="w-full text-left px-6 py-4 flex items-center justify-between font-display text-foreground hover:bg-muted/50 transition-colors"
              >
                <span>{faq.name}</span>
                <span className="text-muted-foreground font-light text-xl">
                  {openFaq === index ? "−" : "+"}
                </span>
              </button>
              {openFaq === index && (
                <div className="px-6 pb-5 text-muted-foreground border-t border-border/50 pt-4 text-sm leading-relaxed">
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
