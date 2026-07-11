import { BlogLayout } from "@/components/BlogLayout";
import { blogPosts } from "@/lib/blogPosts";
import { HelpCircle } from "lucide-react";
import { useState } from "react";

const post = blogPosts.find((p) => p.slug === "why-we-decided-to-build-wayzyy-differently")!;

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      "name": "Why did Wayzyy choose a credit-based subscription instead of commissions?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "We chose a prepaid credit model to eliminate the high commissions (typically 15-20%) charged by traditional short-term rental platforms. By purchasing booking credits upfront, hosts can keep nearly 100% of their reservation payouts, making their businesses more sustainable and allowing them to price stays more competitively for guests."
      }
    },
    {
      "@type": "Question",
      "name": "How does Wayzyy's credit model average to a ~2% effective platform cost?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "On our standard host plans, you purchase booking credits in bulk (for example, paying ₹1,000 to unlock ₹50,000 in reservations). This flat fee equates to an effective cost of only ~2% on the bookings you secure, compared to the 16-24% combined take rates charged by legacy booking platforms."
      }
    },
    {
      "@type": "Question",
      "name": "What are the benefits of a flat-fee subscription for vacation rental hosts?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "A flat-fee model makes your operating costs completely predictable. Instead of paying progressively larger commissions as you increase nightly rates or achieve higher occupancy, your platform costs stay fixed, allowing you to reinvest the savings back into property maintenance, interiors, caretakers, and better amenities."
      }
    },
    {
      "@type": "Question",
      "name": "Does Wayzyy charge guests any service fees or hidden costs?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "No. Unlike legacy platforms that add up to 14% guest service fees at checkout, Wayzyy keeps booking prices transparent. Because hosts are not paying heavy commissions, they can offer their true pricing, ensuring guests avoid high markups and check out without surprise fees."
      }
    },
    {
      "@type": "Question",
      "name": "How does Wayzyy support hosts in building independent businesses?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "We believe hosts are the ones investing capital, managing properties, and delivering great hospitality. Wayzyy provides secure payments, verified guest checks (via Aadhaar/DigiLocker), and reliable customer support without manipulating your nightly rates or enforcing Smart Pricing algorithms that lower host margins."
      }
    },
    {
      "@type": "Question",
      "name": "Can I use Wayzyy alongside other short-term rental platforms?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. Hosts can list their properties on Wayzyy while maintaining listings on other booking sites. The predictable subscription credits only apply to reservations processed through the Wayzyy marketplace, giving you the flexibility to manage bookings as you see fit."
      }
    }
  ]
};

export default function WhyWeDecidedToBuildWayzyyDifferently() {
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
      heroImageAlt="A business graphic showing the comparison of Airbnb commission rates vs Wayzyy subscription fees"
      publishedDate={post.publishedDate}
      slug={post.slug}
      extraJsonLd={faqJsonLd}
    >
      <div className="space-y-6">
        <h2 className="font-display text-2xl text-foreground mt-8">Why We Decided to Build Wayzyy Differently</h2>
        
        <p>
          When we started speaking with hosts, we weren't trying to convince anyone to move away from Airbnb or Booking.com.
        </p>
        <p>
          In fact, most of the people we met were happy with the visibility these platforms provided. Millions of travellers use them every day, and they've played a huge role in making short-term rentals mainstream. The problem wasn't getting discovered.
        </p>
        <p>
          The problem was what happened after every booking.
        </p>
        <p>
          The same concern kept coming up in conversation after conversation.
        </p>
        <p className="font-display text-lg italic text-center text-muted-foreground my-4">
          &quot;I don't mind paying for a platform. I just don't want to keep giving away a large percentage every single time someone books.&quot;
        </p>
        <p>
          That's a very reasonable concern.
        </p>
        <p>
          If a platform genuinely helps you acquire customers, manage bookings and build trust, it deserves to earn money. The question isn't whether a platform should make money. The question is how it should make money.
        </p>
        <p>
          Most booking platforms earn more every time your property earns more. As your nightly prices increase or occupancy improves, the commission collected also grows because it's tied directly to every booking.
        </p>
        <p>
          We looked at that model and asked ourselves a simple question.
        </p>
        <p className="font-semibold text-ember text-center text-lg italic my-2">
          What if the platform wasn't rewarded by taking a percentage of every reservation forever?
        </p>
        <p>
          That question became the foundation of Wayzyy.
        </p>
        <p>
          Instead of building another commission-first marketplace, we built a credit-based model. Hosts purchase credits upfront and continue accepting bookings without losing a large percentage from every reservation. On larger plans, the effective platform cost comes down to around 2%, allowing hosts to retain far more of the revenue they've worked hard to generate.
        </p>
        <p>
          At first glance, the difference between 2% and 16–24% might just look like another percentage.
        </p>
        <p>
          Over the course of a year, it becomes much more than that.
        </p>
        <p className="font-semibold text-foreground text-center text-lg italic my-2">
          It's money that could be spent improving the property instead of paying recurring commissions.
        </p>
        <p>
          It's money that could go towards hiring a better caretaker, upgrading furniture, adding a private plunge pool, installing faster Wi-Fi, improving housekeeping or simply building a reserve for maintenance during the off-season.
        </p>
        <p>
          Ultimately, better economics don't just benefit the host.
        </p>
        <p>
          They benefit the guest as well.
        </p>
        <p>
          When property owners aren't forced to recover large recurring commissions, they're in a much better position to keep their pricing competitive. That means travellers can often book the same quality stay without seeing inflated checkout prices caused by multiple layers of platform fees.
        </p>
        <p>
          That's the ecosystem we wanted to create.
        </p>
        <p>
          Hosts keep more of what they earn.
        </p>
        <p>
          Guests pay pricing that feels transparent.
        </p>
        <p>
          The platform still provides professional support, secure bookings and reliable hospitality—but without making every successful booking progressively more expensive for the person who owns the property.
        </p>
        <p>
          We don't believe the future of short-term rentals is about charging the highest commission possible.
        </p>
        <p>
          We believe it's about building a platform where the host succeeds first, because when hosts have healthier businesses, they naturally invest more into their homes, deliver better hospitality and create better experiences for every guest who walks through the door.
        </p>
        <p>
          And in the long run, that's a model that benefits everyone involved.
        </p>

        <img
          src="/blog/why-we-decided-to-build-wayzyy-differently.webp"
          alt="A business graphic showing the comparison of Airbnb commission rates vs Wayzyy subscription fees"
          className="w-full aspect-video object-cover rounded-2xl border border-border my-8"
          loading="lazy"
        />

        <h2 className="font-display text-2xl text-foreground mt-8">Building a Better Model for Hosts and Guests</h2>
        
        <p>
          One thing became very clear as we continued speaking with more hosts.
        </p>
        <p>
          Nobody expected to run a short-term rental business without paying for a platform. Every owner understood that marketplaces invest heavily in acquiring customers, processing payments and building trust with travellers across the world. Paying for that value is completely reasonable.
        </p>
        <p>
          Where the frustration started was somewhere else.
        </p>
        <p>
          Most hosts felt like they were paying the same percentage forever, regardless of how much effort they put into improving their property. Better reviews, higher occupancy and stronger pricing meant more revenue for the platform too, simply because the commission kept growing with every successful booking.
        </p>
        <p>
          That made us question whether there was another way to think about the problem.
        </p>
        <p>
          Instead of asking how much commission a platform could charge, we asked ourselves how much money a host should realistically be able to keep. After all, the person investing in the property, hiring the caretaker, paying for maintenance and creating a memorable guest experience is the host—not the marketplace.
        </p>
        <p>
          That single question eventually shaped the way Wayzyy works today.
        </p>
        <p>
          Rather than taking a large share from every reservation, we chose a model that keeps platform costs predictable and significantly lower over the long run. As hosts grow their business, more of their revenue stays exactly where it should—inside the business itself. Those savings can be invested in better interiors, faster internet, improved amenities, additional staff or simply building a healthier business with stronger cash flow.
        </p>
        <p>
          Guests benefit from that approach as well.
        </p>
        <p>
          When property owners aren't trying to recover a substantial platform commission from every booking, there's more room to offer competitive pricing without compromising the quality of the stay. Transparent pricing builds confidence, fewer hidden costs reduce booking hesitation and everyone involved has a much clearer understanding of what they're paying for.
        </p>
        <p>
          Ultimately, that was never just a pricing decision.
        </p>
        <p className="font-semibold text-ember text-center text-lg italic my-2">
          It was a business philosophy.
        </p>
        <p>
          Healthy hosts create better homes. Better homes lead to happier guests. Satisfied guests leave stronger reviews, which in turn help hosts grow even further. When every participant in the ecosystem benefits, the platform succeeds as a natural outcome instead of extracting value at every opportunity.
        </p>
        <p>
          That's the kind of marketplace we believe the short-term rental industry deserves, and it's the standard we're working towards with every home listed on Wayzyy every single day.
        </p>

        <h2 className="font-display text-2xl text-foreground mt-8">The Future of Short-Term Rentals Won't Be Built on Higher Commissions</h2>
        
        <p>
          The short-term rental industry in India is still in its early stages.
        </p>
        <p>
          Every year, more homeowners are converting second homes into vacation rentals, more travellers are choosing homestays over traditional hotels and more families are looking for experiences that feel personal rather than standardised. That's great news for hosts because the opportunity continues to grow.
        </p>
        <p>
          Growth alone, however, doesn't guarantee a healthy business.
        </p>
        <p>
          A property with high occupancy can still struggle if operating costs keep rising faster than revenue. Likewise, a villa that receives consistent bookings won't necessarily become more profitable if a sizeable percentage of every reservation continues to disappear in recurring platform fees. Sustainable businesses aren't built by focusing only on revenue—they're built by managing costs just as carefully.
        </p>
        <p>
          That's something we kept hearing from experienced hosts.
        </p>
        <p>
          Once the excitement of the first few bookings wears off, attention naturally shifts towards improving margins. Every decision starts getting evaluated differently. Should that extra money go towards paying another commission, or should it be invested in renovating a bedroom? Would faster Wi-Fi create happier guests? Could hiring an additional caretaker improve reviews? Is it better to upgrade the pool, replace ageing furniture or simply build a financial cushion for the off-season?
        </p>
        <p>
          Those are the decisions that help a property grow over time.
        </p>
        <p>
          Every rupee saved on unnecessary recurring costs becomes another opportunity to improve the guest experience. Better hospitality leads to stronger reviews, stronger reviews increase trust and higher trust often translates into better occupancy without relying entirely on discounts.
        </p>
        <p>
          That's the cycle we believe hosts should benefit from.
        </p>
        <p>
          Instead of watching success increase someone else's commission, we'd rather see successful hosts reinvest that money back into their own business. Better homes create better stays, and better stays naturally attract more travellers. In the long run, everyone benefits when the people creating the experience have more resources to improve it.
        </p>
        <p>
          Wayzyy was built around that belief.
        </p>
        <p>
          Our goal isn't simply to help you receive bookings. We want to help you build a business that still feels rewarding years from now, not just during your first busy season. If hosts earn more, they can invest more. If they invest more, guests enjoy better stays. When guests leave happier, the entire ecosystem becomes stronger.
        </p>
        <p>
          That's the kind of growth we're working towards—not growth driven by bigger commissions, but growth driven by better hospitality.
        </p>

        <h2 className="font-display text-2xl text-foreground mt-8">Final Thoughts</h2>
        
        <p>
          When we first started talking to property owners, we expected the conversations to revolve around occupancy, pricing and attracting more guests.
        </p>
        <p>
          Instead, something else kept coming up.
        </p>
        <p>
          People weren't looking for another platform.
        </p>
        <p className="font-semibold text-center italic my-2">
          They were looking for a better way to build a business.
        </p>
        <p>
          Most hosts had already accepted that running a short-term rental would involve hard work. Cleaning between bookings, maintaining the property, responding to guest messages and constantly improving the experience all come with the territory. Those responsibilities are part of hospitality, and nobody we spoke to expected otherwise.
        </p>
        <p>
          What surprised us was how many owners felt they had very little control over the costs that came after every booking. Platform commissions continued to grow as their business grew, yet the responsibility of delivering a great stay still rested entirely on the host. That imbalance was difficult to ignore.
        </p>
        <p>
          Building Wayzyy wasn't about proving that another marketplace could exist.
        </p>
        <p>
          It was about asking whether the business model itself could become fairer.
        </p>
        <p>
          Could hosts keep more of what they earned?
        </p>
        <p>
          Could travellers book the same quality homes without paying inflated prices created by multiple layers of platform fees?
        </p>
        <p>
          Would a simpler pricing structure encourage owners to invest more into hospitality instead of budgeting around recurring commissions?
        </p>
        <p>
          Those were the questions that shaped every decision we made.
        </p>
        <p>
          Our belief is straightforward.
        </p>
        <p className="font-semibold text-ember text-center text-lg italic my-2">
          A platform succeeds when its hosts succeed.
        </p>
        <p>
          Every additional rupee a host saves can become a renovated bedroom, a faster internet connection, better housekeeping, a well-paid caretaker or a more memorable experience for the next guest. Improvements like these don't just benefit one booking—they raise the standard of the property for years to come.
        </p>
        <p>
          Guests notice that difference.
        </p>
        <p>
          Hosts feel that difference.
        </p>
        <p>
          The industry grows because of that difference.
        </p>
        <p>
          That's the future we believe short-term rentals deserve.
        </p>
        <p>
          If you're planning to list your first property, don't choose a platform based only on how many users it has. Spend some time understanding how the business works, where your money goes and whether the platform helps you build a stronger business over the long run.
        </p>
        <p>
          The first booking is exciting.
        </p>
        <p>
          The hundredth booking is what determines whether you've built a sustainable business.
        </p>
        <p>
          That's the journey we're committed to supporting at Wayzyy, and this article is just the beginning. In the next guide, we'll break down Airbnb vs Booking.com vs Wayzyy, compare the economics side by side and help you understand which model makes the most sense for different kinds of hosts.
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
    </BlogLayout>
  );
}
