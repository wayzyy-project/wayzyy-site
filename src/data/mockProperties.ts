export interface Review {
  id: string;
  authorName: string;
  authorAvatar: string;
  rating: number;
  date: string;
  content: string;
  timeOnWayzyy?: string;
}

export interface PropertyListing {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: "homes" | "villas" | "apartments" | "rooms" | "beachfront" | "luxury" | "pools";
  propertyType: string; // e.g. "Entire rental unit", "Villa", "Apartment", "Room"
  city: string;
  area: string;
  state: string;
  country: string;
  lat: number;
  lng: number;
  images: string[];
  pricePerNight: number;
  originalPrice?: number;
  currency: string;
  rating: number;
  reviewCount: number;
  isGuestFavourite: boolean;
  isTopTenPercent?: boolean;
  maxGuests: number;
  bedrooms: number;
  beds: number;
  bathrooms: number;
  amenities: string[];
  // Nights a guest must book at minimum. Undefined/1 on mock listings (no
  // restriction) - real listings carry the host's own setting from
  // properties.min_nights.
  minNights?: number;
  // Set by the admin Wayzyy Verified review (approve-verification).
  wayzyyVerified?: boolean;
  host: {
    // Only set for real (non-mock) listings - lets the detail page look up
    // the host's actual profile and their other live listings.
    id?: string | null;
    // Only set for real listings, only ever used to build a mailto: link -
    // never rendered directly.
    email?: string | null;
    name: string;
    avatar: string;
    isSuperhost: boolean;
    isNewHost?: boolean;
    joinedDate: string;
    responseRate: string;
    responseTime: string;
    coHosts?: string[];
  };
  highlights: {
    icon: string;
    title: string;
    description: string;
  }[];
  ratingsBreakdown: {
    cleanliness: number;
    accuracy: number;
    communication: number;
    location: number;
    checkIn: number;
    value: number;
  };
  reviews: Review[];
  houseRules: {
    checkIn: string;
    checkOut: string;
    selfCheckIn: string;
    smoking: boolean;
    pets: boolean;
    parties: boolean;
  };
  cancellationPolicy: string;
  instantBook: boolean;
  featuredSection?: "north_goa" | "south_goa" | "trending";
}

export const MOCK_PROPERTIES: PropertyListing[] = [
  {
    id: "villa-in-assagao-goa",
    slug: "villa-in-assagao-goa",
    title: "Heritage Portuguese Villa with Private Pool in Assagao",
    description: "Immerse yourself in authentic Goan luxury in this restored 18th-century Portuguese estate surrounded by lush swaying palms, high teakwood ceilings, antique chandeliers, and a sparkling private plunge pool.",
    category: "villas",
    propertyType: "Entire luxury villa in Assagao, Goa",
    city: "Assagao",
    area: "North Goa",
    state: "Goa",
    country: "India",
    lat: 15.5898,
    lng: 73.7749,
    images: [
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=800&q=80"
    ],
    pricePerNight: 8500,
    originalPrice: 17000,
    currency: "₹",
    rating: 4.98,
    reviewCount: 36,
    isGuestFavourite: true,
    isTopTenPercent: true,
    maxGuests: 6,
    bedrooms: 3,
    beds: 3,
    bathrooms: 3,
    amenities: [
      "Private crystal swimming pool",
      "Starlink high speed WiFi",
      "Tropical courtyard & Gazebo",
      "Gourmet kitchen",
      "Housekeeping & butler service",
      "Air conditioning",
      "Washer & dryer",
      "Power backup (100% generator)"
    ],
    host: {
      name: "Maria D'Souza",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80",
      isSuperhost: true,
      joinedDate: "Joined in 2022",
      responseRate: "100%",
      responseTime: "within an hour"
    },
    highlights: [
      {
        icon: "trophy",
        title: "Top 1% of Goa stays",
        description: "Ranked #1 for design & guest delight in Assagao."
      },
      {
        icon: "sparkles",
        title: "Sparkling clean",
        description: "100% of recent guests rated cleanliness 5 stars."
      }
    ],
    ratingsBreakdown: {
      cleanliness: 5.0,
      accuracy: 5.0,
      communication: 5.0,
      location: 5.0,
      checkIn: 4.9,
      value: 4.9
    },
    reviews: [
      {
        id: "rev-assagao-1",
        authorName: "Kabir Mehta",
        authorAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80",
        rating: 5,
        date: "August 2026",
        content: "A dream villa in Assagao! Walking distance to Bawri, Gunpowder, and Jamun. The private pool and lush courtyard made our Goa trip unforgettable."
      }
    ],
    houseRules: {
      checkIn: "2:00 PM",
      checkOut: "11:00 AM",
      selfCheckIn: "Host greeting & key exchange",
      smoking: false,
      pets: true,
      parties: false
    },
    cancellationPolicy: "Strict with 48hr grace period.",
    instantBook: true,
    featuredSection: "north_goa"
  }
];
