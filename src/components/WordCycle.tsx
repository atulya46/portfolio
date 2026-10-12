"use client";

import { useEffect, useState } from "react";

// How long each word stays before the next one rises in.
const HOLD_MS = 1000;
const LEAVE_MS = 280;

// Shows its words one after another in the same spot: each rises in, rests, then drifts up and out,
// and the cycle repeats. It waits for the TypedText named `after` to finish typing. Screen readers
// get all the words at once; with reduced motion they simply sit side by side.
export function WordCycle({ words, after }: { words: string[]; after?: string }) {
  // -1 until it starts, so nothing shows while the name is still typing.
  const [index, setIndex] = useState(-1);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let timer: ReturnType<typeof setTimeout>;
    const show = (i: number) => {
      setLeaving(false);
      setIndex(i);
      timer = setTimeout(() => {
        setLeaving(true);
        timer = setTimeout(() => show((i + 1) % words.length), LEAVE_MS);
      }, HOLD_MS);
    };
    const begin = () => (timer = setTimeout(() => show(0), 300));
    if (!after) {
      begin();
      return () => clearTimeout(timer);
    }
    window.addEventListener(`typed:${after}`, begin, { once: true });
    return () => {
      window.removeEventListener(`typed:${after}`, begin);
      clearTimeout(timer);
    };
  }, [words, after]);

  return (
    <>
      <span className="sr-only">{words.join(", ")}</span>
      <span aria-hidden="true" className="hidden motion-reduce:inline">
        {words.join(" \u00b7 ")}
      </span>
      {/* Every word sits invisibly in the same cell, so the line keeps the width of the longest. */}
      <span aria-hidden="true" className="inline-grid justify-items-center motion-reduce:hidden">
        {words.map((w) => (
          <span key={w} className="invisible col-start-1 row-start-1">
            {w}
          </span>
        ))}
        {index >= 0 && (
          <span key={index} className="word-cycle col-start-1 row-start-1" data-leaving={leaving || undefined}>
            {words[index]}
          </span>
        )}
      </span>
    </>
  );
}
