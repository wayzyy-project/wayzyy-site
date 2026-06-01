import mixpanel from "mixpanel-browser";

const TOKEN = "e17e1efcd41481c832fd76b2568f6548";

mixpanel.init(TOKEN, {
  track_pageview: false, // we fire manually so we can add properties
  persistence: "localStorage",
  ignore_dnt: false,
});

export const mp = {
  /** Fire once on app load */
  pageView() {
    mixpanel.track("Page Viewed", {
      url: window.location.href,
      referrer: document.referrer || "direct",
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
