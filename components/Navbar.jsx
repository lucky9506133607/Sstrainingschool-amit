"use client";

import { useEffect, useState } from "react";
import { Menu, X, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import siteConfig, { whatsappLink } from "@/lib/siteConfig";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

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
        scrolled ? "glass border-b border-border/60" : "bg-transparent"
      }`}
    >
      <nav className="container flex h-16 items-center justify-between md:h-20">
        <button onClick={() => go("#home")} className="flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-primary font-display text-sm font-bold text-primary-foreground">
            SS
          </span>
          <span className="font-display text-lg font-bold tracking-tight">
            {siteConfig.shortName}
          </span>
        </button>

        <div className="hidden items-center gap-1 md:flex">
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

        <div className="hidden items-center gap-3 md:flex">
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
          className="grid h-10 w-10 place-items-center rounded-md border border-border md:hidden"
          aria-label="Toggle menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {/* Mobile menu */}
      <div
        className={`md:hidden fixed inset-x-0 top-16 z-40 origin-top overflow-hidden border-b border-border/60 bg-background/98 backdrop-blur transition-all duration-300 ${
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
