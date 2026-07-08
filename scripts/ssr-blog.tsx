import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";

import BlogIndex from "@/pages/blog/BlogIndex";
import BestAirbnbAlternativesGoa from "@/pages/blog/BestAirbnbAlternativesGoa";
import WhyGoaVillasCostDifferent from "@/pages/blog/WhyGoaVillasCostDifferent";
import NorthGoaVsSouthGoa from "@/pages/blog/NorthGoaVsSouthGoa";
import WorkationGoaGuide from "@/pages/blog/WorkationGoaGuide";
import GoaScooterRentalGuide from "@/pages/blog/GoaScooterRentalGuide";
import BestTimeToVisitGoa from "@/pages/blog/BestTimeToVisitGoa";
import GoaTripBudgetGuide from "@/pages/blog/GoaTripBudgetGuide";
import AssagaoVillasGuide from "@/pages/blog/AssagaoVillasGuide";
import SiolimVillasGuide from "@/pages/blog/SiolimVillasGuide";
import MandremBeachGuide from "@/pages/blog/MandremBeachGuide";
import MorjimBeachGuide from "@/pages/blog/MorjimBeachGuide";
import AshwemBeachGuide from "@/pages/blog/AshwemBeachGuide";
import VagatorBeachGuide from "@/pages/blog/VagatorBeachGuide";
import AnjunaBeachGuide from "@/pages/blog/AnjunaBeachGuide";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// route -> component, mirrors src/App.tsx
const routes: Record<string, React.ComponentType> = {
  "/blog": BlogIndex,
  "/blog/best-airbnb-alternatives-goa": BestAirbnbAlternativesGoa,
  "/blog/why-villas-goa-different-prices-platforms": WhyGoaVillasCostDifferent,
  "/blog/north-goa-vs-south-goa-guide": NorthGoaVsSouthGoa,
  "/blog/workation-goa-guide": WorkationGoaGuide,
  "/blog/goa-scooter-rental-guide": GoaScooterRentalGuide,
  "/blog/best-time-to-visit-goa": BestTimeToVisitGoa,
  "/blog/goa-trip-budget-guide": GoaTripBudgetGuide,
  "/blog/assagao-goa-villas-guide": AssagaoVillasGuide,
  "/blog/siolim-goa-villas-guide": SiolimVillasGuide,
  "/blog/mandrem-goa-beach-guide": MandremBeachGuide,
  "/blog/morjim-goa-beach-guide": MorjimBeachGuide,
  "/blog/ashwem-goa-beach-guide": AshwemBeachGuide,
  "/blog/vagator-goa-beach-guide": VagatorBeachGuide,
  "/blog/anjuna-goa-beach-guide": AnjunaBeachGuide,
};

const output: Record<string, string> = {};
let failures = 0;

for (const [route, Component] of Object.entries(routes)) {
  try {
    const html = renderToStaticMarkup(
      React.createElement(StaticRouter, { location: route }, React.createElement(Component))
    );
    output[route] = html;
    console.log(`SSR ok: ${route} (${html.length} chars)`);
  } catch (err) {
    failures++;
    console.error(`SSR FAILED: ${route}`, err instanceof Error ? err.message : err);
  }
}

const outPath = path.join(__dirname, ".ssr-output.json");
fs.writeFileSync(outPath, JSON.stringify(output), "utf8");
console.log(`\nWrote ${Object.keys(output).length} rendered routes to ${outPath}`);

if (failures > 0) {
  console.error(`${failures} route(s) failed to SSR — falling back to client-only render for those.`);
}
