import { describe, expect, it } from "vitest";
import { sectionHref, sections } from "./site";

describe("sections", () => {
  it("has unique slugs, since each one becomes a URL", () => {
    const slugs = sections.map((s) => s.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("uses URL-safe slugs", () => {
    for (const s of sections) {
      expect(s.slug).toMatch(/^[a-z0-9-]+$/);
    }
  });
});

describe("sectionHref", () => {
  it("builds a root-relative link", () => {
    expect(sectionHref("canvas")).toBe("/canvas");
  });
});
