"use client";

import { useEffect, useState } from "react";
import type { Favourite } from "@/lib/notion";

type State = { status: "loading" } | { status: "ready"; items: Favourite[] } | { status: "off" } | { status: "error" };

const tagStyle = (color = "default") => ({
  backgroundColor: `color-mix(in srgb, var(--tag-${color}, var(--tag-default)) 22%, transparent)`,
});

function TypeTag({ type }: { type?: Favourite["type"] }) {
  if (!type) return null;
  return (
    <span className="inline-block whitespace-nowrap rounded-md px-2 py-0.5 text-[12.5px]" style={tagStyle(type.color)}>
      {type.name}
    </span>
  );
}

function host(url: string) {
  return new URL(url).hostname.replace(/^www\./, "");
}

function LinkCell({ item }: { item: Favourite }) {
  if (!item.link) return null;
  return (
    <a href={item.link} target="_blank" rel="noopener noreferrer" className="group flex min-w-0 items-center gap-3">
      <span className="h-9 w-14 shrink-0 overflow-hidden rounded-md border border-foreground/10 bg-surface">
        {item.thumbnail && (
          // Thumbnails come from many sites, so a plain img (no Next image config per domain).
          // eslint-disable-next-line @next/next/no-img-element
          <img src={item.thumbnail} alt="" loading="lazy" className="size-full object-cover" />
        )}
      </span>
      <span className="truncate text-sm underline decoration-accent/50 underline-offset-[3px] transition-colors group-hover:text-accent">
        {host(item.link)}
      </span>
    </a>
  );
}

// The Favourites list, read live from Notion and laid out like the Notion table: Name, Type,
// Description, Author and Link (with a thumbnail). Pills above it filter by type. On narrow screens
// each row becomes a small card.
export function FavouritesTable() {
  const [state, setState] = useState<State>({ status: "loading" });
  const [filter, setFilter] = useState<string | null>(null);

  useEffect(() => {
    let live = true;
    fetch("/api/favourites")
      .then((r) => r.json())
      .then((d: { configured: boolean; items: Favourite[]; error?: boolean }) => {
        if (!live) return;
        setState(d.error ? { status: "error" } : d.configured ? { status: "ready", items: d.items } : { status: "off" });
      })
      .catch(() => live && setState({ status: "error" }));
    return () => {
      live = false;
    };
  }, []);

  if (state.status === "loading") {
    return (
      <div aria-busy="true" className="flex flex-col gap-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-12 animate-pulse rounded-lg bg-surface" />
        ))}
      </div>
    );
  }
  if (state.status !== "ready" || state.items.length === 0) {
    return (
      <p className="text-muted">
        {state.status === "error" ? "Couldn't reach the list right now. Try again in a bit." : "Nothing here yet."}
      </p>
    );
  }

  const types = [...new Map(state.items.flatMap((i) => (i.type ? [[i.type.name, i.type] as const] : []))).values()];
  const items = filter ? state.items.filter((i) => i.type?.name === filter) : state.items;
  const pill = "shrink-0 rounded-full border px-3 py-1 text-[13px] transition-colors duration-150 active:scale-95";
  const on = "border-accent bg-accent text-background";
  const off = "border-accent/40 hover:border-accent";

  return (
    <div className="flex flex-col gap-3">
      {types.length > 1 && (
        <div className="no-scrollbar flex gap-2 overflow-x-auto py-1" role="group" aria-label="Filter by type">
          <button type="button" className={`${pill} ${filter === null ? on : off}`} aria-pressed={filter === null} onClick={() => setFilter(null)}>
            All
          </button>
          {types.map((t) => (
            <button
              key={t.name}
              type="button"
              className={`${pill} ${filter === t.name ? on : off}`}
              aria-pressed={filter === t.name}
              onClick={() => setFilter(t.name)}
            >
              {t.name}
            </button>
          ))}
        </div>
      )}

      {/* Wide screens: the table */}
      <table className="hidden w-full border-collapse md:table">
        <thead>
          <tr className="border-b border-foreground/12 text-left text-[13px] text-muted">
            <th className="w-[24%] px-3 py-2 font-normal"><span className="mr-1.5 font-mono text-xs opacity-70">Aa</span>Name</th>
            <th className="w-[12%] px-3 py-2 font-normal"><span className="mr-1.5 opacity-70">&#9673;</span>Type</th>
            <th className="px-3 py-2 font-normal"><span className="mr-1.5 opacity-70">&#8801;</span>Description</th>
            <th className="w-[15%] px-3 py-2 font-normal"><span className="mr-1.5 opacity-70">@</span>Author</th>
            <th className="w-[20%] px-3 py-2 font-normal"><span className="mr-1.5 opacity-70">&#8599;</span>Link</th>
          </tr>
        </thead>
        <tbody>
          {items.map((i) => (
            <tr key={i.id} className="border-b border-foreground/8 align-middle text-sm">
              <td className="px-3 py-2.5 font-medium">{i.name}</td>
              <td className="px-3 py-2.5"><TypeTag type={i.type} /></td>
              <td className="px-3 py-2.5 text-muted">{i.description}</td>
              <td className="px-3 py-2.5">{i.author}</td>
              <td className="max-w-0 px-3 py-2.5"><LinkCell item={i} /></td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Phones: one card per row */}
      <ul className="flex flex-col gap-3 md:hidden">
        {items.map((i) => (
          <li key={i.id} className="flex flex-col gap-2 rounded-xl border border-foreground/10 p-4">
            <div className="flex items-start justify-between gap-3">
              <span className="font-medium">{i.name}</span>
              <TypeTag type={i.type} />
            </div>
            {i.description && <p className="text-sm text-muted">{i.description}</p>}
            {i.author && <p className="text-sm">{i.author}</p>}
            <LinkCell item={i} />
          </li>
        ))}
      </ul>
    </div>
  );
}
