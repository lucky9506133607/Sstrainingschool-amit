import { Phone, Mail, MapPin, MessageCircle } from "lucide-react";
import siteConfig, { whatsappLink } from "@/lib/siteConfig";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-border bg-card/40">
      <div className="container py-14">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2">
              <span className="grid h-9 w-9 place-items-center rounded-lg bg-primary font-display text-sm font-bold text-primary-foreground">
                SS
              </span>
              <span className="font-display text-lg font-bold">{siteConfig.name}</span>
            </div>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
              {siteConfig.description} We turn nervous beginners into confident, road-ready
              drivers with patient, professional instruction.
            </p>
            <a href={whatsappLink()} target="_blank" rel="noreferrer">
              <button className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[#25D366] px-4 py-2 text-sm font-semibold text-black transition-opacity hover:opacity-90">
                <MessageCircle className="h-4 w-4" /> Message us on WhatsApp
              </button>
            </a>
          </div>

          <div>
            <h4 className="font-display text-sm font-bold uppercase tracking-wider">Explore</h4>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              {siteConfig.nav.map((n) => (
                <li key={n.href}>
                  <a href={n.href} className="transition-colors hover:text-foreground">
                    {n.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display text-sm font-bold uppercase tracking-wider">Courses</h4>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              {siteConfig.courses.map((c) => (
                <li key={c.id}>
                  <a href="#courses" className="transition-colors hover:text-foreground">
                    {c.title}
                  </a>
                </li>
              ))}
            </ul>
            <div className="mt-6 space-y-2 text-sm text-muted-foreground">
              <a href={`tel:${siteConfig.phoneRaw}`} className="flex items-center gap-2 hover:text-foreground">
                <Phone className="h-4 w-4 text-primary" /> {siteConfig.phone}
              </a>
              <a href={`mailto:${siteConfig.email}`} className="flex items-center gap-2 hover:text-foreground">
                <Mail className="h-4 w-4 text-primary" /> {siteConfig.email}
              </a>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" /> {siteConfig.address}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row">
          <p>© {year} {siteConfig.name}. All rights reserved.</p>
          <p>Drive safe. Drive confident.</p>
        </div>
      </div>
    </footer>
  );
}
