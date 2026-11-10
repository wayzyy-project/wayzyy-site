import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { 
  Search, 
  Globe, 
  Menu, 
  User as UserIcon, 
  Calendar as CalendarIcon, 
  Users, 
  MapPin, 
  X, 
  Plus, 
  Minus,
  Heart,
  Home,
  Luggage,
  Moon,
  Sun,
  Key,
  Building,
  Castle,
  MessageCircle
} from "lucide-react";
import { useTheme } from "next-themes";
import { MessagesLink } from "@/components/messaging/MessagesLink";
import { useAuth } from "@/hooks/useAuth";
import { UserRound, Smartphone } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { format, startOfDay } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { STAY_RANGE_CLASSNAMES } from "@/components/booking/StayDatesCalendar";

interface SearchState {
  destination: string;
  checkIn: Date | null;
  checkOut: Date | null;
  guests: {
    adults: number;
    children: number;
    infants: number;
  };
}

interface AirbnbHeaderProps {
  searchState?: SearchState;
  onSearchChange?: (newSearch: SearchState) => void;
  onPerformSearch?: (searchState: SearchState) => void;
  onSelectCategory?: (category: string) => void;
  activeCategory?: string;
  compact?: boolean;
}

export const AirbnbHeader: React.FC<AirbnbHeaderProps> = ({
  searchState: parentSearchState,
  onSearchChange,
  onPerformSearch,
  onSelectCategory,
  activeCategory = "all",
  compact = false
}) => {
  const { user: authUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, setTheme } = useTheme();
  const [activeNavTab, setActiveNavTab] = useState<"all" | "homes" | "villas">(
    activeCategory === "villas" ? "villas" : activeCategory === "apartments" ? "homes" : "all"
  );
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [activeSearchSection, setActiveSearchSection] = useState<"where" | "when" | "who" | null>(null);

  const [destination, setDestination] = useState(parentSearchState?.destination || "");
  const [checkIn, setCheckIn] = useState<Date | null>(parentSearchState?.checkIn || null);
  const [checkOut, setCheckOut] = useState<Date | null>(parentSearchState?.checkOut || null);
  const [adults, setAdults] = useState(parentSearchState?.guests?.adults || 1);
  const [children, setChildren] = useState(parentSearchState?.guests?.children || 0);
  const [infants, setInfants] = useState(parentSearchState?.guests?.infants || 0);

  const searchContainerRef = useRef<HTMLDivElement>(null);

  const totalGuests = adults + children;

  // Sync with parent props
  useEffect(() => {
    if (parentSearchState) {
      setDestination(parentSearchState.destination);
      setCheckIn(parentSearchState.checkIn);
      setCheckOut(parentSearchState.checkOut);
      setAdults(parentSearchState.guests.adults);
      setChildren(parentSearchState.guests.children);
      setInfants(parentSearchState.guests.infants);
    }
  }, [parentSearchState]);

  // Click outside listener to collapse expanded search
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setIsSearchExpanded(false);
        setActiveSearchSection(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleNavTabClick = (tab: "all" | "homes" | "villas") => {
    setActiveNavTab(tab);
    if (onSelectCategory) {
      onSelectCategory(tab === "all" ? "all" : tab === "villas" ? "villas" : "apartments");
    } else {
      navigate(`/stays?category=${tab}`);
    }
  };

  const handleSearchSubmit = () => {
    setIsSearchExpanded(false);
    setActiveSearchSection(null);
    const updatedState: SearchState = {
      destination,
      checkIn,
      checkOut,
      guests: { adults, children, infants }
    };
    if (onPerformSearch) {
      onPerformSearch(updatedState);
    } else {
      navigate(`/stays?city=${encodeURIComponent(destination)}&guests=${totalGuests}`);
    }
  };

  const quickDestinations = [
    { name: "North Goa", subtitle: "Vagator, Assagao, Candolim, Arpora" },
    { name: "South Goa", subtitle: "Palolem, Agonda, Quiet beaches" },
    { name: "Assagao, Goa", subtitle: "Luxury heritage Portuguese villas" },
    { name: "Candolim, Goa", subtitle: "Beachfront apartments & sunset pools" }
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/70 bg-background/95 backdrop-blur-md transition-all duration-300">
      <div className="mx-auto max-w-[1760px] px-4 sm:px-6 lg:px-10 xl:px-14">
        {/* Top Navbar Row */}
        <div className={`relative flex ${compact ? "h-16" : "h-20"} items-center justify-between gap-4`}>
          {/* Official WAYZYY Logo */}
          <Link to="/" className="flex items-center gap-2.5 group shrink-0">
            <img 
              src="/logo.svg" 
              alt="Wayzyy" 
              className="h-10 w-10 rounded-full object-cover shadow-sm group-hover:scale-105 transition-transform" 
            />
            <span style={{ fontFamily: '"Raleway", sans-serif' }} className="text-2xl font-black tracking-tight text-foreground group-hover:text-[#FF6B00] transition-colors">
              Wayzyy
            </span>
          </Link>

          {/* Site links - same destinations as the main navbar, so the
              stays homepage still reaches About, Why, Blog and hosting.
              Absolutely centred so it lines up with the search bar below,
              whatever the widths of the logo and the right-hand buttons. */}
          <nav className="hidden lg:flex absolute left-1/2 -translate-x-1/2 items-center gap-7 text-sm font-semibold text-foreground">
            <Link to="/" className="font-bold hover:text-[#FF6B00] transition-colors">Stays</Link>
            <Link to="/about" className="hover:text-[#FF6B00] transition-colors">About</Link>
            <a href="/about#why" className="hover:text-[#FF6B00] transition-colors">Why Wayzyy</a>
            <Link to="/earnings-calculator" className="hover:text-[#FF6B00] transition-colors">Earn more</Link>
            <Link to="/blog" className="hover:text-[#FF6B00] transition-colors">Blog</Link>
          </nav>

          {/* Right Action Menu */}
          <div className="flex items-center gap-3">
            {/* Signed in: straight to the host portal. Signed out: /host
                shows sign-up / log-in first. */}
            <Link
              to="/host"
              className="hidden sm:inline-flex rounded-full px-4 py-2 text-xs md:text-sm font-bold text-[#FF6B00] bg-[#FF6B00]/10 hover:bg-[#FF6B00] hover:text-white transition-all border border-[#FF6B00]/30 shadow-xs"
            >
              {authUser ? "Switch to hosting" : "Become a host"}
            </Link>


            <MessagesLink />

            {/* Profile Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2.5 rounded-full border border-border bg-background px-3.5 py-1.5 shadow-sm hover:shadow-md transition-all">
                  <Menu className="h-4 w-4 text-muted-foreground" />
                  <div className="h-7 w-7 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
                    <UserIcon className="h-4 w-4" />
                  </div>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 rounded-2xl p-2 shadow-xl border-border bg-popover">
                <DropdownMenuItem asChild>
                  <Link to="/account" className="flex items-center gap-2.5 py-2.5 px-3 rounded-xl font-bold cursor-pointer">
                    <UserRound className="h-4 w-4 text-[#FF6B00]" />
                    Account
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/trips" className="flex items-center gap-2.5 py-2.5 px-3 rounded-xl font-medium cursor-pointer">
                    <Luggage className="h-4 w-4 text-[#FF6B00]" />
                    My Bookings & Trips
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/inbox" className="flex items-center gap-2.5 py-2.5 px-3 rounded-xl font-medium cursor-pointer">
                    <MessageCircle className="h-4 w-4 text-[#FF6B00]" />
                    Messages
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/app" className="flex items-center gap-2.5 py-2.5 px-3 rounded-xl font-medium cursor-pointer">
                    <Smartphone className="h-4 w-4 text-[#FF6B00]" />
                    Get the app
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/wishlists" className="flex items-center gap-2.5 py-2.5 px-3 rounded-xl font-medium cursor-pointer">
                    <Heart className="h-4 w-4 text-[#FF6B00]" />
                    Saved Wishlists
                  </Link>
                </DropdownMenuItem>
                {/* Theme lives here now: light by default, dark on request. */}
                <DropdownMenuItem
                  onSelect={(e) => { e.preventDefault(); setTheme(theme === "dark" ? "light" : "dark"); }}
                  className="flex items-center gap-2.5 py-2.5 px-3 rounded-xl font-medium cursor-pointer"
                >
                  {theme === "dark" ? <Sun className="h-4 w-4 text-[#FF6B00]" /> : <Moon className="h-4 w-4 text-[#FF6B00]" />}
                  {theme === "dark" ? "Light mode" : "Dark mode"}
                </DropdownMenuItem>
                <DropdownMenuSeparator className="my-1" />
                <DropdownMenuItem asChild>
                  <Link to="/host" className="flex items-center gap-2.5 py-2.5 px-3 rounded-xl font-bold text-foreground cursor-pointer">
                    <Key className="h-4 w-4 text-[#FF6B00]" />
                    Host Portal & Calendar
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/earnings-calculator" className="flex items-center gap-2.5 py-2.5 px-3 rounded-xl text-xs text-muted-foreground cursor-pointer">
                    Earnings Calculator (2% vs 17%)
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/policies" className="flex items-center gap-2.5 py-2.5 px-3 rounded-xl text-xs text-muted-foreground cursor-pointer">
                    Trust & Safety Policies
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Compact Search Bar — all 3 zones visible on all screen sizes */}
        {/* compact: pages like Messages and Account get just the top row. */}
        {!compact && !isSearchExpanded && (
          <div className="pb-4 flex justify-center">
            <div className="w-full max-w-3xl flex items-center rounded-full border border-border/80 bg-background shadow-md hover:shadow-lg transition-all hover:border-[#FF6B00]/30 overflow-hidden">
              {/* WHERE zone */}
              <button
                type="button"
                onClick={() => { setIsSearchExpanded(true); setActiveSearchSection("where"); }}
                className="flex-1 text-left px-3 py-2.5 sm:px-6 sm:py-3.5 hover:bg-muted/50 transition-colors group min-w-0"
              >
                <p className="text-[11px] sm:text-sm font-bold text-foreground group-hover:text-[#FF6B00] transition-colors truncate">
                  {destination ? destination : "Travel destination"}
                </p>
                <p className="text-[10px] sm:text-xs text-muted-foreground truncate">
                  {destination ? "Filtered" : "Where in Goa?"}
                </p>
              </button>

              {/* Divider */}
              <div className="w-px h-7 sm:h-8 bg-border/70 shrink-0" />

              {/* WHEN zone */}
              <button
                type="button"
                onClick={() => { setIsSearchExpanded(true); setActiveSearchSection("when"); }}
                className="flex-1 text-left px-3 py-2.5 sm:px-6 sm:py-3.5 hover:bg-muted/50 transition-colors group min-w-0"
              >
                <p className="text-[11px] sm:text-sm font-bold text-foreground group-hover:text-[#FF6B00] transition-colors truncate">
                  {checkIn && checkOut
                    ? `${format(checkIn, "MMM d")} – ${format(checkOut, "MMM d")}`
                    : "What dates?"}
                </p>
                <p className="text-[10px] sm:text-xs text-muted-foreground truncate">
                  {checkIn ? "Dates set" : "Check-in and check-out"}
                </p>
              </button>

              {/* Divider */}
              <div className="w-px h-7 sm:h-8 bg-border/70 shrink-0" />

              {/* WHO zone */}
              <button
                type="button"
                onClick={() => { setIsSearchExpanded(true); setActiveSearchSection("who"); }}
                className="flex-1 text-left px-3 py-2.5 sm:px-6 sm:py-3.5 hover:bg-muted/50 transition-colors group min-w-0"
              >
                <p className="text-[11px] sm:text-sm font-bold text-foreground group-hover:text-[#FF6B00] transition-colors truncate">
                  {totalGuests > 1 ? `${totalGuests} guests` : "Who's along?"}
                </p>
                <p className="text-[10px] sm:text-xs text-muted-foreground truncate">
                  {totalGuests > 1 ? `${adults}A, ${children}C` : "Add travellers"}
                </p>
              </button>

              {/* Search button */}
              <div className="pr-1.5 pl-1 sm:pr-2">
                <button
                  type="button"
                  onClick={() => { setIsSearchExpanded(true); setActiveSearchSection("where"); }}
                  className="h-8 w-8 sm:h-11 sm:w-11 rounded-full bg-gradient-to-r from-[#FF6B00] to-[#E05300] flex items-center justify-center text-white shrink-0 shadow-md shadow-[#FF6B00]/25 hover:scale-105 transition-transform"
                >
                  <Search className="h-3.5 w-3.5 sm:h-5 sm:w-5" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Expanded Search Bar */}
        {!compact && isSearchExpanded && (
          // Same width and height as the collapsed bar, and the panels below
          // float over the page instead of pushing it down.
          <div ref={searchContainerRef} className="pb-4">
            <div className="relative mx-auto max-w-3xl">
            <div className="rounded-full border border-border bg-muted p-1 shadow-md flex items-center">
              {/* WHERE Section */}
              <div
                onClick={() => setActiveSearchSection("where")}
                className={`flex-1 min-w-0 rounded-full px-4 sm:px-6 py-2 cursor-pointer transition-colors ${
                  activeSearchSection === "where" ? "bg-background shadow-lg" : "hover:bg-background/60"
                }`}
              >
                <label className="block text-xs font-semibold text-foreground">Where</label>
                <input
                  type="text"
                  placeholder="Search destinations"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  onFocus={() => setActiveSearchSection("where")}
                  className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
                />
              </div>

              {/* WHEN Section */}
              <div
                onClick={() => setActiveSearchSection("when")}
                className={`flex-1 min-w-0 rounded-full px-4 sm:px-6 py-2 cursor-pointer transition-colors ${
                  activeSearchSection === "when" ? "bg-background shadow-lg" : "hover:bg-background/60"
                }`}
              >
                <label className="block text-xs font-semibold text-foreground">When</label>
                <p className={`text-sm truncate ${checkIn && checkOut ? "text-foreground" : "text-muted-foreground"}`}>
                  {checkIn && checkOut 
                    ? `${format(checkIn, "MMM d")} – ${format(checkOut, "MMM d")}`
                    : "Add dates"}
                </p>
              </div>

              {/* WHO Section */}
              <div
                onClick={() => setActiveSearchSection("who")}
                className={`flex-1 min-w-0 rounded-full pl-4 sm:pl-6 pr-1 py-1 cursor-pointer transition-colors flex items-center justify-between gap-2 ${
                  activeSearchSection === "who" ? "bg-background shadow-lg" : "hover:bg-background/60"
                }`}
              >
                <div className="min-w-0">
                  <label className="block text-xs font-semibold text-foreground">Who</label>
                  <p className={`text-sm truncate ${totalGuests > 1 ? "text-foreground" : "text-muted-foreground"}`}>
                    {totalGuests > 1 ? `${totalGuests} guests` : "Add guests"}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSearchSubmit();
                  }}
                  aria-label="Search"
                  className="h-12 w-12 sm:w-auto shrink-0 justify-center sm:px-5 rounded-full bg-gradient-to-r from-[#FF6B00] via-[#FF781A] to-[#E05300] text-white font-bold text-sm flex items-center gap-2 shadow-lg shadow-[#FF6B00]/30 hover:scale-105 active:scale-95 transition-all"
                >
                  <Search className="h-4 w-4" />
                  <span className="hidden sm:inline">Search</span>
                </button>
              </div>
            </div>

            {/* Dropdown Panels, lined up under the section that opened them */}
            {activeSearchSection === "where" && (
              <div className="absolute left-0 top-full z-50 mt-3 w-full sm:w-[420px] rounded-3xl border border-border bg-background p-5 shadow-2xl animate-in fade-in slide-in-from-top-2">
                <p className="px-2 pb-2 text-xs font-medium text-muted-foreground">Suggested destinations</p>
                <div className="space-y-1">
                  {quickDestinations.map((dest) => (
                    <button
                      key={dest.name}
                      onClick={() => {
                        setDestination(dest.name.split(",")[0]);
                        setActiveSearchSection("when");
                      }}
                      className="w-full flex items-center gap-4 p-2 rounded-2xl hover:bg-muted transition-colors text-left"
                    >
                      <div className="h-14 w-14 rounded-xl bg-[#FF6B00]/10 flex items-center justify-center text-[#FF6B00] shrink-0">
                        <MapPin className="h-6 w-6" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[15px] font-medium text-foreground">{dest.name}</p>
                        <p className="text-sm text-muted-foreground truncate">{dest.subtitle}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {activeSearchSection === "when" && (
              <div className="absolute left-1/2 top-full z-50 mt-3 w-full sm:w-[680px] -translate-x-1/2 rounded-3xl border border-border bg-background p-5 shadow-2xl animate-in fade-in slide-in-from-top-2">
                <div className="flex justify-center">
                  <Calendar
                    mode="range"
                    numberOfMonths={typeof window !== "undefined" && window.matchMedia("(min-width: 640px)").matches ? 2 : 1}
                    selected={{ from: checkIn ?? undefined, to: checkOut ?? undefined }}
                    defaultMonth={checkIn ?? undefined}
                    disabled={{ before: startOfDay(new Date()) }}
                    classNames={STAY_RANGE_CLASSNAMES}
                    // First click (or a click after a full range) starts a new
                    // stay; the next later day is checkout.
                    onDayClick={(day) => {
                      if (!checkIn || checkOut || day <= checkIn) {
                        setCheckIn(day);
                        setCheckOut(null);
                      } else {
                        setCheckOut(day);
                      }
                    }}
                  />
                </div>
                <div className="flex items-center justify-between border-t border-border pt-3">
                  <button
                    onClick={() => { setCheckIn(null); setCheckOut(null); }}
                    className="text-xs font-semibold text-foreground underline underline-offset-2 hover:text-[#FF6B00] transition-colors"
                  >
                    Clear dates
                  </button>
                  <button
                    onClick={() => setActiveSearchSection("who")}
                    className="text-xs text-[#FF6B00] font-bold hover:underline"
                  >
                    Continue to Guests →
                  </button>
                </div>
              </div>
            )}

            {activeSearchSection === "who" && (
              <div className="absolute right-0 top-full z-50 mt-3 w-full sm:w-[380px] rounded-3xl border border-border bg-background p-5 shadow-2xl space-y-4 animate-in fade-in slide-in-from-top-2">
                <div className="flex items-center justify-between pb-3 border-b border-border">
                  <div>
                    <p className="text-sm font-bold text-foreground">Adults</p>
                    <p className="text-xs text-muted-foreground">Ages 13 or above</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      disabled={adults <= 1}
                      onClick={() => setAdults(Math.max(1, adults - 1))}
                      className="h-8 w-8 rounded-full border border-border flex items-center justify-center disabled:opacity-30 hover:border-foreground"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="text-sm font-bold w-4 text-center">{adults}</span>
                    <button
                      type="button"
                      onClick={() => setAdults(adults + 1)}
                      className="h-8 w-8 rounded-full border border-border flex items-center justify-center hover:border-foreground"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between pb-3 border-b border-border">
                  <div>
                    <p className="text-sm font-bold text-foreground">Children</p>
                    <p className="text-xs text-muted-foreground">Ages 2–12</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      disabled={children <= 0}
                      onClick={() => setChildren(Math.max(0, children - 1))}
                      className="h-8 w-8 rounded-full border border-border flex items-center justify-center disabled:opacity-30 hover:border-foreground"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="text-sm font-bold w-4 text-center">{children}</span>
                    <button
                      type="button"
                      onClick={() => setChildren(children + 1)}
                      className="h-8 w-8 rounded-full border border-border flex items-center justify-center hover:border-foreground"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleSearchSubmit}
                  className="btn-brand btn-brand-lg w-full"
                >
                  Apply & Search ({totalGuests} guests)
                </button>
              </div>
            )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
