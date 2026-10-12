import fs from "node:fs";
import path from "node:path";
import { AboutSection } from "@/components/AboutSection";
import { FavouritesTable } from "@/components/FavouritesTable";
import { GridLoader } from "@/components/GridLoader";
import { Hero } from "@/components/Hero";
import { HeroGlow } from "@/components/HeroGlow";
import { PovContents } from "@/components/PovContents";
import { ProjectShowcase } from "@/components/ProjectShowcase";
import { SectionNav } from "@/components/SectionNav";
import { StudioSection } from "@/components/StudioSection";
import { entriesInSection } from "@/lib/content/load";
import { contact, sections, type Section } from "@/lib/site";

// Every section is at least a screen tall below the sticky menu, so a neighbour never shows
// alongside it; longer content simply keeps scrolling inside its section.
// Titled sections start at the top; the untitled About section sits in the middle of its screen.
function HomeSection({
  section,
  title = true,
  centerHeader = false,
  glow = false,
  children,
}: {
  section: Section;
  title?: boolean;
  centerHeader?: boolean;
  // The hero's dot grid with its cursor trail, behind the section's content.
  glow?: boolean;
  children?: React.ReactNode;
}) {
  return (
    <section
      id={section.slug}
      className={`snap-section flex min-h-[calc(100svh-var(--nav-h))] flex-col border-b border-accent/15 ${title ? "justify-start" : "justify-center"} ${glow ? "relative overflow-hidden select-none" : ""}`}
    >
      {glow && <HeroGlow />}
      <div className="relative mx-auto flex w-full max-w-5xl flex-col gap-12 px-6 py-20 sm:px-8 md:gap-16 md:py-28">
        {title && (
          <header className={`flex flex-col gap-2 ${centerHeader ? "items-center text-center" : ""}`}>
            <h2 className="text-3xl font-semibold tracking-tight md:text-5xl">{section.title}</h2>
            <p className="text-muted">{section.blurb}</p>
          </header>
        )}
        {children}
      </div>
    </section>
  );
}

// The resume button only appears once the PDF is actually in /public.
function resumeHref() {
  return contact.resume && fs.existsSync(path.join(process.cwd(), "public", contact.resume)) ? contact.resume : undefined;
}

export default function Home() {
  const bySlug = Object.fromEntries(sections.map((s) => [s.slug, s]));
  // Projects with an `order` come first, in that order; the rest follow newest first.
  const projects = entriesInSection("projects")
    .flatMap((e) => (e.type === "project" ? [e] : []))
    .sort((a, b) => (a.order ?? Infinity) - (b.order ?? Infinity));
  const articles = entriesInSection("pov").flatMap((e) => (e.type === "thought" ? [e] : []));

  return (
    <main className="flex flex-1 flex-col">
      <GridLoader />
      <Hero />
      <SectionNav sections={sections} resume={resumeHref()} />

      <HomeSection section={bySlug.about} title={false} glow>
        <AboutSection />
      </HomeSection>

      <HomeSection section={bySlug.projects}>
        {projects.length === 0 ? (
          <p className="text-muted">Nothing here yet. Something is brewing.</p>
        ) : (
          <div className="flex flex-col gap-20 md:gap-28">
            {projects.map((p, i) => (
              <ProjectShowcase key={p.slug} project={p} index={i} />
            ))}
          </div>
        )}
      </HomeSection>

      <HomeSection section={bySlug.pov} centerHeader>
        {articles.length === 0 ? <p className="text-muted">Nothing here yet.</p> : <PovContents entries={articles} />}
      </HomeSection>

      <HomeSection section={bySlug.studio}>
        <StudioSection entries={entriesInSection("studio")} />
      </HomeSection>

      <HomeSection section={bySlug.favourites}>
        <FavouritesTable />
      </HomeSection>
    </main>
  );
}
