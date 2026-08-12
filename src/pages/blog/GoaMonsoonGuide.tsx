import { BlogLayout } from "@/components/BlogLayout";
import { blogPosts } from "@/lib/blogPosts";
import { Link } from "react-router-dom";
import { HelpCircle, CloudRain, ShieldAlert, Compass } from "lucide-react";
import { useState } from "react";

const post = blogPosts.find((p) => p.slug === "goa-monsoon-guide")!;

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      "name": "Can you visit Dudhsagar Falls in monsoon?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, but not via jeep safaris, which are suspended due to flooded forest roads. Unofficial railway track walks are strictly prohibited and dangerous. The only legal way is through a guided forest trek starting from Collem Gate with a registered guide and permissions."
      }
    },
    {
      "@type": "Question",
      "name": "Is swimming allowed at Dudhsagar Falls in monsoon?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "No. Swimming at the base of Dudhsagar Falls is strictly prohibited during the monsoon season because the water flow is extremely heavy, and currents become dangerously strong."
      }
    },
    {
      "@type": "Question",
      "name": "Why is power backup important for villas in Goa during monsoon?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Goa experiences frequent and prolonged power outages during heavy monsoon rains. Stays with a full diesel generator backup are essential for keeping fiber internet, air conditioning, and appliances running smoothly."
      }
    },
    {
      "@type": "Question",
      "name": "Can you swim in the sea in Goa during monsoon?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "No. Swimming in the sea is prohibited by lifeguards during the monsoon (typically June to September) due to rough seas, high tides, and extremely strong undercurrents."
      }
    },
    {
      "@type": "Question",
      "name": "What are the best neighborhoods to stay in Goa during monsoon?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Inland villages like Assagao, Siolim, Porvorim, or the capital Panjim are preferred. They offer excellent cafes, reliable power/internet infrastructure, and beautiful countryside views away from the rough beaches."
      }
    }
  ]
};

export default function GoaMonsoonGuide() {
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
      heroImageAlt="A traveler sitting on a cliff in Goa under a rainbow umbrella overlooking the stormy monsoon sea"
      publishedDate={post.publishedDate}
      slug={post.slug}
      extraJsonLd={faqJsonLd}
    >
      {/* Introduction & Dudhsagar */}
      <div className="space-y-6">
        <h2 className="font-display text-2xl text-foreground mt-8">Visiting Dudhsagar Falls During Monsoon: What Most Travel Guides Don't Tell You</h2>
        <p>
          No place represents Goa during the monsoon better than Dudhsagar Falls.
        </p>
        <p>
          As the rains arrive, the waterfall transforms into one of the most dramatic natural sights in India. Water crashes down from more than 300 metres through the forests of the Western Ghats, mist fills the valley and the entire landscape becomes intensely green. It's no surprise that almost every itinerary includes Dudhsagar during the rainy season.
        </p>
        <p className="font-semibold text-foreground text-lg italic text-center py-2">
          Unfortunately, it's also one of the most misunderstood attractions in Goa.
        </p>
        <p>
          Many travel blogs still recommend activities that are no longer possible or, even worse, encourage routes that are both illegal and dangerous.
        </p>
        <p>
          The biggest misconception is that you can simply book a jeep safari and drive to the waterfall.
        </p>
        <p className="font-semibold text-ember text-center">
          That isn't how monsoon access works anymore.
        </p>
        <p>
          Every year, once the heavy rains arrive, the Forest Department suspends the regular jeep safari route because the forest roads become unsafe. At the same time, authorities actively discourage the unofficial railway-track route that became popular through social media after several safety incidents and repeated trespassing on active railway lines. If you've watched older YouTube videos or read travel guides published a few years ago, there's a good chance the information is now outdated.
        </p>
        <p>
          Today, the safest and officially recognised way to experience Dudhsagar during monsoon is through a guided forest trek operated under the required permissions. Visitors enter through the Collem Forest Gate, follow designated trails with trained guides and must carry valid government identification. Swimming at the base of the waterfall is also prohibited during the rainy season because the currents become extremely dangerous once the river is in full flow.
        </p>

        <div className="my-8">
          <img
            src="/blog/goa-monsoon-trekking-hill.webp"
            alt="A traveler with a red backpack trekking up a lush, vibrant green hill in Goa under mist-shrouded skies"
            className="w-full rounded-2xl border border-border object-cover aspect-video"
            loading="lazy"
          />
        </div>

        <p>
          That doesn't mean you should remove Dudhsagar from your itinerary. It simply means you should plan for the version that's actually available.
        </p>
        <p>
          One of the most underrated ways to experience the waterfall is from the train that passes through the Dudhsagar railway section. As the train moves through dense forest and the waterfall suddenly appears through the mist, you get one of the most spectacular views in Goa without needing permits, difficult treks or risky detours. It's an experience many travellers overlook simply because most articles never mention it.
        </p>
        <p>
          If your priority is simply enjoying waterfalls rather than ticking off the most famous name, there are excellent alternatives.
        </p>
        <p>
          Harvalem Waterfall is much easier to access during monsoon and requires far less planning, making it ideal for families and travellers who don't want to spend an entire day trekking. The nearby Tambdi Surla Temple and the surrounding forests also provide a beautiful combination of history and nature, especially after rainfall when the entire region comes alive with streams, dense greenery and cool mountain air.
        </p>
        <p className="font-semibold text-foreground">
          The lesson isn't to avoid Dudhsagar. It's to visit with the right expectations.
        </p>
        <p>
          Goa during monsoon rewards travellers who adapt their plans instead of trying to recreate a winter itinerary. Once you do that, experiences like Dudhsagar become even more memorable because you're seeing them exactly as nature intended - not from a crowded jeep queue, but in the middle of one of the most spectacular rainy landscapes in the country.
        </p>
        <p>
          Of course, even the best itinerary can be affected by one simple decision.
        </p>
        <p>
          Where you choose to stay during the monsoon often has a bigger impact on your trip than the attractions you visit. A villa with reliable power backup, good internet and the right location can completely change your experience when the weather refuses to follow your plans.
        </p>
      </div>

      {/* Staying Backup */}
      <div className="space-y-6 mt-12 border-t border-border pt-10">
        <h2 className="font-display text-2xl text-foreground">Choosing the Right Place to Stay Matters Even More During Monsoon</h2>
        <p>
          During winter, where you stay in Goa often comes down to convenience. You'll probably spend most of your day exploring beaches, cafés, restaurants and markets before returning to your accommodation late in the evening. Even if your hotel isn't perfect, you're rarely there long enough for it to affect the overall trip.
        </p>
        <p className="font-semibold text-foreground text-lg italic text-center py-2">
          Monsoon changes that completely.
        </p>
        <p>
          Rain naturally encourages slower days. You might spend an afternoon working from your villa, reading on a covered balcony, cooking a meal instead of heading out or simply waiting for a heavy shower to pass before exploring again. Suddenly, your accommodation becomes far more than just a place to sleep.
        </p>
        <p>
          That's why choosing the right stay is one of the most important decisions you'll make if you're visiting Goa during the rainy season.
        </p>

        {/* Generat vs pool */}
        <h3 className="font-display text-lg text-foreground mt-8">Don't Choose a Villa Just Because It Has a Pool</h3>
        <p>
          A private pool looks incredible in photographs. During monsoon, however, it's rarely the feature that determines whether your stay is enjoyable.
        </p>
        <p>
          Reliable power backup, strong fibre internet, covered outdoor spaces, a well-equipped kitchen and enough indoor living space quickly become much more valuable than another Instagram-worthy swimming pool. If you're planning a workation, those details become even more important because a beautiful villa isn't particularly useful if the Wi-Fi drops every time it rains or the electricity disappears for half the day.
        </p>
        <p>
          One practical tip that rarely appears in booking guides is to ask the host about their backup systems before confirming your reservation. A villa with a full diesel generator that can keep the internet, air conditioning and essential appliances running offers a completely different experience from one that relies only on a small inverter. That difference usually isn't obvious from the listing itself, but it becomes very obvious once the weather changes.
        </p>

        <div className="my-8">
          <img
            src="/blog/goa-monsoon-villas-palms.webp"
            alt="Luxury Goan villas tucked away in a thick coconut palm forest next to the stormy grey sea"
            className="w-full rounded-2xl border border-border object-cover aspect-video"
            loading="lazy"
          />
        </div>

        {/* Location shifts */}
        <h3 className="font-display text-lg text-foreground mt-8">The Best Areas to Stay During Monsoon Aren't Always Beachfront</h3>
        <p>
          Many first-time visitors automatically search for accommodation directly beside the beach. In winter, that makes perfect sense.
        </p>
        <p>
          During monsoon, the priorities shift.
        </p>
        <p>
          Neighbourhoods like Assagao, Siolim and parts of Porvorim often make better bases because they combine excellent cafés, quieter roads, reliable everyday infrastructure and easy access to both nature and heritage attractions. Staying around Panjim is another underrated option, especially if you enjoy walking through Fontainhas, exploring local restaurants and taking short day trips rather than spending every afternoon on the beach.
        </p>
        <p className="font-semibold text-foreground text-center my-4">
          The goal isn't to stay as close to the sea as possible. It's to stay close to the experiences you'll actually enjoy during the rainy season.
        </p>

        {/* Wayzyy */}
        <h3 className="font-display text-lg text-foreground mt-8">Why We Built Wayzyy for This Kind of Trip</h3>
        <p>
          One thing we've learnt after helping travellers plan stays across Goa is that the &quot;best&quot; property changes depending on the season. A villa that's perfect for New Year's Eve isn't necessarily the one we'd recommend in July.
        </p>
        <p>
          During monsoon, we'd rather help you find a home with dependable power backup, reliable fibre internet, comfortable indoor spaces and hosts who understand the practical challenges that come with the rainy season. Those details rarely appear at the top of booking platforms, yet they're often the difference between a relaxing week and a frustrating one.
        </p>
        <p>
          That's exactly where Wayzyy comes in.
        </p>
        <p>
          Instead of overwhelming you with thousands of listings, we focus on verified villas and homestays where the location, infrastructure and local support actually match the kind of holiday you're planning. Whether you're escaping for a quiet weekend, settling in for a month-long workation or simply looking for a slower side of Goa, choosing the right neighbourhood and the right host usually matters far more than choosing the most expensive property.
        </p>
        <p>
          By working directly with local hosts, Wayzyy also helps travellers discover unique stays that often offer better value than larger booking platforms, while giving you local recommendations that no search filter can replicate.
        </p>
        <p>
          One final question remains before you book your trip: what are the biggest mistakes people make when visiting Goa during the monsoon - and how can you avoid them completely? That's exactly what we'll cover next, because a few simple decisions can make the difference between an unforgettable rainy-season holiday and one you'll wish you'd planned differently.
        </p>
      </div>

      {/* Common Mistakes */}
      <div className="space-y-6 mt-12 border-t border-border pt-10">
        <h2 className="font-display text-2xl text-foreground">Common Mistakes That Can Ruin a Monsoon Trip to Goa</h2>
        <p>
          Most disappointing monsoon holidays don't happen because of the weather. They happen because people plan a winter itinerary and expect it to work exactly the same way in July or August.
        </p>
        <p>
          A few small adjustments are often enough to completely change the experience.
        </p>

        {/* Beach mistake */}
        <h3 className="font-display text-lg text-foreground mt-8 font-semibold">Don't Build Your Holiday Around the Beach</h3>
        <p>
          This is probably the biggest mistake first-time visitors make.
        </p>
        <p>
          Seeing the Arabian Sea during monsoon is absolutely worth it. Standing on an almost empty beach while powerful waves crash against the shore is an experience that's difficult to find during peak season.
        </p>
        <p>
          Swimming, however, is a completely different story.
        </p>
        <p>
          Strong currents and rough seas mean lifeguards prohibit entering the water across Goa's coastline during the monsoon. Beaches are places to walk, relax, enjoy the scenery and watch the changing weather - not places to spend the afternoon swimming or booking water sports. Planning your trip with that expectation immediately removes one of the biggest sources of disappointment.
        </p>

        <div className="my-8">
          <img
            src="/blog/goa-monsoon-stormy-beach.webp"
            alt="People walking on a wide beach with dark sand and big crashing monsoon waves under overcast skies"
            className="w-full rounded-2xl border border-border object-cover aspect-video"
            loading="lazy"
          />
        </div>

        {/* Scooter mistake */}
        <h3 className="font-display text-lg text-foreground mt-8 font-semibold">Don't Depend on a Scooter for Every Journey</h3>
        <p>
          Hiring a scooter is almost a tradition for travellers visiting Goa. During winter, it's one of the best ways to explore the state. During heavy monsoon showers, it quickly becomes far less enjoyable.
        </p>
        <p>
          Short rides between nearby cafés or restaurants are usually manageable, but longer journeys through continuous rain, poor visibility and waterlogged roads can become tiring very quickly. If you're planning to explore different parts of Goa over several days, renting a small car often makes the trip considerably more comfortable, especially for couples and families. Multiple traveller experiences also highlight that the comfort of proper wipers, air conditioning and a dry cabin outweighs the small savings of using a scooter once the rain becomes persistent. Learn more safety tips in our <Link to="/blog/goa-scooter-rental-guide" className="text-ember hover:underline">Scooter Rental Guide</Link>.
        </p>

        {/* Attraction mistake */}
        <h3 className="font-display text-lg text-foreground mt-8 font-semibold">Don't Expect Every Attraction to Be Open</h3>
        <p>
          Monsoon isn't simply the same tourist season with rain added to it. Some experiences pause completely, while others operate with seasonal restrictions.
        </p>
        <p>
          Beach shacks, water sports and certain adventure activities remain unavailable for much of the season, while places like Dudhsagar follow different access rules depending on weather conditions and Forest Department regulations. Checking opening hours before leaving your accommodation can save an unnecessary journey, especially if you're travelling during periods of heavy rainfall.
        </p>

        {/* Schedule mistake */}
        <h3 className="font-display text-lg text-foreground mt-8 font-semibold">Leave Space for Weather to Change Your Plans</h3>
        <p>
          Perhaps the best piece of advice is also the simplest: don't schedule every hour.
        </p>
        <p>
          One of the biggest advantages of travelling during monsoon is that it naturally encourages flexibility. If rain interrupts your plans for a heritage walk, spend another hour at a nearby café. If a waterfall isn't accessible, visit a spice plantation instead. If the forecast changes unexpectedly, treat it as part of the experience rather than something that's gone wrong.
        </p>
        <p className="font-semibold text-foreground text-center my-4">
          Goa has always rewarded travellers who slow down. The monsoon simply makes that lesson impossible to ignore.
        </p>
      </div>

      {/* Final Thoughts */}
      <div className="space-y-6 mt-12">
        <h2 className="font-display text-2xl text-foreground">Final Thoughts</h2>
        <p>
          Goa during the monsoon isn't better than Goa in winter. It's different.
        </p>
        <p>
          If your dream holiday revolves around water sports, crowded beach clubs and long days under clear blue skies, waiting a few more months will almost certainly give you the experience you're looking for.
        </p>
        <p>
          On the other hand, if you're drawn to quiet cafés, mist-covered roads, dramatic landscapes, slower mornings and the kind of trip where you don't feel the need to check the time every hour, the rainy season might become your favourite way to experience Goa.
        </p>
        <p>
          The secret isn't trying to recreate a December holiday in July. It's embracing everything that only the monsoon can offer.
        </p>
        <p className="font-semibold text-foreground text-center my-4">
          Choose the right month. Stay in the right neighbourhood. Leave enough room for unexpected discoveries.
        </p>
        <p>
          That's the version of Goa that many repeat visitors return for every single year.
        </p>
        <p>
          And if you're planning that kind of trip, Wayzyy can help you find verified villas and homestays that are genuinely suited to the season - whether that means reliable power backup for a workation, a peaceful countryside escape or a cosy stay close to Goa's best cafés and heritage neighbourhoods.
        </p>
        <p>
          Because in the monsoon, where you stay doesn't just support your holiday. It becomes part of the experience.
        </p>
      </div>

      {/* Interlinks */}
      <div className="mt-16 rounded-2xl border border-border bg-card/60 p-6 sm:p-8">
        <h3 className="font-display text-xl font-semibold text-foreground mb-4">
          Also Worth Reading
        </h3>
        <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
          If you're planning the rest of your Goa trip, these guides will help you make the most of your trip:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-sm">
          <div>
            <Link to="/blog/where-to-stay-in-goa" className="text-ember hover:underline block font-semibold mb-1">Where to Stay in Goa</Link>
            <p className="text-xs text-muted-foreground leading-relaxed">A complete decision guide to choosing the right neighborhood based on your style.</p>
          </div>
          <div>
            <Link to="/blog/best-time-to-visit-goa" className="text-ember hover:underline block font-semibold mb-1">Best Time to Visit Goa</Link>
            <p className="text-xs text-muted-foreground leading-relaxed">Understand how different seasons and the monsoons change the beaches.</p>
          </div>
          <div>
            <Link to="/blog/goa-beaches-guide" className="text-ember hover:underline block font-semibold mb-1">Goa Beaches Guide</Link>
            <p className="text-xs text-muted-foreground leading-relaxed">Find which beach fits your style for swimming, digital nomads, or families.</p>
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
