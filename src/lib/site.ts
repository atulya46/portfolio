// Single source of truth for the site's name and sections.
// Pages and navigation read from here, so renaming a section is a one-line change.

// The site's organising idea is balance: work that pays and work that restores.
// Each section sits on one side, and the homepage index is split the same way.
export type Side = "day" | "evening";

export type Section = {
  slug: string;
  title: string;
  blurb: string;
  side: Side;
  // Shown on the section page until the first entry arrives.
  emptyNote: string;
};

export const site = {
  name: "Atulya Arya",
  tagline: "Engineer by day, painter by evening, curious all the time.",
};

// Four content sections hold entries. "About" is a standalone page (see `aboutPage`).
// "Studio" is a working name for the art + thoughts section; renaming it is a one-line change here.
export const sections: Section[] = [
  { slug: "work", title: "Work", blurb: "Career highlights and the things I do for a living", side: "day", emptyNote: "Shipping first, writing it up later." },
  { slug: "projects", title: "Projects", blurb: "What I'm building and learning, AI included", side: "day", emptyNote: "Still training. Check back after a few more epochs." },
  { slug: "currently", title: "Currently", blurb: "What I'm reading, watching, moving and exploring right now", side: "evening", emptyNote: "Out living it. Notes to follow." },
  { slug: "studio", title: "Studio", blurb: "Paintings, and the opinions I paint over", side: "evening", emptyNote: "The paint is still wet." },
];

export const aboutPage = { href: "/about", title: "About" };

export function sectionHref(slug: string): string {
  return `/${slug}`;
}

export function sectionsOn(side: Side): Section[] {
  return sections.filter((s) => s.side === side);
}

// Where "Get in touch" points. Supplied by Atulya for public display.
export const contact = {
  email: "atulya.arya64@gmail.com",
  linkedin: "https://www.linkedin.com/in/atulya-arya",
};
