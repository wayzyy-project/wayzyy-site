import { BlogLayout } from "@/components/BlogLayout";
import { blogPosts } from "@/lib/blogPosts";
import { HelpCircle } from "lucide-react";
import { Link } from "react-router-dom";

const post = blogPosts.find((p) => p.slug === "goa-december-new-year-guide-2026")!;

const ext = "text-ember hover:underline";

const faqs = [
  {
    q: "Is Sunburn happening in Goa in December 2026?",
    a: "No. Sunburn left Goa after the 2024 edition at Vagator. The 2026 festival is in Mumbai, at Mahalaxmi Racecourse on 18 and 19 December. Goa still has plenty of New Year parties, but not Sunburn.",
  },
  {
    q: "What are the main events in Goa in December 2026?",
    a: "The Feast of St Francis Xavier at Old Goa on 3 December (a public holiday), the Serendipity Arts Festival in Panaji from 13 to 20 December, Goa Liberation Day on 19 December, Christmas Eve midnight Masses on 24 December, and New Year's Eve on 31 December. IFFI, the film festival, runs in Panaji just before, from 20 to 28 November.",
  },
  {
    q: "Is December a good time to visit Goa?",
    a: "For weather, yes: it's dry, sunny and the sea is calm. The trade-off is crowds and prices, which peak between Christmas and New Year. The first two weeks of December give you the same weather with far less traffic.",
  },
  {
    q: "How bad is New Year's Eve traffic in Goa?",
    a: "Bad in the party belts. On 31 December 2025, the Candolim-Calangute-Baga stretch and Anjuna-Vagator were gridlocked from the evening onwards. Police made Bharat Junction to Tito's Circle in Baga a no-vehicle zone from 3 pm to 6 am. Plan to walk or stay within walking distance of where you'll spend the night.",
  },
  {
    q: "Does music stop at 10 pm in Goa?",
    a: "Outdoor amplified music needs permission, and those permissions come with a 10 pm cut-off. Indoor venues and clubs often run later, and enforcement around Anjuna and Vagator has been patchy, which is why residents there complain about late-night noise every December.",
  },
  {
    q: "Where should I stay in Goa for New Year's Eve?",
    a: "Somewhere you can walk from, to wherever you plan to spend midnight. For parties, that's Baga-Calangute or Anjuna-Vagator. For a quieter New Year, try Mandrem or Ashwem in the north, or Palolem, Patnem and Agonda in the south. For Serendipity and Christmas Mass, stay in Panaji or Fontainhas.",
  },
  {
    q: "When should I book a stay for Christmas and New Year in Goa?",
    a: "As early as you can. Good villas for the last week of December are usually booked three to four months ahead. If you're booking late, look beyond Baga and Anjuna, check that the listing shows a Goa Tourism registration number, and never pay a deposit outside the platform.",
  },
];

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
};

const events = [
  { date: "20–28 Nov", name: "IFFI (International Film Festival of India)", where: "Panaji", note: "Just before December, but it fills Panaji hotels." },
  { date: "3 Dec (Thu)", name: "Feast of St Francis Xavier", where: "Old Goa", note: "Public holiday in Goa. Huge crowds at the Basilica." },
  { date: "13–20 Dec", name: "Serendipity Arts Festival", where: "Panaji", note: "A week of art, music, food and performance across the city." },
  { date: "18–19 Dec", name: "Sunburn", where: "Mumbai, not Goa", note: "Mahalaxmi Racecourse. No Sunburn in Goa this year." },
  { date: "19 Dec (Sat)", name: "Goa Liberation Day", where: "Statewide", note: "Public holiday, parades and events in Panaji." },
  { date: "24–25 Dec", name: "Christmas", where: "Churches across Goa", note: "Midnight Mass on Christmas Eve is the big night." },
  { date: "31 Dec", name: "New Year's Eve", where: "Baga, Anjuna, Vagator and beyond", note: "Peak traffic and peak prices." },
];

const eventsJsonLd = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Goa events, December 2026",
  itemListElement: events.map((e, i) => ({ "@type": "ListItem", position: i + 1, name: `${e.name} (${e.date}, ${e.where})` })),
};

export default function GoaDecemberNewYearGuide() {
  return (
    <BlogLayout
      title={post.title}
      description={post.description}
      metaTitle={post.metaTitle}
      metaDescription={post.metaDescription}
      heroImage={post.heroImage}
      heroImageAlt="Illustration of a Goan beach at night with a star lantern, string lights across a shack and fireworks over the sea"
      publishedDate={post.publishedDate}
      slug={post.slug}
      extraJsonLd={[faqJsonLd, eventsJsonLd]}
    >
      <div className="space-y-6">
        <div className="rounded-2xl border border-ember/30 bg-ember/5 p-6">
          <p className="text-sm text-muted-foreground">
            <strong className="text-foreground">Quick answer:</strong> December is Goa's best-weather month and its most
            crowded. In 2026 the big dates are the Feast of St Francis Xavier (3 December), the Serendipity Arts Festival in
            Panaji (13 to 20 December), Christmas and New Year's Eve. Sunburn is <em>not</em> in Goa this year: it's in Mumbai
            on 18 and 19 December. Come in the first half of the month for the weather without the crush. If you're coming
            for New Year, book early, stay within walking distance of your party, and expect Baga and Anjuna to be gridlocked
            from the evening of the 31st.
          </p>
        </div>

        <p>
          Everyone has the same idea about Goa in December, and that's the problem. The monsoon is long gone, the sea has
          settled, the shacks are all open, and the days are warm and dry. It's the month Goa is at its best, and also the
          month the roads are at their worst.
        </p>
        <p>
          This guide is for planning December 2026 specifically: what's on and when, what changed this year, what New Year's
          Eve is actually like on the ground, and where to stay depending on the kind of December you want. If you're still
          deciding <em>whether</em> to come in December, our{" "}
          <Link to="/blog/best-time-to-visit-goa" className={ext}>
            best time to visit Goa
          </Link>{" "}
          guide compares every month.
        </p>

        <h2 className="font-display text-2xl text-foreground mt-8">What's on: December 2026 at a glance</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border border-border rounded-xl overflow-hidden">
            <thead className="bg-card">
              <tr>
                <th className="text-left p-3 border-b border-border">Date</th>
                <th className="text-left p-3 border-b border-border">Event</th>
                <th className="text-left p-3 border-b border-border">Where</th>
                <th className="text-left p-3 border-b border-border">Worth knowing</th>
              </tr>
            </thead>
            <tbody>
              {events.map((e) => (
                <tr key={e.name}>
                  <td className="p-3 border-b border-border whitespace-nowrap font-medium">{e.date}</td>
                  <td className="p-3 border-b border-border">{e.name}</td>
                  <td className="p-3 border-b border-border">{e.where}</td>
                  <td className="p-3 border-b border-border text-muted-foreground">{e.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2 className="font-display text-2xl text-foreground mt-8">The big change: Sunburn isn't in Goa</h2>
        <p>
          For years, "Goa in December" and "Sunburn" were almost the same search. Not anymore. The festival's last Goa edition
          was in Vagator in 2024. It moved to Mumbai in 2025, and the 2026 edition is at <strong>Mahalaxmi Racecourse in
          Mumbai on 18 and 19 December</strong>.
        </p>
        <p>
          That matters if you're planning around it: there's no reason to book North Goa for Sunburn week. It also changes the
          feel of the week before Christmas in Vagator, which used to fill up with festival crowds. New Year's Eve parties in
          Goa haven't gone anywhere, though. Clubs and beach venues across Baga, Anjuna and Vagator still run their own events.
          For the venues themselves, see our{" "}
          <Link to="/blog/goa-nightlife-guide" className={ext}>
            Goa nightlife guide
          </Link>
          .
        </p>

        <h2 className="font-display text-2xl text-foreground mt-8">Early December: the best-kept window</h2>
        <p>
          If you have any flexibility, the first two weeks of December are the sweet spot. You get the same weather as
          Christmas week without the traffic, and the calendar has two genuinely Goan events that most visitors miss.
        </p>
        <p>
          <strong>The Feast of St Francis Xavier, 3 December.</strong> This is one of the biggest days in Goa's Catholic
          calendar. The novena (nine days of prayer) builds up to it, and on the feast itself pilgrims fill the Basilica of Bom
          Jesus in Old Goa, where the saint's relics are kept. It's a public holiday in Goa, and in 2026 it falls on a
          Thursday. Go early in the morning, dress modestly, and expect heavy traffic on the Panaji-Old Goa road.
        </p>
        <p>
          <strong>Serendipity Arts Festival, 13 to 20 December.</strong> A week of visual art, music, theatre, food and craft
          spread across venues in Panaji. It's the best reason to base yourself in the capital rather than on a beach for a
          few days. Panaji's old Latin quarter, Fontainhas, is a short walk from most venues. Our{" "}
          <Link to="/blog/fontainhas-goa-guide" className={ext}>
            Fontainhas guide
          </Link>{" "}
          covers what to see and where to park.
        </p>
        <p>
          <strong>Goa Liberation Day, 19 December.</strong> The anniversary of Goa's liberation from Portuguese rule in 1961.
          It's a public holiday, with official events in Panaji. In 2026 it falls on a Saturday, so expect a busy weekend.
        </p>

        <h2 className="font-display text-2xl text-foreground mt-8">Christmas in Goa</h2>
        <p>
          Christmas is the part of December that feels most like Goa rather than a beach holiday. Homes and shops put up paper
          star lanterns, villages build nativity cribs, and bakeries sell traditional sweets in the run-up to the 25th.
        </p>
        <p>
          The big night is <strong>Christmas Eve</strong>, when churches across the state hold midnight Mass. The
          whitewashed churches in Panaji and the villages are packed, and many visitors attend respectfully. Get there early,
          dress for church rather than the beach, and don't treat it as a photo opportunity. Remember that locals on their way
          to Mass are using the same jammed roads as party traffic, as residents in North Goa pointed out last New Year.
        </p>

        <h2 className="font-display text-2xl text-foreground mt-8">New Year's Eve: what it's actually like</h2>
        <p>
          New Year's Eve is when Goa is busiest, and the reality is less glamorous than the Instagram version. Here's what
          happened last year, from local reporting and the police plan, which is the best guide to what to expect this year.
        </p>
        <p>
          <strong>The roads lock up.</strong> On 31 December 2025, traffic in the Candolim-Calangute-Baga stretch and the
          Anjuna-Vagator belt built up from the evening and got worse through the night. Residents described cars parked on
          both sides of village roads and in front of gates, and warned that an ambulance couldn't get through.
        </p>
        <p>
          <strong>Parts of Baga close to vehicles.</strong> Last year's police advisory made Bharat Junction to Tito's Circle in
          Baga a non-motorised zone from 3 pm to 6 am, turned several Calangute-Baga roads into one-way streets, and banned
          tourist buses and tempos from Calangute from 21 December to 31 January. Cars were sent to about 15 temporary parking
          grounds. Vasco's Bogmalo road, Colva-Benaulim and Palolem had their own diversions and parking plans. Expect a
          similar advisory for 2026, published by Goa Traffic Police in the last week of December.
        </p>
        <p>
          <strong>Music rules exist, unevenly.</strong> Outdoor amplified music needs permission, and permissions are given
          until 10 pm. Indoor clubs often run much later. Enforcement has been patchy: residents around Anjuna and Vagator
          complained last year of loud music every night from Christmas Day onwards. If you're staying nearby, that's your
          December soundtrack too.
        </p>

        <p className="italic text-muted-foreground border-l-2 border-ember pl-4">
          <span className="block not-italic text-xs uppercase tracking-wide text-ember mb-1">The one rule for New Year's Eve</span>
          Stay within walking distance of wherever you'll be at midnight. A ten-minute drive on a normal evening can take an
          hour on the 31st, and getting back at 2 am is harder than getting there.
        </p>

        <h2 className="font-display text-2xl text-foreground mt-8">Where to stay, by the December you want</h2>
        <ul className="list-disc pl-6 space-y-3">
          <li>
            <strong>For the parties:</strong> Baga-Calangute or Anjuna-Vagator, close enough to walk to your venue. Accept the
            noise and the traffic as part of the deal. Our{" "}
            <Link to="/blog/baga-goa-beach-guide" className={ext}>
              Baga
            </Link>{" "}
            and{" "}
            <Link to="/blog/anjuna-goa-beach-guide" className={ext}>
              Anjuna
            </Link>{" "}
            guides cover each area.
          </li>
          <li>
            <strong>For a calmer New Year in the north:</strong>{" "}
            <Link to="/blog/candolim-goa-beach-guide" className={ext}>
              Candolim
            </Link>{" "}
            is busy but less frantic than Baga. Further north,{" "}
            <Link to="/blog/mandrem-goa-beach-guide" className={ext}>
              Mandrem
            </Link>{" "}
            and{" "}
            <Link to="/blog/ashwem-goa-beach-guide" className={ext}>
              Ashwem
            </Link>{" "}
            are far quieter, with none of Baga's gridlock.
          </li>
          <li>
            <strong>For culture and Christmas:</strong> Panaji and Fontainhas, especially for Serendipity week and midnight
            Mass.
          </li>
          <li>
            <strong>For quiet:</strong> South Goa.{" "}
            <Link to="/blog/palolem-beach-south-goa-guide" className={ext}>
              Palolem
            </Link>{" "}
            gets lively on New Year's Eve but is calmer than the north;{" "}
            <Link to="/blog/patnem-beach-south-goa-guide" className={ext}>
              Patnem
            </Link>{" "}
            and{" "}
            <Link to="/blog/agonda-beach-south-goa-guide" className={ext}>
              Agonda
            </Link>{" "}
            are quieter still. See our{" "}
            <Link to="/blog/where-to-stay-in-south-goa" className={ext}>
              South Goa stay guide
            </Link>
            .
          </li>
        </ul>

        <h2 className="font-display text-2xl text-foreground mt-8">Booking a December stay without getting burned</h2>
        <p>
          Peak season is when a too-good-to-be-true listing is most tempting, because everything else is booked. A few rules
          for booking a villa or homestay this month:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>Book early.</strong> Good villas for 24 to 31 December usually go three to four months ahead. If it's
            November and you're still looking, widen your search beyond Baga and Anjuna.
          </li>
          <li>
            <strong>Check for a registration number.</strong> Since January 2026, Goa requires short-term rentals to show their
            tourism registration number on the listing. No number is a red flag, especially in peak season. Our{" "}
            <Link to="/blog/goa-airbnb-registration-rules" className={ext}>
              registration rules explainer
            </Link>{" "}
            covers what to look for.
          </li>
          <li>
            <strong>Never pay outside the platform.</strong> A host asking for a deposit by UPI or bank transfer "to hold the
            dates" is a classic scam. Our guide to{" "}
            <Link to="/blog/how-to-book-verified-stay-in-goa" className={ext}>
              booking a verified stay in Goa
            </Link>{" "}
            has the full checklist.
          </li>
          <li>
            <strong>Ask about parking and walking distances.</strong> In December, "10 minutes from the beach" by car can mean
            40. Ask how far the property is on foot.
          </li>
          <li>
            <strong>Foreign guests:</strong> expect your host to ask for your passport and visa at check-in. They're legally
            required to report you within 24 hours. See our{" "}
            <Link to="/blog/form-c-foreign-guests-airbnb-hosts-goa" className={ext}>
              Form C guide
            </Link>
            .
          </li>
        </ul>

        <h2 className="font-display text-2xl text-foreground mt-8">A quick December checklist</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>Weather: warm, dry days and cooler evenings. Pack light layers and sunscreen.</li>
          <li>Transport: rent a scooter early, because rentals can run short in the last week. Our <Link to="/blog/goa-scooter-rental-guide" className={ext}>scooter rental guide</Link> has the rules.</li>
          <li>Cash: carry some. Parking lots and smaller shacks don't always take UPI.</li>
          <li>Old Goa on 3 December: go early, dress modestly.</li>
          <li>New Year's Eve: plan your route home before you leave, and don't drink and drive. Police are out in force on the 31st.</li>
        </ul>
      </div>

      <div className="border-t border-border mt-16 pt-12">
        <h3 className="font-display text-2xl text-foreground mb-6 flex items-center gap-2">
          <HelpCircle className="w-6 h-6 text-ember" />
          Frequently Asked Questions
        </h3>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <details
              key={index}
              className="group border border-border rounded-xl bg-card overflow-hidden transition-all duration-200"
            >
              <summary className="cursor-pointer list-none [&::-webkit-details-marker]:hidden w-full text-left px-6 py-4 flex items-center justify-between font-display text-foreground hover:bg-muted/50 transition-colors">
                <span>{faq.q}</span>
                <span className="text-muted-foreground font-light text-xl group-open:hidden">+</span>
                <span className="text-muted-foreground font-light text-xl hidden group-open:inline">−</span>
              </summary>
              <div className="px-6 pb-5 text-muted-foreground border-t border-border/50 pt-4 text-sm leading-relaxed">
                {faq.a}
              </div>
            </details>
          ))}
        </div>
      </div>
    </BlogLayout>
  );
}
