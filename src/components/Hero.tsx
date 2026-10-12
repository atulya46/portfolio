import { HeroGlow } from "./HeroGlow";
import { TypedText } from "./TypedText";
import { WordCycle } from "./WordCycle";
import { site } from "@/lib/site";

export function Hero() {
  return (
    <section
      id="top"
      className="snap-section relative flex select-none min-h-[calc(100svh-var(--nav-h))] items-center justify-center overflow-hidden px-6 text-center"
    >
      <HeroGlow />
      <div className="relative flex flex-col gap-4">
        <h1
          className="intro-item text-[clamp(2.75rem,10vw,6.5rem)] font-semibold leading-none tracking-tight"
          style={{ "--i": 0 } as React.CSSProperties}
        >
          <TypedText text={site.name} caret={false} name="hero-name" />
        </h1>
        <p className="intro-item text-lg text-muted md:text-2xl" style={{ "--i": 1 } as React.CSSProperties}>
          <WordCycle words={site.taglineWords} after="hero-name" />
        </p>
      </div>
    </section>
  );
}
