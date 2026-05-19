import { Link } from "@tanstack/react-router";
import { Briefcase, Mail, Phone, MapPin } from "lucide-react";

export function SiteFooter() {
  return (
    <footer aria-label="Site footer" className="mt-24 border-t border-border bg-surface">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 lg:grid-cols-4 lg:px-8">
        <div className="lg:col-span-2">
          <Link to="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-hero">
              <Briefcase className="h-5 w-5 text-primary-foreground" strokeWidth={2.5} />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="font-display text-base font-bold">Guruji Job Consultancy</span>
              <span className="text-[11px] font-medium text-accent">Get Job Companion</span>
            </div>
          </Link>
          <p className="mt-5 max-w-md text-sm leading-relaxed text-muted-foreground">
            Building Careers. Creating Opportunities. We connect talented individuals with the right
            jobs and help companies build winning teams.
          </p>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-foreground">Company</h4>
          <nav aria-label="Footer navigation">
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              <li>
                <Link to="/" className="hover:text-primary">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-primary">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-primary">
                  Services
                </Link>
              </li>
              <li>
                <Link to="/industries" className="hover:text-primary">
                  Industries
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-primary">
                  Contact
                </Link>
              </li>
            </ul>
          </nav>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-foreground">Reach Us</h4>
          <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
            <li className="flex flex-col gap-0.2">
              <div className="flex items-start gap-1">
                <Phone className="mt-0.1 h-4 w-4 text-accent" />

                <a href="tel:+919217010815" className="transition-colors hover:text-accent">
                  +91 9217010815
                </a>
              </div>

              <div className="flex items-start gap-1">
                <Phone className="mt-0.5 h-4 w-4 text-accent" />

                <a href="tel:+917428700214" className="transition-colors hover:text-accent">
                  +91 7428700214
                </a>
              </div>
            </li>
            <li className="flex items-start gap-2">
              <Mail className="mt-0.5 h-4 w-4 text-accent" />

              <a
                href="mailto:contactus@gurujijobconsultancy.in"
                className="transition-colors hover:text-accent"
              >
                Contactus@gurujijobconsultancy.in
              </a>
            </li>
            <li className="flex items-start gap-2">
              <MapPin className="mt-0.5 h-4 w-4 text-accent" /> Gurugram, India
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-5 py-5 text-xs text-muted-foreground sm:flex-row lg:px-8">
          <p>© {new Date().getFullYear()} Guruji Job Consultancy. All rights reserved.</p>
          <p className="font-medium text-foreground">Building Careers. Creating Opportunities.</p>
        </div>
      </div>
    </footer>
  );
}
