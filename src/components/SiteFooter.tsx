import { Link } from "react-router-dom";
import { Instagram, Linkedin, Twitter } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="px-6 pt-8 pb-6 sm:px-10 sm:pt-14 sm:pb-10">
      <div className="liquid-glass container rounded-3xl border border-white/10 py-12">
        {/* Top row */}
        <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="flex items-center">
              <img src="/favicon.svg" alt="Wayzyy" className="h-11 w-11 rounded-full object-cover" />
            </div>
            <p className="mt-3 max-w-xs text-sm text-muted-foreground">
              cozy stays, crazy nights and fair hosting . That's wayzyy
            </p>
            <a
              href="mailto:hello@wayzyy.com"
              className="mt-1 block text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              hello@wayzyy.com
            </a>
          </div>

          {/* Links */}
          <div className="flex flex-col gap-6 sm:flex-row sm:gap-12 text-sm">
            {/* Nav */}
            <div className="flex flex-col gap-2">
              <p className="text-xs uppercase tracking-widest text-muted-foreground/60 mb-1">Navigate</p>
              <a className="text-muted-foreground hover:text-foreground transition-colors" href="#why">Why Wayzyy</a>
              <a className="text-muted-foreground hover:text-foreground transition-colors" href="#two-sides">For Hosts & Guests</a>
              <Link className="text-muted-foreground hover:text-foreground transition-colors" to="/waitlist">Join Waitlist</Link>
              <Link className="text-muted-foreground hover:text-foreground transition-colors" to="/host">List your property</Link>
            </div>

            {/* Legal */}
            <div className="flex flex-col gap-2">
              <p className="text-xs uppercase tracking-widest text-muted-foreground/60 mb-1">Legal</p>
              <Link className="text-muted-foreground hover:text-foreground transition-colors" to="/policies">Policies</Link>
              <Link className="text-muted-foreground hover:text-foreground transition-colors" to="/privacy">Privacy Policy</Link>
            </div>

            {/* Socials */}
            <div className="flex flex-col gap-2">
              <p className="text-xs uppercase tracking-widest text-muted-foreground/60 mb-1">Follow Us</p>
              <a
                href="https://www.instagram.com/staywayzyy/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <Instagram className="h-4 w-4 text-ember" /> Instagram
              </a>
              <a
                href="https://www.linkedin.com/company/wayzyy/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <Linkedin className="h-4 w-4 text-ember" /> LinkedIn
              </a>
              <a
                href="https://x.com/wayzyycom"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <Twitter className="h-4 w-4 text-ember" /> X (Twitter)
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 flex flex-col gap-2 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between text-xs text-muted-foreground">
          <span>© {new Date().getFullYear()} Wayzyy Technologies Private Limited. Built honest.</span>
          <div className="flex items-center gap-4">
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

