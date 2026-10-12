import { fetchFavourites } from "@/lib/notion";

// The homepage asks this route for the Favourites table each time it loads. The answer is cached
// for a minute, so the site stays quick and Notion's rate limit is never hit; edits in Notion
// show up within that minute.
export const revalidate = 60;

export async function GET() {
  try {
    const items = await fetchFavourites();
    return Response.json({ configured: items !== null, items: items ?? [] });
  } catch (error) {
    console.error("Favourites: could not read Notion", error);
    return Response.json({ configured: true, items: [], error: true }, { status: 502 });
  }
}
