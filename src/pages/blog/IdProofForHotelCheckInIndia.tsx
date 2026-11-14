import { BlogLayout } from "@/components/BlogLayout";
import { blogPosts } from "@/lib/blogPosts";
import { HelpCircle } from "lucide-react";
import { Link } from "react-router-dom";

const post = blogPosts.find((p) => p.slug === "id-proof-for-hotel-check-in-india")!;

const ext = "text-ember hover:underline";

const faqs = [
  {
    q: "Which ID proof is valid for hotel check-in in India?",
    a: "Any valid government-issued photo ID that the property accepts: Aadhaar, passport, driving licence or voter ID are the most widely accepted. PAN cards are often refused because they don't show an address. Foreign nationals need their passport and a valid visa or OCI card.",
  },
  {
    q: "Is Aadhaar mandatory for hotel check-in?",
    a: "No. Aadhaar is one accepted option, not a requirement. You can use a passport, driving licence or voter ID instead, though hotels must still verify every guest's identity in some form.",
  },
  {
    q: "Can a hotel keep a photocopy of my Aadhaar?",
    a: "UIDAI says storing Aadhaar photocopies violates the Aadhaar Act, and in December 2025 announced plans for a rule requiring hotels to register as verification entities and check Aadhaar through its app or QR codes instead of keeping copies. As of August 2026, it was still described as an upcoming framework. Until then, you can share a masked Aadhaar, which hides all but the last four digits.",
  },
  {
    q: "Why do some hotels not accept local ID?",
    a: "It's the hotel's own policy, not a legal rule. Some hotels refuse guests whose ID shows an address in the same city, usually out of caution about misuse. If you're booking in your own city, check the property's policy before you pay.",
  },
  {
    q: "Do all guests need ID, or just the person who booked?",
    a: "Usually every adult guest. Most hotels and homestays ask for photo ID from each adult staying in the room, not just the person whose name is on the booking.",
  },
  {
    q: "What documents do foreigners need to check in to a hotel in India?",
    a: "A passport and a valid Indian visa or OCI card. The host or hotel must report every foreign guest on Form C to the immigration authorities within 24 hours of arrival, so they'll need to see and record these documents.",
  },
  {
    q: "Can unmarried couples check in with separate IDs?",
    a: "Yes. There's no law stopping unmarried adults from sharing a room, and no legal requirement to show a marriage certificate. Each adult simply shows their own ID. Some hotels do refuse couples as their own policy.",
  },
];

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
};

const ids = [
  { id: "Aadhaar card", ok: "Widely accepted", note: "Share a masked Aadhaar if you can. Hotels shouldn't keep photocopies." },
  { id: "Passport", ok: "Accepted everywhere", note: "Required for foreign guests, with a visa or OCI card." },
  { id: "Driving licence", ok: "Widely accepted", note: "A good alternative if you'd rather not share Aadhaar." },
  { id: "Voter ID", ok: "Widely accepted", note: "Government photo ID with address." },
  { id: "PAN card", ok: "Often refused", note: "Has a photo but no address. Carry a second ID." },
  { id: "Office or college ID", ok: "Usually refused", note: "Not government-issued." },
];

export default function IdProofForHotelCheckInIndia() {
  return (
    <BlogLayout
      title={post.title}
      description={post.description}
      metaTitle={post.metaTitle}
      metaDescription={post.metaDescription}
      heroImage={post.heroImage}
      heroImageAlt="Illustration of a reception counter with a bell, a room key card and several ID cards fanned out, one marked with a green tick"
      publishedDate={post.publishedDate}
      slug={post.slug}
      extraJsonLd={faqJsonLd}
    >
      <div className="space-y-6">
        <div className="rounded-2xl border border-ember/30 bg-ember/5 p-6">
          <p className="text-sm text-muted-foreground">
            <strong className="text-foreground">Quick answer:</strong> to check in to a hotel, homestay or Airbnb in India,
            every adult guest needs a <strong>valid government photo ID</strong>. Aadhaar, a passport, a driving licence and a
            voter ID are the most widely accepted. <strong>Aadhaar isn't mandatory</strong>, and UIDAI says hotels shouldn't
            store photocopies of it. Foreign nationals need a passport and visa or OCI card. Some hotels refuse local IDs or
            unmarried couples as their own policy, but no law requires either.
          </p>
        </div>

        <p>
          ID at check-in is one of the most common reasons travellers in India get turned away or stuck at reception, often
          over a document they didn't think to bring. The rules are simpler than they seem: there's no single national list,
          but there's a clear set of IDs that work almost everywhere, and a few things hotels ask for that aren't legal
          requirements at all.
        </p>

        <h2 className="font-display text-2xl text-foreground mt-8">Which ID works where</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border border-border rounded-xl overflow-hidden">
            <thead className="bg-card">
              <tr>
                <th className="text-left p-3 border-b border-border">ID</th>
                <th className="text-left p-3 border-b border-border">Acceptance</th>
                <th className="text-left p-3 border-b border-border">Worth knowing</th>
              </tr>
            </thead>
            <tbody>
              {ids.map((r) => (
                <tr key={r.id}>
                  <td className="p-3 border-b border-border font-medium">{r.id}</td>
                  <td className="p-3 border-b border-border">{r.ok}</td>
                  <td className="p-3 border-b border-border text-muted-foreground">{r.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p>
          The safest habit: carry two of these. If a property turns down one, you have a backup, and you're not stuck at the
          desk after a long journey.
        </p>

        <h2 className="font-display text-2xl text-foreground mt-8">Is Aadhaar compulsory?</h2>
        <p>
          No. Hotels must verify every guest's identity, but Aadhaar is just one way to do it. A passport, driving licence or
          voter ID does the same job. If a property insists on Aadhaar specifically, that's its preference, not the law.
        </p>

        <h2 className="font-display text-2xl text-foreground mt-8">The Aadhaar photocopy change</h2>
        <p>
          Handing over an Aadhaar photocopy at reception has been normal for years. UIDAI, which runs Aadhaar, wants that to
          stop. Its position is that <strong>storing Aadhaar photocopies violates the Aadhaar Act</strong>. In December 2025 it
          announced plans for a rule under which hotels and other private businesses would register with UIDAI as{" "}
          <strong>Offline Verification Seeking Entities</strong> and verify guests through the new Aadhaar app, secure QR codes
          or approved offline methods, instead of collecting copies. The app lets you share only what's needed: for a hotel,
          that could be your name and age bracket.
        </p>
        <p>
          As of August 2026, this was still described as an upcoming framework, not a rule in force. Until it is, two simple
          protections help: use a <strong>masked Aadhaar</strong>, downloadable from UIDAI, which hides all but the last four
          digits, or show a different ID instead.
        </p>

        <p className="italic text-muted-foreground border-l-2 border-ember pl-4">
          <span className="block not-italic text-xs uppercase tracking-wide text-ember mb-1">Privacy tip</span>
          If you hand over a paper copy, write the purpose and date across it, for example "For check-in at [property],
          [date] only". It makes the copy much harder to misuse.
        </p>

        <h2 className="font-display text-2xl text-foreground mt-8">Rules that aren't really rules</h2>
        <ul className="list-disc pl-6 space-y-3">
          <li>
            <strong>"No local IDs."</strong> Some hotels refuse guests whose ID shows an address in the same city. That's a
            hotel policy, not a law. If you're booking locally, check before you pay.
          </li>
          <li>
            <strong>"Marriage certificate required."</strong> No law requires one, and Indian courts have said unmarried adults
            can share a hotel room. Some hotels still refuse couples. See{" "}
            <Link to="/blog/unmarried-couples-goa-hotels-villas" className={ext}>
              can unmarried couples stay together
            </Link>
            .
          </li>
          <li>
            <strong>"Aadhaar only."</strong> Any valid government photo ID should do. A property can choose what it accepts,
            but Aadhaar isn't legally required.
          </li>
        </ul>

        <h2 className="font-display text-2xl text-foreground mt-8">Foreign guests and OCI cardholders</h2>
        <p>
          Foreign nationals need their <strong>passport and a valid visa or OCI card</strong>. This isn't optional for the
          host: every accommodation provider in India, from a big hotel to a single-room homestay, must report foreign guests on{" "}
          <strong>Form C within 24 hours</strong> under the Immigration and Foreigners Act, 2025. That's why they'll ask for and
          record your passport details. Our{" "}
          <Link to="/blog/form-c-foreign-guests-airbnb-hosts-goa" className={ext}>
            Form C guide
          </Link>{" "}
          explains the rule. NRIs with Indian passports check in as Indian citizens.
        </p>

        <h2 className="font-display text-2xl text-foreground mt-8">Homestays and Airbnb</h2>
        <p>
          The same ID rules apply to homestays, villas and Airbnb rentals as to hotels. Many states also require homestay hosts
          to keep guest registers: Rajasthan's 2026 scheme, for example, requires them to be kept for seven years. A host asking
          for ID isn't being difficult; it's part of running a legal stay. See our{" "}
          <Link to="/blog/homestay-registration-rules-by-state-india" className={ext}>
            state-by-state homestay rules
          </Link>
          .
        </p>
        <p>
          On{" "}
          <Link to="/what-is-wayzyy" className={ext}>
            Wayzyy
          </Link>
          , it works both ways: hosts are identity-verified through DigiLocker before they can list, so you know who you're
          staying with, not just the other way round.
        </p>

        <h2 className="font-display text-2xl text-foreground mt-8">Check-in checklist</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>Two government photo IDs per adult (one physical, one on DigiLocker or your phone).</li>
          <li>Masked Aadhaar saved on your phone if you plan to use Aadhaar.</li>
          <li>Passport and visa or OCI card for foreign guests.</li>
          <li>Check the property's policy on local IDs and couples before booking.</li>
          <li>Your booking confirmation, and payment made through the platform, not to the host directly.</li>
        </ul>
        <p className="text-sm text-muted-foreground">
          This page summarises published guidance and news reports as of November 2026. It isn't legal advice, and individual
          properties can set their own ID policies.
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
