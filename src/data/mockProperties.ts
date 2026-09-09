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
  host: {
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
  },
  {
    id: "apartment-vagator-goa",
    slug: "apartment-vagator-goa",
    title: "Boho Chic Garden Suite near Vagator Beach & Hilltop",
    description: "Soak in the vibrant Vagator vibe with our earthy olive-toned sanctuary. Features high arches, rattan loungers, private pool view terrace, and 5 minutes drive to Ozran and Vagator beaches.",
    category: "apartments",
    propertyType: "Apartment in Vagator, Goa",
    city: "Vagator",
    area: "North Goa",
    state: "Goa",
    country: "India",
    lat: 15.5997,
    lng: 73.7432,
    images: [
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80"
    ],
    pricePerNight: 3950,
    originalPrice: 7900,
    currency: "₹",
    rating: 4.95,
    reviewCount: 24,
    isGuestFavourite: true,
    maxGuests: 4,
    bedrooms: 1,
    beds: 2,
    bathrooms: 1,
    amenities: [
      "Shared resort pool",
      "High speed WiFi (100 Mbps)",
      "Dedicated workstation",
      "Kitchenette with induction & toaster",
      "Air conditioning",
      "Balcony overlooking pool",
      "Power backup"
    ],
    host: {
      name: "Alok & Rhea",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
      isSuperhost: true,
      joinedDate: "Joined in 2023",
      responseRate: "100%",
      responseTime: "within an hour"
    },
    highlights: [
      {
        icon: "trophy",
        title: "Guest favourite",
        description: "Highly rated homestay in North Goa."
      }
    ],
    ratingsBreakdown: {
      cleanliness: 4.9,
      accuracy: 5.0,
      communication: 5.0,
      location: 4.9,
      checkIn: 5.0,
      value: 4.9
    },
    reviews: [
      {
        id: "rev-vagator-1",
        authorName: "Ananya Roy",
        authorAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80",
        rating: 5,
        date: "July 2026",
        content: "Such a vibe! Loved the green earthy decor and morning coffee on the balcony."
      }
    ],
    houseRules: {
      checkIn: "1:00 PM",
      checkOut: "11:00 AM",
      selfCheckIn: "Smart Lock",
      smoking: false,
      pets: false,
      parties: false
    },
    cancellationPolicy: "Free cancellation before 48 hours of check-in.",
    instantBook: true,
    featuredSection: "north_goa"
  },
  {
    id: "villa-in-arpora-goa",
    slug: "villa-in-arpora-goa",
    title: "Sunset Palms Villa with Private Waterfall Pool",
    description: "Designed for relaxation and private celebration, this Arpora villa features a sunken waterfall pool, private bar counter, outdoor cabanas, and minutes to Baga and Anjuna night markets.",
    category: "pools",
    propertyType: "Home in Arpora, Goa",
    city: "Arpora",
    area: "North Goa",
    state: "Goa",
    country: "India",
    lat: 15.5684,
    lng: 73.7621,
    images: [
      "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80"
    ],
    pricePerNight: 7500,
    originalPrice: 15000,
    currency: "₹",
    rating: 4.96,
    reviewCount: 42,
    isGuestFavourite: true,
    isTopTenPercent: true,
    maxGuests: 10,
    bedrooms: 4,
    beds: 5,
    bathrooms: 4,
    amenities: [
      "Private waterfall pool",
      "Outdoor bar & sound setup",
      "Daily housekeeping",
      "High speed WiFi",
      "Chef service optional",
      "Secure parking for 3 cars",
      "Full generator power backup"
    ],
    host: {
      name: "Farhan Quadri",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
      isSuperhost: true,
      joinedDate: "Joined in 2021",
      responseRate: "100%",
      responseTime: "within a few mins"
    },
    highlights: [
      {
        icon: "trophy",
        title: "Top 10% of homes",
        description: "Exceptional pool experience and verified host."
      }
    ],
    ratingsBreakdown: {
      cleanliness: 5.0,
      accuracy: 4.9,
      communication: 5.0,
      location: 4.9,
      checkIn: 5.0,
      value: 4.9
    },
    reviews: [
      {
        id: "rev-arpora-1",
        authorName: "Vikram Malhotra",
        authorAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80",
        rating: 5,
        date: "August 2026",
        content: "The pool waterfall is breathtaking at night with the ambient lights. Farhan and his team took great care of us."
      }
    ],
    houseRules: {
      checkIn: "2:00 PM",
      checkOut: "11:00 AM",
      selfCheckIn: "Staff greeting",
      smoking: true,
      pets: false,
      parties: true
    },
    cancellationPolicy: "Moderate cancellation policy.",
    instantBook: true,
    featuredSection: "north_goa"
  },
  {
    id: "villa-in-ribandar-goa",
    slug: "villa-in-ribandar-goa",
    title: "Mandovi Riverside Heritage Villa with Infinity Deck",
    description: "Perched right over the calm waters of the Mandovi River in Ribandar, watch traditional ferries glide by while enjoying morning tea on your private wooden sundeck.",
    category: "beachfront",
    propertyType: "Villa in Ribandar, Goa",
    city: "Ribandar",
    area: "Central Goa",
    state: "Goa",
    country: "India",
    lat: 15.5034,
    lng: 73.8614,
    images: [
      "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80"
    ],
    pricePerNight: 6200,
    originalPrice: 12400,
    currency: "₹",
    rating: 4.97,
    reviewCount: 31,
    isGuestFavourite: true,
    maxGuests: 6,
    bedrooms: 3,
    beds: 3,
    bathrooms: 3,
    amenities: [
      "Riverside timber deck",
      "Kayak available",
      "Sunset view",
      "Modern kitchen",
      "High speed WiFi",
      "Air conditioning",
      "Dedicated parking"
    ],
    host: {
      name: "Dr. Noel Fernandes",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80",
      isSuperhost: true,
      joinedDate: "Joined in 2021",
      responseRate: "100%",
      responseTime: "within an hour"
    },
    highlights: [
      {
        icon: "trophy",
        title: "Guest favourite",
        description: "One of the most unique water-view villas in Goa."
      }
    ],
    ratingsBreakdown: {
      cleanliness: 5.0,
      accuracy: 5.0,
      communication: 5.0,
      location: 5.0,
      checkIn: 5.0,
      value: 4.9
    },
    reviews: [
      {
        id: "rev-ribandar-1",
        authorName: "Tanvi Saxena",
        authorAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
        rating: 5,
        date: "July 2026",
        content: "Sitting on the deck with the water rippling right beneath is magical. Close to both Panjim and Old Goa."
      }
    ],
    houseRules: {
      checkIn: "2:00 PM",
      checkOut: "11:00 AM",
      selfCheckIn: "Staff greeting",
      smoking: false,
      pets: false,
      parties: false
    },
    cancellationPolicy: "Free cancellation before 7 days.",
    instantBook: true,
    featuredSection: "trending"
  },
  {
    id: "apartment-candolim-goa",
    slug: "apartment-candolim-goa",
    title: "Luxury Beachside Suite with Rooftop Infinity Pool",
    description: "Located just 250 meters from Candolim Beach, enjoy panoramic ocean views, contemporary chic interiors, rooftop sunset lounge, and direct elevator access.",
    category: "apartments",
    propertyType: "Apartment in Candolim, Goa",
    city: "Candolim",
    area: "North Goa",
    state: "Goa",
    country: "India",
    lat: 15.5186,
    lng: 73.7667,
    images: [
      "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80"
    ],
    pricePerNight: 4200,
    originalPrice: 8400,
    currency: "₹",
    rating: 4.92,
    reviewCount: 19,
    isGuestFavourite: true,
    maxGuests: 4,
    bedrooms: 2,
    beds: 2,
    bathrooms: 2,
    amenities: [
      "Rooftop ocean view pool",
      "2-min walk to beach",
      "Superfast WiFi",
      "Full kitchen & microwave",
      "Smart TV",
      "Daily cleaning service",
      "24/7 Gated security"
    ],
    host: {
      name: "Natasha K.",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
      isSuperhost: true,
      joinedDate: "Joined in 2024",
      responseRate: "100%",
      responseTime: "within 30 mins"
    },
    highlights: [
      {
        icon: "trophy",
        title: "Guest favourite",
        description: "Prime beachside location in Candolim."
      }
    ],
    ratingsBreakdown: {
      cleanliness: 4.9,
      accuracy: 5.0,
      communication: 5.0,
      location: 5.0,
      checkIn: 4.9,
      value: 4.9
    },
    reviews: [
      {
        id: "rev-candolim-1",
        authorName: "Rahul Sen",
        authorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
        rating: 5,
        date: "August 2026",
        content: "Walking to Candolim beach in 3 minutes was the highlight! The rooftop pool has an insane sunset view."
      }
    ],
    houseRules: {
      checkIn: "2:00 PM",
      checkOut: "11:00 AM",
      selfCheckIn: "Digital key / building staff",
      smoking: false,
      pets: false,
      parties: false
    },
    cancellationPolicy: "Free cancellation up to 48 hours before check-in.",
    instantBook: true,
    featuredSection: "north_goa"
  }
];
