import { Link } from "react-router-dom";
import { Instagram, Linkedin, Twitter } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="px-4 pt-6 pb-20 sm:px-10 sm:pt-14 sm:pb-10">
      <div className="liquid-glass container rounded-3xl border border-white/10 p-5 sm:p-12">
        {/* Top row */}
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <img src="/favicon.svg" alt="Wayzyy" className="h-8 w-8 sm:h-11 sm:w-11 rounded-full object-cover" />
              <span className="font-display font-bold text-sm tracking-wide text-foreground sm:hidden">
                WAYZYY
              </span>
            </div>
            <p className="max-w-xs text-xs sm:text-sm text-muted-foreground leading-relaxed">
              cozy stays, crazy nights and fair hosting . That's wayzyy
            </p>
            <a
              href="mailto:hello@wayzyy.com"
              className="inline-block text-xs text-muted-foreground hover:text-foreground transition-colors font-medium"
            >
              hello@wayzyy.com
            </a>
          </div>

          {/* Links - 2-column grid on mobile, flex row on sm+ */}
          <div className="grid grid-cols-2 gap-5 text-xs sm:flex sm:flex-row sm:gap-12 sm:text-sm pt-2 sm:pt-0 border-t border-white/10 sm:border-0">
            {/* Nav */}
            <div className="flex flex-col gap-1.5">
              <p className="text-[10px] sm:text-xs uppercase tracking-widest text-muted-foreground/60 font-semibold mb-0.5">Navigate</p>
              <a className="text-muted-foreground hover:text-foreground transition-colors" href="#why">Why Wayzyy</a>
              <Link className="text-muted-foreground hover:text-foreground transition-colors" to="/onboarding">Founding Hosts Deck</Link>
              <a className="text-muted-foreground hover:text-foreground transition-colors" href="#two-sides">For Hosts & Guests</a>
              <Link className="text-muted-foreground hover:text-foreground transition-colors" to="/waitlist">Join Waitlist</Link>
              <Link className="text-muted-foreground hover:text-foreground transition-colors" to="/host">List your property</Link>
            </div>

            {/* Legal & Socials */}
            <div className="flex flex-col gap-4 sm:flex-row sm:gap-12">
              <div className="flex flex-col gap-1.5">
                <p className="text-[10px] sm:text-xs uppercase tracking-widest text-muted-foreground/60 font-semibold mb-0.5">Legal</p>
                <Link className="text-muted-foreground hover:text-foreground transition-colors" to="/policies">Policies</Link>
                <Link className="text-muted-foreground hover:text-foreground transition-colors" to="/privacy">Privacy Policy</Link>
              </div>

              <div className="flex flex-col gap-1.5">
                <p className="text-[10px] sm:text-xs uppercase tracking-widest text-muted-foreground/60 font-semibold mb-0.5">Follow Us</p>
                <a
                  href="https://www.instagram.com/staywayzyy/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Instagram className="h-3.5 w-3.5 text-ember shrink-0" /> Instagram
                </a>
                <a
                  href="https://www.linkedin.com/company/wayzyy/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Linkedin className="h-3.5 w-3.5 text-ember shrink-0" /> LinkedIn
                </a>
                <a
                  href="https://x.com/wayzyycom"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Twitter className="h-3.5 w-3.5 text-ember shrink-0" /> X (Twitter)
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-6 flex flex-col gap-2 border-t border-border pt-4 sm:mt-10 sm:pt-6 sm:flex-row sm:items-center sm:justify-between text-[11px] sm:text-xs text-muted-foreground">
          <span>© {new Date().getFullYear()} Wayzyy Technologies Private Limited. GSTIN: 09AAECW5169M1ZL. Built honest.</span>
          <div className="flex items-center gap-3">
            <a href="https://www.instagram.com/staywayzyy/" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">Instagram</a>
            <span>·</span>
            <a href="https://www.linkedin.com/company/wayzyy/" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">LinkedIn</a>
            <span>·</span>
            <a href="https://x.com/wayzyycom" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">X (Twitter)</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

