import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Swords, ArrowRight, Clock } from "lucide-react";
import { SlidingNumber } from "@/components/core/sliding-number";

// Target deadline: August 15, 2026 (or dynamic 14 days)
const TARGET_DEADLINE = new Date("2026-08-15T23:59:59+05:30").getTime();

export function ChallengeTopBanner() {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  }>({ days: 14, hours: 8, minutes: 30, seconds: 0 });

  useEffect(() => {
    const updateTimer = () => {
      const now = new Date().getTime();
      const difference = TARGET_DEADLINE - now;

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor(
        (difference % (1000 * 60 * 60)) / (1000 * 60)
      );
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full bg-gradient-to-r from-[#FF6B00] via-[#FF8533] to-[#FF5500] text-white py-2 px-3 sm:px-6 shadow-md relative z-50 text-xs sm:text-sm font-medium">
      <div className="mx-auto max-w-7xl flex flex-wrap items-center justify-between gap-2 sm:gap-4">
        <div className="flex items-center gap-2 font-bold tracking-tight">
          <span className="inline-flex items-center justify-center p-1 rounded-full bg-white/20 text-white shrink-0">
            <Swords className="h-3.5 w-3.5" />
          </span>
          <span className="truncate">
            <strong className="font-extrabold">$1,000 Solo Dev Challenge:</strong>{" "}
            Beat Airbnb's Chat Moderation
          </span>
        </div>

        <div className="flex items-center gap-3 ml-auto sm:ml-0">
          <div className="flex items-center gap-1 font-mono text-xs bg-black/20 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/20">
            <Clock className="h-3 w-3 text-white/80 shrink-0" />
            <span className="font-bold">{timeLeft.days}d</span>:
            <span className="font-bold inline-flex items-baseline">
              <SlidingNumber value={timeLeft.hours} padStart />
              <span>h</span>
            </span>
            :
            <span className="font-bold inline-flex items-baseline">
              <SlidingNumber value={timeLeft.minutes} padStart />
              <span>m</span>
            </span>
            :
            <span className="font-bold text-amber-200 inline-flex items-baseline">
              <SlidingNumber value={timeLeft.seconds} padStart />
              <span>s</span>
            </span>
            <span className="ml-1 text-[10px] text-white/80 uppercase font-sans">left</span>
          </div>

          <Link
            to="/gig-challenge"
            className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1 text-xs font-bold text-[#FF6B00] hover:bg-white/95 transition-all transform hover:scale-105 shadow-sm shrink-0"
          >
            <span>Pitch Now</span>
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </div>
    </div>
  );
}
