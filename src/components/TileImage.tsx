"use client";

import Image from "next/image";
import { useState } from "react";

// A Studio tile's picture. Local files go through Next's image optimiser; an outside URL (a book
// cover from Open Library) loads straight from there, and if it can't be found the tile falls back
// to showing the title instead of a broken image.
export function TileImage({ src, alt, fallback }: { src: string; alt: string; fallback: string }) {
  const [failed, setFailed] = useState(false);
  const remote = src.startsWith("https://");
  if (failed) {
    return <div className="grid size-full place-items-center p-4 text-center text-sm text-muted">{fallback}</div>;
  }
  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes="(min-width: 768px) 20rem, 90vw"
      unoptimized={remote}
      draggable={false}
      onError={() => setFailed(true)}
      className="object-cover transition-transform duration-500 group-hover:scale-105"
    />
  );
}
