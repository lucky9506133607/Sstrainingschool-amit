"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";

const faqs = [
  { q: "How long is the training?", a: "Most learners complete their program within 15–21 days depending on the plan and daily practice distance chosen. We keep sessions flexible around your schedule." },
  { q: "Which cars are used for training?", a: "We use well-maintained, dual-control cars so the instructor can assist at any moment — giving beginners maximum safety and confidence." },
  { q: "Do you provide beginner training?", a: "Absolutely. Our Beginner Car Driving course starts from the very basics — controls, clutch, gears and road awareness — with patient, step-by-step guidance." },
  { q: "Do you provide refresher training?", a: "Yes. Our Refresher Course is designed for people who already know the basics but want to rebuild confidence before driving regularly." },
  { q: "Can females book training?", a: "Yes. We offer dedicated Female Driving Training in a comfortable, safe and supportive environment designed specifically for women learners." },
  { q: "How can I book a session?", a: "Simply fill out the contact form on this page or message us on WhatsApp. Our team will reach out to confirm your schedule." },
];

export default function FAQ() {
  return (
    <section id="faq" className="relative scroll-mt-24 py-20 md:py-28">
      <div className="container">
        <SectionHeading
          eyebrow="FAQ"
          title="Questions, answered"
          subtitle="Everything you might want to know before booking your first lesson."
        />

        <Reveal className="mx-auto mt-12 max-w-3xl">
          <Accordion type="single" collapsible className="w-full space-y-3">
            {faqs.map((item, i) => (
              <AccordionItem
                key={i}
                value={`item-${i}`}
                className="rounded-2xl border border-border bg-card px-5"
              >
                <AccordionTrigger className="text-left text-base font-medium hover:no-underline">
                  {item.q}
                </AccordionTrigger>
                <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                  {item.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>
      </div>
    </section>
  );
}
