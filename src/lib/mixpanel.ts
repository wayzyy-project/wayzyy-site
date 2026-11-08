import mixpanel from "mixpanel-browser";

const TOKEN = "e17e1efcd41481c832fd76b2568f6548";

mixpanel.init(TOKEN, {
  track_pageview: false, // we fire manually so we can add properties
  persistence: "localStorage",
  ignore_dnt: true,
});

export const mp = {
  /** Track each SPA route without sending contact details. */
  pageView() {
    mixpanel.track("Page Viewed", {
      url: window.location.href,
      referrer: document.referrer || "direct",
    });
  },

  listingViewed(listing: { id: string; city?: string; category?: string }) {
    mixpanel.track("Listing Viewed", {
      listing_id: listing.id,
      city: listing.city ?? "",
      category: listing.category ?? "",
    });
  },

  bookingStarted(listing: { id: string; city?: string; category?: string }) {
    mixpanel.track("Booking Started", {
      listing_id: listing.id,
      city: listing.city ?? "",
      category: listing.category ?? "",
    });
  },

  enquiryStarted(listing: { id: string; city?: string; category?: string }) {
    mixpanel.track("Enquiry Started", {
      listing_id: listing.id,
      city: listing.city ?? "",
      category: listing.category ?? "",
    });
  },

  enquirySubmitted(listing: { id: string; city?: string; category?: string }) {
    mixpanel.track("Enquiry Submitted", {
      listing_id: listing.id,
      city: listing.city ?? "",
      category: listing.category ?? "",
    });
  },

  /** Waitlist form submitted */
  waitlistSignup(audience: "host" | "traveler", email: string) {
    mixpanel.track("Waitlist Signup", {
      audience,
      email_domain: email.split("@")[1] ?? "",
    });
    // also identify the user by email
    mixpanel.identify(email);
    mixpanel.people.set({
      $email: email,
      audience,
      signup_date: new Date().toISOString(),
    });
  },

  /** Host ↔ Traveler toggle in Two Sides section */
  sideToggled(side: "host" | "traveler") {
    mixpanel.track("Side Toggled", { side });
  },

  /** A section scrolled into view */
  sectionViewed(section: string) {
    mixpanel.track("Section Viewed", { section });
  },

  /** Dark / light theme toggled */
  themeChanged(theme: string) {
    mixpanel.track("Theme Changed", { theme });
  },
};
