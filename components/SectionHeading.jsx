import Reveal from "@/components/Reveal";

export default function SectionHeading({ eyebrow, title, subtitle, center = true }) {
  return (
    <Reveal className={center ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      {eyebrow ? (
        <span className="inline-block text-xs font-semibold uppercase tracking-[0.25em] text-primary">
          {eyebrow}
        </span>
      ) : null}
      <h2 className="font-display mt-3 text-3xl font-bold text-gradient sm:text-4xl md:text-5xl">
        {title}
      </h2>
      {subtitle ? (
        <p className="mt-4 text-base leading-relaxed text-muted-foreground">{subtitle}</p>
      ) : null}
    </Reveal>
  );
}
