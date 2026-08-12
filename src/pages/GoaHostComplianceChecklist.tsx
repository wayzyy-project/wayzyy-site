import { Link, useLocation } from "react-router-dom";
import { ArrowLeft, ChevronRight, ClipboardCheck } from "lucide-react";
import { SEO } from "@/components/SEO";
import { ThemeToggle } from "@/components/theme-toggle";

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Do I need to register my Goa homestay or villa rental with the government?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Under the Goa Registration of Tourist Trade Rules, 1985, short-term rental accommodation (homestays, B&Bs, rented apartments, bungalows) falls into Category D and requires registration with the Department of Tourism via the Goa Online portal (goaonline.gov.in).",
      },
    },
    {
      "@type": "Question",
      name: "How long does Goa homestay/B&B registration take?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The Department of Tourism states processing can take up to 90 days. Apply at least 3-4 months before your intended listing date, not the week before.",
      },
    },
    {
      "@type": "Question",
      name: "What happens if I don't register my villa or homestay listing in Goa?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Booking platforms (including Airbnb, Booking.com, and Wayzyy) can be directed by the Goa Tourism Department to remove your listing entirely if your registration number is missing or invalid. Separately, failing to submit monthly occupancy statistics (Form XI) is treated as its own violation and can block your renewal, with penalties.",
      },
    },
    {
      "@type": "Question",
      name: "What is Form XI in Goa tourism registration?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Form XI is the monthly occupancy and guest statistics filing required from registered Goa homestay and B&B operators, submitted electronically via the Goa Online portal before the 5th of the following month. Missing filings is treated as a violation separate from your original registration status.",
      },
    },
    {
      "@type": "Question",
      name: "How much does Goa homestay registration cost?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The registration fee is approximately ₹1,000/year for most Homestay/B&B registrations, plus a variable Fire NOC fee based on property size. Confirm the current fee on goaonline.gov.in, as it is subject to revision.",
      },
    },
  ],
};

export default function GoaHostComplianceChecklist() {
  const location = useLocation();

  const schemas = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: "The Goa Host's Compliance Checklist",
      description:
        "A free, plain-language checklist for registering a homestay, villa, or B&B in Goa - based on the Goa Registration of Tourist Trade Rules, 1985, the Homestay & B&B Scheme 2025, and the Department of Tourism's administrative order dated 13 January 2026.",
      datePublished: "2026-01-13",
      author: { "@type": "Organization", name: "Wayzyy" },
      publisher: { "@type": "Organization", name: "Wayzyy", logo: { "@type": "ImageObject", url: "https://wayzyy.com/favicon.png" } },
      mainEntityOfPage: { "@type": "WebPage", "@id": `https://wayzyy.com${location.pathname}` },
    },
    faqJsonLd,
  ];

  return (
    <SEO
      title="The Goa Host's Compliance Checklist - Wayzyy"
      description="Free checklist for registering a Goa homestay, villa, or B&B: documents, fees, timelines, and renewal rules under the Goa Tourist Trade Rules and 2026 Dept. of Tourism order."
      jsonLd={schemas}
      path={location.pathname}
    >
      <div className="min-h-screen bg-background text-foreground">
        <div className="border-b border-border bg-background/80 backdrop-blur sticky top-0 z-40">
          <div className="container flex items-center justify-between gap-4 py-4">
            <div className="flex items-center gap-4">
              <Link
                to="/"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Wayzyy
              </Link>
              <span className="text-border">·</span>
              <img src="/favicon.png" alt="Wayzyy" className="h-7 w-auto" />
            </div>
            <ThemeToggle />
          </div>
        </div>

        <div className="bg-card/20 py-4 border-b border-border/40">
          <div className="container max-w-3xl flex items-center gap-1.5 text-xs text-muted-foreground">
            <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
            <ChevronRight className="h-3 w-3 opacity-60" />
            <span className="text-foreground font-medium">Goa Host Compliance Checklist</span>
          </div>
        </div>

        <div className="border-b border-border bg-card/40 py-12 sm:py-16">
          <div className="container max-w-3xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1 text-xs uppercase tracking-[0.25em] text-muted-foreground">
              <ClipboardCheck className="h-3.5 w-3.5 text-ember" />
              Host Resource
            </div>
            <h1 className="font-display text-3xl sm:text-5xl text-foreground mt-2 leading-tight">
              The Goa Host's Compliance Checklist
            </h1>
            <p className="mt-4 text-sm text-muted-foreground leading-relaxed max-w-xl">
              A free, plain-language checklist for anyone listing a homestay, villa, or B&B in Goa on Airbnb,
              Booking.com, Wayzyy, or any other platform. Based on the Goa Registration of Tourist Trade Rules,
              1985, the Homestay &amp; B&amp;B Scheme 2025, and the Department of Tourism's administrative order
              dated 13 January 2026.
            </p>
          </div>
        </div>

        <div className="container max-w-3xl py-12 sm:py-16">
          <div className="policy-content">
            <h2>1. Which Category Do You Fall Under?</h2>
            <p>
              Under the Goa Rules, short-term rental accommodation falls into <strong>Category D</strong> - 
              rented/serviced apartments, bungalows, homestay units, and bed &amp; breakfast establishments.
              Within this category:
            </p>
            <table>
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Definition</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Homestay</td>
                  <td>Owner/promoter resides on the property. Minimum 1, maximum 6 lettable rooms (up to 12 beds).</td>
                </tr>
                <tr>
                  <td>Bed &amp; Breakfast (B&amp;B)</td>
                  <td>Owner/promoter does not reside on site; an appointed agent or operator manages it. Also 1–6 lettable rooms.</td>
                </tr>
              </tbody>
            </table>

            <h3>At a Glance: Cost and Timeline</h3>
            <table>
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Detail</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Registration fee</td>
                  <td>~₹1,000/year (confirm current fee on goaonline.gov.in - subject to revision)</td>
                </tr>
                <tr>
                  <td>Fire NOC fee</td>
                  <td>Varies by property size and Directorate of Fire and Emergency Services assessment</td>
                </tr>
                <tr>
                  <td>RWA/Society NOC</td>
                  <td>Usually free to nominal, but budget time - this can be the slowest step if your society is unresponsive</td>
                </tr>
                <tr>
                  <td>Processing time</td>
                  <td>Up to 90 days stated by the Department - apply at least 3-4 months before you plan to go live</td>
                </tr>
              </tbody>
            </table>

            <div className="rounded-2xl border border-ember/30 bg-ember/5 p-6 my-8">
              <p className="font-semibold text-foreground mb-1">What actually happens if you skip this</p>
              <p className="text-sm text-muted-foreground">
                Booking platforms (including Airbnb, Booking.com, and Wayzyy) can be directed by the Goa Tourism 
                Department to remove your listing entirely if your registration number is missing or invalid. 
                Separately, failing to submit your monthly occupancy statistics (Form XI - see Section 4) is 
                treated as its own violation, and can block your renewal until it's cleared, penalties included. 
                This isn't a soft guideline - it's an enforceable rule with a real, published consequence chain.
              </p>
            </div>

            <h2>2. Documents to Gather Before You Apply</h2>
            <p>
              Per the Department of Tourism's 13 January 2026 administrative order, the mandatory documents for
              registration/renewal are:
            </p>
            <ul>
              <li>Original copy of trade tax / house tax receipt for the property</li>
              <li>Proof of identity (Aadhaar, Passport, Driving Licence, or PAN)</li>
              <li>Fire NOC from the Directorate of Fire and Emergency Services</li>
              <li>Housing Society / RWA / Home Owner Association NOC (where applicable)</li>
              <li>
                Lease and licence agreement, OR a notarised NOC from the property owner - required only if you
                are leasing the property rather than owning it (rental arbitrage)
              </li>
              <li>Ownership documents - title deed, gift deed, sale deed, or Form I &amp; XIV, OR house tax receipt</li>
            </ul>
            <p className="text-sm italic">
              Note: this list was simplified by the Department specifically to reduce the paperwork burden - 
              earlier versions of the process required more documents. Always check goatourism.gov.in for the
              current requirement before you apply, since these rules do get revised.
            </p>

            <h3>Why Listings Actually Get Rejected (The Part Nobody Warns You About)</h3>
            <p>
              Registration is only half the battle. Separately, verification systems on booking platforms 
              (including Airbnb, Booking.com, and Wayzyy) reject a huge number of first-time listings for reasons 
              that have nothing to do with the Goa Rules. Watch for these:
            </p>
            <ul>
              <li>
                Photos taken from your phone gallery instead of inside the platform's app - GPS location data
                only embeds correctly when photos are captured live, in-app
              </li>
              <li>
                Your listed address doesn't precisely match the GPS pin from your verification photos - 
                double-check the map pin, not just the typed address
              </li>
              <li>
                Blurry, dark, or low-resolution verification photos - the platform's automated review rejects
                these outright, no human ever looks at them first
              </li>
              <li>
                An incomplete amenity checklist - missing an amenity you actually have (WiFi, AC, parking,
                kitchen) can silently drop your listing out of filtered search results even after approval
              </li>
            </ul>

            <h2>3. The Application Itself</h2>
            <ul>
              <li>Create an account on the Goa Online portal (goaonline.gov.in) using your email and mobile number</li>
              <li>
                Go to Services → All Services → Tourism Department Services → "Application for Registration of
                Hotel/Guest House/Homestay/Bed and Breakfast"
              </li>
              <li>Complete the application in Form XXIII and upload the documents from Section 2</li>
              <li>
                Pay the applicable registration fee (₹1,000/year for most Homestay/B&amp;B registrations under
                the current policy - confirm the current fee on the portal, as it is subject to revision)
              </li>
              <li>Submit and save your acknowledgment number - this is what you track your application status with</li>
              <li>
                Offline alternative: Form XXIII can also be submitted in person at the Registration Desk, 1st
                Floor, Paryatan Bhavan, Patto, Panaji – 403001
              </li>
            </ul>
            <p>
              Processing time stated by the Department is <strong>up to 90 days</strong> - apply well ahead of
              your intended listing date, not the week before.
            </p>

            <h2>4. Once You Have Your Registration Number</h2>
            <ul>
              <li>
                Add your registration certificate number to your listings. For Airbnb, this is under Policies and rules →
                Regulations → Register your listing. For Wayzyy, this can be added directly in your host dashboard.
              </li>
              <li>If listing elsewhere (like Booking.com), display the number wherever your platform allows a registration/licence field</li>
              <li>
                Set a monthly reminder to submit Form XI (occupancy/guest statistics) before the 5th of the
                following month, via the Goa Online portal - this is submitted electronically only
              </li>
              <li>
                Keep a digital copy of your registration certificate somewhere you can access quickly if a
                platform requests re-verification
              </li>
            </ul>
            <div className="rounded-2xl border border-ember/30 bg-ember/5 p-6 my-8">
              <p className="font-semibold text-foreground mb-1">This is the step most first-time hosts miss</p>
              <p className="text-sm text-muted-foreground">
                Registration is not a one-time task. Failing to submit Form XI on time is treated as a violation
                in its own right under the Goa Rules - separate from whether your original registration was in
                order - and can hold up your renewal until it's cleared, penalties included.
              </p>
            </div>

            <h3>Where to Add Your Number, By Platform</h3>
            <p>If you list across more than one platform, here's where the same registration number actually goes:</p>
            <table>
              <thead>
                <tr>
                  <th>Platform</th>
                  <th>Where to add your registration number</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Airbnb</td>
                  <td>Listing → Policies and rules → Regulations → Register your listing</td>
                </tr>
                <tr>
                  <td>Booking.com</td>
                  <td>Extranet → Property → Legal &amp; compliance section (field naming varies by market)</td>
                </tr>
                <tr>
                  <td>Wayzyy</td>
                  <td>Requested as a mandatory field at listing creation, verified as part of our standard listing review</td>
                </tr>
              </tbody>
            </table>
            <p className="text-sm italic">
              Note: field names and locations change as platforms update their dashboards - this is accurate as
              of publication but always confirm within your own account if it's been a while since you last
              checked.
            </p>

            <h3>Don't Forget: This Needs Renewing</h3>
            <ul>
              <li>
                Mark your registration expiry date somewhere you'll actually see it - a calendar reminder 60
                days before expiry, not 60 minutes before
              </li>
              <li>
                Renewal uses the same Goa Online portal flow as initial registration - start it early, since the
                same ~90-day processing window can apply
              </li>
              <li>
                Confirm your Form XI submissions have been consistent - a gap in monthly filings can complicate a
                renewal even if everything else is in order
              </li>
            </ul>

            <h2>5. Other Permissions That May Apply to Your Property</h2>
            <p>
              The Department of Tourism notes that, depending on your specific establishment, you may separately
              need permissions from other local bodies - actual requirements vary case by case:
            </p>
            <ul>
              <li>
                FDA (Food and Drug Administration) licence - required for B&amp;Bs serving food to guests.
                Homestays serving only home-cooked food to residents may be eligible for an exemption; check
                directly with FDA Goa.
              </li>
              <li>Local panchayat / municipal council permissions applicable to your specific property and taluka</li>
              <li>GST registration - mandatory if your annual rental income crosses ₹20 lakh</li>
            </ul>

            <h2>6. Worth Checking: The Homestay &amp; B&amp;B Scheme 2025</h2>
            <p>
              If your property is in one of these seven talukas - <strong>Sattari, Sanguem, Dharbandora,
              Bicholim, Canacona, Ponda, or Quepem</strong> - you may be eligible for a one-time{" "}
              <strong>₹2 lakh grant</strong>, plus training and marketing support through official Goa Tourism
              channels, under the state's rural-tourism-focused Homestay and B&amp;B Scheme. Already-registered
              homestay owners can check eligibility by logging into the Goa Online portal and selecting "Know
              Your Schemes." Special encouragement is given to women homestay operators, though the scheme is
              not restricted to them.
            </p>

            <h2>Key Contacts and Links</h2>
            <table>
              <tbody>
                <tr>
                  <td>Goa Online portal</td>
                  <td>goaonline.gov.in</td>
                </tr>
                <tr>
                  <td>Dept. of Tourism website</td>
                  <td>goatourism.gov.in</td>
                </tr>
                <tr>
                  <td>Dept. of Tourism office</td>
                  <td>1st Floor, Paryatan Bhavan, Patto, Panaji – 403001</td>
                </tr>
                <tr>
                  <td>Tourism helpline</td>
                  <td>1364</td>
                </tr>
                <tr>
                  <td>Dept. of Tourism phone</td>
                  <td>+91-832-2494204</td>
                </tr>
              </tbody>
            </table>

            <div className="rounded-2xl border border-ember/30 bg-ember/5 p-6 my-8">
              <p className="font-semibold text-foreground mb-1">How Wayzyy handles this differently</p>
              <p className="text-sm text-muted-foreground">
                Most platforms treat your registration number as a single text field you fill in once and
                forget. On Wayzyy, it's a required part of listing creation, and our team checks it as part of
                our standard 24-hour listing review - not a live government database check (no platform does
                that today, including Airbnb or Booking.com), but a real human sanity-check rather than a silent 
                self-declared field nobody looks at. If something looks off, we tell you before your listing goes 
                live, not after a guest has already booked.
              </p>
            </div>

            <p className="text-xs text-muted-foreground border-t border-border pt-6 mt-10">
              This checklist is informational, not legal advice. Rules, fees, and required documents are set by
              the Government of Goa and do change - always confirm current requirements directly on
              goatourism.gov.in or goaonline.gov.in before applying, or consult a local professional for your
              specific property. Sources referenced: Goa Registration of Tourist Trade Rules 1985 (as amended
              2021 &amp; 2022), the Homestay and B&amp;B Scheme 2025, the Department of Tourism's administrative
              order dated 13 January 2026, and Airbnb's official Goa Help Center page.
            </p>

            <div className="mt-12 pt-8 border-t border-border">
              <p className="font-semibold text-foreground mb-4">Also worth reading:</p>
              <ul className="space-y-2">
                <li>
                  <a href="/host-terms">Wayzyy Host Terms of Service</a>
                </li>
                <li>
                  <a href="/blog/how-to-start-airbnb-business-india">How to Start an Airbnb Business in India</a>
                </li>
                <li>
                  <a href="/blog/hidden-costs-of-running-an-airbnb">The Hidden Costs of Running an Airbnb</a>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-16 rounded-2xl border border-border bg-card/40 p-6">
            <p className="font-semibold text-foreground mb-1">Want to list your villa on Wayzyy?</p>
            <p className="text-sm text-muted-foreground">
              Email us at{" "}
              <a href="mailto:hello@wayzyy.com" className="text-ember hover:underline">
                hello@wayzyy.com
              </a>{" "}
             - Wayzyy is launching soon in Goa.
            </p>
          </div>
        </div>
      </div>
    </SEO>
  );
}
