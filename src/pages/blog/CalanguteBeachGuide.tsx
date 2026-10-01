import { BlogLayout } from "@/components/BlogLayout";
import { blogPosts } from "@/lib/blogPosts";
import { HelpCircle } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

const post = blogPosts.find((p) => p.slug === "calangute-goa-beach-guide")!;

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Why is Calangute called the Queen of Beaches?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "It's North Goa's largest beach and its most visited by a wide margin - around 3 million visitors a year. The nickname is about scale and popularity more than any particular quality of the sand or water.",
      },
    },
    {
      "@type": "Question",
      name: "Is Calangute good for families?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "It can work for families who want everything within walking distance, but it's dense and commercial rather than relaxed. Families wanting a quieter beach day are usually better off at Candolim, just to the south.",
      },
    },
    {
      "@type": "Question",
      name: "How far is Calangute from Panjim and the airport?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "About 15 km from Panjim, roughly a 30 to 40 minute drive. From Dabolim airport it's closer to an hour.",
      },
    },
    {
      "@type": "Question",
      name: "Is Calangute connected to Baga Beach?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, they run into each other at the northern end of Calangute, and most of the associated nightlife is concentrated around that join, particularly Tito's Lane.",
      },
    },
    {
      "@type": "Question",
      name: "What is the oldest restaurant in Calangute?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Souza Lobo, open on the beach since 1932 and now run by the third generation of the same family. Its sister restaurant Infantaria, at the Calangute-Baga roundabout, is also a long-running local institution.",
      },
    },
    {
      "@type": "Question",
      name: "What is St. Alex Church in Calangute?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "A whitewashed church built in 1741, the third structure on the site since the 1500s, in a Mannerist Neo-Roman style with a cupola falsa. Less than two kilometres from the beach, open 9am to 8:30pm.",
      },
    },
  ],
};

export default function CalanguteBeachGuide() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const toggleFaq = (index: number) => setOpenFaq(openFaq === index ? null : index);

  return (
    <BlogLayout
      title={post.title}
      description={post.description}
      metaTitle={post.metaTitle}
      metaDescription={post.metaDescription}
      heroImage={post.heroImage}
      heroImageAlt="A wooden fishing boat resting on golden sand, with palm trees and beach huts lining the shore"
      publishedDate={post.publishedDate}
      slug={post.slug}
      extraJsonLd={faqJsonLd}
    >
      <div className="space-y-6">
        <div className="rounded-2xl border border-ember/30 bg-ember/5 p-6">
          <p className="text-sm text-muted-foreground">
            <strong className="text-foreground">Quick answer:</strong> Calangute is North Goa's biggest, busiest, most commercial beach - roughly 3 million visitors a year make it to this stretch of sand. That's genuinely useful if you want everything within walking distance. It's the wrong pick if what you actually want is a quiet beach day.
          </p>
        </div>

        <h2 className="font-display text-2xl text-foreground mt-8">The "Queen of Beaches" title, decoded</h2>
        <p>
          Calangute is North Goa's largest beach, and by most counts its single most visited, pulling in an estimated 3 million visitors a year. The nickname "Queen of Beaches" gets attached to it constantly, and it's earned through sheer scale and popularity rather than anything particular about the sand or the water - this isn't a hidden-cove kind of beach. It's the one everyone's heard of, which is exactly why it's busy.
        </p>
        <p>
          The beach itself is wide and long, lined almost end to end with shacks, sunbed rentals, and water sports operators. During peak season (roughly November to February) it's genuinely crowded, both on the sand and on the roads leading into town.
        </p>

        <h2 className="font-display text-2xl text-foreground mt-8">How a fishing village became "the Queen"</h2>
        <p>
          Calangute was a quiet fishing village until the mid-1960s, when the first wave of hippie travellers on the overland trail from Europe found their way here and never quite left. That counterculture moment put Calangute on the map; the 1990s charter-tourism boom is what actually built the version of it that exists today, cementing its status as North Goa's main hub for mass tourism. The eclectic mix of architecture along the beach road - old Portuguese-style houses next to newer concrete blocks - is a fairly literal record of that transition.
        </p>

        <h2 className="font-display text-2xl text-foreground mt-8">The one restaurant worth knowing by name</h2>
        <p>
          <strong>Souza Lobo</strong> has been on Calangute beach since 1932, now run by the third generation of the same family, and it's as close to an institution as this stretch of coast has. It's a large, no-frills, open-air room that catches the sea breeze rather than fighting it, known for crab xacuti, prawn curry rice, and a regular rotation of local bands. Its sister restaurant <strong>Infantaria</strong>, at the roundabout where the road splits toward Baga, started as a pastry counter and is now open 7:30am to 11pm serving everything from breakfast through dinner - including ros omlette and, if you're lucky, feni at a price that undersells most other places on this coast. Neither is a secret. Both are worth it anyway.
        </p>

        <h2 className="font-display text-2xl text-foreground mt-8">What's actually there</h2>
        <p>
          Shacks line most of the beachfront, serving the standard Goa mix of seafood, grilled fish, and cold beer, with sunbeds and umbrellas available to rent at most of them. Water sports - parasailing, jet skiing, banana boat rides - are concentrated here more than at the quieter beaches further south, and it's worth booking with an operator that has visible reviews rather than whoever approaches you first on the sand.
        </p>
        <p>
          Calangute's market is one of the bigger shopping stretches in North Goa - clothing, handicrafts, souvenirs - and haggling is the norm, not the exception. Prices quoted first are rarely the prices paid.
        </p>

        <h2 className="font-display text-2xl text-foreground mt-8">St. Alex Church</h2>
        <p>
          Less than two kilometres from the beach, St. Alex Church is worth the detour even if churches aren't usually your thing. The current structure, built in 1741, is the third version of the church on this site since the 1500s, built in a Mannerist Neo-Roman style with a cupola falsa - a false dome, built to look domed from inside without the structural weight of a real one, and reportedly the only church in Goa built this way in a distinctly Indian architectural idiom. It's open 9am to 8:30pm, whitewashed, and quiet in a way that's a genuine contrast to the beach a short walk away.
        </p>

        <h2 className="font-display text-2xl text-foreground mt-8">Kerkar Art Complex, and the quieter side of Calangute</h2>
        <p>
          On Holiday Street, a short way inland from the main beach road, the Kerkar Art Complex shows installation and sculpture work from the local artist Dr. Kerkar, whose pieces also turn up around Candolim and elsewhere in North Goa. On select evenings it hosts a performance of Indian classical music and dance, which is a genuinely different register from anything happening on the sand that same night. Holiday Street itself is worth knowing as a name: it's where to go for better-quality Indian goods without the full crowd-and-haggle experience of the main market.
        </p>

        <h2 className="font-display text-2xl text-foreground mt-8">Beyond parasailing</h2>
        <p>
          The standard roster - parasailing, jet-skiing, banana boat rides - is all here, but Calangute's water sports scene also stretches to stand-up paddleboarding and water skiing for people who want something more active than being towed behind a boat. For snorkelling or scuba specifically, operators along the Calangute-Anjuna road run dedicated trips rather than the add-on version offered at the main beach stalls.
        </p>

        <h2 className="font-display text-2xl text-foreground mt-8">Where it runs into Baga</h2>
        <p>
          Calangute's northern end runs directly into Baga Beach, and the two are often talked about as one continuous stretch. Most of the nightlife attributed to either beach is actually concentrated right around that join, centered on Tito's Lane. If you're staying in Calangute for the beach during the day and want nightlife at night, you're effectively walking into Baga's territory once the sun goes down. Full guide:{" "}
          <Link to="/blog/baga-goa-beach-guide" className="text-ember hover:underline">
            Baga Beach
          </Link>
          .
        </p>

        <h2 className="font-display text-2xl text-foreground mt-8">Who it actually suits</h2>
        <p>
          Calangute works well if you want a beach trip with zero planning - everything from pharmacies to ATMs to a dozen shack options is within a short walk, and the infrastructure (taxis, buses, rickshaws) is the most developed of any North Goa beach. It works less well if you're after a relaxed day by the water with space around you. For that, Candolim - a short drive south - is a calmer alternative with a similar range of amenities. Full guide:{" "}
          <Link to="/blog/candolim-goa-beach-guide" className="text-ember hover:underline">
            Candolim Beach
          </Link>
          .
        </p>

        <h2 className="font-display text-2xl text-foreground mt-8">What the market is actually selling</h2>
        <p>
          Calangute's market stalls lean heavily on jewellery, clothing, and handicrafts, with a specific reputation for Kashmiri and Tibetan goods - pashmina shawls, silver jewellery, carved wooden items - brought down by traders who follow the tourist season. It's worth knowing going in that very little of it is distinctly Goan; if you want something more locally rooted, the food stalls and the smaller spice vendors are a better bet than the clothing racks.
        </p>

        <h2 className="font-display text-2xl text-foreground mt-8">Using Calangute as your base for other beaches</h2>
        <p>
          Because of how central it sits, Calangute works well as a hub even if you don't spend every day on its own sand. Candolim is a short ride south for a calmer afternoon, Baga is a walk or a five-minute scooter ride north for a night out, and Anjuna's flea market and the beaches further north are all within easy day-trip range. Basing yourself here and visiting the quieter beaches rather than the reverse is a reasonable way to get the convenience of Calangute's infrastructure without spending every day in its crowds.
        </p>

        <h2 className="font-display text-2xl text-foreground mt-8">A day in Calangute, if you want a loose plan</h2>
        <p>
          Morning for the beach itself, before the heat and the crowds both peak - this is also when water sports operators are least busy if you want to book something without queuing. Early afternoon for St. Alex Church and a walk down Holiday Street, both a genuine change of pace from the sand. Evening for dinner at Souza Lobo or Infantaria, and if you're still going afterward, the walk into Baga's nightlife is short enough to do on foot.
        </p>

        <h2 className="font-display text-2xl text-foreground mt-8">Best time to visit</h2>
        <p>
          Like the rest of North Goa, November through February is peak season here - dry, warm without being punishing, and every shack open. The monsoon, roughly June to September, brings a genuinely unruly sea that's unsafe for most water sports and swimming, and a number of shacks close for the season entirely rather than fight it. If you're set on visiting outside the November-February window, October and early May are the more forgiving edges of the shoulder season, though conditions can still swing either way.
        </p>

        <h2 className="font-display text-2xl text-foreground mt-8">Families, couples, groups</h2>
        <p>
          Calangute genuinely works for all three, which is part of why it's as busy as it is. Families get pharmacies, ATMs, and a wide beach with shallow entry points within a short walk of most stays. Couples get Souza Lobo and the quieter stretch toward Candolim if the main beach feels like too much. Groups get the shack culture, the shopping, and Baga close enough to walk to once the sun goes down. The trade-off for that range is crowding - Calangute rarely feels like you've found a quiet corner of Goa, because that's not really what it's selling.
        </p>

        <h2 className="font-display text-2xl text-foreground mt-8">Practical bits</h2>
        <ul>
          <li><strong>Distance:</strong> about 15 km from Panjim (30-40 min by road), roughly an hour from Dabolim airport.</li>
          <li><strong>Best time:</strong> November to February for calm seas and open shacks; many shacks close and the sea turns rough during the monsoon months.</li>
          <li><strong>Getting around:</strong> rented scooters are the most flexible option; taxis and rickshaws are easy to find given the volume of tourists. Local buses connect Calangute to Mapusa and Panjim if you'd rather not drive yourself.</li>
          <li><strong>Markets:</strong> expect to haggle. Quoted prices are opening offers, not final ones.</li>
        </ul>
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
