import { BlogLayout } from "@/components/BlogLayout";
import { blogPosts } from "@/lib/blogPosts";
import { HelpCircle, ChevronDown, MapPin, Compass, Clock, ShieldCheck, Sun, Calendar, AlertCircle, Building2, Landmark } from "lucide-react";
import { useState } from "react";
import { WayzyyLocationPromo } from "@/components/WayzyyLocationPromo";

const post = blogPosts.find((p) => p.slug === "six-new-goa-tourism-projects-guide-2026")!;

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Are these six new tourism projects already open to tourists?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "As of mid-2026, existing sites like Colva Beach, Basilica of Bom Jesus, and Harvalem Waterfall are open as active destinations, but the newly funded infrastructure upgrades (like the Ponda museum and Porvorim town square) are currently under development.",
      },
    },
    {
      "@type": "Question",
      name: "How much central funding has Goa received for these projects?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Goa has received approximately ₹258.1 crore across six key infrastructure projects approved for 2024-25 and 2025-26, part of a national ₹5,756.6 crore package disclosed by the Union Tourism Ministry.",
      },
    },
    {
      "@type": "Question",
      name: "Which of the six projects is best for heritage travelers?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The Basilica of Bom Jesus in Old Goa is the top choice for heritage travelers. It is an active UNESCO World Heritage site receiving ₹16.4 crore under PRASHAD for crowd flow, interpretation, and amenities.",
      },
    },
    {
      "@type": "Question",
      name: "Where are the six new tourism projects located in Goa?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The projects are located in Ponda (museum), Porvorim (town square & creek walkway), Old Goa (Basilica of Bom Jesus), Colva in South Goa (beach promenade), and Mayem village near Bicholim (Harvalem Waterfall).",
      },
    },
    {
      "@type": "Question",
      name: "How do I reach these new project sites from Panjim or the airport?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Porvorim and Old Goa are 10–15 km from Panjim. Ponda is 30 km east, Colva is 35 km south, and Harvalem is 25 km northeast via Bicholim. Renting a scooter or self-drive car is the most practical way to cover the circuit.",
      },
    },
  ],
};

const faqs = [
  {
    question: "Are these six new tourism projects already open to tourists?",
    answer:
      "As of mid-2026, existing sites like Colva Beach, Basilica of Bom Jesus, and Harvalem Waterfall are open as active public destinations, but the newly funded infrastructure upgrades (like the Ponda museum and Porvorim town square) are currently under construction.",
  },
  {
    question: "How much central funding has Goa received for these projects?",
    answer:
      "Goa has received approximately ₹258.1 crore across six key infrastructure projects approved for 2024-25 and 2025-26, part of a national ₹5,756.6 crore package disclosed in a Lok Sabha reply by Union Tourism Minister Gajendra Singh Shekhawat.",
  },
  {
    question: "Which of the six projects is best for heritage travelers?",
    answer:
      "The Basilica of Bom Jesus in Old Goa is the top choice for heritage travelers. It has stood since 1605, and the ₹16.4 crore PRASHAD allocation is actively polishing visitor amenities, crowd management, and interpretation galleries.",
  },
  {
    question: "Where are the six new tourism projects located in Goa?",
    answer:
      "The projects are located in Ponda (museum), Porvorim (town square & creek walkway), Old Goa (Basilica of Bom Jesus), Colva in South Goa (beach promenade), and Mayem village near Bicholim (Harvalem Waterfall).",
  },
  {
    question: "How do I reach these new project sites from Panjim or the airport?",
    answer:
      "Porvorim and Old Goa are 10–15 km from Panjim. Ponda is 30 km east, Colva is 35 km south, and Harvalem is 25 km northeast via Bicholim. Renting a scooter or self-drive car is the most practical way to cover the circuit.",
  },
];

export default function SixNewGoaTourismProjectsGuide() {
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
      heroImageAlt="Sweeping aerial view of a cable bridge and green tropical river in Goa India"
      publishedDate={post.publishedDate}
      slug={post.slug}
      extraJsonLd={[faqJsonLd]}
    >
      <div className="space-y-10 text-foreground/90 leading-relaxed text-base sm:text-lg">
        {/* Intro */}
        <p className="text-xl sm:text-2xl font-light text-foreground leading-snug">
          You’ve probably seen the headline: <strong className="font-semibold text-ember">“Goa gets Centre’s nod for six tourism infra projects.”</strong> Most reports stop at the budget numbers—<strong className="font-semibold text-ember">₹258.1 crore</strong> across two financial years. But what does that mean on the ground for travelers in 2026?
        </p>

        <p>
          This guide breaks down each of the six central-funded Goa tourism infrastructure projects by its actual location—<strong className="font-semibold text-foreground">Ponda, Porvorim, Old Goa, Colva, and Mayem</strong>—answering the real questions: Is it visitable right now? How do you get there? Where do you park? And should you include it in your itinerary today or save it for a return trip?
        </p>

        {/* Hero Image */}
        <div className="my-8 rounded-2xl overflow-hidden border border-border shadow-lg">
          <img
            src={post.heroImage}
            alt="Aerial view of a scenic river bridge in Goa amidst green forests"
            className="w-full h-auto object-cover max-h-[550px]"
          />
          <p className="p-3 text-xs sm:text-sm text-center text-muted-foreground bg-card/60 border-t border-border">
            Connecting Goa’s hinterland and coastal hubs: The ₹258 crore central tourism infrastructure expansion.
          </p>
        </div>

        {/* Section 1: Overview */}
        <section className="space-y-6">
          <h2 className="font-display text-3xl sm:text-4xl text-foreground border-b border-border/60 pb-3">
            What Are the Six New Central-Funded Tourism Projects in Goa?
          </h2>
          <p>
            The Union Ministry of Tourism approved six major developments in Goa as part of a nationwide ₹5,756.6 crore package covering 117 projects. Spanning four distinct central funding schemes, the state’s allocation totals <strong className="font-semibold text-foreground">₹258.1 crore</strong>.
          </p>

          {/* Budget Table */}
          <div className="overflow-x-auto my-6 rounded-2xl border border-border bg-card/40 p-4">
            <table className="w-full text-left text-sm text-muted-foreground">
              <thead className="border-b border-border/60 text-foreground font-display text-base">
                <tr>
                  <th className="py-3 px-4">Project Name</th>
                  <th className="py-3 px-4">Location</th>
                  <th className="py-3 px-4">Scheme</th>
                  <th className="py-3 px-4">Budget</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                <tr>
                  <td className="py-3 px-4 font-medium text-foreground">Chhatrapati Shivaji Maharaj Museum</td>
                  <td className="py-3 px-4">Ponda</td>
                  <td className="py-3 px-4">SASCI</td>
                  <td className="py-3 px-4 text-ember font-semibold">₹97.4 Cr</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium text-foreground">Town Square Development</td>
                  <td className="py-3 px-4">Porvorim</td>
                  <td className="py-3 px-4">SASCI</td>
                  <td className="py-3 px-4 text-ember font-semibold">₹90.7 Cr</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium text-foreground">Porvorim Creek Experience</td>
                  <td className="py-3 px-4">Porvorim / Betim</td>
                  <td className="py-3 px-4">Swadesh Darshan 2.0</td>
                  <td className="py-3 px-4 text-ember font-semibold">₹24.0 Cr</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium text-foreground">Colva Beach Experience</td>
                  <td className="py-3 px-4">Colva, South Goa</td>
                  <td className="py-3 px-4">Swadesh Darshan 2.0</td>
                  <td className="py-3 px-4 text-ember font-semibold">₹19.8 Cr</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium text-foreground">Basilica of Bom Jesus Amenities</td>
                  <td className="py-3 px-4">Old Goa</td>
                  <td className="py-3 px-4">PRASHAD</td>
                  <td className="py-3 px-4 text-ember font-semibold">₹16.4 Cr</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium text-foreground">Harvalem Waterfall Beautification</td>
                  <td className="py-3 px-4">Mayem / Bicholim</td>
                  <td className="py-3 px-4">CBDD Scheme</td>
                  <td className="py-3 px-4 text-ember font-semibold">₹9.8 Cr</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Section 2: Schemes Explained */}
        <section className="space-y-6">
          <h2 className="font-display text-3xl sm:text-4xl text-foreground border-b border-border/60 pb-3">
            How the Funding Schemes Work
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-5 rounded-xl border border-border bg-card/30 space-y-2">
              <h3 className="font-semibold text-foreground text-lg flex items-center gap-2">
                <Landmark className="h-5 w-5 text-ember" /> SASCI Scheme
              </h3>
              <p className="text-sm text-muted-foreground">
                <em>Scheme for Special Assistance to States for Capital Investment.</em> Funds major public infrastructure, large cultural museums, and civic town plazas.
              </p>
            </div>
            <div className="p-5 rounded-xl border border-border bg-card/30 space-y-2">
              <h3 className="font-semibold text-foreground text-lg flex items-center gap-2">
                <Building2 className="h-5 w-5 text-ember" /> PRASHAD Scheme
              </h3>
              <p className="text-sm text-muted-foreground">
                Focuses on pilgrimage rejuvenation and heritage city enhancement—improving crowd flow, covered walkways, and tourist interpretation.
              </p>
            </div>
            <div className="p-5 rounded-xl border border-border bg-card/30 space-y-2">
              <h3 className="font-semibold text-foreground text-lg flex items-center gap-2">
                <Compass className="h-5 w-5 text-ember" /> Swadesh Darshan 2.0
              </h3>
              <p className="text-sm text-muted-foreground">
                Builds sustainable destination-level experiences (creek boardwalks, beachfront promenades, birdwatching points) rather than single monuments.
              </p>
            </div>
            <div className="p-5 rounded-xl border border-border bg-card/30 space-y-2">
              <h3 className="font-semibold text-foreground text-lg flex items-center gap-2">
                <Sun className="h-4 w-4 text-ember" /> CBDD Scheme
              </h3>
              <p className="text-sm text-muted-foreground">
                <em>Challenge-Based Destination Development.</em> Invites states to compete for targeted upgrades at specific ecotourism or waterfall sites.
              </p>
            </div>
          </div>
        </section>

        {/* Section 3: Detailed Breakdown of Each Project */}
        <section className="space-y-8">
          <h2 className="font-display text-3xl sm:text-4xl text-foreground border-b border-border/60 pb-3">
            Project-by-Project: What Each Upgrade Means on the Ground
          </h2>

          {/* 1. Ponda Museum */}
          <div className="p-6 rounded-2xl border border-border bg-card/40 space-y-3">
            <h3 className="font-display text-2xl text-foreground flex items-center gap-2">
              <MapPin className="h-5 w-5 text-ember" /> 1. Chhatrapati Shivaji Maharaj Museum, Ponda (₹97.4 Cr)
            </h3>
            <p className="text-sm text-foreground/90">
              Ponda sits inland (~30 km from Panjim) and is famous for spice farms and temples like Mangeshi and Shantadurga. This flagship museum project aims to give visitors a compelling reason to linger beyond temple hopping, offering interpretation galleries detailing Maratha-era Goan history, parking facilities, and museum cafés.
            </p>
          </div>

          {/* 2. Porvorim Town Square */}
          <div className="p-6 rounded-2xl border border-border bg-card/40 space-y-3">
            <h3 className="font-display text-2xl text-foreground flex items-center gap-2">
              <MapPin className="h-5 w-5 text-ember" /> 2. Town Square, Porvorim (₹90.7 Cr)
            </h3>
            <p className="text-sm text-foreground/90">
              Located along the busy NH66 corridor between Panjim and Mapusa, Porvorim is Goa’s administrative hub. The ₹90.7 crore allocation will construct an amphitheatre, pedestrian plaza, organized parking, and food courts—turning a drive-through zone into a central civic gathering space.
            </p>
          </div>

          {/* 3. Basilica of Bom Jesus */}
          <div className="p-6 rounded-2xl border border-border bg-card/40 space-y-3">
            <h3 className="font-display text-2xl text-foreground flex items-center gap-2">
              <MapPin className="h-5 w-5 text-ember" /> 3. Basilica of Bom Jesus, Old Goa (₹16.4 Cr)
            </h3>
            <p className="text-sm text-foreground/90">
              Standing since 1605, this UNESCO monument holds the relic of St. Francis Xavier. The PRASHAD allocation focuses directly on visitor pain points: covered queuing areas, improved parking management, upgraded washrooms, and clear multi-language heritage signage.
            </p>
          </div>

          {/* 4. Porvorim Creek Experience */}
          <div className="p-6 rounded-2xl border border-border bg-card/40 space-y-3">
            <h3 className="font-display text-2xl text-foreground flex items-center gap-2">
              <MapPin className="h-5 w-5 text-ember" /> 4. Porvorim Creek Experience (₹24 Cr)
            </h3>
            <p className="text-sm text-foreground/90">
              Threading through mangrove backwaters in Salvador do Mundo and Reis Magos, this project creates wooden boardwalks, birdwatching decks, and kayak launch jetties—a tranquil green alternative to coastal beach crowds.
            </p>
          </div>

          {/* 5. Colva Beach Experience */}
          <div className="p-6 rounded-2xl border border-border bg-card/40 space-y-3">
            <h3 className="font-display text-2xl text-foreground flex items-center gap-2">
              <MapPin className="h-5 w-5 text-ember" /> 5. Colva Beach Experience (₹19.8 Cr)
            </h3>
            <p className="text-sm text-foreground/90">
              South Goa's most popular beach (8 km from Margao) will see upgraded beachfront promenades, lifeguard stations, lighting, clean public washrooms, and streamlined parking.
            </p>
          </div>

          {/* 6. Harvalem Waterfall */}
          <div className="p-6 rounded-2xl border border-border bg-card/40 space-y-3">
            <h3 className="font-display text-2xl text-foreground flex items-center gap-2">
              <MapPin className="h-5 w-5 text-ember" /> 6. Harvalem Waterfall Beautification, Mayem (₹9.8 Cr)
            </h3>
            <p className="text-sm text-foreground/90">
              Located near Mayem in Bicholim (~25 km from Panjim), this 50-metre waterfall will receive improved viewing decks, paved safety stairs, railings, and interpretation kiosks near the ancient Rudreshwar temple and rock-cut caves.
            </p>
          </div>
        </section>

        {/* Location Promo */}
        <WayzyyLocationPromo
          title="Exploring Goa's emerging hinterlands & heritage sites?"
          description="Book verified villas and homestays across North, Central, and South Goa on Wayzyy — zero host commissions, direct host contact, and transparent pricing."
        />

        {/* Section 4: Traveler Verdict & Which to Visit */}
        <section className="space-y-6">
          <h2 className="font-display text-3xl sm:text-4xl text-foreground border-b border-border/60 pb-3">
            Honest Verdict: Go Now vs. Wait & Watch
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl border border-border bg-card/40 space-y-2">
              <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Already Worth Visiting
              </span>
              <h3 className="font-display text-lg text-foreground">Basilica of Bom Jesus & Colva</h3>
              <p className="text-xs text-muted-foreground">
                Both are fully functioning destinations. Infrastructure works are polishing existing amenities without blocking main visits.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-border bg-card/40 space-y-2">
              <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                Seasonal / Conditional
              </span>
              <h3 className="font-display text-lg text-foreground">Harvalem & Porvorim Creek</h3>
              <p className="text-xs text-muted-foreground">
                Harvalem is best during monsoon (Jun–Oct). Porvorim Creek is ideal in cooler months for nature walks and kayaking.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-border bg-card/40 space-y-2">
              <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                Wait and Watch (2027–2028)
              </span>
              <h3 className="font-display text-lg text-foreground">Ponda Museum & Porvorim Square</h3>
              <p className="text-xs text-muted-foreground">
                Major capital constructions worth ₹97Cr and ₹90Cr take time. Plan dedicated trips once galleries and plazas are completed.
              </p>
            </div>
          </div>
        </section>

        {/* Section 5: Impact on Rentals & Hosts */}
        <section className="space-y-6">
          <h2 className="font-display text-3xl sm:text-4xl text-foreground border-b border-border/60 pb-3">
            What This Means for Vacation Rentals & Short-Term Hosts
          </h2>
          <p>
            As public funding shifts tourism beyond crowded North Goa beach belts, emerging stay markets are gaining momentum:
          </p>

          <ul className="space-y-3 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <Building2 className="h-5 w-5 text-ember shrink-0 mt-0.5" />
              <span><strong>Porvorim as a Base:</strong> Centrally located between Panjim and coastal beaches, ideal for families and digital nomads wanting quiet stays near civic plazas.</span>
            </li>
            <li className="flex items-start gap-2">
              <Building2 className="h-5 w-5 text-ember shrink-0 mt-0.5" />
              <span><strong>Riverside & Hinterland Growth:</strong> Ribandar, Britona, Salvador do Mundo, and Mayem are attracting travelers seeking nature retreats, birdwatching, and heritage architecture.</span>
            </li>
          </ul>
        </section>

        {/* FAQ Section */}
        <section className="space-y-6 pt-6">
          <h2 className="font-display text-3xl sm:text-4xl text-foreground border-b border-border/60 pb-3 flex items-center gap-3">
            <HelpCircle className="h-7 w-7 text-ember" /> Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="rounded-xl border border-border bg-card/40 overflow-hidden transition-colors"
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full p-5 text-left font-display text-lg text-foreground flex items-center justify-between gap-4 hover:text-ember transition-colors"
                >
                  <span>{faq.question}</span>
                  <ChevronDown
                    className={`h-5 w-5 text-muted-foreground transition-transform duration-200 ${
                      openFaq === index ? "rotate-180 text-ember" : ""
                    }`}
                  />
                </button>
                {openFaq === index && (
                  <div className="px-5 pb-5 text-sm text-muted-foreground leading-relaxed border-t border-border/40 pt-3">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Final Thoughts & CTA */}
        <section className="mt-12 p-8 rounded-2xl border border-border bg-card/60 space-y-4 text-center">
          <h2 className="font-display text-2xl sm:text-3xl text-foreground">
            Final Thoughts: Tracking Goa’s Tourism Evolution
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base">
            These six central-funded projects highlight Goa’s long-term push toward sustainable, heritage, and hinterland tourism. Watch these projects grow, plan your stays around active sites, and discover the authentic side of Goa.
          </p>
          <div className="pt-4 text-xs sm:text-sm text-muted-foreground border-t border-border/60">
            Looking for a villa or vacation rental in Goa? Explore verified stays on{" "}
            <strong className="text-foreground">Wayzyy</strong> or email us at{" "}
            <a href="mailto:hello@wayzyy.com" className="text-ember underline font-medium">
              hello@wayzyy.com
            </a>.
          </div>
        </section>
      </div>
    </BlogLayout>
  );
}
