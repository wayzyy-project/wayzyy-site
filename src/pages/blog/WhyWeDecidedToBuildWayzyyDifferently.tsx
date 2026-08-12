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
      "name": "Is Airbnb still profitable for hosts in India?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, but profitability depends on much more than occupancy. Operating costs such as cleaning, maintenance, utilities, platform commissions and property management all affect the final profit. Hosts who understand their expenses and optimise their operations generally perform much better over the long term."
      }
    },
    {
      "@type": "Question",
      "name": "How much commission does Airbnb charge hosts?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Depending on the pricing model and booking structure, hosts can effectively pay around 16–24% through platform commissions and associated fee structures. The exact amount varies based on the listing setup, country and booking type."
      }
    },
    {
      "@type": "Question",
      "name": "Is running an Airbnb passive income?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Not really. Hosting is a hospitality business. Guest communication, check-ins, cleaning, maintenance, pricing updates and property management all require continuous attention. While many tasks can be automated, successful hosting still involves active management."
      }
    },
    {
      "@type": "Question",
      "name": "Should I list my property on only one booking platform?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Most experienced hosts recommend diversifying across multiple booking channels rather than depending entirely on a single platform. This reduces business risk and helps maintain bookings if one platform changes its policies or visibility."
      }
    },
    {
      "@type": "Question",
      "name": "What is the biggest mistake first-time Airbnb hosts make?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Many new hosts focus only on potential revenue while underestimating operating costs. Cleaning, maintenance, platform commissions, guest support and recurring expenses have a significant impact on long-term profitability."
      }
    },
    {
      "@type": "Question",
      "name": "Why was Wayzyy created?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Wayzyy was built after speaking with property owners who wanted a more transparent and host-friendly business model. Instead of relying on high recurring commissions, the platform focuses on helping hosts retain more of their earnings while giving guests access to quality short-term rentals with transparent pricing."
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
          The platform still provides professional support, secure bookings and reliable hospitality - but without making every successful booking progressively more expensive for the person who owns the property.
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
          Instead of asking how much commission a platform could charge, we asked ourselves how much money a host should realistically be able to keep. After all, the person investing in the property, hiring the caretaker, paying for maintenance and creating a memorable guest experience is the host - not the marketplace.
        </p>
        <p>
          That single question eventually shaped the way Wayzyy works today.
        </p>
        <p>
          Rather than taking a large share from every reservation, we chose a model that keeps platform costs predictable and significantly lower over the long run. As hosts grow their business, more of their revenue stays exactly where it should - inside the business itself. Those savings can be invested in better interiors, faster internet, improved amenities, additional staff or simply building a healthier business with stronger cash flow.
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

        <h2 className="font-display text-2xl text-foreground mt-8">Looking Ahead</h2>
        
        <p>
          The short-term rental industry in India is still evolving, and that's exactly what makes this an exciting time to become a host. More travellers are choosing villas, homestays and vacation rentals over conventional hotel rooms because they're looking for larger spaces, private amenities and experiences that feel more personal than a standard hotel stay.
        </p>
        <p>
          Growing demand, however, is only one side of the equation.
        </p>
        <p>
          Running a successful property still depends on the decisions made behind the scenes. Choosing the right pricing strategy, maintaining the home, investing in hospitality and keeping operating costs under control will always matter more than simply increasing occupancy. Revenue might look impressive on paper, but profitability is what determines whether the business remains sustainable.
        </p>
        <p>
          Experienced hosts understand this better than anyone.
        </p>
        <p>
          After the excitement of the first few bookings fades away, attention naturally shifts towards improving the property instead of chasing quick wins. Some decide to renovate a bedroom, while others upgrade their Wi-Fi, redesign outdoor spaces or hire additional staff to improve the guest experience. Every improvement creates a stronger property, and stronger properties usually attract better reviews, repeat visitors and healthier long-term returns.
        </p>
        <p>
          That's where we believe the industry should be heading.
        </p>
        <p>
          Imagine a marketplace where the success of a host doesn't automatically mean a larger deduction from every booking. Picture a model where owners have more freedom to reinvest in their homes, travellers benefit from fairer pricing and hospitality becomes the biggest competitive advantage rather than aggressive discounting.
        </p>
        <p>
          Those ideas aren't just ambitions for us - they're the principles behind everything we're building at Wayzyy.
        </p>
        <p>
          Our objective isn't to replace every booking platform that already exists. Millions of travellers rely on established marketplaces, and they'll continue to play an important role in the travel ecosystem. What we're trying to change is the experience for independent hosts by offering another path - one that focuses on healthier unit economics, transparent pricing and long-term sustainability instead of larger recurring commissions.
        </p>
        <p>
          Success, in our eyes, isn't measured by how much revenue a platform extracts from a booking.
        </p>
        <p>
          It's reflected in the number of hosts who can confidently invest in their properties year after year because their business generates enough cash flow to support that growth. Better-maintained homes create happier guests, happier guests leave stronger reviews and stronger reviews help hosts build businesses that last.
        </p>
        <p>
          Ultimately, that's the kind of ecosystem we want to contribute to.
        </p>
        <p>
          One where platforms succeed because hosts succeed, not because they continue taking a bigger share of every reservation. If the people opening their homes to travellers are able to earn more, improve more and deliver exceptional hospitality, everyone involved - from the property owner to the guest - wins together.
        </p>

        <h2 className="font-display text-2xl text-foreground mt-8">Final Thoughts</h2>
        
        <p>
          When we first started building Wayzyy, we thought we were entering the short-term rental business.
        </p>
        <p>
          The more conversations we had with hosts, the more we realised we were actually entering the hospitality business.
        </p>
        <p>
          Properties can always be renovated. Furniture gets replaced over time. Amenities improve with every season, and technology keeps changing the way bookings are managed. What never changes is the effort that goes into making every guest feel welcome. That's something no platform can automate completely, and it's the reason great hosts continue to stand out regardless of where their listings appear.
        </p>
        <p>
          Running a successful vacation rental has never been about listing a property and waiting for bookings to arrive.
        </p>
        <p>
          Building trust, responding quickly, maintaining high standards and continuously improving the experience are what create businesses that last. Revenue matters, but the ability to retain more of that revenue matters just as much. Every unnecessary expense reduces the amount that could have been invested back into the property, and every improvement postponed today often becomes a missed opportunity tomorrow.
        </p>
        <p>
          Looking ahead, we believe independent hosts deserve business models that reward the effort they put into creating exceptional stays. That's exactly why Wayzyy exists. Our goal isn't to convince every property owner to abandon the platforms they're already using. Instead, we want to provide another option - one that believes success should be shared with the people creating the experience rather than relying on increasingly expensive commission structures.
        </p>
        <p>
          Hospitality has always been a people-first business.
        </p>
        <p className="font-semibold text-center text-lg text-ember">
          Technology should make that business easier, not more expensive.
        </p>
        <p>
          If hosts can retain more of what they earn, they can invest more confidently in their homes. Better homes create better guest experiences, stronger reviews encourage more bookings and healthier businesses continue raising the standard of short-term rentals across the country. That's the cycle we want to help build.
        </p>
        <p>
          This article wasn't written to discourage anyone from becoming a host.
        </p>
        <p>
          Quite the opposite.
        </p>
        <p>
          Our intention was to help you start with realistic expectations instead of unrealistic promises. Understanding the economics, planning for operational costs and choosing the right partners from the beginning will have a far bigger impact on your journey than chasing the highest occupancy in your first month.
        </p>
        <p>
          The opportunity has never been bigger.
        </p>
        <p>
          Families are choosing villas over hotel rooms, remote professionals are booking longer stays, groups want private spaces and travellers increasingly value experiences that feel like home. Property owners who combine great hospitality with smart business decisions are in the best position to benefit from that shift.
        </p>
        <p>
          If you're thinking about starting your first short-term rental, take the time to understand how the business really works before deciding where to list.
        </p>
        <p className="font-semibold text-foreground text-center text-lg italic my-2">
          The platform you choose should help your business become stronger every year - not simply become more expensive with every booking.
        </p>
        <p>
          That's the philosophy we've built Wayzyy around, and it's the standard we'll continue working towards as we grow.
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
