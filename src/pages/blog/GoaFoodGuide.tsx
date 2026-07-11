import { BlogLayout } from "@/components/BlogLayout";
import { blogPosts } from "@/lib/blogPosts";
import { Link } from "react-router-dom";
import { HelpCircle, Utensils, Compass, Home } from "lucide-react";
import { useState } from "react";

const post = blogPosts.find((p) => p.slug === "goa-food-guide")!;

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      "name": "Is Goan food only about seafood?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "No. While seafood is highly celebrated, Goa has a rich vegetarian culinary heritage rooted in Saraswat Brahmin cuisine. It features coconut, kokum, lentils, and seasonal vegetables in dishes like Khatkhate and Moongachi Usal."
      }
    },
    {
      "@type": "Question",
      "name": "What is Khatkhate in Goan cuisine?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Khatkhate is a traditional Goan mixed vegetable stew cooked with coconut, lentils, and local spices. It is a staple comfort food in Goan Hindu households during festivals and daily family meals."
      }
    },
    {
      "@type": "Question",
      "name": "Are there good options for vegans in Goa?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, Goa has quietly become a top plant-based travel destination in India. Cafes and restaurants across Assagao, Anjuna, Vagator, and Morjim offer creative vegan menu items, fresh organic produce, and plant-based desserts."
      }
    },
    {
      "@type": "Question",
      "name": "Where should foodies stay in Goa?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Assagao is the culinary hotspot of Goa, hosting premium restaurants, bakeries, and cocktail bars. Panjim is ideal for historic family-run eateries serving authentic fish thalis and traditional Goan curries."
      }
    },
    {
      "@type": "Question",
      "name": "What are some must-try traditional Goan sweets?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Bebinca is the most famous multi-layered coconut cake. You should also try Patoli, a dessert made of rice paste and sweet coconut-jaggery filling steamed inside fragrant turmeric leaves."
      }
    }
  ]
};

export default function GoaFoodGuide() {
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
      heroImageAlt="A traditional luxury Goan brass thali featuring lobster, curries, and rice"
      publishedDate={post.publishedDate}
      slug={post.slug}
      extraJsonLd={faqJsonLd}
    >
      {/* Introduction */}
      <div className="space-y-6">
        <h2 className="font-display text-2xl text-foreground mt-8">Think Goa Is Only About Seafood? There's a Whole Other Side to Goan Food</h2>
        <p>
          One of the biggest myths about eating in Goa is that vegetarians have fewer options.
        </p>
        <p className="font-semibold text-foreground text-lg italic text-center py-2">
          That couldn't be further from the truth.
        </p>
        <p>
          The misconception usually comes from the way Goa is marketed. Social media is filled with seafood platters, fish thalis and beach shacks serving the catch of the day, so it's easy to assume that's all the state has to offer. Spend a little time exploring local restaurants, however, and you'll quickly discover that vegetarian food has been part of Goan homes for centuries.
        </p>
        <p>
          In fact, some of Goa's oldest recipes don't include meat or seafood at all.
        </p>
        <p>
          Much of this tradition comes from Saraswat cuisine, where meals are built around seasonal vegetables, lentils, coconut, kokum and freshly ground spices. Rather than trying to imitate meat-based dishes, these recipes celebrate local ingredients in their own right, creating flavours that feel distinctly Goan while remaining completely vegetarian. Research into Goa's culinary heritage highlights dishes like khatkhate, moongachi usal, patoli and varan bhaat as staples that are deeply rooted in Saraswat households but rarely featured in mainstream travel guides.
        </p>

        <div className="my-8">
          <img
            src="/blog/goa-food-traditional-thali.webp"
            alt="Traditional steel thali featuring local Goan rice, fish, curries, and vegetable sides"
            className="w-full rounded-2xl border border-border object-cover aspect-video"
            loading="lazy"
          />
        </div>

        <h3 className="font-display text-xl font-bold text-foreground mt-8">Khatkhate — A Dish That Feels Like Home</h3>
        <p>
          If fish curry is everyday comfort food for many coastal families, khatkhate plays a similar role in vegetarian households.
        </p>
        <p>
          Prepared using a mix of seasonal vegetables, coconut and mild spices, it's the kind of meal that changes throughout the year depending on what's fresh at the market. No two kitchens prepare it exactly the same way, which is one reason locals speak about it with so much affection.
        </p>
        <p>
          It isn't designed to impress visitors. It's designed to feed families.
        </p>
        <p className="font-semibold text-foreground">
          That quiet authenticity is exactly what makes it worth seeking out.
        </p>

        <h3 className="font-display text-xl font-bold text-foreground mt-8">Don't Miss Goa's Traditional Sweets</h3>
        <p>
          Most visitors try bebinca and stop there. While bebinca absolutely deserves its reputation, Goa's dessert culture is much broader than a single layered cake.
        </p>
        <p>
          During festivals and family celebrations you'll also come across traditional sweets like patoli, where rice paste and coconut-jaggery filling are wrapped in turmeric leaves before steaming. The turmeric leaves gently perfume the dessert, creating a flavour that's difficult to find anywhere else in India.
        </p>
        <p>
          Like many traditional recipes, it's not available everywhere throughout the year. Finding it often depends on the season or local celebrations, making it one of those dishes that's even more rewarding when you stumble upon it.
        </p>

        <h3 className="font-display text-xl font-bold text-foreground mt-8">Vegan and Plant-Based Travellers Will Feel Right at Home</h3>
        <p>
          Goa has quietly become one of India's most welcoming destinations for plant-based travellers.
        </p>
        <p>
          Part of that comes from its long-standing vegetarian traditions, but another reason is the café culture that has developed across North Goa over the last decade. Areas like Assagao, Anjuna, Vagator, Morjim and Palolem are now home to restaurants that focus on seasonal produce, creative vegetarian menus and fully vegan kitchens without treating them as niche concepts. Your research consistently identified these neighbourhoods as some of the strongest areas for plant-based dining in Goa.
        </p>
        <p>
          Whether you're looking for smoothie bowls after a morning at the beach, wood-fired sourdough pizzas, fresh salads or contemporary Indian cooking, you'll find plenty of options that don't feel like compromises.
        </p>
        <p>
          In fact, many non-vegetarians end up eating at these restaurants simply because the food is that good.
        </p>
        <p>
          If cafés and healthy food are a priority during your trip, you'll find a much deeper collection of recommendations in our dedicated <Link to="/blog/goa-work-cafes-guide" className="text-ember hover:underline">Best Cafés in Goa</Link> guide, where we've covered everything from speciality coffee and breakfast spots to work-friendly cafés across both North and South Goa.
        </p>

        <div className="my-8">
          <img
            src="/blog/goa-food-baked-fish.webp"
            alt="Whole baked fish served on a platter with cherry tomatoes, cucumbers, and lemons"
            className="w-full rounded-2xl border border-border object-cover aspect-video"
            loading="lazy"
          />
        </div>

        <h3 className="font-display text-xl font-bold text-foreground mt-8">You Don't Need to Choose Between Authentic and Modern</h3>
        <p>
          One thing Goa does particularly well is allowing both traditions to exist side by side.
        </p>
        <p>
          You can begin the day with a decades-old bakery serving fresh poi, enjoy a traditional vegetarian lunch at a family-run restaurant and finish the evening with modern Goan cuisine prepared by chefs experimenting with local ingredients in completely new ways.
        </p>
        <p>
          Neither experience is more authentic than the other. One preserves Goa's culinary history. The other shows where it's heading next.
        </p>
        <p className="font-semibold text-foreground text-center my-4">
          The best trips usually include a little of both.
        </p>
        <p>
          By now, we've covered what to eat. The next question is just as important: where should you actually go to experience it?
        </p>
        <p>
          Instead of giving you another long list of restaurants, we'll help you choose where to eat based on the part of Goa you're staying in, making it easy to plan your meals around the rest of your itinerary rather than travelling across the state for every recommendation.
        </p>
      </div>

      {/* Region breakdown */}
      <div className="space-y-6 mt-12 border-t border-border pt-10">
        <h2 className="font-display text-2xl text-foreground">Staying in Different Parts of Goa? Here's Where the Food Scene Changes</h2>
        <p>
          One mistake many travellers make is assuming they need to drive across Goa to experience its best food.
        </p>
        <p>
          In reality, some of the most memorable meals happen close to where you're already staying.
        </p>
        <p>
          Every neighbourhood has developed its own food culture over the years. Panjim continues to preserve many of Goa's traditional restaurants, Assagao has become one of the state's most exciting dining destinations, Anjuna blends cafés with contemporary kitchens, while South Goa offers a slower experience built around seafood, family-run restaurants and long lunches by the sea.
        </p>
        <p>
          Understanding those differences makes planning your trip much easier.
        </p>

        {/* Anjuna/Vagator */}
        <h3 className="font-display text-lg text-foreground mt-8">Staying Around Anjuna or Vagator?</h3>
        <p>
          Food here is as much about variety as it is about quality.
        </p>
        <p>
          You can begin the morning with speciality coffee, stop for a relaxed brunch after the beach, discover modern Goan cooking for lunch and finish the evening at a restaurant overlooking the sea without travelling more than a few kilometres. That's one of the biggest reasons this part of North Goa remains popular with repeat visitors. Every meal feels different, and you're never short of new places to try.
        </p>
        <p>
          The area also attracts chefs experimenting with local ingredients in creative ways, so don't be surprised if traditional Goan flavours appear alongside Mediterranean, Asian or European influences. Rather than replacing local cuisine, many restaurants are finding interesting ways to reinterpret it.
        </p>

        {/* Assagao */}
        <h3 className="font-display text-lg text-foreground mt-8">Staying in Assagao?</h3>
        <p>
          Few places have transformed Goa's dining scene as much as Assagao.
        </p>
        <p>
          Over the last few years, this quiet village has become home to some of the state's most talked-about restaurants, bakeries and cocktail bars. Despite that growth, it has managed to retain a relaxed atmosphere that encourages people to slow down rather than rush through a meal.
        </p>
        <p>
          Dinner in Assagao often turns into an entire evening. People arrive before sunset, linger over multiple courses and eventually walk across to a nearby bar instead of driving somewhere else. That slower rhythm has become one of the village's biggest attractions.
        </p>
        <p>
          If food plays a major role in your holiday, Assagao deserves to be high on your shortlist. Learn more in our <Link to="/blog/assagao-goa-villas-guide" className="text-ember hover:underline">Assagao Guide</Link>.
        </p>

        {/* Morjim/Ashwem/Mandrem */}
        <h3 className="font-display text-lg text-foreground mt-8">Staying Around Morjim, Ashwem or Mandrem?</h3>
        <p>
          The pace changes noticeably once you move further north.
        </p>
        <p>
          Restaurants here reflect the beaches themselves—quieter, less hurried and more focused on long breakfasts, fresh seafood and relaxed dinners than busy nightlife. Many cafés open early for remote workers and long-stay travellers, while seafood restaurants make the most of the day's catch rather than relying on elaborate menus.
        </p>
        <p>
          It's also one of the best parts of Goa for people who enjoy discovering smaller family-run restaurants. You won't always find the biggest crowds here, but you'll often leave feeling like you've found somewhere you'll happily return to.
        </p>

        {/* Panjim */}
        <h3 className="font-display text-lg text-foreground mt-8">Staying in Panjim?</h3>
        <p>
          If your goal is to experience traditional Goan food, Panjim is difficult to overlook.
        </p>
        <p>
          Many of the restaurants that helped shape Goa's culinary reputation continue to operate here, serving recipes that have been passed down through generations rather than redesigned for social media. This is where dishes like fish thali, xacuti, cafreal and sorpotel often feel closest to their roots.
        </p>
        <p>
          The surrounding neighbourhoods also reward slow exploration. A heritage walk through Fontainhas naturally turns into coffee at a local bakery, followed by lunch at a family-run restaurant that's been serving the same recipes for decades.
        </p>
        <p>
          For travellers interested in understanding Goa's culinary history, Panjim offers an experience that's very different from the beach-focused food scene elsewhere in the state.
        </p>

        {/* South Goa */}
        <h3 className="font-display text-lg text-foreground mt-8">Exploring South Goa?</h3>
        <p>
          Meals in South Goa tend to unfold at a gentler pace.
        </p>
        <p>
          Instead of hopping between restaurants, most visitors choose a beachfront shack or family-run restaurant and settle in for a long lunch overlooking the sea. Fresh seafood naturally dominates many menus, but you'll also find traditional Goan curries, homemade desserts and recipes that change with the seasons rather than staying fixed throughout the year.
        </p>
        <p>
          Places like Palolem, Agonda, Colva and Benaulim are particularly rewarding if your idea of a great meal involves taking your time rather than squeezing dinner between other plans.
        </p>
        <p>
          The experience feels less about discovering the newest restaurant and more about enjoying good food in the place you're already happiest spending your day.
        </p>

        <h3 className="font-display text-lg text-foreground mt-12">Great Food Doesn't Always Come From the Most Famous Restaurant</h3>
        <p>
          It's easy to assume the longest queue or the restaurant with the highest number of online reviews must be serving the best food. Goa rarely works that way.
        </p>
        <p>
          Some of the meals people remember most come from neighbourhood bakeries, roadside breakfast stalls and small family-run restaurants that have quietly built loyal local followings over decades. The setting might be simple, the menu might only be a page long and the décor may never appear on Instagram, but the food often tells a far richer story than places designed primarily for visitors.
        </p>
        <p>
          That doesn't mean you should avoid Goa's well-known restaurants. It simply means leaving room for a little curiosity.
        </p>
        <p>
          Ask your host where they eat. Speak to the café owner while having breakfast. Chat with the person serving your fish thali. Those conversations often lead to places that never appear in &quot;Top 10 Restaurants in Goa&quot; articles—and they're usually the recommendations you'll end up passing on to someone else.
        </p>
      </div>

      {/* Homestay vs hotel experience */}
      <div className="space-y-6 mt-12 border-t border-border pt-10">
        <h2 className="font-display text-2xl text-foreground">Great Food Is About More Than Just Choosing the Right Restaurant</h2>
        <p>
          After spending a few days in Goa, most travellers realise something they didn't expect: the meals they remember aren't always the ones served at the most famous restaurant.
        </p>
        <p>
          Sometimes it's picking up fresh poi from a neighbourhood bakery in the morning and eating breakfast on your villa's balcony while the rest of Goa is still waking up. On another day, it might be stopping at a local fish market, buying the morning's catch and asking your host to recommend the best way to cook it. Even something as simple as sharing a takeaway fish thali around the dining table with friends often feels far more personal than another rushed meal between sightseeing stops.
        </p>
        <p>
          That's one of the small advantages of choosing a homestay or villa instead of a traditional hotel.
        </p>

        <div className="my-8">
          <img
            src="/blog/goa-food-dal-makhani.webp"
            alt="Rich copper bowl of Dal Makhani served alongside warm garlic naan"
            className="w-full rounded-2xl border border-border object-cover aspect-video"
            loading="lazy"
          />
        </div>

        <p className="font-semibold text-foreground text-center my-4">
          A hotel room is designed for sleeping. A home gives you space to actually live.
        </p>
        <p>
          You can bring back desserts from a local bakery without worrying about where to enjoy them. Fresh fruit from a roadside market becomes breakfast the next morning, and those famous Goan breads you've just discovered finally make sense when they're shared over coffee with family or friends. Even if you're craving your favourite dal makhani one evening, enjoying it together around a dining table often feels very different from ordering room service and eating in bed.
        </p>
        <p>
          Food has always been one of the easiest ways to bring people together. Goa simply gives you better ingredients for those moments.
        </p>
        <p>
          That's one of the ideas behind Wayzyy.
        </p>
        <p>
          Instead of helping you book just another place to stay, we're building a platform that helps travellers discover homes in the neighbourhoods that match the kind of trip they're planning. Want to wake up close to Panjim's traditional restaurants? Prefer spending your evenings around Assagao's growing food scene? Looking for a peaceful villa near Morjim where breakfast begins with a walk to a local bakery? Choosing the right location makes every meal easier to enjoy.
        </p>
        <p>
          Because Wayzyy works directly with verified local hosts, travellers can often find stays at prices that are around 20% lower than many larger booking platforms, while also staying closer to the cafés, restaurants and neighbourhoods they'll actually spend time exploring.
        </p>
      </div>

      {/* Final Thoughts */}
      <div className="space-y-6 mt-12">
        <h2 className="font-display text-2xl text-foreground">Final Thoughts</h2>
        <p>
          Goan food isn't something you rush through.
        </p>
        <p>
          It's a conversation with a café owner over your morning coffee, a fish thali that changes because today's catch is different from yesterday's, fresh bread collected from a neighbourhood bakery before breakfast and recipes that have quietly survived for generations inside family kitchens.
        </p>
        <p>
          The best meals rarely come from trying to tick famous restaurants off a list. They come from slowing down, asking locals for recommendations, wandering into places that weren't part of your original itinerary and leaving enough room to discover something unexpected.
        </p>
        <p>
          Just like its beaches, cafés and neighbourhoods, Goa rewards curiosity.
        </p>
        <p className="font-semibold text-foreground text-center my-4">
          Arrive hungry, keep an open mind and don't be afraid to order something you've never heard of before.
        </p>
        <p>
          There's a good chance that'll become the meal you remember long after the trip is over.
        </p>
      </div>

      {/* Interlinks */}
      <div className="mt-16 rounded-2xl border border-border bg-card/60 p-6 sm:p-8">
        <h3 className="font-display text-xl font-semibold text-foreground mb-4">
          Also Worth Reading
        </h3>
        <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
          If you're planning the rest of your Goa culinary journey, check out these guides:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-sm">
          <div>
            <Link to="/blog/where-to-stay-in-goa" className="text-ember hover:underline block font-semibold mb-1">Where Should You Stay in Goa?</Link>
            <p className="text-xs text-muted-foreground leading-relaxed">A complete decision guide to choosing the right neighbourhood based on your style.</p>
          </div>
          <div>
            <Link to="/blog/goa-work-cafes-guide" className="text-ember hover:underline block font-semibold mb-1">The Best Cafés in Goa</Link>
            <p className="text-xs text-muted-foreground leading-relaxed">Discover speciality coffee, breakfast spots, and work-friendly cafés.</p>
          </div>
          <div>
            <Link to="/blog/goa-nightlife-guide" className="text-ember hover:underline block font-semibold mb-1">Goa Nightlife Beyond Clubs</Link>
            <p className="text-xs text-muted-foreground leading-relaxed">From sunset bars and live music to night markets and quiet evening dinners.</p>
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
