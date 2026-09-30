"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ArrowRight, Play, ShieldCheck, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import siteConfig from "@/lib/siteConfig";

const HERO_IMG =
  "https://images.unsplash.com/photo-1645252657518-34f29e003516?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA0MTJ8MHwxfHNlYXJjaHwxfHxjYXIlMjBuaWdodHxlbnwwfHx8YmxhY2t8MTc5MDc5MDgyMnww&ixlib=rb-4.1.0&q=85";

export default function Hero() {
  const carRef = useRef(null);
  const trackRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const car = carRef.current;
      const track = trackRef.current;
      if (!car || !track) return;
      const drive = () => {
        const width = track.offsetWidth;
        gsap.killTweensOf(car);
        gsap.set(car, { x: -170 });
        gsap.to(car, {
          x: width + 170,
          duration: 7,
          ease: "none",
          repeat: -1,
        });
      };
      drive();
      window.addEventListener("resize", drive);
      return () => window.removeEventListener("resize", drive);
    }, trackRef);
    return () => ctx.revert();
  }, []);

  const scrollTo = (href) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="home" className="relative min-h-screen w-full overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <img
          src={HERO_IMG}
          alt="Cinematic car at night"
          className="h-full w-full object-cover opacity-60"
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/80 to-background" />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/40 to-transparent" />
        <div className="absolute inset-0 bg-grid opacity-40" />
      </div>

      {/* Red glow */}
      <div className="pointer-events-none absolute -right-20 top-1/4 h-96 w-96 rounded-full bg-primary/25 blur-[120px]" />

      <div className="container relative z-10 flex min-h-screen flex-col justify-center pt-24 pb-40">
        <div className="max-w-2xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border/70 glass px-4 py-1.5 text-xs font-medium text-muted-foreground">
            <ShieldCheck className="h-3.5 w-3.5 text-primary" />
            Certified instructors · Dual-control cars
          </div>

          <h1 className="font-display text-4xl font-extrabold leading-[1.05] text-balance sm:text-6xl md:text-7xl">
            Learn to Drive <span className="text-primary">With Confidence</span>
          </h1>

          <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            Professional, safety-first driving training that turns nervous beginners into
            confident, road-ready drivers. Practical skills, patient instructors, real results.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button
              size="lg"
              onClick={() => scrollTo("#contact")}
              className="h-12 gap-2 bg-primary px-7 text-base hover:bg-primary/90 glow-red"
            >
              Book Your Training <ArrowRight className="h-4 w-4" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => scrollTo("#courses")}
              className="h-12 gap-2 border-border bg-transparent px-7 text-base"
            >
              <Play className="h-4 w-4" /> Explore Courses
            </Button>
          </div>

          <div className="mt-12 flex flex-wrap gap-8">
            {[
              { n: "10+", l: "Years Experience" },
              { n: "2000+", l: "Learners Trained" },
              { n: "4.9", l: "Average Rating", star: true },
            ].map((s) => (
              <div key={s.l}>
                <div className="font-display flex items-center gap-1 text-2xl font-bold sm:text-3xl">
                  {s.n}
                  {s.star ? <Star className="h-5 w-5 fill-primary text-primary" /> : null}
                </div>
                <div className="text-xs text-muted-foreground">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Moving car track */}
      <div
        ref={trackRef}
        className="absolute bottom-0 left-0 z-10 h-24 w-full overflow-hidden"
      >
        <div className="absolute bottom-6 left-0 h-px w-full bg-gradient-to-r from-transparent via-primary/60 to-transparent" />
        <div className="absolute bottom-5 left-0 h-px w-full bg-border" />
        <div ref={carRef} className="absolute bottom-6 left-0 will-change-transform">
          <svg
            viewBox="0 0 240 100"
            className="h-12 w-auto drop-shadow-[0_12px_20px_rgba(220,38,38,0.4)] sm:h-14"
            aria-hidden="true"
          >
            <defs>
              <linearGradient id="carBody" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#ef4444" />
                <stop offset="1" stopColor="#b91c1c" />
              </linearGradient>
            </defs>
            <ellipse cx="120" cy="88" rx="96" ry="6" fill="rgba(0,0,0,0.45)" />
            <path
              d="M14 66 C14 58 20 54 30 53 L60 52 C72 40 90 32 116 32 L150 32 C168 32 182 40 196 52 L214 56 C224 58 228 62 228 68 L228 72 C228 76 224 78 220 78 L22 78 C17 78 14 74 14 70 Z"
              fill="url(#carBody)"
            />
            <path d="M74 50 C84 42 96 38 114 38 L128 38 L128 50 Z" fill="#0b1220" opacity="0.9" />
            <path d="M134 38 L150 38 C162 38 172 44 180 50 L134 50 Z" fill="#0b1220" opacity="0.9" />
            <circle cx="223" cy="64" r="3" fill="#fff7ed" />
            <circle cx="66" cy="78" r="15" fill="#0a0a0a" />
            <circle cx="66" cy="78" r="6" fill="#3f3f46" />
            <circle cx="174" cy="78" r="15" fill="#0a0a0a" />
            <circle cx="174" cy="78" r="6" fill="#3f3f46" />
          </svg>
        </div>
      </div>
    </section>
  );
}
