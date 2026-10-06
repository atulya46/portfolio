"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import type { PaperItem } from "@/lib/content/board";

// Studio as a vintage newspaper (after the Canva "newspaper trifold"): crumpled paper,
// brown ink, ruled columns, ornamented headings, sepia photographs. Hovering a story shows
// what a click does: paintings open full-size, articles open where they were published.

function Ornament() {
  return (
    <span className="gz-ornament" aria-hidden="true">
      <i />
      <b>&#9670;</b>
      <i />
    </span>
  );
}

function Cue({ children }: { children: React.ReactNode }) {
  return <span className="gz-cue label">{children}</span>;
}

export function StudioPaper({ items, issue }: { items: PaperItem[]; issue: string }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState<PaperItem | null>(null);

  function show(item: PaperItem) {
    setOpen(item);
    dialogRef.current?.showModal();
  }

  const story = (item: PaperItem, i: number) => {
    const delay = { animationDelay: `${(i % 8) * 90}ms` };
    const head = (
      <>
        <span className="gz-kicker label">
          {item.kind === "painting" ? "Fine Art" : (item.outlet ?? "Essay")}
          {item.sample ? " · sample" : ""}
        </span>
        <Ornament />
        <span className="display gz-headline">{item.title}</span>
      </>
    );

    if (item.kind === "painting") {
      return (
        <article key={item.id} className="gz-story" style={delay}>
          <button type="button" className="gz-link" onClick={() => show(item)} aria-label={`View ${item.title}`}>
            {head}
            {item.image && (
              <span className="gz-photo">
                <Image
                  src={item.image}
                  alt={item.alt ?? item.title}
                  width={600}
                  height={800}
                  priority={i < 2}
                  sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 30vw"
                />
                <Cue>View &#8599;</Cue>
              </span>
            )}
            {item.dek && <span className="gz-caption">Fig. {i + 1} &mdash; {item.dek}</span>}
          </button>
        </article>
      );
    }

    const body = (
      <>
        {head}
        {item.dek && <span className="gz-text">{item.dek}</span>}
        <Cue>{item.external ? `Read on ${item.outlet ?? "the web"} ↗` : "Read →"}</Cue>
      </>
    );
    return (
      <article key={item.id} className="gz-story" style={delay}>
        {item.external ? (
          <a href={item.href} target="_blank" rel="noopener noreferrer" className="gz-link">
            {body}
          </a>
        ) : (
          <Link href={item.href} className="gz-link">
            {body}
          </Link>
        )}
      </article>
    );
  };

  return (
    <>
      <div className="gazette">
        <header className="gz-masthead">
          <p className="label gz-dateline">
            <span>Vol. I</span>
            <span>{issue}</span>
            <span>Price: one honest look</span>
          </p>
          <h2 className="display gz-title">The Studio</h2>
          <Ornament />
          <p className="gz-motto">Paintings, and the opinions I paint over</p>
        </header>
        <div className="gz-cols">{items.map(story)}</div>
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
