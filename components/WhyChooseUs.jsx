import { GraduationCap, ShieldCheck, Car, CalendarClock, Smile, Route } from "lucide-react";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";

const STEER_IMG =
  "https://images.unsplash.com/photo-1614609953905-baeff400aab3?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1OTV8MHwxfHNlYXJjaHw0fHxzdGVlcmluZyUyMHdoZWVsfGVufDB8fHxibGFja3wxNzkwNzkwODIyfDA&ixlib=rb-4.1.0&q=85";

const features = [
  { icon: GraduationCap, title: "Experienced Guidance", text: "Certified instructors with years of on-road teaching experience." },
  { icon: ShieldCheck, title: "Safety First", text: "Dual-control vehicles and defensive driving from day one." },
  { icon: Car, title: "Practical Training", text: "Maximum wheel time on real roads and real traffic." },
  { icon: CalendarClock, title: "Flexible Learning", text: "Schedules that fit your day, including early mornings." },
  { icon: Smile, title: "Confidence Building", text: "Patient, encouraging approach for nervous beginners." },
  { icon: Route, title: "Road-Ready Skills", text: "Parking, highways, junctions — everything you need." },
];

export default function WhyChooseUs() {
  return (
    <section id="why-us" className="relative scroll-mt-24 overflow-hidden py-20 md:py-28">
      <div
        className="absolute inset-0 -z-10 opacity-20"
        style={{
          backgroundImage: `linear-gradient(to bottom, hsl(var(--background)), transparent), url(${STEER_IMG})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <div className="container">
        <SectionHeading
          eyebrow="Why Choose Us"
          title="Everything you need to succeed"
          subtitle="We combine expert instruction, safe vehicles and a supportive approach so you learn faster."
        />

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <Reveal key={f.title} delay={i * 0.06}>
              <div className="group h-full rounded-2xl border border-border bg-card/80 p-6 backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:border-primary/50">
                <div className="grid h-12 w-12 place-items-center rounded-xl bg-primary/15 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <f.icon className="h-6 w-6" />
                </div>
                <h3 className="font-display mt-5 text-lg font-bold">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
