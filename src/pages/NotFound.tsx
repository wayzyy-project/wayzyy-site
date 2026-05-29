import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.warn("404:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-background text-foreground">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,hsl(var(--ember)/0.18),transparent_60%)]"
      />
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative text-center"
      >
        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
          Off the trail
        </p>
        <h1 className="mt-3 font-display text-7xl text-foreground sm:text-9xl">
          404
        </h1>
        <p className="mt-3 text-muted-foreground">
          That path doesn't exist on Wayzyy (yet).
        </p>
        <a
          href="/"
          className="mt-6 inline-flex rounded-full bg-foreground px-5 py-2 text-sm text-background hover:bg-foreground/90"
        >
          Walk back home
        </a>
      </motion.div>
    </div>
  );
};

export default NotFound;
