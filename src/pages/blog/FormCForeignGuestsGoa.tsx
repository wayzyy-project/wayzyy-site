import { BlogLayout } from "@/components/BlogLayout";
import { blogPosts } from "@/lib/blogPosts";
import { HelpCircle } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

const post = blogPosts.find((p) => p.slug === "form-c-foreign-guests-airbnb-hosts-goa")!;

const ext = "text-ember hover:underline";

const faqs = [
  {
    q: "What is Form C?",
    a: "Form C is the report an accommodation provider in India files when a foreign national stays at their property. Under the Immigration and Foreigners Act, 2025 it must be submitted online within 24 hours of the guest's arrival. The online system now also labels it Form III.",
  },
  {
    q: "Do Airbnb hosts in Goa need to file Form C?",
    a: "Yes, for every foreign guest. Section 8 of the Immigration and Foreigners Act, 2025 puts the duty on the 'keeper of accommodation', which covers hotels, guest houses, homestays, villas and rented rooms. The Goa government's December 2025 notice names private house owners housing foreign nationals alongside hoteliers.",
  },
  {
    q: "What is the deadline for Form C?",
    a: "Within 24 hours of the foreign guest's arrival. The guest's departure should also be recorded within 24 hours of check-out.",
  },
  {
    q: "What is the penalty for not filing Form C in Goa?",
    a: "The Goa government's December 2025 notice puts it at ₹50,000 per case. Under the Act itself, failing to report is an offence under section 23, which allows imprisonment of up to three years, a fine of up to ₹3 lakh, or both, though section 25 lets such offences be compounded by paying a set sum.",
  },
  {
    q: "Do I need to file Form C for OCI cardholders or NRIs?",
    a: "OCI cardholders are foreign nationals and must be reported. NRIs who hold Indian passports are Indian citizens and do not need Form C.",
  },
  {
    q: "Which website do I use to file Form C?",
    a: "The Bureau of Immigration's e-FRRO system at indianfrro.gov.in. The Goa government's notice refers to the Bureau's main site, boi.gov.in, which links to the same service.",
  },
  {
    q: "Do I have to visit the FRRO office to register?",
    a: "Hotels and commercial units print the signed registration form and submit it to the FRRO to get their user ID approved. Individual home owners can activate their login online with an OTP sent to their registered mobile number, without a visit, according to the Goa government's December 2025 notice.",
  },
  {
    q: "Is Form C the same as the TIME app?",
    a: "No. TIME collects monthly, anonymous guest statistics for Goa's Tourism Department. Form C reports each foreign guest's identity to the immigration authorities within 24 hours. Hosts with foreign guests need to do both.",
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
  name: "How to file Form C for a foreign guest in Goa",
  description: "Register once as an accommodation provider on the Bureau of Immigration's e-FRRO system, then file Form C within 24 hours of each foreign guest's arrival.",
  step: [
    { "@type": "HowToStep", name: "Register as an accommodation provider", text: "Fill in the accommodation registration form on indianfrro.gov.in with your property address and ownership details." },
    { "@type": "HowToStep", name: "Activate your login", text: "Hotels and commercial units submit the signed, sealed printout to the FRRO for approval. Individual home owners activate the login with an OTP sent to their registered mobile number." },
    { "@type": "HowToStep", name: "Collect the guest's documents at check-in", text: "Take copies of the passport photo page and the visa or OCI card, and note the arrival date and time." },
    { "@type": "HowToStep", name: "File Form C within 24 hours", text: "Log in, enter the guest's name, nationality, passport number, visa details and arrival details, upload the documents and submit. Save the acknowledgement." },
    { "@type": "HowToStep", name: "Record the departure", text: "Within 24 hours of check-out, record the guest's departure on the same system and keep the records for at least a year." },
  ],
};

export default function FormCForeignGuestsGoa() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const toggleFaq = (index: number) => setOpenFaq(openFaq === index ? null : index);

  return (
    <BlogLayout
      title={post.title}
      description={post.description}
      metaTitle={post.metaTitle}
      metaDescription={post.metaDescription}
      heroImage={post.heroImage}
      heroImageAlt="Illustration of a passport and a villa key on a wooden table beside a small clock showing 24 hours, with a Goan window behind"
      publishedDate={post.publishedDate}
      slug={post.slug}
      extraJsonLd={[faqJsonLd, howToJsonLd]}
    >
      <div className="space-y-6">
        <div className="rounded-2xl border border-ember/30 bg-ember/5 p-6">
          <p className="text-sm text-muted-foreground">
            <strong className="text-foreground">Quick answer:</strong> if a foreign national stays at your Goa villa,
            homestay or Airbnb, you must report them to the immigration authorities by filing Form C online within 24 hours of
            their arrival. That includes OCI cardholders. The duty comes from section 8 of the Immigration and Foreigners Act,
            2025 and Rule 17 of its 2025 Rules. The Goa government puts the penalty at ₹50,000 for each guest not reported. You
            register once on the Bureau of Immigration's e-FRRO system (indianfrro.gov.in), and home owners can activate their
            login with an OTP instead of visiting the FRRO.
          </p>
        </div>

        <p>
          Every winter Goa fills up with foreign visitors, and plenty of them stay in villas, homestays and rented apartments
          rather than hotels. Most of those hosts know about tourism
          registration. Far fewer know that every foreign guest also has to be reported to the immigration authorities, within a
          day, on a completely separate system.
        </p>
        <p>
          The law behind this changed in September 2025, and Goa Police and the FRRO have been actively checking. Here's what hosts need to know.
        </p>

        <h2 className="font-display text-2xl text-foreground mt-8">What changed in 2025</h2>
        <p>
          The <strong>Immigration and Foreigners Act, 2025</strong> came into force on 1 September 2025. It replaced four older
          laws, including the Foreigners Act, 1946 and the Registration of Foreigners Act, 1939, under which Form C had been
          required for decades. The obligation itself didn't change much. What changed is that it now sits in one modern law
          with clearer rules and stiffer consequences.
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>Section 8</strong> makes it the duty of the "keeper of accommodation" to submit information about foreigners
            staying there.
          </li>
          <li>
            <strong>Rule 17</strong> of the Immigration and Foreigners Rules, 2025 sets out how: online, within 24 hours of
            arrival, with the departure recorded too.
          </li>
          <li>
            The same rules require the accommodation provider to <strong>keep the records electronically for at least a
            year</strong>, and to show them on demand to the Registration Officer, the District Magistrate or a police officer.
          </li>
          <li>
            The online system still says "C-Form" in most places, but the login page is now headed "Form III". It's the same
            filing.
          </li>
        </ul>

        <h2 className="font-display text-2xl text-foreground mt-8">Does it apply to you?</h2>
        <p>
          If you're paid to host a foreign national, yes. Hotels, guest houses, homestays, villas, B&amp;Bs and a single rented
          room all count, and so does a stay of a few hours. The Goa government's notice of 10 December 2025 lists
          "hoteliers, guest house operators and private house owners housing foreign nationals" as the people who must file.
        </p>
        <p>A few details that catch hosts out:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>Every guest, separately.</strong> A group of four foreign friends is four Form Cs, not one.
          </li>
          <li>
            <strong>OCI cardholders count.</strong> They're foreign nationals, and the 2025 Rules name them. An NRI with an
            Indian passport doesn't need reporting.
          </li>
          <li>
            <strong>Booking through a platform doesn't change it.</strong> Airbnb's own help page for Indian hosts tells hosts
            to register with the FRRO and file C-Forms themselves.
          </li>
          <li>
            <strong>Your own guests are different.</strong> The Act exempts residential premises of a non-commercial nature,
            so a friend staying for free isn't covered unless local authorities have directed otherwise for your area.
          </li>
        </ul>

        <p className="italic text-muted-foreground border-l-2 border-ember pl-4">
          <span className="block not-italic text-xs uppercase tracking-wide text-ember mb-1">Why the 24 hours matters</span>
          If a guest turns out to be overstaying their visa, a filed Form C shows you did your part. An unfiled one puts the
          property owner in the investigation.
        </p>

        <h2 className="font-display text-2xl text-foreground mt-8">What the penalty actually is</h2>
        <p>
          The Goa government's December 2025 notice is blunt: non-submission of Form C attracts a penalty of{" "}
          <strong>₹50,000 per case</strong>. For a villa that hosts a family of four for a week, that's up to ₹2 lakh for one
          missed booking.
        </p>
        <p>
          That's the figure most hosts will face. The law behind it is stricter. Section 8 has no penalty clause of its own, so
          a failure to report falls under <strong>section 23</strong> of the Act, which covers contraventions of the Act or its
          rules: imprisonment of up to three years, a fine of up to ₹3 lakh, or both. Section 25 allows such offences to be
          compounded, settled by paying a sum, instead of going to trial. In practice, that's why a fixed figure is quoted.
        </p>

        <h2 className="font-display text-2xl text-foreground mt-8">Goa is checking</h2>
        <p>This isn't a paper rule in Goa. Recent enforcement, all reported in local papers:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            In June 2025, police registered <strong>FIRs against six landlords</strong> for letting premises to foreign
            nationals without filing Form C: two at Anjuna, and one each at Mandrem, Mapusa, Verna and Colva. The same drive
            found 23 foreign nationals staying illegally between January and May, 21 of them in North Goa.
          </li>
          <li>
            The FRRO's Special Task Force has since traced overstaying foreign nationals in Goa, and{" "}
            <strong>directed accommodation providers across the state to follow Form C rules strictly</strong>.
          </li>
          <li>
            The Goa government issued its December 2025 notice specifically to explain the new Act, the forms and the ₹50,000
            penalty to hoteliers and home owners.
          </li>
        </ul>
        <p>
          Notice who was booked in June 2025: landlords renting out premises, not hotel chains. When foreign nationals are found
          staying in Goa illegally, the first question is where they stayed and whether that stay was reported. A missing Form
          C makes the guest's problem the host's problem too.
        </p>

        <h2 className="font-display text-2xl text-foreground mt-8">How to register (once)</h2>
        <p>
          Form C is filed on the Bureau of Immigration's e-FRRO system,{" "}
          <a href="https://indianfrro.gov.in" target="_blank" rel="noopener noreferrer" className={ext}>
            indianfrro.gov.in
          </a>
          . The Goa government's notice also points to the Bureau's main site, boi.gov.in. Before you can file anything, you
          register as an accommodation provider.
        </p>
        <ol className="list-decimal pl-6 space-y-3">
          <li>
            <strong>Fill the accommodation registration form</strong> online with your property's address and ownership
            details.
          </li>
          <li>
            <strong>Activate the login.</strong> This is where Goa's notice splits two kinds of provider:
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>
                <strong>Hotels and commercial units:</strong> print the signed application, put your seal on it and submit it
                to the FRRO, which approves your user ID.
              </li>
              <li>
                <strong>Individual home owners:</strong> no visit needed. Submit the form, and an OTP goes to your registered
                mobile number. Enter it with your user ID on the activation page. You'll need an Indian mobile number.
              </li>
            </ul>
          </li>
        </ol>
        <p>
          Keep the property documents handy. Airbnb's guidance for Indian hosts lists what FRRO offices typically ask for: for
          homestays and B&amp;Bs, the premises address, ownership details and operating licence; for individual houses and
          apartments, a utility bill and property tax receipt in your name and the sale deed or rent agreement. Your local
          office may ask for more. Your{" "}
          <Link to="/blog/goa-airbnb-registration-rules" className={ext}>
            Goa Tourism registration
          </Link>{" "}
          is a separate requirement, but having it in order makes this step simpler.
        </p>

        <h2 className="font-display text-2xl text-foreground mt-8">Filing for each guest</h2>
        <p>Once you're registered, each foreign guest takes a few minutes:</p>
        <ol className="list-decimal pl-6 space-y-3">
          <li>
            <strong>At check-in,</strong> take a copy of the guest's passport photo page and their visa (or OCI card), and
            note the date and time they arrived.
          </li>
          <li>
            <strong>Within 24 hours,</strong> log in and fill Form C: name, nationality, passport number, visa or OCI details,
            arrival date and time, and your address. Upload the documents and submit.
          </li>
          <li>
            <strong>Save the acknowledgement.</strong> Some FRRO offices ask for printed copies, so keeping a PDF of each one is
            the easy option.
          </li>
          <li>
            <strong>At check-out,</strong> record the departure within 24 hours. The guest should give you the departure date
            and their next address.
          </li>
          <li>
            <strong>Keep everything for at least a year,</strong> as the 2025 Rules require.
          </li>
        </ol>
        <p>
          If a guest arrives late at night, the 24 hours still runs from arrival. The safest habit is to file at check-in,
          while the passport is in front of you. It's also worth saying in your listing that you'll need passport and visa
          copies at check-in, so foreign guests aren't surprised.
        </p>

        <h2 className="font-display text-2xl text-foreground mt-8">Form C is not the TIME app</h2>
        <p>
          Goa hosts with foreign guests have two different reporting duties, to two different authorities. Form C goes to the
          immigration system, guest by guest, within 24 hours. The{" "}
          <Link to="/blog/goa-time-app-airbnb-hosts" className={ext}>
            TIME app
          </Link>{" "}
          goes to Goa's Tourism Department once a month, as anonymous statistics for every guest, Indian or foreign, by the
          5th. TIME records a foreign guest's country but not their passport, so it doesn't count as reporting them. The
          Tourism Department's own advisory says units hosting foreign tourists must file both.
        </p>

        <h2 className="font-display text-2xl text-foreground mt-8">The short version</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>Register once on indianfrro.gov.in as an accommodation provider. Home owners can activate with an OTP.</li>
          <li>File Form C for every foreign guest, OCI holders included, within 24 hours of arrival.</li>
          <li>Record the departure within 24 hours of check-out, and keep records for a year.</li>
          <li>Separately, file TIME (Form XI) for all guests by the 5th of each month.</li>
          <li>Missing a Form C costs ₹50,000 per guest in Goa, and the Act allows far more.</li>
        </ul>
        <p>
          If you're booking a stay in Goa as a foreign visitor, a host asking for your passport and visa at check-in isn't being
          nosy: they're required by law to file this within a day. It's one of the signs of a legitimate, compliant listing,
          like the checks in our guide on{" "}
          <Link to="/blog/how-to-book-verified-stay-in-goa" className={ext}>
            how to book a verified stay in Goa
          </Link>
          .
        </p>
        <p className="text-sm text-muted-foreground">
          This guide explains the rules as published. It isn't legal advice. Requirements can vary by FRRO office, so check
          with Goa's FRRO if your situation is unusual.
        </p>
      </div>

      <div className="border-t border-border mt-16 pt-12">
        <h3 className="font-display text-2xl text-foreground mb-6 flex items-center gap-2">
          <HelpCircle className="w-6 h-6 text-ember" />
          Frequently Asked Questions
        </h3>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="border border-border rounded-xl bg-card overflow-hidden transition-all duration-200">
              <button
                onClick={() => toggleFaq(index)}
                className="w-full text-left px-6 py-4 flex items-center justify-between font-display text-foreground hover:bg-muted/50 transition-colors"
              >
                <span>{faq.q}</span>
                <span className="text-muted-foreground font-light text-xl">{openFaq === index ? "−" : "+"}</span>
              </button>
              {openFaq === index && (
                <div className="px-6 pb-5 text-muted-foreground border-t border-border/50 pt-4 text-sm leading-relaxed">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </BlogLayout>
  );
}
