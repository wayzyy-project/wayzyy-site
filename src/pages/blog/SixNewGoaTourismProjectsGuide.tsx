import { BlogLayout } from "@/components/BlogLayout";
import { blogPosts } from "@/lib/blogPosts";
import { HelpCircle, ChevronDown, MapPin, Compass, Clock, ShieldCheck, Sun, Calendar, AlertCircle, Building2, Landmark, Waves, Trees, Car } from "lucide-react";
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
        text: "No. As of 2026, none are officially operational as finished new attractions. Colva Beach, Basilica of Bom Jesus, and Harvalem Waterfall remain accessible as existing public sites, but the new infrastructure is still under active development.",
      },
    },
    {
      "@type": "Question",
      name: "How much central funding has Goa received?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Approximately ₹258.1 crore across six projects approved in 2024-25 and 2025-26, part of a national package of 117 projects worth ₹5,756.6 crore disclosed by Union Tourism Minister Gajendra Singh Shekhawat.",
      },
    },
    {
      "@type": "Question",
      name: "Which project is best for families or heritage travelers?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Families should watch Colva Beach Experience and Porvorim Town Square. Heritage travelers should prioritize the Basilica of Bom Jesus upgrade in Old Goa and the Ponda museum once it opens.",
      },
    },
    {
      "@type": "Question",
      name: "When will these projects be completed?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No official timelines have been published. The Lok Sabha reply listed approvals and allocations, not schedules. Check locally before planning around any single site.",
      },
    },
    {
      "@type": "Question",
      name: "Will entry fees be introduced?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Nothing has been announced. Existing attractions like the Basilica and Colva Beach remain free; new experience zones may add paid activities later.",
      },
    },
    {
      "@type": "Question",
      name: "Where exactly are the projects located?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Ponda (museum), Porvorim (town square & creek experience), Old Goa (Basilica of Bom Jesus), Colva in South Goa (beach experience), and Mayem village near Bicholim (Harvalem Waterfall).",
      },
    },
    {
      "@type": "Question",
      name: "How do I reach them from Panjim or the airports?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Porvorim and Old Goa are 10–15 km from Panjim and 25–30 km from Dabolim Airport. Ponda is about 30 km east, Colva 35 km south, and Harvalem 25 km northeast via Bicholim. A scooter or rental car is the most practical option.",
      },
    },
    {
      "@type": "Question",
      name: "Will construction affect access to existing attractions?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, temporarily. Expect limited parking, rerouted walking paths, and extra congestion at Colva Beach and Old Goa during active work. Visit early in the morning.",
      },
    },
    {
      "@type": "Question",
      name: "Are parking and washroom facilities available?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Basic facilities exist at Colva Beach and the Basilica, but quality is inconsistent. Upgraded facilities are part of the plan; until then, keep expectations modest and carry cash.",
      },
    },
    {
      "@type": "Question",
      name: "Can I visit all six in one trip?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, but split them across at least two or three days. North Goa-based sites (Porvorim, Old Goa, and Mayem) form one loop; Ponda and Colva fit better from a South Goa base.",
      },
    },
  ],
};

const faqs = [
  {
    question: "Are these six new tourism projects already open to tourists?",
    answer:
      "No. As of 2026, none are officially operational as finished new attractions. Colva Beach, Basilica of Bom Jesus, and Harvalem Waterfall remain accessible as existing public sites, but the new infrastructure is still under active development.",
  },
  {
    question: "How much central funding has Goa received?",
    answer:
      "Approximately ₹258.1 crore across six projects approved in 2024-25 and 2025-26, part of a national package of 117 projects worth ₹5,756.6 crore disclosed in a Lok Sabha reply by Union Tourism Minister Gajendra Singh Shekhawat.",
  },
  {
    question: "Which project is best for families or heritage travelers?",
    answer:
      "Families should watch Colva Beach Experience and Porvorim Town Square. Heritage travelers should prioritize the Basilica of Bom Jesus upgrade in Old Goa and the Ponda museum once it opens.",
  },
  {
    question: "When will these projects be completed?",
    answer:
      "No official timelines have been published. The Lok Sabha reply listed approvals and allocations, not schedules. Check locally before planning around any single site.",
  },
  {
    question: "Will entry fees be introduced?",
    answer:
      "Nothing has been announced. Existing attractions like the Basilica and Colva Beach remain free; new experience zones may add paid activities later.",
  },
  {
    question: "Where exactly are the projects located?",
    answer:
      "Ponda (museum), Porvorim (town square & creek experience), Old Goa (Basilica of Bom Jesus), Colva in South Goa (beach experience), and Mayem village near Bicholim (Harvalem Waterfall).",
  },
  {
    question: "How do I reach them from Panjim or the airports?",
    answer:
      "Porvorim and Old Goa are 10–15 km from Panjim and 25–30 km from Dabolim Airport. Ponda is about 30 km east, Colva 35 km south, and Harvalem 25 km northeast via Bicholim. A scooter or rental car is the most practical option.",
  },
  {
    question: "Will construction affect access to existing attractions?",
    answer:
      "Yes, temporarily. Expect limited parking, rerouted walking paths, and extra congestion at Colva Beach and Old Goa during active work. Visit early in the morning.",
  },
  {
    question: "Are parking and washroom facilities available?",
    answer:
      "Basic facilities exist at Colva Beach and the Basilica, but quality is inconsistent. Upgraded facilities are part of the plan; until then, keep expectations modest and carry cash.",
  },
  {
    question: "Can I visit all six in one trip?",
    answer:
      "Yes, but split them across at least two or three days. North Goa-based sites (Porvorim, Old Goa, and Mayem) form one loop; Ponda and Colva fit better from a South Goa base.",
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
      heroImageAlt="Sweeping aerial view of a cable bridge crossing over a green river amidst lush greenery in Goa, India"
      publishedDate={post.publishedDate}
      slug={post.slug}
      extraJsonLd={[faqJsonLd]}
    >
      <div className="space-y-10 text-foreground/90 leading-relaxed text-base sm:text-lg">
        {/* Intro */}
        <p className="text-xl sm:text-2xl font-light text-foreground leading-snug">
          You’ve probably seen the headline by now: <strong className="font-semibold text-ember">“Goa gets Centre’s nod for six tourism infra projects.”</strong> Most reports stop at the budget table - <strong className="font-semibold text-ember">₹258.1 crore</strong> across two financial years, six schemes, and a Lok Sabha reply by Union Tourism Minister Gajendra Singh Shekhawat. That tells you the Centre is spending money. It doesn’t tell you whether the Chhatrapati Shivaji Maharaj Museum in Ponda is already open, if the Porvorim town square is still a construction site, or whether Harvalem Waterfall is reachable without a four-wheel-drive in monsoon.
        </p>

        <p>
          This guide is for travelers, not policy watchers. We break down each of the six Goa tourism infrastructure projects by its real location - <strong className="font-semibold text-foreground">Ponda, Porvorim, Old Goa, Colva, and Mayem</strong> - and answer the questions that matter on the ground. Is it visitable in 2026? How do you get there? Where do you park? Are there washrooms, ATMs, or a working phone signal? And most importantly, does each site deserve a slot in your itinerary, or should you save it for a return trip?
        </p>

        <p>
          If your idea of Goa begins and ends at a beach shack, this probably isn’t for you. But if you want to see where the state is heading - restored churches, new museum complexes, creek walkways, and a quieter South Goa waterfront - these projects are worth knowing about before the crowds catch up.
        </p>

        {/* Section 1: Overview & Budget Table */}
        <section className="space-y-6">
          <h2 className="font-display text-3xl sm:text-4xl text-foreground border-b border-border/60 pb-3">
            What Are the Six New Central-Funded Tourism Projects in Goa?
          </h2>
          <p>
            The Centre approved these six developments for the state across the 2024-25 and 2025-26 financial years. They form part of a larger ₹5,756.6 crore package covering 117 projects nationwide, disclosed in a Lok Sabha reply by Union Tourism Minister Gajendra Singh Shekhawat.
          </p>

          <h3 className="font-display text-2xl text-foreground mt-4">
            Project-by-project breakdown: name, scheme, and budget
          </h3>
          <p>The state’s share totals about ₹258.1 crore and splits as follows:</p>

          <div className="overflow-x-auto my-6 rounded-2xl border border-border bg-card/40 p-4">
            <table className="w-full text-left text-sm text-muted-foreground">
              <thead className="border-b border-border/60 text-foreground font-display text-base">
                <tr>
                  <th className="py-3 px-4">Project Name</th>
                  <th className="py-3 px-4">Location</th>
                  <th className="py-3 px-4">Funding Scheme</th>
                  <th className="py-3 px-4">Approved Budget</th>
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
            How the Schemes Work (SASCI, PRASHAD, Swadesh Darshan 2.0, CBDD)
          </h2>
          <p>
            Understanding the underlying funding mechanism explains what type of infrastructure is being built:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-5 rounded-xl border border-border bg-card/30 space-y-2">
              <h3 className="font-semibold text-foreground text-lg flex items-center gap-2">
                <Landmark className="h-5 w-5 text-ember" /> SASCI Scheme
              </h3>
              <p className="text-sm text-muted-foreground">
                <strong>Scheme for Animation, Support and Community Interaction.</strong> Funds large public and cultural spaces such as museum complexes and civic plazas.
              </p>
            </div>
            <div className="p-5 rounded-xl border border-border bg-card/30 space-y-2">
              <h3 className="font-semibold text-foreground text-lg flex items-center gap-2">
                <Building2 className="h-5 w-5 text-ember" /> PRASHAD Scheme
              </h3>
              <p className="text-sm text-muted-foreground">
                <strong>Pilgrimage Rejuvenation and Spiritual Heritage Augmentation Drive.</strong> Supports pilgrimage and heritage sites like Old Goa’s Basilica.
              </p>
            </div>
            <div className="p-5 rounded-xl border border-border bg-card/30 space-y-2">
              <h3 className="font-semibold text-foreground text-lg flex items-center gap-2">
                <Compass className="h-5 w-5 text-ember" /> Swadesh Darshan 2.0
              </h3>
              <p className="text-sm text-muted-foreground">
                Builds sustainable destination-level experiences (creek boardwalks, beachfront promenades) rather than single isolated monuments.
              </p>
            </div>
            <div className="p-5 rounded-xl border border-border bg-card/30 space-y-2">
              <h3 className="font-semibold text-foreground text-lg flex items-center gap-2">
                <Sun className="h-4 w-4 text-ember" /> CBDD Scheme
              </h3>
              <p className="text-sm text-muted-foreground">
                <strong>Challenge-Based Destination Development Scheme.</strong> Invites states to compete for targeted upgrades at specific ecotourism and waterfall sites.
              </p>
            </div>
          </div>

          <h3 className="font-display text-2xl text-foreground mt-4">What the ₹258 crore is meant to build</h3>
          <p>
            The money covers museums, town squares, church restoration, creek walkways, beachfront facilities, and waterfall access. Most projects aim to improve how visitors move, wait, and learn at each location. A few - like Porvorim town square and the Ponda museum - account for the bulk of the spending.
          </p>
        </section>

        {/* Section 3: Detailed Breakdown of Each Project */}
        <section className="space-y-8">
          <h2 className="font-display text-3xl sm:text-4xl text-foreground border-b border-border/60 pb-3">
            Project-by-Project: What Each Upgrade Means on the Ground
          </h2>

          {/* 1. Ponda Museum */}
          <div className="p-6 rounded-2xl border border-border bg-card/40 space-y-4">
            <h3 className="font-display text-2xl text-foreground flex items-center gap-2">
              <MapPin className="h-5 w-5 text-ember" /> Chhatrapati Shivaji Maharaj Museum, Ponda (₹97.4 Cr)
            </h3>
            <p className="text-sm text-foreground/90">
              Ponda sits inland, roughly 30 km southeast of Panjim along NH748, and is best known for Hindu temples, spice farms, and the Mangeshi and Shanta Durga complexes. A ₹97.4 crore museum here signals a deliberate push to give travelers a reason to linger beyond temple hopping. For visitors, the practical upside should be clear signage, a proper parking lot, interpretation galleries, and possibly audio guides that finally explain Goa's Maratha-era history in context rather than leaving you to guess from a plaque.
            </p>
            <div className="p-4 rounded-xl border border-border/60 bg-card/60 text-xs text-muted-foreground space-y-2">
              <strong className="text-foreground font-semibold block text-sm">For Hosts & Homeowners:</strong>
              Ponda is one to watch. The town already sees day-trippers from North and South Goa, but overnight demand is thin. Better interpretation, lighting, and a museum café could stretch a two-hour temple circuit into a half-day stop, and eventually into an overnight stay for travelers who want to slow down. If the approach roads are widened and the last mile is paved properly, Ponda's rental market could move from negligible to niche.
            </div>
          </div>

          {/* 2. Porvorim Town Square */}
          <div className="p-6 rounded-2xl border border-border bg-card/40 space-y-4">
            <h3 className="font-display text-2xl text-foreground flex items-center gap-2">
              <MapPin className="h-5 w-5 text-ember" /> Town Square, Porvorim (₹90.7 Cr)
            </h3>
            <p className="text-sm text-foreground/90">
              Porvorim is Goa's legislative and administrative heart, straddling the busy NH66 corridor between Panjim and Mapusa. The town square project is the second-most expensive at ₹90.7 crore, which suggests more than a few benches and planters. Expect an amphitheatre, pedestrian plaza, better lighting, parking reorganization, and possibly a market or food court. For travelers, this matters because Porvorim has long been a drive-through zone; a proper square gives you a reason to stop, walk, and eat without fighting mall traffic.
            </p>
            <p className="text-sm text-muted-foreground">
              The catch is access. NH66 already bottlenecks during rush hour, and adding a popular public space without dedicated service roads could make things worse before they get better. If the plan includes slip lanes, basement or off-street parking, and clear drop-off points, it will work. If not, expect chaos.
            </p>
            <div className="p-4 rounded-xl border border-border/60 bg-card/60 text-xs text-muted-foreground space-y-2">
              <strong className="text-foreground font-semibold block text-sm">For Hosts & Homeowners:</strong>
              A finished town square raises Porvorim's profile from a bedroom suburb to a place travelers might actually base themselves - especially families who want to be close to Panjim and North Goa beaches without the noise.
            </div>
          </div>

          {/* 3. Basilica of Bom Jesus */}
          <div className="p-6 rounded-2xl border border-border bg-card/40 space-y-4">
            <h3 className="font-display text-2xl text-foreground flex items-center gap-2">
              <MapPin className="h-5 w-5 text-ember" /> Basilica of Bom Jesus, Old Goa (₹16.4 Cr)
            </h3>
            <p className="text-sm text-foreground/90">
              Old Goa needs little introduction. The Basilica of Bom Jesus has stood since 1605 and holds the remains of St. Francis Xavier. The ₹16.4 crore PRASHAD allocation is small compared with Ponda and Porvorim, but it targets exactly the things that frustrate visitors: cramped parking, poor crowd flow, and limited interpretation. Better visitor amenities here mean covered walkways, improved queuing, cleaner washrooms, and signage that explains the UNESCO complex as a whole rather than each monument in isolation.
            </p>
            <div className="p-4 rounded-xl border border-border/60 bg-card/60 text-xs text-muted-foreground space-y-2">
              <strong className="text-foreground font-semibold block text-sm">For Hosts & Homeowners:</strong>
              Old Goa and the surrounding villages - Ribandar, Chimbel, Santa Cruz - remain undervalued. Improved access and a more polished heritage trail could pull some demand away from the coastal belt toward the Mandovi riverside, where old Portuguese houses and quiet lanes are still affordable.
            </div>
          </div>

          {/* 4. Porvorim Creek Experience */}
          <div className="p-6 rounded-2xl border border-border bg-card/40 space-y-4">
            <h3 className="font-display text-2xl text-foreground flex items-center gap-2">
              <Waves className="h-5 w-5 text-ember" /> Porvorim Creek Experience (₹24 Cr)
            </h3>
            <p className="text-sm text-foreground/90">
              This Swadesh Darshan 2.0 project focuses on the creeks and backwaters behind Porvorim, likely threading through areas such as Salvador do Mundo and parts of the Socorro-Reis Magos watershed. For travelers, the appeal is a cooler, greener alternative to the beach belt - boardwalks, birdwatching, small cafés, and maybe kayak or canoe access. The experience works best in monsoon and the cooler months, when the creek is full and the mangroves are alive.
            </p>
            <p className="text-sm text-muted-foreground">
              Connectivity is the question. Many of these creek-side roads are narrow village lanes that flood in July and August. If the project includes proper embankments, drainage, and a small jetty or two, it becomes a genuine alternative to the usual North Goa itinerary. If it is just a signboard and a viewing point, skip it.
            </p>
            <div className="p-4 rounded-xl border border-border/60 bg-card/60 text-xs text-muted-foreground space-y-2">
              <strong className="text-foreground font-semibold block text-sm">For Hosts & Homeowners:</strong>
              Hosts in the immediate hinterland - Salvador do Mundo, Penha de França, and parts of Betim across the river - could benefit from travelers looking for "authentic" Goa without the beach-party crowd.
            </div>
          </div>

          {/* 5. Colva Beach Experience */}
          <div className="p-6 rounded-2xl border border-border bg-card/40 space-y-4">
            <h3 className="font-display text-2xl text-foreground flex items-center gap-2">
              <Sun className="h-5 w-5 text-ember" /> Colva Beach Experience (₹19.8 Cr)
            </h3>
            <p className="text-sm text-foreground/90">
              Colva is South Goa's most accessible beach, about 8 km west of Margao and well connected by road. The ₹19.8 crore allocation is aimed at improving the beachfront promenade, parking, lifeguard posts, toilets, lighting, and possibly water sports infrastructure. For travelers, this is the most immediately useful project. Colva already has shacks, parking lots, and weekend crowds; the upgrades should reduce the friction of a beach day rather than reinvent the place.
            </p>
            <div className="p-4 rounded-xl border border-border/60 bg-card/60 text-xs text-muted-foreground space-y-2">
              <strong className="text-foreground font-semibold block text-sm">For Hosts & Homeowners:</strong>
              Colva and nearby Benaulim and Sernabatim already have strong short-term rental demand, especially from families from Karnataka and Maharashtra. New facilities may increase occupancy and allow hosts to charge a slight premium in peak season, but they will also draw more day-trippers and noise. Quality control - gated parking, reliable Wi-Fi, backup power - will matter more than ever.
            </div>
          </div>

          {/* 6. Harvalem Waterfall */}
          <div className="p-6 rounded-2xl border border-border bg-card/40 space-y-4">
            <h3 className="font-display text-2xl text-foreground flex items-center gap-2">
              <Trees className="h-5 w-5 text-ember" /> Harvalem Waterfall Beautification and Development, Mayem Village (₹9.8 Cr)
            </h3>
            <p className="text-sm text-foreground/90">
              Harvalem, sometimes called Arvalem, is a 50-metre waterfall near Mayem village in Bicholim taluka, about 25 km from Panjim. The ₹9.8 crore project should improve approach roads, viewing decks, stairs, railings, washrooms, and possibly a small interpretation centre about the nearby Rudreshwar temple and ancient rock-cut caves. For travelers, the waterfall is best from June to October; by February it is often a thin trickle.
            </p>
            <p className="text-sm text-muted-foreground">
              The access road from Bicholim is reasonably good but can be narrow and slippery during monsoon. A four-wheel-drive is not essential in the dry season, but ground clearance helps after heavy rain.
            </p>
            <div className="p-4 rounded-xl border border-border/60 bg-card/60 text-xs text-muted-foreground space-y-2">
              <strong className="text-foreground font-semibold block text-sm">For Hosts & Homeowners:</strong>
              Mayem and Bicholim represent a true emerging market. There are very few curated stays in this belt, but demand is growing from travelers who want waterfalls, temples, and hinterland drives without the beach crowds. A small, well-maintained villa or homestay here could capture early attention, especially if the waterfall becomes part of a packaged North Goa hinterland route.
            </div>
          </div>
        </section>

        {/* Location Promo */}
        <WayzyyLocationPromo
          title="Planning a trip around Goa's heritage & hinterland circuit?"
          description="Discover verified villas, beach houses, and homestays on Wayzyy - filter by North Goa or South Goa with zero host commissions and direct host contact."
        />

        {/* Section 4: Getting Around */}
        <section className="space-y-6">
          <h2 className="font-display text-3xl sm:text-4xl text-foreground border-b border-border/60 pb-3 flex items-center gap-2">
            <Car className="h-7 w-7 text-ember" /> Getting Around the New Circuit
          </h2>
          <p>
            These six sites do not sit on a single neat route. Porvorim, Old Goa, and Harvalem are best explored from a North Goa base; Ponda and Colva sit further south and east. The most efficient plan is to split your stay: a few nights in North Goa for Porvorim, Old Goa, and Mayem, then a few nights in South Goa for Colva and Ponda. If you are comparing bases, platforms such as <strong className="font-semibold text-foreground">Wayzyy</strong> let you filter stays by North Goa or South Goa so you are not retracing the same highway every day.
          </p>
          <div className="p-5 rounded-xl border border-border bg-card/30 space-y-2 text-sm text-muted-foreground">
            <ul className="space-y-2 list-disc list-inside">
              <li><strong>Transport Choice:</strong> A rented scooter or small car is the easiest way to cover the circuit.</li>
              <li><strong>Public Buses:</strong> Local buses connect Panjim to Ponda, Margao, Bicholim, and Mapusa, but they are slow for hopping between multiple sites in one day.</li>
              <li><strong>Ride-Hailing:</strong> Ride-hailing apps work in Panjim and Margao but are unreliable in the hinterland.</li>
              <li><strong>Offline Navigation & Cash:</strong> Download offline maps before heading to Mayem or Ponda village roads, and carry cash for parking attendants and small shacks.</li>
            </ul>
          </div>
        </section>

        {/* Section 5: Which Project Should You Visit First & Verdict */}
        <section className="space-y-6">
          <h2 className="font-display text-3xl sm:text-4xl text-foreground border-b border-border/60 pb-3">
            Which Project Should You Visit First?
          </h2>
          <p>Start with what is already open, then plan around what fits your trip.</p>

          <h3 className="font-display text-2xl text-foreground mt-4">Quick comparison by traveler type</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div className="p-5 rounded-xl border border-border bg-card/30 space-y-2">
              <strong className="text-foreground font-semibold block text-base">Families with kids:</strong>
              Colva Beach Experience wins on convenience. The beach already has shacks, toilets, and parking lots, so new facilities just make the day easier. Bring swim gear and expect weekend crowds from Margao, 8 km away.
            </div>
            <div className="p-5 rounded-xl border border-border bg-card/30 space-y-2">
              <strong className="text-foreground font-semibold block text-base">Heritage lovers:</strong>
              Basilica of Bom Jesus is the obvious choice. It has been standing since 1605, the new PRASHAD money is only improving what already exists, and you do not need construction to finish before you go. The Chhatrapati Shivaji Maharaj Museum in Ponda is more speculative - plan it only if you are already passing through for temples or spice farms.
            </div>
            <div className="p-5 rounded-xl border border-border bg-card/30 space-y-2">
              <strong className="text-foreground font-semibold block text-base">Beachgoers:</strong>
              Skip Porvorim entirely. Colva gives you sand, water, and sunset. Harvalem Waterfall works only during or just after monsoon; by January it often slows to a trickle.
            </div>
            <div className="p-5 rounded-xl border border-border bg-card/30 space-y-2">
              <strong className="text-foreground font-semibold block text-base">Monsoon trippers:</strong>
              Harvalem Waterfall and Porvorim Creek Experience make the most sense. The waterfall is at its fullest from June to September, and a creek walkway is actually pleasant when the weather is grey rather than blazing hot.
            </div>
          </div>

          <h3 className="font-display text-2xl text-foreground mt-6">Honest verdict: go now vs. wait and watch</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 space-y-2">
              <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Already Worth a Visit
              </span>
              <h4 className="font-display text-base text-foreground">Basilica of Bom Jesus & Colva Beach</h4>
              <p className="text-xs text-muted-foreground">
                Both are functioning destinations where the funding will polish the edges rather than create something from scratch. You can visit today and still benefit later.
              </p>
            </div>

            <div className="p-5 rounded-2xl border border-amber-500/20 bg-amber-500/5 space-y-2">
              <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                Conditional
              </span>
              <h4 className="font-display text-base text-foreground">Porvorim Creek & Harvalem Waterfall</h4>
              <p className="text-xs text-muted-foreground">
                Visit if you are nearby or visiting in the right season (monsoon/winter). Do not build a whole itinerary around them yet.
              </p>
            </div>

            <div className="p-5 rounded-2xl border border-blue-500/20 bg-blue-500/5 space-y-2">
              <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                Wait and Watch
              </span>
              <h4 className="font-display text-base text-foreground">Ponda Museum & Porvorim Town Square</h4>
              <p className="text-xs text-muted-foreground">
                These are the two most expensive projects at ₹97.4 crore and ₹90.7 crore, but large museums and town squares take years to finish. Check back in 2027 or 2028.
              </p>
            </div>
          </div>
        </section>

        {/* Section 6: Infrastructure Gap */}
        <section className="space-y-6">
          <h2 className="font-display text-3xl sm:text-4xl text-foreground border-b border-border/60 pb-3">
            Goa’s Tourism Growth and the Infrastructure Gap
          </h2>
          <p>
            Goa’s visitor numbers have long outpaced its public infrastructure. Before the pandemic, the state was drawing well over eight million tourists annually on a resident population of roughly 1.5 million. That volume creates predictable pressure points: jammed coastal roads, overflowing parking at Calangute and Baga, patchy sewage and waste management, and a heavy concentration of visitors in a thin north-south coastal strip.
          </p>
          <p>
            The result is a distorted market. North Goa’s beach belt is saturated for much of the year, while inland talukas like Ponda, Sattari, Bicholim, and parts of Sanguem remain comparatively empty despite having temples, waterfalls, wildlife, and heritage homes. The Centre’s new projects reflect a broader attempt to redistribute tourism geographically and seasonally - to make the hinterland easier to reach, more comfortable to explore, and more viable as an overnight destination.
          </p>
          <p className="text-sm text-muted-foreground bg-card/40 p-4 rounded-xl border border-border">
            For travelers, the practical takeaway is that Goa is slowly becoming more than its beaches. The new investments do not yet add up to a transformed state, but they do signal where the comfortable, curated experiences of the next decade are likely to emerge: creek walks, restored churches, museum districts, and waterfall circuits that currently feel like detours.
          </p>
        </section>

        {/* Section 7: Short Term Rentals & Host Strategy */}
        <section className="space-y-6">
          <h2 className="font-display text-3xl sm:text-4xl text-foreground border-b border-border/60 pb-3">
            What This Means for Short-Term Rentals and Hosts
          </h2>
          <p>
            Every new tourism project reshapes demand, however slightly. Hosts who watch the construction closely can position themselves ahead of the curve:
          </p>

          <div className="space-y-4 text-sm text-muted-foreground">
            <div className="p-4 rounded-xl border border-border bg-card/30 space-y-1">
              <strong className="text-foreground font-semibold text-base block">Ponda and the museum effect:</strong>
              Temple tourism already brings buses and day-trippers to Ponda. A high-profile museum could extend that into a longer, more leisurely visit. Hosts with heritage homes, farm stays, or garden cottages in Ponda, Curti, and Farmagudi should think about adding basic comforts - reliable hot water, parking, and a local guidebook - rather than competing on luxury.
            </div>

            <div className="p-4 rounded-xl border border-border bg-card/30 space-y-1">
              <strong className="text-foreground font-semibold text-base block">Porvorim as a base town:</strong>
              A finished town square and creek experience could make Porvorim feel less like a bedroom suburb and more like a destination in its own right. Apartments and villas near the planned square could see stronger demand from families and business travelers who want proximity to Panjim without the capital's hotel rates.
            </div>

            <div className="p-4 rounded-xl border border-border bg-card/30 space-y-1">
              <strong className="text-foreground font-semibold text-base block">Old Goa and the riverside villages:</strong>
              Heritage upgrades at the Basilica will not suddenly turn Old Goa into a nightlife hub, but they will make it a calmer, more respectable base for culture-focused travelers. Hosts in Ribandar, Britona, and Santa Cruz can market easy access to Old Goa, Panjim, and the Mandovi riverfront as a single loop.
            </div>

            <div className="p-4 rounded-xl border border-border bg-card/30 space-y-1">
              <strong className="text-foreground font-semibold text-base block">Mayem and the waterfall circuit:</strong>
              This is the smallest allocation but possibly the biggest opportunity for early entrants. There are few quality short-term rentals near Harvalem, and the waterfall is already popular with monsoon travelers from Maharashtra and Karnataka. A well-reviewed homestay or villa with parking and a kitchen could capture visitors doing a Bicholim–Mayem–Arvalem day trip.
            </div>

            <div className="p-4 rounded-xl border border-border bg-card/30 space-y-1">
              <strong className="text-foreground font-semibold text-base block">Colva and the South Goa premium:</strong>
              Colva is already established, so the upside here is incremental. Hosts should focus on standing out through cleanliness, fast Wi-Fi, and responsive service rather than relying on new facilities to sell the property. The new beachfront amenities may raise expectations, so underdelivering on basics will hurt reviews more than before.
            </div>
          </div>

          <p className="text-sm text-foreground/90 pt-2">
            For hosts looking to list or improve visibility, curated platforms such as <strong className="font-semibold text-foreground">Wayzyy</strong> can help match properties with travelers who want verified stays, transparent pricing, and direct host contact - particularly in emerging areas where trust matters more than brand recognition.
          </p>
        </section>

        {/* FAQ Section */}
        <section className="space-y-6 pt-6">
          <h2 className="font-display text-3xl sm:text-4xl text-foreground border-b border-border/60 pb-3 flex items-center gap-3">
            <HelpCircle className="h-7 w-7 text-ember" /> Frequently Asked Questions About Goa Tourism Infrastructure Projects
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
            Final Thoughts: Are Goa's New Central-Funded Tourism Projects Worth Tracking?
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
            These six projects are not reasons to book a flight tomorrow. Most sites are either partially accessible or still in early stages, and none of them promise a radically different Goa by next season.
          </p>
          <p className="text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
            Still, they matter if you plan to return. The upgrades at Old Goa, Colva, and Porvorim address real pain points: limited parking, poor signage, crowded viewpoints, and almost no interpretation for heritage sites. For travelers who value context over crowds, the Ponda museum and Old Goa improvements will likely matter more than another beachfront promenade.
          </p>
          <p className="text-foreground font-medium max-w-2xl mx-auto text-sm sm:text-base">
            <strong>Our take:</strong> watch these projects, plan around them loosely, and spend your money on stays and experiences that already exist. The infrastructure is a bonus, not the main show.
          </p>

          <div className="pt-4 text-xs sm:text-sm text-muted-foreground border-t border-border/60">
            Looking for a villa or vacation rental in Goa? <strong className="text-foreground">Wayzyy</strong> helps you discover verified stays - villas, beach houses, and homestays - with direct host contact, zero commissions, and honest prices. Email us at{" "}
            <a href="mailto:hello@wayzyy.com" className="text-ember underline font-medium">
              hello@wayzyy.com
            </a>.
          </div>
        </section>
      </div>
    </BlogLayout>
  );
}
