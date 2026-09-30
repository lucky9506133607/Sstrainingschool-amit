import { Check, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import siteConfig from "@/lib/siteConfig";

export default function Pricing() {
  return (
    <section id="pricing" className="relative scroll-mt-24 py-20 md:py-28">
      <div className="pointer-events-none absolute left-1/2 top-1/3 h-72 w-72 -translate-x-1/2 rounded-full bg-primary/10 blur-[120px]" />
      <div className="container">
        <SectionHeading
          eyebrow="Pricing"
          title="Simple, transparent plans"
          subtitle="Choose the daily practice distance that suits your learning pace. No hidden charges."
        />

        <div className="mt-14 grid items-stretch gap-6 md:grid-cols-3">
          {siteConfig.pricing.map((plan, i) => (
            <Reveal key={plan.name} delay={i * 0.1} className="h-full">
              <div
                className={`relative flex h-full flex-col rounded-3xl border p-7 transition-all duration-300 ${
                  plan.popular
                    ? "border-primary bg-card glow-red md:-translate-y-4"
                    : "border-border bg-card hover:-translate-y-1 hover:border-primary/40"
                }`}
              >
                {plan.popular ? (
                  <span className="absolute -top-3 left-1/2 flex -translate-x-1/2 items-center gap-1 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
                    <Star className="h-3 w-3 fill-current" /> Most Popular
                  </span>
                ) : null}

                <h3 className="font-display text-sm font-bold uppercase tracking-widest text-muted-foreground">
                  {plan.name}
                </h3>
                <div className="mt-4 flex items-end gap-1">
                  <span className="font-display text-4xl font-extrabold">₹{plan.price}</span>
                  <span className="mb-1 text-sm text-muted-foreground">/ month</span>
                </div>
                <p className="mt-1 text-sm font-medium text-primary">{plan.km}</p>

                <ul className="mt-6 flex-1 space-y-3">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      {f}
                    </li>
                  ))}
                </ul>

                <a href="#contact" className="mt-7 block">
                  <Button
                    className={`w-full ${
                      plan.popular
                        ? "bg-primary hover:bg-primary/90"
                        : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                    }`}
                  >
                    Choose {plan.name}
                  </Button>
                </a>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
