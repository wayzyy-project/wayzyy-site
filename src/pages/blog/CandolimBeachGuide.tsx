import { BlogLayout } from "@/components/BlogLayout";
import { blogPosts } from "@/lib/blogPosts";
import { HelpCircle } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

const post = blogPosts.find((p) => p.slug === "candolim-goa-beach-guide")!;

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Is Candolim or Calangute better to stay in?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "For a calmer trip, Candolim. It runs into Calangute at one end and down to Sinquerim and Fort Aguada at the other, without Calangute's density or Baga's crowds.",
      },
    },
    {
      "@type": "Question",
      name: "Is the sea safe for swimming at Candolim?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "It depends on the season and the day. In the September shoulder season the tide can run high and the sea genuinely rough. Check conditions on the day rather than assuming it's always calm.",
      },
    },
    {
      "@type": "Question",
      name: "Does Candolim parking accept UPI?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Not at the main beach parking - it's cash only. Carry cash if you're driving in.",
      },
    },
    {
      "@type": "Question",
      name: "What is there to eat near Candolim beach?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Toula Bar & Kitchen, near the Holiday Inn, is worth the stop. The beach shacks themselves are average - fine for a drink, not a destination.",
      },
    },
    {
      "@type": "Question",
      name: "Is Candolim connected to Fort Aguada?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Candolim Beach runs south into Sinquerim Beach, which sits right below Fort Aguada, the 17th-century Portuguese fort and lighthouse.",
      },
    },
    {
      "@type": "Question",
      name: "What is the history of Fort Aguada?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Built by the Portuguese in 1612 to guard the Mandovi estuary against Dutch and Maratha incursions. It held a freshwater spring and cistern used to resupply ships, which is where the name comes from. The lighthouse on site was added in 1864.",
      },
    },
    {
      "@type": "Question",
      name: "Where can I see dolphins near Candolim?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Coco Beach, a short way along the coast, is the main jetty for dolphin-watching boat trips here. Go before 9am for the best chance of a sighting.",
      },
    },
    {
      "@type": "Question",
      name: "Is there nightlife in Candolim?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Not much - a handful of bars and lounges, but nothing like a strip. For an actual night out, Baga is a short drive away.",
      },
    },
  ],
};

export default function CandolimBeachGuide() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const toggleFaq = (index: number) => setOpenFaq(openFaq === index ? null : index);

  return (
    <BlogLayout
      title={post.title}
      description={post.description}
      metaTitle={post.metaTitle}
      metaDescription={post.metaDescription}
      heroImage={post.heroImage}
      heroImageAlt="A person playing football alone on Candolim beach at dusk, with gentle waves and a hazy evening sky"
      publishedDate={post.publishedDate}
      slug={post.slug}
      extraJsonLd={faqJsonLd}
    >
      <div className="space-y-6">
        <div className="rounded-2xl border border-ember/30 bg-ember/5 p-6">
          <p className="text-sm text-muted-foreground">
            <strong className="text-foreground">Quick answer:</strong> of the three beaches covered in this series - Candolim, Calangute, Baga - Candolim is the one we'd actually recommend staying at. It's a little crowded, the shacks are nothing special, and parking is cash-only, but it's calmer than its neighbours, connects straight to Fort Aguada, and has at least one restaurant worth planning a meal around.
          </p>
        </div>

        <h2 className="font-display text-2xl text-foreground mt-8">What Candolim actually is</h2>
        <p>
          Candolim is a long stretch of beach in North Goa that runs south into Sinquerim Beach, which in turn sits right below the lower side of <strong>Fort Aguada</strong> - the 17th-century Portuguese fort and lighthouse that marks the southern end of this whole run of coastline. If you're picturing North Goa's beaches as one continuous strip, Candolim is near the quieter end of it, with Calangute and Baga further north and busier.
        </p>
        <p>
          It's not empty. There's a fair crowd, and people genuinely love playing football on the sand here - it's as much a local pastime as a tourist scene. The shacks along the beach are average: doable for a beer and a plate of fries, not somewhere you'd plan a meal around.
        </p>

        <h2 className="font-display text-2xl text-foreground mt-8">The fort at the end of the beach</h2>
        <p>
          Walk south along the sand far enough and Candolim and Sinquerim lead you straight to <strong>Fort Aguada</strong>, built by the Portuguese in 1612. It wasn't just a defensive position - it held a freshwater spring and cistern that resupplied ships headed further afield, which is where the name comes from (<em>água</em> is Portuguese for water). The fort was built to guard the Mandovi estuary against the Dutch and the Marathas, and the lighthouse on the site, added in 1864, is still standing. Go in the morning if you want to actually enjoy the walk around the ramparts rather than do it in full midday heat, and save the beach for afterward.
        </p>
        <p>
          A short drive north of Candolim, on the Mandovi's northern bank, <strong>Reis Magos Fort</strong> is the quieter, less-visited alternative - built in 1551, originally as a fortress, later repurposed as a residence for Goa's Portuguese viceroys. It gets a fraction of Aguada's footfall, which is either a reason to go or a reason to skip it depending on what you're after.
        </p>

        <h2 className="font-display text-2xl text-foreground mt-8">The church on the hill</h2>
        <p>
          Above the beach road, the parish church - built in the 16th century and dedicated to Our Lady of Hope, though locals commonly call it St. Lawrence Church after the patron saint of sailors - sits on a small hillock with a view back over the bay. It's a quiet, whitewashed stop, more about the setting than any single feature inside, and worth the short detour if you're already walking the beach road rather than a destination in its own right.
        </p>

        <h2 className="font-display text-2xl text-foreground mt-8">Coco Beach and the dolphin boats</h2>
        <p>
          A short way along from Candolim, Coco Beach functions less as a swimming beach and more as the main jetty for boat trips and dolphin-watching along this stretch of coast - smaller, less commercial, and noticeably less built-up than Candolim itself. If dolphins are actually the goal rather than just a box to tick, go early: most operators and regular visitors agree the sightings happen before 9am, not mid-morning once the boat traffic picks up.
        </p>

        <h2 className="font-display text-2xl text-foreground mt-8">Water sports, if you want them</h2>
        <p>
          Candolim has the standard North Goa lineup - parasailing, jet skiing, banana boat rides - run by operators working directly off the sand. Sinquerim, immediately south, leans slightly more toward windsurfing and scuba diving specifically, if either of those is what you're after rather than the quicker adrenaline options. As with any beach operator in Goa, it's worth glancing at which one has a steady setup and other customers already queued rather than the first person who approaches you.
        </p>

        <h2 className="font-display text-2xl text-foreground mt-8">Candolim's nightlife, honestly</h2>
        <p>
          This isn't where you come for a big night out. There are a handful of bars and lounges along the Candolim-Calangute road, enough for a quiet drink, but nothing resembling a strip. If a proper night out is the plan, Baga is a short drive away and is where that plan actually belongs - see our{" "}
          <Link to="/blog/baga-goa-beach-guide" className="text-ember hover:underline">
            Baga guide
          </Link>
          .
        </p>

        <h2 className="font-display text-2xl text-foreground mt-8">Getting there and around</h2>
        <p>
          Candolim sits roughly 40 minutes from Dabolim airport and about 30-40 minutes from Panjim, depending on traffic on the coastal road. Once you're there, a rented scooter is genuinely the easiest way to move between Candolim, Sinquerim, and the fort - the whole stretch is walkable if you don't mind the heat, but a scooter turns a 25-minute walk into a five-minute ride when you're going back and forth for meals or the beach more than once a day. Taxis and rickshaws are easy enough to find along the main road if you'd rather not drive yourself.
        </p>

        <h2 className="font-display text-2xl text-foreground mt-8">Where to actually eat</h2>
        <p>
          Skip the beach shacks for an actual meal and go to <strong>Toula Bar &amp; Kitchen</strong>, near the Holiday Inn in Candolim. It's close to the beach, the food is genuinely good, the ambience is well done, and the staff are attentive - the kind of place that's worth building an evening around rather than ducking into because it's there.
        </p>

        <h2 className="font-display text-2xl text-foreground mt-8">The sea has moods - check before you swim</h2>
        <p>
          Visiting in September, the sea here was rough enough to be genuinely unswimmable - high tide, strong current, the kind of conditions where going in isn't worth the risk. This isn't true of Candolim year-round, but it's worth saying plainly: don't assume the water's calm just because the beach looks postcard-flat from the sand. Check conditions on the day, especially outside the November-February peak season.
        </p>

        <div className="my-8">
          <img
            src="/blog/candolim-beach-sunset-trees.webp"
            alt="Sunset over Candolim beach seen through silhouetted casuarina trees, with a small flag marking the shore"
            className="w-full rounded-2xl border border-border object-cover aspect-[4/5] sm:aspect-video"
            loading="lazy"
          />
          <span className="text-xs text-muted-foreground mt-2 block text-center">
            Candolim at sunset, through the trees along the beach. Our own photo, September 2026.
          </span>
        </div>

        <h2 className="font-display text-2xl text-foreground mt-8">Parking: good, but cash only</h2>
        <p>
          Parking at Candolim is easy to find and not the hassle it can be at busier beaches - but it's cash-only. No UPI. Carry notes if you're driving in, because you won't be able to pay by phone at the gate.
        </p>

        <h2 className="font-display text-2xl text-foreground mt-8">The market: fine, but pricier than you'd expect</h2>
        <p>
          Candolim's local market is decent but limited - don't expect Anjuna's scale or variety. What's there tends to run noticeably pricier than markets further up the coast like Anjuna's, so it's a fine stop for a specific thing you need, not really a browsing destination.
        </p>

        <h2 className="font-display text-2xl text-foreground mt-8">North Candolim vs. south, near the fort</h2>
        <p>
          Candolim isn't one uniform strip. The northern end, toward Calangute, is busier and more built-up, with the greater share of the shacks and shops. The southern end, closer to Sinquerim and the fort, is quieter and skews toward longer-stay visitors - there's a reason this stretch has a reputation as something of a retirement-friendly, long-stay corner for European package tourists who book a month at a time rather than a weekend. Which end suits you depends on whether you want to be near things or away from them; both are still unmistakably Candolim, just at different volumes.
        </p>

        <h2 className="font-display text-2xl text-foreground mt-8">Best time to visit</h2>
        <p>
          November through February is peak season across North Goa, Candolim included - cooler, dry, calm seas, every shack open. March and April get hot and increasingly humid before the monsoon arrives around June and runs through September, when the sea turns genuinely rough (as it was on our September visit) and a fair number of shacks shut down entirely. October is the shoulder season: fewer crowds, lower prices, but also a real chance of catching the tail end of the monsoon's unpredictable seas, so check conditions rather than assuming the season's settled just because the calendar says it should be.
        </p>

        <h2 className="font-display text-2xl text-foreground mt-8">Where to stay</h2>
        <p>
          If you want to actually walk to the beach rather than drive, look for something in the 300-metre range from the sand - a well-located, tastefully done 1BHK is enough for a couple or a small family, and puts you close to both the beach and Toula without needing a scooter for every trip.
        </p>

        <h2 className="font-display text-2xl text-foreground mt-8">Who it actually suits</h2>
        <p>
          Candolim works well for couples and families who want a beach that doesn't demand much of them - it's not a destination in itself the way a resort is, but it doesn't ask you to fight crowds for a sunbed either. Groups chasing nightlife will be happier based in Baga and visiting Candolim for a calmer afternoon than the other way around. If what you actually want is a few quiet days with the option of a fort walk, a decent meal, and a beach that isn't trying to sell you anything every ten metres, this is closer to that than its two neighbours.
        </p>

        <h2 className="font-display text-2xl text-foreground mt-8">A note on swimming safety</h2>
        <p>
          Goa's beaches use a flag system - green for safe, red for stay out - though enforcement on the ground varies a lot more than the signage suggests, and Candolim is no exception. Lifeguard coverage exists but isn't continuous along the whole stretch. The practical version of this: don't treat a green flag as a guarantee, and don't treat the absence of a red one as permission either, especially outside peak season when conditions change faster than the flags get updated. Our own experience here, with a rough September sea that nobody had flagged, is exactly the gap this leaves.
        </p>

        <h2 className="font-display text-2xl text-foreground mt-8">Candolim vs. Calangute vs. Baga, in one line each</h2>
        <ul>
          <li><strong>Candolim</strong> - a little crowded, decent football scene, average shacks, calmer than the other two.</li>
          <li><strong>Calangute</strong> - plenty of shacks and bars, livelier, more commercial.</li>
          <li><strong>Baga</strong> - the most crowded of the three, and the beach itself isn't as clean.</li>
        </ul>
        <p>
          Full guides for both:{" "}
          <Link to="/blog/calangute-goa-beach-guide" className="text-ember hover:underline">
            Calangute
          </Link>{" "}
          and{" "}
          <Link to="/blog/baga-goa-beach-guide" className="text-ember hover:underline">
            Baga
          </Link>
          .
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
