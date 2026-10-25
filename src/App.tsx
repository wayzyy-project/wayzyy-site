import { lazy, Suspense } from "react";
import { WishlistPicker } from "@/components/wishlist/WishlistPicker";
const OpenApp = lazy(() => import("./pages/OpenApp"));
const PlaceStays = lazy(() => import("./pages/PlaceStays"));
import { OpenInAppPrompt } from "./components/OpenInAppPrompt";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { SmoothScroll } from "@/components/SmoothScroll";
import { ScrollToTop } from "@/components/ScrollToTop";
import { MobileTabBar } from "@/components/MobileTabBar";
import { mp } from "@/lib/mixpanel";
const Index = lazy(() => import("./pages/Index"));
import NotFound from "./pages/NotFound";
// PropertyShare's route is superseded by PropertyDetail (below), which
// already owns /property/:propertyId on this branch.
const HostPreview = lazy(() => import("./pages/HostPreview"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const DeleteAccount = lazy(() => import("./pages/DeleteAccount"));
const PaymentRefundPolicy = lazy(() => import("./pages/PaymentRefundPolicy"));
const HostTerms = lazy(() => import("./pages/HostTerms"));
const GuestTerms = lazy(() => import("./pages/GuestTerms"));
const Policies = lazy(() => import("./pages/Policies"));
const PolicyDocPage = lazy(() => import("./pages/PolicyDocPage"));
const PropertyImportPolicy = lazy(() => import("./pages/PropertyImportPolicy"));
const EarningsCalculator = lazy(() => import("./pages/EarningsCalculator"));
const GoaHostComplianceChecklist = lazy(() => import("./pages/GoaHostComplianceChecklist"));
const HostPortal = lazy(() => import("./pages/HostPortal"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const AdminVerifications = lazy(() => import("./pages/AdminVerifications"));
const AdminReviewListing = lazy(() => import("./pages/AdminReviewListing"));
const AdminListings = lazy(() => import("./pages/AdminListings"));
const AdminAirroiImport = lazy(() => import("./pages/AdminAirroiImport"));
const AdminGigChallenge = lazy(() => import("./pages/AdminGigChallenge"));
const BlogIndex = lazy(() => import("./pages/blog/BlogIndex"));
const BestAirbnbAlternativesGoa = lazy(() => import("./pages/blog/BestAirbnbAlternativesGoa"));
const WhyGoaVillasCostDifferent = lazy(() => import("./pages/blog/WhyGoaVillasCostDifferent"));
const NorthGoaVsSouthGoa = lazy(() => import("./pages/blog/NorthGoaVsSouthGoa"));
const WorkationGoaGuide = lazy(() => import("./pages/blog/WorkationGoaGuide"));
const GoaScooterRentalGuide = lazy(() => import("./pages/blog/GoaScooterRentalGuide"));
const BestTimeToVisitGoa = lazy(() => import("./pages/blog/BestTimeToVisitGoa"));
const GoaTripBudgetGuide = lazy(() => import("./pages/blog/GoaTripBudgetGuide"));
const AssagaoVillasGuide = lazy(() => import("./pages/blog/AssagaoVillasGuide"));
const SiolimVillasGuide = lazy(() => import("./pages/blog/SiolimVillasGuide"));
const MandremBeachGuide = lazy(() => import("./pages/blog/MandremBeachGuide"));
const MorjimBeachGuide = lazy(() => import("./pages/blog/MorjimBeachGuide"));
const AshwemBeachGuide = lazy(() => import("./pages/blog/AshwemBeachGuide"));
const VagatorBeachGuide = lazy(() => import("./pages/blog/VagatorBeachGuide"));
const AnjunaBeachGuide = lazy(() => import("./pages/blog/AnjunaBeachGuide"));
const NorthGoaTravelGuide = lazy(() => import("./pages/blog/NorthGoaTravelGuide"));
const NorthGoaVillasVsSouthGoaVillas = lazy(() => import("./pages/blog/NorthGoaVillasVsSouthGoaVillas"));
const WhereToStayInGoa = lazy(() => import("./pages/blog/WhereToStayInGoa"));
const GoaWorkCafesGuide = lazy(() => import("./pages/blog/GoaWorkCafesGuide"));
const GoaNightlifeGuide = lazy(() => import("./pages/blog/GoaNightlifeGuide"));
const GoaBeachesGuide = lazy(() => import("./pages/blog/GoaBeachesGuide"));
const GoaFoodGuide = lazy(() => import("./pages/blog/GoaFoodGuide"));
const GoaMarketsGuide = lazy(() => import("./pages/blog/GoaMarketsGuide"));
const GoaItineraryGuide = lazy(() => import("./pages/blog/GoaItineraryGuide"));
const GoaMonsoonGuide = lazy(() => import("./pages/blog/GoaMonsoonGuide"));
const GoaTransportGuide = lazy(() => import("./pages/blog/GoaTransportGuide"));
const GoaHotelVsVillaVsHomestay = lazy(() => import("./pages/blog/GoaHotelVsVillaVsHomestay"));
const GoaFamilyTripGuide = lazy(() => import("./pages/blog/GoaFamilyTripGuide"));
const WhyWeDecidedToBuildWayzyyDifferently = lazy(() => import("./pages/blog/WhyWeDecidedToBuildWayzyyDifferently"));
const AirbnbVsBookingVsWayzyy = lazy(() => import("./pages/blog/AirbnbVsBookingVsWayzyy"));
const HowMuchCanYouEarnVacationRentalGoa = lazy(() => import("./pages/blog/HowMuchCanYouEarnVacationRentalGoa"));
const HiddenCostsOfRunningAnAirbnb = lazy(() => import("./pages/blog/HiddenCostsOfRunningAnAirbnb"));
const HowToStartAirbnbBusinessIndia = lazy(() => import("./pages/blog/HowToStartAirbnbBusinessIndia"));
const WhyRentalBusinessesNeverScaleBeyondOneProperty = lazy(() => import("./pages/blog/WhyRentalBusinessesNeverScaleBeyondOneProperty"));
const SouthGoaTravelGuide = lazy(() => import("./pages/blog/SouthGoaTravelGuide"));
const GalgibagaBeachGuide = lazy(() => import("./pages/blog/GalgibagaBeachGuide"));
const PalolemBeachGuide = lazy(() => import("./pages/blog/PalolemBeachGuide"));
const WhereToStayInSouthGoa = lazy(() => import("./pages/blog/WhereToStayInSouthGoa"));
const RealCostOfAirbnbFee = lazy(() => import("./pages/blog/RealCostOfAirbnbFee"));
const GoaAirbnbEarningsFalling = lazy(() => import("./pages/blog/GoaAirbnbEarningsFalling"));
const AgondaBeachGuide = lazy(() => import("./pages/blog/AgondaBeachGuide"));
const PatnemBeachGuide = lazy(() => import("./pages/blog/PatnemBeachGuide"));
const ColaBeachGuide = lazy(() => import("./pages/blog/ColaBeachGuide"));
const ButterflyBeachGuide = lazy(() => import("./pages/blog/ButterflyBeachGuide"));
const DudhsagarFallsGuide = lazy(() => import("./pages/blog/DudhsagarFallsGuide"));
const CaboDeRamaFortGuide = lazy(() => import("./pages/blog/CaboDeRamaFortGuide"));
const CotigaoWildlifeSanctuaryGuide = lazy(() => import("./pages/blog/CotigaoWildlifeSanctuaryGuide"));
const SilentNoiseGoaGuide = lazy(() => import("./pages/blog/SilentNoiseGoaGuide"));
const KakolemBeachGuide = lazy(() => import("./pages/blog/KakolemBeachGuide"));
const Goa = lazy(() => import("./pages/blog/Goa"));
const WhereToStayInGoa2026 = lazy(() => import("./pages/blog/WhereToStayInGoa2026"));
const TambdiSurlaTempleGuide = lazy(() => import("./pages/blog/TambdiSurlaTempleGuide"));
const GoaSpiritualTourismGuide = lazy(() => import("./pages/blog/GoaSpiritualTourismGuide"));
const EkadashaTeerthaYatraGuide = lazy(() => import("./pages/blog/EkadashaTeerthaYatraGuide"));
const SixNewGoaTourismProjectsGuide = lazy(() => import("./pages/blog/SixNewGoaTourismProjectsGuide"));
const AguadaMonsoonHeritageGuide = lazy(() => import("./pages/blog/AguadaMonsoonHeritageGuide"));
const HowToBookVerifiedStayGoa = lazy(() => import("./pages/blog/HowToBookVerifiedStayGoa"));
const HowDisputeResolutionWorksForHosts = lazy(() => import("./pages/blog/HowDisputeResolutionWorksForHosts"));
const FontainhasGoaGuide = lazy(() => import("./pages/blog/FontainhasGoaGuide"));
const GoaAirbnbRegistrationRules = lazy(() => import("./pages/blog/GoaAirbnbRegistrationRules"));
const CandolimBeachGuide = lazy(() => import("./pages/blog/CandolimBeachGuide"));
const CalanguteBeachGuide = lazy(() => import("./pages/blog/CalanguteBeachGuide"));
const BagaBeachGuide = lazy(() => import("./pages/blog/BagaBeachGuide"));
const GoaTimeAppAirbnbHosts = lazy(() => import("./pages/blog/GoaTimeAppAirbnbHosts"));
const FormCForeignGuestsGoa = lazy(() => import("./pages/blog/FormCForeignGuestsGoa"));
const IsAirbnbLegalInGoa = lazy(() => import("./pages/blog/IsAirbnbLegalInGoa"));
const GstForAirbnbHostsIndia = lazy(() => import("./pages/blog/GstForAirbnbHostsIndia"));
const UnmarriedCouplesGoaStays = lazy(() => import("./pages/blog/UnmarriedCouplesGoaStays"));
const HotelsInGoa = lazy(() => import("./pages/blog/HotelsInGoa"));
const GoaDecemberNewYearGuide = lazy(() => import("./pages/blog/GoaDecemberNewYearGuide"));
const AirbnbPricingUpdate15PercentFee = lazy(() => import("./pages/blog/AirbnbPricingUpdate15PercentFee"));
const AirbnbAlternativeLanding = lazy(() => import("./pages/AirbnbAlternativeLanding"));
const WhatIsWayzyy = lazy(() => import("./pages/WhatIsWayzyy"));
const About = lazy(() => import("./pages/About"));





const GigChallenge = lazy(() => import("./pages/GigChallenge"));
const FinalCoconut = lazy(() => import("./pages/FinalCoconut"));
const GrandPrixHackathon = lazy(() => import("./pages/GrandPrixHackathon"));
const Links = lazy(() => import("./pages/Links"));
const HostBookings = lazy(() => import("./pages/HostBookings"));
const HostPayoutAccount = lazy(() => import("./pages/HostPayoutAccount"));
import { HostOnboardingRedirect } from "./components/host/HostOnboardingRedirect";
const AdminHostOnboarding = lazy(() => import("./pages/AdminHostOnboarding"));
const AdminHosts = lazy(() => import("./pages/AdminHosts"));
const AppLaunchSoon = lazy(() => import("./pages/AppLaunchSoon"));
const ExperienceGoa = lazy(() => import("./pages/ExperienceGoa"));
const WaitlistChooser = lazy(() => import("./pages/WaitlistChooser"));
const WaitlistTravelers = lazy(() => import("./pages/WaitlistTravelers"));
const HostOnboardingDoc = lazy(() => import("./pages/HostOnboardingDoc"));
import ExploreStays from "./pages/ExploreStays";
const GoaStaysPublic = lazy(() => import("./pages/GoaStaysPublic"));
const VerifyIdentity = lazy(() => import("./pages/VerifyIdentity"));
const HostPricing = lazy(() => import("./pages/HostPricing"));
import PropertyDetail from "./pages/PropertyDetail";
const MyTrips = lazy(() => import("./pages/MyTrips"));
const Wishlists = lazy(() => import("./pages/Wishlists"));
const WriteReview = lazy(() => import("./pages/WriteReview"));
const GetTheApp = lazy(() => import("./pages/GetTheApp"));
const Account = lazy(() => import("./pages/Account"));
const Inbox = lazy(() => import("./pages/Inbox"));
const MessageThread = lazy(() => import("./pages/MessageThread"));
const SarvamStartupProgram = lazy(() => import("./pages/SarvamStartupProgram"));

const queryClient = new QueryClient();

// Track page view once on load
mp.pageView();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      disableTransitionOnChange
    >
      <TooltipProvider>
        <Toaster />
        <WishlistPicker />
        <Sonner />
        <BrowserRouter>
          <SmoothScroll>
            <ScrollToTop />
            <div className="pb-24 sm:pb-0">
            <Suspense fallback={<div className="min-h-screen bg-background" aria-busy="true" />}>
            <Routes>
              <Route path="/" element={<ExploreStays />} />
              <Route path="/stays" element={<ExploreStays />} />
              <Route path="/explore" element={<ExploreStays />} />
              {/* Public, no-login, live-data-only browse page for sending a
                  clean link to a client - never mixes in MOCK_PROPERTIES or
                  the two seed/demo host accounts the way /stays does. */}
              <Route path="/goa-stays" element={<GoaStaysPublic />} />
              {/* Place and type pages: /goa/stays, /anjuna/stays, /goa/stays/villas ... */}
              <Route path="/:place/stays" element={<PlaceStays />} />
              <Route path="/:place/stays/:cat" element={<PlaceStays />} />
              <Route path="/verify-identity" element={<VerifyIdentity />} />
              <Route path="/property/:propertyId" element={<PropertyDetail />} />
              <Route path="/rooms/:propertyId" element={<PropertyDetail />} />
              <Route path="/trips" element={<MyTrips />} />
              <Route path="/my-bookings" element={<MyTrips />} />
              <Route path="/open/*" element={<OpenApp />} />
              <Route path="/open" element={<OpenApp />} />
              <Route path="/inbox" element={<Inbox />} />
              <Route path="/inbox/:threadId" element={<Inbox />} />
              <Route path="/wishlists" element={<Wishlists />} />
              <Route path="/review" element={<WriteReview />} />
              <Route path="/app" element={<GetTheApp />} />
              <Route path="/download" element={<GetTheApp />} />
              <Route path="/account" element={<Account />} />
              <Route path="/saved" element={<Wishlists />} />
              <Route path="/news/sarvam-startup-program" element={<SarvamStartupProgram />} />
              <Route path="/news/sarvam-ai-startup-program" element={<SarvamStartupProgram />} />
              <Route path="/blog/sarvam-startup-program" element={<SarvamStartupProgram />} />
              <Route path="/blog/wayzyy-selected-for-sarvam-ai-startup-program" element={<SarvamStartupProgram />} />
              <Route path="/onboarding" element={<HostOnboardingDoc />} />
              <Route path="/gig-challenge" element={<GigChallenge />} />
              <Route path="/final-coconut" element={<FinalCoconut />} />
              <Route path="/build-with-us" element={<GigChallenge />} />
              <Route path="/grand-prix" element={<GrandPrixHackathon />} />
              <Route path="/links" element={<Links />} />
              {/* Folded into the authenticated /host dashboard - these two
                  routes now only catch links already shared with hosts. */}
              <Route path="/host-onboarding" element={<HostOnboardingRedirect />} />
              <Route path="/host-onboarding/status" element={<HostOnboardingRedirect />} />
              <Route path="/host-preview/:hostId" element={<HostPreview />} />
              <Route path="/privacy" element={<PrivacyPolicy />} />
              <Route path="/delete-account" element={<DeleteAccount />} />
              <Route path="/payment-refund" element={<PaymentRefundPolicy />} />
              <Route path="/host-terms" element={<HostTerms />} />
              <Route path="/guest-terms" element={<GuestTerms />} />
              <Route path="/policies" element={<Policies />} />
              <Route path="/policies/property-import-policy" element={<PropertyImportPolicy />} />
              <Route path="/policies/:docId" element={<PolicyDocPage />} />
              <Route path="/host" element={<HostPortal />} />
              <Route path="/host/bookings" element={<HostBookings />} />
              <Route path="/host/payout" element={<HostPayoutAccount />} />
              <Route path="/host/pricing" element={<HostPricing />} />
              <Route path="/adminn" element={<AdminDashboard />} />
              <Route path="/adminn/verifications" element={<AdminVerifications />} />
              <Route path="/adminn/review/:propertyId" element={<AdminReviewListing />} />
              <Route path="/adminn/listings" element={<AdminListings />} />
              <Route path="/adminn/airroi-import" element={<AdminAirroiImport />} />
              <Route path="/adminn/import-airbnb" element={<AdminAirroiImport />} />
              <Route path="/admin-wayzyy-lol" element={<AdminGigChallenge />} />
              <Route path="/adminn/onboarding-hosts" element={<AdminHostOnboarding />} />
              <Route path="/adminn/hosts" element={<AdminHosts />} />
              <Route path="/admin-wayzyy-lol/hosts" element={<AdminHostOnboarding />} />
              <Route path="/earnings-calculator" element={<EarningsCalculator />} />
              <Route path="/goa-host-compliance-checklist" element={<GoaHostComplianceChecklist />} />
              <Route path="/blog" element={<BlogIndex />} />
              <Route path="/blog/airbnb-pricing-update-15-percent-fee-lowest-price" element={<AirbnbPricingUpdate15PercentFee />} />
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
              <Route path="/blog/why-goa-airbnb-earnings-are-falling" element={<GoaAirbnbEarningsFalling />} />
              <Route path="/blog/agonda-beach-south-goa-guide" element={<AgondaBeachGuide />} />
              <Route path="/blog/patnem-beach-south-goa-guide" element={<PatnemBeachGuide />} />
              <Route path="/blog/cola-beach-goa-guide" element={<ColaBeachGuide />} />
              <Route path="/blog/butterfly-beach-goa-guide" element={<ButterflyBeachGuide />} />
              <Route path="/blog/dudhsagar-falls-goa-guide" element={<DudhsagarFallsGuide />} />
              <Route path="/blog/cabo-de-rama-fort-goa-guide" element={<CaboDeRamaFortGuide />} />
              <Route path="/blog/cotigao-wildlife-sanctuary-goa-guide" element={<CotigaoWildlifeSanctuaryGuide />} />
              <Route path="/blog/silent-noise-goa-guide" element={<SilentNoiseGoaGuide />} />
              <Route path="/blog/kakolem-beach-goa-guide" element={<KakolemBeachGuide />} />
              <Route path="/blog/goa" element={<Goa />} />
              <Route path="/blog/where-to-stay-in-goa-2026" element={<WhereToStayInGoa2026 />} />
              <Route path="/blog/tambdi-surla-temple-goa-guide" element={<TambdiSurlaTempleGuide />} />
              <Route path="/blog/goa-spiritual-tourism-guide" element={<GoaSpiritualTourismGuide />} />
              <Route path="/blog/ekadasha-teertha-yatra-goa-guide" element={<EkadashaTeerthaYatraGuide />} />
              <Route path="/blog/six-new-goa-tourism-projects-guide-2026" element={<SixNewGoaTourismProjectsGuide />} />
              <Route path="/blog/aguada-port-jail-monsoon-heritage-tourism-guide" element={<AguadaMonsoonHeritageGuide />} />
              <Route path="/blog/how-to-book-verified-stay-in-goa" element={<HowToBookVerifiedStayGoa />} />
              <Route path="/blog/how-dispute-resolution-works-for-hosts" element={<HowDisputeResolutionWorksForHosts />} />
              <Route path="/blog/fontainhas-goa-guide" element={<FontainhasGoaGuide />} />
              <Route path="/blog/goa-airbnb-registration-rules" element={<GoaAirbnbRegistrationRules />} />
              <Route path="/blog/candolim-goa-beach-guide" element={<CandolimBeachGuide />} />
              <Route path="/blog/calangute-goa-beach-guide" element={<CalanguteBeachGuide />} />
              <Route path="/blog/baga-goa-beach-guide" element={<BagaBeachGuide />} />
              <Route path="/blog/goa-time-app-airbnb-hosts" element={<GoaTimeAppAirbnbHosts />} />
              <Route path="/blog/form-c-foreign-guests-airbnb-hosts-goa" element={<FormCForeignGuestsGoa />} />
              <Route path="/blog/is-airbnb-legal-in-goa" element={<IsAirbnbLegalInGoa />} />
              <Route path="/blog/gst-for-airbnb-hosts-india" element={<GstForAirbnbHostsIndia />} />
              <Route path="/blog/unmarried-couples-goa-hotels-villas" element={<UnmarriedCouplesGoaStays />} />
              <Route path="/blog/hotels-in-goa" element={<HotelsInGoa />} />
              <Route path="/blog/goa-december-new-year-guide-2026" element={<GoaDecemberNewYearGuide />} />
              <Route path="/airbnb-alternative" element={<AirbnbAlternativeLanding />} />
              <Route path="/what-is-wayzyy" element={<WhatIsWayzyy />} />
              <Route path="/about" element={<Index />} />
              <Route path="/about/team" element={<About />} />
              <Route path="/experience" element={<ExperienceGoa />} />
              <Route path="/waitlist" element={<WaitlistChooser />} />
              <Route path="/waitlist/travelers" element={<WaitlistTravelers />} />





              <Route path="*" element={<NotFound />} />
            </Routes>
            </Suspense>
            </div>
            <OpenInAppPrompt />
            <MobileTabBar />
          </SmoothScroll>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
