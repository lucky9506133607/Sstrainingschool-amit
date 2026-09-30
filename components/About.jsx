import { ShieldCheck, Target, HeartHandshake, Award } from "lucide-react";
import Reveal from "@/components/Reveal";

const ABOUT_IMG =
  "https://images.unsplash.com/photo-1553782097-130fef5d3e27?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzB8MHwxfHNlYXJjaHwxfHxkcml2aW5nJTIwaW5zdHJ1Y3RvcnxlbnwwfHx8YmxhY2t8MTc5MDc5MDgyN3ww&ixlib=rb-4.1.0&q=85";

const points = [
  { icon: ShieldCheck, title: "Safety First", text: "Every lesson prioritises safe habits and defensive driving." },
  { icon: Target, title: "Practical Focus", text: "Real roads, real traffic, real confidence — not just theory." },
  { icon: HeartHandshake, title: "Patient Guidance", text: "Friendly instructors who move at your pace." },
  { icon: Award, title: "Proven Results", text: "Thousands of confident, licensed drivers trained." },
];

export default function About() {
  return (
    <section id="about" className="relative scroll-mt-24 py-20 md:py-28">
      <div className="container grid items-center gap-12 lg:grid-cols-2">
        <Reveal>
          <div className="relative">
            <div className="absolute -inset-4 rounded-3xl bg-primary/10 blur-2xl" />
            <img
              src={ABOUT_IMG}
              alt="Driving instructor teaching a learner"
              loading="lazy"
              className="relative aspect-[4/3] w-full rounded-3xl border border-border object-cover"
            />
            <div className="absolute -bottom-6 -right-4 hidden rounded-2xl border border-border glass p-5 sm:block">
              <div className="font-display text-3xl font-bold text-primary">100%</div>
              <div className="text-xs text-muted-foreground">Road-ready focus</div>
            </div>
          </div>
        </Reveal>

        <div>
          <Reveal>
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">
              About Us
            </span>
            <h2 className="font-display mt-3 text-3xl font-bold text-gradient sm:text-4xl">
              Driving confidence, built the right way
            </h2>
            <p className="mt-4 text-muted-foreground">
              At SS Training School we believe great drivers are made through patient,
              professional instruction and plenty of hands-on practice. Our safety-first
              approach helps learners build genuine confidence behind the wheel — ready for
              any road, any condition.
            </p>
          </Reveal>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {points.map((p, i) => (
              <Reveal key={p.title} delay={i * 0.08}>
                <div className="flex gap-3 rounded-2xl border border-border bg-card p-4">
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-primary/15 text-primary">
                    <p.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{p.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{p.text}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
