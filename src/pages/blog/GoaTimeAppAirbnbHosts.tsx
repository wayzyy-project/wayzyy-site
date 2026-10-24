import { BlogLayout } from "@/components/BlogLayout";
import { blogPosts } from "@/lib/blogPosts";
import { HelpCircle } from "lucide-react";
import { Link } from "react-router-dom";

const post = blogPosts.find((p) => p.slug === "goa-time-app-airbnb-hosts")!;

const ext = "text-ember hover:underline";

const faqs = [
  {
    q: "What is the TIME app in Goa?",
    a: "TIME (Tourist Information Management Enterprise) is the Goa Tourism Department's online system for collecting guest statistics from accommodation providers. It sits on the Goa Online portal at goaonline.gov.in/TIME, and every registered unit uses it to file its monthly Form XI return.",
  },
  {
    q: "Do Airbnb hosts in Goa have to use TIME?",
    a: "Yes. The Tourism Department's advisory of 30 September 2025 names Airbnb hosts alongside hoteliers and guest house owners, and its April 2026 notice repeats that short-term rental hosts must register and submit guest check-in data.",
  },
  {
    q: "When is the Form XI deadline?",
    a: "Guest data for each month has to be uploaded on TIME by the 5th of the following month. October's guests, for example, are due by 5 November.",
  },
  {
    q: "What guest information does TIME ask for?",
    a: "Broad statistics, not identity documents: age group, country of origin for foreign guests or state of residence for Indian guests, length of stay and purpose of visit. Goa's Tourism Director has said passport and Aadhaar details are not collected through TIME.",
  },
  {
    q: "Can I use TIME if my property is not registered with Goa Tourism?",
    a: "No. Adding a property to TIME starts with entering the Tourism Department registration or certificate number and an OTP sent to the mobile number linked to that registration. Without a registration number there is nothing to file against, which is why registration comes first.",
  },
  {
    q: "What happens if I don't file Form XI?",
    a: "The Tourism Department treats missed or inaccurate submissions as a violation under Rule 17 of the Goa Registration of Tourist Trade (Amendment) Rules, 2022. Penalties can include fines and, for persistent non-compliance, suspension or cancellation of the operating licence. Renewal of your registration certificate is also refused until the previous year's Form XI data has been filed on TIME.",
  },
  {
    q: "Is TIME the same as Form C for foreign guests?",
    a: "No. TIME collects anonymous statistics for the Tourism Department. Foreign guests must also be reported separately to the immigration authorities through Form C within 24 hours of arrival. One does not replace the other.",
  },
  {
    q: "Who do I call if TIME isn't working?",
    a: "The Form XI call centre on 8882-254-254 (extension 31 for North Goa, 32 for South Goa), Monday to Friday, 10 am to 5:30 pm. You can also email tourism@goaelectronics.co.in with the subject 'Statistics Proforma as per Form XI', or call Goa Tourism's 24x7 helpline on 1364.",
  },
];

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
};

const howToJsonLd = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "How to file Form XI on Goa's TIME app",
  description: "Register on Goa Online, link your tourism registration, and upload last month's guest statistics before the 5th.",
  step: [
    { "@type": "HowToStep", name: "Create a Goa Online account", text: "Register at goaonline.gov.in with your name, address, date of birth, email and mobile number, and verify with the OTP." },
    { "@type": "HowToStep", name: "Link your property", text: "On the TIME page, enter your Goa Tourism registration or certificate number and verify the OTP sent to the mobile number linked to that registration." },
    { "@type": "HowToStep", name: "Upload the authority letter", text: "Download the authority letter format from the TIME page, sign it, upload it, and wait for the Tourism Department to approve the request. Approval is confirmed by SMS." },
    { "@type": "HowToStep", name: "Fill the Excel template", text: "Under Tourist Registration (Form XI), download the Excel format and enter last month's guests: age group, country or state, length of stay and purpose of visit." },
    { "@type": "HowToStep", name: "Upload and submit", text: "Upload the file, choose Upload Valid Data, check the figures shown for the month, then click Submit for that month and year before the 5th." },
  ],
};

export default function GoaTimeAppAirbnbHosts() {
  return (
    <BlogLayout
      title={post.title}
      description={post.description}
      metaTitle={post.metaTitle}
      metaDescription={post.metaDescription}
      heroImage={post.heroImage}
      heroImageAlt="Illustration of a wall calendar on a Goan blue-tiled wall with the 5th circled in orange, next to a guest register and a house key"
      publishedDate={post.publishedDate}
      slug={post.slug}
      extraJsonLd={[faqJsonLd, howToJsonLd]}
    >
      <div className="space-y-6">
        <div className="rounded-2xl border border-ember/30 bg-ember/5 p-6">
          <p className="text-sm text-muted-foreground">
            <strong className="text-foreground">Quick answer:</strong> every registered short-term rental in Goa, Airbnb
            listings included, has to upload last month's guest statistics to the Tourism Department's TIME app by the 5th of
            each month. This return is called Form XI. It asks for age group, country or state, length of stay and purpose of
            visit, not ID documents. Missing it can mean fines under Rule 17 of the 2022 amendment rules, and your registration
            won't be renewed until the previous year's data is in. You can only use TIME once your property is registered.
          </p>
        </div>

        <p>
          When we wrote about{" "}
          <Link to="/blog/goa-airbnb-registration-rules" className={ext}>
            Goa's Airbnb registration rules
          </Link>
          , we covered how to get registered. This is the next step, and the one that keeps showing up in Tourism Department
          notices: what registered hosts have to file every month.
        </p>
        <p>
          That monthly thing is TIME. It has been around since 2024, became properly mandatory in April 2025, and in the
          past year the Tourism Department has sent a pre-season order, two reminders and a warning about inspections. This guide
          covers what it is, who has to use it, how to file, and the one detail that catches out hosts who haven't registered.
        </p>

        <h2 className="font-display text-2xl text-foreground mt-8">What TIME actually is</h2>
        <p>
          TIME stands for <strong>Tourist Information Management Enterprise</strong>. It's a module on the state's{" "}
          <a href="https://goaonline.gov.in/TIME" target="_blank" rel="noopener noreferrer" className={ext}>
            Goa Online portal
          </a>{" "}
          where accommodation providers file a monthly statistical return, the <strong>Form XI</strong> "Statistical Proforma".
          The government uses the numbers to track who is visiting Goa, from where, for how long and why. When the system was
          made compulsory in 2025, Tourism Minister Rohan Khaunte told the Assembly it would give the state comprehensive data on
          tourist arrivals. He added that Goa recorded average tourism growth of 22% in 2024, with hotels full from October to
          December.
        </p>
        <p>
          The important thing for hosts to understand is what TIME is <em>not</em>. It isn't a guest identity register, and it
          isn't a police or immigration filing. Tourism Director Kedar Naik said when it launched that only broad demographic
          details are collected, with no passports and no Aadhaar numbers. That makes it less invasive than people assume, and
          also means it doesn't cover your other reporting duties (more on that below).
        </p>

        <h2 className="font-display text-2xl text-foreground mt-8">Who has to file</h2>
        <p>
          Every accommodation unit registered with the Department of Tourism. The department's advisory of 30 September 2025 is
          addressed to "all hoteliers and accommodation units", and it names guest house owners and Airbnb hosts specifically.
          If you rent out a villa, an apartment, a homestay room or a B&amp;B in Goa on any platform, Airbnb, Booking.com,
          MakeMyTrip or Wayzyy, this applies to you.
        </p>
        <p>
          The most recent notice, dated 24 April 2026, went further. It reminded C and D category hotels that submissions are
          overdue, warned unregistered hotels and guest houses of closure and legal proceedings, and said individuals renting
          through Airbnb or similar platforms must register with the department. Inspection teams, it said, would check TIME
          submissions and licence validity across the state.
        </p>

        <p className="italic text-muted-foreground border-l-2 border-ember pl-4">
          <span className="block not-italic text-xs uppercase tracking-wide text-ember mb-1">The detail most hosts miss</span>
          You can't file on TIME without a tourism registration number. The first step in adding a property is entering that
          number and confirming an OTP on the mobile linked to it. An unregistered host can't comply even if they want to.
        </p>

        <h2 className="font-display text-2xl text-foreground mt-8">The deadline: the 5th, every month</h2>
        <p>
          Form XI for any month is due by the <strong>5th of the following month</strong>. October's guests are due by 5
          November, November's by 5 December, and so on, including months where you had no bookings at all. The TIME page
          states the monthly requirement has applied since 1 April 2024, and the revised Form XI has been mandatory since 1
          April 2025.
        </p>
        <p>
          The deadline is short on purpose, and it's the main reason hosts fall behind. In December you're turning over guests
          every few days, and the 5th of January arrives in the middle of the busiest week of the year. The hosts who handle it
          well fill in the four fields at check-in instead of rebuilding the month from booking emails.
        </p>

        <h2 className="font-display text-2xl text-foreground mt-8">What you'll be asked for</h2>
        <p>
          The upload is an Excel template you download from TIME. According to the Tourism Department's description when the
          system launched, it captures:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>Age group</strong> of each guest
          </li>
          <li>
            <strong>Country of origin</strong> for foreign guests, or <strong>state of residence</strong> for Indian guests
          </li>
          <li>
            <strong>Length of stay</strong>
          </li>
          <li>
            <strong>Purpose of visit</strong>
          </li>
        </ul>
        <p>
          Our suggestion: keep a simple sheet with those four columns and fill a row when a guest checks in. Most guests will
          tell you their home state and why they're visiting in the first two minutes anyway. At month end, you paste the rows
          into the official template and upload.
        </p>

        <h2 className="font-display text-2xl text-foreground mt-8">How to file, step by step</h2>
        <p>
          This is the process as described on the TIME page itself. The first three steps are one-time setup. After that, it's
          just the monthly upload.
        </p>
        <ol className="list-decimal pl-6 space-y-3">
          <li>
            <strong>Create a Goa Online account.</strong> Register at goaonline.gov.in with your name, address, date of birth,
            email and mobile number, and verify with the OTP. If you registered your property online, you probably already have
            this login.
          </li>
          <li>
            <strong>Link your property.</strong> On the TIME page, enter your Goa Tourism registration or certificate number. An
            OTP goes to the mobile number linked to that registration, so make sure you can receive it. If a caretaker or
            manager registered the property under their number, sort this out first.
          </li>
          <li>
            <strong>Upload the authority letter.</strong> Download the authority letter format from the TIME page, sign it and
            upload it. The Tourism Department verifies the request, and you get an SMS when it's approved.
          </li>
          <li>
            <strong>Each month, fill the Excel template.</strong> Go to "Statistical Proforma as per Form XI", select your
            property and click "Submit Form XI". Under the "Tourist Registration (Form XI)" menu, choose Upload Excel and
            download the format.
          </li>
          <li>
            <strong>Upload, check and submit.</strong> Upload the completed file and confirm with "Upload Valid Data". Check the
            figures shown for the month, then click Submit for that month and year. You can upload more than once in a month,
            either overwriting or adding to the data already there.
          </li>
        </ol>
        <p>
          Larger operators can skip the spreadsheet: TIME offers API integration with hotel booking systems, and the technical
          document is linked from the TIME page. For a single villa or a few rooms, the Excel route takes a few minutes a month.
        </p>

        <h2 className="font-display text-2xl text-foreground mt-8">What happens if you don't file</h2>
        <p>There are two consequences, and the second one is the one that bites.</p>
        <p>
          <strong>Penalties.</strong> The September 2025 advisory says missed, incomplete or inaccurate submissions count as
          non-compliance under <strong>Rule 17 of the Goa Registration of Tourist Trade (Amendment) Rules, 2022</strong>. That
          can mean fines and sanctions, and persistent or wilful non-compliance can lead to suspension or cancellation of your
          operating licence. The April 2026 notice added that inspection teams would be checking.
        </p>
        <p>
          <strong>Blocked renewal.</strong> Per the TIME page, a registration certificate isn't renewed unless the previous
          year's Form XI data has been submitted on TIME. So a host who ignored TIME for a year finds out at renewal time, with
          a lapsed registration, at the exact moment every platform is being told to remove listings without a valid number.
        </p>
        <p>
          Enforcement has been uneven so far. When TIME became mandatory, Smita Patil, who runs an eco agro-tourism property,
          told Goemkarponn the initiative was commendable but lacked proper enforcement, and that unregistered guest houses were
          still outside the system altogether. The pre-season order, the two reminders and the inspection warning since then
          suggest the department has been working on exactly that.
        </p>

        <h2 className="font-display text-2xl text-foreground mt-8">TIME is not Form C</h2>
        <p>
          Because TIME records each foreign guest's country, it's easy to assume it also covers foreign-guest reporting. It
          doesn't.
        </p>
        <p>
          Foreign nationals staying at your property must be reported to the immigration authorities through{" "}
          <strong>Form C within 24 hours of arrival</strong>, under the Immigration and Foreigners Act, 2025. That's a separate
          system run by the Bureau of Immigration, with its own login, and the penalty in Goa is ₹50,000 per unreported guest.
          The Tourism Department's own advisory says units hosting foreign tourists must file both. We've written a separate
          guide on{" "}
          <Link to="/blog/form-c-foreign-guests-airbnb-hosts-goa" className={ext}>
            Form C for foreign guests
          </Link>
          .
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border border-border rounded-xl overflow-hidden">
            <thead className="bg-card">
              <tr>
                <th className="text-left p-3 border-b border-border"></th>
                <th className="text-left p-3 border-b border-border">TIME (Form XI)</th>
                <th className="text-left p-3 border-b border-border">Form C</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="p-3 border-b border-border font-medium">Who it goes to</td>
                <td className="p-3 border-b border-border">Goa Department of Tourism</td>
                <td className="p-3 border-b border-border">Bureau of Immigration / FRRO</td>
              </tr>
              <tr>
                <td className="p-3 border-b border-border font-medium">Which guests</td>
                <td className="p-3 border-b border-border">All guests, Indian and foreign</td>
                <td className="p-3 border-b border-border">Foreign nationals only (OCI included)</td>
              </tr>
              <tr>
                <td className="p-3 border-b border-border font-medium">Deadline</td>
                <td className="p-3 border-b border-border">By the 5th of next month</td>
                <td className="p-3 border-b border-border">Within 24 hours of arrival</td>
              </tr>
              <tr>
                <td className="p-3 border-b border-border font-medium">What's reported</td>
                <td className="p-3 border-b border-border">Statistics: age group, origin, stay, purpose</td>
                <td className="p-3 border-b border-border">Identity: passport, visa, arrival details</td>
              </tr>
              <tr>
                <td className="p-3 font-medium">Where</td>
                <td className="p-3">goaonline.gov.in/TIME</td>
                <td className="p-3">indianfrro.gov.in</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h2 className="font-display text-2xl text-foreground mt-8">A simple monthly routine</h2>
        <p>If you host in Goa, this is the whole compliance calendar for guest data, in four lines:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>At check-in:</strong> note the guest's age group, home state or country, nights booked and reason for the
            trip.
          </li>
          <li>
            <strong>Within 24 hours, foreign guests only:</strong> file Form C.
          </li>
          <li>
            <strong>By the 5th:</strong> upload last month's sheet to TIME and submit, even if the month was empty.
          </li>
          <li>
            <strong>Before renewal:</strong> check that every month of the past year shows as submitted.
          </li>
        </ul>

        <h2 className="font-display text-2xl text-foreground mt-8">If you're stuck</h2>
        <p>
          The TIME page lists a dedicated Form XI call centre on <strong>8882-254-254</strong>: extension 31 for North Goa, 32
          for South Goa, Monday to Friday, 10 am to 5:30 pm. You can also email{" "}
          <strong>tourism@goaelectronics.co.in</strong> with the subject line "Statistics Proforma as per Form XI". For anything
          else, Goa Tourism's 24x7 call centre is on <strong>1364</strong>. The TIME page also links a user manual and a help
          video, which are worth five minutes before your first upload.
        </p>
        <p>
          If you're not registered yet, TIME isn't your problem today. Registration is, and with the Department of Tourism
          quoting up to 90 days to process an application, it's worth starting now. Our{" "}
          <Link to="/goa-host-compliance-checklist" className={ext}>
            Goa Host's Compliance Checklist
          </Link>{" "}
          walks through the documents and the application, and the{" "}
          <Link to="/blog/goa-airbnb-registration-rules" className={ext}>
            registration rules explainer
          </Link>{" "}
          covers what changed in 2026.
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
