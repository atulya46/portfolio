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

export const bookSchema = z.object({
  ...base,
  type: z.literal("book"),
  author: z.string().min(1),
  status: z.enum(["reading", "finished", "abandoned"]).optional(),
  take: z.string().optional(),
  quotes: z.array(z.string()).default([]),
  // Optional cover: a file under /public or an https image URL; without one the tile shows the title.
  cover: z
    .string()
    .refine((v) => v.startsWith("/") || v.startsWith("https://"), "cover must start with / or https://")
    .optional(),
  coverAlt: z.string().optional(),
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
  director: z.string().optional(),
  year: z.number().int().optional(),
  take: z.string().optional(),
});

export const tripSchema = z.object({
  ...base,
  type: z.literal("trip"),
  place: z.string().min(1),
  take: z.string().optional(),
});

export const projectSchema = z.object({
  ...base,
  type: z.literal("project"),
  role: z.string().optional(),
  stack: z.array(z.string()).default([]),
  // Live project, source code and write-up; each is optional and shown only when present.
  link: z.url().optional(),
  source: z.url().optional(),
  caseStudy: z.url().optional(),
  // Position on the homepage: 1 shows first. Projects without one follow, newest first.
  order: z.number().int().positive().optional(),
  // Animated preview (GIF, or a still) under /public, described for screen readers.
  media: z.string().startsWith("/").optional(),
  mediaAlt: z.string().optional(),
});

export const thoughtSchema = z.object({
  ...base,
  type: z.literal("thought"),
  // Optional: the POV contents page groups articles under their category.
  category: z.string().optional(),
});

export const movementSchema = z.object({
  ...base,
  type: z.literal("movement"),
  image: z.string().startsWith("/").optional(),
  alt: z.string().optional(),
  // Shown under the photo on the homepage; falls back to the title.
  caption: z.string().optional(),
});

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

// Which home-page section each entry type appears in.
export const sectionForType: Record<EntryType, string> = {
  book: "studio",
  movie: "favourites",
  trip: "favourites",
  painting: "studio",
  movement: "studio",
  learning: "projects",
  project: "projects",
  thought: "pov",
};

export type Entry = Frontmatter & {
  slug: string;
  section: string;
  // Markdown body rendered to HTML. Empty when the entry has no body.
  html: string;
};
