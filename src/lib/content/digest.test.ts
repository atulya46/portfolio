import { describe, expect, it } from "vitest";
import { countLabel, entryNumber, nowLines, padNumber } from "./digest";
import { parseEntry } from "./load";

const entry = (file: string, frontmatter: string) => parseEntry(file, `---\n${frontmatter}\n---\n`);

const oldBook = entry("old.md", "type: book\ntitle: Old\nauthor: A\ndate: 2026-01-01\nstatus: finished");
const newBook = entry("new.md", "type: book\ntitle: New\nauthor: B\ndate: 2026-09-01");
const course = entry("c.md", "type: learning\ntitle: RAG\ndate: 2026-05-01\nstatus: now");
const doneCourse = entry("d.md", "type: learning\ntitle: SQL\ndate: 2026-08-01\nstatus: done");
const painting = entry("p.md", "type: painting\ntitle: Red\ndate: 2026-03-01\nimage: /p.jpg\nalt: a painting");

// loadEntries returns newest first; the helpers rely on that order.
const newestFirst = [newBook, doneCourse, course, painting, oldBook];

describe("nowLines", () => {
  it("shows the newest book, the current course and the last painting", () => {
    expect(nowLines(newestFirst)).toEqual([
      { verb: "Reading", title: "New", href: "/currently/new" },
      { verb: "Learning", title: "RAG", href: "/projects/c" },
      { verb: "Last painted", title: "Red", href: "/studio/p" },
    ]);
  });

  it("skips courses that are finished", () => {
    expect(nowLines([doneCourse]).length).toBe(0);
  });

  it("uses the book's status for the verb", () => {
    expect(nowLines([oldBook])[0].verb).toBe("Finished");
  });

  it("returns nothing when there are no entries", () => {
    expect(nowLines([])).toEqual([]);
  });
});

describe("entryNumber", () => {
  it("counts from the oldest entry in the same section", () => {
    expect(entryNumber(oldBook, newestFirst)).toBe(1);
    expect(entryNumber(newBook, newestFirst)).toBe(2);
    expect(entryNumber(painting, newestFirst)).toBe(1);
  });
});

describe("labels", () => {
  it("pads numbers to two digits", () => {
    expect(padNumber(3)).toBe("03");
    expect(padNumber(12)).toBe("12");
  });

  it("says 'soon' for an empty section", () => {
    expect(countLabel(0)).toBe("soon");
    expect(countLabel(1)).toBe("1 entry");
    expect(countLabel(4)).toBe("4 entries");
  });
});
