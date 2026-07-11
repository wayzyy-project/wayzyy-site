import { BlogLayout } from "@/components/BlogLayout";
import { blogPosts } from "@/lib/blogPosts";
import { Link } from "react-router-dom";
import { HelpCircle, Calendar, Map, Navigation } from "lucide-react";
import { useState } from "react";

const post = blogPosts.find((p) => p.slug === "goa-itinerary-guide")!;

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      "name": "How many days are enough for a Goa trip?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Five days is the ideal duration for a first-time trip to Goa. It gives you enough time to split your stay between North and South Goa, experiencing both the lively cafe/nightlife scene and the relaxed beaches without rushing."
      }
    },
    {
      "@type": "Question",
      "name": "What is a split stay in Goa?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "A split stay involves booking your first few nights in North Goa (e.g., Anjuna or Assagao) to explore its restaurants and cafes, and then moving to South Goa (e.g., Palolem or Agonda) for the remainder of your trip to enjoy quieter beaches."
      }
    },
    {
      "@type": "Question",
      "name": "What is the best way to travel from North Goa to South Goa?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "The best way is to make the transit day part of the trip. Leave North Goa after breakfast, stop in Panjim for a heritage walk through Fontainhas and lunch, browse local municipal markets, and then arrive in South Goa by late afternoon."
      }
    },
    {
      "@type": "Question",
      "name": "Which beaches should I visit in South Goa for a quiet experience?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Palolem, Agonda, Benaulim, and Colva are excellent choices in South Goa for a peaceful atmosphere, scenic beach walks, and relaxing seaside dining."
      }
    },
    {
      "@type": "Question",
      "name": "Is it worth staying 7 days in Goa?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, a 7-day itinerary allows you to experience slow travel. It gives you the flexibility to visit remote beaches like Cola or Galgibaga, explore spice plantations, and rest without feeling rushed to see every attraction."
      }
    }
  ]
};

export default function GoaItineraryGuide() {
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
      heroImageAlt="A premium luxury private pool villa in Goa surrounded by lush tropical palms"
      publishedDate={post.publishedDate}
      slug={post.slug}
      extraJsonLd={faqJsonLd}
    >
      {/* Introduction */}
      <div className="space-y-6">
        <h2 className="font-display text-2xl text-foreground mt-8">The 5-Day Goa Itinerary: The Perfect Balance Between North and South</h2>
        <p>
          If someone asked us how many days are ideal for a first trip to Goa, our answer would almost always be the same.
        </p>
        <p className="font-semibold text-foreground text-lg italic text-center py-2">
          Five days.
        </p>
        <p>
          It's long enough to experience both North and South Goa without feeling like you're constantly living out of a suitcase, yet short enough to fit comfortably into a typical holiday. More importantly, it's the point where splitting your stay actually starts making sense. Instead of spending hours driving across the state every day, you can enjoy the energy of North Goa before slowing down and experiencing a completely different side of the coastline in the south. That's exactly why many experienced travellers recommend spending the first part of the trip in North Goa and finishing with two or three nights in South Goa.
        </p>
        <p>
          The biggest difference between a three-day and a five-day itinerary isn't that you'll visit twice as many places. It's that you'll finally have time to enjoy them.
        </p>

        {/* Days 1 & 2 */}
        <h3 className="font-display text-xl font-bold text-foreground mt-8">Days 1 & 2: Discover the Best of North Goa</h3>
        <p>
          Your first two days can follow the same relaxed approach as our three-day itinerary.
        </p>
        <p>
          Spend your mornings exploring the café culture around Assagao, Anjuna and Siolim, dedicate your afternoons to beaches that match your travel style and leave your evenings free for long dinners, sunset viewpoints or live music rather than rushing between attractions. Whether you choose quiet stretches like Mandrem and Ashwem or the livelier atmosphere around Vagator and Anjuna, the key is to explore one area properly instead of trying to cover the entire coastline.
        </p>
        <p>
          If you're travelling during the tourist season, this is also the ideal time to explore the Saturday Night Market or discover some of North Goa's growing food scene. Since we've already covered those experiences in detail, you can use our dedicated guides on <Link to="/blog/goa-markets-guide" className="text-ember hover:underline">Goa Markets</Link>, <Link to="/blog/goa-work-cafes-guide" className="text-ember hover:underline">Best Cafés in Goa</Link>, <Link to="/blog/goa-beaches-guide" className="text-ember hover:underline">Goa Beaches</Link> and <Link to="/blog/goa-food-guide" className="text-ember hover:underline">What to Eat in Goa</Link> to personalise these first two days based on your interests.
        </p>

        {/* Day 3 */}
        <h3 className="font-display text-xl font-bold text-foreground mt-8">Day 3: Move South—But Make the Journey Part of the Trip</h3>
        <p>
          Most people think of changing accommodation as a day that's simply lost to travel. It doesn't have to be.
        </p>
        <p>
          Instead of checking out late and driving directly to your next villa, leave North Goa after breakfast and take your time heading south. This is the perfect opportunity to stop in Panjim for a heritage walk through Fontainhas, browse the local markets for spices, cashews or traditional Goan products, and enjoy lunch before continuing your journey. If your route takes you through Margao, consider spending an hour exploring one of Goa's oldest markets, where everyday life feels very different from the beach towns further north.
        </p>

        <div className="my-8">
          <img
            src="/blog/goa-itinerary-fontainhas-villa.webp"
            alt="A traveler walking down a historic street in Fontainhas, Panjim, lined with colorful Portuguese villas"
            className="w-full rounded-2xl border border-border object-cover aspect-video"
            loading="lazy"
          />
        </div>

        <p>
          By the time you arrive in South Goa during the afternoon, the atmosphere changes almost immediately.
        </p>
        <p className="font-medium text-foreground italic pl-4 border-l-2 border-ember">
          The roads become quieter. The beaches grow wider. The crowds begin to disappear.
        </p>
        <p>
          Instead of planning another sightseeing stop, spend the rest of the evening settling into your new surroundings. Walk down to the beach, watch the sunset and enjoy dinner close to where you're staying.
        </p>
        <p className="font-semibold text-foreground">
          The contrast is exactly what makes a split stay so memorable.
        </p>

        {/* Days 4 & 5 */}
        <h3 className="font-display text-xl font-bold text-foreground mt-8">Days 4 & 5: Experience the Slower Side of Goa</h3>
        <p>
          South Goa rewards a completely different pace.
        </p>
        <p>
          There's no need to wake up early just to beat the crowds or rush between attractions before traffic builds up. Days here are better spent enjoying long breakfasts, quiet beaches, seafood lunches and evenings that end with little more than a walk along the shoreline.
        </p>
        <p>
          Palolem, Agonda, Colva and Benaulim each offer their own personality, but they all share something in common—they encourage you to slow down. Rather than trying to visit every beach in the area, choose one or two and allow yourself to spend an entire afternoon there. If you're looking for something beyond the coastline, this is also a great time to explore backwaters, take a kayaking trip or simply enjoy the facilities at your villa without feeling guilty that you're &quot;missing out.&quot;
        </p>
        <p>
          By the final evening, you'll understand why so many people recommend staying in both regions instead of choosing just one.
        </p>
        <p className="font-semibold text-foreground text-center my-4">
          North Goa gives you energy. South Goa gives you space to breathe.
        </p>
        <p>
          Together, they create the kind of trip that feels complete without ever feeling rushed.
        </p>
        <p>
          One question still remains, though: what if you have an entire week?
        </p>
        <p>
          That's when Goa changes from a beach holiday into something much deeper. Seven days give you enough time to explore not just the famous coastline, but also the heritage neighbourhoods, local bakeries, hidden villages and quieter experiences that many visitors never discover.
        </p>
      </div>

      {/* 7-Day Itinerary */}
      <div className="space-y-6 mt-12 border-t border-border pt-10">
        <h2 className="font-display text-2xl text-foreground">The 7-Day Goa Itinerary: Experience Goa Beyond the Tourist Trail</h2>
        <p>
          A week in Goa changes the way you travel.
        </p>
        <p>
          The pressure to fit everything into a few days disappears, and with it comes the freedom to experience the state at a much slower pace. Instead of planning every hour, you can finally leave space for spontaneous detours, longer conversations, lazy afternoons by the pool and places that never make it into typical &quot;Top 10 Things to Do&quot; lists.
        </p>
        <p className="font-semibold text-foreground text-center my-4">
          That's why seven days isn't simply a longer holiday. It's a different kind of holiday altogether.
        </p>
        <p>
          The first five days can follow the same itinerary we've already covered, allowing you to experience both North and South Goa without rushing between them. Once you've settled into that rhythm, the final two days become an opportunity to discover the side of Goa that many visitors miss entirely.
        </p>
        <p>
          Rather than chasing another famous beach, spend one day exploring Goa's cultural and culinary heritage. Begin the morning with fresh bread from a neighbourhood bakery in Panjim, wander through the colourful streets of Fontainhas before the crowds arrive and stop for a long lunch at a family-run restaurant serving traditional Goan food. It's the kind of day that reminds you Goa is much more than its coastline, and one that naturally connects with our guides on <Link to="/blog/goa-food-guide" className="text-ember hover:underline">What to Eat in Goa</Link>, <Link to="/blog/goa-markets-guide" className="text-ember hover:underline">Goa Markets</Link> and <Link to="/blog/goa-work-cafes-guide" className="text-ember hover:underline">Best Cafés in Goa</Link> if you want to explore those experiences in more depth.
        </p>
        <p>
          The following day is best left intentionally open.
        </p>
        <p>
          That might sound unusual in an itinerary guide, but it's one of the biggest lessons experienced travellers share after visiting Goa. Instead of filling every hour with attractions, use the extra time to return to your favourite beach, spend an afternoon by the pool, book a kayaking session through the backwaters, visit a spice plantation or simply enjoy a long seafood lunch overlooking the Arabian Sea. Those quieter experiences often become the moments people remember long after they've forgotten the names of the beaches they visited.
        </p>
        <p>
          Having a full week also gives you the flexibility to explore places that rarely fit into shorter holidays. Beaches like Cola or Galgibaga, peaceful villages away from the main tourist belt and inland experiences such as spice plantations or island excursions become realistic options because you're no longer trying to squeeze them between airport transfers and hotel check-ins. They aren't essential for a first trip, but they're exactly the kind of places that make a second visit to Goa feel completely different from the first.
        </p>
        <p>
          Perhaps the biggest advantage of staying for seven days, however, has nothing to do with seeing more attractions.
        </p>
        <p className="font-semibold text-foreground text-center my-4">
          It's having the confidence to skip them.
        </p>
        <p>
          By the end of a week, you'll probably stop checking maps every hour. You'll return to the same café because the coffee was excellent, choose a beach because you liked it yesterday rather than because it appeared on someone's list and spend an evening watching the sunset without wondering whether there's somewhere &quot;better&quot; you should be.
        </p>
        <p>
          That's when people usually say they've experienced the real Goa. Not because they covered more ground, but because they finally stopped trying to.
        </p>
      </div>

      {/* Which Itinerary block */}
      <div className="space-y-6 mt-12 border-t border-border pt-10">
        <h2 className="font-display text-2xl text-foreground">So, Which Itinerary Should You Choose?</h2>
        <p>
          By now, you've probably realised there isn't one perfect Goa itinerary. The right one depends entirely on the time you have and the kind of holiday you're looking for.
        </p>
        <p>
          If you're visiting for a long weekend, three days are enough—as long as you stay in one region and resist the temptation to cross the state every day.
        </p>
        <p>
          If this is your first proper holiday in Goa, five days strike the best balance, giving you enough time to enjoy both North and South Goa without turning the trip into a race between attractions.
        </p>
        <p>
          And if you're lucky enough to have seven days, don't use them to add more destinations. Use them to slow down. That's when Goa begins to feel less like a place you're visiting and more like somewhere you're temporarily living.
        </p>
      </div>

      {/* Planning your stay */}
      <div className="space-y-6 mt-12 border-t border-border pt-10">
        <h2 className="font-display text-2xl text-foreground">Planning Your Trip Around the Right Place to Stay</h2>
        <p>
          One of the easiest ways to make any Goa itinerary feel better has nothing to do with adding more attractions. It comes down to choosing the right base.
        </p>
        <p>
          Many travellers book accommodation first and only start planning their itinerary afterwards. That's usually when they realise their favourite cafés are forty minutes away, the beaches they wanted to visit are on the opposite side of the state or they're spending more time in traffic than they expected.
        </p>
        <p className="font-semibold text-foreground text-center my-4">
          Planning those two things together almost always leads to a smoother trip.
        </p>
        <p>
          If you're following the three-day itinerary, staying in North Goa is the most practical option. Areas like Assagao, Anjuna, Vagator, Morjim and Mandrem give you easy access to cafés, beaches, restaurants and nightlife without needing long drives every day. You can comfortably spend the entire holiday exploring nearby villages while still experiencing many of the places that make North Goa so popular.
        </p>
        <p>
          The five-day itinerary works differently. Since you're already splitting your time between North and South Goa, it makes sense to split your accommodation as well. Spending the first two nights around Assagao or Anjuna before moving to Palolem, Agonda, Benaulim or Colva lets you experience two completely different sides of Goa without wasting valuable holiday time commuting between them.
        </p>
        <p>
          If you're staying for seven days or longer, flexibility becomes your biggest advantage. You don't need to fill every day with sightseeing, which means choosing a comfortable villa or homestay becomes just as important as choosing the attractions themselves. A home with a good workspace, a private pool, a fully equipped kitchen or simply enough outdoor space to relax often ends up improving the trip far more than adding another destination to the itinerary.
        </p>
        <p>
          If you're still deciding where to base yourself, our guides on <Link to="/blog/north-goa-vs-south-goa-guide" className="text-ember hover:underline">North Goa vs South Goa</Link>, <Link to="/blog/goa-beaches-guide" className="text-ember hover:underline">Best Beaches in Goa</Link>, <Link to="/blog/goa-work-cafes-guide" className="text-ember hover:underline">Best Cafés in Goa</Link> and <Link to="/blog/goa-markets-guide" className="text-ember hover:underline">Goa Markets</Link> will help you understand which neighbourhood best matches the kind of holiday you're planning.
        </p>

        <h3 className="font-display text-lg text-foreground mt-8">Finding the Right Stay Can Completely Change Your Trip</h3>
        <p>
          A great itinerary isn't about squeezing the maximum number of places into a few days. It's about reducing the number of decisions you have to make once you arrive.
        </p>
        <p>
          When your accommodation is close to the beaches you want to visit, the cafés you've bookmarked and the restaurants you've been looking forward to trying, every day becomes simpler. You spend less time checking maps, less time sitting in traffic and more time actually enjoying Goa.
        </p>
        <p>
          That's exactly why we built Wayzyy.
        </p>
        <p>
          Instead of showing thousands of identical listings, Wayzyy focuses on helping travellers discover verified villas and homestays in the neighbourhoods that best match the trip they're planning. Whether you're looking for a quiet villa near Mandrem, a stay close to Assagao's café scene, a family-friendly home in South Goa or somewhere that makes a workation genuinely comfortable, choosing the right location is often more valuable than choosing the most expensive property.
        </p>
        <p>
          Because Wayzyy works directly with verified local hosts, travellers can often find stays at prices that are up to 20% lower than many larger booking platforms, while enjoying more space, better local recommendations and a much more personal experience.
        </p>
      </div>

      {/* Final Thoughts */}
      <div className="space-y-6 mt-12">
        <h2 className="font-display text-2xl text-foreground">Final Thoughts</h2>
        <p>
          There isn't a perfect Goa itinerary. There probably never will be.
        </p>
        <p>
          Every traveller experiences the state a little differently, and that's exactly what makes Goa so special. Some people spend their mornings discovering cafés, others chase sunsets along the coast, while many simply find a quiet beach and never feel the need to leave.
        </p>
        <p>
          Whether you have three days, five days or an entire week, the goal shouldn't be to cover as much ground as possible.
        </p>
        <p className="font-semibold text-foreground text-center my-4">
          Travel a little slower. Leave room for unexpected discoveries.
        </p>
        <p>
          Spend an extra hour at the café you love instead of driving to another one just because it's famous. Those are the moments you'll remember long after you've forgotten the order in which you visited the beaches.
        </p>
        <p>
          Goa isn't a destination to complete. It's one you'll almost certainly want to return to.
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
            <Link to="/blog/goa-beaches-guide" className="text-ember hover:underline block font-semibold mb-1">Goa Beaches Guide</Link>
            <p className="text-xs text-muted-foreground leading-relaxed">Find which beach fits your travel style for swimming, digital nomads, or families.</p>
          </div>
          <div>
            <Link to="/blog/goa-food-guide" className="text-ember hover:underline block font-semibold mb-1">Traditional Goan Food</Link>
            <p className="text-xs text-muted-foreground leading-relaxed">Discover Saraswat vegetarian cuisine, fish thalis, and local eateries.</p>
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
