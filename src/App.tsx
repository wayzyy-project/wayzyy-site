import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { SmoothScroll } from "@/components/SmoothScroll";
import { ScrollToTop } from "@/components/ScrollToTop";
import { mp } from "@/lib/mixpanel";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import PropertyShare from "./pages/PropertyShare";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import PaymentRefundPolicy from "./pages/PaymentRefundPolicy";
import HostTerms from "./pages/HostTerms";
import GuestTerms from "./pages/GuestTerms";
import Policies from "./pages/Policies";
import PolicyDocPage from "./pages/PolicyDocPage";
import EarningsCalculator from "./pages/EarningsCalculator";
import GoaHostComplianceChecklist from "./pages/GoaHostComplianceChecklist";
import HostPortal from "./pages/HostPortal";
import BlogIndex from "./pages/blog/BlogIndex";
import BestAirbnbAlternativesGoa from "./pages/blog/BestAirbnbAlternativesGoa";
import WhyGoaVillasCostDifferent from "./pages/blog/WhyGoaVillasCostDifferent";
import NorthGoaVsSouthGoa from "./pages/blog/NorthGoaVsSouthGoa";
import WorkationGoaGuide from "./pages/blog/WorkationGoaGuide";
import GoaScooterRentalGuide from "./pages/blog/GoaScooterRentalGuide";
import BestTimeToVisitGoa from "./pages/blog/BestTimeToVisitGoa";
import GoaTripBudgetGuide from "./pages/blog/GoaTripBudgetGuide";
import AssagaoVillasGuide from "./pages/blog/AssagaoVillasGuide";
import SiolimVillasGuide from "./pages/blog/SiolimVillasGuide";
import MandremBeachGuide from "./pages/blog/MandremBeachGuide";
import MorjimBeachGuide from "./pages/blog/MorjimBeachGuide";
import AshwemBeachGuide from "./pages/blog/AshwemBeachGuide";
import VagatorBeachGuide from "./pages/blog/VagatorBeachGuide";
import AnjunaBeachGuide from "./pages/blog/AnjunaBeachGuide";
import NorthGoaTravelGuide from "./pages/blog/NorthGoaTravelGuide";
import NorthGoaVillasVsSouthGoaVillas from "./pages/blog/NorthGoaVillasVsSouthGoaVillas";
import WhereToStayInGoa from "./pages/blog/WhereToStayInGoa";
import GoaWorkCafesGuide from "./pages/blog/GoaWorkCafesGuide";
import GoaNightlifeGuide from "./pages/blog/GoaNightlifeGuide";
import GoaBeachesGuide from "./pages/blog/GoaBeachesGuide";
import GoaFoodGuide from "./pages/blog/GoaFoodGuide";
import GoaMarketsGuide from "./pages/blog/GoaMarketsGuide";
import GoaItineraryGuide from "./pages/blog/GoaItineraryGuide";
import GoaMonsoonGuide from "./pages/blog/GoaMonsoonGuide";
import GoaTransportGuide from "./pages/blog/GoaTransportGuide";
import GoaHotelVsVillaVsHomestay from "./pages/blog/GoaHotelVsVillaVsHomestay";
import GoaFamilyTripGuide from "./pages/blog/GoaFamilyTripGuide";
import WhyWeDecidedToBuildWayzyyDifferently from "./pages/blog/WhyWeDecidedToBuildWayzyyDifferently";
import AirbnbVsBookingVsWayzyy from "./pages/blog/AirbnbVsBookingVsWayzyy";
import HowMuchCanYouEarnVacationRentalGoa from "./pages/blog/HowMuchCanYouEarnVacationRentalGoa";
import HiddenCostsOfRunningAnAirbnb from "./pages/blog/HiddenCostsOfRunningAnAirbnb";
import HowToStartAirbnbBusinessIndia from "./pages/blog/HowToStartAirbnbBusinessIndia";
import WhyRentalBusinessesNeverScaleBeyondOneProperty from "./pages/blog/WhyRentalBusinessesNeverScaleBeyondOneProperty";
import SouthGoaTravelGuide from "./pages/blog/SouthGoaTravelGuide";
import GalgibagaBeachGuide from "./pages/blog/GalgibagaBeachGuide";
import PalolemBeachGuide from "./pages/blog/PalolemBeachGuide";
import WhereToStayInSouthGoa from "./pages/blog/WhereToStayInSouthGoa";
import RealCostOfAirbnbFee from "./pages/blog/RealCostOfAirbnbFee";
import AgondaBeachGuide from "./pages/blog/AgondaBeachGuide";
import PatnemBeachGuide from "./pages/blog/PatnemBeachGuide";
import ColaBeachGuide from "./pages/blog/ColaBeachGuide";
import ButterflyBeachGuide from "./pages/blog/ButterflyBeachGuide";
import DudhsagarFallsGuide from "./pages/blog/DudhsagarFallsGuide";
import CaboDeRamaFortGuide from "./pages/blog/CaboDeRamaFortGuide";
import CotigaoWildlifeSanctuaryGuide from "./pages/blog/CotigaoWildlifeSanctuaryGuide";
import AppLaunchSoon from "./pages/AppLaunchSoon";

const queryClient = new QueryClient();

// Track page view once on load
mp.pageView();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <SmoothScroll>
            <ScrollToTop />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/property/:propertyId" element={<PropertyShare />} />
              <Route path="/privacy" element={<PrivacyPolicy />} />
              <Route path="/payment-refund" element={<PaymentRefundPolicy />} />
              <Route path="/host-terms" element={<HostTerms />} />
              <Route path="/guest-terms" element={<GuestTerms />} />
              <Route path="/policies" element={<Policies />} />
              <Route path="/policies/:docId" element={<PolicyDocPage />} />
              <Route path="/host" element={<HostPortal />} />
              <Route path="/earnings-calculator" element={<EarningsCalculator />} />
              <Route path="/goa-host-compliance-checklist" element={<GoaHostComplianceChecklist />} />
              <Route path="/blog" element={<BlogIndex />} />
              <Route path="/blog/best-airbnb-alternatives-goa" element={<BestAirbnbAlternativesGoa />} />
              <Route path="/blog/why-villas-goa-different-prices-platforms" element={<WhyGoaVillasCostDifferent />} />
              <Route path="/blog/north-goa-vs-south-goa-guide" element={<NorthGoaVsSouthGoa />} />
              <Route path="/blog/workation-goa-guide" element={<WorkationGoaGuide />} />
              <Route path="/blog/goa-scooter-rental-guide" element={<GoaScooterRentalGuide />} />
              <Route path="/blog/best-time-to-visit-goa" element={<BestTimeToVisitGoa />} />
              <Route path="/blog/goa-trip-budget-guide" element={<GoaTripBudgetGuide />} />
              <Route path="/blog/assagao-goa-villas-guide" element={<AssagaoVillasGuide />} />
              <Route path="/blog/siolim-goa-villas-guide" element={<SiolimVillasGuide />} />
              <Route path="/blog/mandrem-goa-beach-guide" element={<MandremBeachGuide />} />
              <Route path="/blog/morjim-goa-beach-guide" element={<MorjimBeachGuide />} />
              <Route path="/blog/ashwem-goa-beach-guide" element={<AshwemBeachGuide />} />
              <Route path="/blog/vagator-goa-beach-guide" element={<VagatorBeachGuide />} />
              <Route path="/blog/anjuna-goa-beach-guide" element={<AnjunaBeachGuide />} />
              <Route path="/blog/north-goa-travel-guide" element={<NorthGoaTravelGuide />} />
              <Route path="/blog/north-goa-villas-vs-south-goa-villas" element={<NorthGoaVillasVsSouthGoaVillas />} />
              <Route path="/blog/where-to-stay-in-goa" element={<WhereToStayInGoa />} />
              <Route path="/blog/goa-work-cafes-guide" element={<GoaWorkCafesGuide />} />
              <Route path="/blog/goa-nightlife-guide" element={<GoaNightlifeGuide />} />
              <Route path="/blog/goa-beaches-guide" element={<GoaBeachesGuide />} />
              <Route path="/blog/goa-food-guide" element={<GoaFoodGuide />} />
              <Route path="/blog/goa-markets-guide" element={<GoaMarketsGuide />} />
              <Route path="/blog/goa-itinerary-guide" element={<GoaItineraryGuide />} />
              <Route path="/blog/goa-monsoon-guide" element={<GoaMonsoonGuide />} />
              <Route path="/blog/goa-transport-guide" element={<GoaTransportGuide />} />
              <Route path="/blog/goa-hotel-vs-villa-vs-homestay" element={<GoaHotelVsVillaVsHomestay />} />
              <Route path="/blog/goa-family-trip-guide" element={<GoaFamilyTripGuide />} />
              <Route path="/blog/why-we-decided-to-build-wayzyy-differently" element={<WhyWeDecidedToBuildWayzyyDifferently />} />
              <Route path="/blog/airbnb-vs-booking-vs-wayzyy" element={<AirbnbVsBookingVsWayzyy />} />
              <Route path="/blog/how-much-can-you-earn-vacation-rental-goa" element={<HowMuchCanYouEarnVacationRentalGoa />} />
              <Route path="/blog/hidden-costs-of-running-an-airbnb" element={<HiddenCostsOfRunningAnAirbnb />} />
              <Route path="/blog/how-to-start-airbnb-business-india" element={<HowToStartAirbnbBusinessIndia />} />
              <Route path="/blog/why-rental-businesses-never-scale-beyond-one-property" element={<WhyRentalBusinessesNeverScaleBeyondOneProperty />} />
              <Route path="/blog/south-goa-travel-guide" element={<SouthGoaTravelGuide />} />
              <Route path="/blog/galgibaga-beach-goa-guide" element={<GalgibagaBeachGuide />} />
              <Route path="/blog/palolem-beach-south-goa-guide" element={<PalolemBeachGuide />} />
              <Route path="/blog/where-to-stay-in-south-goa" element={<WhereToStayInSouthGoa />} />
              <Route path="/blog/real-cost-of-airbnb-fee" element={<RealCostOfAirbnbFee />} />
              <Route path="/blog/agonda-beach-south-goa-guide" element={<AgondaBeachGuide />} />
              <Route path="/blog/patnem-beach-south-goa-guide" element={<PatnemBeachGuide />} />
              <Route path="/blog/cola-beach-goa-guide" element={<ColaBeachGuide />} />
              <Route path="/blog/butterfly-beach-goa-guide" element={<ButterflyBeachGuide />} />
              <Route path="/blog/dudhsagar-falls-goa-guide" element={<DudhsagarFallsGuide />} />
              <Route path="/blog/cabo-de-rama-fort-goa-guide" element={<CaboDeRamaFortGuide />} />
              <Route path="/blog/cotigao-wildlife-sanctuary-goa-guide" element={<CotigaoWildlifeSanctuaryGuide />} />
              <Route path="/explore" element={<AppLaunchSoon />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </SmoothScroll>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
