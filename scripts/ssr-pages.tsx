import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";

import Index from "@/pages/Index";
import PrivacyPolicy from "@/pages/PrivacyPolicy";
import PaymentRefundPolicy from "@/pages/PaymentRefundPolicy";
import HostTerms from "@/pages/HostTerms";
import GuestTerms from "@/pages/GuestTerms";

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
import NorthGoaVillasVsSouthGoaVillas from "@/pages/blog/NorthGoaVillasVsSouthGoaVillas";
import NorthGoaTravelGuide from "@/pages/blog/NorthGoaTravelGuide";
import WhereToStayInGoa from "@/pages/blog/WhereToStayInGoa";
import GoaWorkCafesGuide from "@/pages/blog/GoaWorkCafesGuide";
import GoaNightlifeGuide from "@/pages/blog/GoaNightlifeGuide";
import GoaBeachesGuide from "@/pages/blog/GoaBeachesGuide";
import GoaFoodGuide from "@/pages/blog/GoaFoodGuide";
import GoaMarketsGuide from "@/pages/blog/GoaMarketsGuide";
import GoaItineraryGuide from "@/pages/blog/GoaItineraryGuide";
import GoaMonsoonGuide from "@/pages/blog/GoaMonsoonGuide";
import GoaTransportGuide from "@/pages/blog/GoaTransportGuide";
import GoaHotelVsVillaVsHomestay from "@/pages/blog/GoaHotelVsVillaVsHomestay";
import GoaFamilyTripGuide from "@/pages/blog/GoaFamilyTripGuide";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// route -> component, mirrors src/App.tsx
const routes: Record<string, React.ComponentType> = {
  "/": Index,
  "/privacy": PrivacyPolicy,
  "/payment-refund": PaymentRefundPolicy,
  "/host-terms": HostTerms,
  "/guest-terms": GuestTerms,

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
  "/blog/north-goa-villas-vs-south-goa-villas": NorthGoaVillasVsSouthGoaVillas,
  "/blog/north-goa-travel-guide": NorthGoaTravelGuide,
  "/blog/where-to-stay-in-goa": WhereToStayInGoa,
  "/blog/goa-work-cafes-guide": GoaWorkCafesGuide,
  "/blog/goa-nightlife-guide": GoaNightlifeGuide,
  "/blog/goa-beaches-guide": GoaBeachesGuide,
  "/blog/goa-food-guide": GoaFoodGuide,
  "/blog/goa-markets-guide": GoaMarketsGuide,
  "/blog/goa-itinerary-guide": GoaItineraryGuide,
  "/blog/goa-monsoon-guide": GoaMonsoonGuide,
  "/blog/goa-transport-guide": GoaTransportGuide,
  "/blog/goa-hotel-vs-villa-vs-homestay": GoaHotelVsVillaVsHomestay,
  "/blog/goa-family-trip-guide": GoaFamilyTripGuide,
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
