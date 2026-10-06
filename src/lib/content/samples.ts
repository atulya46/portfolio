import type { PaperItem, Scrap } from "./board";

// Placeholders so the redesigned pages can be judged with a realistic amount of content.
// Every item is flagged `sample` and shows a "sample" tag. Delete this file (and its two
// uses in the section page) once the real entries and images are in.

export const sampleScraps: Scrap[] = [
  { id: "s-book-1", kind: "book", title: "Sample book title", meta: "by Sample Author", image: "/samples/photo-5.svg", note: "A line from the book would sit here.", sample: true },
  { id: "s-trip-1", kind: "trip", title: "Sample trip", meta: "Somewhere lovely", image: "/samples/photo-1.svg", note: "Where the photo was taken.", sample: true },
  { id: "s-movie-1", kind: "movie", title: "Sample film", meta: "dir. Sample Director", note: "One-line take.", sample: true },
  { id: "s-move-1", kind: "movement", title: "Dance class", meta: "Tuesday", sample: true },
  { id: "s-trip-2", kind: "trip", title: "Another sample trip", meta: "Another place", image: "/samples/photo-2.svg", sample: true },
  { id: "s-book-2", kind: "book", title: "Another sample book", meta: "by Another Author", sample: true },
  { id: "s-movie-2", kind: "movie", title: "Sample series", image: "/samples/photo-6.svg", meta: "Season 1", note: "Binged it.", sample: true },
  { id: "s-move-2", kind: "movement", title: "5 km run", meta: "Saturday", sample: true },
  { id: "s-trip-3", kind: "trip", title: "A third sample trip", meta: "A mountain somewhere", image: "/samples/photo-3.svg", sample: true },
  { id: "s-book-3", kind: "book", title: "Third sample book", meta: "by Third Author", note: "Another line.", sample: true },
  { id: "s-movie-3", kind: "movie", title: "Sample documentary", note: "Worth the evening.", sample: true },
  { id: "s-move-3", kind: "movement", title: "Yoga", meta: "Sunday", sample: true },
];

export const samplePaperItems: PaperItem[] = [
  { id: "p-1", kind: "painting", title: "Sample painting one", dek: "Acrylic on canvas", image: "/samples/photo-4.svg", alt: "Placeholder artwork", href: "/samples/photo-4.svg", external: false, sample: true },
  { id: "a-1", kind: "article", title: "Sample headline for a Substack article", dek: "A two-line summary of the piece would sit here, so a reader knows what they are about to open.", outlet: "Substack", href: "https://substack.com", external: true, sample: true },
  { id: "p-2", kind: "painting", title: "Sample painting two", dek: "Acrylic on canvas", image: "/samples/photo-5.svg", alt: "Placeholder artwork", href: "/samples/photo-5.svg", external: false, sample: true },
  { id: "a-2", kind: "article", title: "Another sample headline", dek: "Opinions written elsewhere link out to where they were published and open in a new tab.", outlet: "Substack", href: "https://substack.com", external: true, sample: true },
  { id: "a-3", kind: "article", title: "A third sample headline, a little longer than the others", dek: "Short summary for the third piece.", outlet: "Medium", href: "https://medium.com", external: true, sample: true },
  { id: "p-3", kind: "painting", title: "Sample painting three", dek: "Acrylic on canvas", image: "/samples/photo-6.svg", alt: "Placeholder artwork", href: "/samples/photo-6.svg", external: false, sample: true },
  { id: "a-4", kind: "article", title: "Sample headline four", dek: "One more summary line.", outlet: "Substack", href: "https://substack.com", external: true, sample: true },
  { id: "p-4", kind: "painting", title: "Sample painting four", dek: "Acrylic on canvas", image: "/samples/photo-1.svg", alt: "Placeholder artwork", href: "/samples/photo-1.svg", external: false, sample: true },
];
