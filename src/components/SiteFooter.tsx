import { Link } from "react-router-dom";

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="container py-12">
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
              <a className="text-muted-foreground hover:text-foreground transition-colors" href="#waitlist">Join Waitlist</a>
              <Link className="text-muted-foreground hover:text-foreground transition-colors" to="/host">List your property</Link>
            </div>

            {/* Legal */}
            <div className="flex flex-col gap-2">
              <p className="text-xs uppercase tracking-widest text-muted-foreground/60 mb-1">Legal</p>
              <Link className="text-muted-foreground hover:text-foreground transition-colors" to="/policies">Policies</Link>
              <Link className="text-muted-foreground hover:text-foreground transition-colors" to="/privacy">Privacy Policy</Link>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 flex flex-col gap-2 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between text-xs text-muted-foreground">
          <span>© {new Date().getFullYear()} Wayzyy Technologies Private Limited. Built honest.</span>
        </div>
      </div>
    </footer>
  );
}
