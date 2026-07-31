import { Suspense, lazy, useEffect, useState } from "react";

const GoaGlobeScene = lazy(() => import("./GoaGlobeScene"));

function hasWebGL() {
  try {
    const canvas = document.createElement("canvas");
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext("webgl") || canvas.getContext("experimental-webgl"))
    );
  } catch {
    return false;
  }
}

/** Static fallback: a flat dot-matrix badge, no motion, no WebGL required. */
function GlobeFallback() {
  return (
    <div className="relative flex h-full w-full items-center justify-center">
      <div className="relative h-48 w-48 sm:h-64 sm:w-64 rounded-full border border-dashed border-[hsl(var(--ember))]/40 bg-[hsl(var(--ember))]/5 flex items-center justify-center">
        <span className="h-3 w-3 rounded-full bg-[hsl(var(--ember))] shadow-[0_0_16px_hsl(var(--ember))]" />
      </div>
    </div>
  );
}

export function GoaGlobe({ className }: { className?: string }) {
  const [ready, setReady] = useState(false);
  const [supported, setSupported] = useState(true);

  useEffect(() => {
    setSupported(hasWebGL());
    setReady(true);
  }, []);

  if (!ready) return <div className={className} aria-hidden />;

  return (
    <div className={className} aria-hidden="true">
      {supported ? (
        <Suspense fallback={<GlobeFallback />}>
          <GoaGlobeScene />
        </Suspense>
      ) : (
        <GlobeFallback />
      )}
    </div>
  );
}
