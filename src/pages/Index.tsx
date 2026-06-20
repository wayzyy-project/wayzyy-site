import React from "react";
import { useScroll, useSpring, motion } from "framer-motion";
import { SiteNav } from "@/components/SiteNav";
import { HeroDualPOV } from "@/components/HeroDualPOV";
import { Marquee } from "@/components/Marquee";
import { WhySection } from "@/components/WhySection";
import { TestimonialsSection } from "@/components/TestimonialsSection";
import { TwoSides } from "@/components/TwoSides";
import { Principles } from "@/components/Principles";
import { HousePartiesSection } from "@/components/HousePartiesSection";
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
  const testimonialsRef = useTrackSection("Testimonials");
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
            "text": "Wayzyy is a new kind of homestay platform offering honest pricing for travelers and fair, evidence-respecting policies for hosts, based on a flat-fee subscription model."
          }
        },
        {
          "@type": "Question",
          "name": "How does Wayzyy protect hosts from retaliatory reviews?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Unlike legacy platforms, Wayzyy respects objective time-stamped proof and protects hosts from review extortion by refusing to pull warnings left for future hosts."
          }
        },
        {
          "@type": "Question",
          "name": "What is the fee structure on Wayzyy?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Wayzyy operates on a simple flat-rate subscription fee, removing hidden percentages, administrative markups, or service charges from transactions."
          }
        }
      ]
    }
  ];

  return (
    <SEO
      title="Wayzyy — stays without the small print"
      description="Honest pricing for travelers. Fair, evidence-respecting policies for hosts. Homestays with a flat fee subscription rate. Coming soon."
      jsonLd={schemas}
    >
      <div className="relative bg-background text-foreground">
        <motion.div
          style={{ scaleX, transformOrigin: "0% 50%" }}
          className="fixed inset-x-0 top-0 z-[60] h-[2px] bg-ember"
        />

        <SiteNav />

        <main>
          <HeroDualPOV />

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
          <div ref={testimonialsRef as React.RefObject<HTMLDivElement>}><TestimonialsSection /></div>
          <div ref={twoSidesRef as React.RefObject<HTMLDivElement>}><TwoSides /></div>
          <Principles />
          <div ref={housePartiesRef as React.RefObject<HTMLDivElement>}><HousePartiesSection /></div>
          <div ref={waitlistRef as React.RefObject<HTMLDivElement>}><WaitlistSection /></div>
        </main>

        <SiteFooter />
      </div>
    </SEO>
  );
};

export default Index;
