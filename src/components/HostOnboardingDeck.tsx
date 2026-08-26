import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Download,
  ExternalLink,
  Maximize2,
  Minimize2,
  FileText,
  Sparkles,
  LayoutGrid,
  ScrollText,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export const ONBOARDING_PAGES = [
  {
    page: 1,
    title: "Founding Hosts Invitation",
    subtitle: "Goa 2026 · First 100 Hosts",
    image: "/onboarding-doc/page-01.webp",
  },
  {
    page: 2,
    title: "The Deal Today",
    subtitle: "You already know what's wrong with legacy platforms",
    image: "/onboarding-doc/page-02.webp",
  },
  {
    page: 3,
    title: "The Wayzyy Deal",
    subtitle: "0% host commission · What you ask is what you get",
    image: "/onboarding-doc/page-03.webp",
  },
  {
    page: 4,
    title: "Real Goa Market Data",
    subtitle: "What 18% commission actually costs you every year",
    image: "/onboarding-doc/page-04.webp",
  },
  {
    page: 5,
    title: "Our Side of It",
    subtitle: "How Wayzyy makes money with flat credit packs",
    image: "/onboarding-doc/page-05.webp",
  },
  {
    page: 6,
    title: "Founding Host Benefit",
    subtitle: "Creator-shot marketing & reels on us",
    image: "/onboarding-doc/page-06.webp",
  },
  {
    page: 7,
    title: "Where Demand Comes From",
    subtitle: "100,000+ developer & traveler community already built",
    image: "/onboarding-doc/page-07.webp",
  },
  {
    page: 8,
    title: "Getting Listed & The App",
    subtitle: "List in minutes with an app built to get out of your way",
    image: "/onboarding-doc/page-08.webp",
  },
  {
    page: 9,
    title: "Support & Disputes",
    subtitle: "3-layer evidence review that never leaves you stranded",
    image: "/onboarding-doc/page-09.webp",
  },
  {
    page: 10,
    title: "Your Price & Reputation",
    subtitle: "Fair ratings & the Wayzyy Verified host badge",
    image: "/onboarding-doc/page-10.webp",
  },
  {
    page: 11,
    title: "That's The Deal",
    subtitle: "No hidden fees · Direct host community & links",
    image: "/onboarding-doc/page-11.webp",
  },
];

const DRIVE_LINK = "https://drive.google.com/file/d/1ho3--7d7FuaO0jB_JFPmofCoV8La-jfN/view?usp=sharing";
const PDF_DOWNLOAD = "/wayzyy-host-onboarding.pdf";

interface HostOnboardingDeckProps {
  embedded?: boolean;
  onJoinWaitlist?: () => void;
}

export function HostOnboardingDeck({ embedded = false, onJoinWaitlist }: HostOnboardingDeckProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<"slides" | "scroll">("slides");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [direction, setDirection] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const totalPages = ONBOARDING_PAGES.length;

  const goToNext = () => {
    if (currentPage < totalPages) {
      setDirection(1);
      setCurrentPage((prev) => prev + 1);
    }
  };

  const goToPrev = () => {
    if (currentPage > 1) {
      setDirection(-1);
      setCurrentPage((prev) => prev - 1);
    }
  };

  const jumpToPage = (pageNum: number) => {
    setDirection(pageNum > currentPage ? 1 : -1);
    setCurrentPage(pageNum);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (viewMode !== "slides") return;
      if (e.key === "ArrowRight" || e.key === "PageDown" || e.key === "Space") {
        e.preventDefault();
        goToNext();
      } else if (e.key === "ArrowLeft" || e.key === "PageUp") {
        e.preventDefault();
        goToPrev();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentPage, viewMode]);

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen?.().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.().catch(() => {});
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFsChange);
    return () => document.removeEventListener("fullscreenchange", handleFsChange);
  }, []);

  const variants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 80 : -80,
      opacity: 0,
      scale: 0.98,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        x: { type: "spring", stiffness: 350, damping: 30 },
        opacity: { duration: 0.25 },
      },
    },
    exit: (dir: number) => ({
      x: dir < 0 ? 80 : -80,
      opacity: 0,
      scale: 0.98,
      transition: {
        x: { type: "spring", stiffness: 350, damping: 30 },
        opacity: { duration: 0.2 },
      },
    }),
  };

  return (
    <div
      ref={containerRef}
      className={`relative w-full rounded-3xl border border-border/60 bg-card/95 text-foreground shadow-2xl backdrop-blur-xl transition-all ${
        isFullscreen ? "p-4 sm:p-8 fixed inset-0 z-50 rounded-none overflow-y-auto bg-background" : "p-4 sm:p-6 lg:p-8"
      }`}
    >
      {/* Top Header Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pb-6 border-b border-border/50">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3.5 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-ember animate-pulse" />
            Official Onboarding Document · 2026
          </div>
          <h2 className="mt-2 font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold text-foreground tracking-tight">
            Wayzyy Founding Hosts Presentation
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            The complete 11-page invitation and roadmap for Goa homestay and villa owners.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* View Mode Toggle */}
          <div className="flex items-center rounded-xl bg-muted/60 p-1 border border-border/40">
            <button
              onClick={() => setViewMode("slides")}
              className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold transition-all ${
                viewMode === "slides" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              }`}
              title="Slide By Slide Mode"
            >
              <LayoutGrid className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Slides</span>
            </button>
            <button
              onClick={() => setViewMode("scroll")}
              className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold transition-all ${
                viewMode === "scroll" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              }`}
              title="Continuous Scroll Mode"
            >
              <ScrollText className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">All Pages</span>
            </button>
          </div>

          {/* Fullscreen Toggle */}
          <button
            onClick={toggleFullscreen}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-border/60 bg-muted/40 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
          >
            {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </button>

          {/* Download PDF Button */}
          <a
            href={PDF_DOWNLOAD}
            download="Wayzyy-Host-Onboarding-Goa-2026.pdf"
            className="flex items-center gap-1.5 h-9 px-3 rounded-xl border border-border/60 bg-muted/40 hover:bg-muted text-xs font-bold text-foreground transition-colors"
            title="Download Original PDF"
          >
            <Download className="h-3.5 w-3.5 text-ember" />
            <span className="hidden md:inline">Download PDF</span>
          </a>

          {/* Google Drive Link Fallback */}
          <a
            href={DRIVE_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 h-9 px-3 rounded-xl border border-border/60 bg-muted/40 hover:bg-muted text-xs font-bold text-foreground transition-colors"
            title="Open in Google Drive"
          >
            <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="hidden md:inline">Google Drive</span>
          </a>
        </div>
      </div>

      {/* Main Content Area */}
      {viewMode === "slides" ? (
        <div className="py-6 space-y-6">
          {/* Slide Display Container */}
          <div className="relative mx-auto flex max-w-4xl flex-col items-center">
            {/* Page Header Info */}
            <div className="w-full flex items-center justify-between px-2 mb-3">
              <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-ember text-[11px] font-extrabold text-white">
                  {currentPage}
                </span>
                <span className="text-xs sm:text-sm font-bold text-foreground">
                  {ONBOARDING_PAGES[currentPage - 1].title}
                </span>
              </div>
              <span className="text-xs font-semibold text-muted-foreground">
                Page {currentPage} of {totalPages}
              </span>
            </div>

            {/* Slide Frame with Shadow & Clean Presentation */}
            <div className="relative w-full overflow-hidden rounded-2xl border border-border/70 bg-black/5 dark:bg-black/40 shadow-2xl backdrop-blur-md">
              <AnimatePresence custom={direction} mode="wait">
                <motion.div
                  key={currentPage}
                  custom={direction}
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  className="w-full flex items-center justify-center"
                >
                  <img
                    src={ONBOARDING_PAGES[currentPage - 1].image}
                    alt={`Wayzyy Onboarding Page ${currentPage}: ${ONBOARDING_PAGES[currentPage - 1].title}`}
                    className="w-full h-auto object-contain select-none max-h-[75vh]"
                    loading="eager"
                  />
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Slide Navigation Bar Below Frame */}
            <div className="mt-4 flex w-full items-center justify-between gap-4 px-2">
              <Button
                variant="outline"
                onClick={goToPrev}
                disabled={currentPage === 1}
                className="rounded-xl font-bold text-xs sm:text-sm gap-2 h-10 px-4 hover:bg-ember/10 hover:text-ember hover:border-ember/40 transition-all cursor-pointer disabled:opacity-35"
              >
                <ChevronLeft className="h-4 w-4" /> Previous
              </Button>

              {/* Progress dots / bar */}
              <div className="flex items-center gap-1.5 overflow-x-auto py-1">
                {ONBOARDING_PAGES.map((p) => (
                  <button
                    key={p.page}
                    onClick={() => jumpToPage(p.page)}
                    className={`h-2.5 rounded-full transition-all cursor-pointer ${
                      currentPage === p.page
                        ? "w-8 bg-ember shadow-sm"
                        : "w-2.5 bg-muted-foreground/30 hover:bg-muted-foreground/60"
                    }`}
                    title={`Jump to Page ${p.page}: ${p.title}`}
                  />
                ))}
              </div>

              <Button
                variant="outline"
                onClick={goToNext}
                disabled={currentPage === totalPages}
                className="rounded-xl font-bold text-xs sm:text-sm gap-2 h-10 px-4 hover:bg-ember/10 hover:text-ember hover:border-ember/40 transition-all cursor-pointer disabled:opacity-35"
              >
                Next <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Thumbnails Tray */}
          <div className="mt-6 border-t border-border/40 pt-6">
            <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2">
              <FileText className="h-3.5 w-3.5 text-ember" /> Quick Page Jump
            </div>
            <div className="flex gap-3 overflow-x-auto pb-3 pt-1 scrollbar-thin">
              {ONBOARDING_PAGES.map((p) => (
                <button
                  key={p.page}
                  onClick={() => jumpToPage(p.page)}
                  className={`group relative shrink-0 overflow-hidden rounded-xl border transition-all text-left w-32 sm:w-36 ${
                    currentPage === p.page
                      ? "border-ember ring-2 ring-ember/40 shadow-lg scale-[1.02]"
                      : "border-border/60 opacity-70 hover:opacity-100 hover:border-border"
                  }`}
                >
                  <img
                    src={p.image}
                    alt={p.title}
                    className="h-20 w-full object-cover"
                    loading="lazy"
                  />
                  <div className="p-2 bg-card/90">
                    <span className="text-[10px] font-extrabold text-ember block">
                      Page {p.page}
                    </span>
                    <span className="text-[11px] font-semibold text-foreground line-clamp-1">
                      {p.title}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* Continuous Feed Scroll View */
        <div className="py-6 space-y-8 max-w-4xl mx-auto">
          {ONBOARDING_PAGES.map((p) => (
            <div
              key={p.page}
              id={`onboarding-page-${p.page}`}
              className="space-y-3 rounded-2xl border border-border/70 bg-card p-3 sm:p-5 shadow-xl"
            >
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-ember text-xs font-extrabold text-white">
                    {p.page}
                  </span>
                  <h3 className="font-display text-sm sm:text-base font-bold text-foreground">
                    {p.title}
                  </h3>
                </div>
                <span className="text-xs text-muted-foreground font-semibold">
                  {p.subtitle}
                </span>
              </div>
              <div className="overflow-hidden rounded-xl border border-border/50 shadow-inner bg-black/5 dark:bg-black/40">
                <img
                  src={p.image}
                  alt={p.title}
                  className="w-full h-auto object-contain"
                  loading="lazy"
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Bottom Sticky Action Banner */}
      <div className="mt-8 rounded-2xl border border-ember/40 bg-gradient-to-r from-ember/15 via-ember/10 to-amber-500/10 p-5 sm:p-6 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center sm:text-left">
          <div className="inline-flex items-center gap-1.5 text-xs font-extrabold text-ember uppercase tracking-wider">
            <CheckCircle2 className="h-4 w-4" /> Ready to become a founding host?
          </div>
          <p className="text-xs sm:text-sm text-foreground/90 font-medium">
            Keep 100% of your earnings with 0% booking commission and verified guests.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <a
            href={onJoinWaitlist ? "#waitlist" : "/host"}
            onClick={onJoinWaitlist}
            className="w-full sm:w-auto h-11 px-6 rounded-xl bg-ember hover:bg-ember/90 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-ember/25 transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0"
          >
            Join Goa Host Portal <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </div>
  );
}
