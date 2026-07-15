import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";
import { Routes, Route } from "react-router-dom";

import Index from "@/pages/Index";
import PrivacyPolicy from "@/pages/PrivacyPolicy";
import PaymentRefundPolicy from "@/pages/PaymentRefundPolicy";
import HostTerms from "@/pages/HostTerms";
import GuestTerms from "@/pages/GuestTerms";
import Policies from "@/pages/Policies";
import PolicyDocPage from "@/pages/PolicyDocPage";
import EarningsCalculator from "@/pages/EarningsCalculator";
import GoaHostComplianceChecklist from "@/pages/GoaHostComplianceChecklist";

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
import WhyWeDecidedToBuildWayzyyDifferently from "@/pages/blog/WhyWeDecidedToBuildWayzyyDifferently";
import AirbnbVsBookingVsWayzyy from "@/pages/blog/AirbnbVsBookingVsWayzyy";
import HowMuchCanYouEarnVacationRentalGoa from "@/pages/blog/HowMuchCanYouEarnVacationRentalGoa";
import HiddenCostsOfRunningAnAirbnb from "@/pages/blog/HiddenCostsOfRunningAnAirbnb";
import HowToStartAirbnbBusinessIndia from "@/pages/blog/HowToStartAirbnbBusinessIndia";
import WhyRentalBusinessesNeverScaleBeyondOneProperty from "@/pages/blog/WhyRentalBusinessesNeverScaleBeyondOneProperty";
import SouthGoaTravelGuide from "@/pages/blog/SouthGoaTravelGuide";
import GalgibagaBeachGuide from "@/pages/blog/GalgibagaBeachGuide";
import PalolemBeachGuide from "@/pages/blog/PalolemBeachGuide";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// route -> component, mirrors src/App.tsx
const routes: Record<string, React.ComponentType> = {
  "/": Index,
  "/privacy": PrivacyPolicy,
  "/payment-refund": PaymentRefundPolicy,
  "/host-terms": HostTerms,
  "/guest-terms": GuestTerms,
  "/policies": Policies,
  "/policies/cancellation": PolicyDocPage,
  "/policies/community-guidelines": PolicyDocPage,
  "/policies/damage-security": PolicyDocPage,
  "/policies/discrimination-inclusion": PolicyDocPage,
  "/policies/grievance-redressal": PolicyDocPage,
  "/policies/dispute-resolution": PolicyDocPage,
  "/policies/prohibited-content": PolicyDocPage,
  "/policies/review-rating": PolicyDocPage,
  "/policies/trust-safety": PolicyDocPage,
  "/earnings-calculator": EarningsCalculator,
  "/goa-host-compliance-checklist": GoaHostComplianceChecklist,

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
  "/blog/why-we-decided-to-build-wayzyy-differently": WhyWeDecidedToBuildWayzyyDifferently,
  "/blog/airbnb-vs-booking-vs-wayzyy": AirbnbVsBookingVsWayzyy,
  "/blog/how-much-can-you-earn-vacation-rental-goa": HowMuchCanYouEarnVacationRentalGoa,
  "/blog/hidden-costs-of-running-an-airbnb": HiddenCostsOfRunningAnAirbnb,
  "/blog/how-to-start-airbnb-business-india": HowToStartAirbnbBusinessIndia,
  "/blog/why-rental-businesses-never-scale-beyond-one-property": WhyRentalBusinessesNeverScaleBeyondOneProperty,
  "/blog/south-goa-travel-guide": SouthGoaTravelGuide,
  "/blog/galgibaga-beach-goa-guide": GalgibagaBeachGuide,
  "/blog/palolem-beach-south-goa-guide": PalolemBeachGuide,
};

const output: Record<string, string> = {};
let failures = 0;

for (const [route, Component] of Object.entries(routes)) {
  try {
    let element = React.createElement(Component);
    if (route.startsWith("/policies/")) {
      element = React.createElement(
        Routes,
        null,
        React.createElement(Route, { path: "/policies/:docId", element: React.createElement(Component) })
      );
    }
    const html = renderToStaticMarkup(
      React.createElement(StaticRouter, { location: route }, element)
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
