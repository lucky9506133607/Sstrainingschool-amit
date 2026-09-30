import { Star, Quote } from "lucide-react";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";

const testimonials = [
  { name: "Rahul", role: "Beginner Course", text: "I was terrified of driving. My instructor was so patient that I passed my test on the first attempt." },
  { name: "Priya", role: "Female Training", text: "A very comfortable and safe learning experience. I finally feel confident driving on my own." },
  { name: "Amit", role: "License Training", text: "Clear, structured lessons and real test-route practice. Totally worth it for the license prep." },
  { name: "Neha", role: "Refresher Course", text: "Hadn't driven in years. A few focused sessions and I was back on the road with confidence." },
];

export default function Testimonials() {
  return (
    <section id="testimonials" className="relative scroll-mt-24 py-20 md:py-28">
      <div className="container">
        <SectionHeading
          eyebrow="Testimonials"
          title="Loved by our learners"
          subtitle="Real words from drivers who started right here at SS Training School."
        />

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {testimonials.map((t, i) => (
            <Reveal key={t.name} delay={i * 0.08}>
              <div className="flex h-full flex-col rounded-2xl border border-border bg-card p-6">
                <Quote className="h-7 w-7 text-primary/40" />
                <p className="mt-4 flex-1 text-sm leading-relaxed text-muted-foreground">
                  “{t.text}”
                </p>
                <div className="mt-5 flex items-center gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-full bg-primary/15 font-display font-bold text-primary">
                    {t.name[0]}
                  </div>
                  <div>
                    <div className="text-sm font-semibold">{t.name}</div>
                    <div className="flex items-center gap-0.5">
                      {[...Array(5)].map((_, s) => (
                        <Star key={s} className="h-3 w-3 fill-primary text-primary" />
                      ))}
                    </div>
                  </div>
                </div>
                <div className="mt-2 text-xs text-muted-foreground">{t.role}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
