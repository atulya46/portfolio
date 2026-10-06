import { z } from "zod";

// Every entry type shares these. Everything else is optional per type, because
// entries vary in shape: a book can be just quotes, just a take, or a full essay.
const base = {
  title: z.string().min(1),
  // YAML turns `2026-09-28` into a Date; coercing also accepts plain strings.
  date: z.coerce.date(),
  summary: z.string().optional(),
  tags: z.array(z.string()).default([]),
};

// Optional picture for entries that can have one (a cover, a photo from the trip).
const optionalImage = {
  image: z.string().startsWith("/").optional(),
  alt: z.string().optional(),
};

export const bookSchema = z.object({
  ...base,
  type: z.literal("book"),
  ...optionalImage,
  author: z.string().min(1),
  status: z.enum(["reading", "finished", "abandoned"]).optional(),
  take: z.string().optional(),
  quotes: z.array(z.string()).default([]),
});

export const paintingSchema = z.object({
  ...base,
  type: z.literal("painting"),
  // Path under /public, e.g. /canvas/i-see-red.jpg
  image: z.string().startsWith("/"),
  // Required so the image is described for screen readers.
  alt: z.string().min(1),
  caption: z.string().optional(),
  medium: z.string().optional(),
});

export const learningSchema = z.object({
  ...base,
  type: z.literal("learning"),
  status: z.enum(["now", "done", "paused"]),
  via: z.string().optional(),
  link: z.url().optional(),
  topics: z.array(z.string()).default([]),
});

export const movieSchema = z.object({
  ...base,
  type: z.literal("movie"),
  ...optionalImage,
  director: z.string().optional(),
  year: z.number().int().optional(),
  take: z.string().optional(),
});

export const tripSchema = z.object({
  ...base,
  type: z.literal("trip"),
  ...optionalImage,
  place: z.string().min(1),
  take: z.string().optional(),
});

export const projectSchema = z.object({
  ...base,
  type: z.literal("project"),
  role: z.string().optional(),
  stack: z.array(z.string()).default([]),
  link: z.url().optional(),
});

// A thought can live on this site, or point out to where it was published (e.g. a Substack post).
export const thoughtSchema = z.object({
  ...base,
  type: z.literal("thought"),
  link: z.url().optional(),
  outlet: z.string().optional(),
});

export const movementSchema = z.object({ ...base, type: z.literal("movement"), ...optionalImage });

export const frontmatterSchema = z.discriminatedUnion("type", [
  bookSchema,
  paintingSchema,
  learningSchema,
  movieSchema,
  tripSchema,
  projectSchema,
  thoughtSchema,
  movementSchema,
]);

export type Frontmatter = z.infer<typeof frontmatterSchema>;
export type EntryType = Frontmatter["type"];

// Which section page each entry type appears on.
export const sectionForType: Record<EntryType, string> = {
  book: "currently",
  movie: "currently",
  trip: "currently",
  movement: "currently",
  painting: "studio",
  thought: "studio",
  learning: "projects",
  project: "projects",
};

export type Entry = Frontmatter & {
  slug: string;
  section: string;
  // Markdown body rendered to HTML. Empty when the entry has no body.
  html: string;
};
