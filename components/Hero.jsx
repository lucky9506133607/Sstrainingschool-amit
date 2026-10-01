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
        className="absolute bottom-0 left-0 z-10 h-48 w-full overflow-hidden"
      >
        <div className="absolute bottom-6 left-0 h-px w-full bg-gradient-to-r from-transparent via-primary/60 to-transparent" />
        <div className="absolute bottom-5 left-0 h-px w-full bg-border" />
        <div ref={carRef} className="absolute bottom-6 left-0 will-change-transform">
          <svg
            viewBox="0 0 476 184"
            className="h-[106px] w-auto drop-shadow-[0_18px_26px_rgba(0,0,0,0.55)] sm:h-[128px] md:h-[150px]"
            aria-hidden="true"
          >
            <defs>
              <linearGradient id="carBody" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#fbfbfd" />
                <stop offset="0.45" stopColor="#d3d7de" />
                <stop offset="0.64" stopColor="#aeb4bf" />
                <stop offset="1" stopColor="#848b98" />
              </linearGradient>
              <linearGradient id="carGlass" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#223247" />
                <stop offset="1" stopColor="#47627f" />
              </linearGradient>
              <linearGradient id="carRim" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#eef0f3" />
                <stop offset="1" stopColor="#9aa1ad" />
              </linearGradient>
              <radialGradient id="carHead" cx="0.5" cy="0.5" r="0.5">
                <stop offset="0" stopColor="#fff7e0" stopOpacity="0.9" />
                <stop offset="1" stopColor="#fff7e0" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* ground contact shadow */}
            <ellipse cx="220" cy="180" rx="188" ry="7" fill="rgba(0,0,0,0.45)" />

            {/* headlight beam glow */}
            <circle cx="430" cy="124" r="34" fill="url(#carHead)" />

            {/* body */}
            <path
              d="M16 134 C17 124 23 118 34 117 L72 115 C96 94 122 77 164 75 L252 73 C286 74 302 90 320 110 L406 114 C420 115 426 121 426 131 C427 141 423 149 414 149 L366 149 A36 36 0 0 0 294 149 L131 149 A36 36 0 0 0 59 149 L34 149 C23 149 16 144 16 134 Z"
              fill="url(#carBody)"
              stroke="#6b7280"
              strokeOpacity="0.35"
              strokeWidth="1"
            />

            {/* roof highlight */}
            <path
              d="M74 114 C98 93 124 77 165 75 L252 73 C286 74 302 90 319 109"
              fill="none"
              stroke="#ffffff"
              strokeOpacity="0.55"
              strokeWidth="2"
              strokeLinecap="round"
            />

            {/* glass greenhouse */}
            <path
              d="M96 112 C112 94 131 80 166 79 L248 77 C279 79 293 92 305 112 Z"
              fill="url(#carGlass)"
            />
            {/* glass reflection streak */}
            <path d="M120 108 L150 84 L170 84 L140 108 Z" fill="#ffffff" opacity="0.12" />
            {/* B-pillar */}
            <rect x="196" y="78" width="7" height="35" fill="url(#carBody)" />
            {/* window frame */}
            <path
              d="M96 112 C112 94 131 80 166 79 L248 77 C279 79 293 92 305 112"
              fill="none"
              stroke="#2a3642"
              strokeOpacity="0.6"
              strokeWidth="2"
            />

            {/* door seams */}
            <line x1="150" y1="116" x2="150" y2="146" stroke="#8a909c" strokeWidth="1.5" strokeOpacity="0.7" />
            <line x1="252" y1="112" x2="252" y2="146" stroke="#8a909c" strokeWidth="1.5" strokeOpacity="0.7" />
            {/* door handles */}
            <rect x="166" y="120" width="16" height="4" rx="2" fill="#5b616c" />
            <rect x="256" y="120" width="16" height="4" rx="2" fill="#5b616c" />
            {/* side mirror */}
            <path d="M312 104 L324 101 L324 109 L312 110 Z" fill="#9aa1ad" />

            {/* red brand accent line */}
            <path d="M62 143 L300 141" stroke="#dc2626" strokeWidth="3" strokeOpacity="0.85" strokeLinecap="round" />

            {/* taillight */}
            <path d="M18 120 L30 120 L30 130 L18 129 Z" fill="#e11d2a" />
            {/* headlight lens */}
            <path d="M408 116 L422 120 L422 128 L408 128 Z" fill="#eaf2ff" />

            {/* rear wheel */}
            <circle cx="95" cy="148" r="33" fill="#0d0d0f" />
            <circle cx="95" cy="148" r="19" fill="url(#carRim)" />
            <g stroke="#7b818c" strokeWidth="3">
              <line x1="95" y1="148" x2="95" y2="130" />
              <line x1="95" y1="148" x2="112" y2="153" />
              <line x1="95" y1="148" x2="105" y2="163" />
              <line x1="95" y1="148" x2="85" y2="163" />
              <line x1="95" y1="148" x2="78" y2="153" />
            </g>
            <circle cx="95" cy="148" r="4.5" fill="#e5e7eb" />

            {/* front wheel */}
            <circle cx="330" cy="148" r="33" fill="#0d0d0f" />
            <circle cx="330" cy="148" r="19" fill="url(#carRim)" />
            <g stroke="#7b818c" strokeWidth="3">
              <line x1="330" y1="148" x2="330" y2="130" />
              <line x1="330" y1="148" x2="347" y2="153" />
              <line x1="330" y1="148" x2="340" y2="163" />
              <line x1="330" y1="148" x2="320" y2="163" />
              <line x1="330" y1="148" x2="313" y2="153" />
            </g>
            <circle cx="330" cy="148" r="4.5" fill="#e5e7eb" />
          </svg>
        </div>
      </div>
    </section>
  );
}
