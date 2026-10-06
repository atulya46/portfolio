import { describe, expect, it } from "vitest";
import { pageOf, toPaperItems, toScraps } from "./board";
import { parseEntry } from "./load";

const entry = (file: string, frontmatter: string) => parseEntry(file, `---\n${frontmatter}\n---\n`);

describe("toScraps", () => {
  it("turns books, movies, trips and movement into scraps and ignores the rest", () => {
    const scraps = toScraps([
      entry("b.md", "type: book\ntitle: B\nauthor: A\ndate: 2026-01-01\nquotes: [\"a line\"]"),
      entry("t.md", "type: trip\ntitle: T\nplace: Sikkim\ndate: 2026-01-01\nimage: /t.jpg"),
      entry("p.md", "type: painting\ntitle: P\ndate: 2026-01-01\nimage: /p.jpg\nalt: x"),
    ]);
    expect(scraps.map((s) => s.kind)).toEqual(["book", "trip"]);
    expect(scraps[0]).toMatchObject({ meta: "by A", note: "a line", href: "/currently/b" });
    expect(scraps[1]).toMatchObject({ meta: "Sikkim", image: "/t.jpg" });
  });
});

describe("toPaperItems", () => {
  it("keeps paintings on-site and sends linked thoughts out to where they were published", () => {
    const items = toPaperItems([
      entry("p.md", "type: painting\ntitle: P\ndate: 2026-01-01\nimage: /p.jpg\nalt: x"),
      entry("a.md", "type: thought\ntitle: A\ndate: 2026-01-01\nlink: https://example.substack.com/p/a\noutlet: Substack"),
      entry("n.md", "type: thought\ntitle: N\ndate: 2026-01-01"),
    ]);
    expect(items[0]).toMatchObject({ kind: "painting", external: false, href: "/studio/p" });
    expect(items[1]).toMatchObject({ kind: "article", external: true, href: "https://example.substack.com/p/a", outlet: "Substack" });
    expect(items[2]).toMatchObject({ kind: "article", external: false, href: "/studio/n" });
  });
});

describe("pageOf", () => {
  it("shows a page and reports how many are left", () => {
    expect(pageOf([1, 2, 3, 4, 5], 3)).toEqual({ shown: [1, 2, 3], remaining: 2 });
    expect(pageOf([1, 2], 5)).toEqual({ shown: [1, 2], remaining: 0 });
  });
});
