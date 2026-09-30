import { CalendarCheck, UserCheck, Car, Trophy } from "lucide-react";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";

const steps = [
  { no: "01", icon: CalendarCheck, title: "Book Your Training", text: "Pick a course and schedule your first session in minutes." },
  { no: "02", icon: UserCheck, title: "Meet Your Instructor", text: "Get paired with a certified, patient driving instructor." },
  { no: "03", icon: Car, title: "Practice & Learn", text: "Build skills behind the wheel on real roads, step by step." },
  { no: "04", icon: Trophy, title: "Drive With Confidence", text: "Pass your test and hit the road fully road-ready." },
];

export default function TrainingProcess() {
  return (
    <section id="process" className="relative scroll-mt-24 py-20 md:py-28">
      <div className="container">
        <SectionHeading
          eyebrow="How It Works"
          title="Your journey to the road"
          subtitle="A simple, proven four-step process from your first lesson to driving solo."
        />

        <div className="relative mt-16 grid gap-8 md:grid-cols-4">
          <div className="absolute left-0 top-8 hidden h-px w-full bg-gradient-to-r from-transparent via-border to-transparent md:block" />
          {steps.map((s, i) => (
            <Reveal key={s.no} delay={i * 0.1} className="relative">
              <div className="flex flex-col items-center text-center md:items-start md:text-left">
                <div className="relative z-10 grid h-16 w-16 place-items-center rounded-2xl border border-border bg-card">
                  <s.icon className="h-7 w-7 text-primary" />
                  <span className="font-display absolute -right-2 -top-2 grid h-7 w-7 place-items-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                    {s.no}
                  </span>
                </div>
                <h3 className="font-display mt-5 text-lg font-bold">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
