import type { Entry } from "./schema";

// Plain shapes the redesigned Currently and Studio pages render. Keeping them separate
// from Entry means the page components don't care whether an item is real or a sample.

export type ScrapKind = "book" | "movie" | "trip" | "movement";

export type Scrap = {
  id: string;
  kind: ScrapKind;
  title: string;
  meta?: string;
  note?: string;
  image?: string;
  alt?: string;
  href?: string;
  sample?: boolean;
};

export type PaperKind = "painting" | "article";

export type PaperItem = {
  id: string;
  kind: PaperKind;
  title: string;
  dek?: string;
  outlet?: string;
  image?: string;
  alt?: string;
  href: string;
  // Articles that live on another site open in a new tab.
  external: boolean;
  sample?: boolean;
};

const scrapKinds: ScrapKind[] = ["book", "movie", "trip", "movement"];

export function toScraps(entries: Entry[]): Scrap[] {
  const scraps: Scrap[] = [];
  for (const e of entries) {
    if (!scrapKinds.includes(e.type as ScrapKind)) continue;
    const base = { id: `${e.section}/${e.slug}`, title: e.title, href: `/${e.section}/${e.slug}` };
    switch (e.type) {
      case "book":
        scraps.push({ ...base, kind: "book", meta: `by ${e.author}`, note: e.quotes[0] ?? e.take, image: e.image, alt: e.alt });
        break;
      case "movie":
        scraps.push({ ...base, kind: "movie", meta: e.director ? `dir. ${e.director}` : undefined, note: e.take, image: e.image, alt: e.alt });
        break;
      case "trip":
        scraps.push({ ...base, kind: "trip", meta: e.place, note: e.take, image: e.image, alt: e.alt });
        break;
      case "movement":
        scraps.push({ ...base, kind: "movement", image: e.image, alt: e.alt });
        break;
    }
  }
  return scraps;
}

export function toPaperItems(entries: Entry[]): PaperItem[] {
  const items: PaperItem[] = [];
  for (const e of entries) {
    if (e.type === "painting") {
      items.push({
        id: `${e.section}/${e.slug}`,
        kind: "painting",
        title: e.title,
        dek: e.caption,
        image: e.image,
        alt: e.alt,
        href: `/${e.section}/${e.slug}`,
        external: false,
      });
    } else if (e.type === "thought") {
      items.push({
        id: `${e.section}/${e.slug}`,
        kind: "article",
        title: e.title,
        dek: e.summary,
        outlet: e.outlet,
        href: e.link ?? `/${e.section}/${e.slug}`,
        external: Boolean(e.link),
      });
    }
  }
  return items;
}

// Used to show only the first page of a long board, with a "show more" button.
export function pageOf<T>(items: T[], visible: number): { shown: T[]; remaining: number } {
  return { shown: items.slice(0, visible), remaining: Math.max(0, items.length - visible) };
}
