import { BlogLayout } from "@/components/BlogLayout";
import { blogPosts } from "@/lib/blogPosts";
import { Link } from "react-router-dom";
import { HelpCircle, Users, Compass, CheckCircle } from "lucide-react";
import { useState } from "react";

const post = blogPosts.find((p) => p.slug === "goa-family-trip-guide")!;

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      "name": "Is Goa a good destination for a family vacation?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, Goa is one of the best destinations in India for families. From peaceful beaches and heritage attractions to nature trails, cafés and cultural experiences, it offers activities for every age group. Families can also choose quieter areas of Goa and stay in spacious homestays or vacation rentals for a more comfortable experience."
      }
    },
    {
      "@type": "Question",
      "name": "Is it better to stay in a hotel or a homestay when travelling to Goa with family?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "For families, a professionally managed homestay or vacation rental often provides more comfort than a traditional hotel. Features like multiple bedrooms, a fully equipped kitchen, a living room, parking and additional privacy make it easier for parents, children and elderly family members to stay together while enjoying the flexibility of a home."
      }
    },
    {
      "@type": "Question",
      "name": "Which part of Goa is best for families?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "The best area depends on your travel style. Families looking for cafés, restaurants and easy access to attractions often prefer North Goa, while those wanting quieter beaches and a more relaxed atmosphere usually enjoy South Goa. Choosing accommodation close to the places you plan to visit can significantly reduce travel time during your trip."
      }
    },
    {
      "@type": "Question",
      "name": "Can I cook my own food while staying in Goa?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. Many homestays and vacation rentals in Goa include fully equipped kitchens where you can prepare your own meals. This is especially useful for families travelling with young children, elderly parents or anyone with dietary preferences who may not want to eat restaurant food for every meal."
      }
    },
    {
      "@type": "Question",
      "name": "Is Goa suitable for travelling with elderly parents?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Absolutely. Goa can be a wonderful destination for elderly travellers when the trip is planned thoughtfully. Choosing a quieter area, booking accommodation with easy access, minimising long drives and selecting stays with ground-floor rooms or caretaker support can make the experience much more comfortable."
      }
    },
    {
      "@type": "Question",
      "name": "How many days are ideal for a family trip to Goa?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "A 5 to 7-day trip is generally ideal for families. It gives you enough time to explore at a relaxed pace without rushing between attractions. Instead of trying to cover the entire state, it's usually better to stay in one region, enjoy nearby beaches and attractions, and leave plenty of time to relax together."
      }
    }
  ]
};

export default function GoaFamilyTripGuide() {
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
      heroImageAlt="An Indian multi-generational family walking along a quiet Goa beach at sunset"
      publishedDate={post.publishedDate}
      slug={post.slug}
      extraJsonLd={faqJsonLd}
    >
      {/* Introduction */}
      <div className="space-y-6">
        <h2 className="font-display text-2xl text-foreground mt-8">How to Plan a Family Trip to Goa Without Feeling Rushed</h2>
        
        <p>
          One of the biggest misconceptions about Goa is that you need to see everything in one trip.
        </p>
        <p>
          It's understandable why so many families fall into that trap. Social media makes it feel as though your itinerary should include every famous beach, every trending café, every fort and every market. Before you know it, each day is packed from morning until late at night, leaving very little time to simply enjoy being on vacation.
        </p>
        <p className="font-semibold text-ember text-center text-lg italic my-2">
          Family holidays aren't meant to feel like a checklist.
        </p>
        <p>
          The best memories rarely come from visiting the highest number of attractions. They come from the slower moments that weren't even part of the original itinerary. Watching your children spend an extra hour on the beach because they don't want to leave, enjoying breakfast together without worrying about the next reservation or sitting by the pool while grandparents share stories from their own travels—those are the moments most families remember long after the trip is over.
        </p>
        <p>
          That's why we always recommend planning around experiences instead of attractions.
        </p>
        <p>
          Rather than trying to explore both <a href="/blog/north-goa-vs-south-goa-guide">North and South Goa</a> in a single day, dedicate each day to one part of the state. If you're staying in North Goa, spend the morning discovering a nearby beach, stop at a café for lunch, return home for an afternoon break and head back out in the evening for dinner or a local market. Families staying in South Goa can follow the same approach, allowing everyone to enjoy the destination without spending hours travelling between places.
        </p>
        <p>
          Rest isn't wasted time.
        </p>
        <p>
          Children often need an afternoon nap after spending hours in the sun, while elderly parents usually appreciate a quiet break before heading out again in the evening. Even teenagers, despite insisting they're full of energy, usually enjoy having a few hours to relax, swim or simply spend time together at the stay. Building those breaks into your itinerary doesn't mean you'll see less of Goa—it usually means you'll enjoy much more of it.
        </p>
        <p>
          Another tip that makes a noticeable difference is leaving space for unplanned discoveries.
        </p>
        <p>
          Some of the best cafés you'll visit probably won't be on your original list. A quiet beach recommended by your host might become the highlight of the trip. You may come across a local bakery, a sunset viewpoint or a family-run restaurant that never appeared on Instagram but ends up becoming everyone's favourite memory from the holiday.
        </p>
        <p>
          That's the beauty of Goa.
        </p>
        <p className="font-semibold text-foreground text-center text-lg italic my-2">
          It rewards travellers who leave a little room for spontaneity.
        </p>
        <p>
          Planning also becomes much easier when your accommodation works with your itinerary instead of against it. Returning to a comfortable home after a long day, preparing a light snack in your own kitchen, letting the children play in the living room while grandparents relax on the balcony and ending the evening around one dining table creates a rhythm that simply feels more natural than constantly moving between hotel rooms, restaurants and crowded common areas.
        </p>
        <p>
          The goal isn't to fit more into your holiday.
        </p>
        <p className="font-semibold text-center text-lg text-ember">
          The goal is to enjoy the time you already have.
        </p>
        <p>
          Once you start planning your trip around comfort rather than rushing from one attraction to the next, Goa begins to feel very different. It becomes less about ticking places off a list and more about creating memories together as a family.
        </p>
        <p>
          That's also why the place you stay can influence your holiday more than almost any attraction you'll visit—and that's exactly what we wanted to solve with Wayzyy.
        </p>

        <img
          src="/blog/goa-family-trip-beach.webp"
          alt="An Indian multi-generational family walking along a quiet Goa beach at sunset"
          className="w-full aspect-video object-cover rounded-2xl border border-border my-8"
          loading="lazy"
        />

        {/* Why We Started Wayzyy */}
        <h2 className="font-display text-2xl text-foreground mt-8">Why We Started Wayzyy: Because Families Deserve More Than Just a Hotel Room</h2>
        
        <p>
          Every family travels differently.
        </p>
        <p>
          Some are planning a weekend getaway with their parents. Others are taking their children to the beach for the very first time. Many are bringing grandparents along because holidays are one of the few opportunities where three generations get to spend quality time together under one roof.
        </p>
        <p>
          Yet, when it comes to booking accommodation, almost everyone is shown the same thing.
        </p>
        <p className="font-semibold text-center italic my-2">
          A hotel room.
        </p>
        <p>
          Maybe two adjoining rooms if you're lucky.
        </p>
        <p>
          For a short business trip, that's perfectly fine.
        </p>
        <p>
          For a family vacation, it often isn't.
        </p>
        <p>
          We've always felt that the place you stay should become part of your holiday rather than simply the place where you sleep. It should be somewhere your children can play while the adults enjoy a cup of coffee together, where grandparents can relax in a quiet corner after a morning at the beach and where the entire family can gather around one dining table instead of disappearing into separate rooms at the end of the day.
        </p>
        <p>
          That's the idea behind Wayzyy.
        </p>
        <p>
          We aren't trying to replace hotels because hotels are bad.
        </p>
        <p>
          Hotels continue to be the right choice for many kinds of trips.
        </p>
        <p>
          What we're building is a better alternative for people who want to travel differently.
        </p>
        <p>
          Families deserve accommodation that feels like home while still delivering the hospitality, cleanliness and professional standards they expect when they're away from home. That's why the homes you'll discover on Wayzyy aren't simply places to stay—they're spaces designed for living. Fully equipped kitchens give you the freedom to prepare a familiar meal whenever you need one. Spacious living rooms become the heart of family conversations after a day of exploring. Multiple bedrooms allow everyone to enjoy their own privacy without feeling disconnected, while dedicated parking, professionally managed properties and local caretakers make longer stays far more comfortable than constantly adapting to hotel routines.
        </p>
        <p>
          Another thing we strongly believe is that hospitality shouldn't stop once you've checked in.
        </p>
        <p className="font-semibold text-ember text-center text-lg italic my-2">
          The best hosts don't just hand over the keys.
        </p>
        <p>
          They recommend the quiet beach that isn't overcrowded, tell you which local bakery is worth waking up early for, help arrange trusted transport, suggest family-friendly restaurants and point you towards experiences that don't always appear in travel guides. Those small local recommendations often become the highlights of a holiday because they're based on genuine knowledge rather than generic tourist lists.
        </p>
        <p>
          That's the kind of experience we're working towards with every home listed on Wayzyy.
        </p>
        <p>
          Our goal has never been to become another booking platform with thousands of properties that all look the same. We'd rather help families discover carefully managed homes where they can spend less time worrying about logistics and more time enjoying each other's company.
        </p>
        <p>
          Because at the end of the day, the best family vacations are rarely remembered for the hotel lobby, the room service menu or how many attractions you managed to visit.
        </p>
        <p>
          They're remembered for mornings spent together over breakfast, evenings filled with conversations that lasted longer than expected, children laughing in the pool, grandparents sharing stories from the balcony and the comforting feeling that, even while travelling, everyone still felt at home.
        </p>
        <p>
          If that's the kind of holiday you're planning, we hope Wayzyy helps you find a place that feels just right.
        </p>

        <img
          src="/blog/goa-family-trip-villa.webp"
          alt="A happy Indian family sharing breakfast and conversations on the veranda of a Goan heritage villa"
          className="w-full aspect-video object-cover rounded-2xl border border-border my-8"
          loading="lazy"
        />

        {/* Final Thoughts */}
        <h2 className="font-display text-2xl text-foreground mt-8">Final Thoughts</h2>
        
        <p>
          Travelling with family has never really been about seeing the most places.
        </p>
        <p className="font-semibold text-ember text-center text-lg italic my-2">
          It's about spending meaningful time together.
        </p>
        <p>
          Years from now, your children probably won't remember how many beaches you visited or whether you managed to cover every attraction on your itinerary. What they'll remember are the evenings spent laughing around the dining table, the sunrise walks with their grandparents, the afternoons by the pool and the feeling of everyone being together without the distractions of everyday life.
        </p>
        <p>
          That's exactly why planning a family trip to Goa deserves a little more thought than simply booking flights and reserving a room.
        </p>
        <p>
          Choosing the right part of Goa, slowing your itinerary down, travelling comfortably and staying somewhere that genuinely feels like home can completely change the experience. Instead of spending the holiday adjusting to the accommodation, your accommodation should adapt to the way your family likes to travel.
        </p>
        <p>
          For many families, that's where a professionally managed homestay makes all the difference.
        </p>
        <p>
          The extra space, private bedrooms, shared living areas, kitchen, parking, caretaker support and the flexibility to enjoy the trip on your own terms create an experience that's difficult to recreate inside a traditional hotel room. You still enjoy the hospitality and comfort you expect from a quality stay, but with the warmth, privacy and familiarity that only a home can offer.
        </p>
        <p>
          That's the philosophy behind Wayzyy.
        </p>
        <p>
          We've always believed that the best holidays don't begin when you arrive at the beach—they begin the moment you walk into a place that already feels welcoming. Our goal is to help families discover thoughtfully managed homes where parents can relax, children can play, grandparents can feel comfortable and everyone has enough space to enjoy the journey together.
        </p>
        <p>
          Goa has something for every generation.
        </p>
        <p>
          The only thing left is choosing a stay that lets every generation experience it comfortably.
        </p>
        <p>
          Whether you're planning your first family vacation to Goa or returning to create a few more memories, we hope this guide helps you travel a little slower, stay a little longer and enjoy the moments that matter the most.
        </p>
      </div>

      {/* FAQ Accordion Section */}
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

      {/* Quick Internal Links Footer */}
      <div className="mt-16 p-8 border border-border rounded-2xl bg-muted/40">
        <h4 className="font-display text-lg text-foreground mb-4">Planning Resources</h4>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li>
            <a href="/blog/north-goa-vs-south-goa-guide" className="hover:text-ember transition-colors">
              North Goa vs South Goa — Stays, Vibe, and Beach Comparison Guide
            </a>
          </li>
          <li>
            <a href="/blog/goa-hotel-vs-villa-vs-homestay" className="hover:text-ember transition-colors">
              Hotel vs Villa vs Homestay — Which Accommodation to Book in Goa?
            </a>
          </li>
          <li>
            <a href="/blog/goa-transport-guide" className="hover:text-ember transition-colors">
              Getting Around Goa — Scooter Rentals, Cabs, and Self-Drive Rentals Guide
            </a>
          </li>
        </ul>
      </div>
    </BlogLayout>
  );
}
