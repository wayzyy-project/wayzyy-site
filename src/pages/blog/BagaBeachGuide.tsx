import { BlogLayout } from "@/components/BlogLayout";
import { blogPosts } from "@/lib/blogPosts";
import { HelpCircle } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

const post = blogPosts.find((p) => p.slug === "baga-goa-beach-guide")!;

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Is Baga Beach clean?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "It has a reputation, deserved by most accounts, as the least clean of the main North Goa beaches - a function of being the most crowded and commercially developed stretch on this part of the coast.",
      },
    },
    {
      "@type": "Question",
      name: "What is Tito's Lane?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Baga's nightclub strip, named after Club Tito's, which opened in 1971. It's lined with clubs and bars including Cape Town Cafe and Cocktails and Dreams, often called the \"Big Three.\"",
      },
    },
    {
      "@type": "Question",
      name: "Is Baga Beach good for a relaxed holiday?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Not really - Baga is built around nightlife and density. Travellers wanting a calmer stay typically pick Candolim and visit Baga specifically for a night out.",
      },
    },
    {
      "@type": "Question",
      name: "Is Baga Beach safe at night?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The main strip is well-lit, busy and policed. Standard nightlife precautions apply: stick to licensed venues, watch your drink, agree taxi fares upfront.",
      },
    },
    {
      "@type": "Question",
      name: "Is there anything to do in Baga during the day?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Baga Creek is a quiet daytime spot for a walk or swim, and water sports operators run during the day rather than at night. Mackie's Saturday Night Bazaar, on the banks of the Baga River, runs 6pm to midnight every Saturday.",
      },
    },
    {
      "@type": "Question",
      name: "What is the difference between Mackie's and Ingo's night markets?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Both started as one market in 1999 before the founders split. Mackie's stayed at the original riverside spot and is smaller and more relaxed. Ingo's (the Arpora Saturday Night Market) moved to a larger plot in Arpora and is much bigger, with a central stage and thousands of visitors.",
      },
    },
  ],
};

export default function BagaBeachGuide() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const toggleFaq = (index: number) => setOpenFaq(openFaq === index ? null : index);

  return (
    <BlogLayout
      title={post.title}
      description={post.description}
      metaTitle={post.metaTitle}
      metaDescription={post.metaDescription}
      heroImage={post.heroImage}
      heroImageAlt="Colourful canopied boats lined up on the sand, with palm trees and green hills under a clear blue sky"
      publishedDate={post.publishedDate}
      slug={post.slug}
      extraJsonLd={faqJsonLd}
    >
      <div className="space-y-6">
        <div className="rounded-2xl border border-ember/30 bg-ember/5 p-6">
          <p className="text-sm text-muted-foreground">
            <strong className="text-foreground">Quick answer:</strong> Baga has the strongest reputation of any North Goa beach, and the most polarising one. It's the nightlife capital of the coast, built around Tito's Lane, and it's also widely considered the most crowded and least clean of the main beaches here. Go for a night out. Think twice about basing your whole trip there.
          </p>
        </div>

        <h2 className="font-display text-2xl text-foreground mt-8">What Baga is actually known for</h2>
        <p>
          If Calangute is the beach everyone's heard of, Baga is the one people actually plan a night around. It sits at the northern end of the Calangute-Baga stretch, and after dark it's arguably the most concentrated nightlife zone in Goa - clubs, bars, beach shacks that turn into open-air parties once the sun goes down.
        </p>
        <p>
          The flip side of that reputation is crowding. Baga is widely regarded as the most crowded of the main North Goa beaches, and the beach itself doesn't have the cleanest reputation either - both are fairly direct consequences of being the most commercially developed and heavily trafficked stretch on this part of the coast.
        </p>

        <h2 className="font-display text-2xl text-foreground mt-8">Tito's Lane</h2>
        <p>
          Tito's Lane is Baga's defining feature. It takes its name from <strong>Club Tito's</strong>, which opened in 1971 and is widely credited with shaping Goa's modern nightlife scene from the ground up. The lane itself is lined with clubs and bars, with Tito's, Cape Town Cafe and Cocktails and Dreams often grouped together as the "Big Three." Expect commercial dance music, a continental-feeling street of bars and restaurants, and a crowd that skews toward first-time Goa visitors looking for exactly this.
        </p>
        <p>
          Beyond the lane itself, several beachfront shacks shift from restaurant mode to open-air party mode after dark, so the nightlife spills onto the sand as much as it stays on the strip.
        </p>

        <h2 className="font-display text-2xl text-foreground mt-8">Baga has a daytime, too</h2>
        <p>
          It's easy to write Baga off as purely a nightlife beach, and the reputation isn't wrong, but mornings and afternoons here are a genuinely different place. <strong>Baga Creek</strong>, where the stream meets the ocean at the beach's southern end, is a quiet spot for a walk or an early swim, lined with fishing boats and worth the visit just for the view before the crowds build. Daytime is also when the water sports operators actually run - parasailing, jet skiing, banana boats, and dolphin-spotting catamaran trips are all easier to book and less chaotic before sunset than after.
        </p>
        <p>
          If your visit lines up with a Saturday, <strong>Mackie's Saturday Night Bazaar</strong>, on the banks of the Baga River, runs from 6pm to midnight - handicrafts, jewellery, snacks, and live music, closer to a proper market than the tourist-trap souvenir strip some expect. And for food that isn't trying to be a nightclub, <strong>Britto's</strong>, right on the beach, has been a straightforward seafood-and-cold-beer institution here for long enough that locals recommend it as readily as tourists do.
        </p>

        <h2 className="font-display text-2xl text-foreground mt-8">Ingo's vs. Mackie's: two different markets, not one</h2>
        <p>
          Worth clearing up, since it trips people up: Mackie's and Ingo's were originally the same market. They started together in 1999 on a spot overlooking the Baga river, then the founders split, and Mackie's stayed put while Ingo's moved to a much larger plot further into Arpora, on the Aguada-Siolim road. What exists now are two genuinely different nights out. <strong>Mackie's</strong> is the smaller, cosier version in the original riverside spot - manageable crowds, a relaxed pace. <strong>Ingo's</strong> (often just called the Arpora Saturday Night Market) is the bigger, louder version: several thousand people, multiple levels, a central stage that's hosted real touring musicians, and food stalls running everything from wood-fired pizza to things you wouldn't expect to find in Goa at all. Both run Saturdays through the winter season, November to roughly March or April. If you want quiet and a browse, go to Mackie's. If you want the spectacle, go to Ingo's.
        </p>

        <h2 className="font-display text-2xl text-foreground mt-8">Chapora Fort, if you have half a day</h2>
        <p>
          About 20 minutes by taxi from Baga, the laterite ruins of Chapora Fort look out over the Chapora River mouth and the Arabian Sea at the same time, and it's a genuinely worthwhile half-day trip if Baga's crowds start to wear thin. There's not much structure left to explore - it's a ruin, not a restored monument - but the view is the actual point.
        </p>

        <h2 className="font-display text-2xl text-foreground mt-8">Who it actually suits</h2>
        <p>
          Baga makes sense for a night out, or for travellers whose whole trip is built around nightlife. It makes less sense as a base for a relaxed beach holiday - the crowding and noise that make it good at night don't disappear during the day. A common pattern among experienced Goa travellers is to stay somewhere calmer and come to Baga specifically for an evening, rather than booking a stay right on top of it. Candolim, a short drive south, is the usual alternative. Full guide:{" "}
          <Link to="/blog/candolim-goa-beach-guide" className="text-ember hover:underline">
            Candolim Beach
          </Link>
          .
        </p>

        <h2 className="font-display text-2xl text-foreground mt-8">If you only have one night</h2>
        <p>
          Go to the beach in the late afternoon while the water sports operators are still running, grab an early seafood dinner at Britto's or one of the other beachfront shacks while it's still relatively calm, then let the evening tip over into Tito's Lane once the crowd actually arrives, which tends to be later than first-timers expect - well past 10pm rather than at sunset. Trying to do all of Baga in a rushed afternoon-to-midnight sprint is how people end up seeing the crowds and missing what the daytime side is actually like.
        </p>

        <h2 className="font-display text-2xl text-foreground mt-8">Best time to visit, and a safety note on the sea</h2>
        <p>
          November through February is peak season, with the calmest seas and every club and shack open. The monsoon months, roughly June to September, bring a rough sea that isn't safe for swimming regardless of how the beach looks from the sand, and a number of the nightlife venues scale back or close entirely in the quietest stretch of that window. Outside of water safety, the other thing worth knowing: Baga's crowds and its reputation for touts are real, so treat unsolicited offers on the beach - water sports, "good price" taxi rides, anything pressed on you rather than sought out - with the same skepticism you'd use anywhere else that's this busy.
        </p>

        <h2 className="font-display text-2xl text-foreground mt-8">Getting there</h2>
        <p>
          Baga is about 40 minutes from Panjim and from Thivim railway station by road, and closer to an hour and a half from Dabolim airport given the distance south. If you're flying into Manohar International (Mopa) instead, the drive is shorter, since Mopa sits further north. Once you're there, Baga is genuinely walkable end to end - the beach, Tito's Lane, and the creek are all within a few minutes of each other on foot, which is part of why it feels more compact and more crowded than its actual size would suggest.
        </p>

        <h2 className="font-display text-2xl text-foreground mt-8">Should families go to Baga?</h2>
        <p>
          For the day, yes - the creek, the water sports, and Britto's for lunch all work fine for a family visit, and mornings here are genuinely calmer than the reputation suggests. For a base to actually stay, less so. The density and noise that build through the evening don't suit most families looking for an early night, and the walk back to a nearby stay can mean cutting straight through the thick of the nightlife crowd. Candolim or Calangute, both a short drive away, are the more common choice for families who still want to visit Baga without sleeping in the middle of it.
        </p>

        <h2 className="font-display text-2xl text-foreground mt-8">Practical bits</h2>
        <ul>
          <li><strong>Best for:</strong> a night out, not a beach day. Plan your evening here and your daytime elsewhere.</li>
          <li><strong>Safety:</strong> the main strip is well-lit and busy, which generally makes it safer than an empty beach at night. Stick to licensed venues, keep an eye on your drink, and agree taxi fares before getting in.</li>
          <li><strong>Getting there:</strong> it runs directly into Calangute's northern end, so if you're already at Calangute, Baga's strip is a walk, not a drive.</li>
          <li><strong>Crowds:</strong> peak season (Nov-Feb) and weekends are considerably busier; weeknights outside peak season are noticeably calmer.</li>
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
