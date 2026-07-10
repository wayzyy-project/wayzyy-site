import { BlogLayout } from "@/components/BlogLayout";
import { blogPosts } from "@/lib/blogPosts";
import { Link } from "react-router-dom";
import { HelpCircle, Waves, Compass, Shield, User } from "lucide-react";
import { useState } from "react";

const post = blogPosts.find((p) => p.slug === "goa-beaches-guide")!;

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      "name": "Which is the best beach for swimming in Goa?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Palolem is widely considered one of the best and safest beaches for casual swimming in Goa. Its crescent-shaped bay naturally cushions the shore from stronger currents, offering calmer waters when lifeguards declare it safe."
      }
    },
    {
      "@type": "Question",
      "name": "Are Goa's beaches safe for swimming?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Not all beaches are safe. Beaches monitored by Drishti Marine use colored flags: green means safe, yellow means caution, and red indicates strictly no swimming. Rocky beaches like Anjuna and Vagator can have highly unpredictable currents."
      }
    },
    {
      "@type": "Question",
      "name": "Which beaches in Goa are best for families?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Colva, Benaulim, and Candolim are excellent choices for families. They feature broad sandy shores, wide parking zones, active lifeguard patrols, and a welcoming atmosphere without loud club music."
      }
    },
    {
      "@type": "Question",
      "name": "Where should remote workers stay near the beach in Goa?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Digital nomads typically prefer Mandrem, Morjim, and Ashwem in the North. These areas host several work-friendly cafes and boutique stays, offering a perfect blend of high-speed WiFi and calm seaside living."
      }
    },
    {
      "@type": "Question",
      "name": "Which Goa beaches are pet-friendly?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Morjim, Ashwem, and Mandrem are highly popular for travelers with pets. Their expansive coastlines are perfect for morning walks, and many local beachside cafes welcome dogs."
      }
    },
    {
      "@type": "Question",
      "name": "Where can I learn surfing in Goa?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Arambol is the primary hotspot for surfing lessons and board rentals during the dry season, thanks to its regular gentle wave breaks."
      }
    },
    {
      "@type": "Question",
      "name": "Are water sports available on all beaches in Goa?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Water sports like parasailing and jet skiing are concentrated on active beaches such as Calangute, Baga, Candolim, and Colva, rather than quieter conservation zones."
      }
    },
    {
      "@type": "Question",
      "name": "Is South Goa better than North Goa for quiet beaches?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, South Goa beaches like Agonda and Palolem offer a much slower pace of life, with soft acoustic music, scenic walks, and fewer commercial crowds than the North."
      }
    },
    {
      "@type": "Question",
      "name": "What is Drishti Marine in Goa?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Drishti Marine is the state's official lifeguard and beach safety organization that patrols Goa's coastline and updates safety flags daily."
      }
    },
    {
      "@type": "Question",
      "name": "Do beach shacks close during the monsoon?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. Most seasonal wooden shacks are completely dismantled between late May and October. However, permanent indoor cafes and restaurants remain open nearby."
      }
    }
  ]
};

export default function GoaBeachesGuide() {
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
      heroImageAlt="Beautiful palm-fringed huts along Palolem Beach in South Goa at sunset"
      publishedDate={post.publishedDate}
      slug={post.slug}
      extraJsonLd={faqJsonLd}
    >
      {/* Introduction */}
      <div className="space-y-6">
        <h2 className="font-display text-2xl text-foreground mt-8">Planning to Swim? The Beach You Choose Matters More Than You Think</h2>
        <p>
          One assumption catches first-time visitors by surprise every season.
        </p>
        <p className="font-semibold text-foreground text-lg italic text-center py-2">
          Just because a beach looks calm doesn't necessarily mean it's safe to swim.
        </p>
        <p>
          The Arabian Sea changes constantly with the tides, underwater currents and seasonal weather. A stretch of water that feels perfectly safe in the morning can become much stronger later in the day, particularly during the monsoon months. That's why experienced travellers don't judge a beach by its photographs—they look for lifeguard zones and the safety flags before stepping into the water.
        </p>
        <p>
          Goa's beaches are monitored by Drishti Marine, the state's official lifeguard service. If you notice green flags, conditions are generally considered suitable for swimming within the designated area. Yellow flags indicate that extra caution is required, while red flags mean entering the water is unsafe. Ignoring these warnings is one of the most common mistakes visitors make, especially during the rainy season when sea conditions can change very quickly.
        </p>
        <p>
          With that in mind, some beaches are naturally better suited to swimming than others.
        </p>
      </div>

      {/* Swimming Beach Analysis */}
      <div className="space-y-8 mt-12">
        {/* Palolem */}
        <div className="border-l-4 border-ember pl-6 space-y-3">
          <h3 className="font-display text-xl font-bold text-foreground">Palolem — One of the Best Beaches for Casual Swimming</h3>
          <p>
            Palolem has earned its reputation for more than just its scenery.
          </p>
          <p>
            The gently curving bay helps reduce stronger waves compared to many exposed beaches, making it one of the more comfortable places for casual swimmers when lifeguards indicate that conditions are safe. Families, couples and first-time visitors often feel more confident here because the water usually remains calmer close to the designated swimming areas.
          </p>
          <p>
            Like every beach in Goa, though, conditions should always be checked on the day rather than assumed.
          </p>
          <span className="text-xs font-semibold text-ember uppercase block">Choose Palolem if: swimming is one of the main reasons you're visiting South Goa.</span>
        </div>

        <div className="my-8">
          <img
            src="/blog/goa-south-beach.webp"
            alt="Pristine white sand beach lined with leaning coconut palms in South Goa"
            className="w-full rounded-2xl border border-border object-cover aspect-video"
            loading="lazy"
          />
        </div>

        {/* Colva & Benaulim */}
        <div className="border-l-4 border-ember pl-6 space-y-3">
          <h3 className="font-display text-xl font-bold text-foreground">Colva and Benaulim — Great Choices for Families</h3>
          <p>
            Families often prioritise completely different things from other travellers.
          </p>
          <p>
            Easy beach access, wider shorelines, nearby facilities and clearly marked lifeguard zones usually matter far more than nightlife or beach clubs. Colva and neighbouring Benaulim consistently meet those expectations, making them popular among visitors travelling with children or elderly family members.
          </p>
          <p>
            The beaches are broad, facilities are easy to find and the atmosphere remains welcoming without feeling overwhelming.
          </p>
          <span className="text-xs font-semibold text-ember uppercase block">Choose Colva or Benaulim if: you're travelling with children or older parents and want a comfortable beach day.</span>
        </div>

        {/* Morjim & Candolim */}
        <div className="border-l-4 border-ember pl-6 space-y-3">
          <h3 className="font-display text-xl font-bold text-foreground">Morjim and Candolim — A Comfortable Balance</h3>
          <p>
            Not everyone wants to choose between complete peace and busy tourist beaches.
          </p>
          <p>
            Morjim and Candolim sit comfortably in the middle.
          </p>
          <p>
            Both offer long stretches of sand, good facilities and regular lifeguard presence during the tourist season, while still providing enough restaurants and cafés nearby to spend an entire day in the area. That balance makes them particularly attractive to travellers who enjoy swimming but also want everything else within easy reach.
          </p>
        </div>
      </div>

      {/* Better enjoyed from shore */}
      <div className="space-y-6 mt-12">
        <h2 className="font-display text-2xl text-foreground">Some Beaches Are Better Enjoyed From the Shore</h2>
        <p>
          One of the reasons Goa's beaches feel so different from one another is their coastline.
        </p>
        <p>
          Places like Anjuna and parts of Vagator are famous for dramatic cliffs, rocky formations and incredible sunset views rather than calm swimming conditions. Those landscapes are exactly what make them beautiful, but they also mean certain stretches of water can become unpredictable, particularly during high tide.
        </p>
        <p>
          The same applies to beaches like Arambol, where changing currents require a little more attention before entering the sea.
        </p>
        <p>
          None of this means you should avoid these beaches. It simply means enjoying them differently.
        </p>
        <p>
          Some beaches are perfect for swimming. Others are better for photography, café hopping, sunset walks or simply sitting with a coffee while watching the waves roll in.
        </p>
        <p className="font-medium text-foreground text-center italic my-4">
          Choosing the right beach becomes much easier once you stop expecting every stretch of coastline to offer the same experience.
        </p>
      </div>

      {/* Practical details */}
      <div className="space-y-6 mt-12 border-t border-border pt-10">
        <h2 className="font-display text-2xl text-foreground">A Few Practical Things Most Beach Guides Never Tell You</h2>
        <p>
          Choosing a beach isn't only about the view. Small practical details often end up having a much bigger impact on your day.
        </p>
        <p>
          Planning to drive? Some beaches have large organised parking areas, while others involve narrow village roads where finding a space becomes difficult by late morning. Visiting during the monsoon? Many seasonal beach shacks are dismantled, meaning facilities like changing rooms, showers and restaurants may not be available. Working remotely? Mobile network quality can vary surprisingly between beaches, making areas like Mandrem and more remote stretches worth checking before planning a workday by the sea.
        </p>
        <p>
          These aren't the details that usually appear in glossy travel guides. They're the things people search for after arriving in Goa—or wish they'd known before booking their stay.
        </p>
        <p>
          That's also why choosing the right beach isn't simply about where you'll spend a few hours. It's about choosing the area that best fits the way you want to experience Goa.
        </p>
      </div>

      {/* Beach style match */}
      <div className="space-y-6 mt-12">
        <h2 className="font-display text-2xl text-foreground">Which Beach Fits Your Travel Style?</h2>
        <p>
          By now, you've probably realised something: the &quot;best&quot; beach in Goa doesn't really exist.
        </p>
        <p>
          Every beach has its own personality, and once you know what kind of trip you're planning, the right choice becomes much easier. Rather than comparing beaches against each other, think about the experience you want to take home.
        </p>
        <p>
          Here's where we'd send different kinds of travellers.
        </p>

        {/* Couples */}
        <h3 className="font-display text-lg text-foreground mt-8">Travelling as a Couple? ❤️</h3>
        <p>
          Some holidays are built around doing as little as possible together.
        </p>
        <p>
          If you're picturing quiet breakfasts, slow beach walks, sunset dinners and mornings without crowds, Agonda, Palolem, Ashwem and Mandrem are difficult to beat. These beaches naturally encourage a slower pace, and many of the boutique stays, cafés and restaurants nearby are designed around exactly that atmosphere.
        </p>
        <p>
          Couples looking for livelier evenings without giving up beautiful sunsets often find Vagator a better fit, where beach time easily transitions into great restaurants and cocktail bars after dark.
        </p>

        {/* Families */}
        <h3 className="font-display text-lg text-foreground mt-8">Bringing the Family? 👨‍👩‍👧‍👦</h3>
        <p>
          Families usually appreciate practicality more than anything else.
        </p>
        <p>
          Easy parking, lifeguards, nearby restaurants, clean facilities and enough space for children to play often matter far more than trendy cafés or nightlife.
        </p>
        <p>
          That's where beaches like Colva, Benaulim, Candolim and Palolem stand out. They offer comfortable access, plenty of facilities and a more relaxed atmosphere, making it easier to spend an entire day without constantly moving from one place to another.
        </p>

        {/* Nomads */}
        <h3 className="font-display text-lg text-foreground mt-8">Planning a Workation? 💻</h3>
        <p>
          Remote workers often discover that the beach itself is only a small part of the decision.
        </p>
        <p>
          Reliable internet, nearby cafés, comfortable accommodation, scooter access and good restaurants quickly become just as important as the view. Areas around Morjim, Mandrem, Anjuna and nearby Siolim have gradually become popular among digital nomads because they combine beach life with everything needed for longer stays.
        </p>
        <p>
          You can spend the morning working from a café, take a break by the beach in the afternoon and still have plenty of dining options once the workday ends. Learn more in our comprehensive <Link to="/blog/workation-goa-guide" className="text-ember hover:underline">Workation Guide</Link>.
        </p>

        {/* First Time */}
        <h3 className="font-display text-lg text-foreground mt-8">Visiting Goa for the First Time? 🌴</h3>
        <p>
          First-time visitors often try to fit every famous beach into a three or four-day itinerary. In reality, that usually means spending more time on the road than by the sea.
        </p>
        <p>
          A better approach is to choose one area and explore the beaches nearby. Staying around Anjuna or Vagator gives you easy access to cafés, nightlife, markets and several neighbouring beaches without spending hours travelling. If your priorities are peace and nature instead, basing yourself around Mandrem, Morjim or Agonda usually creates a much more relaxed trip.
        </p>
        <p className="font-semibold text-foreground text-center my-4">
          Goa rewards slow travel far more than rushed itineraries.
        </p>

        {/* Surfers */}
        <h3 className="font-display text-lg text-foreground mt-8">Love Surfing or Water Sports? 🏄</h3>
        <p>
          Not every beach offers the same conditions.
        </p>
        <p>
          Travellers looking to learn surfing often head towards Arambol, where surf schools and board rentals are easy to find during the season. For parasailing, jet skiing, banana rides and other water sports, beaches like Calangute, Baga, Candolim and Colva remain the most active.
        </p>
        <p>
          If your holiday revolves around being in the water rather than simply looking at it, these beaches offer the widest choice of activities.
        </p>

        {/* Pets */}
        <h3 className="font-display text-lg text-foreground mt-8">Travelling With Your Dog? 🐶</h3>
        <p>
          One of the nicest surprises about Goa is how welcoming many beaches and cafés are for pet owners.
        </p>
        <p>
          Long stretches around Morjim, Mandrem and Ashwem tend to feel more comfortable for morning and evening walks with dogs, especially outside peak hours when the beaches are quieter. Pair that with the growing number of pet-friendly cafés in the area, and it's easy to understand why many long-stay travellers with pets choose this part of North Goa.
        </p>

        <div className="my-8">
          <img
            src="/blog/goa-ashwem-beach.webp"
            alt="Beautiful serene view of Ashwem Beach with palm trees and gentle waves"
            className="w-full rounded-2xl border border-border object-cover aspect-video"
            loading="lazy"
          />
        </div>

        {/* Photographers */}
        <h3 className="font-display text-lg text-foreground mt-8">Looking for the Perfect Photograph? 📸</h3>
        <p>
          Some beaches are simply more photogenic than others.
        </p>
        <p>
          For dramatic cliffs and sweeping coastal views, Vagator remains one of Goa's most iconic locations. Palolem offers beautiful curved shorelines that photograph especially well from higher viewpoints, while Ashwem and Mandrem create softer, minimalist landscapes that work beautifully during golden hour. If you're chasing peaceful sunrise shots without large crowds, South Goa's quieter beaches often reward the extra effort.
        </p>

        <h3 className="font-display text-lg text-foreground mt-12">Sometimes the Right Beach Isn't the Most Famous One</h3>
        <p>
          It's easy to assume that the busiest beaches must also be the best. They're usually the ones that appear first on social media, feature in every travel reel and receive the most recommendations from first-time visitors.
        </p>
        <p>
          The reality is often very different.
        </p>
        <p>
          Many repeat travellers gradually stop chasing famous names and instead return to the beaches that simply fit the way they like to travel. Some prefer the energy of Anjuna and Vagator. Others wouldn't trade the quiet mornings of Mandrem or Agonda for anything. Neither choice is more authentic than the other.
        </p>
        <p className="font-semibold text-foreground text-center my-4">
          The best beach is simply the one that feels right for you.
        </p>
      </div>

      {/* Wayzyy Accommodation Decision */}
      <div className="space-y-6 mt-12 border-t border-border pt-10">
        <h2 className="font-display text-2xl text-foreground">One Decision Can Make or Break Your Goa Trip: Where You Stay</h2>
        <p>
          By the time most people book their accommodation, they've already spent hours comparing villas, scrolling through Airbnb listings and checking hotel reviews. Very few stop to ask a much simpler question.
        </p>
        <p className="font-semibold text-foreground text-lg italic text-center py-2">
          Is this actually close to the places I'll spend most of my time?
        </p>
        <p>
          That's where many Goa itineraries quietly fall apart.
        </p>
        <p>
          Someone books a beautiful villa because it has a private pool, only to realise they're driving forty-five minutes every morning to reach the beach they wanted to visit. Another traveller chooses accommodation near a busy tourist area, only to discover they were actually looking for quiet mornings and peaceful evenings. The property wasn't the problem—the location was.
        </p>
        <p>
          A better way to plan your trip is to work backwards: Choose the beach first. Then choose the neighbourhood around it. Everything else becomes much easier.
        </p>
        <p>
          If your perfect day begins with speciality coffee, boutique shopping and sunset cocktails, staying around Anjuna, Vagator or Assagao puts those experiences within minutes of your doorstep. Travellers planning slower mornings, long walks and quieter beaches usually feel more at home around Mandrem, Ashwem or Morjim, while those escaping to South Goa often prefer Palolem, Agonda, Colva or Benaulim for their relaxed atmosphere.
        </p>
        <p>
          The difference might only be a few kilometres on Google Maps, but it completely changes the rhythm of your holiday. Instead of planning every outing around traffic and travel time, you can simply walk to the beach, stop at a café on the way back, return for a swim later in the afternoon and head out again for dinner without thinking twice.
        </p>
        <p>
          That's exactly the philosophy behind Wayzyy.
        </p>
        <p>
          Rather than helping travellers book just another villa, we're building a platform that helps people discover the right part of Goa for the kind of holiday they're planning. Whether you're chasing peaceful beaches, lively neighbourhoods, workation-friendly stays or villas close to the cafés and restaurants you'll actually visit, choosing the right location often has a bigger impact than choosing the property itself.
        </p>
        <p>
          Because Wayzyy works directly with verified local hosts, travellers can often find stays that offer better value than many larger booking platforms while enjoying a more transparent booking experience. As our platform continues expanding across Goa, you'll also be able to explore properties across both North and South Goa, making it easier to stay close to the beaches and experiences that matter most to you.
        </p>
      </div>

      {/* Final Thoughts */}
      <div className="space-y-6 mt-12">
        <h2 className="font-display text-2xl text-foreground">Final Thoughts</h2>
        <p>
          The best beach in Goa isn't the one with the highest Google rating. It isn't the one that appears in the most Instagram reels. It isn't even the one everyone else recommends.
        </p>
        <p>
          The right beach is the one that matches the way you want to spend your time.
        </p>
        <p>
          For some people, that's an energetic afternoon in Anjuna followed by dinner in Assagao and sunset drinks in Vagator. Others are happiest walking along Mandrem at sunrise with nothing planned beyond breakfast at a nearby café. Families often remember the comfort of calmer beaches like Colva and Benaulim, while couples return home talking about peaceful evenings in Agonda or Palolem.
        </p>
        <p>
          None of those experiences are better than the others. They're simply different. That's what makes Goa so special.
        </p>
        <p>
          Every stretch of coastline has its own personality, and discovering the one that feels right for you is often what turns a good holiday into one you'll want to repeat.
        </p>
        <p>
          So before you start pinning every famous beach onto your itinerary, take a moment to think about the kind of memories you actually want to create. Once you answer that question, choosing the right beach becomes surprisingly easy.
        </p>
      </div>

      {/* Interlinks */}
      <div className="mt-16 rounded-2xl border border-border bg-card/60 p-6 sm:p-8">
        <h3 className="font-display text-xl font-semibold text-foreground mb-4">
          Also Worth Reading
        </h3>
        <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
          If you're planning the rest of your Goa itinerary, these guides pair perfectly with this one:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-sm">
          <div>
            <Link to="/blog/where-to-stay-in-goa" className="text-ember hover:underline block font-semibold mb-1">Where Should You Stay in Goa?</Link>
            <p className="text-xs text-muted-foreground leading-relaxed">A complete decision guide to choosing the right neighbourhood based on your travel style.</p>
          </div>
          <div>
            <Link to="/blog/goa-work-cafes-guide" className="text-ember hover:underline block font-semibold mb-1">The Best Cafés in Goa</Link>
            <p className="text-xs text-muted-foreground leading-relaxed">Discover speciality coffee, breakfast spots, remote-work cafés and hidden local favourites.</p>
          </div>
          <div>
            <Link to="/blog/goa-nightlife-guide" className="text-ember hover:underline block font-semibold mb-1">Goa Nightlife Beyond Clubs</Link>
            <p className="text-xs text-muted-foreground leading-relaxed">From sunset bars and live music to night markets and quiet evening experiences.</p>
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
