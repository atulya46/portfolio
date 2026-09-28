import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { marked } from "marked";
import { frontmatterSchema, sectionForType, type Entry } from "./schema";

const CONTENT_DIR = path.join(process.cwd(), "content");

// Pure: turns one file's text into a validated Entry. Kept separate from disk
// access so it can be tested without touching the filesystem.
export function parseEntry(filePath: string, raw: string): Entry {
  const { data, content } = matter(raw);
  const result = frontmatterSchema.safeParse(data);
  if (!result.success) {
    // Fail the build loudly, naming the file, rather than silently hiding an entry.
    throw new Error(`Invalid frontmatter in ${filePath}:\n${formatIssues(result.error)}`);
  }
  const frontmatter = result.data;
  const body = content.trim();
  return {
    ...frontmatter,
    slug: path.basename(filePath, ".md"),
    section: sectionForType[frontmatter.type],
    html: body ? (marked.parse(body, { async: false }) as string) : "",
  };
}

function formatIssues(error: { issues: { path: PropertyKey[]; message: string }[] }): string {
  return error.issues.map((i) => `  - ${i.path.join(".") || "(root)"}: ${i.message}`).join("\n");
}

function listMarkdownFiles(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true, recursive: true })
    .filter((d) => d.isFile() && d.name.endsWith(".md"))
    .map((d) => path.join(d.parentPath, d.name));
}

export function loadEntries(dir: string = CONTENT_DIR): Entry[] {
  const entries = listMarkdownFiles(dir).map((file) =>
    parseEntry(path.relative(dir, file), fs.readFileSync(file, "utf8")),
  );

  // Slugs become URLs within a section, so two files with the same name would collide.
  const seen = new Set<string>();
  for (const e of entries) {
    const key = `${e.section}/${e.slug}`;
    if (seen.has(key)) throw new Error(`Duplicate entry URL: /${key}`);
    seen.add(key);
  }

  return entries.sort((a, b) => b.date.getTime() - a.date.getTime());
}

export function entriesInSection(section: string): Entry[] {
  return loadEntries().filter((e) => e.section === section);
}

export function findEntry(section: string, slug: string): Entry | undefined {
  return loadEntries().find((e) => e.section === section && e.slug === slug);
}
