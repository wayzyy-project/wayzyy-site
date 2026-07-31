import { useEffect, useMemo, useRef, useState } from "react";
import Globe, { GlobeMethods } from "react-globe.gl";
import * as topojson from "topojson-client";
import * as THREE from "three";
import worldTopo from "world-atlas/countries-110m.json";

const GOA = { lat: 15.2993, lng: 74.124, name: "Goa" };
const HUBS = [
  { lat: 12.9716, lng: 77.5946, name: "Bangalore" },
  { lat: 19.076, lng: 72.8777, name: "Mumbai" },
  { lat: 28.7041, lng: 77.1025, name: "Delhi NCR" },
  { lat: 17.385, lng: 78.4867, name: "Hyderabad" },
  { lat: 13.0827, lng: 80.2707, name: "Chennai" },
  { lat: 22.5726, lng: 88.3639, name: "Kolkata" },
  { lat: 18.5204, lng: 73.8567, name: "Pune" },
];

const EMBER = "#ff6b1a";

type CountryFeature = { properties?: { name?: string } };

function useElementSize<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setSize({ width, height });
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return { ref, size };
}

export default function GoaGlobeScene() {
  const { ref: containerRef, size } = useElementSize<HTMLDivElement>();
  const globeRef = useRef<GlobeMethods | undefined>(undefined);

  // Real country boundaries — converted once from Natural Earth topojson.
  const countries = useMemo<CountryFeature[]>(() => {
    const geo = topojson.feature(
      worldTopo as any,
      (worldTopo as any).objects.countries
    ) as any;
    return geo.features;
  }, []);

  const arcs = useMemo(
    () => HUBS.map((h) => ({ startLat: h.lat, startLng: h.lng, endLat: GOA.lat, endLng: GOA.lng })),
    []
  );

  const points = useMemo(
    () => [
      ...HUBS.map((h) => ({ ...h, size: 0.35, color: "#ffedd5" })),
      { ...GOA, size: 0.6, color: EMBER },
    ],
    []
  );

  const globeMaterial = useMemo(
    () =>
      new THREE.MeshPhongMaterial({
        color: new THREE.Color("#161320"),
        shininess: 4,
      }),
    []
  );

  return (
    <div ref={containerRef} className="h-full w-full cursor-grab active:cursor-grabbing">
      {size.width > 0 && (
        <Globe
          ref={globeRef}
          width={size.width}
          height={size.height}
          backgroundColor="rgba(0,0,0,0)"
          globeMaterial={globeMaterial}
          showAtmosphere
          atmosphereColor={EMBER}
          atmosphereAltitude={0.18}
          polygonsData={countries}
          polygonCapColor={(f: any) =>
            f.properties?.name === "India" ? EMBER : "rgba(228,228,231,0.45)"
          }
          polygonSideColor={() => "rgba(20,17,28,0.7)"}
          polygonStrokeColor={() => "rgba(255,138,61,0.35)"}
          polygonAltitude={(f: any) => (f.properties?.name === "India" ? 0.012 : 0.006)}
          polygonsTransitionDuration={0}
          pointsData={points}
          pointLat="lat"
          pointLng="lng"
          pointColor="color"
          pointRadius="size"
          pointAltitude={0.01}
          pointLabel={(p: any) => p.name}
          arcsData={arcs}
          arcColor={() => EMBER}
          arcDashLength={0.4}
          arcDashGap={2}
          arcDashAnimateTime={2200}
          arcStroke={0.4}
          arcAltitude={0.28}
          onGlobeReady={() => {
            const controls = globeRef.current?.controls();
            if (controls) {
              controls.autoRotate = true;
              controls.autoRotateSpeed = 0.6;
              controls.enableZoom = false;
              controls.enablePan = false;
              controls.enableDamping = true;
              controls.dampingFactor = 0.08;
            }
            globeRef.current?.pointOfView({ lat: GOA.lat, lng: GOA.lng, altitude: 2.2 }, 0);
          }}
        />
      )}
    </div>
  );
}
