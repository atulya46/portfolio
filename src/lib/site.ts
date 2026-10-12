// Single source of truth for the site's name, sections and contact details.
// Pages and navigation read from here, so renaming a section is a one-line change.

export type Section = {
  slug: string;
  title: string;
  blurb: string;
};

export const site = {
  name: "Atulya Arya",
  // Under the name on the hero, shown one after another.
  taglineWords: ["Software Engineering", "Creativity", "Curiosity"],
  about: `Hi👋 \nI\u2019m Atulya, a Software Engineer at Goldman Sachs. I build things, write occasionally, read, & get disproportionately excited about random ideas.`,
  // Path under /public to a photo or GIF for the About circle. Unset shows a placeholder.
  aboutMedia: "/about.jpg" as string | undefined,
  aboutMediaAlt: "Atulya smiling in a pink jacket on the steps of a colourful monastery",
};

export const sections: Section[] = [
  { slug: "about", title: "About", blurb: "Who I am" },
  { slug: "projects", title: "Projects", blurb: "What I'm building and learning right now" },
  { slug: "pov", title: "POV", blurb: "Opinions, learnings and introspection" },
  { slug: "studio", title: "Studio", blurb: "Books, art and movement" },
  { slug: "favourites", title: "Favourites", blurb: "What I’m reading, watching and saving right now" },
];

// Sections live on the home page as anchors, not as pages of their own.
export function sectionHref(slug: string): string {
  return `/#${slug}`;
}

// Footer destinations. Anything left undefined shows as plain text until it is configured.
export const contact: {
  email?: string;
  linkedin?: string;
  github?: string;
  feedback?: string;
  // A file under /public; the menu shows a resume button once the file is there.
  resume?: string;
} = {
  email: "atulya.arya64@gmail.com",
  linkedin: "https://www.linkedin.com/in/atulya-arya",
  github: "https://github.com/atulya46",
  feedback: "mailto:atulya.arya64@gmail.com?subject=Feedback%20on%20your%20portfolio",
  resume: "/resume.pdf",
};
