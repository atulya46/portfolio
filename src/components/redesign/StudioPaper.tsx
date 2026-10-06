"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import type { PaperItem } from "@/lib/content/board";

// The Studio page as a newspaper: ruled columns, headlines, grey "newsprint" pictures that
// turn to colour on hover. Hovering anything shows what a click will do: paintings open
// full-size in a viewer, articles open where they were published, in a new tab.

function Cue({ children }: { children: React.ReactNode }) {
  return <span className="paper-cue label">{children}</span>;
}

function Picture({ item, priority }: { item: PaperItem; priority?: boolean }) {
  if (!item.image) return null;
  return (
    <Image
      src={item.image}
      alt={item.alt ?? item.title}
      width={600}
      height={800}
      priority={priority}
      sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 30vw"
      className="paper-img"
    />
  );
}

export function StudioPaper({ items }: { items: PaperItem[] }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState<PaperItem | null>(null);

  function show(item: PaperItem) {
    setOpen(item);
    dialogRef.current?.showModal();
  }

  return (
    <>
      <div className="paper-cols">
        {items.map((item, i) => (
          <article key={item.id} className="paper-item" style={{ animationDelay: `${(i % 6) * 70}ms` }}>
            {item.kind === "painting" ? (
              <button type="button" className="paper-link" onClick={() => show(item)} aria-label={`View ${item.title}`}>
                <span className="paper-frame">
                  <Picture item={item} priority={i < 2} />
                  <Cue>View &#8599;</Cue>
                </span>
                <span className="label paper-kicker">Painting{item.sample ? " · sample" : ""}</span>
                <span className="display paper-headline">{item.title}</span>
                {item.dek && <span className="paper-dek">{item.dek}</span>}
              </button>
            ) : item.external ? (
              <a href={item.href} target="_blank" rel="noopener noreferrer" className="paper-link">
                <span className="label paper-kicker">
                  {item.outlet ?? "Article"}
                  {item.sample ? " · sample" : ""}
                </span>
                <span className="display paper-headline paper-headline-lg">{item.title}</span>
                {item.dek && <span className="paper-dek">{item.dek}</span>}
                <Cue>Read on {item.outlet ?? "the web"} &#8599;</Cue>
              </a>
            ) : (
              <Link href={item.href} className="paper-link">
                <span className="label paper-kicker">Thought</span>
                <span className="display paper-headline paper-headline-lg">{item.title}</span>
                {item.dek && <span className="paper-dek">{item.dek}</span>}
                <Cue>Read &rarr;</Cue>
              </Link>
            )}
          </article>
        ))}
      </div>

      {/* Painting viewer. A native <dialog> gives focus handling and Esc-to-close for free. */}
      <dialog
        ref={dialogRef}
        className="paper-dialog"
        onClose={() => setOpen(null)}
        onClick={(e) => {
          if (e.target === dialogRef.current) dialogRef.current?.close();
        }}
      >
        {open?.image && (
          <figure className="flex max-h-[88vh] flex-col items-center gap-3">
            <Image
              src={open.image}
              alt={open.alt ?? open.title}
              width={1200}
              height={1600}
              loading="eager"
              className="h-auto max-h-[78vh] w-auto max-w-full"
            />
            <figcaption className="display text-2xl text-paper">{open.title}</figcaption>
          </figure>
        )}
        <button type="button" className="btn label paper-close" onClick={() => dialogRef.current?.close()}>
          Close &#10005;
        </button>
      </dialog>
    </>
  );
}
