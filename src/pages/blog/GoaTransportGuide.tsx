import { BlogLayout } from "@/components/BlogLayout";
import { blogPosts } from "@/lib/blogPosts";
import { Link } from "react-router-dom";
import { HelpCircle, Car, Bike, ShieldCheck, Compass } from "lucide-react";
import { useState } from "react";

const post = blogPosts.find((p) => p.slug === "goa-transport-guide")!;

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      "name": "Is renting a scooter in Goa worth it?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, for most solo travellers and couples, renting a scooter is the most convenient way to explore Goa. It's affordable, easy to park and gives you the flexibility to visit beaches, cafés and smaller villages at your own pace."
      }
    },
    {
      "@type": "Question",
      "name": "How much does it cost to rent a scooter in Goa?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Scooter rental prices usually depend on the season, rental duration and vehicle model. Daily rates are generally lower for longer bookings, while peak tourist months often see higher prices than the monsoon season."
      }
    },
    {
      "@type": "Question",
      "name": "Can tourists rent a scooter in Goa?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. Indian and international tourists can rent scooters in Goa, provided they carry a valid driving licence. International visitors should also check whether they require an International Driving Permit based on their country of residence."
      }
    },
    {
      "@type": "Question",
      "name": "Is a self-drive car better than a scooter in Goa?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "A self-drive car is often a better choice for families, groups, monsoon travel and longer road trips across North and South Goa. Scooters remain the preferred option for shorter distances and flexible sightseeing."
      }
    },
    {
      "@type": "Question",
      "name": "Does Uber or Ola work in Goa?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Uber and Ola do not operate in Goa in the same way they do in most Indian cities. Travellers generally rely on GoaMiles, prepaid airport taxis, private taxi operators or rented vehicles for transportation."
      }
    },
    {
      "@type": "Question",
      "name": "What is GoaMiles?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "GoaMiles is Goa's app-based taxi service that allows travellers to book taxis through a mobile application with transparent pricing and digital payments."
      }
    },
    {
      "@type": "Question",
      "name": "Which airport should I choose for North Goa?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Mopa International Airport (GOX) is generally the better option for travellers staying in North Goa, including areas like Morjim, Vagator, Anjuna, Candolim and Assagao."
      }
    },
    {
      "@type": "Question",
      "name": "Which airport is better for South Goa?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Dabolim Airport (GOI) is usually the most convenient airport for travellers heading to Palolem, Agonda, Colva, Benaulim and other parts of South Goa."
      }
    },
    {
      "@type": "Question",
      "name": "Is public transport good in Goa?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Goa's public buses are an economical way to travel between major towns such as Panjim, Mapusa, Margao and Vasco. They're best suited for budget travellers, while scooters, self-drive cars and taxis provide greater flexibility for sightseeing."
      }
    },
    {
      "@type": "Question",
      "name": "Is it safe to drive in Goa?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Driving in Goa is generally safe if you follow traffic rules, wear a helmet while riding a scooter and drive carefully on narrow village roads. Extra caution is recommended during the monsoon when heavy rain can reduce visibility and make roads slippery."
      }
    },
    {
      "@type": "Question",
      "name": "Can foreigners drive in Goa?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, foreign visitors can drive in Goa if they carry a valid driving licence and, where required, an International Driving Permit. Rental companies may also request passport and visa details during the booking process."
      }
    },
    {
      "@type": "Question",
      "name": "What is the cheapest way to travel around Goa?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "For most travellers, public buses are the cheapest mode of transport. However, if you're planning to explore multiple beaches and attractions in a day, renting a scooter often offers the best balance between cost, flexibility and convenience."
      }
    }
  ]
};

export default function GoaTransportGuide() {
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
      heroImageAlt="A classic yellow scooter parked along a winding scenic palm-lined road in Goa"
      publishedDate={post.publishedDate}
      slug={post.slug}
      extraJsonLd={faqJsonLd}
    >
      {/* Introduction */}
      <div className="space-y-6">
        <h2 className="font-display text-2xl text-foreground mt-8">Getting Around Goa: The Complete Transport Guide (2026)</h2>
        <p>
          Planning a trip to Goa usually starts with choosing the right beaches, cafés or places to stay. Then, just a few days before the trip, almost everyone runs into the same question:
        </p>
        <p className="font-semibold text-foreground text-lg italic text-center py-2">
          &quot;How do we actually get around once we land?&quot;
        </p>
        <p>
          At first, the answer seems obvious. You'll probably assume you can book an Uber from the airport, rent a scooter near your hotel and figure everything else out later. That's exactly how transport works in most Indian cities.
        </p>
        <p className="font-semibold text-ember text-center">
          Goa is different.
        </p>
        <p>
          In fact, transport is one of the biggest reasons first-time visitors end up spending far more money than they expected or wasting hours trying to move between places. The state doesn't have a metro, ride-hailing apps don't work the way most people expect, public transport is limited outside major routes and where you choose to stay has a direct impact on how much you'll spend getting around every day.
        </p>
        <p>
          A traveller staying in Candolim can comfortably walk to restaurants, cafés and beaches before hiring a scooter for a day trip. Someone booking a beautiful villa near Agonda without a vehicle, on the other hand, may discover that every taxi ride costs more than an entire day's scooter rental. Those aren't obvious mistakes until you're already in Goa, and they're exactly why transport deserves its own planning guide.
        </p>
        <p>
          The good news is that getting around Goa isn't difficult once you understand how the system works. The trick is choosing the right option for your trip rather than assuming one solution fits everyone.
        </p>
        <p>
          A solo traveller hopping between cafés in Assagao has very different transport needs from a family staying in South Goa for a week. A couple visiting during the monsoon should plan differently from a group of friends arriving in December. Even the airport you fly into - Mopa (GOX) or Dabolim (GOI) - can easily add an extra two hours to your journey if you book accommodation in the wrong part of the state.
        </p>

        <p className="font-semibold text-foreground">
          In this guide, we'll break down every major way to travel around Goa:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>When renting a scooter is the smartest choice - and when it isn't.</li>
          <li>Whether a self-drive car is worth the extra money.</li>
          <li>How GoaMiles compares with traditional taxis.</li>
          <li>Airport transfers from both GOX and GOI.</li>
          <li>Public buses, motorcycle taxis and local transport.</li>
          <li>Driving rules, parking tips and the mistakes that catch tourists every season.</li>
          <li>How to choose transport based on your itinerary, budget and where you're staying.</li>
        </ul>

        <p>
          Along the way, we'll also answer questions that travellers repeatedly search before visiting Goa:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-muted-foreground text-sm">
          <li>Does Uber work in Goa?</li>
          <li>Is renting a scooter safe?</li>
          <li>How much does a taxi from Goa Airport actually cost?</li>
          <li>Should you choose a scooter or a car?</li>
          <li>Can foreigners legally rent vehicles in Goa?</li>
        </ul>

        <p>
          If you've already read our guides on the <Link to="/blog/goa-beaches-guide" className="text-ember hover:underline">Best Beaches in Goa</Link>, <Link to="/blog/goa-itinerary-guide" className="text-ember hover:underline">Goa Itinerary</Link>, <Link to="/blog/north-goa-vs-south-goa-guide" className="text-ember hover:underline">North vs South Goa</Link> or <Link to="/blog/where-to-stay-in-goa" className="text-ember hover:underline">Where to Stay in Goa</Link>, think of this as the missing piece that connects everything together. After all, even the perfect itinerary falls apart if you underestimate how long it takes to travel across Goa or choose the wrong way to get around.
        </p>
        <p>
          So before comparing scooter rentals, taxis and self-drive cars, there's one important thing every first-time visitor should understand:
        </p>
        <p className="font-medium text-foreground text-center italic py-2">
          Goa's transport system doesn't work like Mumbai, Bengaluru or Delhi - and that's where most planning mistakes begin.
        </p>
      </div>

      {/* Which option section */}
      <div className="space-y-6 mt-12 border-t border-border pt-10">
        <h2 className="font-display text-2xl text-foreground">Which Transport Option Should You Choose?</h2>
        <p>
          By now, you've probably realised that there isn't a universally &quot;best&quot; way to travel around Goa.
        </p>
        <p>
          The right choice depends entirely on the holiday you're planning. Someone spending a month working remotely has very different priorities from a couple visiting for a long weekend, and a family exploring South Goa will naturally travel differently from a group of friends staying around Vagator or Anjuna.
        </p>

        {/* Solo / Couples */}
        <h3 className="font-display text-lg text-foreground mt-8">Travelling Solo or as a Couple?</h3>
        <p>
          Renting a scooter is usually the easiest option. It gives you complete freedom to stop wherever you like, whether that's an empty beach, a roadside bakery or a café you discovered while driving through Assagao. Parking is rarely a concern, fuel costs remain low and the flexibility is difficult to match with any other form of transport. Unless you're travelling during heavy monsoon rains or carrying significant luggage, a scooter is often all you need. Check safety guidelines in our dedicated <Link to="/blog/goa-scooter-rental-guide" className="text-ember hover:underline">Scooter Rental Guide</Link>.
        </p>

        {/* Families */}
        <h3 className="font-display text-lg text-foreground mt-8 font-semibold">Bringing the Family?</h3>
        <p>
          Families generally have a different experience. Children, parents, shopping bags and luggage quickly make scooters impractical, particularly when you're travelling between North and South Goa. A self-drive car provides considerably more comfort, keeps everyone together and makes longer journeys far less tiring. Although the daily rental cost is higher, many families find the additional convenience more than justifies the extra expense over the course of a week.
        </p>

        <div className="my-8">
          <img
            src="/blog/goa-transport-car-rental.webp"
            alt="A white modern self-drive rental hatchback car parked beside a palm-fringed beach in Goa"
            className="w-full rounded-2xl border border-border object-cover aspect-video"
            loading="lazy"
          />
        </div>

        {/* Friends groups */}
        <h3 className="font-display text-lg text-foreground mt-8">Groups of Friends?</h3>
        <p>
          Groups of friends usually fall somewhere in the middle. For short trips centred around North Goa, renting multiple scooters often works out to be both cheaper and more enjoyable than booking taxis throughout the day. Larger groups travelling together, however, may find that hiring a spacious self-drive vehicle or pre-booking airport transfers removes the hassle of coordinating several scooters every time they head out.
        </p>

        {/* Remote Workers */}
        <h3 className="font-display text-lg text-foreground mt-8">Remote Workers & Nomads?</h3>
        <p>
          Remote workers and long-term visitors should think slightly differently. Once you're staying for several weeks, transport becomes part of your daily routine rather than something you use only for sightseeing. Many digital nomads rent a scooter or car on a monthly basis, allowing them to comfortably travel between cafés, coworking spaces, supermarkets and nearby beaches without depending on expensive taxi rides every day.
        </p>
        <p>
          That's one reason choosing the right neighbourhood becomes so important. Staying close to the places you visit regularly can dramatically reduce both transport costs and travel time.
        </p>

        {/* Budget */}
        <h3 className="font-display text-lg text-foreground mt-8 font-semibold">Travelling on a Budget?</h3>
        <p>
          Budget travellers don't necessarily need to rent anything at all. If your plans revolve around a few major towns and you're happy travelling at a slower pace, combining Kadamba buses with the occasional taxi can be remarkably affordable. It won't provide the same flexibility as driving yourself, but it does allow you to experience Goa without spending a large part of your budget on transport.
        </p>
        <p className="font-semibold text-foreground text-center my-4">
          Choosing accommodation in the right part of Goa often saves more time and money than choosing the perfect vehicle.
        </p>
        <p>
          A villa within ten minutes of your favourite cafés, beaches and restaurants naturally reduces how much you'll spend on transport throughout the trip. That's why we always recommend planning your accommodation and transport together rather than treating them as separate decisions.
        </p>
      </div>

      {/* Location matches */}
      <div className="space-y-6 mt-12 border-t border-border pt-10">
        <h2 className="font-display text-2xl text-foreground">The Best Way to Save on Transport? Stay in the Right Location.</h2>
        <p>
          Most travellers spend hours comparing scooter rental prices, looking for cheaper taxis or wondering whether they should rent a car instead. Very few ask a much more important question:
        </p>
        <p className="font-semibold text-foreground text-lg italic text-center py-2">
          &quot;Am I staying in the right part of Goa?&quot;
        </p>
        <p>
          The answer to that single question often has a bigger impact on your transport budget than anything else.
        </p>
        <p>
          Think about it for a moment. If you've booked a villa in Assagao, most of North Goa's best cafés, restaurants, beaches and boutique stores are only a short drive away. A scooter is usually enough for the entire holiday because you're rarely travelling long distances. Spend the same week in South Goa while planning to visit North Goa every day, however, and you'll quickly realise that no transport option feels convenient. Hours disappear on the road, fuel costs increase and what looked like a relaxing holiday slowly starts revolving around travel instead of experiences.
        </p>
        <p>
          That's why we always recommend planning your stay and your transport together.
        </p>
        <p>
          The right neighbourhood naturally reduces how much you'll spend on taxis, how often you'll need to refuel a scooter and even how time you'll spend sitting in traffic. It also makes spontaneous plans much easier. Instead of thinking twice about driving forty-five minutes for breakfast, you'll already be staying close to the places you wanted to explore in the first place.
        </p>
        <p>
          That's exactly the idea behind Wayzyy.
        </p>
        <p>
          Rather than overwhelming travellers with thousands of listings across Goa, Wayzyy helps you discover verified villas and homestays in locations that actually match the kind of trip you're planning. If your itinerary is built around North Goa's cafés and nightlife, it makes sense to stay there. Planning a peaceful week around Agonda or Palolem? Your accommodation should reflect that instead of forcing long daily drives across the state.
        </p>
        <p>
          Working directly with local hosts also means you'll often discover stays that aren't just competitively priced, but also come with practical advice that booking platforms rarely provide. Hosts can recommend trusted scooter rental companies, reliable taxi drivers, nearby fuel stations, the best routes to avoid peak traffic and even which cafés or beaches are easiest to reach without spending half the day travelling.
        </p>
        <p className="font-semibold text-foreground text-center my-4">
          Transport becomes much simpler when your accommodation is chosen with your itinerary in mind.
        </p>
        <p>
          Instead of trying to solve the problem after landing in Goa, you start your trip from the right location. And that's usually the smartest transport decision you'll make.
        </p>
      </div>

      {/* Final thoughts */}
      <div className="space-y-6 mt-12">
        <h2 className="font-display text-2xl text-foreground">Final Thoughts</h2>
        <p>
          Getting around Goa isn't difficult. It just isn't the same as getting around most Indian cities.
        </p>
        <p>
          Visitors who understand that before they arrive almost always have a smoother holiday. They choose the right airport, stay in the right neighbourhood, rent the right vehicle for their itinerary and avoid spending unnecessary money on transport they never really needed.
        </p>
        <p>
          Whether you decide to explore Goa on a scooter, drive a self-drive car, rely on GoaMiles or mix buses with taxis, none of those options is universally better than the others. The best choice is simply the one that matches the holiday you've planned.
        </p>
        <p className="font-semibold text-foreground text-center my-4">
          Plan your itinerary first. Choose the right part of Goa to stay. Then pick the transport that complements those decisions instead of working against them.
        </p>
        <p>
          That's the approach experienced travellers follow - and it's usually what turns a good Goa trip into a great one.
        </p>
      </div>

      {/* Interlinks */}
      <div className="mt-16 rounded-2xl border border-border bg-card/60 p-6 sm:p-8">
        <h3 className="font-display text-xl font-semibold text-foreground mb-4">
          Also Worth Reading
        </h3>
        <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
          Before finalising your Goan transport, check out these related travel guides:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-sm">
          <div>
            <Link to="/blog/goa-scooter-rental-guide" className="text-ember hover:underline block font-semibold mb-1">Scooter Rental Guide</Link>
            <p className="text-xs text-muted-foreground leading-relaxed">A complete manual to rates, scams, licenses, and helmet rules in Goa.</p>
          </div>
          <div>
            <Link to="/blog/where-to-stay-in-goa" className="text-ember hover:underline block font-semibold mb-1">Where to Stay in Goa</Link>
            <p className="text-xs text-muted-foreground leading-relaxed">Understand the geography of neighborhoods to match your transport choices.</p>
          </div>
          <div>
            <Link to="/blog/goa-trip-budget-guide" className="text-ember hover:underline block font-semibold mb-1">Goa Trip Budget Guide</Link>
            <p className="text-xs text-muted-foreground leading-relaxed">Factor in airport transfers, rental fuel, and taxi costs into your daily budget.</p>
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
