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

const Index = () => {
  // top page-progress bar
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 200,
    damping: 30,
    mass: 0.4,
  });

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

        <WhySection />
        <TestimonialsSection />
        <TwoSides />
        <Principles />
        <HousePartiesSection />
        <WaitlistSection />
      </main>

      <SiteFooter />
    </div>
  );
};

export default Index;
