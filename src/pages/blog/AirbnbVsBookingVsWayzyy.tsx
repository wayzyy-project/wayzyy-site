import { BlogLayout } from "@/components/BlogLayout";
import { blogPosts } from "@/lib/blogPosts";
import { HelpCircle } from "lucide-react";
import { useState } from "react";

const post = blogPosts.find((p) => p.slug === "airbnb-vs-booking-vs-wayzyy")!;

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      "name": "Is Airbnb better than Booking.com for hosts?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "It depends on your property type. Airbnb is generally better for unique stays, holiday villas, and experience-driven guest experiences where travellers expect personal interactions. Booking.com works exceptionally well for standardised apartments, guest houses, and hotels where guests prioritise instant booking convenience and location."
      }
    },
    {
      "@type": "Question",
      "name": "Which platform charges lower fees?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Wayzyy charges the lowest fees by far. Airbnb and Booking.com charge commissions ranging from 15% to 24% per booking, which directly reduces host margins. Wayzyy operates on a recharge-based model where hosts buy credits in advance, keeping the effective platform cost down to ~2-3% on larger booking volumes."
      }
    },
    {
      "@type": "Question",
      "name": "Can I list my property on Airbnb and Booking.com at the same time?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, you can list on multiple platforms simultaneously. Most professional hosts use a Channel Manager (like Djubo, Hostaway, or Guesty) to sync calendar availability in real-time, preventing double-bookings across Airbnb, Booking.com, and Wayzyy."
      }
    },
    {
      "@type": "Question",
      "name": "Which platform is better for villas in Goa?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "For villas in Goa, a combination works best. Airbnb is great for international travellers, but Wayzyy is tailored specifically around Goan leisure travel. Since family and group travel dominate Goa stays, Wayzyy's focus on group-centric bookings and commission-free pricing allows Goan villa owners to maximize their yield."
      }
    },
    {
      "@type": "Question",
      "name": "Is Wayzyy only for Goa properties?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Wayzyy started in Goa because it is India's premium vacation rental hub. However, the platform is expanding rapidly into other major leisure destinations across the country (such as Alibaug, Lonavala, and Karjat) where independent hosts manage premium holiday homes."
      }
    },
    {
      "@type": "Question",
      "name": "Which platform is best for first-time hosts?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Airbnb offers a highly user-friendly interface that makes it easy for first-time hosts to create a listing and start receiving reservations. However, once you understand the operations, adding Booking.com and Wayzyy is essential to avoid relying entirely on a single discovery channel."
      }
    },
    {
      "@type": "Question",
      "name": "Should I rely on only one booking platform?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "No. Depending entirely on a single source of bookings is risky. If that platform changes its visibility algorithm or hikes commissions, your business is instantly impacted. Diversifying across platforms ensures a steady, resilient stream of bookings."
      }
    },
    {
      "@type": "Question",
      "name": "Which platform gives hosts better long-term profitability?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Wayzyy offers the best long-term profitability because platform costs remain low and predictable. Instead of paying progressively larger commissions as you improve your property and increase occupancy, our recharge-based model lets you keep nearly 100% of your earnings to reinvest into your hosting business."
      }
    }
  ]
};

export default function AirbnbVsBookingVsWayzyy() {
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
      heroImageAlt="Excalidraw sketch diagram comparing Airbnb and Wayzyy business models and fees"
      publishedDate={post.publishedDate}
      slug={post.slug}
      extraJsonLd={faqJsonLd}
    >
      <div className="space-y-6">
        <h2 className="font-display text-2xl text-foreground mt-8">Airbnb vs Booking.com vs Wayzyy: A Side-by-Side Comparison</h2>
        
        <p>
          By now, you've probably realised there isn't a single platform that's objectively better than every other option.
        </p>
        <p>
          Each one was built with a different philosophy, attracts a different audience and supports hosts in different ways. That's why experienced operators don't simply ask which platform has the largest number of users—they ask which platform aligns with the kind of business they're trying to build.
        </p>
        <p>
          To make the comparison easier, here's a high-level overview of where each platform performs best.
        </p>

        {/* Comparison Table */}
        <div className="overflow-x-auto my-8 border border-border rounded-xl">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                <th className="p-4 font-display text-sm font-semibold text-foreground">Category</th>
                <th className="p-4 font-display text-sm font-semibold text-foreground">Airbnb</th>
                <th className="p-4 font-display text-sm font-semibold text-foreground">Booking.com</th>
                <th className="p-4 font-display text-sm font-semibold text-foreground">Wayzyy</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-sm">
              <tr>
                <td className="p-4 font-semibold text-foreground bg-muted/10">Primary Audience</td>
                <td className="p-4 text-muted-foreground">Experience seekers, families, international travellers</td>
                <td className="p-4 text-muted-foreground">Hotels, apartments, business travellers, global tourists</td>
                <td className="p-4 text-muted-foreground font-semibold text-foreground">Families, groups, villa travellers, holiday homes</td>
              </tr>
              <tr>
                <td className="p-4 font-semibold text-foreground bg-muted/10">Best Property Type</td>
                <td className="p-4 text-muted-foreground">Apartments, villas, unique stays</td>
                <td className="p-4 text-muted-foreground">Hotels, apartments, vacation rentals</td>
                <td className="p-4 text-muted-foreground font-semibold text-foreground">Villas, homestays, premium vacation rentals</td>
              </tr>
              <tr>
                <td className="p-4 font-semibold text-foreground bg-muted/10">Discovery</td>
                <td className="p-4 text-muted-foreground">Strong global marketplace</td>
                <td className="p-4 text-muted-foreground">Massive travel marketplace</td>
                <td className="p-4 text-muted-foreground font-semibold text-foreground">Curated, quality-focused discovery</td>
              </tr>
              <tr>
                <td className="p-4 font-semibold text-foreground bg-muted/10">Pricing Model</td>
                <td className="p-4 text-muted-foreground">Percentage-based booking fees</td>
                <td className="p-4 text-muted-foreground">Commission-based</td>
                <td className="p-4 text-muted-foreground font-semibold text-ember">Recharge-based model</td>
              </tr>
              <tr>
                <td className="p-4 font-semibold text-foreground bg-muted/10">Best For</td>
                <td className="p-4 text-muted-foreground">Hosts looking for worldwide exposure</td>
                <td className="p-4 text-muted-foreground">Properties targeting hotel-style bookings and international reach</td>
                <td className="p-4 text-muted-foreground font-semibold text-foreground">Independent hosts who want stronger long-term unit economics</td>
              </tr>
              <tr>
                <td className="p-4 font-semibold text-foreground bg-muted/10">Guest Experience</td>
                <td className="p-4 text-muted-foreground">Experience-focused</td>
                <td className="p-4 text-muted-foreground">Convenience-focused</td>
                <td className="p-4 text-muted-foreground font-semibold text-foreground">Hospitality-focused</td>
              </tr>
              <tr>
                <td className="p-4 font-semibold text-foreground bg-muted/10">Goa Suitability</td>
                <td className="p-4 text-muted-foreground">Excellent</td>
                <td className="p-4 text-muted-foreground">Strong</td>
                <td className="p-4 text-muted-foreground font-semibold text-foreground">Built around Goa and expanding into similar leisure destinations</td>
              </tr>
              <tr>
                <td className="p-4 font-semibold text-foreground bg-muted/10">Long-Term Philosophy</td>
                <td className="p-4 text-muted-foreground">Global marketplace</td>
                <td className="p-4 text-muted-foreground">Global travel platform</td>
                <td className="p-4 text-muted-foreground font-semibold text-foreground">Sustainable growth for independent hosts</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p>
          Looking at the table, one thing becomes obvious.
        </p>
        <p>
          Choosing a platform isn't simply about finding the one with the highest traffic.
        </p>
        <p>
          Imagine you're running a boutique hotel in the middle of a busy city. Booking.com may naturally become an important source of reservations because travellers are already comparing hotels, apartments and business accommodation in one place. Now imagine you own a private villa in North Goa where families stay for five nights, cook together, spend evenings by the pool and treat the property as their home during the trip. That guest journey is completely different, which means the platform serving those guests should also understand those expectations.
        </p>
        <p>
          That's one of the biggest reasons we decided to build Wayzyy around vacation rentals rather than trying to become everything for everyone.
        </p>
        <p>
          Instead of filling the platform with every possible type of accommodation, we've focused on creating a marketplace where quality homes receive the attention they deserve and travellers can confidently book properties designed around comfort, hospitality and transparency. That philosophy naturally resonates with destinations like Goa, where many visitors aren't simply looking for a place to sleep—they're looking for a place to spend time together.
        </p>
        <p>
          Of course, none of this means you should only list on one platform.
        </p>
        <p>
          In fact, we'd argue the opposite.
        </p>
        <p>
          Many experienced hosts treat different booking platforms as different marketing channels. Airbnb might bring one type of traveller, Booking.com another and direct bookings gradually become more important as repeat guests return year after year. Diversifying your booking sources reduces dependency on any single marketplace while helping maintain occupancy throughout the year.
        </p>
        <p>
          That's where the real comparison begins.
        </p>
        <p>
          It's no longer about choosing between three logos.
        </p>
        <p>
          It's about deciding which combination of platforms helps you build the healthiest business over the next five or ten years.
        </p>

        <h2 className="font-display text-2xl text-foreground mt-8">So...Which Platform Would We Choose If We Were Starting Today?</h2>
        
        <p>
          After spending months speaking with hosts and understanding how different booking platforms operate, we've realised there isn't a single answer that works for everyone.
        </p>
        <p>
          Everything depends on the property you own, the guests you want to attract and the kind of business you're trying to build over the next few years.
        </p>
        <p>
          If we had purchased a city apartment catering primarily to business travellers or short overnight stays, Booking.com would almost certainly be part of our strategy. Its global reach and strong presence in the hotel industry make it an excellent channel for properties that rely on a steady flow of domestic and international travellers.
        </p>
        <p>
          Ignoring Airbnb would also be difficult.
        </p>
        <p>
          Few companies have changed the short-term rental industry as dramatically as Airbnb. The platform introduced millions of people to unique stays, holiday homes and local experiences, making it one of the strongest discovery channels available for hosts looking to reach travellers from around the world.
        </p>
        <p>
          Our thinking would begin to change, however, if we were launching a villa, a premium homestay or a family-focused vacation rental in destinations like Goa.
        </p>
        <p>
          Travellers visiting Goa rarely book just a place to sleep. Families want enough room for everyone to stay together, groups of friends look for private pools and shared living spaces, while longer-stay guests appreciate fully equipped kitchens, dedicated workspaces and the comfort of feeling at home throughout their trip. Those expectations are very different from what someone booking a single hotel room for one night is usually looking for.
        </p>
        <p>
          That's exactly the segment we built Wayzyy for.
        </p>
        <p>
          Instead of creating another marketplace that earns a sizeable percentage from every reservation, we questioned whether there was a better way to support independent hosts. Most property owners already spend heavily on housekeeping, maintenance, caretakers, utilities and continuous upgrades. Watching another <strong className="text-foreground">15–16% or more</strong> disappear from every successful booking makes it much harder to reinvest in the business over time.
        </p>
        <p>
          Our approach is different.
        </p>
        <p>
          Wayzyy works on a <strong className="text-ember">recharge-based credit model</strong>. Hosts purchase booking credits in advance, and as booking volume grows, the effective platform cost typically comes down to around <strong className="text-foreground">2–3%</strong> of the booking value rather than losing a large percentage on every reservation. Instead of increasing the platform's earnings every time your business grows, that difference allows more of your revenue to stay exactly where it belongs—with the host.
        </p>
        <p>
          Think about what those savings can do over the course of a year.
        </p>
        <p>
          Rather than paying higher recurring commissions, that money could fund a full-time caretaker, renovate a bedroom, upgrade your swimming pool, improve Wi-Fi, replace ageing furniture or simply create a financial buffer during the quieter months. Every improvement benefits the next guest, strengthens reviews and increases the long-term value of the property.
        </p>
        <p>
          If we were launching our first villa in Goa today, we still wouldn't rely on only one platform.
        </p>
        <p>
          Airbnb would help us reach international travellers.
        </p>
        <p>
          Booking.com would continue bringing guests who naturally search within its ecosystem.
        </p>
        <p>
          Alongside those channels, we'd also choose a platform like Wayzyy because its business model is designed around helping independent hosts retain more of what they earn instead of paying a large commission every time someone books.
        </p>
        <p>
          That, more than anything else, has been our biggest takeaway while building Wayzyy.
        </p>
        <p>
          The most successful hosts aren't only thinking about their next reservation.
        </p>
        <p>
          They're thinking about what their business will look like after five years, hundreds of bookings and countless improvements to their property.
        </p>
        <p>
          Choosing a booking platform isn't simply about visibility.
        </p>
        <p className="font-semibold text-foreground text-center text-lg italic my-4">
          It's about selecting a business model that gives you the best chance of building a profitable and sustainable hospitality business over the long term.
        </p>

        <h2 className="font-display text-2xl text-foreground mt-8">Final Thoughts</h2>
        
        <p>
          Choosing a booking platform is one of the first decisions you'll make as a host.
        </p>
        <p>
          It shouldn't be the only one.
        </p>
        <p>
          Long before the first guest arrives, you'll decide how you want to run your business. Some hosts compete on the lowest price. Others invest in exceptional hospitality. Many focus on creating memorable spaces that guests recommend to their friends and family. Those choices have a much bigger impact on long-term success than simply deciding where the listing goes live.
        </p>
        <p>
          Technology should support those decisions rather than dictate them.
        </p>
        <p>
          A booking platform is ultimately a distribution channel. It can introduce your property to travellers across the world, simplify reservations and build trust with guests who have never stayed with you before. None of those things, however, replace the effort that goes into maintaining a beautiful home or delivering an unforgettable experience.
        </p>
        <p>
          Hospitality has always been created by people.
        </p>
        <p className="font-semibold text-center text-lg text-ember">
          Platforms simply make it easier for those people to be discovered.
        </p>
        <p>
          That's also why we don't believe hosts should think in terms of loyalty to one marketplace. Successful operators usually diversify their distribution, learn what works for different guest segments and gradually build a business that's resilient enough to adapt as the industry evolves. Depending entirely on a single source of bookings may feel convenient in the beginning, but building multiple channels creates far greater stability over the long run.
        </p>
        <p>
          Goa is a perfect example of why that matters.
        </p>
        <p>
          The market continues to evolve every year. Families are choosing private villas over multiple hotel rooms, groups of friends are looking for homes where they can spend time together and longer stays have become increasingly common as remote work makes flexible travel easier. Those changing travel patterns create opportunities for hosts who understand what modern travellers actually value instead of simply following trends.
        </p>
        <p>
          Building Wayzyy has reinforced one lesson above everything else.
        </p>
        <p>
          Hosts don't just need another place to list their property.
        </p>
        <p className="font-semibold text-center italic my-2">
          They need a partner that understands hospitality, respects the economics of running a vacation rental and genuinely wants them to succeed over the long term.
        </p>
        <p>
          That's the philosophy we've carried into every decision we've made.
        </p>
        <p>
          Rather than asking how many bookings we can process, we spend more time asking how we can help independent hosts build stronger businesses. Better economics allow owners to invest back into their homes. Better homes create happier guests. Happier guests leave stronger reviews, recommend the property to others and return for future holidays. Over time, that positive cycle benefits everyone involved.
        </p>
        <p>
          Airbnb deserves credit for transforming the way people travel.
        </p>
        <p>
          Booking.com has built one of the world's largest travel marketplaces and continues connecting millions of travellers with accommodation every single day.
        </p>
        <p>
          Wayzyy isn't trying to erase what those platforms have built.
        </p>
        <p>
          We're trying to solve a different problem.
        </p>
        <p>
          Our mission is to help independent hosts—especially those managing villas, homestays and vacation rentals in destinations like Goa—build businesses that remain profitable, sustainable and rewarding for years to come.
        </p>
        <p>
          At the end of the day, the best platform isn't necessarily the one with the biggest brand or the highest number of listings.
        </p>
        <p className="font-semibold text-foreground text-center text-lg italic my-4">
          It's the one that helps you build the kind of hosting business you're proud to run five years from now.
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
