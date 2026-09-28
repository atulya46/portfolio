// Single source of truth for the site's name and sections.
// Pages and navigation read from here, so renaming a section is a one-line change.

export type Section = {
  slug: string;
  title: string;
  blurb: string;
};

export const site = {
  name: "Atulya Arya",
  tagline: "Engineer by day, painter by evening, curious all the time.",
};

export const sections: Section[] = [
  { slug: "work", title: "Work", blurb: "Projects and career highlights" },
  { slug: "ai", title: "AI", blurb: "What I'm building and thinking about in AI" },
  { slug: "learning", title: "Learning", blurb: "What I'm learning right now, and what stuck" },
  { slug: "leisure", title: "Leisure", blurb: "Books, movies and travel" },
  { slug: "canvas", title: "Canvas", blurb: "Paintings, mostly acrylic" },
  { slug: "movement", title: "Movement", blurb: "Dance and fitness" },
  { slug: "thoughts", title: "Thoughts", blurb: "Opinions and introspection" },
];

export function sectionHref(slug: string): string {
  return `/${slug}`;
}
