import fs from "node:fs";
import path from "node:path";
import Image from "next/image";
import { InView } from "./InView";
import { Reveal } from "./Reveal";
import { SocialLinks } from "./SocialLinks";
import { site } from "@/lib/site";

// A circle for a photo or GIF. Set `aboutMedia` in site.ts and it replaces the placeholder
// (the placeholder also stays if that file isn't in /public yet, rather than showing a broken image).
function AboutMedia() {
  const size = "size-44 sm:size-56 md:size-64";
  const media = site.aboutMedia && fs.existsSync(path.join(process.cwd(), "public", site.aboutMedia)) ? site.aboutMedia : undefined;
  return (
    <div className={`about-media ${size} overflow-hidden rounded-full`}>
      {media ? (
        <Image
          src={media}
          alt={site.aboutMediaAlt}
          width={512}
          height={512}
          // Unoptimised so an animated GIF keeps animating.
          unoptimized
          className="size-full object-cover"
        />
      ) : (
        <div
          role="img"
          aria-label="Placeholder for a photo or animation"
          className="grid size-full place-items-center rounded-full border border-dashed border-accent/50 bg-surface text-xs uppercase tracking-widest text-muted"
        >
          GIF / PNG
        </div>
      )}
    </div>
  );
}

export function AboutSection() {
  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center gap-10 text-center">
      <Reveal>
        <InView>
          <AboutMedia />
        </InView>
      </Reveal>
      <Reveal delay={120}>
        <p className="text-balance text-base leading-relaxed md:text-lg md:leading-relaxed">{site.about}</p>
      </Reveal>
      <Reveal delay={200}>
        <SocialLinks className="justify-center" />
      </Reveal>
    </div>
  );
}
