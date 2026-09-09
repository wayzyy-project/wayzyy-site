import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  Luggage, 
  MapPin, 
  Calendar, 
  Users, 
  Phone, 
  Mail, 
  Compass, 
  ExternalLink, 
  CheckCircle2, 
  AlertTriangle,
  ArrowRight,
  ShieldCheck
} from "lucide-react";
import { SEO } from "@/components/SEO";
import { AirbnbHeader } from "@/components/marketplace/AirbnbHeader";
import { useToast } from "@/hooks/use-toast";

interface TripRecord {
  id: string;
  propertyId: string;
  propertyTitle: string;
  propertyImage: string;
  propertyCity: string;
  propertyArea: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  guestCount: number;
  guestName: string;
  guestPhone: string;
  guestEmail: string;
  totalAmount: number;
  status: string;
  bookedAt: string;
}

export default function MyTrips() {
  const { toast } = useToast();
  const [trips, setTrips] = useState<TripRecord[]>([]);

  useEffect(() => {
    // Load from local storage
    const saved = localStorage.getItem("wayzyy_trips");
    if (saved) {
      try {
        setTrips(JSON.parse(saved));
      } catch (e) {
        console.error("Error reading trips:", e);
      }
    } else {
      // Default sample trip if fresh visit
      const sample: TripRecord[] = [
        {
          id: "WY-874291",
          propertyId: "villa-in-assagao-goa",
          propertyTitle: "Heritage Portuguese Villa with Private Pool in Assagao",
          propertyImage: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1400&q=80",
          propertyCity: "Assagao",
          propertyArea: "North Goa",
          checkIn: "2026-09-18",
          checkOut: "2026-09-20",
          nights: 2,
          guestCount: 2,
          guestName: "Akshay Sharma",
          guestPhone: "+91 98765 43210",
          guestEmail: "akshay@example.com",
          totalAmount: 7400,
          status: "Confirmed",
          bookedAt: new Date().toISOString()
        }
      ];
      setTrips(sample);
      localStorage.setItem("wayzyy_trips", JSON.stringify(sample));
    }
  }, []);

  const handleCancelTrip = (tripId: string) => {
    const updated = trips.map((t) =>
      t.id === tripId ? { ...t, status: "Cancelled" } : t
    );
    setTrips(updated);
    localStorage.setItem("wayzyy_trips", JSON.stringify(updated));
    toast({
      title: "Reservation cancelled",
      description: `Trip #${tripId} has been successfully cancelled under the 100% refund policy.`
    });
  };

  return (
    <SEO
      title="My Trips & Bookings - Wayzyy"
      description="View your upcoming reservations, host check-in details, and stay receipts."
    >
      <div className="min-h-screen bg-background text-foreground flex flex-col">
        <AirbnbHeader compact />

        <main className="flex-1 mx-auto max-w-5xl w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          <div className="space-y-1">
            <h1 className="text-3xl font-extrabold font-display tracking-tight text-foreground">
              Trips & Bookings
            </h1>
            <p className="text-xs text-muted-foreground">
              Manage your upcoming reservations, check-in instructions, and contact your hosts.
            </p>
          </div>

          {trips.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-border p-12 text-center space-y-4">
              <div className="mx-auto h-16 w-16 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
                <Luggage className="h-8 w-8 text-[#FF6B00]" />
              </div>
              <h3 className="text-lg font-bold text-foreground">No trips booked yet</h3>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                Time to start planning your next getaway in Goa.
              </p>
              <Link
                to="/stays"
                className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-[#FF6B00] to-[#E05300] text-white px-6 py-3 text-xs font-bold shadow-md shadow-[#FF6B00]/25 hover:scale-105 transition-all"
              >
                <span>Start searching stays</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {trips.map((trip) => (
                <div
                  key={trip.id}
                  className="rounded-3xl border border-border bg-card p-6 shadow-sm space-y-6"
                >
                  <div className="flex flex-col md:flex-row gap-6">
                    {/* Image */}
                    <img
                      src={trip.propertyImage}
                      alt={trip.propertyTitle}
                      className="h-48 md:h-44 md:w-56 rounded-3xl object-cover"
                    />

                    {/* Trip Info */}
                    <div className="flex-1 space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold ${
                            trip.status === "Confirmed" 
                              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" 
                              : "bg-red-500/10 text-red-600"
                          }`}>
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            {trip.status}
                          </span>
                          <h3 className="text-lg font-bold font-display text-foreground mt-1.5">
                            {trip.propertyTitle}
                          </h3>
                          <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                            <MapPin className="h-3.5 w-3.5 text-[#FF6B00]" />
                            {trip.propertyArea}, {trip.propertyCity}
                          </p>
                        </div>

                        <div className="text-right">
                          <p className="text-sm font-black text-foreground">₹{trip.totalAmount.toLocaleString("en-IN")}</p>
                          <p className="text-[10px] text-muted-foreground">Booking ID: {trip.id}</p>
                        </div>
                      </div>

                      {/* Dates & Guests */}
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 border-t border-border text-xs">
                        <div>
                          <p className="text-[10px] font-bold uppercase text-muted-foreground">Check-in</p>
                          <p className="font-semibold text-foreground">{trip.checkIn}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold uppercase text-muted-foreground">Checkout</p>
                          <p className="font-semibold text-foreground">{trip.checkOut}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold uppercase text-muted-foreground">Guests</p>
                          <p className="font-semibold text-foreground">{trip.guestCount} {trip.guestCount > 1 ? "Guests" : "Guest"}</p>
                        </div>
                      </div>

                      {/* Action Bar */}
                      <div className="flex flex-wrap items-center gap-3 pt-3">
                        <Link
                          to={`/property/${trip.propertyId}`}
                          className="rounded-2xl bg-foreground text-background px-4 py-2.5 text-xs font-bold hover:opacity-90 transition-opacity"
                        >
                          View Listing Details
                        </Link>
                        <a
                          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${trip.propertyArea}, ${trip.propertyCity}`)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="rounded-2xl border border-border px-4 py-2.5 text-xs font-semibold hover:bg-muted transition-colors flex items-center gap-1.5"
                        >
                          <Compass className="h-3.5 w-3.5 text-[#FF6B00]" />
                          <span>Get Directions</span>
                        </a>

                        {trip.status === "Confirmed" && (
                          <button
                            onClick={() => handleCancelTrip(trip.id)}
                            className="rounded-2xl border border-red-500/30 text-red-600 hover:bg-red-500/10 px-4 py-2.5 text-xs font-semibold transition-colors ml-auto"
                          >
                            Cancel Stay
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </SEO>
  );
}
