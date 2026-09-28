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

export const sections: Section[] = [
  { slug: "work", title: "Work", blurb: "Projects and career highlights", side: "day", emptyNote: "Shipping first, writing it up later." },
  { slug: "ai", title: "AI", blurb: "What I'm building and thinking about in AI", side: "day", emptyNote: "Still training. Check back after a few more epochs." },
  { slug: "learning", title: "Learning", blurb: "What I'm learning right now, and what stuck", side: "day", emptyNote: "Between courses. Suspiciously rare." },
  { slug: "leisure", title: "Leisure", blurb: "Books, movies and travel", side: "evening", emptyNote: "Out living it. Notes to follow." },
  { slug: "canvas", title: "Canvas", blurb: "Paintings, mostly acrylic", side: "evening", emptyNote: "The paint is still wet." },
  { slug: "movement", title: "Movement", blurb: "Dance and fitness", side: "evening", emptyNote: "Currently stretching." },
  { slug: "thoughts", title: "Thoughts", blurb: "Opinions and introspection", side: "evening", emptyNote: "Thinking about it. Literally." },
];

export function sectionHref(slug: string): string {
  return `/${slug}`;
}

export function sectionsOn(side: Side): Section[] {
  return sections.filter((s) => s.side === side);
}
