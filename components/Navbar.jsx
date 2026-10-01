"use client";

import { useEffect, useState } from "react";
import { Menu, X, MessageCircle, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import siteConfig, { whatsappLink } from "@/lib/siteConfig";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [announce, setAnnounce] = useState(true);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const go = (href) => {
    setOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled || open ? "glass border-b border-border/60" : "bg-transparent"
      }`}
    >
      {/* Announcement bar */}
      {announce && (
        <div className="relative z-[60] bg-gradient-to-r from-primary via-red-600 to-primary">
          <div className="container flex h-9 items-center justify-center gap-2 pr-8 text-center text-[11px] font-medium text-primary-foreground sm:text-sm">
            <Sparkles className="h-3.5 w-3.5 shrink-0" />
            <span>Now enrolling — book your first driving lesson today!</span>
            <a
              href={whatsappLink()}
              target="_blank"
              rel="noreferrer"
              className="hidden font-semibold underline underline-offset-2 sm:inline"
            >
              Message us
            </a>
            <button
              onClick={() => setAnnounce(false)}
              aria-label="Dismiss announcement"
              className="absolute right-3 top-1/2 -translate-y-1/2 opacity-80 transition-opacity hover:opacity-100"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      <nav className="container relative z-[60] flex h-16 items-center justify-between lg:h-20">
        <button onClick={() => go("#home")} className="flex items-center gap-2">
          <img
            src="/images/logo-square.jpg"
            alt="SS Training School logo"
            className="h-10 w-10 rounded-lg object-cover ring-1 ring-border"
          />
          <span className="font-display text-lg font-bold tracking-tight">
            {siteConfig.shortName}
          </span>
        </button>

        <div className="hidden items-center gap-1 lg:flex">
          {siteConfig.nav.map((item) => (
            <button
              key={item.href}
              onClick={() => go(item.href)}
              className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="hidden items-center gap-3 lg:flex">
          <a href={whatsappLink()} target="_blank" rel="noreferrer">
            <Button variant="outline" className="gap-2 border-border bg-transparent">
              <MessageCircle className="h-4 w-4" /> WhatsApp
            </Button>
          </a>
          <Button onClick={() => go("#contact")} className="bg-primary hover:bg-primary/90">
            Book Now
          </Button>
        </div>

        <button
          onClick={() => setOpen((v) => !v)}
          className="grid h-10 w-10 place-items-center rounded-md border border-border lg:hidden"
          aria-label="Toggle menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {/* Backdrop blur overlay behind the mobile menu */}
      <div
        onClick={() => setOpen(false)}
        aria-hidden="true"
        className={`lg:hidden fixed inset-0 z-30 bg-background/40 backdrop-blur-md transition-opacity duration-300 ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      {/* Mobile menu */}
      <div
        className={`lg:hidden absolute left-0 right-0 top-full z-40 origin-top overflow-hidden border-b border-border/60 bg-background shadow-xl shadow-black/40 backdrop-blur transition-all duration-300 ${
          open ? "max-h-[90vh] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="container flex flex-col gap-1 py-4">
          {siteConfig.nav.map((item) => (
            <button
              key={item.href}
              onClick={() => go(item.href)}
              className="rounded-lg px-4 py-3 text-left text-base font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              {item.label}
            </button>
          ))}
          <div className="mt-2 flex flex-col gap-2">
            <a href={whatsappLink()} target="_blank" rel="noreferrer">
              <Button variant="outline" className="w-full gap-2 border-border bg-transparent">
                <MessageCircle className="h-4 w-4" /> WhatsApp
              </Button>
            </a>
            <Button onClick={() => go("#contact")} className="w-full bg-primary hover:bg-primary/90">
              Book Your Training
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
