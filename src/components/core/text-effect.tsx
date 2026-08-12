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
  const itemVariants = presetVariants[preset];

  if (per === "word") {
    const segments = children.split(/(\s+)/);
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
            style={{ display: "inline-block", whiteSpace: segment === " " ? "pre" : undefined }}
            aria-hidden="true"
          >
            {segment}
          </motion.span>
        ))}
      </motion.span>
    );
  }

  // per="char": split into words first so each word's characters stay
  // grouped in a single non-breaking unit - otherwise every character is
  // its own independent inline-block and the browser is free to insert a
  // line break between any two of them, including mid-word.
  const words = children.split(/(\s+)/);

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
      {words.map((word, wordIndex) =>
        /^\s+$/.test(word) ? (
          <motion.span
            key={`space-${wordIndex}`}
            variants={itemVariants}
            style={{ display: "inline-block", whiteSpace: "pre" }}
            aria-hidden="true"
          >
            {word}
          </motion.span>
        ) : (
          <span key={`word-${wordIndex}`} style={{ display: "inline-block", whiteSpace: "nowrap" }}>
            {Array.from(word).map((char, charIndex) => (
              <motion.span
                key={`${wordIndex}-${charIndex}`}
                variants={itemVariants}
                style={{ display: "inline-block" }}
                aria-hidden="true"
              >
                {char}
              </motion.span>
            ))}
          </span>
        ),
      )}
    </motion.span>
  );
}
