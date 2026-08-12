import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Stamp } from "lucide-react";
import confetti from "canvas-confetti";

const KONAMI = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "b",
  "a",
];

function fireConfetti() {
  const colors = ["#ff6b1a", "#ffd9b3", "#141019"];
  confetti({
    particleCount: 90,
    spread: 80,
    startVelocity: 45,
    origin: { y: 0.15 },
    colors,
    zIndex: 9999,
  });
  confetti({
    particleCount: 60,
    angle: 60,
    spread: 60,
    origin: { x: 0, y: 0.6 },
    colors,
    zIndex: 9999,
  });
  confetti({
    particleCount: 60,
    angle: 120,
    spread: 60,
    origin: { x: 1, y: 0.6 },
    colors,
    zIndex: 9999,
  });
}

/** Console ASCII art - a small wink at the exact audience this page targets. */
function logConsoleEasterEgg() {
  const style = "color:#ff6b1a;font-weight:bold;font-size:12px;";
  console.log(
    "%c\n" +
      "  ___       __\n" +
      " |__ \\     / _|\n" +
      "    ) |___| |_ ___\n" +
      "   / // __|  _/ _ \\\n" +
      "  / /_\\__ \\ ||  __/\n" +
      " |____|___/_| \\___|\n",
    style
  );
  console.log(
    "%cStill reading the page source? You might be exactly who we're looking for.",
    "color:#ff6b1a;font-weight:bold;"
  );
  console.log(
    "%cType 'wayzyy' anywhere on this page, or throw in the Konami code, for a surprise. Then scroll to #apply.",
    "color:#8a8a8a;"
  );
}

export function EasterEggs() {
  const [banner, setBanner] = useState<string | null>(null);

  useEffect(() => {
    logConsoleEasterEgg();

    let konamiBuffer: string[] = [];
    let wordBuffer = "";
    const TARGET_WORD = "wayzyy";

    const trigger = (message: string) => {
      fireConfetti();
      setBanner(message);
      window.setTimeout(() => setBanner(null), 3600);
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (!e || !e.key) return;

      konamiBuffer = [...konamiBuffer, e.key].slice(-KONAMI.length);
      if (konamiBuffer.join(",") === KONAMI.join(",")) {
        konamiBuffer = [];
        trigger("Flight upgraded. +500 bonus miles credited to your visa.");
        return;
      }

      if (typeof e.key === "string" && e.key.length === 1) {
        wordBuffer = (wordBuffer + e.key.toLowerCase()).slice(
          -TARGET_WORD.length
        );
        if (wordBuffer === TARGET_WORD) {
          wordBuffer = "";
          trigger("Passport stamped. You found the secret gate.");
        }
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <AnimatePresence>
      {banner && (
        <motion.div
          initial={{ opacity: 0, y: -24, x: "-50%" }}
          animate={{ opacity: 1, y: 0, x: "-50%" }}
          exit={{ opacity: 0, y: -16, x: "-50%" }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="fixed left-1/2 top-6 z-[10000] flex items-center gap-2 rounded-full border-2 border-[hsl(var(--ember))] bg-background px-5 py-2.5 text-xs sm:text-sm font-bold text-[hsl(var(--ember))] shadow-2xl"
        >
          <Stamp className="h-4 w-4" />
          <span>{banner}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
