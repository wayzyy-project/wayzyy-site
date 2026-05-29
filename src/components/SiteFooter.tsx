export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="container flex flex-col gap-8 py-12 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center">
            <img src="/logo.svg" alt="Wayzyy" className="h-10 w-auto" />
          </div>
          <p className="mt-3 max-w-sm text-sm text-muted-foreground">
            Stays without the small print. Coming soon.
          </p>
        </div>
        <div className="flex flex-col gap-2 text-sm text-muted-foreground sm:flex-row sm:items-center sm:gap-8">
          <a className="hover:text-foreground" href="#why">
            Why
          </a>
          <a className="hover:text-foreground" href="#two-sides">
            Two sides
          </a>
          <a className="hover:text-foreground" href="#waitlist">
            Waitlist
          </a>
          <span className="hidden sm:inline text-border">·</span>
          <span>© {new Date().getFullYear()} Wayzyy. Built honest.</span>
        </div>
      </div>
    </footer>
  );
}
