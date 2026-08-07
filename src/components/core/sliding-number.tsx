import React from "react";
import { AnimatePresence, motion } from "framer-motion";

interface SlidingDigitProps {
  digit: string;
  className?: string;
}

function SlidingDigit({ digit, className }: SlidingDigitProps) {
  return (
    <span
      className={className}
      style={{
        position: "relative",
        display: "inline-block",
        overflow: "hidden",
        height: "1em",
        width: "0.6em",
        verticalAlign: "top",
      }}
    >
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={digit}
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: "0%", opacity: 1 }}
          exit={{ y: "-100%", opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {digit}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

interface SlidingNumberProps {
  value: number;
  padStart?: boolean;
  className?: string;
}

export function SlidingNumber({ value, padStart = false, className }: SlidingNumberProps) {
  const safeValue = Number.isFinite(value) ? Math.max(0, Math.trunc(value)) : 0;
  const stringValue = padStart ? String(safeValue).padStart(2, "0") : String(safeValue);
  const digits = stringValue.split("");

  return (
    <span className={className} style={{ display: "inline-flex" }}>
      {digits.map((digit, index) => (
        <SlidingDigit key={index} digit={digit} />
      ))}
    </span>
  );
}
