import { BlogLayout } from "@/components/BlogLayout";
import { blogPosts } from "@/lib/blogPosts";
import { Link } from "react-router-dom";
import { HelpCircle, ShoppingBag, MapPin, Sparkles } from "lucide-react";
import { useState } from "react";

const post = blogPosts.find((p) => p.slug === "goa-markets-guide")!;

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      "name": "Which markets in Goa are open during the monsoon?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Seasonal flea markets like the Wednesday Anjuna Flea Market and Saturday Night Market are closed during the monsoon. However, permanent local municipal markets in Mapusa, Panjim, and Margao remain open throughout the year."
      }
    },
    {
      "@type": "Question",
      "name": "Where should I buy premium cashews in Goa?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "For the best quality and prices, buy cashews from local municipal markets like Mapusa Market instead of airport or souvenir shops. Look for cashew grades like W180 (largest whole kernels) or W240, and taste before purchasing."
      }
    },
    {
      "@type": "Question",
      "name": "Where can I buy authentic Goan spices?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Local markets like Mapusa Market and Panjim Market are the best places to buy fresh spices. Vendors sell loose, high-turnover spices like Goan red chillies, cinnamon, black pepper, and recheado masala paste, which are fresher than pre-packaged tourist versions."
      }
    },
    {
      "@type": "Question",
      "name": "What is unique about Goan Feni?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Goan Feni has a Geographical Indication (GI) tag, meaning it can only be produced in Goa. It is made either from cashew apple juice (cashew feni) or fermented coconut palm sap (coconut feni)."
      }
    },
    {
      "@type": "Question",
      "name": "Where is the best place to buy traditional Portuguese-style ceramic tiles?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Fontainhas, the Latin Quarter of Panjim, is the best area to buy authentic, hand-painted Portuguese ceramic tiles (azulejos) directly from local artists and design boutiques."
      }
    }
  ]
};

export default function GoaMarketsGuide() {
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
      heroImageAlt="A vendor sitting amidst traditional brass vessels, singing bowls, and textiles at a flea market in Goa"
      publishedDate={post.publishedDate}
      slug={post.slug}
      extraJsonLd={faqJsonLd}
    >
      {/* Introduction */}
      <div className="space-y-6">
        <h2 className="font-display text-2xl text-foreground mt-8">Goa Markets Guide (2026): Where to Shop, What to Buy & Which Markets Are Actually Worth Visiting</h2>
        <p>
          When most people think about shopping in Goa, one place usually comes to mind.
        </p>
        <p className="font-semibold text-foreground text-lg italic text-center py-2">
          The Anjuna Flea Market.
        </p>
        <p>
          Ask someone who's been here before, however, and you'll quickly realise the answer isn't nearly that simple.
        </p>
        <p>
          Some travellers will tell you to spend an entire Wednesday wandering through Anjuna. Others will insist that Mapusa Market offers a far more authentic experience. Someone staying in South Goa might recommend Margao instead, while another person will swear that Panjim is the best place to pick up local products without dealing with aggressive bargaining.
        </p>
        <p>
          They're all right.
        </p>
        <p>
          The biggest mistake visitors make is assuming every market in Goa offers the same experience.
        </p>
        <p>
          It doesn't.
        </p>
        <p>
          Some markets exist almost entirely for travellers looking for souvenirs, beachwear and handmade crafts. Others are where Goan families buy fresh vegetables, seafood, spices and everyday essentials. A few come alive only during the tourist season, while others continue operating throughout the year regardless of whether beaches are crowded or completely empty.
        </p>
        <p>
          Choosing the right market isn't about finding the biggest one. It's about understanding what you're actually hoping to take home.
        </p>
        <p>
          Are you looking for authentic Goan spices that you'll still be using months after your holiday ends? Trying to buy premium cashews without falling into the usual tourist traps? Interested in Portuguese-inspired ceramics, handmade jewellery or locally produced feni? Or do you simply want to spend an evening listening to live music, trying street food and soaking in the atmosphere without worrying too much about shopping?
        </p>
        <p>
          Each of those experiences happens in a different part of Goa.
        </p>
        <p>
          That's why this isn't another article listing the &quot;Top 10 Markets in Goa.&quot;
        </p>
        <p>
          Instead, we'll help you decide which market is worth your time, what each one is genuinely known for, how to avoid common shopping mistakes and, perhaps most importantly, where locals actually shop when they need fresh ingredients, traditional products or everyday essentials.
        </p>
        <p>
          One more thing is worth keeping in mind before you start planning.
        </p>
        <p>
          Many of Goa's most famous flea markets are seasonal rather than permanent. If you're visiting during the monsoon, chances are the Wednesday Anjuna Flea Market and the Saturday Night Market won't even be operating. During those months, municipal markets like Mapusa, Panjim and Margao become the places where both locals and travellers spend their time, making them far more rewarding than searching for attractions that simply aren't open.
        </p>
        <p>
          By the time you've finished this guide, you'll know exactly where to shop, what to buy, which products are genuinely worth bringing home and which famous markets deserve a place on your itinerary - and which ones you can comfortably skip.
        </p>
      </div>

      {/* What to Buy */}
      <div className="space-y-6 mt-12 border-t border-border pt-10">
        <h2 className="font-display text-2xl text-foreground">What Should You Actually Buy in Goa?</h2>
        <p>
          The best things to bring home from Goa usually aren't the ones displayed at the front of souvenir shops.
        </p>
        <p>
          Walk through any tourist market and you'll find rows of fridge magnets, keychains, printed T-shirts and beach accessories. They're easy to pack, but they rarely tell you much about the place you've just visited.
        </p>
        <p>
          The products that people genuinely remember buying are usually much simpler. A packet of freshly ground recheado masala that transforms your cooking months later. A bottle of authentic feni shared with friends back home. Fresh cashews picked up from a local vendor instead of an airport shop. Even a small hand-painted ceramic tile can end up becoming a conversation piece long after the holiday is over.
        </p>
        <p className="font-semibold text-foreground text-center my-4">
          Knowing what to buy is only half the story. Knowing where to buy it makes an even bigger difference.
        </p>

        {/* Cashews */}
        <h3 className="font-display text-lg text-foreground mt-8">Cashews Are Worth Buying - Just Don't Buy the First Pack You See</h3>
        <p>
          Almost everyone returns from Goa with cashews. Unfortunately, many also end up paying far more than they need to.
        </p>
        <p>
          Airport stores and souvenir shops usually stock neatly packaged boxes that are convenient to carry home, but they're often more expensive than the same quality available at local markets. If you're interested in bringing back premium cashews, markets like Mapusa give you the opportunity to compare different grades, taste before you buy and speak directly with the vendors about what's fresh. Your research also highlights the industry grading system - labels like W180 and W240 aren't marketing terms but genuine quality grades, with lower numbers indicating larger whole cashews.
        </p>
        <p>
          You don't need to become an expert overnight. Simply tasting a few varieties before making a decision usually leads to a much better purchase than grabbing the first sealed box you see.
        </p>

        <div className="my-8">
          <img
            src="/blog/goa-market-beachfront.webp"
            alt="Beachfront market stalls under palm trees showcasing clothes, textiles, and local crafts near the shoreline"
            className="w-full rounded-2xl border border-border object-cover aspect-video"
            loading="lazy"
          />
        </div>

        {/* Spices */}
        <h3 className="font-display text-lg text-foreground mt-8">If You're Buying Spices, Skip the Fancy Gift Shops</h3>
        <p>
          Few souvenirs last as long as good spices. Months after your trip, opening a jar of freshly ground Goan masala has a way of bringing the holiday back far more vividly than another decorative souvenir ever could.
        </p>
        <p>
          The best spices, however, rarely come from stores designed specifically for tourists. Local markets continue to be the better choice because vendors sell spices that move quickly and are replenished regularly. Fresh cinnamon, black pepper, cloves, cardamom and the famous Goan red chillies used in dishes like vindaloo are all widely available, along with regional spice blends such as recheado masala and traditional Goan garam masala. Multiple sources consistently recommend buying loose spices from trusted market vendors instead of pre-packed tourist versions, which are often marked up and may not be as fresh.
        </p>
        <p>
          If you've enjoyed the food during your trip, this is probably the easiest way to recreate a small part of Goa once you're back home.
        </p>

        {/* Feni */}
        <h3 className="font-display text-lg text-foreground mt-8">Feni Is More Than Just a Bottle to Take Home</h3>
        <p>
          No product is more closely associated with Goa than feni.
        </p>
        <p>
          At first glance it looks like just another local spirit, but there's far more to it than that. Feni is protected by a Geographical Indication (GI) tag, meaning authentic feni can only be produced in Goa. There are also two distinct varieties - cashew feni, which has a bold, fruity character, and coconut feni, a smoother and increasingly rare version made from fermented palm sap.
        </p>
        <p>
          If you're buying a bottle as a gift, established local brands are an excellent choice. On the other hand, travellers looking for something more traditional often discover small producers selling limited batches through local markets and village stores. Talking to the vendor, asking where it was made and learning a little about the production process usually makes the purchase far more memorable than simply picking a bottle off a supermarket shelf.
        </p>
        <p className="font-semibold text-foreground text-center my-4">
          The story behind what you buy is often just as valuable as the product itself.
        </p>
      </div>

      {/* Handmade / Crafts */}
      <div className="space-y-6 mt-12 border-t border-border pt-10">
        <h2 className="font-display text-2xl text-foreground">Some of Goa's Best Souvenirs Aren't the Ones You'll Find at Every Stall</h2>
        <p>
          Walk through any popular market and you'll notice something interesting: the first few stalls often look almost identical.
        </p>
        <p>
          The same dreamcatchers. The same fridge magnets. The same shell necklaces. The same printed T-shirts that could easily have come from any beach destination in the country.
        </p>
        <p>
          Keep walking, though, and Goa slowly starts revealing a different side of itself.
        </p>
        <p>
          Hidden between those souvenir stalls are products that have genuine connections to the state's history, communities and craftsmanship. They may not always catch your attention immediately, but they're usually the purchases people appreciate the most once they're back home.
        </p>

        {/* Ceramics */}
        <h3 className="font-display text-lg text-foreground mt-8">Portuguese-Inspired Ceramic Tiles</h3>
        <p>
          One of Goa's most distinctive keepsakes is the hand-painted ceramic tile, better known as an azulejo.
        </p>
        <p>
          Introduced during Portuguese rule, these colourful tiles have become part of Goa's architectural identity. Walk through Fontainhas in Panjim and you'll see them everywhere, decorating old homes, cafés and heritage buildings with names, family crests and traditional artwork. Today, many local artists continue that tradition by creating hand-painted versions that make thoughtful souvenirs without feeling overly commercial. Research consistently points visitors towards Fontainhas as the best area to explore these ceramic crafts rather than buying mass-produced copies elsewhere.
        </p>
        <p>
          Unlike generic souvenirs, an azulejo carries a small piece of Goa's history with it.
        </p>

        {/* Traditional pottery */}
        <h3 className="font-display text-lg text-foreground mt-8">Pottery That's Still Used in Goan Homes</h3>
        <p>
          Not every craft in Goa is made for display.
        </p>
        <p>
          Visit markets like Mapusa and you'll still find vendors selling traditional clay pots, pickle jars, oil lamps and water vessels that continue to be used in everyday households. They're simple, practical and deeply connected to local life, making them far more meaningful than decorative items designed only for tourists. The research specifically highlights traditional moddki pickle jars, dive oil lamps and clay water pots as products that remain part of Goan homes even today.
        </p>
        <p>
          Even if you don't have space in your luggage for larger pieces, seeing these crafts being sold alongside everyday shopping offers a glimpse into a side of Goa that many visitors never experience.
        </p>

        <div className="my-8">
          <img
            src="/blog/goa-market-puppets-crafts.webp"
            alt="Close-up of vibrant handmade traditional puppets and colorful decorative crafts hanging at a market"
            className="w-full rounded-2xl border border-border object-cover aspect-video"
            loading="lazy"
          />
        </div>

        {/* Local Makers */}
        <h3 className="font-display text-lg text-foreground mt-8">Shop From Local Makers Whenever You Can</h3>
        <p>
          It's easy to forget that every purchase supports someone. Choosing a handmade ceramic tile instead of a factory-made souvenir, buying spices from a local vendor or picking up woven baskets directly from the people who make them helps keep traditional skills alive while giving you something with a genuine story behind it.
        </p>
        <p>
          Goa has also seen a growing number of independent stores that focus on ethical and locally made products rather than imported souvenirs. If sustainable shopping matters to you, places like Paper Boat Collective, Barefoot and the Goa Collective Bazaar have built a reputation for showcasing local artists, designers and small businesses instead of mass-produced merchandise.
        </p>
        <p>
          Those purchases may cost a little more. They usually end up meaning a lot more too.
        </p>

        <h3 className="font-display text-lg text-foreground mt-12 font-bold">Shopping in Goa Is Less About Bargains and More About Discoveries</h3>
        <p>
          One thing becomes obvious after spending a day exploring Goa's markets: the best purchase isn't always the cheapest one.
        </p>
        <p>
          Sometimes it's the packet of freshly ground spice that reminds you of your trip every time you cook. Sometimes it's a ceramic tile that ends up hanging by your front door for years. Sometimes it's simply the conversation you had with the person who made what you're carrying home.
        </p>
        <p>
          That's why slowing down makes such a difference. Instead of rushing through every aisle trying to compare prices, take time to ask questions. Find out where a product comes from, how it's made and why it's important locally. Those conversations often become just as memorable as the markets themselves.
        </p>
        <p>
          The next thing worth knowing isn't what to buy. It's how to shop like someone who's been visiting Goa for years rather than someone who's just arrived yesterday.
        </p>
      </div>

      {/* Practical tips */}
      <div className="space-y-6 mt-12 border-t border-border pt-10">
        <h2 className="font-display text-2xl text-foreground">A Few Things Worth Knowing Before You Start Shopping</h2>
        <p>
          Shopping in Goa is much more relaxed than in many other tourist destinations, but a little preparation can make the experience noticeably better.
        </p>
        <p>
          The first tip is surprisingly simple - visit early whenever you can. Markets like Mapusa are busiest around midday, while Anjuna becomes much more enjoyable during the morning or later in the afternoon when the heat begins to ease and crowds thin out. Starting early also gives you a better chance of browsing before the busiest hours and, if you're shopping for fresh produce or seafood, you'll have the widest selection available.
        </p>
        <p>
          Carrying a little cash is still a good idea even though UPI has become common across much of Goa. Larger shops and cafés usually accept digital payments without any issues, but smaller vendors, especially in local markets, often prefer cash for quicker transactions. Having both options means you won't need to skip something simply because of the payment method.
        </p>
        <p>
          Bargaining is part of the experience in markets like Anjuna, but it doesn't need to become a negotiation over every single purchase. If you're buying handmade products directly from local artisans, paying a fair price often matters more than saving a few extra rupees. On the other hand, if you're shopping for souvenirs from stalls selling similar products, politely comparing prices before making a decision is completely normal.
        </p>
        <p>
          Perhaps the best advice, though, is not to rush. The stalls that leave the strongest impression are rarely the ones you notice first. Walk a little further, speak to the vendors, ask where a product comes from and don't be afraid to taste before you buy when you're shopping for spices, cashews or local delicacies. Those conversations are often what transform a simple shopping trip into one of the most memorable parts of travelling through Goa.
        </p>
      </div>

      {/* Wayzyy Integration */}
      <div className="space-y-6 mt-12 border-t border-border pt-10">
        <h2 className="font-display text-2xl text-foreground">The Best Markets Are Usually the Ones Closest to Where You're Staying</h2>
        <p>
          One thing we've learnt after exploring Goa for years is that shopping becomes far more enjoyable when it fits naturally into your day instead of becoming a separate excursion.
        </p>
        <p>
          You might spend the morning wandering through the Friday Market in Mapusa before stopping at a local café for breakfast. An afternoon exploring Fontainhas can easily turn into shopping for hand-painted ceramic tiles and local bakeries in Panjim. Staying around Anjuna means the Flea Market, nearby cafés and the beach are all within easy reach, while travellers based in South Goa can enjoy Margao's markets without driving across the state.
        </p>
        <p>
          That's one of the reasons where you stay matters just as much as the places you plan to visit. Instead of spending hours in traffic moving between markets, beaches and restaurants, choosing accommodation in the right neighbourhood lets everything come together naturally.
        </p>
        <p>
          That's the idea behind Wayzyy.
        </p>
        <p>
          Rather than helping you book just another villa, we're building a platform that helps travellers stay closer to the experiences they're actually coming to Goa for. Whether that's exploring the markets around Anjuna, discovering Panjim's heritage streets, shopping in Mapusa or spending slow mornings in South Goa, choosing the right location often shapes your trip far more than choosing the most luxurious property.
        </p>
        <p>
          Because Wayzyy works directly with verified local hosts, travellers can often find stays at prices that are around 20% lower than many larger booking platforms, while enjoying more space, local recommendations and neighbourhoods that feel connected to the real Goa rather than just its tourist hotspots.
        </p>
      </div>

      {/* Final Thoughts */}
      <div className="space-y-6 mt-12">
        <h2 className="font-display text-2xl text-foreground">Final Thoughts</h2>
        <p>
          The best thing you'll bring home from Goa probably won't be the most expensive thing you buy.
        </p>
        <p>
          It might be a packet of spices that reminds you of a memorable meal, a bottle of feni shared with friends, a hand-painted ceramic tile hanging in your home or simply a conversation with a vendor who explained the story behind something you almost walked past.
        </p>
        <p>
          That's what makes Goa's markets special. They aren't just places to shop. They're places where everyday life, food, history and local culture come together in a way that's difficult to experience anywhere else.
        </p>
        <p className="font-semibold text-foreground text-center my-4">
          Take your time, stay curious and don't feel pressured to visit every famous market.
        </p>
        <p>
          Choose the ones that match the kind of trip you're having, and you're far more likely to leave with memories that last much longer than anything you manage to fit into your suitcase.
        </p>
      </div>

      {/* Interlinks */}
      <div className="mt-16 rounded-2xl border border-border bg-card/60 p-6 sm:p-8">
        <h3 className="font-display text-xl font-semibold text-foreground mb-4">
          Also Worth Reading
        </h3>
        <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
          If you're planning the rest of your Goa itinerary, these guides will help you make the most of your trip:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-sm">
          <div>
            <Link to="/blog/goa-beaches-guide" className="text-ember hover:underline block font-semibold mb-1">Goa Beaches Guide</Link>
            <p className="text-xs text-muted-foreground leading-relaxed">Discover which shorelines match your travel style for swimming, working, or relaxing.</p>
          </div>
          <div>
            <Link to="/blog/goa-food-guide" className="text-ember hover:underline block font-semibold mb-1">The Ultimate Goa Food Guide</Link>
            <p className="text-xs text-muted-foreground leading-relaxed">Explore traditional Saraswat vegetarian dishes, local fish thalis, and dining regions.</p>
          </div>
          <div>
            <Link to="/blog/goa-work-cafes-guide" className="text-ember hover:underline block font-semibold mb-1">Best Cafés in Goa</Link>
            <p className="text-xs text-muted-foreground leading-relaxed">Find remote-work cafés, specialty coffee, and great breakfast spots near you.</p>
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
