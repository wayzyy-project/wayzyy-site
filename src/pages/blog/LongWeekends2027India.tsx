import { BlogLayout } from "@/components/BlogLayout";
import { blogPosts } from "@/lib/blogPosts";
import { HelpCircle } from "lucide-react";
import { Link } from "react-router-dom";

const post = blogPosts.find((p) => p.slug === "long-weekends-2027-india")!;

const ext = "text-ember hover:underline";

const faqs = [
  {
    q: "How many long weekends are there in 2027 in India?",
    a: "Based on the central government's gazetted holidays, 2027 has four long weekends with no leave needed: Good Friday (26–28 March), Mahavir Jayanti (17–19 April), Bakrid (15–17 May) and Diwali (29–31 October). Another four become four- or five-day breaks with one day of leave. If your office gives New Year's Day, 1–3 January is a long weekend too.",
  },
  {
    q: "What is the longest break you can get in 2027?",
    a: "Holi to Good Friday. Holi is on Tuesday 23 March and Good Friday on Friday 26 March, so taking 22, 24 and 25 March off gives you nine days, from Saturday 20 to Sunday 28 March, for three days of leave.",
  },
  {
    q: "Which 2027 holidays fall on a weekend?",
    a: "Independence Day (Sunday 15 August, the same day as Milad-un-Nabi), Gandhi Jayanti (Saturday 2 October), Dussehra (Saturday 9 October), Guru Nanak Jayanti (Sunday 14 November) and Christmas (Saturday 25 December).",
  },
  {
    q: "Is Diwali 2027 a long weekend?",
    a: "Yes. Diwali falls on Friday 29 October 2027 in the central government list, giving a three-day weekend from 29 to 31 October. State and company calendars may differ, so check yours.",
  },
  {
    q: "Where should I go on a long weekend in 2027?",
    a: "It depends on the month. January, March and late October suit Goa, Rajasthan and the coast. April and May suit hill stations like Himachal, Uttarakhand, Coorg and the Nilgiris. Book early for any long weekend, because prices rise sharply once dates fill.",
  },
  {
    q: "Are these holidays the same for private companies?",
    a: "Not necessarily. This list is the central government's gazetted holidays for offices in Delhi. Private companies and state governments set their own calendars, and Eid, Bakrid and Muharram dates depend on the moon and can shift by a day.",
  },
];

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
};

const noLeave = [
  { dates: "Fri 1 – Sun 3 Jan", days: "3", holiday: "New Year's Day (if your office observes it)", go: "Goa, Rajasthan, Kerala" },
  { dates: "Fri 26 – Sun 28 Mar", days: "3", holiday: "Good Friday", go: "Goa before the heat, Pondicherry" },
  { dates: "Sat 17 – Mon 19 Apr", days: "3", holiday: "Mahavir Jayanti", go: "Himachal, Uttarakhand, Coorg" },
  { dates: "Sat 15 – Mon 17 May", days: "3", holiday: "Id-ul-Zuha (Bakrid), date may shift", go: "Hill stations, Nilgiris" },
  { dates: "Fri 29 – Sun 31 Oct", days: "3", holiday: "Diwali", go: "Goa (season opening), Rajasthan" },
];

const withLeave = [
  { dates: "Sat 23 – Tue 26 Jan", days: "4", leave: "Mon 25 Jan", holiday: "Republic Day", go: "Goa, Rajasthan, Rann of Kutch" },
  { dates: "Sat 20 – Tue 23 Mar", days: "4", leave: "Mon 22 Mar", holiday: "Holi", go: "Goa, Rishikesh, Hampi" },
  { dates: "Thu 15 – Mon 19 Apr", days: "5", leave: "Fri 16 Apr", holiday: "Ram Navami + Mahavir Jayanti", go: "Himachal, Kashmir, Sikkim" },
  { dates: "Thu 20 – Sun 23 May", days: "4", leave: "Fri 21 May", holiday: "Buddha Purnima", go: "Hill stations, Ladakh opening" },
];

export default function LongWeekends2027India() {
  return (
    <BlogLayout
      title={post.title}
      description={post.description}
      metaTitle={post.metaTitle}
      metaDescription={post.metaDescription}
      heroImage={post.heroImage}
      heroImageAlt="Illustration of a 2027 desk calendar with several Friday-to-Monday stretches circled in orange, next to a suitcase and sunglasses"
      publishedDate={post.publishedDate}
      slug={post.slug}
      extraJsonLd={faqJsonLd}
    >
      <div className="space-y-6">
        <div className="rounded-2xl border border-ember/30 bg-ember/5 p-6">
          <p className="text-sm text-muted-foreground">
            <strong className="text-foreground">Long weekends in 2027:</strong> India's central government holiday list for
            2027 gives you <strong>four long weekends with no leave</strong>: Good Friday (26–28 March), Mahavir Jayanti
            (17–19 April), Bakrid (15–17 May) and Diwali (29–31 October). With <strong>one day of leave</strong>, Republic Day,
            Holi, Ram Navami and Buddha Purnima become four- or five-day breaks. The best deal of the year: take three days off
            around Holi and Good Friday for a <strong>nine-day break from 20 to 28 March</strong>.
          </p>
        </div>

        <p>
          The Department of Personnel and Training published the 2027 holiday list in July 2026: 17 gazetted holidays for
          central government offices in Delhi. Five of them fall on a weekend, which is bad news, but several land on a Monday
          or Friday, or close enough to bridge with one day of leave. Below is every long weekend in 2027, the leave to take,
          and where it's worth going in that season.
        </p>

        <h2 className="font-display text-2xl text-foreground mt-8">2027 long weekends with no leave</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border border-border rounded-xl overflow-hidden">
            <thead className="bg-card">
              <tr>
                <th className="text-left p-3 border-b border-border">Dates</th>
                <th className="text-left p-3 border-b border-border">Days</th>
                <th className="text-left p-3 border-b border-border">Holiday</th>
                <th className="text-left p-3 border-b border-border">Good for</th>
              </tr>
            </thead>
            <tbody>
              {noLeave.map((r) => (
                <tr key={r.dates}>
                  <td className="p-3 border-b border-border font-medium whitespace-nowrap">{r.dates}</td>
                  <td className="p-3 border-b border-border">{r.days}</td>
                  <td className="p-3 border-b border-border">{r.holiday}</td>
                  <td className="p-3 border-b border-border text-muted-foreground">{r.go}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2 className="font-display text-2xl text-foreground mt-8">2027 long weekends with one day of leave</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border border-border rounded-xl overflow-hidden">
            <thead className="bg-card">
              <tr>
                <th className="text-left p-3 border-b border-border">Dates</th>
                <th className="text-left p-3 border-b border-border">Days</th>
                <th className="text-left p-3 border-b border-border">Take off</th>
                <th className="text-left p-3 border-b border-border">Holiday</th>
                <th className="text-left p-3 border-b border-border">Good for</th>
              </tr>
            </thead>
            <tbody>
              {withLeave.map((r) => (
                <tr key={r.dates}>
                  <td className="p-3 border-b border-border font-medium whitespace-nowrap">{r.dates}</td>
                  <td className="p-3 border-b border-border">{r.days}</td>
                  <td className="p-3 border-b border-border whitespace-nowrap">{r.leave}</td>
                  <td className="p-3 border-b border-border">{r.holiday}</td>
                  <td className="p-3 border-b border-border text-muted-foreground">{r.go}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="italic text-muted-foreground border-l-2 border-ember pl-4">
          <span className="block not-italic text-xs uppercase tracking-wide text-ember mb-1">The best break of 2027</span>
          Holi is on Tuesday 23 March and Good Friday on Friday 26 March. Take Monday 22, Wednesday 24 and Thursday 25 March
          off, and you get nine days, from Saturday 20 to Sunday 28 March, for three days of leave.
        </p>

        <h2 className="font-display text-2xl text-foreground mt-8">The holidays you lose to the weekend</h2>
        <p>
          Five 2027 holidays fall on a Saturday or Sunday: Independence Day (Sunday 15 August, the same day as Milad-un-Nabi),
          Gandhi Jayanti (Saturday 2 October), Dussehra (Saturday 9 October), Guru Nanak Jayanti (Sunday 14 November) and
          Christmas (Saturday 25 December). Mid-week holidays, Id-ul-Fitr (Wednesday 10 March), Muharram (Wednesday 16 June) and
          Janmashtami (Wednesday 25 August), need two days of leave to become a four-day break.
        </p>

        <h2 className="font-display text-2xl text-foreground mt-8">Where to go, by season</h2>
        <p>
          <strong>January to March (Republic Day, Holi, Good Friday):</strong> peak season on the coast. Goa is at its best
          before the April heat, and Rajasthan is pleasant. For Goa, start with our{" "}
          <Link to="/blog/best-time-to-visit-goa" className={ext}>
            best time to visit Goa
          </Link>{" "}
          and{" "}
          <Link to="/blog/where-to-stay-in-goa-2026" className={ext}>
            where to stay
          </Link>{" "}
          guides. A nine-day Holi-to-Easter break is long enough for North and South Goa together. See our{" "}
          <Link to="/blog/goa-itinerary-guide" className={ext}>
            Goa itineraries
          </Link>
          .
        </p>
        <p>
          <strong>April and May (Ram Navami, Mahavir Jayanti, Bakrid, Buddha Purnima):</strong> hill station season. Himachal,
          Uttarakhand, Coorg and the Nilgiris fill up fast. Many hill states now require homestays to be registered, so check
          for a registration number when you book. Our{" "}
          <Link to="/blog/homestay-registration-rules-by-state-india" className={ext}>
            state-by-state homestay guide
          </Link>{" "}
          explains why.
        </p>
        <p>
          <strong>October (Diwali):</strong> the first weekend of Goa's new season, with the monsoon over and shacks
          reopening. Rajasthan is cooling down too.
        </p>
        <p>
          <strong>December (Christmas on a Saturday):</strong> no extra day off, but Christmas week in Goa is still the busiest
          of the year. Our{" "}
          <Link to="/blog/goa-december-new-year-guide-2026" className={ext}>
            Goa December guide
          </Link>{" "}
          covers what that's like.
        </p>

        <h2 className="font-display text-2xl text-foreground mt-8">How to book a long weekend without overpaying</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>Book as soon as you know your dates.</strong> Everyone sees the same long weekends, and villa and homestay
            prices climb as they fill.
          </li>
          <li>
            <strong>Split the cost.</strong> For a group or family, one villa usually costs less per person than several hotel
            rooms. See{" "}
            <Link to="/blog/hotels-in-goa" className={ext}>
              hotel vs villa in Goa
            </Link>
            .
          </li>
          <li>
            <strong>Check the final price, not the headline.</strong> Platform fees and GST change the total. Stays up to
            ₹7,500 a night carry 5% GST.
          </li>
          <li>
            <strong>Pay only through the platform,</strong> never a deposit by UPI to a host you haven't met. Our{" "}
            <Link to="/blog/how-to-book-verified-stay-in-goa" className={ext}>
              verified stay checklist
            </Link>{" "}
            explains the scams to avoid.
          </li>
        </ul>
        <p>
          Planning a Goa long weekend?{" "}
          <Link to="/goa-stays" className={ext}>
            Browse verified Goa stays on Wayzyy
          </Link>
          , with ID-verified hosts and a 7% guest fee already included in the price.
        </p>
        <p className="text-sm text-muted-foreground">
          Dates are from the Department of Personnel and Training's list of gazetted holidays for 2027 (OM dated 16 July 2026)
          for central government offices in Delhi. State governments and private employers set their own holidays, and
          moon-dependent festivals can shift by a day.
        </p>
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
