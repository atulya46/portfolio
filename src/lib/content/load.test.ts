import path from "node:path";
import { describe, expect, it } from "vitest";
import { sections } from "../site";
import { loadEntries, parseEntry } from "./load";
import { sectionForType } from "./schema";

describe("parseEntry", () => {
  it("accepts a book that is only quotes, with no take or body", () => {
    const entry = parseEntry(
      "books/some-book.md",
      "---\ntype: book\ntitle: Some Book\nauthor: Someone\ndate: 2026-09-28\nquotes: [\"a line\"]\n---\n",
    );
    expect(entry).toMatchObject({ type: "book", slug: "some-book", section: "leisure", quotes: ["a line"] });
    expect(entry.html).toBe("");
  });

  it("renders the markdown body to HTML", () => {
    const entry = parseEntry("t.md", "---\ntype: thought\ntitle: T\ndate: 2026-01-01\n---\nHello *there*");
    expect(entry.html).toContain("<em>there</em>");
  });

  it("names the file and field when frontmatter is invalid", () => {
    expect(() => parseEntry("canvas/bad.md", "---\ntype: painting\ntitle: Bad\ndate: 2026-01-01\n---\n")).toThrow(
      /canvas\/bad\.md[\s\S]*image/,
    );
  });

  it("rejects unknown entry types", () => {
    expect(() => parseEntry("x.md", "---\ntype: podcast\ntitle: X\ndate: 2026-01-01\n---\n")).toThrow(/x\.md/);
  });
});

describe("sectionForType", () => {
  it("only points at sections that exist", () => {
    const slugs = sections.map((s) => s.slug);
    for (const section of Object.values(sectionForType)) {
      expect(slugs).toContain(section);
    }
  });
});

describe("real content", () => {
  // Catches a broken entry in content/ at test time, before it breaks a deploy.
  it("loads and validates every entry, newest first", () => {
    const entries = loadEntries(path.join(process.cwd(), "content"));
    expect(entries.length).toBeGreaterThan(0);
    const times = entries.map((e) => e.date.getTime());
    expect(times).toEqual([...times].sort((a, b) => b - a));
  });
});
