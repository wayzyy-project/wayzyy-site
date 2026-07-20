import { BlogLayout } from "@/components/BlogLayout";
import { blogPosts } from "@/lib/blogPosts";
import { HelpCircle, Clock, Calendar, ShieldCheck, MapPin } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

const post = blogPosts.find((p) => p.slug === "agonda-beach-south-goa-guide")!;

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      "name": "Can you swim at Agonda Beach?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, Agonda Beach is good for swimming. However, it has a relatively steep shore break and stronger waves compared to Palolem. Always stay within lifeguard-monitored areas and avoid swimming near the river-mouth estuary in North Agonda."
      }
    },
    {
      "@type": "Question",
      "name": "Is Agonda Beach safe for solo travellers?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. Agonda is considered one of the safest and most relaxed destinations in South Goa. The local community is welcoming, and the vibe is quiet, making it very comfortable for solo travellers."
      }
    },
    {
      "@type": "Question",
      "name": "Can you rent scooters in Agonda?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. Several local rental shops operate along the main Agonda beach road. Renting a scooter is the most convenient way to explore surrounding coves like Cola Beach, Palolem, or Patnem."
      }
    },
    {
      "@type": "Question",
      "name": "Are pets allowed on Agonda Beach?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, Agonda is generally pet-friendly and you will see dogs walking on the beach. However, local accommodation policies vary widely, so you should always verify with your host or villa provider before booking."
      }
    },
    {
      "@type": "Question",
      "name": "Can you find beachfront villas in Agonda?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. Agonda has a beautiful selection of beachfront cottages, boutique resorts, and luxury holiday homes. Booking through Wayzyy gives you access to verified listings where you can compare amenities like high-speed Wi-Fi, private pools, and beach access."
      }
    }
  ]
};

export default function AgondaBeachGuide() {
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
      heroImageAlt="Beautiful palm-fringed shoreline of Agonda Beach in South Goa with calm turquoise waters and traditional fishing boats"
      publishedDate={post.publishedDate}
      slug={post.slug}
      extraJsonLd={faqJsonLd}
    >
      <div className="space-y-6">
        <p>
          Agonda Beach is one of South Goa's best-kept secrets. Spanning three kilometres of pristine, golden sand lined with coconut palms, it offers a stark contrast to the commercial hubs of the north. There are no loud beach clubs, jet-ski horns, or persistent beach vendors here. Instead, you'll find a quiet sanctuary where mornings are slow and the focus is entirely on nature, slow travel, and wellness.
        </p>
        <p>
          Whether you're looking to plan a peaceful digital nomad workation, a romantic couple's getaway, or a quiet family vacation, Agonda provides a laid-back, bohemian base to explore everything that makes South Goa special.
        </p>

        <h2 className="font-display text-2xl text-foreground mt-8">Best Time to Visit Agonda Beach</h2>
        <p>
          Agonda is a year-round destination, but the experience changes significantly depending on when you visit. Whether you're looking for perfect beach weather, a peaceful workation, or lower accommodation prices, choosing the right season can make a big difference.
        </p>

        <h3 className="font-display text-xl text-foreground mt-6">November to February – The Best Time to Visit</h3>
        <p>
          If you're visiting Agonda for the first time, November to February is easily the best time to plan your trip. The weather is pleasant, humidity is lower, and daytime temperatures usually range between 24°C and 30°C, making it ideal for swimming, beach walks, sightseeing, and exploring South Goa.
        </p>
        <p>
          This is also when you'll find:
        </p>
        <ul className="list-disc pl-6 space-y-1">
          <li>Most beach shacks and cafés fully open</li>
          <li>Yoga retreats and wellness sessions in full swing</li>
          <li>Olive Ridley turtle nesting season (especially at the protected sanctuary areas)</li>
          <li>Calm evenings perfect for outdoor dining</li>
          <li>The liveliest atmosphere without feeling overcrowded</li>
        </ul>
        <p>
          Since this is peak tourist season, accommodation fills up quickly—especially during Christmas and New Year. If you're travelling during this period, it's worth booking your stay several weeks in advance. Platforms like <Link to="/earnings-calculator" className="text-ember hover:underline">Wayzyy</Link> make it easier to compare verified villas, holiday homes, and boutique stays before prices start increasing.
        </p>

        <h3 className="font-display text-xl text-foreground mt-6">March to May – Warm but Less Crowded</h3>
        <p>
          March marks the beginning of summer in Goa. Temperatures start rising, often reaching 32–35°C, making afternoons quite warm. However, mornings and evenings are still pleasant, and you'll notice significantly fewer tourists compared to the winter months.
        </p>
        <p>
          This is a good time if you prefer quieter beaches, want better accommodation deals, don't mind warmer weather, or plan to spend more time relaxing than sightseeing. Many luxury villas and holiday homes also offer better rates during this period, making it an excellent choice for families or longer stays.
        </p>

        <h3 className="font-display text-xl text-foreground mt-6">June to September – The Monsoon Season</h3>
        <p>
          The monsoon transforms Agonda into a completely different destination. Heavy rainfall turns the surrounding hills lush green, rivers fill up, and the beaches become incredibly peaceful. While the scenery is beautiful, this isn't the ideal time for a typical beach holiday.
        </p>
        <p>
          During the monsoon, swimming is generally discouraged because of rough seas, many seasonal beach shacks close temporarily, water sports are unavailable, and some beachfront accommodations shut for maintenance. That said, if you're looking for a quiet escape, enjoy the rain, and don't mind spending time indoors with a book or working remotely, monsoon has its own charm.
        </p>

        <h3 className="font-display text-xl text-foreground mt-6">October – The Hidden Sweet Spot</h3>
        <p>
          October is often overlooked, but it's one of the best months to visit Agonda. The rains have usually ended, the landscape is still lush from the monsoon, temperatures are comfortable, and tourist crowds haven't yet reached their winter peak.
        </p>
        <p>
          Many cafés, resorts, and beach huts begin reopening during this period, giving visitors a chance to enjoy South Goa before the busiest season begins. You'll often find better accommodation availability and more reasonable prices than in December, making October one of the smartest months to visit.
        </p>

        <h3 className="font-display text-lg text-foreground mt-8">Month-by-Month Guide</h3>
        <div className="overflow-x-auto my-6 border border-border rounded-xl">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-muted/50 border-b border-border font-display text-foreground">
                <th className="p-4 font-semibold">Month</th>
                <th className="p-4 font-semibold">Weather</th>
                <th className="p-4 font-semibold">Crowd Level</th>
                <th className="p-4 font-semibold">Best For</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60 text-muted-foreground">
              <tr>
                <td className="p-4 font-medium text-foreground">October</td>
                <td className="p-4">Pleasant</td>
                <td className="p-4">Low</td>
                <td className="p-4">Couples, photographers, early-season travellers</td>
              </tr>
              <tr>
                <td className="p-4 font-medium text-foreground">November</td>
                <td className="p-4">Excellent</td>
                <td className="p-4">Moderate</td>
                <td className="p-4">First-time visitors, beach holidays</td>
              </tr>
              <tr>
                <td className="p-4 font-medium text-foreground">December</td>
                <td className="p-4">Excellent</td>
                <td className="p-4">High</td>
                <td className="p-4">Christmas, New Year, peak season</td>
              </tr>
              <tr>
                <td className="p-4 font-medium text-foreground">January</td>
                <td className="p-4">Excellent</td>
                <td className="p-4">High</td>
                <td className="p-4">Families, couples, long vacations</td>
              </tr>
              <tr>
                <td className="p-4 font-medium text-foreground">February</td>
                <td className="p-4">Excellent</td>
                <td className="p-4">Moderate</td>
                <td className="p-4">Beach lovers, sightseeing</td>
              </tr>
              <tr>
                <td className="p-4 font-medium text-foreground">March</td>
                <td className="p-4">Warm</td>
                <td className="p-4">Moderate</td>
                <td className="p-4">Budget travellers, quieter stays</td>
              </tr>
              <tr>
                <td className="p-4 font-medium text-foreground">April</td>
                <td className="p-4">Hot</td>
                <td className="p-4">Low</td>
                <td className="p-4">Relaxation, villa stays</td>
              </tr>
              <tr>
                <td className="p-4 font-medium text-foreground">May</td>
                <td className="p-4">Hot & Humid</td>
                <td className="p-4">Low</td>
                <td className="p-4">Budget travel</td>
              </tr>
              <tr>
                <td className="p-4 font-medium text-foreground">June–September</td>
                <td className="p-4">Rainy</td>
                <td className="p-4">Very Low</td>
                <td className="p-4">Monsoon lovers, peaceful workations</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="font-display text-xl text-foreground mt-6">When Should You Book Your Stay?</h3>
        <p>
          If you're travelling between December and early January, it's best to secure your accommodation as early as possible. Beachfront villas and popular boutique properties often sell out months in advance, and last-minute options tend to be limited and more expensive.
        </p>
        <p>
          For shoulder-season travel (October, November, February, and March), you'll usually have more flexibility and better pricing. If you're planning a family vacation, a romantic getaway, or an extended workation, booking through Wayzyy gives you access to verified villas and holiday homes where you can compare amenities like Wi-Fi, parking, private pools, and beach proximity before making a decision.
        </p>

        <h3 className="font-display text-xl text-foreground mt-6">Which Season Is Right for You?</h3>
        <ul className="list-disc pl-6 space-y-1">
          <li><strong>For the best overall experience</strong>: November to February.</li>
          <li><strong>For lower prices and fewer crowds</strong>: October, March, or early April.</li>
          <li><strong>For nature and peaceful surroundings</strong>: Monsoon (June to September), provided you're not planning a beach-focused holiday.</li>
        </ul>

        {/* Agonda Beach View Image */}
        <div className="my-8">
          <img
            src="/blog/agonda-beach-view.webp"
            alt="Elevated scenic view of Agonda Beach cove lined with shacks and coconut trees under a clear blue sky"
            className="w-full rounded-2xl border border-border object-cover aspect-video"
            loading="lazy"
          />
          <span className="text-xs text-muted-foreground mt-2 block text-center">Scenic elevated overview of the uncrowded Agonda coastline</span>
        </div>

        <h2 className="font-display text-2xl text-foreground mt-8">Agonda vs Palolem vs Patnem: Which Beach Should You Choose?</h2>
        <p>
          One of the most common questions travellers ask while planning a South Goa trip is whether they should stay in Agonda, Palolem, or Patnem. The truth is, all three beaches are beautiful—but they're designed for completely different types of travellers. Choosing the right one depends less on which beach is "better" and more on the kind of holiday you're looking for.
        </p>

        <div className="overflow-x-auto my-6 border border-border rounded-xl">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-muted/50 border-b border-border font-display text-foreground">
                <th className="p-4 font-semibold">Feature</th>
                <th className="p-4 font-semibold">Agonda</th>
                <th className="p-4 font-semibold">Palolem</th>
                <th className="p-4 font-semibold">Patnem</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60 text-muted-foreground">
              <tr>
                <td className="p-4 font-medium text-foreground">Crowd Level</td>
                <td className="p-4 text-emerald-500">⭐⭐☆☆☆ (Low)</td>
                <td className="p-4 text-rose-500">⭐⭐⭐⭐⭐ (High)</td>
                <td className="p-4 text-amber-500">⭐⭐⭐☆☆ (Moderate)</td>
              </tr>
              <tr>
                <td className="p-4 font-medium text-foreground">Nightlife</td>
                <td className="p-4">Minimal</td>
                <td className="p-4 text-emerald-500">Excellent</td>
                <td className="p-4">Limited</td>
              </tr>
              <tr>
                <td className="p-4 font-medium text-foreground">Swimming</td>
                <td className="p-4">Good (Wavy)</td>
                <td className="p-4 text-emerald-500">Excellent (Calm)</td>
                <td className="p-4">Good</td>
              </tr>
              <tr>
                <td className="p-4 font-medium text-foreground">Families</td>
                <td className="p-4 text-emerald-500">Excellent</td>
                <td className="p-4">Good</td>
                <td className="p-4 text-emerald-500">Very Good</td>
              </tr>
              <tr>
                <td className="p-4 font-medium text-foreground">Couples</td>
                <td className="p-4 text-emerald-500">Excellent</td>
                <td className="p-4">Good</td>
                <td className="p-4 text-emerald-500">Excellent</td>
              </tr>
              <tr>
                <td className="p-4 font-medium text-foreground">Digital Nomads</td>
                <td className="p-4 text-emerald-500">Excellent</td>
                <td className="p-4">Good</td>
                <td className="p-4">Very Good</td>
              </tr>
              <tr>
                <td className="p-4 font-medium text-foreground">Peace & Quiet</td>
                <td className="p-4 text-emerald-500">Excellent</td>
                <td className="p-4">Average</td>
                <td className="p-4 text-emerald-500">Very Good</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="font-display text-xl text-foreground mt-6">Choose Agonda If You Want Peace</h3>
        <p>
          Agonda is ideal for travellers who aren't looking to tick off attractions all day. Instead, it's a place where you can wake up without traffic noise, spend the morning walking along an uncrowded beach, work from a café overlooking the sea, and end the evening watching the sunset.
        </p>
        <p>
          It's particularly popular with couples, families, remote workers, solo travellers, and long-stay visitors. If you're planning to stay for four or five nights, Agonda also works well as a base for exploring the rest of South Goa. Instead of changing hotels every day, you can stay in one villa or holiday home and take day trips to nearby beaches like <Link to="/blog/galgibaga-beach-goa-guide" className="text-ember hover:underline">Galgibaga Beach</Link>.
        </p>

        <h3 className="font-display text-xl text-foreground mt-6">Choose Palolem If You Want Action</h3>
        <p>
          Palolem is South Goa's busiest beach—and for good reason. It's packed with restaurants, cafés, shopping, kayaking, boat trips, live music, and the famous Silent Noise parties. If you're someone who likes having plenty to do within walking distance, Palolem is hard to beat.
        </p>
        <p>
          However, that popularity also comes with trade-offs. During peak season you'll find more traffic, busier beaches, and less privacy. For many travellers, Palolem works best as a day trip rather than a place to stay for an entire week. You can read our detailed <Link to="/blog/palolem-beach-south-goa-guide" className="text-ember hover:underline">Palolem Beach Guide</Link> for more information.
        </p>

        <h3 className="font-display text-xl text-foreground mt-6">Choose Patnem If You Want a Balance</h3>
        <p>
          Patnem sits somewhere between Agonda and Palolem. It's quieter than Palolem but livelier than Agonda, making it a good option for travellers who want peaceful beaches without feeling completely disconnected. Patnem has a relaxed café culture, plenty of beachfront restaurants, and comfortable accommodation while still maintaining a laid-back atmosphere.
        </p>

        <h3 className="font-display text-xl text-foreground mt-6">Can You Stay in Agonda and Visit the Other Beaches?</h3>
        <p>
          Absolutely—and that's one of the biggest advantages of choosing Agonda. The three beaches are only a short drive apart:
        </p>
        <ul className="list-disc pl-6 space-y-1">
          <li>Agonda → Palolem: 10–15 minutes</li>
          <li>Agonda → Patnem: 10 minutes</li>
          <li>Agonda → Cola Beach: 20 minutes</li>
          <li>Agonda → Galgibaga Beach: 20–25 minutes</li>
        </ul>
        <p>
          This means you don't need to book multiple hotels just to experience South Goa. Many experienced travellers prefer staying in Agonda because they get a peaceful place to return to after spending the day exploring busier beaches. If you're wondering where to base yourself, check out our guide on <Link to="/blog/where-to-stay-in-south-goa" className="text-ember hover:underline">Where to Stay in South Goa</Link>.
        </p>

        <h3 className="font-display text-xl text-foreground mt-6">Which Beach Is Better for Families?</h3>
        <p>
          If you're travelling with children, Agonda and Patnem are generally better choices than Palolem. Both offer a quieter environment, less traffic, and a more relaxed atmosphere. Villas are also more common, giving families extra space, private kitchens, parking, and outdoor areas that are difficult to find in standard hotel rooms.
        </p>
        <p>
          If you're travelling as a larger family or with grandparents, booking a private villa through Wayzyy can often be more practical than booking multiple hotel rooms. You'll have shared living spaces, more privacy, and amenities like kitchens, washing machines, dedicated parking, and workspaces—all of which make longer stays much more comfortable. Read our <Link to="/blog/goa-family-trip-guide" className="text-ember hover:underline">Goa Family Trip Guide</Link> to help plan your family itinerary.
        </p>

        <h3 className="font-display text-xl text-foreground mt-6">Which Beach Is Better for Couples?</h3>
        <p>
          All three beaches attract couples, but the experience is quite different. Agonda is best for romantic walks, quiet dinners, and peaceful mornings. Patnem offers a similar atmosphere but with slightly more cafés and activity. Palolem suits couples who enjoy nightlife, beach bars, and a livelier social scene.
        </p>
        <p>
          If your ideal holiday involves relaxing by the beach instead of planning every hour of the day, Agonda is usually the better choice.
        </p>

        <h3 className="font-display text-xl text-foreground mt-6">The Verdict</h3>
        <p>
          There's no universal winner—only the beach that best matches your travel style. Choose Palolem if you want nightlife, shopping, and activities. Choose Patnem if you want a balanced mix of relaxation and convenience. Choose Agonda if you're looking for South Goa at its most peaceful, with uncrowded beaches, slower mornings, boutique stays, and easy access to nearby attractions.
        </p>

        {/* Agonda Beach Huts sunset */}
        <div className="my-8">
          <img
            src="/blog/agonda-beach-huts.webp"
            alt="Beachfront coco huts along Agonda beach at sunset under coconut palm trees"
            className="w-full rounded-2xl border border-border object-cover aspect-video"
            loading="lazy"
          />
          <span className="text-xs text-muted-foreground mt-2 block text-center">Beachfront coco huts and boutique resorts facing the sunset in Agonda</span>
        </div>

        <h2 className="font-display text-2xl text-foreground mt-8">Practical Travel Tips Before Visiting Agonda Beach</h2>
        <p>
          Whether you're visiting for a weekend or planning a month-long stay, a little planning can make your trip much smoother. Here are some practical tips that most travel guides either skip or only briefly mention.
        </p>

        <h3 className="font-display text-lg text-foreground mt-6">Is Agonda Beach Good for Families?</h3>
        <p>
          Yes. Agonda is one of the most family-friendly beaches in South Goa. Unlike busier beaches, there are fewer crowds, less traffic, and a quieter atmosphere, making it easier to travel with children or elderly family members. Many villas and holiday homes also offer kitchens, multiple bedrooms, parking, and private outdoor spaces, which are often more convenient than staying in a hotel.
        </p>

        <h3 className="font-display text-lg text-foreground mt-6">Is Agonda Good for a Workation?</h3>
        <p>
          Absolutely. Agonda has become increasingly popular among remote workers who want a quieter alternative to North Goa. Many cafés now offer reliable Wi-Fi, and several villas have fibre internet, dedicated workspaces, and backup power.
        </p>
        <p>
          If you're planning to work remotely, don't just book the cheapest stay. Check for:
        </p>
        <ul className="list-disc pl-6 space-y-1 text-muted-foreground text-sm">
          <li>High-speed Wi-Fi</li>
          <li>Power backup</li>
          <li>Comfortable workspace</li>
          <li>Air conditioning</li>
          <li>Walkability to cafés</li>
          <li>Mobile network coverage</li>
        </ul>
        <p>
          Wayzyy lets you compare these amenities before booking, making it easier to find accommodation that's actually suited for longer stays. You can read our general <Link to="/blog/goa-work-cafes-guide" className="text-ember hover:underline">Goa Work Cafes Guide</Link> for café workspace ideas.
        </p>

        <h3 className="font-display text-lg text-foreground mt-6">Is Mobile Network Good in Agonda?</h3>
        <p>
          Most major networks like Jio and Airtel work well across Agonda, with good 4G and expanding 5G coverage in many areas. However, signal strength can vary slightly depending on whether you're staying right on the beachfront or further inland. If reliable internet is important for work, it's worth confirming Wi-Fi availability with your accommodation before booking.
        </p>

        <h3 className="font-display text-lg text-foreground mt-6">Are There ATMs and Supermarkets?</h3>
        <p>
          Yes. While Agonda is a relatively small village, you'll find ATMs, pharmacies, grocery stores, convenience shops, medical clinics, and scooter rental outlets. Most restaurants and cafés accept UPI and cards, but carrying some cash is still useful for local shops, beach vendors, or smaller establishments.
        </p>

        <h3 className="font-display text-lg text-foreground mt-6">Is Parking Easy?</h3>
        <p>
          Compared to North Goa, yes. Most accommodations offer private parking, and visitors can also find public parking areas near the beach entrances. During peak season, beachfront parking fills up quickly, so arriving earlier in the day is recommended. If you're travelling by car, choosing accommodation with dedicated parking can save time and hassle.
        </p>

        <h3 className="font-display text-lg text-foreground mt-6">How Many Days Should You Spend in Agonda?</h3>
        <ul className="list-disc pl-6 space-y-1 text-muted-foreground text-sm">
          <li><strong>2 Days</strong>: Relax on the beach and explore the local cafés.</li>
          <li><strong>3–4 Days</strong>: Add Palolem, Patnem, and Cola Beach day trips.</li>
          <li><strong>5–7 Days</strong>: Explore South Goa comfortably, including Cabo de Rama Fort, Butterfly Beach, Galgibaga, Cotigao Wildlife Sanctuary, and yoga retreats.</li>
        </ul>

        <h3 className="font-display text-lg text-foreground mt-6">Is Agonda Expensive?</h3>
        <p>
          Agonda is often perceived as expensive because it's home to boutique resorts and premium beachfront villas, but it caters to a wide range of budgets. You can find budget beach huts for backpackers, mid-range boutique hotels, and luxury villas with private pools.
        </p>
        <p>
          One advantage of booking through Wayzyy is that you can compare verified holiday homes and villas directly, helping you find better value instead of relying solely on large hotel booking platforms.
        </p>

        <h3 className="font-display text-lg text-foreground mt-6">What Should You Pack?</h3>
        <p>
          For a comfortable trip to Agonda, consider packing lightweight cotton clothing, comfortable sandals, sunglasses, a hat, reusable water bottle, mosquito repellent, and a waterproof bag if travelling during monsoons. If you're remote working, bring chargers and extension cords.
        </p>

        <h3 className="font-display text-lg text-foreground mt-6">Is Agonda Better Than Staying in North Goa?</h3>
        <p>
          If your idea of Goa is beach clubs, nightlife, casinos, and shopping, North Goa may suit you better. However, if you're looking for peaceful beaches, slower mornings, scenic drives, boutique cafés, and easy access to South Goa's natural attractions, Agonda offers a completely different experience. You can read our comparison in the <Link to="/blog/north-goa-vs-south-goa-guide" className="text-ember hover:underline">North Goa vs South Goa Guide</Link>.
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
                className="w-full text-left px-6 py-4 flex items-center justify-between font-display text-foreground hover:bg-muted/50 transition-colors text-sm sm:text-base"
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
