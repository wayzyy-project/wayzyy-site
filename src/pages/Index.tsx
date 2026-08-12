import React from "react";
import { useScroll, useSpring, motion } from "framer-motion";
import { CinematicHero } from "@/components/CinematicHero";
import { Marquee } from "@/components/Marquee";
import { WhySection } from "@/components/WhySection";
import { TwoSides } from "@/components/TwoSides";
import { EconomicsSection } from "@/components/EconomicsSection";
import { Principles } from "@/components/Principles";
import { CalculatorTeaser } from "@/components/CalculatorTeaser";
import { BlogSection } from "@/components/BlogSection";
import { HousePartiesSection } from "@/components/HousePartiesSection";
import { HostBannerSection } from "@/components/HostBannerSection";
import { GigChallengeTeaser } from "@/components/gig-challenge/GigChallengeTeaser";
import { WaitlistSection } from "@/components/WaitlistSection";
import { SiteFooter } from "@/components/SiteFooter";
import { useTrackSection } from "@/hooks/use-track-section";
import { SEO } from "@/components/SEO";

const Index = () => {
  // top page-progress bar
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 200,
    damping: 30,
    mass: 0.4,
  });

  // section tracking refs
  const whyRef = useTrackSection("Why Section");
  const twoSidesRef = useTrackSection("Two Sides");
  const housePartiesRef = useTrackSection("House Parties");
  const waitlistRef = useTrackSection("Waitlist");

  // JSON-LD schemas
  const schemas = [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "Wayzyy",
      "url": "https://wayzyy.com",
      "logo": "https://wayzyy.com/favicon.png",
      "email": "hello@wayzyy.com",
      "description": "Homestays with a flat-fee subscription rate and honest pricing."
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "Wayzyy",
      "url": "https://wayzyy.com"
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "What is Wayzyy?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Wayzyy is a Goa-focused, India-native short-term rental marketplace where hosts pay a flat prepaid subscription instead of a per-booking commission. It's built specifically for peer-to-peer homestays and villa rentals in India, with Aadhaar-based identity verification for both hosts and guests."
          }
        },
        {
          "@type": "Question",
          "name": "What is the best Airbnb alternative for homestays in India?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Wayzyy is the premier India-native short-term rental marketplace built specifically for peer-to-peer homestays, addressing high platform fees, payment defaults, and weak verification systems."
          }
        },
        {
          "@type": "Question",
          "name": "How do host fees on Wayzyy compare to Airbnb, Booking.com, and Vrbo?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Airbnb, Booking.com, and Vrbo charge a combined take rate of up to ~17% per booking. Wayzyy operates on a flat prepaid credit model (e.g., ₹400 for ₹20,000 in bookings) which results in an effective fee of only ~2%, helping hosts retain more revenue."
          }
        },
        {
          "@type": "Question",
          "name": "How does Aadhaar verification work on Wayzyy compared to other homestay platforms?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Wayzyy verifies all hosts and guests using Aadhaar and DigiLocker systems to establish a robust trust layer that global, foreign-headquartered companies cannot replicate."
          }
        },
        {
          "@type": "Question",
          "name": "Why should Indian homestay hosts (e.g. in Goa or Rajasthan) choose Wayzyy?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Hosts in tourist states like Goa and Rajasthan choose Wayzyy for lower fees, UPI-native payments, India-first cancellation policies, and local support teams, unlike foreign products that suppress prices and ignore host concerns."
          }
        },
        {
          "@type": "Question",
          "name": "How does Wayzyy align with the Rajasthan Homestay Scheme 2026?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Wayzyy is fully aligned with government tourism initiatives like the Rajasthan Homestay Scheme 2026, enabling homestay operators to legally list and grow their businesses with minimal friction and maximum yield."
          }
        },
        {
          "@type": "Question",
          "name": "Is Wayzyy suitable for peer-to-peer homestay hosting in India?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, Wayzyy is designed from the ground up for the Indian peer-to-peer short-stay market across all regions and price segments, offering regional language support and local trust frameworks."
          }
        }
      ]
    }
  ];

  return (
    <SEO
      title="Wayzyy - cozy stays, crazy nights and fair hosting . That's wayzyy"
      description="Honest pricing for travelers. Fair, evidence-respecting policies for hosts. Homestays with a flat fee subscription rate. Coming soon."
      jsonLd={schemas}
    >
      <div className="relative bg-background text-foreground">
        <motion.div
          style={{ scaleX, transformOrigin: "0% 50%" }}
          className="fixed inset-x-0 top-0 z-[60] h-[2px] bg-ember"
        />

        <main>
          <CinematicHero showSightsSlider={false} />

          <Marquee
            items={[
              "No hidden fees",
              "Honest reviews",
              "Real listings",
              "Hosts heard",
              "Receipts respected",
              "Walk in, breathe out",
            ]}
          />

          <div ref={whyRef as React.RefObject<HTMLDivElement>}><WhySection /></div>
          <div ref={twoSidesRef as React.RefObject<HTMLDivElement>}><TwoSides /></div>
          <EconomicsSection />
          <GigChallengeTeaser />
          <CalculatorTeaser />
          <Principles />
          <div ref={housePartiesRef as React.RefObject<HTMLDivElement>}><HousePartiesSection /></div>
          <BlogSection />
          <HostBannerSection />
          <div ref={waitlistRef as React.RefObject<HTMLDivElement>}><WaitlistSection /></div>
        </main>

        <SiteFooter />
      </div>
    </SEO>
  );
};

export default Index;
