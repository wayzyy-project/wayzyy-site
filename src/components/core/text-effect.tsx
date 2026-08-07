import React from "react";
import { motion, Variants } from "framer-motion";

type PerMode = "char" | "word";
type Preset = "fade";

interface TextEffectProps {
  children: string;
  per?: PerMode;
  preset?: Preset;
  className?: string;
  /** Delay (seconds) before the stagger sequence starts */
  delay?: number;
  /** Stagger interval (seconds) between each child */
  speedSegment?: number;
}

const containerVariants: Variants = {
  hidden: { opacity: 1 },
  visible: (custom: { delay: number; stagger: number }) => ({
    opacity: 1,
    transition: {
      delayChildren: custom.delay,
      staggerChildren: custom.stagger,
    },
  }),
};

const presetVariants: Record<Preset, Variants> = {
  fade: {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.35, ease: "easeOut" },
    },
  },
};

export function TextEffect({
  children,
  per = "char",
  preset = "fade",
  className,
  delay = 0,
  speedSegment = 0.03,
}: TextEffectProps) {
  const segments = per === "word" ? children.split(/(\s+)/) : Array.from(children);
  const itemVariants = presetVariants[preset];

  return (
    <motion.span
      className={className}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      custom={{ delay, stagger: speedSegment }}
      style={{ display: "inline-block" }}
      aria-label={children}
    >
      {segments.map((segment, index) => (
        <motion.span
          key={`${segment}-${index}`}
          variants={itemVariants}
          style={{ display: "inline-block", whiteSpace: per === "char" && segment === " " ? "pre" : undefined }}
          aria-hidden="true"
        >
          {segment}
        </motion.span>
      ))}
    </motion.span>
  );
}
