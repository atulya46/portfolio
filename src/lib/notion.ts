// Reads the Favourites table from Notion. The integration secret lives only in the NOTION_TOKEN
// environment variable (.env.local locally, Vercel's settings in production), never in the repo.
// Expected columns: Name (title), Type (select), Description (text), Author (text), Link (URL).
// A row's thumbnail is its page cover if it has one, otherwise the link's own preview image.

export const FAVOURITES_DATABASE_ID = "2648d98d2c6f4e48bb5f247d2f8d2259";

export type Favourite = {
  id: string;
  name: string;
  type?: { name: string; color: string };
  description?: string;
  author?: string;
  link?: string;
  thumbnail?: string;
};

type RichText = { plain_text: string }[];
// Only the fields this file reads; Notion sends more.
type NotionProperty = {
  type: string;
  title?: RichText;
  rich_text?: RichText;
  select?: { name: string; color: string } | null;
  multi_select?: { name: string; color: string }[];
  url?: string | null;
};
export type NotionPage = {
  id: string;
  cover?: { type: "external"; external: { url: string } } | { type: "file"; file: { url: string } } | null;
  properties: Record<string, NotionProperty>;
};

// Column names are matched without caring about case, so "author" or "AUTHOR" also work.
function prop(page: NotionPage, name: string) {
  const key = Object.keys(page.properties).find((k) => k.trim().toLowerCase() === name.toLowerCase());
  return key ? page.properties[key] : undefined;
}

function text(p?: NotionProperty) {
  if (!p) return undefined;
  const parts = p.title ?? p.rich_text;
  const value = parts?.map((t) => t.plain_text).join("").trim();
  return value || undefined;
}

// Turns one Notion row into a Favourite, or null for a row with no name (an empty row in the table).
export function toFavourite(page: NotionPage): Favourite | null {
  const nameProp = Object.values(page.properties).find((p) => p.type === "title");
  const name = text(nameProp);
  if (!name) return null;
  const typeProp = prop(page, "Type");
  const type = typeProp?.select ?? typeProp?.multi_select?.[0];
  const linkProp = prop(page, "Link");
  const link = linkProp?.type === "url" ? (linkProp.url ?? undefined) : text(linkProp);
  const cover = page.cover ? (page.cover.type === "external" ? page.cover.external.url : page.cover.file.url) : undefined;
  return {
    id: page.id,
    name,
    type: type ? { name: type.name, color: type.color } : undefined,
    description: text(prop(page, "Description")),
    author: text(prop(page, "Author")),
    link: link && /^https?:\/\//.test(link) ? link : undefined,
    thumbnail: cover,
  };
}

// The og:image a page advertises for link previews, read from the first part of its HTML.
export function findPreviewImage(html: string, pageUrl: string) {
  const tag = html.match(/<meta[^>]+(?:property|name)=["'](?:og:image|twitter:image)["'][^>]*>/i)?.[0];
  const src = tag?.match(/content=["']([^"']+)["']/i)?.[1];
  if (!src) return undefined;
  try {
    return new URL(src.replace(/&amp;/g, "&"), pageUrl).toString();
  } catch {
    return undefined;
  }
}

async function previewImage(url: string) {
  try {
    const res = await fetch(url, {
      headers: { "user-agent": "Mozilla/5.0 (portfolio link preview)" },
      signal: AbortSignal.timeout(4000),
      next: { revalidate: 86400 }, // previews rarely change; look again once a day
    });
    if (!res.ok || !res.headers.get("content-type")?.includes("text/html")) return undefined;
    return findPreviewImage((await res.text()).slice(0, 200_000), url);
  } catch {
    return undefined;
  }
}

const NOTION_VERSION = "2022-06-28";

async function notion(token: string, path: string, body?: unknown) {
  const res = await fetch(`https://api.notion.com/v1/${path}`, {
    method: body ? "POST" : "GET",
    headers: { Authorization: `Bearer ${token}`, "Notion-Version": NOTION_VERSION, "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
    cache: "no-store",
  });
  const data = await res.json().catch(() => ({}));
  return { ok: res.ok, status: res.status, data };
}

// The link may point at the table itself, or at a page with the table inside it. Returns the
// table's id, or throws with Notion's own explanation (usually: not shared with the integration).
async function resolveDatabaseId(token: string, id: string) {
  const db = await notion(token, `databases/${id}`);
  if (db.ok) return id;
  const children = await notion(token, `blocks/${id}/children?page_size=100`);
  const inner = children.ok
    ? (children.data.results as { id: string; type: string }[]).find((b) => b.type === "child_database")
    : undefined;
  if (inner) return inner.id;
  const why = (db.data as { message?: string }).message ?? `status ${db.status}`;
  throw new Error(
    `Notion can't find the Favourites table (${why}). In Notion, open the table, click ••• → Connections and add your integration.`,
  );
}

// Fetches every row, newest first. Returns null when Notion isn't set up yet (no token).
// NOTION_DATABASE_ID can point it at a different table without a code change.
export async function fetchFavourites(): Promise<Favourite[] | null> {
  const token = process.env.NOTION_TOKEN;
  if (!token) return null;
  const databaseId = await resolveDatabaseId(token, process.env.NOTION_DATABASE_ID || FAVOURITES_DATABASE_ID);
  const pages: NotionPage[] = [];
  let cursor: string | undefined;
  do {
    const res = await notion(token, `databases/${databaseId}/query`, {
      page_size: 100,
      start_cursor: cursor,
      sorts: [{ timestamp: "created_time", direction: "descending" }],
    });
    if (!res.ok) throw new Error(`Notion responded ${res.status}: ${(res.data as { message?: string }).message ?? ""}`);
    const data = res.data as { results: NotionPage[]; has_more: boolean; next_cursor: string | null };
    pages.push(...data.results);
    cursor = data.has_more ? (data.next_cursor ?? undefined) : undefined;
  } while (cursor);

  const items = pages.map(toFavourite).filter((f): f is Favourite => f !== null);
  await Promise.all(
    items.map(async (f) => {
      if (!f.thumbnail && f.link) f.thumbnail = await previewImage(f.link);
    }),
  );
  return items;
}
