import { Car, RefreshCw, BadgeCheck, UserRound, ArrowUpRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import siteConfig from "@/lib/siteConfig";

const iconMap = { Car, RefreshCw, BadgeCheck, UserRound };

export default function Courses() {
  return (
    <section id="courses" className="relative scroll-mt-24 py-20 md:py-28">
      <div className="container">
        <SectionHeading
          eyebrow="Training Programs"
          title="Courses built for every learner"
          subtitle="From your very first lesson to full license readiness — choose the program that fits you."
        />

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {siteConfig.courses.map((c, i) => {
            const Icon = iconMap[c.icon] || Car;
            return (
              <Reveal key={c.id} delay={i * 0.08}>
                <Card className="group relative h-full overflow-hidden border-border bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/50">
                  <div className="absolute -right-10 -top-10 h-24 w-24 rounded-full bg-primary/10 blur-2xl transition-opacity group-hover:opacity-100 opacity-0" />
                  <div className="grid h-12 w-12 place-items-center rounded-xl bg-primary/15 text-primary">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-display mt-5 text-lg font-bold">{c.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {c.description}
                  </p>
                  <a
                    href="#contact"
                    className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary"
                  >
                    Enquire now <ArrowUpRight className="h-4 w-4" />
                  </a>
                </Card>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
