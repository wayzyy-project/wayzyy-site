import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { SmoothScroll } from "@/components/SmoothScroll";
import { mp } from "@/lib/mixpanel";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import PropertyShare from "./pages/PropertyShare";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import PaymentRefundPolicy from "./pages/PaymentRefundPolicy";
import HostTerms from "./pages/HostTerms";
import GuestTerms from "./pages/GuestTerms";

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
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/property/:propertyId" element={<PropertyShare />} />
              <Route path="/privacy" element={<PrivacyPolicy />} />
              <Route path="/payment-refund" element={<PaymentRefundPolicy />} />
              <Route path="/host-terms" element={<HostTerms />} />
              <Route path="/guest-terms" element={<GuestTerms />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </SmoothScroll>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
