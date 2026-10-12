import Image from "next/image";
import { Reveal } from "./Reveal";
import type { Entry } from "@/lib/content/schema";

type Project = Extract<Entry, { type: "project" }>;

function ProjectLink({ href, children }: { href?: string; children: React.ReactNode }) {
  if (!href) return null;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group inline-flex items-center gap-1.5 rounded-full border border-accent/40 px-4 py-1.5 text-sm transition-colors duration-150 hover:border-accent hover:bg-accent hover:text-background active:scale-95"
    >
      {children}
      <span aria-hidden="true" className="transition-transform duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
        &#8599;
      </span>
    </a>
  );
}

// One project: an animated preview beside a title, a short description and optional links.
// Even-numbered projects flip sides on wide screens; on narrow ones the media stacks above the text.
export function ProjectShowcase({ project, index }: { project: Project; index: number }) {
  const flip = index % 2 === 1;
  return (
    <Reveal>
      <article className="grid items-center gap-6 md:grid-cols-2 md:gap-12">
        <div
          className={`group aspect-[16/10] overflow-hidden rounded-2xl bg-surface ${flip ? "md:order-2" : ""}`}
        >
          {project.media ? (
            <Image
              src={project.media}
              alt={project.mediaAlt ?? `Preview of ${project.title}`}
              width={960}
              height={600}
              // Unoptimised so an animated GIF keeps animating.
              unoptimized
              loading="lazy"
              className="size-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            />
          ) : (
            <div className="grid size-full place-items-center border border-dashed border-accent/40 text-xs uppercase tracking-widest text-muted">
              GIF preview
            </div>
          )}
        </div>
        <div className="flex flex-col items-start gap-4">
          <h3 className="text-2xl font-semibold tracking-tight md:text-3xl">{project.title}</h3>
          {project.summary && <p className="max-w-md text-base leading-relaxed text-muted">{project.summary}</p>}
          <div className="flex flex-wrap gap-2">
            <ProjectLink href={project.link}>Live</ProjectLink>
            <ProjectLink href={project.source}>Source</ProjectLink>
            <ProjectLink href={project.caseStudy}>Case study</ProjectLink>
          </div>
        </div>
      </article>
    </Reveal>
  );
}
