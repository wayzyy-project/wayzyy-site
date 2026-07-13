import { BlogLayout } from "@/components/BlogLayout";
import { blogPosts } from "@/lib/blogPosts";
import { Link } from "react-router-dom";
import { Coffee, Wifi, BatteryCharging, AlertCircle, HelpCircle } from "lucide-react";
import { useState } from "react";

const post = blogPosts.find((p) => p.slug === "goa-work-cafes-guide")!;

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      "name": "What are the best work-friendly cafes in Assagao?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Blue Tokai and Mojigao are the top choices in Assagao. Blue Tokai offers highly dependable indoor workspaces and specialty coffee, while Mojigao provides a serene outdoor jungle setting with multiple power strips for laptop charging."
      }
    },
    {
      "@type": "Question",
      "name": "Do cafes in Goa have reliable power backup?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Many independent cafes (like Mojigao and Babka) have generator or inverter backup systems, which are crucial during monsoon power outages. However, always check before choosing a cafe for critical work sessions."
      }
    },
    {
      "@type": "Question",
      "name": "Is Hard Rock Cafe Goa good for working remotely?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "No. While Hard Rock Cafe Goa is a famous branded venue, it is designed for dining, drinks, and loud music rather than quiet remote work, lacking stable study desks and accessible charging points."
      }
    },
    {
      "@type": "Question",
      "name": "What is the typical cost of working from a cafe in Goa?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Expect to spend between ₹500 and ₹800 per session, which comfortably covers a specialty coffee, breakfast or lunch, and access to high-speed Wi-Fi."
      }
    },
    {
      "@type": "Question",
      "name": "Should I choose a cafe or a coworking space in Goa?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Choose cafes if your work is creative, flexible, and doesn't involve constant client video calls. Choose dedicated coworking spaces if you have fixed schedules, client meetings, or cross-timezone team coordination."
      }
    }
  ]
};

export default function GoaWorkCafesGuide() {
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
      heroImageAlt="Comfortable outdoor seating under canopy at Cafe Candolim, Goa"
      publishedDate={post.publishedDate}
      slug={post.slug}
      extraJsonLd={faqJsonLd}
    >
      {/* 1. Intro */}
      <div className="space-y-6">
        <p>
          One of the biggest reasons people end up staying in Goa longer than planned is surprisingly simple.
        </p>
        <p className="font-semibold text-foreground text-lg italic text-center py-2">
          They find a café where work doesn't feel like work anymore.
        </p>
        <p>
          Over the last few years, North Goa has become one of India's most popular destinations for remote workers, founders, freelancers and creators. As a result, many cafés have quietly evolved beyond serving good coffee. Reliable fibre internet, accessible plug points, comfortable seating and a relaxed atmosphere are now just as important as the food itself. The difference is noticeable—some cafés actively welcome people working for several hours, while others are much better suited for a leisurely breakfast before heading to the beach.
        </p>
        <p>
          If you're planning to spend half a day working, choosing the right café makes all the difference.
        </p>
      </div>

      {/* 2. Top Cafes */}
      <div className="space-y-8 mt-10">
        {/* Blue Tokai */}
        <div className="border-l-4 border-ember pl-6 space-y-3">
          <h3 className="font-display text-xl font-bold text-foreground">
            <a 
              href="https://www.google.com/maps/search/?api=1&query=Blue+Tokai+Coffee+Roasters+Assagao+Goa" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:text-ember transition-colors inline-flex items-center gap-1"
            >
              Blue Tokai — Assagao <span className="text-xs font-normal text-muted-foreground/60">↗</span>
            </a>
          </h3>
          <p>
            Blue Tokai has become one of the most dependable choices for remote workers in North Goa. The coffee is consistently good, the internet remains stable even during busy periods and there's enough indoor seating to comfortably spend a few hours working.
          </p>
          <p>
            One thing worth knowing before you arrive is that the tables with easy access to power outlets fill up quickly, especially after mid-morning. If you're planning meetings or a longer work session, arriving before 10 a.m. is usually a smart idea. Research consistently highlights it as one of the most reliable work cafés in the region, with stable Wi-Fi and a typical spend of around ₹500 for a few hours including coffee and food.
          </p>
          <span className="text-xs font-semibold text-ember uppercase block">Best for: Remote work, video calls, speciality coffee and solo work sessions.</span>
        </div>

        {/* Mojigao */}
        <div className="border-l-4 border-ember pl-6 space-y-3">
          <h3 className="font-display text-xl font-bold text-foreground">
            <a 
              href="https://www.google.com/maps/search/?api=1&query=Mojigao+Assagao+Goa" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:text-ember transition-colors inline-flex items-center gap-1"
            >
              Mojigao — Assagao <span className="text-xs font-normal text-muted-foreground/60">↗</span>
            </a>
          </h3>
          <p>
            Hidden away from the main roads, Mojigao feels less like a commercial café and more like someone's thoughtfully designed garden.
          </p>
          <p>
            It's one of those places where people arrive intending to stay for an hour and end up spending the entire afternoon. The relaxed outdoor setting, excellent food and surprisingly reliable internet have made it a favourite among long-term visitors. Unlike many cafés where finding a charging point becomes a daily challenge, Mojigao has multiple power strips available, making it genuinely practical for longer work sessions. The research even notes creators editing and uploading full podcast episodes here without connection issues—something that speaks louder than simply calling the Wi-Fi &quot;good.&quot;
          </p>
          <span className="text-xs font-semibold text-ember uppercase block">Best for: Writers, designers, freelancers and anyone who enjoys working outdoors.</span>
        </div>

        {/* Babka */}
        <div className="border-l-4 border-ember pl-6 space-y-3">
          <h3 className="font-display text-xl font-bold text-foreground">
            <a 
              href="https://www.google.com/maps/search/?api=1&query=Babka+Goa+Anjuna" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:text-ember transition-colors inline-flex items-center gap-1"
            >
              Babka — Anjuna <span className="text-xs font-normal text-muted-foreground/60">↗</span>
            </a>
          </h3>
          <p>
            If your perfect workday starts with exceptional pastries and speciality coffee, Babka deserves a place on your list.
          </p>
          <p>
            The café has built a strong reputation for consistently fast internet, comfortable indoor seating and some of the best baked goods in North Goa. While the outdoor garden area is beautiful, it's the indoor seating that's better suited for longer work sessions because of easier access to plug points and a more stable working environment. Expect to spend around ₹700 if you're planning to stay for several hours, including breakfast or lunch.
          </p>
          <span className="text-xs font-semibold text-ember uppercase block">Best for: Long work sessions, breakfast meetings and excellent pastries.</span>
        </div>

        <div className="my-8">
          <img
            src="/blog/goa-cafe-jameson.webp"
            alt="Warm indoor workspace bar at a cozy local cafe in Goa"
            className="w-full rounded-2xl border border-border object-cover aspect-video"
            loading="lazy"
          />
        </div>

        {/* Artjuna */}
        <div className="border-l-4 border-ember pl-6 space-y-3">
          <h3 className="font-display text-xl font-bold text-foreground">
            <a 
              href="https://www.google.com/maps/search/?api=1&query=Artjuna+Anjuna+Goa" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:text-ember transition-colors inline-flex items-center gap-1"
            >
              Artjuna Garden Café — Anjuna <span className="text-xs font-normal text-muted-foreground/60">↗</span>
            </a>
          </h3>
          <p>
            Very few cafés capture the spirit of Goa quite like Artjuna.
          </p>
          <p>
            Part café, part lifestyle space, part boutique and part yoga community, Artjuna has become much more than somewhere to grab a coffee. People often begin their mornings here with breakfast, spend a few hours working from the shaded garden and end up browsing the small concept store before leaving. While the Wi-Fi is generally reliable during quieter morning hours, it can become less consistent as the café gets busier later in the day. If your work mainly involves writing, emails or light editing, it's an excellent choice. For important video calls, earlier hours are usually a safer bet.
          </p>
          <span className="text-xs font-semibold text-ember uppercase block">Best for: Creative work, relaxed mornings and combining work with breakfast.</span>
        </div>
      </div>

      {/* 3. Other Cafes */}
      <div className="space-y-6 mt-12">
        <h2 className="font-display text-2xl text-foreground">Other Excellent Work-Friendly Cafés</h2>
        <p>
          If the cafés above are full, there are several other excellent options worth considering:
        </p>
        <ul className="space-y-2 list-disc pl-6 text-muted-foreground">
          <li>
            <a 
              href="https://www.google.com/maps/search/?api=1&query=Barefoot+Goa+Parra" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-ember hover:underline font-semibold"
            >
              Barefoot Goa (Parra) ↗
            </a>
            : Frequently recommended because of the number of accessible power outlets, making it one of the easiest places to settle in for a productive afternoon.
          </li>
          <li>
            <a 
              href="https://www.google.com/maps/search/?api=1&query=Cafe+LaDiDa+Porvorim+Goa" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-ember hover:underline font-semibold"
            >
              Cafe LaDiDa (Porvorim) ↗
            </a>
            : Popular among freelancers and students thanks to complimentary Wi-Fi and a quieter atmosphere away from the busiest tourist pockets.
          </li>
        </ul>
        <p>
          On the other hand, it's equally useful to know where not to work. Places like Curlies remain iconic for spending a slow afternoon overlooking the beach, but they're better enjoyed as beach cafés than makeshift offices. The research specifically notes that Wi-Fi reliability isn't its strength, making it a better choice for unwinding after work rather than trying to finish it.
        </p>
      </div>

      {/* 4. Branded Chains Section */}
      <div className="space-y-6 mt-12 border-t border-border pt-10">
        <h2 className="font-display text-2xl text-foreground">Independent Cafés vs. Well-Known Chains</h2>
        <p>
          When you are looking for a place to work, it is easy to default to familiar names. You will find branded options like <strong>Starbucks Goa</strong> or the famous <strong>Hard Rock Cafe Goa</strong> in the more commercial coastal strips. 
        </p>
        <p>
          While these branded chains offer a highly standardized environment and familiar menus, they are rarely the best choice for remote work in Goa. Hard Rock Cafe, for example, is designed for loud music, dining, and late-night drinks, making it unsuitable for quiet laptop work or study sessions. 
        </p>
        <p>
          At Wayzyy, we always advocate for supporting independent, local Goan cafés instead. Places like Mojigao, Artjuna, or Babka don't just offer specialty coffee and reliable Wi-Fi—they provide lush garden settings, creative local communities, and a unique tropical atmosphere that makes working remotely feel rewarding rather than routine.
        </p>
      </div>

      {/* 5. Cafes vs Coworking */}
      <div className="space-y-6 mt-12">
        <h2 className="font-display text-2xl text-foreground">Is It Better to Work From a Café or a Coworking Space?</h2>
        <p>
          The answer depends on your schedule.
        </p>
        <p>
          If you have one or two meetings, want a relaxed atmosphere and enjoy changing locations every day, cafés are usually the better choice. They're ideal for creative work, writing, planning and lighter workloads while giving you the chance to experience Goa's café culture at the same time.
        </p>
        <p>
          If you're working full-time with multiple client calls, fixed deadlines or a team spread across different time zones, you'll probably be happier combining cafés with dedicated coworking spaces. Many remote workers naturally settle into a routine—coworking during the busiest part of the day, followed by a café for lunch, an afternoon coffee or a quieter few hours of work before heading to the beach.
        </p>
        <p>
          If you're planning to work remotely for more than a few days, our <Link to="/blog/workation-goa-guide" className="text-ember hover:underline">Workation in Goa Guide</Link> covers everything from internet reliability and coworking spaces to choosing the best neighbourhood for longer stays.
        </p>
        <p className="font-semibold text-foreground text-center my-6">
          People don't just remember the coffee. They remember the mornings. The conversations. The bakery they accidentally discovered. The breakfast that quietly turned into lunch because nobody wanted to leave.
        </p>
      </div>

      {/* 6. Interlinks */}
      <div className="mt-16 rounded-2xl border border-border bg-card/60 p-6 sm:p-8">
        <h3 className="font-display text-xl font-semibold text-foreground mb-4">
          Explore Stays Near Your Favorite Work Cafes
        </h3>
        <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
          Choosing a villa close to your favorite cafes makes remote work in Goa completely seamless. Explore our local village guides to find the perfect base for your workation:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div className="space-y-2">
            <span className="text-xs uppercase tracking-wider text-muted-foreground/75 font-semibold block mb-1">Village Guides</span>
            <Link to="/blog/assagao-goa-villas-guide" className="text-ember hover:underline block">Assagao Villas Guide — Stays near Blue Tokai &amp; Mojigao</Link>
            <Link to="/blog/siolim-goa-villas-guide" className="text-ember hover:underline block">Siolim Villas Guide — Quiet riverfront remote workspaces</Link>
            <Link to="/blog/anjuna-goa-beach-guide" className="text-ember hover:underline block">Anjuna Beach Guide — Work-friendly stays near Babka &amp; Artjuna</Link>
            <Link to="/blog/vagator-goa-beach-guide" className="text-ember hover:underline block">Vagator Beach Guide — Cliffside stays and sunset points</Link>
          </div>
          <div className="space-y-2">
            <span className="text-xs uppercase tracking-wider text-muted-foreground/75 font-semibold block mb-1">Nomad Planning Guides</span>
            <Link to="/blog/workation-goa-guide" className="text-ember hover:underline block">Goa Workation Guide — WiFi, monthly budgets &amp; setup tips</Link>
            <Link to="/blog/where-to-stay-in-goa" className="text-ember hover:underline block">Where to Stay in Goa — The ultimate lifestyle decision guide</Link>
            <Link to="/blog/goa-scooter-rental-guide" className="text-ember hover:underline block">Goa Scooter Rental Guide — Licensing &amp; transit rules</Link>
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
