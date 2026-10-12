import { describe, expect, it } from "vitest";
import { findPreviewImage, toFavourite, type NotionPage } from "./notion";

const rt = (s: string) => [{ plain_text: s }];

describe("toFavourite", () => {
  it("reads the five columns from a Notion row", () => {
    const page: NotionPage = {
      id: "1",
      cover: null,
      properties: {
        Name: { type: "title", title: rt("Past Lives") },
        Type: { type: "select", select: { name: "Film", color: "brown" } },
        Description: { type: "rich_text", rich_text: rt("Two friends, twenty years later.") },
        author: { type: "rich_text", rich_text: rt("Celine Song") },
        Link: { type: "url", url: "https://www.imdb.com/title/tt13238346/" },
      },
    };
    expect(toFavourite(page)).toEqual({
      id: "1",
      name: "Past Lives",
      type: { name: "Film", color: "brown" },
      description: "Two friends, twenty years later.",
      author: "Celine Song",
      link: "https://www.imdb.com/title/tt13238346/",
      thumbnail: undefined,
    });
  });

  it("skips empty rows and ignores links that aren't web addresses", () => {
    expect(toFavourite({ id: "2", properties: { Name: { type: "title", title: [] } } })).toBeNull();
    const row = toFavourite({ id: "3", properties: { Name: { type: "title", title: rt("x") }, Link: { type: "url", url: "javascript:alert(1)" } } });
    expect(row?.link).toBeUndefined();
  });
});

describe("findPreviewImage", () => {
  it("finds og:image and resolves it against the page", () => {
    const html = '<head><meta property="og:image" content="/img/cover.png?a=1&amp;b=2"></head>';
    expect(findPreviewImage(html, "https://example.com/post")).toBe("https://example.com/img/cover.png?a=1&b=2");
  });
});
