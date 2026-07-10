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
              <Route path="*" element={<NotFound />} />
            </Routes>
          </SmoothScroll>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
