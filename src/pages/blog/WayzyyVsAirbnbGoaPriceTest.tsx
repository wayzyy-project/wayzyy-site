import { BlogLayout } from "@/components/BlogLayout";
import { blogPosts } from "@/lib/blogPosts";
import { Link } from "react-router-dom";

const post = blogPosts.find((p) => p.slug === "wayzyy-vs-airbnb-goa-price-test")!;
const linkClass = "text-ember hover:underline";

const rows = [
  { villa: "Celestial Groove 3BHK, Siolim", airbnb: "₹40,000", airbnbGst: "₹47,200", wayzyy: "₹42,676", diff: "Wayzyy about 10% lower" },
  { villa: "Lux 4BHK private pool, Assagao", airbnb: "₹38,386", airbnbGst: "₹45,295", wayzyy: "₹49,078", diff: "Wayzyy about 8% higher" },
  { villa: "4BHK private pool, Morjim", airbnb: "₹55,200", airbnbGst: "₹65,136", wayzyy: "₹68,708", diff: "Wayzyy about 5% higher" },
  { villa: "Lux 4BHK sea-view pool, Candolim", airbnb: "₹44,898", airbnbGst: "₹52,980", wayzyy: "₹55,132", diff: "Wayzyy about 4% higher" },
];

const faqs = [
  { q: "Is Wayzyy always cheaper than Airbnb?", a: "No. In this test Wayzyy was lower on one villa and higher on three. Prices change by date, and a host's rate on each platform can be updated at different times, so compare the final total for your own dates." },
  { q: "Why did you add GST to the Airbnb figures?", a: "Airbnb shows the total before taxes on the listing page, while Wayzyy shows GST in the total. Each villa's nightly rate was above ₹7,500, so we added 18% to the Airbnb figure to compare like with like. Airbnb's own checkout is the final word on its tax line." },
  { q: "Does Wayzyy charge a cleaning fee?", a: "Not on these four villas. Wayzyy showed cleaning as free on every listing. Celestial Groove carried a one-time ₹4,000 charge on Airbnb for the same stay." },
  { q: "Why would the same villa cost different amounts?", a: "Platform fees, promotions such as Airbnb's host discounts, calendars that are not updated at the same moment, and cancellation terms can all differ. See our guide to Goa villa booking fees for the full list." },
];

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map(({ q, a }) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })),
};

export default function WayzyyVsAirbnbGoaPriceTest() {
  return (
    <BlogLayout post={post} heroImageAlt="Comparing the same Goa villa prices on Wayzyy and Airbnb" extraJsonLd={faqJsonLd}>
      <div className="space-y-6">
        <div className="rounded-2xl border border-ember/30 bg-ember/5 p-6">
          <p className="text-sm text-muted-foreground">
            <strong className="text-foreground">Quick answer:</strong> for the same four Goa villas on 20–22 November 2026, Wayzyy's final total was about 10% lower on one villa and 4–8% higher on the other three. Neither site wins every time, so check the final total for your own dates.
          </p>
        </div>

        <p>
          People ask us whether Wayzyy is cheaper than Airbnb. The honest answer depends on the villa and the date, so on 4 November 2026 we priced four villas that are listed on both sites for the same stay and wrote down what each one showed.
        </p>
        <p>
          Wayzyy is one of the two platforms here, so this is not an independent review. We show the method and every number so you can repeat it.
        </p>

        <h2 className="font-display text-2xl text-foreground mt-8">How we ran the test</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Dates:</strong> check-in 20 November, checkout 22 November 2026 (2 nights, a Friday and Saturday).</li>
          <li><strong>Guests:</strong> 2 adults on both sites, so no extra-guest charge applies.</li>
          <li><strong>Airbnb:</strong> the total shown on the listing page for those dates. Airbnb displays this before taxes, so we added 18% GST for the comparison because every villa's nightly rate was above ₹7,500.</li>
          <li><strong>Wayzyy:</strong> the total on the booking panel, which already includes GST and the 7% service fee.</li>
          <li><strong>Same villas:</strong> each one is the same property listed on both platforms.</li>
        </ul>

        <h2 className="font-display text-2xl text-foreground mt-8">The results</h2>
        <div className="overflow-x-auto border border-border rounded-xl">
          <table className="w-full text-sm text-left">
            <thead className="bg-card">
              <tr>
                <th className="p-3 border-b border-border">Villa</th>
                <th className="p-3 border-b border-border">Airbnb (before tax)</th>
                <th className="p-3 border-b border-border">Airbnb + 18% GST</th>
                <th className="p-3 border-b border-border">Wayzyy total</th>
                <th className="p-3 border-b border-border">Difference</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={r.villa}>
                  <td className={`p-3 font-medium ${i < rows.length - 1 ? "border-b border-border" : ""}`}>{r.villa}</td>
                  <td className={`p-3 ${i < rows.length - 1 ? "border-b border-border" : ""}`}>{r.airbnb}</td>
                  <td className={`p-3 ${i < rows.length - 1 ? "border-b border-border" : ""}`}>{r.airbnbGst}</td>
                  <td className={`p-3 ${i < rows.length - 1 ? "border-b border-border" : ""}`}>{r.wayzyy}</td>
                  <td className={`p-3 ${i < rows.length - 1 ? "border-b border-border" : ""}`}>{r.diff}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-sm text-muted-foreground">
          Prices read on 4 November 2026 for 20–22 November, 2 adults. They will have moved by the time you read this.
        </p>

        <h2 className="font-display text-2xl text-foreground mt-8">What explains the gaps</h2>
        <ul className="list-disc pl-6 space-y-3">
          <li>
            <strong>Celestial Groove (Wayzyy lower).</strong> Airbnb's ₹40,000 includes a one-time ₹4,000 charge on top of ₹18,000 a night. Wayzyy shows cleaning as free, so the stay comes out lower even after Wayzyy's 7% fee and GST.
          </li>
          <li>
            <strong>Assagao (Wayzyy higher).</strong> Airbnb was showing a host discount that day, ₹38,386 against an original ₹47,982. Wayzyy's rate for the same nights had not moved down to match.
          </li>
          <li>
            <strong>Morjim and Candolim (Wayzyy higher).</strong> Airbnb's nightly rate had come in below the rate on Wayzyy. A host rate can be updated on one platform before the other, so a small gap like this is common.
          </li>
        </ul>
        <p>
          The pattern is that a villa with a mandatory cleaning charge on Airbnb tends to favour Wayzyy, while a villa where the host has just cut the Airbnb rate tends to favour Airbnb. That is why we do not claim a fixed percentage saving.
        </p>

        <h2 className="font-display text-2xl text-foreground mt-8">How to check your own stay in two minutes</h2>
        <ol className="list-decimal pl-6 space-y-3">
          <li><strong>Open the same villa on both sites</strong> with identical dates and guest count.</li>
          <li><strong>Read the final total, not the nightly rate.</strong> Our <Link to="/blog/goa-villa-booking-fees-explained" className={linkClass}>booking fees guide</Link> lists every line to look for.</li>
          <li><strong>Add the tax Airbnb leaves out</strong> until checkout, and keep any refundable deposit separate.</li>
          <li><strong>Match the cancellation terms</strong> before choosing the lower number.</li>
        </ol>

        <p>
          For the wider picture on why prices differ between platforms, read{" "}
          <Link to="/blog/why-villas-goa-different-prices-platforms" className={linkClass}>why Goa villas cost different amounts on different platforms</Link>{" "}
          and our comparison of{" "}
          <Link to="/blog/airbnb-vs-booking-vs-wayzyy" className={linkClass}>Airbnb, Booking.com and Wayzyy</Link>. You can search the same villas on the{" "}
          <Link to="/stays" className={linkClass}>Wayzyy stays page</Link>.
        </p>

        <h2 className="font-display text-2xl text-foreground mt-8">Frequently asked questions</h2>
        <div className="space-y-4">
          {faqs.map(({ q, a }) => (
            <div key={q} className="rounded-xl border border-border p-5">
              <h3 className="font-semibold text-foreground">{q}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{a}</p>
            </div>
          ))}
        </div>
      </div>
    </BlogLayout>
  );
}
