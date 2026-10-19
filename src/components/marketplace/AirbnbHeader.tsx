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
import { format, addDays } from "date-fns";

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
        <div className={`flex ${compact ? "h-16" : "h-20"} items-center justify-between gap-4`}>
          {/* Official WAYZYY Logo */}
          <Link to="/" className="flex items-center gap-2.5 group shrink-0">
            <img 
              src="/logo.svg" 
              alt="Wayzyy" 
              className="h-10 w-10 rounded-full object-cover shadow-sm group-hover:scale-105 transition-transform" 
            />
            <div className="flex flex-col">
              <span style={{ fontFamily: '"Raleway", sans-serif' }} className="text-2xl font-black tracking-tight text-foreground group-hover:text-[#FF6B00] transition-colors">
                Wayzyy
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#FF6B00] -mt-1">
                Zero Guest Fee
              </span>
            </div>
          </Link>

          {/* Site links - same destinations as the main navbar, so the
              stays homepage still reaches About, Why, Blog and hosting. */}
          <nav className="hidden lg:flex items-center gap-7 text-sm font-semibold text-muted-foreground">
            <Link to="/" className="text-foreground font-bold">Stays</Link>
            <Link to="/about" className="hover:text-foreground transition-colors">About</Link>
            <a href="/about#why" className="hover:text-foreground transition-colors">Why Wayzyy</a>
            <Link to="/earnings-calculator" className="hover:text-foreground transition-colors">Earn more</Link>
            <Link to="/blog" className="hover:text-foreground transition-colors">Blog</Link>
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
            <div className="w-full max-w-2xl flex items-center rounded-full border border-border/80 bg-background shadow-md hover:shadow-lg transition-all hover:border-[#FF6B00]/30 overflow-hidden">
              {/* WHERE zone */}
              <button
                type="button"
                onClick={() => { setIsSearchExpanded(true); setActiveSearchSection("where"); }}
                className="flex-1 text-left px-3 py-2.5 sm:px-5 sm:py-3 hover:bg-muted/50 transition-colors group min-w-0"
              >
                <p className="text-[11px] sm:text-xs font-bold text-foreground group-hover:text-[#FF6B00] transition-colors truncate">
                  {destination ? destination : "Travel destination"}
                </p>
                <p className="text-[10px] sm:text-[11px] text-muted-foreground truncate">
                  {destination ? "Filtered" : "Where in Goa?"}
                </p>
              </button>

              {/* Divider */}
              <div className="w-px h-7 bg-border/70 shrink-0" />

              {/* WHEN zone */}
              <button
                type="button"
                onClick={() => { setIsSearchExpanded(true); setActiveSearchSection("when"); }}
                className="flex-1 text-left px-3 py-2.5 sm:px-5 sm:py-3 hover:bg-muted/50 transition-colors group min-w-0"
              >
                <p className="text-[11px] sm:text-xs font-bold text-foreground group-hover:text-[#FF6B00] transition-colors truncate">
                  {checkIn && checkOut
                    ? `${format(checkIn, "MMM d")} – ${format(checkOut, "MMM d")}`
                    : "What dates?"}
                </p>
                <p className="text-[10px] sm:text-[11px] text-muted-foreground truncate">
                  {checkIn ? "Dates set" : "Check-in and check-out"}
                </p>
              </button>

              {/* Divider */}
              <div className="w-px h-7 bg-border/70 shrink-0" />

              {/* WHO zone */}
              <button
                type="button"
                onClick={() => { setIsSearchExpanded(true); setActiveSearchSection("who"); }}
                className="flex-1 text-left px-3 py-2.5 sm:px-5 sm:py-3 hover:bg-muted/50 transition-colors group min-w-0"
              >
                <p className="text-[11px] sm:text-xs font-bold text-foreground group-hover:text-[#FF6B00] transition-colors truncate">
                  {totalGuests > 1 ? `${totalGuests} guests` : "Who's along?"}
                </p>
                <p className="text-[10px] sm:text-[11px] text-muted-foreground truncate">
                  {totalGuests > 1 ? `${adults}A, ${children}C` : "Add travellers"}
                </p>
              </button>

              {/* Search button */}
              <div className="pr-1.5 pl-1 sm:pr-2">
                <button
                  type="button"
                  onClick={() => { setIsSearchExpanded(true); setActiveSearchSection("where"); }}
                  className="h-8 w-8 sm:h-9 sm:w-9 rounded-full bg-gradient-to-r from-[#FF6B00] to-[#E05300] flex items-center justify-center text-white shrink-0 shadow-md shadow-[#FF6B00]/25 hover:scale-105 transition-transform"
                >
                  <Search className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Expanded Search Bar */}
        {!compact && isSearchExpanded && (
          <div ref={searchContainerRef} className="pb-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="mx-auto max-w-3xl rounded-full border border-border/90 bg-muted/30 p-1.5 shadow-2xl relative flex items-center divide-x divide-border">
              {/* WHERE Section */}
              <div
                onClick={() => setActiveSearchSection("where")}
                className={`flex-1 rounded-full px-5 py-3 cursor-pointer transition-colors ${
                  activeSearchSection === "where" ? "bg-background shadow-md ring-1 ring-border" : "hover:bg-muted/50"
                }`}
              >
                <label className="block text-[11px] font-bold uppercase tracking-wider text-foreground">Travel destination</label>
                <input
                  type="text"
                  placeholder="Search destinations (e.g. Assagao, North Goa)"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  onFocus={() => setActiveSearchSection("where")}
                  className="w-full bg-transparent text-sm font-medium text-foreground placeholder:text-muted-foreground outline-none"
                />
              </div>

              {/* WHEN Section */}
              <div
                onClick={() => setActiveSearchSection("when")}
                className={`flex-1 rounded-full px-5 py-3 cursor-pointer transition-colors ${
                  activeSearchSection === "when" ? "bg-background shadow-md ring-1 ring-border" : "hover:bg-muted/50"
                }`}
              >
                <label className="block text-[11px] font-bold uppercase tracking-wider text-foreground">What dates?</label>
                <p className="text-sm font-medium text-foreground truncate">
                  {checkIn && checkOut 
                    ? `${format(checkIn, "MMM d")} – ${format(checkOut, "MMM d")}`
                    : "Check-in and check-out"}
                </p>
              </div>

              {/* WHO Section */}
              <div
                onClick={() => setActiveSearchSection("who")}
                className={`flex-1 rounded-full px-5 py-3 cursor-pointer transition-colors flex items-center justify-between ${
                  activeSearchSection === "who" ? "bg-background shadow-md ring-1 ring-border" : "hover:bg-muted/50"
                }`}
              >
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-foreground">Who's along?</label>
                  <p className="text-sm font-medium text-foreground">
                    {totalGuests > 1 ? `${totalGuests} guests` : "Add travellers"}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSearchSubmit();
                  }}
                  className="h-11 px-5 rounded-full bg-gradient-to-r from-[#FF6B00] via-[#FF781A] to-[#E05300] text-white font-bold text-sm flex items-center gap-2 shadow-lg shadow-[#FF6B00]/30 hover:scale-105 active:scale-95 transition-all"
                >
                  <Search className="h-4 w-4" />
                  <span>Search</span>
                </button>
              </div>
            </div>

            {/* Dropdown Panels based on Active Section */}
            {activeSearchSection === "where" && (
              <div className="mx-auto max-w-md mt-3 rounded-2xl border border-border bg-background p-4 shadow-2xl animate-in fade-in slide-in-from-top-2">
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">Popular Stays & Regions</p>
                <div className="space-y-1.5">
                  {quickDestinations.map((dest) => (
                    <button
                      key={dest.name}
                      onClick={() => {
                        setDestination(dest.name.split(",")[0]);
                        setActiveSearchSection("when");
                      }}
                      className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-muted transition-colors text-left"
                    >
                      <div className="h-9 w-9 rounded-xl bg-[#FF6B00]/10 flex items-center justify-center text-[#FF6B00] shrink-0">
                        <MapPin className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-foreground">{dest.name}</p>
                        <p className="text-xs text-muted-foreground">{dest.subtitle}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {activeSearchSection === "when" && (
              <div className="mx-auto max-w-lg mt-3 rounded-2xl border border-border bg-background p-5 shadow-2xl text-center animate-in fade-in slide-in-from-top-2">
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">Quick Date Presets</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
                  <button
                    onClick={() => {
                      setCheckIn(new Date());
                      setCheckOut(addDays(new Date(), 2));
                      setActiveSearchSection("who");
                    }}
                    className="p-3 rounded-2xl border border-border hover:border-[#FF6B00] hover:bg-[#FF6B00]/5 text-xs font-semibold"
                  >
                    This Weekend (2 nights)
                  </button>
                  <button
                    onClick={() => {
                      setCheckIn(addDays(new Date(), 7));
                      setCheckOut(addDays(new Date(), 10));
                      setActiveSearchSection("who");
                    }}
                    className="p-3 rounded-2xl border border-border hover:border-[#FF6B00] hover:bg-[#FF6B00]/5 text-xs font-semibold"
                  >
                    Next Week (3 nights)
                  </button>
                  <button
                    onClick={() => {
                      setCheckIn(addDays(new Date(), 14));
                      setCheckOut(addDays(new Date(), 21));
                      setActiveSearchSection("who");
                    }}
                    className="p-3 rounded-2xl border border-border hover:border-[#FF6B00] hover:bg-[#FF6B00]/5 text-xs font-semibold"
                  >
                    1 Week Stay
                  </button>
                  <button
                    onClick={() => {
                      setCheckIn(addDays(new Date(), 30));
                      setCheckOut(addDays(new Date(), 60));
                      setActiveSearchSection("who");
                    }}
                    className="p-3 rounded-2xl border border-border hover:border-[#FF6B00] hover:bg-[#FF6B00]/5 text-xs font-semibold"
                  >
                    Next Month
                  </button>
                </div>
                <button
                  onClick={() => setActiveSearchSection("who")}
                  className="text-xs text-[#FF6B00] font-bold hover:underline"
                >
                  Continue to Guests →
                </button>
              </div>
            )}

            {activeSearchSection === "who" && (
              <div className="mx-auto max-w-sm mt-3 rounded-2xl border border-border bg-background p-5 shadow-2xl space-y-4 animate-in fade-in slide-in-from-top-2">
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
        )}
      </div>
    </header>
  );
};
