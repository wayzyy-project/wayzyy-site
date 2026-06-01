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

  return (
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
  );
};

export default Index;
